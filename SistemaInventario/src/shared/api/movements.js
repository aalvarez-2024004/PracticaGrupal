import { axiosInventory } from './api.js'

const mapMovement = (m) => ({
  _id: m._id,
  product: m.producto
    ? { _id: m.producto._id, name: m.producto.nombre }
    : null,
  type: m.tipo,
  quantity: m.cantidad,
  reason: m.motivo || '',
  user: m.usuario,
  createdAt: m.createdAt
})

export const createEntryRequest = (data) =>
  axiosInventory.post('/entradas', {
    producto: data.product,
    cantidad: data.quantity,
    motivo: data.reason || ''
  })

export const createOutputRequest = (data) =>
  axiosInventory.post('/salidas', {
    producto: data.product,
    cantidad: data.quantity,
    motivo: data.reason || ''
  })

export const getMovementsRequest = async (params = {}) => {
  const query = {}
  if (params.type) query.tipo = params.type
  if (params.product) query.producto = params.product
  const res = await axiosInventory.get('/movimientos', { params: query })
  return {
    ...res,
    data: {
      success: res.data.success,
      total: res.data.total,
      data: (res.data.movements || []).map(mapMovement)
    }
  }
}
