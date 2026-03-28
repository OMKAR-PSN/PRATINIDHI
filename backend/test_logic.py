class DB:
    def __init__(self):
        self.sent_count = 0
        self.failed_count = 0

def simulate():
    sent = 0
    failed = 0
    
    receivers_list = [
        {"id": 1, "receiver_phone": "123", "has_whatsapp": True, "receiver_email": "a@a.com"},
        {"id": 2, "receiver_phone": "123", "has_whatsapp": True, "receiver_email": "a@a.com"},
        {"id": 3, "receiver_phone": None, "has_whatsapp": False, "receiver_email": None},
        {"id": 4, "receiver_phone": None, "has_whatsapp": False, "receiver_email": None}
    ]
    
    for r in receivers_list:
        try:
            p_email = "pending"
            p_wa = "pending"
            p_sms = "pending"
            err_reason = []
            receiver_success = False
            
            if r.get("receiver_email"):
                # "Email sent" but returns False inside my implementation? No, let's assume ok = False for email
                ok = False
                msg = "Email restriction error"
                if ok:
                    p_email = "sent"
                    receiver_success = True
                else:
                    p_email = "failed"
                    err_reason.append(f"Email: {msg}")

            if r.get("has_whatsapp") and r.get("receiver_phone"):
                # "WhatsApp sent"
                ok = True
                msg = "SID: 123"
                if ok:
                    p_wa = "sent"
                    receiver_success = True
                else:
                    p_wa = "failed"
                    err_reason.append(f"WhatsApp: {msg}")
            
            if r.get("receiver_phone"):
                # "SMS sent"
                ok = True
                msg = "SID: 456"
                if ok:
                    p_sms = "sent"
                    receiver_success = True
                else:
                    p_sms = "failed"
                    err_reason.append(f"SMS: {msg}")
                    
            if receiver_success:
                sent += 1
            else:
                failed += 1
                
        except Exception as e:
            failed += 1
            
    return sent, failed

print(simulate())
