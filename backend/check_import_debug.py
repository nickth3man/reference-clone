import sys
import os

# Add the current directory to sys.path so 'app' can be imported
sys.path.append(os.getcwd())

try:
    from app.main import app
    print(f"Successfully imported app.main: {app}")
except Exception as e:
    print(f"Error importing app.main: {e}")
    import traceback
    traceback.print_exc()
