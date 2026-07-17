import { Download, Loader2 } from 'lucide-react'

const DownloadExcelButton = ({ onDownload, loading }) => {
  return (
    <button
      onClick={onDownload}
      disabled={loading}
      className="group relative flex items-center gap-2.5 overflow-hidden rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-bold uppercase tracking-wider text-white shadow-lg shadow-emerald-600/25 transition-all duration-300 hover:-translate-y-0.5 hover:bg-emerald-500 hover:shadow-xl hover:shadow-emerald-600/30 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
    >
      <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      {loading ? (
        <Loader2 size={16} className="animate-spin" />
      ) : (
        <Download size={16} className="transition-transform duration-300 group-hover:translate-y-0.5" />
      )}

      <span className="relative z-10">
        {loading ? 'Generando...' : 'Exportar a Excel'}
      </span>
    </button>
  )
}

export default DownloadExcelButton
