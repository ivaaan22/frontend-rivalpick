'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import ProtectedRoute from '../components/ProtectedRoute'
<<<<<<< HEAD
import Navbar from '../components/Navbar'
import Loading from '../components/Loading'
=======
>>>>>>> origin/dev
import { apiRequest } from '../services/api'

export default function HistorialPage() {
  const router = useRouter()
  const [stats, setStats] = useState(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    const cargar = async () => {
      try {
        const data = await apiRequest('/users/me/stats')
        setStats(data)
      } catch (error) {
        console.error(error)
      } finally {
        setCargando(false)
      }
    }
    cargar()
  }, [])

  const maxPuntos = stats ? Math.max(...stats.historialJornadas.map(j => j.puntos)) : 1

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-zinc-950">
<<<<<<< HEAD
        <Navbar titulo="Historial" volver />
        <div className="max-w-4xl mx-auto px-4 py-8">
          {cargando ? <Loading texto="Cargando estadísticas..." /> : !stats ? (
=======
        <nav className="border-b border-zinc-800 bg-zinc-950 sticky top-0 z-10">
          <div className="max-w-4xl mx-auto px-4 h-14 flex items-center gap-3">
            <button onClick={() => router.push('/')} className="text-zinc-400 hover:text-white transition">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
            </button>
            <span className="text-white font-semibold">Historial</span>
          </div>
        </nav>

        <div className="max-w-4xl mx-auto px-4 py-8">
          {cargando ? (
            <div className="text-center py-20"><p className="text-zinc-500">Cargando estadísticas...</p></div>
          ) : !stats ? (
>>>>>>> origin/dev
            <div className="text-center py-20"><p className="text-zinc-500">No hay datos todavía</p></div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
<<<<<<< HEAD
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4"><p className="text-2xl font-bold text-white">{stats.totalPuntos}</p><p className="text-xs text-zinc-500 mt-1">Puntos totales</p></div>
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4"><p className="text-2xl font-bold text-emerald-400">{stats.porcentajeAcierto}%</p><p className="text-xs text-zinc-500 mt-1">Acierto global</p></div>
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4"><p className="text-2xl font-bold text-white">{stats.jornadasJugadas}</p><p className="text-xs text-zinc-500 mt-1">Jornadas jugadas</p></div>
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4"><p className="text-2xl font-bold text-white">{stats.totalAciertos}</p><p className="text-xs text-zinc-500 mt-1">Total aciertos</p></div>
=======
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                  <p className="text-2xl font-bold text-white">{stats.totalPuntos}</p>
                  <p className="text-xs text-zinc-500 mt-1">Puntos totales</p>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                  <p className="text-2xl font-bold text-emerald-400">{stats.porcentajeAcierto}%</p>
                  <p className="text-xs text-zinc-500 mt-1">Acierto global</p>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                  <p className="text-2xl font-bold text-white">{stats.jornadasJugadas}</p>
                  <p className="text-xs text-zinc-500 mt-1">Jornadas jugadas</p>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                  <p className="text-2xl font-bold text-white">{stats.totalAciertos}</p>
                  <p className="text-xs text-zinc-500 mt-1">Total aciertos</p>
                </div>
>>>>>>> origin/dev
              </div>

              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-6">
                <h2 className="text-white font-semibold mb-5">Puntos por jornada</h2>
                <div className="relative" style={{ height: '140px' }}>
                  <div className="absolute inset-0 flex items-end gap-0.5 px-1">
                    {stats.historialJornadas.map((j) => {
                      const alturaPixels = Math.max(4, Math.round((j.puntos / maxPuntos) * 120))
                      const esMaximo = j.puntos === maxPuntos
                      const esBueno = j.puntos >= 24
                      return (
                        <div key={j.jornada} className="flex flex-col justify-end flex-1 h-full group relative">
                          <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-zinc-700 text-white text-xs px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-10">
                            J{j.jornada}: {j.puntos}pts ({j.aciertos}/{j.total})
                          </div>
<<<<<<< HEAD
                          <div className={`w-full rounded-sm transition-all ${esMaximo ? 'bg-emerald-400' : esBueno ? 'bg-emerald-600 group-hover:bg-emerald-500' : 'bg-zinc-600 group-hover:bg-zinc-500'}`} style={{ height: `${alturaPixels}px` }}></div>
=======
                          <div
                            className={`w-full rounded-sm transition-all ${
                              esMaximo ? 'bg-emerald-400' :
                              esBueno ? 'bg-emerald-600 group-hover:bg-emerald-500' :
                              'bg-zinc-600 group-hover:bg-zinc-500'
                            }`}
                            style={{ height: `${alturaPixels}px` }}
                          ></div>
>>>>>>> origin/dev
                        </div>
                      )
                    })}
                  </div>
                  <div className="absolute left-0 right-0 bottom-0 border-t border-zinc-700"></div>
                </div>
                <div className="flex justify-between mt-2 px-1">
                  <span className="text-xs text-zinc-600">J1</span>
                  <span className="text-xs text-zinc-600">J19</span>
                  <span className="text-xs text-zinc-600">J38</span>
                </div>
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-emerald-400"></div><span className="text-xs text-zinc-500">Mejor jornada</span></div>
<<<<<<< HEAD
                  <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-emerald-600"></div><span className="text-xs text-zinc-500">Buena (≥24pts)</span></div>
=======
                  <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-emerald-600"></div><span className="text-xs text-zinc-500">Buena jornada (≥24pts)</span></div>
>>>>>>> origin/dev
                  <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-zinc-600"></div><span className="text-xs text-zinc-500">Resto</span></div>
                </div>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                <h2 className="text-white font-semibold mb-4">Historial de jornadas</h2>
                <div className="divide-y divide-zinc-800">
                  {[...stats.historialJornadas].reverse().map((j) => {
                    const pct = Math.round((j.aciertos / j.total) * 100)
                    return (
                      <div key={j.jornada} className="flex items-center gap-4 py-3">
                        <span className="text-zinc-500 text-sm w-16 flex-shrink-0">Jornada {j.jornada}</span>
                        <div className="flex-1 bg-zinc-800 rounded-full h-1.5">
<<<<<<< HEAD
                          <div className={`h-1.5 rounded-full ${pct >= 70 ? 'bg-emerald-500' : pct >= 40 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${pct}%` }}></div>
=======
                          <div
                            className={`h-1.5 rounded-full ${pct >= 70 ? 'bg-emerald-500' : pct >= 40 ? 'bg-amber-500' : 'bg-red-500'}`}
                            style={{ width: `${pct}%` }}
                          ></div>
>>>>>>> origin/dev
                        </div>
                        <span className="text-white text-sm font-medium w-14 text-right">{j.puntos} pts</span>
                        <span className="text-zinc-500 text-xs w-12 text-right">{j.aciertos}/{j.total}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
<<<<<<< HEAD
}
=======
}
>>>>>>> origin/dev
