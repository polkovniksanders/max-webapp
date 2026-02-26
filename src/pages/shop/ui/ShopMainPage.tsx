import { useState } from 'react'
import { useAppSelector } from '@app/store'
import { CATEGORIES } from '@entities/product'
import type { CategoryId } from '@entities/product'
import styles from './ShopMainPage.module.css'

export const ShopMainPage = () => {
  const [activeCategory, setActiveCategory] = useState<CategoryId>('all')
  const shop = useAppSelector((state) => state.shop.shop)

  return (
    <div className={styles.page}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.shopLogo}>{shop.name[0]}</div>
          <div>
            <div className={styles.shopName}>{shop.name}</div>
            <div className={styles.shopDesc}>{shop.description}</div>
          </div>
        </div>
      </header>

      {/* Banner */}
      {shop.bannerImage && (
        <div className={styles.banner}>
          <img src={shop.bannerImage} alt="Баннер магазина" className={styles.bannerImg} />
        </div>
      )}

      {/* Categories */}
      <div className={styles.categoriesWrap}>
        <div className={styles.categories}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              className={`${styles.catBtn} ${activeCategory === cat.id ? styles.catBtnActive : ''}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Products grid */}
      <div className={styles.grid} />
    </div>
  )
}
