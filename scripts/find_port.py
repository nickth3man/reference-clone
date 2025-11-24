import socket
import sys


def find_free_port(start_port=8000, max_port=9000):
    for port in range(start_port, max_port):
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            try:
                s.bind(("", port))
                return port
            except OSError:
                continue
    raise OSError("No free ports found")


if __name__ == "__main__":
    start_port = int(sys.argv[1]) if len(sys.argv) > 1 else 8000

    print(find_free_port(start_port))
