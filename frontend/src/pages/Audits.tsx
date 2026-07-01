import { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import { useComplyStore } from '../store/complyStore'

export default function Audits() {
  const audits = useComplyStore((s) => s.audits)
  const fetchAudits = useComplyStore((s) => s.fetchAudits)
  const createAudit = useComplyStore((s) => s.createAudit)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    audit_name: '',
    auditor: '',
    audit_date: '',
    score: 0,
    status: 'planned',
  })

  useEffect(() => {
    fetchAudits()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await createAudit({ ...form, audit_date: form.audit_date || null })
    setForm({ audit_name: '', auditor: '', audit_date: '', score: 0, status: 'planned' })
    setShowForm(false)
  }

  const statusStyles: Record<string, string> = {
    planned: 'bg-gray-700 text-gray-300',
    in_progress: 'bg-blue-600/20 text-blue-400',
    complete: 'bg-emerald-600/20 text-emerald-400',
  }

  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Compliance Audits</h1>
            <p className="text-sm text-gray-500">Manage and track compliance audit results</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
          >
            {showForm ? 'Cancel' : '+ New Audit'}
          </button>
        </div>
        {showForm && (
          <form onSubmit={handleSubmit} className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Audit Name</label>
                <input
                  type="text"
                  value={form.audit_name}
                  onChange={(e) => setForm({ ...form, audit_name: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Auditor</label>
                <input
                  type="text"
                  value={form.auditor}
                  onChange={(e) => setForm({ ...form, auditor: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Date</label>
                <input
                  type="date"
                  value={form.audit_date}
                  onChange={(e) => setForm({ ...form, audit_date: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Score</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={form.score}
                  onChange={(e) => setForm({ ...form, score: parseInt(e.target.value) || 0 })}
                  className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
            <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg text-sm font-medium">
              Create Audit
            </button>
          </form>
        )}
        {audits.length === 0 ? (
          <div className="text-gray-500 text-sm py-4">No audits created yet.</div>
        ) : (
          <div className="space-y-3">
            {audits.map((a) => (
              <div key={a.id} className="bg-gray-900 border border-gray-800 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-white font-medium">{a.audit_name}</div>
                    <div className="text-xs text-gray-500 mb-1">Auditor: {a.auditor}</div>
                    {a.audit_date && <div className="text-xs text-gray-600">{a.audit_date}</div>}
                    {a.score > 0 && (
                      <div className="mt-2 text-sm">
                        <span className="text-gray-500">Score: </span>
                        <span className={`font-semibold ${a.score >= 70 ? 'text-emerald-400' : a.score >= 40 ? 'text-yellow-400' : 'text-red-400'}`}>
                          {a.score}/100
                        </span>
                      </div>
                    )}
                  </div>
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${statusStyles[a.status] || 'bg-gray-700 text-gray-300'}`}>
                    {a.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}
