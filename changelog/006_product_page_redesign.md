# 006 — Редизайн ProductPage + Cart slice

**Дата:** текущая сессия
**Статус:** не закоммичено

## Что сделано

Переработан дизайн ProductPage по макету, создан Redux cart slice для управления корзиной.

### Новые файлы
- `src/entities/cart/model/cartSlice.ts` — Redux slice корзины:
  - Тип `CartItem`: `productId, title, price, old_price, imageFile, quantity`
  - Actions: `addItem`, `removeItem`, `updateQuantity`, `clearCart`
- `src/entities/cart/index.ts` — публичный API entity

### Изменённые файлы
- `src/app/store/index.ts` — подключён `cartReducer`
- `src/pages/product/ui/ProductPage.tsx` — полная переработка:
  - Убран заголовок "Описание" — текст идёт сразу
  - Сворачиваемый блок "Все характеристики" с ChevronIcon (по умолчанию раскрыт)
  - Sticky кнопка: "Добавить в корзину" → `dispatch(addItem(...))` → меняется на "Перейти в корзину" → `navigate(ROUTES.CART)`
  - Использует `useSelector` для проверки наличия товара в корзине
- `src/pages/product/ui/ProductPage.module.css` — полная перезапись:
  - Все `--max-color-*` заменены на `--color-*`, `--bg-*`, `--border-color-*`
  - `aspect-ratio: 1` убран — изображение в натуральных пропорциях
  - Скидочный бейдж перенесён: `top: 12px; left: 12px` → `bottom: 12px; left: 12px`
  - Sticky bottom bar (bottom: 56px над navbar)
  - Состояние `.cartBtnInCart` — вторичный стиль кнопки

## Статистика

| Метрика | Значение |
|---|---|
| Новых файлов | 2 |
| Файлов изменено | 3 |
| Строк добавлено | ~310 |
| Строк удалено | ~165 |
| Итого строк кода | ~475 |
| Токены сессии (approx.) | ~10 000 |
