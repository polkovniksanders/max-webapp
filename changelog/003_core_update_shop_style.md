# 003 — Обновление ядра: ShopStyle, Navbar, ProductPage, shared UI

**Коммиты:** `fb40970` (update core), `60760d7` (fix build), `b2ca92a` (update pages), `f01a49f` (update pages 2)
**Дата:** до текущей сессии

## Что сделано

### fix build / update core (fb40970, 60760d7)
- Добавлены `eslint.config.js`, `.prettierrc`, `.prettierignore`
- Добавлен `src/shared/api/index.ts` — базовый `createApi` с `baseUrl`
- `src/shared/hooks/useBackButton.ts` — хук BackButton для MAX Bridge
- Все `index.tsx` страниц переведены с `.ts` на `.tsx`
- Рефакторинг store: удалены cartSlice, productSlice, убраны mock-данные
- `package-lock.json` обновлён (новые зависимости), +1766 строк

### update pages (b2ca92a)
- `CLAUDE.md` — задокументирована вся архитектура проекта (75 строк)
- `src/entities/shop/model/apiTypes.ts` — добавлены типы `ShopStyle`, `ShopStyleColor`, `ShopStyleGradient`, `ShopStyleFont`, `ShopStyleBorderRadius`
- `src/entities/shop/lib/applyShopStyle.ts` — применяет CSS-переменные из ShopStyle на `:root`
- `src/entities/shop/model/useShopStyle.ts` — хук для применения темы магазина
- `src/app/App.tsx` — `useShopStyle()` вызывается в `AppContent`
- `src/pages/cart/` — CartPage (заглушка)
- `src/shared/ui/PageHeader/` — компонент заголовка страницы
- Navbar: рефакторинг стилей и активных вкладок
- ShopDetailPage, MainPage: рефакторинг

### update pages 2 (f01a49f)
- `src/entities/product/ui/ProductCard/` — новый компонент карточки товара
- `src/shared/ui/ErrorState/`, `Skeleton/`, `Spinner/` — переиспользуемые UI-компоненты
- MainPage, CategoriesPage: рефакторинг, вынос ProductCard
- ShopDetailPage: сокращение кода, переиспользование shared/ui

## Статистика

| Метрика | Значение |
|---|---|
| Файлов изменено | 58 |
| Строк добавлено | ~2 726 |
| Строк удалено | ~1 806 |
| Итого строк кода (net) | ~920 |
| Токены (approx.) | ~25 000 |
