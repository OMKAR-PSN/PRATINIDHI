import sys
import os
from dotenv import load_dotenv

# Ensure we can import from current dir
sys.path.insert(0, os.getcwd())

# Explicitly load .env
dotenv_path = os.path.join(os.getcwd(), '.env')
print(f"Loading .env from: {dotenv_path}")
print(f"Exists: {os.path.exists(dotenv_path)}")
load_dotenv(dotenv_path)

from database import db_execute

def check_logs():
    try:
        logs = db_execute("SELECT delivered_at, email_status, whatsapp_status, error_reason FROM message_delivery_logs ORDER BY delivered_at DESC LIMIT 5", fetchall=True)
        if not logs:
            print("No delivery logs found.")
            return
            
        print("Recent Delivery Logs:")
        for log in logs:
            print(f"Time: {log['delivered_at']}")
            print(f"Email: {log['email_status']}, WA: {log['whatsapp_status']}")
            print(f"Error: {log['error_reason']}")
            print("-" * 20)
    except Exception as e:
        print(f"Error querying logs: {e}")

if __name__ == "__main__":
    check_logs()
