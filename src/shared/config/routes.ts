export const ROUTES = {
  MAIN: '/',
  SHOP_DETAIL: '/shop-detail',
  PRODUCT: '/shop/product/:id',
  CATEGORIES: '/categories',
  PROFILE: '/profile',
  CART: '/cart',
  ORDERS: '/orders',
  CHECKOUT_CONTACT: '/checkout/contact',
  CHECKOUT_DELIVERY: '/checkout/delivery',
  /** Iframe-based payment page (yookassa / cloudpayment). */
  CHECKOUT_PAYMENT: '/checkout/payment',
  /** Polling page — waits for the payment provider to confirm the order. */
  CHECKOUT_PENDING: '/checkout/pending/:orderId',
  /** Final status page — shows order details after any checkout flow. */
  CHECKOUT_STATUS: '/checkout/status/:orderId',
  OFERTA: '/oferta',
  ORDER_DETAIL: '/orders/:orderId',
} as const
