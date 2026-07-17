import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Package,
  Tags,
  AlertTriangle,
  XCircle,
  Wallet,
  Boxes,
  CheckCircle2,
  ArrowDownCircle,
  ArrowUpCircle,
  ArrowLeftRight,
  Plus,
  BarChart3,
  ChevronRight
} from 'lucide-react'
import { useReportStore } from '../store/useReportStore.js'
import { useMovementStore } from '../../inventory/store/useMovementStore.js'
import { useAuthStore } from '../../auth/store/useAuthStore.js'

const StatCard = ({ icon: Icon, label, value, gradient, shadow }) => (
  <div className="group rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
    <div className="flex items-center gap-4">
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} shadow-lg ${shadow} transition-transform duration-300 group-hover:scale-110`}
      >
        <Icon className="h-6 w-6 text-white" />
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{label}</p>
        <p className="text-2xl font-black text-slate-900">{value}</p>
      </div>
    </div>
  </div>
)

const quickActions = [
  {
    to: '/productos',
    icon: Plus,
    title: 'Nuevo producto',
    description: 'Agrega un producto al catálogo',
    gradient: 'from-emerald-500 to-teal-600'
  },
  {
    to: '/movimientos',
    icon: ArrowLeftRight,
    title: 'Registrar movimiento',
    description: 'Entradas y salidas de inventario',
    gradient: 'from-sky-500 to-blue-600'
  },
  {
    to: '/reportes',
    icon: BarChart3,
    title: 'Ver reportes',
    description: 'Indicadores y exportación a Excel',
    gradient: 'from-violet-500 to-purple-600'
  }
]

const DashboardPage = () => {
  const { summary, lowStock, outOfStock, loading, error, fetchAlerts, fetchReports } =
    useReportStore()
  const { movements, fetchMovements } = useMovementStore()
  const user = useAuthStore((state) => state.user)

  useEffect(() => {
    fetchAlerts()
    fetchReports()
    fetchMovements()
  }, [fetchAlerts, fetchReports, fetchMovements])

  const recentMovements = movements.slice(0, 6)

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-black tracking-tight text-slate-900">
          Hola, {user?.name?.split(' ')[0]}
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Este es el resumen general y las alertas de tu inventario
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600 ring-1 ring-red-100">
          {error}
        </div>
      )}

      {loading && !summary ? (
        <p className="py-10 text-center text-slate-500">Cargando información...</p>
      ) : (
        <div className="space-y-6">
          {/* Tarjetas de resumen */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              icon={Package}
              label="Productos"
              value={summary?.totalProducts ?? 0}
              gradient="from-slate-700 to-slate-900"
              shadow="shadow-slate-500/25"
            />
            <StatCard
              icon={Boxes}
              label="Unidades en stock"
              value={summary?.totalStock ?? 0}
              gradient="from-emerald-500 to-emerald-700"
              shadow="shadow-emerald-500/25"
            />
            <StatCard
              icon={Wallet}
              label="Valor inventario"
              value={`Q ${(summary?.inventoryValue ?? 0).toLocaleString('es-GT', { minimumFractionDigits: 2 })}`}
              gradient="from-sky-500 to-blue-700"
              shadow="shadow-sky-500/25"
            />
            <StatCard
              icon={Tags}
              label="Categorías"
              value={summary?.totalCategories ?? 0}
              gradient="from-violet-500 to-purple-700"
              shadow="shadow-violet-500/25"
            />
          </div>

          {/* Acciones rápidas */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {quickActions.map(({ to, icon: Icon, title, description, gradient }) => (
              <Link
                key={to}
                to={to}
                className="group flex items-center gap-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} shadow-lg transition-transform duration-300 group-hover:scale-110`}
                >
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-slate-900">{title}</p>
                  <p className="truncate text-xs text-slate-400">{description}</p>
                </div>
                <ChevronRight className="h-5 w-5 shrink-0 text-slate-300 transition-all duration-300 group-hover:translate-x-1 group-hover:text-emerald-500" />
              </Link>
            ))}
          </div>

          {/* Alertas */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Bajo inventario */}
            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-amber-500/25">
                  <AlertTriangle className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900">Bajo inventario</h3>
                  <p className="text-xs text-slate-400">
                    Productos con {summary?.lowStockThreshold ?? 5} unidades o menos
                  </p>
                </div>
                <span className="ml-auto rounded-full bg-amber-100 px-3.5 py-1 text-sm font-black text-amber-700">
                  {lowStock.length}
                </span>
              </div>

              {lowStock.length === 0 ? (
                <div className="flex flex-col items-center py-8 text-center">
                  <CheckCircle2 className="mb-2 h-8 w-8 text-emerald-400" />
                  <p className="text-sm font-medium text-slate-400">
                    Todo en orden, sin productos con bajo inventario
                  </p>
                </div>
              ) : (
                <ul className="divide-y divide-slate-100">
                  {lowStock.map((product) => (
                    <li key={product._id} className="flex items-center justify-between py-3">
                      <div>
                        <p className="text-sm font-bold text-slate-800">{product.name}</p>
                        <p className="text-xs text-slate-400">{product.category}</p>
                      </div>
                      <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-black text-amber-700">
                        {product.stock} unidades
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Agotados */}
            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-red-400 to-rose-600 shadow-lg shadow-red-500/25">
                  <XCircle className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900">Productos agotados</h3>
                  <p className="text-xs text-slate-400">Sin existencias disponibles</p>
                </div>
                <span className="ml-auto rounded-full bg-red-100 px-3.5 py-1 text-sm font-black text-red-700">
                  {outOfStock.length}
                </span>
              </div>

              {outOfStock.length === 0 ? (
                <div className="flex flex-col items-center py-8 text-center">
                  <CheckCircle2 className="mb-2 h-8 w-8 text-emerald-400" />
                  <p className="text-sm font-medium text-slate-400">
                    No hay productos agotados
                  </p>
                </div>
              ) : (
                <ul className="divide-y divide-slate-100">
                  {outOfStock.map((product) => (
                    <li key={product._id} className="flex items-center justify-between py-3">
                      <div>
                        <p className="text-sm font-bold text-slate-800">{product.name}</p>
                        <p className="text-xs text-slate-400">{product.category}</p>
                      </div>
                      <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-black text-red-700">
                        Agotado
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Actividad reciente */}
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-slate-600 to-slate-800 shadow-lg shadow-slate-500/25">
                  <ArrowLeftRight className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900">Actividad reciente</h3>
                  <p className="text-xs text-slate-400">Últimos movimientos del inventario</p>
                </div>
              </div>
              <Link
                to="/movimientos"
                className="flex items-center gap-1 text-sm font-bold text-emerald-600 transition-colors hover:text-emerald-700"
              >
                Ver todos
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            {recentMovements.length === 0 ? (
              <div className="flex flex-col items-center py-8 text-center">
                <ArrowLeftRight className="mb-2 h-8 w-8 text-slate-200" />
                <p className="text-sm font-medium text-slate-400">
                  Aún no hay movimientos registrados
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-slate-100">
                {recentMovements.map((movement) => (
                  <li key={movement._id} className="flex items-center gap-4 py-3">
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                        movement.type === 'ENTRADA'
                          ? 'bg-emerald-100 text-emerald-600'
                          : 'bg-orange-100 text-orange-600'
                      }`}
                    >
                      {movement.type === 'ENTRADA' ? (
                        <ArrowDownCircle className="h-4.5 w-4.5" />
                      ) : (
                        <ArrowUpCircle className="h-4.5 w-4.5" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-slate-800">
                        {movement.type === 'ENTRADA' ? 'Entrada' : 'Salida'} ·{' '}
                        {movement.product?.name || 'Producto eliminado'}
                      </p>
                      <p className="truncate text-xs text-slate-400">
                        {movement.reason || 'Sin motivo'} · {movement.quantity} unidades
                      </p>
                    </div>
                    <span className="shrink-0 text-xs font-medium text-slate-400">
                      {new Date(movement.createdAt).toLocaleDateString('es-GT', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default DashboardPage
