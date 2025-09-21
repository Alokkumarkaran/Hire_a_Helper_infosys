import axios from 'axios'
import { getToken } from './auth'

// Use VITE_BACKEND_URL from .env for deployed backend
const api = axios.create({ 
  baseURL: `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'}/api` 
})

api.interceptors.request.use(config => {
  const t = getToken()
  if (t) config.headers.Authorization = 'Bearer ' + t
  return config
})

export default api
