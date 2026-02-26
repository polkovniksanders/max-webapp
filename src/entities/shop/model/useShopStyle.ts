import { useEffect } from 'react'
import { useGetShopQuery } from './shopApi'
import { applyShopStyle } from '../lib/applyShopStyle'
import type { ShopStyle } from './apiTypes'

export const useShopStyle = () => {
  const { data: shop } = useGetShopQuery()

  useEffect(() => {
    if (!shop?.details?.style) return
    try {
      const style = JSON.parse(shop.details.style) as ShopStyle
      applyShopStyle(style)
    } catch {
      console.warn('[ShopStyle] Failed to parse style JSON')
    }
  }, [shop])
}
