# Use Node.js LTS version as a base image
FROM node:lts-alpine as build

# Set the working directory in the Docker image
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your application's source code
COPY . .

# Build your application
RUN npm run build
ARG REMOTE_MONGO
ARG ROUNDS
ARG JWT_ACCESS_SECRET
ARG JWT_REFRESH_SECRET
ARG JWT_SIGNUP_SECRET
ENV REMOTE_MONGO=${REMOTE_MONGO}\
    ROUNDS=${ROUNDS}\
    JWT_ACCESS_SECRET=${JWT_ACCESS_SECRET}\
    JWT_SIGNUP_SECRET=${JWT_SIGNUP_SECRET}
# Optionally, start a new stage to create a lean production image
FROM node:lts-alpine
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY package*.json ./
RUN npm ci --only-production
EXPOSE 3000
CMD ["node", "dist/main.js"]
