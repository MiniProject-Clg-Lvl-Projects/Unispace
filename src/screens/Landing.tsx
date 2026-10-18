import { useApp } from '../context'
import { Btn } from '../components/ui'

const features = [
  { icon: '🎓', title: 'Smart Course Management', desc: 'Create, organize, and manage academic courses with a powerful faculty-first workflow.' },
  { icon: '📊', title: 'Learning Analytics', desc: 'Track student progress, engagement metrics, and completion rates in real time.' },
  { icon: '✅', title: 'Approval Workflows', desc: 'Streamlined course approval pipeline with faculty-admin collaboration built in.' },
  { icon: '🔗', title: 'Seamless Enrollment', desc: 'Students self-enroll in institute and global courses with one click.' },
  { icon: '🗂', title: 'Content Library', desc: 'Organize units, syllabus, experiments, and documents in a structured content system.' },
  { icon: '📱', title: 'Role-Based Access', desc: 'Dedicated dashboards for Faculty and Student roles with relevant workflows.' },
]

const stats = [
  { value: '12,000+', label: 'Active Students' },
  { value: '340+', label: 'Courses Published' },
  { value: '95%', label: 'Completion Rate' },
  { value: '180+', label: 'Faculty Members' },
]

export default function Landing() {
  const { navigate } = useApp()

  return (
    <div className="min-h-screen" style={{ background: '#080d16' }}>
      {/* Nav */}
      <header className="flex items-center justify-between px-8 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-white text-base"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #0d9488)' }}>Uni</div>
          <span className="text-xl font-bold text-white tracking-wide" style={{ fontFamily: 'Outfit, sans-serif' }}>UNISPACE</span>
        </div>
        <div className="flex items-center gap-3">
          <Btn variant="ghost" onClick={() => navigate('login')}>Sign In</Btn>
          <Btn onClick={() => navigate('register')}>Get Started</Btn>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-8 pt-24 pb-20 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-8"
          style={{ background: 'rgba(124,58,237,0.12)', color: '#a78bfa', border: '1px solid rgba(124,58,237,0.2)' }}>
          ✦ Educational ERP for Modern Institutions
        </div>
        <h1 className="text-5xl sm:text-6xl font-bold text-white leading-tight mb-6 max-w-4xl mx-auto"
          style={{ fontFamily: 'Outfit, sans-serif', letterSpacing: '-0.02em' }}>
          The Learning Platform Built for{' '}
          <span style={{ background: 'linear-gradient(90deg, #a78bfa, #2dd4bf)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Engineering Colleges
          </span>
        </h1>
        <p className="text-lg max-w-2xl mx-auto mb-10" style={{ color: '#64748b', lineHeight: '1.8' }}>
          UNISPACE unifies course management, student enrollment, content delivery, and learning analytics into a single, intuitive platform designed for faculty and students.
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Btn size="lg" onClick={() => navigate('login')}>
            Login as Faculty →
          </Btn>
          <Btn size="lg" variant="outline" onClick={() => navigate('login')}>
            Login as Student →
          </Btn>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-5xl mx-auto px-8 pb-20">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {stats.map(s => (
            <div key={s.label} className="text-center rounded-xl py-6" style={{ background: '#111827', border: '1px solid #1a2540' }}>
              <div className="text-3xl font-bold text-white mb-1" style={{ fontFamily: 'Outfit, sans-serif' }}>{s.value}</div>
              <div className="text-sm" style={{ color: '#475569' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-8 pb-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-3" style={{ fontFamily: 'Outfit, sans-serif' }}>Everything you need, nothing you don't</h2>
          <p style={{ color: '#475569' }}>Purpose-built for the academic workflow.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map(f => (
            <div key={f.title} className="rounded-xl p-6 transition-colors" style={{ background: '#111827', border: '1px solid #1a2540' }}>
              <div className="text-2xl mb-3">{f.icon}</div>
              <div className="font-semibold text-white mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>{f.title}</div>
              <div className="text-sm" style={{ color: '#64748b', lineHeight: '1.7' }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-8 pb-24">
        <div className="rounded-2xl p-12 text-center relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1a0a3d, #0a2330)' }}>
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, rgba(124,58,237,0.15) 0%, transparent 60%), radial-gradient(circle at 70% 50%, rgba(13,148,136,0.15) 0%, transparent 60%)' }} />
          <div className="relative">
            <h2 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>Ready to transform your campus?</h2>
            <p className="mb-8" style={{ color: '#94a3b8' }}>Join thousands of students and faculty on UNISPACE.</p>
            <div className="flex items-center justify-center gap-4">
              <Btn size="lg" onClick={() => navigate('register')}>Create Account</Btn>
              <Btn size="lg" variant="secondary" onClick={() => navigate('login')}>Sign In</Btn>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t text-center py-6 text-sm" style={{ borderColor: '#1a2540', color: '#334155' }}>
        © 2024 UNISPACE · Educational ERP Platform · All rights reserved
      </footer>
    </div>
  )
}
