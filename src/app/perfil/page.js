'use client'

import ProtectedRoute from '../components/ProtectedRoute'
import ThemeToggle from '../components/ThemeToggle'

export default function PerfilPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-zinc-100 dark:bg-zinc-900 px-4 py-8 relative">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>

        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-medium mb-2 text-zinc-900 dark:text-zinc-100">
            Perfil
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400">
            Esta es una página protegida. Si la ves, significa que estás logueado.
          </p>
        </div>
      </div>
    </ProtectedRoute>
  )
}