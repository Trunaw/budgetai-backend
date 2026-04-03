FROM node:18-alpine
RUN apk add --no-cache openssl openssl-dev
WORKDIR /app
COPY package*.json ./
RUN npm install
RUN chmod +x node_modules/.bin/prisma
COPY . .
RUN node_modules/.bin/prisma generate
EXPOSE 3000
CMD ["node", "src/app.js"]