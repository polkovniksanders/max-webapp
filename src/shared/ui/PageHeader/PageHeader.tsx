import styles from './PageHeader.module.css'

interface PageHeaderProps {
  title: string
}

export const PageHeader = ({ title }: PageHeaderProps) => {
  return (
    <div className={styles.header}>
      <h1 className={styles.title}>{title}</h1>
    </div>
  )
}
