import os
import sys
from dotenv import load_dotenv
load_dotenv()
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from database import db_execute
import hashlib

def check_db():
    print("Checking leaders table...")
    try:
        users = db_execute("SELECT email, password_hash FROM leaders", fetchall=True)
        print(f"Total users in DB: {len(users)}")
        for u in users:
            print(f"Email: {u['email']} | Hash: {u['password_hash']}")
    except Exception as e:
        print(f"DB Error: {e}")

if __name__ == "__main__":
    check_db()
