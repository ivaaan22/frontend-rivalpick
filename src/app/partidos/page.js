'use client'

import { useState } from 'react'
import ProtectedRoute from '../components/ProtectedRoute'
import ThemeToggle from '../components/ThemeToggle'
import { apiRequest } from '../services/api'

export default function PartidosPage() {
  const [liga, setLiga] = useState('LaLiga')
  const [jornada, setJornada] = useState(30)
  const [partidos, setPartidos] = useState([])
  const [cargando, setCargando] = useState(false)
  const [mensaje, setMensaje] = useState('')

  const ligas = [
    { id: 'LaLiga', nombre: 'LaLiga' },
    { id: 'Premier', nombre: 'Premier' },
    { id: 'Bundesliga', nombre: 'Bundesliga' },
    { id: 'SerieA', nombre: 'Serie A' },
    { id: 'Ligue1', nombre: 'Ligue 1' },
  ]

  const buscarPartidos = async () => {
    setCargando(true)
    setMensaje('')
    setPartidos([])
    try {
      const data = await apiRequest(`/partidos?liga=${liga}&jornada=${jornada}`)
      setPartidos(data)
      if (data.length === 0) {
        setMensaje('No hay partidos para esta jornada')
      }
    } catch (error) {
      setMensaje(error.message)
    } finally {
      setCargando(false)
    }
  }

  const formatearHora = (fecha) => {
    const d = new Date(fecha)
    return d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
  }

  const formatearDia = (fecha) => {
    const d = new Date(fecha)
    return d.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })
  }

  const resultado = (p) => {
    if (p.golesLocal === null || p.golesVisitante === null) return 'vs'
    return `${p.golesLocal} - ${p.golesVisitante}`
  }

  const estadoBadge = (estado) => {
    switch (estado) {
      case 'FINISHED':
        return { texto: 'Finalizado', clase: 'bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300' }
      case 'IN_PLAY':
      case 'PAUSED':
        return { texto: 'En juego', clase: 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300' }
      case 'TIMED':
      case 'SCHEDULED':
        return { texto: 'Programado', clase: 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300' }
      default:
        return { texto: estado, clase: 'bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300' }
    }
  }

  const agruparPorDia = (lista) => {
    const grupos = {}
    lista.forEach(p => {
      const dia = formatearDia(p.fecha)
      if (!grupos[dia]) grupos[dia] = []
      grupos[dia].push(p)
    })
    return grupos
  }

  const partidosAgrupados = agruparPorDia(partidos)

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-zinc-100 dark:bg-zinc-900 px-4 py-8 relative">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>

        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-medium mb-1 text-zinc-900 dark:text-zinc-100">Partidos</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
            Consulta los partidos reales de cada jornada
          </p>

          <div className="bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 p-4 mb-4 flex flex-wrap items-end gap-3">
            <div>
              <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1 uppercase tracking-wide">Liga</label>
              <select
                value={liga}
                onChange={(e) => setLiga(e.target.value)}
                className="px-3 py-2 rounded-md bg-zinc-50 dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-indigo-500"
              >
                {ligas.map(l => (
                  <option key={l.id} value={l.id}>{l.nombre}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1 uppercase tracking-wide">Jornada</label>
              <input
                type="number"
                value={jornada}
                onChange={(e) => setJornada(e.target.value)}
                min={1}
                max={38}
                className="w-24 px-3 py-2 rounded-md bg-zinc-50 dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <button
              onClick={buscarPartidos}
              className="px-5 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm transition"
            >
              Buscar partidos
            </button>
          </div>

          {cargando ? (
            <p className="text-zinc-500 dark:text-zinc-400">Cargando partidos...</p>
          ) : mensaje ? (
            <p className="text-zinc-500 dark:text-zinc-400">{mensaje}</p>
          ) : partidos.length > 0 ? (
            <div className="space-y-5">
              {Object.keys(partidosAgrupados).map((dia) => (
                <div key={dia}>
                  <h2 className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-2 capitalize">{dia}</h2>
                  <div className="bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 divide-y divide-zinc-200 dark:divide-zinc-700">
                    {partidosAgrupados[dia].map((p) => {
                      const badge = estadoBadge(p.estado)
                      return (
                        <div key={p.partidoId} className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-zinc-400 dark:text-zinc-500">{formatearHora(p.fecha)}</span>
                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${badge.clase}`}>
                              {badge.texto}
                            </span>
                          </div>
                          <div className="grid grid-cols-3 items-center gap-2">
                            <div className="flex items-center gap-2 justify-end">
                              <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100 text-right">{p.equipoLocal}</span>
                              <img src={p.escudoLocal} alt={p.equipoLocal} className="w-7 h-7 object-contain" />
                            </div>
                            <div className="text-center">
                              <span className={`text-base font-medium ${p.estado === 'FINISHED' ? 'text-zinc-900 dark:text-zinc-100' : 'text-zinc-400 dark:text-zinc-500'}`}>
                                {resultado(p)}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <img src={p.escudoVisitante} alt={p.equipoVisitante} className="w-7 h-7 object-contain" />
                              <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{p.equipoVisitante}</span>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-zinc-500 dark:text-zinc-400">Pulsa "Buscar partidos" para ver los resultados</p>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}