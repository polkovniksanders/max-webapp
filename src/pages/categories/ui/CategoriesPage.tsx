import { useGetCategoriesQuery } from '@entities/category'
import styles from './CategoriesPage.module.css'

export const CategoriesPage = () => {
  const { data, isLoading, isError, refetch } = useGetCategoriesQuery()

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Категории</h1>
      </div>

      {isLoading && (
        <div className={styles.stateWrap}>
          <div className={styles.spinner} />
          <span className={styles.stateText}>Загружаем категории…</span>
        </div>
      )}

      {isError && (
        <div className={styles.stateWrap}>
          <div className={styles.errorIcon}>!</div>
          <span className={styles.stateText}>Не удалось загрузить категории</span>
          <button className={styles.retryBtn} onClick={refetch}>
            Попробовать снова
          </button>
        </div>
      )}

      {data && (
        <ul className={styles.list}>
          {data.map((category) => (
            <li key={category.id} className={styles.item}>
              <div className={styles.itemLeft}>
                {category.image ? (
                  <img
                    src={category.image}
                    alt={category.name}
                    className={styles.itemImg}
                  />
                ) : (
                  <div className={styles.itemImgPlaceholder}>
                    {category.name[0].toUpperCase()}
                  </div>
                )}
                <div className={styles.itemInfo}>
                  <span className={styles.itemName}>{category.name}</span>
                  {category.description && (
                    <span className={styles.itemDesc}>{category.description}</span>
                  )}
                </div>
              </div>
              <ChevronIcon />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

const ChevronIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    style={{ flexShrink: 0, color: 'var(--max-color-text-secondary, #888)' }}
  >
    <polyline points="9 18 15 12 9 6" />
  </svg>
)
