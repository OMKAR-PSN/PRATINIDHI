import os
from dotenv import load_dotenv
load_dotenv()
import psycopg2
from psycopg2.extras import RealDictCursor

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    print("ERROR: DATABASE_URL not set in .env")
    exit(1)

try:
    conn = psycopg2.connect(DATABASE_URL, connect_timeout=10)
    cur = conn.cursor(cursor_factory=RealDictCursor)
    cur.execute("SELECT id, name, email, phone, role, created_at FROM leaders ORDER BY created_at DESC LIMIT 20")
    rows = cur.fetchall()
    output_lines = []
    if not rows:
        output_lines.append("No leaders found in the database.")
    else:
        output_lines.append(f"Found {len(rows)} leader(s):\n")
        for r in rows:
            output_lines.append(f"  ID:    {r['id']}")
            output_lines.append(f"  Name:  {r['name']}")
            output_lines.append(f"  Email: {r['email']}")
            output_lines.append(f"  Phone: {r['phone']}")
            output_lines.append(f"  Role:  {r['role']}")
            output_lines.append(f"  Since: {r['created_at']}")
            output_lines.append("")
    conn.close()
    result = "\n".join(output_lines)
    print(result)
    with open("db_users_export.txt", "w", encoding="utf-8") as f:
        f.write(result)
    print("\n[Saved to db_users_export.txt]")
except Exception as e:
    print(f"DB connection failed: {e}")
