import { useNavigate } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { PageHeader } from '@shared/ui'
import { useBackButton } from '@shared/hooks/useBackButton'
import { ROUTES } from '@shared/config/routes'
import { saveContactData, loadContactData } from '@features/checkout'
import styles from './CheckoutContactPage.module.css'

/**
 * Formats a raw digit string into the Russian phone mask: +7 (XXX) XXX-XX-XX.
 * Normalises leading 8 → +7. Truncates at 11 digits total.
 *
 * @param raw - Raw input string (may contain non-digit characters).
 * @returns Formatted phone string.
 */
function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, '')
  // Normalise country code: treat leading 8 as 7, prepend 7 if absent.
  const d =
    digits.startsWith('7')
      ? digits
      : digits.startsWith('8')
      ? '7' + digits.slice(1)
      : '7' + digits
  const s = d.slice(0, 11)

  let r = ''
  if (s.length > 0) r = '+7'
  if (s.length > 1) r += ' (' + s.slice(1, Math.min(4, s.length))
  if (s.length >= 4) r += ')'
  if (s.length > 4) r += ' ' + s.slice(4, Math.min(7, s.length))
  if (s.length > 7) r += '-' + s.slice(7, Math.min(9, s.length))
  if (s.length > 9) r += '-' + s.slice(9, 11)
  return r
}

/** Zod schema for the contact step: phone (11 digits) + oferta checkbox. */
const schema = z.object({
  phone: z
    .string()
    .min(1, 'Введите номер телефона')
    .refine(
      (v) => v.replace(/\D/g, '').length === 11,
      'Введите полный номер телефона',
    ),
  ofertaAccepted: z.literal(true, {
    error: 'Необходимо согласиться с условиями оферты',
  }),
})

type FormValues = z.infer<typeof schema>

/**
 * Step 1 of checkout: collects phone number and oferta consent.
 *
 * - Restores saved values from sessionStorage on mount.
 * - Validates with Zod via react-hook-form.
 * - On submit, persists to sessionStorage and navigates to the delivery step.
 */
export const CheckoutContactPage = () => {
  const navigate = useNavigate()
  useBackButton()

  const saved = loadContactData()

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      phone: saved.phone ?? '',
      // react-hook-form needs boolean; literal(true) rejects false/undefined at submit time.
      ofertaAccepted: saved.ofertaAccepted === true ? true : undefined,
    },
  })

  const onSubmit = (data: FormValues) => {
    saveContactData({ phone: data.phone, ofertaAccepted: data.ofertaAccepted })
    navigate(ROUTES.CHECKOUT_DELIVERY)
  }

  return (
    <div className={styles.page}>
      <PageHeader title="Контактные данные" />

      <form
        id="contact-form"
        className={styles.form}
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        {/* Phone field with manual mask via Controller */}
        <div className={styles.field}>
          <label className={styles.label} htmlFor="phone">
            Номер телефона
          </label>
          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <input
                id="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="+7 (___) ___-__-__"
                className={`${styles.input} ${errors.phone ? styles.inputError : ''}`}
                value={field.value}
                onChange={(e) => {
                  field.onChange(formatPhone(e.target.value))
                }}
                onBlur={field.onBlur}
              />
            )}
          />
          {errors.phone && (
            <span className={styles.error} role="alert">
              {errors.phone.message}
            </span>
          )}
        </div>

        {/* Oferta checkbox */}
        <div className={styles.field}>
          <div className={styles.checkboxRow}>
            <input
              id="ofertaAccepted"
              type="checkbox"
              className={styles.checkbox}
              {...register('ofertaAccepted')}
            />
            <label htmlFor="ofertaAccepted" className={styles.checkboxLabel}>
              Я принимаю условия{' '}
              <a
                href={`#${ROUTES.OFERTA}`}
                className={styles.ofertaLink}
                onClick={(e) => {
                  e.preventDefault()
                  navigate(ROUTES.OFERTA)
                }}
              >
                оферты
              </a>
            </label>
          </div>
          {errors.ofertaAccepted && (
            <span className={styles.error} role="alert">
              {errors.ofertaAccepted.message}
            </span>
          )}
        </div>
      </form>

      {/* Sticky submit button outside the form so it can be fixed to the bottom */}
      <div className={styles.bottomBar}>
        <button
          type="submit"
          form="contact-form"
          disabled={isSubmitting}
          className={styles.submitBtn}
        >
          Продолжить
        </button>
      </div>
    </div>
  )
}
