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
RUN cp ./saml.js ./node_modules/passport-saml/lib/node-saml

# Start the application in the container
CMD ["node", "app.js"]
