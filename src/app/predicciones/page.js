'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import ProtectedRoute from '../components/ProtectedRoute'
import { apiRequest } from '../services/api'

export default function PrediccionesPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const grupoId = searchParams.get('grupoId')
  const liga = searchParams.get('liga')
  const jornada = searchParams.get('jornada')

  const [partidos, setPartidos] = useState([])
  const [misPredicciones, setMisPredicciones] = useState({})
  const [grupo, setGrupo] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [guardando, setGuardando] = useState(null)
  const [mensaje, setMensaje] = useState('')

  useEffect(() => {
    if (!grupoId || !liga || !jornada) return

    const cargar = async () => {
      try {
        const [partidosData, prediccionesData, grupoData] = await Promise.all([
          apiRequest(`/partidos?liga=${liga}&jornada=${jornada}`),
          apiRequest(`/predicciones?grupoId=${grupoId}&jornada=${jornada}`),
          apiRequest(`/grupos/${grupoId}`)
        ])
        setPartidos(partidosData)
        setGrupo(grupoData.grupo)
        const predsMap = {}
        prediccionesData.forEach(p => {
          predsMap[p.partidoId] = p
        })
        setMisPredicciones(predsMap)
      } catch (error) {
        setMensaje('Error al cargar los datos')
      } finally {
        setCargando(false)
      }
    }
    cargar()
  }, [grupoId, liga, jornada])

  const predecir = async (partidoId, prediccion) => {
    setGuardando(partidoId)
    try {
      await apiRequest('/predicciones', {
        method: 'POST',
        body: JSON.stringify({ grupoId, partidoId, jornada: Number(jornada), liga, prediccion })
      })
      setMisPredicciones(prev => ({
        ...prev,
        [partidoId]: { ...prev[partidoId], prediccion }
      }))
    } catch (error) {
      setMensaje(error.message)
      setTimeout(() => setMensaje(''), 3000)
    } finally {
      setGuardando(null)
    }
  }

  const formatearFecha = (fecha) => {
    const d = new Date(fecha)
    return d.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
  }

  const totalPredichos = Object.keys(misPredicciones).filter(id => misPredicciones[id]?.prediccion).length
  const totalPendientes = partidos.filter(p => p.estado === 'TIMED' || p.estado === 'SCHEDULED').length

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-zinc-950">
        <nav className="border-b border-zinc-800 bg-zinc-950 sticky top-0 z-10">
          <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => router.back()} className="text-zinc-400 hover:text-white transition">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
              </button>
              <div>
                <p className="text-white font-semibold text-sm">{grupo?.nombre || 'Predicciones'}</p>
                <p className="text-zinc-500 text-xs">Jornada {jornada} · {liga}</p>
              </div>
            </div>
            <div className="text-xs text-zinc-400">
              {totalPredichos}/{totalPendientes} predichos
            </div>
          </div>
        </nav>

        <div className="max-w-2xl mx-auto px-4 py-6">
          {mensaje && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
              <p className="text-red-400 text-sm text-center">{mensaje}</p>
            </div>
          )}

          {cargando ? (
            <div className="text-center py-20"><p className="text-zinc-500">Cargando partidos...</p></div>
          ) : partidos.length === 0 ? (
            <div className="text-center py-20"><p className="text-zinc-500">No hay partidos para esta jornada</p></div>
          ) : (
            <div className="space-y-3">
              {partidos.map((partido) => {
                const miPred = misPredicciones[partido.partidoId]
                const bloqueado = partido.estado !== 'TIMED' && partido.estado !== 'SCHEDULED'

                return (
                  <div key={partido.partidoId} className={`bg-zinc-900 border rounded-2xl p-5 ${bloqueado ? 'border-zinc-800 opacity-60' : 'border-zinc-800'}`}>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs text-zinc-500">{formatearFecha(partido.fecha)}</span>
                      {bloqueado ? (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-500">Cerrado</span>
                      ) : miPred?.prediccion ? (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">✓ Guardado</span>
                      ) : (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">Pendiente</span>
                      )}
                    </div>

                    <div className="grid grid-cols-3 items-center gap-3 mb-5">
                      <div className="flex flex-col items-center gap-2">
                        <img src={partido.escudoLocal} alt={partido.equipoLocal} className="w-10 h-10 object-contain" />
                        <p className="text-white text-xs font-medium text-center leading-tight">{partido.equipoLocal}</p>
                      </div>
                      <div className="text-center">
                        {bloqueado ? (
                          <p className="text-white text-xl font-bold">{partido.golesLocal ?? '?'} - {partido.golesVisitante ?? '?'}</p>
                        ) : (
                          <p className="text-zinc-500 text-sm">vs</p>
                        )}
                      </div>
                      <div className="flex flex-col items-center gap-2">
                        <img src={partido.escudoVisitante} alt={partido.equipoVisitante} className="w-10 h-10 object-contain" />
                        <p className="text-white text-xs font-medium text-center leading-tight">{partido.equipoVisitante}</p>
                      </div>
                    </div>

                    {!bloqueado && (
                      <div className="grid grid-cols-3 gap-2">
                        {['1', 'X', '2'].map((opcion) => (
                          <button
                            key={opcion}
                            onClick={() => predecir(partido.partidoId, opcion)}
                            disabled={guardando === partido.partidoId}
                            className={`py-2.5 rounded-xl text-sm font-semibold transition ${
                              miPred?.prediccion === opcion
                                ? opcion === '1' ? 'bg-emerald-500 text-black' : opcion === 'X' ? 'bg-zinc-200 text-black' : 'bg-sky-500 text-white'
                                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white'
                            }`}
                          >
                            {opcion === '1' ? 'Local' : opcion === 'X' ? 'Empate' : 'Visitante'}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}