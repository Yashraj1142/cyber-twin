FROM node:18-alpine
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy frontend source
COPY public/ ./public/
COPY src/ ./src/

# Build the frontend
RUN npm run build

# Serve with Nginx
FROM nginx:alpine
COPY --from=0 /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]