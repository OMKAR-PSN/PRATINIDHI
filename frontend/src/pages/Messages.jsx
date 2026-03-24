import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import { getMessageHistory, markAsRead } from '../services/api'
import { useTranslation } from 'react-i18next'
import { 
  MessageSquare, Send, Inbox, Clock, CheckCircle2, XCircle, 
  Eye, Play, MoreVertical, Globe, BarChart3, Loader2 
} from 'lucide-react'

export default function Messages() {
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()
  const [activeTab, setActiveTab] = useState('sent') // 'sent' | 'inbox'
  const [loading, setLoading] = useState(true)
  const [messages, setMessages] = useState({ sent: [], inbox: [] })
  
  const leaderId = localStorage.getItem('leaderId')

  const fetchHistory = async () => {
    try {
      const { data } = await getMessageHistory(leaderId || 'admin', i18n.language || 'en')
      setMessages(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (leaderId) fetchHistory()
  }, [leaderId, i18n.language])

  const handleRead = async (id) => {
    try {
      await markAsRead(id, leaderId)
      fetchHistory() // Refresh to update Read status and badge
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="min-h-screen gradient-subtle tech-grid flex">
      <Sidebar />
      <div className="ml-64 p-8 flex-1">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-heading text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-blue-600" /> {t('msg_title', 'Messages')}
            </h1>
            <p className="text-gray-500 text-sm mt-1">{t('msg_sub', 'Full communication history and real-time updates')}</p>
          </div>
          <div className="flex bg-white/50 p-1 rounded-xl shadow-inner border border-gray-200/50">
            <button 
              onClick={() => setActiveTab('sent')}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                activeTab === 'sent' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Send className="w-4 h-4" /> {t('msg_sent', 'Sent Broadcasts')}
            </button>
            <button 
              onClick={() => setActiveTab('inbox')}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                activeTab === 'inbox' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Inbox className="w-4 h-4" /> {t('msg_inbox', 'Citizen Inbox')}
              {messages.inbox.filter(m => !m.is_read).length > 0 && (
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse ml-0.5" />
              )}
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 opacity-50">
            <Loader2 className="w-10 h-10 animate-spin text-blue-500 mb-2" />
            <p className="text-sm font-semibold">Retrieving your message vault...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activeTab === 'sent' ? (
              messages.sent.length === 0 ? (
                <EmptyState icon={Send} text="You haven't sent any broadcasts yet." />
              ) : (
                messages.sent.map(msg => (
                  <SentMessageCard key={msg.id} msg={msg} onPreview={() => navigate(`/message/${msg.id}/preview`)} t={t} />
                ))
              )
            ) : (
              messages.inbox.length === 0 ? (
                <EmptyState icon={Inbox} text="Your inbox is currently empty." />
              ) : (
                messages.inbox.map(msg => (
                  <InboxMessageCard key={msg.id} msg={msg} onRead={() => handleRead(msg.id)} t={t} />
                ))
              )
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function SentMessageCard({ msg, onPreview, t }) {
  return (
    <div className="glass-card rounded-2xl p-6 border-l-4 border-blue-500 shadow-sm transition-all hover:shadow-md">
      <div className="grid lg:grid-cols-5 gap-6 items-center">
        {/* Original Content & Details */}
        <div className="lg:col-span-2 space-y-2">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-2 py-0.5 rounded">{t ? t('msg_sent_badge', 'Sent Broadcast') : 'Sent Broadcast'}</span>
            <span className="text-[10px] text-gray-400 flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(msg.created_at).toLocaleString()}</span>
          </div>
          <p className="text-sm font-semibold text-gray-800 line-clamp-2">{msg.display_text || msg.message_text}</p>
          <div className="flex items-center gap-3 mt-2">
            <div className="flex items-center gap-1 text-[11px] text-gray-500">
              <Globe className="w-3 h-3 text-saffron-500" /> {msg.original_language || 'Hindi'}
            </div>
            <div className="flex items-center gap-1 text-[11px] text-gray-500">
              <Eye className="w-3 h-3 text-blue-500" /> {msg.total_receivers} Targets
            </div>
          </div>
        </div>

        {/* Delivery */}
        <div className="space-y-3">
          <p className="text-[11px] font-bold text-gray-400 uppercase">Delivery Check</p>
          <div className="flex gap-2">
            <DeliveryIndicator label="Email" status={msg.sent_count > 0 ? 'sent' : 'pending'} />
            <DeliveryIndicator label="WA" status={msg.sent_count > 0 ? 'sent' : 'pending'} />
            <DeliveryIndicator label="SMS" status={msg.sent_count > 0 ? 'sent' : 'pending'} />
          </div>
        </div>

        {/* Performance Stats */}
        <div className="space-y-3">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Performance</p>
          <div className="flex items-center gap-4">
             <div className="text-center">
               <p className="text-lg font-extrabold text-emerald-600">{msg.sent_count}</p>
               <p className="text-[10px] font-bold text-gray-400">SUCCESS</p>
             </div>
             <div className="w-px h-8 bg-gray-100" />
             <div className="text-center">
               <p className="text-lg font-extrabold text-red-500">{msg.failed_count}</p>
               <p className="text-[10px] font-bold text-gray-400">FAILED</p>
             </div>
          </div>
        </div>

        {/* Video & Status + Actions */}
        <div className="flex items-center justify-between lg:justify-end gap-3">
          <div className="text-right">
             <span className="badge-tech bg-emerald-50 text-emerald-700 flex items-center gap-1 ml-auto">
               <CheckCircle2 className="w-3 h-3" /> Completed
             </span>
             <p className="text-[10px] text-gray-400 mt-1">ID: ...{msg.id.slice(-6)}</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2.5 rounded-xl bg-gray-100 text-gray-500 hover:bg-gray-200 transition-all btn-press">
              <BarChart3 className="w-4 h-4" />
            </button>
            <button onClick={onPreview} className="p-2.5 rounded-xl gradient-primary text-white shadow-lg shadow-blue-500/20 hover:scale-105 transition-all btn-press">
              <Eye className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function InboxMessageCard({ msg, onRead, t }) {
  return (
    <div 
      onClick={onRead}
      className={`glass-card rounded-2xl p-5 border-l-4 transition-all cursor-pointer hover:shadow-md ${
        msg.is_read ? 'border-gray-200' : 'border-saffron-500 shadow-sm'
      }`}
    >
      <div className="flex items-start gap-4">
        <div className={`w-10 h-10 min-w-[40px] rounded-xl flex items-center justify-center ${
          msg.is_read ? 'bg-gray-100 text-gray-400' : 'bg-saffron-100 text-saffron-600'
        }`}>
          <MessageSquare className="w-5 h-5" />
        </div>
        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-gray-900 flex items-center gap-2">
              {msg.sender_name}
              {!msg.is_read && <span className="w-2 h-2 rounded-full bg-saffron-500" />}
            </h4>
            <span className="text-[11px] text-gray-400">{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
          <p className={`text-sm leading-relaxed ${msg.is_read ? 'text-gray-500' : 'text-gray-700 font-medium'}`}>{msg.message_text}</p>
          {msg.original_text && <p className="text-[11px] text-gray-400 italic">Org: {msg.original_text}</p>}
        </div>
        <button className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 transition-all">
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

function DeliveryIndicator({ label, status }) {
  const styles = {
    sent: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    failed: 'bg-red-50 text-red-700 border-red-100',
    pending: 'bg-gray-50 text-gray-400 border-gray-100'
  }
  return (
    <div className={`px-2 py-1 rounded-lg border text-[10px] font-bold ${styles[status]}`}>
      {label}
    </div>
  )
}

function EmptyState({ icon: Icon, text }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-gray-200 rounded-3xl bg-gray-50/50">
      <Icon className="w-12 h-12 text-gray-200 mb-4" />
      <p className="text-gray-500 font-medium">{text}</p>
    </div>
  )
}
