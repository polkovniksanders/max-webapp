import { useEffect, useRef, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@app/store'
import { productFiltersActions, selectProductFilters } from '../model/productFiltersSlice'
import { useDebounce } from '@shared/hooks/useDebounce'
import styles from './CatalogSearchBar.module.css'

/**
 * Controlled search input for the product catalog.
 *
 * - Reads the current `searchQuery` from Redux for initial value
 * - Debounces user input (400 ms) before dispatching to the store
 * - Custom input with search icon on the left and clear (×) button on the right
 * - Avoids redundant dispatches by comparing against the last dispatched value
 *
 * External reset flow (e.g. user clears all filters via chip):
 * The `key` prop on the outer `div` is driven by `searchQuery` emptiness —
 * when Redux resets to '', the component remounts and `useState` picks up
 * the empty string as the new initial value, without a `setState` in effect.
 */
export const CatalogSearchBar = () => {
  const dispatch = useAppDispatch()
  const { searchQuery } = useAppSelector(selectProductFilters)

  const [inputValue, setInputValue] = useState(searchQuery)
  const [isFocused, setIsFocused] = useState(false)
  const debouncedValue = useDebounce(inputValue, 400)
  const lastDispatchedRef = useRef(searchQuery)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (debouncedValue === lastDispatchedRef.current) return
    lastDispatchedRef.current = debouncedValue
    dispatch(productFiltersActions.setSearchQuery(debouncedValue))
  }, [debouncedValue, dispatch])

  const handleClear = () => {
    setInputValue('')
    lastDispatchedRef.current = ''
    dispatch(productFiltersActions.setSearchQuery(''))
    inputRef.current?.focus()
  }

  return (
    <div
      className={`${styles.wrapper} ${isFocused ? styles.wrapperFocused : ''}`}
      key={searchQuery === '' ? 'empty' : 'active'}
      onClick={() => inputRef.current?.focus()}
    >
      {/* Search icon */}
      <span className={styles.iconWrapper} aria-hidden="true">
        <SearchSvgIcon />
      </span>

      <input
        ref={inputRef}
        className={styles.input}
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder="Поиск товаров"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="none"
        spellCheck={false}
      />

      {/* Clear button — only visible when there is input */}
      {inputValue.length > 0 && (
        <button
          type="button"
          className={styles.clearBtn}
          onClick={handleClear}
          aria-label="Очистить поиск"
          tabIndex={-1}
        >
          <ClearSvgIcon />
        </button>
      )}
    </div>
  )
}

// ─── Inline SVG icons ──────────────────────────────────────────────────────────

const SearchSvgIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <circle
      cx="7"
      cy="7"
      r="5"
      stroke="currentColor"
      strokeWidth="1.6"
    />
    <line
      x1="10.7"
      y1="10.7"
      x2="14"
      y2="14"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
  </svg>
)

const ClearSvgIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <line x1="1" y1="1" x2="13" y2="13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <line x1="13" y1="1" x2="1" y2="13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
)
