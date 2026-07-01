import { create } from 'zustand'
import client from '../api/client'

interface User {
  id: string
  email: string
  name: string
}

interface Emission {
  id: string
  user_id: string
  facility_name: string
  source_type: string
  co2_tonnes: number
  ch4_tonnes: number
  n2o_tonnes: number
  co2e_tonnes: number
  reporting_period: string
  status: string
  created_at: string
}

interface Regulation {
  id: string
  regulation_name: string
  authority: string
  category: string
  requirement: string
  deadline: string | null
  status: string
  created_at: string
}

interface Audit {
  id: string
  audit_name: string
  auditor: string
  audit_date: string | null
  scope: any
  findings: any
  score: number
  status: string
  created_at: string
}

interface Alert {
  id: string
  title: string
  alert_type: string
  severity: string
  status: string
  description: string
  created_at: string
}

interface Stats {
  total_co2e?: number
  compliance_rate?: number
  average_score?: number
  non_compliant?: number
  total_emissions?: number
  total_regulations?: number
  total_alerts?: number
  unread?: number
}

interface ComplyState {
  user: User | null
  token: string | null
  emissions: Emission[]
  regulations: Regulation[]
  audits: Audit[]
  alerts: Alert[]
  stats: Stats
  loading: boolean
  wsConnected: boolean

  setAuth: (user: User, token: string) => void
  logout: () => void
  fetchEmissions: () => Promise<void>
  fetchRegulations: () => Promise<void>
  fetchAudits: () => Promise<void>
  fetchAlerts: () => Promise<void>
  fetchStats: () => Promise<void>
  submitEmission: (data: any) => Promise<void>
  updateEmission: (id: string, data: any) => Promise<void>
  deleteEmission: (id: string) => Promise<void>
  createRegulation: (data: any) => Promise<void>
  createAudit: (data: any) => Promise<void>
  updateAlertStatus: (id: string, status: string) => Promise<void>
  setWsConnected: (v: boolean) => void
}

export const useComplyStore = create<ComplyState>((set, get) => ({
  user: JSON.parse(localStorage.getItem('complyog_user') || 'null'),
  token: localStorage.getItem('complyog_token'),
  emissions: [],
  regulations: [],
  audits: [],
  alerts: [],
  stats: {},
  loading: false,
  wsConnected: false,

  setAuth: (user, token) => {
    localStorage.setItem('complyog_user', JSON.stringify(user))
    localStorage.setItem('complyog_token', token)
    set({ user, token })
  },

  logout: () => {
    localStorage.removeItem('complyog_user')
    localStorage.removeItem('complyog_token')
    set({ user: null, token: null, emissions: [], regulations: [], audits: [], alerts: [], stats: {} })
  },

  fetchEmissions: async () => {
    const res = await client.get('/emissions')
    set({ emissions: res.data })
  },

  fetchRegulations: async () => {
    const res = await client.get('/regulations')
    set({ regulations: res.data })
  },

  fetchAudits: async () => {
    const res = await client.get('/audits')
    set({ audits: res.data })
  },

  fetchAlerts: async () => {
    const res = await client.get('/alerts')
    set({ alerts: res.data })
  },

  fetchStats: async () => {
    set({ loading: true })
    try {
      const [emStats, regStats, auditStats, alertStats] = await Promise.all([
        client.get('/emissions/stats'),
        client.get('/regulations/stats'),
        client.get('/audits/stats'),
        client.get('/alerts/stats'),
      ])
      set({
        stats: {
          total_co2e: emStats.data.total_co2e,
          by_source: emStats.data.by_source,
          by_period: emStats.data.by_period,
          total_emissions: emStats.data.total_emissions,
          total_regulations: regStats.data.total_regulations,
          compliant: regStats.data.compliant,
          non_compliant: regStats.data.non_compliant,
          pending: regStats.data.pending,
          waived: regStats.data.waived,
          compliance_rate: regStats.data.compliance_rate,
          total_audits: auditStats.data.total_audits,
          average_score: auditStats.data.average_score,
          audit_by_status: auditStats.data.by_status,
          total_alerts: alertStats.data.total_alerts,
          unread: alertStats.data.unread,
        },
        loading: false,
      })
    } catch {
      set({ loading: false })
    }
  },

  submitEmission: async (data) => {
    await client.post('/emissions', data)
    await get().fetchEmissions()
    await get().fetchStats()
  },

  updateEmission: async (id, data) => {
    await client.put(`/emissions/${id}`, data)
    await get().fetchEmissions()
    await get().fetchStats()
  },

  deleteEmission: async (id) => {
    await client.delete(`/emissions/${id}`)
    await get().fetchEmissions()
    await get().fetchStats()
  },

  createRegulation: async (data) => {
    await client.post('/regulations', data)
    await get().fetchRegulations()
    await get().fetchStats()
  },

  createAudit: async (data) => {
    await client.post('/audits', data)
    await get().fetchAudits()
    await get().fetchStats()
  },

  updateAlertStatus: async (id, status) => {
    await client.patch(`/alerts/${id}`, { status })
    await get().fetchAlerts()
  },

  setWsConnected: (v) => set({ wsConnected: v }),
}))
