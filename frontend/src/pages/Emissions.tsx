import { useEffect } from 'react'
import Layout from '../components/Layout'
import EmissionForm from '../components/EmissionForm'
import EmissionList from '../components/EmissionList'
import { useComplyStore } from '../store/complyStore'

export default function Emissions() {
  const fetchEmissions = useComplyStore((s) => s.fetchEmissions)

  useEffect(() => {
    fetchEmissions()
  }, [])

  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">Emissions Tracking</h1>
          <p className="text-sm text-gray-500">Record and monitor CO₂, CH₄, N₂O emissions by facility</p>
        </div>
        <EmissionForm />
        <EmissionList />
      </div>
    </Layout>
  )
}
