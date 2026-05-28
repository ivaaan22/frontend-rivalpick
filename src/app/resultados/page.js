'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import ProtectedRoute from '../components/ProtectedRoute'
import Navbar from '../components/Navbar'
import Loading from '../components/Loading'
import Avatar from '../components/Avatar'
import { apiRequest } from '../services/api'

const MAX_JORNADAS = {
  LaLiga: 38, Premier: 38, SerieA: 38, Ligue1: 34, Bundesliga: 34,
  Champions: 8, Mundial: 3
}

function ResultadosContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const rawGrupoId = searchParams.get('grupoId')
  const jornadaParam = searchParams.get('jornada')
  const initialGrupoId = rawGrupoId && rawGrupoId !== 'null' ? rawGrupoId : null

  const [grupoId, setGrupoId] = useState(initialGrupoId)
  const [grupo, setGrupo] = useState(null)
  const [jornada, setJornada] = useState(Number(jornadaParam) || 1)
  const [datos, setDatos] = useState(null)
  const [rankingGeneral, setRankingGeneral] = useState([])
  const [cargando, setCargando] = useState(false)
  const [mensaje, setMensaje] = useState('')

  const maxJornadas = grupo ? (MAX_JORNADAS[grupo.liga] || 38) : 38

  const cargar = async (j) => {
    if (!grupoId) return
    setCargando(true)
    setMensaje('')
    try {
      const [resultados, ranking, grupoData] = await Promise.all([
        apiRequest(`/grupos/${grupoId}/resultados?jornada=${j}`),
        apiRequest(`/grupos/${grupoId}/ranking`),
        apiRequest(`/grupos/${grupoId}`)
      ])
      setDatos(resultados)
      setRankingGeneral(ranking)
      setGrupo(grupoData.grupo)
    } catch (error) {
      setMensaje('Error al cargar los resultados')
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    // Solo cargar grupo por defecto si no hay grupoId en la URL
    if (grupoId) return
    const cargarGrupoDefault = async () => {
      setCargando(true)
      try {
        const grupos = await apiRequest('/grupos/me')
        if (!grupos || grupos.length === 0) {
          setMensaje('No perteneces a ningún grupo.')
          setCargando(false)
          return
        }
        // Redirigir a la página del grupo para que elijan
        router.push('/grupos')
      } catch (error) {
        setMensaje('Error al obtener tus grupos.')
        setCargando(false)
      }
    }
    cargarGrupoDefault()
  }, [grupoId])

  useEffect(() => {
    if (!grupoId) return
    cargar(jornada)
  }, [grupoId, jornada])

  // Cuando se carga el grupo, ajustar la jornada inicial si supera el máximo
  useEffect(() => {
    if (!grupo) return
    const max = MAX_JORNADAS[grupo.liga] || 38
    if (jornada > max) setJornada(max)
  }, [grupo])

  const cambiarJornada = (delta) => {
    const nueva = jornada + delta
    if (nueva < 1 || nueva > maxJornadas) return
    setJornada(nueva)
  }

  const formatearFecha = (fecha) => new Date(fecha).toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' })
  const ganadorJornada = datos?.rankingJornada?.[0]

  if (!grupoId) {
    return (
      <ProtectedRoute>
        <div className="min-h-[calc(100vh-4rem)] bg-zinc-950 flex items-center justify-center">
          <div className="text-center">
            <p className="text-zinc-500 mb-4">{mensaje || 'Selecciona un grupo para ver resultados'}</p>
            <button onClick={() => router.push('/grupos')} className="px-4 py-2 rounded-lg bg-emerald-500 text-black font-semibold text-sm">Ir a mis grupos</button>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-[calc(100vh-4rem)] bg-zinc-950">
        <Navbar titulo={grupo?.nombre || 'Resultados'} volver />

        <div className="max-w-5xl mx-auto px-4 py-6">
          <div className="flex items-center justify-center gap-4 mb-6">
            <button onClick={() => cambiarJornada(-1)} disabled={jornada <= 1} className="w-9 h-9 rounded-xl border border-zinc-700 text-zinc-400 hover:text-white disabled:opacity-30 transition flex items-center justify-center">‹</button>
            <div className="text-center min-w-[140px]">
              <span className="text-white font-semibold">Jornada {jornada}</span>
              {grupo && <p className="text-zinc-500 text-xs mt-0.5">{grupo.liga} · máx. {maxJornadas}</p>}
            </div>
            <button onClick={() => cambiarJornada(1)} disabled={jornada >= maxJornadas} className="w-9 h-9 rounded-xl border border-zinc-700 text-zinc-400 hover:text-white disabled:opacity-30 transition flex items-center justify-center">›</button>
          </div>

          {cargando ? <Loading texto="Cargando resultados..." /> : mensaje ? (
            <div className="text-center py-20">
              <p className="text-zinc-500 mb-4">{mensaje}</p>
              <button onClick={() => router.push('/grupos')} className="px-4 py-2 rounded-lg bg-emerald-500 text-black font-semibold text-sm">Ir a mis grupos</button>
            </div>
          ) : datos ? (
            <>
              {ganadorJornada && ganadorJornada.puntos > 0 && (
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 mb-6 flex items-center gap-3">
                  <span className="text-2xl">🏆</span>
                  <div>
                    <p className="text-amber-300 font-semibold">Ganador jornada: {ganadorJornada.nombre}</p>
                    <p className="text-amber-500 text-sm">{ganadorJornada.puntos} pts · {ganadorJornada.aciertos} aciertos</p>
                  </div>
                </div>
              )}

              {datos.curiosidades && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                  <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-center">
                    <p className="text-xl font-bold text-white">{datos.curiosidades.porcentajeAcierto}%</p>
                    <p className="text-xs text-zinc-500 mt-1">Acierto grupo</p>
                  </div>
                  <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-center">
                    <p className="text-xl font-bold text-white">{datos.curiosidades.totalAciertos}</p>
                    <p className="text-xs text-zinc-500 mt-1">Total aciertos</p>
                  </div>
                  <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-center col-span-2 sm:col-span-1">
                    <p className="text-sm font-bold text-emerald-400 truncate">{datos.curiosidades.partidoMasAcertado || '—'}</p>
                    <p className="text-xs text-zinc-500 mt-1">Más acertado</p>
                  </div>
                  <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-center col-span-2 sm:col-span-1">
                    <p className="text-sm font-bold text-red-400 truncate">{datos.curiosidades.partidoMasFallado || '—'}</p>
                    <p className="text-xs text-zinc-500 mt-1">Más fallado</p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-3">
                  {datos.resultados?.length === 0 ? (
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center">
                      <p className="text-zinc-500">No hay partidos en esta jornada</p>
                    </div>
                  ) : datos.resultados?.map((partido) => (
                    <div key={partido.partidoId} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
                      <p className="text-xs text-zinc-500 mb-3">{formatearFecha(partido.fecha)}</p>
                      <div className="grid grid-cols-3 items-center gap-3 mb-4">
                        <div className="flex flex-col items-center gap-1">
                          <img src={partido.escudoLocal} alt={partido.equipoLocal} className="w-8 h-8 object-contain" />
                          <p className="text-white text-xs font-medium text-center">{partido.equipoLocal}</p>
                        </div>
                        <div className="text-center">
                          {partido.estado === 'FINISHED'
                            ? <p className="text-white text-lg font-bold">{partido.golesLocal} - {partido.golesVisitante}</p>
                            : <p className="text-zinc-500 text-sm">Pendiente</p>
                          }
                        </div>
                        <div className="flex flex-col items-center gap-1">
                          <img src={partido.escudoVisitante} alt={partido.equipoVisitante} className="w-8 h-8 object-contain" />
                          <p className="text-white text-xs font-medium text-center">{partido.equipoVisitante}</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {partido.picks?.map((pick) => (
                          <div key={pick.userId} className={`px-2 py-1 rounded-lg text-xs border ${pick.acerto ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : pick.prediccion ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'bg-zinc-800 text-zinc-500 border-zinc-700'}`}>
                            {pick.nombre.split(' ')[0]} · {pick.prediccion || '—'}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
                    <h3 className="text-white font-semibold mb-3">Ranking jornada</h3>
                    <div className="space-y-2">
                      {datos.rankingJornada?.map((u, i) => (
                        <div key={u.userId} className="flex items-center gap-2">
                          <span className="text-zinc-500 text-sm w-5">{i + 1}</span>
                          <Avatar usuario={u} size="xs" />
                          <p className="text-white text-sm flex-1 truncate">{u.nombre}</p>
                          <span className="text-emerald-400 font-semibold text-sm">{u.puntos}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
                    <h3 className="text-white font-semibold mb-3">Ranking general</h3>
                    <div className="space-y-2">
                      {rankingGeneral?.map((u, i) => (
                        <div key={u.userId} className="flex items-center gap-2">
                          <span className="text-zinc-500 text-sm w-5">{i + 1}</span>
                          <Avatar usuario={u} size="xs" />
                          <p className="text-white text-sm flex-1 truncate">{u.nombre}</p>
                          <span className="text-emerald-400 font-semibold text-sm">{u.puntos}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </ProtectedRoute>
  )
}

export default function ResultadosPage() {
  return (
    <Suspense fallback={<div className="min-h-[calc(100vh-4rem)] bg-zinc-950" />}>
      <ResultadosContent />
    </Suspense>
  )
}

