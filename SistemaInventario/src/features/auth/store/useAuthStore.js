import { create } from 'zustand'
import { loginRequest, registerRequest } from '../../../shared/api/auth.js'

const storedUser = localStorage.getItem('user')

export const useAuthStore = create((set) => ({
  user: storedUser ? JSON.parse(storedUser) : null,
  token: localStorage.getItem('token') || null,
  loading: false,
  error: null,

  login: async (data) => {
    try {
      set({ loading: true, error: null })

      const res = await loginRequest(data)

      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))

      set({
        user: res.data.user,
        token: res.data.token,
        loading: false
      })

      return { success: true }
    } catch (err) {
      set({
        error: err.response?.data?.message || 'Error al iniciar sesión',
        loading: false
      })
      return { success: false }
    }
  },

  register: async (data) => {
    try {
      set({ loading: true, error: null })

      const res = await registerRequest(data)

      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))

      set({
        user: res.data.user,
        token: res.data.token,
        loading: false
      })

      return { success: true }
    } catch (err) {
      set({
        error: err.response?.data?.message || 'Error al registrarse',
        loading: false
      })
      return { success: false }
    }
  },

  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    set({ user: null, token: null })
  },

  clearError: () => set({ error: null })
}))
