export default function Loading({ texto = 'Cargando...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-3">
      <div className="w-8 h-8 border-2 border-zinc-700 border-t-emerald-500 rounded-full animate-spin"></div>
      <p className="text-zinc-500 text-sm">{texto}</p>
    </div>
  )
}
