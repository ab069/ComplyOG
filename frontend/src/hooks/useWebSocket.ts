import { useEffect, useRef } from 'react'
import { useComplyStore } from '../store/complyStore'

export function useWebSocket() {
  const token = useComplyStore((s) => s.token)
  const setWsConnected = useComplyStore((s) => s.setWsConnected)
  const fetchAlerts = useComplyStore((s) => s.fetchAlerts)
  const fetchStats = useComplyStore((s) => s.fetchStats)
  const wsRef = useRef<WebSocket | null>(null)

  useEffect(() => {
    if (!token) return

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    const host = window.location.host
    const url = `${protocol}//${host}/ws?token=${token}`

    const ws = new WebSocket(url)
    wsRef.current = ws

    ws.onopen = () => setWsConnected(true)

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data)
        if (msg.type === 'alert' || msg.type === 'compliance_event') {
          fetchAlerts()
          fetchStats()
        }
      } catch { /* ignore */ }
    }

    ws.onclose = () => {
      setWsConnected(false)
      wsRef.current = null
    }

    ws.onerror = () => {
      ws.close()
    }

    const interval = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: 'ping' }))
      }
    }, 30000)

    return () => {
      clearInterval(interval)
      ws.close()
    }
  }, [token])
}
