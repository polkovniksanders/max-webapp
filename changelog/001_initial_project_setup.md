# 001 — Initial project setup

**Коммит:** `f86d2c3`
**Дата:** начало проекта

## Что сделано

Создан базовый скелет Max WebApp с FSD-архитектурой:

- Настройка Vite + React 18 + TypeScript
- HashRouter (для GitHub Pages)
- Redux Toolkit store с 3 слайсами: product, cart, shop
- Path aliases: @app, @pages, @widgets, @features, @entities, @shared
- MAX Bridge: типизация `window.WebApp`, dev mock
- Базовые страницы: MainPage, ProfilePage, ShopPage, ProductPage
- Navbar с 4 табами
- GitHub Actions deploy workflow
- `.gitignore`, `.prettierrc`, `eslint.config.js`

## Статистика

| Метрика | Значение |
|---|---|
| Файлов изменено | ~40 |
| Строк добавлено | ~2 500 |
| Строк удалено | ~50 |
| Итого строк кода | ~2 450 |
| Токены (approx.) | ~12 000 |
