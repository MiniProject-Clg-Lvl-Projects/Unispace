import { useState } from 'react'
import { useApp } from '../../context'
import { Btn, Badge, StatusBadge } from '../../components/ui'
import { match } from 'node:assert/strict'

const STUDENT_ID = 'st1'

export default function SearchCourse() {
  const { courses, students, setCourses, setStudents, navigate, showToast } = useApp()
  const [query, setQuery] = useState('')
  const [catFilter, setCatFilter] = useState('All')
  const [levelFilter, setLevelFilter] = useState('All')
  const [enrolling, setEnrolling] = useState<string | null>(null)
  const [searched, setSearched] = useState(false)

  const me = students.find(s => s.id === STUDENT_ID)
  const myEnrolled = new Set(me?.enrolledCourses.map(e => e.courseId) ?? [])
  const categories = ['All', ...Array.from(new Set(courses.map(c => c.category)))]
  const levels = ['All', 'beginner', 'intermediate', 'advanced']

  const results = courses.filter(c => {
    if (!searched && !query) return false
    const matchQ = !query || c.title.toLowerCase().includes(query.toLowerCase()) || c.code.toLowerCase().includes(query.toLowerCase()) || c.faculty.toLowerCase().includes(query.toLowerCase())
    console.log(matchQ, c.title, query)
    const matchCat = catFilter === 'All' || c.category === catFilter
    const matchLevel = levelFilter === 'All' || c.level === levelFilter
    return matchQ && matchCat && matchLevel
  })

  const doSearch = () => { setSearched(true) }

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

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>Search Courses</h1>
        <p className="text-sm mt-1" style={{ color: '#475569' }}>Find courses by title, code, instructor, or category.</p>
      </div>

      {/* Search bar */}
      <div className="rounded-xl p-5" style={{ background: '#111827', border: '1px solid #1a2540' }}>
        <div className="flex gap-3 mb-4">
          <div className="relative flex-1">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl" style={{ color: '#475569' }}>🔍</span>
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && doSearch()}
              placeholder="Search by course title, code, or instructor…"
              className="w-full pl-12 pr-4 py-3 rounded-xl text-base outline-none"
              style={{ background: '#0a0f1a', border: '1px solid #1a2540', color: '#e2e8f0' }}
              onFocus={e => (e.target.style.borderColor = '#7c3aed')}
              onBlur={e => (e.target.style.borderColor = '#1a2540')}
            />
          </div>
          <Btn size="lg" onClick={doSearch}>Search</Btn>
        </div>
        <div className="flex gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-xs" style={{ color: '#475569' }}>Category:</span>
            <div className="flex gap-1.5">
              {categories.slice(0, 4).map(c => (
                <button key={c} onClick={() => setCatFilter(c)}
                  className="px-2.5 py-1 rounded text-xs transition-all"
                  style={{
                    background: catFilter === c ? '#7c3aed' : '#0a0f1a',
                    color: catFilter === c ? '#fff' : '#64748b',
                    border: `1px solid ${catFilter === c ? '#7c3aed' : '#1a2540'}`,
                  }}>
                  {c}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs" style={{ color: '#475569' }}>Level:</span>
            <div className="flex gap-1.5">
              {levels.map(l => (
                <button key={l} onClick={() => setLevelFilter(l)}
                  className="px-2.5 py-1 rounded text-xs capitalize transition-all"
                  style={{
                    background: levelFilter === l ? '#0d9488' : '#0a0f1a',
                    color: levelFilter === l ? '#fff' : '#64748b',
                    border: `1px solid ${levelFilter === l ? '#0d9488' : '#1a2540'}`,
                  }}>
                  {l}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      {searched && (
        <div>
          <p className="text-sm mb-4" style={{ color: '#475569' }}>
            {results.length} result{results.length !== 1 ? 's' : ''}{query ? ` for "${query}"` : ''}
          </p>
          <div className="space-y-3">
            {results.map(course => {
              const isEnrolled = myEnrolled.has(course.id)
              return (
                <div key={course.id} className="rounded-xl p-5 flex items-start gap-5 transition-colors"
                  style={{ background: '#111827', border: '1px solid #1a2540' }}>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                    style={{ background: 'rgba(124,58,237,0.12)' }}>📚</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-xs" style={{ color: '#475569', fontFamily: 'JetBrains Mono, monospace' }}>{course.code}</span>
                      <Badge variant="info">{course.level}</Badge>
                      <Badge>{course.category}</Badge>
                      {isEnrolled && <StatusBadge status="enrolled" />}
                    </div>
                    <h3 className="font-semibold text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>{course.title}</h3>
                    <p className="text-xs mt-1 line-clamp-2" style={{ color: '#64748b', lineHeight: '1.6' }}>{course.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs" style={{ color: '#475569' }}>
                      <span>👤 {course.faculty}</span>
                      {/* <span>📦 {course.units.length} units</span>
                      <span>👥 {course.enrolledStudents.length} enrolled</span> */}
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    {isEnrolled ? (
                      <Btn size="sm" variant="secondary" onClick={() => navigate('student-my-learning')}>Enrolled ✓</Btn>
                    ) : (
                      <Btn size="sm" variant="teal" disabled={enrolling === course.id}
                        onClick={() => enroll(course.id, course.title)}>
                        {enrolling === course.id ? 'Enrolling…' : 'Enroll →'}
                      </Btn>
                    )}
                  </div>
                </div>
              )
            })}
            {results.length === 0 && (
              <div className="py-16 text-center rounded-xl" style={{ background: '#111827', border: '1px solid #1a2540' }}>
                <div className="text-4xl mb-3">🔍</div>
                <p className="text-white font-medium mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>No courses found</p>
                <p className="text-sm" style={{ color: '#475569' }}>Try a different search term or adjust your filters.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {!searched && (
        <div className="rounded-xl p-10 text-center" style={{ background: '#111827', border: '1px solid #1a2540' }}>
          <div className="text-5xl mb-4">🔍</div>
          <p className="text-white font-semibold mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>Search for your next course</p>
          <p className="text-sm" style={{ color: '#475569' }}>Type a keyword above and press Search or hit Enter.</p>
        </div>
      )}
    </div>
  )
}
