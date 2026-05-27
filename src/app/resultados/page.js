'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import ProtectedRoute from '../components/ProtectedRoute'
import { apiRequest } from '../services/api'

export default function ResultadosPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const rawGrupoId = searchParams.get('grupoId')
  const jornadaParam = searchParams.get('jornada')

  const initialGrupoId = rawGrupoId && rawGrupoId !== 'null' && rawGrupoId !== 'undefined' ? rawGrupoId : null

  const [grupoId, setGrupoId] = useState(initialGrupoId)
  const [grupo, setGrupo] = useState(null)
  const [jornada, setJornada] = useState(Number(jornadaParam) || 30)
  const [datos, setDatos] = useState(null)
  const [rankingGeneral, setRankingGeneral] = useState([])
  const [cargando, setCargando] = useState(false)
  const [mensaje, setMensaje] = useState('')

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
      console.error(error)
      setMensaje('Error al cargar los resultados')
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    if (grupoId) return

    const cargarGrupoDefault = async () => {
      setCargando(true)
      setMensaje('')
      try {
        const grupos = await apiRequest('/grupos/me')
        if (!grupos || grupos.length === 0) {
          setMensaje('No perteneces a ningún grupo todavía.')
          setCargando(false)
          return
        }
        setGrupoId(grupos[0]._id)
        setGrupo(grupos[0])
      } catch (error) {
        console.error(error)
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

  const cambiarJornada = (delta) => {
    const nueva = jornada + delta
    if (nueva < 1 || nueva > 38) return
    setJornada(nueva)
  }

  const formatearFecha = (fecha) => new Date(fecha).toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' })

  const ganadorJornada = datos?.rankingJornada?.[0]

  if (!grupoId || !grupo) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-8">
          <div className="text-center">
            <p className="text-zinc-500 mb-4">{mensaje || 'No se ha seleccionado un grupo válido para ver los resultados.'}</p>
            <button onClick={() => router.push('/grupos')} className="px-4 py-2 rounded-lg bg-emerald-500 text-black font-semibold">Ir a mis grupos</button>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-zinc-950">
        <nav className="border-b border-zinc-800 bg-zinc-950 sticky top-0 z-10">
          <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => router.back()} className="text-zinc-400 hover:text-white transition">←</button>
              <span className="text-white font-semibold">{datos?.grupo?.nombre || 'Resultados'}</span>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => cambiarJornada(-1)} disabled={jornada <= 1} className="w-8 h-8 rounded-lg border border-zinc-700 text-zinc-400 hover:text-white disabled:opacity-30">‹</button>
              <span className="text-white text-sm font-medium">Jornada {jornada}</span>
              <button onClick={() => cambiarJornada(1)} disabled={jornada >= 38} className="w-8 h-8 rounded-lg border border-zinc-700 text-zinc-400 hover:text-white disabled:opacity-30">›</button>
            </div>
          </div>
        </nav>

        <div className="max-w-5xl mx-auto px-4 py-6">
          {cargando ? (
            <div className="text-center py-20"><p className="text-zinc-500">Cargando resultados...</p></div>
          ) : mensaje ? (
            <div className="text-center py-20"><p className="text-red-400">{mensaje}</p></div>
          ) : datos ? (
            <>
              {ganadorJornada && (
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 mb-6 flex items-center gap-3">
                  <span className="text-2xl">🏆</span>
                  <div>
                    <p className="text-amber-300 font-semibold">Ganador de la jornada: {ganadorJornada.nombre}</p>
                    <p className="text-amber-500 text-sm">{ganadorJornada.puntos} pts · {ganadorJornada.aciertos}/10 aciertos</p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-4 gap-3 mb-6">
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-center">
                  <p className="text-xl font-bold text-white">{datos.curiosidades.porcentajeAcierto}%</p>
                  <p className="text-xs text-zinc-500 mt-1">Acierto grupo</p>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-center">
                  <p className="text-xl font-bold text-white">{datos.curiosidades.mediaPuntos}</p>
                  <p className="text-xs text-zinc-500 mt-1">Puntos media</p>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-center">
                  <p className="text-xl font-bold text-white">{datos.curiosidades.maxPuntos}</p>
                  <p className="text-xs text-zinc-500 mt-1">Máx. jornada</p>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-center">
                  <p className="text-xl font-bold text-white">{datos.curiosidades.minPuntos}</p>
                  <p className="text-xs text-zinc-500 mt-1">Mín. jornada</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-3">
                  {datos.resultados?.map((partido) => (
                    <div key={partido.partidoId} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
                      <p className="text-xs text-zinc-500 mb-3">{formatearFecha(partido.fecha)}</p>

                      <div className="grid grid-cols-3 items-center gap-3 mb-4">
                        <div className="flex flex-col items-center gap-1">
                          <img src={partido.escudoLocal} alt={partido.equipoLocal} className="w-8 h-8 object-contain" />
                          <p className="text-white text-xs font-medium text-center">{partido.equipoLocal}</p>
                        </div>

                        <div className="text-center">
                          {partido.estado === 'FINISHED' ? (
                            <p className="text-white text-lg font-bold">{partido.golesLocal} - {partido.golesVisitante}</p>
                          ) : (
                            <p className="text-zinc-500">vs</p>
                          )}
                        </div>

                        <div className="flex flex-col items-center gap-1">
                          <img src={partido.escudoVisitante} alt={partido.equipoVisitante} className="w-8 h-8 object-contain" />
                          <p className="text-white text-xs font-medium text-center">{partido.equipoVisitante}</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {partido.picks?.map((pick) => (
                          <div key={pick.userId} className={`px-2 py-1 rounded-lg text-xs border ${pick.acerto ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'}`}>
                            {pick.nombre.split(' ')[0]} · {pick.prediccion}
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
                          <p className="text-white text-sm flex-1">{u.nombre}</p>
                          <span className="text-emerald-400 font-semibold">{u.puntos}</span>
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
                          <p className="text-white text-sm flex-1">{u.nombre}</p>
                          <span className="text-emerald-400 font-semibold">{u.puntos}</span>
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