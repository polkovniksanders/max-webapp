import { Routes, Route } from 'react-router-dom'
import { MainPage } from '@pages/main'
import { ProfilePage } from '@pages/profile'
import { ShopMainPage } from '@pages/shop'
import { ProductPage } from '@pages/product'
import { ROUTES } from '@shared/config/routes'

export const AppRouter = () => {
  return (
    <Routes>
      <Route path={ROUTES.MAIN} element={<MainPage />} />
      <Route path={ROUTES.SHOP} element={<ShopMainPage />} />
      <Route path={ROUTES.PRODUCT} element={<ProductPage />} />
      <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
    </Routes>
  )
}
