import os
import socket
import subprocess
import time


def find_free_port(start_port: int = 8000, max_port: int = 9000) -> int:
    for port in range(start_port, max_port):
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            try:
                s.bind(("", port))
                return port
            except OSError:
                continue
    raise OSError("No free ports found")


def main() -> None:
    # Find ports for backend and frontend - Avoid 8000/3000 due to Docker conflicts (Kong, Langfuse)
    backend_port = find_free_port(8600, 8900)
    frontend_port = find_free_port(3600, 3900)

    # Make sure they're different
    while frontend_port == backend_port:
        frontend_port = find_free_port(frontend_port + 1)

    print(f"Starting Backend on port {backend_port}...")
    print(f"Starting Frontend on port {frontend_port}...")

    with open("ports.txt", "w") as f:
        f.write(f"{backend_port}\n{frontend_port}")

    env = os.environ.copy()
    env["NEXT_PUBLIC_API_URL"] = f"http://127.0.0.1:{backend_port}"

    backend_cmd: list[str] = [
        "uv",
        "run",
        "uvicorn",
        "app.main:app",
        "--reload",
        "--port",
        str(backend_port),
    ]
    frontend_cmd: list[str] = ["npm", "run", "dev"]

    backend_env = env.copy()
    frontend_env = env.copy()
    frontend_env["PORT"] = str(frontend_port)

    processes: list[subprocess.Popen[bytes]] = []
    try:
        # Launch backend
        processes.append(subprocess.Popen(backend_cmd, cwd="backend", env=backend_env))  # noqa: S603

        # Give backend a moment to start
        time.sleep(2)

        # Launch frontend
        processes.append(subprocess.Popen(frontend_cmd, cwd="frontend", env=frontend_env))  # noqa: S603

        # Wait for both processes
        for p in processes:
            p.wait()

    except KeyboardInterrupt:
        print("\nShutting down services...")
        for p in processes:
            p.terminate()


if __name__ == "__main__":
    main()
