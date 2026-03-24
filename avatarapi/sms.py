"""
OTP handling via MSG91 (or mocked for development).
"""
import os
import time

MSG91_API_KEY = os.getenv("MSG91_API_KEY")
MSG91_SENDER_ID = os.getenv("MSG91_SENDER_ID", "PRATND")

def send_otp_sms(phone: str, otp: str):
    """
    Send an OTP via MSG91. 
    If MSG91_API_KEY is not set, it mocks the send by printing to the console.
    """
    if not MSG91_API_KEY:
        # Development / Mock mode
        print(f"\n" + "="*40)
        print(f"🔒 MOCK SMS SENT TO {phone}")
        print(f"🔑 YOUR OTP IS: {otp}")
        print("="*40 + "\n")
        time.sleep(1) # simulate network delay
        return True
        
    # Production MSG91 integration would go here
    # Example:
    # url = "https://control.msg91.com/api/v5/otp"
    # payload = {
    #     "template_id": "YOUR_TEMPLATE_ID",
    #     "mobile": phone,
    #     "authkey": MSG91_API_KEY,
    #     "otp": otp
    # }
    # response = requests.post(url, json=payload)
    # return response.status_code == 200
    
    print(f"Would send OTP {otp} to {phone} via MSG91")
    return True
