import { axiosInventory } from './api.js'

const mapCategory = (c) => ({
  _id: c._id,
  name: c.nombre,
  description: c.descripcion || '',
  createdAt: c.createdAt
})

export const getCategoriesRequest = async () => {
  const res = await axiosInventory.get('/categorias')
  return {
    ...res,
    data: {
      success: res.data.success,
      total: res.data.total,
      data: (res.data.categories || []).map(mapCategory)
    }
  }
}

export const createCategoryRequest = (data) =>
  axiosInventory.post('/categorias', {
    nombre: data.name,
    descripcion: data.description || ''
  })

export const updateCategoryRequest = (id, data) =>
  axiosInventory.put(`/categorias/${id}`, {
    nombre: data.name,
    descripcion: data.description || ''
  })

export const deleteCategoryRequest = (id) => axiosInventory.delete(`/categorias/${id}`)
