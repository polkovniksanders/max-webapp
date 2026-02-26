import { useGetShopQuery } from '@entities/shop'
import { useBackButton } from '@shared/hooks/useBackButton'
import styles from './ShopDetailPage.module.css'

export const ShopDetailPage = () => {
  const { data: shop, isLoading, isError, refetch } = useGetShopQuery()

  useBackButton()

  if (isLoading) {
    return (
      <div className={styles.page}>
        <div className={styles.skeletonImage} />
        <div className={styles.content}>
          <div className={styles.skeletonTitle} />
          <div className={styles.skeletonLine} />
          <div className={styles.skeletonLine} />
          <div className={styles.skeletonLineShort} />
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className={styles.page}>
        <div className={styles.stateWrap}>
          <div className={styles.errorIcon}>!</div>
          <span className={styles.stateText}>Не удалось загрузить информацию о магазине</span>
          <button className={styles.retryBtn} onClick={refetch}>Повторить</button>
        </div>
      </div>
    )
  }

  if (!shop) return null

  return (
    <div className={styles.page}>
      <div className={styles.imageWrap}>
        {shop.photo ? (
          <img src={shop.photo} alt={shop.name} className={styles.image} />
        ) : (
          <div className={styles.imagePlaceholder}>
            <span className={styles.imagePlaceholderLetter}>{shop.name[0].toUpperCase()}</span>
          </div>
        )}
      </div>

      <div className={styles.content}>
        <h1 className={styles.name}>{shop.name}</h1>
        {shop.about && <p className={styles.about}>{shop.about}</p>}
      </div>
    </div>
  )
}
