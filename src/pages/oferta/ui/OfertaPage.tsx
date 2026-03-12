import { PageHeader } from '@shared/ui'
import { useBackButton } from '@shared/hooks/useBackButton'
import styles from './OfertaPage.module.css'

/**
 * Oferta (public offer) page — displays the terms of the shop's public offer.
 * Currently shows placeholder text; replace with real content when available.
 */
export const OfertaPage = () => {
  useBackButton()

  return (
    <div className={styles.page}>
      <PageHeader title="Условия оферты" />
      <div className={styles.content}>
        <p className={styles.placeholder}>
          Текст условий публичной оферты будет размещён здесь. Продолжая оформление заказа, вы
          подтверждаете, что ознакомились с условиями и принимаете их в полном объёме.
        </p>
      </div>
    </div>
  )
}
