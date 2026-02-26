import { Routes, Route, Navigate } from 'react-router-dom'
import { route as mainRoute } from '@pages/main'
import { route as shopRoute } from '@pages/shop'
import { route as shopDetailRoute } from '@pages/shop-detail'
import { route as productRoute } from '@pages/product'
import { route as categoriesRoute } from '@pages/categories'
import { route as profileRoute } from '@pages/profile'
import { ROUTES } from '@shared/config/routes'

const pageRoutes = [
  mainRoute,
  shopRoute,
  shopDetailRoute,
  productRoute,
  categoriesRoute,
  profileRoute,
]

export const AppRouter = () => {
  return (
    <Routes>
      {pageRoutes.map(({ path, element }) => (
        <Route key={path} path={path} element={element} />
      ))}
      <Route path="*" element={<Navigate to={ROUTES.MAIN} replace />} />
    </Routes>
  )
}
