import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import {
  Globe, Mic, Video, Shield, MessageSquare, ArrowRight,
  Languages, Users, Building2, Smartphone, ChevronRight,
  GraduationCap, Megaphone, HelpCircle, Zap, Eye, Radio,
  CheckCircle2, Sparkles, Bot
} from 'lucide-react'

const features = [
  { icon: Languages, title: 'Multilingual AI', desc: 'Translate messages into 22+ Indian languages instantly with BHASHINI-powered AI.' },
  { icon: Video, title: 'Realistic Avatars', desc: 'Generate lifelike talking avatars with lip-sync from a single photograph.' },
  { icon: Smartphone, title: 'Low Bandwidth', desc: 'Optimized 240p delivery for rural areas with limited connectivity.' },
  { icon: Shield, title: 'OTP Consent Lock', desc: 'Secure consent verification before publishing announcements.' },
  { icon: Bot, title: 'Citizen Q&A', desc: 'RAG-powered AI answers citizen questions about government schemes.' },
  { icon: Zap, title: 'Real-time Pipeline', desc: 'End-to-end from text to talking avatar in minutes.' },
]

const steps = [
  { num: '01', title: 'Leader Message', desc: 'Admin enters announcement text', icon: Mic },
  { num: '02', title: 'AI Translation', desc: 'Translated into regional language', icon: Languages },
  { num: '03', title: 'Speech Generation', desc: 'Natural text-to-speech audio', icon: Radio },
  { num: '04', title: 'Avatar Creation', desc: 'Lip-synced talking avatar', icon: Video },
  { num: '05', title: 'Citizen Delivery', desc: 'Native language access', icon: Users },
]

const useCases = [
  { icon: Building2, title: 'Governance', desc: 'Policy announcements and scheme details in regional languages.' },
  { icon: GraduationCap, title: 'Education', desc: 'Educational content and scholarship info for students.' },
  { icon: Megaphone, title: 'Awareness', desc: 'Health campaigns, disaster alerts, safety guidelines.' },
  { icon: HelpCircle, title: 'Citizen Q&A', desc: 'AI-driven answers about government services.' },
]

const stats = [
  { value: '22+', label: 'Indian Languages' },
  { value: '600M+', label: 'Citizens to Reach' },
  { value: '2.5L+', label: 'Panchayats Reachable' },
  { value: '100%', label: 'Rural-Friendly' },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar transparent />

      {/* ===== HERO ===== */}
      <section className="relative min-h-screen flex items-center gradient-hero overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-saffron-500/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />
          <div className="absolute top-1/2 left-1/3 w-[500px] h-[500px] bg-saffron-500/5 rounded-full blur-3xl animate-spin-slow" />
          {/* Tech grid */}
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)',
            backgroundSize: '32px 32px'
          }} />
          {/* AI lines */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-saffron-400/20 to-transparent" />
          <div className="absolute bottom-40 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400/10 to-transparent" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-5 py-2 mb-8 border border-white/10 animate-fade-in-up">
              <Sparkles className="w-4 h-4 text-saffron-400" />
              <span className="text-sm text-white/80 font-medium">Powered by AI • Made for Bharat</span>
            </div>

            <h1 className="font-heading text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-tight tracking-tight animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              Transforming Government
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-saffron-400 via-saffron-300 to-saffron-400">
                Communication
              </span>
              {' '}with
              <br />AI Avatars
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-white/60 max-w-2xl mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              Deliver trusted government announcements in 22+ Indian languages using AI-powered digital avatars. Bridge every language barrier.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <Link to="/view/demo" className="group px-8 py-4 rounded-full bg-gradient-to-r from-saffron-500 to-saffron-400 text-white font-semibold text-lg hover:shadow-2xl hover:shadow-saffron-500/30 transition-all btn-press flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Try Demo
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/login" className="px-8 py-4 rounded-full border-2 border-white/15 text-white font-semibold text-lg hover:bg-white/10 transition-all backdrop-blur-sm btn-press">
                Admin Login
              </Link>
            </div>

            <div className="mt-16 flex flex-wrap items-center justify-center gap-3 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              {['BHASHINI Multi-Language', 'Lip-Sync Avatars', 'Low Bandwidth', 'OTP Consent Lock'].map((badge) => (
                <span key={badge} className="inline-flex items-center gap-1.5 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full px-4 py-2 text-xs text-white/50 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-saffron-400" />
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 100" fill="none"><path d="M0,64L80,69C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58L1440,64V100H0Z" fill="white"/></svg>
        </div>
      </section>

      {/* ===== PROBLEM ===== */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-saffron-500 font-semibold text-sm uppercase tracking-wider">The Problem</span>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-gray-900 mt-3 tracking-tight">Language Barriers in Governance</h2>
              <p className="text-gray-600 mt-4 leading-relaxed text-lg">India's diversity creates a communication gap. Most official communication is in English, leaving millions unable to access critical information.</p>
              <div className="mt-8 space-y-4">
                {['22 official languages recognized by the Constitution', 'Most government communication is in English only', 'Citizens miss critical scheme information', '600M+ citizens lack native-language access'].map((p, i) => (
                  <div key={i} className="flex items-start gap-3 animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
                    <div className="mt-1 w-5 h-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0"><div className="w-2 h-2 rounded-full bg-red-500" /></div>
                    <span className="text-gray-700">{p}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="glass-card rounded-3xl p-8 lg:p-12">
                <div className="grid grid-cols-2 gap-4">
                  {stats.map((s, i) => (
                    <div key={i} className="glass-card rounded-2xl p-5 text-center hover-lift">
                      <p className="font-heading text-2xl lg:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-500">{s.value}</p>
                      <p className="text-xs text-gray-500 mt-1">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="py-24 gradient-subtle tech-grid" id="features">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-saffron-500 font-semibold text-sm uppercase tracking-wider">The Solution</span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-gray-900 mt-3 tracking-tight">AI-Powered Avatar Communication</h2>
            <p className="text-gray-600 mt-4 text-lg">Bridge governance and citizens through realistic multilingual digital avatars.</p>
          </div>
          <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map(({ icon: Icon, title, desc }, i) => (
              <div key={i} className="glass-card rounded-2xl p-6 hover-lift group animate-fade-in-up" style={{ animationDelay: `${i * 0.08}s` }}>
                <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-heading font-semibold text-lg text-gray-900 mt-4">{title}</h3>
                <p className="text-gray-500 text-sm mt-2 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="py-24 bg-white" id="how-it-works">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-saffron-500 font-semibold text-sm uppercase tracking-wider">Pipeline</span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-gray-900 mt-3 tracking-tight">How It Works</h2>
          </div>
          <div className="mt-16 relative">
            <div className="hidden lg:block absolute top-8 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-blue-200 via-saffron-300 to-blue-200" />
            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-8">
              {steps.map(({ num, title, desc, icon: Icon }, i) => (
                <div key={i} className="relative text-center group animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
                  <div className="relative z-10 mx-auto w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center shadow-xl shadow-blue-500/20 group-hover:scale-110 transition-transform">
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full gradient-saffron text-white text-[10px] font-bold flex items-center justify-center z-20 shadow-lg">{num}</div>
                  <h3 className="font-heading font-semibold text-gray-900 mt-4">{title}</h3>
                  <p className="text-sm text-gray-500 mt-1">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== USE CASES ===== */}
      <section className="py-24 gradient-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center"><h2 className="font-heading text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">Use Cases</h2></div>
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {useCases.map(({ icon: Icon, title, desc }, i) => (
              <div key={i} className="glass-card rounded-2xl p-6 text-center hover-lift group animate-fade-in-up" style={{ animationDelay: `${i * 0.08}s` }}>
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-saffron-500/10 to-saffron-600/5 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                  <Icon className="w-7 h-7 text-saffron-500" />
                </div>
                <h3 className="font-heading font-semibold text-gray-900 mt-4">{title}</h3>
                <p className="text-gray-500 text-sm mt-2">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== IMPACT ===== */}
      <section className="py-24 gradient-hero text-white" id="impact">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight">Nationwide Reach</h2>
          <p className="text-white/50 mt-3 text-lg">Empowering every citizen with native-language access.</p>
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {stats.map((s, i) => (
              <div key={i} className="bg-white/8 backdrop-blur-sm rounded-2xl p-6 border border-white/10 text-center hover:bg-white/12 transition-all">
                <p className="font-heading text-3xl lg:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-saffron-400 to-saffron-300">{s.value}</p>
                <p className="text-white/50 text-sm mt-2">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">Ready to Transform Governance?</h2>
          <p className="text-gray-500 mt-4 text-lg">Join the digital revolution in government-citizen communication.</p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/login" className="px-8 py-4 rounded-full gradient-primary text-white font-semibold text-lg hover:shadow-2xl hover:shadow-blue-500/25 transition-all btn-press flex items-center gap-2">
              <Globe className="w-5 h-5" /> Admin Portal <ArrowRight className="w-5 h-5" />
            </Link>
            <a href="mailto:demo@pratinidhi.ai" className="px-8 py-4 rounded-full border-2 border-gray-200 text-gray-700 font-semibold text-lg hover:border-blue-300 hover:text-blue-600 transition-all btn-press">Request Demo</a>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center shadow-lg shadow-blue-500/30"><Globe className="w-5 h-5 text-white" /></div>
            <span className="font-heading font-bold text-lg">Prati<span className="text-saffron-400">nidhi</span> AI</span>
          </div>
          <p className="text-gray-500 text-sm">© 2026 Pratinidhi AI. Empowering governance through AI.</p>
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
