# Use an official Python runtime as a parent image
FROM python:3.10-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set work directory
WORKDIR /usr/src/app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    postgresql-client \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
RUN pip install --upgrade pip
COPY ./requirements.txt /usr/src/app/requirements.txt
RUN pip install -r requirements.txt

# Copy startup scripts
COPY ./entrypoint.sh /entrypoint
COPY ./start.sh /start

# CRITICAL: Convert Windows line endings (CRLF) to UNIX line endings (LF)
RUN sed -i 's/\r$//g' /entrypoint && chmod +x /entrypoint
RUN sed -i 's/\r$//g' /start && chmod +x /start

# Copy the rest of the application code
COPY . /usr/src/app/

# Set the entrypoint
ENTRYPOINT ["/entrypoint"]
