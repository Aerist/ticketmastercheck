# Use an official Node.js runtime as the base image
FROM node:20.4.0

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install any needed packages specified in package.json
RUN npm install

# Copy the rest of the application to the working directory
COPY *.js .

# Make port 8080 available to the outside
EXPOSE 8888

# Define the command to run the application
CMD [ "node", "app.js" ]
