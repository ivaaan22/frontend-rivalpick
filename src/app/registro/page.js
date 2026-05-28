'use client'

import { useState } from 'react'

export default function RegistroPage() {
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [cargando, setCargando] = useState(false)
  const [exito, setExito] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMensaje('')
    setCargando(true)
    try {
      const res = await fetch('https://backend-rivalpick.onrender.com/api/auth/registro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, email, username, password })
      })
      const data = await res.json()
      if (res.ok) setExito(true)
      else setMensaje(data.mensaje || 'Error en el registro')
    } catch (error) {
      setMensaje('Error de conexión con el servidor')
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-zinc-950 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
            <span className="text-black font-bold text-sm">R</span>
          </div>
          <span className="text-white font-semibold text-lg">RivalPick</span>
        </div>

        <h1 className="text-3xl font-bold text-white mb-2">Crea tu cuenta</h1>
        <p className="text-zinc-400 mb-8">Empieza a predecir con tus amigos</p>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
          {exito ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <h2 className="text-white font-semibold text-xl mb-2">¡Cuenta creada!</h2>
              <p className="text-zinc-400 text-sm mb-6">Ya puedes iniciar sesión</p>
              <a href="/login" className="block w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-semibold transition text-center">Ir al login</a>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-2 uppercase tracking-widest">Nombre completo</label>
                <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Javier García" className="w-full px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500 transition" required />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-2 uppercase tracking-widest">Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@email.com" className="w-full px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500 transition" required />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-2 uppercase tracking-widest">Nombre de usuario</label>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="javi_picks" className="w-full px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500 transition" required />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-2 uppercase tracking-widest">Contraseña</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500 transition" required />
              </div>
              <button type="submit" disabled={cargando} className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-semibold transition disabled:opacity-50">{cargando ? 'Creando cuenta...' : 'Crear cuenta'}</button>
              {mensaje && <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20"><p className="text-red-400 text-sm text-center">{mensaje}</p></div>}
              <p className="text-center text-sm text-zinc-500 pt-2">¿Ya tienes cuenta?{' '}<a href="/login" className="text-emerald-400 hover:text-emerald-300 font-medium transition">Inicia sesión</a></p>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

