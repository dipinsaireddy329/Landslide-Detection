import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(__file__), 'landslide_detection.db')
SCHEMA_PATH = os.path.join(os.path.dirname(__file__), 'schema.sql')

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    with open(SCHEMA_PATH, 'r') as f:
        conn.executescript(f.read())
    conn.commit()
    conn.close()
    print("[Database] SQLite initialized at:", DB_PATH)

if __name__ == '__main__':
    init_db()
