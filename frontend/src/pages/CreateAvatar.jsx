import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import {
  Upload, Wand2, ArrowRight, Play, CheckCircle2,
  Video, Globe, Shield, Activity, Image as ImageIcon,
  MessageSquare, Mic, MapPin, Search, PlayCircle,
  Lock, Download, Eye, RotateCcw
} from 'lucide-react'

// Real Avatars matching backend
const avatarTiles = [
  { id: 'arjun', name: 'Arjun', type: 'Hindi Speaker (Male)', img: '/photos/arjunavatar.png' },
  { id: 'priya', name: 'Priya', type: 'Marathi Speaker (Female)', img: '/photos/maharashtra avatar.png' },
  { id: 'murugan', name: 'Murugan', type: 'Tamil Speaker (Male)', img: '/photos/south indian avatar.png' },
  { id: 'asha', name: 'Asha', type: 'Bengali Speaker (Female)', img: '/photos/indian Avatar.png' },
  { id: 'bharat', name: 'Bharat', type: 'English Speaker (Male)', img: '/photos/arjunavatar.png' },
]

const regionsData = ['North India', 'South India', 'East India', 'West India', 'Central India', 'Northeast India']

export default function CreateAvatar() {
  const navigate = useNavigate()
  const location = useLocation()
  const [step, setStep] = useState(1)

  // Step 1: Content
  const [message, setMessage] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [audioLang, setAudioLang] = useState('hi-IN')
  const recognitionRef = useRef(null)
  
  // Step 2: Audience
  const [selectedRegions, setSelectedRegions] = useState([])

  // Step 3: Avatar
  const [selectedAvatar, setSelectedAvatar] = useState(null)

  // Step 4: Pipeline (Audio & Video)
  const [audioUrl, setAudioUrl] = useState(null)
  const [isAudioGenerating, setIsAudioGenerating] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationStep, setGenerationStep] = useState(0)
  const [finalVideoUrl, setFinalVideoUrl] = useState(null)

  // Security PIN Gate
  const TRIAL_PIN = '123456'
  const [pinUnlocked, setPinUnlocked] = useState(false)
  const [securityPin, setSecurityPin] = useState('')
  const [pinError, setPinError] = useState('')
  const [pinShake, setPinShake] = useState(false)

  const handlePinSubmit = () => {
    if (securityPin === TRIAL_PIN) {
      setPinUnlocked(true)
      setPinError('')
    } else {
      setPinError('Invalid Security PIN. Please try again.')
      setPinShake(true)
      setSecurityPin('')
      setTimeout(() => setPinShake(false), 600)
    }
  }

  // Translation
  const [isTranslating, setIsTranslating] = useState(false)
  const [translatedMessage, setTranslatedMessage] = useState('')
  const AVATAR_LANG = {
    arjun: 'hi', priya: 'mr', murugan: 'ta', asha: 'bn', bharat: 'en',
  }
  const AVATAR_LANG_LABEL = {
    arjun: 'Hindi', priya: 'Marathi', murugan: 'Tamil', asha: 'Bengali', bharat: 'English',
  }

  const handleTranslateMessage = async () => {
    if (!message.trim() || !selectedAvatar) return
    setIsTranslating(true)
    setTranslatedMessage('')
    const tgtLang = AVATAR_LANG[selectedAvatar] || 'hi'
    try {
      const res = await fetch('/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: message, source_lang: 'en', target_lang: tgtLang }),
      })
      const data = await res.json()
      setTranslatedMessage(data.translated_text || '')
      // Replace message with translated version for the pipeline
      setMessage(data.translated_text || message)
    } catch (err) {
      console.error('Translation failed:', err)
    } finally {
      setIsTranslating(false)
    }
  }

  const toggleRegion = (reg) => {
    setSelectedRegions(prev => prev.includes(reg) ? prev.filter(r => r !== reg) : [...prev, reg])
  }

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    if (params.get('autoGenerate') === 'true') {
      const token = localStorage.getItem('consentToken')
      if (token) {
        setStep(4)
        // Clean url visually
        window.history.replaceState(null, '', '/create')
        // Restore drafted settings
        const draftedMsg = localStorage.getItem('draftMessage')
        const draftedLang = localStorage.getItem('draftLanguage')
        const draftedAvatar = localStorage.getItem('draftAvatar')
        if(draftedMsg) setMessage(draftedMsg)
        if(draftedLang) setAudioLang(draftedLang)
        if(draftedAvatar) setSelectedAvatar(draftedAvatar)
        
        handleGenerateAndBroadcast()
      }
    }
  }, [location.search])

  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      
      recognitionRef.current.onresult = (event) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
           setMessage(prev => prev ? prev + ' ' + finalTranscript.trim() : finalTranscript.trim());
           setTranslatedMessage('');
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsRecording(false);
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };
    }
  }, []);

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in your browser. Please use Chrome or Edge.");
      return;
    }
    
    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      // Sync the recognition language to the selected audio language
      recognitionRef.current.lang = audioLang;
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (err) {
        console.log("Recognition error:", err);
      }
    }
  }

  const handlePreviewAudio = async () => {
    if (!message || !selectedAvatar) return;
    setIsAudioGenerating(true);
    setAudioUrl(null);
    try {
      const formData = new FormData();
      formData.append('text', message);
      formData.append('avatar_id', selectedAvatar);

      const res = await fetch('/admin/preview_audio', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Failed to generate audio');
      
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
    } catch (err) {
      console.error(err);
      alert('Error generating audio preview.');
    } finally {
      setIsAudioGenerating(false);
    }
  }

  const handleGenerateAndBroadcast = async () => {
    // STRICT SECURITY: Demands a pristine token every generation cycle
    const token = localStorage.getItem('consentToken')
    if (!token) {
      // Save state to localStorage so we don't lose the drafted message
      localStorage.setItem('draftLanguage', audioLang)
      localStorage.setItem('draftMessage', message)
      localStorage.setItem('draftAvatar', selectedAvatar)
      
      navigate('/consent?returnTo=create')
      return
    }

    // Immediately consume the token to enforce Strict Per-Message Authorization
    localStorage.removeItem('consentToken')

    setIsGenerating(true)
    setGenerationStep(1) // MCC Check
    setFinalVideoUrl(null)
    
    setTimeout(() => setGenerationStep(2), 1000) // TTS

    try {
      const formData = new FormData();
      formData.append('message', message);
      formData.append('avatar_id', selectedAvatar);

      setGenerationStep(3) // Video Render
      const res = await fetch('/admin/broadcast', {
        method: 'POST',
        body: formData,
      });
      
      if (!res.ok) throw new Error('Broadcast failed');
      
      const data = await res.json();
      const broadcastId = data.broadcast_id;

      let timer = setInterval(async () => {
        try {
          const statusRes = await fetch(`/broadcasts/${broadcastId}/status`);
          const statusData = await statusRes.json();
          if (statusData.status === 'done' || (statusData.status === 'failed' && statusData.video_url)) {
            clearInterval(timer);
            setGenerationStep(4);
            setFinalVideoUrl(statusData.video_url);
          } else if (statusData.status === 'failed') {
            clearInterval(timer);
            alert('Video generation failed at backend/colab.');
            setIsGenerating(false);
            setGenerationStep(0);
          }
        } catch (e) {
          console.error('Polling error', e);
        }
      }, 3000);
      
    } catch (err) {
      console.error(err);
      alert('Error creating broadcast.');
      setIsGenerating(false);
      setGenerationStep(0);
    }
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
                  <div className="flex items-center gap-3">
                    <select 
                      value={audioLang} 
                      onChange={(e) => setAudioLang(e.target.value)}
                      disabled={isRecording}
                      className="text-xs border border-gray-200 rounded-lg px-2 py-2 bg-gray-50 outline-none text-gray-600 focus:border-blue-300"
                    >
                      <option value="hi-IN">Hindi 🇮🇳</option>
                      <option value="en-IN">English (India) 🇮🇳</option>
                      <option value="mr-IN">Marathi 🇮🇳</option>
                      <option value="ta-IN">Tamil 🇮🇳</option>
                      <option value="bn-IN">Bengali 🇮🇳</option>
                    </select>
                    <button onClick={toggleRecording} className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-xs transition-all ${
                      isRecording ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}>
                      <Mic className={`w-4 h-4 ${isRecording ? 'animate-bounce' : ''}`} />
                      {isRecording ? 'Listening (Stop)' : 'Record Voice'}
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
                  onChange={(e) => { setMessage(e.target.value); setTranslatedMessage(''); }}
                  placeholder="e.g., Dear Citizens, the new health clinic is opening tomorrow..."
                  className="w-full h-48 px-5 py-4 glass-card rounded-xl text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all outline-none resize-none border border-gray-200/50 leading-relaxed"
                />

                {/* Translation Toggle */}
                {selectedAvatar && (
                  <div className="mt-3 flex items-center gap-3">
                    <button
                      onClick={handleTranslateMessage}
                      disabled={isTranslating || !message.trim()}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all btn-press shadow-sm border border-blue-200/50 bg-blue-50 text-blue-700 hover:bg-blue-100 disabled:opacity-40"
                    >
                      {isTranslating ? (
                        <><span className="w-3.5 h-3.5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" /> Translating...</>
                      ) : (
                        <><Globe className="w-3.5 h-3.5" /> Translate to {AVATAR_LANG_LABEL[selectedAvatar] || 'Hindi'}</>
                      )}
                    </button>
                    {translatedMessage && (
                      <span className="text-xs text-emerald-600 font-medium">✓ Translated via Bhashini</span>
                    )}
                  </div>
                )}
                {!selectedAvatar && (
                  <p className="mt-2 text-xs text-gray-400 italic">💡 Select an avatar in Step 3 first, then come back to translate your message.</p>
                )}
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
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {avatarTiles.map((avatar) => {
                    const isSelected = selectedAvatar === avatar.id
                    return (
                      <div key={avatar.id} onClick={() => setSelectedAvatar(avatar.id)} className={`relative cursor-pointer group rounded-xl overflow-hidden shadow-sm transition-all duration-300 ${
                        isSelected ? 'ring-4 ring-blue-500 scale-105' : 'hover:shadow-md'
                      }`}>
                        <div className="aspect-[3/4] overflow-hidden bg-gray-100">
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

            {/* STEP 4: GENERATE & PREVIEW */}
            {step === 4 && (
              <div className="animate-fade-in-up flex flex-col items-center">
                {/* ── Security PIN Gate ── */}
                {!pinUnlocked ? (
                  <div className="w-full max-w-md text-center">
                    <div className="w-20 h-20 rounded-2xl mx-auto bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-xl shadow-orange-500/20 mb-6 relative overflow-hidden group">
                      <Lock className="w-10 h-10 text-white relative z-10 group-hover:scale-110 transition-transform" />
                      <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                    </div>
                    <h3 className="font-heading font-semibold text-gray-900 text-2xl mb-2">Security Authorization</h3>
                    <p className="text-gray-500 text-sm mb-8">Enter your 6-digit Security PIN to proceed with avatar video generation.</p>

                    <div className={`w-full relative mb-4 ${pinShake ? 'animate-shake' : ''}`}>
                      <input
                        type="password"
                        maxLength={6}
                        value={securityPin}
                        onChange={e => { setSecurityPin(e.target.value.replace(/\D/g, '')); setPinError(''); }}
                        onKeyDown={e => e.key === 'Enter' && securityPin.length === 6 && handlePinSubmit()}
                        placeholder="••••••"
                        className="w-full text-center text-4xl tracking-[0.5em] py-4 glass-card rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-300 focus:border-blue-500 outline-none font-bold text-gray-800 transition-all"
                      />
                    </div>

                    {pinError && (
                      <p className="text-red-500 text-sm font-medium mb-4 flex items-center justify-center gap-1.5">
                        <Shield className="w-3.5 h-3.5" /> {pinError}
                      </p>
                    )}

                    <button
                      onClick={handlePinSubmit}
                      disabled={securityPin.length !== 6}
                      className="w-full py-4 rounded-xl gradient-primary text-white font-bold tracking-wide flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-blue-500/25 transition-all btn-press disabled:opacity-50"
                    >
                      <Lock className="w-5 h-5" /> Unlock & Proceed
                    </button>

                    <p className="text-xs text-gray-400 mt-4">🔒 Trial PIN: <span className="font-mono bg-gray-100 px-2 py-0.5 rounded text-gray-600">123456</span></p>
                  </div>
                ) : !isGenerating ? (
                   <div className="w-full max-w-lg text-center">
                     <div className="w-20 h-20 rounded-2xl mx-auto gradient-primary flex items-center justify-center shadow-xl shadow-blue-500/20 mb-6 relative overflow-hidden group">
                       <Wand2 className="w-10 h-10 text-white relative z-10 group-hover:rotate-12 transition-transform" />
                       <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                     </div>
                     <div className="flex items-center justify-center gap-2 mb-2">
                       <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                       <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">PIN Verified</span>
                     </div>
                     <h3 className="font-heading font-semibold text-gray-900 text-2xl mb-2">Review & Broadcast</h3>
                     <p className="text-gray-500 text-sm mb-8">Listen to the AI voice before triggering the video generation.</p>
                     
                     {/* Audio Preview Section */}
                     <div className="text-left bg-gray-50/50 p-6 rounded-2xl border border-gray-100 mb-8 space-y-4">
                       <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                          <div>
                            <h4 className="font-bold text-gray-800 text-sm">Step 1: Audio Check</h4>
                            <p className="text-xs text-gray-500">Generate high-quality Bhashini AI Voice</p>
                          </div>
                          <button 
                            onClick={handlePreviewAudio}
                            disabled={isAudioGenerating}
                            className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-700 hover:shadow-sm hover:border-gray-300 disabled:opacity-50 flex items-center gap-2 transition-all btn-press"
                          >
                            {isAudioGenerating ? <Wand2 className="w-4 h-4 animate-spin text-blue-500" /> : <PlayCircle className="w-4 h-4 text-blue-500" />}
                            {isAudioGenerating ? 'Synthesizing...' : 'Preview Voice'}
                          </button>
                       </div>

                       {audioUrl && (
                         <div className="py-2 animate-fade-in">
                           <audio controls src={audioUrl} className="w-full h-10" />
                           <p className="text-[10px] text-emerald-600 font-semibold mt-1 text-right">🔊 Powered by Bhashini AI</p>
                         </div>
                       )}

                       <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                          <div>
                            <h4 className="font-bold text-gray-800 text-sm">Step 2: Video Lip-Sync</h4>
                            <p className="text-xs text-gray-500">Uses Colab SadTalker integration</p>
                          </div>
                          <button 
                            onClick={handleGenerateAndBroadcast}
                            disabled={!audioUrl}
                            className="px-5 py-2.5 gradient-primary text-white rounded-xl text-xs font-bold shadow-md hover:shadow-blue-500/30 disabled:opacity-50 disabled:grayscale transition-all btn-press flex items-center gap-2"
                          >
                            <Video className="w-4 h-4" /> Generate Video
                          </button>
                       </div>
                     </div>
                   </div>
                ) : finalVideoUrl ? (
                  <div className="w-full max-w-lg text-center animate-fade-in-up">
                    <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                    </div>
                    <h3 className="font-heading font-semibold text-gray-900 text-2xl mb-1">Video Generated Successfully!</h3>
                    <p className="text-gray-500 text-sm mb-6">Your avatar video is ready. Preview it below or download it.</p>

                    {/* Video Player */}
                    <div className="bg-black rounded-2xl overflow-hidden shadow-2xl mb-6 ring-1 ring-gray-200">
                      <video
                        controls
                        autoPlay
                        src={finalVideoUrl}
                        className="w-full max-h-80 object-contain"
                        style={{ backgroundColor: '#000' }}
                      />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <a
                        href={finalVideoUrl}
                        download="avatar_video.mp4"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold flex items-center justify-center gap-2 shadow-lg hover:shadow-emerald-500/30 transition-all btn-press"
                      >
                        <Download className="w-5 h-5" /> Download Video
                      </a>
                      <button
                        onClick={() => {
                          const videoEl = document.querySelector('video')
                          if (videoEl) { videoEl.currentTime = 0; videoEl.play() }
                        }}
                        className="px-6 py-3 rounded-xl bg-white border-2 border-gray-200 font-bold text-gray-700 flex items-center justify-center gap-2 hover:bg-gray-50 hover:border-gray-300 transition-all btn-press"
                      >
                        <Eye className="w-5 h-5 text-blue-500" /> Preview Again
                      </button>
                      <button
                        onClick={() => navigate('/messages')}
                        className="px-6 py-3 rounded-xl gradient-primary text-white font-bold flex items-center justify-center gap-2 shadow-md hover:shadow-blue-500/30 transition-all btn-press"
                      >
                        <CheckCircle2 className="w-5 h-5" /> Publish
                      </button>
                    </div>

                    {/* Generate Another */}
                    <button
                      onClick={() => {
                        setIsGenerating(false)
                        setFinalVideoUrl(null)
                        setGenerationStep(0)
                        setAudioUrl(null)
                        setPinUnlocked(false)
                        setSecurityPin('')
                      }}
                      className="mt-6 text-sm text-gray-400 hover:text-gray-600 flex items-center gap-1.5 mx-auto transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> Generate Another
                    </button>
                  </div>
                ) : (
                  <div className="w-full max-w-lg">
                    <h3 className="text-center font-heading font-bold text-xl text-gray-900 mb-8">Processing AI Pipeline</h3>
                    <div className="space-y-6">
                      {[
                        { step: 1, label: 'Content Safety & MCC Check', desc: 'Validating announcement text against Model Code of Conduct' },
                        { step: 2, label: 'Bhashini TTS Voice Generation', desc: 'Synthesizing human-like voice via Bhashini AI' },
                        { step: 3, label: 'Avatar Lip-Sync Render', desc: 'Running SadTalker AI model...' },
                        { step: 4, label: 'Finalizing & Broadcasting', desc: 'Distributing to user portals' },
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
            
            {step < 4 && (
              <button
                onClick={() => setStep(step + 1)}
                disabled={(step === 1 && !message) || (step === 2 && selectedRegions.length === 0) || (step === 3 && !selectedAvatar)}
                className="px-6 py-2.5 rounded-xl gradient-primary text-white font-semibold text-sm hover:shadow-lg hover:shadow-blue-500/25 flex items-center gap-2 transition-all btn-press disabled:opacity-50"
              >
                Continue <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
