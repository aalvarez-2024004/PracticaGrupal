import { useEffect } from 'react'
import {
  TrendingUp,
  PieChart,
  FileBarChart,
  ArrowDownCircle,
  ArrowUpCircle,
  Trophy
} from 'lucide-react'
import { useReportStore } from '../store/useReportStore.js'
import DownloadExcelButton from '../../../shared/components/DownloadExcelButton.jsx'

const medalColors = ['text-amber-500', 'text-slate-400', 'text-orange-400']

const ReportsPage = () => {
  const {
    topProducts,
    categoriesReport,
    summary,
    loading,
    downloading,
    error,
    fetchReports,
    downloadExcel
  } = useReportStore()

  useEffect(() => {
    fetchReports()
  }, [fetchReports])

  const maxSold = Math.max(...topProducts.map((p) => p.totalSold), 1)

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-slate-900">Reportes</h2>
          <p className="mt-1 text-sm text-slate-500">
            Indicadores y análisis del estado del inventario
          </p>
        </div>
        <DownloadExcelButton onDownload={downloadExcel} loading={downloading} />
      </div>

      {error && (
        <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600 ring-1 ring-red-100">
          {error}
        </div>
      )}

      {loading && !summary ? (
        <p className="py-10 text-center text-slate-500">Generando reportes...</p>
      ) : (
        <div className="space-y-6">
          {/* Reporte general */}
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 shadow-lg shadow-sky-500/25">
                <FileBarChart className="h-5 w-5 text-white" />
              </div>
              <h3 className="font-extrabold text-slate-900">Reporte general del inventario</h3>
            </div>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <div className="rounded-xl bg-slate-50 p-4 ring-1 ring-slate-100">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Total productos
                </p>
                <p className="mt-1 text-2xl font-black text-slate-900">
                  {summary?.totalProducts ?? 0}
                </p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4 ring-1 ring-slate-100">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Unidades totales
                </p>
                <p className="mt-1 text-2xl font-black text-slate-900">
                  {summary?.totalStock ?? 0}
                </p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4 ring-1 ring-slate-100">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Valor inventario
                </p>
                <p className="mt-1 text-2xl font-black text-slate-900">
                  Q {(summary?.inventoryValue ?? 0).toLocaleString('es-GT', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4 ring-1 ring-slate-100">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Alertas activas
                </p>
                <p className="mt-1 text-2xl font-black text-slate-900">
                  {(summary?.lowStockCount ?? 0) + (summary?.outOfStockCount ?? 0)}
                </p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="flex items-center gap-4 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 p-4 ring-1 ring-emerald-100">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500 shadow-lg shadow-emerald-500/30">
                  <ArrowDownCircle className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
                    Entradas registradas
                  </p>
                  <p className="text-lg font-black text-emerald-900">
                    {summary?.movements?.entries?.count ?? 0} movimientos ·{' '}
                    {summary?.movements?.entries?.units ?? 0} unidades
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 rounded-xl bg-gradient-to-r from-orange-50 to-amber-50 p-4 ring-1 ring-orange-100">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500 shadow-lg shadow-orange-500/30">
                  <ArrowUpCircle className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-orange-600">
                    Salidas registradas
                  </p>
                  <p className="text-lg font-black text-orange-900">
                    {summary?.movements?.outputs?.count ?? 0} movimientos ·{' '}
                    {summary?.movements?.outputs?.units ?? 0} unidades
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Top productos */}
            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 shadow-lg shadow-emerald-500/25">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                <h3 className="font-extrabold text-slate-900">Productos más vendidos</h3>
              </div>

              {topProducts.length === 0 ? (
                <p className="py-8 text-center text-sm font-medium text-slate-400">
                  Aún no hay salidas registradas
                </p>
              ) : (
                <ul className="space-y-4">
                  {topProducts.map((product, index) => (
                    <li key={product._id}>
                      <div className="mb-1.5 flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2 font-bold text-slate-700">
                          {index < 3 ? (
                            <Trophy className={`h-4 w-4 ${medalColors[index]}`} />
                          ) : (
                            <span className="w-4 text-center text-xs font-black text-slate-300">
                              {index + 1}
                            </span>
                          )}
                          {product.name}
                        </span>
                        <span className="font-black text-slate-900">
                          {product.totalSold} unidades
                        </span>
                      </div>
                      <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 transition-all duration-500"
                          style={{ width: `${(product.totalSold / maxSold) * 100}%` }}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Resumen por categoría */}
            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-400 to-purple-600 shadow-lg shadow-violet-500/25">
                  <PieChart className="h-5 w-5 text-white" />
                </div>
                <h3 className="font-extrabold text-slate-900">Inventario por categoría</h3>
              </div>

              {categoriesReport.length === 0 ? (
                <p className="py-8 text-center text-sm font-medium text-slate-400">
                  No hay categorías registradas
                </p>
              ) : (
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      <th className="pb-3">Categoría</th>
                      <th className="pb-3 text-center">Productos</th>
                      <th className="pb-3 text-center">Stock</th>
                      <th className="pb-3 text-right">Valor</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {categoriesReport.map((cat) => (
                      <tr key={cat._id} className="transition-colors hover:bg-slate-50">
                        <td className="py-3 font-bold text-slate-700">{cat.category}</td>
                        <td className="py-3 text-center font-medium text-slate-500">
                          {cat.totalProducts}
                        </td>
                        <td className="py-3 text-center font-medium text-slate-500">
                          {cat.totalStock}
                        </td>
                        <td className="py-3 text-right font-black text-slate-900">
                          Q {cat.totalValue.toLocaleString('es-GT', { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ReportsPage
