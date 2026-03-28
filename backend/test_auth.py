import os
import hashlib
from dotenv import load_dotenv
load_dotenv()
import psycopg2
from psycopg2.extras import RealDictCursor

DATABASE_URL = os.getenv("DATABASE_URL")
TEST_EMAIL = "aryandalvi0306@gmail.com"
TEST_PASS = "Admin@1234"

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

try:
    conn = psycopg2.connect(DATABASE_URL, connect_timeout=10)
    cur = conn.cursor(cursor_factory=RealDictCursor)

    cur.execute("SELECT id, name, email, password_hash FROM leaders WHERE email = %s", (TEST_EMAIL,))
    user = cur.fetchone()

    print(f"Testing Login for: {TEST_EMAIL}")
    if not user:
        print("RESULT: User not found in DB.")
    else:
        print(f"Found User ID: {user['id']}")
        expected_hash = user['password_hash']
        actual_hash = hash_password(TEST_PASS)
        print(f"DB Hash:       {expected_hash}")
        print(f"Input Hash:    {actual_hash}")
        
        if expected_hash == actual_hash:
            print("RESULT: Passwords match! Login SHOULD succeed.")
        else:
            print("RESULT: Passwords DO NOT match!")

    conn.close()
except Exception as e:
    print(f"DB connection failed: {e}")
