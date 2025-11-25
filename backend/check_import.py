import os
import sys

print(f"CWD: {os.getcwd()}")
print(f"Path: {sys.path}")
try:
    import app

    print(f"Imported app successfully: {app}")
    from app import database

    print(f"Imported app.database successfully: {database}")
except ImportError as e:
    print(f"Import failed: {e}")
    sys.exit(1)
except Exception as e:
    print(f"Error: {e}")
    sys.exit(1)
