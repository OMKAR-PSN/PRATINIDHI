import { useParams } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import AvatarPlayer from '../components/AvatarPlayer'
import {
  Download, Share2, Send, Globe, Clock, FileText, Copy, Check,
  Shield, Lock, KeyRound, Loader2, CheckCircle2, XCircle, Smartphone
} from 'lucide-react'
import { useState } from 'react'

const qualityOptions = [
  { id: '240p', label: '240p', desc: 'Low bandwidth / WhatsApp', size: '~2 MB' },
  { id: '360p', label: '360p', desc: 'Standard quality', size: '~5 MB' },
  { id: '720p', label: '720p', desc: 'High quality', size: '~15 MB' },
]

export default function AvatarPreview() {
  const { id } = useParams()
  const [copied, setCopied] = useState(false)
  const [quality, setQuality] = useState('240p')

  // Consent state
  const [consentStep, setConsentStep] = useState('idle') // idle | requesting | otp | verifying | approved | rejected
  const [otp, setOtp] = useState('')

  const mockData = {
    id: id || 'demo',
    title: 'PM Kisan Scheme Registration Open',
    originalText: 'PM Kisan scheme registration is now open. All eligible farmers can register through the government portal or their nearest CSC center.',
    translatedText: 'पीएम किसान योजना पंजीकरण अब खुला है। सभी पात्र किसान सरकारी पोर्टल या अपने निकटतम सीएससी केंद्र के माध्यम से पंजीकरण कर सकते हैं।',
    language: 'Hindi',
    languageCode: 'hi',
    createdAt: new Date().toLocaleString(),
    videoUrl: null,
  }

  const shareUrl = `${window.location.origin}/view/${mockData.id}`

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleRequestOTP = async () => {
    setConsentStep('requesting')
    await new Promise(r => setTimeout(r, 1500))
    setConsentStep('otp')
  }

  const handleVerifyOTP = async () => {
    setConsentStep('verifying')
    await new Promise(r => setTimeout(r, 1500))
    setConsentStep(otp === '123456' || otp.length === 6 ? 'approved' : 'rejected')
  }

  const handleWhatsAppShare = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(`Watch this government announcement: ${shareUrl}`)}`, '_blank')
  }

  return (
    <div className="min-h-screen gradient-subtle tech-grid">
      <Sidebar />
      <div className="ml-64 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-heading text-2xl font-bold text-gray-900 tracking-tight">Avatar Preview</h1>
            <p className="text-gray-500 text-sm mt-1">Review, approve, and share your generated avatar</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-4 py-2.5 rounded-xl glass-card text-gray-700 font-medium text-sm flex items-center gap-2 hover:bg-white/80 transition-all btn-press">
              <Download className="w-4 h-4" /> Download
            </button>
            <button onClick={handleWhatsAppShare} className="px-4 py-2.5 rounded-xl bg-emerald-500 text-white font-medium text-sm flex items-center gap-2 hover:bg-emerald-600 transition-all btn-press shadow-lg shadow-emerald-500/20">
              <Share2 className="w-4 h-4" /> WhatsApp
            </button>
            <button disabled={consentStep !== 'approved'} className="px-4 py-2.5 rounded-xl gradient-primary text-white font-medium text-sm flex items-center gap-2 hover:shadow-lg transition-all btn-press disabled:opacity-50">
              <Send className="w-4 h-4" /> Publish
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Video Player */}
          <div className="lg:col-span-3 space-y-4">
            <AvatarPlayer videoUrl={mockData.videoUrl} title={mockData.title} />

            {/* Quality selector */}
            <div className="glass-card rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-blue-500" />
                  <span className="text-sm font-semibold text-gray-700">Video Quality</span>
                </div>
                <span className="text-[11px] font-medium text-emerald-600 bg-emerald-50/80 px-2.5 py-1 rounded-full">
                  Optimized for rural connectivity
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {qualityOptions.map((q) => (
                  <button
                    key={q.id}
                    onClick={() => setQuality(q.id)}
                    className={`text-left p-3 rounded-xl text-sm transition-all btn-press ${
                      quality === q.id
                        ? 'gradient-primary text-white shadow-lg shadow-blue-500/20'
                        : 'glass-card hover:bg-white/80 text-gray-700'
                    }`}
                  >
                    <p className="font-semibold">{q.label}</p>
                    <p className={`text-[11px] ${quality === q.id ? 'text-white/70' : 'text-gray-400'}`}>{q.desc}</p>
                    <p className={`text-[10px] mt-0.5 ${quality === q.id ? 'text-white/50' : 'text-gray-300'}`}>{q.size}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Share link */}
            <div className="glass-card rounded-2xl p-4">
              <p className="text-sm font-semibold text-gray-700 mb-2">Citizen View Link</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-gray-50/50 rounded-xl px-4 py-2.5 text-sm text-gray-500 truncate border border-gray-100/50">{shareUrl}</div>
                <button onClick={handleCopy} className="px-4 py-2.5 rounded-xl bg-blue-50/80 text-blue-600 font-medium text-sm flex items-center gap-1.5 hover:bg-blue-100/80 transition-all btn-press">
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>
          </div>

          {/* Right panel */}
          <div className="lg:col-span-2 space-y-4">
            {/* Security Approval */}
            <div className="glass-card rounded-2xl p-5 border-2 border-blue-100/50">
              <h3 className="font-heading font-semibold text-gray-900 flex items-center gap-2 mb-4">
                <Shield className="w-5 h-5 text-blue-500" />
                Security Approval
              </h3>

              {consentStep === 'idle' && (
                <button onClick={handleRequestOTP} className="w-full py-3 rounded-xl gradient-primary text-white font-semibold text-sm flex items-center justify-center gap-2 hover:shadow-lg transition-all btn-press">
                  <Lock className="w-4 h-4" /> Request OTP Approval
                </button>
              )}
              {consentStep === 'requesting' && (
                <div className="flex items-center justify-center gap-2 py-3 text-sm text-gray-500">
                  <Loader2 className="w-4 h-4 animate-spin text-blue-500" /> Sending OTP...
                </div>
              )}
              {consentStep === 'otp' && (
                <div className="space-y-3">
                  <p className="text-sm text-gray-600">Enter the 6-digit OTP sent to your registered number.</p>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="• • • • • •"
                    className="w-full text-center text-2xl tracking-[0.5em] font-mono py-3 glass-card rounded-xl border border-gray-200/50 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
                    maxLength={6}
                  />
                  <button onClick={handleVerifyOTP} disabled={otp.length < 6} className="w-full py-3 rounded-xl gradient-primary text-white font-semibold text-sm flex items-center justify-center gap-2 hover:shadow-lg transition-all btn-press disabled:opacity-50">
                    <KeyRound className="w-4 h-4" /> Verify & Publish
                  </button>
                </div>
              )}
              {consentStep === 'verifying' && (
                <div className="flex items-center justify-center gap-2 py-3 text-sm text-gray-500">
                  <Loader2 className="w-4 h-4 animate-spin text-blue-500" /> Verifying...
                </div>
              )}
              {consentStep === 'approved' && (
                <div className="flex items-center gap-3 py-3 px-4 rounded-xl bg-emerald-50/80 animate-scale-in">
                  <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                  <div>
                    <p className="text-sm font-semibold text-emerald-700">Approved</p>
                    <p className="text-xs text-emerald-600">Message verified and ready to publish</p>
                  </div>
                </div>
              )}
              {consentStep === 'rejected' && (
                <div className="space-y-3 animate-scale-in">
                  <div className="flex items-center gap-3 py-3 px-4 rounded-xl bg-red-50/80">
                    <XCircle className="w-6 h-6 text-red-500" />
                    <div>
                      <p className="text-sm font-semibold text-red-700">Rejected</p>
                      <p className="text-xs text-red-600">Invalid OTP. Try again.</p>
                    </div>
                  </div>
                  <button onClick={() => { setConsentStep('otp'); setOtp('') }} className="w-full py-2.5 rounded-xl glass-card text-sm font-medium text-gray-600 hover:bg-white/80 btn-press">
                    Retry
                  </button>
                </div>
              )}
            </div>

            {/* Details */}
            <div className="glass-card rounded-2xl p-5">
              <h3 className="font-heading font-semibold text-gray-900 mb-4">Details</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Globe className="w-4 h-4 text-blue-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-400">Language</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <p className="text-sm font-medium text-gray-800">{mockData.language}</p>
                      <span className="badge-lang text-[10px] font-bold px-2 py-0.5 rounded-full">{mockData.languageCode.toUpperCase()}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-blue-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-400">Created</p>
                    <p className="text-sm font-medium text-gray-800">{mockData.createdAt}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Transcripts */}
            <div className="glass-card rounded-2xl p-5">
              <h3 className="font-heading font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4 text-gray-400" /> Original
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed bg-gray-50/50 rounded-xl p-3.5 border border-gray-100/50">{mockData.originalText}</p>
            </div>

            <div className="glass-card rounded-2xl p-5">
              <h3 className="font-heading font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4 text-saffron-400" /> {mockData.language}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed bg-gradient-to-r from-saffron-50/30 to-orange-50/20 rounded-xl p-3.5 border border-saffron-100/50">{mockData.translatedText}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
