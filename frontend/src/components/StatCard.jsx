import { TrendingUp, TrendingDown } from 'lucide-react'

export default function StatCard({ icon: Icon, title, value, change, changeType = 'up', color = 'blue' }) {
  const colorMap = {
    blue: { bg: 'from-blue-500/10 to-blue-600/5', icon: 'text-blue-500', glow: 'shadow-blue-500/10' },
    saffron: { bg: 'from-saffron-500/10 to-saffron-600/5', icon: 'text-saffron-500', glow: 'shadow-saffron-500/10' },
    green: { bg: 'from-emerald-500/10 to-emerald-600/5', icon: 'text-emerald-500', glow: 'shadow-emerald-500/10' },
    purple: { bg: 'from-purple-500/10 to-purple-600/5', icon: 'text-purple-500', glow: 'shadow-purple-500/10' },
  }
  const c = colorMap[color] || colorMap.blue

  return (
    <div className={`glass-card rounded-2xl p-5 hover-lift group cursor-default`}>
      <div className="flex items-start justify-between">
        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${c.bg} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg ${c.glow}`}>
          <Icon className={`w-5 h-5 ${c.icon}`} />
        </div>
        {change && (
          <span className={`flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full ${
            changeType === 'up' ? 'bg-emerald-50/80 text-emerald-600' : 'bg-red-50/80 text-red-500'
          }`}>
            {changeType === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {change}
          </span>
        )}
      </div>
      <div className="mt-4">
        <p className="text-2xl font-heading font-bold text-gray-900 tracking-tight">{value}</p>
        <p className="text-sm text-gray-500 mt-0.5">{title}</p>
      </div>
    </div>
  )
}
