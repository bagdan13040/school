# SPS v2

## Настройка окружения
1. Скопируйте `.env.example` в `.env` и заполните значения:
   - `OPENAI_API_KEY` — ключ OpenRouter/OpenAI.
   - `OPENAI_BASE_URL` и `OPENAI_MODEL` можно оставить по умолчанию или заменить на свои.
2. `.env` уже находится в `.gitignore`, поэтому реальные ключи не попадут в репозиторий.

## Установка зависимостей
```powershell
npm install
pip install -r ai_modul/requirements.txt
```

## Запуск
```powershell
npm run dev
```
Команда параллельно поднимает Express-приложение (`app.js`) и FastAPI (`ai_modul/api_server.py`).

## Полезно
- Если ключ не задан, сервис вернёт оффлайн-заглушку `(offline) simulated response ...`.
- На Windows можно воспользоваться `start.bat`, который установит зависимости и запустит приложение.
- В разделе `/info` собраны сведения, обязательные по ФЗ-273 и Постановлению № 582. Данные лежат в `data/school-info.json`, описание реализации — в `docs/compliance.md`.
