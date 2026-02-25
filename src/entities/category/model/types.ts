export interface ApiCategory {
  id: number
  name: string
  description: string | null
  shop_id: number
  parent_id: number
  position: number
  image: string | null
  is_active: boolean
  is_slider: boolean
  highlight: string | null
  has_products: boolean
}
