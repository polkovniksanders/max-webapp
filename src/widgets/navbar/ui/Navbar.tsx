import { NavLink } from 'react-router-dom'
import { Home, LayoutGrid, User } from 'lucide-react'
import { ROUTES } from '@shared/config/routes'
import styles from './Navbar.module.css'

const linkClass = ({ isActive }: { isActive: boolean }) =>
  isActive ? `${styles.link} ${styles.active}` : styles.link

export const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      <NavLink to={ROUTES.MAIN} end className={linkClass}>
        <Home size={22} strokeWidth={1.8} />
        <span className={styles.label}>Главная</span>
      </NavLink>
      <NavLink to={ROUTES.CATEGORIES} className={linkClass}>
        <LayoutGrid size={22} strokeWidth={1.8} />
        <span className={styles.label}>Категории</span>
      </NavLink>
      <NavLink to={ROUTES.PROFILE} className={linkClass}>
        <User size={22} strokeWidth={1.8} />
        <span className={styles.label}>Профиль</span>
      </NavLink>
    </nav>
  )
}
