import sqlite3
import os

SCHEMA_PATH = os.path.join(os.path.dirname(__file__), 'schema.sql')

def get_db_path() -> str:
    """Return database path, falling back to /tmp if running in serverless / Vercel"""
    if os.environ.get('VERCEL'):
        return '/tmp/landslide_detection.db'
    
    local_path = os.path.join(os.path.dirname(__file__), 'landslide_detection.db')
    try:
        # Check writability
        test_file = os.path.join(os.path.dirname(__file__), '.write_check')
        with open(test_file, 'w') as f:
            f.write('')
        os.remove(test_file)
        return local_path
    except (OSError, PermissionError):
        return '/tmp/landslide_detection.db'

DB_PATH = get_db_path()

def get_db_connection():
    db_path = get_db_path()
    # If db file does not exist yet (e.g. in /tmp on new instance), auto-initialize
    if not os.path.exists(db_path):
        init_db()
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    db_path = get_db_path()
    conn = sqlite3.connect(db_path)
    if os.path.exists(SCHEMA_PATH):
        with open(SCHEMA_PATH, 'r') as f:
            conn.executescript(f.read())
        conn.commit()
    conn.close()
    print("[Database] SQLite initialized at:", db_path)

if __name__ == '__main__':
    init_db()
