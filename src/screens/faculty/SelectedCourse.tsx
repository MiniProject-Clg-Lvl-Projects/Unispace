import { useState } from 'react'
import { useApp } from '../../context'
import { Btn, Modal, Input, Textarea, StatusBadge, ProgressBar, EmptyState } from '../../components/ui'
import type { ICourse } from '../../types'
import {createUnit} from '../../services/courseService'

export default function SelectedCourse() {
  const { selectedCourse, setCourses, navigate, showToast } = useApp()
  const [showAddUnit, setShowAddUnit] = useState(false)
  const [unitTitle, setUnitTitle] = useState('')
  const [showSyllabusModal, setShowSyllabusModal] = useState(false)
  const [showExpModal, setShowExpModal] = useState(false)
  const [syllabusForm, setSyllabusForm] = useState({ topic: '', hours: '4', description: '' })
  const [expForm, setExpForm] = useState({ title: '', description: '', materials: '' })
  const [editSyllabusId, setEditSyllabusId] = useState<string | null>(null)
  const [editExpId, setEditExpId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'content' | 'syllabus' | 'experiments'>('content')

  if (!selectedCourse) return <EmptyState icon="📚" title="No course selected" message="Select a course to view." />

  const course = selectedCourse
  const progress = Math.min(100, Math.round((course.units.length / 5) * 100))

  const addUnit = () => {
    if (!unitTitle.trim()) return
    const newUnit = { id: `u_${Date.now()}`, title: unitTitle.trim(), content: [] }
    setCourses(prev => prev.map(c => c.id === course.id ? { ...c, units: [...c.units, newUnit] } : c))
    createUnit(newUnit,course.code);
    showToast(`Unit "${unitTitle}" added.`)
    setUnitTitle(''); setShowAddUnit(false)
  }

  const deleteSyllabus = (id: string) => {
    setCourses(prev => prev.map(c => c.id === course.id ? { ...c, syllabus: c.syllabus.filter(s => s.id !== id) } : c))
    showToast('Syllabus topic removed.')
  }

  const deleteExp = (id: string) => {
    setCourses(prev => prev.map(c => c.id === course.id ? { ...c, experiments: c.experiments.filter(e => e.id !== id) } : c))
    showToast('Experiment removed.')
  }

  const saveSyllabus = () => {
    if (!syllabusForm.topic.trim()) return
    setCourses(prev => prev.map(c => {
      if (c.id !== course.id) return c
      if (editSyllabusId) {
        return { ...c, syllabus: c.syllabus.map(s => s.id === editSyllabusId ? { ...s, ...syllabusForm, hours: parseInt(syllabusForm.hours) } : s) }
      }
      return { ...c, syllabus: [...c.syllabus, { id: `s_${Date.now()}`, ...syllabusForm, hours: parseInt(syllabusForm.hours) }] }
    }))
    showToast(editSyllabusId ? 'Syllabus topic updated.' : 'Syllabus topic added.')
    setSyllabusForm({ topic: '', hours: '4', description: '' }); setEditSyllabusId(null); setShowSyllabusModal(false)
  }

  const saveExp = () => {
    if (!expForm.title.trim()) return
    setCourses(prev => prev.map(c => {
      if (c.id !== course.id) return c
      if (editExpId) {
        return { ...c, experiments: c.experiments.map(e => e.id === editExpId ? { ...e, ...expForm } : e) }
      }
      return { ...c, experiments: [...c.experiments, { id: `e_${Date.now()}`, ...expForm }] }
    }))
    showToast(editExpId ? 'Experiment updated.' : 'Experiment added.')
    setExpForm({ title: '', description: '', materials: '' }); setEditExpId(null); setShowExpModal(false)
  }

  const tabs = [
    { key: 'content' as const, label: 'Content' },
    { key: 'syllabus' as const, label: `Syllabus (${course.syllabus.length})` },
    { key: 'experiments' as const, label: `Experiments (${course.experiments.length})` },
  ]

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="rounded-xl p-5" style={{ background: '#111827', border: '1px solid #1a2540' }}>
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs" style={{ color: '#475569', fontFamily: 'JetBrains Mono, monospace' }}>{course.code}</span>
              <StatusBadge status={course.status} />
            </div>
            <h1 className="text-xl font-bold text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>{course.title}</h1>
          </div>
          <Btn size="sm" onClick={() => setShowAddUnit(true)}>+ Add Unit</Btn>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <div className="flex justify-between text-xs mb-1.5" style={{ color: '#64748b' }}>
              <span>Course Progress</span><span>{progress}%</span>
            </div>
            <ProgressBar value={progress} />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl w-fit" style={{ background: '#0a0f1a' }}>
        {tabs.map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
            style={{
              background: activeTab === t.key ? '#1a2540' : 'transparent',
              color: activeTab === t.key ? '#e2e8f0' : '#475569',
            }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Content tab */}
      {activeTab === 'content' && (
        <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #1a2540' }}>
          <div className="px-5 py-4" style={{ background: '#0a0f1a', borderBottom: '1px solid #1a2540' }}>
            <h2 className="font-semibold text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>Units</h2>
          </div>
          <div style={{ background: '#111827' }}>
            {course.units.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-sm mb-4" style={{ color: '#334155' }}>No units yet.</p>
                <Btn size="sm" onClick={() => setShowAddUnit(true)}>+ Add First Unit</Btn>
              </div>
            ) : (
              course.units.map((unit, idx) => (
                <div key={unit.id} className="px-5 py-4" style={{ borderBottom: '1px solid #1a2540' }}>
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
                      style={{ background: 'rgba(124,58,237,0.15)', color: '#a78bfa' }}>{idx + 1}</span>
                    <div className="flex-1">
                      <div className="font-medium text-sm text-white">{unit.title}</div>
                      <div className="text-xs mt-0.5" style={{ color: '#475569' }}>{unit.content.length} content items</div>
                    </div>
                    <Btn size="sm" variant="ghost" onClick={() => navigate('faculty-course-preview', { course })}>Preview</Btn>
                  </div>
                  {unit.content.length > 0 && (
                    <div className="mt-3 ml-10 space-y-1.5">
                      {unit.content.map(item => (
                        <div key={item.id} className="flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors"
                          style={{ background: '#0a0f1a' }}
                          onClick={() => navigate('faculty-document-preview', { content: item, course })}>
                          <span>{item.type === 'pdf' ? '📄' : item.type === 'video' ? '🎥' : '❓'}</span>
                          <span className="text-sm text-white">{item.title}</span>
                          <span className="ml-auto text-xs" style={{ color: '#334155' }}>{item.type}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Syllabus tab */}
      {activeTab === 'syllabus' && (
        <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #1a2540' }}>
          <div className="px-5 py-4 flex items-center justify-between" style={{ background: '#0a0f1a', borderBottom: '1px solid #1a2540' }}>
            <h2 className="font-semibold text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>Syllabus</h2>
            <Btn size="sm" variant="outline" onClick={() => { setSyllabusForm({ topic: '', hours: '4', description: '' }); setEditSyllabusId(null); setShowSyllabusModal(true) }}>+ Add</Btn>
          </div>
          <div style={{ background: '#111827' }}>
            {course.syllabus.map((s, i) => (
              <div key={s.id} className="px-5 py-4 flex items-center gap-3" style={{ borderBottom: '1px solid #1a2540' }}>
                <span className="text-xs flex-shrink-0" style={{ color: '#475569', fontFamily: 'JetBrains Mono, monospace', minWidth: '20px' }}>{i + 1}.</span>
                <div className="flex-1">
                  <div className="text-sm text-white">{s.topic}</div>
                  <div className="text-xs mt-0.5" style={{ color: '#475569' }}>{s.description} · {s.hours}h</div>
                </div>
                <div className="flex gap-2">
                  <Btn size="sm" variant="secondary" onClick={() => { setSyllabusForm({ topic: s.topic, hours: String(s.hours), description: s.description }); setEditSyllabusId(s.id); setShowSyllabusModal(true) }}>Edit</Btn>
                  <Btn size="sm" variant="danger" onClick={() => deleteSyllabus(s.id)}>Delete</Btn>
                </div>
              </div>
            ))}
            {course.syllabus.length === 0 && <div className="p-8 text-center text-sm" style={{ color: '#334155' }}>No syllabus topics.</div>}
          </div>
        </div>
      )}

      {/* Experiments tab */}
      {activeTab === 'experiments' && (
        <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #1a2540' }}>
          <div className="px-5 py-4 flex items-center justify-between" style={{ background: '#0a0f1a', borderBottom: '1px solid #1a2540' }}>
            <h2 className="font-semibold text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>Experiments</h2>
            <Btn size="sm" variant="outline" onClick={() => { setExpForm({ title: '', description: '', materials: '' }); setEditExpId(null); setShowExpModal(true) }}>+ Add</Btn>
          </div>
          <div style={{ background: '#111827' }}>
            {course.experiments.map(e => (
              <div key={e.id} className="px-5 py-4 flex items-start gap-3" style={{ borderBottom: '1px solid #1a2540' }}>
                <div className="flex-1">
                  <div className="text-sm font-medium text-white">{e.title}</div>
                  <div className="text-xs mt-1" style={{ color: '#64748b' }}>{e.description}</div>
                  <div className="text-xs mt-1" style={{ color: '#334155' }}>🔧 {e.materials}</div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <Btn size="sm" variant="secondary" onClick={() => { setExpForm({ title: e.title, description: e.description, materials: e.materials }); setEditExpId(e.id); setShowExpModal(true) }}>Edit</Btn>
                  <Btn size="sm" variant="danger" onClick={() => deleteExp(e.id)}>Delete</Btn>
                </div>
              </div>
            ))}
            {course.experiments.length === 0 && <div className="p-8 text-center text-sm" style={{ color: '#334155' }}>No experiments.</div>}
          </div>
        </div>
      )}

      {/* Add Unit Modal */}
      <Modal open={showAddUnit} onClose={() => { setShowAddUnit(false); setUnitTitle('') }} title="Add New Unit">
        <div className="space-y-4">
          <Input label="Unit Title" value={unitTitle} onChange={e => setUnitTitle(e.target.value)} placeholder="e.g. Unit 4: Advanced Topics" autoFocus />
          <div className="flex gap-3 justify-end">
            <Btn variant="ghost" onClick={() => { setShowAddUnit(false); setUnitTitle('') }}>Cancel</Btn>
            <Btn onClick={addUnit} disabled={!unitTitle.trim()}>Add Unit</Btn>
          </div>
        </div>
      </Modal>

      {/* Syllabus Modal */}
      <Modal open={showSyllabusModal} onClose={() => setShowSyllabusModal(false)} title={editSyllabusId ? 'Edit Syllabus Topic' : 'Add Syllabus Topic'}>
        <div className="space-y-4">
          <Input label="Topic" value={syllabusForm.topic} onChange={e => setSyllabusForm(f => ({ ...f, topic: e.target.value }))} placeholder="Topic name" />
          <Input label="Hours" type="number" value={syllabusForm.hours} onChange={e => setSyllabusForm(f => ({ ...f, hours: e.target.value }))} />
          <Textarea label="Description" value={syllabusForm.description} onChange={e => setSyllabusForm(f => ({ ...f, description: e.target.value }))} rows={3} placeholder="Brief description…" />
          <div className="flex gap-3 justify-end">
            <Btn variant="ghost" onClick={() => setShowSyllabusModal(false)}>Cancel</Btn>
            <Btn onClick={saveSyllabus}>Save</Btn>
          </div>
        </div>
      </Modal>

      {/* Experiment Modal */}
      <Modal open={showExpModal} onClose={() => setShowExpModal(false)} title={editExpId ? 'Edit Experiment' : 'Add Experiment'}>
        <div className="space-y-4">
          <Input label="Title" value={expForm.title} onChange={e => setExpForm(f => ({ ...f, title: e.target.value }))} placeholder="Exp N: Title" />
          <Textarea label="Description" value={expForm.description} onChange={e => setExpForm(f => ({ ...f, description: e.target.value }))} rows={3} placeholder="What students will do…" />
          <Input label="Materials / Tools" value={expForm.materials} onChange={e => setExpForm(f => ({ ...f, materials: e.target.value }))} placeholder="Tools, software, hardware needed" />
          <div className="flex gap-3 justify-end">
            <Btn variant="ghost" onClick={() => setShowExpModal(false)}>Cancel</Btn>
            <Btn onClick={saveExp}>Save</Btn>
          </div>
        </div>
      </Modal>
    </div>
  )
}
