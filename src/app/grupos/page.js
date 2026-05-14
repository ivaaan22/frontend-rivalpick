'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import ProtectedRoute from '../components/ProtectedRoute'
import ThemeToggle from '../components/ThemeToggle'
import { apiRequest } from '../services/api'

export default function GruposPage() {
  const router = useRouter()
  const [grupos, setGrupos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [mensaje, setMensaje] = useState('')

  useEffect(() => {
    const cargarGrupos = async () => {
      try {
        const data = await apiRequest('/grupos/me')
        setGrupos(data)
      } catch (error) {
        setMensaje('Error al cargar los grupos')
      } finally {
        setCargando(false)
      }
    }
    cargarGrupos()
  }, [])

  const colores = [
    'bg-indigo-600', 'bg-emerald-600', 'bg-amber-600',
    'bg-rose-600', 'bg-sky-600', 'bg-violet-600'
  ]

  const iniciales = (nombre) =>
    nombre.split(' ').slice(0, 2).map(w => w[0]?.toUpperCase() || '').join('')

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-zinc-100 dark:bg-zinc-900 px-4 py-8 relative">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="flex items-end justify-between mb-6">
            <div>
              <h1 className="text-2xl font-medium text-zinc-900 dark:text-zinc-100">Mis grupos</h1>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                {grupos.length} {grupos.length === 1 ? 'grupo activo' : 'grupos activos'}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => router.push('/grupos/unirse')}
                className="px-4 py-2 rounded-md border border-zinc-300 dark:border-zinc-600 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700 text-sm transition"
              >
                Unirme a grupo
              </button>
              <button
                onClick={() => router.push('/grupos/nuevo')}
                className="px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm transition"
              >
                + Nuevo grupo
              </button>
            </div>
          </div>

          {cargando ? (
            <p className="text-zinc-500 dark:text-zinc-400">Cargando...</p>
          ) : mensaje ? (
            <p className="text-red-500">{mensaje}</p>
          ) : grupos.length === 0 ? (
            <div className="bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 p-8 text-center">
              <p className="text-zinc-500 dark:text-zinc-400 mb-4">Todavía no perteneces a ningún grupo</p>
              <button
                onClick={() => router.push('/grupos/nuevo')}
                className="px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm transition"
              >
                Crear mi primer grupo
              </button>
            </div>
          ) : (
            <div className="bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 divide-y divide-zinc-200 dark:divide-zinc-700">
              {grupos.map((grupo, i) => (
                <div
                  key={grupo._id}
                  onClick={() => router.push(`/grupos/${grupo._id}`)}
                  className="flex items-center gap-3 p-4 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-700/50 transition"
                >
                  <div className={`w-11 h-11 rounded-md ${colores[i % colores.length]} flex items-center justify-center text-white text-sm font-medium`}>
                    {iniciales(grupo.nombre)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{grupo.nombre}</p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      {grupo.liga} · {grupo.rolUsuario === 'admin' ? 'Admin' : 'Miembro'}
                    </p>
                  </div>
                  <span className="text-zinc-400 dark:text-zinc-500">›</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}