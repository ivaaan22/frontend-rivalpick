'use client'
import { useEffect, useState } from 'react'

export default function Loading({ texto = 'Cargando...' }) {
  const [mostrarAviso, setMostrarAviso] = useState(false)

  // Si tarda más de 4 segundos, avisamos que Render puede estar arrancando
  useEffect(() => {
    const timer = setTimeout(() => setMostrarAviso(true), 4000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="flex flex-col items-center justify-center py-20 gap-3">
      <div className="w-8 h-8 border-2 border-zinc-700 border-t-emerald-500 rounded-full animate-spin"></div>
      <p className="text-zinc-500 text-sm">{texto}</p>
      {mostrarAviso && (
        <div className="mt-2 px-4 py-2.5 rounded-xl bg-zinc-800 border border-zinc-700 max-w-xs text-center">
          <p className="text-zinc-400 text-xs">El servidor puede tardar unos segundos en arrancar. Por favor, espera...</p>
        </div>
      )}
    </div>
  )
}
