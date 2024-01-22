# Node 18.18.0, Alpine Linux is a small distribution image
FROM node:18.18.0-alpine3.18

WORKDIR /app

COPY package*.json ./

RUN npm install

# Copy all files to the work dir
COPY . . 

# Copy config.json.example to config.json
COPY config.json.example config.json

RUN npm rebuild

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]