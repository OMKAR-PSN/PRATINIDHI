import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

try:
    conn = psycopg2.connect(DATABASE_URL)
    conn.autocommit = True
    cursor = conn.cursor()
    
    # 1. Update Leaders Table
    print("Updating leaders table...")
    cursor.execute("""
    ALTER TABLE leaders
    ADD COLUMN IF NOT EXISTS face_image_url TEXT,
    ADD COLUMN IF NOT EXISTS face_encoding TEXT,
    ADD COLUMN IF NOT EXISTS face_registered_at TIMESTAMP,
    ADD COLUMN IF NOT EXISTS face_verified BOOLEAN DEFAULT FALSE;
    """)

    # 2. Create face_verification_logs Table
    print("Creating face_verification_logs table...")
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS face_verification_logs (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      leader_id UUID REFERENCES leaders(id),
      attempt_type TEXT,
      match_score FLOAT,
      is_matched BOOLEAN,
      selfie_url TEXT,
      device_info TEXT,
      ip_address TEXT,
      attempted_at TIMESTAMP DEFAULT NOW()
    );
    """)

    # 3. Update Consent Records Table
    print("Updating consent_records table...")
    cursor.execute("""
    ALTER TABLE consent_records
    ADD COLUMN IF NOT EXISTS face_verified BOOLEAN DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS face_match_score FLOAT,
    ADD COLUMN IF NOT EXISTS face_verified_at TIMESTAMP;
    """)

    print("✅ All biometric schema updates completed successfully!")
    cursor.close()
    conn.close()
except Exception as e:
    print(f"❌ Error altering table: {e}")
