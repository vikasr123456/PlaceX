# Use official Node runtime as a parent image
FROM node:20-alpine

# Set work directory
WORKDIR /usr/src/app

# Copy package list and install dependencies
COPY package.json ./
RUN npm install

# Copy application files
COPY . .

# Expose port
EXPOSE 5173

# Start development server
CMD ["npm", "run", "dev"]
