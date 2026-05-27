'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import ProtectedRoute from '../../components/ProtectedRoute'
import { apiRequest } from '../../services/api'

export default function UnirseGrupoPage() {
  const router = useRouter()
  const [codigoInvitacion, setCodigoInvitacion] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMensaje('')
    setError(false)

    try {
      const data = await apiRequest('/grupos/unirse', {
        method: 'POST',
        body: JSON.stringify({ codigoInvitacion })
      })
      setMensaje(data.mensaje)
      setError(false)
      setTimeout(() => router.push('/grupos'), 1200)
    } catch (err) {
      setMensaje(err.message)
      setError(true)
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-zinc-950 px-4 py-8 relative">
          <div className="max-w-md mx-auto">
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

          <h1 className="text-2xl font-medium mb-1 text-zinc-100">Unirse a un grupo</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
            Introduce el código de invitación que te ha pasado un amigo
          </p>

          <form onSubmit={handleSubmit} className="bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 p-5 space-y-4">
            <div>
              <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1 uppercase tracking-wide">
                Código de invitación
              </label>
              <input
                type="text"
                value={codigoInvitacion}
                onChange={(e) => setCodigoInvitacion(e.target.value.toUpperCase())}
                placeholder="Ej: RHZPEJ"
                maxLength={6}
                className="w-full px-4 py-2 rounded-md bg-zinc-50 dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-indigo-500 tracking-widest text-center text-lg"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-md transition"
            >
              Unirme al grupo
            </button>

            {mensaje && (
              <p className={`text-center text-sm ${error ? 'text-red-500' : 'text-green-600 dark:text-green-400'}`}>
                {mensaje}
              </p>
            )}
          </form>
        </div>
      </div>
    </ProtectedRoute>
  )
}