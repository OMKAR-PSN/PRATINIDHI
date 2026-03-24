"""
main.py — FastAPI Application with All Endpoints
भारत Avatar Platform — India Innovates 2026
"""

import os
import uuid
import hashlib
import random
import aiohttp
import aiofiles
from pathlib import Path
from dotenv import load_dotenv, dotenv_values
from fastapi import FastAPI, Form, BackgroundTasks, HTTPException, Depends
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from avatars import get_avatar, get_all_avatars, AVATARS
from models import init_db, get_db, AvatarSession, QASession, ConsentLog, BroadcastMessage
from mcc_filter import check_mcc_compliance
from tts import text_to_audio, _async_text_to_audio
from rag import answer_question

# PRATINIDHI Routes
from routes import auth, receivers, messages

load_dotenv()

# Initialize FastAPI app
app = FastAPI(
    title="भारत Avatar Platform API",
    description="AI-powered governance avatar system for India Innovates 2026",
    version="1.0.0",
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3000",
        "https://*.vercel.app",
    ],
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ensure directories exist
os.makedirs("outputs", exist_ok=True)
os.makedirs("uploads", exist_ok=True)
os.makedirs("avatar_photos", exist_ok=True)

# Mount static files
app.mount("/static", StaticFiles(directory="outputs"), name="static")
app.mount("/photos", StaticFiles(directory="avatar_photos"), name="photos")


@app.on_event("startup")
def startup_event():
    """Initialize database on startup."""
    init_db()

# Include PRATINIDHI Routers
app.include_router(auth.router, prefix="/api")
app.include_router(receivers.router, prefix="/api")
app.include_router(messages.router, prefix="/api")

# ─────────────────────────────────────────────
# BHASHINI TRANSLATION ENDPOINT
# ─────────────────────────────────────────────

from pydantic import BaseModel as PydanticBaseModel
from translate import translate_text, get_supported_languages

class TranslateRequest(PydanticBaseModel):
    text: str
    source_lang: str = "en"
    target_lang: str = "hi"

@app.post("/translate")
def translate_endpoint(req: TranslateRequest):
    """Translate text between languages using Bhashini NMT."""
    try:
        translated = translate_text(req.text, req.source_lang, req.target_lang)
        return {
            "translated_text": translated,
            "source_lang": req.source_lang,
            "target_lang": req.target_lang,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Translation failed: {str(e)}")

@app.get("/translate/languages")
def list_languages():
    """List all supported language codes and names."""
    return {"languages": get_supported_languages()}


# ─────────────────────────────────────────────
# AVATAR ENDPOINTS
# ─────────────────────────────────────────────

@app.get("/avatars")
def list_avatars():
    """List all 4 avatars with safe fields only (no paths/prompts)."""
    avatars = get_all_avatars()
    safe_avatars = []
    for av in avatars:
        safe_avatars.append({
            "id": av["id"],
            "name": av["name"],
            "title": av["title"],
            "region": av["region"],
            "language": av["language"],
            "lang_label": av["lang_label"],
            "gender": av["gender"],
            "emoji": av["emoji"],
            "color": av["color"],
            "bg_color": av["bg_color"],
            "greeting": av["greeting"],
            "topics": av["topics"],
            "persona": av["persona"],
        })
    return {"avatars": safe_avatars}


@app.get("/avatars/{avatar_id}")
def get_single_avatar(avatar_id: str):
    """Get a single avatar's configuration."""
    avatar = get_avatar(avatar_id)
    if not avatar:
        raise HTTPException(status_code=404, detail=f"Avatar '{avatar_id}' not found")
    return {
        "id": avatar["id"],
        "name": avatar["name"],
        "title": avatar["title"],
        "region": avatar["region"],
        "language": avatar["language"],
        "lang_label": avatar["lang_label"],
        "gender": avatar["gender"],
        "emoji": avatar["emoji"],
        "color": avatar["color"],
        "bg_color": avatar["bg_color"],
        "greeting": avatar["greeting"],
        "topics": avatar["topics"],
        "persona": avatar["persona"],
    }


# ─────────────────────────────────────────────
# CONSENT / OTP ENDPOINTS
# ─────────────────────────────────────────────

@app.post("/request-consent")
def request_consent(phone: str = Form(...), db: Session = Depends(get_db)):
    """Generate OTP for phone-based consent verification."""
    # Generate a 6-digit OTP
    otp = str(random.randint(100000, 999999))
    consent_id = str(uuid.uuid4())

    consent = ConsentLog(
        id=consent_id,
        phone=phone,
        otp=otp,
        verified=False,
    )
    db.add(consent)
    db.commit()

    return {
        "consent_id": consent_id,
        "demo_otp": otp,  # In production, send via SMS
        "message": "OTP sent to your phone (demo mode: OTP shown directly)",
    }


@app.post("/verify-consent")
def verify_consent(
    consent_id: str = Form(...),
    otp: str = Form(...),
    db: Session = Depends(get_db),
):
    """Verify OTP for consent."""
    consent = db.query(ConsentLog).filter(ConsentLog.id == consent_id).first()
    if not consent:
        raise HTTPException(status_code=404, detail="Consent request not found")

    if consent.otp != otp:
        raise HTTPException(status_code=400, detail="Invalid OTP")

    consent.verified = True
    db.commit()

    return {"verified": True, "message": "Consent verified successfully ✓"}


# ─────────────────────────────────────────────
# VIDEO GENERATION ENDPOINTS
# ─────────────────────────────────────────────

async def _call_colab(session_id: str, avatar_id: str, text: str, db_session_maker):
    """
    Background task: call the Colab Wav2Lip API to generate avatar video.
    """
    colab_url = dotenv_values(".env").get("COLAB_URL", "")
    avatar = get_avatar(avatar_id)
    if not avatar:
        print(f"[VIDEO] ❌ Avatar '{avatar_id}' not found for session {session_id}")
        return

    db = db_session_maker()
    try:
        session = db.query(AvatarSession).filter(AvatarSession.id == session_id).first()
        if not session:
            return

        session.status = "processing"
        db.commit()

        if not colab_url or 'your-ngrok-url' in colab_url or 'YOUR_' in colab_url:
            # No Colab URL configured or still placeholder
            print(f"[VIDEO] ❌ COLAB_URL is not configured! Current value: '{colab_url}'")
            print(f"[VIDEO]    → Run colab_notebook.ipynb in Google Colab and paste the tunnel URL in .env")
            session.status = "failed"
            db.commit()
            return

        # Prepare multipart data for Colab API
        photo_path = avatar["photo_path"]

        try:
            async with aiohttp.ClientSession() as http_session:
                data = aiohttp.FormData()

                # Add photo if it exists
                if os.path.exists(photo_path):
                    data.add_field(
                        "photo",
                        open(photo_path, "rb"),
                        filename=os.path.basename(photo_path),
                    )

                data.add_field("text", text)
                data.add_field("lang", avatar["language"])
                data.add_field("gender", avatar["gender"])

                async with http_session.post(
                    f"{colab_url}/generate",
                    data=data,
                    timeout=aiohttp.ClientTimeout(total=120),
                ) as response:
                    if response.status == 200:
                        video_data = await response.read()
                        output_path = f"outputs/{session_id}.mp4"

                        async with aiofiles.open(output_path, "wb") as f:
                            await f.write(video_data)

                        # Compute SHA-256 hash
                        content_hash = hashlib.sha256(video_data).hexdigest()

                        session.video_path = output_path
                        session.content_hash = content_hash
                        session.status = "done"
                        db.commit()
                    else:
                        session.status = "failed"
                        db.commit()

        except Exception as e:
            print(f"[VIDEO] ❌ Colab call failed for session {session_id}: {e}")
            print(f"[VIDEO]    → Make sure the Colab notebook is running and COLAB_URL is correct in .env")
            session.status = "failed"
            db.commit()

    finally:
        db.close()


@app.post("/generate/{avatar_id}")
async def generate_video(
    avatar_id: str,
    background_tasks: BackgroundTasks,
    text: str = Form(...),
    db: Session = Depends(get_db),
):
    """Start async avatar video generation."""
    avatar = get_avatar(avatar_id)
    if not avatar:
        raise HTTPException(status_code=404, detail=f"Avatar '{avatar_id}' not found")

    # MCC compliance check BEFORE creating session
    mcc_result = check_mcc_compliance(text)
    if not mcc_result["compliant"]:
        raise HTTPException(
            status_code=400,
            detail={
                "error": "MCC_VIOLATION",
                "violations": mcc_result["violations"],
                "reason": mcc_result["reason"],
            },
        )

    # Create session
    session_id = str(uuid.uuid4())
    session = AvatarSession(
        id=session_id,
        avatar_id=avatar_id,
        text_input=text,
        language=avatar["language"],
        status="pending",
    )
    db.add(session)
    db.commit()

    # Start background task
    from models import SessionLocal
    background_tasks.add_task(_call_colab, session_id, avatar_id, text, SessionLocal)

    return {
        "session_id": session_id,
        "status": "pending",
        "message": f"Video generation started for {avatar['name']}",
    }


@app.get("/status/{session_id}")
def get_status(session_id: str, db: Session = Depends(get_db)):
    """Poll video generation status."""
    session = db.query(AvatarSession).filter(AvatarSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    result = {
        "session_id": session.id,
        "status": session.status,
        "avatar_id": session.avatar_id,
    }

    if session.status == "done" and session.video_path:
        result["video_url"] = f"/video/{session.id}"

    return result


@app.get("/video/{session_id}")
def serve_video(session_id: str, db: Session = Depends(get_db)):
    """Serve the generated .mp4 video file."""
    session = db.query(AvatarSession).filter(AvatarSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    if session.status != "done" or not session.video_path:
        raise HTTPException(status_code=404, detail="Video not ready yet")

    if not os.path.exists(session.video_path):
        raise HTTPException(status_code=404, detail="Video file not found on disk")

    return FileResponse(
        session.video_path,
        media_type="video/mp4",
        filename=f"{session.avatar_id}_{session.id[:8]}.mp4",
    )


@app.get("/demo/{avatar_id}")
def serve_demo(avatar_id: str):
    """Serve pre-rendered gold video instantly."""
    avatar = get_avatar(avatar_id)
    if not avatar:
        raise HTTPException(status_code=404, detail=f"Avatar '{avatar_id}' not found")

    gold_path = avatar["gold_video"]
    if not os.path.exists(gold_path):
        raise HTTPException(
            status_code=404,
            detail=f"Demo video not found for {avatar['name']}. Place a video at {gold_path}",
        )

    return FileResponse(
        gold_path,
        media_type="video/mp4",
        filename=f"demo_{avatar_id}.mp4",
    )


# ─────────────────────────────────────────────
# Q&A ENDPOINT (AUDIO ONLY — NO VIDEO)
# ─────────────────────────────────────────────

@app.post("/ask/{avatar_id}")
def ask_avatar(
    avatar_id: str,
    question: str = Form(...),
    db: Session = Depends(get_db),
):
    """
    Q&A mode: RAG → LLM → TTS → return .mp3 audio file.
    Much faster than video generation (~10s vs ~60s).
    """
    avatar = get_avatar(avatar_id)
    if not avatar:
        raise HTTPException(status_code=404, detail=f"Avatar '{avatar_id}' not found")

    # MCC check on the question too
    mcc_result = check_mcc_compliance(question)
    if not mcc_result["compliant"]:
        raise HTTPException(
            status_code=400,
            detail={
                "error": "MCC_VIOLATION",
                "violations": mcc_result["violations"],
                "reason": mcc_result["reason"],
            },
        )

    # Get answer from RAG pipeline
    answer_text = answer_question(avatar_id, question)

    # Log Q&A session
    qa_id = str(uuid.uuid4())
    qa_session = QASession(
        id=qa_id,
        avatar_id=avatar_id,
        question=question,
        answer=answer_text,
        language=avatar["language"],
    )
    db.add(qa_session)
    db.commit()

    # Convert answer to speech
    try:
        audio_path = text_to_audio(
            text=answer_text,
            lang=avatar["language"],
            gender=avatar["gender"],
        )
    except RuntimeError as e:
        raise HTTPException(status_code=500, detail=f"TTS failed: {str(e)}")

    if not os.path.exists(audio_path):
        raise HTTPException(status_code=500, detail="Audio file not generated")

    return FileResponse(
        audio_path,
        media_type="audio/mpeg",
        filename=f"qa_{avatar_id}_{qa_id[:8]}.mp3",
    )


@app.post("/ask_text/{avatar_id}")
def ask_avatar_text(
    avatar_id: str,
    question: str = Form(...),
    db: Session = Depends(get_db),
):
    """
    Q&A mode: RAG → LLM (Ollama) → return text JSON.
    """
    avatar = get_avatar(avatar_id)
    if not avatar:
        raise HTTPException(status_code=404, detail=f"Avatar '{avatar_id}' not found")

    mcc_result = check_mcc_compliance(question)
    if not mcc_result["compliant"]:
        raise HTTPException(
            status_code=400,
            detail={
                "error": "MCC_VIOLATION",
                "violations": mcc_result["violations"],
                "reason": mcc_result["reason"],
            },
        )

    # Get answer from RAG pipeline
    answer_text = answer_question(avatar_id, question)

    # Log Q&A session
    qa_id = str(uuid.uuid4())
    qa_session = QASession(
        id=qa_id,
        avatar_id=avatar_id,
        question=question,
        answer=answer_text,
        language=avatar["language"],
    )
    db.add(qa_session)
    db.commit()

    return {"answer": answer_text}


# ─────────────────────────────────────────────
# ANALYTICS ENDPOINT
# ─────────────────────────────────────────────

@app.get("/analytics")
def get_analytics(db: Session = Depends(get_db)):
    """Return session counts and Q&A counts per avatar."""
    analytics = {}

    for avatar_id in AVATARS:
        avatar = AVATARS[avatar_id]
        video_count = (
            db.query(AvatarSession)
            .filter(AvatarSession.avatar_id == avatar_id)
            .count()
        )
        video_done = (
            db.query(AvatarSession)
            .filter(AvatarSession.avatar_id == avatar_id, AvatarSession.status == "done")
            .count()
        )
        qa_count = (
            db.query(QASession)
            .filter(QASession.avatar_id == avatar_id)
            .count()
        )

        analytics[avatar_id] = {
            "name": avatar["name"],
            "emoji": avatar["emoji"],
            "color": avatar["color"],
            "language": avatar["lang_label"],
            "total_sessions": video_count,
            "completed_sessions": video_done,
            "qa_sessions": qa_count,
            "completion_rate": round((video_done / video_count * 100) if video_count > 0 else 0, 1),
        }

    return {"analytics": analytics}


# ─────────────────────────────────────────────
# ADMIN BROADCAST ENDPOINTS
# ─────────────────────────────────────────────

async def _generate_broadcast(broadcast_id: str, avatar_id: str, message: str, db_session_maker):
    """
    Background task: generate broadcast video via Colab Wav2Lip API.
    """
    colab_url = dotenv_values(".env").get("COLAB_URL", "")
    avatar = get_avatar(avatar_id)
    if not avatar:
        print(f"[BROADCAST] ❌ Avatar '{avatar_id}' not found for broadcast {broadcast_id}")
        return

    db = db_session_maker()
    try:
        broadcast = db.query(BroadcastMessage).filter(BroadcastMessage.id == broadcast_id).first()
        if not broadcast:
            return

        broadcast.status = "processing"
        db.commit()

        if not colab_url or 'your-ngrok-url' in colab_url or 'YOUR_' in colab_url:
            # No Colab URL configured or still placeholder
            print(f"[BROADCAST] ❌ COLAB_URL is not configured! Current value: '{colab_url}'")
            print(f"[BROADCAST]    → Run colab_notebook.ipynb in Google Colab and paste the tunnel URL in .env")
            broadcast.status = "failed"
            db.commit()
            return

        try:
            async with aiohttp.ClientSession() as http_session:
                data = aiohttp.FormData()

                # Add avatar photo
                photo_path = avatar["photo_path"]
                if os.path.exists(photo_path):
                    data.add_field(
                        "photo",
                        open(photo_path, "rb"),
                        filename=os.path.basename(photo_path),
                    )

                data.add_field("text", message)
                data.add_field("lang", avatar["language"])
                data.add_field("gender", avatar["gender"])

                async with http_session.post(
                    f"{colab_url}/generate",
                    data=data,
                    timeout=aiohttp.ClientTimeout(total=180),
                ) as response:
                    if response.status == 200:
                        video_data = await response.read()
                        output_path = f"outputs/broadcast_{broadcast_id}.mp4"

                        async with aiofiles.open(output_path, "wb") as f:
                            await f.write(video_data)

                        broadcast.video_path = output_path
                        broadcast.status = "done"
                        db.commit()
                    else:
                        broadcast.status = "failed"
                        db.commit()

        except Exception as e:
            print(f"[BROADCAST] ❌ Generation failed for {broadcast_id}: {e}")
            print(f"[BROADCAST]    → Make sure the Colab notebook is running and COLAB_URL is correct in .env")
            broadcast.status = "failed"
            db.commit()

    finally:
        db.close()


@app.post("/admin/broadcast")
async def create_broadcast(
    avatar_id: str = Form(...),
    message: str = Form(...),
    background_tasks: BackgroundTasks = None,
    db: Session = Depends(get_db),
):
    """Admin: Create a new broadcast video message."""
    avatar = get_avatar(avatar_id)
    if not avatar:
        raise HTTPException(status_code=404, detail=f"Avatar '{avatar_id}' not found")

    # MCC compliance check
    mcc_result = check_mcc_compliance(message)
    if not mcc_result["compliant"]:
        raise HTTPException(
            status_code=400,
            detail={
                "error": "MCC_VIOLATION",
                "violations": mcc_result["violations"],
                "reason": mcc_result["reason"],
            },
        )

    # Create broadcast record
    broadcast_id = str(uuid.uuid4())
    broadcast = BroadcastMessage(
        id=broadcast_id,
        avatar_id=avatar_id,
        message=message,
        status="pending",
    )
    db.add(broadcast)
    db.commit()

    # Start background video generation
    from models import SessionLocal
    background_tasks.add_task(_generate_broadcast, broadcast_id, avatar_id, message, SessionLocal)

    return {
        "broadcast_id": broadcast_id,
        "status": "pending",
        "message": f"Broadcast generation started for {avatar['name']}",
    }


@app.post("/admin/preview_audio")
async def preview_audio(
    avatar_id: str = Form(...),
    text: str = Form(...),
):
    """Admin: Generate and preview audio using Bhashini TTS (primary) with Edge-TTS fallback."""
    avatar = get_avatar(avatar_id)
    if not avatar:
        raise HTTPException(status_code=404, detail=f"Avatar '{avatar_id}' not found")

    mcc_result = check_mcc_compliance(text)
    if not mcc_result["compliant"]:
        raise HTTPException(
            status_code=400,
            detail={
                "error": "MCC_VIOLATION",
                "violations": mcc_result["violations"],
                "reason": mcc_result["reason"],
            },
        )

    try:
        # Use Bhashini TTS (primary) with Edge-TTS fallback for human-like voice
        audio_path = text_to_audio(
            text=text,
            lang=avatar["language"],
            gender=avatar["gender"],
        )
    except RuntimeError as e:
        raise HTTPException(status_code=500, detail=f"TTS failed: {str(e)}")

    if not os.path.exists(audio_path):
        raise HTTPException(status_code=500, detail="Audio file not generated")

    return FileResponse(
        audio_path,
        media_type="audio/mpeg",
        filename=os.path.basename(audio_path),
    )


@app.get("/admin/broadcasts")
def list_broadcasts(db: Session = Depends(get_db)):
    """Admin: List all broadcast messages, newest first."""
    broadcasts = (
        db.query(BroadcastMessage)
        .order_by(BroadcastMessage.created_at.desc())
        .limit(50)
        .all()
    )

    result = []
    for b in broadcasts:
        item = {
            "id": b.id,
            "avatar_id": b.avatar_id,
            "message": b.message,
            "status": b.status,
            "created_at": b.created_at.isoformat() if b.created_at else None,
        }
        if b.status == "done" and b.video_path:
            item["video_url"] = f"/admin/broadcast/{b.id}/video"
        result.append(item)

    return {"broadcasts": result}


@app.get("/admin/broadcast/{broadcast_id}/video")
def serve_broadcast_video(broadcast_id: str, db: Session = Depends(get_db)):
    """Serve a broadcast video file."""
    broadcast = db.query(BroadcastMessage).filter(BroadcastMessage.id == broadcast_id).first()
    if not broadcast:
        raise HTTPException(status_code=404, detail="Broadcast not found")

    if broadcast.status != "done" or not broadcast.video_path:
        raise HTTPException(status_code=404, detail="Video not ready yet")

    if not os.path.exists(broadcast.video_path):
        raise HTTPException(status_code=404, detail="Video file not found on disk")

    return FileResponse(
        broadcast.video_path,
        media_type="video/mp4",
        filename=f"broadcast_{broadcast.avatar_id}_{broadcast.id[:8]}.mp4",
    )


# ─────────────────────────────────────────────
# PUBLIC BROADCAST ENDPOINTS (visible to all users)
# ─────────────────────────────────────────────

@app.get("/broadcasts/latest")
def get_latest_broadcast(db: Session = Depends(get_db)):
    """Get the latest completed broadcast — shown to all users on Landing page."""
    broadcast = (
        db.query(BroadcastMessage)
        .filter(BroadcastMessage.status == "done")
        .order_by(BroadcastMessage.created_at.desc())
        .first()
    )

    if not broadcast:
        return {"broadcast": None}

    avatar = get_avatar(broadcast.avatar_id)
    return {
        "broadcast": {
            "id": broadcast.id,
            "avatar_id": broadcast.avatar_id,
            "avatar_name": avatar["name"] if avatar else broadcast.avatar_id,
            "avatar_emoji": avatar["emoji"] if avatar else "👤",
            "avatar_color": avatar["color"] if avatar else "#1D9E75",
            "message": broadcast.message,
            "video_url": f"/admin/broadcast/{broadcast.id}/video",
            "created_at": broadcast.created_at.isoformat() if broadcast.created_at else None,
        }
    }


@app.get("/broadcasts/{broadcast_id}/status")
def get_broadcast_status(broadcast_id: str, db: Session = Depends(get_db)):
    """Poll broadcast generation status."""
    broadcast = db.query(BroadcastMessage).filter(BroadcastMessage.id == broadcast_id).first()
    if not broadcast:
        raise HTTPException(status_code=404, detail="Broadcast not found")

    result = {
        "id": broadcast.id,
        "status": broadcast.status,
        "avatar_id": broadcast.avatar_id,
    }

    if broadcast.status == "done" and broadcast.video_path:
        result["video_url"] = f"/admin/broadcast/{broadcast.id}/video"

    return result


# ─────────────────────────────────────────────
# HEALTH CHECK
# ─────────────────────────────────────────────

@app.get("/health")
def health_check():
    """Health check endpoint."""
    return {
        "status": "ok",
        "avatars": len(AVATARS),
        "platform": "भारत Avatar Platform",
        "version": "1.0.0",
    }

import json
from pathlib import Path

@app.post("/update-colab-url")
async def update_colab_url(data: dict):
    """
    Called automatically by Colab when it starts.
    Updates .env file with new URL.
    Restarts the Colab connection automatically.
    """
    new_url = data.get("url", "").strip()
    
    if not new_url or "trycloudflare.com" not in new_url:
        raise HTTPException(400, "Invalid URL")
    
    # Read current .env
    env_path = Path(".env")
    if env_path.exists():
        lines = env_path.read_text().splitlines()
    else:
        lines = []
    
    # Update COLAB_URL line
    updated = False
    new_lines = []
    for line in lines:
        if line.startswith("COLAB_URL="):
            new_lines.append(f"COLAB_URL={new_url}")
            updated = True
        else:
            new_lines.append(line)
    
    if not updated:
        new_lines.append(f"COLAB_URL={new_url}")
    
    # Save .env
    env_path.write_text("\n".join(new_lines))
    
    # Update the running app's environment variable too
    os.environ["COLAB_URL"] = new_url
    
    print(f"\n[AUTO] Colab URL updated to: {new_url}\n")
    
    return {
        "success": True,
        "url": new_url,
        "message": "URL updated. No restart needed."
    }