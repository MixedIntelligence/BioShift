# --- Build Stage ---
FROM node:20 AS build

WORKDIR /app

COPY package*.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .
RUN yarn build

# --- Production Stage ---
FROM node:20-alpine AS production

WORKDIR /app

# Install serve to serve the build folder
RUN yarn global add serve

COPY --from=build /app/build ./build

EXPOSE 3000
CMD ["serve", "-s", "build", "-l", "3000"]