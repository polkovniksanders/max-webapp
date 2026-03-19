import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { ProductSortBy, SortDirection } from '@entities/product'
import type { RootState } from '@app/store'

/**
 * State for the product catalog search and sort feature.
 * Stored in Redux so that the state survives navigation within a session
 * and can be read from any component without prop-drilling.
 */
export interface ProductFiltersState {
  /** Free-text search query — sent to the API as `title` parameter */
  searchQuery: string
  /** Active sort field, or null when no sort is applied */
  sortBy: ProductSortBy | null
  /** Active sort direction, or null when no sort is applied */
  sortDirection: SortDirection | null
  /** Selected category id for filtering the main page product list */
  selectedCategoryId: number | null
  /** Name of the selected category (for display) */
  selectedCategoryName: string | null
  /**
   * Breadcrumb trail leading to the selected category.
   * Empty when at root level. Used to render breadcrumbs on MainPage.
   */
  breadcrumbs: { id: number; name: string }[]
}

const initialState: ProductFiltersState = {
  searchQuery: '',
  sortBy: null,
  sortDirection: null,
  selectedCategoryId: null,
  selectedCategoryName: null,
  breadcrumbs: [],
}

const productFiltersSlice = createSlice({
  name: 'productFilters',
  initialState,
  reducers: {
    /**
     * Set the free-text search query.
     * Resets offset implicitly — the UI must restart pagination on change.
     */
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload
    },

    /**
     * Apply a sort preset (field + direction together).
     * Passing null clears the active sort.
     */
    setSort(
      state,
      action: PayloadAction<{ sortBy: ProductSortBy; sortDirection: SortDirection } | null>,
    ) {
      if (action.payload === null) {
        state.sortBy = null
        state.sortDirection = null
      } else {
        state.sortBy = action.payload.sortBy
        state.sortDirection = action.payload.sortDirection
      }
    },

    /**
     * Set the selected category for filtering the main page product list.
     * Optional breadcrumbs record the navigation path from root to this category.
     */
    setSelectedCategory(
      state,
      action: PayloadAction<{
        id: number
        name: string
        breadcrumbs?: { id: number; name: string }[]
      } | null>,
    ) {
      state.selectedCategoryId = action.payload?.id ?? null
      state.selectedCategoryName = action.payload?.name ?? null
      state.breadcrumbs = action.payload?.breadcrumbs ?? []
    },

    /** Resets all filters back to their initial (empty) state */
    resetFilters(state) {
      state.searchQuery = ''
      state.sortBy = null
      state.sortDirection = null
      state.selectedCategoryId = null
      state.selectedCategoryName = null
      state.breadcrumbs = []
    },
  },
})

export const productFiltersActions = productFiltersSlice.actions
export const productFiltersReducer = productFiltersSlice.reducer

// ─── Selectors ────────────────────────────────────────────────────────────────

/** Returns the full filter state */
export const selectProductFilters = (state: RootState): ProductFiltersState =>
  state.productFilters

/** Returns true when search or sort is active */
export const selectHasActiveFilters = (state: RootState): boolean => {
  const { searchQuery, sortBy } = state.productFilters
  return searchQuery.trim().length > 0 || sortBy !== null
}

/** Returns the selected category id */
export const selectSelectedCategoryId = (state: RootState): number | null =>
  state.productFilters.selectedCategoryId

/** Returns the selected category name */
export const selectSelectedCategoryName = (state: RootState): string | null =>
  state.productFilters.selectedCategoryName

/** Returns the breadcrumb trail for the selected category */
export const selectBreadcrumbs = (state: RootState): { id: number; name: string }[] =>
  state.productFilters.breadcrumbs
