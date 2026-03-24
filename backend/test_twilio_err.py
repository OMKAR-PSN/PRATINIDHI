import os
from dotenv import load_dotenv
from twilio.rest import Client

load_dotenv()

TWILIO_ACCOUNT_SID = os.getenv("Account_SID")
TWILIO_AUTH_TOKEN = os.getenv("Auth_Token")

client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)

messages = client.messages.list(limit=20)
with open("twilio_out.txt", "w") as f:
    f.write("Recent failed messages:\n")
    for record in messages:
        if record.status in ['failed', 'undelivered']:
            f.write(f"To: {record.to}, Status: {record.status}, Error Code: {record.error_code}, Error Message: {record.error_message}\n")
    f.write("Done checking.\n")
