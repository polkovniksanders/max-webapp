import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  type ReactNode,
} from 'react'
import { Modal, type ModalProps } from './Modal'
import styles from './Confirm.module.css'

// ─── Types ─────────────────────────────────────────────────────────────────

type ModalOptions = Omit<ModalProps, 'isOpen' | 'onClose' | 'children'>

interface ModalEntry {
  id: string
  content: ReactNode
  options: ModalOptions
}

interface ConfirmOptions {
  title?: string
  message: string
  confirmText?: string
  cancelText?: string
  danger?: boolean
}

interface ModalContextValue {
  /** Open a modal with arbitrary content. Returns modal id. */
  openModal: (content: ReactNode, options?: ModalOptions) => string
  /** Close a specific modal by id (or the topmost if omitted) */
  closeModal: (id?: string) => void
  /** Close all open modals */
  closeAll: () => void
  /** Imperative confirm dialog. Returns a Promise<boolean>. */
  confirm: (options: ConfirmOptions) => Promise<boolean>
}

// ─── Context ───────────────────────────────────────────────────────────────

const ModalContext = createContext<ModalContextValue | null>(null)

// ─── Provider ──────────────────────────────────────────────────────────────

/**
 * Provides imperative modal and confirm APIs to the whole app.
 *
 * Place once at the root (inside <Provider> and <HashRouter>).
 *
 * Usage:
 *   const { openModal, closeModal, confirm } = useModal()
 *
 *   // Arbitrary content
 *   const id = openModal(<MyForm onDone={() => closeModal(id)} />, { title: 'Edit' })
 *
 *   // Confirm dialog
 *   const ok = await confirm({ message: 'Удалить товар?' })
 *   if (ok) deleteItem()
 */
export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [stack, setStack] = useState<ModalEntry[]>([])
  const idCounter = useRef(0)

  const openModal = useCallback((content: ReactNode, options: ModalOptions = {}): string => {
    const id = String(++idCounter.current)
    setStack((prev) => [...prev, { id, content, options }])
    return id
  }, [])

  const closeModal = useCallback((id?: string) => {
    setStack((prev) => {
      if (!id) return prev.slice(0, -1)
      return prev.filter((m) => m.id !== id)
    })
  }, [])

  const closeAll = useCallback(() => setStack([]), [])

  const confirm = useCallback(
    (options: ConfirmOptions): Promise<boolean> =>
      new Promise((resolve) => {
        const idRef = { current: '' }

        const handleResolve = (value: boolean) => {
          resolve(value)
          closeModal(idRef.current)
        }

        idRef.current = openModal(
          <ConfirmDialog {...options} onConfirm={() => handleResolve(true)} onCancel={() => handleResolve(false)} />,
          { title: options.title, size: 'sm', hideClose: true },
        )
      }),
    [openModal, closeModal],
  )

  return (
    <ModalContext.Provider value={{ openModal, closeModal, closeAll, confirm }}>
      {children}
      {stack.map((entry, index) => (
        <Modal
          key={entry.id}
          isOpen={true}
          onClose={() => closeModal(entry.id)}
          {...entry.options}
          // Only topmost modal is interactive (stacking)
          {...(index < stack.length - 1 ? { hideClose: true } : {})}
        >
          {entry.content}
        </Modal>
      ))}
    </ModalContext.Provider>
  )
}

// ─── Hook ──────────────────────────────────────────────────────────────────

export const useModal = (): ModalContextValue => {
  const ctx = useContext(ModalContext)
  if (!ctx) throw new Error('useModal must be used within <ModalProvider>')
  return ctx
}

// ─── ConfirmDialog ─────────────────────────────────────────────────────────

interface ConfirmDialogProps extends ConfirmOptions {
  onConfirm: () => void
  onCancel: () => void
}

const ConfirmDialog = ({
  message,
  confirmText = 'Подтвердить',
  cancelText = 'Отмена',
  danger = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) => (
  <div className={styles.root}>
    <p className={styles.message}>{message}</p>
    <div className={styles.actions}>
      <button type="button" className={styles.cancelBtn} onClick={onCancel}>
        {cancelText}
      </button>
      <button
        type="button"
        className={`${styles.confirmBtn} ${danger ? styles.danger : ''}`}
        onClick={onConfirm}
        autoFocus
      >
        {confirmText}
      </button>
    </div>
  </div>
)
