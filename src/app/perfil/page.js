'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import ProtectedRoute from '../components/ProtectedRoute'
import Navbar from '../components/Navbar'
import Loading from '../components/Loading'
import { apiRequest } from '../services/api'

export default function PerfilPage() {
  const router = useRouter()
  const [usuario, setUsuario] = useState(null)
  const [nombre, setNombre] = useState('')
  const [username, setUsername] = useState('')
  const [equipoFavorito, setEquipoFavorito] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [cargando, setCargando] = useState(true)
  const [guardando, setGuardando] = useState(false)

  useEffect(() => {
    const cargarPerfil = async () => {
      try {
        const data = await apiRequest('/users/me')
        setUsuario(data)
        setNombre(data.nombre)
        setUsername(data.username)
        setEquipoFavorito(data.equipoFavorito || '')
      } catch (error) {
        console.error(error)
      } finally {
        setCargando(false)
      }
    }
    cargarPerfil()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMensaje('')
    setGuardando(true)
    try {
      const data = await apiRequest('/users/me', { method: 'PUT', body: JSON.stringify({ nombre, username, equipoFavorito }) })
      setUsuario(data.usuario)
      setMensaje('Guardado correctamente')
      setTimeout(() => setMensaje(''), 3000)
    } catch (error) {
      setMensaje(error.message)
    } finally {
      setGuardando(false)
    }
  }

  const iniciales = (n) => n?.split(' ').slice(0, 2).map(w => w[0]?.toUpperCase() || '').join('') || ''

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-zinc-950">
        <Navbar titulo="Perfil" volver />
        <div className="max-w-2xl mx-auto px-4 py-8">
          {cargando ? <Loading /> : (
            <>
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-4 flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500 flex items-center justify-center text-black text-xl font-bold flex-shrink-0">{iniciales(usuario?.nombre)}</div>
                <div>
                  <p className="text-white text-lg font-semibold">{usuario?.nombre}</p>
                  <p className="text-zinc-400 text-sm">{usuario?.email}</p>
                  <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">{usuario?.rol}</span>
                </div>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-4">
                <h2 className="text-white font-semibold mb-5">Editar datos</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-2 uppercase tracking-widest">Nombre completo</label>
                    <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white focus:outline-none focus:border-emerald-500 transition" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-2 uppercase tracking-widest">Nombre de usuario</label>
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white focus:outline-none focus:border-emerald-500 transition" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-2 uppercase tracking-widest">Equipo favorito</label>
                    <input type="text" value={equipoFavorito} onChange={(e) => setEquipoFavorito(e.target.value)} placeholder="FC Barcelona" className="w-full px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500 transition" />
                  </div>
                  <button type="submit" disabled={guardando} className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-semibold transition disabled:opacity-50">{guardando ? 'Guardando...' : 'Guardar cambios'}</button>
                  {mensaje && <p className="text-center text-sm text-emerald-400">{mensaje}</p>}
                </form>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                <h2 className="text-white font-semibold mb-1">Historial y estadísticas</h2>
                <p className="text-zinc-500 text-sm mb-4">Ve tu rendimiento a lo largo de la temporada</p>
                <button onClick={() => router.push('/historial')} className="w-full py-2.5 rounded-xl border border-zinc-700 text-zinc-300 hover:text-white hover:border-zinc-500 text-sm transition">Ver mi historial →</button>
              </div>
            </>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}
