FROM node:18.17.0-alpine
WORKDIR /app

# Copy and download dependencies
COPY package.json package-lock.json ./

# Copy the source files into the image
COPY . .
CMD npm start


