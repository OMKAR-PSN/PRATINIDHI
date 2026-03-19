import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import StatCard from '../components/StatCard'
import { 
  MessageSquare, Globe, Eye, Filter, Calendar, Activity, 
  CheckCircle2, Video, Users, ArrowRight, PlayCircle
} from 'lucide-react'

// Rich Demo Data to populate the dashboard and table
const initialDemoMessages = [
  { 
    id: 'msg-kisan', 
    title: 'PM Kisan Yojana Updates', 
    original_text: 'Dear citizens, the registration for PM Kisan Yojana is now open for the next quarter. Please ensure your e-KYC is completed by the end of this month.',
    language: 'hi', 
    status: 'completed', 
    regions: ['North India', 'Central India'], 
    reach: 125000,
    views: 45200, 
    engagement: 82, 
    created_at: new Date().toISOString(),
    video_url: '/output/videos/demo.mp4'
  },
  { 
    id: 'msg-health', 
    title: 'Healthcare Expansion (Ayushman)', 
    original_text: 'Ayushman Bharat now covers 5 new regional hospitals in your district. Eligible families can claim up to 5 Lakhs in free treatment. Visit your nearest CSC to apply.',
    language: 'ta', 
    status: 'completed', 
    regions: ['South India'], 
    reach: 89000,
    views: 32000, 
    engagement: 74, 
    created_at: new Date(Date.now() - 86400000).toISOString(),
    video_url: '/output/videos/demo.mp4'
  },
  { 
    id: 'msg-edu', 
    title: 'Girl Child Scholarship Launch', 
    original_text: 'Announcing the new Beti Bachao Beti Padhao regional scholarship for higher education. All female students scoring above 80% are eligible.',
    language: 'bn', 
    status: 'completed', 
    regions: ['East India'], 
    reach: 210000,
    views: 98000, 
    engagement: 91, 
    created_at: new Date(Date.now() - 172800000).toISOString(),
    video_url: '/output/videos/demo.mp4'
  },
  { 
    id: 'msg-cyclone', 
    title: 'Cyclone Alert & Safety Guidelines', 
    original_text: 'Warning: Severe cyclonic storm approaching the coastal areas in the next 48 hours. Please move to designated safe shelters and avoid the sea.',
    language: 'or', 
    status: 'completed', 
    regions: ['East India', 'South India'], 
    reach: 450000,
    views: 310000, 
    engagement: 95, 
    created_at: new Date(Date.now() - 259200000).toISOString(),
    video_url: '/output/videos/demo.mp4'
  },
  { 
    id: 'msg-farm', 
    title: 'Organic Farming Subsidies', 
    original_text: 'Government is providing a 50% subsidy on organic fertilizers for the Rabi crop season. Apply through the local Panchayat office before Friday.',
    language: 'mr', 
    status: 'processing', 
    regions: ['West India'], 
    reach: 75000,
    views: 12000, 
    engagement: 45, 
    created_at: new Date(Date.now() - 3600000).toISOString(),
    video_url: null
  }
]

export default function Messages() {
  const [messages, setMessages] = useState(initialDemoMessages)

  // Calculate Dashboard Stats dynamically from the local demo array
  const totalReach = messages.reduce((acc, curr) => acc + curr.reach, 0)
  const totalViews = messages.reduce((acc, curr) => acc + curr.views, 0)
  const avgEngagement = Math.round(messages.reduce((acc, curr) => acc + curr.engagement, 0) / messages.length)
  const uniqueLangs = new Set(messages.map(m => m.language)).size

  return (
    <div className="min-h-screen gradient-subtle tech-grid">
      <Sidebar />
      <div className="ml-64 p-8">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-heading text-2xl font-bold text-gray-900 tracking-tight">Messages & Broadcasts</h1>
            <p className="text-gray-500 text-sm mt-1">Review historic announcements, content details, and performance statistics.</p>
          </div>
          <Link to="/create" className="px-5 py-2.5 rounded-xl gradient-primary text-white font-semibold text-sm hover:shadow-lg hover:shadow-blue-500/25 transition-all btn-press flex items-center gap-2">
            <Video className="w-4 h-4" /> New Broadcast
          </Link>
        </div>

        {/* Dashboard Top Level Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <StatCard icon={MessageSquare} title="Total Broadcasts" value={messages.length} change="+2 this week" changeType="up" color="blue" />
          <StatCard icon={Users} title="Cumulative Reach" value={`${(totalReach / 1000).toFixed(0)}K`} change="Citizens" changeType="neutral" color="saffron" />
          <StatCard icon={Eye} title="Total Video Views" value={`${(totalViews / 1000).toFixed(0)}K`} change="+12%" changeType="up" color="emerald" />
          <StatCard icon={Activity} title="Avg Engagement" value={`${avgEngagement}%`} change="High" changeType="up" color="purple" />
        </div>

        {/* Messages Data Table */}
        <div className="glass-card rounded-2xl overflow-hidden shadow-sm">
          {/* Toolbar */}
          <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white/50 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
                <Filter className="w-3.5 h-3.5" /> Filter by Region
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
                <Globe className="w-3.5 h-3.5" /> All Languages
              </button>
            </div>
            <div className="text-sm font-semibold text-gray-500">
             Showing {messages.length} items
            </div>
          </div>

          <div className="w-full overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                  <th className="px-6 py-4 w-1/3">Original Content & Details</th>
                  <th className="px-6 py-4">Delivery</th>
                  <th className="px-6 py-4 text-center">Performance Stats</th>
                  <th className="px-6 py-4">Video & Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100/50 bg-white/40">
                {messages.map((m) => (
                  <tr key={m.id} className="hover:bg-gray-50/50 transition-colors group">
                    {/* Content Column */}
                    <td className="px-6 py-5">
                      <div className="font-heading font-bold text-gray-900 text-sm mb-1">{m.title}</div>
                      <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed italic border-l-2 border-blue-200 pl-2">
                        "{m.original_text}"
                      </p>
                      <div className="text-[10px] text-gray-400 mt-2 font-medium uppercase">
                        {new Date(m.created_at).toLocaleDateString()} at {new Date(m.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </div>
                    </td>

                    {/* Delivery Column */}
                    <td className="px-6 py-5">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-1.5 text-xs">
                          <Globe className="w-3.5 h-3.5 text-gray-400" />
                          <span className="font-bold text-blue-600 uppercase bg-blue-50 px-2 py-0.5 rounded">{m.language}</span>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {m.regions.map(r => (
                            <span key={r} className="px-1.5 py-0.5 bg-gray-100 rounded text-[10px] font-semibold text-gray-600 border border-gray-200/50">{r}</span>
                          ))}
                        </div>
                      </div>
                    </td>

                    {/* Stats Column */}
                    <td className="px-6 py-5">
                      <div className="flex flex-col gap-2">
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                          <div className="text-[11px] text-gray-500">Reach</div>
                          <div className="text-xs font-bold text-gray-900 text-right">{(m.reach / 1000).toFixed(1)}K</div>
                          
                          <div className="text-[11px] text-gray-500">Video Views</div>
                          <div className="text-xs font-bold text-emerald-600 text-right">{(m.views / 1000).toFixed(1)}K</div>
                          
                          <div className="text-[11px] text-gray-500">Engagement</div>
                          <div className="text-xs font-bold text-saffron-600 text-right">{m.engagement}%</div>
                        </div>
                        <div className="w-full h-1.5 bg-gray-100 rounded-full mt-1 overflow-hidden">
                          <div className="h-full gradient-primary rounded-full transition-all" style={{ width: `${m.engagement}%` }} />
                        </div>
                      </div>
                    </td>

                    {/* Status & Video Column */}
                    <td className="px-6 py-5">
                      <div className="flex flex-col items-start gap-2">
                        <div className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                          m.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {m.status === 'completed' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <div className="w-3.5 h-3.5 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />}
                          {m.status}
                        </div>
                        {m.video_url && m.status === 'completed' && (
                          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-blue-500 mt-1 cursor-pointer hover:text-blue-600 transition-colors">
                            <PlayCircle className="w-4 h-4" /> <span>Avatar Ready</span>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Actions Column */}
                    <td className="px-6 py-5 text-right">
                      <Link to={m.id === 'msg-kisan' ? '/preview/demo' : `/preview/${m.id}`} className="group inline-flex items-center gap-1 px-4 py-2 rounded-lg bg-gray-50 border border-gray-200 text-gray-700 text-xs font-bold hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-colors btn-press">
                        View Portal <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  )
}
