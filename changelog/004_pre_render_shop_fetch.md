# 004 — Pre-render fetch темы магазина + динамический Shop ID

**Дата:** текущая сессия
**Статус:** не закоммичено

## Что сделано

Реализован механизм загрузки данных и темы магазина **до** фазы рендера React, чтобы исключить FOUC (вспышку нестилизованного контента).

### Новые файлы
- `src/shared/config/shopId.ts` — `getShopId()`: читает ID магазина из `window.WebApp?.initDataUnsafe?.start_param`, fallback → `12`

### Изменённые файлы
- `src/entities/shop/model/shopApi.ts`
  - Удалён захардкоженный `SHOP_ID = 12`
  - Параметр запроса изменён с `void` на `number`
  - Экспортирован `shopApiSlice` для использования в bootstrap
- `src/entities/shop/index.ts` — добавлен экспорт `shopApiSlice`
- `src/entities/shop/model/useShopStyle.ts` — использует `getShopId()`
- `src/pages/shop-detail/ui/ShopDetailPage.tsx` — `useGetShopQuery(getShopId())`
- `src/pages/main/ui/MainPage.tsx` — `useGetShopQuery(getShopId())`
- `src/main.tsx` — добавлена async функция `bootstrap()`:
  1. `store.dispatch(shopApiSlice.endpoints.getShop.initiate(shopId))` — pre-fetch
  2. `applyShopStyle(...)` — применяет CSS переменные синхронно
  3. `createRoot().render()` — рендер только после готовности темы

### Архитектурные решения
- `getShopId()` — ленивая функция (не при импорте) → безопасна к порядку инициализации bridge
- RTK Query кэширует результат → компоненты не делают повторный запрос
- top-level await заменён на `bootstrap()` из-за target `es2020` в vite

## Статистика

| Метрика | Значение |
|---|---|
| Файлов изменено | 7 |
| Новых файлов | 1 |
| Строк добавлено | ~75 |
| Строк удалено | ~15 |
| Итого строк кода | ~90 |
| Токены сессии (approx.) | ~8 000 |
