const API_URL = 'http://localhost:3001/api'

export const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token')

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers
  })

  const data = await res.json()

  if (!res.ok) {
    if (res.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('usuario')
      window.location.href = '/login'
    }
    throw new Error(data.mensaje || 'Error en la petición')
  }

  return data
}