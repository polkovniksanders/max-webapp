import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGetCategoriesQuery } from '@entities/category'
import type { ApiCategory } from '@entities/category'
import {
  useLazyGetCategoryProductsQuery,
  useSearchProductsQuery,
  useGetCategoryProductsQuery,
  buildImageUrl,
} from '@entities/product'
import type { ApiProduct } from '@entities/product'
import { useGetShopQuery } from '@entities/shop'
import { CartableProductCard } from '@widgets/cartable-product-card'
import { BannerSlider } from '@features/banner'
import {
  CatalogSearchBar,
  CatalogSortButton,
  selectProductFilters,
  selectHasActiveFilters,
  selectSelectedCategoryId,
  selectSelectedCategoryName,
  selectBreadcrumbs,
  productFiltersActions,
} from '@features/product-filters'
import { useAppDispatch, useAppSelector } from '@app/store'
import { Spinner, SkeletonBlock, SkeletonLine } from '@shared/ui'
import { useOnScreen } from '@shared/hooks/useOnScreen'
import { ROUTES } from '@shared/config/routes'
import { getShopId } from '@shared/config/shopId'
import styles from './MainPage.module.css'

type CategoryRow = ApiCategory & { products?: ApiProduct[] }

const getSortLabel = (sortBy: string | null, sortDirection: string | null): string | null => {
  if (!sortBy || !sortDirection) return null
  if (sortBy === 'price' && sortDirection === 'asc') return 'Сначала недорогие'
  if (sortBy === 'price' && sortDirection === 'desc') return 'Сначала дорогие'
  return null
}

export const MainPage = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const filters = useAppSelector(selectProductFilters)
  const hasActiveFilters = useAppSelector(selectHasActiveFilters)
  const selectedCategoryId = useAppSelector(selectSelectedCategoryId)
  const selectedCategoryName = useAppSelector(selectSelectedCategoryName)
  const breadcrumbs = useAppSelector(selectBreadcrumbs)

  const { data: shop } = useGetShopQuery(getShopId())
  const { data: categories, isLoading: isCategoriesLoading } = useGetCategoriesQuery()
  const [fetchProducts, { isFetching }] = useLazyGetCategoryProductsQuery()

  // ── Infinite scroll state ──────────────────────────────────────────────────
  const [list, setList] = useState<CategoryRow[]>([])
  const listRef = useRef<CategoryRow[]>([])

  useEffect(() => {
    listRef.current = list
  }, [list])

  useEffect(() => {
    if (categories && categories.length > 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setList(categories.map((cat) => ({ ...cat })))
    }
  }, [categories])

  const { isOnScreen, targetRef } = useOnScreen()

  const isInFilteredMode = hasActiveFilters || selectedCategoryId !== null

  useEffect(() => {
    if (isFetching || !isOnScreen || isInFilteredMode) return

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
  }, [isOnScreen, isFetching, fetchProducts, isInFilteredMode])

  // ── Search results ─────────────────────────────────────────────────────────
  const {
    data: searchResults,
    isLoading: isSearchLoading,
    isFetching: isSearchFetching,
  } = useSearchProductsQuery(
    {
      title: filters.searchQuery || undefined,
      sort_by: filters.sortBy ?? undefined,
      sort_direction: filters.sortDirection ?? undefined,
    },
    { skip: !hasActiveFilters },
  )

  // ── Category products ──────────────────────────────────────────────────────
  const {
    data: categoryProducts,
    isLoading: isCategoryLoading,
    isFetching: isCategoryFetching,
  } = useGetCategoryProductsQuery(selectedCategoryId!, { skip: selectedCategoryId === null })

  const sortLabel = getSortLabel(filters.sortBy, filters.sortDirection)

  const handleProductClick = (product: ApiProduct) => {
    navigate(ROUTES.PRODUCT.replace(':id', String(product.id)))
  }

  const pendingIndex = list.findIndex((cat) => cat.products === undefined)
  const hasMore = pendingIndex !== -1

  // ── Toolbar ────────────────────────────────────────────────────────────────
  const toolbar = (
    <>
      <div className={styles.toolbar}>
        <CatalogSortButton />
        <CatalogSearchBar />
      </div>
      {breadcrumbs.length > 1 && selectedCategoryId !== null && (
        <div className={styles.breadcrumbsBar}>
          {breadcrumbs.map((crumb, i) => (
            <span key={crumb.id} className={styles.breadcrumbEntry}>
              {i > 0 && <span className={styles.breadcrumbSep}>/</span>}
              <span
                className={`${styles.breadcrumbCrumb} ${i === breadcrumbs.length - 1 ? styles.breadcrumbLast : ''}`}
              >
                {crumb.name}
              </span>
            </span>
          ))}
        </div>
      )}
      {(sortLabel || selectedCategoryId) && (
        <div className={styles.activeFilters}>
          {selectedCategoryId && (
            <span className={styles.filterChip}>
              {selectedCategoryName}
              <button
                className={styles.filterChipClose}
                onClick={() => dispatch(productFiltersActions.setSelectedCategory(null))}
                aria-label="Сбросить категорию"
              >
                ×
              </button>
            </span>
          )}
          {sortLabel && (
            <span className={styles.filterChip}>
              {sortLabel}
              <button
                className={styles.filterChipClose}
                onClick={() => dispatch(productFiltersActions.setSort(null))}
                aria-label="Сбросить сортировку"
              >
                ×
              </button>
            </span>
          )}
        </div>
      )}
    </>
  )

  if (isCategoriesLoading) {
    return (
      <div className={styles.page}>
        <ShopHeader shop={shop} onInfoClick={() => navigate(ROUTES.SHOP_DETAIL)} />
        {toolbar}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <SkeletonLine width="35%" height={18} />
          </div>
          <div className={styles.grid}>
            {Array.from({ length: 6 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    )
  }

  const sliderCategories = categories?.filter((c) => c.is_slider) ?? []

  return (
    <div className={styles.page}>
      <ShopHeader shop={shop} onInfoClick={() => navigate(ROUTES.SHOP_DETAIL)} />

      {shop?.banners && shop.banners.length > 0 && (
        <BannerSlider banners={shop.banners} />
      )}

      {sliderCategories.length > 0 && (
        <div className={styles.categoriesSlider}>
          {sliderCategories.map((cat) => (
            <div
              key={cat.id}
              className={styles.sliderItem}
              onClick={() => dispatch(productFiltersActions.setSelectedCategory({ id: cat.id, name: cat.name }))}
            >
              {cat.image ? (
                <img src={buildImageUrl(cat.image)} alt={cat.name} className={styles.sliderImg} loading="lazy" />
              ) : (
                <div className={styles.sliderImgPlaceholder} />
              )}
              <span className={styles.sliderName}>{cat.name}</span>
            </div>
          ))}
        </div>
      )}

      {toolbar}

      {/* ── Режим выбранной категории ───────────────────────────────────────── */}
      {selectedCategoryId !== null && !hasActiveFilters && (
        <>
          {(isCategoryLoading || isCategoryFetching) && (
            <div className={styles.centerState}>
              <Spinner />
            </div>
          )}
          {!isCategoryLoading && !isCategoryFetching && (
            <>
              {categoryProducts && categoryProducts.length > 0 ? (
                <div className={styles.section}>
                  <div className={styles.sectionHeader}>
                    <span className={styles.sectionTitle}>{selectedCategoryName}</span>
                  </div>
                  <div className={styles.grid}>
                    {categoryProducts.map((product) => (
                      <CartableProductCard
                        key={product.id}
                        product={product}
                        onClick={() => handleProductClick(product)}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <div className={styles.centerState}>
                  <p className={styles.endText}>В этой категории нет товаров</p>
                </div>
              )}
            </>
          )}
        </>
      )}

      {/* ── Режим поиска / сортировки ──────────────────────────────────────── */}
      {hasActiveFilters && (
        <>
          {(isSearchLoading || isSearchFetching) && (
            <div className={styles.centerState}>
              <Spinner />
            </div>
          )}
          {!isSearchLoading && !isSearchFetching && (
            <>
              {searchResults && searchResults.length > 0 ? (
                <div className={styles.section}>
                  <div className={styles.grid}>
                    {searchResults.map((product) => (
                      <CartableProductCard
                        key={product.id}
                        product={product}
                        onClick={() => handleProductClick(product)}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <div className={styles.centerState}>
                  <p className={styles.endText}>Ничего не найдено</p>
                </div>
              )}
            </>
          )}
        </>
      )}

      {/* ── Обычный режим: инфинит скролл по категориям ────────────────────── */}
      {!isInFilteredMode && (
        <>
          {list.map((category) => {
            if (!category.products) return null
            return (
              <section key={category.id} className={styles.section}>
                <div className={styles.sectionHeader}>
                  <span className={styles.sectionTitle}>{category.name}</span>
                  <button
                    className={styles.sectionChevron}
                    onClick={() => dispatch(productFiltersActions.setSelectedCategory({ id: category.id, name: category.name }))}
                    aria-label={`Все товары — ${category.name}`}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="9 18 15 12 9 6"/></svg>
                  </button>
                </div>
                <div className={styles.grid}>
                  {category.products.map((product) => (
                    <CartableProductCard
                      key={product.id}
                      product={product}
                      onClick={() => handleProductClick(product)}
                    />
                  ))}
                </div>
              </section>
            )
          })}

          {hasMore && (
            <div ref={targetRef} className={styles.sentinel}>
              <Spinner />
            </div>
          )}

          {!hasMore && list.length > 0 && (
            <p className={styles.endText}>Все категории загружены</p>
          )}
        </>
      )}
    </div>
  )
}

// ─── Skeleton helpers ────────────────────────────────────────────────────────

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

// ─── ShopHeader ───────────────────────────────────────────────────────────────

interface ShopHeaderProps {
  shop?: { name: string; photo: string | null } | null
  onInfoClick: () => void
}

const ShopHeader = ({ shop, onInfoClick }: ShopHeaderProps) => {
  if (!shop) {
    return (
      <div className={styles.shopHeaderSkeleton}>
        <div className={styles.shopPhotoSkeleton}>
          <SkeletonBlock aspectRatio="1/1" borderRadius="14px" />
        </div>
        <SkeletonLine width="45%" height={20} />
      </div>
    )
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
    </button>
  )
}
