import { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import RegulationList from '../components/RegulationList'
import { useComplyStore } from '../store/complyStore'

export default function Regulations() {
  const fetchRegulations = useComplyStore((s) => s.fetchRegulations)
  const createRegulation = useComplyStore((s) => s.createRegulation)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    regulation_name: '',
    authority: 'EPA',
    category: 'emissions',
    requirement: '',
    deadline: '',
    status: 'pending',
  })

  useEffect(() => {
    fetchRegulations()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await createRegulation({ ...form, deadline: form.deadline || null })
    setForm({ regulation_name: '', authority: 'EPA', category: 'emissions', requirement: '', deadline: '', status: 'pending' })
    setShowForm(false)
  }

  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Regulatory Compliance</h1>
            <p className="text-sm text-gray-500">Track regulations across EPA, OSHA, BLM, and state authorities</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
          >
            {showForm ? 'Cancel' : '+ Add Regulation'}
          </button>
        </div>
        {showForm && (
          <form onSubmit={handleSubmit} className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Regulation Name</label>
                <input
                  type="text"
                  value={form.regulation_name}
                  onChange={(e) => setForm({ ...form, regulation_name: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Authority</label>
                <select
                  value={form.authority}
                  onChange={(e) => setForm({ ...form, authority: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500"
                >
                  <option>EPA</option>
                  <option>OSHA</option>
                  <option>BLM</option>
                  <option>state</option>
                  <option>local</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500"
                >
                  <option>emissions</option>
                  <option>safety</option>
                  <option>waste</option>
                  <option>water</option>
                  <option>chemical</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Deadline</label>
                <input
                  type="date"
                  value={form.deadline}
                  onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Requirement</label>
              <textarea
                value={form.requirement}
                onChange={(e) => setForm({ ...form, requirement: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500"
                rows={3}
                required
              />
            </div>
            <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg text-sm font-medium">
              Create Regulation
            </button>
          </form>
        )}
        <RegulationList />
      </div>
    </Layout>
  )
}
