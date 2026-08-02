#!/bin/sh

# Exit immediately if a command exits with a non-zero status
set -e

echo "Applying Django migrations..."
python manage.py makemigrations
python manage.py migrate

echo "Starting Django development server..."
python manage.py runserver 0.0.0.0:8000
