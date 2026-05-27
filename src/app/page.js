'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/Navbar'
import Loading from './components/Loading'
import { apiRequest } from './services/api'

export default function Home() {
  const router = useRouter()
  const [grupos, setGrupos] = useState([])
  const [alertas, setAlertas] = useState([])
  const [usuario, setUsuario] = useState(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    const u = localStorage.getItem('usuario')
    if (u) setUsuario(JSON.parse(u))
    const cargarDashboard = async () => {
      try {
        const data = await apiRequest('/dashboard')
        setGrupos(data.grupos)
        setAlertas(data.alertas)
      } catch (error) {
        console.error(error)
      } finally {
        setCargando(false)
      }
    }
    cargarDashboard()
  }, [])

  const colores = ['bg-emerald-600', 'bg-sky-600', 'bg-violet-600', 'bg-amber-600', 'bg-rose-600', 'bg-indigo-600']
  const iniciales = (nombre) => nombre.split(' ').slice(0, 2).map(w => w[0]?.toUpperCase() || '').join('')
  const formatearFecha = (fecha) => new Date(fecha).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-zinc-950">
        <Navbar />

        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white">
              Hola, {usuario ? usuario.nombre.split(' ')[0] : 'jugador'} ⚽
            </h1>
            <p className="text-zinc-400 mt-1">{new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
          </div>

          {cargando ? (
            <Loading texto="Cargando tu dashboard..." />
          ) : (
            <>
              {alertas.length > 0 && (
                <div className="mb-6 space-y-2">
                  {alertas.map((alerta, i) => (
                    <div key={i} className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0 animate-pulse"></div>
                        <div>
                          <p className="text-emerald-300 font-medium text-sm">Jornada {alerta.jornada} abierta — {alerta.grupoNombre}</p>
                          <p className="text-emerald-500 text-xs mt-0.5">{alerta.partidosSinPredecir} partidos sin predecir · Primer partido: {formatearFecha(alerta.primerPartido)}</p>
                        </div>
                      </div>
                      <button onClick={() => router.push(`/grupos/${alerta.grupoId}`)} className="text-xs font-semibold px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black transition flex-shrink-0">
                        Predecir →
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                  <p className="text-2xl font-bold text-white">{grupos.length}</p>
                  <p className="text-xs text-zinc-500 mt-1">Grupos activos</p>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                  <p className="text-2xl font-bold text-emerald-400">{alertas.length}</p>
                  <p className="text-xs text-zinc-500 mt-1">Pendientes</p>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 cursor-pointer hover:border-zinc-600 transition" onClick={() => router.push('/partidos')}>
                  <p className="text-2xl">⚽</p>
                  <p className="text-xs text-zinc-500 mt-1">Ver partidos</p>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 cursor-pointer hover:border-zinc-600 transition" onClick={() => router.push('/perfil')}>
                  <p className="text-2xl">👤</p>
                  <p className="text-xs text-zinc-500 mt-1">Mi perfil</p>
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <h2 className="text-white font-semibold">Mis grupos</h2>
                <div className="flex gap-2">
                  <button onClick={() => router.push('/grupos/unirse')} className="text-xs px-3 py-1.5 rounded-lg border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500 transition">Unirme</button>
                  <button onClick={() => router.push('/grupos/nuevo')} className="text-xs px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-semibold transition">+ Nuevo</button>
                </div>
              </div>

              {grupos.length === 0 ? (
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-10 text-center">
                  <p className="text-4xl mb-3">🏆</p>
                  <p className="text-white font-medium mb-1">Todavía no tienes grupos</p>
                  <p className="text-zinc-500 text-sm mb-6">Crea uno o únete con un código de invitación</p>
                  <button onClick={() => router.push('/grupos/nuevo')} className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-semibold transition text-sm">Crear mi primer grupo</button>
                </div>
              ) : (
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl divide-y divide-zinc-800">
                  {grupos.map((grupo, i) => (
                    <div key={grupo._id} onClick={() => router.push(`/grupos/${grupo._id}`)} className="flex items-center gap-3 p-4 cursor-pointer hover:bg-zinc-800/50 transition">
                      <div className={`w-10 h-10 rounded-xl ${colores[i % colores.length]} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}>
                        {iniciales(grupo.nombre)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium truncate">{grupo.nombre}</p>
                        <p className="text-zinc-500 text-xs">{grupo.liga} · {grupo.rolUsuario === 'admin' ? 'Admin' : 'Miembro'}</p>
                      </div>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#52525b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-4 grid grid-cols-2 gap-3">
                <button onClick={() => router.push('/grupos')} className="py-2.5 rounded-xl border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-600 text-sm transition">Ver todos los grupos</button>
                <button onClick={() => router.push('/partidos')} className="py-2.5 rounded-xl border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-600 text-sm transition">Ver partidos</button>
              </div>
            </>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}