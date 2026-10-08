import { useApp } from '../../context'
import { StatCard, Btn, ProgressBar } from '../../components/ui'

const STUDENT_ID = 'st1'



export default function StudentDashboard() {
  const { currentUser, students, courses, navigate } = useApp()

  const me = students.find(s => s.id === STUDENT_ID)
  const total = me?.enrolledCourses.length ?? 0
  const completed = me?.enrolledCourses.filter(e => e.status === 'completed').length ?? 0
  const inProgress = me?.enrolledCourses.filter(e => e.status === 'in-progress').length ?? 0
  const notStarted = me?.enrolledCourses.filter(e => e.status === 'not-started').length ?? 0

  const recentCourses = me?.enrolledCourses.slice(0, 3).map(e => ({ ...e, course: courses.find(c => c.id === e.courseId) })).filter(e => e.course) ?? []

  const available = courses.filter(c => c.approvalStatus === 'approved' && !me?.enrolledCourses.find(e => e.courseId === c.id)).slice(0, 3)

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>
            Welcome back, {currentUser?.name?.split(' ')[0]} 🎓
          </h1>
          <p className="text-sm mt-1" style={{ color: '#475569' }}>Keep up the great work on your learning journey.</p>
        </div>
        <Btn variant="teal" onClick={() => navigate('student-search')}>Find Courses</Btn>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <button onClick={() => navigate('student-total-courses')} className="text-left transition-transform hover:scale-[1.02]">
          <StatCard label="Total Courses" value={total} icon="📚" color="#7c3aed" />
        </button>
        <button onClick={() => navigate('student-completed-courses')} className="text-left transition-transform hover:scale-[1.02]">
          <StatCard label="Completed" value={completed} icon="✅" color="#0d9488" />
        </button>
        <button onClick={() => navigate('student-inprogress-courses')} className="text-left transition-transform hover:scale-[1.02]">
          <StatCard label="In Progress" value={inProgress} icon="▶" color="#3b82f6" />
        </button>
        <button onClick={() => navigate('student-notstarted-courses')} className="text-left transition-transform hover:scale-[1.02]">
          <StatCard label="Not Started" value={notStarted} icon="⏸" color="#f59e0b" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recently Accessed */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>Continue Learning</h2>
            <button className="text-sm" style={{ color: '#a78bfa' }} onClick={() => navigate('student-my-learning')}>View All →</button>
          </div>
          <div className="space-y-3">
            {recentCourses.map(({ course, progress, status, currentUnit }) => course && (
              <div key={course.id} className="rounded-xl p-4 flex items-center gap-4 cursor-pointer transition-colors"
                style={{ background: '#111827', border: '1px solid #1a2540' }}
                onClick={() => navigate('student-inprogress-courses')}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                  style={{ background: status === 'completed' ? 'rgba(13,148,136,0.15)' : 'rgba(124,58,237,0.15)' }}>
                  {status === 'completed' ? '✅' : '📚'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-white text-sm" style={{ fontFamily: 'Outfit, sans-serif' }}>{course.title}</div>
                  <div className="text-xs mt-0.5" style={{ color: '#475569' }}>
                    {status === 'completed' ? 'Completed' : currentUnit || 'Not started'}
                  </div>
                  <div className="flex items-center gap-3 mt-2">
                    <ProgressBar value={progress} color={status === 'completed' ? '#0d9488' : '#7c3aed'} />
                    <span className="text-xs flex-shrink-0" style={{ color: '#64748b' }}>{progress}%</span>
                  </div>
                </div>
                {status !== 'completed' && (
                  <Btn size="sm" variant="primary">Continue →</Btn>
                )}
              </div>
            ))}
            {recentCourses.length === 0 && (
              <div className="rounded-xl p-8 text-center" style={{ background: '#111827', border: '1px solid #1a2540' }}>
                <div className="text-3xl mb-3">📚</div>
                <p className="text-sm" style={{ color: '#475569' }}>No courses yet. Start by enrolling in a course.</p>
                <Btn className="mt-4" size="sm" variant="teal" onClick={() => navigate('student-global-courses')}>Browse Courses</Btn>
              </div>
            )}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-5">
          {/* Progress overview */}
          <div className="rounded-xl p-5" style={{ background: '#111827', border: '1px solid #1a2540' }}>
            <h3 className="font-semibold text-white mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>Progress Overview</h3>
            <div className="space-y-4">
              {[
                { label: 'Overall Progress', value: total > 0 ? Math.round((completed * 100) / total) : 0, color: '#7c3aed' },
                { label: 'Completion Rate', value: total > 0 ? Math.round((completed / total) * 100) : 0, color: '#0d9488' },
                { label: 'Active Learning', value: total > 0 ? Math.round((inProgress / total) * 100) : 0, color: '#3b82f6' },
              ].map(item => (
                <div key={item.label}>
                  <div className="flex justify-between text-xs mb-1.5" style={{ color: '#64748b' }}>
                    <span>{item.label}</span>
                    <span>{item.value}%</span>
                  </div>
                  <ProgressBar value={item.value} color={item.color} />
                </div>
              ))}
            </div>
          </div>

          {/* Recommended */}
          <div className="rounded-xl p-5" style={{ background: '#111827', border: '1px solid #1a2540' }}>
            <h3 className="font-semibold text-white mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>Recommended Courses</h3>
            <div className="space-y-3">
              {available.map(course => (
                <div key={course.id} className="rounded-lg p-3 cursor-pointer transition-colors"
                  style={{ background: '#0a0f1a' }}
                  onClick={() => navigate('student-global-courses')}>
                  <div className="text-xs mb-0.5" style={{ color: '#475569', fontFamily: 'JetBrains Mono, monospace' }}>{course.code}</div>
                  <div className="text-sm font-medium text-white">{course.title}</div>
                  <div className="text-xs mt-1 flex items-center justify-between" style={{ color: '#475569' }}>
                    <span>👤 {course.faculty.split(' ').slice(-1)[0]}</span>
                    <span style={{ color: '#0d9488' }}>Enroll →</span>
                  </div>
                </div>
              ))}
            </div>
            <Btn className="w-full justify-center mt-3" size="sm" variant="outline" onClick={() => navigate('student-global-courses')}>
              Browse All Courses
            </Btn>
          </div>
        </div>
      </div>
    </div>
  )
}
