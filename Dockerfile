FROM node:22-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci --omit=dev --no-audit --no-fund

COPY server.js ./
COPY public ./public

EXPOSE 8080

CMD ["node", "server.js"]
