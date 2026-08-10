'use client'

import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-zinc-800 bg-zinc-950/95 py-6">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 sm:flex-row">
        <div className="flex items-center gap-2 text-sm text-zinc-400 sm:text-base">
          <span className="text-zinc-500">©</span>
          <span className="font-semibold text-zinc-200">RivalPick</span>
          <span className="text-zinc-500">2026</span>
        </div>
        <nav className="flex items-center gap-5 text-sm">
          <Link href="/contacto" className="text-zinc-500 hover:text-emerald-400 transition">Contacto</Link>
          <a href="https://github.com/ivaaan22" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-white transition">GitHub</a>
          <a href="https://www.instagram.com/ivaancetee_06/?hl=es" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-pink-400 transition">Instagram</a>
        </nav>
      </div>
    </footer>
  )
}
