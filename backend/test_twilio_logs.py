import os
from twilio.rest import Client
from dotenv import load_dotenv

load_dotenv()

account_sid = os.getenv("Account_SID")
auth_token = os.getenv("Auth_Token")
client = Client(account_sid, auth_token)

messages = client.messages.list(limit=20)

with open("twilio_errors.txt", "w") as f:
    for record in messages:
        f.write(f"SID: {record.sid}\n")
        f.write(f"To: {record.to}\n")
        f.write(f"From: {record.from_}\n")
        f.write(f"Status: {record.status}\n")
        f.write(f"Error Code: {record.error_code}\n")
        f.write(f"Error Message: {record.error_message}\n")
        f.write("-" * 20 + "\n")
