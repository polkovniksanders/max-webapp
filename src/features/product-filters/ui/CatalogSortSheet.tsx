import { useEffect, useRef } from 'react'
import { useAppDispatch, useAppSelector } from '@app/store'
import { productFiltersActions, selectProductFilters } from '../model/productFiltersSlice'
import type { ProductSortBy, SortDirection } from '@entities/product'
import styles from './CatalogSortSheet.module.css'

/** A single option rendered in the sort modal */
interface SortOption {
  id: string
  sortBy: ProductSortBy
  sortDirection: SortDirection
  label: string
}

const SORT_OPTIONS: SortOption[] = [
  {
    id: 'price_asc',
    sortBy: 'price',
    sortDirection: 'asc',
    label: 'Сначала недорогие',
  },
  {
    id: 'price_desc',
    sortBy: 'price',
    sortDirection: 'desc',
    label: 'Сначала дорогие',
  },
]

interface CatalogSortSheetProps {
  /** Whether the modal is currently visible */
  isOpen: boolean
  /** Called when the modal should close (backdrop tap, close button, apply) */
  onClose: () => void
}

/**
 * Sort modal — centered card with backdrop, matching spodialtelegramapp ModalContext design:
 * - Backdrop (semi-transparent overlay), click outside closes
 * - Card with border-radius 30px, header "Сортировка" + close ×, body with radio list
 * - Radio items separated by dividers, 20px vertical padding each
 * - "Применить" / "Сбросить" button in the footer
 */
export const CatalogSortSheet = ({ isOpen, onClose }: CatalogSortSheetProps) => {
  const dispatch = useAppDispatch()
  const { sortBy, sortDirection } = useAppSelector(selectProductFilters)
  const backdropRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)

  const activeId =
    sortBy && sortDirection
      ? SORT_OPTIONS.find((o) => o.sortBy === sortBy && o.sortDirection === sortDirection)?.id ??
        null
      : null

  const handleSelect = (option: SortOption) => {
    dispatch(
      productFiltersActions.setSort({
        sortBy: option.sortBy,
        sortDirection: option.sortDirection,
      }),
    )
  }

  const handleClear = () => {
    dispatch(productFiltersActions.setSort(null))
    onClose()
  }

  const handleApply = () => {
    onClose()
  }

  // Prevent body scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      ref={backdropRef}
      className={styles.backdrop}
      onClick={(e) => {
        // Close only when clicking the backdrop itself, not the card
        if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
          onClose()
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Сортировка"
    >
      <div ref={cardRef} className={styles.card}>
        {/* ── Header ── */}
        <div className={styles.header}>
          <span className={styles.title}>Сортировка</span>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Закрыть"
          >
            <CloseIcon />
          </button>
        </div>

        {/* ── Radio list ── */}
        <div className={styles.body}>
          <ul className={styles.list} role="radiogroup">
            {SORT_OPTIONS.map((option, index) => (
              <li key={option.id}>
                {index > 0 && <div className={styles.divider} />}
                <button
                  type="button"
                  className={styles.option}
                  role="radio"
                  aria-checked={option.id === activeId}
                  onClick={() => handleSelect(option)}
                >
                  {/* Custom radio dot matching spodialtelegramapp Radio.tsx */}
                  <span
                    className={`${styles.radioOuter} ${option.id === activeId ? styles.radioOuterActive : ''}`}
                  >
                    <span
                      className={`${styles.radioInner} ${option.id === activeId ? styles.radioInnerActive : ''}`}
                    />
                  </span>
                  <span className={styles.optionLabel}>{option.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* ── Footer ── */}
        <div className={styles.footer}>
          {activeId ? (
            <>
              <button type="button" className={styles.applyBtn} onClick={handleApply}>
                Применить
              </button>
              <button type="button" className={styles.clearBtn} onClick={handleClear}>
                Сбросить
              </button>
            </>
          ) : (
            <button type="button" className={styles.applyBtnDisabled} onClick={onClose}>
              Применить
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Inline close icon ─────────────────────────────────────────────────────────

const CloseIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <line x1="1.5" y1="1.5" x2="16.5" y2="16.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <line x1="16.5" y1="1.5" x2="1.5" y2="16.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
)
