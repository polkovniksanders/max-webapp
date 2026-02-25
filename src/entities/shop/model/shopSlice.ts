import { createSlice } from '@reduxjs/toolkit'
import type { Shop } from './types'
import { MOCK_SHOP } from '@shared/mocks/shop'

interface ShopState {
  shop: Shop
}

const initialState: ShopState = {
  shop: MOCK_SHOP,
}

const shopSlice = createSlice({
  name: 'shop',
  initialState,
  reducers: {},
})

export default shopSlice.reducer
