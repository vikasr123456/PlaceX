#!/bin/sh

# Exit immediately if a command exits with a non-zero status
set -e

# Wait for PostgreSQL to be available
if [ "$DB_HOST" ]; then
    echo "Waiting for PostgreSQL at $DB_HOST:$DB_PORT to accept connections..."
    python << END
import sys
import socket
import time

host = "$DB_HOST"
port = int("$DB_PORT" or "5432")

while True:
    try:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            s.settimeout(1.0)
            s.connect((host, port))
            print("PostgreSQL is up and accepting connections!")
            sys.exit(0)
    except (socket.timeout, ConnectionRefusedError, OSError):
        print("PostgreSQL is unavailable - sleeping 1s")
        time.sleep(1)
END
fi

echo "Starting service with PostgreSQL configuration..."

# Execute the actual service command passed to the container
exec "$@"
