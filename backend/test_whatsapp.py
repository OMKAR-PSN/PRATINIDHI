import os
from dotenv import load_dotenv
load_dotenv()
from twilio.rest import Client

TWILIO_ACCOUNT_SID = os.getenv("Account_SID")
TWILIO_AUTH_TOKEN = os.getenv("Auth_Token")

try:
    client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
    account = client.api.accounts(TWILIO_ACCOUNT_SID).fetch()
    print(f"Twilio Account Status: {account.status}")
    
    # Try creating a message to a random number to see the error message
    TWILIO_WHATSAPP_NUMBER = os.getenv("TWILIO_WHATSAPP_NUMBER")
    msg = client.messages.create(
        from_=TWILIO_WHATSAPP_NUMBER,
        body="Test message",
        to="whatsapp:+918888888888"
    )
    print("Success:", msg.sid)
except Exception as e:
    print(f"Twilio Error: {e}")
