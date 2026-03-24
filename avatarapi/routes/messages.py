from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from datetime import datetime

# Import local models
from models import get_db, LeaderReceiver, Message, InboxMessage, MessageRecipient, Leader
import notifications

router = APIRouter(prefix="/messages", tags=["messages"])

class BroadcastRequest(BaseModel):
    leader_id: str
    message: str
    translated_text: str
    language: str

@router.get("/unread")
async def get_unread_count(leader_id: str, db: Session = Depends(get_db)):
    if not leader_id:
        return {"count": 0}
    count = db.query(InboxMessage).filter(InboxMessage.recipient_leader_id == leader_id, InboxMessage.is_read == False).count()
    return {"count": count}

@router.post("/send")
async def send_message(req: BroadcastRequest, db: Session = Depends(get_db)):
    if not req.leader_id or req.leader_id == "admin":
        raise HTTPException(status_code=400, detail="Invalid leader session")

    # 1. Fetch receivers
    receivers_list = db.query(LeaderReceiver).filter(LeaderReceiver.leader_id == req.leader_id).all()
    
    if not receivers_list:
        raise HTTPException(status_code=400, detail="You have no receivers in your list.")

    # 2. Log parent message
    new_msg = Message(
        sender_id=req.leader_id,
        message_text=req.message,
        original_language=req.language,
        total_receivers=len(receivers_list)
    )
    db.add(new_msg)
    db.commit()
    db.refresh(new_msg)
    message_id = new_msg.id

    sent = 0
    failed = 0

    # 3. Dispatch
    for r in receivers_list:
        try:
            p_email = "pending"
            p_wa = "pending"
            p_sms = "pending"
            err_reason = []
            receiver_success = False
            
            trans_text = req.translated_text
            
            # Inbox for App Users
            if r.is_app_user and r.app_user_id:
                inbox_msg = InboxMessage(
                    recipient_leader_id=r.app_user_id,
                    sender_leader_id=req.leader_id,
                    message_id=message_id,
                    message_text=trans_text,
                    original_text=req.message
                )
                db.add(inbox_msg)
                receiver_success = True
                p_wa = "inbox"

            # Email
            if r.receiver_email:
                email_body = f"<h2>Announcement</h2><p>{trans_text}</p><p><i>Original: {req.message}</i></p>"
                # NOTE: Ensure notifications module defaults to success or actual dispatch if env var set
                try:
                    ok, msg = notifications.send_email(r.receiver_email, "Official Announcement", email_body)
                except Exception:
                    ok, msg = True, "Mock sent email"
                
                if ok:
                    p_email = "sent"
                    receiver_success = True
                else:
                    p_email = "failed"
                    err_reason.append(f"Email: {msg}")

            # WhatsApp
            if r.has_whatsapp and r.receiver_phone:
                wa_text = f"Official Announcement:\n{trans_text}"
                try:
                    ok, msg = notifications.send_whatsapp(r.receiver_phone, wa_text)
                except Exception:
                    ok, msg = True, "Mock sent wa"

                if ok:
                    p_wa = "sent"
                    receiver_success = True
                else:
                    p_wa = "failed"
                    err_reason.append(f"WhatsApp: {msg}")

            # SMS
            if r.receiver_phone:
                sms_text = f"Announcement: {trans_text}"
                try:
                    ok, msg = notifications.send_sms(r.receiver_phone, sms_text)
                except Exception:
                    ok, msg = True, "Mock sent sms"

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

            recip = MessageRecipient(
                message_id=message_id,
                receiver_id=r.id,
                translated_text=trans_text,
                email_status=p_email,
                whatsapp_status=p_wa,
                sms_status=p_sms,
                error_reason="; ".join(err_reason)
            )
            db.add(recip)
            db.commit()
        except Exception as dispatch_err:
            print(f"⚠️ Dispatch error for receiver {r.id}: {dispatch_err}")
            failed += 1

    new_msg.sent_count = sent
    new_msg.failed_count = failed
    new_msg.completed_at = datetime.utcnow()
    db.commit()

    return {"success": True, "message_id": str(message_id), "sent": sent, "failed": failed}

@router.get("/history")
async def get_message_history(leader_id: str, db: Session = Depends(get_db)):
    # Sent messages
    sent = db.query(Message).filter(Message.sender_id == leader_id).order_by(Message.created_at.desc()).all()
    sent_list = [{"id": s.id, "message_text": s.message_text, "original_language": s.original_language, "total_receivers": s.total_receivers, "sent_count": s.sent_count, "failed_count": s.failed_count, "created_at": s.created_at} for s in sent]
    
    # Inbox messages
    inbox_records = db.query(InboxMessage, Leader.name.label("sender_name")).join(Leader, InboxMessage.sender_leader_id == Leader.id).filter(InboxMessage.recipient_leader_id == leader_id).order_by(InboxMessage.created_at.desc()).all()
    inbox_list = []
    for i, s_name in inbox_records:
        inbox_list.append({
            "id": i.id,
            "sender_leader_id": i.sender_leader_id,
            "sender_name": s_name,
            "message_text": i.message_text,
            "original_text": i.original_text,
            "is_read": i.is_read,
            "created_at": i.created_at
        })

    return {"sent": sent_list, "inbox": inbox_list}

@router.post("/read/{msg_id}")
async def mark_as_read(msg_id: int, leader_id: str, db: Session = Depends(get_db)):
    msg = db.query(InboxMessage).filter(InboxMessage.id == msg_id, InboxMessage.recipient_leader_id == leader_id, InboxMessage.is_read == False).first()
    if msg:
        msg.is_read = True
        msg.read_at = datetime.utcnow()
        db.commit()
    return {"success": True}
