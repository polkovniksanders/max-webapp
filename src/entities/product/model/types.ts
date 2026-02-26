export type CategoryId = 'all' | 'electronics' | 'clothing' | 'food' | 'other'

export interface Category {
  id: CategoryId
  label: string
}

export const CATEGORIES: Category[] = [
  { id: 'all', label: 'Все' },
  { id: 'electronics', label: 'Электроника' },
  { id: 'clothing', label: 'Одежда' },
  { id: 'food', label: 'Еда' },
  { id: 'other', label: 'Прочее' },
]
