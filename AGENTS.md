# SibKlimat: долговременный контекст проекта

Этот файл предназначен для Codex и других инженерных агентов, которые начинают задачу без истории предыдущих сессий. Он фиксирует архитектуру, сквозные контракты и безопасные правила работы. Код, схемы Strapi, конфигурация и фактическое состояние окружения всегда имеют приоритет над этим снимком.

Контекст обновлён 2026-07-14 после перевода всей страницы на управляемый из Strapi контент. Исходной точкой был `main`, commit `cd04bf3` (`cd04bf36ed151cd60a6054547cb90f5c14a14f86`); сама full-CMS миграция на момент обновления находилась в рабочем дереве. Если HEAD или схемы изменились, сначала перепроверь затронутые разделы.

## Что сделать в начале любой задачи

1. Выполни `git status --short` и не перезаписывай пользовательские изменения.
2. Проверь `git rev-parse --short HEAD`; при отличии от маркера выше перечитай релевантные файлы.
3. Работай из корня репозитория, если команда не относится только к одному приложению.
4. Используй `npm`; не добавляй другой пакетный менеджер или lockfile.
5. Не читай и не публикуй секреты без необходимости. Никогда не коммить `.env`, SQLite, uploads, кэши, `node_modules`, `.nuxt`, `.output`, `build` или `dist`.
6. Перед изменением данных CMS выясни среду: host Strapi, dev Compose и production Compose используют разные SQLite и uploads.
7. При изменении CMS-контракта синхронно обновляй Strapi schema, generated types, frontend domain types, mapper, populate query, fallback и widgets.

## Назначение и зрелость

SibKlimat — двуязычный корпоративный SSR-лендинг компании по проектированию, монтажу и обслуживанию систем кондиционирования и вентиляции в Новосибирске.

Текущее состояние — MVP/демо:

- одна адаптивная Nuxt-страница `/`, RU/EN, светлая/тёмная тема;
- весь маркетинговый текст, ссылки, повторяемые карточки, изображения и SEO-макет страницы могут поступать из Strapi;
- словари `ru.ts` и `en.ts` сохранены как безопасный локализованный fallback;
- форма заявки управляется CMS только на уровне подписей и вариантов, но данные никуда не отправляет;
- без заполненного/опубликованного CMS-документа страница остаётся визуально рабочей благодаря fallback, поэтому внешний вид сам по себе не доказывает доступность Strapi;
- реальные контакты, адрес, KPI, гарантии, изображения и маркетинговые утверждения нужно подтвердить до production.

## Карта репозитория

```text
./
├── AGENTS.md                 # этот долговременный контекст
├── package.json              # единая точка команд, npm-only
├── README.md                 # короткий запуск
├── DEV.md                    # практический runbook и CMS workflow
├── compose.dev.yaml          # hot reload, отдельные dev volumes
├── compose.yaml              # production-like build/run
├── .env.example              # имена и placeholder-значения
├── sibklimatrus/             # Nuxt frontend
│   ├── pages/index.vue       # единственный route, SEO и сборка секций
│   ├── entities/landing/page/
│   │   ├── index.ts          # публичный API доменной модели
│   │   └── model/
│   │       ├── types.ts      # нормализованный контракт widgets
│   │       ├── fallback.ts   # локальная модель из i18n
│   │       ├── strapi.ts     # runtime validation/mapper
│   │       ├── strapi-query.ts
│   │       ├── use-landing-page.ts
│   │       └── sections.ts   # ключи старого fallback-контента
│   ├── widgets/landing/      # 8 секций, получают typed content props
│   ├── features/             # theme toggle
│   ├── components/ui/        # shadcn-vue/Reka UI primitives
│   ├── i18n/locales/         # RU/EN fallback
│   ├── app/assets/css/       # Tailwind tokens и landing-классы
│   ├── nuxt.config.ts
│   └── Dockerfile
└── sibklimat-strapi/         # Strapi CMS/API
    ├── src/api/homepage/     # локализованный single type Homepage
    ├── src/components/
    │   ├── landing/          # компоненты секций и карточек
    │   ├── layout/           # header/navigation/footer
    │   └── shared/           # seo/metric/text-item
    ├── config/
    ├── types/generated/      # отслеживаемые Strapi-типы
    └── Dockerfile
```

Старый модуль `entities/landing/header` удалён: отдельного запроса и отдельного header-контракта больше нет. Не восстанавливай его параллельно новой page model.

## Сквозной поток данных

```text
GET /
  -> Nuxt SSR: pages/index.vue
     -> useLandingPage()
        -> один GET {Strapi}/api/homepage
           locale=<current locale>
           explicit deep populate для всех components/media
           timeout 8 секунд
        -> mapStrapiLandingPage()
           unwrap Strapi v5 flat или старый data.attributes
           validate и normalize
           normalize /uploads через public Strapi URL
           CMS section ИЛИ целый fallback section
     -> page передаёт content props всем widgets
     -> useSeoMeta получает CMS SEO, если оно валидно
```

Для SSR используется `runtimeConfig.strapiUrl` (`NUXT_STRAPI_URL`, в Docker обычно `http://strapi:1337`). Для клиентского запроса используется `runtimeConfig.public.strapiUrl` (`NUXT_PUBLIC_STRAPI_URL`, локально `http://localhost:1337`). Относительные media URL всегда превращаются в браузерно-доступные URL через public base. Не подменяй внутренний Docker URL публичным: контейнер и браузер используют разные адреса.

Внутренний код русской локали Nuxt — `ru`, а фактический код русской локали Strapi — `ru-RU`. `useLandingPage()` преобразует `ru` в `ru-RU` только для CMS-запроса. Не удаляй это соответствие и на чистой Strapi-среде создавай именно `ru-RU`; иначе опубликованный русский Homepage будет отвечать `404` для frontend-запроса.

`landingPagePopulateQuery` перечисляет каждый nested component/media path явно. Обычный `populate=*` не заменяет этот контракт. При добавлении вложенности добавляй путь в query. Для конечного media-поля в Strapi 5 передавай boolean `true`, а не `'*'`: звёздочка заставляет Strapi пытаться populate-ить внутреннее поле `related` и endpoint отвечает `400 Invalid key related`.

`mapStrapiLandingPage()` делает атомарный fallback по секциям:

- валидный CMS `hero` и невалидный `services` дадут CMS hero и локальный services;
- частичного merge внутри секции нет;
- пустой обязательный список считается невалидным;
- невалидный enum, media, href или обязательная строка откатывает всю соответствующую секцию;
- CMS `seo` независим и опционален, но domain `seo` всегда заполнен локализованным fallback, чтобы динамический head не удалял meta description при недоступной CMS;
- сетевые/permission/timeout ошибки превращаются в `payload: null`; причина сейчас не выводится в UI и не логируется.

Разрешённые frontend mapper схемы ссылок: `#anchor`, относительный путь с одним начальным `/`, `http://`, `https://`, `tel:`, `mailto:`. `javascript:`, `data:` и protocol-relative `//...` отвергаются.

## Frontend: `sibklimatrus`

### Стек и конфигурация

- Nuxt 3 SSR, Vue 3, TypeScript, npm lockfile.
- Манифест: Nuxt `^3.20.2`; lockfile снимка разрешал Nuxt 3.21.8, Nitro 2.13.4, Vue 3.5.39.
- Tailwind CSS 4, `@nuxtjs/tailwindcss`, shadcn-nuxt, Reka UI, Lucide.
- `@nuxtjs/i18n` 10: `strategy: 'no_prefix'`, default/fallback `ru`, browser detection выключен.
- Поддержаны `ru` и `en`; пользовательского переключателя локали пока нет.
- `pages/index.vue` теперь задаёт реактивный `<html lang>`.
- CMS SEO поддерживает title, description, Open Graph/Twitter image и alt; при отсутствии CMS используются локализованные SEO-ключи из RU/EN fallback. Canonical, hreflang, sitemap и structured data всё ещё не реализованы.
- `NUXT_PUBLIC_SITE_URL` объявлен, но прикладной код его пока не использует.

### Секции страницы

`pages/index.vue` всегда собирает:

1. `LandingHeader`
2. `LandingHero`
3. `LandingServices`
4. `LandingSolutions`
5. `LandingProcess`
6. `LandingFaq`
7. `LandingContact`
8. `LandingFooter`

Корень имеет `id="top"`; штатные якоря — `#services`, `#solutions`, `#process`, `#contact`. Отсутствие top-level CMS component не скрывает секцию, а включает fallback. Если понадобится управление видимостью/порядком секций, это отдельное изменение модели.

### Доменная модель и widgets

- Все widgets принимают обязательный typed prop `content`.
- Marketing copy и повторяемые массивы внутри widgets больше не собираются через `t()`.
- Исключения — технические/a11y строки, которые не входят в текущий CMS-контракт.
- Порядок navigation, services, solution tabs/cards, process steps, FAQ, contacts и select options определяется порядком в Strapi.
- Vue keys строятся из Strapi `documentId/id/slug` и индекса, поэтому повторяющийся slug не ломает render key.
- Значения contact form select должны быть уникальны; mapper откатывает секцию при дубликатах.
- `LandingSolutions` использует уникальный domain `tab.id`, а при смене контента сбрасывает active tab на первый доступный.
- Импорты доменных типов выполняй через `@/entities/landing/page`, не через внутренние model paths.

### Медиа

CMS-изображения поддержаны для:

- SEO social preview;
- logo в header;
- feature panel в hero;
- каждой service card;
- каждой solution card;
- map/media block в contact.

Frontend читает `url`, `alternativeText`, `width`, `height`, `name`, `mime`, `caption`. Явные поля `logoAlt`, `panelImageAlt`, `imageAlt`, `mapImageAlt`, `shareImageAlt` имеют приоритет как отображаемый alt. Относительный `/uploads/...` нормализуется через `NUXT_PUBLIC_STRAPI_URL`.

В CMS все перечисленные изображения, кроме header logo, обязательны внутри добавленной секции. В domain types media остаётся optional, потому что локальный fallback использует существующие CSS placeholders. Header logo и logoAlt опциональны для обратной совместимости.

### Fallback и локализация

- `i18n/locales/ru.ts` и `en.ts` остаются полным локальным fallback страницы.
- `fallback.ts` переводит старые dictionaries/key arrays в тот же `LandingPageContent`, который возвращает CMS mapper.
- При добавлении fallback-карточки меняй `sections.ts` и обе локали синхронно.
- Строка `hello{'@'}sibklimat.ru` в словарях экранирует vue-i18n синтаксис; это не опечатка.
- CMS-запрос повторяется при программной смене locale.
- Top-level components и видимый текст локализованы. Технические `slug`, `href`, option `value`, enum и boolean отдельно не локализованы; поскольку они вложены в locale-specific component tree, проверяй фактические значения обеих локалей и синхронизируй их явно.

### Тема и стили

- Theme mode: `light | dark`, localStorage key `sibklimat:theme-mode`.
- SSR отдаёт light; после mount учитываются localStorage/`prefers-color-scheme`, класс `dark` ставится на `<html>`.
- Возможен light flash; изменения системной темы после mount не отслеживаются.
- `ThemeToggle` находится в `ClientOnly`.
- Основные tokens и reusable classes — `app/assets/css/tailwind.css`.
- Legacy custom classes из `tailwind.config.ts` ранее не попадали в CSS при текущем Tailwind 4/module setup; после любых style-изменений проверяй итоговый production CSS.

### Реально работающие интерактивы

- переключатель темы с сохранением;
- mobile navigation Sheet;
- hero Dialog;
- solution Tabs;
- FAQ Accordion;
- локальное управление Input/Select/Textarea/Checkbox.

### Что frontend пока не делает

- Contact блок не имеет реального submit/API/validation/loading/success/error/anti-spam.
- Consent checkbox не блокирует кнопку.
- Hero «экспресс-подбор» открывает информационный Dialog, не отправляет расчёт.
- UI выбора locale отсутствует.
- Canonical/hreflang/sitemap/structured data отсутствуют.
- Phone input остаётся обычным text без полноценной телефонной семантики.
- Часть scaffold accessibility labels, например `Close`, остаётся статической.
- Пакеты `swiper`, `zod`, `@vee-validate/zod` не используются прикладным кодом; не считай их доказательством реализованной формы.

## Backend/CMS: `sibklimat-strapi`

### Стек и объём

- Strapi 5.33.2, Users & Permissions 5.33.2.
- SQLite через `better-sqlite3` 12.4.1.
- Один локализованный single type `Homepage`, Draft & Publish включён.
- 20 component schemas: 14 landing, 3 layout, 3 shared.
- Стандартные core controller/router/service; нет custom policies, lifecycle hooks, jobs, seed/bootstrap, migrations или tests.
- `src/index.ts` содержит пустые `register()` и `bootstrap()`.
- Generated Strapi types отслеживаются Git.

### Homepage

Top-level поля:

| Поле | Component | Назначение |
|---|---|---|
| `seo` | `shared.seo` | meta title/description/share image |
| `header` | `layout.header` | logo, brand, nav, CTA |
| `hero` | `landing.hero` | offer, CTA, KPI, dialog, image panel |
| `services` | `landing.services` | heading и service cards |
| `solutions` | `landing.solutions` | heading, tabs и cards |
| `process` | `landing.process` | steps и metrics |
| `faq` | `landing.faq` | questions/answers |
| `contact` | `landing.contact` | channels, map image, form copy/options |
| `footer` | `layout.footer` | copyright и note |

Все top-level components опциональны, локализованы и non-repeatable. Это сделано для миграции старого документа и section-level fallback.

Основные nested contracts:

- `shared.seo`: `metaTitle`, `metaDescription`, required image-only `shareImage`, `shareImageAlt`.
- `layout.header`: optional image-only `logo`/`logoAlt`, `brand`, `brandHref`, `tagline`, repeatable navigation min 1, CTA.
- `landing.hero`: section copy, primary/secondary CTA, metrics min 1, dialog texts/items min 1, required panel image/alt, placeholder texts, panel points min 1.
- `landing.services`: section copy, placeholder text, items min 1. Item: `slug`, `iconKey` enum, chip/title/description, required image/alt, points min 1.
- `landing.solutions`: section copy, placeholder, tabs min 1; each tab has slug/label/cards min 1; each card has slug/title/description, required image/alt, points min 1.
- `landing.process`: section copy, steps min 1, metrics min 1.
- `landing.faq`: section copy, items min 1.
- `landing.contact`: section/direct copy, channels min 1, required map image/alt, placeholder copy, required contact form. Channel type enum: phone/email/location/other. Form содержит labels/placeholders, options min 1, agreement и submit labels.
- `layout.footer`: copyright и note.

Visible copy в nested schemas помечен i18n localized. URL/anchor поля — произвольные Strapi strings без schema regex; frontend mapper применяет allowlist. Если ссылки будут потребляться вне этого mapper, добавь backend validation/policy.

### REST-контракт

Core single-type routes:

- `GET /api/homepage`;
- `PUT /api/homepage`;
- `DELETE /api/homepage`.

Frontend не отправляет токен. Для CMS-контента нужна Public permission → Homepage → `find`. Обычный GET читает опубликованную версию. После открытия permission отдельно проверь `?status=draft`; если anonymous drafts недопустимы, закрой сценарий custom policy/route.

Frontend types написаны вручную и не импортируют Strapi generated types. После schema change обязательно:

1. обновить JSON schema;
2. выполнить `npm run strapi -- ts:generate-types` в `sibklimat-strapi`;
3. обновить `types.ts`, `strapi.ts`, `strapi-query.ts`, fallback и widgets;
4. проверить реальный API response для каждой locale;
5. прогнать backend build и frontend production build.

### Чистая CMS-среда

Код не создаёт admin, locale, Homepage, публикации или permission автоматически. На новом volume:

1. создать Strapi admin;
2. добавить/включить Strapi-локали `ru-RU` и `en`;
3. создать Homepage для каждой locale;
4. заполнить все нужные sections, списки и media;
5. опубликовать каждую locale;
6. открыть Public `Homepage.find`, если endpoint должен быть anonymous;
7. проверить JSON endpoint с тем же deep-populate query;
8. проверить страницу и убедиться, что отображён CMS content, а не fallback.

Существующие БД до full-CMS миграции могли содержать только header. Остальные top-level поля опциональны, поэтому старый документ не должен блокировать старт, но новая часть страницы будет fallback до заполнения.

### Backend security/operations

- Custom CORS/rate limiting нет; production defaults требуют отдельного hardening.
- Users & Permissions установлен, хотя frontend accounts не использует; отключи ненужные auth endpoints/permissions.
- `config/server.ts` читает `HOST`, `PORT`, `APP_KEYS`. Compose передаёт `PUBLIC_URL`, но `server.url` его не использует.
- DB config содержит ветки SQLite/PostgreSQL/MySQL, но установлен только SQLite driver.
- Backend TS: `strict: false`, CommonJS, target ES2019.
- Reverse proxy, TLS, backup/restore, data transfer и zero-downtime migration в repo не настроены.

## Окружение и команды

### Требования

- Root `packageManager`: npm 11.6.2.
- Root engines: Node `>=22.18.0 <=24.x.x`, npm `>=10`.
- Воспроизводимый путь — Docker на `node:24-bookworm`.
- На машине снимка доступны Node 24.13.0/24.9.0, но default мог быть 22.17.0. Перед host command проверь `node --version`; при необходимости используй Node 24.13.0.
- Порты: frontend 3000, Strapi/admin 1337.

### Root scripts

| Команда | Назначение |
|---|---|
| `npm run setup` | `npm ci` в Strapi и Nuxt |
| `npm run dev` | dev Compose foreground |
| `npm run dev:detached` | dev Compose в фоне |
| `npm run dev:logs` | dev logs |
| `npm run dev:down` | остановить dev без удаления volumes |
| `npm run dev:clean` | удалить dev containers и все dev volumes, включая БД/uploads |
| `npm run build` | production Docker image build; основной gate |
| `npm run build:source` | host Strapi + Nuxt build; диагностика |
| `npm run build:strapi` | host CMS build |
| `npm run build:frontend` | host Nuxt build |
| `npm run preview` | production-like `up -d --build` |
| `npm run deploy` | то же production-like окружение |
| `npm run preview:down` / `deploy:down` | down без удаления prod volumes |

`preview` и `deploy` используют один Compose project и одни volumes. Dev и production также имеют одинаковые service names и host ports; не держи их одновременно без явной изоляции project/ports.

### Volumes и env

- Host Strapi DB: `sibklimat-strapi/.tmp/data.db`.
- Dev SQLite volume: `strapi_db`; dev uploads: `strapi_dev_uploads`.
- Dev-generated Strapi runtime и server output изолированы в `strapi_runtime:/app/.strapi` и `strapi_dist:/app/dist`. Эти mounts предотвращают белую admin-страницу из-за Windows path separators в host-generated `.strapi/client/index.html` и ускоряют очистку/компиляцию `dist`.
- Dev Strapi использует `strapi develop --no-watch-admin`: backend autoreload сохраняется, но admin собирается статически, потому что Vite middleware через Windows bind mount мог бесконечно держать `/admin/.strapi/client/app.js`. После изменений `src/admin` перезапускай Strapi.
- Production-like SQLite volume: `strapi_data`; uploads: `strapi_uploads`.
- Данные между этими средами не переносятся автоматически.
- Root `.env` используется Compose interpolation; child `sibklimat-strapi/.env` — direct host Strapi.
- На Windows копируй example через `Copy-Item .env.example .env`.

Сетевые переменные:

- `NUXT_STRAPI_URL` — server-side/internal Strapi;
- `NUXT_PUBLIC_STRAPI_URL` — browser/media base;
- `NUXT_PUBLIC_SITE_URL` — объявлен, пока не используется;
- `STRAPI_PUBLIC_URL` передаётся как `PUBLIC_URL`, но пока не подключён к `server.url`.

Root Compose secrets:

- `STRAPI_APP_KEYS`;
- `STRAPI_API_TOKEN_SALT`;
- `STRAPI_ADMIN_JWT_SECRET`;
- `STRAPI_TRANSFER_TOKEN_SALT`;
- `STRAPI_JWT_SECRET`;
- `STRAPI_ENCRYPTION_KEY`.

Не сохраняй значения секретов в этот файл, логи или commit. Placeholder secrets допустимы только локально.

## Проверки

В package manifests нет полноценных scripts `lint`, `typecheck` или `test`; нет CI, unit/E2E/contract tests. Не утверждай, что они проходят.

Минимальные доступные gates:

```powershell
docker compose config --quiet
docker compose -f compose.dev.yaml config --quiet
git diff --check
npm run build
```

Для Strapi schema:

```powershell
cd sibklimat-strapi
npm run strapi -- ts:generate-types
npm run build
```

Снимок full-CMS миграции 2026-07-14:

- Strapi type generation прошла без ошибок;
- Strapi TypeScript/admin build прошёл;
- frontend client и SSR bundles компилировались;
- host Nuxt build на Windows зависал на финализации Nitro даже под Node 24.13, поэтому host exit 0 не был получен и основным gate остаётся Docker build;
- отдельный strict TypeScript check доменной модели/mapper/query прошёл;
- `nuxi typecheck` недоступен, потому что `vue-tsc` не установлен;
- production Docker gate `npm run build` прошёл: успешно собраны образы frontend и Strapi; Nuxt завершил client/SSR/Nitro, Strapi — TypeScript/admin build.

## Как менять контент и контракт

Обычное изменение текста/картинки/порядка:

1. редактировать соответствующую locale Homepage в Strapi admin;
2. загрузить media и заполнить явный alt;
3. опубликовать locale;
4. проверить API и страницу.

Изменение локального аварийного fallback:

1. синхронно изменить RU/EN dictionaries;
2. при изменении повторяемых fallback-наборов обновить `sections.ts`;
3. проверить `fallback.ts`.

Архитектурное изменение поля/секции:

1. schema + generated types;
2. populate path;
3. domain type;
4. runtime mapper/validator;
5. fallback;
6. widget/page;
7. DEV.md и этот файл;
8. backend/frontend build.

## Известные production-блокеры

1. Compose secrets являются placeholders, нужна генерация/ротация.
2. CMS state невоспроизводим: нет seed/bootstrap/export-import runbook.
3. Dev/prod/host БД и uploads раздельны.
4. Contact form ничего не отправляет и не валидирует персональные данные.
5. Демо-контакты, KPI, гарантии и бизнес-утверждения требуют подтверждения.
6. Нет lint/typecheck/tests/CI и автоматического schema↔frontend contract test.
7. Нет healthchecks, rate limiting, backup/restore и migration workflow.
8. Preview и deploy — одна среда с общими volumes.
9. SQLite подходит только для небольшого single instance.
10. Нет locale switch UI и полного SEO pipeline.
11. `NUXT_PUBLIC_SITE_URL` и `STRAPI_PUBLIC_URL` не дают ожидаемого эффекта.
12. Frontend `.dockerignore` не исключал `.env`; не создавай frontend env-файл без проверки build context.
13. Tailwind custom classes/duplicated dev stylesheet требуют production-проверки.
14. CMS fetch имеет timeout, но не имеет retry, observable error или monitoring; fallback скрывает причину.
15. После открытия Public `find` проверь anonymous `?status=draft`.
16. Полностью заполненная секция обязательна для принятия CMS mapper; одна невалидная nested запись включает fallback всей секции.
17. Управления скрытием/перестановкой top-level секций через CMS пока нет.
