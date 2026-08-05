# EPL Zone

Веб-приложение об Английской Премьер-лиге: матчи, live-счёт, таблица, клубы, игроки, новости, хайлайты и статистика. Интерфейс на русском, мобайл-фёрст, тёмная неоновая тема.

## Структура

- `frontend-next/` — основное приложение (Next.js 16, React 19, TypeScript, Tailwind v4, App Router)
- `frontend/` — ранний статический прототип (HTML/CSS/JS)
- `backend/` — зарезервировано под API/сервисы

## Разделы

`/` главная · `/matches` матчи и детальная страница матча · `/live` · `/table` · `/teams` · `/players` · `/news` · `/highlights` · `/stats` · `/search` · `/login`, `/register`, `/profile`

## Данные

- [football-data.org](https://www.football-data.org) — матчи и турнирная таблица (`src/lib/football-data.ts`)
- [SportAPI7 через RapidAPI](https://rapidapi.com) — составы, игроки, изображения (`src/lib/sportapi.ts`)

## Запуск

```bash
cd frontend-next
npm install
cp .env.local.example .env.local   # заполнить ключи
npm run dev
```

Переменные окружения:

| Переменная | Назначение |
| --- | --- |
| `FOOTBALL_DATA_API_KEY` | токен football-data.org |
| `SPORTAPI_KEY` | ключ RapidAPI с подпиской на SportAPI7 |

Сборка: `npm run build && npm start`. Линт: `npm run lint`.
