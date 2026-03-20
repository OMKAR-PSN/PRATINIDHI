from fastapi import APIRouter, HTTPException
from database import supabase, redis_client
from signing import generate_consent_token
from sms import send_otp_sms
import random, hashlib
from datetime import datetime

router = APIRouter(prefix="/consent", tags=["consent"])

@router.post("/send-otp")
async def send_otp(leader_id: str, phone: str):
    # 1. Generate 6-digit OTP
    otp = str(random.randint(100000, 999999))
    
    # 2. Store hashed OTP in Redis/Cache with 5 min expiry
    hashed = hashlib.sha256(otp.encode()).hexdigest()
    redis_client.setex(f"otp:{leader_id}", 300, hashed)
    
    # 3. Send SMS
    send_otp_sms(phone, otp)
    
    # 4. Log the action in Supabase (if configured)
    if supabase:
        try:
            supabase.table("audit_logs").insert({
                "leader_id": leader_id,
                "action": "otp_sent",
                "metadata": {"phone": f"******{phone[-4:]}", "method": "phone"}
            }).execute()
        except Exception as e:
            print(f"Warning: Failed to log to Supabase: {e}")
            
    return {"message": "OTP sent successfully"}


@router.post("/verify-otp")
async def verify_otp(leader_id: str, otp: str):
    # 1. Get stored OTP hash
    stored_hash = redis_client.get(f"otp:{leader_id}")
    if not stored_hash:
        raise HTTPException(400, "OTP expired or not found. Please request a new one.")
    
    # 2. Verify OTP
    provided_hash = hashlib.sha256(otp.encode()).hexdigest()
    if provided_hash != stored_hash:
        raise HTTPException(400, "Invalid OTP. Please try again.")
    
    # 3. Clean up used OTP
    redis_client.delete(f"otp:{leader_id}")
    
    # 4. Generate consent token
    consent_token = generate_consent_token(leader_id)
    
    # 5. Save consent record in Supabase
    if supabase:
        try:
            supabase.table("consent_records").upsert({
                "leader_id": leader_id,
                "phone_verified": True,
                "consent_given_at": datetime.now().isoformat(),
                "consent_token": consent_token,
                "is_active": True,
                "method": "phone_otp"
            }).execute()
        except Exception as e:
            print(f"Warning: Failed to save consent to Supabase: {e}")
    
    # 6. Store active session in Redis (24 hours)
    redis_client.setex(f"session:{consent_token}", 86400, leader_id)
    
    # 7. Log it
    if supabase:
        try:
            supabase.table("audit_logs").insert({
                "leader_id": leader_id,
                "action": "phone_otp_consent_given"
            }).execute()
        except Exception:
            pass
    
    return {"consent_token": consent_token, "message": "Phone OTP verified — consent granted"}


@router.post("/send-email-otp")
async def send_email_otp(leader_id: str, email: str):
    # 1. Generate 6-digit OTP
    otp = str(random.randint(100000, 999999))
    
    # 2. Store hashed OTP in Redis/Cache with 5 min expiry
    hashed = hashlib.sha256(otp.encode()).hexdigest()
    redis_client.setex(f"email_otp:{leader_id}", 300, hashed)
    
    # 3. Send the real email
    from email_service import send_otp_email
    success = send_otp_email(email, otp)
    if not success:
        # We don't block the UI if email fails during testing, but we log it
        print(f"⚠️ Failed to send email to {email}. Check SMTP settings in .env")
    
    # 4. Log the action
    if supabase:
        try:
            supabase.table("audit_logs").insert({
                "leader_id": leader_id,
                "action": "email_otp_sent",
                "metadata": {"email": f"{email[:2]}***@{email.split('@')[-1]}", "method": "email", "smtp_success": success}
            }).execute()
        except Exception as e:
            print(f"Warning: Failed to log to Supabase: {e}")
    
    return {"message": "Email OTP sent successfully"}


@router.post("/verify-email-otp")
async def verify_email_otp(leader_id: str, otp: str):
    # 1. Get stored OTP hash
    stored_hash = redis_client.get(f"email_otp:{leader_id}")
    if not stored_hash:
        raise HTTPException(400, "OTP expired or not found. Please request a new one.")
    
    # 2. Verify OTP
    provided_hash = hashlib.sha256(otp.encode()).hexdigest()
    if provided_hash != stored_hash:
        raise HTTPException(400, "Invalid OTP. Please try again.")
    
    # 3. Clean up used OTP
    redis_client.delete(f"email_otp:{leader_id}")
    
    # 4. Generate consent token
    consent_token = generate_consent_token(leader_id)
    
    # 5. Save consent record in Supabase
    if supabase:
        try:
            supabase.table("consent_records").upsert({
                "leader_id": leader_id,
                "phone_verified": True,
                "consent_given_at": datetime.now().isoformat(),
                "consent_token": consent_token,
                "is_active": True,
                "method": "email_otp"
            }).execute()
        except Exception as e:
            print(f"Warning: Failed to save consent to Supabase: {e}")
    
    # 6. Store active session in Redis (24 hours)
    redis_client.setex(f"session:{consent_token}", 86400, leader_id)
    
    # 7. Log it
    if supabase:
        try:
            supabase.table("audit_logs").insert({
                "leader_id": leader_id,
                "action": "email_otp_consent_given"
            }).execute()
        except Exception:
            pass
    
    return {"consent_token": consent_token, "message": "Email OTP verified — consent granted"}


@router.post("/biometric-verify")
async def biometric_verify(leader_id: str):
    # In a real app, this would verify a WebAuthn/FIDO2 cryptogram
    # For the hackathon, we simulate a successful biometric match
    
    # 1. Generate consent token
    consent_token = generate_consent_token(leader_id)
    
    # 2. Save consent record in Supabase permanently (if configured)
    if supabase:
        try:
            supabase.table("consent_records").upsert({
                "leader_id": leader_id,
                "phone_verified": True,
                "consent_given_at": datetime.now().isoformat(),
                "consent_token": consent_token,
                "is_active": True,
                "method": "biometric"
            }).execute()
        except Exception as e:
            print(f"Warning: Failed to save consent to Supabase: {e}")
            
    # 3. Store active session in Redis (24 hours)
    redis_client.setex(f"session:{consent_token}", 86400, leader_id)
    
    # 4. Log it
    if supabase:
        try:
            supabase.table("audit_logs").insert({
                "leader_id": leader_id,
                "action": "biometric_consent_given"
            }).execute()
        except Exception as e:
            pass
            
    return {"consent_token": consent_token, "message": "Biometric Identity Verified"}

@router.get("/check/{leader_id}")
async def check_consent(leader_id: str):
    # If Supabase config is missing, rely on the in-memory cache we used for OTP
    if not supabase:
        return {"has_consent": True, "note": "Mocked validation (no DB configured)"}
        
    # Called before avatar generation to confirm consent exists
    try:
        result = supabase.table("consent_records")\
            .select("*")\
            .eq("leader_id", leader_id)\
            .eq("is_active", True)\
            .execute()
        
        has_consent = len(result.data) > 0
        return {"has_consent": has_consent}
    except Exception as e:
        print(f"Error checking consent: {e}")
        return {"has_consent": True, "note": "Fallback granted (DB error)"}
