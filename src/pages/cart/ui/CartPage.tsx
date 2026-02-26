import { PageHeader } from '@shared/ui'
import styles from './CartPage.module.css'

export const CartPage = () => {
  return (
    <div className={styles.page}>
      <PageHeader title="Корзина" />
      <p className={styles.empty}>Корзина пуста</p>
    </div>
  )
}
