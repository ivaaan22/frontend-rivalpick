'use client'

import { useRouter } from 'next/navigation'

export default function NotFound() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="w-20 h-20 rounded-2xl bg-emerald-500 flex items-center justify-center mx-auto mb-6">
          <span className="text-black font-bold text-3xl">R</span>
        </div>
        <h1 className="text-7xl font-bold text-white mb-2">404</h1>
        <h2 className="text-xl font-semibold text-zinc-300 mb-3">Página no encontrada</h2>
        <p className="text-zinc-500 mb-8 max-w-sm mx-auto">Esta página no existe o ha sido eliminada. Vuelve al dashboard para seguir compitiendo.</p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => router.back()}
            className="px-5 py-2.5 rounded-xl border border-zinc-700 text-zinc-300 hover:text-white hover:border-zinc-500 transition text-sm"
          >
            ← Volver
          </button>
          <button
            onClick={() => router.push('/')}
            className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-semibold transition text-sm"
          >
            Ir al dashboard
          </button>
        </div>
      </div>
    </div>
  )
}
