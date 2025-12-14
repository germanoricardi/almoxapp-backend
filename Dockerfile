FROM node:24-alpine AS builder

# Install timezone data and set timezone to São Paulo
RUN apk add --no-cache tzdata \
  && cp /usr/share/zoneinfo/America/Sao_Paulo /etc/localtime \
  && echo "America/Sao_Paulo" > /etc/timezone

# Create app directory
RUN mkdir -p /app && chown -R node:node /app
WORKDIR /app

# Copy package.json and install dependencies
COPY --chown=node:node package*.json ./
RUN npm install

# Copy application source code
COPY --chown=node:node . .

# Build the application (uncomment for production)
# RUN npm run build

# Use non-root user for security
USER node

# Expose internal NestJS port
EXPOSE 3000

# Start the application (development mode)
CMD [ "npm", "run", "start:dev" ]
