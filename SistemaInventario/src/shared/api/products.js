import { axiosInventory } from './api.js'

/** Normaliza el producto del backend (español) al formato del frontend */
const mapProduct = (p) => ({
  _id: p._id,
  name: p.nombre,
  description: p.descripcion || '',
  category: { name: p.categoria },
  categoryName: p.categoria,
  price: p.precio,
  stock: p.existencia,
  createdAt: p.createdAt,
  updatedAt: p.updatedAt
})

export const getProductsRequest = async (params = {}) => {
  const query = {}
  if (params.search) query.search = params.search
  if (params.category) query.categoria = params.category
  const res = await axiosInventory.get('/productos', { params: query })
  return {
    ...res,
    data: {
      success: res.data.success,
      total: res.data.total,
      data: (res.data.products || []).map(mapProduct)
    }
  }
}

export const getProductRequest = async (id) => {
  const res = await axiosInventory.get(`/productos/${id}`)
  return {
    ...res,
    data: { success: res.data.success, data: mapProduct(res.data.product) }
  }
}

export const createProductRequest = (data) =>
  axiosInventory.post('/productos', {
    nombre: data.name,
    categoria: data.category,
    descripcion: data.description || '',
    precio: data.price,
    existencia: data.stock
  })

export const updateProductRequest = (id, data) =>
  axiosInventory.put(`/productos/${id}`, {
    nombre: data.name,
    categoria: data.category,
    descripcion: data.description || '',
    precio: data.price,
    existencia: data.stock
  })

export const deleteProductRequest = (id) => axiosInventory.delete(`/productos/${id}`)
