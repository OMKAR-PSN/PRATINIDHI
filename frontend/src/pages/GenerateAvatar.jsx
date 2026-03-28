import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getReceiverLanguages, generateAvatarVideos } from '../services/api'

const LANGUAGES = [
  { label: 'Hindi', code: 'hi' },
  { label: 'Marathi', code: 'mr' },
  { label: 'Tamil', code: 'ta' },
  { label: 'Telugu', code: 'te' },
  { label: 'Kannada', code: 'kn' },
  { label: 'Bengali', code: 'bn' },
  { label: 'Gujarati', code: 'gu' },
  { label: 'Punjabi', code: 'pa' },
  { label: 'English', code: 'en' },
]

const AVATARS = [
  { id: 'arjun', name: 'Arjun', gender: 'Male', img: '/avatars/arjun.png', emoji: '👨' },
  { id: 'priya', name: 'Priya', gender: 'Female', img: '/avatars/priya.png', emoji: '👩' },
  { id: 'murugan', name: 'Murugan', gender: 'Male', img: '/avatars/murugan.png', emoji: '👨' },
  { id: 'asha', name: 'Asha', gender: 'Female', img: '/avatars/asha.png', emoji: '👩' },
]

const STEPS = [
  'Verifying consent',
  'Detecting receiver languages',
  'Translating message',
  'Generating avatar videos',
  'Uploading to cloud',
]

export default function GenerateAvatar() {
  const navigate = useNavigate()
  const leaderId = localStorage.getItem('leader_id') || ''

  const [inputLang, setInputLang] = useState('hi')
  const [message, setMessage] = useState('')
  const [selectedAvatar, setSelectedAvatar] = useState('arjun')
  const [receiverLangs, setReceiverLangs] = useState([])
  const [totalReceivers, setTotalReceivers] = useState(0)
  const [loadingLangs, setLoadingLangs] = useState(true)

  const [generating, setGenerating] = useState(false)
  const [currentStep, setCurrentStep] = useState(-1) // -1 = not started
  const [stepStatus, setStepStatus] = useState({}) // { 0: 'done', 1: 'loading', ... }
  const [results, setResults] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!leaderId) return
    getReceiverLanguages(leaderId)
      .then(r => {
        setReceiverLangs(r.data.languages || [])
        setTotalReceivers(r.data.total_receivers || 0)
      })
      .catch(() => {})
      .finally(() => setLoadingLangs(false))
  }, [leaderId])

  const simulateStep = async (stepIdx, delay = 600) => {
    setStepStatus(prev => ({ ...prev, [stepIdx]: 'loading' }))
    setCurrentStep(stepIdx)
    await new Promise(r => setTimeout(r, delay))
  }

  const finishStep = (stepIdx) => {
    setStepStatus(prev => ({ ...prev, [stepIdx]: 'done' }))
  }

  const handleGenerate = async () => {
    if (!message || message.length < 10) {
      setError('Message must be at least 10 characters.')
      return
    }
    setError('')
    setResults(null)
    setGenerating(true)
    setStepStatus({})
    setCurrentStep(0)

    try {
      await simulateStep(0, 800)  // Verifying consent
      finishStep(0)

      await simulateStep(1, 600)  // Detecting receiver languages
      finishStep(1)

      await simulateStep(2, 500)  // Translating message
      finishStep(2)

      await simulateStep(3, 400)  // Generating avatar videos
      // This step stays 'loading' until API responds
      const resp = await generateAvatarVideos(leaderId, {
        text: message,
        input_language: inputLang,
        avatar: selectedAvatar,
        title: message.slice(0, 60),
      })
      finishStep(3)

      await simulateStep(4, 600)  // Uploading to cloud
      finishStep(4)

      setResults(resp.data)
    } catch (err) {
      const msg = err?.response?.data?.detail || err.message || 'Generation failed'
      setError(msg)
      // Mark current step as failed
      setStepStatus(prev => ({ ...prev, [currentStep]: 'error' }))
    } finally {
      setGenerating(false)
    }
  }

  const totalVideos = receiverLangs.length

  return (
    <div className="min-h-screen bg-gray-950 text-white" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Header */}
      <div className="border-b border-gray-800 px-6 py-4 flex items-center gap-4">
        <button
          onClick={() => navigate('/dashboard')}
          className="text-gray-400 hover:text-white transition-colors"
        >
          ← Back
        </button>
        <div>
          <h1 className="text-xl font-bold text-white">Generate Avatar Video</h1>
          <p className="text-sm text-gray-400">Create multilingual avatar videos for all your receivers</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">

        {/* Section 1 — Input Language */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <label className="block text-sm font-semibold text-gray-300 mb-3">
            🌐 I am typing my message in:
          </label>
          <select
            value={inputLang}
            onChange={e => setInputLang(e.target.value)}
            disabled={generating}
            className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
          >
            {LANGUAGES.map(l => (
              <option key={l.code} value={l.code}>{l.label}</option>
            ))}
          </select>
        </div>

        {/* Section 2 — Message Textarea */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <label className="block text-sm font-semibold text-gray-300 mb-3">
            ✍️ Your message
          </label>
          <textarea
            value={message}
            onChange={e => setMessage(e.target.value)}
            disabled={generating}
            placeholder="Type your message here... (minimum 10 characters)"
            rows={5}
            className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none transition"
          />
          <div className="flex justify-between mt-2">
            <span className={`text-xs ${message.length < 10 && message.length > 0 ? 'text-red-400' : 'text-gray-500'}`}>
              {message.length < 10 && message.length > 0 ? 'Minimum 10 characters required' : ''}
            </span>
            <span className="text-xs text-gray-500">{message.length} characters</span>
          </div>
        </div>

        {/* Section 3 — Avatar Selector */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <label className="block text-sm font-semibold text-gray-300 mb-4">
            🎭 Select avatar appearance:
          </label>
          <div className="grid grid-cols-4 gap-4">
            {AVATARS.map(av => (
              <button
                key={av.id}
                onClick={() => setSelectedAvatar(av.id)}
                disabled={generating}
                className={`relative flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all duration-200 cursor-pointer
                  ${selectedAvatar === av.id
                    ? 'border-orange-500 bg-orange-500/10 shadow-lg shadow-orange-500/20 scale-105'
                    : 'border-gray-700 hover:border-gray-500 hover:scale-102 bg-gray-800'
                  }`}
              >
                {/* Avatar circular image */}
                <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-700 flex items-center justify-center border-2 border-gray-600">
                  <img
                    src={av.img}
                    alt={av.name}
                    className="w-full h-full object-cover"
                    onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }}
                  />
                  <span className="hidden text-3xl items-center justify-center w-full h-full">{av.emoji}</span>
                </div>
                <span className="font-semibold text-sm text-white">{av.name}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  av.gender === 'Male' ? 'bg-blue-500/20 text-blue-300' : 'bg-pink-500/20 text-pink-300'
                }`}>
                  {av.gender}
                </span>
                {selectedAvatar === av.id && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Section 4 — Info Banner */}
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-2xl p-5 flex gap-3">
          <span className="text-blue-400 text-xl flex-shrink-0">ℹ️</span>
          <p className="text-blue-200 text-sm leading-relaxed">
            Your message will be <strong>automatically translated</strong> and delivered in each receiver's preferred language.
            The selected avatar face will speak in <strong>every receiver's native language</strong>.
          </p>
        </div>

        {/* Section 5 — Receiver Language Preview */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <p className="text-sm font-semibold text-gray-300 mb-4">
            👥 Your receivers speak these languages:
          </p>
          {loadingLangs ? (
            <div className="flex gap-2">
              {[1,2,3].map(i => (
                <div key={i} className="h-8 w-28 bg-gray-700 rounded-full animate-pulse" />
              ))}
            </div>
          ) : receiverLangs.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-gray-500 text-sm">No receivers found.</p>
              <button
                onClick={() => navigate('/receivers')}
                className="mt-2 text-orange-400 text-sm hover:underline"
              >
                Add receivers →
              </button>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {receiverLangs.map(l => (
                <span
                  key={l.code}
                  className="inline-flex items-center gap-1.5 bg-orange-500/15 border border-orange-500/30 text-orange-200 text-sm px-3 py-1.5 rounded-full"
                >
                  <span className="font-medium">{l.language}</span>
                  <span className="text-orange-400/70">·</span>
                  <span className="text-orange-300/80">{l.count} receivers</span>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Section 6 — Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={generating || message.length < 10 || receiverLangs.length === 0}
          className={`w-full py-4 rounded-2xl font-bold text-white text-lg transition-all duration-200
            ${generating || message.length < 10 || receiverLangs.length === 0
              ? 'bg-gray-700 cursor-not-allowed opacity-50'
              : 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:scale-[1.01]'
            }`}
        >
          {generating ? (
            <span className="flex items-center justify-center gap-3">
              <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
              </svg>
              Generating...
            </span>
          ) : (
            <span>
              🎬 Generate Avatar Videos
              {totalVideos > 0 && (
                <span className="block text-sm font-normal text-orange-200 mt-0.5">
                  Will create {totalVideos} video{totalVideos !== 1 ? 's' : ''} for {totalVideos} language{totalVideos !== 1 ? 's' : ''} · {totalReceivers} receivers total
                </span>
              )}
            </span>
          )}
        </button>

        {/* Error */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-300 text-sm">
            ❌ {error}
          </div>
        )}

        {/* Section 7 — Step Progress */}
        {(generating || results) && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-gray-300 mb-5">Generation Progress</h3>
            <div className="space-y-4">
              {STEPS.map((step, i) => {
                const status = stepStatus[i]
                return (
                  <div key={i} className="flex items-center gap-4">
                    {/* Circle indicator */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-500
                      ${status === 'done' ? 'bg-green-500'
                        : status === 'loading' ? 'bg-orange-500'
                        : status === 'error' ? 'bg-red-500'
                        : 'bg-gray-700'}`}
                    >
                      {status === 'done' && <span className="text-white text-sm">✓</span>}
                      {status === 'loading' && (
                        <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                        </svg>
                      )}
                      {status === 'error' && <span className="text-white text-sm">✕</span>}
                      {!status && <span className="text-gray-500 text-sm">{i + 1}</span>}
                    </div>
                    {/* Connector line */}
                    <div className="flex-1">
                      <span className={`text-sm font-medium transition-colors
                        ${status === 'done' ? 'text-green-400'
                          : status === 'loading' ? 'text-orange-300'
                          : status === 'error' ? 'text-red-400'
                          : 'text-gray-500'}`}
                      >
                        {step}
                      </span>
                    </div>
                    <span className="text-xs text-gray-600">
                      {status === 'done' ? '✓ Done' : status === 'loading' ? 'In progress...' : status === 'error' ? 'Failed' : 'Pending'}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Section 8 — Results */}
        {results && results.videos && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">
                ✅ {results.total_videos_generated} video{results.total_videos_generated !== 1 ? 's' : ''} generated
              </h3>
              <span className="text-sm text-gray-400">
                {results.total_receivers} receivers · Avatar: {results.avatar_used}
              </span>
            </div>
            <div className="grid gap-4">
              {results.videos.map((v, i) => (
                <VideoResultCard key={i} video={v} />
              ))}
            </div>
            <button
              onClick={() => navigate('/dashboard/my-videos')}
              className="w-full mt-4 py-3 rounded-xl border border-orange-500/40 text-orange-300 text-sm font-medium hover:bg-orange-500/10 transition"
            >
              View all videos in My Videos →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function VideoResultCard({ video }) {
  const [copied, setCopied] = useState(false)
  const [makePublicLoading, setMakePublicLoading] = useState(false)
  const [isPublic, setIsPublic] = useState(false)
  const leaderId = localStorage.getItem('leader_id') || ''

  const copyLink = () => {
    navigator.clipboard.writeText(video.video_url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleTogglePublic = async () => {
    setMakePublicLoading(true)
    try {
      const { toggleAvatarVideoPublic } = await import('../services/api')
      await toggleAvatarVideoPublic(leaderId, video.video_id)
      setIsPublic(p => !p)
    } catch (e) {
      console.error(e)
    } finally {
      setMakePublicLoading(false)
    }
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
      <div className="p-5 border-b border-gray-800 flex items-center justify-between">
        <div>
          <h4 className="font-semibold text-white text-lg">{video.language} Version</h4>
          <p className="text-sm text-gray-400">
            Avatar: <span className="text-orange-300 capitalize">{video.avatar}</span> &nbsp;·&nbsp;
            Voice: {video.language} {video.avatar === 'arjun' || video.avatar === 'murugan' ? 'Male' : 'Female'} accent
          </p>
        </div>
        <span className="text-sm text-gray-400 bg-gray-800 px-3 py-1 rounded-full">
          👥 {video.receivers_count} receivers
        </span>
      </div>

      {/* Video Player */}
      <div className="bg-black">
        <video
          controls
          className="w-full max-h-72 object-contain"
          src={video.video_url}
          poster={video.thumbnail_url}
        >
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Actions */}
      <div className="p-4 flex flex-wrap gap-2">
        <button
          onClick={handleTogglePublic}
          disabled={makePublicLoading}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition
            ${isPublic
              ? 'bg-green-500/20 text-green-300 border border-green-500/30 hover:bg-green-500/30'
              : 'bg-gray-800 text-gray-300 border border-gray-700 hover:bg-gray-700'
            }`}
        >
          {isPublic ? '🌐 Public' : '🔒 Make Public'}
        </button>
        <a
          href={video.video_url}
          download
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-gray-800 text-gray-300 border border-gray-700 hover:bg-gray-700 transition"
        >
          ⬇️ Download
        </a>
        <button
          onClick={copyLink}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-gray-800 text-gray-300 border border-gray-700 hover:bg-gray-700 transition"
        >
          {copied ? '✅ Copied!' : '🔗 Share'}
        </button>
      </div>
    </div>
  )
}
