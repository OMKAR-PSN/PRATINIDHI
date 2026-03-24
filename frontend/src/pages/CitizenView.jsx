import { useParams, Link } from 'react-router-dom'
import AvatarPlayer from '../components/AvatarPlayer'
import { Globe, RotateCcw, Download, Share2, Shield, MessageSquare, Smartphone } from 'lucide-react'
import { useState } from 'react'

const qualityOptions = [
  { id: '240p', label: '240p' },
  { id: '360p', label: '360p' },
  { id: '720p', label: '720p' },
]

export default function CitizenView() {
  const { id } = useParams()
  const [quality, setQuality] = useState('240p') // Default 240p for mobile

  const mockData = {
    id: id || 'demo',
    title: 'PM Kisan Scheme Registration Open',
    translatedText: 'पीएम किसान योजना पंजीकरण अब खुला है। सभी पात्र किसान सरकारी पोर्टल या अपने निकटतम सीएससी केंद्र के माध्यम से पंजीकरण कर सकते हैं।',
    language: 'Hindi',
    languageCode: 'hi',
    sender: 'Government of India',
    date: 'March 18, 2026',
    videoUrl: null,
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: mockData.title, text: mockData.translatedText, url: window.location.href })
    }
  }

  const handleWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(`${mockData.title}: ${window.location.href}`)}`, '_blank')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Top bar */}
      <div className="glass sticky top-0 z-10 px-4 py-3 shadow-sm">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center shadow-md shadow-blue-500/20">
              <Globe className="w-4 h-4 text-white" />
            </div>
            <span className="font-heading font-bold text-sm text-gray-800">Prati<span className="text-saffron-500">nidhi</span></span>
          </div>
          <div className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-emerald-500" />
            <span className="text-[11px] text-emerald-600 font-medium">Verified</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-xl mx-auto px-4 py-5">
        {/* Sender */}
        <div className="glass-card rounded-2xl p-4 mb-4 animate-fade-in-up">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Globe className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-900">{mockData.sender}</p>
              <p className="text-xs text-gray-400">{mockData.date}</p>
            </div>
            <span className="badge-lang text-[11px] font-semibold px-3 py-1.5 rounded-full">{mockData.language}</span>
          </div>
        </div>

        {/* Video */}
        <div className="flex justify-center animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <AvatarPlayer videoUrl={mockData.videoUrl} title={mockData.title} compact />
        </div>

        {/* Quality + bandwidth label */}
        <div className="mt-3 glass-card rounded-xl p-3 flex items-center justify-between animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
          <div className="flex items-center gap-1.5">
            <Smartphone className="w-3.5 h-3.5 text-emerald-500" />
            <span className="text-[11px] text-emerald-600 font-medium">Optimized for rural connectivity</span>
          </div>
          <div className="flex items-center gap-1">
            {qualityOptions.map(q => (
              <button
                key={q.id}
                onClick={() => setQuality(q.id)}
                className={`text-[10px] font-bold px-2 py-1 rounded-md transition-all btn-press ${
                  quality === q.id ? 'gradient-primary text-white' : 'text-gray-400 hover:text-gray-600'
                }`}
              >{q.label}</button>
            ))}
          </div>
        </div>

        {/* Transcript with large subtitles */}
        <div className="mt-4 glass-card rounded-2xl p-5 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <h3 className="text-sm font-semibold text-gray-800 mb-2">Message Transcript</h3>
          <p className="text-base text-gray-700 leading-relaxed font-medium">{mockData.translatedText}</p>
        </div>

        {/* Actions — large buttons for mobile */}
        <div className="mt-4 grid grid-cols-2 gap-3 animate-fade-in-up" style={{ animationDelay: '0.25s' }}>
          <button
            onClick={() => { const v = document.querySelector('video'); if (v) { v.currentTime = 0; v.play() } }}
            className="flex items-center justify-center gap-2 glass-card rounded-2xl py-4 hover:bg-white/90 transition-all btn-press"
          >
            <RotateCcw className="w-5 h-5 text-blue-500" />
            <span className="text-sm font-semibold text-gray-700">Replay</span>
          </button>
          <button className="flex items-center justify-center gap-2 glass-card rounded-2xl py-4 hover:bg-white/90 transition-all btn-press">
            <Download className="w-5 h-5 text-blue-500" />
            <span className="text-sm font-semibold text-gray-700">Download</span>
          </button>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-3 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <button
            onClick={handleWhatsApp}
            className="flex items-center justify-center gap-2 bg-emerald-500 text-white rounded-2xl py-4 hover:bg-emerald-600 transition-all btn-press shadow-lg shadow-emerald-500/20"
          >
            <Share2 className="w-5 h-5" />
            <span className="text-sm font-semibold">Share via WhatsApp</span>
          </button>
          <Link
            to="/ask-avatar"
            className="flex items-center justify-center gap-2 gradient-primary text-white rounded-2xl py-4 hover:shadow-lg transition-all btn-press shadow-lg shadow-blue-500/20"
          >
            <MessageSquare className="w-5 h-5" />
            <span className="text-sm font-semibold">Ask Question</span>
          </Link>
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-[11px] text-gray-400">
          Powered by Pratinidhi AI • Official Government Communication
        </p>
      </div>
    </div>
  )
}
