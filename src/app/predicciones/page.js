'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import ProtectedRoute from '../components/ProtectedRoute'
import Navbar from '../components/Navbar'
import Loading from '../components/Loading'
import { apiRequest } from '../services/api'

function PrediccionesContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const rawGrupoId = searchParams.get('grupoId')
  const rawLiga = searchParams.get('liga')
  const rawJornada = searchParams.get('jornada')

  const initialGrupoId = rawGrupoId && rawGrupoId !== 'null' ? rawGrupoId : null
  const initialLiga = rawLiga && rawLiga !== 'null' ? rawLiga : null
  const initialJornada = rawJornada && rawJornada !== 'null' ? Number(rawJornada) : null

  const [grupoId, setGrupoId] = useState(initialGrupoId)
  const [liga, setLiga] = useState(initialLiga)
  const [jornada, setJornada] = useState(initialJornada)
  const [partidos, setPartidos] = useState([])
  const [misPredicciones, setMisPredicciones] = useState({})
  const [grupo, setGrupo] = useState(null)
  const [cargando, setCargando] = useState(false)
  const [guardando, setGuardando] = useState(null)
  const [guardado, setGuardado] = useState(null)
  const [mensaje, setMensaje] = useState('')

  useEffect(() => {
    // Si ya tenemos grupoId y liga, solo necesitamos la jornada
    if (grupoId && liga && jornada) return
    // Si tenemos grupoId y liga pero no jornada, calcular jornada sin cambiar el grupo
    if (grupoId && liga && !jornada) {
      const calcularJornada = async () => {
        setCargando(true)
        try {
          const jornadaInfo = await apiRequest(`/partidos/jornada-actual?liga=${liga}`)
          setJornada(jornadaInfo.jornadaActual || 1)
          const grupoData = await apiRequest(`/grupos/${grupoId}`)
          setGrupo(grupoData.grupo)
        } catch (error) {
          setJornada(1)
        } finally {
          setCargando(false)
        }
      }
      calcularJornada()
      return
    }

    const prepararValoresPorDefecto = async () => {
      setCargando(true)
      setMensaje('')
      try {
        const grupos = await apiRequest('/grupos/me')
        if (!grupos || grupos.length === 0) {
          setMensaje('No perteneces a ningún grupo todavía.')
          setCargando(false)
          return
        }
        const grupoSeleccionado = grupos[0]
        const ligaSeleccionada = liga || grupoSeleccionado.liga
        let jornadaActual = jornada
        if (!jornadaActual) {
          const jornadaInfo = await apiRequest(`/partidos/jornada-actual?liga=${ligaSeleccionada}`)
          jornadaActual = jornadaInfo.jornadaActual || 1
        }
        setGrupoId(grupoSeleccionado._id)
        setLiga(ligaSeleccionada)
        setJornada(jornadaActual)
        setGrupo(grupoSeleccionado)
      } catch (error) {
        setMensaje('Error al obtener datos iniciales')
        setCargando(false)
      }
    }

    prepararValoresPorDefecto()
  }, [grupoId, liga, jornada])

  useEffect(() => {
    if (!grupoId || !liga || !jornada) return

    const cargar = async () => {
      setCargando(true)
      setMensaje('')
      try {
        const [partidosData, prediccionesData, grupoData] = await Promise.all([
          apiRequest(`/partidos?liga=${liga}&jornada=${jornada}`),
          apiRequest(`/predicciones?grupoId=${grupoId}&jornada=${jornada}`),
          apiRequest(`/grupos/${grupoId}`)
        ])
        setPartidos(partidosData)
        setGrupo(grupoData.grupo)
        const predsMap = {}
        prediccionesData.forEach(p => { predsMap[p.partidoId] = p })
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
      setMisPredicciones(prev => ({ ...prev, [partidoId]: { ...prev[partidoId], prediccion } }))
      setGuardado(partidoId)
      setTimeout(() => setGuardado(null), 2000)
    } catch (error) {
      setMensaje(error.message)
    } finally {
      setGuardando(null)
    }
  }

  const formatearFecha = (fecha) => new Date(fecha).toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })

  const totalPredichos = Object.keys(misPredicciones).filter(id => misPredicciones[id]?.prediccion).length
  const totalPendientes = partidos.filter(p => p.estado === 'TIMED' || p.estado === 'SCHEDULED').length
  const todoPredicho = totalPendientes > 0 && totalPredichos === totalPendientes

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-zinc-950">
        <Navbar titulo={grupo ? `${grupo.nombre} · J${jornada}` : 'Predicciones'} volver />

        <div className="max-w-2xl mx-auto px-4 py-6">
          {totalPendientes > 0 && (
            <div className={`mb-4 flex items-center justify-between rounded-xl px-4 py-2.5 border ${todoPredicho ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-zinc-900 border-zinc-800'}`}>
              <p className="text-zinc-400 text-sm">{liga} · Jornada {jornada}</p>
              <span className={`text-sm font-semibold ${todoPredicho ? 'text-emerald-400' : 'text-zinc-400'}`}>
                {todoPredicho ? '✓ Completado' : `${totalPredichos}/${totalPendientes} predichos`}
              </span>
            </div>
          )}

          {cargando ? <Loading texto="Cargando partidos..." /> : (!grupoId || !liga || !jornada) ? (
            <div className="text-center py-20">
              <p className="text-zinc-500 mb-4">No hay suficientes parámetros. Ve a tus grupos y selecciona uno.</p>
              <button onClick={() => router.push('/grupos')} className="px-4 py-2 rounded-lg bg-emerald-500 text-black font-semibold text-sm">Ir a mis grupos</button>
            </div>
          ) : (
            <>
              {mensaje && <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20"><p className="text-red-400 text-sm text-center">{mensaje}</p></div>}

              {partidos.length === 0 ? (
                <div className="text-center py-20"><p className="text-zinc-500">No hay partidos para esta jornada</p></div>
              ) : (
                <div className="space-y-3">
                  {partidos.map((partido) => {
                    const miPred = misPredicciones[partido.partidoId]
                    const bloqueado = partido.estado !== 'TIMED' && partido.estado !== 'SCHEDULED'
                    return (
                      <div key={partido.partidoId} className={`bg-zinc-900 border rounded-2xl p-5 transition ${miPred?.prediccion ? 'border-emerald-500/30' : 'border-zinc-800'}`}>
                        <p className="text-xs text-zinc-500 mb-4">{formatearFecha(partido.fecha)}</p>
                        <div className="grid grid-cols-3 items-center gap-3 mb-5">
                          <div className="text-center">
                            <img src={partido.escudoLocal} alt={partido.equipoLocal} className="w-10 h-10 object-contain mx-auto mb-1" />
                            <p className="text-white text-xs">{partido.equipoLocal}</p>
                          </div>
                          <div className="text-center">
                            {bloqueado
                              ? <p className="text-white font-bold">{partido.golesLocal} - {partido.golesVisitante}</p>
                              : <p className="text-zinc-500 text-sm">vs</p>
                            }
                          </div>
                          <div className="text-center">
                            <img src={partido.escudoVisitante} alt={partido.equipoVisitante} className="w-10 h-10 object-contain mx-auto mb-1" />
                            <p className="text-white text-xs">{partido.equipoVisitante}</p>
                          </div>
                        </div>

                        {bloqueado ? (
                          <div className="text-center">
                            <span className="text-xs px-3 py-1 rounded-full bg-zinc-800 text-zinc-500">Partido cerrado</span>
                            {miPred?.prediccion && <span className="ml-2 text-xs px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">Tu pick: {miPred.prediccion}</span>}
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <div className="grid grid-cols-3 gap-2">
                              {['1', 'X', '2'].map(opcion => (
                                <button
                                  key={opcion}
                                  onClick={() => predecir(partido.partidoId, opcion)}
                                  disabled={guardando === partido.partidoId}
                                  className={`py-2.5 rounded-xl text-sm font-semibold transition ${miPred?.prediccion === opcion ? 'bg-emerald-500 text-black' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white'}`}
                                >
                                  {guardando === partido.partidoId ? '...' : opcion}
                                </button>
                              ))}
                            </div>
                            {guardado === partido.partidoId && (
                              <p className="text-center text-xs text-emerald-400">✓ Predicción guardada automáticamente</p>
                            )}
                          </div>
                        )}
                      </div>
                    )
                  })}

                  {/* Resumen final */}
                  <div className={`rounded-2xl p-4 border ${todoPredicho ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-zinc-900 border-zinc-800'}`}>
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className={`font-semibold text-sm ${todoPredicho ? 'text-emerald-400' : 'text-zinc-300'}`}>
                          {todoPredicho ? '🎉 ¡Todas las predicciones guardadas!' : `${totalPendientes - totalPredichos} partidos sin predecir`}
                        </p>
                        <p className="text-xs text-zinc-500 mt-0.5">
                          {totalPredichos} de {totalPendientes} completados · Se guardan automáticamente
                        </p>
                      </div>
                      <button
                        onClick={() => router.push(`/grupos/${grupoId}`)}
                        className={`px-4 py-2 rounded-xl text-sm font-semibold transition flex-shrink-0 ${todoPredicho ? 'bg-emerald-500 hover:bg-emerald-400 text-black' : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'}`}
                      >
                        {todoPredicho ? 'Listo →' : 'Volver al grupo'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}

export default function PrediccionesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-zinc-950" />}>
      <PrediccionesContent />
    </Suspense>
  )
}
