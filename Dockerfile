# Use an official Python runtime as a parent image
FROM python:3.9-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set work directory
WORKDIR /app

# Install system dependencies needed for compiling packages like psycopg2
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    gcc \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install dependencies
RUN pip install --upgrade pip
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# Copy project files
COPY . /app/

# Copy entrypoint and start scripts to root as specified
COPY entrypoint.sh /entrypoint
COPY start.sh /start

# Convert Windows CRLF line endings to UNIX LF line endings to prevent Linux containers from crashing
RUN sed -i 's/\r$//g' /entrypoint
RUN sed -i 's/\r$//g' /start

# Make entrypoint and start scripts executable
RUN chmod +x /entrypoint
RUN chmod +x /start

# Set entrypoint
ENTRYPOINT ["/entrypoint"]
