'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Navbar({ titulo, volver }) {
  const router = useRouter()
  const [menuAbierto, setMenuAbierto] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
    router.push('/login')
  }

  return (
    <nav className="border-b border-zinc-800 bg-zinc-950 sticky top-0 z-10">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {volver ? (
            <button onClick={() => router.back()} className="text-zinc-400 hover:text-white transition">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
            </button>
          ) : (
            <button onClick={() => router.push('/')} className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center">
                <span className="text-black font-bold text-xs">R</span>
              </div>
              <span className="text-white font-semibold hidden sm:block">RivalPick</span>
            </button>
          )}
          {titulo && <span className="text-white font-semibold">{titulo}</span>}
        </div>

        {!volver && (
          <>
            <div className="hidden sm:flex items-center gap-2">
              <button onClick={() => router.push('/grupos')} className="text-zinc-400 hover:text-white text-sm transition px-3 py-1.5 rounded-lg hover:bg-zinc-800">Grupos</button>
                <button onClick={() => router.push('/partidos')} className="text-zinc-400 hover:text-white text-sm transition px-3 py-1.5 rounded-lg hover:bg-zinc-800">Partidos</button>
                <button onClick={() => router.push('/predicciones')} className="text-zinc-400 hover:text-white text-sm transition px-3 py-1.5 rounded-lg hover:bg-zinc-800">Predicciones</button>
                <button onClick={() => router.push('/resultados')} className="text-zinc-400 hover:text-white text-sm transition px-3 py-1.5 rounded-lg hover:bg-zinc-800">Resultados</button>
                <button onClick={() => router.push('/historial')} className="text-zinc-400 hover:text-white text-sm transition px-3 py-1.5 rounded-lg hover:bg-zinc-800">Historial</button>
                <button onClick={() => router.push('/perfil')} className="text-zinc-400 hover:text-white text-sm transition px-3 py-1.5 rounded-lg hover:bg-zinc-800">Perfil</button>
              <button onClick={handleLogout} className="text-sm px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition">Salir</button>
            </div>

            <button onClick={() => setMenuAbierto(!menuAbierto)} className="sm:hidden text-zinc-400 hover:text-white transition">
              {menuAbierto ? (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              ) : (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
              )}
            </button>
          </>
        )}
      </div>

      {menuAbierto && !volver && (
        <div className="sm:hidden border-t border-zinc-800 bg-zinc-950 px-4 py-3 flex flex-col gap-1">
          <button onClick={() => { router.push('/grupos'); setMenuAbierto(false) }} className="text-zinc-400 hover:text-white text-sm transition px-3 py-2 rounded-lg hover:bg-zinc-800 text-left">Grupos</button>
          <button onClick={() => { router.push('/partidos'); setMenuAbierto(false) }} className="text-zinc-400 hover:text-white text-sm transition px-3 py-2 rounded-lg hover:bg-zinc-800 text-left">Partidos</button>
          <button onClick={() => { router.push('/predicciones'); setMenuAbierto(false) }} className="text-zinc-400 hover:text-white text-sm transition px-3 py-2 rounded-lg hover:bg-zinc-800 text-left">Predicciones</button>
          <button onClick={() => { router.push('/resultados'); setMenuAbierto(false) }} className="text-zinc-400 hover:text-white text-sm transition px-3 py-2 rounded-lg hover:bg-zinc-800 text-left">Resultados</button>
          <button onClick={() => { router.push('/historial'); setMenuAbierto(false) }} className="text-zinc-400 hover:text-white text-sm transition px-3 py-2 rounded-lg hover:bg-zinc-800 text-left">Historial</button>
          <button onClick={() => { router.push('/perfil'); setMenuAbierto(false) }} className="text-zinc-400 hover:text-white text-sm transition px-3 py-2 rounded-lg hover:bg-zinc-800 text-left">Perfil</button>
          <button onClick={handleLogout} className="text-red-400 hover:text-red-300 text-sm transition px-3 py-2 rounded-lg hover:bg-zinc-800 text-left">Cerrar sesión</button>
        </div>
      )}
    </nav>
  )
}
