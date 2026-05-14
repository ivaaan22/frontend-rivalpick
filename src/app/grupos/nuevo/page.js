'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import ProtectedRoute from '../../components/ProtectedRoute'
import ThemeToggle from '../../components/ThemeToggle'
import { apiRequest } from '../../services/api'

export default function NuevoGrupoPage() {
  const router = useRouter()
  const [nombre, setNombre] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [liga, setLiga] = useState('LaLiga')
  const [modo, setModo] = useState('1X2')
  const [apuesta, setApuesta] = useState('')
  const [visibilidad, setVisibilidad] = useState('privado')
  const [mensaje, setMensaje] = useState('')

  const ligas = [
    { id: 'LaLiga', nombre: 'LaLiga', pais: 'España' },
    { id: 'Premier', nombre: 'Premier', pais: 'Inglaterra' },
    { id: 'Bundesliga', nombre: 'Bundesliga', pais: 'Alemania' },
    { id: 'SerieA', nombre: 'Serie A', pais: 'Italia' },
    { id: 'Ligue1', nombre: 'Ligue 1', pais: 'Francia' },
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMensaje('')

    try {
      const data = await apiRequest('/grupos', {
        method: 'POST',
        body: JSON.stringify({ nombre, descripcion, liga, modo, apuesta, visibilidad })
      })
      router.push('/grupos')
    } catch (error) {
      setMensaje(error.message)
    }
  }

  const iniciales = nombre.trim().split(' ').slice(0, 2).map(w => w[0]?.toUpperCase() || '').join('') || '?'

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-zinc-100 dark:bg-zinc-900 px-4 py-8 relative">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>

        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => router.push('/grupos')}
            className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 mb-2"
          >
            ← Mis grupos
          </button>

          <h1 className="text-2xl font-medium mb-1 text-zinc-900 dark:text-zinc-100">Crear nuevo grupo</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
            Configura tu grupo y comparte el código con tus amigos
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 p-5">
              <h3 className="text-sm font-medium mb-3 text-zinc-900 dark:text-zinc-100">Información básica</h3>

              <div className="mb-3">
                <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1 uppercase tracking-wide">
                  Nombre del grupo
                </label>
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Ej: Peña del Barrio, Los Cracks..."
                  className="w-full px-4 py-2 rounded-md bg-zinc-50 dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div className="mb-3">
                <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1 uppercase tracking-wide">
                  Descripción (opcional)
                </label>
                <textarea
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  placeholder="Una descripción breve del grupo..."
                  rows={2}
                  className="w-full px-4 py-2 rounded-md bg-zinc-50 dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              <div className="bg-zinc-100 dark:bg-zinc-700 rounded-md p-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-md bg-indigo-600 flex items-center justify-center text-white text-sm font-medium">
                  {iniciales}
                </div>
                <div>
                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{nombre || 'Nombre del grupo'}</p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">Tú · Admin · 1 miembro</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 p-5">
              <h3 className="text-sm font-medium mb-3 text-zinc-900 dark:text-zinc-100">Liga a seguir</h3>
              <div className="grid grid-cols-3 gap-2">
                {ligas.map((l) => (
                  <button
                    type="button"
                    key={l.id}
                    onClick={() => setLiga(l.id)}
                    className={`p-3 rounded-md border text-left transition ${
                      liga === l.id
                        ? 'bg-indigo-100 dark:bg-indigo-900 border-indigo-500'
                        : 'bg-zinc-50 dark:bg-zinc-700 border-zinc-200 dark:border-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-600'
                    }`}
                  >
                    <p className={`text-sm font-medium ${liga === l.id ? 'text-indigo-700 dark:text-indigo-300' : 'text-zinc-900 dark:text-zinc-100'}`}>
                      {l.nombre}
                    </p>
                    <p className={`text-xs ${liga === l.id ? 'text-indigo-600 dark:text-indigo-400' : 'text-zinc-500 dark:text-zinc-400'}`}>
                      {l.pais}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 p-5">
              <h3 className="text-sm font-medium mb-3 text-zinc-900 dark:text-zinc-100">Modo de juego</h3>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setModo('1X2')}
                  className={`p-3 rounded-md border text-left transition ${
                    modo === '1X2'
                      ? 'bg-indigo-100 dark:bg-indigo-900 border-indigo-500'
                      : 'bg-zinc-50 dark:bg-zinc-700 border-zinc-200 dark:border-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-600'
                  }`}
                >
                  <p className={`text-sm font-medium ${modo === '1X2' ? 'text-indigo-700 dark:text-indigo-300' : 'text-zinc-900 dark:text-zinc-100'}`}>
                    Clásico (1X2)
                  </p>
                  <p className={`text-xs mt-1 ${modo === '1X2' ? 'text-indigo-600 dark:text-indigo-400' : 'text-zinc-500 dark:text-zinc-400'}`}>
                    Predices ganador o empate
                  </p>
                </button>
                <button
                  type="button"
                  onClick={() => setModo('exacto')}
                  className={`p-3 rounded-md border text-left transition ${
                    modo === 'exacto'
                      ? 'bg-indigo-100 dark:bg-indigo-900 border-indigo-500'
                      : 'bg-zinc-50 dark:bg-zinc-700 border-zinc-200 dark:border-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-600'
                  }`}
                >
                  <p className={`text-sm font-medium ${modo === 'exacto' ? 'text-indigo-700 dark:text-indigo-300' : 'text-zinc-900 dark:text-zinc-100'}`}>
                    Marcador exacto
                  </p>
                  <p className={`text-xs mt-1 ${modo === 'exacto' ? 'text-indigo-600 dark:text-indigo-400' : 'text-zinc-500 dark:text-zinc-400'}`}>
                    Predices el resultado exacto
                  </p>
                </button>
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 p-5">
              <h3 className="text-sm font-medium mb-3 text-zinc-900 dark:text-zinc-100">Apuesta del grupo</h3>
              <input
                type="text"
                value={apuesta}
                onChange={(e) => setApuesta(e.target.value)}
                placeholder='Ej: "El último paga la ronda"'
                className="w-full px-4 py-2 rounded-md bg-zinc-50 dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-indigo-500"
              />
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2">
                Lo que se juega el grupo cada jornada o temporada
              </p>
            </div>

            <div className="bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 p-5">
              <h3 className="text-sm font-medium mb-3 text-zinc-900 dark:text-zinc-100">Visibilidad</h3>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setVisibilidad('privado')}
                  className={`p-3 rounded-md border text-left transition ${
                    visibilidad === 'privado'
                      ? 'bg-indigo-100 dark:bg-indigo-900 border-indigo-500'
                      : 'bg-zinc-50 dark:bg-zinc-700 border-zinc-200 dark:border-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-600'
                  }`}
                >
                  <p className={`text-sm font-medium ${visibilidad === 'privado' ? 'text-indigo-700 dark:text-indigo-300' : 'text-zinc-900 dark:text-zinc-100'}`}>
                    Privado
                  </p>
                  <p className={`text-xs mt-1 ${visibilidad === 'privado' ? 'text-indigo-600 dark:text-indigo-400' : 'text-zinc-500 dark:text-zinc-400'}`}>
                    Solo se une quien tenga el código
                  </p>
                </button>
                <button
                  type="button"
                  onClick={() => setVisibilidad('publico')}
                  className={`p-3 rounded-md border text-left transition ${
                    visibilidad === 'publico'
                      ? 'bg-indigo-100 dark:bg-indigo-900 border-indigo-500'
                      : 'bg-zinc-50 dark:bg-zinc-700 border-zinc-200 dark:border-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-600'
                  }`}
                >
                  <p className={`text-sm font-medium ${visibilidad === 'publico' ? 'text-indigo-700 dark:text-indigo-300' : 'text-zinc-900 dark:text-zinc-100'}`}>
                    Público
                  </p>
                  <p className={`text-xs mt-1 ${visibilidad === 'publico' ? 'text-indigo-600 dark:text-indigo-400' : 'text-zinc-500 dark:text-zinc-400'}`}>
                    Cualquier usuario puede unirse
                  </p>
                </button>
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => router.push('/grupos')}
                className="px-5 py-2 rounded-md border border-zinc-300 dark:border-zinc-600 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-6 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition"
              >
                Crear grupo
              </button>
            </div>

            {mensaje && (
              <p className="text-center text-sm text-red-500">{mensaje}</p>
            )}
          </form>
        </div>
      </div>
    </ProtectedRoute>
  )
}