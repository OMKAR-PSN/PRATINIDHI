from database import db_execute
import json

def introspect_schema():
    tables = ['messages', 'message_recipients', 'message_translations', 'leader_receivers']
    output = []
    
    for table in tables:
        output.append(f"--- Schema for table: {table} ---")
        try:
            # Query to get column information
            query = f"""
                SELECT column_name, data_type, character_maximum_length, is_nullable
                FROM information_schema.columns
                WHERE table_name = '{table}'
                ORDER BY ordinal_position;
            """
            columns = db_execute(query, fetchall=True)
            if columns:
                for col in columns:
                    output.append(f"  {col['column_name']} | {col['data_type']} | Nullable: {col['is_nullable']}")
            else:
                output.append("  Table not found or no columns found.")
        except Exception as e:
            output.append(f"  Error introspecting {table}: {e}")
        output.append("\n")

    with open("C:\\Users\\aryan\\Documents\\Hackathon\\Pratinidhi_Ai\\backend\\schema_introspected.txt", "w", encoding="utf-8") as f:
        f.write("\n".join(output))

if __name__ == "__main__":
    introspect_schema()
