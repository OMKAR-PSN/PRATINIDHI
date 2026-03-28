import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, UserPlus, MessageSquare, BarChart3, Settings,
  LogOut, Globe, ChevronLeft, ChevronRight, HelpCircle, Shield, Layers,
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Users } from 'lucide-react'

const allNavItems = [
  { icon: LayoutDashboard, labelKey: 'nav_dashboard', path: '/dashboard', roles: ['all'] },
  { icon: UserPlus, labelKey: 'nav_create', path: '/create', roles: ['all'] },
  { icon: MessageSquare, labelKey: 'msg_title', path: '/messages', roles: ['all'], badge: true },
  { icon: Users, labelKey: 'nav_receivers', path: '/receivers', roles: ['all'] },
  { icon: HelpCircle, labelKey: 'nav_ask', path: '/ask-avatar', roles: ['all'] },
  { icon: BarChart3, labelKey: 'nav_analytics', path: '/analytics', roles: ['admin', 'mp', 'mla'] },
  { icon: Settings, labelKey: 'nav_settings', path: '/settings', roles: ['all'] },
]


const roleConfig = {
  admin: { label: 'Institution Admin', color: 'from-blue-600 to-blue-800', badge: 'bg-blue-100 text-blue-700' },
  sarpanch: { label: 'Sarpanch', color: 'from-emerald-600 to-emerald-800', badge: 'bg-emerald-100 text-emerald-700' },
  mla: { label: 'MLA', color: 'from-purple-600 to-purple-800', badge: 'bg-purple-100 text-purple-700' },
  mp: { label: 'MP', color: 'from-saffron-500 to-saffron-700', badge: 'bg-saffron-100 text-saffron-700' },
  educator: { label: 'Educator', color: 'from-cyan-600 to-cyan-800', badge: 'bg-cyan-100 text-cyan-700' },
}

export default function Sidebar() {
  const location = useLocation()
  const { t } = useTranslation()
  const [collapsed, setCollapsed] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const role = localStorage.getItem('userRole') || 'admin'
  const rc = roleConfig[role] || roleConfig.admin

  const navItems = allNavItems.filter(
    (item) => item.roles.includes('all') || item.roles.includes(role)
  )

  return (
    <aside className={`fixed top-0 left-0 h-screen glass-sidebar z-40 flex flex-col transition-all duration-300 shadow-xl shadow-black/5 ${
      collapsed ? 'w-[72px]' : 'w-64'
    }`}>
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-white/30">
        <Link to="/dashboard" className="flex items-center gap-2.5 overflow-hidden">
          <div className="flex items-center justify-center w-9 h-9 min-w-[36px] rounded-full overflow-hidden shadow-md hover-scale">
              <img src="/pr_logo.jpg" alt="Pratinidhi Logo" className="w-full h-full object-cover" />
            </div>
          {!collapsed && (
            <span className="font-heading font-extrabold text-lg tracking-tight text-gray-900 whitespace-nowrap ml-1">
              PRATI<span className="text-saffron-500">NIDHI</span><span className="text-primary-600 text-[9px] uppercase ml-1 align-top tracking-widest font-semibold">AI</span>
            </span>
          )}
        </Link>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-7 h-7 rounded-lg bg-gray-100/80 hover:bg-gray-200/80 flex items-center justify-center transition-all hover-scale"
        >
          {collapsed ? <ChevronRight className="w-3.5 h-3.5 text-gray-500" /> : <ChevronLeft className="w-3.5 h-3.5 text-gray-500" />}
        </button>
      </div>

      {/* Role badge */}
      {!collapsed && (
        <div className="px-4 py-3 border-b border-white/20">
          <div className={`flex items-center gap-2 px-3 py-2 rounded-xl ${rc.badge} bg-opacity-60`}>
            <Shield className="w-3.5 h-3.5" />
            <span className="text-xs font-semibold">{rc.label}</span>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {navItems.map(({ icon: Icon, labelKey, path, label }) => {
          const isActive = location.pathname === path || (path !== '/settings' && location.pathname.startsWith(path + '/'))
          const displayLabel = t(labelKey, label || labelKey)
          return (
            <Link
              key={path}
              to={path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group btn-press ${
                isActive
                  ? 'gradient-primary text-white shadow-lg shadow-blue-500/20'
                  : 'text-gray-600 hover:bg-white/60 hover:text-blue-600'
              }`}
              title={collapsed ? displayLabel : ''}
            >
              <Icon className={`w-5 h-5 min-w-[20px] transition-transform group-hover:scale-110 ${
                isActive ? 'text-white' : 'text-gray-400 group-hover:text-blue-500'
              }`} />
              {!collapsed && <span className="whitespace-nowrap flex-1">{label || displayLabel}</span>}
              {labelKey === 'msg_title' && unreadCount > 0 && (
                <span className={`flex items-center justify-center min-w-[18px] h-[18px] text-[10px] font-bold rounded-full bg-red-500 text-white border-2 border-white shadow-sm ${collapsed ? 'absolute top-1 right-1' : ''}`}>
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* AI Status */}
      {!collapsed && (
        <div className="px-4 py-3 border-t border-white/20">
          <div className="glass-card rounded-xl p-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] font-medium text-gray-500">AI Engine Online</span>
            </div>
          </div>
        </div>
      )}

      {/* Logout */}
      <div className="p-3 border-t border-white/20">
        <Link
          to="/"
          onClick={() => localStorage.removeItem('userRole')}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-red-50/80 hover:text-red-500 transition-all btn-press"
          title={collapsed ? t('nav_logout', 'Log Out') : ''}
        >
          <LogOut className="w-5 h-5 min-w-[20px]" />
          {!collapsed && <span>{t('nav_logout', 'Log Out')}</span>}
        </Link>
      </div>
    </aside>
  )
}
