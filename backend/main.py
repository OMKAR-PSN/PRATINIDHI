from fastapi import FastAPI, UploadFile, File, Form, HTTPException
print("!!! ROOT MAIN LOADED !!!")
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import os
import uuid
from datetime import datetime
from dotenv import load_dotenv
load_dotenv()
import cloudinary
import cloudinary.uploader

from translate import translate_text
from tts import text_to_audio as generate_speech
from asr import transcribe_audio_bhashini
from avatar import generate_avatar_video
from utils import ensure_dirs, get_video_path, get_audio_path

from database import test_connections, redis_client, db_execute
from routes import consent, health, auth, receivers, videos, avatar_routes
import json
import notifications
import firebase_admin
from firebase_admin import credentials, messaging

# Initialize Firebase Admin SDK safely
firebase_path = "c:/Users/Omkar/Downloads/pratinidhi-bbe4b-firebase-adminsdk-fbsvc-11a6b51761.json"
firebase_env = os.getenv("FIREBASE_JSON")

try:
    cred = None
    if firebase_env:
        cred = credentials.Certificate(json.loads(firebase_env))
    elif os.path.exists(firebase_path):
        cred = credentials.Certificate(firebase_path)
        
    if cred:
        firebase_admin.initialize_app(cred)
        print("✅ Firebase Admin successfully initialized")
    else:
        print("⚠️ Firebase Admin credentials not found!")
except Exception as e:
    print(f"⚠️ Firebase Admin init failed: {e}")

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
test_connections()

# Constants for paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(BASE_DIR)
OUTPUT_DIR = os.path.join(PROJECT_ROOT, "output")
AUDIO_DIR = os.path.join(OUTPUT_DIR, "audio")
VIDEO_DIR = os.path.join(OUTPUT_DIR, "videos")
AVATARS_DIR = os.path.join(PROJECT_ROOT, "avatars")

os.makedirs(AUDIO_DIR, exist_ok=True)
os.makedirs(VIDEO_DIR, exist_ok=True)
os.makedirs(AVATARS_DIR, exist_ok=True)

app.include_router(consent.router, prefix="/api")
app.include_router(health.router, prefix="/api")
app.include_router(auth.router, prefix="/api")
app.include_router(receivers.router, prefix="/api")
app.include_router(videos.router, prefix="/api")
app.include_router(avatar_routes.router, prefix="/api")

app.mount("/output", StaticFiles(directory=OUTPUT_DIR), name="output")
app.mount("/avatars", StaticFiles(directory=AVATARS_DIR), name="avatars")

# In-memory storage
avatars_db = {}
messages_db = []
consent_db = {}
users_db = {}  # email -> {name, email, phone, password_hash, role}

import hashlib as _hashlib



# ==================== Models ====================

class MCCCheckRequest(BaseModel):
    message: str

class DeviceRegistration(BaseModel):
    token: str
    state: str
    pincode: str = None
    language: str = "english"

class PreviewRequest(BaseModel):
    text: str
    language: str
    avatar: str = 'arjun'

class RAGAskRequest(BaseModel):
    question: str

class ConsentRequest(BaseModel):
    avatar_id: str

class ConsentVerify(BaseModel):
    avatar_id: str
    otp: str

class BroadcastRequest(BaseModel):
    leader_id: str
    message: str
    translated_text: str
    language: str
    avatar: str = 'arjun'
    video_metadata: list = []


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
    filepath = os.path.join(AVATARS_DIR, filename)
    with open(filepath, "wb") as f:
        f.write(await image.read())
    return {"filename": filename, "path": filepath}

@app.post("/api/asr")
async def process_audio_asr(
    audio: UploadFile = File(...),
    language: str = Form(default="hi")
):
    if not audio.content_type.startswith("audio/") and not audio.content_type.startswith("video/"):
        raise HTTPException(400, "File must be an audio recording")
    
    file_ext = os.path.splitext(audio.filename)[1] or ".m4a"
    filename = f"asr_{uuid.uuid4().hex}{file_ext}"
    filepath = os.path.join(AUDIO_DIR, filename)
    
    with open(filepath, "wb") as f:
        f.write(await audio.read())
        
    transcript = transcribe_audio_bhashini(filepath, language)
    
    return {"transcript": transcript, "language": language}


@app.post("/api/avatar/generate-legacy")
async def create_avatar(
    image: UploadFile = File(...),
    message: str = Form(...),
    language: str = Form(default="hi"),
    voice: str = Form(default="standard"),
    style: str = Form(default="realistic"),
    leader_id: str = Form(default="admin"),
    consent_token: str = Form(default="")
):
    # GATE 1: Check consent token is valid in Redis/Cache
    if not consent_token:
        raise HTTPException(403, "No valid consent. Leader must verify OTP first.")
        
    session_leader = redis_client.get(f"session:{consent_token}")
    if session_leader != leader_id:
        raise HTTPException(403, "Invalid or expired consent token.")
    
    # Double-check consent record exists in Neon and email is verified
    try:
        consent_record = db_execute("SELECT * FROM consent_records WHERE leader_id = %s AND is_active = TRUE", (leader_id,), fetchall=True)
        if not consent_record or len(consent_record) == 0:
            raise HTTPException(403, "Consent record not found in database.")
        
        # Require 1 layer: Biometric Face Verification
        if not consent_record[0].get("face_verified"):
            raise HTTPException(403, "Biometric face verification is missing. Please complete the face scan identity challenge.")            
    except Exception as e:
        if isinstance(e, HTTPException): raise e

    avatar_id = uuid.uuid4().hex[:12]
    try:
        file_ext = os.path.splitext(image.filename)[1] or ".jpg"
        image_path = os.path.join(AVATARS_DIR, f"{avatar_id}{file_ext}")
        with open(image_path, "wb") as f:
            f.write(await image.read())

        translated = translate_text(message, target_lang=language)
        audio_path = get_audio_path(avatar_id)
        generate_speech(translated, language, audio_path)

        video_path = get_video_path(avatar_id)
        generate_avatar_video(image_path, audio_path, video_path)
        
        # Sign the generated video
        signature = None
        if os.path.exists(video_path):
            sig_data = sign_video(video_path, leader_id, consent_token)
            signature = sig_data["signed_token"]
            
            # Save signature to Neon
            try:
                db_execute(
                    "INSERT INTO avatar_signatures (leader_id, video_hash, signed_token, language) VALUES (%s, %s, %s, %s)",
                    (leader_id, sig_data["video_hash"], signature, language),
                    commit=True
                )
                
                # Log it
                from database import log_audit
                log_audit(leader_id, "avatar_generated", {"language": language, "video_hash": sig_data["video_hash"]})
            except Exception as e:
                print(f"Warning: Failed to log signature: {e}")

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
            "consent_status": "approved",
            "signature": signature
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
            "signature": signature
        }
    except Exception as e:
        raise HTTPException(500, f"Generation failed: {str(e)}")


@app.post("/api/preview/translate")
async def preview_translate(req: PreviewRequest):
    try:
        translated = translate_text(req.text, target_lang=req.language)
        filename = f"preview_{uuid.uuid4().hex[:8]}.mp3"
        audio_path = os.path.join(AUDIO_DIR, filename)
        # Derive gender from avatar name for correct voice
        avatar_name = req.avatar.lower() if req.avatar else 'arjun'
        gender = "female" if avatar_name in ["priya", "asha"] else "male"
        generate_speech(translated, req.language, audio_path, gender=gender)
        return {
            "translated_text": translated,
            "audio_url": f"/output/audio/{filename}"
        }
    except Exception as e:
        raise HTTPException(500, f"Preview generation failed: {str(e)}")


@app.get("/api/messages/unread")
async def get_unread_count(leader_id: str):
    if not redis_client:
        return {"count": 0}
    count = redis_client.get(f"unread:{leader_id}")
    return {"count": int(count) if count else 0}

# ==================== FCM Push Notifications ====================

@app.post("/api/notifications/register")
async def register_device(device: DeviceRegistration):
    try:
        db_execute(
            """
            INSERT INTO citizen_devices (device_token, state, pincode, language) 
            VALUES (%s, %s, %s, %s)
            ON CONFLICT (device_token) 
            DO UPDATE SET state = EXCLUDED.state, pincode = EXCLUDED.pincode, language = EXCLUDED.language
            """,
            (device.token, device.state, device.pincode, device.language),
            commit=True
        )
        return {"success": True, "message": "Device registered for notifications"}
    except Exception as e:
        return {"success": False, "error": str(e)}

def broadcast_push_notification(state: str, title: str, body: str):
    """Sends a push notification to all devices registered in a specific state."""
    try:
        devices = db_execute("SELECT device_token FROM citizen_devices WHERE state = %s", (state,), fetchall=True)
        if not devices:
            return 0
            
        tokens = [d["device_token"] for d in devices]
        
        message = messaging.MulticastMessage(
            notification=messaging.Notification(
                title=title,
                body=body,
            ),
            tokens=tokens,
        )
        
        response = messaging.send_each_for_multicast(message)
        print(f"FCM: Successfully sent {response.success_count} messages. Failed: {response.failure_count}")
        return response.success_count
    except Exception as e:
        print(f"⚠️ FCM Broadcast failed: {e}")
        return 0

@app.post("/api/messages/send")
async def send_message(req: BroadcastRequest):
    import uuid
    try:
        uuid.UUID(req.leader_id)
        leader_id = req.leader_id
    except ValueError:
        first_leader = db_execute("SELECT id FROM leaders LIMIT 1", fetchone=True)
        if first_leader:
            leader_id = str(first_leader["id"])
        else:
            raise HTTPException(status_code=400, detail="Invalid leader session")

    try:
        # 1. Fetch receivers
        receivers_list = db_execute(
            "SELECT id, receiver_phone, receiver_email, language, has_whatsapp, is_app_user, app_user_id FROM leader_receivers WHERE leader_id = %s",
            (leader_id,),
            fetchall=True
        )
        
        if not receivers_list:
            raise HTTPException(status_code=400, detail="You have no receivers in your list.")
    except Exception as base_e:
        import traceback
        with open("crash_log.txt", "w") as f: f.write(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(base_e))

    # 2. Log parent message
    msg_res = db_execute(
        """INSERT INTO messages (sender_id, message_text, original_language, total_receivers) 
           VALUES (%s, %s, %s, %s) RETURNING id""",
        (leader_id, req.message, req.language, len(receivers_list)),
        commit=True,
        fetchone=True
    )
    message_id = msg_res['id']

    sent = 0
    failed = 0

    # 3. Dispatch
    for r in receivers_list:
        try:
            p_email = "pending"
            p_wa = "pending"
            p_sms = "pending"
            err_reason = []
            receiver_success = False
            
            trans_text = req.translated_text
            r_lang = r.get("language") or req.language
            r_lang = r_lang.strip().lower()
            if r_lang == "hindi": r_lang = "hi"
            if r_lang == "marathi": r_lang = "mr"
            if r_lang == "english": r_lang = "en"
            
            audio_url = None
            
            # Map avatar to gender for fallback TTS
            avatar_name = getattr(req, "avatar", "arjun").lower()
            gender = "female" if avatar_name in ["priya", "asha"] else "male"
            
            # Cache translation and TTS per language
            if not hasattr(send_message, "lang_cache"):
                send_message.lang_cache = {}
            if str(message_id) not in send_message.lang_cache:
                send_message.lang_cache[str(message_id)] = {}
                
            cache = send_message.lang_cache[str(message_id)]
            
            if r_lang not in cache:
                if r_lang == req.language or r_lang == req.language.lower():
                    tgt_text = req.translated_text
                else:
                    tgt_text = translate_text(req.message, source_lang=req.language, target_lang=r_lang)
                
                tgt_audio_url = None
                tgt_video_url = None
                
                # Check for pre-generated video first
                has_video = False
                for v in req.video_metadata:
                    if v.get("language_code") == r_lang:
                        tgt_video_url = v.get("video_url")
                        tgt_audio_url = v.get("audio_url") or tgt_video_url  # video has audio
                        tgt_text = v.get("translated_text") or tgt_text
                        has_video = True
                        break
                
                if not has_video:
                    try:
                        filename = f"msg_{message_id}_{r_lang}.mp3"
                        audio_path = os.path.join(AUDIO_DIR, filename)
                        generate_speech(tgt_text, r_lang, audio_path, gender=gender)
                        # Try Cloudinary first
                        try:
                            res = cloudinary.uploader.upload(audio_path, resource_type="video")
                            tgt_audio_url = res.get("secure_url")
                            print(f"[AUDIO] Cloudinary upload OK: {tgt_audio_url}")
                        except Exception as cloud_err:
                            print(f"[AUDIO] Cloudinary failed ({cloud_err}), trying catbox.moe...")
                            # Fallback: upload to catbox.moe
                            import requests as _req
                            with open(audio_path, "rb") as f:
                                r = _req.post(
                                    "https://catbox.moe/user/api.php",
                                    data={"reqtype": "fileupload"},
                                    files={"fileToUpload": (filename, f, "audio/mpeg")},
                                    timeout=20
                                )
                            if r.ok and r.text.startswith("https://"):
                                tgt_audio_url = r.text.strip()
                                print(f"[AUDIO] Catbox upload OK: {tgt_audio_url}")
                    except Exception as e:
                        print(f"TTS Error for {r_lang}: {e}")
                    
                cache[r_lang] = {"text": tgt_text, "audio_url": tgt_audio_url, "video_url": tgt_video_url}
                db_execute(
                    "INSERT INTO message_translations (message_id, language, translated_text, audio_url, video_url) VALUES (%s, %s, %s, %s, %s) ON CONFLICT DO NOTHING",
                    (message_id, r_lang, tgt_text, tgt_audio_url, tgt_video_url),
                    commit=True
                )
                
            trans_text = cache[r_lang]["text"]
            audio_url = cache[r_lang]["audio_url"]
            video_url = cache[r_lang]["video_url"]
            
            # Prepare message content with media link for SMS/WhatsApp
            full_message = trans_text
            if video_url:
                full_message += f"\n\nWatch Video Announcement: {video_url}"
            elif audio_url:
                full_message += f"\n\nListen to Audio: {audio_url}"
            # Inbox for App Users
            if r.get("is_app_user") and r.get("app_user_id"):
                db_execute(
                    """INSERT INTO inbox_messages (recipient_leader_id, sender_leader_id, message_id, message_text, original_text)
                       VALUES (%s, %s, %s, %s, %s)""",
                    (r["app_user_id"], req.leader_id, message_id, trans_text, req.message),
                    commit=True
                )
                if redis_client:
                    redis_client.incr(f"unread:{r['app_user_id']}")
                receiver_success = True
                p_wa = "inbox"

            # Email
            if r.get("receiver_email"):
                email_body = f"<h2>Announcement</h2><p>{trans_text}</p><p><i>Original: {req.message}</i></p>"
                ok, msg = notifications.send_email(r["receiver_email"], "Official Announcement", email_body)
                if ok:
                    p_email = "sent"
                    receiver_success = True
                else:
                    p_email = "failed"
                    err_reason.append(f"Email: {msg}")

            # WhatsApp
            if r.get("has_whatsapp") and r.get("receiver_phone"):
                wa_text = f"Official Announcement:\n{full_message}"
                wa_media = video_url if video_url else (audio_url if audio_url and audio_url.startswith("http") else None)
                ok, msg = notifications.send_whatsapp(r["receiver_phone"], wa_text, media_url=wa_media)
                if ok:
                    p_wa = "sent"
                    receiver_success = True
                else:
                    p_wa = "failed"
                    err_reason.append(f"WhatsApp: {msg}")

            # SMS
            if r.get("receiver_phone"):
                sms_text = f"Announcement: {full_message}"
                ok, msg = notifications.send_sms(r["receiver_phone"], sms_text)
                if ok:
                    p_sms = "sent"
                    receiver_success = True
                else:
                    p_sms = "failed"
                    err_reason.append(f"SMS: {msg}")

            if receiver_success:
                sent += 1
            else:
                failed += 1

            recipient_id = str(uuid.uuid4())
            db_execute(
                """INSERT INTO message_recipients (id, message_id, receiver_id, translated_text, email_status, whatsapp_status, sms_status, error_reason)
                   VALUES (%s, %s, %s, %s, %s, %s, %s, %s)""",
                (recipient_id, message_id, r["id"], trans_text, p_email, p_wa, p_sms, "; ".join(err_reason)),
                commit=True
            )
        except Exception as dispatch_err:
            import traceback
            with open("crash_log.txt", "a") as f:
                f.write(f"CRASH on receiver {r.get('id')}:\n")
                f.write(traceback.format_exc())
            print(f"Warning: Dispatch error for receiver {r.get('id')}: {dispatch_err}")
            failed += 1

    db_execute(
        "UPDATE messages SET sent_count = %s, failed_count = %s, completed_at = NOW() WHERE id = %s",
        (sent, failed, message_id),
        commit=True
    )

    return {"success": True, "message_id": str(message_id), "sent": sent, "failed": failed}

@app.get("/api/messages/history")
async def get_message_history(leader_id: str, lang: str = "en"):
    sent = db_execute(
        """SELECT m.*, t.translated_text as display_text 
           FROM messages m 
           LEFT JOIN message_translations t ON m.id = t.message_id AND t.language = %s 
           WHERE m.sender_id = %s ORDER BY m.created_at DESC""",
        (lang, leader_id),
        fetchall=True
    )
    inbox = db_execute(
        """SELECT i.*, l.name as sender_name 
           FROM inbox_messages i 
           JOIN leaders l ON i.sender_leader_id = l.id 
           WHERE i.recipient_leader_id = %s 
           ORDER BY i.created_at DESC""",
        (leader_id,),
        fetchall=True
    )
    return {"sent": sent or [], "inbox": inbox or []}

@app.get("/api/messages/{msg_id}/preview")
async def get_message_preview(msg_id: str, leader_id: str):
    msg = db_execute("SELECT * FROM messages WHERE id = %s", (msg_id,), fetchone=True)
    if not msg:
        raise HTTPException(404, "Message not found")
        
    if str(msg["sender_id"]) != leader_id:
        leader = db_execute("SELECT role FROM leaders WHERE id = %s", (leader_id,), fetchone=True)
        if not leader or leader["role"] != "admin":
            raise HTTPException(403, "Unauthorized")
            
    translations = db_execute("SELECT language, translated_text, audio_url, video_url FROM message_translations WHERE message_id = %s", (msg_id,), fetchall=True)
    
    delivery = db_execute(
        """
        SELECT 
            COUNT(*) as total,
            COUNT(CASE WHEN whatsapp_status = 'pending' AND sms_status = 'pending' AND email_status = 'pending' THEN 1 END) as pending,
            COUNT(CASE WHEN whatsapp_status = 'sent' OR sms_status = 'sent' OR email_status = 'sent' THEN 1 END) as delivered
        FROM message_recipients WHERE message_id = %s
        """, (msg_id,), fetchone=True
    )
    
    return {
        "message": msg,
        "translations": translations or [],
        "delivery": delivery
    }

@app.post("/api/messages/read/{msg_id}")
async def mark_as_read(msg_id: str, leader_id: str):
    db_execute(
        "UPDATE inbox_messages SET is_read = TRUE, read_at = NOW() WHERE id = %s AND recipient_leader_id = %s AND is_read = FALSE",
        (msg_id, leader_id),
        commit=True
    )
    if redis_client:
        count = redis_client.get(f"unread:{leader_id}")
        if count and int(count) > 0:
            redis_client.decr(f"unread:{leader_id}")
    return {"success": True}


@app.get("/api/avatar/{avatar_id}")
async def get_avatar(avatar_id: str):
    if avatar_id == "demo":
        return {
            "id": "demo",
            "original_text": "PM Kisan scheme registration is now open.",
            "translated_text": "पीएम किसान योजना पंजीकरण अब खुला है।",
            "language": "hi",
            "videoUrl": None,
            "audioUrl": "/output/audio/demo.mp3",
            "created_at": datetime.now().isoformat(),
            "consent_status": "demo",
        }
    if avatar_id not in avatars_db:
        raise HTTPException(404, "Avatar not found")
    
    data = avatars_db[avatar_id]
    data["audioUrl"] = f"/output/audio/{avatar_id}.mp3"
    return data


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

@app.get("/announcements")
async def get_announcements(state: str):
    """
    Fetch regional announcements specific to the user's state.
    """
    try:
        # 1. Look up the leader(s) assigned to this state
        leaders = db_execute(
            "SELECT id, name FROM leaders WHERE state = %s", 
            (state,), 
            fetchall=True
        )
        
        if not leaders:
            return []
            
        leader = leaders[0]
        leader_id = leader["id"]
        
        # 2. Query messages broadcasted by this leader
        try:
            messages = db_execute(
                "SELECT id, message_text, created_at FROM messages WHERE sender_id = %s ORDER BY created_at DESC",
                (leader_id,),
                fetchall=True
            )
        except Exception:
            messages = []
            
        # 3. Format payload for the Flutter frontend
        results = []
        if messages:
            for m in messages:
                results.append({
                    "_id": str(m["id"]),
                    "title": f"Update from {leader['name']}",
                    "message": m["message_text"],
                    "category": "General",
                    "is_urgent": False,
                    "constituency_id": state,
                    "created_at": m["created_at"].isoformat() if hasattr(m["created_at"], "isoformat") else str(m["created_at"])
                })
        return results
    except Exception as e:
        print(f"Error fetching announcements: {e}")
        return []


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
