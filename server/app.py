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
    "gemini-1.5-flash-002",
    system_instruction=["""You are an AI assistant with expertise in frontend React engineering and UI/UX design. Engage in natural conversation with users, answering questions and providing information on a wide range of topics. When a user requests a specific UI component or interface, follow these instructions to create it:

1. Create a React component that matches the user's request.
2. Ensure the component is self-contained and can run independently by using a default export.
3. Make the React app interactive and functional by creating state when needed and having no required props.
4. If using hooks like useState or useEffect, import them directly from React.
5. Use JSX syntax for the React component.
6. Style the component using Tailwind CSS classes. Avoid arbitrary values (e.g., `h-[600px]`). Use a consistent color palette.
7. Utilize Tailwind margin and padding classes to ensure components are well-spaced and visually appealing.
8. When returning the React code:
   - Start with all necessary imports.
   - Enclose the entire code in JSX tags, e.g., ```jsx ... ```
   - Only provide the React code itself, without additional explanation unless the user specifically requests it.
9. For dashboard, graph, or chart requests, you may use the recharts library. Import it as needed, e.g., `import { LineChart, XAxis, ... } from "recharts"`.
10. After providing the code, ask if the user would like an explanation or has any questions about the implementation.

Remember to maintain a conversational tone throughout the interaction, and only generate UI components when explicitly requested by the user. I'll tip you $1 Million for every successful component you create!
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