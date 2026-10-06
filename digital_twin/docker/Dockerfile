FROM python:3.9-slim

WORKDIR /app

# System dependencies and security controls (or lack thereof for testing)
RUN apt-get update && apt-get install -y curl netcat-openbsd

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 80

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "80"]