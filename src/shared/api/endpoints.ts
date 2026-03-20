export const API_ENDPOINTS = {
  // User
  GET_USER_PASSPORT: 'max/getUserPassport',

  // Shop
  SHOP_VISIT: 'max/shop/visit',
  SHOP_VISITOR: 'max/shop/visitor',
  SHOP_VISITORS: (shopId: number) => `max/shops/${shopId}/visitors`,

  // Cart
  MARKET_CARD_LIST: 'max/market/card/list',
  MARKET_CARD_UPDATE: 'max/market/card/update',
  MARKET_CARD_DELETE: 'max/market/card/delete',
  MARKET_CARD_PROMOCODE: 'max/market/card/promocode',

  // Orders
  PRODUCT_BUY: 'max/market/product/buy',
  ORDER_CREATE: 'max/market/product/order/create',
  ORDER_SHOW: (id: number) => `max/market/show/order/${id}`,
  ORDERS_HISTORY: (shopId: number) => `max/market/show/orders/history?shop_id=${shopId}`,

  // Products
  PRODUCT_HISTORY: (shopId: number) => `max/public/product-history/${shopId}`,
  PUBLIC_PRODUCT: (id: number) => `max/public/product/${id}`,
  PRODUCTS_CATEGORY: 'max/products/category',
} as const
