# Multi-stage build for Node.js application
FROM node:20-alpine AS builder

RUN mkdir /app
WORKDIR /app

# Install packages first:
RUN mkdir -p /app/backend
ADD backend/package.json /app/backend/package.json
RUN (cd backend; npm i)

RUN mkdir -p /app/frontend
ADD frontend/package.json /app/frontend/package.json
RUN (cd frontend; npm i)

# Now copy sources and build apps
ADD backend /app/backend
ADD frontend /app/frontend
ADD models /app/models

RUN (cd frontend; npm run build)
RUN (cd backend; npm run build)

# The main image:
FROM node:20-alpine

# Install curl for health checks
RUN apk add --no-cache curl

# Set working directory
WORKDIR /app

# Create data directory
RUN mkdir -p /data

# Copy backend dependencies and built files
COPY backend/package*.json ./backend/
COPY --from=builder /app/backend/dist ./backend/dist
COPY --from=builder /app/backend/node_modules ./backend/node_modules

# Copy default data files
COPY run.sh /app/run.sh

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Change ownership of app directory
RUN chown -R nextjs:nodejs /app /data

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:${PORT:-3000}/api/health || exit 1

ENV NODE_ENV=production
ENV EXERCIZE_TRACKER_DATA_DIR=/data
# Start the application
CMD ["sh", "run.sh"]
