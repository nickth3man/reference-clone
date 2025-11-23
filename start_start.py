import subprocess
import os
import sys
import time
import socket
import platform

def find_free_port(start_port=8000, max_port=9000):
    for port in range(start_port, max_port):
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            try:
                s.bind(('', port))
                return port
            except OSError:
                continue
    raise IOError("No free ports found")

def main():
    # Find ports for backend and frontend
    backend_port = find_free_port(8000)
    frontend_port = find_free_port(3000)
    
    # Make sure they're different
    while frontend_port == backend_port:
        frontend_port = find_free_port(frontend_port + 1)

    print(f"Starting Backend on port {backend_port}...")
    print(f"Starting Frontend on port {frontend_port}...")

    env = os.environ.copy()
    env["NEXT_PUBLIC_API_URL"] = f"http://127.0.0.1:{backend_port}"
    
    # Start backend
    if platform.system() == "Windows":
        backend_cmd = f"cd backend && uv run uvicorn app.main:app --reload --port {backend_port}"
        frontend_cmd = f"cd frontend && set PORT={frontend_port} && npm run dev"
    else:
        backend_cmd = f"cd backend && uv run uvicorn app.main:app --reload --port {backend_port}"
        frontend_cmd = f"cd frontend && PORT={frontend_port} npm run dev"

    processes = []
    try:
        # Launch backend
        processes.append(subprocess.Popen(backend_cmd, shell=True, env=env))
        
        # Give backend a moment to start
        time.sleep(2)
        
        # Launch frontend
        processes.append(subprocess.Popen(frontend_cmd, shell=True, env=env))
        
        # Wait for both processes
        for p in processes:
            p.wait()
            
    except KeyboardInterrupt:
        print("\nShutting down services...")
        for p in processes:
            p.terminate()

if __name__ == "__main__":
    main()

