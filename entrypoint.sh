#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -o errexit
# Pipefail ensures that if any command in a pipeline fails, the whole pipeline fails
set -o pipefail
# Treat unset variables as an error
set -o nounset

# Wait for PostgreSQL to be ready
# We use environment variables with sensible defaults
DB_HOST="${DB_HOST:-db}"
DB_PORT="${DB_PORT:-5432}"
DB_USER="${DB_USER:-postgres}"

echo "Checking PostgreSQL connection status at ${DB_HOST}:${DB_PORT}..."

until pg_isready -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" > /dev/null 2>&1; do
  echo "PostgreSQL database is not ready yet - waiting..."
  sleep 1
done

echo "PostgreSQL database is up and accepting connections!"

# Execute the container's main command
exec "$@"
