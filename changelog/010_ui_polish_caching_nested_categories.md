# 010 — UI-полировка, кэширование, вложенные категории

**Дата:** 2026-03-19

## Что сделано

### Система уведомлений (Sonner)

- Установлена библиотека `sonner`
- `src/app/App.tsx` — добавлен `<Toaster position="top-center" richColors closeButton />`
- `src/shared/lib/toast.ts` — реэкспорт `toast` из `sonner` для единой точки импорта
- `src/pages/checkout-delivery/ui/CheckoutDeliveryPage.tsx` — `alert()` заменён на `toast.error()`

### Модальные диалоги

- `src/shared/ui/Modal/` — универсальный компонент: React Portal, focus trap, ARIA (`role="dialog"`, `aria-modal`), стек модалей через контекст
- `src/shared/ui/Modal/ModalProvider.tsx` — `ModalProvider` + хук `useModal()` + функция `confirm()` для императивных диалогов
- `src/app/App.tsx` — приложение обёрнуто в `<ModalProvider>`

### Страница корзины — редизайн

- `src/pages/cart/ui/CartPage.tsx` — приведена к виду референсного приложения:
  - `CartRow`: изображение 80×80, название, `Nшт` + цена без скидки (зачёркнутая) + актуальная цена, разделитель, корзина/`−`/`+`
  - Цены показываются за единицу, не за qty×price
  - Степпер: простые круглые кнопки с бордером (не цветные pill)
  - Оптимистичные обновления с rollback: `addItem` при ошибке удаления, `updateQuantity` при ошибке изменения количества
  - `InvoiceSection`: без карточки, на фоне страницы — Товары / Скидка / Промокод / **Итого**
  - Кнопка «Оформить заказ» (цена не дублируется в кнопке)
- `src/pages/cart/ui/CartPage.module.css` — полная перезапись под новый дизайн
- `src/features/cart/ui/PromocodeSection/PromocodeSection.module.css` — кнопка промокода стала серым pill

### Шрифты (Unbounded + Open Sans)

- `index.html` — подключены через Google Fonts с `preconnect` + `display=swap` (без CLS)
- `src/app/styles/index.css` — `body { font-family: 'Open Sans', ... }`, `h1,h2,h3 { font-family: 'Unbounded', ... }`
- `src/pages/main/ui/MainPage.module.css` — `font-family: 'Unbounded'` на `.shopName` и `.sectionTitle` (оба `<span>`, не заголовочные теги)
- `src/pages/cart/ui/CartPage.module.css` — `font-family: 'Unbounded'` на `.emptyText`
- `vite.config.ts` — `woff2` добавлен в `globPatterns` для прекэша SW

### Скелетоны и состояния загрузки

- `src/shared/ui/SkeletonBlock/SkeletonBlock.tsx` — новый компонент блочного скелетона (поддержка `aspectRatio`, `borderRadius`)
- `src/shared/ui/SkeletonLine/SkeletonLine.tsx` — новый компонент строчного скелетона
- `src/pages/main/ui/MainPage.tsx` — `ShopHeader` показывает shimmer-скелетон пока не загружен магазин; при `isCategoriesLoading` — 6 скелетон-карточек товаров вместо спиннера
- `src/pages/profile/ui/ProfilePage.tsx` — 4 скелетон-карточки пока загружается история заказов
- `src/pages/categories/ui/CategoriesPage.tsx` — 7 шиммер-строк пока загружаются категории

### Кэширование (RTK Query + Service Worker)

- `src/shared/api/index.ts` — глобально: `keepUnusedDataFor: 300`, `refetchOnFocus: false`, `refetchOnReconnect: true`
- `src/app/store/index.ts` — добавлен `setupListeners(store.dispatch)` для поддержки `refetchOnFocus/Reconnect`
- Индивидуальные политики по эндпоинтам:
  - `shopApi` — `keepUnusedDataFor: 3600` (данные магазина стабильны)
  - `categoriesApi` — `keepUnusedDataFor: 1800`
  - `productsApi` — `keepUnusedDataFor: 600`
  - `cartApi` — `keepUnusedDataFor: 0` (всегда свежие данные)
  - `orderApi` (история) — `keepUnusedDataFor: 300`; (отдельный заказ) — `keepUnusedDataFor: 1800`
- `vite.config.ts` — `VitePWA` (Workbox):
  - Статика (JS/CSS/HTML/woff2) — precache
  - Изображения товаров (`api.spodial.com/storage/`) — `StaleWhileRevalidate`, 30 дней, 300 записей
  - Google Fonts CSS — `StaleWhileRevalidate`, 7 дней
  - Google Fonts файлы (woff2) — `CacheFirst`, 1 год

### Страница каталога — редизайн

- `src/pages/categories/ui/CategoriesPage.tsx` — полная перезапись:
  - Строка «Все категории» отдельным компонентом в начале списка
  - Шеврон (`›`) показывается только у категорий с вложенными подкатегориями (через `Set<parent_id>`)
  - Highlighted-категории: иконка `%`, без шеврона
- `src/pages/categories/ui/CategoriesPage.module.css` — чистые стили без dead CSS

### Вложенные категории — навигация по дереву

- `src/entities/category/lib/buildCategoryTree.ts` — новые утилиты:
  - `getRootCategories(flat)` — корневые категории (parent_id = 0 или не встречается в списке)
  - `getChildCategories(flat, parentId)` — прямые дочерние категории
  - `hasChildCategories(flat, categoryId)` — проверка наличия подкатегорий
  - `buildBreadcrumbs(flat, categoryId)` — цепочка от корня до категории по parent_id
- `src/entities/category/model/types.ts` — добавлено поле `childCategoryList?: ApiCategory[]`
- `src/entities/category/index.ts` — экспортированы новые утилиты
- `src/pages/categories/ui/CategoriesPage.tsx` — локальный стек навигации `navStack`:
  - Клик на категорию с детьми → drill-down (остаёмся на странице, показываем подкатегории)
  - Клик на листовую категорию → `setSelectedCategory` + навигация на главную
  - Нативная кнопка «Назад» MAX Bridge: если внутри дерева — идёт на уровень вверх, если в корне — `navigate(-1)`
  - Хлебные крошки над списком при вложенности > 0, каждый элемент — кнопка перехода к уровню
  - Заголовок страницы обновляется на имя текущей категории
- `src/features/product-filters/model/productFiltersSlice.ts` — добавлено поле `breadcrumbs: {id, name}[]`; `setSelectedCategory` принимает опциональный `breadcrumbs`; `resetFilters` очищает хлебные крошки
- `src/features/product-filters/index.ts` — экспортирован селектор `selectBreadcrumbs`
- `src/pages/main/ui/MainPage.tsx` — панель хлебных крошек над фильтр-чипом при `breadcrumbs.length > 1`

## Архитектурные решения

| Решение | Причина |
|---|---|
| `navStack` — локальный стейт CategoriesPage | Навигация по дереву — локальный UI-стейт, не нужен в Redux |
| `handleBackRef` (useRef для back button) | Позволяет не перерегистрировать хендлер при каждом изменении navStack |
| Хлебные крошки в Redux вместе с категорией | MainPage должна знать глубину выбранной категории без доступа к плоскому списку |
| Хлебные крошки показываются только при depth > 1 | При выборе корневой категории дополнительная информация не нужна |
| `getRootCategories` проверяет и `parent_id === 0`, и отсутствие parent | Защита от нестабильности API — корневые категории определяются структурой, не значением |

## Статистика

| Метрика | Значение |
|---|---|
| Новых файлов | 5 |
| Файлов изменено | 18 |
| Новых компонентов | SkeletonBlock, SkeletonLine, Modal, ModalProvider, BreadcrumbsBar |
| Новых утилит | getRootCategories, getChildCategories, hasChildCategories, buildBreadcrumbs |
| Исправленных UX-проблем | Корзина (дизайн), категории (вложенность), back button (перехват) |
