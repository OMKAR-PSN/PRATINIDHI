import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Globe, Mail, Lock, ArrowRight, Eye, EyeOff, Shield, Sparkles, CheckCircle2, Video, Languages, Bot } from 'lucide-react'

const roles = [
  { id: 'admin', label: 'Institution Admin' },
  { id: 'sarpanch', label: 'Sarpanch' },
  { id: 'mla', label: 'MLA' },
  { id: 'mp', label: 'MP' },
  { id: 'educator', label: 'Educator' },
]

const platformFeatures = [
  { icon: Video, text: 'AI Avatar Generation' },
  { icon: Languages, text: '22+ Indian Languages' },
  { icon: Bot, text: 'Citizen Q&A System' },
  { icon: Shield, text: 'OTP Consent Verification' },
]

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('admin')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Login failed')
      
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
      {/* Left panel — Brand showcase */}
      <div className="hidden lg:flex lg:w-[45%] gradient-hero relative overflow-hidden flex-col justify-between p-12">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-saffron-500/8 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-300/6 rounded-full blur-3xl animate-float-reverse" />
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-saffron-400/30 to-transparent" />
        </div>
        {/* Top — Logo */}
        <div className="relative">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="flex items-center justify-center relative w-12 h-12 min-w-[48px]">
              <div className="absolute inset-0 rounded-full border-[3px] border-t-saffron-500 border-r-white/60 border-b-indian-green border-l-primary-400 shadow-md"></div>
              <div className="absolute inset-1 rounded-full bg-gradient-to-br from-primary-500 to-primary-800 flex items-center justify-center shadow-inner">
                <Shield className="w-6 h-6 text-white" />
              </div>
            </div>
            <div>
              <span className="font-heading text-2xl font-extrabold text-white tracking-tight">
                PRATI<span className="text-saffron-400">NIDHI</span><span className="text-white/50 text-sm ml-1 align-top tracking-widest font-semibold">AI</span>
              </span>
              <p className="text-white/30 text-xs font-semibold tracking-[0.2em] uppercase mt-0.5">Gov Platform</p>
            </div>
          </Link>
        </div>

        {/* Center — Tagline */}
        <div className="relative">
          <h1 className="font-heading text-3xl lg:text-4xl font-bold text-white tracking-tight leading-tight">
            Transforming Government
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-saffron-400 to-saffron-300">Communication</span>
            <br />
            with AI Avatars
          </h1>
          <p className="text-white/40 mt-4 text-base max-w-md leading-relaxed">
            Create multilingual AI avatar announcements that reach every citizen in their native language.
          </p>

          {/* Feature list */}
          <div className="mt-10 space-y-4">
            {platformFeatures.map(({ icon: Icon, text }, i) => (
              <div key={i} className="flex items-center gap-3 animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="w-10 h-10 rounded-xl bg-white/8 backdrop-blur-sm flex items-center justify-center border border-white/8">
                  <Icon className="w-5 h-5 text-saffron-400" />
                </div>
                <span className="text-white/60 text-sm font-medium">{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom — Stats */}
        <div className="relative flex items-center gap-6">
          {[
            { val: '22+', label: 'Languages' },
            { val: '600M+', label: 'Citizens' },
            { val: '2.5L+', label: 'Panchayats' },
          ].map(({ val, label }, i) => (
            <div key={i} className="text-center">
              <p className="font-heading text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-saffron-400 to-saffron-300">{val}</p>
              <p className="text-white/30 text-xs mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel — Login form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-white relative">
        <div className="absolute inset-0 gradient-mesh opacity-30" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-saffron-500/3 rounded-full blur-3xl" />

        <div className="relative w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="flex items-center justify-center relative w-11 h-11 min-w-[44px]">
              <div className="absolute inset-0 rounded-full border-[2.5px] border-t-saffron-500 border-r-white border-b-indian-green border-l-primary-600 shadow-md"></div>
              <div className="absolute inset-0.5 rounded-full bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
            </div>
            <div>
              <span className="font-heading font-extrabold text-xl text-gray-900">
                PRATI<span className="text-saffron-500">NIDHI</span>
              </span>
              <span className="text-primary-600 text-[9px] uppercase ml-1 align-top tracking-widest font-semibold">AI</span>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="font-heading text-3xl font-bold text-gray-900 tracking-tight">Welcome back</h2>
            <p className="text-gray-500 mt-2 text-base">Sign in to your admin portal to manage announcements.</p>
          </div>

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
              <a href="#" className="text-sm text-saffron-500 font-medium hover:text-saffron-600 transition-colors">Forgot password?</a>
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
