import { useNavigate } from 'react-router-dom'
import { PageHeader } from '@shared/ui'
import { ROUTES } from '@shared/config/routes'
import styles from './CartPage.module.css'

/**
 * Cart page — lists cart contents and provides a sticky "Proceed to checkout"
 * button that navigates to the contact step of the checkout flow.
 *
 * TODO: connect to cartSlice to render real cart items.
 */
export const CartPage = () => {
  const navigate = useNavigate()

  return (
    <div className={styles.page}>
      <PageHeader title="Корзина" />
      <p className={styles.empty}>Корзина пуста</p>

      <div className={styles.bottomBar}>
        <button
          className={styles.checkoutBtn}
          onClick={() => navigate(ROUTES.CHECKOUT_CONTACT)}
        >
          Перейти к оформлению
        </button>
      </div>
    </div>
  )
}
