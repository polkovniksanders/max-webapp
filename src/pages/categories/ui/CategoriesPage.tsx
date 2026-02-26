import { useGetCategoriesQuery } from '@entities/category'
import { PageHeader, Spinner, ErrorState } from '@shared/ui'
import styles from './CategoriesPage.module.css'

export const CategoriesPage = () => {
  const { data, isLoading, isError, refetch } = useGetCategoriesQuery()

  return (
    <div className={styles.page}>
      <PageHeader title="Каталог" />

      {isLoading && (
        <div className={styles.center}>
          <Spinner />
        </div>
      )}

      {isError && (
        <ErrorState message="Не удалось загрузить категории" onRetry={refetch} />
      )}

      {data && (
        <ul className={styles.list}>
          {data.map((category) => (
            <li key={category.id} className={styles.item}>
              <span className={styles.itemName}>{category.name}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
