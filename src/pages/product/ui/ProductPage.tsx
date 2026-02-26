import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useGetProductQuery, buildImageUrl } from '@entities/product'
import { useBackButton } from '@shared/hooks/useBackButton'
import { SkeletonBlock, SkeletonLine } from '@shared/ui'
import styles from './ProductPage.module.css'

export const ProductPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { data: product, isLoading, isError } = useGetProductQuery(Number(id), { skip: !id })

  useBackButton()

  useEffect(() => {
    if (isError) navigate(-1)
  }, [isError, navigate])

  if (isLoading) {
    return (
      <div className={styles.page}>
        <SkeletonBlock />
        <div className={styles.content}>
          <SkeletonLine width="75%" height={28} />
          <SkeletonLine width="40%" height={36} />
          <SkeletonLine />
          <SkeletonLine />
          <SkeletonLine width="60%" />
        </div>
      </div>
    )
  }

  if (!product) return null

  const imageUrl = buildImageUrl(product.images?.[0]?.file)
  const discount = product.discount ?? 0

  return (
    <div className={styles.page}>
      {/* Фото */}
      {imageUrl && (
        <div className={styles.imageWrap}>
          <img src={imageUrl} alt={product.title} className={styles.image} />
          {discount > 0 && <span className={styles.discountBadge}>–{discount}%</span>}
        </div>
      )}

      {/* Контент */}
      <div className={styles.content}>
        <h1 className={styles.title}>{product.title}</h1>

        {/* Цена */}
        <div className={styles.priceRow}>
          <span className={styles.price}>{product.price.toLocaleString('ru-RU')} ₽</span>
          {product.old_price && (
            <span className={styles.oldPrice}>
              {product.old_price.toLocaleString('ru-RU')} ₽
            </span>
          )}
          {discount > 0 && product.old_price && (
            <span className={styles.savings}>
              Экономия {(product.old_price - product.price).toLocaleString('ru-RU')} ₽
            </span>
          )}
        </div>

        {/* Описание */}
        {product.description && (
          <div className={styles.section}>
            <div className={styles.sectionTitle}>Описание</div>
            <div
              className={styles.description}
              dangerouslySetInnerHTML={{ __html: product.description.replace(/\n/g, '<br>') }}
            />
          </div>
        )}

        {/* Характеристики */}
        {product.attributes && Object.keys(product.attributes).length > 0 && (
          <div className={styles.section}>
            <div className={styles.sectionTitle}>Характеристики</div>
            <div className={styles.attrs}>
              {Object.entries(product.attributes).map(([key, value]) => (
                <div key={key} className={styles.attrRow}>
                  <span className={styles.attrKey}>{key}</span>
                  <span className={styles.attrDots} />
                  <span className={styles.attrVal}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
