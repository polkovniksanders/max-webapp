import { getWebApp } from '@shared/bridge'
import styles from './ProfilePage.module.css'

export const ProfilePage = () => {
  const webApp = getWebApp()
  const user = webApp?.initDataUnsafe?.user

  const handleClose = () => {
    webApp?.close()
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Профиль</h1>

      <div className={styles.card}>
        <div className={styles.avatar}>
          {user?.name?.charAt(0).toUpperCase() ?? '?'}
        </div>
        <div className={styles.info}>
          <p className={styles.name}>{user?.name ?? 'Пользователь'}</p>
          {user?.username && (
            <p className={styles.username}>@{user.username}</p>
          )}
          {user?.id && (
            <p className={styles.id}>ID: {user.id}</p>
          )}
        </div>
      </div>

      <p className={styles.hint}>Это страница-заглушка профиля.</p>

      <button className={styles.closeBtn} onClick={handleClose}>
        Закрыть приложение
      </button>
    </div>
  )
}
