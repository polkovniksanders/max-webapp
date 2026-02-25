import { getWebApp } from '@shared/bridge'
import styles from './MainPage.module.css'

export const MainPage = () => {
  const webApp = getWebApp()
  const user = webApp?.initDataUnsafe?.user

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Главная</h1>
      <p className={styles.subtitle}>
        {user?.name
          ? `Привет, ${user.name}!`
          : 'Добро пожаловать в Max WebApp'}
      </p>
      <div className={styles.card}>
        <p>Это страница-заглушка главного экрана.</p>
        <p>Версия Bridge: <strong>{webApp?.version ?? 'н/д'}</strong></p>
      </div>
    </div>
  )
}
