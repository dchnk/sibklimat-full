FROM node:24-bookworm

WORKDIR /app

ENV HOST=0.0.0.0
ENV PORT=1337

COPY package.json ./
COPY package-lock.json ./
RUN npm ci

COPY . .

ARG PUBLIC_URL=http://localhost:1337

ENV NODE_ENV=production
ENV PUBLIC_URL=${PUBLIC_URL}

RUN npm run build

EXPOSE 1337

CMD ["npm", "run", "start"]
