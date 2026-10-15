import { useApp } from '../../context'
import { Btn, EmptyState } from '../../components/ui'
import type { IContentItem } from '../../types'

export default function CoursePreview() {
  const { selectedCourse: course, navigate } = useApp()

  if (!course) return <EmptyState icon="👁" title="No course selected" message="Select a course to preview." />

  const allContent: (IContentItem & { unitTitle: string })[] = course.units.flatMap(u =>
    u.content.map(c => ({ ...c, unitTitle: u.title }))
  )

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>Course Preview</h1>
          <p className="text-sm mt-1" style={{ color: '#475569' }}>This is how students see this course.</p>
        </div>
        <Btn variant="secondary" onClick={() => navigate('faculty-course-info', { course })}>← Back to Course</Btn>
      </div>

      {/* Hero */}
      <div className="rounded-2xl p-8 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1a0a3d, #0a2330)' }}>
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(124,58,237,0.2) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(13,148,136,0.2) 0%, transparent 50%)' }} />
        <div className="relative">
          <div className="text-xs mb-3 px-2 py-1 rounded w-fit" style={{ background: 'rgba(124,58,237,0.2)', color: '#a78bfa', fontFamily: 'JetBrains Mono, monospace' }}>
            {course.code} · {course.level}
          </div>
          <h2 className="text-3xl font-bold text-white mb-3" style={{ fontFamily: 'Outfit, sans-serif' }}>{course.title}</h2>
          <p className="text-sm max-w-2xl mb-5" style={{ color: '#94a3b8', lineHeight: '1.7' }}>{course.description}</p>
          <div className="flex items-center gap-5 text-sm" style={{ color: '#64748b' }}>
            <span>👤 {course.faculty}</span>
            <span>🏷 {course.category}</span>
            <span>📦 {course.units.length} units</span>
            <span>👥 {course.enrolledStudents.length} enrolled</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Content list */}
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #1a2540' }}>
            <div className="px-5 py-4" style={{ background: '#0a0f1a', borderBottom: '1px solid #1a2540' }}>
              <h3 className="font-semibold text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>Course Content</h3>
            </div>
            <div style={{ background: '#111827' }}>
              {course.units.length === 0 ? (
                <div className="p-8 text-center text-sm" style={{ color: '#334155' }}>No units available.</div>
              ) : (
                course.units.map((unit, idx) => (
                  <div key={unit.id} style={{ borderBottom: '1px solid #1a2540' }}>
                    <div className="px-5 py-3 flex items-center gap-3" style={{ background: '#0d1420' }}>
                      <span className="text-xs font-bold" style={{ color: '#7c3aed' }}>{idx + 1}</span>
                      <span className="text-sm font-medium text-white">{unit.title}</span>
                      <span className="ml-auto text-xs" style={{ color: '#475569' }}>{unit.content.length} items</span>
                    </div>
                    {unit.content.map(item => (
                      <button key={item.id}
                        className="w-full flex items-center gap-3 px-8 py-3 text-left transition-colors"
                        style={{ color: '#94a3b8' }}
                        onMouseEnter={e => { (e.currentTarget.style.background = '#141d2e'); (e.currentTarget.style.color = '#e2e8f0') }}
                        onMouseLeave={e => { (e.currentTarget.style.background = 'transparent'); (e.currentTarget.style.color = '#94a3b8') }}
                        onClick={() => navigate('faculty-document-preview', { content: item, course })}>
                        <span>{item.type === 'pdf' ? '📄' : item.type === 'video' ? '🎥' : '❓'}</span>
                        <span className="text-sm">{item.title}</span>
                        <span className="ml-auto text-xs" style={{ color: '#334155' }}>{item.type}</span>
                      </button>
                    ))}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Syllabus */}
          <div className="rounded-xl p-5" style={{ background: '#111827', border: '1px solid #1a2540' }}>
            <h3 className="font-semibold text-white mb-3" style={{ fontFamily: 'Outfit, sans-serif' }}>Syllabus</h3>
            {course.syllabus.slice(0, 5).map((s, i) => (
              <div key={s.id} className="flex items-start gap-2 py-2" style={{ borderBottom: '1px solid #1a2540' }}>
                <span className="text-xs flex-shrink-0 mt-1" style={{ color: '#475569' }}>{i + 1}.</span>
                <span className="text-xs text-white">{s.topic}</span>
              </div>
            ))}
          </div>

          {/* Experiments */}
          <div className="rounded-xl p-5" style={{ background: '#111827', border: '1px solid #1a2540' }}>
            <h3 className="font-semibold text-white mb-3" style={{ fontFamily: 'Outfit, sans-serif' }}>Experiments</h3>
            {course.experiments.slice(0, 4).map(e => (
              <div key={e.id} className="py-2" style={{ borderBottom: '1px solid #1a2540' }}>
                <div className="text-xs font-medium text-white">{e.title}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
