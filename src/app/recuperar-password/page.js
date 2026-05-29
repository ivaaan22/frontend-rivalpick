'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

export default function RecuperarPasswordPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [passwordActual, setPasswordActual] = useState('')
  const [passwordNueva, setPasswordNueva] = useState('')
  const [passwordConfirmar, setPasswordConfirmar] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState(false)
  const [cargando, setCargando] = useState(false)
  const [exito, setExito] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMensaje('')
    setError(false)

    if (passwordNueva !== passwordConfirmar) {
      setMensaje('Las contraseñas no coinciden')
      setError(true)
      return
    }

    if (passwordNueva.length < 6) {
      setMensaje('La contraseña debe tener al menos 6 caracteres')
      setError(true)
      return
    }

    setCargando(true)
    try {
      const res = await fetch(`${API_URL}/users/recuperar-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, passwordActual, passwordNueva })
      })
      const data = await res.json()
      if (res.ok) {
        setExito(true)
      } else {
        setMensaje(data.mensaje || 'Error al actualizar la contraseña')
        setError(true)
      }
    } catch (err) {
      setMensaje('Error de conexión con el servidor')
      setError(true)
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
            <span className="text-black font-bold text-sm">R</span>
          </div>
          <span className="text-white font-semibold text-lg">RivalPick</span>
        </div>

        <h1 className="text-3xl font-bold text-white mb-2">Recuperar contraseña</h1>
        <p className="text-zinc-400 mb-8">Introduce tu email y elige una nueva contraseña</p>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
          {exito ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <h2 className="text-white font-semibold text-xl mb-2">¡Contraseña actualizada!</h2>
              <p className="text-zinc-400 text-sm mb-6">Ya puedes iniciar sesión con tu nueva contraseña</p>
              <button
                onClick={() => router.push('/login')}
                className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-semibold transition"
              >
                Ir al login
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-2 uppercase tracking-widest">Email de tu cuenta</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  className="w-full px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500 transition"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-2 uppercase tracking-widest">Contraseña actual</label>
                <input
                  type="password"
                  value={passwordActual}
                  onChange={(e) => setPasswordActual(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500 transition"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-2 uppercase tracking-widest">Nueva contraseña</label>
                <input
                  type="password"
                  value={passwordNueva}
                  onChange={(e) => setPasswordNueva(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  className="w-full px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500 transition"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-2 uppercase tracking-widest">Confirmar nueva contraseña</label>
                <input
                  type="password"
                  value={passwordConfirmar}
                  onChange={(e) => setPasswordConfirmar(e.target.value)}
                  placeholder="Repite la nueva contraseña"
                  className="w-full px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500 transition"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={cargando}
                className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-semibold transition disabled:opacity-50"
              >
                {cargando ? 'Actualizando...' : 'Cambiar contraseña'}
              </button>
              {mensaje && (
                <div className={`p-3 rounded-xl ${error ? 'bg-red-500/10 border border-red-500/20' : 'bg-emerald-500/10 border border-emerald-500/20'}`}>
                  <p className={`text-sm text-center ${error ? 'text-red-400' : 'text-emerald-400'}`}>{mensaje}</p>
                </div>
              )}
              <p className="text-center text-sm text-zinc-500 pt-2">
                ¿Recuerdas tu contraseña?{' '}
                <a href="/login" className="text-emerald-400 hover:text-emerald-300 font-medium transition">Inicia sesión</a>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
