FROM node:22-alpine AS deps

WORKDIR /usr/src/app

COPY package*.json ./
COPY node_modules ./node_modules

FROM node:22-alpine

WORKDIR /usr/src/app

COPY --from=deps /usr/src/app ./
COPY server.js ./
COPY public ./public

EXPOSE 3000

CMD ["node", "server.js"]
