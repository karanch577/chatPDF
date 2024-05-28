# Base image for Node.js application
FROM node:18-alpine

# Working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy remaining application files
COPY . .

# Expose port for the application (adjust if needed)
EXPOSE 4001

# Start the application
CMD [ "npm", "start" ]
