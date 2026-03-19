import { memo, useState, useRef, useCallback, type ChangeEvent, type FormEvent } from 'react'
import { useDispatch } from 'react-redux'
import { useAppSelector } from '@app/store'
import { applyPromocode, clearPromocode, useLazyGetCartPromocodeQuery } from '@entities/cart'
import { getShopId } from '@shared/config/shopId'
import styles from './PromocodeSection.module.css'

// ─── Internal sub-components ──────────────────────────────────────────────────

/**
 * Collapsed trigger — shown when no promocode is active and the input is hidden.
 */
const PromocodeButton = memo(({ onClick }: { onClick: () => void }) => (
  <button type="button" className={styles.triggerBtn} onClick={onClick}>
    <svg
      className={styles.triggerIcon}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
      <line x1="12" y1="12" x2="12" y2="16" />
      <line x1="10" y1="14" x2="14" y2="14" />
    </svg>
    У меня есть промокод
  </button>
))
PromocodeButton.displayName = 'PromocodeButton'

/**
 * Expanded input form for entering and submitting a promocode.
 *
 * @param onCancel - Collapses the form without applying
 * @param onSuccess - Called with the validated discounted total after successful apply
 */
const PromocodeForm = memo(
  ({
    onCancel,
  }: {
    onCancel: () => void
  }) => {
    const dispatch = useDispatch()
    const shopId = getShopId()

    const [code, setCode] = useState('')
    const [errorMsg, setErrorMsg] = useState<string | null>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    const [getPromocode, { isLoading }] = useLazyGetCartPromocodeQuery()

    const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
      setCode(e.target.value.toUpperCase())
      setErrorMsg(null)
    }, [])

    const handleSubmit = useCallback(
      async (e: FormEvent) => {
        e.preventDefault()
        const trimmed = code.trim()
        if (!trimmed) {
          setErrorMsg('Введите промокод')
          inputRef.current?.focus()
          return
        }

        try {
          const result = await getPromocode({ code: trimmed, shop_id: shopId }, false).unwrap()

          if (result?.summ !== undefined) {
            dispatch(applyPromocode({ code: trimmed, discountedTotal: result.summ }))
            // Form collapses naturally because the parent reads appliedPromocode from Redux
          } else {
            // API returned 200 but no summ — treat as invalid
            setErrorMsg('Промокод недействителен')
          }
        } catch (err: unknown) {
          // Extract server-side error message when available
          const serverMsg =
            err !== null &&
            typeof err === 'object' &&
            'data' in err &&
            err.data !== null &&
            typeof err.data === 'object' &&
            'message' in err.data
              ? String((err.data as { message: unknown }).message)
              : null
          setErrorMsg(serverMsg ?? 'Промокод не найден или истёк срок действия')
        }
      },
      [code, shopId, getPromocode, dispatch],
    )

    const isDisabled = isLoading || code.trim().length === 0

    return (
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <span className={styles.formLabel}>Промокод</span>

        <div className={styles.inputRow}>
          <input
            ref={inputRef}
            className={`${styles.input}${errorMsg ? ` ${styles.inputError}` : ''}`}
            type="text"
            value={code}
            onChange={handleChange}
            placeholder="Введите код"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="characters"
            spellCheck={false}
            aria-label="Промокод"
            aria-invalid={errorMsg !== null}
            aria-describedby={errorMsg ? 'promo-error' : undefined}
            autoFocus
          />

          <button
            type="submit"
            className={styles.applyBtn}
            disabled={isDisabled}
            aria-label="Применить промокод"
          >
            {isLoading ? (
              <>
                <span className={styles.spinner} aria-hidden="true" />
                Проверка
              </>
            ) : (
              'Применить'
            )}
          </button>
        </div>

        {errorMsg && (
          <p id="promo-error" className={styles.errorMsg} role="alert">
            {errorMsg}
          </p>
        )}

        <button type="button" className={styles.cancelLink} onClick={onCancel}>
          Отмена
        </button>
      </form>
    )
  },
)
PromocodeForm.displayName = 'PromocodeForm'

/**
 * Applied state chip — shows active promocode with a remove button.
 *
 * @param code - The applied promocode string
 * @param discountedTotal - Discounted total in roubles
 * @param onRemove - Clears the applied promocode
 */
const PromocodeApplied = memo(
  ({
    code,
    discountedTotal,
    originalTotal,
    onRemove,
  }: {
    code: string
    discountedTotal: number
    originalTotal: number
    onRemove: () => void
  }) => {
    const savedAmount = originalTotal - discountedTotal
    const savedFormatted = savedAmount.toLocaleString('ru-RU')

    return (
      <div className={styles.appliedBlock} role="status" aria-label={`Промокод ${code} применён`}>
        {/* Checkmark icon */}
        <svg
          className={styles.appliedIcon}
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M20 6L9 17l-5-5" />
        </svg>

        <div className={styles.appliedInfo}>
          <p className={styles.appliedCode}>{code}</p>
          {savedAmount > 0 && (
            <p className={styles.appliedSubtext}>
              Скидка {savedFormatted} ₽
            </p>
          )}
        </div>

        <button
          type="button"
          className={styles.removeBtn}
          onClick={onRemove}
          aria-label="Удалить промокод"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    )
  },
)
PromocodeApplied.displayName = 'PromocodeApplied'

// ─── Public component ─────────────────────────────────────────────────────────

/**
 * Promocode section for the cart page.
 *
 * State machine:
 *   collapsed  →  (click trigger)  →  expanded (input form)
 *   expanded   →  (success apply)  →  applied  (chip)
 *   expanded   →  (cancel)         →  collapsed
 *   applied    →  (remove)         →  collapsed
 *
 * Reads `appliedPromocode` from Redux; all other state is local to avoid
 * unnecessary re-renders of sibling cart components.
 *
 * @param originalTotal - Raw cart total before any discount, used to calculate savings display
 */
export const PromocodeSection = memo(({ originalTotal }: { originalTotal: number }) => {
  const dispatch = useDispatch()
  const appliedPromocode = useAppSelector((state) => state.cart.appliedPromocode)
  const [isExpanded, setIsExpanded] = useState(false)

  const handleOpen = useCallback(() => setIsExpanded(true), [])
  const handleCancel = useCallback(() => setIsExpanded(false), [])

  const handleRemove = useCallback(() => {
    dispatch(clearPromocode())
    setIsExpanded(false)
  }, [dispatch])

  // Applied state takes priority — show chip regardless of isExpanded
  if (appliedPromocode) {
    return (
      <PromocodeApplied
        code={appliedPromocode.code}
        discountedTotal={appliedPromocode.discountedTotal}
        originalTotal={originalTotal}
        onRemove={handleRemove}
      />
    )
  }

  if (isExpanded) {
    return <PromocodeForm onCancel={handleCancel} />
  }

  return <PromocodeButton onClick={handleOpen} />
})

PromocodeSection.displayName = 'PromocodeSection'
