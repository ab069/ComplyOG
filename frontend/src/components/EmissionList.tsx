import { useState } from 'react'
import { useComplyStore } from '../store/complyStore'

const sourceColors: Record<string, string> = {
  flare: 'text-orange-400',
  vent: 'text-cyan-400',
  combustion: 'text-red-400',
  fugitive: 'text-yellow-400',
  process: 'text-blue-400',
}

const bgColors: Record<string, string> = {
  flare: 'bg-orange-500/10 border-orange-500/20',
  vent: 'bg-cyan-500/10 border-cyan-500/20',
  combustion: 'bg-red-500/10 border-red-500/20',
  fugitive: 'bg-yellow-500/10 border-yellow-500/20',
  process: 'bg-blue-500/10 border-blue-500/20',
}

const statusBadge: Record<string, string> = {
  draft: 'bg-gray-700 text-gray-300',
  submitted: 'bg-blue-600/20 text-blue-400',
  verified: 'bg-emerald-600/20 text-emerald-400',
}

export default function EmissionList() {
  const emissions = useComplyStore((s) => s.emissions)
  const deleteEmission = useComplyStore((s) => s.deleteEmission)
  const [expanded, setExpanded] = useState<string | null>(null)

  if (emissions.length === 0) {
    return <div className="text-gray-500 text-sm py-4">No emissions recorded yet.</div>
  }

  return (
    <div className="space-y-3">
      {emissions.map((em) => (
        <div
          key={em.id}
          className={`rounded-lg border ${bgColors[em.source_type] || 'bg-gray-900 border-gray-800'}`}
        >
          <div
            className="flex items-center justify-between p-4 cursor-pointer"
            onClick={() => setExpanded(expanded === em.id ? null : em.id)}
          >
            <div className="flex items-center gap-3">
              <span className={`text-lg ${sourceColors[em.source_type] || 'text-gray-400'}`}>●</span>
              <div>
                <div className="text-white font-medium">{em.facility_name}</div>
                <div className="text-xs text-gray-500">{em.source_type} · {em.reporting_period}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`px-2 py-0.5 rounded text-xs font-medium ${statusBadge[em.status] || 'bg-gray-700 text-gray-300'}`}>
                {em.status}
              </span>
              <span className="text-emerald-400 font-semibold">{em.co2e_tonnes.toLocaleString()} tCO₂e</span>
              <span className="text-gray-600 text-xs">{expanded === em.id ? '▲' : '▼'}</span>
            </div>
          </div>
          {expanded === em.id && (
            <div className="px-4 pb-4 border-t border-gray-800 pt-3">
              <div className="grid grid-cols-3 gap-4 text-sm mb-3">
                <div><span className="text-gray-500">CO₂:</span> <span className="text-white">{em.co2_tonnes} t</span></div>
                <div><span className="text-gray-500">CH₄:</span> <span className="text-white">{em.ch4_tonnes} t</span></div>
                <div><span className="text-gray-500">N₂O:</span> <span className="text-white">{em.n2o_tonnes} t</span></div>
              </div>
              <div className="text-xs text-gray-500">Total CO₂e: {em.co2e_tonnes} tonnes</div>
              <button
                onClick={(e) => { e.stopPropagation(); deleteEmission(em.id) }}
                className="mt-2 text-xs text-red-400 hover:text-red-300 transition-colors"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
