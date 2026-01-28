# Use an official lightweight Python image
FROM python:3.9-slim

# Set the working directory inside the container
WORKDIR /app

# Copy requirements first (better for caching)
COPY requirements.txt .

# Install dependencies
# We add --no-cache-dir to keep the image small
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the backend code
COPY . .

# Expose the Flask port
EXPOSE 5600

# Run the Flask application
CMD ["python", "app.py"]