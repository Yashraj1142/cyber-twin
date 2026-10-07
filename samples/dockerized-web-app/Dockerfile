FROM python:3.12-alpine

WORKDIR /app
COPY server.py ./server.py
RUN adduser -D -u 10001 appuser
USER 10001:10001

EXPOSE 8000
CMD ["python", "server.py"]
