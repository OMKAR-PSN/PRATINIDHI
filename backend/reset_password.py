"""
Password Reset Utility - Pratinidhi AI
Run as: python reset_password.py
"""
import os
import hashlib
from dotenv import load_dotenv
load_dotenv()
import psycopg2
from psycopg2.extras import RealDictCursor

DATABASE_URL = os.getenv("DATABASE_URL")

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

# ============================
# CONFIGURE BELOW:
TARGET_EMAIL  = "aryandalvi0306@gmail.com"   # Change to whichever email you want to reset
NEW_PASSWORD  = "Admin@1234"                  # Set your desired new password
# ============================

try:
    conn = psycopg2.connect(DATABASE_URL, connect_timeout=10)
    cur = conn.cursor(cursor_factory=RealDictCursor)

    cur.execute("SELECT id, name, email FROM leaders WHERE email = %s", (TARGET_EMAIL,))
    user = cur.fetchone()

    if not user:
        print(f"No account found with email: {TARGET_EMAIL}")
    else:
        new_hash = hash_password(NEW_PASSWORD)
        cur.execute("UPDATE leaders SET password_hash = %s WHERE email = %s", (new_hash, TARGET_EMAIL))
        conn.commit()
        print(f"Password reset successful!")
        print(f"  Name:         {user['name']}")
        print(f"  Email:        {user['email']}")
        print(f"  New Password: {NEW_PASSWORD}")
        print(f"\nYou can now log in at http://localhost:3000/login")

    conn.close()
except Exception as e:
    print(f"Failed: {e}")
