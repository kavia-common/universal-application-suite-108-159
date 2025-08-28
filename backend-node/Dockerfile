# Node.js backend Dockerfile
FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --only=production

COPY src ./src

EXPOSE 4000

CMD ["node", "src/server.js"]
