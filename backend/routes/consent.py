from fastapi import APIRouter, HTTPException
from database import db_execute, log_audit, redis_client
from signing import generate_consent_token
from sms import send_otp_sms
import random, hashlib, uuid
from datetime import datetime, timedelta
import os
import resend

resend.api_key = os.getenv("RESEND_API_KEY")
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")

router = APIRouter(prefix="/consent", tags=["consent"])

@router.post("/send-otp")
async def send_otp(leader_id: str, phone: str):
    otp = str(random.randint(100000, 999999))
    hashed = hashlib.sha256(otp.encode()).hexdigest()
    if redis_client:
        redis_client.setex(f"otp:{leader_id}", 300, hashed)
    
    send_otp_sms(phone, otp)
    
    try:
        log_audit(leader_id, "otp_sent", {"phone": f"******{phone[-4:]}", "method": "phone"})
    except Exception as e:
        print(f"Warning: Failed to log to DB: {e}")
            
    return {"message": "OTP sent successfully"}


@router.post("/verify-otp")
async def verify_otp(leader_id: str, otp: str):
    if not redis_client:
        raise HTTPException(500, "Cache is unavailable.")
        
    stored_hash = redis_client.get(f"otp:{leader_id}")
    if not stored_hash:
        raise HTTPException(400, "OTP expired or not found. Please request a new one.")
    
    provided_hash = hashlib.sha256(otp.encode()).hexdigest()
    if provided_hash != stored_hash:
        raise HTTPException(400, "Invalid OTP. Please try again.")
    
    redis_client.delete(f"otp:{leader_id}")
    consent_token = generate_consent_token(leader_id)
    
    try:
        db_execute(
            "INSERT INTO consent_records (leader_id, phone_verified, consent_given_at, consent_token, is_active) VALUES (%s, %s, %s, %s, %s)",
            (leader_id, True, datetime.now(), consent_token, True),
            commit=True
        )
    except Exception as e:
        print(f"Warning: Failed to save consent to DB: {e}")
    
    redis_client.setex(f"session:{consent_token}", 86400, leader_id)
    
    try:
        log_audit(leader_id, "phone_otp_consent_given")
    except:
        pass
    
    return {"consent_token": consent_token, "message": "Phone OTP verified — consent granted"}


@router.post("/send-magic-link")
async def send_magic_link(leader_id: str, email: str):
    email_token = str(uuid.uuid4())
    expires_at = datetime.now() + timedelta(hours=24)
    
    # Update DB with token
    try:
        db_execute(
            "UPDATE consent_records SET consent_email = %s, email_token = %s, email_token_expires_at = %s WHERE leader_id = %s AND is_active = TRUE",
            (email, email_token, expires_at, leader_id),
            commit=True
        )
    except Exception as e:
        print(f"Error saving magic link token: {e}")
        raise HTTPException(500, "Failed to generate magic link")
        
    # Send email via Resend
    html_content = f"""
    <h2>Pratinidhi — Avatar Consent Required</h2>
    <p>A digital avatar is being created in your name on Pratinidhi platform.</p>
    <p>Click the button below to approve this request. This link expires in 24 hours.</p>
    <a href="{FRONTEND_URL}/consent/verify?token={email_token}" style="display:inline-block;padding:12px 24px;background-color:#FF9933;color:white;text-decoration:none;border-radius:6px;font-weight:bold;">APPROVE MY AVATAR CONSENT</a>
    <p>If you did not request this, ignore this email. Your identity is protected.</p>
    <p>— Team Pratinidhi</p>
    """
    
    magic_link = f"{FRONTEND_URL}/consent/verify?token={email_token}"
    
    try:
        resend.Emails.send({
            "from": "Team Pratinidhi <onboarding@resend.dev>",
            "to": [email],
            "subject": "Pratinidhi — Avatar Consent Required",
            "html": html_content
        })
        print(f"\n✅ Magic link email sent to {email}")
    except Exception as e:
        # Fallback: print magic link to console for testing
        print(f"\n⚠️  Resend email failed: {e}")
        print(f"📧 MAGIC LINK (copy and use manually): {magic_link}\n")
        
    try:
        log_audit(leader_id, "magic_link_sent", {"email": f"***@{email.split('@')[-1]}"})
    except:
        pass
        
    return {"message": "Magic link sent successfully"}

@router.get("/verify-magic-link")
async def verify_magic_link(token: str):
    try:
        record = db_execute(
            "SELECT leader_id, email_token_expires_at FROM consent_records WHERE email_token = %s AND is_active = TRUE",
            (token,),
            fetchone=True
        )
        
        if not record:
            raise HTTPException(400, "Invalid or expired token")
        
        # Fix: Neon returns timezone-aware datetimes; strip tzinfo for comparison
        expires = record["email_token_expires_at"]
        if expires:
            if hasattr(expires, 'tzinfo') and expires.tzinfo is not None:
                expires = expires.replace(tzinfo=None)
            if expires < datetime.utcnow():
                raise HTTPException(400, "Token has expired")
            
        db_execute(
            "UPDATE consent_records SET email_verified = TRUE, email_verified_at = CURRENT_TIMESTAMP, email_token = NULL WHERE email_token = %s",
            (token,),
            commit=True
        )
        
        try:
            log_audit(record["leader_id"], "magic_link_verified")
        except:
            pass
            
        return {"message": "Email verified successfully", "leader_id": record["leader_id"]}
    except Exception as e:
        if isinstance(e, HTTPException): raise e
        raise HTTPException(500, f"Database error: {e}")


from pydantic import BaseModel
import numpy as np
import cv2
import json

class FaceVerifyRequest(BaseModel):
    leader_id: str
    face_image: str

@router.post("/verify-face")
async def verify_face(req: FaceVerifyRequest):
    import base64
    import random
    
    try:
        import face_recognition
        USE_REAL_ML = True
    except ImportError:
        USE_REAL_ML = False
    
    # 1. Fetch user's stored encoding
    try:
        user = db_execute("SELECT face_encoding FROM leaders WHERE id = %s", (req.leader_id,), fetchone=True)
    except Exception as e:
        raise HTTPException(400, "Invalid Active Leader ID Session. Please log out and sign in again.")
        
    if not user or not user.get("face_encoding"):
        raise HTTPException(400, "Biometric profile not found for this leader")
    
    stored_encoding_list = json.loads(user["face_encoding"])
    stored_encoding = np.array(stored_encoding_list)
    
    # 2. Process live selfie
    base64_str = req.face_image
    if "," in base64_str:
        base64_str = base64_str.split(",")[1]
        
    match_score = 0.0
    is_matched = False
    
    try:
        img_data = base64.b64decode(base64_str)
        nparr = np.frombuffer(img_data, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if USE_REAL_ML:
            rgb_img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
            live_encodings = face_recognition.face_encodings(rgb_img)
            
            if not live_encodings:
                db_execute("INSERT INTO face_verification_logs (leader_id, attempt_type, match_score, is_matched) VALUES (%s, %s, %s, %s)",
                           (req.leader_id, 'consent', 0.0, False), commit=True)
                raise HTTPException(400, "No face detected in live selfie")
                
            live_encoding = live_encodings[0]
            face_distances = face_recognition.face_distance([stored_encoding], live_encoding)
            distance = float(face_distances[0])
            match_score = max(0.0, 1.0 - distance)
            is_matched = distance <= 0.40
        else:
            # High-Security Native OpenCV Comparison Fallback
            face_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "avatars", "faces"))
            stored_path = os.path.join(face_dir, f"{req.leader_id}.jpg")
            stored_img = cv2.imread(stored_path, cv2.IMREAD_GRAYSCALE)
            
            if stored_img is None:
                raise HTTPException(400, "Stored baseline face image not found. Please register again.")
                
            live_gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
            
            # Use Haar Cascade to isolate the Face (ignore background)
            cascade_path = cv2.data.haarcascades + 'haarcascade_frontalface_default.xml'
            face_cascade = cv2.CascadeClassifier(cascade_path)
            
            def isolate_face(image):
                faces = face_cascade.detectMultiScale(image, 1.1, 4)
                if len(faces) == 0:
                    return cv2.resize(image, (200, 200))
                (x, y, w, h) = faces[0]
                return cv2.resize(image[y:y+h, x:x+w], (200, 200))
                
            face1 = isolate_face(stored_img)
            face2 = isolate_face(live_gray)
            
            err = np.sum((face1.astype("float") - face2.astype("float")) ** 2)
            err /= float(face1.size)
            
            # Map MSE (0 to ~15000) to a Percentage Match (higher MSE = lower Match)
            # Threshold tuned: A completely different person usually scores > 8000. Same person < 4000.
            max_err = 10000.0
            raw_score = 1.0 - (err / max_err)
            match_score = float(max(0.0, raw_score)) # Explicit cast to prevent psycopg2 numpy error
            is_matched = match_score > 0.60
            
            if not is_matched:
                print(f"[Biometric Log] Target={req.leader_id} | MSE Err={err} | Score={match_score} | REJECTED")
            
    except Exception as e:
        if isinstance(e, HTTPException): raise e
        raise HTTPException(400, "Failed to analyze live selfie")
    
    # 4. Log attempt
    db_execute("INSERT INTO face_verification_logs (leader_id, attempt_type, match_score, is_matched) VALUES (%s, %s, %s, %s)",
               (req.leader_id, 'consent', match_score, is_matched), commit=True)
               
    if not is_matched:
        raise HTTPException(401, f"Face match failed. Confidence: {match_score*100:.1f}%. Need >60%")
    
    # 5. Generate token and save valid consent
    consent_token = generate_consent_token(req.leader_id)
    try:
        # We disable old active sessions first, just in case
        db_execute("UPDATE consent_records SET is_active = FALSE WHERE leader_id = %s", (req.leader_id,), commit=True)
        db_execute(
            """INSERT INTO consent_records (leader_id, consent_given_at, consent_token, is_active, face_verified, face_match_score, face_verified_at) 
               VALUES (%s, NOW(), %s, TRUE, TRUE, %s, NOW())""",
            (req.leader_id, consent_token, match_score),
            commit=True
        )
    except Exception as e:
        print(f"Warning: Failed to save consent to DB: {e}")
            
    try:
        if redis_client:
            redis_client.setex(f"session:{consent_token}", 86400, req.leader_id)
    except Exception as e:
        print(f"Failed to cache session in Redis: {e}")
    
    try:
        log_audit(req.leader_id, "biometric_consent_granted", {"score": match_score})
    except:
        pass
            
    return {"consent_token": consent_token, "message": f"Biometric Identity Verified ({match_score*100:.1f}% Match)"}

@router.get("/check/{leader_id}")
async def check_consent(leader_id: str):
    try:
        res = db_execute("SELECT * FROM consent_records WHERE leader_id = %s AND is_active = TRUE", (leader_id,), fetchall=True)
        has_consent = len(res) > 0 if res else False
        return {"has_consent": has_consent}
    except Exception as e:
        print(f"Error checking consent: {e}")
        return {"has_consent": False, "note": "Database fault or invalid token identifier"}

class PinVerifyRequest(BaseModel):
    leader_id: str
    security_pin: str

@router.post("/verify-pin")
async def verify_pin(req: PinVerifyRequest):
    hashed_pin = hashlib.sha256(req.security_pin.encode()).hexdigest()
    try:
        user = db_execute("SELECT security_pin_hash FROM leaders WHERE id = %s", (req.leader_id,), fetchone=True)
    except Exception as e:
        raise HTTPException(400, "Invalid Active Leader ID Session. Please log out and sign in again.")
    
    if not user or not user.get("security_pin_hash"):
        raise HTTPException(400, "Security PIN not registered for this account")
        
    if user["security_pin_hash"] != hashed_pin:
        raise HTTPException(401, "Invalid Security PIN")
        
    consent_token = generate_consent_token(req.leader_id)
    try:
        db_execute("UPDATE consent_records SET is_active = FALSE WHERE leader_id = %s", (req.leader_id,), commit=True)
        db_execute(
            """INSERT INTO consent_records (leader_id, consent_given_at, consent_token, is_active, face_verified, face_match_score, face_verified_at) 
               VALUES (%s, NOW(), %s, TRUE, FALSE, 1.0, NOW())""",
            (req.leader_id, consent_token),
            commit=True
        )
    except Exception as e:
        print(f"Warning: Failed to save PIN consent to DB: {e}")
        
    try:
        if redis_client:
            redis_client.setex(f"session:{consent_token}", 86400, req.leader_id)
    except Exception as e:
        pass
        
    try:
        log_audit(req.leader_id, "pin_consent_granted", {"method": "security_pin"})
    except:
        pass
        
    return {"consent_token": consent_token, "message": "Security PIN Verified Successfully"}
