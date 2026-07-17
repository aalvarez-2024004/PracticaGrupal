import { create } from 'zustand'
import {
  getCategoriesRequest,
  createCategoryRequest,
  updateCategoryRequest,
  deleteCategoryRequest
} from '../../../shared/api/categories.js'

export const useCategoryStore = create((set, get) => ({
  categories: [],
  loading: false,
  error: null,

  fetchCategories: async () => {
    try {
      set({ loading: true, error: null })
      const res = await getCategoriesRequest()
      set({ categories: res.data.data, loading: false })
    } catch (err) {
      set({
        error: err.response?.data?.message || 'Error al cargar categorías',
        loading: false
      })
    }
  },

  createCategory: async (data) => {
    try {
      set({ error: null })
      await createCategoryRequest(data)
      await get().fetchCategories()
      return { success: true }
    } catch (err) {
      const message = err.response?.data?.message || 'Error al crear categoría'
      set({ error: message })
      return { success: false, message }
    }
  },

  updateCategory: async (id, data) => {
    try {
      set({ error: null })
      await updateCategoryRequest(id, data)
      await get().fetchCategories()
      return { success: true }
    } catch (err) {
      const message = err.response?.data?.message || 'Error al actualizar categoría'
      set({ error: message })
      return { success: false, message }
    }
  },

  deleteCategory: async (id) => {
    try {
      set({ error: null })
      await deleteCategoryRequest(id)
      await get().fetchCategories()
      return { success: true }
    } catch (err) {
      const message = err.response?.data?.message || 'Error al eliminar categoría'
      set({ error: message })
      return { success: false, message }
    }
  }
}))
