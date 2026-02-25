export interface ApiProductImage {
  id: number
  file: string | null
  original?: string | null
}

export interface ApiProduct {
  id: number
  title: string
  description: string | null
  price: number
  old_price: number | null
  discount: number
  images: ApiProductImage[]
  shop_id: number
  buyable: boolean
  status: number
  type: string
}

/** Формирует полный URL изображения товара */
export const buildImageUrl = (file: string | null | undefined): string => {
  if (!file) return ''
  return `https://api.spodial.com/storage/${file}`
}
