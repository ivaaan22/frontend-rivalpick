'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import ProtectedRoute from '../components/ProtectedRoute'
import Navbar from '../components/Navbar'
import Loading from '../components/Loading'
import { apiRequest } from '../services/api'

export default function HistorialPage() {
  const router = useRouter()
  const [stats, setStats] = useState(null)
  const [grupos, setGrupos] = useState([])
  const [grupoSeleccionado, setGrupoSeleccionado] = useState(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    const cargar = async () => {
      try {
        const [statsData, gruposData] = await Promise.all([
          apiRequest('/users/me/stats'),
          apiRequest('/grupos/me')
        ])
        setStats(statsData)
        setGrupos(gruposData)
      } catch (error) {
        console.error(error)
      } finally {
        setCargando(false)
      }
    }
    cargar()
  }, [])

  const statsFiltradas = stats ? {
    ...stats,
    historialJornadas: grupoSeleccionado
      ? stats.historialJornadas.filter(j => String(j.grupoId) === String(grupoSeleccionado))
      : stats.historialJornadas,
    totalPuntos: grupoSeleccionado
      ? stats.historialJornadas.filter(j => String(j.grupoId) === String(grupoSeleccionado)).reduce((acc, j) => acc + j.puntos, 0)
      : stats.totalPuntos,
    totalAciertos: grupoSeleccionado
      ? stats.historialJornadas.filter(j => String(j.grupoId) === String(grupoSeleccionado)).reduce((acc, j) => acc + j.aciertos, 0)
      : stats.totalAciertos,
    jornadasJugadas: grupoSeleccionado
      ? stats.historialJornadas.filter(j => String(j.grupoId) === String(grupoSeleccionado)).length
      : stats.jornadasJugadas,
  } : null

  const totalPredicciones = statsFiltradas?.historialJornadas?.reduce((acc, j) => acc + j.total, 0) || 1
  const porcentajeAcierto = statsFiltradas ? Math.round((statsFiltradas.totalAciertos / totalPredicciones) * 100) : 0
  const maxPuntos = statsFiltradas ? Math.max(...statsFiltradas.historialJornadas.map(j => j.puntos), 1) : 1

  return (
    <ProtectedRoute>
      <div className="min-h-[calc(100vh-4rem)] bg-zinc-950">
        <Navbar titulo="Historial" volver />
        <div className="max-w-4xl mx-auto px-4 py-8">

          {/* Selector de grupo */}
          {grupos.length > 1 && (
            <div className="flex gap-2 mb-6 flex-wrap">
              <button
                onClick={() => setGrupoSeleccionado(null)}
                className={`px-4 py-1.5 rounded-lg text-sm transition ${!grupoSeleccionado ? 'bg-emerald-500 text-black font-semibold' : 'bg-zinc-800 text-zinc-400 hover:text-white'}`}
              >
                Todos
              </button>
              {grupos.map(g => (
                <button
                  key={g._id}
                  onClick={() => setGrupoSeleccionado(g._id)}
                  className={`px-4 py-1.5 rounded-lg text-sm transition ${grupoSeleccionado === g._id ? 'bg-emerald-500 text-black font-semibold' : 'bg-zinc-800 text-zinc-400 hover:text-white'}`}
                >
                  {g.nombre}
                </button>
              ))}
            </div>
          )}

          {cargando ? <Loading texto="Cargando estadísticas..." /> : !statsFiltradas ? (
            <div className="text-center py-20"><p className="text-zinc-500">No hay datos todavía</p></div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4"><p className="text-2xl font-bold text-white">{statsFiltradas.totalPuntos}</p><p className="text-xs text-zinc-500 mt-1">Puntos totales</p></div>
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4"><p className="text-2xl font-bold text-emerald-400">{porcentajeAcierto}%</p><p className="text-xs text-zinc-500 mt-1">Acierto global</p></div>
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4"><p className="text-2xl font-bold text-white">{statsFiltradas.jornadasJugadas}</p><p className="text-xs text-zinc-500 mt-1">Jornadas jugadas</p></div>
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4"><p className="text-2xl font-bold text-white">{statsFiltradas.totalAciertos}</p><p className="text-xs text-zinc-500 mt-1">Total aciertos</p></div>
              </div>

              {statsFiltradas.historialJornadas.length > 0 ? (
                <>
                  <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-6">
                    <h2 className="text-white font-semibold mb-5">Puntos por jornada</h2>
                    <div className="relative" style={{ height: '140px' }}>
                      <div className="absolute inset-0 flex items-end gap-0.5 px-1">
                        {statsFiltradas.historialJornadas.map((j) => {
                          const alturaPixels = Math.max(4, Math.round((j.puntos / maxPuntos) * 120))
                          const esMaximo = j.puntos === maxPuntos
                          const esBueno = j.puntos >= 24
                          return (
                            <div key={`${j.grupoId}-${j.jornada}`} className="flex flex-col justify-end flex-1 h-full group relative">
                              <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-zinc-700 text-white text-xs px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-10">
                                J{j.jornada}: {j.puntos}pts ({j.aciertos}/{j.total})
                              </div>
                              <div className={`w-full rounded-sm transition-all ${esMaximo ? 'bg-emerald-400' : esBueno ? 'bg-emerald-600 group-hover:bg-emerald-500' : 'bg-zinc-600 group-hover:bg-zinc-500'}`} style={{ height: `${alturaPixels}px` }}></div>
                            </div>
                          )
                        })}
                      </div>
                      <div className="absolute left-0 right-0 bottom-0 border-t border-zinc-700"></div>
                    </div>
                    <div className="flex items-center gap-4 mt-3">
                      <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-emerald-400"></div><span className="text-xs text-zinc-500">Mejor jornada</span></div>
                      <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-emerald-600"></div><span className="text-xs text-zinc-500">Buena (≥24pts)</span></div>
                      <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-zinc-600"></div><span className="text-xs text-zinc-500">Resto</span></div>
                    </div>
                  </div>

                  <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                    <h2 className="text-white font-semibold mb-4">Historial de jornadas</h2>
                    <div className="divide-y divide-zinc-800">
                      {[...statsFiltradas.historialJornadas].reverse().map((j) => {
                        const pct = j.total > 0 ? Math.round((j.aciertos / j.total) * 100) : 0
                        return (
                          <div key={`${j.grupoId}-${j.jornada}`} className="flex items-center gap-4 py-3">
                            <span className="text-zinc-500 text-sm w-16 flex-shrink-0">Jornada {j.jornada}</span>
                            <div className="flex-1 bg-zinc-800 rounded-full h-1.5">
                              <div className={`h-1.5 rounded-full ${pct >= 70 ? 'bg-emerald-500' : pct >= 40 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${pct}%` }}></div>
                            </div>
                            <span className="text-white text-sm font-medium w-14 text-right">{j.puntos} pts</span>
                            <span className="text-zinc-500 text-xs w-12 text-right">{j.aciertos}/{j.total}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </>
              ) : (
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-10 text-center">
                  <p className="text-zinc-500">No hay jornadas jugadas en este grupo todavía</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}

