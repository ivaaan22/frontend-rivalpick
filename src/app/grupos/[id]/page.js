'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import ProtectedRoute from '../../components/ProtectedRoute'
import Navbar from '../../components/Navbar'
import Loading from '../../components/Loading'
import Avatar from '../../components/Avatar'
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
  const [copied, setCopied] = useState(false)
  const [confirmarEliminar, setConfirmarEliminar] = useState(false)
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

  useEffect(() => { cargarDetalle() }, [params.id])

  const handleGuardar = async (e) => {
    e.preventDefault()
    try {
      await apiRequest(`/grupos/${params.id}`, { method: 'PUT', body: JSON.stringify({ nombre, descripcion, apuesta, visibilidad }) })
      setEditando(false)
      cargarDetalle()
    } catch (error) {
      setMensaje(error.message)
    }
  }

  const handleEliminar = async () => {
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

  const iniciales = (n) => n.split(' ').slice(0, 2).map(w => w[0]?.toUpperCase() || '').join('')

  return (
    <ProtectedRoute>
      <div className="min-h-[calc(100vh-4rem)] bg-zinc-950">
        <Navbar titulo={grupo?.nombre || 'Detalle grupo'} volver />
        <div className="max-w-3xl mx-auto px-4 py-8">
          {cargando ? <Loading /> : mensaje && !grupo ? (
            <p className="text-red-400">{mensaje}</p>
          ) : editando ? (
            <form onSubmit={handleGuardar} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
              <h2 className="text-white font-semibold">Editar grupo</h2>
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-2 uppercase tracking-widest">Nombre</label>
                <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white focus:outline-none focus:border-emerald-500 transition" required />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-2 uppercase tracking-widest">Descripción</label>
                <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} rows={2} className="w-full px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white focus:outline-none focus:border-emerald-500 transition resize-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-2 uppercase tracking-widest">Apuesta</label>
                <input type="text" value={apuesta} onChange={(e) => setApuesta(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white focus:outline-none focus:border-emerald-500 transition" />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-2 uppercase tracking-widest">Visibilidad</label>
                <div className="grid grid-cols-2 gap-2">
                  <button type="button" onClick={() => setVisibilidad('privado')} className={`p-2 rounded-xl border text-sm transition ${visibilidad === 'privado' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300' : 'bg-zinc-800 border-zinc-700 text-zinc-300'}`}>Privado</button>
                  <button type="button" onClick={() => setVisibilidad('publico')} className={`p-2 rounded-xl border text-sm transition ${visibilidad === 'publico' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300' : 'bg-zinc-800 border-zinc-700 text-zinc-300'}`}>Público</button>
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <button type="button" onClick={() => setEditando(false)} className="px-4 py-2 rounded-xl border border-zinc-700 text-zinc-300 hover:text-white transition text-sm">Cancelar</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-sm transition">Guardar</button>
              </div>
            </form>
          ) : (
            <>
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-4">
                <div className="flex items-start gap-4 mb-5">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-600 flex items-center justify-center text-white text-xl font-bold flex-shrink-0">{grupo && iniciales(grupo.nombre)}</div>
                  <div className="flex-1">
                    <h1 className="text-xl font-bold text-white">{grupo?.nombre}</h1>
                    {grupo?.descripcion && <p className="text-zinc-400 text-sm mt-1">{grupo.descripcion}</p>}
                  </div>
                  {rolUsuario === 'admin' && <span className="text-xs px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">Admin</span>}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-zinc-800 rounded-xl p-3"><p className="text-xs text-zinc-500">Liga</p><p className="text-sm font-medium text-white mt-0.5">{grupo?.liga}</p></div>
                  <div className="bg-zinc-800 rounded-xl p-3"><p className="text-xs text-zinc-500">Modo</p><p className="text-sm font-medium text-white mt-0.5">{grupo?.modo === '1X2' ? 'Clásico (1X2)' : 'Marcador exacto'}</p></div>
                  <div className="bg-zinc-800 rounded-xl p-3"><p className="text-xs text-zinc-500">Visibilidad</p><p className="text-sm font-medium text-white mt-0.5 capitalize">{grupo?.visibilidad}</p></div>
                  <div className="bg-zinc-800 rounded-xl p-3 relative">
                    <p className="text-xs text-zinc-500">Código</p>
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-medium text-white mt-0.5 tracking-widest">{grupo?.codigoInvitacion}</p>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(grupo?.codigoInvitacion)
                          setCopied(true)
                          setTimeout(() => setCopied(false), 2000)
                        }}
                        className="text-zinc-400 hover:text-emerald-400 transition"
                        title="Copiar código"
                      >
                        {copied ? (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                        ) : (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {grupo?.apuesta && (
                  <div className="mt-3 bg-amber-500/10 border border-amber-500/20 rounded-xl p-3">
                    <p className="text-xs text-amber-500">Apuesta del grupo</p>
                    <p className="text-sm font-medium text-amber-300 mt-0.5">{grupo.apuesta}</p>
                  </div>
                )}

                <div className="mt-4 flex gap-2">
                  <button onClick={() => router.push(`/predicciones?grupoId=${params.id}&liga=${grupo?.liga}&jornada=`)} className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-sm transition">⚽ Predecir</button>
                  <button onClick={() => router.push(`/resultados?grupoId=${params.id}&jornada=1`)} className="flex-1 py-2.5 rounded-xl border border-zinc-700 text-zinc-300 hover:text-white hover:border-zinc-500 text-sm transition">📊 Resultados</button>
                </div>

                {rolUsuario === 'admin' && (
                  <div className="flex gap-2 mt-3 pt-4 border-t border-zinc-800">
                    <button onClick={() => setEditando(true)} className="px-4 py-2 rounded-xl border border-zinc-700 text-zinc-300 hover:text-white hover:border-zinc-500 text-sm transition">Editar</button>
                    <button onClick={() => setConfirmarEliminar(true)} className="px-4 py-2 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 text-sm transition">Eliminar grupo</button>
                  </div>
                )}
              </div>

              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                <h2 className="text-white font-semibold mb-4">Miembros ({miembros.length})</h2>
                <div className="divide-y divide-zinc-800">
                  {miembros.map((miembro) => (
                    <div key={miembro._id} className="flex items-center gap-3 py-3">
                      <Avatar usuario={miembro} size="sm" className="rounded-xl" />
                      <div className="flex-1">
                        <p className="text-white text-sm font-medium">{miembro.nombre}</p>
                        <p className="text-zinc-500 text-xs">@{miembro.username}</p>
                      </div>
                      {miembro.rol === 'admin' ? (
                        <span className="text-xs px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">Admin</span>
                      ) : rolUsuario === 'admin' && (
                        <button onClick={() => handleExpulsar(miembro._id)} className="text-xs px-2 py-1 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition">Expulsar</button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Modal confirmar eliminar */}
      {confirmarEliminar && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center px-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <div className="text-center mb-5">
              <div className="w-14 h-14 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-3">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
              </div>
              <h3 className="text-white font-semibold text-lg">Eliminar grupo</h3>
              <p className="text-zinc-400 text-sm mt-2">¿Seguro que quieres eliminar <span className="text-white font-medium">{grupo?.nombre}</span>? Esta acción no se puede deshacer.</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setConfirmarEliminar(false)} className="flex-1 py-2.5 rounded-xl border border-zinc-700 text-zinc-300 hover:text-white transition text-sm">Cancelar</button>
              <button onClick={() => { setConfirmarEliminar(false); handleEliminar() }} className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-400 text-white font-semibold transition text-sm">Sí, eliminar</button>
            </div>
          </div>
        </div>
      )}
    </ProtectedRoute>
  )
}
