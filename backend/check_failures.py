from database import db_execute
from datetime import datetime

def check_recent_failures():
    output = []
    try:
        # Get latest 10 messages
        messages = db_execute("SELECT id, message_text, created_at, sent_count, failed_count FROM messages ORDER BY created_at DESC LIMIT 10", fetchall=True)
        if not messages:
            output.append("No messages found in database.")
        else:
            for msg in messages:
                output.append("="*60)
                output.append(f"Message ID: {msg['id']}")
                output.append(f"Sent: {msg['sent_count']}, Failed: {msg['failed_count']}")
                output.append(f"Created At: {msg['created_at']}")
                output.append(f"Text: {msg['message_text'][:100]}...")
                output.append("-" * 30)

                # Get recipient statuses for this message
                recipients = db_execute(
                    "SELECT receiver_id, email_status, whatsapp_status, sms_status, error_reason FROM message_recipients WHERE message_id = %s",
                    (msg['id'],),
                    fetchall=True
                )

                if not recipients:
                    output.append("  No recipient records found.")
                    continue

                for r in recipients:
                    output.append(f"  Recip ID: {r['receiver_id']} | Email: {r['email_status']} | WA: {r['whatsapp_status']} | SMS: {r['sms_status']}")
                    if r['error_reason']:
                        output.append(f"    Error: {r['error_reason']}")
                output.append("\n")

    except Exception as e:
        output.append(f"Error checking failures: {e}")

    with open("C:\\Users\\aryan\\Documents\\Hackathon\\Pratinidhi_Ai\\backend\\failures_log.txt", "w", encoding="utf-8") as f:
        f.write("\n".join(output))

if __name__ == "__main__":
    check_recent_failures()
