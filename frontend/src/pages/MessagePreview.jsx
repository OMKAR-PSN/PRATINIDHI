import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import { ArrowLeft, Loader2, Play, Pause, Globe, Users, CheckCircle2, Clock, MapPin, Video, Eye } from 'lucide-react'

export default function MessagePreview() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const leaderId = localStorage.getItem('leaderId')

  useEffect(() => {
    const fetchPreview = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/messages/${id}/preview?leader_id=${leaderId}`)
        if (!res.ok) throw new Error("Failed to fetch")
        const json = await res.json()
        setData(json)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchPreview()
  }, [id, leaderId])

  if (loading) {
    return (
      <div className="min-h-screen gradient-subtle flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
      </div>
    )
  }

  if (!data || !data.message) {
    return (
      <div className="min-h-screen gradient-subtle flex flex-col items-center justify-center gap-4">
        <h2 className="text-xl font-bold text-gray-800">Message not found</h2>
        <button onClick={() => navigate('/messages')} className="px-5 py-2 glass-card rounded-xl text-sm font-semibold">
          <ArrowLeft className="w-4 h-4 inline mr-2" /> Back to Messages
        </button>
      </div>
    )
  }

  const { message, translations, delivery } = data

  return (
    <div className="min-h-screen gradient-subtle tech-grid flex">
      <Sidebar />
      <div className="ml-64 p-8 flex-1">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <button onClick={() => navigate('/messages')} className="mb-4 text-xs font-bold text-gray-500 hover:text-blue-600 flex items-center gap-1 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back to Messages
              </button>
              <h1 className="font-heading text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
                Broadcast Preview
              </h1>
              <p className="text-gray-500 text-sm mt-1">Detailed analysis and media assets for message ID: {message.id.slice(0, 8)}</p>
            </div>
            <div className="text-right">
              <span className="badge-tech bg-blue-50 text-blue-700 flex items-center gap-1 ml-auto">
                <Clock className="w-3 h-3" /> {new Date(message.created_at).toLocaleString()}
              </span>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="glass-card p-5 rounded-2xl">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Total Targets</p>
              <h3 className="text-2xl font-black text-gray-900">{message.total_receivers}</h3>
              <p className="text-xs text-gray-500 mt-1 flex items-center gap-1"><Users className="w-3 h-3 text-blue-500"/> Citizens</p>
            </div>
            <div className="glass-card p-5 rounded-2xl bg-gradient-to-br from-emerald-500/5 to-emerald-600/10 border-emerald-100">
              <p className="text-xs font-bold text-emerald-600/80 uppercase tracking-wider mb-1">Delivered</p>
              <h3 className="text-2xl font-black text-emerald-700">{delivery?.delivered || 0}</h3>
              <p className="text-xs text-emerald-600/70 mt-1 flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> Successfully</p>
            </div>
            <div className="glass-card p-5 rounded-2xl">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Languages</p>
              <h3 className="text-2xl font-black text-gray-900">{translations?.length || 1}</h3>
              <p className="text-xs text-gray-500 mt-1 flex items-center gap-1"><Globe className="w-3 h-3 text-saffron-500"/> Localizations</p>
            </div>
          </div>

          {/* Original Message */}
          <div className="glass-card rounded-2xl p-6 mb-8 border-l-4 border-gray-400">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-600 bg-gray-100 px-2 py-0.5 rounded">Original Source Base</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-saffron-600 bg-saffron-50 px-2 py-0.5 rounded ml-2">{message.original_language || 'Hindi'}</span>
            </div>
            <p className="text-gray-800 font-medium text-sm leading-relaxed">{message.message_text}</p>
          </div>

          {/* Translations */}
          <h2 className="font-heading text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Globe className="w-5 h-5 text-blue-500" /> Dispatched Regional Media
          </h2>
          
          <div className="space-y-4">
            {translations && translations.length > 0 ? (
              translations.map((t, idx) => (
                <div key={idx} className="glass-card rounded-2xl p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between gap-6">
                    <div className="flex-1">
                      <div className="bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full inline-block mb-3">
                        {t.language.toUpperCase()} Translation
                      </div>
                      <p className="text-gray-700 text-sm leading-relaxed font-medium mb-4">{t.translated_text || 'No text found'}</p>
                      
                      {t.audio_url && (
                        <div className="bg-gray-50 rounded-xl p-3 border border-gray-100 max-w-sm">
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                            <Play className="w-3 h-3" /> Voice Broadcast Audio
                          </p>
                          <audio controls src={t.audio_url} className="w-full h-8" />
                        </div>
                      )}
                    </div>
                    {t.video_url && (
                      <div className="w-48 shrink-0 relative rounded-xl overflow-hidden shadow-sm border border-gray-100">
                        <video 
                          src={t.video_url} 
                          controls
                          poster={t.video_url.replace('.mp4', '.jpg')}
                          className="w-full h-auto aspect-[3/4] object-cover bg-black"
                        />
                        <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-[10px] font-bold text-white flex items-center gap-1">
                          <Video className="w-3 h-3" /> Video
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center p-8 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                <p className="text-gray-500 text-sm font-medium">No localized media found for this message. It may have been a text-only broadcast.</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}
