import { useState, useRef, useCallback } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Globe, Mail, Lock, ArrowRight, Eye, EyeOff, Shield, Sparkles, User, Phone, CheckCircle2, Camera } from 'lucide-react'
import Webcam from 'react-webcam'

const roles = [
  { id: 'admin', label: 'Institution Admin' },
  { id: 'sarpanch', label: 'Sarpanch' },
  { id: 'mla', label: 'MLA' },
  { id: 'mp', label: 'MP' },
  { id: 'educator', label: 'Educator' },
]

export default function SignUpPage() {
  const [step, setStep] = useState(1)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [securityPin, setSecurityPin] = useState('')
  const [role, setRole] = useState('admin')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [capturedImage, setCapturedImage] = useState(null)
  const navigate = useNavigate()
  const webcamRef = useRef(null)

  const captureFace = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot()
    setCapturedImage(imageSrc)
  }, [webcamRef])

  const handleNext = (e) => {
    e.preventDefault()
    setError('')
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
    if (phone.length < 10) {
      setError('Please enter a valid phone number')
      return
    }
    if (securityPin.length !== 6 || isNaN(securityPin)) {
      setError('Security PIN must be exactly 6 digits')
      return
    }
    setStep(2)
  }

  const handleSignUp = async (e) => {
    if (e) e.preventDefault()
    if (!capturedImage) {
      setError('Please capture your face to continue')
      return
    }

    setLoading(true)
    setError('')
    try {
      const apiBase = import.meta.env.VITE_API_URL || ''
      const res = await fetch(`${apiBase}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, password, security_pin: securityPin, role, face_image: capturedImage })
      })
      let data
      try { data = await res.json() } catch { data = { detail: 'Server error. Please try again.' } }
      if (!res.ok) throw new Error(data.detail || 'Signup failed')

      localStorage.setItem('userEmail', email)
      localStorage.setItem('userPhone', phone)
      localStorage.setItem('userName', name)
      localStorage.setItem('leaderId', data.id)

      setSuccess(true)
      setTimeout(() => navigate('/login'), 1500)
    } catch (err) {
      setError(err.message)
      setStep(1)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col overflow-hidden bg-[#F5F0E1]">
        {/* Logo bar — sits cleanly above the image */}
        <div className="flex items-center gap-3 px-10 pt-8 pb-4">
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

        {/* Hero image fills the rest */}
        <div className="flex-1 flex items-center justify-center px-10 pb-10">
          <img
            src="/janavatar-hero.png"
            alt="JanAvatar AI Platform"
            className="w-full h-full object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-700"
          />
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 gradient-subtle">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-full overflow-hidden shadow-md">
              <img src="/pr_logo.jpg" alt="Pratinidhi Logo" className="w-full h-full object-cover" />
            </div>
            <span className="font-heading font-bold text-xl text-gray-900">Prati<span className="text-saffron-500">nidhi</span> AI</span>
          </div>

          <h2 className="font-heading text-2xl font-bold text-gray-900 tracking-tight">Create Account</h2>
          <p className="text-gray-500 mt-1">Sign up to access the admin portal</p>

          {success && (
            <div className="mt-4 flex items-center gap-2 p-3 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm font-medium animate-fade-in-up">
              <CheckCircle2 className="w-4 h-4" /> Account created! Redirecting to login...
            </div>
          )}

          {error && (
            <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-medium animate-fade-in-up">
              {error}
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={handleNext} className="mt-6 space-y-4">
              {/* Name */}
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-gray-700">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" className="w-full pl-11 pr-4 py-3 glass-card rounded-xl text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all outline-none border border-gray-200/50" required />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-gray-700">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@gov.in" className="w-full pl-11 pr-4 py-3 glass-card rounded-xl text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all outline-none border border-gray-200/50" required />
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-gray-700">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                  <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 9876543210" className="w-full pl-11 pr-4 py-3 glass-card rounded-xl text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all outline-none border border-gray-200/50" required />
                </div>
                <p className="text-xs text-gray-400 ml-1">Used for OTP consent verification & message delivery</p>
              </div>

              {/* Security PIN */}
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-gray-700">6-Digit Backup PIN</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                  <input type="password" maxLength={6} value={securityPin} onChange={(e) => setSecurityPin(e.target.value.replace(/\D/g, ''))} placeholder="123456" className="w-full pl-11 pr-4 py-3 glass-card rounded-xl text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 tracking-widest transition-all outline-none border border-gray-200/50" required />
                </div>
                <p className="text-xs text-gray-400 ml-1">This PIN acts as a secure backup to Biometric Consent</p>
              </div>

              {/* Role */}
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-gray-700 flex items-center gap-1.5"><Shield className="w-3.5 h-3.5 text-gray-400" /> Role</label>
                <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full px-4 py-3 glass-card rounded-xl text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all outline-none appearance-none border border-gray-200/50">
                  {roles.map(r => <option key={r.id} value={r.id}>{r.label}</option>)}
                </select>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-gray-700">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                  <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min 6 characters" className="w-full pl-11 pr-11 py-3 glass-card rounded-xl text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all outline-none border border-gray-200/50" required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 btn-press">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-gray-700">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                  <input type={showPassword ? 'text' : 'password'} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Re-enter password" className="w-full pl-11 pr-4 py-3 glass-card rounded-xl text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all outline-none border border-gray-200/50" required />
                </div>
              </div>

              <button type="submit" disabled={success} className="w-full py-3.5 rounded-xl gradient-primary text-white font-semibold text-sm flex items-center justify-center gap-2 hover:shadow-xl hover:shadow-blue-500/25 transition-all btn-press disabled:opacity-70 mt-2">
                <span>Continue</span><ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <div className="mt-6 flex flex-col items-center space-y-4">
              <div className="w-full text-center mb-2">
                <h3 className="font-heading font-medium text-gray-900 text-lg">Biometric Registration</h3>
                <p className="text-gray-500 text-sm mt-1">Please register your face for seamless consent.</p>
              </div>

              <div className="w-full aspect-video bg-gray-100 rounded-2xl overflow-hidden relative border-2 border-dashed border-gray-200 shadow-inner">
                {capturedImage ? (
                  <img src={capturedImage} alt="Captured face" className="w-full h-full object-cover" />
                ) : (
                  <Webcam
                    ref={webcamRef}
                    audio={false}
                    screenshotFormat="image/jpeg"
                    videoConstraints={{ width: 1280, height: 720, facingMode: "user" }}
                    className="w-full h-full object-cover"
                    mirrored={true}
                  />
                )}
                
                {/* Guidelines overlay */}
                {!capturedImage && (
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                    <div className="w-48 h-64 border-2 border-white/50 rounded-full border-dashed animate-pulse" />
                  </div>
                )}
              </div>

              <div className="w-full flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="px-4 py-3 rounded-xl bg-gray-100 text-gray-700 font-medium text-sm hover:bg-gray-200 transition-all"
                  disabled={loading}
                >
                  Back
                </button>
                
                {!capturedImage ? (
                  <button
                    onClick={captureFace}
                    className="flex-1 py-3 rounded-xl bg-gray-900 text-white font-medium text-sm flex items-center justify-center gap-2 hover:bg-gray-800 transition-all"
                  >
                    <Camera className="w-4 h-4" /> Capture Face
                  </button>
                ) : (
                  <button
                    onClick={() => setCapturedImage(null)}
                    disabled={loading}
                    className="flex-1 py-3 rounded-xl bg-red-50 text-red-600 font-medium text-sm hover:bg-red-100 transition-all"
                  >
                    Retake
                  </button>
                )}
              </div>

              {capturedImage && (
                <button
                  onClick={handleSignUp}
                  disabled={loading}
                  className="w-full py-3.5 mt-2 rounded-xl gradient-primary text-white font-semibold text-sm flex items-center justify-center gap-2 hover:shadow-xl hover:shadow-blue-500/25 transition-all btn-press disabled:opacity-70"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <><span>Complete Registration</span><CheckCircle2 className="w-4 h-4" /></>
                  )}
                </button>
              )}
            </div>
          )}

          {step === 1 && (
            <p className="mt-6 text-center text-sm text-gray-500">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-500 font-medium hover:underline">Sign In</Link>
            </p>
          )}
          <p className="mt-2 text-center text-sm text-gray-500">
            <Link to="/" className="text-blue-500 font-medium hover:underline">← Back to home</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
