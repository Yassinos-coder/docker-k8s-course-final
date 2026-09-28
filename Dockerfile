FROM node:22-alpine

WORKDIR /usr/src/app

COPY package*.json ./
COPY node_modules ./node_modules

COPY server.js ./
COPY public ./public

EXPOSE 8080

CMD ["node", "server.js"]
