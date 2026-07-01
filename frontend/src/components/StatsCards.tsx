import { useComplyStore } from '../store/complyStore'

export default function StatsCards() {
  const { stats } = useComplyStore()

  const cards = [
    {
      label: 'Total CO₂e',
      value: stats.total_co2e != null ? `${stats.total_co2e.toLocaleString()} t` : '—',
      sub: `${stats.total_emissions ?? 0} emission records`,
      color: 'border-emerald-500',
    },
    {
      label: 'Compliance Rate',
      value: stats.compliance_rate != null ? `${stats.compliance_rate}%` : '—',
      sub: `${stats.compliant ?? 0}/${stats.total_regulations ?? 0} compliant`,
      color: 'border-blue-500',
    },
    {
      label: 'Audit Score',
      value: stats.average_score != null ? `${stats.average_score}/100` : '—',
      sub: `${stats.total_audits ?? 0} audits completed`,
      color: 'border-purple-500',
    },
    {
      label: 'Non-Compliant Regs',
      value: stats.non_compliant != null ? `${stats.non_compliant}` : '—',
      sub: `${stats.pending ?? 0} pending review`,
      color: 'border-red-500',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {cards.map((card) => (
        <div
          key={card.label}
          className={`bg-gray-900 border-l-4 ${card.color} rounded-lg p-5 border border-gray-800`}
        >
          <div className="text-sm text-gray-400 mb-1">{card.label}</div>
          <div className="text-2xl font-bold text-white mb-1">{card.value}</div>
          <div className="text-xs text-gray-500">{card.sub}</div>
        </div>
      ))}
    </div>
  )
}
