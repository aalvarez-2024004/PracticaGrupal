import { create } from 'zustand'
import {
  getProductsRequest,
  createProductRequest,
  updateProductRequest,
  deleteProductRequest
} from '../../../shared/api/products.js'

export const useProductStore = create((set, get) => ({
  products: [],
  loading: false,
  error: null,

  fetchProducts: async (params = {}) => {
    try {
      set({ loading: true, error: null })
      const res = await getProductsRequest(params)
      set({ products: res.data.data, loading: false })
    } catch (err) {
      set({
        error: err.response?.data?.message || 'Error al cargar productos',
        loading: false
      })
    }
  },

  createProduct: async (data) => {
    try {
      set({ error: null })
      await createProductRequest(data)
      await get().fetchProducts()
      return { success: true }
    } catch (err) {
      const message = err.response?.data?.message || 'Error al crear producto'
      set({ error: message })
      return { success: false, message }
    }
  },

  updateProduct: async (id, data) => {
    try {
      set({ error: null })
      await updateProductRequest(id, data)
      await get().fetchProducts()
      return { success: true }
    } catch (err) {
      const message = err.response?.data?.message || 'Error al actualizar producto'
      set({ error: message })
      return { success: false, message }
    }
  },

  deleteProduct: async (id) => {
    try {
      set({ error: null })
      await deleteProductRequest(id)
      await get().fetchProducts()
      return { success: true }
    } catch (err) {
      const message = err.response?.data?.message || 'Error al eliminar producto'
      set({ error: message })
      return { success: false, message }
    }
  }
}))
