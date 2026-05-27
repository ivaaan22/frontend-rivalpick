'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import ProtectedRoute from '../components/ProtectedRoute'
<<<<<<< HEAD
import Navbar from '../components/Navbar'
import Loading from '../components/Loading'
=======
>>>>>>> origin/dev
import { apiRequest } from '../services/api'

export default function AdminPage() {
  const router = useRouter()
  const [stats, setStats] = useState(null)
  const [usuarios, setUsuarios] = useState([])
  const [grupos, setGrupos] = useState([])
  const [tab, setTab] = useState('usuarios')
  const [cargando, setCargando] = useState(true)
  const [mensaje, setMensaje] = useState('')

  useEffect(() => {
    const cargar = async () => {
      try {
        const [statsData, usuariosData, gruposData] = await Promise.all([
          apiRequest('/admin/stats'),
          apiRequest('/admin/usuarios'),
          apiRequest('/admin/grupos')
        ])
        setStats(statsData)
        setUsuarios(usuariosData)
        setGrupos(gruposData)
      } catch (error) {
<<<<<<< HEAD
        if (error.message.includes('403') || error.message.includes('superadmin')) router.push('/')
=======
        if (error.message.includes('403') || error.message.includes('superadmin')) {
          router.push('/')
        }
>>>>>>> origin/dev
        setMensaje('Error al cargar datos de admin')
      } finally {
        setCargando(false)
      }
    }
    cargar()
  }, [])

  const eliminarUsuario = async (id, nombre) => {
<<<<<<< HEAD
    if (!confirm(`¿Seguro que quieres eliminar a ${nombre}?`)) return
=======
    if (!confirm(`¿Seguro que quieres eliminar a ${nombre}? Esta acción es irreversible.`)) return
>>>>>>> origin/dev
    try {
      await apiRequest(`/admin/usuarios/${id}`, { method: 'DELETE' })
      setUsuarios(prev => prev.filter(u => u._id !== id))
    } catch (error) {
      setMensaje(error.message)
    }
  }

  const eliminarGrupo = async (id, nombre) => {
<<<<<<< HEAD
    if (!confirm(`¿Seguro que quieres eliminar el grupo "${nombre}"?`)) return
=======
    if (!confirm(`¿Seguro que quieres eliminar el grupo "${nombre}"? Se borrarán todos sus datos.`)) return
>>>>>>> origin/dev
    try {
      await apiRequest(`/admin/grupos/${id}`, { method: 'DELETE' })
      setGrupos(prev => prev.filter(g => g._id !== id))
    } catch (error) {
      setMensaje(error.message)
    }
  }

  const formatearFecha = (fecha) => new Date(fecha).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-zinc-950">
<<<<<<< HEAD
        <Navbar titulo="Panel de administración" />
        <div className="max-w-5xl mx-auto px-4 py-8">
          {mensaje && <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20"><p className="text-red-400 text-sm text-center">{mensaje}</p></div>}
          {cargando ? <Loading texto="Cargando panel..." /> : (
            <>
              {stats && (
                <div className="grid grid-cols-3 gap-3 mb-8">
                  <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4"><p className="text-2xl font-bold text-white">{stats.totalUsuarios}</p><p className="text-xs text-zinc-500 mt-1">Usuarios</p></div>
                  <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4"><p className="text-2xl font-bold text-emerald-400">{stats.totalGrupos}</p><p className="text-xs text-zinc-500 mt-1">Grupos</p></div>
                  <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4"><p className="text-2xl font-bold text-sky-400">{stats.totalPredicciones}</p><p className="text-xs text-zinc-500 mt-1">Predicciones</p></div>
                </div>
              )}
              <div className="flex gap-2 mb-6">
                <button onClick={() => setTab('usuarios')} className={`px-4 py-2 rounded-lg text-sm font-medium transition ${tab === 'usuarios' ? 'bg-emerald-500 text-black' : 'bg-zinc-800 text-zinc-400 hover:text-white'}`}>Usuarios ({usuarios.length})</button>
                <button onClick={() => setTab('grupos')} className={`px-4 py-2 rounded-lg text-sm font-medium transition ${tab === 'grupos' ? 'bg-emerald-500 text-black' : 'bg-zinc-800 text-zinc-400 hover:text-white'}`}>Grupos ({grupos.length})</button>
              </div>
=======
        <nav className="border-b border-zinc-800 bg-zinc-950 sticky top-0 z-10">
          <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => router.push('/')} className="text-zinc-400 hover:text-white transition">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
              </button>
              <span className="text-white font-semibold">Panel de administración</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">Superadmin</span>
            </div>
          </div>
        </nav>

        <div className="max-w-5xl mx-auto px-4 py-8">
          {mensaje && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
              <p className="text-red-400 text-sm text-center">{mensaje}</p>
            </div>
          )}

          {cargando ? (
            <div className="text-center py-20"><p className="text-zinc-500">Cargando...</p></div>
          ) : (
            <>
              {stats && (
                <div className="grid grid-cols-3 gap-3 mb-8">
                  <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                    <p className="text-2xl font-bold text-white">{stats.totalUsuarios}</p>
                    <p className="text-xs text-zinc-500 mt-1">Usuarios registrados</p>
                  </div>
                  <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                    <p className="text-2xl font-bold text-emerald-400">{stats.totalGrupos}</p>
                    <p className="text-xs text-zinc-500 mt-1">Grupos activos</p>
                  </div>
                  <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                    <p className="text-2xl font-bold text-sky-400">{stats.totalPredicciones}</p>
                    <p className="text-xs text-zinc-500 mt-1">Predicciones totales</p>
                  </div>
                </div>
              )}

              <div className="flex gap-2 mb-6">
                <button
                  onClick={() => setTab('usuarios')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${tab === 'usuarios' ? 'bg-emerald-500 text-black' : 'bg-zinc-800 text-zinc-400 hover:text-white'}`}
                >
                  Usuarios ({usuarios.length})
                </button>
                <button
                  onClick={() => setTab('grupos')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${tab === 'grupos' ? 'bg-emerald-500 text-black' : 'bg-zinc-800 text-zinc-400 hover:text-white'}`}
                >
                  Grupos ({grupos.length})
                </button>
              </div>

>>>>>>> origin/dev
              {tab === 'usuarios' && (
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl divide-y divide-zinc-800">
                  {usuarios.map((u) => (
                    <div key={u._id} className="flex items-center gap-4 p-4">
<<<<<<< HEAD
                      <div className="w-10 h-10 rounded-xl bg-zinc-700 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">{u.nombre.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2"><p className="text-white font-medium truncate">{u.nombre}</p>{u.rol === 'superadmin' && <span className="text-xs px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex-shrink-0">Admin</span>}</div>
                        <p className="text-zinc-500 text-xs">{u.email} · @{u.username} · {formatearFecha(u.createdAt)}</p>
                      </div>
                      {u.rol !== 'superadmin' && <button onClick={() => eliminarUsuario(u._id, u.nombre)} className="text-xs px-3 py-1.5 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition flex-shrink-0">Eliminar</button>}
=======
                      <div className="w-10 h-10 rounded-xl bg-zinc-700 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                        {u.nombre.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-white font-medium truncate">{u.nombre}</p>
                          {u.rol === 'superadmin' && (
                            <span className="text-xs px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex-shrink-0">Admin</span>
                          )}
                        </div>
                        <p className="text-zinc-500 text-xs">{u.email} · @{u.username} · {formatearFecha(u.createdAt)}</p>
                      </div>
                      {u.rol !== 'superadmin' && (
                        <button
                          onClick={() => eliminarUsuario(u._id, u.nombre)}
                          className="text-xs px-3 py-1.5 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition flex-shrink-0"
                        >
                          Eliminar
                        </button>
                      )}
>>>>>>> origin/dev
                    </div>
                  ))}
                </div>
              )}
<<<<<<< HEAD
=======

>>>>>>> origin/dev
              {tab === 'grupos' && (
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl divide-y divide-zinc-800">
                  {grupos.map((g) => (
                    <div key={g._id} className="flex items-center gap-4 p-4">
<<<<<<< HEAD
                      <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">{g.nombre.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium truncate">{g.nombre}</p>
                        <p className="text-zinc-500 text-xs">{g.liga} · {g.totalMiembros} miembros · {formatearFecha(g.createdAt)}</p>
                      </div>
                      <button onClick={() => eliminarGrupo(g._id, g.nombre)} className="text-xs px-3 py-1.5 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition flex-shrink-0">Eliminar</button>
=======
                      <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                        {g.nombre.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium truncate">{g.nombre}</p>
                        <p className="text-zinc-500 text-xs">{g.liga} · {g.totalMiembros} miembros · Creado por {g.creadoPor?.nombre} · {formatearFecha(g.createdAt)}</p>
                      </div>
                      <button
                        onClick={() => eliminarGrupo(g._id, g.nombre)}
                        className="text-xs px-3 py-1.5 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition flex-shrink-0"
                      >
                        Eliminar
                      </button>
>>>>>>> origin/dev
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
<<<<<<< HEAD
}
=======
}
>>>>>>> origin/dev
