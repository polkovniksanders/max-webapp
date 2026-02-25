import { NavLink } from 'react-router-dom'
import { ROUTES } from '@shared/config/routes'
import styles from './Navbar.module.css'

export const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      <NavLink
        to={ROUTES.MAIN}
        end
        className={({ isActive }) =>
          isActive ? `${styles.link} ${styles.active}` : styles.link
        }
      >
        Главная
      </NavLink>
      <NavLink
        to={ROUTES.PROFILE}
        className={({ isActive }) =>
          isActive ? `${styles.link} ${styles.active}` : styles.link
        }
      >
        Профиль
      </NavLink>
    </nav>
  )
}
