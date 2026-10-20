import { useState } from 'react'
import { useApp } from '../../context'
import { StatusBadge, Btn, Badge } from '../../components/ui'
import type { ICourse } from '../../types'

export default function CourseApproval() {
  const { courses, setCourses, navigate, showToast } = useApp()
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all')

  const filtered = courses.filter(c => filter === 'all' || c.approvalStatus === filter)

  // const approve = (course: ICourse) => {
  //   setCourses(prev => prev.map(c => c.id === course.id ? { ...c, approvalStatus: 'approved', status: 'approved' } : c))
  //   showToast(`"${course.title}" approved successfully.`)
  // }

  // const reject = (course: ICourse) => {
  //   setCourses(prev => prev.map(c => c.id === course.id ? { ...c, approvalStatus: 'rejected', status: 'rejected' } : c))
  //   showToast(`"${course.title}" rejected.`, 'error')
  // }
   const updateApproval = async (
  course: ICourse,
  approvalStatus: 'approved' | 'rejected'
) => {
  try {
    const response = await fetch(
      `http://localhost:3000/api/courses/${encodeURIComponent(course.id)}/approval`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ approvalStatus })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Update failed');
    }

    setCourses(prev =>
      prev.map(c =>
        c.id === course.id
          ? { ...c, ...data.course }
          : c
      )
    );

    showToast(
      approvalStatus === 'approved'
        ? `"${course.title}" approved successfully.`
        : `"${course.title}" rejected.`
    );
  } catch (error) {
    console.error('Approval update failed:', error);
    showToast('Could not update approval. Please try again.', 'error');
  }
};

const approve = (course: ICourse) =>
  updateApproval(course, 'approved');

const reject = (course: ICourse) =>
  updateApproval(course, 'rejected');
  const tabs = [
    { key: 'all' as const, label: 'All Courses', count: courses.length },
    { key: 'pending' as const, label: 'Pending', count: courses.filter(c => c.approvalStatus === 'pending').length },
    { key: 'approved' as const, label: 'Approved', count: courses.filter(c => c.approvalStatus === 'approved').length },
    { key: 'rejected' as const, label: 'Rejected', count: courses.filter(c => c.approvalStatus === 'rejected').length },
  ]

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>Course List Approval</h1>
        <p className="text-sm mt-1" style={{ color: '#475569' }}>Review and approve courses submitted for publication.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl w-fit" style={{ background: '#0a0f1a' }}>
        {tabs.map(tab => (
          <button key={tab.key} onClick={() => setFilter(tab.key)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
            style={{
              background: filter === tab.key ? '#1a2540' : 'transparent',
              color: filter === tab.key ? '#e2e8f0' : '#475569',
            }}>
            {tab.label}
            <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: filter === tab.key ? '#253455' : '#111827', color: '#64748b' }}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #1a2540' }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: '#0a0f1a', borderBottom: '1px solid #1a2540' }}>
              {['Course', 'Code', 'Faculty', 'Category', 'Level', 'Approval', 'Actions'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: '#334155', fontFamily: 'JetBrains Mono, monospace' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((course, i) => (
              <tr key={course.id}
                style={{ background: i % 2 === 0 ? '#111827' : '#0d1420', borderBottom: '1px solid #1a2540' }}>
                <td className="px-4 py-3">
                  <button className="text-left hover:text-[#a78bfa] transition-colors text-white font-medium" style={{ fontFamily: 'Outfit, sans-serif' }}
                    onClick={() => navigate('faculty-course-info', { course })}>
                    {course.title}
                  </button>
                  <div className="text-xs mt-0.5" style={{ color: '#334155' }}>{course.createdAt}</div>
                </td>
                <td className="px-4 py-3">
                  <span style={{ color: '#64748b', fontFamily: 'JetBrains Mono, monospace' }} className="text-xs">{course.code}</span>
                </td>
                <td className="px-4 py-3 text-xs" style={{ color: '#94a3b8' }}>{course.faculty}</td>
                <td className="px-4 py-3">
                  <Badge>{course.category}</Badge>
                </td>
                <td className="px-4 py-3">
                  <Badge variant="info">{course.level}</Badge>
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={course.approvalStatus} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Btn size="sm" variant="ghost" onClick={() => navigate('faculty-course-info', { course })}>View</Btn>
                    {course.approvalStatus === 'pending' && (
                      <>
                        <Btn size="sm" variant="teal" onClick={() => approve(course)}>Approve</Btn>
                        <Btn size="sm" variant="danger" onClick={() => reject(course)}>Reject</Btn>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="py-16 text-center" style={{ color: '#334155' }}>No courses found.</div>
        )}
      </div>
    </div>
  )
}
