import sys
import os

sys.path.insert(0, ".")
from database import db_execute

print("Starting Security PIN migration...")

try:
    db_execute("ALTER TABLE leaders ADD COLUMN IF NOT EXISTS security_pin_hash TEXT", commit=True)
    print("Successfully added security_pin_hash column to leaders table.")
except Exception as e:
    print(f"Failed to execute migration: {e}")
