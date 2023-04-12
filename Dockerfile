# Use the official Node.js image as the base image
FROM node:16-alpine

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install the dependencies in the container
RUN npm install

# Copy the application code to the container
COPY . .

# Set the environment variables for the application
ENV NODE_ENV=production
ENV PORT=3030

# Expose the port that the application will listen on
EXPOSE $PORT

# Start the application in the container
CMD ["node", "app.js"]