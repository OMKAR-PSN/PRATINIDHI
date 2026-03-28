import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Globe, Mail, Lock, ArrowRight, Eye, EyeOff, Shield, Sparkles } from 'lucide-react'

const roles = [
  { id: 'admin', label: 'Institution Admin' },
  { id: 'sarpanch', label: 'Sarpanch' },
  { id: 'mla', label: 'MLA' },
  { id: 'mp', label: 'MP' },
  { id: 'educator', label: 'Educator' },
]


export default function LoginPage() {
  const [view, setView] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [newPin, setNewPin] = useState('')
  const [role, setRole] = useState('admin')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const apiBase = import.meta.env.VITE_API_URL || ''
      const res = await fetch(`${apiBase}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      let data
      try { data = await res.json() } catch { data = { detail: 'Server error. Please try again.' } }
      if (!res.ok) throw new Error(data.detail || 'Login failed')
      
      localStorage.setItem('leaderId', data.id)
      localStorage.setItem('userRole', data.role || role)
      localStorage.setItem('userEmail', data.email || email)
      if (data.phone) localStorage.setItem('userPhone', data.phone)
      if (data.name) localStorage.setItem('userName', data.name)
      setLoading(false)
      navigate('/dashboard')
    } catch (err) {
      alert(err.message || 'Invalid email or password');
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Mobile-only Hero Header - shown first on small screens */}
      <div className="lg:hidden w-full bg-[#F5F0E1] p-8 pb-0 flex flex-col items-center">
        <div className="w-full max-w-sm">
          <img
            src="/janavatar-hero.png"
            alt="JanAvatar AI Platform"
            className="w-full h-auto drop-shadow-xl"
          />
        </div>
      </div>

      {/* Hero panel — Hero image with Logo - Hidden on mobile, shown on large screens */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[#F5F0E1] p-12 items-center justify-center">
        {/* Brand Logo Overlay */}
        <div className="absolute top-8 left-8 flex items-center gap-3 z-20">
          <div className="flex items-center justify-center w-12 h-12 min-w-[48px] rounded-full overflow-hidden shadow-lg">
            <img src="/pr_logo.jpg" alt="Pratinidhi Logo" className="w-full h-full object-cover" />
          </div>
          <div className="flex items-baseline">
            <span className="font-heading font-extrabold text-2xl tracking-tight text-gray-900 drop-shadow-sm">
              PRATI<span className="text-saffron-600">NIDHI</span>
            </span>
            <span className="text-primary-700 text-[10px] uppercase ml-1 align-top tracking-widest font-bold">AI</span>
          </div>
        </div>

        <img
          src="/janavatar-hero.png"
          alt="JanAvatar AI Platform"
          className="w-full h-full object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-700"
        />
      </div>

      {/* Form panel */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 bg-white relative overflow-hidden">
        <div className="absolute inset-0 gradient-mesh opacity-30" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-saffron-500/3 rounded-full blur-3xl" />

        <div className="relative w-full max-w-md">
          {/* Mobile logo header - slightly adjusted */}
          <div className="lg:hidden flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-11 h-11 min-w-[44px] rounded-full overflow-hidden shadow-md">
              <img src="/pr_logo.jpg" alt="Pratinidhi Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <span className="font-heading font-extrabold text-xl text-gray-900">
                PRATI<span className="text-saffron-500">NIDHI</span>
              </span>
              <span className="text-primary-600 text-[9px] uppercase ml-1 align-top tracking-widest font-semibold">AI</span>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
              {view === 'login' ? 'Welcome back' : 'Sign in with PIN'}
            </h2>
            <p className="text-gray-500 mt-2 text-base">
              {view === 'login' 
                ? 'Sign in to manage and broadcast announcements.' 
                : 'Forgot your password? Sign in using your registered 6-digit Security PIN.'}
            </p>
          </div>

          {view === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-5">
              {/* Role */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-gray-400" /> Role
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-4 py-3.5 bg-gray-50/80 rounded-xl text-sm focus:ring-2 focus:ring-saffron-200 focus:border-saffron-400 transition-all outline-none appearance-none border border-gray-200/80 font-medium text-gray-700"
                >
                  {roles.map(r => <option key={r.id} value={r.id}>{r.label}</option>)}
                </select>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@gov.in"
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50/80 rounded-xl text-sm focus:ring-2 focus:ring-saffron-200 focus:border-saffron-400 transition-all outline-none border border-gray-200/80 font-medium"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-12 pr-12 py-3.5 bg-gray-50/80 rounded-xl text-sm focus:ring-2 focus:ring-saffron-200 focus:border-saffron-400 transition-all outline-none border border-gray-200/80 font-medium"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 btn-press transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember + Forgot */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-primary-500 focus:ring-primary-500" />
                  <span className="text-sm text-gray-500">Remember me</span>
                </label>
                <button type="button" onClick={() => setView('forgot')} className="text-sm text-saffron-500 font-medium hover:text-saffron-600 transition-colors">
                  Forgot Password?
                </button>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl gradient-primary text-white font-semibold text-sm flex items-center justify-center gap-2 hover:shadow-xl hover:shadow-primary-500/25 transition-all duration-300 btn-press btn-shine disabled:opacity-70"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Sign In to Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            /* PIN Login Alternative Form */
            <form onSubmit={handleLogin} className="space-y-5 animate-fade-in-up">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Registered Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@gov.in"
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50/80 rounded-xl text-sm focus:ring-2 focus:ring-saffron-200 focus:border-saffron-400 transition-all outline-none border border-gray-200/80 font-medium"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Registered Security PIN</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={newPin} // Binding to the secondary PIN state, we map it to password when submitting or let backend handle it
                    onChange={(e) => { setNewPin(e.target.value); setPassword(e.target.value); }}
                    placeholder="• • • • • •"
                    maxLength={6}
                    pattern="[0-9]*"
                    inputMode="numeric"
                    className="w-full pl-12 pr-12 py-3.5 bg-gray-50/80 rounded-xl text-sm focus:ring-2 focus:ring-saffron-200 focus:border-saffron-400 transition-all outline-none border border-gray-200/80 font-medium tracking-widest placeholder:tracking-normal"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 btn-press transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-xl gradient-primary text-white font-semibold text-sm flex items-center justify-center gap-2 hover:shadow-xl hover:shadow-primary-500/25 transition-all duration-300 btn-press btn-shine mb-4 disabled:opacity-70"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Sign In with PIN</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setView('login')}
                  className="w-full py-3.5 rounded-xl border-2 border-gray-200 text-gray-600 font-semibold text-sm hover:border-gray-300 hover:bg-gray-50 transition-all duration-300 btn-press"
                >
                  Back to Password Login
                </button>
              </div>
            </form>
          )}

          <p className="mt-6 text-center text-sm text-gray-500">
            Don't have an account?{' '}
            <Link to="/signup" className="text-primary-500 font-medium hover:underline">Sign Up</Link>
          </p>
          
          {/* Bottom link */}
          <div className="mt-4 flex items-center justify-center gap-4">
            <Link to="/" className="text-sm text-gray-500 hover:text-primary-500 font-medium transition-colors flex items-center gap-1">
              ← Back to home
            </Link>
            <span className="text-gray-200">|</span>
            <Link to="/view/demo" className="text-sm text-saffron-500 hover:text-saffron-600 font-medium transition-colors flex items-center gap-1">
              Try Demo <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
