import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { Product } from './types'

interface ProductState {
  selectedProduct: Product | null
}

const initialState: ProductState = {
  selectedProduct: null,
}

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    setSelectedProduct(state, action: PayloadAction<Product>) {
      state.selectedProduct = action.payload
    },
    clearSelectedProduct(state) {
      state.selectedProduct = null
    },
  },
})

export const { setSelectedProduct, clearSelectedProduct } = productSlice.actions
export default productSlice.reducer
