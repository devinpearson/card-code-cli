# Base image of the docker container
FROM node:latest
# Copy the contents of the repo into the /app folder inside the container
COPY . /app
# Update the current working directory to the /app folder
WORKDIR /app
# Add your CLI's installation steps here
RUN npm install && npm link
ENTRYPOINT ["/usr/local/bin/card-emu"]
