import { Link } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import Navbar from '../components/Navbar'
import ParticleNetwork from '../components/ParticleNetwork'
import {
  Globe, Mic, Video, Shield, MessageSquare, ArrowRight,
  Users, Building2, Smartphone, ChevronRight,
  GraduationCap, Megaphone, HelpCircle, Zap, Eye, Radio,
  CheckCircle2, Sparkles, Bot, Play, Star, ArrowUpRight,
  Layers, Lock, BarChart3, Headphones, X,
  Scale, PhoneCall, Network, Map, KeySquare, Activity, FileText, AlertTriangle, Monitor, TrendingUp
} from 'lucide-react'
import IndicTranslationIcon from '../components/IndicTranslationIcon'

const avatarData = [
  { state: 'GUJARAT', lang: 'Gujarati', image: '/avatars/gujarat.png', gradient: 'from-amber-400 to-orange-500' },
  { state: 'BENGAL', lang: 'Bengali', image: '/avatars/bengal.png', gradient: 'from-red-400 to-rose-500' },
  { state: 'MAHARASHTRA', lang: 'Marathi', image: '/avatars/maharashtra.png', gradient: 'from-orange-400 to-amber-500' },
  { state: 'PUNJAB', lang: 'Punjabi', image: '/avatars/punjab.png', gradient: 'from-yellow-400 to-amber-500' },
  { state: 'ODISHA', lang: 'Odia', image: '/avatars/Screenshot 2026-03-20 170602.png', gradient: 'from-emerald-400 to-teal-500' },
  { state: 'TAMIL NADU', lang: 'Tamil', image: '/avatars/Screenshot 2026-03-20 170623.png', gradient: 'from-purple-400 to-violet-500' },
  { state: 'KARNATAKA', lang: 'Kannada', image: '/avatars/Screenshot 2026-03-20 171917.png', gradient: 'from-red-500 to-pink-500' },
  { state: 'UTTAR PRADESH', lang: 'Bhojpuri', image: '/avatars/Screenshot 2026-03-20 171857.png', gradient: 'from-sky-400 to-blue-500' },
]

const features = [
  { icon: IndicTranslationIcon, title: 'Multilingual AI', desc: 'Translate messages into 22+ Indian languages instantly with BHASHINI-powered AI.', color: 'saffron', image: 'https://images.unsplash.com/photo-1575017253457-410a6a0e10dc?auto=format&fit=crop&q=80&w=600' },
  { icon: Video, title: 'Realistic Avatars', desc: 'Generate lifelike talking avatars with lip-sync from a single photograph.', color: 'blue', image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=600' },
  { icon: Smartphone, title: 'Low Bandwidth', desc: 'Optimized 240p delivery for rural areas with limited connectivity.', color: 'green', image: 'https://images.unsplash.com/photo-1533633634091-8ac1420ed696?auto=format&fit=crop&q=80&w=600' },
  { icon: Shield, title: 'OTP Consent Lock', desc: 'Secure consent verification before publishing announcements.', color: 'saffron', image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=600' },
  { icon: Bot, title: 'Citizen Q&A', desc: 'RAG-powered AI answers citizen questions about government schemes.', color: 'blue', image: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&q=80&w=600' },
  { icon: Zap, title: 'Real-time Pipeline', desc: 'End-to-end from text to talking avatar in minutes.', color: 'green', image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=600' },
]

const showcaseData = [
  {
    title: 'Multilingual AI Translation',
    shortTitle: 'AI Translation',
    desc: 'Translate messages into 22+ Indian languages instantly with BHASHINI-powered AI.',
    fullDesc: 'Our Multilingual AI Translation engine, powered by BHASHINI, enables real-time translation of government announcements into 22+ Indian languages. From Hindi and Tamil to Bodo and Maithili — every citizen receives messages in their native tongue. The system uses advanced neural machine translation models fine-tuned for Indian language pairs, ensuring accuracy in governance terminology.',
    image: '/showcase/multilingual.png',
    tag: 'BHASHINI Powered',
  },
  {
    title: 'Realistic Avatar Generator',
    shortTitle: 'Avatar Generator',
    desc: 'Generate lifelike talking avatars with lip-sync from a single photograph.',
    fullDesc: 'Create photorealistic talking avatars from just a single photograph. Our AI processes facial features, generates natural lip-sync movements, and produces studio-quality video output. Government leaders can deliver personalized messages through their digital avatars, making governance communication more relatable and trustworthy for citizens across India.',
    image: '/showcase/avatar.png',
    tag: 'AI Video',
  },
  {
    title: 'Low Bandwidth Delivery',
    shortTitle: 'Low Bandwidth',
    desc: 'Optimized 240p delivery for rural areas with limited connectivity.',
    fullDesc: 'Built for Bharat\'s ground reality — our adaptive streaming technology delivers avatar videos at 240p quality optimized for 2G/3G networks prevalent in rural India. Smart compression algorithms reduce file sizes by up to 80% while maintaining speech clarity. Even citizens in the most remote panchayats can access government announcements seamlessly.',
    image: '/showcase/bandwidth.png',
    tag: 'Rural India',
  },
  {
    title: 'OTP Consent Lock',
    shortTitle: 'OTP Consent',
    desc: 'Secure consent verification before publishing announcements.',
    fullDesc: 'Every government announcement goes through our secure OTP Consent Lock system before publication. Authorized officials verify and approve messages via one-time password verification, ensuring no unauthorized or fake announcements reach citizens. This digital consent trail provides full accountability and prevents misinformation at the source.',
    image: '/showcase/otp.png',
    tag: 'Security',
  },
  {
    title: 'Citizen Q&A Assistant',
    shortTitle: 'Citizen Q&A',
    desc: 'RAG-powered AI answers citizen questions about government schemes.',
    fullDesc: 'Our Retrieval-Augmented Generation (RAG) powered Q&A assistant helps citizens get instant answers about government schemes, subsidies, and services. Ask in any Indian language — the AI searches through verified government databases and provides accurate, cited responses. Available 24/7, it bridges the information gap between governance and citizens.',
    image: '/showcase/citizenqa.png',
    tag: 'RAG AI',
  },
  {
    title: 'Real-time Pipeline',
    shortTitle: 'AI Pipeline',
    desc: 'End-to-end from text to talking avatar in minutes.',
    fullDesc: 'Our end-to-end AI pipeline transforms plain text into a fully produced talking avatar video in under 5 minutes. The pipeline flows through five stages: Text Input → AI Translation → Speech Synthesis → Avatar Generation → Citizen Delivery. Each stage is optimized for speed and quality, making mass governance communication practical and scalable.',
    image: '/showcase/multilingual.png',
    tag: 'Pipeline',
  },
]

function SangrahaShowcase() {
  const [active, setActive] = useState(0)
  const [modalItem, setModalItem] = useState(null)

  useEffect(() => {
    if (modalItem) return // pause auto-rotate when modal is open
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % showcaseData.length)
    }, 3000)
    return () => clearInterval(timer)
  }, [modalItem])

  // ESC key closes modal
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') setModalItem(null) }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

  const getPos = (index) => {
    const total = showcaseData.length
    let diff = index - active
    if (diff > total / 2) diff -= total
    if (diff < -total / 2) diff += total
    if (diff >= -2 && diff <= 2) return String(diff)
    return 'hidden'
  }

  const handleCardClick = (index) => {
    if (index === active) {
      setModalItem(showcaseData[index])
    } else {
      setActive(index)
    }
  }

  return (
    <>
      <section className="sangrah-section py-24" id="features">
        {/* Dot grid overlay */}
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-flex items-center gap-2 bg-white/8 text-saffron-400 text-sm font-semibold px-5 py-2 rounded-full mb-6 border border-white/10 backdrop-blur-sm">
              <Sparkles className="w-4 h-4" />
              PRATINIDHI Sangrah
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Experience the Power of
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-saffron-400 via-white to-indian-green">
                PRATINIDHI Platform
              </span>
            </h2>
            <p className="text-white/40 mt-5 text-lg max-w-2xl mx-auto">
              Explore our AI-powered tools for multilingual governance communication. Click any card to learn more.
            </p>
          </div>

          {/* Carousel */}
          <div className="sangrah-carousel">
            {showcaseData.map((item, i) => (
              <div
                key={i}
                className="sangrah-card"
                data-pos={getPos(i)}
                onClick={() => handleCardClick(i)}
              >
                <img src={item.image} alt={item.title} loading="lazy" />
                <div className="sangrah-card-overlay">
                  <h3>{item.shortTitle}</h3>
                  <p>{item.desc}</p>
                </div>
                <div className="sangrah-click-hint">
                  <ArrowUpRight className="w-5 h-5" />
                </div>
              </div>
            ))}
          </div>

          {/* Dots */}
          <div className="sangrah-dots">
            {showcaseData.map((_, i) => (
              <button
                key={i}
                className={`sangrah-dot ${i === active ? 'active' : ''}`}
                onClick={() => setActive(i)}
                aria-label={`View ${showcaseData[i].shortTitle}`}
              />
            ))}
          </div>

          {/* Active label */}
          <div className="text-center mt-4">
            <span className="text-saffron-400 font-heading font-bold text-sm tracking-widest">
              {showcaseData[active].shortTitle}
            </span>
            <span className="text-white/30 text-xs ml-3">Click to explore →</span>
          </div>
        </div>
      </section>

      {/* Modal */}
      {modalItem && (
        <div className="sangrah-modal-backdrop" onClick={() => setModalItem(null)}>
          <div className="sangrah-modal" onClick={(e) => e.stopPropagation()}>
            <button className="sangrah-modal-close" onClick={() => setModalItem(null)}>
              <X className="w-5 h-5" />
            </button>
            <img src={modalItem.image} alt={modalItem.title} className="sangrah-modal-img" />
            <div className="sangrah-modal-body">
              <div className="sangrah-modal-tag">
                <Sparkles className="w-3 h-3" />
                {modalItem.tag}
              </div>
              <h2>{modalItem.title}</h2>
              <p>{modalItem.fullDesc}</p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

const steps = [
  { num: '01', title: 'Leader Message', desc: 'Admin enters announcement text', icon: Mic, color: 'from-primary-500 to-primary-400' },
  { num: '02', title: 'AI Translation', desc: 'Translated into regional language', icon: IndicTranslationIcon, color: 'from-saffron-500 to-saffron-400' },
  { num: '03', title: 'Speech Generation', desc: 'Natural text-to-speech audio', icon: Headphones, color: 'from-indian-green to-indian-green-light' },
  { num: '04', title: 'Avatar Creation', desc: 'Lip-synced talking avatar', icon: Video, color: 'from-primary-500 to-primary-400' },
  { num: '05', title: 'Citizen Delivery', desc: 'Native language access', icon: Users, color: 'from-saffron-500 to-saffron-400' },
]

const useCases = [
  { icon: Building2, title: 'Governance', desc: 'Policy announcements and scheme details in regional languages.', stat: '2.5L+ Panchayats', image: 'https://images.unsplash.com/photo-1555848962-6e79363ec58f?auto=format&fit=crop&q=80&w=600' },
  { icon: GraduationCap, title: 'Education', desc: 'Educational content and scholarship info for students.', stat: '500K+ Students', image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=600' },
  { icon: Megaphone, title: 'Awareness', desc: 'Health campaigns, disaster alerts, safety guidelines.', stat: '100M+ Reach', image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=600' },
  { icon: HelpCircle, title: 'Citizen Q&A', desc: 'AI-driven answers about government services.', stat: '24/7 Available', image: 'https://images.unsplash.com/photo-1573497491765-dccce02b29df?auto=format&fit=crop&q=80&w=600' },
]

const stats = [
  { value: '22+', label: 'Indian Languages', icon: IndicTranslationIcon },
  { value: '600M+', label: 'Citizens to Reach', icon: Users },
  { value: '2.5L+', label: 'Panchayats Reachable', icon: Building2 },
  { value: '100%', label: 'Rural-Friendly', icon: Smartphone },
]

const trustedBy = ['BHASHINI', 'NIC', 'Digital India', 'MeitY', 'NeGD']

// Category 1: Core Features
const coreFeatures1 = [
  { icon: Video, title: '01. Avatar Creation Engine', desc: 'Clones leader or educator face from a 2-minute video. Generates a multilingual lip-synced avatar using SadTalker and Wav2Lip. Supports 240p to 1080p output.', color: 'primary', tags: ['Lip-Sync', 'Photo-to-Video'] },
  { icon: IndicTranslationIcon, title: '02. BHASHINI Integration', desc: 'Real-time speech translation across all 22 scheduled Indian languages plus dialect detection. Powered by the Government of India BHASHINI API at zero cost.', color: 'saffron', tags: ['22+ Languages', 'Zero Cost'] },
  { icon: Shield, title: '03. Consent-Lock Module', desc: 'Biometric or OTP approval required before any avatar can speak content. Every approved message is cryptographically signed. Prevents deepfake misuse.', color: 'green', tags: ['OTP Verified', 'Anti-Deepfake'] },
  { icon: Smartphone, title: '04. Low-Bandwidth Engine', desc: 'Compresses avatar video to WhatsApp-forward-ready 240p. Automatic SMS text fallback for zero-data zones. Designed for 2G connectivity.', color: 'primary', tags: ['2G Ready', 'SMS Fallback'] },
]

const coreFeatures2 = [
  { icon: MessageSquare, title: '05. Interactive Q&A Avatar', desc: 'Citizens ask the avatar questions in their local language. A RAG pipeline over government scheme PDFs powered by LLaMA 3 generates accurate answers.', color: 'saffron', tags: ['RAG-Powered', 'LLaMA 3'] },
  { icon: Scale, title: '06. MCC Compliance Filter', desc: 'An NLP layer checks all content against the Election Commission of India Model Code of Conduct before any avatar message is published. Blocks violations.', color: 'green', tags: ['ECI Compliant', 'NLP Filter'] },
  { icon: BarChart3, title: '07. Analytics Dashboard', desc: 'Tracks reach, language distribution, citizen engagement, call volume per scheme, and scheme awareness uplift per district.', color: 'primary', tags: ['Measurable ROI', 'Real-time'] },
  { icon: Users, title: '08. Role-Based Access Control', desc: 'Differentiated access for Sarpanch, MLA, MP, Educator, and Institution. Each role has scoped avatar creation and delivery rights.', color: 'saffron', tags: ['RBAC', 'Scoped Access'] },
]

// Category 2: New Unique Features
const uniqueFeatures = [
  { icon: PhoneCall, title: '09. IVR Missed-Call Q&A System', desc: 'Villager gives a missed call. IVR picks up at zero cost. System runs RAG, generates audio answer using cloned voice, and plays it back in dialect.', color: 'green', tags: ['Zero Internet', 'Toll-Free'] },
  { icon: Radio, title: '10. Gram Sabha Auto-Broadcast', desc: 'Sarpanch records once. System auto-generates scheme-specific avatar clips for new notifications and broadcasts to all villagers like a WhatsApp channel.', color: 'primary', tags: ['WhatsApp Ready', 'Auto-Generate'] },
  { icon: Network, title: '11. Adaptive Network Delivery', desc: 'Auto-detects network speed. 4G gets full video, 3G gets audio+image, 2G gets voice note, No-data gets SMS summary. No one excluded.', color: 'saffron', tags: ['Adaptive', 'Inclusive'] },
  { icon: Map, title: '12. Beneficiary Geo-Mapping', desc: 'Maps every citizen interaction onto a district, ward, and panchayat heatmap. Identifies dark zones with low scheme awareness for targeted outreach.', color: 'green', tags: ['Heatmaps', 'Dark Zones'] },
]



const colorConfig = {
  primary: { iconBg: 'gradient-primary', shadow: 'shadow-primary-500/15', tagBg: 'bg-primary-500/6 text-primary-600', border: 'border-primary-500/10' },
  saffron: { iconBg: 'gradient-saffron', shadow: 'shadow-saffron-500/15', tagBg: 'bg-saffron-500/8 text-saffron-700', border: 'border-saffron-500/10' },
  green: { iconBg: 'gradient-green', shadow: 'shadow-indian-green/15', tagBg: 'bg-indian-green/6 text-indian-green', border: 'border-indian-green/10' },
}

const FeatureSection = ({ title, desc, features, startIndex }) => (
  <div className="mb-0 sticky top-24 z-10 bg-white/60 backdrop-blur-[40px] p-8 sm:p-12 rounded-[2.5rem] shadow-[0_-8px_40px_rgba(0,0,0,0.06)] border border-white/50 transition-all duration-500 hover:bg-white/75 mt-8 max-w-[100vw] overflow-hidden">
    <div className="mb-10 text-center sm:text-left">
      <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">{title}</h2>
      <p className="text-gray-500 mt-3 text-lg">{desc}</p>
    </div>
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {features.map(({ icon: Icon, title: featureTitle, desc: featureDesc, color, tags }, i) => {
        const c = colorConfig[color]
        return (
          <div
            key={i}
            className={`group glass-card rounded-2xl p-6 hover-lift scroll-reveal cursor-default border-t-2 ${c.border} flex flex-col h-full`}
            style={{ '--delay': `${(i % 4) * 0.1}s` }}
          >
            <div className={`w-12 h-12 rounded-xl ${c.iconBg} flex items-center justify-center shadow-lg ${c.shadow} group-hover:scale-110 transition-transform duration-300`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-heading font-semibold text-lg text-gray-900 mt-5">{featureTitle}</h3>
            <p className="text-gray-500 text-sm mt-3 leading-relaxed flex-grow">{featureDesc}</p>
            <div className="flex flex-wrap gap-1.5 mt-5">
              {tags.map((tag) => (
                <span key={tag} className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${c.tagBg}`}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  </div>
)

export default function LandingPage() {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
        }
      })
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' })

    const elements = document.querySelectorAll('.scroll-reveal')
    elements.forEach((el) => observer.observe(el))
    
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % avatarData.length)
    }, 2500)
    return () => clearInterval(interval)
  }, [])

  // Show 3 avatars at a time in a 3D perspective view
  const getVisibleAvatars = () => {
    const total = avatarData.length
    const indices = []
    for (let i = -1; i <= 1; i++) {
      indices.push((activeIndex + i + total) % total)
    }
    return indices
  }

  return (
    <div className="min-h-screen bg-cream-50">
      <Navbar transparent />

      {/* ===== HERO ===== */}
      <section className="relative min-h-screen flex items-center gradient-hero overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden bg-[#0A1628]">
          <ParticleNetwork />
          {/* Dot grid */}
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }} />
          {/* Accent lines */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-saffron-400/30 to-transparent" />
          <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left — Text Content */}
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-white/8 backdrop-blur-sm rounded-full px-5 py-2 mb-8 border border-white/10 scroll-reveal">
                <div className="w-2 h-2 rounded-full bg-indian-green animate-pulse" />
                <span className="text-sm text-white/70 font-medium">Powered by BHASHINI AI • Made for Bharat</span>
              </div>

              <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.1] tracking-tight scroll-reveal" style={{ '--delay': '0.1s' }}>
                AI Video Generator
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-saffron-400 via-saffron-300 to-saffron-400">
                  for Governance
                </span>
              </h1>

              <p className="mt-6 text-lg text-white/50 max-w-xl leading-relaxed scroll-reveal" style={{ '--delay': '0.2s' }}>
                Transform government communication with AI-powered multilingual avatars. Deliver trusted announcements in 22+ Indian languages — bridging every language barrier, reaching every citizen.
              </p>

              <div className="mt-10 flex flex-col sm:flex-row items-start gap-4 scroll-reveal" style={{ '--delay': '0.3s' }}>
                <Link
                  to="/view/demo"
                  className="group px-8 py-4 rounded-2xl bg-gradient-to-r from-saffron-500 to-saffron-400 text-white font-semibold text-lg hover:shadow-2xl hover:shadow-saffron-500/30 transition-all duration-300 btn-press btn-shine flex items-center gap-3"
                >
                  <Play className="w-5 h-5" />
                  Try Demo Free
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/login"
                  className="px-8 py-4 rounded-2xl border-2 border-white/15 text-white font-semibold text-lg hover:bg-white/10 hover:border-white/25 transition-all duration-300 backdrop-blur-sm btn-press"
                >
                  Admin Portal →
                </Link>
              </div>

              {/* Trust badges */}
              <div className="mt-14 flex flex-wrap items-center gap-3 scroll-reveal" style={{ '--delay': '0.5s' }}>
                {['BHASHINI Multi-Language', 'Lip-Sync Avatars', 'Low Bandwidth', 'OTP Consent'].map((badge) => (
                  <span key={badge} className="inline-flex items-center gap-1.5 bg-white/5 backdrop-blur-sm border border-white/8 rounded-full px-4 py-2 text-xs text-white/40 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-saffron-400" />
                    {badge}
                  </span>
                ))}
              </div>
            </div>

            {/* Right — 3D Avatar Carousel */}
            <div className="hidden lg:block scroll-reveal" style={{ '--delay': '0.4s' }}>
              <div className="relative" style={{ perspective: '1200px' }}>
                {/* Title */}
                <div className="text-center mb-6">
                  <h3 className="text-white/80 font-heading font-bold text-lg tracking-wide">
                    🇮🇳 AI Avatars Across India
                  </h3>
                  <p className="text-white/30 text-xs mt-1">8 Regional Language Avatars • Auto-Rotating</p>
                </div>

                {/* 3D Carousel Container */}
                <div className="avatar-carousel-wrapper" style={{ height: '380px' }}>
                  <div
                    className="avatar-carousel-track"
                    style={{
                      transform: `rotateY(${-activeIndex * 45}deg)`,
                      transition: 'transform 1s cubic-bezier(0.4, 0, 0.2, 1)',
                      transformStyle: 'preserve-3d',
                      position: 'relative',
                      width: '100%',
                      height: '100%',
                    }}
                  >
                    {avatarData.map((avatar, i) => {
                      const angle = i * 45
                      const isActive = i === activeIndex
                      return (
                        <div
                          key={avatar.state}
                          className={`avatar-carousel-item ${isActive ? 'active' : ''}`}
                          style={{
                            transform: `rotateY(${angle}deg) translateZ(280px)`,
                            position: 'absolute',
                            left: '50%',
                            top: '50%',
                            marginLeft: '-85px',
                            marginTop: '-150px',
                          }}
                          onClick={() => setActiveIndex(i)}
                        >
                          <div className={`avatar-card ${isActive ? 'avatar-card-active avatar-breathe hand-gesture-sim' : ''}`}>
                            {/* Avatar Image */}
                            <div className={`avatar-image-wrapper ${isActive ? 'avatar-nod' : ''}`}>
                              {avatar.image ? (
                                <img
                                  src={avatar.image}
                                  alt={`${avatar.state} Avatar`}
                                  className={`w-full h-full object-cover avatar-talking-face`}
                                />
                              ) : (
                                <div className={`w-full h-full bg-gradient-to-br ${avatar.gradient} flex items-center justify-center`}>
                                  <Users className="w-12 h-12 text-white/80" />
                                </div>
                              )}
                              {/* Mouth shadow - simulates lip movement */}
                              <div className="mouth-shadow" />
                              {/* Jaw movement overlay */}
                              <div className="avatar-jaw" />
                              {/* Mic indicator */}
                              <div className="absolute bottom-2 right-2 w-7 h-7 rounded-full bg-indian-green flex items-center justify-center shadow-lg">
                                <Mic className="w-3.5 h-3.5 text-white" />
                              </div>
                              {/* Mic speaking ring pulse */}
                              <div className="mic-speaking-ring" />
                              {/* Speaking waveform animation for active */}
                              {isActive && (
                                <div className="lip-sync-overlay">
                                  <div className="lip-sync-bar" />
                                  <div className="lip-sync-bar" />
                                  <div className="lip-sync-bar" />
                                  <div className="lip-sync-bar" />
                                  <div className="lip-sync-bar" />
                                </div>
                              )}
                            </div>
                            {/* State & Language Label */}
                            <div className="avatar-label">
                              <div className="flex items-center gap-1.5 justify-center">
                                <span className="text-xs font-bold text-white tracking-wider">{avatar.state}</span>
                              </div>
                              <span className="text-[10px] text-white/60">{avatar.lang}</span>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* State navigation dots */}
                <div className="flex items-center justify-center gap-2 mt-4">
                  {avatarData.map((avatar, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveIndex(i)}
                      className={`transition-all duration-300 rounded-full ${
                        i === activeIndex
                          ? 'w-8 h-2.5 bg-gradient-to-r from-saffron-400 to-saffron-500 shadow-lg shadow-saffron-500/30'
                          : 'w-2.5 h-2.5 bg-white/20 hover:bg-white/40'
                      }`}
                      aria-label={`View ${avatar.state} avatar`}
                    />
                  ))}
                </div>

                {/* Active state name display */}
                <div className="text-center mt-3">
                  <span className="text-saffron-400 font-heading font-bold text-sm tracking-widest">
                    {avatarData[activeIndex].state}
                  </span>
                  <span className="text-white/30 text-xs ml-2">• {avatarData[activeIndex].lang}</span>
                </div>

                {/* Floating accent cards */}
                <div className="absolute -top-2 -right-4 bg-white/95 backdrop-blur-sm rounded-2xl p-3 shadow-xl shadow-primary-500/10 animate-float border border-white/50 z-20">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-indian-green/10 flex items-center justify-center">
                      <IndicTranslationIcon className="w-4 h-4 text-indian-green" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-900">22+ Languages</p>
                      <p className="text-[10px] text-gray-400">Auto-translate</p>
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-8 -left-4 bg-white/95 backdrop-blur-sm rounded-2xl p-3 shadow-xl shadow-saffron-500/10 animate-float-reverse border border-white/50 z-20">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-saffron-500/10 flex items-center justify-center">
                      <Shield className="w-4 h-4 text-saffron-600" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-900">OTP Verified</p>
                      <p className="text-[10px] text-gray-400">Consent lock</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave separator */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" className="w-full">
            <path d="M0,80L60,75C120,70,240,60,360,55C480,50,600,50,720,55C840,60,960,70,1080,72C1200,75,1320,70,1380,67L1440,65V120H0Z" fill="#FDFBF7"/>
          </svg>
        </div>
      </section>

      {/* ===== TRUSTED BY ===== */}
      <section className="py-12 bg-cream-50 border-b border-cream-100">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-center text-sm text-gray-400 font-medium uppercase tracking-wider mb-8">Trusted by India's Digital Infrastructure</p>
          <div className="flex flex-wrap items-center justify-center gap-12">
            {trustedBy.map((name, i) => (
              <span key={i} className="text-gray-300 font-heading font-bold text-xl hover:text-primary-500 transition-colors duration-300 cursor-default">
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>



      {/* ===== SANGRAH SHOWCASE (Bhashini-Inspired) ===== */}
      <SangrahaShowcase />

      {/* ===== HOW IT WORKS (HeyGen Pipeline Style) ===== */}
      <section className="py-24 gradient-subtle dot-pattern" id="how-it-works">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-flex items-center gap-2 bg-primary-500/8 text-primary-500 text-sm font-semibold px-4 py-1.5 rounded-full mb-5">
              <Layers className="w-4 h-4" />
              Pipeline
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight">
              From Text to <span className="text-transparent bg-clip-text bg-gradient-to-r from-saffron-500 to-saffron-400">Talking Avatar</span>
            </h2>
            <p className="text-gray-500 mt-4 text-lg">Five simple steps to create multilingual government announcements.</p>
          </div>

          <div className="mt-20 relative">
            {/* Connecting line */}
            <div className="hidden lg:block absolute top-[52px] left-[10%] right-[10%] h-[3px] bg-gradient-to-r from-primary-500/20 via-saffron-400/30 to-indian-green/20 rounded-full" />

            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-6">
              {steps.map(({ num, title, desc, icon: Icon, color }, i) => (
                <div
                  key={i}
                  className="relative text-center group scroll-reveal"
                  style={{ '--delay': `${i * 0.12}s` }}
                >
                  <div className="relative z-10 mx-auto">
                    <div className={`w-[72px] h-[72px] rounded-3xl bg-gradient-to-br ${color} flex items-center justify-center shadow-xl mx-auto group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full gradient-saffron text-white text-[11px] font-bold flex items-center justify-center z-20 shadow-lg border-2 border-white">
                      {num}
                    </div>
                  </div>
                  <h3 className="font-heading font-semibold text-gray-900 mt-5 text-lg">{title}</h3>
                  <p className="text-sm text-gray-500 mt-2 px-2">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== COMPREHENSIVE PLATFORM FEATURES ===== */}
      <section className="py-24 bg-cream-100 dot-pattern" id="all-features">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <span className="inline-flex items-center gap-2 bg-saffron-50 text-saffron-600 text-sm font-semibold px-4 py-1.5 rounded-full mb-5">
              <Sparkles className="w-4 h-4" />
              Comprehensive 20-Point Platform
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight">
              Everything you need to
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-saffron-500 to-saffron-400">communicate at scale</span>
            </h2>
            <p className="text-gray-500 mt-5 text-lg">
              Explore the complete suite of AI-powered tools designed exclusively to bridge the communication gap between governance and rural India.
            </p>
          </div>

          <div className="relative pb-32 mt-12">
            <FeatureSection 
              title="Core Engine & Translation" 
              desc="The foundational modules integrating video synthesis and real-time translation." 
              features={coreFeatures1} 
            />
            <FeatureSection 
              title="Delivery & Analytics" 
              desc="Comprehensive tools to ensure secure delivery and track campaign performance." 
              features={coreFeatures2} 
            />
            <FeatureSection 
              title="India-First Unique Features" 
              desc="Innovative solutions designed specifically for offline, low-bandwidth, and zero-internet zones in rural India." 
              features={uniqueFeatures} 
            />
          </div>

        </div>
      </section>

      {/* ===== USE CASES (HeyGen Industry Cards) ===== */}
      <section className="py-24 bg-cream-50" id="use-cases">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="inline-flex items-center gap-2 bg-indian-green/8 text-indian-green text-sm font-semibold px-4 py-1.5 rounded-full mb-5">
              <Star className="w-4 h-4" />
              Industry Solutions
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight">
              Built for Every <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-primary-400">Use Case</span>
            </h2>
          </div>

          <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {useCases.map(({ icon: Icon, title, desc, stat, image }, i) => (
              <div
                key={i}
                className="group glass-card rounded-2xl hover-lift scroll-reveal text-center relative overflow-hidden min-h-[240px] flex flex-col"
                style={{ '--delay': `${i * 0.1}s` }}
              >
                {/* Hover Image Reveal */}
                <div 
                  className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ backgroundImage: `url(${image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                >
                  <div className="absolute inset-0 bg-white/85 backdrop-blur-[2px]" />
                </div>

                <div className="relative z-10 p-7 flex flex-col flex-1 justify-between">
                  <div>
                    <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-saffron-500/10 to-saffron-600/5 flex items-center justify-center mx-auto group-hover:from-saffron-500/25 group-hover:to-saffron-600/15 group-hover:scale-110 transition-all duration-300">
                      <Icon className="w-8 h-8 text-saffron-500 group-hover:text-saffron-400 transition-colors" />
                    </div>
                    <h3 className="font-heading font-semibold text-gray-900 mt-5 text-xl group-hover:text-gray-900 transition-colors duration-300">{title}</h3>
                    <p className="text-gray-500 text-sm mt-3 leading-relaxed group-hover:text-gray-800 transition-colors duration-300">{desc}</p>
                  </div>
                  <div className="mt-5 inline-flex items-center gap-1.5 bg-primary-500/6 group-hover:bg-saffron-500/20 text-primary-500 group-hover:text-saffron-400 text-xs font-bold px-3 py-1.5 rounded-full transition-all duration-300 mx-auto">
                    {stat}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== IMPACT / STATS (HeyGen Social Proof Style) ===== */}
      <section className="py-24 gradient-hero text-white relative overflow-hidden" id="impact">
        <div className="absolute inset-0">
          <div className="absolute top-10 right-20 w-72 h-72 bg-saffron-500/8 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-10 left-20 w-96 h-96 bg-indian-green/6 rounded-full blur-3xl animate-float-reverse" />
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)',
            backgroundSize: '32px 32px'
          }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-flex items-center gap-2 bg-white/8 text-white/70 text-sm font-semibold px-4 py-1.5 rounded-full mb-5 border border-white/10">
            <BarChart3 className="w-4 h-4" />
            Nationwide Impact
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
            Empowering Every Citizen
          </h2>
          <p className="text-white/40 mt-4 text-lg max-w-2xl mx-auto">
            Delivering native-language access to government services across the nation.
          </p>

          <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map(({ value, label, icon: Icon }, i) => (
              <div
                key={i}
                className="bg-white/6 backdrop-blur-sm rounded-2xl p-8 border border-white/8 hover:bg-white/10 hover:border-white/15 transition-all duration-300 group scroll-reveal"
                style={{ '--delay': `${i * 0.1}s` }}
              >
                <div className="w-12 h-12 rounded-2xl bg-saffron-500/15 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Icon className="w-6 h-6 text-saffron-400" />
                </div>
                <p className="font-heading text-3xl lg:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-saffron-400 to-saffron-300">
                  {value}
                </p>
                <p className="text-white/40 text-sm mt-2">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA (HeyGen Bottom CTA Style) ===== */}
      <section className="py-24 bg-cream-50 relative">
        <div className="absolute inset-0 gradient-mesh opacity-50" />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-primary-500/6 text-primary-500 text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
            <Sparkles className="w-4 h-4" />
            Get Started Today
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight">
            Ready to Transform
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-saffron-500 via-primary-500 to-indian-green">
              Governance Communication?
            </span>
          </h2>
          <p className="text-gray-500 mt-5 text-lg max-w-xl mx-auto">
            Join the digital revolution. Create multilingual AI avatar announcements in minutes.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/login"
              className="px-8 py-4 rounded-2xl gradient-primary text-white font-semibold text-lg hover:shadow-2xl hover:shadow-primary-500/25 transition-all duration-300 btn-press btn-shine flex items-center gap-2"
            >
              <Globe className="w-5 h-5" /> Admin Portal <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/view/demo"
              className="px-8 py-4 rounded-2xl border-2 border-gray-200 text-gray-700 font-semibold text-lg hover:border-saffron-300 hover:text-saffron-600 transition-all duration-300 btn-press flex items-center gap-2"
            >
              <Play className="w-5 h-5" /> Watch Demo
            </Link>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="bg-gray-900 text-white relative overflow-hidden">
        {/* Tricolor bar */}
        <div className="h-[3px] bg-gradient-to-r from-saffron-500 via-white to-indian-green" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-4 gap-12">
            {/* Brand */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center relative w-10 h-10 min-w-[40px]">
                  <div className="absolute inset-0 rounded-full border-[3px] border-t-saffron-500 border-r-white border-b-indian-green border-l-primary-600 shadow-md"></div>
                  <div className="absolute inset-0.5 rounded-full bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center shadow-inner">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                </div>
                <span className="font-heading font-extrabold text-xl tracking-tight text-white whitespace-nowrap">
                  PRATI<span className="text-saffron-500">NIDHI</span><span className="text-primary-600 text-[10px] uppercase ml-1 align-top tracking-widest font-semibold">AI</span>
                </span>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed">
                AI-powered governance communication platform for multilingual avatar announcements across India.
              </p>
            </div>

            {/* Links */}
            <div>
              <h4 className="font-heading font-semibold text-sm uppercase tracking-wider text-gray-400 mb-4">Platform</h4>
              <ul className="space-y-3">
                {['Avatar Generator', 'Translation Engine', 'Citizen Q&A', 'Analytics'].map((item) => (
                  <li key={item}><a href="#" className="text-gray-500 text-sm hover:text-white transition-colors">{item}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-heading font-semibold text-sm uppercase tracking-wider text-gray-400 mb-4">Resources</h4>
              <ul className="space-y-3">
                {['Documentation', 'API Reference', 'Integration Guide', 'Case Studies'].map((item) => (
                  <li key={item}><a href="#" className="text-gray-500 text-sm hover:text-white transition-colors">{item}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-heading font-semibold text-sm uppercase tracking-wider text-gray-400 mb-4">Company</h4>
              <ul className="space-y-3">
                {['About Us', 'Careers', 'Privacy Policy', 'Terms of Service'].map((item) => (
                  <li key={item}><a href="#" className="text-gray-500 text-sm hover:text-white transition-colors">{item}</a></li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-600 text-sm">© 2026 Pratinidhi AI. Empowering governance through AI.</p>
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <span>🇮🇳</span>
              <span>Made with ❤️ for Bharat</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
