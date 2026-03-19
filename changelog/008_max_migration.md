# 008 — Миграция на реальное окружение MAX

**Дата:** 2026-03-17

## Удалено
- `src/shared/bridge/mock.ts` — mock-объект `window.WebApp` (имитировал пользователя, BackButton, requestContact и др.)
- Авто-инжект mock WebApp в DEV-режиме (`bridge/index.ts`)
- Хардкод `TELEGRAM_USER_ID = 5492444` в `App.tsx` и `useCartItem.ts`

## Изменено
- `App.tsx`, `useCartItem.ts` — `TELEGRAM_USER_ID` заменён на `getMessengerUserId()` из `@shared/config/userId.ts`; операции с корзиной защищены guard `if (!userId) return`
- `src/shared/api/index.ts` — заголовок передачи `initData` переименован `Authorization` → `init-data`
- `cartApi.ts`, `useCartItem.ts`, `App.tsx` — поле `telegram_user_id` / `telegram_id` переименовано в `messenger_user_id` во всех API-запросах и типах
- `src/features/checkout/model/mockConfig.ts` → `defaultConfig.ts`, экспорт `MOCK_CHECKOUT_CONFIG` → `DEFAULT_CHECKOUT_CONFIG`
- `src/shared/config/shopId.ts` — убраны комментарии про mock

## Добавлено
- `src/pages/cart/ui/CartPage.tsx` — подключён `useBackButton()` для нативной кнопки «Назад» MAX Bridge
- `src/pages/profile/ui/ProfilePage.tsx` — секция «История просмотров»: горизонтальный скролл товаров, загружается через `useLazyGetProductHistoryQuery` (`GET /api/v3/max/public/product-history/{shopId}`), отображается только при непустом ответе
