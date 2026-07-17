import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, Tags, X, Package, Boxes } from 'lucide-react'
import { useCategoryStore } from '../store/useCategoryStore.js'
import { useProductStore } from '../store/useProductStore.js'

const CategoriesPage = () => {
  const { categories, loading, error, fetchCategories, createCategory, updateCategory, deleteCategory } =
    useCategoryStore()
  const { products, fetchProducts } = useProductStore()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ name: '', description: '' })
  const [formError, setFormError] = useState(null)

  useEffect(() => {
    fetchCategories()
    fetchProducts()
  }, [fetchCategories, fetchProducts])

  const statsByCategory = (categoryId) => {
    const categoryName = categories.find((c) => c._id === categoryId)?.name
    const categoryProducts = products.filter(
      (p) => p.category?.name === categoryName || p.categoryName === categoryName
    )
    return {
      count: categoryProducts.length,
      stock: categoryProducts.reduce((sum, p) => sum + p.stock, 0)
    }
  }

  const openCreate = () => {
    setEditing(null)
    setForm({ name: '', description: '' })
    setFormError(null)
    setIsModalOpen(true)
  }

  const openEdit = (category) => {
    setEditing(category)
    setForm({ name: category.name, description: category.description || '' })
    setFormError(null)
    setIsModalOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError(null)

    if (!form.name.trim()) {
      setFormError('El nombre es obligatorio')
      return
    }

    const result = editing
      ? await updateCategory(editing._id, form)
      : await createCategory(form)

    if (result.success) {
      setIsModalOpen(false)
    } else {
      setFormError(result.message)
    }
  }

  const handleDelete = async (category) => {
    if (window.confirm(`¿Eliminar la categoría "${category.name}"?`)) {
      const result = await deleteCategory(category._id)
      if (!result.success) {
        alert(result.message)
      }
    }
  }

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-slate-900">Categorías</h2>
          <p className="mt-1 text-sm text-slate-500">Organiza tus productos por categorías</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/25 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-emerald-600/30 active:scale-95"
        >
          <Plus className="h-4 w-4" />
          Nueva categoría
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
      )}

      {loading ? (
        <p className="py-10 text-center text-slate-500">Cargando categorías...</p>
      ) : categories.length === 0 ? (
        <div className="rounded-xl bg-white py-16 text-center shadow-sm">
          <Tags className="mx-auto mb-3 h-10 w-10 text-slate-300" />
          <p className="text-slate-500">No hay categorías registradas</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => {
            const stats = statsByCategory(category._id)
            return (
              <div
                key={category._id}
                className="group rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 shadow-lg shadow-emerald-500/25 transition-transform duration-300 group-hover:scale-110">
                      <Tags className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800">{category.name}</h3>
                      <p className="text-xs text-slate-500">
                        {category.description || 'Sin descripción'}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => openEdit(category)}
                      className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-emerald-600"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(category)}
                      className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="mt-4 flex gap-3 border-t border-slate-100 pt-4">
                  <div className="flex flex-1 items-center gap-2 rounded-xl bg-slate-50 px-3 py-2">
                    <Package className="h-4 w-4 text-slate-400" />
                    <div>
                      <p className="text-sm font-black text-slate-800">{stats.count}</p>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Productos
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-1 items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2">
                    <Boxes className="h-4 w-4 text-emerald-500" />
                    <div>
                      <p className="text-sm font-black text-emerald-700">{stats.stock}</p>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-500">
                        Unidades
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <div className="animate-modal-pop w-full max-w-md rounded-3xl bg-white p-7 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800">
                {editing ? 'Editar categoría' : 'Nueva categoría'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
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
                <label className="mb-1 block text-sm font-medium text-slate-700">Nombre *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Nombre de la categoría"
                  className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Descripción</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={2}
                  placeholder="Descripción (opcional)"
                  className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 rounded-lg border border-slate-300 py-2.5 font-medium text-slate-700 transition-colors hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-lg bg-emerald-600 py-2.5 font-semibold text-white transition-colors hover:bg-emerald-700"
                >
                  {editing ? 'Guardar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default CategoriesPage
