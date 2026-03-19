import { useState } from 'react'
import { useAppSelector } from '@app/store'
import { selectProductFilters } from '../model/productFiltersSlice'
import { CatalogSortSheet } from './CatalogSortSheet'
import styles from './CatalogSortButton.module.css'

/**
 * Icon button that opens the sort bottom sheet.
 * Renders with a visual "active" state when a sort is applied,
 * mirroring the Sort component in spodialtelegramapp.
 */
export const CatalogSortButton = () => {
  const [isSheetOpen, setSheetOpen] = useState(false)
  const { sortBy } = useAppSelector(selectProductFilters)
  const isActive = sortBy !== null

  return (
    <>
      <button
        className={`${styles.btn} ${isActive ? styles.btnActive : ''}`}
        onClick={() => setSheetOpen(true)}
        aria-label="Сортировка"
        aria-pressed={isActive}
      >
        <SortIcon isActive={isActive} />
      </button>

      <CatalogSortSheet isOpen={isSheetOpen} onClose={() => setSheetOpen(false)} />
    </>
  )
}

// ─── Inline sort SVG icon ──────────────────────────────────────────────────────

interface SortIconProps {
  isActive: boolean
}

const SortIcon = ({ isActive }: SortIconProps) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    {/* Three horizontal lines with ascending lengths — classic sort icon */}
    <line
      x1="2"
      y1="5"
      x2="18"
      y2="5"
      stroke={isActive ? 'var(--color-primary, #976bf6)' : 'var(--color-text, #000)'}
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <line
      x1="4"
      y1="10"
      x2="16"
      y2="10"
      stroke={isActive ? 'var(--color-primary, #976bf6)' : 'var(--color-text, #000)'}
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <line
      x1="6"
      y1="15"
      x2="14"
      y2="15"
      stroke={isActive ? 'var(--color-primary, #976bf6)' : 'var(--color-text, #000)'}
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
)
