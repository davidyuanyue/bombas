# Build stage
FROM node:20-alpine as build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .


# Expose port the port
EXPOSE 5555

# Start nginx
CMD ["npm", "run", "dev"] 