FROM node:lts-alpine
# Set a work directory
WORKDIR /usr/src/app
# Install app dependencies
COPY package*.json ./
RUN npm install
# Grab the actual code
COPY . .
# Build JS from TS (and lint + test on the way)
RUN npm run build
# Map our port
EXPOSE 8000
# Start (use CMD for CLI interactivity)
CMD ["npm", "start"]



