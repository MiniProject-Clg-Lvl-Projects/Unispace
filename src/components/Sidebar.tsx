import { useApp } from '../context'
import type { Screen } from '../types'

interface NavItem {
  label: string
  screen: Screen
  icon: string
}

const facultyNav: NavItem[] = [
  { label: 'Dashboard', screen: 'faculty-dashboard', icon: '⊞' },
  // { label: 'Course Approvals', screen: 'faculty-course-approval', icon: '✓' },
  { label: 'Created Courses', screen: 'faculty-created-courses', icon: '🗂' },
  { label: 'Course Grid', screen: 'faculty-course-grid', icon: '◫' },
]

const studentNav: NavItem[] = [
  { label: 'Dashboard', screen: 'student-dashboard', icon: '⊞' },
  { label: 'Institute Courses', screen: 'student-global-courses', icon: '🏛' },
  { label: 'Search Courses', screen: 'student-search', icon: '🔍' },
  { label: 'My Learning', screen: 'student-my-learning', icon: '📖' },
]

export default function Sidebar() {
  const { currentUser, currentScreen, navigate, logout } = useApp()
  const nav = currentUser?.role === 'faculty' ? facultyNav : studentNav

  return (
    <aside className="w-60 flex-shrink-0 flex flex-col" style={{ background: '#0a0f1a', borderRight: '1px solid #1a2540' }}>
      {/* Logo */}
      <div className="px-5 py-5 flex items-center gap-3" style={{ borderBottom: '1px solid #1a2540' }}>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold" style={{ background: 'linear-gradient(135deg, #7c3aed, #0d9488)' }}>Uni</div>
        <div>
          <div className="text-white font-bold text-lg tracking-wide" style={{ fontFamily: 'Outfit, sans-serif', letterSpacing: '0.04em' }}>UNISPACE</div>
          <div className="text-xs" style={{ color: '#475569' }}>ERP Platform</div>
        </div>
      </div>

      {/* User */}
      <div className="px-4 py-4" style={{ borderBottom: '1px solid #1a2540' }}>
        <div className="flex items-center gap-3 px-2 py-2 rounded-lg" style={{ background: '#111827' }}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0"
            style={{ background: currentUser?.role === 'faculty' ? '#7c3aed' : '#0d9488' }}>
            {currentUser?.name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
          </div>
          <div className="overflow-hidden">
            <div className="text-sm font-medium text-white truncate">{currentUser?.name}</div>
            <div className="text-xs capitalize" style={{ color: '#0d9488' }}>{currentUser?.role}</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        <div className="text-xs font-semibold uppercase tracking-widest mb-3 px-2" style={{ color: '#334155', fontFamily: 'JetBrains Mono, monospace' }}>
          Navigation
        </div>
        {nav.map(item => {
          const active = currentScreen === item.screen
          return (
            <button
              key={item.screen}
              onClick={() => navigate(item.screen)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 text-left"
              style={{
                background: active ? 'rgba(124,58,237,0.15)' : 'transparent',
                color: active ? '#a78bfa' : '#64748b',
                borderLeft: active ? '2px solid #7c3aed' : '2px solid transparent',
              }}
            >
              <span className="w-4 text-center text-base">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </button>
          )
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 py-4 space-y-0.5" style={{ borderTop: '1px solid #1a2540' }}>
        <button
          onClick={() => navigate(currentUser?.role === 'faculty' ? 'faculty-dashboard' : 'student-dashboard')}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all"
          style={{ color: '#64748b' }}
          onMouseEnter={e => (e.currentTarget.style.color = '#94a3b8')}
          onMouseLeave={e => (e.currentTarget.style.color = '#64748b')}
        >
          <span>⚙</span><span>Settings</span>
        </button>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all"
          style={{ color: '#64748b' }}
          onMouseEnter={e => (e.currentTarget.style.color = '#f87171')}
          onMouseLeave={e => (e.currentTarget.style.color = '#64748b')}
        >
          <span>⏻</span><span>Logout</span>
        </button>
      </div>
    </aside>
  )
}
