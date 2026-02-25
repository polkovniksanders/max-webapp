import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useGetCategoriesQuery } from '@entities/category'
import type { ApiCategory } from '@entities/category'
import { useLazyGetCategoryProductsQuery, buildImageUrl, setSelectedProduct } from '@entities/product'
import type { ApiProduct } from '@entities/product'
import { useGetShopQuery } from '@entities/shop'
import { useOnScreen } from '@shared/hooks/useOnScreen'
import { ROUTES } from '@shared/config/routes'
import styles from './MainPage.module.css'

type CategoryRow = ApiCategory & { products?: ApiProduct[] }

export const MainPage = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { data: shop } = useGetShopQuery()
  const { data: categories, isLoading: isCategoriesLoading } = useGetCategoriesQuery()
  const [fetchProducts, { isFetching }] = useLazyGetCategoryProductsQuery()

  const [list, setList] = useState<CategoryRow[]>([])
  const listRef = useRef<CategoryRow[]>([])

  // Синхронизируем ref с state чтобы избежать stale closure в эффекте скролла
  useEffect(() => {
    listRef.current = list
  }, [list])

  // Инициализируем список когда категории загрузились
  useEffect(() => {
    if (categories && categories.length > 0) {
      setList(categories.map((cat) => ({ ...cat })))
    }
  }, [categories])

  const { isOnScreen, targetRef } = useOnScreen()

  // Загружаем товары следующей незагруженной категории когда сентинел видим
  useEffect(() => {
    if (isFetching || !isOnScreen) return

    const nextIndex = listRef.current.findIndex((cat) => cat.products === undefined)
    if (nextIndex === -1) return

    const categoryId = listRef.current[nextIndex].id

    fetchProducts(categoryId).then((result) => {
      setList((prev) => {
        const next = [...prev]
        next[nextIndex] = { ...next[nextIndex], products: result.data ?? [] }
        return next
      })
    })
  }, [isOnScreen, isFetching, fetchProducts])

  const handleProductClick = (product: ApiProduct) => {
    dispatch(setSelectedProduct({
      id: product.id,
      title: product.title,
      description: product.description ?? '',
      price: product.price,
      oldPrice: product.old_price,
      discount: product.discount,
      categoryId: 'other',
      image: buildImageUrl(product.images[0]?.file),
      attributes: {},
    }))
    navigate(ROUTES.PRODUCT.replace(':id', String(product.id)))
  }

  const pendingIndex = list.findIndex((cat) => cat.products === undefined)
  const hasMore = pendingIndex !== -1

  if (isCategoriesLoading) {
    return (
      <div className={styles.page}>
        <ShopHeader shop={shop} onInfoClick={() => navigate(ROUTES.SHOP_DETAIL)} />
        <div className={styles.centerState}>
          <div className={styles.spinner} />
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <ShopHeader shop={shop} onInfoClick={() => navigate(ROUTES.SHOP_DETAIL)} />

      {list.map((category) => {
        if (!category.products) return null
        return (
          <section key={category.id} className={styles.section}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionTitle}>{category.name}</span>
            </div>
            <div className={styles.grid}>
              {category.products.map((product) => (
                <div
                  key={product.id}
                  className={styles.card}
                  onClick={() => handleProductClick(product)}
                >
                  <div className={styles.cardImg}>
                    {product.images[0]?.file ? (
                      <img
                        src={buildImageUrl(product.images[0].file)}
                        alt={product.title}
                        className={styles.img}
                      />
                    ) : (
                      <div className={styles.imgPlaceholder} />
                    )}
                    {product.discount > 0 && (
                      <span className={styles.discountBadge}>–{product.discount}%</span>
                    )}
                  </div>
                  <div className={styles.cardBody}>
                    <p className={styles.cardTitle}>{product.title}</p>
                    <div className={styles.priceRow}>
                      <span className={styles.price}>
                        {product.price.toLocaleString('ru-RU')} ₽
                      </span>
                      {product.old_price && (
                        <span className={styles.oldPrice}>
                          {product.old_price.toLocaleString('ru-RU')} ₽
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )
      })}

      {/* Сентинел: виден пока есть незагруженные категории */}
      {hasMore && (
        <div ref={targetRef} className={styles.sentinel}>
          <div className={styles.spinner} />
        </div>
      )}

      {!hasMore && list.length > 0 && (
        <p className={styles.endText}>Все категории загружены</p>
      )}
    </div>
  )
}

// ─── ShopHeader ──────────────────────────────────────────────────────────────

interface ShopHeaderProps {
  shop?: { name: string; photo: string | null } | null
  onInfoClick: () => void
}

const ShopHeader = ({ shop, onInfoClick }: ShopHeaderProps) => {
  if (!shop) {
    return <div className={styles.shopHeaderSkeleton} />
  }
  return (
    <button className={styles.shopHeader} onClick={onInfoClick}>
      {shop.photo ? (
        <img src={shop.photo} alt={shop.name} className={styles.shopPhoto} />
      ) : (
        <div className={styles.shopPhotoPlaceholder}>
          {shop.name[0].toUpperCase()}
        </div>
      )}
      <span className={styles.shopName}>{shop.name}</span>
      <svg
        className={styles.shopChevron}
        width="16" height="16" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" strokeWidth="2"
      >
        <polyline points="9 18 15 12 9 6" />
      </svg>
    </button>
  )
}
