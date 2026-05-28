const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3001'

export default function Avatar({ usuario, size = 'md', className = '' }) {
  const sizes = {
    xs: 'w-7 h-7 text-xs',
    sm: 'w-9 h-9 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-xl',
    xl: 'w-20 h-20 text-2xl',
  }

  const iniciales = (nombre) =>
    nombre?.split(' ').slice(0, 2).map(w => w[0]?.toUpperCase() || '').join('') || '?'

  const fotoUrl = usuario?.fotoPerfil ? `${API_BASE}${usuario.fotoPerfil}` : null

  return (
    <div className={`${sizes[size]} rounded-xl overflow-hidden flex-shrink-0 ${className}`}>
      {fotoUrl ? (
        <img
          src={fotoUrl}
          alt={usuario?.nombre}
          className="w-full h-full object-cover"
          onError={(e) => {
            // Si falla la imagen, mostrar iniciales
            e.target.style.display = 'none'
            e.target.nextSibling.style.display = 'flex'
          }}
        />
      ) : null}
      <div
        className={`w-full h-full bg-zinc-700 flex items-center justify-center text-white font-bold ${fotoUrl ? 'hidden' : 'flex'}`}
      >
        {iniciales(usuario?.nombre)}
      </div>
    </div>
  )
}
