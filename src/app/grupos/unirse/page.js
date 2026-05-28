'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import ProtectedRoute from '../../components/ProtectedRoute'
import Navbar from '../../components/Navbar'
import { apiRequest } from '../../services/api'

export default function UnirseGrupoPage() {
  const router = useRouter()
  const [codigoInvitacion, setCodigoInvitacion] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState(false)
  const [cargando, setCargando] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMensaje('')
    setError(false)
    setCargando(true)
    try {
      const data = await apiRequest('/grupos/unirse', {
        method: 'POST',
        body: JSON.stringify({ codigoInvitacion })
      })
      setMensaje(data.mensaje)
      setTimeout(() => router.push('/grupos'), 1200)
    } catch (err) {
      setMensaje(err.message)
      setError(true)
    } finally {
      setCargando(false)
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-[calc(100vh-4rem)] bg-zinc-950">
        <Navbar titulo="Unirse a grupo" volver />
        <div className="max-w-md mx-auto px-4 py-8">
          <p className="text-zinc-400 text-sm mb-6">Introduce el código de invitación que te ha pasado un amigo</p>
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-2 uppercase tracking-widest">Código de invitación</label>
              <input
                type="text"
                value={codigoInvitacion}
                onChange={(e) => setCodigoInvitacion(e.target.value.toUpperCase())}
                placeholder="Ej: RHZPEJ"
                maxLength={6}
                className="w-full px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500 transition tracking-widest text-center text-lg"
                required
              />
            </div>
            <button onClick={handleSubmit} disabled={cargando || !codigoInvitacion} className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-semibold transition disabled:opacity-50">
              {cargando ? 'Uniéndome...' : 'Unirme al grupo'}
            </button>
            {mensaje && <p className={`text-center text-sm ${error ? 'text-red-400' : 'text-emerald-400'}`}>{mensaje}</p>}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}

