import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export interface CartItem {
  productId: number
  title: string
  price: number
  old_price: number | null
  imageFile: string | null
  quantity: number
}

interface CartState {
  items: CartItem[]
}

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [] } as CartState,
  reducers: {
    addItem(state, action: PayloadAction<CartItem>) {
      const existing = state.items.find((i) => i.productId === action.payload.productId)
      if (existing) {
        existing.quantity += action.payload.quantity
      } else {
        state.items.push(action.payload)
      }
    },
    removeItem(state, action: PayloadAction<number>) {
      state.items = state.items.filter((i) => i.productId !== action.payload)
    },
    updateQuantity(state, action: PayloadAction<{ productId: number; quantity: number }>) {
      const item = state.items.find((i) => i.productId === action.payload.productId)
      if (item) item.quantity = action.payload.quantity
    },
    clearCart(state) {
      state.items = []
    },
  },
})

export const { addItem, removeItem, updateQuantity, clearCart } = cartSlice.actions
export default cartSlice.reducer
