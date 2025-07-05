# Stage 1: Build the React frontend
FROM node:18-alpine AS builder
WORKDIR /app

# Copy package configuration and install all dependencies
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copy the rest of the application source code
COPY . .

# Build the frontend
RUN npm run build

# Stage 2: Create the lightweight production image
FROM node:18-alpine
WORKDIR /app

# Set the environment to production
ENV NODE_ENV=production

# Copy package configuration and install only production dependencies
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production

# Copy backend code
COPY backend/ ./backend/

# Copy built frontend assets from the builder stage
COPY --from=builder /app/build ./build

# Expose the port the backend runs on
EXPOSE 8080

# Command to start the backend server
CMD ["node", "backend/index.js"]