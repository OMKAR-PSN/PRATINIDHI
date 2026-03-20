import os
import smtplib
from email.message import EmailMessage
from dotenv import load_dotenv

load_dotenv()

SMTP_SERVER = os.getenv("SMTP_SERVER", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", 587))
SMTP_USER = os.getenv("SMTP_USER", "")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "")

def send_otp_email(to_email: str, otp_code: str) -> bool:
    """
    Sends a beautifully formatted OTP email.
    Requires SMTP_USER and SMTP_PASSWORD to be set in .env
    """
    if not SMTP_USER or not SMTP_PASSWORD:
        print(f"⚠️ Email aborted: SMTP_USER or SMTP_PASSWORD not set in .env")
        print(f"📧 [FALLBACK CONTENT] EMAIL OTP for {to_email}: {otp_code}")
        return False

    msg = EmailMessage()
    msg['Subject'] = f"{otp_code} is your Pratinidhi AI Consent OTP"
    msg['From'] = f"Pratinidhi AI <{SMTP_USER}>"
    msg['To'] = to_email

    html_content = f"""
    <html>
      <body style="font-family: Arial, sans-serif; background-color: #f8fafc; padding: 40px; text-align: center;">
        <div style="background-color: white; padding: 40px; border-radius: 20px; max-width: 500px; margin: 0 auto; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);">
          <h1 style="color: #0b3d91; margin-bottom: 20px;">Pratinidhi AI</h1>
          <p style="color: #64748b; font-size: 16px;">You requested a consent verification code. Please use the following OTP to grant permission for avatar generation:</p>
          <div style="background-color: #eff6ff; border: 2px dashed #3b82f6; border-radius: 12px; padding: 20px; font-size: 32px; font-weight: bold; color: #1d4ed8; margin: 30px 0; letter-spacing: 5px;">
            {otp_code}
          </div>
          <p style="color: #94a3b8; font-size: 14px;">This code will expire in 5 minutes. If you did not request this, please ignore this email.</p>
        </div>
      </body>
    </html>
    """
    msg.set_content(f"Your OTP code is {otp_code}. It expires in 5 minutes.")
    msg.add_alternative(html_content, subtype='html')

    try:
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_USER, SMTP_PASSWORD)
            server.send_message(msg)
        print(f"✅ Email OTP sent successfully to {to_email}")
        return True
    except Exception as e:
        print(f"❌ Failed to send email to {to_email}: {e}")
        return False
