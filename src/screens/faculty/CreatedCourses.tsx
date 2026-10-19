import { useState } from 'react'
import { useApp } from '../../context'
import { Btn, StatusBadge, ProgressBar, EmptyState } from '../../components/ui'

export default function CreatedCourses() {
  const {currentUser, courses, navigate } = useApp()
  const [search, setSearch] = useState('')

  const myCourses = courses.filter(c =>
    c.facultyId === currentUser?.id &&
    (c.title.toLowerCase().includes(search.toLowerCase()) || c.code.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>Created Courses</h1>
          <p className="text-sm mt-1" style={{ color: '#475569' }}>All courses you've created — manage content, learners, and approvals.</p>
        </div>
        <Btn onClick={() => navigate('faculty-create-course')}>+ Create Course</Btn>
      </div>

      {/* Search */}
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm" style={{ color: '#475569' }}>🔍</span>
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search by course title or code…"
          className="w-full pl-9 pr-4 py-2.5 rounded-lg text-sm outline-none"
          style={{ background: '#111827', border: '1px solid #1a2540', color: '#e2e8f0' }}
          onFocus={e => (e.target.style.borderColor = '#7c3aed')}
          onBlur={e => (e.target.style.borderColor = '#1a2540')}
        />
      </div>

      {myCourses.length === 0 ? (
        <EmptyState icon="🗂" title="No courses yet" message="Create your first course to get started." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {myCourses.map(course => {
            const progress = course.status === 'approved' ? 100 : course.status === 'in-progress' ? 60 : course.status === 'pending' ? 30 : 10
            return (
              <div key={course.id} className="rounded-xl p-5 flex flex-col gap-4 transition-colors cursor-pointer group"
                style={{ background: '#111827', border: '1px solid #1a2540' }}
                onClick={() => navigate('faculty-course-info', { course })}>
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <span className="text-xs" style={{ color: '#475569', fontFamily: 'JetBrains Mono, monospace' }}>{course.code}</span>
                    <h3 className="font-semibold text-white mt-0.5 leading-snug group-hover:text-[#a78bfa] transition-colors" style={{ fontFamily: 'Outfit, sans-serif' }}>
                      {course.title}
                    </h3>
                  </div>
                  <StatusBadge status={course.approvalStatus} />
                </div>

                <p className="text-xs line-clamp-2" style={{ color: '#475569', lineHeight: '1.6' }}>{course.description}</p>

                <div className="flex items-center gap-4 text-xs" style={{ color: '#475569' }}>
                  <span>👥 {course.enrolledStudents.length} students</span>
                  <span>📦 {course.units.length} units</span>
                  <span>🏷 {course.level}</span>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1.5" style={{ color: '#64748b' }}>
                    <span>Completion</span><span>{progress}%</span>
                  </div>
                  <ProgressBar value={progress} color={progress === 100 ? '#0d9488' : '#7c3aed'} />
                </div>

                <div className="flex gap-2 pt-1" onClick={e => e.stopPropagation()}>
                  <Btn size="sm" variant="primary" onClick={() => navigate('faculty-course-info', { course })}>View Course</Btn>
                  <Btn size="sm" variant="secondary" onClick={() => navigate('faculty-course-content', { course })}>Edit Content</Btn>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
