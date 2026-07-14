FROM node:24-bookworm

WORKDIR /app

ENV HOST=0.0.0.0
ENV PORT=1337

COPY package.json ./
COPY package-lock.json ./
RUN npm ci

COPY . .

ENV NODE_ENV=production

RUN npm run build

EXPOSE 1337

CMD ["npm", "run", "start"]
