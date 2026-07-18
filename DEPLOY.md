# Деплой Strapi и dev-сайта

Эта схема поднимает на одном Linux-сервере:

- Strapi в production mode на отдельном домене, например `cms.example.com`;
- production-сборку Nuxt на dev-поддомене, например `dev.example.com`;
- Caddy как единственную публичную точку входа на портах 80/443 с автоматическим TLS;
- отдельные Docker volumes для SQLite, uploads и сертификатов.

Dev-сайт закрыт от индексации сразу тремя механизмами: `robots.txt`, HTML meta robots и HTTP-заголовком `X-Robots-Tag`. Server Compose принудительно устанавливает `NUXT_PUBLIC_SITE_INDEXABLE=false`, Strapi всегда отдаёт `Disallow: /`, а Caddy добавляет обоим доменам `X-Robots-Tag`.

`robots.txt` и `noindex` не являются защитой доступа. Если dev-сайт содержит закрытые данные, дополнительно включи авторизацию или ограничение по IP на reverse proxy.

## 1. Подготовить DNS и сервер

Требуется Linux-сервер с Docker Engine и Docker Compose plugin. Открой входящие TCP 80/443 и UDP 443. Порты 3000 и 1337 наружу открывать не нужно: Compose привязывает их только к `127.0.0.1`.

Создай A/AAAA-записи обоих доменов на адрес сервера:

- `dev.example.com` → сервер;
- `cms.example.com` → сервер.

Перед первым запуском убедись, что порты 80 и 443 не заняты другим proxy.

## 2. Создать production env

На сервере из корня репозитория:

```bash
cp .env.production.example .env.production
chmod 600 .env.production
```

Замени домены и все `replace-*` значения. Удобная генерация секретов:

```bash
openssl rand -hex 32
```

Для `STRAPI_APP_KEYS` сгенерируй четыре разных значения и запиши их через запятую. Для остальных секретов используй отдельное случайное значение на каждую переменную. Не копируй dev-placeholder и не добавляй `.env.production` в Git.

Обязательные соответствия:

```dotenv
DEV_SITE_DOMAIN=dev.example.com
STRAPI_DOMAIN=cms.example.com
STRAPI_PUBLIC_URL=https://cms.example.com
STRAPI_CORS_ORIGINS=https://dev.example.com
NUXT_PUBLIC_SITE_URL=https://dev.example.com
NUXT_PUBLIC_SITE_INDEXABLE=false
NUXT_PUBLIC_STRAPI_URL=https://cms.example.com
```

`NUXT_STRAPI_URL=http://strapi:1337` должен остаться внутренним Docker URL. Не заменяй его публичным доменом.

## 3. Проверить и запустить

```bash
npm run server:config
npm run server:deploy
```

Первый build может занять несколько минут. Проверка состояния:

```bash
docker compose -f compose.yaml -f compose.server.yaml --env-file .env.production ps
npm run server:logs
```

Ожидаемый результат: `strapi` и `frontend` имеют статус `healthy`, Caddy — `running`. Strapi health endpoint должен отвечать `204`:

```bash
curl -I https://cms.example.com/_health
```

## 4. Инициализировать production Strapi

Открой `https://cms.example.com/admin` и:

1. создай production-администратора;
2. добавь локали `ru-RU` и `en`;
3. создай и опубликуй Homepage для нужных локалей;
4. включи Public → Homepage → `find`;
5. оставь все Public permissions коллекции Lead выключенными;
6. создай Custom API token только с `Lead.create`;
7. запиши токен в `NUXT_STRAPI_API_TOKEN` файла `.env.production`;
8. пересоздай frontend-контейнер командой `npm run server:deploy`.

После включения Public `find` отдельно проверь, что анонимный запрос с `status=draft` не раскрывает черновик.

Если production должен получить текущие dev-данные и media, используй штатный Strapi Data Management (`strapi transfer` либо `export`/`import`) только после резервной копии целевой среды. Не копируй работающий SQLite-файл. Transfer/import может заменить данные назначения, поэтому запускай его отдельной согласованной операцией.

## 5. Проверить запрет индексации и форму

```bash
curl -s https://dev.example.com/robots.txt
curl -sI https://dev.example.com/ | grep -i x-robots-tag
curl -s https://dev.example.com/ | grep -i 'name="robots"'
curl -s https://cms.example.com/robots.txt
curl -sI https://cms.example.com/admin | grep -i x-robots-tag
```

Для dev ожидаются `Disallow: /` и `noindex, nofollow`. Затем отправь одну тестовую заявку, проверь запись в Strapi Content Manager и удали её либо пометь как `spam`.

## 6. Обновление и откат

Перед обновлением сделай согласованную копию базы и uploads. Скрипт на короткое время останавливает только Strapi, копирует SQLite и media в `./backups/<UTC timestamp>/`, а затем запускает Strapi снова:

```bash
npm run server:backup
```

Каталог `backups/` игнорируется Git. Настрой его регулярное шифрованное копирование на другой сервер или object storage и периодически проверяй восстановление. Не используй `down -v`: флаг `-v` удалит production-базу и uploads.

Обычное обновление кода:

```bash
git pull --ff-only
npm run server:config
npm run server:deploy
```

Просмотр логов и остановка без удаления данных:

```bash
npm run server:logs
npm run server:down
```
