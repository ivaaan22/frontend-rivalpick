'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import ProtectedRoute from '../../components/ProtectedRoute'
import Navbar from '../../components/Navbar'
import { apiRequest } from '../../services/api'

export default function NuevoGrupoPage() {
  const router = useRouter()
  const [nombre, setNombre] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [liga, setLiga] = useState('LaLiga')
  const [modo, setModo] = useState('1X2')
  const [apuesta, setApuesta] = useState('')
  const [visibilidad, setVisibilidad] = useState('privado')
  const [mensaje, setMensaje] = useState('')
  const [cargando, setCargando] = useState(false)

  const ligas = [
    { id: 'LaLiga', nombre: 'LaLiga', pais: 'España' },
    { id: 'Premier', nombre: 'Premier', pais: 'Inglaterra' },
    { id: 'Bundesliga', nombre: 'Bundesliga', pais: 'Alemania' },
    { id: 'SerieA', nombre: 'Serie A', pais: 'Italia' },
    { id: 'Ligue1', nombre: 'Ligue 1', pais: 'Francia' },
    { id: 'Champions', nombre: 'Champions League', pais: 'Europa' },
    { id: 'Mundial', nombre: 'Mundial 2026', pais: 'Internacional' },
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMensaje('')
    setCargando(true)
    try {
      await apiRequest('/grupos', {
        method: 'POST',
        body: JSON.stringify({ nombre, descripcion, liga, modo, apuesta, visibilidad })
      })
      router.push('/grupos')
    } catch (error) {
      setMensaje(error.message)
    } finally {
      setCargando(false)
    }
  }

  const iniciales = nombre.trim().split(' ').slice(0, 2).map(w => w[0]?.toUpperCase() || '').join('') || '?'

  return (
    <ProtectedRoute>
      <div className="min-h-[calc(100vh-4rem)] bg-zinc-950">
        <Navbar titulo="Nuevo grupo" volver />
        <div className="max-w-2xl mx-auto px-4 py-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
              <h3 className="text-white font-semibold mb-4">Información básica</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-2 uppercase tracking-widest">Nombre del grupo</label>
                  <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Ej: Peña del Barrio..." className="w-full px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500 transition" required />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-2 uppercase tracking-widest">Descripción (opcional)</label>
                  <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} placeholder="Una descripción breve..." rows={2} className="w-full px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500 transition resize-none" />
                </div>
                {nombre && (
                  <div className="bg-zinc-800 rounded-xl p-3 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white text-sm font-bold">{iniciales}</div>
                    <div>
                      <p className="text-white font-medium text-sm">{nombre}</p>
                      <p className="text-zinc-500 text-xs">Tú · Admin · 1 miembro</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
              <h3 className="text-white font-semibold mb-4">Liga a seguir</h3>
              <div className="grid grid-cols-3 gap-2">
                {ligas.map((l) => (
                  <button type="button" key={l.id} onClick={() => setLiga(l.id)} className={`p-3 rounded-xl border text-left transition ${liga === l.id ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300' : 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:border-zinc-500'}`}>
                    <p className="text-sm font-medium">{l.nombre}</p>
                    <p className="text-xs opacity-60 mt-0.5">{l.pais}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
              <h3 className="text-white font-semibold mb-4">Modo de juego</h3>
              <div className="grid grid-cols-2 gap-2">
                <button type="button" onClick={() => setModo('1X2')} className={`p-3 rounded-xl border text-left transition ${modo === '1X2' ? 'bg-emerald-500/20 border-emerald-500' : 'bg-zinc-800 border-zinc-700 hover:border-zinc-500'}`}>
                  <p className={`text-sm font-medium ${modo === '1X2' ? 'text-emerald-300' : 'text-white'}`}>Clásico (1X2)</p>
                  <p className="text-xs text-zinc-500 mt-1">Predices ganador o empate</p>
                </button>
                <button type="button" onClick={() => setModo('exacto')} className={`p-3 rounded-xl border text-left transition ${modo === 'exacto' ? 'bg-emerald-500/20 border-emerald-500' : 'bg-zinc-800 border-zinc-700 hover:border-zinc-500'}`}>
                  <p className={`text-sm font-medium ${modo === 'exacto' ? 'text-emerald-300' : 'text-white'}`}>Marcador exacto</p>
                  <p className="text-xs text-zinc-500 mt-1">Predices el resultado exacto</p>
                </button>
              </div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
              <h3 className="text-white font-semibold mb-4">Apuesta del grupo</h3>
              <input type="text" value={apuesta} onChange={(e) => setApuesta(e.target.value)} placeholder='Ej: "El último paga la ronda"' className="w-full px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500 transition" />
              <p className="text-xs text-zinc-500 mt-2">Lo que se juega el grupo (opcional)</p>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
              <h3 className="text-white font-semibold mb-4">Visibilidad</h3>
              <div className="grid grid-cols-2 gap-2">
                <button type="button" onClick={() => setVisibilidad('privado')} className={`p-3 rounded-xl border text-left transition ${visibilidad === 'privado' ? 'bg-emerald-500/20 border-emerald-500' : 'bg-zinc-800 border-zinc-700 hover:border-zinc-500'}`}>
                  <p className={`text-sm font-medium ${visibilidad === 'privado' ? 'text-emerald-300' : 'text-white'}`}>Privado</p>
                  <p className="text-xs text-zinc-500 mt-1">Solo con código de invitación</p>
                </button>
                <button type="button" onClick={() => setVisibilidad('publico')} className={`p-3 rounded-xl border text-left transition ${visibilidad === 'publico' ? 'bg-emerald-500/20 border-emerald-500' : 'bg-zinc-800 border-zinc-700 hover:border-zinc-500'}`}>
                  <p className={`text-sm font-medium ${visibilidad === 'publico' ? 'text-emerald-300' : 'text-white'}`}>Público</p>
                  <p className="text-xs text-zinc-500 mt-1">Cualquier usuario puede unirse</p>
                </button>
              </div>
            </div>

            {mensaje && <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20"><p className="text-red-400 text-sm text-center">{mensaje}</p></div>}

            <div className="flex gap-3 justify-end pb-4">
              <button type="button" onClick={() => router.push('/grupos')} className="px-5 py-2.5 rounded-xl border border-zinc-700 text-zinc-300 hover:text-white hover:border-zinc-500 transition text-sm">Cancelar</button>
              <button type="submit" disabled={cargando} className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-semibold transition text-sm disabled:opacity-50">{cargando ? 'Creando...' : 'Crear grupo'}</button>
            </div>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  )
}

