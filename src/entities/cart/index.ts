export type { CartItem, CartState } from './model/types'
export { addItem, removeItem, updateQuantity, clearCart } from './model/cartSlice'
export { default as cartReducer } from './model/cartSlice'
