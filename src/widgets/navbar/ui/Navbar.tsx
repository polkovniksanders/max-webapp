import { NavLink } from 'react-router-dom'
import { Home, LayoutList, ShoppingCart, User } from 'lucide-react'
import { ROUTES } from '@shared/config/routes'
import styles from './Navbar.module.css'

const linkClass = ({ isActive }: { isActive: boolean }) =>
  isActive ? `${styles.link} ${styles.active}` : styles.link

// Заглушка — потом подключить к реальному состоянию корзины
const CART_COUNT = 0

export const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      <NavLink to={ROUTES.MAIN} end className={linkClass}>
        <Home size={22} strokeWidth={1.8} />
        <span className={styles.label}>Главная</span>
      </NavLink>

      <NavLink to={ROUTES.CATEGORIES} className={linkClass}>
        <LayoutList size={22} strokeWidth={1.8} />
        <span className={styles.label}>Каталог</span>
      </NavLink>

      <NavLink to={ROUTES.CART} className={linkClass}>
        <span className={styles.cartIcon}>
          <ShoppingCart size={22} strokeWidth={1.8} />
          {CART_COUNT > 0 && (
            <span className={styles.badge}>{CART_COUNT > 99 ? '99+' : CART_COUNT}</span>
          )}
        </span>
        <span className={styles.label}>Корзина</span>
      </NavLink>

      <NavLink to={ROUTES.PROFILE} className={linkClass}>
        <User size={22} strokeWidth={1.8} />
        <span className={styles.label}>Профиль</span>
      </NavLink>
    </nav>
  )
}
