import { useState } from 'react'
import { useApp } from '../context'
import { Btn, Input } from '../components/ui'
import type { ILogin, Role } from '../types'
import {VerifyStudentData,AddUserData} from '../services/LoginRelatedFunctions.tsx'

type Mode = 'select' | 'login' | 'register'

const demoAccounts = {
  faculty: { name: 'Dr. Rajesh Kumar', email: 'rajesh.kumar@campizo.edu', password: 'faculty123' },
  student: { name: 'Arjun Menon', email: 'arjun.menon@campizo.edu', password: 'student123' },
}

export default function Login() {
  const { navigate, login, currentScreen } = useApp()
  const isRegister = currentScreen === 'register'
  const [mode, setMode] = useState<Mode>('select')
  const [role, setRole] = useState<Role>('faculty')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [dept, setDept] = useState('')
  const [error, setError] = useState('')

  const handleRoleSelect = (r: Role) => {
    setRole(r)
    setMode(isRegister ? 'register' : 'login')

  }

  const handleLogin = async () => {
    if (!email || !password) { setError('Please fill in all fields.'); return }
    const person =await VerifyStudentData(email, password);
    
    login(role, person?.name, person?.email)
  }

  const handleRegister = async () => {
    if (!name || !email || !password) { setError('Please fill in all required fields.'); return }
    
    const User: Partial<ILogin> = {
      email: email,
      passwordHash: password,
      role: role,
      isActive: true
    };

    const person = await AddUserData(User);
    login(role, name, email)
  }

  return (
    <div className="min-h-screen flex" style={{ background: '#080d16' }}>
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-2/5 p-12" style={{ background: 'linear-gradient(160deg, #0f0525, #050e1d)' }}>
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('landing')}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-white" style={{ background: 'linear-gradient(135deg, #7c3aed, #0d9488)' }}>C</div>
          <span className="text-xl font-bold text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>CAMPIZO</span>
        </div>
        <div>
          <blockquote className="text-2xl font-semibold text-white leading-relaxed mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>
            "Education is the most powerful weapon which you can use to change the world."
          </blockquote>
          <cite style={{ color: '#475569' }}>— Nelson Mandela</cite>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Active Courses', value: '340+', color: '#7c3aed' },
            { label: 'Students', value: '12K+', color: '#0d9488' },
            { label: 'Faculty', value: '180+', color: '#7c3aed' },
            { label: 'Completion Rate', value: '95%', color: '#0d9488' },
          ].map(s => (
            <div key={s.label} className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="text-xl font-bold" style={{ color: s.color, fontFamily: 'Outfit, sans-serif' }}>{s.value}</div>
              <div className="text-xs mt-0.5" style={{ color: '#475569' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-8 cursor-pointer" onClick={() => navigate('landing')}>
            <div className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-white text-sm" style={{ background: 'linear-gradient(135deg, #7c3aed, #0d9488)' }}>C</div>
            <span className="text-lg font-bold text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>CAMPIZO</span>
          </div>

          {mode === 'select' && (
            <div>
              <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
                {isRegister ? 'Create Account' : 'Welcome Back'}
              </h1>
              <p className="mb-8" style={{ color: '#475569' }}>
                {isRegister ? 'Select your role to get started.' : 'Select your role to continue.'}
              </p>
              <div className="space-y-3 mb-8">
                <button
                  onClick={() => handleRoleSelect('faculty')}
                  className="w-full flex items-center gap-4 p-4 rounded-xl text-left transition-all"
                  style={{ background: '#111827', border: '1px solid #1a2540' }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = '#7c3aed')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = '#1a2540')}>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ background: 'rgba(124,58,237,0.15)' }}>👨‍🏫</div>
                  <div>
                    <div className="font-semibold text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>Faculty</div>
                    <div className="text-sm" style={{ color: '#475569' }}>Create courses, manage learners, request approvals</div>
                  </div>
                  <div className="ml-auto" style={{ color: '#7c3aed' }}>→</div>
                </button>
                <button
                  onClick={() => handleRoleSelect('student')}
                  className="w-full flex items-center gap-4 p-4 rounded-xl text-left transition-all"
                  style={{ background: '#111827', border: '1px solid #1a2540' }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = '#0d9488')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = '#1a2540')}>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ background: 'rgba(13,148,136,0.15)' }}>🎓</div>
                  <div>
                    <div className="font-semibold text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>Student</div>
                    <div className="text-sm" style={{ color: '#475569' }}>Browse courses, enroll, track your learning progress</div>
                  </div>
                  <div className="ml-auto" style={{ color: '#0d9488' }}>→</div>
                </button>
              </div>
              <p className="text-center text-sm" style={{ color: '#475569' }}>
                {isRegister ? 'Already have an account? ' : "Don't have an account? "}
                <button className="underline" style={{ color: '#a78bfa' }}
                  onClick={() => navigate(isRegister ? 'login' : 'register')}>
                  {isRegister ? 'Sign In' : 'Register'}
                </button>
              </p>
            </div>
          )}

          {mode === 'login' && (
            <div>
              <button onClick={() => setMode('select')} className="text-sm mb-6 flex items-center gap-1" style={{ color: '#475569' }}>← Back</button>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                  style={{ background: role === 'faculty' ? 'rgba(124,58,237,0.15)' : 'rgba(13,148,136,0.15)' }}>
                  {role === 'faculty' ? '👨‍🏫' : '🎓'}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>
                    {role === 'faculty' ? 'Faculty Login' : 'Student Login'}
                  </h1>
                  <p className="text-sm" style={{ color: '#475569' }}>
                    Demo: {demoAccounts[role].email}
                  </p>
                </div>
              </div>
              <div className="space-y-4 mb-6">
                <Input label="Email Address" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@campizo.edu" />
                <Input label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
              </div>
              {error && <p className="text-sm mb-4" style={{ color: '#f87171' }}>{error}</p>}
              <div className="flex items-center justify-between mb-4">
                <label className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: '#64748b' }}>
                  <input type="checkbox" className="rounded" /> Remember me
                </label>
                <button className="text-sm" style={{ color: '#a78bfa' }}>Forgot password?</button>
              </div>
              <Btn className="w-full justify-center" size="lg" onClick={handleLogin}>Sign In</Btn>
              <p className="text-center text-sm mt-5" style={{ color: '#475569' }}>
                Don't have an account?{' '}
                <button className="underline" style={{ color: '#a78bfa' }} onClick={() => { setMode('select'); navigate('register') }}>Register</button>
              </p>
            </div>
          )}

          {mode === 'register' && (
            <div>
              <button onClick={() => setMode('select')} className="text-sm mb-6 flex items-center gap-1" style={{ color: '#475569' }}>← Back</button>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                  style={{ background: role === 'faculty' ? 'rgba(124,58,237,0.15)' : 'rgba(13,148,136,0.15)' }}>
                  {role === 'faculty' ? '👨‍🏫' : '🎓'}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>
                    {role === 'faculty' ? 'Faculty Registration' : 'Student Registration'}
                  </h1>
                </div>
              </div>
              <div className="space-y-4 mb-6">
                <Input label="Full Name" value={name} onChange={e => setName(e.target.value)} placeholder="Dr. Jane Smith" />
                <Input label="Email Address" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@campizo.edu" />
                {role === 'student' && <Input label="Student ID" placeholder="CSE2024001" />}
                {role === 'faculty' && <Input label="Department" value={dept} onChange={e => setDept(e.target.value)} placeholder="Computer Science Engineering" />}
                <Input label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Create a strong password" />
              </div>
              {error && <p className="text-sm mb-4" style={{ color: '#f87171' }}>{error}</p>}
              <Btn className="w-full justify-center" size="lg" onClick={handleRegister}>Create Account</Btn>
              <p className="text-center text-sm mt-5" style={{ color: '#475569' }}>
                Already have an account?{' '}
                <button className="underline" style={{ color: '#a78bfa' }} onClick={() => { setMode('select'); navigate('login') }}>Sign In</button>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
