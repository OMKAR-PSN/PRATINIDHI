from fastapi import APIRouter, HTTPException, File, UploadFile, Depends
from pydantic import BaseModel
from typing import Optional, List
import io
import csv
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

# Import local models
from models import get_db, LeaderReceiver

router = APIRouter(prefix="/receivers", tags=["receivers"])

class ReceiverCreate(BaseModel):
    leader_id: str
    receiver_name: str
    receiver_phone: Optional[str] = None
    receiver_email: Optional[str] = None
    receiver_type: str = "citizen"
    language: str = "hindi"
    state: Optional[str] = None
    district: Optional[str] = None
    has_whatsapp: bool = False
    is_app_user: bool = False

@router.get("/")
async def get_receivers(leader_id: str, db: Session = Depends(get_db)):
    if not leader_id or leader_id == "admin":
        raise HTTPException(status_code=400, detail="Invalid leader session")
    
    try:
        receivers = db.query(LeaderReceiver).filter(LeaderReceiver.leader_id == leader_id).order_by(LeaderReceiver.created_at.desc()).all()
        return [{"id": r.id, "receiver_name": r.receiver_name, "receiver_phone": r.receiver_phone, "receiver_email": r.receiver_email, "language": r.language, "is_app_user": r.is_app_user, "has_whatsapp": r.has_whatsapp, "created_at": r.created_at} for r in receivers]
    except Exception as e:
        print(f"Error fetching receivers: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch receivers from database")

@router.post("/")
async def create_receiver(req: ReceiverCreate, db: Session = Depends(get_db)):
    if not req.leader_id or req.leader_id == "admin":
        raise HTTPException(status_code=400, detail="Invalid leader session")
        
    try:
        new_receiver = LeaderReceiver(
            leader_id=req.leader_id,
            receiver_name=req.receiver_name,
            receiver_phone=req.receiver_phone,
            receiver_email=req.receiver_email,
            receiver_type=req.receiver_type,
            language=req.language,
            state=req.state,
            district=req.district,
            has_whatsapp=req.has_whatsapp,
            is_app_user=req.is_app_user
        )
        db.add(new_receiver)
        db.commit()
        return {"message": "Receiver successfully added to your private list."}
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="This receiver is already registered in your list.")
    except Exception as e:
        db.rollback()
        print(f"Error creating receiver: {e}")
        raise HTTPException(status_code=500, detail="Failed to add receiver to database")


# ============ Column name mapping ============
# Maps various header names to our DB column names
COLUMN_MAP = {
    "full name": "name", "full name *": "name", "name": "name", 
    "receiver_name": "name", "receiver name": "name",
    "phone": "phone", "receiver_phone": "phone", "phone number": "phone", "mobile": "phone",
    "email": "email", "receiver_email": "email", "email address": "email",
    "language": "language", "lang": "language",
    "type": "type", "receiver_type": "type", "citizen": "type",
    "state": "state",
    "district": "district",
    "has whatsapp": "has_whatsapp", "has_whatsapp": "has_whatsapp", "whatsapp": "has_whatsapp",
    "app user": "is_app_user", "is_app_user": "is_app_user", "app": "is_app_user",
}

def normalize_row(raw_row: dict) -> dict:
    mapped = {}
    for key, value in raw_row.items():
        if key is None:
            continue
        clean_key = str(key).strip().lower()
        db_field = COLUMN_MAP.get(clean_key)
        if db_field and value is not None:
            mapped[db_field] = str(value).strip() if value else ""
    return mapped

def parse_bool(val) -> bool:
    if val is None:
        return False
    if isinstance(val, bool):
        return val
    return str(val).strip().lower() in ("true", "yes", "1", "y", "✓", "✅")


def insert_receiver(leader_id: str, row: dict, db: Session) -> bool:
    name = row.get("name")
    if not name:
        return False
    
    phone = row.get("phone") or None
    email = row.get("email") or None
    rtype = row.get("type") or "citizen"
    lang = row.get("language") or "hindi"
    state = row.get("state") or None
    dist = row.get("district") or None
    has_wa = parse_bool(row.get("has_whatsapp"))
    is_app = parse_bool(row.get("is_app_user"))
    
    new_rec = LeaderReceiver(
        leader_id=leader_id,
        receiver_name=name,
        receiver_phone=phone,
        receiver_email=email,
        receiver_type=rtype,
        language=lang,
        state=state,
        district=dist,
        has_whatsapp=has_wa,
        is_app_user=is_app
    )
    db.add(new_rec)
    db.commit()
    return True

@router.post("/upload")
async def upload_receivers(leader_id: str, file: UploadFile = File(...), db: Session = Depends(get_db)):
    if not leader_id or leader_id == "admin":
        raise HTTPException(status_code=400, detail="Invalid leader session")
    
    filename = file.filename.lower()
    is_csv = filename.endswith('.csv')
    is_excel = filename.endswith('.xlsx') or filename.endswith('.xls')
    
    if not is_csv and not is_excel:
        raise HTTPException(status_code=400, detail="Only CSV (.csv) and Excel (.xlsx, .xls) files are supported")

    try:
        content = await file.read()
        rows = []
        
        if is_csv:
            stream = io.StringIO(content.decode('utf-8'))
            reader = csv.DictReader(stream)
            rows = list(reader)
        else:
            # Excel parsing
            import openpyxl
            wb = openpyxl.load_workbook(io.BytesIO(content), read_only=True)
            ws = wb.active
            
            all_rows = list(ws.iter_rows(values_only=True))
            if len(all_rows) < 2:
                raise HTTPException(status_code=400, detail="Excel file is empty or has no data rows")
            
            headers = [str(h).strip() if h else "" for h in all_rows[0]]
            for data_row in all_rows[1:]:
                row_dict = {}
                for i, val in enumerate(data_row):
                    if i < len(headers):
                        row_dict[headers[i]] = val
                rows.append(row_dict)
            wb.close()

        count = 0
        errors = 0
        error_details = []
        
        for idx, raw_row in enumerate(rows, start=2):
            try:
                row = normalize_row(raw_row)
                if insert_receiver(leader_id, row, db):
                    count += 1
                else:
                    errors += 1
                    error_details.append(f"Row {idx}: Missing name")
            except IntegrityError:
                db.rollback()
                errors += 1
                error_details.append(f"Row {idx}: Duplicate entry")
            except Exception as e:
                db.rollback()
                err_str = str(e)
                print(f"Row {idx} error: {e}")
                errors += 1
                error_details.append(f"Row {idx}: {err_str[:60]}")
                
        return {
            "message": f"Successfully imported {count} contacts. ({errors} skipped)",
            "imported": count,
            "skipped": errors,
            "details": error_details[:10]  # First 10 errors
        }
    except HTTPException:
        raise
    except Exception as e:
        print(f"Upload error: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to process file: {str(e)}")
