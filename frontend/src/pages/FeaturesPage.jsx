import { Link } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import {
  Video, Languages, Shield, Smartphone, MessageSquare, Scale, BarChart3, Users,
  PhoneCall, Radio, Network, Map, Zap, KeySquare, Activity, CheckCircle2,
  FileText, AlertTriangle, Monitor, TrendingUp, Sparkles, ArrowRight, Bot
} from 'lucide-react'

// Category 1: Core Features
const coreFeatures = [
  { icon: Video, title: '01. Avatar Creation Engine', desc: 'Clones leader or educator face from a 2-minute video. Generates a multilingual lip-synced avatar using SadTalker and Wav2Lip. Supports 240p to 1080p output.', color: 'primary', tags: ['Lip-Sync', 'Photo-to-Video'] },
  { icon: Languages, title: '02. BHASHINI Integration', desc: 'Real-time speech translation across all 22 scheduled Indian languages plus dialect detection. Powered by the Government of India BHASHINI API at zero cost.', color: 'saffron', tags: ['22+ Languages', 'Zero Cost'] },
  { icon: Shield, title: '03. Consent-Lock Module', desc: 'Biometric or OTP approval required before any avatar can speak content. Every approved message is cryptographically signed. Prevents deepfake misuse.', color: 'green', tags: ['OTP Verified', 'Anti-Deepfake'] },
  { icon: Smartphone, title: '04. Low-Bandwidth Delivery Engine', desc: 'Compresses avatar video to WhatsApp-forward-ready 240p. Automatic SMS text fallback for zero-data zones. Designed for 2G connectivity across rural India.', color: 'primary', tags: ['2G Ready', 'SMS Fallback'] },
  { icon: MessageSquare, title: '05. Interactive Q&A Avatar (RAG)', desc: 'Citizens ask the avatar questions in their local language. A RAG pipeline over government scheme PDFs powered by LLaMA 3 generates accurate answers.', color: 'saffron', tags: ['RAG-Powered', 'LLaMA 3'] },
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

// Category 3: Production-Ready Infrastructure
const prodFeatures = [
  { icon: Zap, title: '13. Async Job Queue', desc: 'A Kafka or AWS SQS queue handles burst loads during election season when thousands generate avatars simultaneously. Contains priority lanes.', color: 'primary', tags: ['Scale Ready', 'Priority Lanes'] },
  { icon: KeySquare, title: '14. Immutable Audit Trail', desc: 'Every avatar creation and approval is logged with a timestamp, consent signature, and SHA-256 hash. RTI-compliant and court-admissible.', color: 'saffron', tags: ['SHA-256', 'Court Admissible'] },
  { icon: Activity, title: '15. Avatar Health Monitor', desc: 'If GPU fails mid-generation, system falls back to audio-only delivery without dropping the message. Failure alerts sent to admin dashboard.', color: 'green', tags: ['High Availability', 'Auto Fallback'] },
  { icon: CheckCircle2, title: '16. Scheme Delivery Confirmation', desc: 'When a villager calls the IVR or watches video, system marks them as informed in the beneficiary DB. Closes the communication loop.', color: 'primary', tags: ['Evidence Based', 'Closed Loop'] },
]

// Category 4: Government Wow Factor
const wowFeatures = [
  { icon: FileText, title: '17. Auto Scheme Summary', desc: 'Upload a 40-page scheme PDF. LLM auto-generates a 3-sentence summary, translates it into 22 languages, and generates avatars speaking it.', color: 'saffron', tags: ['PDF to Avatar', 'No Human Writing'] },
  { icon: AlertTriangle, title: '18. Emergency Broadcast Override', desc: 'Collector types cyclone warning. System generates DM avatar in under 60s and broadcasts to all affected via IVR and SMS. Bypasses queues.', color: 'green', tags: ['NDMA Aligned', 'Under 60s'] },
  { icon: Monitor, title: '19. CSC Kiosk Offline Mode', desc: 'Avatar videos sync to Common Service Centres overnight. Villagers watch full-HD avatars on kiosk screen next day with zero personal internet.', color: 'primary', tags: ['Offline First', 'CSC Network'] },
  { icon: TrendingUp, title: '20. Scheme Awareness Score', desc: 'Monthly score showing % of eligible beneficiaries who acknowledged scheme info. Rank villages, target low-score areas, prove communication ROI.', color: 'saffron', tags: ['Quantified ROI', 'Village Ranking'] },
]

const colorConfig = {
  primary: { iconBg: 'gradient-primary', shadow: 'shadow-primary-500/15', tagBg: 'bg-primary-500/6 text-primary-600', border: 'border-primary-500/10' },
  saffron: { iconBg: 'gradient-saffron', shadow: 'shadow-saffron-500/15', tagBg: 'bg-saffron-500/8 text-saffron-700', border: 'border-saffron-500/10' },
  green: { iconBg: 'gradient-green', shadow: 'shadow-indian-green/15', tagBg: 'bg-indian-green/6 text-indian-green', border: 'border-indian-green/10' },
}

const FeatureSection = ({ title, desc, features, startIndex }) => (
  <div className="mb-16">
    <div className="mb-8">
      <h2 className="font-heading text-2xl sm:text-3xl font-bold text-gray-900">{title}</h2>
      <p className="text-gray-500 mt-2 text-lg">{desc}</p>
    </div>
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {features.map(({ icon: Icon, title: featureTitle, desc: featureDesc, color, tags }, i) => {
        const c = colorConfig[color]
        return (
          <div
            key={i}
            className={`group glass-card rounded-2xl p-6 hover-lift animate-fade-in-up cursor-default border-t-2 ${c.border} flex flex-col h-full`}
            style={{ animationDelay: `${(i % 4) * 0.1}s` }}
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

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-white">
      <Sidebar />
      <div className="ml-64">
        {/* Hero Banner */}
        <section className="relative gradient-hero overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-10 right-20 w-72 h-72 bg-saffron-500/8 rounded-full blur-3xl animate-float" />
            <div className="absolute bottom-10 left-20 w-60 h-60 bg-indian-green/6 rounded-full blur-3xl animate-float-reverse" />
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)',
              backgroundSize: '32px 32px'
            }} />
          </div>

          <div className="relative px-8 py-16">
            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-2 bg-white/8 text-white/70 text-sm font-semibold px-4 py-1.5 rounded-full mb-5 border border-white/10">
                <Sparkles className="w-4 h-4" />
                Comprehensive 20-Point Platform
              </div>
              <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
                Everything you need to
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-saffron-400 to-saffron-300">
                  communicate at scale
                </span>
              </h1>
              <p className="text-white/40 mt-4 text-lg max-w-2xl">
                Explore the complete suite of AI-powered tools designed exclusively to bridge the communication gap between governance and rural India.
              </p>
            </div>
          </div>
        </section>

        {/* Feature Grids */}
        <section className="p-8 pb-24">
          <FeatureSection 
            title="Core Features" 
            desc="The foundational modules already integrated into the platform for robust avatar delivery." 
            features={coreFeatures} 
          />
          <FeatureSection 
            title="India-First Unique Features" 
            desc="Innovative solutions designed specifically for offline, low-bandwidth, and zero-internet zones in rural India." 
            features={uniqueFeatures} 
          />
          <FeatureSection 
            title="Production-Ready Infrastructure" 
            desc="Enterprise-grade architecture features ensuring scale, accountability, and failure tolerance." 
            features={prodFeatures} 
          />
          <FeatureSection 
            title="Government Wow Factor" 
            desc="High-impact features designed to impress policymakers and align with major national missions." 
            features={wowFeatures} 
          />

          {/* CTA Banner */}
          <div className="mt-16 gradient-hero rounded-3xl p-10 text-center relative overflow-hidden">
            <div className="absolute inset-0">
              <div className="absolute top-0 right-0 w-64 h-64 bg-saffron-500/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-indian-green/8 rounded-full blur-3xl" />
            </div>
            <div className="relative">
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white">
                Ready to experience the 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-saffron-400 to-saffron-300"> Full Platform</span>?
              </h2>
              <p className="text-white/40 mt-3 max-w-lg mx-auto">
                Start generating multilingual avatar announcements and tracking scheme awareness today.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/create"
                  className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-saffron-500 to-saffron-400 text-white font-semibold hover:shadow-xl hover:shadow-saffron-500/25 transition-all duration-300 btn-press btn-shine flex items-center gap-2"
                >
                  <Sparkles className="w-5 h-5" />
                  Create Avatar Now
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/ask-avatar"
                  className="px-8 py-3.5 rounded-xl border border-white/15 text-white font-semibold hover:bg-white/10 transition-all duration-300 btn-press flex items-center gap-2"
                >
                  <Bot className="w-5 h-5" />
                  Try Citizen Q&A
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
