import { useApp } from '../../context'
import { Btn, EmptyState, StatusBadge, ProgressBar } from '../../components/ui'
import {enrollCourse} from '../../services/courseService'
import { ICourse, IEnrolledCourse, IStudent } from '@/types'
import {getStudentDetail} from '../../services/LoginServices'

export default function Learners() {
  const {currentUser, selectedCourse: course, students, navigate } = useApp()

  if (!course) return <EmptyState icon="👥" title="No course selected" message="Select a course to view learners." />
  
  // Fetch student from the course
  const learners = students.filter(s => course.enrolledStudents.includes(s.id))
  const enrollment = (studentId: string) => students.find(s => s.id === studentId)?.enrolledCourses.find(e => e.course.id === course.id)

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>Learners</h1>
          <p className="text-sm mt-1" style={{ color: '#475569' }}>{course.title} · {learners.length} enrolled students</p>
        </div>
        <Btn variant="teal" onClick={() => navigate('faculty-assign-students', { course })}>+ Assign Students</Btn>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Enrolled', value: learners.length, color: '#7c3aed' },
          { label: 'Completed', value: learners.filter(s => enrollment(s.id)?.status === 'completed').length, color: '#0d9488' },
          { label: 'In Progress', value: learners.filter(s => enrollment(s.id)?.status === 'in-progress').length, color: '#3b82f6' },
          { label: 'Not Started', value: learners.filter(s => enrollment(s.id)?.status === 'not-started').length, color: '#f59e0b' },
        ].map(s => (
          <div key={s.label} className="rounded-xl p-4 text-center" style={{ background: '#111827', border: '1px solid #1a2540' }}>
            <div className="text-2xl font-bold" style={{ color: s.color, fontFamily: 'Outfit, sans-serif' }}>{s.value}</div>
            <div className="text-xs mt-1" style={{ color: '#475569' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {learners.length === 0 ? (
        <div className="rounded-xl p-12 text-center" style={{ background: '#111827', border: '1px solid #1a2540' }}>
          <div className="text-4xl mb-4">👥</div>
          <p className="text-white font-medium mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>No learners yet</p>
          <p className="text-sm mb-5" style={{ color: '#475569' }}>Assign students or share the course link for self-enrollment.</p>
          <Btn onClick={() => navigate('faculty-assign-students', { course })}>Assign Students</Btn>
        </div>
      ) : (
        <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #1a2540' }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: '#0a0f1a', borderBottom: '1px solid #1a2540' }}>
                {['Student', 'Student ID', 'Email', 'Status', 'Progress', 'Current Unit', 'Enrolled'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: '#334155', fontFamily: 'JetBrains Mono, monospace' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {learners.map((student, i) => {
                const enroll = enrollment(student.id)
                return (
                  <tr key={student.id} style={{ background: i % 2 === 0 ? '#111827' : '#0d1420', borderBottom: '1px solid #1a2540' }}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                          style={{ background: '#0d9488' }}>
                          {student.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                        </div>
                        <span className="font-medium text-white">{student.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span style={{ color: '#64748b', fontFamily: 'JetBrains Mono, monospace' }} className="text-xs">{student.studentId}</span>
                    </td>
                    <td className="px-4 py-3 text-xs" style={{ color: '#64748b' }}>{student.email}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={enroll?.status ?? 'not-started'} />
                    </td>
                    <td className="px-4 py-3 min-w-24">
                      <div className="flex items-center gap-2">
                        <ProgressBar value={enroll?.progress ?? 0} color={enroll?.status === 'completed' ? '#0d9488' : '#7c3aed'} />
                        <span className="text-xs flex-shrink-0" style={{ color: '#64748b' }}>{enroll?.progress ?? 0}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs" style={{ color: '#475569' }}>
                      {enroll?.currentUnit || '—'}
                    </td>
                    <td className="px-4 py-3 text-xs" style={{ color: '#334155', fontFamily: 'JetBrains Mono, monospace' }}>
                      {enroll?.enrolledAt || '—'}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
