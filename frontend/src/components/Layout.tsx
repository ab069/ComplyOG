import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useComplyStore } from '../store/complyStore'

const navItems = [
  { path: '/', label: 'Dashboard', icon: '◈' },
  { path: '/emissions', label: 'Emissions', icon: '⬡' },
  { path: '/regulations', label: 'Regulations', icon: '⚖' },
  { path: '/audits', label: 'Audits', icon: '✓' },
]

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout, wsConnected } = useComplyStore()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-950 flex">
      <aside className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col">
        <div className="p-6 border-b border-gray-800">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-emerald-500 text-2xl">⚡</span>
            <span className="text-xl font-bold text-white">ComplyOG</span>
          </Link>
          <p className="text-xs text-gray-500 mt-1">Regulatory & ESG Compliance</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors ${
                location.pathname === item.path
                  ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-600/30'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center gap-2 mb-3">
            <div className={`w-2 h-2 rounded-full ${wsConnected ? 'bg-emerald-500' : 'bg-gray-600'}`} />
            <span className="text-xs text-gray-500">{wsConnected ? 'Live' : 'Offline'}</span>
          </div>
          <div className="text-sm text-gray-400 truncate">{user?.name}</div>
          <div className="text-xs text-gray-600 truncate">{user?.email}</div>
          <button
            onClick={handleLogout}
            className="mt-2 text-xs text-red-400 hover:text-red-300 transition-colors"
          >
            Sign out
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto p-8">
        {children}
      </main>
    </div>
  )
}
