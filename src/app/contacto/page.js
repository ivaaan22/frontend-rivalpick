'use client'

import { useState } from 'react'
import Navbar from '../components/Navbar'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

const FAQ = [
  {
    q: '¿Cómo funciona la puntuación?',
    a: 'En modo clásico ganas 3 puntos si aciertas el resultado (1, X o 2). En modo marcador exacto ganas 5 puntos si aciertas el marcador exacto del partido.'
  },
  {
    q: '¿Es gratis RivalPick?',
    a: 'Sí, RivalPick es 100% gratuito. No hay planes premium ni funciones de pago, y nunca habrá dinero real en juego.'
  },
  {
    q: '¿Cuándo se cierra la predicción de un partido?',
    a: 'Las predicciones se cierran automáticamente cuando el partido empieza. Verás una cuenta atrás en la pantalla de predicciones si el partido está próximo.'
  },
  {
    q: '¿Puedo cambiar mi predicción antes del partido?',
    a: 'Sí, puedes cambiar tu predicción tantas veces como quieras hasta que empiece el partido. Se guarda automáticamente el último cambio.'
  },
  {
    q: '¿Cómo invito a mis amigos a un grupo?',
    a: 'Al crear un grupo se genera un código de 6 caracteres. Compártelo con tus amigos y podrán unirse desde la sección "Unirme" del dashboard.'
  },
  {
    q: '¿Qué ligas están disponibles?',
    a: 'LaLiga, Premier League, Bundesliga, Serie A, Ligue 1, Champions League y el Mundial 2026.'
  },
]

export default function ContactoPage() {
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [asunto, setAsunto] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [resultado, setResultado] = useState(null)
  const [faqAbierta, setFaqAbierta] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setEnviando(true)
    setResultado(null)

    try {
      const res = await fetch(`${API_URL}/contacto`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, email, asunto, mensaje })
      })
      const data = await res.json()
      if (res.ok) {
        setResultado({ ok: true, mensaje: '¡Mensaje enviado! Te responderé en menos de 24h.' })
        setNombre(''); setEmail(''); setAsunto(''); setMensaje('')
      } else {
        setResultado({ ok: false, mensaje: data.mensaje || 'Error al enviar el mensaje' })
      }
    } catch (err) {
      setResultado({ ok: false, mensaje: 'Error de conexión. Inténtalo de nuevo.' })
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-zinc-950">
      <Navbar titulo="Contacto" volver />

      <div className="max-w-4xl mx-auto px-4 py-8">

        {/* Hero */}
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">Hablemos</h1>
          <p className="text-zinc-400 max-w-lg mx-auto">
            ¿Tienes una sugerencia, encontraste un bug o simplemente quieres saludar? Escríbeme, te leo todo.
          </p>
        </div>

        {/* Canales rápidos */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-10">
          <a href="mailto:ivangarciac10@gmail.com" className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 hover:border-emerald-500/50 hover:bg-zinc-800/50 transition group">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center mb-2 group-hover:scale-110 transition">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            </div>
            <p className="text-white font-semibold text-sm">Email</p>
            <p className="text-zinc-500 text-xs mt-0.5 truncate">ivangarciac10@gmail.com</p>
          </a>

          <a href="https://github.com/ivaaan22" target="_blank" rel="noopener noreferrer" className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 hover:border-white/30 hover:bg-zinc-800/50 transition group">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mb-2 group-hover:scale-110 transition">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
            </div>
            <p className="text-white font-semibold text-sm">GitHub</p>
            <p className="text-zinc-500 text-xs mt-0.5">@ivaaan22</p>
          </a>

          <a href="https://www.instagram.com/ivaancetee_06/?hl=es" target="_blank" rel="noopener noreferrer" className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 hover:border-pink-500/50 hover:bg-zinc-800/50 transition group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-orange-500/20 flex items-center justify-center mb-2 group-hover:scale-110 transition">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ec4899" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
            </div>
            <p className="text-white font-semibold text-sm">Instagram</p>
            <p className="text-zinc-500 text-xs mt-0.5">@ivaancetee_06</p>
          </a>
        </div>

        {/* Formulario */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sm:p-8 mb-10">
          <h2 className="text-xl font-bold text-white mb-1">Escríbeme un mensaje</h2>
          <p className="text-zinc-500 text-sm mb-6">Te responderé en menos de 24 horas</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="nombre" className="block text-xs font-medium text-zinc-400 mb-2 uppercase tracking-widest">Nombre</label>
                <input
                  id="nombre" type="text" required
                  value={nombre} onChange={(e) => setNombre(e.target.value)}
                  placeholder="Tu nombre"
                  className="w-full px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-xs font-medium text-zinc-400 mb-2 uppercase tracking-widest">Email</label>
                <input
                  id="email" type="email" required autoComplete="email"
                  value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  className="w-full px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition"
                />
              </div>
            </div>

            <div>
              <label htmlFor="asunto" className="block text-xs font-medium text-zinc-400 mb-2 uppercase tracking-widest">Asunto</label>
              <select
                id="asunto" required
                value={asunto} onChange={(e) => setAsunto(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white focus:outline-none focus:border-emerald-500 transition"
              >
                <option value="">Selecciona un motivo</option>
                <option value="bug">🐛 Reportar un bug</option>
                <option value="sugerencia">💡 Sugerencia de mejora</option>
                <option value="pregunta">❓ Pregunta general</option>
                <option value="colaboracion">🤝 Colaboración / prensa</option>
                <option value="otro">✉️ Otro</option>
              </select>
            </div>

            <div>
              <label htmlFor="mensaje" className="block text-xs font-medium text-zinc-400 mb-2 uppercase tracking-widest">Mensaje</label>
              <textarea
                id="mensaje" rows={5} required
                value={mensaje} onChange={(e) => setMensaje(e.target.value)}
                placeholder="Cuéntame..."
                className="w-full px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition resize-none"
              />
            </div>

            {resultado && (
              <div className={`p-3 rounded-xl border ${resultado.ok ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
                <p className={`text-sm text-center ${resultado.ok ? 'text-emerald-400' : 'text-red-400'}`}>{resultado.mensaje}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={enviando}
              className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-semibold transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {enviando ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Enviando...
                </>
              ) : 'Enviar mensaje'}
            </button>
          </form>
        </div>

        {/* FAQ */}
        <div className="mb-10">
          <h2 className="text-xl font-bold text-white mb-1">Preguntas frecuentes</h2>
          <p className="text-zinc-500 text-sm mb-6">Quizás encuentres aquí lo que buscas</p>

          <div className="space-y-2">
            {FAQ.map((item, i) => (
              <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
                <button
                  onClick={() => setFaqAbierta(faqAbierta === i ? null : i)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-zinc-800/50 transition"
                >
                  <p className="text-white font-medium text-sm pr-4">{item.q}</p>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`text-zinc-500 flex-shrink-0 transition-transform ${faqAbierta === i ? 'rotate-180' : ''}`}><polyline points="6 9 12 15 18 9"/></svg>
                </button>
                {faqAbierta === i && (
                  <div className="px-4 pb-4">
                    <p className="text-zinc-400 text-sm leading-relaxed">{item.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
