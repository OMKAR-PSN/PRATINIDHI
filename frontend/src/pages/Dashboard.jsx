import Sidebar from '../components/Sidebar'
import StatCard from '../components/StatCard'
import { Video, Languages, Users, MessageSquare, Clock, ChevronRight, Globe, Shield, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { getMessageHistory } from '../services/api'

const recentAnnouncements = [
  { id: 1, title: 'PM Kisan Scheme Registration Open', lang: 'Hindi', date: '2 hours ago', status: 'Delivered' },
  { id: 2, title: 'COVID Vaccination Drive Update', lang: 'Tamil', date: '5 hours ago', status: 'Delivered' },
  { id: 3, title: 'New Education Policy Announcement', lang: 'Telugu', date: '1 day ago', status: 'Processing' },
  { id: 4, title: 'Flood Relief Information', lang: 'Odia', date: '2 days ago', status: 'Delivered' },
]

const roleConfig = {
  admin: { label: 'Institution Admin', badge: 'bg-blue-100 text-blue-700' },
  sarpanch: { label: 'Sarpanch', badge: 'bg-emerald-100 text-emerald-700' },
  mla: { label: 'MLA', badge: 'bg-purple-100 text-purple-700' },
  mp: { label: 'MP', badge: 'bg-saffron-100 text-saffron-700' },
  educator: { label: 'Educator', badge: 'bg-cyan-100 text-cyan-700' },
}

export default function Dashboard() {
  const { t, i18n } = useTranslation()
  const role = localStorage.getItem('userRole') || 'admin'
  const currentRole = roleConfig[role] || roleConfig.admin

  const [recentMessages, setRecentMessages] = useState([])
  const leaderId = localStorage.getItem('leaderId') || 'admin'

  useEffect(() => {
    getMessageHistory(leaderId, i18n.language)
      .then(res => setRecentMessages(res.data.sent.slice(0, 4)))
      .catch(e => console.error(e))
  }, [i18n.language, leaderId])

  return (
    <div className="min-h-screen gradient-subtle tech-grid">
      <Sidebar />
      <div className="ml-64 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-heading text-2xl font-bold text-gray-900 tracking-tight">{t('dash_title', 'Dashboard')}</h1>
              <span className={`badge-lang text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1 ${currentRole.badge}`}>
                <Shield className="w-3 h-3" />
                {currentRole.label}
              </span>
            </div>
            <p className="text-gray-500 text-sm mt-1">{t('dash_welcome', 'Welcome back')}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="glass-card rounded-xl px-3 py-2 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] font-medium text-gray-500">AI Engine Online</span>
            </div>
            <Link
              to="/create"
              className="px-5 py-2.5 rounded-xl gradient-primary text-white font-semibold text-sm flex items-center gap-2 hover:shadow-xl hover:shadow-blue-500/25 transition-all btn-press"
            >
              <Sparkles className="w-4 h-4" />
              Create Avatar
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard icon={Video} title={t('dash_avatars', 'Total Avatars Generated')} value="1,247" change="+12%" changeType="up" color="blue" />
          <StatCard icon={Languages} title={t('dash_langs', 'Languages Used')} value="18" change="+3" changeType="up" color="saffron" />
          <StatCard icon={Users} title={t('dash_citizens', 'Citizens Reached')} value="2.4M" change="+8.2%" changeType="up" color="green" />
          <StatCard icon={MessageSquare} title={t('dash_msgs', 'Messages Delivered')} value="3,891" change="+15%" changeType="up" color="purple" />
        </div>

        {/* Recent announcements */}
        <div className="mt-8 glass-card rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100/50 flex items-center justify-between">
            <h2 className="font-heading font-semibold text-gray-900">{t('dash_recent', 'Recent Announcements')}</h2>
            <Link to="/messages" className="text-sm text-blue-500 font-medium hover:underline flex items-center gap-1">
              {t('dash_view_all', 'View All')} <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="divide-y divide-gray-50/50">
            {recentMessages.map((item, i) => (
              <div key={item.id} className="px-6 py-4 flex items-center justify-between hover:bg-white/50 transition-all animate-fade-in-up" style={{ animationDelay: `${i * 0.05}s` }}>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-600/5 flex items-center justify-center">
                    <Video className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 line-clamp-1">{item.display_text || item.message_text}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="badge-lang text-[10px] font-bold px-2 py-0.5 rounded-full capitalize">{item.target_language || 'Hindi'}</span>
                      <span className="text-xs text-gray-300">•</span>
                      <span className="flex items-center gap-1 text-xs text-gray-400"><Clock className="w-3 h-3" /> {new Date(item.created_at).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                <span className={`text-[11px] font-semibold px-3 py-1 rounded-full bg-emerald-50/80 text-emerald-600`}>Delivered</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick actions */}
        <div className="mt-8 grid sm:grid-cols-3 gap-5">
          {[
            { to: '/create', icon: Video, color: 'blue', title: t('dash_create', 'Create New Avatar'), desc: t('dash_create_sub', 'Generate a multilingual avatar announcement') },
            { to: '/analytics', icon: Users, color: 'saffron', title: t('dash_analytics', 'View Analytics'), desc: t('dash_analytics_sub', 'Track citizen engagement & reach') },
            { to: '/ask-avatar', icon: MessageSquare, color: 'emerald', title: t('dash_ask', 'Ask Avatar Q&A'), desc: t('dash_ask_sub', 'AI-powered citizen query system') },
          ].map(({ to, icon: Icon, color, title, desc }, i) => (
            <Link key={to} to={to} className="glass-card rounded-2xl p-6 hover-lift group" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-${color}-500/10 to-${color}-600/5 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-${color}-500/10`}>
                <Icon className={`w-6 h-6 text-${color}-500`} />
              </div>
              <h3 className="font-heading font-semibold text-gray-900 mt-4">{title}</h3>
              <p className="text-sm text-gray-500 mt-1">{desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
