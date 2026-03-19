import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGetCategoriesQuery } from '@entities/category'
import type { ApiCategory } from '@entities/category'
import { getRootCategories, getChildCategories, hasChildCategories } from '@entities/category'
import { productFiltersActions } from '@features/product-filters'
import { useAppDispatch } from '@app/store'
import { PageHeader, ErrorState, SkeletonLine, PercentIcon } from '@shared/ui'
import { getWebApp } from '@shared/bridge'
import { ROUTES } from '@shared/config/routes'
import styles from './CategoriesPage.module.css'

// ─── Types ────────────────────────────────────────────────────────────────────

type Breadcrumb = { id: number; name: string }

// ─── Helpers ─────────────────────────────────────────────────────────────────

const isHighlighted = (highlight: string[] | null): boolean =>
  highlight != null && highlight.length > 0

const isBold = (highlight: string[] | null): boolean =>
  highlight?.includes('bold') ?? false

// ─── Skeleton ────────────────────────────────────────────────────────────────

const CategoryListSkeleton = () => (
  <ul className={styles.list}>
    {Array.from({ length: 7 }).map((_, i) => (
      <li key={i} className={styles.skeletonItem}>
        <SkeletonLine width={`${40 + (i % 3) * 20}%`} height={16} />
      </li>
    ))}
  </ul>
)

// ─── CategoryItem ────────────────────────────────────────────────────────────

interface CategoryItemProps {
  category: ApiCategory
  hasChildren: boolean
  onClick: () => void
}

const CategoryItem = ({ category, hasChildren, onClick }: CategoryItemProps) => {
  const highlighted = isHighlighted(category.highlight)
  const bold = isBold(category.highlight)

  return (
    <li className={styles.item} onClick={onClick}>
      {highlighted && (
        <span className={styles.itemIcon}>
          <PercentIcon size={16} />
        </span>
      )}
      <span className={`${styles.itemName} ${bold ? styles.itemNameBold : ''}`}>
        {category.name}
      </span>
      {hasChildren && (
        <svg
          className={styles.chevron}
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
      )}
    </li>
  )
}

// ─── "Все категории" special row ──────────────────────────────────────────────

const AllCategoriesItem = ({ onClick }: { onClick: () => void }) => (
  <li className={`${styles.item} ${styles.itemAll}`} onClick={onClick}>
    <span className={styles.itemName}>Все категории</span>
  </li>
)

// ─── Breadcrumbs bar ─────────────────────────────────────────────────────────

interface BreadcrumbsBarProps {
  trail: Breadcrumb[]
  onNavigate: (index: number) => void
}

const BreadcrumbsBar = ({ trail, onNavigate }: BreadcrumbsBarProps) => (
  <div className={styles.breadcrumbsBar}>
    <button className={styles.breadcrumbItem} onClick={() => onNavigate(-1)}>
      Каталог
    </button>
    {trail.map((crumb, i) => (
      <span key={crumb.id} className={styles.breadcrumbsTrail}>
        <span className={styles.breadcrumbSep}>/</span>
        <button
          className={`${styles.breadcrumbItem} ${i === trail.length - 1 ? styles.breadcrumbCurrent : ''}`}
          onClick={() => onNavigate(i)}
          disabled={i === trail.length - 1}
        >
          {crumb.name}
        </button>
      </span>
    ))}
  </div>
)

// ─── Page ────────────────────────────────────────────────────────────────────

export const CategoriesPage = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const { data: categories, isLoading, isError, refetch } = useGetCategoriesQuery()

  // Local navigation stack: each entry = a category we drilled into
  const [navStack, setNavStack] = useState<Breadcrumb[]>([])

  const currentParentId = navStack.length > 0 ? navStack[navStack.length - 1].id : null

  // ── Back button (bridge) ────────────────────────────────────────────────────
  // Keep handler current via ref so we don't re-register on every navStack change
  const handleBackRef = useRef<() => void>()

  useEffect(() => {
    handleBackRef.current = () => {
      if (navStack.length > 0) {
        setNavStack((prev) => prev.slice(0, -1))
      } else {
        navigate(-1)
      }
    }
  }) // no deps — update after every render

  useEffect(() => {
    const webApp = getWebApp()
    if (!webApp) return
    const handler = () => handleBackRef.current?.()
    webApp.BackButton.show()
    webApp.BackButton.onClick(handler)
    return () => {
      webApp.BackButton.hide()
      webApp.BackButton.offClick(handler)
    }
  }, []) // register once, ref keeps handler current

  // ── Category list at current level ─────────────────────────────────────────
  const displayList: ApiCategory[] =
    categories == null
      ? []
      : currentParentId === null
        ? getRootCategories(categories)
        : getChildCategories(categories, currentParentId)

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleAllClick = () => {
    dispatch(productFiltersActions.setSelectedCategory(null))
    navigate(ROUTES.MAIN)
  }

  const handleCategoryClick = (category: ApiCategory) => {
    if (categories && hasChildCategories(categories, category.id)) {
      // Drill into subcategory
      setNavStack((prev) => [...prev, { id: category.id, name: category.name }])
    } else {
      // Leaf: navigate to main with filter + breadcrumbs
      const breadcrumbs = [...navStack, { id: category.id, name: category.name }]
      dispatch(
        productFiltersActions.setSelectedCategory({
          id: category.id,
          name: category.name,
          breadcrumbs: breadcrumbs.length > 1 ? breadcrumbs : [],
        }),
      )
      navigate(ROUTES.MAIN)
    }
  }

  const handleBreadcrumbNavigate = (index: number) => {
    // index === -1 → root; index N → jump to that level
    setNavStack((prev) => (index === -1 ? [] : prev.slice(0, index + 1)))
  }

  const pageTitle = navStack.length > 0 ? navStack[navStack.length - 1].name : 'Каталог'

  return (
    <div className={styles.page}>
      <PageHeader title={pageTitle} />

      {navStack.length > 0 && (
        <BreadcrumbsBar trail={navStack} onNavigate={handleBreadcrumbNavigate} />
      )}

      {isLoading && <CategoryListSkeleton />}

      {isError && (
        <ErrorState message="Не удалось загрузить категории" onRetry={refetch} />
      )}

      {!isLoading && !isError && (
        <ul className={styles.list}>
          {/* "Все категории" only at root level */}
          {currentParentId === null && <AllCategoriesItem onClick={handleAllClick} />}

          {displayList.map((category) => (
            <CategoryItem
              key={category.id}
              category={category}
              hasChildren={categories ? hasChildCategories(categories, category.id) : false}
              onClick={() => handleCategoryClick(category)}
            />
          ))}
        </ul>
      )}
    </div>
  )
}
