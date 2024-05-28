# Base image for Node.js application
FROM node:18-alpine

# Working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy BullMQ worker code and remaining application files
COPY . .

# Expose port for the worker (adjust if needed)
EXPOSE 5000 

# Start the worker script
CMD [ "node", "worker.js" ] 
