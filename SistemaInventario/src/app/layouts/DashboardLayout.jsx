import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Package,
  Tags,
  ArrowLeftRight,
  BarChart3,
  LogOut,
  Boxes
} from 'lucide-react'
import { useAuthStore } from '../../features/auth/store/useAuthStore.js'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/productos', label: 'Productos', icon: Package },
  { to: '/categorias', label: 'Categorías', icon: Tags },
  { to: '/movimientos', label: 'Movimientos', icon: ArrowLeftRight },
  { to: '/reportes', label: 'Reportes', icon: BarChart3 }
]

const DashboardLayout = () => {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const initials = (user?.name || 'U')
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-slate-100">
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-6">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-500/30">
            <Boxes className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-base font-extrabold tracking-tight">Inventario</h1>
            <p className="text-[11px] font-medium uppercase tracking-widest text-slate-500">
              Sistema de gestión
            </p>
          </div>
        </div>

        <div className="mx-6 mb-4 h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent" />

        {/* Navegación */}
        <nav className="flex-1 space-y-1.5 px-4">
          <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600">
            Menú principal
          </p>
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `group relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <Icon className="h-[18px] w-[18px] transition-transform duration-200 group-hover:scale-110" />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Usuario */}
        <div className="m-4 rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 text-sm font-extrabold text-white">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold">{user?.name}</p>
              <p className="truncate text-xs text-slate-500">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-white/5 px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-300 ring-1 ring-white/10 transition-all duration-200 hover:bg-red-500/90 hover:text-white hover:ring-red-500"
          >
            <LogOut className="h-3.5 w-3.5" />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Contenido */}
      <main className="ml-64 flex-1">
        <div key={location.pathname} className="animate-page mx-auto max-w-7xl p-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default DashboardLayout
