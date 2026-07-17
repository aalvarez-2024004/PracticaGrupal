import { useEffect, useState } from 'react'
import { ArrowDownCircle, ArrowUpCircle, ArrowLeftRight, X } from 'lucide-react'
import { useMovementStore } from '../store/useMovementStore.js'
import { useProductStore } from '../store/useProductStore.js'

const MovementsPage = () => {
  const { movements, loading, error, fetchMovements, createEntry, createOutput } =
    useMovementStore()
  const { products, fetchProducts } = useProductStore()

  const [modalType, setModalType] = useState(null) // 'ENTRADA' | 'SALIDA' | null
  const [typeFilter, setTypeFilter] = useState('')
  const [form, setForm] = useState({ product: '', quantity: '', reason: '' })
  const [formError, setFormError] = useState(null)

  useEffect(() => {
    fetchMovements()
    fetchProducts()
  }, [fetchMovements, fetchProducts])

  const openModal = (type) => {
    setModalType(type)
    setForm({ product: '', quantity: '', reason: '' })
    setFormError(null)
  }

  const handleFilter = (type) => {
    setTypeFilter(type)
    fetchMovements(type ? { type } : {})
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError(null)

    if (!form.product) return setFormError('Selecciona un producto')
    if (!form.quantity || Number(form.quantity) < 1)
      return setFormError('La cantidad debe ser al menos 1')

    const data = {
      product: form.product,
      quantity: Number(form.quantity),
      reason: form.reason.trim()
    }

    const result =
      modalType === 'ENTRADA' ? await createEntry(data) : await createOutput(data)

    if (result.success) {
      setModalType(null)
      fetchProducts()
    } else {
      setFormError(result.message)
    }
  }

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-slate-900">Movimientos</h2>
          <p className="mt-1 text-sm text-slate-500">Registro de entradas y salidas del inventario</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => openModal('ENTRADA')}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/25 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl active:scale-95"
          >
            <ArrowDownCircle className="h-4 w-4" />
            Registrar entrada
          </button>
          <button
            onClick={() => openModal('SALIDA')}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-orange-500/25 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl active:scale-95"
          >
            <ArrowUpCircle className="h-4 w-4" />
            Registrar salida
          </button>
        </div>
      </div>

      {/* Mini estadísticas */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
            <ArrowLeftRight className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Total movimientos
            </p>
            <p className="text-lg font-black text-slate-900">{movements.length}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
            <ArrowDownCircle className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Unidades ingresadas
            </p>
            <p className="text-lg font-black text-emerald-700">
              {movements.filter((m) => m.type === 'ENTRADA').reduce((sum, m) => sum + m.quantity, 0)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
            <ArrowUpCircle className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Unidades salientes
            </p>
            <p className="text-lg font-black text-orange-700">
              {movements.filter((m) => m.type === 'SALIDA').reduce((sum, m) => sum + m.quantity, 0)}
            </p>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="mb-4 flex gap-2">
        {[
          { value: '', label: 'Todos' },
          { value: 'ENTRADA', label: 'Entradas' },
          { value: 'SALIDA', label: 'Salidas' }
        ].map(({ value, label }) => (
          <button
            key={value}
            onClick={() => handleFilter(value)}
            className={`rounded-full px-4 py-1.5 text-sm font-bold transition-all duration-200 ${
              typeFilter === value
                ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20'
                : 'bg-white text-slate-500 ring-1 ring-slate-200 hover:bg-slate-100'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
      )}

      {/* Tabla */}
      <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-100">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-100 bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            <tr>
              <th className="px-6 py-4">Tipo</th>
              <th className="px-6 py-4">Producto</th>
              <th className="px-6 py-4">Cantidad</th>
              <th className="px-6 py-4">Motivo</th>
              <th className="px-6 py-4">Usuario</th>
              <th className="px-6 py-4">Fecha</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-slate-500">
                  Cargando movimientos...
                </td>
              </tr>
            ) : movements.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-slate-500">
                  <ArrowLeftRight className="mx-auto mb-2 h-8 w-8 text-slate-300" />
                  No hay movimientos registrados
                </td>
              </tr>
            ) : (
              movements.map((movement) => (
                <tr key={movement._id} className="transition-colors hover:bg-slate-50/70">
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                        movement.type === 'ENTRADA'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-orange-100 text-orange-700'
                      }`}
                    >
                      {movement.type === 'ENTRADA' ? (
                        <ArrowDownCircle className="h-3.5 w-3.5" />
                      ) : (
                        <ArrowUpCircle className="h-3.5 w-3.5" />
                      )}
                      {movement.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-800">
                    {movement.product?.name || 'Producto eliminado'}
                  </td>
                  <td className="px-6 py-4 font-semibold text-slate-700">{movement.quantity}</td>
                  <td className="px-6 py-4 text-slate-500">{movement.reason || '—'}</td>
                  <td className="px-6 py-4 text-slate-500">{movement.user || '—'}</td>
                  <td className="px-6 py-4 text-slate-500">
                    {new Date(movement.createdAt).toLocaleString('es-GT')}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal entrada/salida */}
      {modalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <div className="animate-modal-pop w-full max-w-md rounded-3xl bg-white p-7 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800">
                {modalType === 'ENTRADA' ? 'Registrar entrada' : 'Registrar salida'}
              </h3>
              <button
                onClick={() => setModalType(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {formError && (
              <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Producto *</label>
                <select
                  value={form.product}
                  onChange={(e) => setForm({ ...form, product: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                >
                  <option value="">Selecciona un producto</option>
                  {products.map((product) => (
                    <option key={product._id} value={product._id}>
                      {product.name} (stock: {product.stock})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Cantidad *</label>
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={form.quantity}
                  onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                  placeholder="Cantidad de unidades"
                  className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Motivo</label>
                <input
                  type="text"
                  value={form.reason}
                  onChange={(e) => setForm({ ...form, reason: e.target.value })}
                  placeholder={modalType === 'ENTRADA' ? 'Ej. Compra a proveedor' : 'Ej. Venta'}
                  className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalType(null)}
                  className="flex-1 rounded-lg border border-slate-300 py-2.5 font-medium text-slate-700 transition-colors hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className={`flex-1 rounded-lg py-2.5 font-semibold text-white transition-colors ${
                    modalType === 'ENTRADA'
                      ? 'bg-emerald-600 hover:bg-emerald-700'
                      : 'bg-orange-500 hover:bg-orange-600'
                  }`}
                >
                  Registrar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default MovementsPage
