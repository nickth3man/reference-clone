import os
import sys

print(f"CWD: {os.getcwd()}")
print(f"Path: {sys.path}")
try:
    import app  # noqa: F401

    print("Imported app successfully")
    from app import database  # noqa: F401

    print("Imported app.database successfully")
except ImportError as e:
    print(f"Import failed: {e}")
except Exception as e:
    print(f"Error: {e}")
