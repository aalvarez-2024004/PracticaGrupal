import { axiosAuth } from './api.js'

export const loginRequest = (data) => axiosAuth.post('/api/auth/login', data)
export const registerRequest = (data) => axiosAuth.post('/api/auth/register', data)
export const profileRequest = () => axiosAuth.get('/api/auth/profile')
