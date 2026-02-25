import { NavLink } from 'react-router-dom'
import { useSelector } from 'react-redux'
import type { RootState } from '@app/store'
import { ROUTES } from '@shared/config/routes'
import styles from './Navbar.module.css'

export const Navbar = () => {
  const cartCount = useSelector((state: RootState) =>
    state.cart.items.reduce((sum, item) => sum + item.quantity, 0),
  )

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
        to={ROUTES.SHOP}
        className={({ isActive }) =>
          isActive ? `${styles.link} ${styles.active}` : styles.link
        }
      >
        <span className={styles.linkInner}>
          Магазин
          {cartCount > 0 && <span className={styles.badge}>{cartCount > 99 ? '99+' : cartCount}</span>}
        </span>
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
