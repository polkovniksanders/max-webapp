import {
  useEffect,
  useRef,
  useCallback,
  type ReactNode,
  type KeyboardEvent,
} from 'react'
import { createPortal } from 'react-dom'
import styles from './Modal.module.css'

export interface ModalProps {
  /** Whether the modal is visible */
  isOpen: boolean
  /** Called when the user requests to close (backdrop click, Escape key, ✕ button) */
  onClose: () => void
  /** Optional heading rendered in the modal header */
  title?: string
  /** Modal body */
  children: ReactNode
  /** Width preset — defaults to 'md' */
  size?: 'sm' | 'md' | 'lg'
  /** Hide the close button in the header */
  hideClose?: boolean
}

/**
 * Accessible modal dialog rendered via React Portal.
 *
 * Best-practice checklist:
 * - Rendered to `document.body` via Portal (no z-index wars)
 * - Focus is trapped inside while open (Tab / Shift+Tab cycle)
 * - First focusable element is auto-focused on open
 * - Focus is restored to the trigger element on close
 * - Body scroll is locked while open
 * - Backdrop click and Escape key both close the modal
 * - ARIA: role="dialog", aria-modal, aria-labelledby
 * - Animation: CSS keyframes (no JS animation deps)
 */
export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  hideClose = false,
}: ModalProps) => {
  const dialogRef = useRef<HTMLDivElement>(null)
  const previousFocusRef = useRef<Element | null>(null)

  // Lock body scroll and save the previously focused element
  useEffect(() => {
    if (!isOpen) return

    previousFocusRef.current = document.activeElement
    document.body.style.overflow = 'hidden'

    // Auto-focus first focusable element inside the dialog
    const timer = setTimeout(() => {
      const focusable = getFocusableElements(dialogRef.current)
      focusable[0]?.focus()
    }, 50)

    return () => {
      clearTimeout(timer)
      document.body.style.overflow = ''
      // Restore focus to the element that opened the modal
      if (previousFocusRef.current instanceof HTMLElement) {
        previousFocusRef.current.focus()
      }
    }
  }, [isOpen])

  // Focus trap: keep Tab / Shift+Tab inside the dialog
  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'Escape') {
        onClose()
        return
      }

      if (e.key !== 'Tab') return

      const focusable = getFocusableElements(dialogRef.current)
      if (focusable.length === 0) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault()
          last.focus()
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    },
    [onClose],
  )

  if (!isOpen) return null

  return createPortal(
    <div
      className={styles.overlay}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
      aria-hidden="false"
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        className={`${styles.dialog} ${styles[size]}`}
        onKeyDown={handleKeyDown}
        tabIndex={-1}
      >
        {(title || !hideClose) && (
          <div className={styles.header}>
            {title && (
              <h2 id="modal-title" className={styles.title}>
                {title}
              </h2>
            )}
            {!hideClose && (
              <button
                type="button"
                className={styles.closeBtn}
                onClick={onClose}
                aria-label="Закрыть"
              >
                <CloseIcon />
              </button>
            )}
          </div>
        )}
        <div className={styles.body}>{children}</div>
      </div>
    </div>,
    document.body,
  )
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const FOCUSABLE =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

function getFocusableElements(container: HTMLElement | null): HTMLElement[] {
  if (!container) return []
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE))
}

const CloseIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    aria-hidden="true"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)
