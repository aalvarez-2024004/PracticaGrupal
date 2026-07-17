import { create } from 'zustand'
import {
  createEntryRequest,
  createOutputRequest,
  getMovementsRequest
} from '../../../shared/api/movements.js'

export const useMovementStore = create((set, get) => ({
  movements: [],
  loading: false,
  error: null,

  fetchMovements: async (params = {}) => {
    try {
      set({ loading: true, error: null })
      const res = await getMovementsRequest(params)
      set({ movements: res.data.data, loading: false })
    } catch (err) {
      set({
        error: err.response?.data?.message || 'Error al cargar movimientos',
        loading: false
      })
    }
  },

  createEntry: async (data) => {
    try {
      set({ error: null })
      await createEntryRequest(data)
      await get().fetchMovements()
      return { success: true }
    } catch (err) {
      const message = err.response?.data?.message || 'Error al registrar entrada'
      set({ error: message })
      return { success: false, message }
    }
  },

  createOutput: async (data) => {
    try {
      set({ error: null })
      await createOutputRequest(data)
      await get().fetchMovements()
      return { success: true }
    } catch (err) {
      const message = err.response?.data?.message || 'Error al registrar salida'
      set({ error: message })
      return { success: false, message }
    }
  }
}))
