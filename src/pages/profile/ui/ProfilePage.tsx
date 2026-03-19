import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getWebApp } from '@shared/bridge'
import { ROUTES } from '@shared/config/routes'
import { getShopId } from '@shared/config/shopId'
import { useLazyGetProductHistoryQuery } from '@entities/product'
import { CartableProductCard } from '@widgets/cartable-product-card'
import { SkeletonBlock, SkeletonLine } from '@shared/ui'
import styles from './ProfilePage.module.css'

const ProductCardSkeleton = () => (
  <div className={styles.productCardSkeleton}>
    <SkeletonBlock aspectRatio="1/1" borderRadius="12px" />
    <div className={styles.productCardSkeletonInfo}>
      <SkeletonLine height={13} />
      <SkeletonLine width="70%" height={13} />
      <SkeletonLine width="50%" height={18} />
    </div>
  </div>
)

export const ProfilePage = () => {
  const navigate = useNavigate()
  const user = getWebApp()?.initDataUnsafe?.user

  const [fetchHistory, { data: historyProducts, isLoading: isHistoryLoading }] = useLazyGetProductHistoryQuery()

  useEffect(() => {
    fetchHistory(getShopId())
  }, [])

  const fullName = [user?.first_name, user?.last_name].filter(Boolean).join(' ') || 'Пользователь'
  const avatarLetter = (user?.first_name ?? fullName)[0]?.toUpperCase() ?? '?'

  return (
    <div className={styles.page}>
      <section className={styles.userSection}>
        {user?.photo_url ? (
          <img src={user.photo_url} alt={fullName} className={styles.avatar} />
        ) : (
          <div className={styles.avatarPlaceholder}>{avatarLetter}</div>
        )}
        <span className={styles.userName}>{fullName}</span>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Заказы</h2>
        <div className={styles.card}>
          <p className={styles.emptyText}>Заказов пока нет</p>
        </div>
        <button className={styles.historyRow} onClick={() => navigate(ROUTES.ORDERS)}>
          <span>История заказов</span>
          <ChevronIcon />
        </button>
      </section>

      {isHistoryLoading && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>История просмотров</h2>
          <div className={styles.historyGrid}>
            {Array.from({ length: 4 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </section>
      )}

      {!isHistoryLoading && historyProducts && historyProducts.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>История просмотров</h2>
          <div className={styles.historyGrid}>
            {historyProducts.map((product) => (
              <CartableProductCard
                key={product.id}
                product={product}
                onClick={() => navigate(ROUTES.PRODUCT.replace(':id', String(product.id)))}
              />
            ))}
          </div>
        </section>
      )}

      <div className={styles.bottomBar}>
        <button className={styles.contactBtn} onClick={() => getWebApp()?.openMaxLink('https://max.ru')}>
          Задать вопрос
        </button>
      </div>
    </div>
  )
}

const ChevronIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="9 18 15 12 9 6" />
  </svg>
)
