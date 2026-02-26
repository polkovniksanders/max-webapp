export interface ApiProductImage {
  id: number
  file: string | null
  original?: string | null
}

/** Тип товара в списке категории (облегчённый) */
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

/** Тип товара на странице детали (полный) */
export interface ApiProductDetail {
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
  category_id?: number
  category_name?: string
  attributes?: Record<string, string>
  external_code?: number | null
  groups?: ApiProductGroup[]
}

export interface ApiProductGroup {
  id: number
  title: string
  type: string
  products: Array<{
    id: number
    title: string
    price: number
    old_price: number | null
    discount: number
    images: ApiProductImage[]
    attributes?: Record<string, string>
  }>
}

/** Формирует полный URL изображения товара */
export const buildImageUrl = (file: string | null | undefined): string => {
  if (!file) return ''
  return `https://api.spodial.com/storage/${file}`
}
