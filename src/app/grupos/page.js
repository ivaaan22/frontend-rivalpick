'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import ProtectedRoute from '../components/ProtectedRoute'
import Navbar from '../components/Navbar'
import Loading from '../components/Loading'
import { apiRequest } from '../services/api'

export default function GruposPage() {
  const router = useRouter()
  const [grupos, setGrupos] = useState([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    const cargarGrupos = async () => {
      try {
        const data = await apiRequest('/grupos/me')
        setGrupos(data)
      } catch (error) {
        console.error(error)
      } finally {
        setCargando(false)
      }
    }
    cargarGrupos()
  }, [])

  const colores = ['bg-emerald-600', 'bg-sky-600', 'bg-violet-600', 'bg-amber-600', 'bg-rose-600', 'bg-indigo-600']
  const iniciales = (nombre) => nombre.split(' ').slice(0, 2).map(w => w[0]?.toUpperCase() || '').join('')

  return (
    <ProtectedRoute>
      <div className="min-h-[calc(100vh-4rem)] bg-zinc-950">
        <Navbar titulo="Mis grupos" volver />
        <div className="max-w-3xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <p className="text-zinc-500 text-sm">{grupos.length} {grupos.length === 1 ? 'grupo activo' : 'grupos activos'}</p>
            <div className="flex gap-2">
              <button onClick={() => router.push('/grupos/unirse')} className="text-sm px-4 py-1.5 rounded-lg border border-zinc-700 text-zinc-300 hover:border-zinc-500 hover:text-white transition">Unirme</button>
              <button onClick={() => router.push('/grupos/nuevo')} className="text-sm px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-semibold transition">+ Nuevo</button>
            </div>
          </div>

          {cargando ? <Loading texto="Cargando grupos..." /> : grupos.length === 0 ? (
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-10 text-center">
              <p className="text-4xl mb-3">🏆</p>
              <p className="text-white font-medium mb-1">Todavía no tienes grupos</p>
              <p className="text-zinc-500 text-sm mb-6">Crea uno o únete con un código de invitación</p>
              <button onClick={() => router.push('/grupos/nuevo')} className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-semibold transition text-sm">Crear mi primer grupo</button>
            </div>
          ) : (
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl divide-y divide-zinc-800">
              {grupos.map((grupo, i) => (
                <div key={grupo._id} onClick={() => router.push(`/grupos/${grupo._id}`)} className="flex items-center gap-4 p-4 cursor-pointer hover:bg-zinc-800/50 transition">
                  <div className={`w-12 h-12 rounded-xl ${colores[i % colores.length]} flex items-center justify-center text-white font-bold flex-shrink-0`}>{iniciales(grupo.nombre)}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate">{grupo.nombre}</p>
                    <p className="text-zinc-500 text-xs mt-0.5">{grupo.liga} · {grupo.modo === '1X2' ? 'Clásico' : 'Exacto'} · {grupo.rolUsuario === 'admin' ? 'Admin' : 'Miembro'}</p>
                  </div>
                  {grupo.apuesta && <span className="text-xs px-2 py-1 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 hidden sm:block truncate max-w-[140px]">{grupo.apuesta}</span>}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#52525b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}

