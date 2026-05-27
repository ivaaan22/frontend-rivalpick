'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import ProtectedRoute from '../components/ProtectedRoute'
import { apiRequest } from '../services/api'

export default function PrediccionesPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const rawGrupoId = searchParams.get('grupoId')
  const rawLiga = searchParams.get('liga')
  const rawJornada = searchParams.get('jornada')

  const initialGrupoId = rawGrupoId && rawGrupoId !== 'null' && rawGrupoId !== 'undefined' ? rawGrupoId : null
  const initialLiga = rawLiga && rawLiga !== 'null' && rawLiga !== 'undefined' ? rawLiga : null
  const initialJornada = rawJornada && rawJornada !== 'null' && rawJornada !== 'undefined' ? Number(rawJornada) : null

  const [grupoId, setGrupoId] = useState(initialGrupoId)
  const [liga, setLiga] = useState(initialLiga)
  const [jornada, setJornada] = useState(initialJornada)
  const [partidos, setPartidos] = useState([])
  const [misPredicciones, setMisPredicciones] = useState({})
  const [grupo, setGrupo] = useState(null)
  const [cargando, setCargando] = useState(false)
  const [guardando, setGuardando] = useState(null)
  const [mensaje, setMensaje] = useState('')

  useEffect(() => {
    if (grupoId && liga && jornada) return

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
        console.error(error)
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
        console.error(error)
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
    } catch (error) {
      console.error(error)
      setMensaje(error.message)
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
              <button onClick={() => router.back()} className="text-zinc-400 hover:text-white">←</button>
              <div>
                <p className="text-white font-semibold text-sm">{grupo?.nombre || 'Predicciones'}</p>
                <p className="text-zinc-500 text-xs">Jornada {jornada || '—'} · {liga || '—'}</p>
              </div>
            </div>
            <div className="text-xs text-zinc-400">{totalPredichos}/{totalPendientes} predichos</div>
          </div>
        </nav>

        <div className="max-w-2xl mx-auto px-4 py-6">
          {cargando ? (
            <div className="text-center py-20"><p className="text-zinc-500">Cargando partidos...</p></div>
          ) : (!grupoId || !liga || !jornada) ? (
            <div className="text-center py-20">
              <p className="text-zinc-500 mb-4">No hay suficientes parámetros para cargar predicciones. Ve a mis grupos y selecciona un grupo.</p>
              <button onClick={() => router.push('/grupos')} className="px-4 py-2 rounded-lg bg-emerald-500 text-black font-semibold">Ir a mis grupos</button>
            </div>
          ) : (
            <>
              {mensaje && (
                <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                  <p className="text-red-400 text-sm text-center">{mensaje}</p>
                </div>
              )}
              {partidos.length === 0 ? (
                <div className="text-center py-20"><p className="text-zinc-500">No hay partidos para esta jornada</p></div>
              ) : (
                <div className="space-y-3">
                  {partidos.map((partido) => {
                    const miPred = misPredicciones[partido.partidoId]
                    const bloqueado = partido.estado !== 'TIMED' && partido.estado !== 'SCHEDULED'
                    return (
                      <div key={partido.partidoId} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
                        <p className="text-xs text-zinc-500 mb-4">{formatearFecha(partido.fecha)}</p>
                        <div className="grid grid-cols-3 items-center gap-3 mb-5">
                          <div className="text-center">
                            <img src={partido.escudoLocal} alt={partido.equipoLocal} className="w-10 h-10 object-contain mx-auto" />
                            <p className="text-white text-xs mt-2">{partido.equipoLocal}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-zinc-400">{bloqueado ? `${partido.golesLocal} - ${partido.golesVisitante}` : 'vs'}</p>
                          </div>
                          <div className="text-center">
                            <img src={partido.escudoVisitante} alt={partido.equipoVisitante} className="w-10 h-10 object-contain mx-auto" />
                            <p className="text-white text-xs mt-2">{partido.equipoVisitante}</p>
                          </div>
                        </div>
                        {!bloqueado && (
                          <div className="grid grid-cols-3 gap-2">
                            {['1','X','2'].map(opcion => (
                              <button key={opcion} onClick={() => predecir(partido.partidoId, opcion)} disabled={guardando === partido.partidoId} className={`py-2.5 rounded-xl text-sm font-semibold transition ${miPred?.prediccion === opcion ? 'bg-emerald-500 text-black' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white'}`}>
                                {opcion}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )})}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}