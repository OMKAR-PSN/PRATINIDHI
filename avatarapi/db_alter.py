import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

try:
    conn = psycopg2.connect(DATABASE_URL)
    conn.autocommit = True
    cursor = conn.cursor()
    cursor.execute("""
    ALTER TABLE consent_records 
    ADD COLUMN IF NOT EXISTS consent_email TEXT,
    ADD COLUMN IF NOT EXISTS email_token TEXT UNIQUE,
    ADD COLUMN IF NOT EXISTS email_token_expires_at TIMESTAMP,
    ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS email_verified_at TIMESTAMP;
    """)
    print("Database altered successfully!")
    cursor.close()
    conn.close()
except Exception as e:
    print(f"Error altering table: {e}")
