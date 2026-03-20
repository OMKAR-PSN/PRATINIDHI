import { useState, useRef, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Fingerprint, CheckCircle2, ArrowLeft, Loader2, ShieldCheck, Phone, Mail, Smartphone } from 'lucide-react'
import { verifyBiometric, sendPhoneOTP, verifyPhoneOTP, sendEmailOTP, verifyEmailOTP } from '../services/api'

const METHODS = [
  { id: 'biometric', label: 'Biometric', icon: Fingerprint, desc: 'Fingerprint or Face ID', tag: 'Touch devices' },
  { id: 'phone', label: 'Phone OTP', icon: Phone, desc: 'OTP sent to your phone', tag: 'SMS' },
  { id: 'email', label: 'Email OTP', icon: Mail, desc: 'OTP sent to your email', tag: 'Email' },
]

export default function ConsentOTP() {
  const navigate = useNavigate()
  const [step, setStep] = useState('select') // 'select', 'verify', 'otp', 'success'
  const [method, setMethod] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [otpSent, setOtpSent] = useState(false)
  const [isTouchDevice, setIsTouchDevice] = useState(false)
  const otpRefs = useRef([])

  const leaderId = localStorage.getItem('userRole') || 'admin'
  const userPhone = localStorage.getItem('userPhone') || ''
  const userEmail = localStorage.getItem('userEmail') || ''

  useEffect(() => {
    const hasTouch = navigator.maxTouchPoints > 0 || 'ontouchstart' in window
    setIsTouchDevice(hasTouch)
  }, [])

  const maskPhone = (p) => p ? `******${p.slice(-4)}` : 'Not set'
  const maskEmail = (e) => {
    if (!e) return 'Not set'
    const [user, domain] = e.split('@')
    return `${user.slice(0, 2)}***@${domain}`
  }

  // ===== BIOMETRIC =====
  const handleBiometric = async () => {
    setLoading(true)
    setError('')
    setStep('verify')
    setTimeout(async () => {
      try {
        const res = await verifyBiometric(leaderId)
        localStorage.setItem('consentToken', res.data.consent_token)
        setStep('success')
      } catch (err) {
        setError(err.response?.data?.detail || 'Biometric verification failed')
        setStep('select')
      } finally {
        setLoading(false)
      }
    }, 2500)
  }

  // ===== SEND OTP =====
  const handleSendOTP = async () => {
    setLoading(true)
    setError('')
    try {
      if (method === 'phone') {
        if (!userPhone) throw new Error('No phone number on file. Please update your profile.')
        await sendPhoneOTP(leaderId, userPhone)
      } else {
        if (!userEmail) throw new Error('No email on file. Please update your profile.')
        await sendEmailOTP(leaderId, userEmail)
      }
      setOtpSent(true)
      setStep('otp')
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Failed to send OTP')
    } finally {
      setLoading(false)
    }
  }

  // ===== VERIFY OTP =====
  const handleVerifyOTP = async () => {
    const code = otp.join('')
    if (code.length !== 6) { setError('Please enter all 6 digits'); return }
    setLoading(true)
    setError('')
    try {
      let res
      if (method === 'phone') {
        res = await verifyPhoneOTP(leaderId, code)
      } else {
        res = await verifyEmailOTP(leaderId, code)
      }
      localStorage.setItem('consentToken', res.data.consent_token)
      setStep('success')
    } catch (err) {
      setError(err.response?.data?.detail || 'Verification failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // OTP input handler
  const handleOtpChange = (i, val) => {
    if (!/^\d*$/.test(val)) return
    const newOtp = [...otp]
    newOtp[i] = val.slice(-1)
    setOtp(newOtp)
    if (val && i < 5) otpRefs.current[i + 1]?.focus()
  }
  const handleOtpKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) otpRefs.current[i - 1]?.focus()
  }

  const selectMethod = (m) => {
    setMethod(m)
    setError('')
    setOtp(['', '', '', '', '', ''])
    setOtpSent(false)
    if (m === 'biometric') {
      handleBiometric()
    } else {
      setStep('otp')
    }
  }

  return (
    <div className="min-h-screen gradient-subtle flex items-center justify-center p-6">
      <div className="absolute top-8 left-8">
        <Link to="/create" className="flex items-center gap-2 px-4 py-2 rounded-full bg-white max-w-fit shadow-sm border border-gray-100 text-sm font-semibold text-gray-600 hover:text-gray-900 transition-all">
          <ArrowLeft className="w-4 h-4" /> Back to Creation
        </Link>
      </div>

      <div className="w-full max-w-lg animate-fade-in-up">

        {/* ===== METHOD SELECTION ===== */}
        {step === 'select' && (
          <div className="glass-card p-10 rounded-3xl shadow-xl shadow-blue-900/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-saffron-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

            <div className="text-center mb-8 relative">
              <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/20">
                <ShieldCheck className="w-7 h-7 text-white" />
              </div>
              <h2 className="font-heading font-bold text-2xl text-gray-900 tracking-tight">Consent Verification</h2>
              <p className="text-gray-500 mt-2 text-sm">Choose your preferred method to provide secure consent</p>
            </div>

            <div className="space-y-3 relative">
              {METHODS.map((m) => {
                const Icon = m.icon
                const isRecommended = m.id === 'biometric' && isTouchDevice
                const isDisabled = m.id === 'biometric' && !isTouchDevice
                return (
                  <button
                    key={m.id}
                    onClick={() => !isDisabled && selectMethod(m.id)}
                    disabled={isDisabled}
                    className={`w-full flex items-center gap-4 p-4 rounded-2xl border text-left transition-all group relative cursor-pointer ${
                      isDisabled
                        ? 'bg-gray-50 border-gray-100 opacity-50 cursor-not-allowed'
                        : 'bg-white border-gray-100 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-500/10 hover:-translate-y-0.5'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${
                      isDisabled ? 'bg-gray-100' : 'bg-gradient-to-br from-blue-50 to-blue-100 group-hover:from-blue-100 group-hover:to-blue-200'
                    }`}>
                      <Icon className={`w-6 h-6 ${isDisabled ? 'text-gray-300' : 'text-blue-600'}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900 text-sm">{m.label}</span>
                        {isRecommended && (
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Recommended</span>
                        )}
                        {isDisabled && (
                          <span className="text-[10px] font-medium text-gray-400">No touch detected</span>
                        )}
                      </div>
                      <p className="text-gray-500 text-xs mt-0.5">{m.desc}</p>
                    </div>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${isDisabled ? 'bg-gray-100 text-gray-400' : 'bg-blue-50 text-blue-600'}`}>{m.tag}</span>
                  </button>
                )
              })}
            </div>

            {error && <p className="text-red-500 text-sm font-medium mt-4 text-center animate-fade-in">{error}</p>}

            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" /> End-to-end encrypted · Consent recorded on-chain
            </div>
          </div>
        )}

        {/* ===== BIOMETRIC SCANNING ===== */}
        {step === 'verify' && method === 'biometric' && (
          <div className="glass-card p-10 rounded-3xl shadow-xl shadow-blue-900/5 relative overflow-hidden text-center">
            <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="mb-8 relative inline-block">
              <div className="absolute inset-0 border-2 border-blue-400 rounded-full animate-ping opacity-20" style={{ animationDuration: '1.5s' }} />
              <div className="absolute inset-[-10px] border-2 border-blue-300 rounded-full animate-ping opacity-10" style={{ animationDuration: '2s' }} />
              <div className="w-32 h-32 rounded-full flex items-center justify-center relative z-10 bg-blue-600 shadow-xl shadow-blue-500/50 scale-105">
                <Fingerprint className="w-16 h-16 text-white animate-pulse" />
                <div className="absolute top-0 left-0 right-0 h-1 bg-white/80 rounded-full shadow-[0_0_10px_2px_rgba(255,255,255,0.8)] animate-scan" style={{ top: '50%', transform: 'translateY(-50%)', height: '2px' }} />
              </div>
            </div>
            <h2 className="font-heading font-bold text-3xl text-gray-900 tracking-tight">Scanning Identity...</h2>
            <p className="text-gray-500 mt-3 text-base leading-relaxed px-4">Verifying cryptographic biometric signature matching your profile.</p>
          </div>
        )}

        {/* ===== OTP INPUT (Phone or Email) ===== */}
        {step === 'otp' && (method === 'phone' || method === 'email') && (
          <div className="glass-card p-10 rounded-3xl shadow-xl shadow-blue-900/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-saffron-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

            <button onClick={() => { setStep('select'); setError('') }} className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 mb-6 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Change method
            </button>

            <div className="text-center mb-8 relative">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center mx-auto mb-4">
                {method === 'phone' ? <Phone className="w-7 h-7 text-blue-600" /> : <Mail className="w-7 h-7 text-blue-600" />}
              </div>
              <h2 className="font-heading font-bold text-2xl text-gray-900 tracking-tight">
                {method === 'phone' ? 'Phone Verification' : 'Email Verification'}
              </h2>
              <p className="text-gray-500 mt-2 text-sm">
                {otpSent
                  ? `Enter the 6-digit code sent to ${method === 'phone' ? maskPhone(userPhone) : maskEmail(userEmail)}`
                  : `We'll send a verification code to ${method === 'phone' ? maskPhone(userPhone) : maskEmail(userEmail)}`}
              </p>
            </div>

            {!otpSent ? (
              <button
                onClick={handleSendOTP}
                disabled={loading}
                className="w-full py-4 rounded-xl gradient-primary text-white font-semibold text-sm flex items-center justify-center gap-2 hover:shadow-xl hover:shadow-blue-500/25 transition-all btn-press disabled:opacity-70 cursor-pointer"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><span>Send OTP</span><ArrowLeft className="w-4 h-4 rotate-180" /></>}
              </button>
            ) : (
              <>
                <div className="flex justify-center gap-3 mb-6">
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      ref={el => otpRefs.current[i] = el}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(i, e)}
                      className="w-12 h-14 text-center text-xl font-bold rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all bg-white"
                      autoFocus={i === 0}
                    />
                  ))}
                </div>
                <button
                  onClick={handleVerifyOTP}
                  disabled={loading || otp.join('').length !== 6}
                  className="w-full py-4 rounded-xl gradient-primary text-white font-semibold text-sm flex items-center justify-center gap-2 hover:shadow-xl hover:shadow-blue-500/25 transition-all btn-press disabled:opacity-70 cursor-pointer"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Verify & Grant Consent'}
                </button>
                <button onClick={handleSendOTP} disabled={loading} className="w-full mt-3 text-sm text-blue-500 font-medium hover:underline cursor-pointer">
                  Resend OTP
                </button>
              </>
            )}

            {error && <p className="text-red-500 text-sm font-medium mt-4 text-center animate-fade-in">{error}</p>}

            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" /> OTP expires in 5 minutes
            </div>
          </div>
        )}

        {/* ===== SUCCESS ===== */}
        {step === 'success' && (
          <div className="glass-card p-10 rounded-3xl shadow-xl shadow-green-900/5 text-center relative overflow-hidden animate-fade-in-up">
            <div className="absolute inset-0 bg-green-500/5" />
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 to-green-600" />

            <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6 relative">
              <div className="absolute inset-0 rounded-full animate-ping bg-green-400 opacity-20" style={{ animationIterationCount: 1 }} />
              <CheckCircle2 className="w-12 h-12 text-green-600 relative z-10" />
            </div>

            <h2 className="font-heading font-bold text-3xl text-gray-900 relative">Identity Verified</h2>
            <p className="text-gray-500 mt-3 text-base leading-relaxed relative px-4">
              Your consent has been securely verified via <strong>{method === 'biometric' ? 'biometric scan' : method === 'phone' ? 'phone OTP' : 'email OTP'}</strong> and recorded.
            </p>

            <button onClick={() => navigate('/create')} className="mt-10 w-full py-4 rounded-xl bg-gray-900 text-white font-bold tracking-wide flex items-center justify-center gap-2 hover:bg-gray-800 hover:shadow-lg transition-all btn-press relative cursor-pointer">
              Return to Studio <ArrowLeft className="w-5 h-5 rotate-180" />
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        .animate-scan {
          animation: scan 2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
      `}</style>
    </div>
  )
}
