import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@shared/bridge'
import { store } from './app/store'
import { shopApiSlice } from './entities/shop/model/shopApi'
import { applyShopStyle } from './entities/shop/lib/applyShopStyle'
import { getShopId } from './shared/config/shopId'
import type { ShopStyle } from './entities/shop/model/apiTypes'
import { App } from './app/App'

async function bootstrap() {
  // Fetch shop data before first render so CSS vars are applied synchronously.
  // RTK Query caches the result — components using useGetShopQuery(shopId) won't re-fetch.
  try {
    const result = await store.dispatch(
      shopApiSlice.endpoints.getShop.initiate(getShopId()),
    )
    if (result.data?.details?.style) {
      applyShopStyle(JSON.parse(result.data.details.style) as ShopStyle)
    }
  } catch {
    // Render with default styles on failure
  }

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}

bootstrap()
