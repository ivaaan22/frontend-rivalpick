'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import ProtectedRoute from '../components/ProtectedRoute'
import Navbar from '../components/Navbar'
import Loading from '../components/Loading'
import { apiRequest } from '../services/api'

export default function PartidosPage() {
  const router = useRouter()
  const [liga, setLiga] = useState('LaLiga')
  const [jornada, setJornada] = useState(null)
  const [totalJornadas, setTotalJornadas] = useState(38)
  const [partidos, setPartidos] = useState([])
  const [cargando, setCargando] = useState(false)
  const [mensaje, setMensaje] = useState('')
  const [grupoFiltro, setGrupoFiltro] = useState(null)

  const ligas = [
    { id: 'LaLiga', nombre: 'LaLiga', logo: 'https://crests.football-data.org/PD.png', tipo: 'liga' },
    { id: 'Premier', nombre: 'Premier League', logo: 'https://crests.football-data.org/PL.png', tipo: 'liga' },
    { id: 'Bundesliga', nombre: 'Bundesliga', logo: 'https://crests.football-data.org/BL1.png', tipo: 'liga' },
    { id: 'SerieA', nombre: 'Serie A', logo: 'https://crests.football-data.org/SA.png', tipo: 'liga' },
    { id: 'Ligue1', nombre: 'Ligue 1', logo: 'https://crests.football-data.org/FL1.png', tipo: 'liga' },
    { id: 'Champions', nombre: 'Champions', logo: 'https://crests.football-data.org/CL.png', tipo: 'copa' },
    { id: 'Mundial', nombre: 'Mundial 2026', logo: 'https://flagcdn.com/w80/un.png', tipo: 'mundial' },
  ]

  const GRUPOS_MUNDIAL = ['A','B','C','D','E','F','G','H','I','J','K','L']

  const ligaActual = ligas.find(l => l.id === liga)
  const esMundial = ligaActual?.tipo === 'mundial'
  const esCopa = ligaActual?.tipo === 'copa'

  useEffect(() => {
    setJornada(null)
    setPartidos([])
    setGrupoFiltro(esMundial ? 'A' : null)

    if (!esMundial) {
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
    } else {
      setCargando(false)
    }
  }, [liga])

  useEffect(() => {
    if (esMundial) {
      const cargarMundial = async () => {
        setCargando(true)
        setMensaje('')
        setPartidos([])
        try {
          // Sin filtro de jornada para traer todos los partidos del Mundial
          const data = await apiRequest(`/partidos?liga=Mundial`)
          const filtrados = grupoFiltro ? data.filter(p => p.grupo === grupoFiltro) : data
          setPartidos(filtrados)
          if (filtrados.length === 0) setMensaje('No hay partidos para este grupo')
        } catch (error) {
          setMensaje(error.message)
        } finally {
          setCargando(false)
        }
      }
      cargarMundial()
      return
    }

    if (jornada === null) return
    const buscarPartidos = async () => {
      setCargando(true)
      setMensaje('')
      setPartidos([])
      try {
        const data = await apiRequest(`/partidos?liga=${liga}&jornada=${jornada}`)
        setPartidos(data)
        if (data.length === 0) setMensaje('No hay partidos para esta jornada')
      } catch (error) {
        setMensaje(error.message)
      } finally {
        setCargando(false)
      }
    }
    buscarPartidos()
  }, [liga, jornada, grupoFiltro])

  const cambiarJornada = (delta) => {
    setJornada((prev) => {
      const nueva = prev + delta
      if (nueva < 1) return 1
      if (nueva > totalJornadas) return totalJornadas
      return nueva
    })
  }

  const formatearHora = (fecha) => new Date(fecha).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
  const formatearDia = (fecha) => new Date(fecha).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })

  const resultado = (p) => {
    if (p.golesLocal === null || p.golesVisitante === null) return 'vs'
    return `${p.golesLocal} - ${p.golesVisitante}`
  }

  const estadoBadge = (estado) => {
    switch (estado) {
      case 'FINISHED': return { texto: 'Finalizado', clase: 'bg-zinc-800 text-zinc-400' }
      case 'IN_PLAY':
      case 'PAUSED': return { texto: 'En juego', clase: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' }
      case 'TIMED':
      case 'SCHEDULED': return { texto: 'Programado', clase: 'bg-sky-500/20 text-sky-400 border border-sky-500/30' }
      default: return { texto: estado, clase: 'bg-zinc-800 text-zinc-400' }
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

  const fasesLabel = (fase) => {
    const map = {
      'LEAGUE_STAGE': 'Fase de liga', 'PLAYOFFS': 'Playoffs',
      'LAST_16': 'Octavos', 'QUARTER_FINALS': 'Cuartos',
      'SEMI_FINALS': 'Semis', 'FINAL': 'Final', 'GROUP_STAGE': 'Fase de grupos',
    }
    return map[fase] || null
  }

  return (
    <ProtectedRoute>
      <div className="min-h-[calc(100vh-4rem)] bg-zinc-950">
        <Navbar titulo="Partidos" volver />
        <div className="max-w-3xl mx-auto px-4 py-6">
          <div className="grid grid-cols-3 sm:grid-cols-7 gap-2 mb-4">
            {ligas.map((l) => (
              <button key={l.id} onClick={() => setLiga(l.id)} className={`p-3 rounded-xl border text-center transition ${liga === l.id ? 'bg-emerald-500/20 border-emerald-500' : 'bg-zinc-900 border-zinc-800 hover:border-zinc-600'}`}>
                <div className="flex items-center justify-center mb-1">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center p-1">
                    <img src={l.logo} alt={l.nombre} className="w-full h-full object-contain" onError={(e) => e.target.style.display='none'} />
                  </div>
                </div>
                <p className={`text-xs font-medium leading-tight ${liga === l.id ? 'text-emerald-300' : 'text-zinc-300'}`}>{l.nombre}</p>
              </button>
            ))}
          </div>

          {esMundial ? (
            <div className="mb-4">
              <p className="text-xs text-zinc-500 uppercase tracking-wide mb-2 text-center">Grupo</p>
              <div className="grid grid-cols-6 sm:grid-cols-12 gap-1">
                {GRUPOS_MUNDIAL.map(g => (
                  <button key={g} onClick={() => setGrupoFiltro(g)} className={`py-2 rounded-lg text-sm font-bold transition ${grupoFiltro === g ? 'bg-emerald-500 text-black' : 'bg-zinc-800 text-zinc-400 hover:text-white'}`}>{g}</button>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 mb-4 flex items-center justify-center gap-6">
              <button onClick={() => cambiarJornada(-1)} disabled={jornada === 1 || jornada === null} className="w-10 h-10 rounded-full border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500 disabled:opacity-30 transition flex items-center justify-center text-lg">‹</button>
              <div className="text-center min-w-[120px]">
                <p className="text-xs text-zinc-500 uppercase tracking-wide">Jornada</p>
                <p className="text-2xl font-bold text-white">{jornada !== null ? jornada : '—'}</p>
              </div>
              <button onClick={() => cambiarJornada(1)} disabled={jornada === totalJornadas || jornada === null} className="w-10 h-10 rounded-full border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500 disabled:opacity-30 transition flex items-center justify-center text-lg">›</button>
            </div>
          )}

          {cargando ? <Loading texto="Cargando partidos..." /> : mensaje ? (
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 text-center"><p className="text-zinc-500">{mensaje}</p></div>
          ) : partidos.length > 0 ? (
            <div className="space-y-5">
              {esMundial && grupoFiltro && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-2">
                  <p className="text-emerald-400 text-sm font-medium">🌍 Grupo {grupoFiltro} — Mundial 2026</p>
                </div>
              )}
              {Object.keys(partidosAgrupados).map((dia) => (
                <div key={dia}>
                  <h2 className="text-sm font-medium text-zinc-500 mb-2 capitalize">{dia}</h2>
                  <div className="bg-zinc-900 border border-zinc-800 rounded-2xl divide-y divide-zinc-800">
                    {partidosAgrupados[dia].map((p) => {
                      const badge = estadoBadge(p.estado)
                      return (
                        <div key={p.partidoId} className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-zinc-500">{formatearHora(p.fecha)}</span>
                            <div className="flex items-center gap-2">
                              {p.fase && <span className="text-xs text-zinc-600">{fasesLabel(p.fase)}</span>}
                              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${badge.clase}`}>{badge.texto}</span>
                            </div>
                          </div>
                          <div className="grid grid-cols-3 items-center gap-2">
                            <div className="flex items-center gap-2 justify-end">
                              {p.equipoLocal === 'FC Barcelona' ? (
                                <button onClick={() => router.push('/equipos/fc-barcelona')} className="text-sm font-medium text-white text-right hover:text-emerald-400 transition">{p.equipoLocal}</button>
                              ) : (
                                <span className="text-sm font-medium text-white text-right">{p.equipoLocal}</span>
                              )}
                              <img src={p.escudoLocal} alt={p.equipoLocal} className="w-7 h-7 object-contain" />
                            </div>
                            <div className="text-center">
                              <span className={`text-base font-bold ${p.estado === 'FINISHED' ? 'text-white' : 'text-zinc-600'}`}>{resultado(p)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <img src={p.escudoVisitante} alt={p.equipoVisitante} className="w-7 h-7 object-contain" />
                              {p.equipoVisitante === 'FC Barcelona' ? (
                                <button onClick={() => router.push('/equipos/fc-barcelona')} className="text-sm font-medium text-white hover:text-emerald-400 transition">{p.equipoVisitante}</button>
                              ) : (
                                <span className="text-sm font-medium text-white">{p.equipoVisitante}</span>
                              )}
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

