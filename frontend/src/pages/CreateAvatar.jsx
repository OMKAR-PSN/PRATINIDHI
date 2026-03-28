import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import {
  Upload, Wand2, ArrowRight, Play, CheckCircle2,
  Video, Globe, Shield, Activity, Image as ImageIcon,
  MessageSquare, Mic, MapPin, Search, Download, Share2, Eye
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { generateAvatarVideos, getReceiverLanguages } from '../services/api'

// Avatar Roster — id maps to backend avatar name
const avatarTiles = [
  { id: 'asha',    backendId: 'asha',    nameKey: 'avatar_asha',    typeKey: 'avatar_asha_desc',    img: '/avatars/asha.png',    gender: 'Female' },
  { id: 'arjun',   backendId: 'arjun',   nameKey: 'avatar_arjun',   typeKey: 'avatar_arjun_desc',   img: '/avatars/arjun.jpg',   gender: 'Male' },
  { id: 'murugan', backendId: 'murugan', nameKey: 'avatar_murugan', typeKey: 'avatar_murugan_desc', img: '/avatars/murugan.png', gender: 'Male' },
  { id: 'priya',   backendId: 'priya',   nameKey: 'avatar_priya',   typeKey: 'avatar_priya_desc',   img: '/avatars/priya.jpg',   gender: 'Female' },
]

const INPUT_LANGUAGES = [
  { code: 'hi', label: 'Hindi (हिन्दी)' },
  { code: 'mr', label: 'Marathi (मराठी)' },
  { code: 'ta', label: 'Tamil (தமிழ்)' },
  { code: 'te', label: 'Telugu (తెలుగు)' },
  { code: 'bn', label: 'Bengali (বাংলা)' },
  { code: 'en', label: 'English' },
  { code: 'kn', label: 'Kannada (ಕನ್ನಡ)' },
  { code: 'gu', label: 'Gujarati (ગુજરાતી)' },
  { code: 'pa', label: 'Punjabi (ਪੰਜਾਬੀ)' },
]

const GENERATION_STEPS = [
  { step: 1, label: 'Verifying Consent & Identity',      desc: 'Checking your biometric consent token' },
  { step: 2, label: 'BHASHINI Translation',               desc: 'Translating message into each receiver\'s language' },
  { step: 3, label: 'Avatar Lip-Sync (Wav2Lip)',         desc: 'Generating video frames on Modal GPU' },
  { step: 4, label: 'Uploading to Cloud',                desc: 'Saving videos to Cloudinary' },
  { step: 5, label: 'Saving to Database',                desc: 'Recording videos in your library' },
]

export default function CreateAvatar() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const [step, setStep] = useState(1)

  // Step 1: Content
  const [message, setMessage]         = useState(() => localStorage.getItem('draftMessage') || '')
  const [inputLang, setInputLang]     = useState(() => localStorage.getItem('draftInputLang') || 'hi')
  const [isRecording, setIsRecording] = useState(false)

  const savedLang = localStorage.getItem('userLanguage') || 'hi'
  const defaultDictationLang = savedLang === 'en' ? 'en-IN' : savedLang + '-IN'
  const [dictationLang, setDictationLang] = useState(defaultDictationLang)
  const recognitionRef = useRef(null)

  // Step 2: Avatar + receiver languages preview
  const [selectedAvatar, setSelectedAvatar]       = useState(null)
  const [receiverLangs, setReceiverLangs]         = useState([])
  const [loadingLangs, setLoadingLangs]           = useState(false)

  // Step 3: Generation
  const [isGenerating, setIsGenerating]     = useState(false)
  const [generationStep, setGenerationStep] = useState(0)
  const [generationError, setGenerationError] = useState('')
  const [generatedVideos, setGeneratedVideos] = useState([]) // results after done

  const leaderId = localStorage.getItem('leader_id') || localStorage.getItem('leaderId') || ''

  // Speech recognition setup
  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SR = window.SpeechRecognition || window.webkitSpeechRecognition
      recognitionRef.current = new SR()
      recognitionRef.current.continuous = true
      recognitionRef.current.interimResults = true
      recognitionRef.current.onresult = (event) => {
        let final = ''
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) final += event.results[i][0].transcript
        }
        if (final) setMessage(prev => prev + (prev.length > 0 && !prev.endsWith(' ') ? ' ' : '') + final)
      }
      recognitionRef.current.onerror = () => setIsRecording(false)
      recognitionRef.current.onend   = () => setIsRecording(false)
    }
    return () => { if (recognitionRef.current) recognitionRef.current.stop() }
  }, [])

  // Load receiver languages when on step 2
  useEffect(() => {
    const fetchReceiverLangs = async () => {
      if (step === 2 && leaderId) {
        setLoadingLangs(true)
        try {
          const { data } = await getReceiverLanguages(leaderId)
          // Deduplicate language mapping in case standardizing 'hi'/'Hindi' causes dupes
          const uniqueLangs = {}
          data.languages?.forEach(lang => {
             let standardCode = lang.code?.toLowerCase()
             if (standardCode === 'hindi') standardCode = 'hi'
             if (standardCode === 'marathi') standardCode = 'mr'
             if (standardCode === 'english') standardCode = 'en'
             
             if (!uniqueLangs[standardCode]) {
                uniqueLangs[standardCode] = { ...lang, code: standardCode }
             } else {
                uniqueLangs[standardCode].count += lang.count
             }
          })
          setReceiverLangs(Object.values(uniqueLangs) || [])
        } catch (err) {
          console.error("Failed to load receiver langs:", err)
        } finally {
          setLoadingLangs(false)
        }
      }
    }
    fetchReceiverLangs()
  }, [step, leaderId])

  // Auto-generate from consent return
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    if (params.get('autoGenerate') === 'true') {
      const token = localStorage.getItem('consentToken')
      if (token) {
        setStep(3)
        window.history.replaceState(null, '', '/create')
        triggerGenerate()
      }
    }
    // eslint-disable-next-line
  }, [location.search])

  const toggleRecording = () => {
    if (!recognitionRef.current) { alert("Your browser doesn't support speech recognition. Use Chrome."); return }
    if (isRecording) { recognitionRef.current.stop(); setIsRecording(false) }
    else {
      try { recognitionRef.current.lang = dictationLang; recognitionRef.current.start(); setIsRecording(true) }
      catch (e) { console.error(e) }
    }
  }

  const triggerGenerate = async () => {
    const token = localStorage.getItem('consentToken')
    if (!token) {
      localStorage.setItem('draftMessage', message)
      localStorage.setItem('draftInputLang', inputLang)
      navigate('/consent?returnTo=create')
      return
    }

    // Save draft to localStorage for preview
    const avatarObj = avatarTiles.find(a => a.id === selectedAvatar)
    localStorage.setItem('generatedMessage', message)
    localStorage.setItem('generatedLanguage', inputLang)
    localStorage.setItem('generatedAvatar', avatarObj?.backendId || selectedAvatar || '')
    localStorage.removeItem('consentToken')

    setIsGenerating(true)
    setGenerationError('')
    setGeneratedVideos([])

    try {
      setGenerationStep(1)
      await new Promise(r => setTimeout(r, 800))
      setGenerationStep(2)

      const resp = await generateAvatarVideos(leaderId, {
        text: message,
        input_language: inputLang,
        avatar: avatarObj?.backendId || 'arjun',
        title: message.slice(0, 60),
      })

      setGenerationStep(3)
      await new Promise(r => setTimeout(r, 600))
      setGenerationStep(4)
      await new Promise(r => setTimeout(r, 500))
      setGenerationStep(5)
      await new Promise(r => setTimeout(r, 400))

      // Save videos to localStorage and redirect to preview page
      localStorage.setItem('generatedAvatarVideos', JSON.stringify(resp.data.videos || []))
      localStorage.setItem('generatedMessage', message)
      localStorage.setItem('generatedInputLang', inputLang)
      
      localStorage.removeItem('draftMessage')
      localStorage.removeItem('draftInputLang')
      
      window.location.href = '/preview/generated'

    } catch (err) {
      const msg = err?.response?.data?.detail || err.message || 'Generation failed'
      setGenerationError(msg)
      setIsGenerating(false)
    }
  }

  const handleGenerate = () => {
    setStep(3)
    triggerGenerate()
  }

  return (
    <div className="min-h-screen gradient-subtle tech-grid">
      <Sidebar />
      <div className="ml-64 p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header & Progress */}
          <div className="mb-8">
            <h1 className="font-heading text-2xl font-bold text-gray-900 tracking-tight">{t('create_title', 'Create Announcement')}</h1>
            <p className="text-gray-500 text-sm mt-1">{t('create_sub', 'AI-powered multilingual avatar generation pipeline')}</p>

            {/* Stepper */}
            <div className="mt-8 relative">
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 -translate-y-1/2" />
              <div className="absolute top-1/2 left-0 h-0.5 gradient-primary -translate-y-1/2 transition-all duration-500" style={{ width: `${((step - 1) / 2) * 100}%` }} />
              <div className="relative flex justify-between">
                {[
                  { num: 1, label: t('create_step1', 'Content'),  icon: MessageSquare },
                  { num: 2, label: t('create_step2', 'Avatar'),   icon: ImageIcon },
                  { num: 3, label: t('create_step3', 'Generate'), icon: Wand2 }
                ].map((s) => (
                  <div key={s.num} className="flex flex-col items-center gap-2">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold shadow-sm transition-all duration-300 ${
                      step >= s.num ? 'gradient-primary text-white scale-110 shadow-blue-500/20' : 'bg-white text-gray-400 border border-gray-200'
                    }`}>
                      {s.num < step ? <CheckCircle2 className="w-5 h-5" /> : <s.icon className={`w-4 h-4 ${step === s.num ? 'animate-pulse' : ''}`} />}
                    </div>
                    <span className={`text-[11px] font-semibold uppercase tracking-wider ${step >= s.num ? 'text-blue-600' : 'text-gray-400'}`}>{s.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-8 min-h-[400px]">

            {/* ── STEP 1: CONTENT ── */}
            {step === 1 && (
              <div className="animate-fade-in-up">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h3 className="font-heading font-semibold text-gray-900 text-lg">{t('create_msg_title', 'Input Message')}</h3>
                    <p className="text-gray-500 text-sm">{t('create_msg_sub', 'Type your announcement or record a voice note.')}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <select
                      value={dictationLang}
                      onChange={(e) => setDictationLang(e.target.value)}
                      disabled={isRecording}
                      className="px-3 py-2 bg-gray-50 rounded-xl text-xs outline-none border border-gray-200 focus:ring-1 focus:ring-blue-400"
                    >
                      <option value="en-IN">English</option>
                      <option value="hi-IN">Hindi (हिन्दी)</option>
                      <option value="mr-IN">Marathi (मराठी)</option>
                      <option value="ta-IN">Tamil (தமிழ்)</option>
                      <option value="te-IN">Telugu (తెలుగు)</option>
                      <option value="bn-IN">Bengali (বাংলা)</option>
                    </select>
                    <button onClick={toggleRecording} className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-xs transition-all ${
                      isRecording ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}>
                      <Mic className={`w-4 h-4 ${isRecording ? 'animate-bounce' : ''}`} />
                      {isRecording ? 'Recording (Stop)' : t('create_record', 'Record Voice')}
                    </button>
                  </div>
                </div>

                {isRecording && (
                  <div className="mb-4 h-12 rounded-xl bg-red-50/50 border border-red-100 flex items-center justify-center gap-1 overflow-hidden">
                    {[...Array(20)].map((_, i) => (
                      <div key={i} className="w-1 bg-red-400 rounded-full animate-wave" style={{ height: `${Math.random() * 80 + 20}%`, animationDelay: `${i * 0.1}s` }} />
                    ))}
                  </div>
                )}

                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={t('create_ph', 'e.g., Dear Citizens, the new health clinic is opening tomorrow...')}
                  className="w-full h-40 px-5 py-4 glass-card rounded-xl text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all outline-none resize-none border border-gray-200/50 leading-relaxed"
                />

                {/* Input language selector */}
                <div className="mt-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    🌐 I am typing this message in:
                    <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full ml-2 font-bold">BHASHINI will translate</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {INPUT_LANGUAGES.map(l => (
                      <button
                        key={l.code}
                        onClick={() => setInputLang(l.code)}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                          inputLang === l.code
                            ? 'bg-orange-500 text-white shadow-sm'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {l.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── STEP 2: AVATAR TILES ── */}
            {step === 2 && (
              <div className="animate-fade-in-up">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <h3 className="font-heading font-semibold text-gray-900 text-lg">{t('create_avatar_title', 'Select an Avatar')}</h3>
                    <p className="text-gray-500 text-sm">{t('create_avatar_sub', 'Pick the digital representative to deliver the message.')}</p>
                  </div>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="text" placeholder={t('create_search', 'Search styles...')} className="pl-9 pr-4 py-2 bg-gray-50 rounded-lg text-xs outline-none border border-gray-200 focus:ring-1 focus:ring-blue-400" />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
                  {avatarTiles.map((avatar) => {
                    const isSelected = selectedAvatar === avatar.id
                    return (
                      <div
                        key={avatar.id}
                        onClick={() => setSelectedAvatar(avatar.id)}
                        className={`relative cursor-pointer group rounded-xl overflow-hidden shadow-sm transition-all duration-300 ${
                          isSelected ? 'ring-4 ring-blue-500 scale-105' : 'hover:shadow-md'
                        }`}
                      >
                        <div className="aspect-[3/4] overflow-hidden bg-gray-100 flex items-center justify-center">
                          <img src={avatar.img} alt={avatar.id} className={`w-full h-full object-contain transition-transform duration-700 ${isSelected ? '' : 'group-hover:scale-110'}`} />
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                          <p className="text-white font-semibold text-sm drop-shadow-md">{t(avatar.nameKey, avatar.id)}</p>
                          <p className="text-white/70 text-[10px] font-medium">{avatar.gender}</p>
                        </div>
                        {isSelected && (
                          <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                            <CheckCircle2 className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>

                {/* Receiver Language Preview */}
                <div className="mt-6 p-4 bg-blue-50/60 border border-blue-100 rounded-xl">
                  <p className="text-sm font-semibold text-blue-800 mb-3">
                    🎯 Your receivers speak these languages — a video will be generated for each:
                  </p>
                  {loadingLangs ? (
                    <div className="flex gap-2">
                      {[1,2,3].map(i => <div key={i} className="h-7 w-24 bg-blue-200/60 rounded-full animate-pulse" />)}
                    </div>
                  ) : receiverLangs.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {receiverLangs.map(l => (
                        <span key={l.code} className="inline-flex items-center gap-1 bg-white border border-blue-200 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">
                          {l.language} · <span className="text-blue-500">{l.count}</span>
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-blue-600">No receivers found. <Link to="/receivers" className="underline font-medium">Add receivers →</Link></p>
                  )}
                </div>
              </div>
            )}

            {/* ── STEP 3: GENERATE ── */}
            {step === 3 && (
              <div className="animate-fade-in-up flex flex-col items-center">

                {/* Not started yet */}
                {!isGenerating && generatedVideos.length === 0 && !generationError && (
                  <div className="w-full max-w-lg text-center">
                    <div className="w-20 h-20 rounded-2xl mx-auto gradient-primary flex items-center justify-center shadow-xl shadow-blue-500/20 mb-6 relative overflow-hidden group">
                      <Wand2 className="w-10 h-10 text-white relative z-10 group-hover:rotate-12 transition-transform" />
                    </div>
                    <h3 className="font-heading font-semibold text-gray-900 text-2xl mb-2">{t('create_ready', 'Ready to Broadcast')}</h3>
                    <p className="text-gray-500 text-sm mb-6">{t('create_ready_sub', 'Avatar videos will be generated in each receiver\'s language via Wav2Lip + BHASHINI.')}</p>
                    <div className="text-left bg-gray-50/50 p-5 rounded-2xl border border-gray-100 space-y-2 text-sm">
                      <div className="flex justify-between"><span className="font-semibold text-gray-700">Message Length:</span><span className="text-gray-500">{message.length} chars</span></div>
                      <div className="flex justify-between"><span className="font-semibold text-gray-700">Input Language:</span><span className="text-gray-500">{INPUT_LANGUAGES.find(l => l.code === inputLang)?.label}</span></div>
                      <div className="flex justify-between"><span className="font-semibold text-gray-700">Avatar:</span><span className="text-gray-500 capitalize">{selectedAvatar}</span></div>
                      <div className="flex justify-between"><span className="font-semibold text-gray-700">Videos to Generate:</span><span className="text-blue-600 font-bold">{receiverLangs.length || '...'}</span></div>
                    </div>
                  </div>
                )}

                {/* Generation Progress */}
                {isGenerating && (
                  <div className="w-full max-w-lg">
                    <h3 className="text-center font-heading font-bold text-xl text-gray-900 mb-8">{t('create_proc', 'Processing AI Pipeline')}</h3>
                    <div className="space-y-6">
                      {GENERATION_STEPS.map((s) => (
                        <div key={s.step} className={`flex items-start gap-4 transition-opacity duration-500 ${generationStep >= s.step ? 'opacity-100' : 'opacity-30'}`}>
                          <div className={`mt-0.5 w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${generationStep > s.step ? 'bg-emerald-500' : generationStep === s.step ? 'bg-blue-500 animate-pulse' : 'bg-gray-200'}`}>
                            {generationStep > s.step
                              ? <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                              : <div className="w-2 h-2 rounded-full bg-white" />
                            }
                          </div>
                          <div>
                            <p className={`text-sm font-bold ${generationStep >= s.step ? 'text-gray-900' : 'text-gray-500'}`}>{s.label}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{s.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <p className="text-center text-xs text-gray-400 mt-8 animate-pulse">This may take 1–3 minutes per language…</p>
                  </div>
                )}

                {/* Error */}
                {generationError && !isGenerating && (
                  <div className="w-full max-w-lg">
                    <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
                      <p className="text-red-700 font-semibold mb-2">⚠️ Generation Failed</p>
                      <p className="text-red-600 text-sm">{generationError}</p>
                      <button onClick={() => { setGenerationError(''); setGenerationStep(0) }} className="mt-4 px-6 py-2 bg-red-500 text-white rounded-xl text-sm font-semibold hover:bg-red-600 transition">
                        Try Again
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Navigation Controls */}
          <div className="mt-6 flex items-center justify-between">
            <button
              onClick={() => setStep(step - 1)}
              disabled={step === 1 || isGenerating}
              className="px-6 py-2.5 rounded-xl font-semibold text-sm text-gray-600 hover:bg-white hover:shadow-sm disabled:opacity-30 transition-all btn-press"
            >
              {t('create_back', 'Back')}
            </button>

            {step < 3 ? (
              <button
                onClick={() => setStep(step + 1)}
                disabled={(step === 1 && !message) || (step === 2 && !selectedAvatar)}
                className="px-6 py-2.5 rounded-xl gradient-primary text-white font-semibold text-sm hover:shadow-lg hover:shadow-blue-500/25 flex items-center gap-2 transition-all btn-press disabled:opacity-50"
              >
                {t('create_cont', 'Continue')} <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              !isGenerating && generatedVideos.length === 0 && !generationError && (
                <button
                  onClick={handleGenerate}
                  className="px-8 py-3 rounded-xl gradient-primary text-white font-bold flex items-center gap-2 hover:shadow-xl hover:shadow-blue-500/30 transition-all btn-press animate-float-slow"
                >
                  <Wand2 className="w-5 h-5" /> {t('create_gen_btn', 'Generate Avatar')}
                </button>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

