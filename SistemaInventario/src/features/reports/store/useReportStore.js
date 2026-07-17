import { create } from 'zustand'
import {
  getLowStockRequest,
  getOutOfStockRequest,
  getTopProductsRequest,
  getCategoriesReportRequest,
  getSummaryRequest,
  downloadExcelRequest
} from '../../../shared/api/reports.js'

export const useReportStore = create((set) => ({
  lowStock: [],
  outOfStock: [],
  topProducts: [],
  categoriesReport: [],
  summary: null,
  loading: false,
  downloading: false,
  error: null,

  fetchAlerts: async () => {
    try {
      set({ loading: true, error: null })
      const [lowRes, outRes] = await Promise.all([
        getLowStockRequest(),
        getOutOfStockRequest()
      ])
      set({
        lowStock: lowRes.data.data,
        outOfStock: outRes.data.data,
        loading: false
      })
    } catch (err) {
      set({
        error: err.response?.data?.message || 'Error al cargar alertas',
        loading: false
      })
    }
  },

  fetchReports: async () => {
    try {
      set({ loading: true, error: null })
      const [topRes, catRes, summaryRes] = await Promise.all([
        getTopProductsRequest(),
        getCategoriesReportRequest(),
        getSummaryRequest()
      ])
      set({
        topProducts: topRes.data.data,
        categoriesReport: catRes.data.data,
        summary: summaryRes.data.data,
        loading: false
      })
    } catch (err) {
      set({
        error: err.response?.data?.message || 'Error al cargar reportes',
        loading: false
      })
    }
  },

  downloadExcel: async () => {
    try {
      set({ downloading: true, error: null })

      const res = await downloadExcelRequest()

      // Crear un enlace temporal para descargar el archivo
      const blob = new Blob([res.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `reporte_inventario_${new Date().toISOString().split('T')[0]}.xlsx`
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)

      set({ downloading: false })
      return { success: true }
    } catch (err) {
      set({
        error: 'Error al descargar el Excel',
        downloading: false
      })
      return { success: false }
    }
  }
}))
