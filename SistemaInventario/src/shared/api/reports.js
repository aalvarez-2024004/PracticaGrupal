import { axiosReports } from './api.js'

export const getLowStockRequest = async () => {
  const res = await axiosReports.get('/low-stock')
  return {
    ...res,
    data: {
      ...res.data,
      data: (res.data.data || []).map((p) => ({
        _id: p.id,
        name: p.producto,
        category: p.categoria,
        stock: p.existencia,
        price: p.precio
      }))
    }
  }
}

export const getOutOfStockRequest = async () => {
  const res = await axiosReports.get('/out-of-stock')
  return {
    ...res,
    data: {
      ...res.data,
      data: (res.data.data || []).map((p) => ({
        _id: p.id,
        name: p.producto,
        category: p.categoria,
        stock: p.existencia,
        price: p.precio
      }))
    }
  }
}

export const getTopProductsRequest = async () => {
  const res = await axiosReports.get('/top-productos')
  return {
    ...res,
    data: {
      ...res.data,
      data: (res.data.data || []).map((p) => ({
        _id: p._id,
        name: p.nombre,
        totalSold: p.totalVendido,
        movements: p.movimientos
      }))
    }
  }
}

export const getCategoriesReportRequest = async () => {
  const res = await axiosReports.get('/categorias')
  return {
    ...res,
    data: {
      ...res.data,
      data: (res.data.data || []).map((c) => ({
        _id: c._id,
        category: c.categoria,
        totalProducts: c.totalProductos,
        totalStock: c.totalExistencia,
        totalValue: c.valorTotal
      }))
    }
  }
}

export const getSummaryRequest = async () => {
  const res = await axiosReports.get('/resumen')
  const d = res.data.data || {}
  return {
    ...res,
    data: {
      success: res.data.success,
      data: {
        totalProducts: d.totalProductos,
        totalCategories: d.totalCategorias,
        totalStock: d.totalExistencia,
        inventoryValue: d.valorInventario,
        lowStockThreshold: d.umbralBajoStock,
        lowStockCount: d.bajoStock,
        outOfStockCount: d.agotados,
        movements: {
          totalMovements: d.movimientos?.total,
          entries: d.movimientos?.entradas,
          outputs: d.movimientos?.salidas
        }
      }
    }
  }
}

export const downloadExcelRequest = () =>
  axiosReports.get('/excel', { responseType: 'arraybuffer' })
