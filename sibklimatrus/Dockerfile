FROM node:24-bookworm AS build

WORKDIR /app

ENV NUXT_TELEMETRY_DISABLED=1

COPY package.json ./
COPY package-lock.json ./
RUN npm ci

COPY . .

ENV NODE_ENV=production
ENV NITRO_HOST=0.0.0.0
ENV NITRO_PORT=3000

RUN npm run build

FROM node:24-bookworm AS runtime

WORKDIR /app

ENV NODE_ENV=production
ENV NITRO_HOST=0.0.0.0
ENV NITRO_PORT=3000
ENV NUXT_TELEMETRY_DISABLED=1

COPY --from=build /app/.output ./.output

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
