import sys
import os
sys.path.insert(0, ".")
from database import db_execute
import traceback

try:
    res = db_execute("SELECT * FROM consent_records WHERE leader_id = %s AND is_active = TRUE", ("admin",), fetchall=True)
    print("Success:", res)
except Exception as e:
    print("Failed")
    traceback.print_exc()
