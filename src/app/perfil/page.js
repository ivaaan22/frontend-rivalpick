'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import ProtectedRoute from '../components/ProtectedRoute'
import ThemeToggle from '../components/ThemeToggle'
import { apiRequest } from '../services/api'

export default function PerfilPage() {
  const router = useRouter()
  const [usuario, setUsuario] = useState(null)
  const [nombre, setNombre] = useState('')
  const [username, setUsername] = useState('')
  const [equipoFavorito, setEquipoFavorito] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    const cargarPerfil = async () => {
      try {
        const data = await apiRequest('/users/me')
        setUsuario(data)
        setNombre(data.nombre)
        setUsername(data.username)
        setEquipoFavorito(data.equipoFavorito || '')
      } catch (error) {
        setMensaje('Error al cargar el perfil')
      } finally {
        setCargando(false)
      }
    }
    cargarPerfil()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMensaje('')

    try {
      const data = await apiRequest('/users/me', {
        method: 'PUT',
        body: JSON.stringify({ nombre, username, equipoFavorito })
      })
      setUsuario(data.usuario)
      setMensaje('Perfil actualizado correctamente')
    } catch (error) {
      setMensaje(error.message)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
    router.push('/login')
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-zinc-100 dark:bg-zinc-900 px-4 py-8 relative">
        <div className="absolute top-4 right-4 flex gap-2">
          <ThemeToggle />
          <button
            onClick={handleLogout}
            className="px-3 py-2 rounded-md bg-red-500 hover:bg-red-600 text-white text-sm font-medium transition"
          >
            Cerrar sesión
          </button>
        </div>

        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-medium mb-6 text-zinc-900 dark:text-zinc-100">
            Perfil
          </h1>

          {cargando ? (
            <p className="text-zinc-500 dark:text-zinc-400">Cargando...</p>
          ) : (
            <div className="bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 p-6">
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-zinc-200 dark:border-zinc-700">
                <div className="w-14 h-14 rounded-full bg-indigo-600 flex items-center justify-center text-white text-lg font-medium">
                  {usuario?.nombre?.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()}
                </div>
                <div>
                  <p className="text-lg font-medium text-zinc-900 dark:text-zinc-100">{usuario?.nombre}</p>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">{usuario?.email}</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1 uppercase tracking-wide">
                    Nombre completo
                  </label>
                  <input
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className="w-full px-4 py-2 rounded-md bg-zinc-50 dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1 uppercase tracking-wide">
                    Nombre de usuario
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-2 rounded-md bg-zinc-50 dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1 uppercase tracking-wide">
                    Equipo favorito
                  </label>
                  <input
                    type="text"
                    value={equipoFavorito}
                    onChange={(e) => setEquipoFavorito(e.target.value)}
                    className="w-full px-4 py-2 rounded-md bg-zinc-50 dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-md transition"
                >
                  Guardar cambios
                </button>

                {mensaje && (
                  <p className="text-center text-sm text-zinc-600 dark:text-zinc-300">{mensaje}</p>
                )}
              </form>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}