import { useState } from 'react'
import { useApp } from '../../context'
import { Btn, Input, Textarea, Select } from '../../components/ui'
import type { ICourse } from '../../types'
import { createCourse } from '../../services/courseService.tsx'

export default function CreateCourse() {
  const { courses, setCourses, navigate, showToast } = useApp()
  const [form, setForm] = useState({
    title: '', code: '', description: '', category: 'Computer Science',
    level: 'intermediate' as const, syllabus: '', experiments: '',
  })

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleCreate = () => {
    if (!form.title || !form.code) { showToast('Title and course code are required.', 'error'); return }
    const newCourse: ICourse = {
      id: `c${Date.now()}`,
      title: form.title,
      code: form.code,
      description: form.description,
      faculty: 'Dr. Rajesh Kumar',
      facultyId: 'f1',
      category: form.category,
      level: form.level,
      Learning: 'not-started',
      status: 'draft',
      approvalStatus: 'pending',
      units: [],
      syllabus: form.syllabus.split('\n').filter(Boolean).map((t, i) => ({
        id: `s_new_${i}`, topic: t.trim(), hours: 4, description: ''
      })),
      experiments: form.experiments.split('\n').filter(Boolean).map((t, i) => ({
        id: `e_new_${i}`, title: t.trim(), description: '', materials: ''
      })),
      enrolledStudents: [],
      createdAt: new Date().toISOString().split('T')[0],
    }
    createCourse(newCourse).catch(err => console.error(`Failed to create course ${newCourse.title}:`, err))

    setCourses(prev => [...prev, newCourse])
    showToast(`"${form.title}" created successfully!`)
    navigate('faculty-course-info', { course: newCourse })
  }

  //FORM for creating the Course
  return (

    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>Create New Course</h1>
        <p className="text-sm mt-1" style={{ color: '#475569' }}>Fill in the course details. You can add units and content after creation.</p>
      </div>

      <div className="rounded-xl p-6 space-y-5" style={{ background: '#111827', border: '1px solid #1a2540' }}>
        <h2 className="font-semibold text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>Basic Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Course Title *" value={form.title} onChange={e => set('title', e.target.value)} placeholder="e.g. Advanced Database Systems" />
          <Input label="Course Code *" value={form.code} onChange={e => set('code', e.target.value.toUpperCase())} placeholder="e.g. CS501" />
        </div>
        <Textarea label="Description" value={form.description} onChange={e => set('description', e.target.value)}
          placeholder="Describe what students will learn in this course…" rows={4} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select label="Category" value={form.category} onChange={e => set('category', e.target.value)}>
            <option>Computer Science</option>
            <option>Artificial Intelligence</option>
            <option>Web Technology</option>
            <option>Data Science</option>
            <option>Cybersecurity</option>
            <option>Mathematics</option>
          </Select>
          <Select label="Level" value={form.level} onChange={e => set('level', e.target.value as 'beginner' | 'intermediate' | 'advanced')}>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </Select>
        </div>
      </div>

      <div className="rounded-xl p-6 space-y-5" style={{ background: '#111827', border: '1px solid #1a2540' }}>
        <h2 className="font-semibold text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>Syllabus</h2>
        <Textarea label="Syllabus Topics (one per line)"
          value={form.syllabus} onChange={e => set('syllabus', e.target.value)}
          placeholder={"Introduction to the subject\nCore concepts and theory\nPractical applications\nAdvanced topics"} rows={5} />
      </div>

      <div className="rounded-xl p-6 space-y-5" style={{ background: '#111827', border: '1px solid #1a2540' }}>
        <h2 className="font-semibold text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>Experiments</h2>
        <Textarea label="Experiment Titles (one per line)"
          value={form.experiments} onChange={e => set('experiments', e.target.value)}
          placeholder={"Exp 1: Lab setup and introduction\nExp 2: Core experiment\nExp 3: Advanced experiment"} rows={4} />
      </div>

      <div className="flex items-center gap-3 justify-end pb-6">
        <Btn variant="ghost" onClick={() => navigate('faculty-created-courses')}>Cancel</Btn>
        <Btn variant="secondary" onClick={() => showToast('Draft saved.', 'info')}>Save Draft</Btn>
        <Btn onClick={handleCreate}>Create Course →</Btn>
      </div>
    </div>
  )
}
