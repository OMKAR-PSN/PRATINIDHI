"""
Pratinidhi Avatar Generation Routes
All routes under /api/avatar/
"""

from fastapi import APIRouter, HTTPException, Header, Query
from pydantic import BaseModel
from typing import Optional
import os
import uuid
import base64
import httpx
from datetime import datetime

import cloudinary
import cloudinary.uploader
from database import db_execute, log_audit, redis_client

router = APIRouter(prefix="/avatar", tags=["avatar"])

# ==================== Constants ====================

AVATAR_GENDER = {
    "arjun": "male",
    "priya": "female",
    "murugan": "male",
    "asha": "female",
}

VOICE_MAP = {
    ("hi", "male"):   "hi-IN-MadhurNeural",
    ("hi", "female"): "hi-IN-SwaraNeural",
    ("mr", "male"):   "mr-IN-ManoharNeural",
    ("mr", "female"): "mr-IN-AarohiNeural",
    ("ta", "male"):   "ta-IN-ValluvarNeural",
    ("ta", "female"): "ta-IN-PallaviNeural",
    ("bn", "male"):   "bn-IN-BashkarNeural",
    ("bn", "female"): "bn-IN-TanishaaNeural",
    ("te", "male"):   "te-IN-MohanNeural",
    ("te", "female"): "te-IN-ShrutiNeural",
    ("kn", "male"):   "kn-IN-GaganNeural",
    ("kn", "female"): "kn-IN-SapnaNeural",
    ("en", "male"):   "en-IN-PrabhatNeural",
    ("en", "female"): "en-IN-NeerjaNeural",
    ("gu", "male"):   "gu-IN-NiranjanNeural",
    ("gu", "female"): "gu-IN-DhwaniNeural",
    ("pa", "male"):   "pa-IN-OjaswanthNeural",
    ("pa", "female"): "pa-IN-VaaniNeural",
}

LANGUAGE_NAMES = {
    "hi": "Hindi",
    "mr": "Marathi",
    "ta": "Tamil",
    "te": "Telugu",
    "kn": "Kannada",
    "bn": "Bengali",
    "gu": "Gujarati",
    "pa": "Punjabi",
    "en": "English",
    "or": "Odia",
    "ur": "Urdu",
    "as": "Assamese",
}

BHASHINI_USER_ID = os.getenv("BHASHINI_USER_ID", "")
BHASHINI_INFERENCE_KEY = os.getenv("BHASHINI_INFERENCE_KEY", "")
AVATAR_SERVICE_URL = os.getenv("AVATAR_SERVICE_URL", "")

# ==================== Helpers ====================

def get_leader_id_from_token(authorization: Optional[str]) -> str:
    """
    Extract leader_id from Authorization header.
    Supports two formats:
      1. Bearer <JWT>  — decoded via python-jose
      2. Bearer leader:<leader_id>  — simple pass-through for dev/hackathon
    """
    if not authorization:
        raise HTTPException(401, "Authorization header missing")
    parts = authorization.strip().split(" ", 1)
    if len(parts) != 2 or parts[0].lower() != "bearer":
        raise HTTPException(401, "Invalid Authorization format. Use: Bearer <token>")
    token = parts[1].strip()

    # Simple pass-through format: "leader:<uuid>"
    if token.startswith("leader:"):
        return token[len("leader:"):]

    # JWT decode
    try:
        from jose import jwt as jose_jwt
        JWT_SECRET = os.getenv("JWT_SECRET", "pratinidhi_secret")
        payload = jose_jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        leader_id = payload.get("sub") or payload.get("leader_id") or payload.get("id")
        if not leader_id:
            raise HTTPException(401, "JWT missing subject claim")
        return leader_id
    except Exception as e:
        raise HTTPException(401, f"Invalid token: {e}")


def get_modal_url() -> str:
    """Get Modal service URL from Redis, fallback to env."""
    if redis_client:
        try:
            url = redis_client.get("avatar_service_url")
            if url:
                return url.rstrip("/")
        except Exception:
            pass
    return (AVATAR_SERVICE_URL or "").rstrip("/")


def check_consent(leader_id: str, authorization: Optional[str]):
    """
    Verify that the leader has active consent.
    Checks Redis session AND Neon consent_records.
    """
    # Extract consent_token from Authorization header or Redis lookup
    # We look up all active consent tokens for this leader
    try:
        records = db_execute(
            "SELECT consent_token, is_active FROM consent_records WHERE leader_id = %s AND is_active = TRUE ORDER BY consent_given_at DESC LIMIT 1",
            (leader_id,),
            fetchone=True
        )
    except Exception as e:
        raise HTTPException(403, f"Consent check failed: {e}")

    if not records:
        raise HTTPException(403, "Complete identity verification first")

    consent_token = records.get("consent_token")

    # Check Redis session
    if redis_client and consent_token:
        try:
            session_leader = redis_client.get(f"session:{consent_token}")
            if not session_leader:
                raise HTTPException(403, "Consent session expired. Please re-verify identity.")
        except HTTPException:
            raise
        except Exception:
            # Redis may be down; trust DB record
            pass

    return consent_token


async def bhashini_translate(text: str, source_lang: str, target_lang: str) -> str:
    """Call BHASHINI Dhruva API to translate text."""
    if source_lang == target_lang:
        return text

    url = "https://dhruva-api.bhashini.gov.in/services/inference/pipeline"
    headers = {
        "Authorization": BHASHINI_INFERENCE_KEY,
        "userID": BHASHINI_USER_ID,
        "Content-Type": "application/json",
    }
    body = {
        "pipelineTasks": [{
            "taskType": "translation",
            "config": {
                "language": {
                    "sourceLanguage": source_lang,
                    "targetLanguage": target_lang,
                }
            }
        }],
        "inputData": {
            "input": [{"source": text}]
        }
    }

    try:
        async with httpx.AsyncClient(timeout=30) as client:
            resp = await client.post(url, headers=headers, json=body)
            resp.raise_for_status()
            data = resp.json()
            translated = data["pipelineResponse"][0]["output"][0]["target"]
            return translated
    except Exception as e:
        print(f"[BHASHINI] Translation failed ({source_lang}→{target_lang}): {e}")
        return text  # fallback: use original text


# ==================== Models ====================

class RegisterUrlRequest(BaseModel):
    url: str


class GenerateAvatarRequest(BaseModel):
    text: str
    input_language: str = "hi"
    avatar: str = "arjun"
    title: Optional[str] = None


# ==================== Routes ====================

@router.post("/register-url")
async def register_url(req: RegisterUrlRequest):
    """Called by Modal on startup to register its current URL."""
    if not redis_client:
        # Fallback: just return success, Modal URL from env will be used
        return {"success": True, "message": "Redis unavailable, using env URL", "url": req.url}
    redis_client.set("avatar_service_url", req.url)
    return {"success": True, "url": req.url}


@router.get("/current-url")
async def get_current_url(authorization: Optional[str] = Header(None)):
    """Admin only: get current Modal URL from Redis."""
    leader_id = get_leader_id_from_token(authorization)
    leader = db_execute("SELECT role FROM leaders WHERE id = %s", (leader_id,), fetchone=True)
    if not leader or leader.get("role") != "admin":
        raise HTTPException(403, "Admin access required")
    url = get_modal_url()
    return {"url": url or "Not set"}


@router.get("/receiver-languages")
async def get_receiver_languages(authorization: Optional[str] = Header(None)):
    """Get distinct languages spoken by this leader's receivers."""
    leader_id = get_leader_id_from_token(authorization)

    rows = db_execute(
        """
        SELECT language, COUNT(*) as count
        FROM leader_receivers
        WHERE leader_id = %s AND language IS NOT NULL AND language != ''
        GROUP BY language
        ORDER BY count DESC
        """,
        (leader_id,),
        fetchall=True
    )

    if not rows:
        return {"languages": [], "total_receivers": 0}

    languages = []
    total = 0
    for row in rows:
        lang_code = row["language"]
        count = int(row["count"])
        total += count
        languages.append({
            "language": LANGUAGE_NAMES.get(lang_code, lang_code.capitalize()),
            "code": lang_code,
            "count": count,
        })

    return {"languages": languages, "total_receivers": total}


@router.post("/generate")
async def generate_avatar(
    req: GenerateAvatarRequest,
    authorization: Optional[str] = Header(None)
):
    """
    Main avatar generation pipeline:
    1. Verify JWT
    2. Check consent
    3. Get receiver languages
    4. For each language: BHASHINI translate → Modal Wav2Lip → Cloudinary → Neon save
    5. Return all video URLs
    """
    # Step 1 — JWT
    leader_id = get_leader_id_from_token(authorization)

    # Step 2 — Consent
    check_consent(leader_id, authorization)

    # Validate avatar
    avatar_name = req.avatar.lower()
    if avatar_name not in AVATAR_GENDER:
        raise HTTPException(400, f"Avatar must be one of: {list(AVATAR_GENDER.keys())}")

    # Step 3 — Get receiver languages
    lang_rows = db_execute(
        """
        SELECT language, COUNT(*) as count
        FROM leader_receivers
        WHERE leader_id = %s AND language IS NOT NULL AND language != ''
        GROUP BY language
        """,
        (leader_id,),
        fetchall=True
    )

    if not lang_rows:
        raise HTTPException(400, "Add receivers first before generating avatar")

    # Deduplicate and standardize languages to keys like 'hi', 'mr'
    unique_langs = {}
    for row in lang_rows:
        raw_lang = row["language"].lower()
        std_lang = raw_lang
        if raw_lang == "hindi": std_lang = "hi"
        elif raw_lang == "marathi": std_lang = "mr"
        elif raw_lang == "english": std_lang = "en"
        elif raw_lang == "tamil": std_lang = "ta"
        elif raw_lang == "telugu": std_lang = "te"
        elif raw_lang == "kannada": std_lang = "kn"
        elif raw_lang == "bengali": std_lang = "bn"
        elif raw_lang == "gujarati": std_lang = "gu"
        elif raw_lang == "punjabi": std_lang = "pa"
        
        unique_langs[std_lang] = unique_langs.get(std_lang, 0) + int(row["count"])

    # Step 4 — Avatar gender
    gender = AVATAR_GENDER[avatar_name]

    # Step 5 — Modal URL
    modal_url = get_modal_url()
    if not modal_url:
        raise HTTPException(500, "Avatar service URL not configured. Please deploy Modal first.")

    input_lang = req.input_language
    text = req.text
    title = req.title or text[:60]
    timestamp = int(datetime.now().timestamp())

    videos_result = []

    for std_lang, count in unique_langs.items():
        receiver_lang = std_lang
        receivers_count = count

        try:
            # Step 6a — BHASHINI Translation
            translated_text = await bhashini_translate(text, input_lang, receiver_lang)

            # Step 6b — Voice selection
            voice = VOICE_MAP.get((receiver_lang, gender), "hi-IN-MadhurNeural")

            # Step 6c — Modal generate
            modal_payload = {
                "text": translated_text,
                "avatar": avatar_name,
                "language": receiver_lang,
                "voice": voice,
            }

            async with httpx.AsyncClient(timeout=120) as client:
                modal_resp = await client.post(
                    modal_url,
                    json=modal_payload
                )
                modal_resp.raise_for_status()
                modal_data = modal_resp.json()

            if modal_data.get("error"):
                print(f"[Modal] Error for {receiver_lang}: {modal_data['error']}")
                continue

            video_b64 = modal_data.get("video_base64")
            if not video_b64:
                print(f"[Modal] No video_base64 in response for {receiver_lang}")
                continue

            # Step 6d — Decode base64
            video_bytes = base64.b64decode(video_b64)

            # Step 6e — Upload to Cloudinary
            folder = f"pratinidhi/avatars/{receiver_lang}"
            public_id = f"leader_{leader_id[:8]}_{receiver_lang}_{timestamp}"

            upload_result = cloudinary.uploader.upload(
                video_bytes,
                resource_type="video",
                folder=folder,
                public_id=public_id,
                overwrite=True,
            )

            cloudinary_url = upload_result.get("secure_url")
            cloudinary_public_id = upload_result.get("public_id")
            duration = int(upload_result.get("duration", 0))
            file_size_mb = round(upload_result.get("bytes", 0) / (1024 * 1024), 2)
            thumbnail_url = cloudinary_url.rsplit(".", 1)[0] + ".jpg" if cloudinary_url else None

            # Step 6f — Save to avatar_videos table
            video_id = str(uuid.uuid4())
            db_execute(
                """
                INSERT INTO avatar_videos
                  (id, leader_id, title, original_language, target_language,
                   cloudinary_url, cloudinary_public_id, thumbnail_url,
                   duration_seconds, file_size_mb, resolution,
                   video_type, is_public, status, created_at)
                VALUES
                  (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, NOW())
                """,
                (
                    video_id, leader_id, title, input_lang, receiver_lang,
                    cloudinary_url, cloudinary_public_id, thumbnail_url,
                    duration, file_size_mb, "720p",
                    "avatar", False, "active"
                ),
                commit=True
            )

            # Step 6h — Audit log
            try:
                log_audit(leader_id, "avatar_generated", {
                    "language": receiver_lang,
                    "avatar": avatar_name,
                    "receivers_count": receivers_count,
                    "video_id": video_id,
                })
            except Exception as audit_err:
                print(f"[Audit] Log failed: {audit_err}")

            videos_result.append({
                "language": LANGUAGE_NAMES.get(receiver_lang, receiver_lang.capitalize()),
                "language_code": receiver_lang,
                "video_url": cloudinary_url,
                "thumbnail_url": thumbnail_url,
                "video_id": video_id,
                "receivers_count": receivers_count,
                "voice_used": voice,
                "avatar": avatar_name,
                "translated_text": translated_text,
            })

        except HTTPException:
            raise
        except Exception as e:
            print(f"[Generate] Failed for language {receiver_lang}: {e}")
            # Continue with other languages instead of aborting
            continue

    if not videos_result:
        raise HTTPException(500, "Avatar generation failed for all receiver languages. Check Modal service and BHASHINI credentials.")

    total_receivers = sum(v["receivers_count"] for v in videos_result)

    return {
        "videos": videos_result,
        "total_videos_generated": len(videos_result),
        "total_receivers": total_receivers,
        "avatar_used": avatar_name,
        "input_language": input_lang,
    }


@router.get("/my-videos")
async def get_my_videos(
    authorization: Optional[str] = Header(None),
    page: int = Query(1, ge=1),
    limit: int = Query(12, ge=1, le=50),
    language: Optional[str] = Query(None),
    avatar: Optional[str] = Query(None),
):
    """Get paginated avatar videos for the logged-in leader."""
    leader_id = get_leader_id_from_token(authorization)

    offset = (page - 1) * limit

    conditions = ["leader_id = %s", "status != 'deleted'"]
    params = [leader_id]

    if language:
        conditions.append("target_language = %s")
        params.append(language)

    where_clause = " AND ".join(conditions)

    total_row = db_execute(
        f"SELECT COUNT(*) as total FROM avatar_videos WHERE {where_clause}",
        tuple(params),
        fetchone=True
    )
    total = int(total_row["total"]) if total_row else 0

    params.extend([limit, offset])
    videos = db_execute(
        f"""
        SELECT id, title, original_language, target_language, cloudinary_url,
               thumbnail_url, duration_seconds, file_size_mb, is_public,
               view_count, status, created_at, video_type
        FROM avatar_videos
        WHERE {where_clause}
        ORDER BY created_at DESC
        LIMIT %s OFFSET %s
        """,
        tuple(params),
        fetchall=True
    )

    # Enrich with receiver counts per language
    enriched = []
    for v in (videos or []):
        lang_code = v.get("target_language")
        receiver_count = 0
        if lang_code:
            try:
                rc = db_execute(
                    "SELECT COUNT(*) as cnt FROM leader_receivers WHERE leader_id = %s AND language = %s",
                    (leader_id, lang_code),
                    fetchone=True
                )
                receiver_count = int(rc["cnt"]) if rc else 0
            except Exception:
                pass
        enriched.append({
            **dict(v),
            "receivers_count": receiver_count,
            "language_name": LANGUAGE_NAMES.get(lang_code, lang_code or "Unknown"),
            "created_at": v["created_at"].isoformat() if hasattr(v.get("created_at"), "isoformat") else str(v.get("created_at", "")),
        })

    return {
        "videos": enriched,
        "total": total,
        "page": page,
        "limit": limit,
        "total_pages": (total + limit - 1) // limit,
    }


@router.get("/public")
async def get_public_videos(
    language: Optional[str] = Query(None),
    state: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(12, ge=1, le=50),
):
    """Get all public avatar videos. No auth required."""
    offset = (page - 1) * limit

    conditions = ["av.is_public = TRUE", "av.status = 'active'"]
    params = []

    if language:
        conditions.append("av.target_language = %s")
        params.append(language)

    if state:
        conditions.append("l.state = %s")
        params.append(state)

    where_clause = " AND ".join(conditions)
    params.extend([limit, offset])

    videos = db_execute(
        f"""
        SELECT av.id, av.title, av.target_language, av.cloudinary_url,
               av.thumbnail_url, av.duration_seconds, av.view_count,
               av.created_at, l.name as leader_name, l.state as leader_state
        FROM avatar_videos av
        JOIN leaders l ON av.leader_id = l.id
        WHERE {where_clause}
        ORDER BY av.created_at DESC
        LIMIT %s OFFSET %s
        """,
        tuple(params),
        fetchall=True
    )

    result = []
    for v in (videos or []):
        lang_code = v.get("target_language", "")
        result.append({
            **dict(v),
            "language_name": LANGUAGE_NAMES.get(lang_code, lang_code),
            "created_at": v["created_at"].isoformat() if hasattr(v.get("created_at"), "isoformat") else str(v.get("created_at", "")),
        })

    return {"videos": result, "page": page, "limit": limit}


@router.patch("/{video_id}/toggle-public")
async def toggle_public(
    video_id: str,
    authorization: Optional[str] = Header(None)
):
    """Toggle is_public for a video. Only owner can do this."""
    leader_id = get_leader_id_from_token(authorization)

    video = db_execute(
        "SELECT leader_id, is_public FROM avatar_videos WHERE id = %s AND status != 'deleted'",
        (video_id,),
        fetchone=True
    )
    if not video:
        raise HTTPException(404, "Video not found")
    if str(video["leader_id"]) != str(leader_id):
        raise HTTPException(403, "You can only modify your own videos")

    new_public = not video["is_public"]
    db_execute(
        "UPDATE avatar_videos SET is_public = %s WHERE id = %s",
        (new_public, video_id),
        commit=True
    )
    return {"success": True, "is_public": new_public, "video_id": video_id}


@router.delete("/{video_id}")
async def delete_video(
    video_id: str,
    authorization: Optional[str] = Header(None)
):
    """Soft delete video. Delete from Cloudinary too."""
    leader_id = get_leader_id_from_token(authorization)

    video = db_execute(
        "SELECT leader_id, cloudinary_public_id FROM avatar_videos WHERE id = %s AND status != 'deleted'",
        (video_id,),
        fetchone=True
    )
    if not video:
        raise HTTPException(404, "Video not found")

    # Check if owner or admin
    is_owner = str(video["leader_id"]) == str(leader_id)
    if not is_owner:
        leader = db_execute("SELECT role FROM leaders WHERE id = %s", (leader_id,), fetchone=True)
        if not leader or leader.get("role") != "admin":
            raise HTTPException(403, "Only owner or admin can delete this video")

    # Delete from Cloudinary
    if video.get("cloudinary_public_id"):
        try:
            cloudinary.uploader.destroy(video["cloudinary_public_id"], resource_type="video")
        except Exception as e:
            print(f"[Cloudinary] Delete failed: {e}")

    # Soft delete in Neon
    db_execute(
        "UPDATE avatar_videos SET status = 'deleted' WHERE id = %s",
        (video_id,),
        commit=True
    )

    try:
        log_audit(leader_id, "avatar_deleted", {"video_id": video_id})
    except Exception:
        pass

    return {"success": True, "video_id": video_id}


@router.get("/{video_id}")
async def get_video(video_id: str):
    """Get single video details and increment view count."""
    # Increment view count
    db_execute(
        "UPDATE avatar_videos SET view_count = view_count + 1 WHERE id = %s AND status != 'deleted'",
        (video_id,),
        commit=True
    )

    video = db_execute(
        """
        SELECT av.*, l.name as leader_name, l.state as leader_state
        FROM avatar_videos av
        JOIN leaders l ON av.leader_id = l.id
        WHERE av.id = %s AND av.status != 'deleted'
        """,
        (video_id,),
        fetchone=True
    )
    if not video:
        raise HTTPException(404, "Video not found")

    result = dict(video)
    lang_code = result.get("target_language", "")
    result["language_name"] = LANGUAGE_NAMES.get(lang_code, lang_code)
    if hasattr(result.get("created_at"), "isoformat"):
        result["created_at"] = result["created_at"].isoformat()

    return result
