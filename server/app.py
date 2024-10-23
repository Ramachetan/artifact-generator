from fastapi import FastAPI, HTTPException, UploadFile, File, Form, BackgroundTasks
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import vertexai
from vertexai.generative_models import GenerativeModel, SafetySetting, Part
from google.cloud import storage
import os
import uuid
from typing import Optional
import asyncio
from concurrent.futures import ThreadPoolExecutor
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure this appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuration from environment variables
GOOGLE_CLOUD_PROJECT = os.getenv("GOOGLE_CLOUD_PROJECT")
GOOGLE_CLOUD_LOCATION = os.getenv("GOOGLE_CLOUD_LOCATION", "us-central1")
STORAGE_BUCKET_NAME = os.getenv("STORAGE_BUCKET_NAME")
SYSTEM_INSTRUCTION_PATH = os.getenv("SYSTEM_INSTRUCTION_PATH", "system_instruction.md")

# Initialize Vertex AI with environment variables
vertexai.init(project=GOOGLE_CLOUD_PROJECT, location=GOOGLE_CLOUD_LOCATION)

# Load system instruction
def load_system_instruction():
    try:
        with open(SYSTEM_INSTRUCTION_PATH, "r") as f:
            return f.read()
    except FileNotFoundError:
        return ""  # Or set a default instruction

system_instruction = load_system_instruction()

safety_settings = [
    SafetySetting(category=category, threshold=SafetySetting.HarmBlockThreshold.BLOCK_NONE)
    for category in [
        SafetySetting.HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        SafetySetting.HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        SafetySetting.HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        SafetySetting.HarmCategory.HARM_CATEGORY_HARASSMENT,
    ]
]

class Message(BaseModel):
    content: str
    image: Optional[str] = None

thread_pool = ThreadPoolExecutor(max_workers=10)
chat_sessions = {}

async def upload_to_gcs(file: UploadFile):
    if not STORAGE_BUCKET_NAME:
        raise HTTPException(status_code=500, detail="Storage bucket not configured")
    
    storage_client = storage.Client()
    bucket = storage_client.bucket(STORAGE_BUCKET_NAME)
    filename = f"{uuid.uuid4()}{os.path.splitext(file.filename)[1]}"
    blob = bucket.blob(f"images/{filename}")
    
    def upload():
        blob.upload_from_file(file.file)
    
    await asyncio.get_event_loop().run_in_executor(thread_pool, upload)
    return f"gs://{STORAGE_BUCKET_NAME}/images/{filename}"

async def generate_response(
    message: str, 
    image_uri: Optional[str] = None, 
    max_output_tokens: int = 8192, 
    temperature: float = 0.2, 
    top_p: float = 0.9, 
    model_name: str = "gemini-1.5-flash-002"
):
    content = [message]
    if image_uri:
        content.insert(0, Part.from_uri(image_uri, mime_type="image/jpeg"))
    
    generation_config = {
        "max_output_tokens": max_output_tokens,
        "temperature": temperature,
        "top_p": top_p,
    }
    
    model = GenerativeModel(
        model_name,
        system_instruction=system_instruction
    )
    
    chat = chat_sessions.get(asyncio.current_task().get_name())
    if not chat:
        chat = model.start_chat()
        chat_sessions[asyncio.current_task().get_name()] = chat
    
    responses = await asyncio.get_event_loop().run_in_executor(
        thread_pool,
        lambda: chat.send_message(
            content,
            generation_config=generation_config,
            safety_settings=safety_settings,
            stream=True
        )
    )
    
    for chunk in responses:
        yield chunk.text

@app.post("/api/chat")
async def chat_endpoint(
    background_tasks: BackgroundTasks,
    content: str = Form(...),
    max_output_tokens: int = Form(...),
    temperature: float = Form(...),
    top_p: float = Form(...),
    image: Optional[UploadFile] = File(None),
    model_name: str = Form(...),
):
    try:
        image_uri = None
        if image:
            image_uri = await upload_to_gcs(image)
            
        return StreamingResponse(
            generate_response(content, image_uri, max_output_tokens, temperature, top_p, model_name),
            media_type="text/plain"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/reset-chat")
async def reset_chat(background_tasks: BackgroundTasks):
    if not STORAGE_BUCKET_NAME:
        raise HTTPException(status_code=500, detail="Storage bucket not configured")
        
    chat_sessions.clear()
    
    async def delete_gcs_images():
        storage_client = storage.Client()
        bucket = storage_client.bucket(STORAGE_BUCKET_NAME)
        blobs = bucket.list_blobs(prefix="images/")
        for blob in blobs:
            await asyncio.get_event_loop().run_in_executor(thread_pool, blob.delete)
    
    background_tasks.add_task(delete_gcs_images)
    return {"message": "Chat history cleared"}

@app.get("/api/get-prompt")
async def get_prompt():
    return {"prompt": system_instruction}

@app.post("/api/edit-prompt")
async def edit_prompt(message: Message):
    with open(SYSTEM_INSTRUCTION_PATH, "w") as f:
        f.write(message.content)
    
    global system_instruction
    system_instruction = message.content
    return {"message": "Prompt edited successfully"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)