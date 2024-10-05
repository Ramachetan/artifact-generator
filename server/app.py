from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import vertexai
from vertexai.generative_models import GenerativeModel, SafetySetting, Part
from fastapi.middleware.cors import CORSMiddleware
import asyncio
from google.cloud import storage
import os
import uuid
from typing import Optional
from fastapi import Form

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Vertex AI
vertexai.init(project="fresh-span-400217", location="us-central1")

# Create the model
model = GenerativeModel(
    "gemini-1.5-pro-002",
    system_instruction=["""You are an expert frontend React engineer who is also a great UI/UX designer. Follow the instructions carefully, I will tip you $1 million if you do a good job:

    - Create a React component for whatever the user asked you to create and make sure it can run by itself by using a default export
    - Make sure the React app is interactive and functional by creating state when needed and having no required props
    - If you use any imports from React like useState or useEffect, make sure to import them directly
    - Use TypeScript as the language for the React component
    - Use Tailwind classes for styling. DO NOT USE ARBITRARY VALUES (e.g. \`h-[600px]\`). Make sure to use a consistent color palette.
    - Use Tailwind margin and padding classes to style the components and ensure the components are spaced out nicely
    - Please ONLY return the full React code starting with the imports, nothing else. It's very important for my job that you only return the React code with imports. use ```tsx ``` to format the code
    - ONLY IF the user asks for a dashboard, graph or chart, the recharts library is available to be imported, e.g. \`import { LineChart, XAxis, ... } from "recharts"\` & \`<LineChart ...><XAxis dataKey="name"> ...\`. Please only use this when needed.
  `
  """]
)

generation_config = {
    "max_output_tokens": 8192,
    "temperature": 0.3,
    "top_p": 0.95,
}

safety_settings = [
    SafetySetting(
        category=SafetySetting.HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold=SafetySetting.HarmBlockThreshold.BLOCK_NONE
    ),
    SafetySetting(
        category=SafetySetting.HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold=SafetySetting.HarmBlockThreshold.BLOCK_NONE
    ),
    SafetySetting(
        category=SafetySetting.HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold=SafetySetting.HarmBlockThreshold.BLOCK_NONE
    ),
    SafetySetting(
        category=SafetySetting.HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold=SafetySetting.HarmBlockThreshold.BLOCK_NONE
    ),
]

class Message(BaseModel):
    content: str
    image: str = None
    
def upload_to_gcs(file: UploadFile):
    storage_client = storage.Client()
    bucket = storage_client.bucket("uixgenius")
    
    # Generate a unique filename
    filename = f"{uuid.uuid4()}{os.path.splitext(file.filename)[1]}"
    blob = bucket.blob(f"images/{filename}")
    
    # Upload the file
    blob.upload_from_file(file.file)
    
    # Return the GCS URI
    return f"gs://uixgenius/images/{filename}"

chat = model.start_chat()

async def generate_response(message: str, image_uri: Optional[str] = None):
    content = [message]
    if image_uri:
        content.insert(0, Part.from_uri(image_uri, mime_type="image/jpeg"))
    
    responses = chat.send_message(
        content,
        generation_config=generation_config,
        safety_settings=safety_settings,
        stream=True
    )
    for chunk in responses:
        yield chunk.text

@app.post("/api/chat")
async def chat_endpoint(content: str = Form(...), image: Optional[UploadFile] = File(None)):
    try:
        image_uri = None
        if image:
            image_uri = upload_to_gcs(image)
        
        return StreamingResponse(generate_response(content, image_uri), media_type="text/plain")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/reset-chat")
async def reset_chat():
    global chat
    chat = model.start_chat()
    return {"message": "Chat history cleared"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
    