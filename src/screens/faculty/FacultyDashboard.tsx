import { useApp } from '../../context'
import { StatCard, Card, Btn, StatusBadge, ProgressBar } from '../../components/ui'

export default function FacultyDashboard() {
  const { currentUser, courses, students, navigate } = useApp()

  const USER_ID = currentUser?.id;

  const myCourses = courses.filter(c => c.facultyId === USER_ID)
  const pending = courses.filter(c => c.approvalStatus === 'pending')
  const inProgress = myCourses.filter(c => c.status === 'in-progress')
  const totalLearners = new Set(myCourses.flatMap(c => c.enrolledStudents)).size

  
  // const recentActivity = [
  //   { action: 'New enrollment', detail: 'Sneha Patel enrolled in DS&A', time: '2h ago', icon: '🎓' },
  //   { action: 'Course approved', detail: 'Operating Systems approved by admin', time: '5h ago', icon: '✅' },
  //   { action: 'Approval requested', detail: 'ML Fundamentals sent for review', time: '1d ago', icon: '📋' },
  //   { action: 'Unit added', detail: 'Unit 3 added to DS&A course', time: '2d ago', icon: '📝' },
  // ]

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Welcome */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>
            Good morning, {currentUser?.name?.split(' ').slice(0, 2).join(' ')} 👋
          </h1>
          <p className="text-sm mt-1" style={{ color: '#475569' }}>Here's what's happening with your courses today.</p>
        </div>
        <Btn onClick={() => navigate('faculty-create-course')}>+ Create Course</Btn>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Courses" value={myCourses.length} icon="🗂" color="#7c3aed" />
        {/* <StatCard label="Awaiting Approval" value={pending.length} icon="⏳" color="#f59e0b" /> */}
        <StatCard label="In Progress" value={inProgress.length} icon="▶" color="#3b82f6" />
        <StatCard label="Total Learners" value={totalLearners} icon="👥" color="#0d9488" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Courses */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>My Courses</h2>
            <button className="text-sm transition-colors" style={{ color: '#a78bfa' }} onClick={() => navigate('faculty-created-courses')}>View All →</button>
          </div>
          <div className="space-y-3">
            {myCourses.map(course => (
              <div key={course.id} className="rounded-xl p-4 flex items-center gap-4 cursor-pointer transition-colors"
                style={{ background: '#111827', border: '1px solid #1a2540' }}
                onClick={() => navigate('faculty-course-info', { course })}>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center text-lg flex-shrink-0"
                  style={{ background: 'rgba(124,58,237,0.15)' }}>📚</div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-white text-sm truncate" style={{ fontFamily: 'Outfit, sans-serif' }}>{course.title}</div>
                  <div className="text-xs mt-0.5" style={{ color: '#475569', fontFamily: 'JetBrains Mono, monospace' }}>{course.code}</div>
                  <div className="flex items-center gap-3 mt-2">
                    <ProgressBar value={course.status === 'approved' ? 100 : course.status === 'in-progress' ? 60 : 30} />
                    <span className="text-xs flex-shrink-0" style={{ color: '#64748b' }}>{course.enrolledStudents.length} learners</span>
                  </div>
                </div>
                <StatusBadge status={course.approvalStatus} />
              </div>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-5">
          {/* Quick Actions */}
          <Card>
            <h3 className="font-semibold text-white mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>Quick Actions</h3>
            <div className="space-y-2">
              {[
                { label: 'Create Course', icon: '➕', screen: 'faculty-create-course' as const, color: '#7c3aed' },
                { label: 'View Created Courses', icon: '📋', screen: 'faculty-created-courses' as const, color: '#0d9488' },
                { label: 'Course Approvals', icon: '✅', screen: 'faculty-course-approval' as const, color: '#f59e0b' },
                { label: 'Browse Course Grid', icon: '◫', screen: 'faculty-course-grid' as const, color: '#3b82f6' },
              ].map(a => (
                <button key={a.label} onClick={() => navigate(a.screen)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-left transition-colors"
                  style={{ background: '#0a0f1a', color: '#94a3b8' }}
                  onMouseEnter={e => { (e.currentTarget.style.background = '#141d2e'); (e.currentTarget.style.color = '#e2e8f0') }}
                  onMouseLeave={e => { (e.currentTarget.style.background = '#0a0f1a'); (e.currentTarget.style.color = '#94a3b8') }}>
                  <span className="w-6 h-6 rounded flex items-center justify-center text-sm flex-shrink-0"
                    style={{ background: `${a.color}22`, color: a.color }}>{a.icon}</span>
                  {a.label}
                </button>
              ))}
            </div>
          </Card>

          {/* Recent Activity */}
          <Card>
            <h3 className="font-semibold text-white mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>Recent Activity</h3>
            <div className="space-y-3">
              {/*
              {recentActivity.map((a, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="text-base mt-0.5">{a.icon}</span>
                  <div>
                    <div className="text-xs font-medium text-white">{a.action}</div>
                    <div className="text-xs mt-0.5" style={{ color: '#475569' }}>{a.detail}</div>
                    <div className="text-xs mt-0.5" style={{ color: '#334155', fontFamily: 'JetBrains Mono, monospace' }}>{a.time}</div>
                  </div>
                </div>
              ))}
                */}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
