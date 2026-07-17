import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, Search, Package, AlertTriangle, XCircle, Wallet } from 'lucide-react'
import { useProductStore } from '../store/useProductStore.js'
import { useCategoryStore } from '../store/useCategoryStore.js'
import ProductModal from '../components/ProductModal.jsx'

const ProductsPage = () => {
  const { products, loading, error, fetchProducts, createProduct, updateProduct, deleteProduct } =
    useProductStore()
  const { categories, fetchCategories } = useCategoryStore()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [fetchProducts, fetchCategories])

  const handleSearch = (e) => {
    e.preventDefault()
    const params = {}
    if (search.trim()) params.search = search.trim()
    if (categoryFilter) params.category = categoryFilter
    fetchProducts(params)
  }

  const handleOpenCreate = () => {
    setEditingProduct(null)
    setIsModalOpen(true)
  }

  const handleOpenEdit = (product) => {
    setEditingProduct(product)
    setIsModalOpen(true)
  }

  const handleSubmit = async (data) => {
    if (editingProduct) {
      return await updateProduct(editingProduct._id, data)
    }
    return await createProduct(data)
  }

  const handleDelete = async (product) => {
    if (window.confirm(`¿Eliminar el producto "${product.name}"?`)) {
      await deleteProduct(product._id)
    }
  }

  const totalValue = products.reduce((sum, p) => sum + p.stock * p.price, 0)
  const lowStockCount = products.filter((p) => p.stock > 0 && p.stock <= 5).length
  const outOfStockCount = products.filter((p) => p.stock === 0).length

  const miniStats = [
    { icon: Package, label: 'Productos', value: products.length, color: 'text-slate-600 bg-slate-100' },
    { icon: Wallet, label: 'Valor total', value: `Q ${totalValue.toLocaleString('es-GT', { minimumFractionDigits: 2 })}`, color: 'text-sky-600 bg-sky-100' },
    { icon: AlertTriangle, label: 'Bajo stock', value: lowStockCount, color: 'text-amber-600 bg-amber-100' },
    { icon: XCircle, label: 'Agotados', value: outOfStockCount, color: 'text-red-600 bg-red-100' }
  ]

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-slate-900">Productos</h2>
          <p className="mt-1 text-sm text-slate-500">Administración del catálogo de productos</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/25 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-emerald-600/30 active:scale-95"
        >
          <Plus className="h-4 w-4" />
          Nuevo producto
        </button>
      </div>

      {/* Mini estadísticas */}
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {miniStats.map(({ icon: Icon, label, value, color }) => (
          <div
            key={label}
            className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100"
          >
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${color}`}>
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                {label}
              </p>
              <p className="text-lg font-black text-slate-900">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Búsqueda y filtros */}
      <form onSubmit={handleSearch} className="mb-6 flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre..."
            className="w-full rounded-xl border-0 bg-white py-2.5 pl-10 pr-4 text-sm shadow-sm ring-1 ring-slate-200 transition-shadow focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="rounded-xl border-0 bg-white px-4 py-2.5 text-sm font-medium shadow-sm ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <option value="">Todas las categorías</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="rounded-xl bg-slate-900 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-slate-900/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-800 active:scale-95"
        >
          Buscar
        </button>
      </form>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
      )}

      {/* Tabla */}
      <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-100">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-100 bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            <tr>
              <th className="px-6 py-4">Producto</th>
              <th className="px-6 py-4">Categoría</th>
              <th className="px-6 py-4">Precio</th>
              <th className="px-6 py-4">Existencia</th>
              <th className="px-6 py-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-slate-500">
                  Cargando productos...
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-slate-500">
                  <Package className="mx-auto mb-2 h-8 w-8 text-slate-300" />
                  No hay productos registrados
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product._id} className="transition-colors hover:bg-slate-50/70">
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-800">{product.name}</p>
                    {product.description && (
                      <p className="text-xs text-slate-500">{product.description}</p>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                      {product.category?.name || 'Sin categoría'}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-700">
                    Q {product.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        product.stock === 0
                          ? 'bg-red-100 text-red-700'
                          : product.stock <= 5
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-emerald-100 text-emerald-700'
                      }`}
                    >
                      {product.stock} unidades
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleOpenEdit(product)}
                        className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-emerald-600"
                        title="Editar"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(product)}
                        className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-red-50 hover:text-red-600"
                        title="Eliminar"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        product={editingProduct}
        categories={categories}
      />
    </div>
  )
}

export default ProductsPage
