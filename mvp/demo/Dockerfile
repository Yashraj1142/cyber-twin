FROM python:3.12-slim

WORKDIR /app
COPY requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt
COPY app.py ./app.py

RUN useradd --system --uid 10001 --create-home demoapp
USER 10001:10001

EXPOSE 3000
CMD ["python", "app.py"]
