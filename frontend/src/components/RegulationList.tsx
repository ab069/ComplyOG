import { useComplyStore } from '../store/complyStore'

const statusStyles: Record<string, string> = {
  compliant: 'bg-emerald-600/20 text-emerald-400 border-emerald-600/30',
  non_compliant: 'bg-red-600/20 text-red-400 border-red-600/30',
  pending: 'bg-yellow-600/20 text-yellow-400 border-yellow-600/30',
  waived: 'bg-gray-600/20 text-gray-400 border-gray-600/30',
}

const categoryColors: Record<string, string> = {
  emissions: 'text-emerald-400',
  safety: 'text-orange-400',
  waste: 'text-yellow-400',
  water: 'text-blue-400',
  chemical: 'text-purple-400',
}

export default function RegulationList() {
  const regulations = useComplyStore((s) => s.regulations)

  if (regulations.length === 0) {
    return <div className="text-gray-500 text-sm py-4">No regulations tracked.</div>
  }

  return (
    <div className="space-y-3">
      {regulations.map((reg) => (
        <div key={reg.id} className="bg-gray-900 border border-gray-800 rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-sm ${categoryColors[reg.category] || 'text-gray-400'}`}>●</span>
                <span className="text-white font-medium">{reg.regulation_name}</span>
              </div>
              <div className="text-xs text-gray-500 mb-2">
                {reg.authority} · {reg.category}
              </div>
              <div className="text-sm text-gray-400 mb-2">{reg.requirement}</div>
              {reg.deadline && (
                <div className="text-xs text-gray-500">Deadline: {reg.deadline}</div>
              )}
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className={`px-2 py-0.5 rounded text-xs font-medium border ${statusStyles[reg.status] || 'bg-gray-700 text-gray-300'}`}>
                {reg.status.replace('_', ' ')}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
