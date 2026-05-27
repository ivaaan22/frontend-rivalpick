'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import ProtectedRoute from '../components/ProtectedRoute'
import { apiRequest } from '../services/api'

export default function PartidosPage() {
  const router = useRouter()
  const [liga, setLiga] = useState('LaLiga')
  const [jornada, setJornada] = useState(null)
  const [totalJornadas, setTotalJornadas] = useState(38)
  const [partidos, setPartidos] = useState([])
  const [cargando, setCargando] = useState(false)
  const [mensaje, setMensaje] = useState('')

  const ligas = [
    { id: 'LaLiga', nombre: 'LaLiga', pais: 'España', bandera: 'https://static.vecteezy.com/system/resources/previews/010/994/309/non_2x/la-liga-logo-symbol-white-and-black-design-spain-football-european-countries-football-teams-illustration-free-vector.jpg' },
    { id: 'Premier', nombre: 'Premier League', pais: 'Inglaterra', bandera: 'https://static.vecteezy.com/system/resources/previews/015/863/623/non_2x/england-premier-league-logo-on-transparent-background-free-vector.jpg' },
    { id: 'Bundesliga', nombre: 'Bundesliga', pais: 'Alemania', bandera: 'https://static.vecteezy.com/system/resources/previews/010/994/312/non_2x/bundesliga-logo-symbol-white-design-germany-football-european-countries-football-teams-illustration-with-black-background-free-vector.jpg' },
    { id: 'SerieA', nombre: 'Serie A', pais: 'Italia', bandera: 'https://upload.wikimedia.org/wikipedia/commons/c/c2/Serie_A.png' },
    { id: 'Ligue1', nombre: 'Ligue 1', pais: 'Francia', bandera: 'https://upload.wikimedia.org/wikipedia/commons/4/49/Ligue1_Uber_Eats_logo.png' },
  ]
  useEffect(() => {
    const cargarJornadaActual = async () => {
      setCargando(true)
      setMensaje('')
      try {
        const info = await apiRequest(`/partidos/jornada-actual?liga=${liga}`)
        setJornada(info.jornadaActual)
        setTotalJornadas(info.totalJornadas)
      } catch (error) {
        setMensaje('Error al cargar la jornada actual')
        setCargando(false)
      }
    }
    cargarJornadaActual()
  }, [liga])

  useEffect(() => {
    if (jornada === null) return
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
    buscarPartidos()
  }, [liga, jornada])

  const cambiarJornada = (delta) => {
    setJornada((prev) => {
      const nueva = prev + delta
      if (nueva < 1) return 1
      if (nueva > totalJornadas) return totalJornadas
      return nueva
    })
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
      <div className="min-h-screen bg-zinc-950 px-4 py-8 relative">
          <div className="max-w-3xl mx-auto">
          <button
            onClick={() => router.push('/')}
            className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 mb-4"
          >
            ← Menú principal
          </button>
          <h1 className="text-2xl font-medium mb-1 text-zinc-900 dark:text-zinc-100">Partidos</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
            Consulta los partidos reales de cada jornada
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-4">
            {ligas.map((l) => (
            <button
              key={l.id}
              onClick={() => setLiga(l.id)}
              className={`p-3 rounded-xl border text-center transition ${
                liga === l.id
                ? 'bg-indigo-100 dark:bg-indigo-900 border-indigo-500'
                : 'bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700'
              }`}
            >
          <div className="flex items-center justify-center mb-1">
          <div className="w-10 h-10 bg-white dark:bg-zinc-900 rounded-md flex items-center justify-center overflow-hidden">
          <img
            src={l.bandera}
            alt={l.pais}
            className="w-full h-full object-contain"
            />
            </div>
            </div>
            <p
              className={`text-xs font-medium ${
               liga === l.id
                ? 'text-indigo-700 dark:text-indigo-300'
                : 'text-zinc-900 dark:text-zinc-100'
              }`}
            >
              {l.nombre}
            </p>
            </button>
            ))}
          </div>

          <div className="bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 p-4 mb-4 flex items-center justify-center gap-6">
            <button
              onClick={() => cambiarJornada(-1)}
              disabled={jornada === 1 || jornada === null}
              className="w-10 h-10 rounded-full border border-zinc-300 dark:border-zinc-600 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed transition flex items-center justify-center text-lg"
            >
              ‹
            </button>
            <div className="text-center min-w-[120px]">
              <p className="text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">Jornada</p>
              <p className="text-2xl font-medium text-zinc-900 dark:text-zinc-100">
                {jornada !== null ? jornada : '—'}
              </p>
            </div>
            <button
              onClick={() => cambiarJornada(1)}
              disabled={jornada === totalJornadas || jornada === null}
              className="w-10 h-10 rounded-full border border-zinc-300 dark:border-zinc-600 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed transition flex items-center justify-center text-lg"
            >
              ›
            </button>
          </div>

          {cargando ? (
            <div className="bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 p-8 text-center">
              <p className="text-zinc-500 dark:text-zinc-400">Cargando partidos...</p>
            </div>
          ) : mensaje ? (
            <div className="bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 p-8 text-center">
              <p className="text-zinc-500 dark:text-zinc-400">{mensaje}</p>
            </div>
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
          ) : null}
        </div>
      </div>
    </ProtectedRoute>
  )
}