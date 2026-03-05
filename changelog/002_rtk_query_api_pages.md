# 002 — RTK Query APIs + страницы Categories, ShopDetail, MainPage

**Коммиты:** `01e389c` → `260b0d5` → `690a5bd`
**Дата:** до текущей сессии

## Что сделано

Подключены реальные API через RTK Query, добавлены новые страницы:

- `src/entities/category/` — `categoriesApi.ts`, типы `ApiCategory`
- `src/entities/product/` — `productsApi.ts`, `apiTypes.ts` с `ApiProduct`, `ApiProductDetail`, `buildImageUrl()`
- `src/entities/shop/` — `shopApi.ts` → `useGetShopQuery()`, `apiTypes.ts` с `ApiShop`, `ShopStyle`
- `src/pages/categories/` — CategoriesPage (реальный API)
- `src/pages/shop-detail/` — ShopDetailPage (реальный API: имя, фото, о магазине)
- `src/pages/main/` — infinite scroll по категориям через `useOnScreen` (IntersectionObserver)
- `src/shared/bridge/` — расширена типизация, добавлен dev mock с `BackButton`
- `src/shared/hooks/useOnScreen.ts` — IntersectionObserver hook
- Роутер обновлён: добавлены shop-detail, categories маршруты
- `.gitignore` + router fix (690a5bd)

## Статистика

| Метрика | Значение |
|---|---|
| Файлов изменено | 27 |
| Строк добавлено | ~1 540 |
| Строк удалено | ~95 |
| Итого строк кода | ~1 445 |
| Токены (approx.) | ~18 000 |
