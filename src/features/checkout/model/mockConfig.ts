import type { CheckoutFormConfig } from './types'

/**
 * Fallback checkout form config used when the shop API does not return
 * a `checkout_config` in `shop.details`.
 *
 * Mirrors a typical delivery form with address, apartment number,
 * a free-text comment, and a delivery method selector.
 */
export const MOCK_CHECKOUT_CONFIG: CheckoutFormConfig = {
  checkoutPage: {
    title: 'Доставка',
    fields: [
      {
        name: 'address',
        label: 'Адрес',
        type: 'text',
        placeholder: 'Улица, дом, корпус',
        validation: { required: true, minLength: 5, maxLength: 200 },
      },
      {
        name: 'apartment',
        label: 'Квартира / офис',
        type: 'number',
        placeholder: '42',
        validation: { required: false, min: 1, max: 9999 },
      },
      {
        name: 'comment',
        label: 'Комментарий к заказу',
        type: 'textarea',
        placeholder: 'Уточнения для курьера',
        validation: { required: false, maxLength: 500 },
      },
      {
        name: 'deliveryType',
        label: 'Способ доставки',
        type: 'select',
        options: ['Курьер', 'Самовывоз', 'Почта России'],
        validation: { required: true },
      },
    ],
  },
}
