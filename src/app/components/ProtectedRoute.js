'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ProtectedRoute({ children }) {
  const router = useRouter()
  const [verificando, setVerificando] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')

    if (!token) {
      router.push('/login')
      return
    }

    setVerificando(false)
  }, [router])

  if (verificando) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-100 dark:bg-zinc-900">
        <p className="text-zinc-500 dark:text-zinc-400">Cargando...</p>
      </div>
    )
  }

  return <>{children}</>
}