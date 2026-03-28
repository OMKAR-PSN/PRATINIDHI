from database import db_execute
try:
    cols = db_execute("SELECT column_name, column_default FROM information_schema.columns WHERE table_name = 'message_recipients'", fetchall=True)
    with open('test_schema_recipients.txt', 'w') as f:
        for c in cols:
            f.write(str(c) + '\n')
except Exception as e:
    print(e)
