# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY backend/package*.json ./backend/
COPY frontend/package*.json ./frontend/

# Install all dependencies
RUN npm ci
RUN cd backend && npm ci
RUN cd frontend && npm ci

# Copy source code
COPY . .

# Build backend and frontend
RUN cd backend && npm run build
RUN cd frontend && npm run build

# Runtime stage
FROM node:20-alpine

WORKDIR /app

# Install production dependencies only
COPY --from=builder /app/backend/package*.json ./backend/
RUN cd backend && npm ci --only=production

# Copy built files from builder
COPY --from=builder /app/backend/dist ./backend/dist
COPY --from=builder /app/frontend/dist ./frontend/dist

# Copy static files to be served by backend
RUN mkdir -p ./backend/public && cp -r ./frontend/dist/* ./backend/public/

EXPOSE 3001

ENV NODE_ENV=production
ENV PORT=3001

WORKDIR /app/backend

CMD ["node", "dist/server.js"]
