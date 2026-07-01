import { Routes, Route, Navigate } from 'react-router-dom'
import { useComplyStore } from './store/complyStore'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Emissions from './pages/Emissions'
import Regulations from './pages/Regulations'
import Audits from './pages/Audits'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = useComplyStore((s) => s.token)
  if (!token) return <Navigate to="/login" replace />
  return <>{children}</>
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/emissions" element={<ProtectedRoute><Emissions /></ProtectedRoute>} />
      <Route path="/regulations" element={<ProtectedRoute><Regulations /></ProtectedRoute>} />
      <Route path="/audits" element={<ProtectedRoute><Audits /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
