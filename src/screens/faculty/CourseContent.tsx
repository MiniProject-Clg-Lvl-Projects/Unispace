import { useState } from 'react'
import { useApp } from '../../context'
import { Btn, Modal, Input, EmptyState } from '../../components/ui'
import type { ICourse } from '../../types'

export default function CourseContent() {
  const { selectedCourse, setCourses, navigate, showToast } = useApp()
  const [showAddUnit, setShowAddUnit] = useState(false)
  const [unitTitle, setUnitTitle] = useState('')
  const [expandedUnit, setExpandedUnit] = useState<string | null>(null)

  if (!selectedCourse) return <EmptyState icon="📝" title="No course selected" message="Select a course first." />

  const course = selectedCourse

  const addUnit = () => {
    if (!unitTitle.trim()) return
    const newUnit = { id: `u_${Date.now()}`, title: unitTitle.trim(), content: [] }
    setCourses(prev => prev.map(c => c.id === course.id ? { ...c, units: [...c.units, newUnit] } : c))
    showToast(`Unit "${unitTitle}" added successfully.`)
    setUnitTitle('')
    setShowAddUnit(false)
  }

  const requestApproval = () => {
    setCourses((prev: ICourse[]) => prev.map((c: ICourse) => c.id === course.id ? { ...c, approvalStatus: 'pending', status: 'pending' } : c))
    showToast('Course sent for approval.', 'info')
  }

  const markInProgress = () => {
    setCourses((prev: ICourse[]) => prev.map((c: ICourse) => c.id === course.id ? { ...c, status: 'in-progress' } : c))
    showToast('Course marked as In Progress.')
    navigate('faculty-selected-course', { course: { ...course, status: 'in-progress' } })
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>Course Content</h1>
          <p className="text-sm mt-1" style={{ color: '#64748b' }}>{course.title} · {course.code}</p>
        </div>
        <Btn onClick={() => setShowAddUnit(true)}>+ Add Unit</Btn>
      </div>

      {/* Course overview */}
      <div className="rounded-xl p-5" style={{ background: '#111827', border: '1px solid #1a2540' }}>
        <h2 className="font-semibold text-white mb-3" style={{ fontFamily: 'Outfit, sans-serif' }}>Overview</h2>
        <p className="text-sm" style={{ color: '#64748b', lineHeight: '1.7' }}>{course.description}</p>
        <div className="flex gap-4 mt-4 text-xs" style={{ color: '#475569' }}>
          <span>📦 {course.units.length} units</span>
          <span>📋 {course.syllabus.length} syllabus topics</span>
          <span>🔬 {course.experiments.length} experiments</span>
          <span>👥 {course.enrolledStudents.length} enrolled</span>
        </div>
      </div>

      {/* Units */}
      <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #1a2540' }}>
        <div className="px-5 py-4 flex items-center justify-between" style={{ background: '#0a0f1a', borderBottom: '1px solid #1a2540' }}>
          <h2 className="font-semibold text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>Units & Content</h2>
          <Btn size="sm" variant="outline" onClick={() => setShowAddUnit(true)}>+ Add Unit</Btn>
        </div>
        {course.units.length === 0 ? (
          <div className="p-8 text-center" style={{ background: '#111827' }}>
            <div className="text-3xl mb-3">📦</div>
            <p className="text-sm" style={{ color: '#475569' }}>No units yet. Add your first unit.</p>
            <Btn className="mt-4" size="sm" onClick={() => setShowAddUnit(true)}>+ Add First Unit</Btn>
          </div>
        ) : (
          <div style={{ background: '#111827' }}>
            {course.units.map((unit, idx) => (
              <div key={unit.id} style={{ borderBottom: '1px solid #1a2540' }}>
                <button
                  className="w-full flex items-center gap-3 px-5 py-4 text-left transition-colors"
                  style={{ color: '#e2e8f0' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#141d2e')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  onClick={() => setExpandedUnit(expandedUnit === unit.id ? null : unit.id)}>
                  <span className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
                    style={{ background: 'rgba(124,58,237,0.15)', color: '#a78bfa' }}>{idx + 1}</span>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{unit.title}</div>
                    <div className="text-xs mt-0.5" style={{ color: '#475569' }}>{unit.content.length} items</div>
                  </div>
                  <span style={{ color: '#334155' }}>{expandedUnit === unit.id ? '▲' : '▼'}</span>
                </button>
                {expandedUnit === unit.id && (
                  <div className="px-14 pb-4 space-y-2">
                    {unit.content.length === 0 ? (
                      <p className="text-sm py-2" style={{ color: '#334155' }}>No content items in this unit.</p>
                    ) : (
                      unit.content.map(item => (
                        <div key={item.id} className="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors"
                          style={{ background: '#0a0f1a' }}
                          onClick={() => navigate('faculty-document-preview', { content: course.units.find(e => e.title === unit.title)?.content, course })}>
                          <span className="text-sm">{item.type === 'pdf' ? '📄' : item.type === 'video' ? '🎥' : '❓'}</span>
                          <span className="text-sm text-white">{item.title}</span>
                          <span className="ml-auto text-xs" style={{ color: '#475569' }}>{item.type}</span>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="rounded-xl p-5 space-y-4" style={{ background: '#111827', border: '1px solid #1a2540' }}>
        <h2 className="font-semibold text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="rounded-lg p-4" style={{ background: '#0a0f1a', border: '1px solid #1a2540' }}>
            <h3 className="text-sm font-medium text-white mb-1">Request for Approval</h3>
            <p className="text-xs mb-3" style={{ color: '#475569' }}>Submit this course to admin for review and approval.</p>
            <Btn size="sm" variant="outline" onClick={requestApproval}>Request Approval</Btn>
          </div>
          <div className="rounded-lg p-4" style={{ background: '#0a0f1a', border: '1px solid #1a2540' }}>
            <h3 className="text-sm font-medium text-white mb-1">Mark as In Progress</h3>
            <p className="text-xs mb-3" style={{ color: '#475569' }}>Start working on this course and navigate to the selected course view.</p>
            <Btn size="sm" variant="teal" onClick={markInProgress}>Mark In Progress →</Btn>
          </div>
        </div>
      </div>

      {/* Syllabus section */}
      <div className="rounded-xl p-5" style={{ background: '#111827', border: '1px solid #1a2540' }}>
        <h2 className="font-semibold text-white mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>Syllabus</h2>
        {course.syllabus.map((s, i) => (
          <div key={s.id} className="flex items-start gap-3 py-2.5" style={{ borderBottom: i < course.syllabus.length - 1 ? '1px solid #1a2540' : 'none' }}>
            <span className="text-xs font-mono flex-shrink-0 mt-1" style={{ color: '#475569', fontFamily: 'JetBrains Mono, monospace', minWidth: '20px' }}>{i + 1}.</span>
            <div className="flex-1">
              <span className="text-sm text-white">{s.topic}</span>
              {s.description && <p className="text-xs mt-0.5" style={{ color: '#475569' }}>{s.description}</p>}
            </div>
            <span className="text-xs flex-shrink-0" style={{ color: '#64748b' }}>{s.hours}h</span>
          </div>
        ))}
      </div>

      {/* Experiments section */}
      <div className="rounded-xl p-5" style={{ background: '#111827', border: '1px solid #1a2540' }}>
        <h2 className="font-semibold text-white mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>Experiments</h2>
        {course.experiments.map(e => (
          <div key={e.id} className="p-3 rounded-lg mb-2" style={{ background: '#0a0f1a' }}>
            <div className="flex items-start justify-between">
              <div>
                <div className="text-sm font-medium text-white">{e.title}</div>
                <div className="text-xs mt-1" style={{ color: '#64748b' }}>{e.description}</div>
                <div className="text-xs mt-1" style={{ color: '#334155' }}>🔧 {e.materials}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Unit Modal */}
      <Modal open={showAddUnit} onClose={() => { setShowAddUnit(false); setUnitTitle('') }} title="Add New Unit">
        <div className="space-y-4">
          <Input label="Unit Title" value={unitTitle} onChange={e => setUnitTitle(e.target.value)}
            placeholder="e.g. Unit 1: Introduction to the Subject" autoFocus />
          <div className="flex gap-3 justify-end">
            <Btn variant="ghost" onClick={() => { setShowAddUnit(false); setUnitTitle('') }}>Cancel</Btn>
            <Btn onClick={addUnit} disabled={!unitTitle.trim()}>Add Unit</Btn>
          </div>
        </div>
      </Modal>
    </div>
  )
}
