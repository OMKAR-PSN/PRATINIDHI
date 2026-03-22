import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

try:
    conn = psycopg2.connect(DATABASE_URL)
    conn.autocommit = True
    cursor = conn.cursor()
    cursor.execute("ALTER TABLE leaders ADD COLUMN IF NOT EXISTS email TEXT UNIQUE;")
    cursor.execute("ALTER TABLE leaders ADD COLUMN IF NOT EXISTS password_hash TEXT;")
    print("Columns added successfully!")
    cursor.close()
    conn.close()
except Exception as e:
    print(f"Error altering table: {e}")
