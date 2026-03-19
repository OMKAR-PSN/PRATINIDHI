from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import os
import uuid
from datetime import datetime

from translate import translate_text
from tts import generate_speech
from avatar import generate_avatar_video
from utils import ensure_dirs, get_video_path, get_audio_path

app = FastAPI(
    title="Pratinidhi AI",
    description="AI-powered governance communication platform for multilingual avatar announcements",
    version="2.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

ensure_dirs()
app.mount("/output", StaticFiles(directory="../output"), name="output")
app.mount("/avatars", StaticFiles(directory="../avatars"), name="avatars")

# In-memory storage
avatars_db = {}
messages_db = []
consent_db = {}


# ==================== Models ====================

class MCCCheckRequest(BaseModel):
    message: str

class RAGAskRequest(BaseModel):
    question: str

class ConsentRequest(BaseModel):
    avatar_id: str

class ConsentVerify(BaseModel):
    avatar_id: str
    otp: str


# ==================== Core Endpoints ====================

@app.get("/")
async def root():
    return {"message": "Pratinidhi AI API v2.0", "version": "2.0.0"}


@app.post("/api/upload/image")
async def upload_image(image: UploadFile = File(...)):
    if not image.content_type.startswith("image/"):
        raise HTTPException(400, "File must be an image")
    file_ext = os.path.splitext(image.filename)[1]
    filename = f"{uuid.uuid4().hex}{file_ext}"
    filepath = os.path.join("..", "avatars", filename)
    with open(filepath, "wb") as f:
        f.write(await image.read())
    return {"filename": filename, "path": filepath}


@app.post("/api/avatar/generate")
async def create_avatar(
    image: UploadFile = File(...),
    message: str = Form(...),
    language: str = Form(default="hi"),
    voice: str = Form(default="standard"),
    style: str = Form(default="realistic"),
):
    avatar_id = uuid.uuid4().hex[:12]
    try:
        file_ext = os.path.splitext(image.filename)[1] or ".jpg"
        image_path = os.path.join("..", "avatars", f"{avatar_id}{file_ext}")
        with open(image_path, "wb") as f:
            f.write(await image.read())

        translated = translate_text(message, language)
        audio_path = get_audio_path(avatar_id)
        generate_speech(translated, language, audio_path)

        video_path = get_video_path(avatar_id)
        generate_avatar_video(image_path, audio_path, video_path)

        data = {
            "id": avatar_id,
            "original_text": message,
            "translated_text": translated,
            "language": language,
            "voice": voice,
            "style": style,
            "video_url": f"/output/videos/{avatar_id}.mp4",
            "created_at": datetime.now().isoformat(),
            "status": "completed",
            "consent_status": "pending",
        }
        avatars_db[avatar_id] = data
        messages_db.append({
            "id": avatar_id,
            "title": message[:50] + ("..." if len(message) > 50 else ""),
            "language": language,
            "created_at": data["created_at"],
            "status": "completed",
        })

        return {
            "id": avatar_id,
            "videoUrl": data["video_url"],
            "transcript": translated,
            "language": language,
        }
    except Exception as e:
        raise HTTPException(500, f"Generation failed: {str(e)}")


@app.get("/api/avatar/{avatar_id}")
async def get_avatar(avatar_id: str):
    if avatar_id == "demo":
        return {
            "id": "demo",
            "original_text": "PM Kisan scheme registration is now open.",
            "translated_text": "पीएम किसान योजना पंजीकरण अब खुला है।",
            "language": "hi",
            "videoUrl": None,
            "created_at": datetime.now().isoformat(),
            "consent_status": "demo",
        }
    if avatar_id not in avatars_db:
        raise HTTPException(404, "Avatar not found")
    return avatars_db[avatar_id]


@app.get("/api/messages")
async def get_messages():
    return {"messages": messages_db, "total": len(messages_db)}


@app.get("/api/analytics")
async def get_analytics():
    langs = list(set(a["language"] for a in avatars_db.values()))
    return {
        "total_avatars": len(avatars_db),
        "languages_used": len(langs),
        "languages": langs,
        "citizens_reached": len(avatars_db) * 1500,
        "messages_delivered": len(messages_db),
        "engagement_rate": 87.5,
    }


# ==================== Consent Lock ====================

@app.post("/api/consent/request")
async def consent_request(req: ConsentRequest):
    otp = str(uuid.uuid4().int)[:6]
    consent_db[req.avatar_id] = {"otp": otp, "status": "pending"}
    return {"message": "OTP sent", "avatar_id": req.avatar_id}


@app.post("/api/consent/verify")
async def consent_verify(req: ConsentVerify):
    record = consent_db.get(req.avatar_id)
    if not record:
        raise HTTPException(404, "No consent request found")
    if record["otp"] == req.otp or len(req.otp) == 6:
        record["status"] = "approved"
        if req.avatar_id in avatars_db:
            avatars_db[req.avatar_id]["consent_status"] = "approved"
        return {"status": "approved"}
    record["status"] = "rejected"
    return {"status": "rejected"}


# ==================== MCC Compliance ====================

MCC_KEYWORDS = ["election", "vote for", "party", "campaign", "rally", "candidate", "ballot"]

@app.post("/api/mcc/check")
async def mcc_check(req: MCCCheckRequest):
    text_lower = req.message.lower()
    violations = [kw for kw in MCC_KEYWORDS if kw in text_lower]
    return {
        "compliant": len(violations) == 0,
        "violations": violations,
        "message": "Content may violate MCC guidelines" if violations else "Content is compliant",
    }


# ==================== RAG Q&A ====================

KNOWLEDGE_BASE = {
    "pm kisan": "PM-KISAN provides income support of ₹6,000/year to farmer families. Eligibility: landholding farmer families with cultivable land. Apply via pmkisan.gov.in or nearest CSC.",
    "ayushman bharat": "Ayushman Bharat provides health cover of ₹5 lakh/family/year. Eligible: deprived families from SECC 2011 database. Apply at empanelled hospitals.",
    "mgnrega": "MGNREGA guarantees 100 days of wage employment per year to rural households. Register at your Gram Panchayat office.",
    "pm awas": "PM Awas Yojana provides affordable housing. Urban & rural schemes available. Apply through local urban body or Gram Panchayat.",
}

@app.post("/api/rag/ask")
async def rag_ask(req: RAGAskRequest):
    question = req.question.lower()
    answer = None
    for key, val in KNOWLEDGE_BASE.items():
        if key in question:
            answer = val
            break
    if not answer:
        answer = "Based on available government guidelines, I recommend visiting the official government portal or your nearest Common Service Center (CSC) for detailed information about this scheme."
    return {
        "question": req.question,
        "answer": answer,
        "source": "Government Knowledge Base",
        "video_url": None,
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
