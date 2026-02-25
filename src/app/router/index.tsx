import { Routes, Route, Navigate } from 'react-router-dom'
import { MainPage } from '@pages/main'
import { ProfilePage } from '@pages/profile'
import { ShopMainPage } from '@pages/shop'
import { ShopDetailPage } from '@pages/shop-detail'
import { ProductPage } from '@pages/product'
import { CategoriesPage } from '@pages/categories'
import { ROUTES } from '@shared/config/routes'

export const AppRouter = () => {
  return (
    <Routes>
      <Route path={ROUTES.MAIN} element={<MainPage />} />
      <Route path={ROUTES.SHOP} element={<ShopMainPage />} />
      <Route path={ROUTES.SHOP_DETAIL} element={<ShopDetailPage />} />
      <Route path={ROUTES.PRODUCT} element={<ProductPage />} />
      <Route path={ROUTES.CATEGORIES} element={<CategoriesPage />} />
      <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
      <Route path="*" element={<Navigate to={ROUTES.MAIN} replace />} />
    </Routes>
  )
}
