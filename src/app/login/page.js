'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [cargando, setCargando] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMensaje('')
    setCargando(true)
    try {
      const res = await fetch('https://backend-rivalpick.onrender.com/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const data = await res.json()
      if (res.ok) {
        localStorage.setItem('token', data.token)
        localStorage.setItem('usuario', JSON.stringify(data.usuario))
        router.push('/')
      } else {
        setMensaje(data.mensaje || 'Error en el login')
      }
    } catch (error) {
      setMensaje('Error de conexión con el servidor')
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex">
      <div className="hidden lg:flex lg:w-1/2 bg-emerald-500 flex-col justify-between p-12">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-black/20 flex items-center justify-center">
            <span className="text-white font-bold text-sm">R</span>
          </div>
          <span className="text-black font-semibold text-lg tracking-tight">RivalPick</span>
        </div>
        <div>
          <h2 className="text-4xl font-bold text-black mb-4 leading-tight">Predice. Compite.<br />Gana con amigos.</h2>
          <p className="text-black/70 text-lg">La plataforma de predicciones de fútbol más competitiva entre amigos.</p>
        </div>
        <div className="flex gap-6">
          <div><p className="text-3xl font-bold text-black">5</p><p className="text-black/60 text-sm">Ligas</p></div>
          <div><p className="text-3xl font-bold text-black">1X2</p><p className="text-black/60 text-sm">o exacto</p></div>
          <div><p className="text-3xl font-bold text-black">∞</p><p className="text-black/60 text-sm">Diversión</p></div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center px-8 py-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-10">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
              <span className="text-black font-bold text-sm">R</span>
            </div>
            <span className="text-white font-semibold text-lg">RivalPick</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Bienvenido de vuelta</h1>
          <p className="text-zinc-400 mb-8">Inicia sesión para seguir compitiendo</p>
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-2 uppercase tracking-widest">Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@email.com" className="w-full px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition" required />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-2 uppercase tracking-widest">Contraseña</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition" required />
              </div>
              <button type="submit" disabled={cargando} className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-semibold transition disabled:opacity-50">{cargando ? 'Entrando...' : 'Entrar'}</button>
            </form>
            {mensaje && <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20"><p className="text-red-400 text-sm text-center">{mensaje}</p></div>}
            <p className="mt-6 text-center text-sm text-zinc-500">¿No tienes cuenta?{' '}<a href="/registro" className="text-emerald-400 hover:text-emerald-300 font-medium transition">Crea una gratis</a></p>
          </div>
        </div>
      </div>
    </div>
  )
}
