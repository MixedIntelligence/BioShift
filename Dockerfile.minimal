# Railway Backend Deployment - Simplified without SQLite
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files first for better Docker layer caching
COPY backend/package*.json ./

# Install only production dependencies (exclude better-sqlite3)
RUN npm ci --production --ignore-scripts

# Copy application code
COPY backend/ ./

# Create a simple mock database for Railway deployment
RUN echo 'module.exports = { prepare: () => ({ run: () => ({}), get: () => ({}), all: () => [] }), exec: () => {} };' > models/db.js

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/health || exit 1

# Start the application
CMD ["npm", "start"]
