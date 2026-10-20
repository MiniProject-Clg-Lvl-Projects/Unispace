import { useState } from 'react'
import { useApp } from '../../context'
import { Btn, EmptyState } from '../../components/ui'

export default function AssignStudents() {
  const { selectedCourse: course, students, setCourses, setStudents, navigate, showToast } = useApp()
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<string[]>([])

  if (!course) return <EmptyState icon="👥" title="No course selected" message="Select a course first." />

  

  const unassigned = students.filter(s =>
    !course.enrolledStudents.includes(s.id) &&
    (s.name.toLowerCase().includes(search.toLowerCase()) || s.studentId.toLowerCase().includes(search.toLowerCase()) || s.email.toLowerCase().includes(search.toLowerCase()))
  )
  const assigned = students.filter(s => course.enrolledStudents.includes(s.id))

  const toggle = (id: string) => setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])

  const assignSelected = () => {
    if (selected.length === 0) return
    const now = new Date().toISOString().split('T')[0]
    setCourses(prev => prev.map(c => c.id === course.id
      ? { ...c, enrolledStudents: [...c.enrolledStudents, ...selected] }
      : c
    ))
    setStudents(prev => prev.map(s =>
      selected.includes(s.id)
        ? { ...s, enrolledCourses: [...s.enrolledCourses, { course: course.code, progress: 0, status: 'not-started', enrolledAt: now,completedItems:[] }] }
        : s
    ))
    showToast(`${selected.length} student(s) assigned to "${course.title}".`)
    setSelected([])
    navigate('faculty-learners', { course })
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>Assign Students</h1>
          <p className="text-sm mt-1" style={{ color: '#475569' }}>{course.title} — select students to assign</p>
        </div>
        {selected.length > 0 && (
          <Btn onClick={assignSelected}>Assign {selected.length} Student{selected.length > 1 ? 's' : ''}</Btn>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Available students */}
        <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #1a2540' }}>
          <div className="px-4 py-3" style={{ background: '#0a0f1a', borderBottom: '1px solid #1a2540' }}>
            <h3 className="font-medium text-white text-sm mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>Available Students</h3>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search students…"
              className="w-full px-3 py-2 rounded-lg text-sm outline-none"
              style={{ background: '#111827', border: '1px solid #1a2540', color: '#e2e8f0' }}
              onFocus={e => (e.target.style.borderColor = '#7c3aed')}
              onBlur={e => (e.target.style.borderColor = '#1a2540')} />
          </div>
          <div style={{ background: '#111827', maxHeight: '400px', overflowY: 'auto' }}>
            {unassigned.length === 0 ? (
              <div className="p-6 text-center text-sm" style={{ color: '#334155' }}>
                {search ? 'No students match your search.' : 'All students are already enrolled.'}
              </div>
            ) : (
              unassigned.map(student => {
                const isSelected = selected.includes(student.id)
                return (
                  <div key={student.id}
                    className="flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors"
                    style={{ borderBottom: '1px solid #1a2540', background: isSelected ? 'rgba(124,58,237,0.08)' : 'transparent' }}
                    onClick={() => toggle(student.id)}
                    onMouseEnter={e => { if (!isSelected) (e.currentTarget.style.background = '#141d2e') }}
                    onMouseLeave={e => { if (!isSelected) (e.currentTarget.style.background = 'transparent') }}>
                    <div className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 transition-colors ${isSelected ? 'text-white' : ''}`}
                      style={{ border: isSelected ? 'none' : '1px solid #1e2d4e', background: isSelected ? '#7c3aed' : 'transparent' }}>
                      {isSelected && <span className="text-xs">✓</span>}
                    </div>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                      style={{ background: '#334155' }}>
                      {student.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-white">{student.name}</div>
                      <div className="text-xs" style={{ color: '#475569' }}>{student.studentId} · {student.email}</div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
          {selected.length > 0 && (
            <div className="px-4 py-3 flex items-center justify-between" style={{ background: '#0a0f1a', borderTop: '1px solid #1a2540' }}>
              <span className="text-xs" style={{ color: '#64748b' }}>{selected.length} selected</span>
              <Btn size="sm" onClick={assignSelected}>Assign Selected →</Btn>
            </div>
          )}
        </div>

        {/* Already enrolled */}
        <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #1a2540' }}>
          <div className="px-4 py-3" style={{ background: '#0a0f1a', borderBottom: '1px solid #1a2540' }}>
            <h3 className="font-medium text-white text-sm" style={{ fontFamily: 'Outfit, sans-serif' }}>
              Enrolled Students ({assigned.length})
            </h3>
          </div>
          <div style={{ background: '#111827', maxHeight: '420px', overflowY: 'auto' }}>
            {assigned.length === 0 ? (
              <div className="p-6 text-center text-sm" style={{ color: '#334155' }}>No enrolled students yet.</div>
            ) : (
              assigned.map(student => {
                const enroll = student.enrolledCourses.find(e => e.course === course.code)
                return (
                  <div key={student.id} className="flex items-center gap-3 px-4 py-3" style={{ borderBottom: '1px solid #1a2540' }}>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                      style={{ background: '#0d9488' }}>
                      {student.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-white">{student.name}</div>
                      <div className="text-xs" style={{ color: '#475569' }}>{student.studentId}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-medium" style={{ color: '#2dd4bf' }}>{enroll?.progress ?? 0}%</div>
                      <div className="text-xs capitalize" style={{ color: '#475569' }}>{enroll?.status?.replace('-', ' ')}</div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
