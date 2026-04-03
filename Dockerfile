FROM node:18-alpine
RUN apk add --no-cache openssl openssl-dev
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN node node_modules/prisma/build/index.js generate
EXPOSE 3000
CMD ["node", "src/app.js"]