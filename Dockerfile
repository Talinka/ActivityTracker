# Multi-stage build for Node.js application
FROM node:20-alpine AS builder

RUN mkdir /app
WORKDIR /app

ADD backend /app/backend
ADD frontend /app/frontend
ADD models /app/models

RUN (cd frontend; npm i)
RUN (cd backend; npm i)
RUN (cd frontend; npm run build)
RUN (cd backend; npm run build)

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
COPY data/ /default_data
COPY run.sh /app/run.sh

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Change ownership of app directory
RUN chown -R nextjs:nodejs /app /data

# Switch to non-root user
#USER nextjs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1


ENV NODE_ENV=production
ENV EXERCIZE_TRACKER_DATA_DIR=/data
# Start the application
CMD ["sh", "run.sh"]