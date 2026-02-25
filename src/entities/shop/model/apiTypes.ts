export interface ApiShopDocument {
  type: string
  title: string
  short_title: string
}

export interface ApiShopLegalInfo {
  id: number
  name: string
  inn: string | null
  kpp: string | null
  email: string | null
  phone: string | null
  address: string | null
  ogrn: number | null
  additionally: string | null
}

export interface ApiShopDetails {
  contact_info?: string | null
  style?: string | null
}

export interface ApiShop {
  id: number
  user_id: number
  name: string
  about: string | null
  photo: string | null
  buyable: boolean
  shop_inline: string | null
  shop_link: string | null
  payment_system: string | null
  price_from: boolean
  bot_name: string | null
  available_documents: ApiShopDocument[]
  has_saferoute: boolean
  type: number
  delivery: string | null
  show_ai_chat: boolean
  legal_info: ApiShopLegalInfo | null
  details: ApiShopDetails | null
  banners: unknown[]
  regions: unknown[]
}
