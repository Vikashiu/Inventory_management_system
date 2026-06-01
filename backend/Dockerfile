# Use a lightweight Python base image
FROM python:3.11-slim

# Set the working directory inside the container
WORKDIR /app

# Copy dependencies file first (optimizes Docker caching)
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the backend code
COPY . .

# Expose the port FastAPI runs on
EXPOSE 8000

# Command to run the application dynamically picking up the PORT (for platforms like Railway/Render)
CMD sh -c "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"