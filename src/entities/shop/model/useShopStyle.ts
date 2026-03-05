import { useEffect } from 'react'
import { useGetShopQuery } from './shopApi'
import { applyShopStyle } from '../lib/applyShopStyle'
import { getShopId } from '@shared/config/shopId'
import type { ShopStyle } from './apiTypes'

export const useShopStyle = () => {
  const { data: shop } = useGetShopQuery(getShopId())

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
