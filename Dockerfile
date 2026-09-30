# ==========================================
# Stage 1: Build Vite / React Application
# ==========================================
FROM node:22-alpine AS builder

WORKDIR /app

# Install dependencies first for optimal Docker layer caching
COPY package*.json ./
RUN npm ci || npm install

# Copy source files and build
COPY . .
RUN npm run build

# ==========================================
# Stage 2: Serve Production Assets with Nginx
# ==========================================
FROM nginx:alpine

# Default Cloud Run port
ENV PORT=8080

# Copy compiled static assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy Nginx template. nginx:alpine's built-in entrypoint automatically
# runs envsubst on files in /etc/nginx/templates/ to generate /etc/nginx/conf.d/
COPY nginx.conf.template /etc/nginx/templates/default.conf.template

# Cloud Run defaults to 8080
EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
