import { useNavigate } from 'react-router-dom'
import { CheckCircle } from 'lucide-react'
import { ROUTES } from '@shared/config/routes'
import styles from './OrderSuccessPage.module.css'

/**
 * Final screen of the checkout flow shown after a successful order submission.
 *
 * Renders a success icon, confirmation message, and a button that returns the
 * user to the main page.  This page has no back button — the checkout session
 * is complete, so going back is intentionally disabled.
 */
export const OrderSuccessPage = () => {
  const navigate = useNavigate()

  return (
    <div className={styles.page}>
      <div className={styles.wrap}>
        <div className={styles.iconWrap}>
          <CheckCircle size={40} color="#27ae60" strokeWidth={2} />
        </div>

        <p className={styles.title}>Заказ оформлен!</p>
        <p className={styles.subtitle}>Мы свяжемся с вами в ближайшее время</p>

        <button
          className={styles.homeBtn}
          onClick={() => navigate(ROUTES.MAIN, { replace: true })}
        >
          На главную
        </button>
      </div>
    </div>
  )
}
