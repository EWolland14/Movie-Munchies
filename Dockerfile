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
# Stage 2: Serve API & Web with Node.js
# ==========================================
FROM node:22-alpine

WORKDIR /app

ENV PORT=8080
ENV NODE_ENV=production

# Install only production dependencies
COPY package*.json ./
RUN npm ci --omit=dev || npm install --omit=dev

# Copy compiled static Vite assets from builder stage
COPY --from=builder /app/dist ./dist

# Copy backend server script
COPY server.js ./

# Create data directory for persistent movie-munchies-db
RUN mkdir -p data

EXPOSE 8080

CMD ["node", "server.js"]
