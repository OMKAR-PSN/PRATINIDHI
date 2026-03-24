import Sidebar from '../components/Sidebar'
import { useState, useEffect } from 'react'
import { User, Globe, Mic, Shield, Bell, Save, Check, Sparkles } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { getMe } from '../services/api'

export default function Settings() {
  const { t, i18n } = useTranslation()
  const [saved, setSaved] = useState(false)
  const [otpEnabled, setOtpEnabled] = useState(false)
  const [profile, setProfile] = useState({ 
    name: localStorage.getItem('userName') || 'Leader Admin', 
    phone: localStorage.getItem('userPhone') || '+919876543210', 
    department: 'Government of India', 
    role: localStorage.getItem('userRole') || 'State Administrator' 
  })
  const [langPref, setLangPref] = useState(i18n.language || 'en')
  const [voicePref, setVoicePref] = useState('standard')

  useEffect(() => {
    const leaderId = localStorage.getItem('leaderId') || 'admin'
    getMe(leaderId).then(res => {
      if (res.data) {
        setProfile({
          name: res.data.name || localStorage.getItem('userName') || 'Admin',
          phone: res.data.phone || localStorage.getItem('userPhone') || '',
          department: res.data.department || 'Government of India',
          role: res.data.role || localStorage.getItem('userRole') || 'Admin'
        })
      }
    }).catch(e => console.error(e))
  }, [])

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000) }

  return (
    <div className="min-h-screen gradient-subtle tech-grid">
      <Sidebar />
      <div className="ml-64 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-heading text-2xl font-bold text-gray-900 tracking-tight">{t('set_title', 'Settings')}</h1>
            <p className="text-gray-500 text-sm mt-1">{t('set_subtitle', 'Manage your account and platform preferences')}</p>
          </div>
          <button onClick={handleSave} className={`px-5 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 transition-all btn-press ${saved ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25' : 'gradient-primary text-white hover:shadow-lg hover:shadow-blue-500/25'}`}>
            {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            {saved ? t('set_saved', 'Saved!') : t('set_save', 'Save Changes')}
          </button>
        </div>

        <div className="max-w-3xl space-y-5">
          {/* Profile */}
          <div className="glass-card rounded-2xl p-6">
            <h3 className="font-heading font-semibold text-gray-900 flex items-center gap-2 mb-5"><User className="w-5 h-5 text-blue-500" /> {t('set_profile', 'Profile Settings')}</h3>
            <div className="grid sm:grid-cols-2 gap-5">
              {[
                { label: t('set_name', 'Full Name'), key: 'name', disabled: false },
                { label: t('set_email', 'Phone Number'), key: 'phone', disabled: false },
                { label: t('set_dept', 'State/Department'), key: 'department', disabled: false },
                { label: t('set_role', 'Role'), key: 'role', disabled: true },
              ].map(({ label, key, disabled }) => (
                <div key={key} className="space-y-1.5">
                  <label className="block text-sm font-semibold text-gray-700">{label}</label>
                  <input type="text" value={profile[key]} onChange={(e) => !disabled && setProfile({ ...profile, [key]: e.target.value })} disabled={disabled} className={`w-full px-4 py-3 glass-card rounded-xl text-sm outline-none transition-all border border-gray-200/50 ${disabled ? 'bg-gray-50/50 text-gray-400' : 'focus:ring-2 focus:ring-blue-100 focus:border-blue-400'}`} />
                </div>
              ))}
            </div>
          </div>

          {/* Language */}
          <div className="glass-card rounded-2xl p-6">
            <h3 className="font-heading font-semibold text-gray-900 flex items-center gap-2 mb-5"><Globe className="w-5 h-5 text-saffron-500" /> {t('set_lang_pref', 'Language Preferences')}</h3>
            <div className="flex items-center gap-2 mb-4 text-xs text-gray-400"><Sparkles className="w-3.5 h-3.5 text-saffron-400" /> {t('set_lang_sub', 'Powered by BHASHINI Multilingual AI')}</div>
            <select value={langPref} onChange={(e) => {
                setLangPref(e.target.value); 
                i18n.changeLanguage(e.target.value);
                localStorage.setItem('userLanguage', e.target.value);
            }} className="w-full sm:w-1/2 px-4 py-3 glass-card rounded-xl text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all outline-none appearance-none border border-gray-200/50">
              <option value="en">English (English)</option>
              <option value="hi">Hindi (हिन्दी)</option>
              <option value="mr">Marathi (मराठी)</option>
              <option value="ta">Tamil (தமிழ்)</option>
              <option value="te">Telugu (తెలుగు)</option>
              <option value="or">Odia (ଓଡ଼ିଆ)</option>
              <option value="bn">Bengali (বাংলা)</option>
            </select>
          </div>

          {/* Voice */}
          <div className="glass-card rounded-2xl p-6">
            <h3 className="font-heading font-semibold text-gray-900 flex items-center gap-2 mb-5"><Mic className="w-5 h-5 text-emerald-500" /> Voice Settings</h3>
            <select value={voicePref} onChange={(e) => setVoicePref(e.target.value)} className="w-full sm:w-1/2 px-4 py-3 glass-card rounded-xl text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all outline-none appearance-none border border-gray-200/50">
              <option value="standard">Standard Voice</option><option value="formal">Formal Tone</option><option value="natural">Natural Conversational</option>
            </select>
          </div>

          {/* Security & Compliance */}
          <div className="glass-card rounded-2xl p-6">
            <h3 className="font-heading font-semibold text-gray-900 flex items-center gap-2 mb-5"><Shield className="w-5 h-5 text-red-400" /> {t('set_security', 'Compliance & Security')}</h3>
            <div className="space-y-1">
              {[
                { label: t('set_mcc', 'MCC Compliance'), desc: t('set_mcc_sub', 'Automatically flag Model Code of Conduct violations'), toggle: true, enabled: true, onToggle: () => {} },
                { label: t('set_otp', 'OTP Consent Lock'), desc: t('set_otp_sub', 'Require OTP verification before citizens can view messages'), toggle: true, enabled: otpEnabled, onToggle: () => setOtpEnabled(!otpEnabled) },
                { label: 'Session Timeout', desc: 'Auto logout after inactivity', select: true },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between py-3 border-b border-gray-100/50 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{item.label}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{item.desc}</p>
                  </div>
                  {item.toggle && (
                    <button onClick={item.onToggle} className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${item.enabled ? 'gradient-primary' : 'bg-gray-200'}`}>
                      <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${item.enabled ? 'translate-x-6' : 'translate-x-0.5'}`} />
                    </button>
                  )}
                  {item.badge && <span className="text-[11px] font-medium text-gray-400 bg-gray-100/80 rounded-full px-3 py-1">{item.badge}</span>}
                  {item.select && (
                    <select className="px-3 py-1.5 glass-card rounded-lg text-sm outline-none border border-gray-200/50">
                      <option>30 minutes</option><option>1 hour</option><option>2 hours</option>
                    </select>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Notifications */}
          <div className="glass-card rounded-2xl p-6">
            <h3 className="font-heading font-semibold text-gray-900 flex items-center gap-2 mb-5"><Bell className="w-5 h-5 text-purple-400" /> Notifications</h3>
            <div className="space-y-3">
              {['Avatar generation complete', 'New citizen engagement report', 'System updates'].map((item, i) => (
                <div key={i} className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-700">{item}</span>
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded accent-blue-500" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
