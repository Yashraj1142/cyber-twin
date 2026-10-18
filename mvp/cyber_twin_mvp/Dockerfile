FROM node:24-alpine AS dashboard-build

WORKDIR /dashboard
COPY dashboard/package.json dashboard/package-lock.json ./
RUN npm ci
COPY dashboard/public ./public
COPY dashboard/src ./src
RUN npm run build

FROM python:3.12-slim

WORKDIR /app
COPY backend/requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt
COPY backend/main.py ./main.py
COPY backend/red_agent.py ./red_agent.py
COPY agents ./agents
COPY --from=dashboard-build /dashboard/build ./static

RUN useradd --system --uid 10001 --create-home appuser
USER 10001:10001

EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
