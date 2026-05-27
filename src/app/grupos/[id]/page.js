'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import ProtectedRoute from '../../components/ProtectedRoute'
import { apiRequest } from '../../services/api'

export default function DetalleGrupoPage() {
  const router = useRouter()
  const params = useParams()
  const [grupo, setGrupo] = useState(null)
  const [miembros, setMiembros] = useState([])
  const [rolUsuario, setRolUsuario] = useState('')
  const [cargando, setCargando] = useState(true)
  const [mensaje, setMensaje] = useState('')

  const [editando, setEditando] = useState(false)
  const [nombre, setNombre] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [apuesta, setApuesta] = useState('')
  const [visibilidad, setVisibilidad] = useState('privado')

  const cargarDetalle = async () => {
    try {
      const data = await apiRequest(`/grupos/${params.id}`)
      setGrupo(data.grupo)
      setMiembros(data.miembros)
      setRolUsuario(data.rolUsuario)
      setNombre(data.grupo.nombre)
      setDescripcion(data.grupo.descripcion || '')
      setApuesta(data.grupo.apuesta || '')
      setVisibilidad(data.grupo.visibilidad)
    } catch (error) {
      setMensaje(error.message)
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    cargarDetalle()
  }, [params.id])

  const handleGuardar = async (e) => {
    e.preventDefault()
    try {
      await apiRequest(`/grupos/${params.id}`, {
        method: 'PUT',
        body: JSON.stringify({ nombre, descripcion, apuesta, visibilidad })
      })
      setEditando(false)
      cargarDetalle()
    } catch (error) {
      setMensaje(error.message)
    }
  }

  const handleEliminar = async () => {
    if (!confirm('¿Seguro que quieres eliminar este grupo? Esta acción no se puede deshacer.')) return
    try {
      await apiRequest(`/grupos/${params.id}`, { method: 'DELETE' })
      router.push('/grupos')
    } catch (error) {
      setMensaje(error.message)
    }
  }

  const handleExpulsar = async (userId) => {
    if (!confirm('¿Seguro que quieres expulsar a este miembro?')) return
    try {
      await apiRequest(`/grupos/${params.id}/miembros/${userId}`, { method: 'DELETE' })
      cargarDetalle()
    } catch (error) {
      setMensaje(error.message)
    }
  }

  const iniciales = (nombre) =>
    nombre.split(' ').slice(0, 2).map(w => w[0]?.toUpperCase() || '').join('')

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-zinc-950 px-4 py-8 relative">
          <div className="max-w-3xl mx-auto">
          <div className="space-y-2 mb-4">
            <button
              onClick={() => router.push('/')}
              className="block w-fit text-sm text-zinc-300 hover:text-white transition"
            >
              ← Menú principal
            </button>
            <button
              onClick={() => router.push('/grupos')}
              className="block w-fit text-sm text-zinc-300 hover:text-white transition"
            >
              ← Mis grupos
            </button>
          </div>

          {cargando ? (
            <p className="text-zinc-500 dark:text-zinc-400">Cargando...</p>
          ) : mensaje ? (
            <p className="text-red-500">{mensaje}</p>
          ) : editando ? (
            <form onSubmit={handleGuardar} className="bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 p-6 space-y-4">
              <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">Editar grupo</h2>

              <div>
                <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1 uppercase tracking-wide">Nombre</label>
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="w-full px-4 py-2 rounded-md bg-zinc-50 dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1 uppercase tracking-wide">Descripción</label>
                <textarea
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  rows={2}
                  className="w-full px-4 py-2 rounded-md bg-zinc-50 dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1 uppercase tracking-wide">Apuesta</label>
                <input
                  type="text"
                  value={apuesta}
                  onChange={(e) => setApuesta(e.target.value)}
                  className="w-full px-4 py-2 rounded-md bg-zinc-50 dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1 uppercase tracking-wide">Visibilidad</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setVisibilidad('privado')}
                    className={`p-2 rounded-md border text-sm transition ${
                      visibilidad === 'privado'
                        ? 'bg-indigo-100 dark:bg-indigo-900 border-indigo-500 text-indigo-700 dark:text-indigo-300'
                        : 'bg-zinc-50 dark:bg-zinc-700 border-zinc-200 dark:border-zinc-600 text-zinc-900 dark:text-zinc-100'
                    }`}
                  >
                    Privado
                  </button>
                  <button
                    type="button"
                    onClick={() => setVisibilidad('publico')}
                    className={`p-2 rounded-md border text-sm transition ${
                      visibilidad === 'publico'
                        ? 'bg-indigo-100 dark:bg-indigo-900 border-indigo-500 text-indigo-700 dark:text-indigo-300'
                        : 'bg-zinc-50 dark:bg-zinc-700 border-zinc-200 dark:border-zinc-600 text-zinc-900 dark:text-zinc-100'
                    }`}
                  >
                    Público
                  </button>
                </div>
              </div>

              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setEditando(false)}
                  className="px-4 py-2 rounded-md border border-zinc-300 dark:border-zinc-600 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700 text-sm transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm transition"
                >
                  Guardar cambios
                </button>
              </div>
            </form>
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

                {rolUsuario === 'admin' && (
                  <div className="flex gap-2 mt-5 pt-5 border-t border-zinc-200 dark:border-zinc-700">
                    <button
                      onClick={() => setEditando(true)}
                      className="px-4 py-2 rounded-md border border-zinc-300 dark:border-zinc-600 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700 text-sm transition"
                    >
                      Editar grupo
                    </button>
                    <button
                      onClick={handleEliminar}
                      className="px-4 py-2 rounded-md border border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 text-sm transition"
                    >
                      Eliminar grupo
                    </button>
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
                      {miembro.rol === 'admin' ? (
                        <span className="text-xs font-medium px-2 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300">
                          Admin
                        </span>
                      ) : (
                        rolUsuario === 'admin' && (
                          <button
                            onClick={() => handleExpulsar(miembro._id)}
                            className="text-xs font-medium px-2 py-1 rounded-md border border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition"
                          >
                            Expulsar
                          </button>
                        )
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