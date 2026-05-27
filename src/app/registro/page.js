'use client'

import { useState } from 'react'

export default function RegistroPage() {
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [mensaje, setMensaje] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMensaje('')

    try {
      const res = await fetch('http://localhost:3001/api/auth/registro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, email, username, password })
      })

      const data = await res.json()

      if (res.ok) {
        setMensaje('Usuario registrado correctamente')
        setNombre('')
        setEmail('')
        setUsername('')
        setPassword('')
      } else {
        setMensaje(data.mensaje || 'Error en el registro')
      }
    } catch (error) {
      setMensaje('Error de conexión con el servidor')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-4 relative">
      <div className="bg-zinc-900 p-8 rounded-xl shadow-md w-full max-w-md border border-zinc-800">
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="w-3 h-3 rounded-full bg-indigo-600 border-2 border-indigo-300"></div>
          <h1 className="text-xl font-medium text-zinc-900 dark:text-zinc-100">RivalPick</h1>
        </div>

        <h2 className="text-lg font-medium mb-1 text-center text-zinc-900 dark:text-zinc-100">Crear cuenta</h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6 text-center">
          Empieza a predecir con tus amigos
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            placeholder="Nombre completo"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full px-4 py-2 rounded-md bg-zinc-50 dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-indigo-500"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 rounded-md bg-zinc-50 dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-indigo-500"
            required
          />
          <input
            type="text"
            placeholder="Nombre de usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 rounded-md bg-zinc-50 dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-indigo-500"
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 rounded-md bg-zinc-50 dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-indigo-500"
            required
          />
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-md transition"
          >
            Registrarme
          </button>
        </form>

        {mensaje && (
          <p className="mt-4 text-center text-sm text-zinc-600 dark:text-zinc-300">{mensaje}</p>
        )}

        <p className="mt-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
          ¿Ya tienes cuenta?{' '}
          <a href="/login" className="text-indigo-600 hover:underline">
            Inicia sesión
          </a>
        </p>
      </div>
    </div>
  )
}