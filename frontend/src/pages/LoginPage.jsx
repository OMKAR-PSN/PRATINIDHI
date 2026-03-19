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
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('admin')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => { 
      localStorage.setItem('userRole', role)
      setLoading(false)
      navigate('/dashboard') 
    }, 1200)
  }

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 gradient-hero relative overflow-hidden flex-col items-center justify-center p-12">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-saffron-500/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-300/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-saffron-400/20 to-transparent" />
        </div>
        <div className="relative text-center">
          <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center mx-auto mb-6 border border-white/10 shadow-lg">
            <Globe className="w-8 h-8 text-white" />
          </div>
          <h1 className="font-heading text-4xl font-bold text-white tracking-tight">Prati<span className="text-saffron-400">nidhi</span> AI</h1>
          <p className="text-white/50 mt-3 text-lg max-w-md">AI-powered governance communication platform for multilingual avatar announcements.</p>
          <div className="mt-12 flex flex-wrap justify-center gap-3">
            {['22+ Languages', 'Lip-Sync Avatars', 'OTP Consent Lock'].map((tag) => (
              <span key={tag} className="bg-white/8 backdrop-blur-sm border border-white/10 rounded-full px-4 py-1.5 text-sm text-white/60 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-saffron-400" />
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 gradient-subtle">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-10">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <span className="font-heading font-bold text-xl text-gray-900">Prati<span className="text-saffron-500">nidhi</span> AI</span>
          </div>

          <h2 className="font-heading text-2xl font-bold text-gray-900 tracking-tight">Welcome back</h2>
          <p className="text-gray-500 mt-1">Sign in to the admin portal</p>

          <form onSubmit={handleLogin} className="mt-8 space-y-5">
            {/* Role */}
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-gray-700 flex items-center gap-1.5"><Shield className="w-3.5 h-3.5 text-gray-400" /> Role</label>
              <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full px-4 py-3 glass-card rounded-xl text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all outline-none appearance-none border border-gray-200/50">
                {roles.map(r => <option key={r.id} value={r.id}>{r.label}</option>)}
              </select>
            </div>
            {/* Email */}
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-gray-700">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@gov.in" className="w-full pl-11 pr-4 py-3 glass-card rounded-xl text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all outline-none border border-gray-200/50" required />
              </div>
            </div>
            {/* Password */}
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-gray-700">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" className="w-full pl-11 pr-11 py-3 glass-card rounded-xl text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all outline-none border border-gray-200/50" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 btn-press">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full py-3.5 rounded-xl gradient-primary text-white font-semibold text-sm flex items-center justify-center gap-2 hover:shadow-xl hover:shadow-blue-500/25 transition-all btn-press disabled:opacity-70">
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><span>Sign In</span><ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            <Link to="/" className="text-blue-500 font-medium hover:underline">← Back to home</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
