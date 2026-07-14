# SibKlimat: единая точка входа

Проект управляется из корня репозитория. Внутри остаются два приложения:

- `sibklimatrus` - Nuxt-фронтенд;
- `sibklimat-strapi` - Strapi API и админка.

Пакетный менеджер один: `npm`. Основное окружение для разработки, сборки и деплоя - Docker на Node 24.

## Быстрый локальный запуск

```bash
cp .env.example .env
npm run dev
```

Адреса после запуска:

- Nuxt: `http://localhost:3000`
- Strapi admin: `http://localhost:1337/admin`

Команда `npm run dev` поднимает оба сервиса через `compose.dev.yaml` с hot reload.

## Основные команды

```bash
npm run setup          # поставить зависимости локально в оба приложения
npm run dev            # локальная разработка через Docker Compose
npm run dev:detached   # то же самое в фоне
npm run dev:logs       # логи dev-окружения
npm run dev:down       # остановить dev-окружение
npm run dev:clean      # остановить и удалить dev volumes

npm run build          # собрать production Docker images локально
npm run build:source   # диагностическая host-сборка без Docker
npm run build:strapi   # host-сборка только Strapi
npm run build:frontend # host-сборка только Nuxt

npm run preview        # production-like запуск через compose.yaml
npm run preview:logs   # логи preview/prod compose
npm run preview:down   # остановить preview/prod compose

npm run deploy         # будущая серверная точка входа: build + up -d
npm run deploy:build   # только собрать production Docker images
npm run deploy:logs    # логи production compose
npm run deploy:down    # остановить production compose
```

## Переменные окружения

В Nuxt теперь разделены два Strapi URL:

- `NUXT_STRAPI_URL` - внутренний URL для Nuxt-сервера, в Docker обычно `http://strapi:1337`;
- `NUXT_PUBLIC_STRAPI_URL` - внешний URL для браузера, локально `http://localhost:1337`, на сервере публичный домен API.

Для деплоя обязательно поменять секреты Strapi в `.env`:

- `STRAPI_APP_KEYS`
- `STRAPI_API_TOKEN_SALT`
- `STRAPI_ADMIN_JWT_SECRET`
- `STRAPI_TRANSFER_TOKEN_SALT`
- `STRAPI_JWT_SECRET`
- `STRAPI_ENCRYPTION_KEY`

## Контент Strapi

Фронтенд читает `GET /api/homepage` и использует данные из компонента `header`.
Если Strapi недоступен, запись не опубликована или public permission не открыт,
Nuxt покажет fallback-контент из кода.

После первого запуска:

1. Создать администратора в `http://localhost:1337/admin`.
2. Заполнить и опубликовать Single Type `Homepage`.
3. Открыть public permission на чтение `Homepage.find`, если API должен быть доступен без токена.

## Production compose

`compose.yaml` собирает оба приложения через Dockerfile:

- `sibklimatrus/Dockerfile` - Nuxt production server;
- `sibklimat-strapi/Dockerfile` - Strapi production server.

Данные Strapi сохраняются в Docker volumes:

- `strapi_data` - SQLite база;
- `strapi_uploads` - загруженные файлы.

`npm run deploy:down` не удаляет volumes. Удаление volumes делай только осознанно через Docker Compose с `-v`.

## Host-сборка без Docker

Это не основной путь для проекта. Основная локальная сборка и будущий деплой идут через Docker:

```bash
npm run build
```

Если нужно отлаживать сборку приложений напрямую на машине, используй Node `>=22.18.0 <=24.x.x`.
На текущей машине уже есть Node `24.13.0`:

```bash
nvm use 24.13.0
npm run setup
npm run build:source
```

На Windows host-сборка Nuxt может зависать на финальном шаге Nitro, поэтому корневая команда `npm run build`
намеренно использует Docker, чтобы локальная сборка совпадала с будущим деплоем.
