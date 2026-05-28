'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import ProtectedRoute from '../components/ProtectedRoute'
import Navbar from '../components/Navbar'
import Loading from '../components/Loading'
import { apiRequest } from '../services/api'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3001'

export default function PerfilPage() {
  const router = useRouter()
  const fileInputRef = useRef(null)
  const [usuario, setUsuario] = useState(null)
  const [nombre, setNombre] = useState('')
  const [username, setUsername] = useState('')
  const [equipoFavorito, setEquipoFavorito] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [cargando, setCargando] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [subiendoFoto, setSubiendoFoto] = useState(false)
  const [preview, setPreview] = useState(null)

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
      setMensaje('✓ Guardado correctamente')
      setTimeout(() => setMensaje(''), 3000)
    } catch (error) {
      setMensaje(error.message)
    } finally {
      setGuardando(false)
    }
  }

  const handleFotoChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Preview inmediato
    const reader = new FileReader()
    reader.onload = (ev) => setPreview(ev.target.result)
    reader.readAsDataURL(file)

    // Subir al servidor
    setSubiendoFoto(true)
    try {
      const token = localStorage.getItem('token')
      const formData = new FormData()
      formData.append('foto', file)

      const res = await fetch(`${API_BASE}/api/users/me/foto`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      })
      const data = await res.json()
      if (res.ok) {
        setUsuario(prev => ({ ...prev, fotoPerfil: data.fotoPerfil }))
        // Actualizar localStorage para que el Navbar se entere
        const usuarioLocal = JSON.parse(localStorage.getItem('usuario') || '{}')
        localStorage.setItem('usuario', JSON.stringify({ ...usuarioLocal, fotoPerfil: data.fotoPerfil }))
        // Notificar al Navbar para que actualice el avatar
        window.dispatchEvent(new Event('usuarioActualizado'))
        setMensaje('✓ Foto actualizada')
        setTimeout(() => setMensaje(''), 3000)
      } else {
        setMensaje(data.mensaje || 'Error al subir la foto')
        setPreview(null)
      }
    } catch (error) {
      setMensaje('Error al subir la foto')
      setPreview(null)
    } finally {
      setSubiendoFoto(false)
    }
  }

  const fotoUrl = preview || (usuario?.fotoPerfil ? `${API_BASE}${usuario.fotoPerfil}` : null)
  const iniciales = (n) => n?.split(' ').slice(0, 2).map(w => w[0]?.toUpperCase() || '').join('') || ''

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-zinc-950">
        <Navbar titulo="Perfil" volver />
        <div className="max-w-2xl mx-auto px-4 py-8">
          {cargando ? <Loading /> : (
            <>
              {/* Avatar */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-4">
                <div className="flex items-center gap-5">
                  <div className="relative flex-shrink-0">
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="w-20 h-20 rounded-2xl overflow-hidden cursor-pointer group relative"
                    >
                      {fotoUrl ? (
                        <img src={fotoUrl} alt="Foto de perfil" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-emerald-500 flex items-center justify-center text-black text-2xl font-bold">
                          {iniciales(usuario?.nombre)}
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                        {subiendoFoto ? (
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
                        )}
                      </div>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      onChange={handleFotoChange}
                      className="hidden"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-white text-lg font-semibold">{usuario?.nombre}</p>
                    <p className="text-zinc-400 text-sm">@{usuario?.username}</p>
                    <p className="text-zinc-500 text-xs mt-1">{usuario?.email}</p>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="mt-2 text-xs text-emerald-400 hover:text-emerald-300 transition"
                    >
                      {subiendoFoto ? 'Subiendo...' : 'Cambiar foto'}
                    </button>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 self-start">{usuario?.rol}</span>
                </div>
              </div>

              {/* Formulario */}
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
                  <button type="submit" disabled={guardando} className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-semibold transition disabled:opacity-50">
                    {guardando ? 'Guardando...' : 'Guardar cambios'}
                  </button>
                  {mensaje && <p className={`text-center text-sm ${mensaje.startsWith('✓') ? 'text-emerald-400' : 'text-red-400'}`}>{mensaje}</p>}
                </form>
              </div>

              {/* Historial */}
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
