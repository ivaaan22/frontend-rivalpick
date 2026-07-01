'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mostrarPassword, setMostrarPassword] = useState(false)
  const [mensaje, setMensaje] = useState('')
  const [errores, setErrores] = useState({})
  const [cargando, setCargando] = useState(false)

  const validar = () => {
    const nuevosErrores = {}
    if (!email) nuevosErrores.email = 'El email es obligatorio'
    else if (!/\S+@\S+\.\S+/.test(email)) nuevosErrores.email = 'Introduce un email válido'
    if (!password) nuevosErrores.password = 'La contraseña es obligatoria'
    setErrores(nuevosErrores)
    return Object.keys(nuevosErrores).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMensaje('')
    if (!validar()) return
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
        setMensaje(data.mensaje || 'Credenciales incorrectas')
      }
    } catch (error) {
      setMensaje('Error de conexión con el servidor')
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-zinc-950 flex">
      {/* Panel izquierdo */}
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

      {/* Panel derecho */}
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
            {mensaje && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20" role="alert">
                <p className="text-red-400 text-sm text-center">{mensaje}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-xs font-medium text-zinc-400 mb-2 uppercase tracking-widest">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setErrores(prev => ({ ...prev, email: '' })) }}
                  placeholder="tu@email.com"
                  aria-invalid={!!errores.email}
                  aria-describedby={errores.email ? 'email-error' : undefined}
                  className={`w-full px-4 py-3 rounded-xl bg-zinc-800 border text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition ${errores.email ? 'border-red-500' : 'border-zinc-700'}`}
                />
                {errores.email && <p id="email-error" className="mt-1.5 text-xs text-red-400">{errores.email}</p>}
              </div>

              {/* Contraseña */}
              <div>
                <label htmlFor="password" className="block text-xs font-medium text-zinc-400 mb-2 uppercase tracking-widest">
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={mostrarPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setErrores(prev => ({ ...prev, password: '' })) }}
                    placeholder="••••••••"
                    aria-invalid={!!errores.password}
                    aria-describedby={errores.password ? 'password-error' : undefined}
                    className={`w-full px-4 py-3 pr-12 rounded-xl bg-zinc-800 border text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition ${errores.password ? 'border-red-500' : 'border-zinc-700'}`}
                  />
                  <button
                    type="button"
                    onClick={() => setMostrarPassword(!mostrarPassword)}
                    aria-label={mostrarPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition p-1"
                  >
                    {mostrarPassword ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                        <line x1="1" y1="1" x2="23" y2="23"/>
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    )}
                  </button>
                </div>
                {errores.password && <p id="password-error" className="mt-1.5 text-xs text-red-400">{errores.password}</p>}
              </div>

              <button
                type="submit"
                disabled={cargando}
                className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-semibold transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {cargando ? (
                  <>
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                    </svg>
                    Entrando...
                  </>
                ) : 'Entrar'}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-zinc-500">
              ¿No tienes cuenta?{' '}
              <a href="/registro" className="text-emerald-400 hover:text-emerald-300 font-medium transition">Crea una gratis</a>
            </p>
            <p className="mt-2 text-center text-sm text-zinc-600">
              ¿Olvidaste tu contraseña?{' '}
              <a href="/recuperar-password" className="text-zinc-400 hover:text-zinc-300 transition">Recúperala aquí</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
