import type { CheckoutFormConfig } from './types'

/**
 * Fallback checkout form config used when the shop API does not return
 * a `checkout_config` in `shop.details`.
 *
 * Mirrors a typical delivery form with address, apartment number,
 * a free-text comment, and a delivery method selector.
 */
export const DEFAULT_CHECKOUT_CONFIG: CheckoutFormConfig = {
  checkoutPage: {
    title: 'Оформление заказа',
    fields: [
      {
        name: 'full_name',
        label: 'Имя',
        type: 'text',
        placeholder: 'Как к вам обращаться',
        validation: { required: true, minLength: 2, maxLength: 100 },
      },
      {
        name: 'email',
        label: 'Почта',
        type: 'email',
        placeholder: 'example@mail.ru',
        validation: { required: true, email: true },
      },
      {
        name: 'comment',
        label: 'Комментарий',
        type: 'textarea',
        placeholder: 'Пожелания к заказу',
        validation: { required: false, maxLength: 500 },
      },
    ],
  },
}
