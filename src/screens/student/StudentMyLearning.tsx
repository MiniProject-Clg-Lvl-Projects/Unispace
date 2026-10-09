import { useApp } from '../../context'
import { Btn, StatCard, ProgressBar, EmptyState, StatusBadge } from '../../components/ui'
import type { Screen } from '../../types'
import type { ICourse, IContentItem } from '../../types'

const STUDENT_ID = 'st1'



export default function StudentMyLearning() {
  const { students, courses, navigate,selectedContent,selectedCourse, currentScreen, screenFilter } = useApp()

  const me = students.find(s => s.id === STUDENT_ID)
  const total = me?.enrolledCourses ?? []
  const completed = total.filter(e => e.status === 'completed')
  const inProgress = total.filter(e => e.status === 'in-progress')
  const notStarted = total.filter(e => e.status === 'not-started')

  const getFilter = () => {
    if (currentScreen === 'student-completed-courses') return 'completed'
    if (currentScreen === 'student-inprogress-courses') return 'in-progress'
    if (currentScreen === 'student-notstarted-courses') return 'not-started'
    return screenFilter || 'all'
  }

  const filter = getFilter()
  const filtered = filter === 'all' ? total : total.filter(e => e.status === filter)

  const getTitle = () => {
    if (filter === 'completed') return 'Completed Courses'
    if (filter === 'in-progress') return 'In Progress Courses'
    if (filter === 'not-started') return 'Not Yet Started'
    return 'My Learning'
  }

  const statCards: Array<{ label: string; value: number; icon: string; color: string; screen: Screen; filter: string }> = [
    { label: 'Total Courses', value: total.length, icon: '📚', color: '#7c3aed', screen: 'student-total-courses', filter: 'all' },
    { label: 'Completed', value: completed.length, icon: '✅', color: '#0d9488', screen: 'student-completed-courses', filter: 'completed' },
    { label: 'In Progress', value: inProgress.length, icon: '▶', color: '#3b82f6', screen: 'student-inprogress-courses', filter: 'in-progress' },
    { label: 'Not Started', value: notStarted.length, icon: '⏸', color: '#f59e0b', screen: 'student-notstarted-courses', filter: 'not-started' },
  ]

  const isSubScreen = filter !== 'all'

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>{getTitle()}</h1>
        <p className="text-sm mt-1" style={{ color: '#475569' }}>
          {filter === 'all' ? 'All your enrolled courses in one place.' :
           filter === 'completed' ? 'Courses you have successfully completed.' :
           filter === 'in-progress' ? 'Courses you are currently working on.' :
           'Enrolled courses you have not started yet.'}
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(s => (
          <button key={s.screen} onClick={() => navigate(s.screen, { filter: s.filter })} className="text-left transition-transform hover:scale-[1.02]">
            <div className={`rounded-xl p-5 flex items-center gap-4 transition-colors ${filter === s.filter ? 'ring-2 ring-[#7c3aed]' : ''}`}
              style={{ background: '#111827', border: '1px solid #1a2540' }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0" style={{ background: `${s.color}22` }}>
                {s.icon}
              </div>
              <div>
                <div className="text-2xl font-bold text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>{s.value}</div>
                <div className="text-sm" style={{ color: '#64748b' }}>{s.label}</div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Course list */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={filter === 'completed' ? '🏆' : filter === 'in-progress' ? '▶' : '📚'}
          title={`No ${getTitle()} yet`}
          message={filter === 'all' ? 'Enroll in courses to start your learning journey.' : `You don't have any ${getTitle().toLowerCase()} courses.`}
        />
      ) : (
        <div className={filter === 'all' || filter === 'in-progress' ? 'space-y-3' : 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4'}>
          {filtered.map(enrollment => {
            const course = courses.find(c => c.id === enrollment.courseId)
            if (!course) return null

            if (filter === 'in-progress' || filter === 'all') {
              return (
                <div key={enrollment.courseId} className="rounded-xl p-5 flex items-center gap-5 transition-colors"
                  style={{ background: '#111827', border: '1px solid #1a2540' }}>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                    style={{ background: enrollment.status === 'completed' ? 'rgba(13,148,136,0.15)' : 'rgba(124,58,237,0.15)' }}>
                    {enrollment.status === 'completed' ? '✅' : enrollment.status === 'not-started' ? '⏸' : '📚'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs" style={{ color: '#475569', fontFamily: 'JetBrains Mono, monospace' }}>{course.code}</span>
                      <StatusBadge status={enrollment.status} />
                    </div>
                    <div className="font-semibold text-white text-sm mb-1" style={{ fontFamily: 'Outfit, sans-serif' }}>{course.title}</div>
                    {enrollment.currentUnit && <div className="text-xs mb-2" style={{ color: '#64748b' }}>📍 {enrollment.currentUnit}</div>}
                    <div className="flex items-center gap-3">
                      <ProgressBar value={enrollment.progress} color={enrollment.status === 'completed' ? '#0d9488' : '#7c3aed'} />
                      <span className="text-xs flex-shrink-0" style={{ color: '#64748b' }}>{enrollment.progress}%</span>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    {/*TODO:Add the screen for the course detail view 
                    <Btn size="sm" variant={enrollment.status === 'completed' ? 'secondary' : 'primary'} onClick={() => StudentCourseDetail( { course, content:  course.units.find(u => u.title === enrollment.currentUnit)?.content})}>
                      {enrollment.status === 'completed' ? 'Review' : enrollment.status === 'not-started' ? 'Start →' : 'Continue →'}
                    </Btn>*/}
                    <Btn size="sm" variant={enrollment.status === 'completed' ? 'secondary' : 'primary'} onClick={() =>{
                      console.log('Course being passed:', course)
                      navigate( 'student-course-detail',{course, content:  course.units.find(u => u.title === enrollment.currentUnit)?.content})}}>
                      {enrollment.status === 'completed' ? 'Review' : enrollment.status === 'not-started' ? 'Start →' : 'Continue →'}
                    </Btn>
                  </div>
                </div>
              )
            }

            // Card layout for completed/not-started
            return (
              <div key={enrollment.courseId} className="rounded-xl p-5 flex flex-col gap-4"
                style={{ background: '#111827', border: '1px solid #1a2540' }}>
                <div>
                  <div className="text-xs mb-1" style={{ color: '#475569', fontFamily: 'JetBrains Mono, monospace' }}>{course.code}</div>
                  <h3 className="font-semibold text-white leading-snug" style={{ fontFamily: 'Outfit, sans-serif' }}>{course.title}</h3>
                  <div className="text-xs mt-1" style={{ color: '#64748b' }}>👤 {course.faculty}</div>
                </div>

                {filter === 'completed' && (
                  <div className="rounded-lg p-3" style={{ background: 'rgba(13,148,136,0.1)', border: '1px solid rgba(13,148,136,0.2)' }}>
                    <div className="text-xs font-medium" style={{ color: '#2dd4bf' }}>✓ Completed</div>
                    {enrollment.completedAt && <div className="text-xs mt-0.5" style={{ color: '#475569' }}>Completed on {enrollment.completedAt}</div>}
                  </div>
                )}

                {filter === 'not-started' && (
                  <div className="text-xs" style={{ color: '#475569' }}>
                    Enrolled {enrollment.enrolledAt} · Not started
                  </div>
                )}

                <Btn size="sm" variant={filter === 'completed' ? 'secondary' : 'teal'}>
                  {filter === 'completed' ? 'View Course' : 'Start Course →'}
                </Btn>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
