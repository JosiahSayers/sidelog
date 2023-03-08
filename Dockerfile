FROM node:18-slim

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./
RUN npm install
RUN ls ./node_modules

COPY . .
RUN npm run build

ENV NODE_ENV production

CMD ["npm", "run", "start"]
