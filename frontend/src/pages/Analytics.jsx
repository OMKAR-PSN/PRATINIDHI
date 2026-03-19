import Sidebar from '../components/Sidebar'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area, Legend,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts'
import { BarChart3, TrendingUp, Users, Globe, Video, Eye, MapPin, Smartphone, Radio, Target } from 'lucide-react'

// --- Mock Data matching PRATINIDHI Features ---

const languageData = [
  { name: 'Hindi', value: 342, color: '#2563EB' },
  { name: 'Tamil', value: 198, color: '#FF9933' },
  { name: 'Telugu', value: 176, color: '#10B981' },
  { name: 'Marathi', value: 154, color: '#8B5CF6' },
  { name: 'Bengali', value: 132, color: '#EC4899' },
  { name: 'Odia', value: 88, color: '#06B6D4' },
  { name: 'Gujarati', value: 78, color: '#F59E0B' },
  { name: 'Others', value: 79, color: '#6B7280' },
]

const deliveryData = [
  { format: '4G (Full Video)', count: 450000, fill: '#2563EB' },
  { format: '3G (Audio + Image)', count: 320000, fill: '#10B981' },
  { format: '2G (WhatsApp Audio)', count: 580000, fill: '#F59E0B' },
  { format: '0G (SMS Summary)', count: 210000, fill: '#EF4444' },
]

const engagementData = [
  { month: 'Oct', webViews: 12000, ivrCalls: 5000 },
  { month: 'Nov', webViews: 18000, ivrCalls: 8500 },
  { month: 'Dec', webViews: 25000, ivrCalls: 12000 },
  { month: 'Jan', webViews: 42000, ivrCalls: 28000 },
  { month: 'Feb', webViews: 58000, ivrCalls: 45000 },
  { month: 'Mar', webViews: 85000, ivrCalls: 76000 },
]

const awarenessData = [
  { month: 'Oct', pmKisan: 35, ayushman: 42, mnrega: 28 },
  { month: 'Nov', pmKisan: 45, ayushman: 48, mnrega: 35 },
  { month: 'Dec', pmKisan: 58, ayushman: 55, mnrega: 42 },
  { month: 'Jan', pmKisan: 72, ayushman: 68, mnrega: 55 },
  { month: 'Feb', pmKisan: 85, ayushman: 79, mnrega: 68 },
  { month: 'Mar', pmKisan: 94, ayushman: 88, mnrega: 75 },
]

const radarData = [
  { metric: 'PM Kisan', A: 94, B: 88, C: 75 },
  { metric: 'Ayushman', A: 88, B: 92, C: 70 },
  { metric: 'MNREGA', A: 75, B: 68, C: 85 },
  { metric: 'PM Awas', A: 80, B: 72, C: 66 },
  { metric: 'Kisan Credit', A: 68, B: 75, C: 78 },
  { metric: 'Jan Dhan', A: 90, B: 85, C: 80 },
]

const districtReachData = [
  { district: 'Varanasi', pct: 92, color: '#2563EB' },
  { district: 'Lucknow', pct: 87, color: '#10B981' },
  { district: 'Patna', pct: 79, color: '#F59E0B' },
  { district: 'Bhopal', pct: 73, color: '#8B5CF6' },
  { district: 'Jaipur', pct: 68, color: '#EC4899' },
  { district: 'Ranchi', pct: 58, color: '#06B6D4' },
]

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 backdrop-blur-sm p-3 rounded-xl border border-gray-100 shadow-xl">
        <p className="font-semibold text-gray-800 text-sm mb-2">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-xs font-medium flex items-center gap-2" style={{ color: entry.color || entry.fill }}>
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color || entry.fill }} />
            {entry.name}: {entry.value.toLocaleString()}
          </p>
        ))}
      </div>
    )
  }
  return null
}

export default function Analytics() {
  return (
    <div className="min-h-screen gradient-subtle tech-grid">
      <Sidebar />
      <div className="ml-64 p-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="font-heading text-2xl font-bold text-gray-900 tracking-tight">Analytics Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Real-time metrics for delivery, engagement, and scheme awareness scoring.</p>
        </div>

        {/* Top stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8 animate-fade-in-up">
          {[
            { icon: Video, label: 'Avatars Generated', value: '1,247', change: '+12%', bg: 'from-blue-500/10 to-blue-600/5', ic: 'text-blue-500', badgeColor: 'bg-emerald-100/80 text-emerald-600' },
            { icon: Globe, label: 'Languages Native', value: '22+', change: 'BHASHINI', bg: 'from-saffron-500/10 to-saffron-600/5', ic: 'text-saffron-500', badgeColor: 'bg-orange-100/80 text-orange-600' },
            { icon: Radio, label: 'IVR Missed Calls', value: '174.5K', change: '+240%', bg: 'from-emerald-500/10 to-emerald-600/5', ic: 'text-emerald-500', badgeColor: 'bg-emerald-100/80 text-emerald-600' },
            { icon: TrendingUp, label: 'Avg Awareness Uplift', value: '88%', change: '+15%', bg: 'from-purple-500/10 to-purple-600/5', ic: 'text-purple-500', badgeColor: 'bg-emerald-100/80 text-emerald-600' },
          ].map(({ icon: Icon, label, value, change, bg, ic, badgeColor }, i) => (
            <div key={i} className="glass-card rounded-2xl p-5 hover-lift">
              <div className="flex items-center justify-between">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${bg} flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${ic}`} />
                </div>
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${badgeColor}`}>{change}</span>
              </div>
              <p className="text-2xl font-heading font-bold text-gray-900 mt-3 tracking-tight">{value}</p>
              <p className="text-sm text-gray-500">{label}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {/* Area Chart: Scheme Awareness Score */}
          <div className="glass-card rounded-2xl p-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-heading font-semibold text-gray-900 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-saffron-500" />
                Scheme Awareness Score (%)
              </h3>
              <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-600 px-2 py-1 rounded-full border border-emerald-100">Oct→Mar</span>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={awarenessData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorPm" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorAyushman" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorMnrega" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                  <RechartsTooltip content={<CustomTooltip />} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                  <Area type="monotone" dataKey="pmKisan" name="PM Kisan" stroke="#2563EB" strokeWidth={3} fillOpacity={1} fill="url(#colorPm)" />
                  <Area type="monotone" dataKey="ayushman" name="Ayushman Bharat" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorAyushman)" />
                  <Area type="monotone" dataKey="mnrega" name="MNREGA" stroke="#F59E0B" strokeWidth={3} fillOpacity={1} fill="url(#colorMnrega)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bar Chart: Adaptive Network Delivery */}
          <div className="glass-card rounded-2xl p-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-heading font-semibold text-gray-900 flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-blue-500" />
                Adaptive Delivery Engine Formats
              </h3>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={deliveryData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E5E7EB" />
                  <XAxis type="number" hide />
                  <YAxis dataKey="format" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#4B5563', fontWeight: 600 }} width={120} />
                  <RechartsTooltip cursor={{ fill: 'transparent' }} content={<CustomTooltip />} />
                  <Bar dataKey="count" name="Citizens Reached" radius={[0, 8, 8, 0]} barSize={32}>
                    {deliveryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          {/* Line Chart: Engagement Trends */}
          <div className="lg:col-span-2 glass-card rounded-2xl p-6 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-heading font-semibold text-gray-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-500" />
                Citizen Q&A Engagement (Web vs IVR)
              </h3>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={engagementData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                  <RechartsTooltip content={<CustomTooltip />} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                  <Line type="monotone" dataKey="webViews" name="Web/Kiosk Views" stroke="#8B5CF6" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="ivrCalls" name="IVR Missed Calls" stroke="#EC4899" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pie Chart: Language Distribution */}
          <div className="glass-card rounded-2xl p-6 flex flex-col animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <h3 className="font-heading font-semibold text-gray-900 flex items-center gap-2 mb-2">
              <Globe className="w-5 h-5 text-emerald-500" />
              Language Distribution
            </h3>
            <div className="flex-1 min-h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={languageData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                  >
                    {languageData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                    itemStyle={{ fontSize: '13px', fontWeight: 600 }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 text-center text-xs text-gray-500 font-medium bg-gray-50 py-2 rounded-lg border border-gray-100">
              Powered by BHASHINI API
            </div>
          </div>
        </div>

        {/* Bottom Row — Radar + District Progress */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Radar Chart: District Multi-Scheme Score */}
          <div className="glass-card rounded-2xl p-6 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
            <h3 className="font-heading font-semibold text-gray-900 flex items-center gap-2 mb-6">
              <Target className="w-5 h-5 text-blue-500" />
              Multi-Scheme Performance Radar
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#E5E7EB" />
                  <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11, fill: '#4B5563', fontWeight: 600 }} />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10, fill: '#9CA3AF' }} />
                  <Radar name="Urban Zone" dataKey="A" stroke="#2563EB" fill="#2563EB" fillOpacity={0.2} strokeWidth={2} />
                  <Radar name="Peri-Urban" dataKey="B" stroke="#FF9933" fill="#FF9933" fillOpacity={0.15} strokeWidth={2} />
                  <Radar name="Rural Zone" dataKey="C" stroke="#10B981" fill="#10B981" fillOpacity={0.15} strokeWidth={2} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* District Reach Progress */}
          <div className="glass-card rounded-2xl p-6 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            <h3 className="font-heading font-semibold text-gray-900 flex items-center gap-2 mb-6">
              <MapPin className="w-5 h-5 text-rose-500" />
              Top District Awareness Reach
            </h3>
            <div className="space-y-4">
              {districtReachData.map(({ district, pct, color }) => (
                <div key={district}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-semibold text-gray-700">{district}</span>
                    <span className="text-sm font-bold text-gray-900">{pct}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${pct}%`, backgroundColor: color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

