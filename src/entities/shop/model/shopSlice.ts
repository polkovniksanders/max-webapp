import { createSlice } from '@reduxjs/toolkit'
import type { Shop } from './types'

interface ShopState {
  shop: Shop
}

const initialState: ShopState = {
  shop: { id: 0, name: '', description: '', bannerImage: '' },
}

const shopSlice = createSlice({
  name: 'shop',
  initialState,
  reducers: {},
})

export default shopSlice.reducer
