'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import ProtectedRoute from '../../components/ProtectedRoute'
import Navbar from '../../components/Navbar'
import Loading from '../../components/Loading'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

const POSICION_ORDEN = { Portero: 0, Defensa: 1, Centrocampista: 2, Delantero: 3 }
const POSICION_COLOR = {
  Portero: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  Defensa: 'bg-sky-500/20 text-sky-400 border-sky-500/30',
  Centrocampista: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  Delantero: 'bg-red-500/20 text-red-400 border-red-500/30',
}
const POSICION_ABREV = { Portero: 'POR', Defensa: 'DEF', Centrocampista: 'CC', Delantero: 'DEL' }

function FotoJugador({ foto, nombre }) {
  const [error, setError] = useState(false)
  const iniciales = nombre.split(' ').map(w => w[0]).slice(0, 2).join('')
  return (
    <div className="w-full aspect-[3/4] rounded-xl overflow-hidden bg-zinc-800 flex items-center justify-center">
      {foto && !error ? (
        <img
          src={foto}
          alt={nombre}
          className="w-full h-full object-cover object-top"
          onError={() => setError(true)}
        />
      ) : (
        <span className="text-2xl font-bold text-zinc-500">{iniciales}</span>
      )}
    </div>
  )
}

export default function EquipoPage() {
  const params = useParams()
  const [equipo, setEquipo] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [filtro, setFiltro] = useState('Todos')
  const [orden, setOrden] = useState('posicion')

  useEffect(() => {
    const cargar = async () => {
      try {
        const res = await fetch(`${API_URL}/equipos/${params.slug}`)
        if (!res.ok) throw new Error('No encontrado')
        const data = await res.json()
        setEquipo(data)
      } catch (err) {
        console.error(err)
      } finally {
        setCargando(false)
      }
    }
    cargar()
  }, [params.slug])

  if (cargando) return (
    <ProtectedRoute>
      <div className="min-h-[calc(100vh-4rem)] bg-zinc-950">
        <Navbar titulo="Equipo" volver />
        <Loading texto="Cargando plantilla..." />
      </div>
    </ProtectedRoute>
  )

  if (!equipo) return (
    <ProtectedRoute>
      <div className="min-h-[calc(100vh-4rem)] bg-zinc-950">
        <Navbar titulo="Equipo" volver />
        <div className="flex items-center justify-center py-20">
          <p className="text-zinc-500">Equipo no encontrado</p>
        </div>
      </div>
    </ProtectedRoute>
  )

  const jugadoresFiltrados = equipo.jugadores
    .filter(j => filtro === 'Todos' || j.posicion === filtro)
    .sort((a, b) => {
      if (orden === 'posicion') return POSICION_ORDEN[a.posicion] - POSICION_ORDEN[b.posicion] || (a.dorsal || 99) - (b.dorsal || 99)
      if (orden === 'goles') return b.goles - a.goles
      if (orden === 'asistencias') return b.asistencias - a.asistencias
      if (orden === 'dorsal') return (a.dorsal || 99) - (b.dorsal || 99)
      return 0
    })

  const totalGoles = equipo.jugadores.reduce((acc, j) => acc + j.goles, 0)
  const totalAsistencias = equipo.jugadores.reduce((acc, j) => acc + j.asistencias, 0)
  const totalAmarillas = equipo.jugadores.reduce((acc, j) => acc + j.amarillas, 0)
  const totalRojas = equipo.jugadores.reduce((acc, j) => acc + j.rojas, 0)
  const maxGoleador = [...equipo.jugadores].sort((a, b) => b.goles - a.goles)[0]
  const maxAsistente = [...equipo.jugadores].sort((a, b) => b.asistencias - a.asistencias)[0]
  const portero = equipo.jugadores.filter(j => j.posicion === 'Portero').sort((a, b) => b.porteriasACero - a.porteriasACero)[0]

  return (
    <ProtectedRoute>
      <div className="min-h-[calc(100vh-4rem)] bg-zinc-950">
        <Navbar titulo={equipo.nombre} volver />

        <div className="max-w-6xl mx-auto px-4 py-8">

          {/* Header */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-6">
            <div className="flex items-center gap-5 mb-6">
              <img src={equipo.escudo} alt={equipo.nombre} className="w-20 h-20 object-contain" onError={(e) => { e.target.style.display = 'none' }} />
              <div>
                <h1 className="text-2xl font-bold text-white">{equipo.nombre}</h1>
                <p className="text-zinc-400 text-sm mt-1">{equipo.liga} · Temporada {equipo.temporada}</p>
                <p className="text-zinc-500 text-sm">🏟️ {equipo.estadio}</p>
                <p className="text-zinc-500 text-sm">👨‍💼 {equipo.entrenador}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
              <div className="bg-zinc-800 rounded-xl p-3 text-center"><p className="text-2xl font-bold text-emerald-400">{totalGoles}</p><p className="text-xs text-zinc-500 mt-1">Goles totales</p></div>
              <div className="bg-zinc-800 rounded-xl p-3 text-center"><p className="text-2xl font-bold text-sky-400">{totalAsistencias}</p><p className="text-xs text-zinc-500 mt-1">Asistencias</p></div>
              <div className="bg-zinc-800 rounded-xl p-3 text-center"><p className="text-2xl font-bold text-amber-400">{totalAmarillas}</p><p className="text-xs text-zinc-500 mt-1">Amarillas</p></div>
              <div className="bg-zinc-800 rounded-xl p-3 text-center"><p className="text-2xl font-bold text-red-400">{totalRojas}</p><p className="text-xs text-zinc-500 mt-1">Rojas</p></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 flex items-center gap-3">
                <span className="text-2xl">⚽</span>
                <div><p className="text-emerald-400 font-semibold text-sm">{maxGoleador?.nombre}</p><p className="text-zinc-500 text-xs">Máx. goleador · {maxGoleador?.goles} goles</p></div>
              </div>
              <div className="bg-sky-500/10 border border-sky-500/20 rounded-xl p-3 flex items-center gap-3">
                <span className="text-2xl">🎯</span>
                <div><p className="text-sky-400 font-semibold text-sm">{maxAsistente?.nombre}</p><p className="text-zinc-500 text-xs">Más asistencias · {maxAsistente?.asistencias} asist.</p></div>
              </div>
              <div className="bg-zinc-800/60 border border-zinc-700 rounded-xl p-3 flex items-center gap-3">
                <span className="text-2xl">🧤</span>
                <div><p className="text-white font-semibold text-sm">{portero?.nombre}</p><p className="text-zinc-500 text-xs">Porterías a 0 · {portero?.porteriasACero}</p></div>
              </div>
            </div>
          </div>

          {/* Filtros */}
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <div className="flex gap-2 flex-wrap">
              {['Todos', 'Portero', 'Defensa', 'Centrocampista', 'Delantero'].map(f => (
                <button key={f} onClick={() => setFiltro(f)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${filtro === f ? 'bg-emerald-500 text-black' : 'bg-zinc-800 text-zinc-400 hover:text-white'}`}>
                  {f}
                </button>
              ))}
            </div>
            <select value={orden} onChange={(e) => setOrden(e.target.value)}
              className="text-xs bg-zinc-800 border border-zinc-700 text-zinc-300 rounded-lg px-3 py-1.5 focus:outline-none focus:border-emerald-500">
              <option value="posicion">Por posición</option>
              <option value="dorsal">Por dorsal</option>
              <option value="goles">Por goles</option>
              <option value="asistencias">Por asistencias</option>
            </select>
          </div>

          {/* Grid de tarjetas */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {jugadoresFiltrados.map((j) => (
              <div key={j.nombre} className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-zinc-600 transition group">
                {/* Foto */}
                <div className="relative">
                  <FotoJugador foto={j.foto} nombre={j.nombre} />
                  {/* Dorsal */}
                  <div className="absolute top-2 left-2 w-7 h-7 rounded-lg bg-black/60 backdrop-blur-sm flex items-center justify-center">
                    <span className="text-white text-xs font-bold">{j.dorsal || '—'}</span>
                  </div>
                  {/* Posición */}
                  <div className="absolute top-2 right-2">
                    <span className={`text-xs px-1.5 py-0.5 rounded-md border backdrop-blur-sm ${POSICION_COLOR[j.posicion]}`}>{POSICION_ABREV[j.posicion]}</span>
                  </div>
                </div>

                {/* Info */}
                <div className="p-3">
                  <p className="text-white text-sm font-semibold truncate">{j.nombre}</p>
                  <p className="text-zinc-500 text-xs mb-3">{j.nacionalidad}</p>

                  <div className="grid grid-cols-3 gap-1 text-center">
                    <div>
                      <p className={`text-sm font-bold ${j.goles > 0 ? 'text-emerald-400' : 'text-zinc-600'}`}>{j.goles}</p>
                      <p className="text-zinc-600 text-xs">⚽</p>
                    </div>
                    <div>
                      <p className={`text-sm font-bold ${j.asistencias > 0 ? 'text-sky-400' : 'text-zinc-600'}`}>{j.asistencias}</p>
                      <p className="text-zinc-600 text-xs">🎯</p>
                    </div>
                    <div>
                      {j.posicion === 'Portero' ? (
                        <>
                          <p className={`text-sm font-bold ${j.porteriasACero > 0 ? 'text-white' : 'text-zinc-600'}`}>{j.porteriasACero}</p>
                          <p className="text-zinc-600 text-xs">🧤</p>
                        </>
                      ) : (
                        <>
                          <p className={`text-sm font-bold ${j.amarillas > 0 ? 'text-amber-400' : 'text-zinc-600'}`}>{j.amarillas}</p>
                          <p className="text-zinc-600 text-xs">🟨</p>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="mt-2 pt-2 border-t border-zinc-800 flex items-center justify-between">
                    <span className="text-zinc-500 text-xs">{j.partidos} PJ</span>
                    {j.rojas > 0 && <span className="text-red-400 text-xs font-bold">🟥 {j.rojas}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <p className="text-center text-xs text-zinc-600 mt-6">
            Estadísticas acumuladas en todas las competiciones · Temporada {equipo.temporada}
          </p>
        </div>
      </div>
    </ProtectedRoute>
  )
}
