import { useParams, useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import AvatarPlayer from '../components/AvatarPlayer'
import { getAvatar, sendMessage, getPreviewTranslation } from '../services/api'
import {
  Download, Share2, Send, Globe, Clock, FileText, Copy, Check,
  Loader2, CheckCircle2, XCircle, Smartphone, Eye
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

const qualityOptions = [
  { id: '240p', label: '240p', desc: 'Low bandwidth / WhatsApp', size: '~2 MB' },
  { id: '360p', label: '360p', desc: 'Standard quality', size: '~5 MB' },
  { id: '720p', label: '720p', desc: 'High quality', size: '~15 MB' },
]

export default function AvatarPreview() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { id } = useParams()
  const [copied, setCopied] = useState(false)
  const [quality, setQuality] = useState('240p')
  const [avatar, setAvatar] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isPublishing, setIsPublishing] = useState(false)
  const [publishStatus, setPublishStatus] = useState(null)

  // Real Generated Videos State
  const [generatedVideos, setGeneratedVideos] = useState([])
  const [activeVideo, setActiveVideo] = useState(null)

  // Preview Translation State (only for non-generated / old demo flow)
  const [selectedLanguage, setSelectedLanguage] = useState(null)
  const [previewAudioUrl, setPreviewAudioUrl] = useState(null)
  const [previewTranslatedText, setPreviewTranslatedText] = useState(null)
  const [isTranslating, setIsTranslating] = useState(false)

  const leaderId = localStorage.getItem('leaderId') || 'admin'

  // Fetch translation logic for demo flow
  useEffect(() => {
    const fetchTranslation = async () => {
      if (!avatar || !selectedLanguage) return;
      if (id === 'generated') return; // Do not fetch translation if we have generated videos
      
      setIsTranslating(true)
      try {
        const { data } = await getPreviewTranslation({
          text: avatar.original_text,
          language: selectedLanguage,
          avatar: localStorage.getItem('generatedAvatar') || 'arjun'
        })
        setPreviewTranslatedText(data.translated_text)
        setPreviewAudioUrl(data.audio_url)
      } catch (err) {
        console.error("Failed to fetch translation:", err)
      } finally {
        setIsTranslating(false)
      }
    }
    fetchTranslation()
  }, [avatar?.original_text, selectedLanguage, id])

  useEffect(() => {
    const fetchAvatar = async () => {
      // Real generated content — read the leader's actual message from localStorage
      if (id === 'generated') {
        const userMessage = localStorage.getItem('generatedMessage') || ''
        const videosStr = localStorage.getItem('generatedAvatarVideos')
        const rawVideos = videosStr ? JSON.parse(videosStr) : []
        
        // Deduplicate language options just in case backend aggregated duplicates
        const seen = new Set()
        const videos = rawVideos.filter(v => {
          if (seen.has(v.language_code)) return false
          seen.add(v.language_code)
          return true
        })

        setGeneratedVideos(videos)

        if (videos.length > 0) {
          const firstVid = videos[0]
          setActiveVideo(firstVid)
          setSelectedLanguage(firstVid.language_code)
          setAvatar({
            id: 'generated',
            original_text: userMessage,
            translated_text: firstVid.translated_text || userMessage, 
            language: firstVid.language,
            languageCode: firstVid.language_code,
            video_url: firstVid.video_url,
            created_at: new Date().toLocaleString(),
          })
        } else {
          // Fallback if no videos are found
          setAvatar({
            id: 'generated',
            original_text: userMessage,
            translated_text: userMessage,
            language: 'Hindi',
            languageCode: 'hi',
            video_url: null,
            created_at: new Date().toLocaleString()
          })
          setSelectedLanguage('hi')
        }
        setLoading(false)
        return
      }

      // Legacy demo route (fallback)
      if (id === 'demo') {
        setAvatar({
          id: 'demo',
          original_text: 'PM Kisan scheme registration is now open. All eligible farmers can register through the government portal or their nearest CSC center.',
          translated_text: 'पीएम किसान योजना पंजीकरण अब खुला है। सभी पात्र किसान सरकारी पोर्टल या अपने निकटतम सीएससी केंद्र के माध्यम से पंजीकरण कर सकते हैं।',
          language: 'Hindi',
          languageCode: 'hi',
          video_url: null,
          created_at: new Date().toLocaleString(),
          consent_status: 'demo'
        })
        setLoading(false)
        return
      }

      try {
        const { data } = await getAvatar(id)
        setAvatar(data)
      } catch (err) {
        console.error("Failed to fetch avatar:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchAvatar()
  }, [id])

  // Handle changing language in the UI
  const handleLanguageChange = (langCode) => {
    setSelectedLanguage(langCode)
    
    // For Generated Videos flow: swap out the active playing video
    if (id === 'generated' && generatedVideos.length > 0) {
      const vid = generatedVideos.find(v => v.language_code === langCode)
      if (vid) {
        setActiveVideo(vid)
        setAvatar(prev => ({
          ...prev,
          language: vid.language,
          languageCode: vid.language_code,
          video_url: vid.video_url,
          translated_text: vid.translated_text || prev.original_text
        }))
      }
    }
  }

  const shareUrl = `${window.location.origin}/view/${activeVideo?.video_id || avatar?.id || id}`

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleWhatsAppShare = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(`Watch this government announcement: ${shareUrl}`)}`, '_blank')
  }

  const handlePublish = async () => {
    setIsPublishing(true)
    setPublishStatus(null)
    try {
      const res = await sendMessage({
        leader_id: leaderId,
        message: avatar?.original_text || '',
        translated_text: avatar?.translated_text || '',
        language: avatar?.languageCode || 'hi',
        avatar: localStorage.getItem('generatedAvatar') || activeVideo?.avatar || 'arjun',
        video_metadata: generatedVideos
        // the backend handles dispatching to all receivers based on their preferences
      })
      setPublishStatus({ 
        success: true, 
        message: `Successfully broadcasted! Sent: ${res.data.sent}, Failed: ${res.data.failed}` 
      })
    } catch (err) {
      console.error("Publish failed:", err)
      setPublishStatus({ 
        success: false, 
        message: err.response?.data?.detail || "Broadcast failed. Please check your contact list." 
      })
    } finally {
      setIsPublishing(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen gradient-subtle flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
      </div>
    )
  }

  return (
    <div className="min-h-screen gradient-subtle tech-grid">
      <Sidebar />
      <div className="ml-64 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-heading text-2xl font-bold text-gray-900 tracking-tight">{t('preview_title', 'Avatar Preview')}</h1>
            <p className="text-gray-500 text-sm mt-1">{t('preview_sub', 'Review, approve, and share your generated avatar')}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button className="px-4 py-2.5 rounded-xl glass-card text-gray-700 font-medium text-sm flex items-center gap-2 hover:bg-white/80 transition-all btn-press">
              <Download className="w-4 h-4" /> {t('preview_dl', 'Download')}
            </button>
            <button onClick={handleWhatsAppShare} className="px-4 py-2.5 rounded-xl bg-emerald-500 text-white font-medium text-sm flex items-center gap-2 hover:bg-emerald-600 transition-all btn-press shadow-lg shadow-emerald-500/20">
              <Share2 className="w-4 h-4" /> {t('preview_wa', 'WhatsApp')}
            </button>
            <button 
              onClick={handlePublish}
              disabled={isPublishing} 
              className="px-4 py-2.5 rounded-xl gradient-primary text-white font-medium text-sm flex items-center gap-2 hover:shadow-lg transition-all btn-press disabled:opacity-50"
            >
              {isPublishing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              {t('preview_pub', 'Publish')}
            </button>
          </div>
        </div>

        {publishStatus && (
          <div className={`mb-6 p-4 rounded-2xl flex items-center gap-3 animate-fade-in ${publishStatus.success ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
            {publishStatus.success ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
            <p className="text-sm font-semibold">{publishStatus.message}</p>
          </div>
        )}

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Video Player */}
          <div className="lg:col-span-3 space-y-4">
            
            {/* The single unified Video Player */}
            {avatar?.video_url ? (
              <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-sm relative">
                <div className="absolute top-3 left-3 bg-black/50 text-white px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md z-10 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  {avatar?.language} Version
                </div>
                <video
                  key={avatar?.video_url} // Forces remount on URL change!
                  src={avatar?.video_url}
                  controls
                  autoPlay
                  className="w-full max-h-[500px] bg-black object-contain"
                />
              </div>
            ) : (
              <AvatarPlayer videoUrl={null} title={avatar?.original_text} />
            )}

            {/* Quality selector */}
            <div className="glass-card rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-blue-500" />
                  <span className="text-sm font-semibold text-gray-700">{t('preview_vid_qual', 'Video Quality')}</span>
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
              <p className="text-sm font-semibold text-gray-700 mb-2">{t('preview_link', 'Citizen View Link')}</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-gray-50/50 rounded-xl px-4 py-2.5 text-sm text-gray-500 truncate border border-gray-100/50">{shareUrl}</div>
                <button onClick={handleCopy} className="px-4 py-2.5 rounded-xl bg-blue-50/80 text-blue-600 font-medium text-sm flex items-center gap-1.5 hover:bg-blue-100/80 transition-all btn-press">
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? t('preview_copied', 'Copied!') : t('preview_copy', 'Copy')}
                </button>
              </div>
            </div>
          </div>

          {/* Right panel */}
          <div className="lg:col-span-2 space-y-4">

            {/* Language Selection */}
            <div className="glass-card rounded-2xl p-5 border-l-4 border-blue-500">
              <h3 className="font-heading font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Globe className="w-4 h-4 text-blue-500" />
                Select Language Version
              </h3>
              
              {id === 'generated' && generatedVideos.length > 0 ? (
                <div className="grid grid-cols-2 gap-2">
                  {generatedVideos.map(vid => (
                    <button
                      key={vid.language_code}
                      onClick={() => handleLanguageChange(vid.language_code)}
                      className={`flex flex-col items-start p-3 rounded-xl border text-left transition-all btn-press ${
                        selectedLanguage === vid.language_code 
                          ? 'border-blue-500 bg-blue-50 shadow-sm' 
                          : 'border-gray-200 bg-white hover:bg-gray-50'
                      }`}
                    >
                      <span className="font-bold text-gray-900 text-sm">{vid.language}</span>
                      <span className="text-[10px] text-gray-500 font-medium mt-0.5">{vid.receivers_count} receivers</span>
                    </button>
                  ))}
                </div>
              ) : (
                <select
                  value={selectedLanguage || avatar?.languageCode || 'hi'}
                  onChange={(e) => handleLanguageChange(e.target.value)}
                  className="mt-1.5 text-sm p-3 rounded-xl border border-gray-200 outline-none w-full bg-white/50 focus:bg-white transition-all font-medium text-gray-800"
                  disabled={isTranslating}
                >
                  <option value="hi">Hindi</option>
                  <option value="mr">Marathi</option>
                  <option value="ta">Tamil</option>
                  <option value="te">Telugu</option>
                  <option value="kn">Kannada</option>
                  <option value="ml">Malayalam</option>
                  <option value="bn">Bengali</option>
                  <option value="gu">Gujarati</option>
                  <option value="en">English</option>
                </select>
              )}
            </div>

            {/* Details */}
            <div className="glass-card rounded-2xl p-5">
              <h3 className="font-heading font-semibold text-gray-900 mb-4">{t('preview_details', 'Details')}</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-blue-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-400">{t('preview_created', 'Created')}</p>
                    <p className="text-sm font-medium text-gray-800">{avatar?.created_at}</p>
                  </div>
                </div>
                {activeVideo && (
                  <div className="flex items-start gap-3 mt-3">
                    <Globe className="w-4 h-4 text-blue-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-400">Model Configuration</p>
                      <p className="text-sm font-medium text-gray-800 capitalize">{activeVideo.avatar} (Wav2Lip GAN)</p>
                      <p className="text-[10px] text-gray-500">{activeVideo.voice_used}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Input Transcript */}
            <div className="glass-card rounded-2xl p-5">
              <h3 className="font-heading font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4 text-gray-400" /> Input Message Transcript
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed bg-gray-50/50 rounded-xl p-3.5 border border-gray-100/50">
                {avatar?.original_text}
              </p>
            </div>

            {/* Translated Text — shown for ALL flows */}
            <div className="glass-card rounded-2xl p-5">
              <h3 className="font-heading font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4 text-saffron-400" /> {t('preview_trans', 'Translated Text')}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed bg-gradient-to-r from-saffron-50/30 to-orange-50/20 rounded-xl p-3.5 border border-saffron-100/50">
                {isTranslating ? 'Translating...' : avatar?.translated_text || previewTranslatedText || ''}
              </p>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  )
}
