import os
from twilio.rest import Client
from dotenv import load_dotenv

load_dotenv()

account_sid = os.getenv("Account_SID")
auth_token = os.getenv("Auth_Token")
from_wa = os.getenv("TWILIO_WHATSAPP_NUMBER")
to_wa = "+918600504553"

print(f"SID: {account_sid[:5]}... TOKEN: {auth_token[:5]}... FROM: {from_wa}")

print("Testing Twilio WhatsApp...")
try:
    client = Client(account_sid, auth_token)
    message = client.messages.create(
        body="Pradhan Mantri Ayushman Yojana registration has been started.",
        from_=from_wa,
        to=f"whatsapp:{to_wa}"
    )
    print(f"Success! Message SID: {message.sid}")
except Exception as e:
    print(f"Failed: {e}")
