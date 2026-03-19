import Sidebar from '../components/Sidebar'
import { BarChart3, TrendingUp, Users, Globe, Video, Eye, MapPin, Sparkles } from 'lucide-react'

const languageData = [
  { lang: 'Hindi', count: 342, pct: 28, color: '#2563EB' },
  { lang: 'Tamil', count: 198, pct: 16, color: '#FF9933' },
  { lang: 'Telugu', count: 176, pct: 14, color: '#10B981' },
  { lang: 'Marathi', count: 154, pct: 12, color: '#8B5CF6' },
  { lang: 'Bengali', count: 132, pct: 11, color: '#EC4899' },
  { lang: 'Odia', count: 88, pct: 7, color: '#06B6D4' },
  { lang: 'Gujarati', count: 78, pct: 6, color: '#F59E0B' },
  { lang: 'Others', count: 79, pct: 6, color: '#6B7280' },
]

const monthlyData = [
  { month: 'Oct', avatars: 45, engagement: 65 },
  { month: 'Nov', avatars: 78, engagement: 72 },
  { month: 'Dec', avatars: 112, engagement: 81 },
  { month: 'Jan', avatars: 189, engagement: 88 },
  { month: 'Feb', avatars: 256, engagement: 90 },
  { month: 'Mar', avatars: 312, engagement: 94 },
]

const regionData = [
  { region: 'North India', reach: 820000, pct: 34, color: 'from-blue-500 to-blue-600' },
  { region: 'South India', reach: 650000, pct: 27, color: 'from-saffron-500 to-orange-500' },
  { region: 'West India', reach: 480000, pct: 20, color: 'from-emerald-500 to-green-500' },
  { region: 'East India', reach: 310000, pct: 13, color: 'from-purple-500 to-violet-500' },
  { region: 'NE India', reach: 140000, pct: 6, color: 'from-cyan-500 to-teal-500' },
]

const maxAvatars = Math.max(...monthlyData.map(d => d.avatars))
const totalLang = languageData.reduce((s, d) => s + d.count, 0)

export default function Analytics() {
  return (
    <div className="min-h-screen gradient-subtle tech-grid">
      <Sidebar />
      <div className="ml-64 p-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="font-heading text-2xl font-bold text-gray-900 tracking-tight">Analytics</h1>
          <p className="text-gray-500 text-sm mt-1">Track avatar generation, reach, and citizen engagement</p>
        </div>

        {/* Top stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {[
            { icon: Video, label: 'Total Avatars', value: '1,247', change: '+12%', bg: 'from-blue-500/10 to-blue-600/5', ic: 'text-blue-500' },
            { icon: Globe, label: 'Languages Used', value: '18', change: '+3 new', bg: 'from-saffron-500/10 to-saffron-600/5', ic: 'text-saffron-500' },
            { icon: Users, label: 'Total Reach', value: '2.4M', change: '+8.2%', bg: 'from-emerald-500/10 to-emerald-600/5', ic: 'text-emerald-500' },
            { icon: Eye, label: 'Engagement Rate', value: '87%', change: '+5%', bg: 'from-purple-500/10 to-purple-600/5', ic: 'text-purple-500' },
          ].map(({ icon: Icon, label, value, change, bg, ic }, i) => (
            <div key={i} className="glass-card rounded-2xl p-5 hover-lift">
              <div className="flex items-center justify-between">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${bg} flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${ic}`} />
                </div>
                <span className="text-[11px] font-semibold text-emerald-500 bg-emerald-50/80 px-2 py-0.5 rounded-full">{change}</span>
              </div>
              <p className="text-2xl font-heading font-bold text-gray-900 mt-3 tracking-tight">{value}</p>
              <p className="text-sm text-gray-500">{label}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Bar Chart */}
          <div className="lg:col-span-2 glass-card rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-heading font-semibold text-gray-900 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-500" />
                Announcement Performance
              </h3>
              <span className="text-[11px] text-gray-400 font-medium">Last 6 months</span>
            </div>
            <div className="flex items-end gap-5 h-52">
              {monthlyData.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <span className="text-xs font-bold text-gray-700">{d.avatars}</span>
                  <div className="w-full relative rounded-xl overflow-hidden" style={{ height: `${(d.avatars / maxAvatars) * 100}%` }}>
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-600 to-blue-400 opacity-85 rounded-xl" />
                  </div>
                  <span className="text-xs text-gray-400 font-medium">{d.month}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pie Chart - Language Distribution */}
          <div className="glass-card rounded-2xl p-6">
            <h3 className="font-heading font-semibold text-gray-900 flex items-center gap-2 mb-5">
              <Globe className="w-5 h-5 text-saffron-500" />
              Language Distribution
            </h3>
            {/* SVG Pie */}
            <div className="flex justify-center mb-5">
              <svg viewBox="0 0 100 100" className="w-36 h-36">
                {languageData.reduce((acc, d, i) => {
                  const startAngle = acc.offset
                  const angle = (d.pct / 100) * 360
                  const r = 40
                  const cx = 50, cy = 50
                  const rad1 = (startAngle - 90) * Math.PI / 180
                  const rad2 = (startAngle + angle - 90) * Math.PI / 180
                  const x1 = cx + r * Math.cos(rad1)
                  const y1 = cy + r * Math.sin(rad1)
                  const x2 = cx + r * Math.cos(rad2)
                  const y2 = cy + r * Math.sin(rad2)
                  const largeArc = angle > 180 ? 1 : 0
                  const path = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`
                  acc.paths.push(<path key={i} d={path} fill={d.color} opacity={0.85} className="hover:opacity-100 transition-opacity cursor-pointer" />)
                  acc.offset += angle
                  return acc
                }, { paths: [], offset: 0 }).paths}
                <circle cx="50" cy="50" r="20" fill="white" fillOpacity="0.9" />
                <text x="50" y="48" textAnchor="middle" className="text-[8px] font-bold fill-gray-700">{totalLang}</text>
                <text x="50" y="56" textAnchor="middle" className="text-[5px] fill-gray-400">total</text>
              </svg>
            </div>
            <div className="space-y-2">
              {languageData.slice(0, 5).map((d, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
                    <span className="text-gray-700 font-medium text-xs">{d.lang}</span>
                  </div>
                  <span className="text-gray-400 text-xs">{d.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Regional Engagement Heatmap */}
        <div className="mt-6 glass-card rounded-2xl p-6">
          <h3 className="font-heading font-semibold text-gray-900 flex items-center gap-2 mb-5">
            <MapPin className="w-5 h-5 text-emerald-500" />
            Regional Engagement Heatmap
          </h3>
          <div className="grid sm:grid-cols-5 gap-4">
            {regionData.map((r, i) => (
              <div key={i} className="glass-card rounded-2xl p-4 text-center hover-lift">
                <div className={`w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br ${r.color} flex items-center justify-center shadow-lg mb-3`}>
                  <span className="text-white font-bold text-lg">{r.pct}%</span>
                </div>
                <p className="text-sm font-semibold text-gray-800">{r.region}</p>
                <p className="text-xs text-gray-400 mt-0.5">{(r.reach / 1000).toFixed(0)}K citizens</p>
              </div>
            ))}
          </div>
        </div>

        {/* Engagement Trend */}
        <div className="mt-6 glass-card rounded-2xl p-6">
          <h3 className="font-heading font-semibold text-gray-900 flex items-center gap-2 mb-5">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            Citizen Engagement Trend
          </h3>
          <div className="grid grid-cols-6 gap-4">
            {monthlyData.map((d, i) => (
              <div key={i} className="text-center group">
                <div className="relative mx-auto w-16 h-16">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="rgba(229,231,235,0.5)" strokeWidth="2.5" />
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke={i % 2 === 0 ? '#2563EB' : '#FF9933'} strokeWidth="2.5" strokeDasharray={`${d.engagement} ${100 - d.engagement}`} strokeLinecap="round" className="transition-all duration-500 group-hover:stroke-[3]" />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-gray-700">{d.engagement}%</span>
                </div>
                <p className="text-xs text-gray-400 mt-2 font-medium">{d.month}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
