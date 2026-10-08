import { useState } from 'react'
import { useApp } from '../../context'
import { Btn, Badge, StatusBadge } from '../../components/ui'

const STUDENT_ID = 'st1'

export default function GlobalCourses() {
  const { courses, students, setCourses, setStudents, navigate, showToast } = useApp()
  const [activeTab, setActiveTab] = useState<'global' | 'institute'>('global')
  const [enrolling, setEnrolling] = useState<string | null>(null)

  const me = students.find(s => s.id === STUDENT_ID)
  const myEnrolled = new Set(me?.enrolledCourses.map(e => e.courseId) ?? [])
  const available = courses.filter(c => c.approvalStatus === 'approved')

  const enroll = (courseId: string, courseTitle: string) => {
    setEnrolling(courseId)
    const now = new Date().toISOString().split('T')[0]
    setTimeout(() => {
      setCourses(prev => prev.map(c => c.id === courseId ? { ...c, enrolledStudents: [...c.enrolledStudents, STUDENT_ID] } : c))
      setStudents(prev => prev.map(s =>
        s.id === STUDENT_ID
          ? { ...s, enrolledCourses: [...s.enrolledCourses, { courseId, progress: 0, status: 'not-started', currentUnit: '', enrolledAt: now }] }
          : s
      ))
      showToast(`Successfully enrolled in "${courseTitle}"!`)
      setEnrolling(null)
    }, 600)
  }

  const categoryColors: Record<string, string> = {
    'Computer Science': '#7c3aed',
    'Artificial Intelligence': '#0d9488',
    'Web Technology': '#3b82f6',
    'Data Science': '#f59e0b',
    'Cybersecurity': '#ef4444',
    'Mathematics': '#8b5cf6',
  }
  console.log('Available courses:', available)
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>Institute Courses</h1>
        <p className="text-sm mt-1" style={{ color: '#475569' }}>Browse and enroll in courses offered by the institution.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl w-fit" style={{ background: '#0a0f1a' }}>
        {[{ key: 'global' as const, label: '🌐 Global Courses' }, { key: 'institute' as const, label: '🏛 Institute Courses' }].map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className="px-5 py-2 rounded-lg text-sm font-medium transition-all"
            style={{ background: activeTab === tab.key ? '#1a2540' : 'transparent', color: activeTab === tab.key ? '#e2e8f0' : '#475569' }}>
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {available.map(course => {
          const isEnrolled = myEnrolled.has(course.id)
          const color = categoryColors[course.category] ?? '#7c3aed'

          return (
            <div key={course.id} className="rounded-xl flex flex-col overflow-hidden transition-colors"
              style={{ background: '#111827', border: '1px solid #1a2540' }}>
              {/* Color bar */}
              <div className="h-1.5" style={{ background: `linear-gradient(90deg, ${color}, ${color}88)` }} />
              <div className="p-5 flex flex-col gap-4 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-xs" style={{ color: '#475569', fontFamily: 'JetBrains Mono, monospace' }}>{course.code}</span>
                      <Badge variant="info">{course.level}</Badge>
                    </div>
                    <h3 className="font-semibold text-white leading-snug" style={{ fontFamily: 'Outfit, sans-serif' }}>{course.title}</h3>
                  </div>
                  {isEnrolled && <StatusBadge status="enrolled" />}
                </div>

                <p className="text-xs line-clamp-3" style={{ color: '#64748b', lineHeight: '1.7', flex: 1 }}>{course.description}</p>

                <div className="flex items-center justify-between text-xs" style={{ color: '#475569' }}>
                  <span>👤 {course.faculty}</span>
                  {/* <span>👥 {course.enrolledStudents.length} enrolled</span> */}
                </div>

                <div className="flex items-center gap-3 text-xs" style={{ color: '#334155' }}>
                  {/* <span>📦 {course.units.length} units</span>
                  <span>📝 {course.syllabus.length} topics</span>
                  <span>🔬 {course.experiments.length} labs</span> */}
                </div>

                {isEnrolled ? (
                  <Btn size="sm" variant="secondary" className="justify-center" onClick={() => navigate('student-my-learning')}>
                    ✓ Enrolled — Go to My Learning
                  </Btn>
                ) : (
                  <Btn size="sm" variant="teal" className="justify-center"
                    disabled={enrolling === course.id}
                    onClick={() => enroll(course.id, course.title)}>
                    {enrolling === course.id ? 'Enrolling…' : 'Enroll Now →'}
                  </Btn>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {available.length === 0 && (
        <div className="py-16 text-center" style={{ color: '#334155' }}>No courses available right now.</div>
      )}
    </div>
  )
}
