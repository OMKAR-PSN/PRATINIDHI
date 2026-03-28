from database import db_execute
try:
    cols = db_execute("SELECT id, receiver_name, language FROM leader_receivers", fetchall=True)
    with open('test_langs.txt', 'w') as f:
        for c in cols:
            f.write(str(c) + '\n')
except Exception as e:
    print(e)
