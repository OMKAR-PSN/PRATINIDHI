import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import {
  Globe, Mic, Video, Shield, MessageSquare, ArrowRight,
  Languages, Users, Building2, Smartphone, ChevronRight,
  GraduationCap, Megaphone, HelpCircle, Zap, Eye, Radio,
  CheckCircle2, Sparkles, Bot, Play, Star, ArrowUpRight,
  Layers, Lock, BarChart3, Headphones
} from 'lucide-react'

const avatarData = [
  { state: 'GUJARAT', lang: 'Gujarati', image: '/avatars/gujarat.png', gradient: 'from-amber-400 to-orange-500' },
  { state: 'BENGAL', lang: 'Bengali', image: '/avatars/bengal.png', gradient: 'from-red-400 to-rose-500' },
  { state: 'MAHARASHTRA', lang: 'Marathi', image: '/avatars/maharashtra.png', gradient: 'from-orange-400 to-amber-500' },
  { state: 'PUNJAB', lang: 'Punjabi', image: '/avatars/punjab.png', gradient: 'from-yellow-400 to-amber-500' },
  { state: 'ODISHA', lang: 'Odia', image: '/avatars/odisha.png', gradient: 'from-emerald-400 to-teal-500' },
  { state: 'TAMIL NADU', lang: 'Tamil', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400&h=400', gradient: 'from-purple-400 to-violet-500' },
  { state: 'KARNATAKA', lang: 'Kannada', image: 'https://images.unsplash.com/photo-1542596594-649edbc13630?auto=format&fit=crop&q=80&w=400&h=400', gradient: 'from-red-500 to-pink-500' },
  { state: 'UTTAR PRADESH', lang: 'Bhojpuri', image: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?auto=format&fit=crop&q=80&w=400&h=400', gradient: 'from-sky-400 to-blue-500' },
]

const features = [
  { icon: Languages, title: 'Multilingual AI', desc: 'Translate messages into 22+ Indian languages instantly with BHASHINI-powered AI.', color: 'saffron', image: 'https://images.unsplash.com/photo-1575017253457-410a6a0e10dc?auto=format&fit=crop&q=80&w=600' },
  { icon: Video, title: 'Realistic Avatars', desc: 'Generate lifelike talking avatars with lip-sync from a single photograph.', color: 'blue', image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=600' },
  { icon: Smartphone, title: 'Low Bandwidth', desc: 'Optimized 240p delivery for rural areas with limited connectivity.', color: 'green', image: 'https://images.unsplash.com/photo-1533633634091-8ac1420ed696?auto=format&fit=crop&q=80&w=600' },
  { icon: Shield, title: 'OTP Consent Lock', desc: 'Secure consent verification before publishing announcements.', color: 'saffron', image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=600' },
  { icon: Bot, title: 'Citizen Q&A', desc: 'RAG-powered AI answers citizen questions about government schemes.', color: 'blue', image: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&q=80&w=600' },
  { icon: Zap, title: 'Real-time Pipeline', desc: 'End-to-end from text to talking avatar in minutes.', color: 'green', image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=600' },
]

const steps = [
  { num: '01', title: 'Leader Message', desc: 'Admin enters announcement text', icon: Mic, color: 'from-primary-500 to-primary-400' },
  { num: '02', title: 'AI Translation', desc: 'Translated into regional language', icon: Languages, color: 'from-saffron-500 to-saffron-400' },
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
  { value: '22+', label: 'Indian Languages', icon: Languages },
  { value: '600M+', label: 'Citizens to Reach', icon: Users },
  { value: '2.5L+', label: 'Panchayats Reachable', icon: Building2 },
  { value: '100%', label: 'Rural-Friendly', icon: Smartphone },
]

const trustedBy = ['BHASHINI', 'NIC', 'Digital India', 'MeitY', 'NeGD']

export default function LandingPage() {
  const [activeIndex, setActiveIndex] = useState(0)

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
    <div className="min-h-screen bg-white">
      <Navbar transparent />

      {/* ===== HERO ===== */}
      <section className="relative min-h-screen flex items-center gradient-hero overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-80 h-80 bg-saffron-500/8 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-32 right-16 w-[500px] h-[500px] bg-blue-400/6 rounded-full blur-3xl animate-float-reverse" />
          <div className="absolute top-1/3 left-1/2 w-96 h-96 bg-indian-green/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
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
              <div className="inline-flex items-center gap-2 bg-white/8 backdrop-blur-sm rounded-full px-5 py-2 mb-8 border border-white/10 animate-fade-in-up">
                <div className="w-2 h-2 rounded-full bg-indian-green animate-pulse" />
                <span className="text-sm text-white/70 font-medium">Powered by BHASHINI AI • Made for Bharat</span>
              </div>

              <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.1] tracking-tight animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                AI Video Generator
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-saffron-400 via-saffron-300 to-saffron-400">
                  for Governance
                </span>
              </h1>

              <p className="mt-6 text-lg text-white/50 max-w-xl leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                Transform government communication with AI-powered multilingual avatars. Deliver trusted announcements in 22+ Indian languages — bridging every language barrier, reaching every citizen.
              </p>

              <div className="mt-10 flex flex-col sm:flex-row items-start gap-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
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
              <div className="mt-14 flex flex-wrap items-center gap-3 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
                {['BHASHINI Multi-Language', 'Lip-Sync Avatars', 'Low Bandwidth', 'OTP Consent'].map((badge) => (
                  <span key={badge} className="inline-flex items-center gap-1.5 bg-white/5 backdrop-blur-sm border border-white/8 rounded-full px-4 py-2 text-xs text-white/40 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-saffron-400" />
                    {badge}
                  </span>
                ))}
              </div>
            </div>

            {/* Right — 3D Avatar Carousel */}
            <div className="hidden lg:block animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
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
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className={`w-full h-full bg-gradient-to-br ${avatar.gradient} flex items-center justify-center`}>
                                  <Users className="w-12 h-12 text-white/80" />
                                </div>
                              )}
                              {/* Mic indicator */}
                              <div className="absolute bottom-2 right-2 w-7 h-7 rounded-full bg-indian-green flex items-center justify-center shadow-lg">
                                <Mic className="w-3.5 h-3.5 text-white" />
                              </div>
                              {/* Speaking animation for active */}
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
                      <Languages className="w-4 h-4 text-indian-green" />
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
            <path d="M0,80L60,75C120,70,240,60,360,55C480,50,600,50,720,55C840,60,960,70,1080,72C1200,75,1320,70,1380,67L1440,65V120H0Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* ===== TRUSTED BY ===== */}
      <section className="py-12 bg-white border-b border-gray-50">
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

      {/* ===== PRODUCT SHOWCASE (HeyGen Style) ===== */}
      <section className="py-24 bg-white" id="features">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-flex items-center gap-2 bg-saffron-50 text-saffron-600 text-sm font-semibold px-4 py-1.5 rounded-full mb-5">
              <Sparkles className="w-4 h-4" />
              The Solution
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight">
              AI-Powered Avatar
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-primary-400">Communication Platform</span>
            </h2>
            <p className="text-gray-500 mt-5 text-lg max-w-2xl mx-auto">
              Bridge governance and citizens through realistic multilingual digital avatars. Every feature designed for India's diverse reality.
            </p>
          </div>

          <div className="mt-20 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, desc, color, image }, i) => {
              const colorMap = {
                blue: { bg: 'bg-primary-500/8', iconBg: 'gradient-primary', shadow: 'shadow-primary-500/15', text: 'text-primary-500', groupHoverText: 'group-hover:text-primary-600' },
                saffron: { bg: 'bg-saffron-500/8', iconBg: 'gradient-saffron', shadow: 'shadow-saffron-500/15', text: 'text-saffron-600', groupHoverText: 'group-hover:text-saffron-700' },
                green: { bg: 'bg-indian-green/8', iconBg: 'gradient-green', shadow: 'shadow-indian-green/15', text: 'text-indian-green', groupHoverText: 'group-hover:text-emerald-700' },
              }
              const c = colorMap[color]

              return (
                <div
                  key={i}
                  className="group glass-card rounded-2xl hover-lift animate-fade-in-up cursor-default relative overflow-hidden flex flex-col min-h-[260px]"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  {/* Hover Image Reveal */}
                  <div 
                    className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      backgroundImage: `url(${image})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  >
                    <div className="absolute inset-0 bg-white/85 backdrop-blur-[2px]" />
                  </div>

                  <div className="relative z-10 p-7 flex-1 flex flex-col h-full transform transition-transform duration-500 group-hover:translate-y-[-4px]">
                    <div className={`w-14 h-14 rounded-2xl ${c.iconBg} flex items-center justify-center shadow-lg ${c.shadow} group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="font-heading font-semibold text-xl text-gray-900 mt-5 group-hover:text-gray-900 transition-colors duration-300">{title}</h3>
                    <p className="text-gray-500 text-sm mt-3 leading-relaxed flex-1 group-hover:text-gray-800 transition-colors duration-300">{desc}</p>
                    <div className={`mt-5 inline-flex items-center gap-1 text-sm font-medium ${c.text} ${c.groupHoverText} opacity-100 transition-colors duration-300`}>
                      Learn more <ArrowUpRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

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
                  className="relative text-center group animate-fade-in-up"
                  style={{ animationDelay: `${i * 0.12}s` }}
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

      {/* ===== USE CASES (HeyGen Industry Cards) ===== */}
      <section className="py-24 bg-white" id="use-cases">
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
                className="group glass-card rounded-2xl hover-lift animate-fade-in-up text-center relative overflow-hidden min-h-[240px] flex flex-col"
                style={{ animationDelay: `${i * 0.1}s` }}
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
                className="bg-white/6 backdrop-blur-sm rounded-2xl p-8 border border-white/8 hover:bg-white/10 hover:border-white/15 transition-all duration-300 group animate-fade-in-up"
                style={{ animationDelay: `${i * 0.1}s` }}
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
      <section className="py-24 bg-white relative">
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
