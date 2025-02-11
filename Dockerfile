# Use the latest Node.js LTS version as the base image
FROM node:lts 
# Set the working directory inside the container to /app
WORKDIR /app
# Copy package.json and package-lock.json to the working directory
COPY package.json package-lock.json ./
# Install dependencies listed in package.json
RUN npm install
# Copy the rest of the application code to the working directory
COPY . .
# Build the application
RUN npm run build
# Use the latest Nginx image as the base image for serving the built application
FROM nginx:latest
# Copy the custom Nginx configuration file to the appropriate directory
COPY ./nginx/nginx.conf /etc/nginx/nginx.conf
# Copy the built application from the previous stage to the Nginx HTML directory
COPY --from=0 /app/dist /usr/share/nginx/html
# Expose port 80 to allow external access to the Nginx server
EXPOSE 80
# Start Nginx in the foreground (daemon off mode)
CMD ["nginx", "-g", "daemon off;"]