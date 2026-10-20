import { useApp } from '../context'
import type { Screen } from '../types'

const breadcrumbMap: Record<Screen, string[]> = {
  landing: [],
  login: [],
  register: [],
  'faculty-dashboard': ['Dashboard'],
  'faculty-my-learning': ['Dashboard', 'My Learning'],
  'faculty-course-approval': ['Dashboard', 'Course Approvals'],
  'faculty-created-courses': ['Dashboard', 'Created Courses'],
  'faculty-create-course': ['Dashboard', 'Created Courses', 'Create Course'],
  'faculty-course-grid': ['Dashboard', 'Course Grid'],
  'faculty-course-info': ['Dashboard', 'Courses', 'Course Information'],
  'faculty-course-content': ['Dashboard', 'Courses', 'Course Information', 'Course Content'],
  'faculty-selected-course': ['Dashboard', 'Courses', 'Course Information', 'Course Content', 'Selected Course'],
  'faculty-course-preview': ['Dashboard', 'Courses', 'Course Information', 'Preview'],
  'faculty-document-preview': ['Dashboard', 'Courses', 'Preview', 'Document'],
  'faculty-learners': ['Dashboard', 'Courses', 'Learners'],
  'faculty-assign-students': ['Dashboard', 'Courses', 'Learners', 'Assign Students'],
  'student-dashboard': ['Dashboard'],
  'student-global-courses': ['Dashboard', 'Institute Courses'],
  'student-search': ['Dashboard', 'Search Courses'],
  'student-my-learning': ['Dashboard', 'My Learning'],
  'student-total-courses': ['Dashboard', 'My Learning', 'All Courses'],
  'student-completed-courses': ['Dashboard', 'My Learning', 'Completed'],
  'student-inprogress-courses': ['Dashboard', 'My Learning', 'In Progress'],
  'student-notstarted-courses': ['Dashboard', 'My Learning', 'Not Started'],
  'student-course-detail' :['Dashboard']
}

export default function Header() {
  const { currentScreen, currentUser, selectedCourse, goBack, navigate } = useApp()
  const crumbs = breadcrumbMap[currentScreen] ?? []
  const canGoBack = crumbs.length > 1

  return (
    <header className="flex items-center justify-between px-6 py-3 flex-shrink-0" style={{ background: '#0a0f1a', borderBottom: '1px solid #1a2540', height: '56px' }}>
      <div className="flex items-center gap-3">
        {canGoBack && (
          <button onClick={goBack} className="text-sm flex items-center gap-1 transition-colors mr-2" style={{ color: '#64748b' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#a78bfa')}
            onMouseLeave={e => (e.currentTarget.style.color = '#64748b')}>
            ← Back
          </button>
        )}
        <nav className="flex items-center gap-1.5 text-sm">
          {crumbs.map((c, i) => (
            <span key={i} className="flex items-center gap-1.5">
              {i > 0 && <span style={{ color: '#334155' }}>/</span>}
              <span style={{ color: i === crumbs.length - 1 ? '#e2e8f0' : '#475569' }} className={i === crumbs.length - 1 ? 'font-medium' : ''}>
                {i === crumbs.length - 1 && selectedCourse && crumbs.length > 2
                  ? selectedCourse.title.length > 24 ? selectedCourse.title.slice(0, 24) + '…' : selectedCourse.title
                  : c}
              </span>
            </span>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-3">
        <button className="relative w-8 h-8 rounded-lg flex items-center justify-center transition-colors text-base"
          style={{ color: '#64748b', background: '#111827' }}
          onMouseEnter={e => (e.currentTarget.style.color = '#a78bfa')}
          onMouseLeave={e => (e.currentTarget.style.color = '#64748b')}>
          🔔
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full" style={{ background: '#7c3aed' }} />
        </button>
        <button
          onClick={() => navigate(currentUser?.role === 'faculty' ? 'faculty-dashboard' : 'student-dashboard')}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors text-sm"
          style={{ background: '#111827', color: '#94a3b8' }}
          onMouseEnter={e => (e.currentTarget.style.color = '#e2e8f0')}
          onMouseLeave={e => (e.currentTarget.style.color = '#94a3b8')}>
          <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
            style={{ background: currentUser?.role === 'faculty' ? '#7c3aed' : '#0d9488' }}>
            {currentUser?.name?.split(' ').map(w => w[0]).join('').slice(0, 2)}
          </div>
          <span className="hidden sm:block">{currentUser?.name?.split(' ')[0]}</span>
        </button>
      </div>
    </header>
  )
}
