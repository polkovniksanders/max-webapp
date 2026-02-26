import { useGetShopQuery } from '@entities/shop'
import { useBackButton } from '@shared/hooks/useBackButton'
import { ErrorState, SkeletonBlock, SkeletonLine } from '@shared/ui'
import styles from './ShopDetailPage.module.css'

export const ShopDetailPage = () => {
  const { data: shop, isLoading, isError, refetch } = useGetShopQuery()

  useBackButton()

  if (isLoading) {
    return (
      <div className={styles.page}>
        <div className={styles.imageWrap}>
          <SkeletonBlock aspectRatio="1/1" borderRadius="var(--radius-large, 16px)" />
        </div>
        <div className={styles.content}>
          <SkeletonLine width="60%" height={28} />
          <SkeletonLine />
          <SkeletonLine />
          <SkeletonLine width="70%" />
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className={styles.page}>
        <ErrorState message="Не удалось загрузить информацию о магазине" onRetry={refetch} />
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
