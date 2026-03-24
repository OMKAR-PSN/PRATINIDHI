import { useParams, useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import AvatarPlayer from '../components/AvatarPlayer'
import { getAvatar, sendMessage, getPreviewTranslation } from '../services/api'
import {
  Download, Share2, Send, Globe, Clock, FileText, Copy, Check,
  Loader2, CheckCircle2, XCircle, Smartphone
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

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
  const [publishStatus, setPublishStatus] = useState(null) // { success: bool, message: str }

  // Preview Translation State
  const [selectedLanguage, setSelectedLanguage] = useState(null)
  const [previewAudioUrl, setPreviewAudioUrl] = useState(null)
  const [previewTranslatedText, setPreviewTranslatedText] = useState(null)
  const [isTranslating, setIsTranslating] = useState(false)

  // Consent state (Default to approved as per user request to bypass gate)
  const [consentStep, setConsentStep] = useState('approved') // approved
  const [otp, setOtp] = useState('')

  const leaderId = localStorage.getItem('leaderId') || 'admin'

  // Fetch preview translation
  useEffect(() => {
    const fetchTranslation = async () => {
      if (!avatar || !selectedLanguage) return;
      if (avatar.id !== 'generated') return;
      
      setIsTranslating(true)
      try {
        const { data } = await getPreviewTranslation({
          text: avatar.original_text,
          language: selectedLanguage
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
  }, [avatar?.original_text, selectedLanguage, avatar?.id])

  useEffect(() => {
    const fetchAvatar = async () => {
      // Real generated content — read the leader's actual message
      if (id === 'generated') {
        const userMessage = localStorage.getItem('generatedMessage') || ''
        const lang = localStorage.getItem('generatedLanguage') || 'hi'
        const langLabel = localStorage.getItem('generatedLanguageLabel') || 'Hindi'

        setAvatar({
          id: 'generated',
          original_text: userMessage,
          translated_text: userMessage, // In production, this would be the BHASHINI translation
          language: langLabel,
          languageCode: lang,
          video_url: null,
          created_at: new Date().toLocaleString(),
          consent_status: 'approved'
        })
        setSelectedLanguage(lang)
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

  const shareUrl = `${window.location.origin}/view/${avatar?.id || id}`

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
        language: avatar?.languageCode || 'hi'
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
          <div className="flex items-center gap-2">
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
            <AvatarPlayer videoUrl={avatar?.video_url} title={avatar?.original_text} />

            {/* Audio Preview */}
            <div className="glass-card rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-blue-500" />
                  <span className="text-sm font-semibold text-gray-700">{t('preview_audio', 'Audio Preview')}</span>
                </div>
                <span className="text-[11px] font-medium text-blue-600 bg-blue-50/80 px-2.5 py-1 rounded-full">
                  {t('preview_audio_feature', 'Translated Feature')}
                </span>
              </div>
              <p className="text-xs text-gray-500 mb-3">{t('preview_audio_desc', 'Listen to the translated speech. Each receiver gets custom audio in their language via WhatsApp.')}</p>
              {(avatar?.id === 'generated' ? previewAudioUrl : avatar?.audioUrl) && !isTranslating ? (
                <audio controls className="w-full h-10" key={avatar?.id === 'generated' ? previewAudioUrl : avatar?.audioUrl}>
                  <source src={`http://localhost:8000${avatar?.id === 'generated' ? previewAudioUrl : avatar?.audioUrl}`} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              ) : (
                <div className="text-sm font-medium text-gray-500 italic p-3 bg-gray-50 rounded-xl border border-gray-100/50">
                  <Loader2 className="w-4 h-4 animate-spin inline mr-2 text-blue-400" /> Generating translated audio...
                </div>
              )}
            </div>

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

            {/* Details */}
            <div className="glass-card rounded-2xl p-5">
              <h3 className="font-heading font-semibold text-gray-900 mb-4">{t('preview_details', 'Details')}</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Globe className="w-4 h-4 text-blue-400 mt-0.5" />
                  <div className="w-full">
                    <p className="text-xs text-gray-400 flex justify-between">
                      {t('preview_lang', 'Preview Language')}
                      {isTranslating && <Loader2 className="w-3 h-3 animate-spin inline" />}
                    </p>
                    
                    {avatar?.id === 'generated' ? (
                      <select
                        value={selectedLanguage || avatar?.languageCode || 'hi'}
                        onChange={(e) => setSelectedLanguage(e.target.value)}
                        className="mt-1.5 text-sm p-2 rounded-lg border border-gray-200 outline-none w-full bg-white/50 focus:bg-white transition-all font-medium text-gray-800"
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
                        <option value="or">Odia</option>
                        <option value="en">English</option>
                      </select>
                    ) : (
                      <div className="flex items-center gap-2 mt-0.5">
                        <p className="text-sm font-medium text-gray-800">{avatar?.language || 'Hindi'}</p>
                        <span className="badge-lang text-[10px] font-bold px-2 py-0.5 rounded-full">{(avatar?.languageCode || 'hi').toUpperCase()}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-blue-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-400">{t('preview_created', 'Created')}</p>
                    <p className="text-sm font-medium text-gray-800">{avatar?.created_at}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Transcripts */}
            <div className="glass-card rounded-2xl p-5">
              <h3 className="font-heading font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4 text-gray-400" /> {t('preview_orig', 'Original')}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed bg-gray-50/50 rounded-xl p-3.5 border border-gray-100/50">{avatar?.original_text}</p>
            </div>

            <div className="glass-card rounded-2xl p-5">
              <h3 className="font-heading font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4 text-saffron-400" /> {t('preview_trans', 'Translated Text')}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed bg-gradient-to-r from-saffron-50/30 to-orange-50/20 rounded-xl p-3.5 border border-saffron-100/50">
                {isTranslating ? 'Translating...' : (avatar?.id === 'generated' ? previewTranslatedText : avatar?.translated_text)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
