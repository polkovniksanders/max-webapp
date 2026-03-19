# 009 — Корзина, оформление заказа, окружения

**Дата:** 2026-03-18

## Что сделано

### Shop ID из URL

- `src/shared/config/shopId.ts` — добавлен второй fallback: `?shop_id=123` в query string URL (после `start_param` MAX Bridge, до дефолтного значения)
- Клиентам передаётся ссылка вида `https://localhost.berghub.ru/?shop_id=123`

### Окружения (dev / prod)

- `.env.development` — добавлена переменная `VITE_STORAGE_URL=https://api-spodial-dev.fabitdev.ru/storage/`
- `.env.production` — добавлена переменная `VITE_STORAGE_URL=https://api.spodial.com/storage/`
- `src/entities/product/model/apiTypes.ts` — `buildImageUrl()` переключена с хардкода `api.spodial.com` на `import.meta.env.VITE_STORAGE_URL`; картинки в dev-режиме теперь тянутся из dev-окружения

### Убран хардкод shop ID

- `src/entities/product/model/productsApi.ts` — убрана константа `const SHOP_ID = 369`; запрос продуктов категории теперь вызывает `getShopId()` динамически

### Корзина

- `src/pages/cart/ui/CartPage.tsx` — полная реализация страницы: список товаров с фото, кнопки `+` / `−` (при quantity=1 кнопка `−` превращается в иконку корзины), крестик для удаления, пересчёт итоговой суммы, sticky кнопка «Оформить заказ · X ₽», пустое состояние
- `src/shared/config/userId.ts` — `getMessengerUserId()` получил dev-fallback `5492444`; убран guard `if (!userId) return` который блокировал добавление товаров в dev-режиме
- `src/app/App.tsx` — гидрация корзины при старте: `readCart` → `hydrateCart(items)` восстанавливает корзину из API после перезагрузки страницы; убран мёртвый guard `if (!userId) return`

### Checkout flow — интеграция с API

- `src/entities/order/model/orderApi.ts` — добавлен типизированный `BuyProductDTO` с обязательными полями (`telegram_user_id`, `shop_id`, `product_id_list`, `phone`, `full_name`)
- `src/pages/checkout-delivery/ui/CheckoutDeliveryPage.tsx` — `onSubmit` подключён к `POST max/market/product/buy`; при успехе: `clearCart()` + `clearCheckoutData()` + навигация на `/checkout/success`; при ошибке: сообщение из API
- `src/features/checkout/model/storage.ts` — добавлена функция `clearCheckoutData()`; `full_name` убран из `ContactFormData` (берётся из MAX Bridge)
- `src/features/checkout/index.ts` — экспортирована `clearCheckoutData`
- `src/shared/config/routes.ts` — добавлен маршрут `CHECKOUT_SUCCESS`
- `src/app/router/index.tsx` — зарегистрирован маршрут `/checkout/success`

### Новые файлы

- `src/pages/checkout-success/ui/OrderSuccessPage.tsx` — страница «Заказ оформлен!» с кнопкой «На главную» (`navigate('/', { replace: true })`)
- `src/pages/checkout-success/ui/OrderSuccessPage.module.css`
- `src/pages/checkout-success/index.tsx`

### UX

- `src/app/App.tsx` — Navbar скрывается на страницах `/checkout/contact`, `/checkout/delivery`, `/checkout/success` через `useLocation`
- `src/pages/checkout-contact/ui/CheckoutContactPage.tsx` — поле «Имя и фамилия» убрано из формы; `full_name` собирается автоматически из `initDataUnsafe.user.first_name` + `last_name` в момент отправки заказа

## Архитектурные решения

| Решение | Причина |
|---|---|
| `VITE_STORAGE_URL` отдельно от `VITE_API_URL` | Картинки и API могут жить на разных хостах; единая точка конфигурации для каждого окружения |
| `full_name` из MAX Bridge, не из формы | Пользователь уже авторизован в MAX — нет смысла просить вводить то, что есть в профиле |
| Navbar скрыт через `useLocation` в App | Checkout — изолированный флоу; навбар там отвлекает и занимает место |
| Гидрация корзины в `AppContent` | Восстановление состояния из API нужно один раз при старте, до рендера страниц |

## Статистика

| Метрика | Значение |
|---|---|
| Новых файлов | 3 |
| Файлов изменено | 12 |
| Новых роутов | 1 |
| Исправленных багов | 3 (пустая корзина в dev, картинки из prod в dev, full_name в заказе) |
