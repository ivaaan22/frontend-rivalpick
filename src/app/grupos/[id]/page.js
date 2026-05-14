'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import ProtectedRoute from '../../components/ProtectedRoute'
import ThemeToggle from '../../components/ThemeToggle'
import { apiRequest } from '../../services/api'

export default function DetalleGrupoPage() {
  const router = useRouter()
  const params = useParams()
  const [grupo, setGrupo] = useState(null)
  const [miembros, setMiembros] = useState([])
  const [rolUsuario, setRolUsuario] = useState('')
  const [cargando, setCargando] = useState(true)
  const [mensaje, setMensaje] = useState('')

  useEffect(() => {
    const cargarDetalle = async () => {
      try {
        const data = await apiRequest(`/grupos/${params.id}`)
        setGrupo(data.grupo)
        setMiembros(data.miembros)
        setRolUsuario(data.rolUsuario)
      } catch (error) {
        setMensaje(error.message)
      } finally {
        setCargando(false)
      }
    }
    cargarDetalle()
  }, [params.id])

  const iniciales = (nombre) =>
    nombre.split(' ').slice(0, 2).map(w => w[0]?.toUpperCase() || '').join('')

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-zinc-100 dark:bg-zinc-900 px-4 py-8 relative">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>

        <div className="max-w-3xl mx-auto">
          <button
            onClick={() => router.push('/grupos')}
            className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 mb-4"
          >
            ← Mis grupos
          </button>

          {cargando ? (
            <p className="text-zinc-500 dark:text-zinc-400">Cargando...</p>
          ) : mensaje ? (
            <p className="text-red-500">{mensaje}</p>
          ) : (
            <>
              <div className="bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 p-6 mb-4">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-md bg-indigo-600 flex items-center justify-center text-white text-lg font-medium">
                    {iniciales(grupo.nombre)}
                  </div>
                  <div className="flex-1">
                    <h1 className="text-xl font-medium text-zinc-900 dark:text-zinc-100">{grupo.nombre}</h1>
                    {grupo.descripcion && (
                      <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">{grupo.descripcion}</p>
                    )}
                  </div>
                  {rolUsuario === 'admin' && (
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300">
                      Admin
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
                  <div className="bg-zinc-50 dark:bg-zinc-700 rounded-md p-3">
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">Liga</p>
                    <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{grupo.liga}</p>
                  </div>
                  <div className="bg-zinc-50 dark:bg-zinc-700 rounded-md p-3">
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">Modo</p>
                    <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                      {grupo.modo === '1X2' ? 'Clásico (1X2)' : 'Marcador exacto'}
                    </p>
                  </div>
                  <div className="bg-zinc-50 dark:bg-zinc-700 rounded-md p-3">
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">Visibilidad</p>
                    <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 capitalize">{grupo.visibilidad}</p>
                  </div>
                  <div className="bg-zinc-50 dark:bg-zinc-700 rounded-md p-3">
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">Código</p>
                    <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 tracking-wider">{grupo.codigoInvitacion}</p>
                  </div>
                </div>

                {grupo.apuesta && (
                  <div className="mt-3 bg-amber-50 dark:bg-amber-900/30 rounded-md p-3">
                    <p className="text-xs text-amber-700 dark:text-amber-400">Apuesta del grupo</p>
                    <p className="text-sm font-medium text-amber-800 dark:text-amber-300">{grupo.apuesta}</p>
                  </div>
                )}
              </div>

              <div className="bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 p-6">
                <h2 className="text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-4">
                  Miembros ({miembros.length})
                </h2>
                <div className="divide-y divide-zinc-200 dark:divide-zinc-700">
                  {miembros.map((miembro) => (
                    <div key={miembro._id} className="flex items-center gap-3 py-3">
                      <div className="w-9 h-9 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center text-zinc-600 dark:text-zinc-300 text-xs font-medium">
                        {iniciales(miembro.nombre)}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{miembro.nombre}</p>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">@{miembro.username}</p>
                      </div>
                      {miembro.rol === 'admin' && (
                        <span className="text-xs font-medium px-2 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300">
                          Admin
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}