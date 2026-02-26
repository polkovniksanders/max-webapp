import styles from './ErrorState.module.css'

interface ErrorStateProps {
  message: string
  onRetry: () => void
}

export const ErrorState = ({ message, onRetry }: ErrorStateProps) => (
  <div className={styles.wrap}>
    <div className={styles.icon}>!</div>
    <span className={styles.message}>{message}</span>
    <button className={styles.retryBtn} onClick={onRetry}>
      Повторить
    </button>
  </div>
)
