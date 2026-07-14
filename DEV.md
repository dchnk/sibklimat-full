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

Dev Compose изолирует Linux-generated каталоги Strapi `.strapi` и `dist` в named volumes. Это важно на Windows: host-сборка создаёт в `.strapi/client/index.html` путь с обратными слешами, из-за которого admin отдаёт белую страницу без JavaScript. Не убирай mounts `strapi_runtime:/app/.strapi` и `strapi_dist:/app/dist`.

Strapi запускается с `--no-watch-admin`: backend schema/API продолжает перезапускаться при изменениях, а admin собирается статически вместо нестабильной on-demand Vite-сборки через Windows bind mount. При изменении `src/admin` перезапусти Strapi-контейнер. Первый запуск после изменения schemas может занять несколько минут; ориентируйся на строку `Strapi started successfully` в `npm run dev:logs`, а не только на статус контейнера `Running`.

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

Фронтенд читает `GET /api/homepage` с явным deep populate и получает весь лендинг из Single Type `Homepage`:

- `seo`;
- `header`;
- `hero`;
- `services`;
- `solutions`;
- `process`;
- `faq`;
- `contact`;
- `footer`.

Карточки, вкладки, KPI, этапы, FAQ, контакты и варианты формы представлены repeatable components, поэтому их порядок задаётся в админке. Логотип, hero, карточки услуг/решений, карта и social preview используют Strapi Media Library. Относительные media URL преобразуются Nuxt в публичный `NUXT_PUBLIC_STRAPI_URL`.

Все top-level компоненты optional. Если отдельная секция отсутствует или не проходит runtime-проверку, Nuxt использует локализованный fallback только для этой секции. Если Strapi полностью недоступен, запись не опубликована или public permission не открыт, вся страница продолжит работать на fallback-контенте из кода.

После первого запуска:

1. Создать администратора в `http://localhost:1337/admin`.
2. Добавить Strapi-локали `ru-RU` и `en`, если их ещё нет. Nuxt использует внутренний код `ru` и преобразует его в `ru-RU` при запросе CMS.
3. Заполнить нужные секции и загрузить изображения в Single Type `Homepage` отдельно для каждой локали.
4. Опубликовать каждую используемую локаль Homepage.
5. Открыть public permission на чтение `Homepage.find`, если API должен быть доступен без токена.
6. Проверить реальный JSON API и изображения: визуально корректная страница может быть fallback, если CMS не настроена.

Seed/bootstrap для Homepage пока нет: контент, локали, публикации и permission на чистом volume настраиваются вручную. Dev и production используют разные volumes, поэтому контент между ними автоматически не переносится.

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
