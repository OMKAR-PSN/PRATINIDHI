import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { checkConsent } from '../services/api'
import Sidebar from '../components/Sidebar'
import {
  Upload, Wand2, ArrowRight, Play, CheckCircle2,
  Video, Globe, Shield, Activity, Image as ImageIcon,
  MessageSquare, Mic, MapPin, Search
} from 'lucide-react'

// Mock Data
const avatarTiles = [
  { id: 'leader1', name: 'Official Speaker', type: 'Authoritative', img: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80' },
  { id: 'leader2', name: 'Regional Rep (Female)', type: 'Empathetic', img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80' },
  { id: 'leader3', name: 'Youth Leader', type: 'Energetic', img: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&q=80' },
  { id: 'leader4', name: 'Senior Advisor', type: 'Experienced', img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80' },
]

const regionsData = ['North India', 'South India', 'East India', 'West India', 'Central India', 'Northeast India']

const languages = [
  { code: 'hi', label: 'Hindi (हिन्दी)' },
  { code: 'mr', label: 'Marathi (मराठी)' },
  { code: 'ta', label: 'Tamil (தமிழ்)' },
  { code: 'te', label: 'Telugu (తెలుగు)' },
  { code: 'bn', label: 'Bengali (বাংলা)' },
]

export default function CreateAvatar() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)

  // Step 1: Content
  const [message, setMessage] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  
  // Step 2: Audience
  const [selectedRegions, setSelectedRegions] = useState([])

  // Step 3: Avatar
  const [selectedAvatar, setSelectedAvatar] = useState(null)

  // Step 4: Pipeline
  const [language, setLanguage] = useState('hi')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationStep, setGenerationStep] = useState(0)

  const toggleRegion = (reg) => {
    setSelectedRegions(prev => prev.includes(reg) ? prev.filter(r => r !== reg) : [...prev, reg])
  }

  const toggleRecording = () => {
    setIsRecording(!isRecording)
    if (!isRecording) {
      setTimeout(() => {
        setMessage((prev) => prev ? prev + ' [Audio captured]' : 'Greetings citizens, this is a simulated voice transcript.')
        setIsRecording(false)
      }, 3000)
    }
  }

  const handleGenerate = async () => {
    // GATE 1: Check token exists locally
    const token = localStorage.getItem('consentToken')
    if (!token) {
      navigate('/consent')
      return
    }

    // GATE 2: Double-check with server
    const leaderId = localStorage.getItem('userRole') || 'admin'
    try {
      const res = await checkConsent(leaderId)
      if (!res.data.has_consent) {
        navigate('/consent')
        return
      }
    } catch (e) {
      navigate('/consent')
      return
    }

    setIsGenerating(true)
    let currentStep = 0
    const interval = setInterval(() => {
      currentStep += 1
      setGenerationStep(currentStep)
      if (currentStep >= 5) {
        clearInterval(interval)
        setTimeout(() => window.location.href = '/preview/demo', 1000)
      }
    }, 1500)
  }

  return (
    <div className="min-h-screen gradient-subtle tech-grid">
      <Sidebar />
      <div className="ml-64 p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header & Progress */}
          <div className="mb-8">
            <h1 className="font-heading text-2xl font-bold text-gray-900 tracking-tight">Create Announcement</h1>
            <p className="text-gray-500 text-sm mt-1">AI-powered multilingual avatar generation pipeline</p>

            {/* Stepper */}
            <div className="mt-8 relative">
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 -translate-y-1/2" />
              <div className="absolute top-1/2 left-0 h-0.5 gradient-primary -translate-y-1/2 transition-all duration-500" style={{ width: `${((step - 1) / 3) * 100}%` }} />
              <div className="relative flex justify-between">
                {[
                  { num: 1, label: 'Content', icon: MessageSquare },
                  { num: 2, label: 'Audience', icon: MapPin },
                  { num: 3, label: 'Avatar', icon: ImageIcon },
                  { num: 4, label: 'Generate', icon: Wand2 }
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
            {/* STEP 1: CONTENT */}
            {step === 1 && (
              <div className="animate-fade-in-up">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h3 className="font-heading font-semibold text-gray-900 text-lg">Input Message</h3>
                    <p className="text-gray-500 text-sm">Type your announcement or record a voice note.</p>
                  </div>
                  <button onClick={toggleRecording} className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-xs transition-all ${
                    isRecording ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}>
                    <Mic className={`w-4 h-4 ${isRecording ? 'animate-bounce' : ''}`} />
                    {isRecording ? 'Recording (Stop)' : 'Record Voice'}
                  </button>
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
                  placeholder="e.g., Dear Citizens, the new health clinic is opening tomorrow..."
                  className="w-full h-48 px-5 py-4 glass-card rounded-xl text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all outline-none resize-none border border-gray-200/50 leading-relaxed"
                />
              </div>
            )}

            {/* STEP 2: AUDIENCE */}
            {step === 2 && (
              <div className="animate-fade-in-up">
                <div className="mb-6">
                  <h3 className="font-heading font-semibold text-gray-900 text-lg">Select Target Regions</h3>
                  <p className="text-gray-500 text-sm">Choose which geographical zones this message is intended for.</p>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  {regionsData.map(region => {
                    const isSelected = selectedRegions.includes(region)
                    return (
                      <div key={region} onClick={() => toggleRegion(region)} className={`cursor-pointer p-4 rounded-xl border-2 transition-all ${
                        isSelected ? 'border-blue-500 bg-blue-50/50' : 'border-gray-100 hover:border-gray-200 bg-white shadow-sm'
                      }`}>
                        <div className="flex items-center justify-between">
                          <span className={`font-semibold text-sm ${isSelected ? 'text-blue-700' : 'text-gray-700'}`}>{region}</span>
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                            isSelected ? 'bg-blue-500 border-blue-500' : 'border-gray-300'
                          }`}>
                            {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* STEP 3: AVATAR TILES */}
            {step === 3 && (
              <div className="animate-fade-in-up">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h3 className="font-heading font-semibold text-gray-900 text-lg">Select an Avatar</h3>
                    <p className="text-gray-500 text-sm">Pick the digital representative to deliver the message.</p>
                  </div>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="text" placeholder="Search styles..." className="pl-9 pr-4 py-2 bg-gray-50 rounded-lg text-xs outline-none border border-gray-200 focus:ring-1 focus:ring-blue-400" />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
                  {avatarTiles.map((avatar) => {
                    const isSelected = selectedAvatar === avatar.id
                    return (
                      <div key={avatar.id} onClick={() => setSelectedAvatar(avatar.id)} className={`relative cursor-pointer group rounded-xl overflow-hidden shadow-sm transition-all duration-300 ${
                        isSelected ? 'ring-4 ring-blue-500 scale-105' : 'hover:shadow-md'
                      }`}>
                        <div className="aspect-[3/4] overflow-hidden">
                          <img src={avatar.img} alt={avatar.name} className={`w-full h-full object-cover transition-transform duration-700 ${isSelected ? '' : 'group-hover:scale-110'}`} />
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                          <p className="text-white font-semibold text-sm drop-shadow-md">{avatar.name}</p>
                          <p className="text-white/70 text-[10px] font-medium">{avatar.type}</p>
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
              </div>
            )}

            {/* STEP 4: GENERATE */}
            {step === 4 && (
              <div className="animate-fade-in-up flex flex-col items-center">
                {!isGenerating ? (
                   <div className="w-full max-w-lg text-center">
                     <div className="w-20 h-20 rounded-2xl mx-auto gradient-primary flex items-center justify-center shadow-xl shadow-blue-500/20 mb-6 relative overflow-hidden group">
                       <Wand2 className="w-10 h-10 text-white relative z-10 group-hover:rotate-12 transition-transform" />
                       <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                     </div>
                     <h3 className="font-heading font-semibold text-gray-900 text-2xl mb-2">Ready to Broadcast</h3>
                     <p className="text-gray-500 text-sm mb-8">Select target language and begin AI generation pipeline.</p>
                     
                     <div className="text-left bg-gray-50/50 p-5 rounded-2xl border border-gray-100 mb-8 space-y-3">
                       <div className="flex items-center justify-between">
                         <span className="text-sm font-semibold text-gray-700">Message Length:</span>
                         <span className="text-sm text-gray-500">{message.length} chars</span>
                       </div>
                       <div className="flex items-center justify-between">
                         <span className="text-sm font-semibold text-gray-700">Target Regions:</span>
                         <span className="text-sm text-gray-500">{selectedRegions.length} selected</span>
                       </div>
                       <div className="pt-3 border-t border-gray-200">
                         <label className="block text-sm font-semibold text-gray-700 mb-2">Translation Language <span className="text-[10px] bg-saffron-100 text-saffron-700 px-2 py-0.5 rounded-full ml-1 font-bold">BHASHINI</span></label>
                         <select value={language} onChange={e => setLanguage(e.target.value)} className="w-full px-4 py-3 bg-white rounded-xl text-sm border border-gray-200 focus:border-blue-400 outline-none shadow-sm cursor-pointer">
                           {languages.map(l => <option key={l.code} value={l.code}>{l.label}</option>)}
                         </select>
                       </div>
                     </div>
                   </div>
                ) : (
                  <div className="w-full max-w-lg">
                    <h3 className="text-center font-heading font-bold text-xl text-gray-900 mb-8">Processing AI Pipeline</h3>
                    <div className="space-y-6">
                      {[
                        { step: 1, label: 'Content Safety & MCC Check', desc: 'Validating announcement text' },
                        { step: 2, label: 'BHASHINI Translation', desc: `Translating text to ${language.toUpperCase()}` },
                        { step: 3, label: 'Voice Cloning & TTS', desc: 'Synthesizing natural speech audio' },
                        { step: 4, label: 'Avatar Lip-Sync Render', desc: 'Generating video frames (SadTalker)' },
                        { step: 5, label: 'Finalizing Video', desc: 'Applying watermarks and saving' },
                      ].map((s) => (
                        <div key={s.step} className={`flex items-start gap-4 transition-opacity duration-500 ${generationStep >= s.step ? 'opacity-100' : 'opacity-30'}`}>
                          <div className={`mt-0.5 w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${generationStep > s.step ? 'bg-emerald-500' : generationStep === s.step ? 'bg-blue-500 animate-pulse' : 'bg-gray-200'}`}>
                            {generationStep > s.step ? <CheckCircle2 className="w-3.5 h-3.5 text-white" /> : <div className="w-2 h-2 rounded-full bg-white" />}
                          </div>
                          <div>
                            <p className={`text-sm font-bold ${generationStep >= s.step ? 'text-gray-900' : 'text-gray-500'}`}>{s.label}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{s.desc}</p>
                          </div>
                        </div>
                      ))}
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
              Back
            </button>
            
            {step < 4 ? (
              <button
                onClick={() => setStep(step + 1)}
                disabled={(step === 1 && !message) || (step === 2 && selectedRegions.length === 0) || (step === 3 && !selectedAvatar)}
                className="px-6 py-2.5 rounded-xl gradient-primary text-white font-semibold text-sm hover:shadow-lg hover:shadow-blue-500/25 flex items-center gap-2 transition-all btn-press disabled:opacity-50"
              >
                Continue <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              !isGenerating && (
                <button
                  onClick={handleGenerate}
                  className="px-8 py-3 rounded-xl gradient-primary text-white font-bold flex items-center gap-2 hover:shadow-xl hover:shadow-blue-500/30 transition-all btn-press animate-float-slow"
                >
                  <Wand2 className="w-5 h-5" /> Generate Avatar
                </button>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
