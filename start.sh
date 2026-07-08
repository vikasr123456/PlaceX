#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -o errexit
# Pipefail ensures that if any command in a pipeline fails, the whole pipeline fails
set -o pipefail
# Treat unset variables as an error
set -o nounset

echo "Applying Django database migrations..."
python manage.py migrate --noinput

echo "Starting Django development server..."
python manage.py runserver 0.0.0.0:8000
