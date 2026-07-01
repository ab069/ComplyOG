import { useComplyStore } from '../store/complyStore'

export default function AuditFeed() {
  const alerts = useComplyStore((s) => s.alerts)

  const severityColors: Record<string, string> = {
    critical: 'border-red-500 bg-red-500/5',
    high: 'border-orange-500 bg-orange-500/5',
    medium: 'border-yellow-500 bg-yellow-500/5',
    low: 'border-blue-500 bg-blue-500/5',
    info: 'border-gray-500 bg-gray-500/5',
  }

  const typeIcons: Record<string, string> = {
    emission_exceeded: '⬡',
    deadline_approaching: '⏰',
    non_compliance: '✕',
    report_due: '📋',
  }

  if (alerts.length === 0) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Compliance Events</h3>
        <div className="text-gray-500 text-sm">No recent events.</div>
      </div>
    )
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Compliance Events</h3>
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`border-l-4 rounded px-4 py-3 ${severityColors[alert.severity] || severityColors.info}`}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm">{typeIcons[alert.alert_type] || '◈'}</span>
              <span className="text-white text-sm font-medium">{alert.title}</span>
              <span className={`ml-auto text-xs px-1.5 py-0.5 rounded ${
                alert.status === 'unread' ? 'bg-emerald-600/20 text-emerald-400' : 'bg-gray-700 text-gray-400'
              }`}>
                {alert.status}
              </span>
            </div>
            <p className="text-xs text-gray-400">{alert.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
