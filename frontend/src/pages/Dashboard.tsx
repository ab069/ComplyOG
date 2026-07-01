import { useEffect } from 'react'
import Layout from '../components/Layout'
import StatsCards from '../components/StatsCards'
import EmissionList from '../components/EmissionList'
import AuditFeed from '../components/AuditFeed'
import { useComplyStore } from '../store/complyStore'
import { useWebSocket } from '../hooks/useWebSocket'

export default function Dashboard() {
  const fetchEmissions = useComplyStore((s) => s.fetchEmissions)
  const fetchRegulations = useComplyStore((s) => s.fetchRegulations)
  const fetchAudits = useComplyStore((s) => s.fetchAudits)
  const fetchAlerts = useComplyStore((s) => s.fetchAlerts)
  const fetchStats = useComplyStore((s) => s.fetchStats)

  useWebSocket()

  useEffect(() => {
    fetchEmissions()
    fetchRegulations()
    fetchAudits()
    fetchAlerts()
    fetchStats()
  }, [])

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Dashboard</h1>
            <p className="text-sm text-gray-500">Compliance overview & key metrics</p>
          </div>
        </div>
        <StatsCards />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-semibold text-white mb-3">Recent Emissions</h2>
            <EmissionList />
          </div>
          <div>
            <AuditFeed />
          </div>
        </div>
      </div>
    </Layout>
  )
}
