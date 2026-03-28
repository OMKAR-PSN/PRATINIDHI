import os
from twilio.rest import Client
import resend

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

# Twilio Config
TWILIO_ACCOUNT_SID = os.getenv("Account_SID")
TWILIO_AUTH_TOKEN = os.getenv("Auth_Token")
TWILIO_WHATSAPP_NUMBER = os.getenv("TWILIO_WHATSAPP_NUMBER")
TWILIO_PHONE_NUMBER = os.getenv("TWILIO_PHONE_NUMBER")

# Resend Config
resend.api_key = os.getenv("RESEND_API_KEY")

def send_whatsapp(to_phone: str, message: str, media_url: str = None) -> (bool, str):
    if not TWILIO_ACCOUNT_SID or not TWILIO_AUTH_TOKEN:
        return False, "Twilio credentials missing"
        
    try:
        client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
        
        # Clean the phone number (remove spaces, etc.)
        clean_phone = "".join(filter(str.isdigit, to_phone))
        
        # Logic: If it's just 10 digits, assume India (+91)
        if len(clean_phone) == 10:
            to_phone = "+91" + clean_phone
        elif not to_phone.startswith("+"):
            to_phone = "+" + clean_phone
            
        if not TWILIO_WHATSAPP_NUMBER.startswith("whatsapp:"):
            from_number = f"whatsapp:{TWILIO_WHATSAPP_NUMBER}"
        else:
            from_number = TWILIO_WHATSAPP_NUMBER
            
        kwargs = {
            "from_": from_number,
            "body": message,
            "to": f"whatsapp:{to_phone}"
        }
        if media_url and "localhost" not in media_url and "127.0.0.1" not in media_url:
            kwargs["media_url"] = [media_url]
            
        msg = client.messages.create(**kwargs)
        return True, f"SID: {msg.sid}"
    except Exception as e:
        return False, str(e)
def send_sms(to_phone: str, message: str) -> (bool, str):
    if not TWILIO_ACCOUNT_SID or not TWILIO_AUTH_TOKEN or not TWILIO_PHONE_NUMBER:
        return False, "Twilio SMS credentials missing"
        
    try:
        client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
        
        # Clean the phone number (remove spaces, etc.)
        clean_phone = "".join(filter(str.isdigit, to_phone))
        if len(clean_phone) == 10:
            to_phone = "+91" + clean_phone
        elif not to_phone.startswith("+"):
            to_phone = "+" + clean_phone
            
        msg = client.messages.create(
            from_=TWILIO_PHONE_NUMBER,
            body=message,
            to=to_phone
        )
        return True, f"SID: {msg.sid}"
    except Exception as e:
        return False, str(e)

def send_email(to_email: str, subject: str, html_body: str) -> (bool, str):
    if not resend.api_key:
        return False, "Resend API key missing"
        
    try:
        params = {
            "from": "Pratinidhi <onboarding@resend.dev>",
            "to": [to_email],
            "subject": subject,
            "html": html_body
        }
        res = resend.Emails.send(params)
        return True, "Email sent"
    except Exception as e:
        return False, str(e)
