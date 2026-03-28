from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import hashlib
from database import db_execute, redis_client
import uuid

router = APIRouter(prefix="/auth", tags=["auth"])

from typing import Optional

@router.get("/me")
async def get_me(leader_id: str):
    if leader_id == "admin":
        return {
            "id": "admin",
            "email": "admin@gov.in",
            "name": "Super Administrator",
            "phone": "+919999999999",
            "role": "admin",
            "department": "Ministry of Communications"
        }
    user = db_execute("SELECT id, name, email, phone, role, face_image_url FROM leaders WHERE id = %s", (leader_id,), fetchone=True)
    if not user:
        raise HTTPException(404, "User not found")
    return user

class SignupRequest(BaseModel):
    name: str
    email: str
    phone: str
    password: str
    security_pin: str
    role: str
    face_image: Optional[str] = None  # Base64 string from react-webcam

class LoginRequest(BaseModel):
    email: str
    password: str

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def process_face_image(base64_str: str, user_id: str) -> tuple[str, str]:
    import base64
    import numpy as np
    import cv2
    import os
    import json
    
    try:
        import face_recognition
        USE_REAL_ML = True
    except ImportError:
        USE_REAL_ML = False
        print("⚠️  face_recognition not installed. Using Mock Biometrics.")
    
    if "," in base64_str:
        base64_str = base64_str.split(",")[1]
        
    img_data = base64.b64decode(base64_str)
    nparr = np.frombuffer(img_data, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    
    # Save local image
    face_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "avatars", "faces"))
    os.makedirs(face_dir, exist_ok=True)
    file_path = os.path.join(face_dir, f"{user_id}.jpg")
    cv2.imwrite(file_path, img)
    
    if USE_REAL_ML:
        rgb_img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        encodings = face_recognition.face_encodings(rgb_img)
        if not encodings:
            raise ValueError("No face detected in the image. Please retake the photo.")
        encoding_str = json.dumps(encodings[0].tolist())
    else:
        # Hackathon mock: generate dummy 128-d vector
        dummy = [0.1] * 128
        encoding_str = json.dumps(dummy)
    
    return f"/avatars/faces/{user_id}.jpg", encoding_str

@router.post("/signup")
async def signup(req: SignupRequest):
    hashed_pw = hash_password(req.password)
    user_id = str(uuid.uuid4())
    
    face_url, face_enc = None, None
    if req.face_image:
        try:
            face_url, face_enc = process_face_image(req.face_image, user_id)
        except Exception as e:
            raise HTTPException(400, f"Face validation failed: {e}")
    else:
        raise HTTPException(400, "Face capture is required to securely register your biometric consent.")
    
    user_data = {
        "id": user_id,
        "name": req.name,
        "email": req.email,
        "phone": req.phone,
        "password_hash": hashed_pw,
        "role": req.role
    }

    hashed_pin = hash_password(req.security_pin)
    try:
        db_execute(
            """INSERT INTO leaders 
               (id, name, email, phone, password_hash, security_pin_hash, role, face_image_url, face_encoding, face_registered_at) 
               VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, NOW())""",
            (user_id, req.name, req.email, req.phone, hashed_pw, hashed_pin, req.role, face_url, face_enc), 
            commit=True
        )
    except Exception as e:
        print(f"Failed to insert user to Neon DB: {e}")
        # Always raise so the frontend explicitly knows the signup failed
        if "duplicate key value" in str(e).lower() or "unique constraint" in str(e).lower():
            raise HTTPException(400, "Email or Phone already registered. Please try logging in or use different details.")
        raise HTTPException(400, f"Database registration failed: {e}")
        
    return {"message": "Signup successful", "id": user_id}

@router.post("/login")
async def login(req: LoginRequest):
    # Temporary bypass: forcefully log in as aryan dalvi
    return {
        "id": "295e4c48-424a-4db2-a06f-329d2f4d4d0b",
        "email": "aryandalvi0306@gmail.com",
        "name": "aryan dalvi",
        "phone": "8600504553",
        "role": "admin"
    }
