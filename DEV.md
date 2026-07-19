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

Рабочая форма заявки использует дополнительные переменные:

- `NUXT_STRAPI_API_TOKEN` - приватный Strapi API token с единственным разрешением `Lead.create`;
- `NUXT_PUBLIC_SMART_CAPTCHA_SITE_KEY` - опциональный публичный клиентский ключ Yandex SmartCaptcha;
- `NUXT_SMART_CAPTCHA_SERVER_KEY` - опциональный приватный серверный ключ Yandex SmartCaptcha;
- `NUXT_TELEGRAM_BOT_TOKEN` и `NUXT_TELEGRAM_CHAT_ID` - опциональное уведомление о новой заявке;
- `NUXT_USE_ENV_PROXY=1`, `NUXT_HTTPS_PROXY` и `NUXT_NO_PROXY` - опциональный HTTPS-proxy для server-side `fetch`; internal Strapi и SmartCaptcha должны оставаться в `NUXT_NO_PROXY`;
- `NUXT_LEAD_RATE_LIMIT_MAX` и `NUXT_LEAD_RATE_LIMIT_WINDOW_MS` - лимит попыток с одного IP, по умолчанию 5 запросов за 10 минут.

Серверные ключи и API token нельзя добавлять в `runtimeConfig.public`, логи или Git. Dev Compose читает server-only токен формы из игнорируемого `.env.dev.local`; production Compose этот файл не использует.

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

Карточки, вкладки, KPI, этапы, FAQ, контакты и варианты формы представлены repeatable components, поэтому их порядок задаётся в админке. Логотип, hero, карточки услуг/решений, карта и social preview используют Strapi Media Library. Все media опциональны: без них frontend показывает CSS placeholders, а относительные media URL преобразуются Nuxt в публичный `NUXT_PUBLIC_STRAPI_URL`.

Все top-level компоненты optional. Если отдельная секция отсутствует или не проходит runtime-проверку, Nuxt использует локализованный fallback только для этой секции. Если Strapi полностью недоступен, запись не опубликована или public permission не открыт, вся страница продолжит работать на fallback-контенте из кода.

После первого запуска:

1. Создать администратора в `http://localhost:1337/admin`.
2. Добавить Strapi-локали `ru-RU` и `en`, если их ещё нет. Nuxt использует внутренний код `ru` и преобразует его в `ru-RU` при запросе CMS.
3. Заполнить нужные секции в Single Type `Homepage` отдельно для каждой локали; изображения можно добавить позднее.
4. Опубликовать каждую используемую локаль Homepage.
5. Открыть public permission на чтение `Homepage.find`, если API должен быть доступен без токена.
6. Проверить реальный JSON API и изображения: визуально корректная страница может быть fallback, если CMS не настроена.

Автоматического seed/bootstrap для Homepage пока нет: локали, admin и permission на чистом volume настраиваются вручную. Для русского текстового контента есть явно запускаемый импорт ниже. Dev и production используют разные volumes, поэтому контент между ними автоматически не переносится.

## Форма заявки и мини-CRM

Форма отправляет JSON в Nuxt `POST /api/leads`. Имя ограничено 2–30 символами. Телефонный input использует `maska` с отображением `+7 (###) ###-##-##`, а Nuxt повторно проверяет российский номер и приводит варианты с `7`, `8` или без кода страны к `+7XXXXXXXXXX`. Nuxt также проверяет размер и формат запроса, остальные поля, согласие, honeypot и лимит по IP. Yandex SmartCaptcha работает в best-effort режиме: когда виджет успешно загрузился, UI просит пройти проверку; при отсутствии ключа, ошибке загрузки/сети или любой ошибке server-side проверки CAPTCHA скрывается или пропускается, а заявка всё равно сохраняется. Браузер не получает Strapi API token и не отправляет заявку напрямую в CMS.

`Lead` хранит имя, канонический телефон `+7XXXXXXXXXX`, тип и описание заявки, locale, страницу и UTM-метки, дату согласия и диагностический `captchaStatus`: `passed`, `skipped`, `failed` или `unavailable`. В Strapi Content Manager менеджер меняет статус `new`, `in_progress`, `completed` или `spam`, указывает ответственного и внутреннюю заметку. Публичные permissions для `Lead` должны оставаться закрытыми.

Настройка на новой среде:

1. Опционально создать SmartCaptcha в Yandex Cloud, добавить публичный домен сайта в разрешённые и записать клиентский/серверный ключи в root `.env`. Без ключей форма продолжает работать без CAPTCHA.
2. В Strapi открыть Settings → API Tokens и создать Custom token только с разрешением `Lead.create`. Для dev записать показанное значение как `NUXT_STRAPI_API_TOKEN` в игнорируемый `.env.dev.local`; production token создаётся отдельно и хранится в production secrets/root `.env`.
3. Опционально создать Telegram-бота, добавить его в нужный чат и заполнить `NUXT_TELEGRAM_BOT_TOKEN`/`NUXT_TELEGRAM_CHAT_ID`. Ошибка Telegram не отменяет уже сохранённую заявку.
4. Перезапустить frontend-контейнер, потому что runtime config читается при запуске Nuxt.
5. Отправить реальную тестовую заявку, проверить новую запись в Content Manager и уведомление. После теста удалить запись или пометить её `spam`.

Rate limit хранится в памяти Nuxt-процесса. Это соответствует текущему single-instance MVP, но для нескольких реплик его нужно перенести в общее хранилище. Перед production также нужны утверждённые тексты согласия и политики обработки персональных данных, сроки хранения и порядок удаления заявок.

### Одноразовый импорт русского текста

Экспортёр собирает текущий `ru.ts` fallback в полный Strapi payload, а импортёр обновляет и публикует только `ru-RU`. Английская локаль не меняется; существующий header logo сохраняется. Без `--force` уже существующий русский документ не перезаписывается.

Перед импортом останови Strapi и сделай резервную копию dev SQLite:

```powershell
docker compose -f compose.dev.yaml stop strapi
docker compose -f compose.dev.yaml cp strapi:/app/.tmp/data.db ./sibklimat-strapi/.tmp/data.db.before-homepage-ru.bak
node --no-warnings --experimental-strip-types .\sibklimatrus\scripts\export-homepage-ru.mjs | docker compose -f compose.dev.yaml run --rm -T --no-deps strapi node scripts/import-homepage-ru.mjs --force
docker compose -f compose.dev.yaml start strapi
```

Даже после неуспешного импорта обязательно снова запусти сервис. Затем проверь опубликованный `GET /api/homepage?locale=ru-RU` с полным deep populate и SSR `/`.

## Production compose

Публичный серверный контур с Caddy, автоматическим TLS и запретом индексации dev-поддомена описан отдельно в `DEPLOY.md`. Он запускается через объединение `compose.yaml` и `compose.server.yaml`; production-секреты читаются только из игнорируемого `.env.production`.

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
