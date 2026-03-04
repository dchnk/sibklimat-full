# Docker запуск

Базовый сценарий для сервера после `git pull`:

```bash
cp .env.example .env
docker compose up -d --build
```

После этого:

- Nuxt: `http://localhost:3000`
- Strapi: `http://localhost:1337/admin`

`compose.yaml` теперь рассчитан на простой прод/preview запуск:

- собирает оба приложения через их `Dockerfile`;
- поднимает Nuxt и Strapi одной командой;
- хранит SQLite базу Strapi в docker volume;
- хранит загруженные файлы Strapi в отдельном docker volume.

Локальная разработка с hot reload:

```bash
docker compose -f compose.dev.yaml up
```

Полезные команды:

```bash
docker compose up -d --build
docker compose logs -f
docker compose down
docker compose down -v
```

`down -v` удалит volumes, включая dev/prod SQLite базу и загруженные файлы.
