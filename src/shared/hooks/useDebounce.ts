import { useEffect, useState } from 'react'

/**
 * Delays updating a value until a specified timeout has elapsed
 * since the last change. Prevents firing expensive operations (API calls)
 * on every keystroke.
 *
 * @param value - The value to debounce
 * @param delay - Delay in milliseconds (default: 400ms)
 * @returns The debounced value, which updates only after `delay` ms of inactivity
 *
 * @example
 * const debouncedSearch = useDebounce(searchInput, 400)
 * // debouncedSearch updates 400ms after the user stops typing
 */
export function useDebounce<T>(value: T, delay = 400): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}
