import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export interface CartItem {
  productId: number
  title: string
  price: number
  old_price: number | null
  imageFile: string | null
  quantity: number
  cartItemId?: number
}

/**
 * Promocode application state.
 * `discountAmount` is the final total after discount as returned by the API
 * (field `summ` in the backend response), not the delta itself.
 */
export interface AppliedPromocode {
  code: string
  /** Total cart amount after applying the promocode (i.e. the discounted total) */
  discountedTotal: number
}

interface CartState {
  items: CartItem[]
  /** Currently applied promocode, null if none is active */
  appliedPromocode: AppliedPromocode | null
}

const initialState: CartState = {
  items: [],
  appliedPromocode: null,
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem(state, action: PayloadAction<CartItem>) {
      const existing = state.items.find((i) => i.productId === action.payload.productId)
      if (existing) {
        existing.quantity += action.payload.quantity
        if (action.payload.cartItemId) existing.cartItemId = action.payload.cartItemId
      } else {
        state.items.push(action.payload)
      }
    },
    removeItem(state, action: PayloadAction<number>) {
      state.items = state.items.filter((i) => i.productId !== action.payload)
      // Clear promocode when cart becomes empty — discount is no longer valid
      if (state.items.length === 0) {
        state.appliedPromocode = null
      }
    },
    updateQuantity(state, action: PayloadAction<{ productId: number; quantity: number }>) {
      const item = state.items.find((i) => i.productId === action.payload.productId)
      if (item) item.quantity = action.payload.quantity
    },
    setCartItemId(state, action: PayloadAction<{ productId: number; cartItemId: number }>) {
      const item = state.items.find((i) => i.productId === action.payload.productId)
      if (item) item.cartItemId = action.payload.cartItemId
    },
    hydrateCart(state, action: PayloadAction<CartItem[]>) {
      for (const incoming of action.payload) {
        const existing = state.items.find((i) => i.productId === incoming.productId)
        if (existing) {
          existing.quantity = incoming.quantity
          if (incoming.cartItemId) existing.cartItemId = incoming.cartItemId
        } else {
          state.items.push(incoming)
        }
      }
    },
    clearCart(state) {
      state.items = []
      state.appliedPromocode = null
    },
    /**
     * Saves a successfully validated promocode and its discounted total.
     *
     * @param action.payload.code - The promocode string entered by the user
     * @param action.payload.discountedTotal - Total amount after discount (from API `summ` field)
     */
    applyPromocode(state, action: PayloadAction<AppliedPromocode>) {
      state.appliedPromocode = action.payload
    },
    /** Removes the currently applied promocode, reverting to the original total. */
    clearPromocode(state) {
      state.appliedPromocode = null
    },
  },
})

export const {
  addItem,
  removeItem,
  updateQuantity,
  setCartItemId,
  hydrateCart,
  clearCart,
  applyPromocode,
  clearPromocode,
} = cartSlice.actions
export default cartSlice.reducer
