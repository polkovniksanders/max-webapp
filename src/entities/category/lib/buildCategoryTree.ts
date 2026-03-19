import type { ApiCategory } from '../model/types'

/** Returns direct children of a given parent in the flat list. */
export function getChildCategories(flat: ApiCategory[], parentId: number): ApiCategory[] {
  return flat.filter((c) => c.parent_id === parentId)
}

/** Returns root categories — those whose parent_id is 0 or not found in the flat list. */
export function getRootCategories(flat: ApiCategory[]): ApiCategory[] {
  const allIds = new Set(flat.map((c) => c.id))
  return flat.filter((c) => c.parent_id === 0 || !allIds.has(c.parent_id))
}

/** Returns true when any category in the flat list has this ID as its parent_id. */
export function hasChildCategories(flat: ApiCategory[], categoryId: number): boolean {
  return flat.some((c) => c.parent_id === categoryId)
}

/**
 * Build the breadcrumb trail for a category by walking the parent_id chain.
 * Returns an array from root to the given category (inclusive).
 */
export function buildBreadcrumbs(
  flat: ApiCategory[],
  categoryId: number,
): { id: number; name: string }[] {
  const map = new Map<number, ApiCategory>()
  for (const cat of flat) {
    map.set(cat.id, cat)
  }

  const trail: { id: number; name: string }[] = []
  let current = map.get(categoryId)
  while (current) {
    trail.unshift({ id: current.id, name: current.name })
    if (!current.parent_id || !map.has(current.parent_id)) break
    current = map.get(current.parent_id)
  }

  return trail
}
