import { useState } from 'react'
import { useComplyStore } from '../store/complyStore'

const sourceTypes = ['flare', 'vent', 'combustion', 'fugitive', 'process']

export default function EmissionForm() {
  const submitEmission = useComplyStore((s) => s.submitEmission)
  const [form, setForm] = useState({
    facility_name: '',
    source_type: 'flare',
    co2_tonnes: 0,
    ch4_tonnes: 0,
    n2o_tonnes: 0,
    reporting_period: 'Q1-2026',
  })
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await submitEmission(form)
      setForm({ facility_name: '', source_type: 'flare', co2_tonnes: 0, ch4_tonnes: 0, n2o_tonnes: 0, reporting_period: 'Q1-2026' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-6">
      <h3 className="text-lg font-semibold text-white mb-4">Record Emission</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Facility</label>
          <input
            type="text"
            value={form.facility_name}
            onChange={(e) => setForm({ ...form, facility_name: e.target.value })}
            className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500"
            required
            placeholder="Permian Basin Alpha"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Source Type</label>
          <select
            value={form.source_type}
            onChange={(e) => setForm({ ...form, source_type: e.target.value })}
            className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500"
          >
            {sourceTypes.map((s) => (
              <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Reporting Period</label>
          <input
            type="text"
            value={form.reporting_period}
            onChange={(e) => setForm({ ...form, reporting_period: e.target.value })}
            className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500"
            placeholder="Q1-2026"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">CO₂ (tonnes)</label>
          <input
            type="number"
            step="0.01"
            value={form.co2_tonnes}
            onChange={(e) => setForm({ ...form, co2_tonnes: parseFloat(e.target.value) || 0 })}
            className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">CH₄ (tonnes)</label>
          <input
            type="number"
            step="0.01"
            value={form.ch4_tonnes}
            onChange={(e) => setForm({ ...form, ch4_tonnes: parseFloat(e.target.value) || 0 })}
            className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">N₂O (tonnes)</label>
          <input
            type="number"
            step="0.01"
            value={form.n2o_tonnes}
            onChange={(e) => setForm({ ...form, n2o_tonnes: parseFloat(e.target.value) || 0 })}
            className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>
      <button
        type="submit"
        disabled={submitting}
        className="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
      >
        {submitting ? 'Submitting...' : 'Submit Emission'}
      </button>
    </form>
  )
}
