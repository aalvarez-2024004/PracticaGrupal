import axios from 'axios'

const createInstance = (url) => {
  const instance = axios.create({
    baseURL: url
  })

  instance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  })

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        if (window.location.pathname !== '/') {
          window.location.href = '/'
        }
      }
      return Promise.reject(error)
    }
  )

  return instance
}

export const axiosAuth = createInstance(import.meta.env.VITE_AUTH_API_URL)
export const axiosInventory = createInstance(import.meta.env.VITE_INVENTORY_API_URL)
export const axiosReports = createInstance(import.meta.env.VITE_REPORTS_API_URL)
