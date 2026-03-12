# 007 — Checkout flow (оформление заказа)

**Дата:** 2026-03-12
**Статус:** не закоммичено

## Что сделано

Реализован двухшаговый флоу оформления заказа с валидацией через Zod + react-hook-form, телефонной маской, динамической формой из JSON-конфига и сохранением данных в sessionStorage.

### Новые файлы

**`src/features/checkout/`** — feature-слой, вся бизнес-логика:
- `model/types.ts` — типы `CheckoutFormConfig`, `CheckoutPageConfig`, `CheckoutField`, `CheckoutFieldType`, `CheckoutFieldValidation`
- `model/storage.ts` — хелперы `saveContactData / loadContactData / saveDeliveryData / loadDeliveryData` для sessionStorage
- `model/buildDynamicSchema.ts` — строит `z.ZodObject` в рантайме из `CheckoutFormConfig`
- `model/mockConfig.ts` — `MOCK_CHECKOUT_CONFIG` с 4 полями (адрес, квартира, комментарий, тип доставки)
- `index.ts` — публичный barrel-экспорт

**`src/pages/checkout-contact/`** — Шаг 1:
- `ui/CheckoutContactPage.tsx` — поле телефона с маской `+7 (___) ___-__-__` (кастомный `formatPhone`, без библиотек), чекбокс согласия с офертой, Zod-схема с `z.literal(true)` для чекбокса, восстановление данных из sessionStorage
- `ui/CheckoutContactPage.module.css`
- `index.tsx`

**`src/pages/checkout-delivery/`** — Шаг 2:
- `ui/CheckoutDeliveryPage.tsx` — читает `shop.details.checkout_config` (JSON.parse) с fallback на `MOCK_CHECKOUT_CONFIG`; динамически строит Zod-схему; рендерит поля по типу: `text` / `number` / `textarea` / `select`; mock-экран успеха после сабмита
- `ui/CheckoutDeliveryPage.module.css`
- `index.tsx`

**`src/pages/oferta/`** — Страница с текстом оферты:
- `ui/OfertaPage.tsx`
- `ui/OfertaPage.module.css`
- `index.tsx`

### Изменённые файлы

- `src/shared/config/routes.ts` — добавлены `CHECKOUT_CONTACT`, `CHECKOUT_DELIVERY`, `OFERTA`
- `src/app/router/index.tsx` — зарегистрированы три новых роута
- `src/entities/shop/model/apiTypes.ts` — в `ApiShopDetails` добавлено `checkout_config?: string | null`
- `src/pages/cart/ui/CartPage.tsx` — временная кнопка "Перейти к оформлению" (sticky bottom) → `ROUTES.CHECKOUT_CONTACT`
- `src/pages/cart/ui/CartPage.module.css` — стили для кнопки и sticky bar

### Установленные пакеты

- `zod@4.3.6`
- `react-hook-form@7.71.2`
- `@hookform/resolvers@5.2.2`

## Архитектурные решения

| Решение | Причина |
|---|---|
| Маска телефона без библиотеки | Только одно поле, `formatPhone()` в 10 строк проще любой зависимости |
| sessionStorage (не localStorage) | Данные актуальны только в рамках сессии оформления |
| Конфиг формы в `shop.details.checkout_config` | Лежит рядом со `style` — единый запрос, нет отдельного эндпоинта |
| Fallback на `MOCK_CHECKOUT_CONFIG` | API ещё не отдаёт `checkout_config` — mock позволяет разрабатывать и тестировать сейчас |
| Zod схема строится через `useMemo` | Пересчёт только при смене конфига, не на каждый ре-рендер |

## Статистика

| Метрика | Значение |
|---|---|
| Новых файлов | 14 |
| Файлов изменено | 5 |
| Новых роутов | 3 |
| Поддерживаемых типов полей | 4 (text, number, textarea, select) |
| Поддерживаемых правил валидации | 7 (required, minLength, maxLength, min, max, pattern, email) |
