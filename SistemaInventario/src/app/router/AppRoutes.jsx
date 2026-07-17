import { Routes, Route, Navigate } from 'react-router-dom'
import AuthPage from '../../features/auth/pages/AuthPage.jsx'
import PrivateRoute from './PrivateRoute.jsx'
import DashboardLayout from '../layouts/DashboardLayout.jsx'
import DashboardPage from '../../features/reports/pages/DashboardPage.jsx'
import ProductsPage from '../../features/inventory/pages/ProductsPage.jsx'
import CategoriesPage from '../../features/inventory/pages/CategoriesPage.jsx'
import MovementsPage from '../../features/inventory/pages/MovementsPage.jsx'
import ReportsPage from '../../features/reports/pages/ReportsPage.jsx'

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<AuthPage />} />

      <Route element={<PrivateRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/productos" element={<ProductsPage />} />
          <Route path="/categorias" element={<CategoriesPage />} />
          <Route path="/movimientos" element={<MovementsPage />} />
          <Route path="/reportes" element={<ReportsPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default AppRoutes
