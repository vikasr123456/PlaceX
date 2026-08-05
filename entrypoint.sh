#!/bin/sh

# Exit immediately if a command exits with a non-zero status
set -e

# Wait for Redis and MongoDB to be available
if [ "$SUPABASE_DB_HOST" ]; then
    echo "Waiting for Supabase PostgreSQL at $SUPABASE_DB_HOST:$SUPABASE_DB_PORT to accept connections..."
    python << END
import sys
import socket
import time

host = "$SUPABASE_DB_HOST"
port = int("$SUPABASE_DB_PORT")

while True:
    try:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            s.settimeout(1.0)
            s.connect((host, port))
            print("Supabase PostgreSQL is up and accepting connections!")
            sys.exit(0)
    except (socket.timeout, ConnectionRefusedError, OSError):
        print("Supabase PostgreSQL is unavailable - sleeping 1s")
        time.sleep(1)
END
fi

echo "Starting service with Supabase PostgreSQL configuration..."

# Execute the actual service command passed to the container
exec "$@"
