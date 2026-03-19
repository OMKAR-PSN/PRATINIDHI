import { ChevronDown, Globe, Search, Sparkles } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

const languages = [
  { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
  { code: 'mr', name: 'Marathi', native: 'मराठी' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు' },
  { code: 'or', name: 'Odia', native: 'ଓଡ଼ିଆ' },
  { code: 'bn', name: 'Bengali', native: 'বাংলা' },
  { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી' },
  { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ' },
  { code: 'ml', name: 'Malayalam', native: 'മലയാളം' },
  { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
  { code: 'ur', name: 'Urdu', native: 'اردو' },
  { code: 'as', name: 'Assamese', native: 'অসমীয়া' },
  { code: 'bh', name: 'Bhojpuri', native: 'भोजपुरी' },
  { code: 'sa', name: 'Sanskrit', native: 'संस्कृतम्' },
  { code: 'ne', name: 'Nepali', native: 'नेपाली' },
  { code: 'sd', name: 'Sindhi', native: 'سنڌي' },
  { code: 'ks', name: 'Kashmiri', native: 'कॉशुर' },
  { code: 'doi', name: 'Dogri', native: 'डोगरी' },
  { code: 'mni', name: 'Manipuri', native: 'মৈতৈলোন্' },
  { code: 'sat', name: 'Santali', native: 'ᱥᱟᱱᱛᱟᱲᱤ' },
  { code: 'kok', name: 'Konkani', native: 'कोंकणी' },
  { code: 'mai', name: 'Maithili', native: 'मैथिली' },
]

export default function LanguageDropdown({ value, onChange, label }) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const ref = useRef(null)
  const searchRef = useRef(null)

  const selected = languages.find((l) => l.code === value)
  const filtered = languages.filter(
    (l) =>
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.native.includes(search) ||
      l.code.includes(search.toLowerCase())
  )

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  useEffect(() => {
    if (open && searchRef.current) searchRef.current.focus()
  }, [open])

  return (
    <div className="space-y-2" ref={ref}>
      {label && (
        <label className="block text-sm font-semibold text-gray-700">{label}</label>
      )}
      <div className="relative">
        <button
          type="button"
          onClick={() => { setOpen(!open); setSearch('') }}
          className="w-full flex items-center justify-between gap-2 px-4 py-3 glass-card rounded-xl text-left hover:border-blue-300 focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all btn-press"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/10 to-blue-600/5 flex items-center justify-center">
              <Globe className="w-4 h-4 text-blue-500" />
            </div>
            {selected ? (
              <span className="text-sm font-medium text-gray-800">
                {selected.name} <span className="text-gray-400 text-xs">({selected.native})</span>
              </span>
            ) : (
              <span className="text-sm text-gray-400">Select language...</span>
            )}
          </div>
          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
        </button>

        {open && (
          <div className="absolute top-full left-0 right-0 mt-2 glass-card rounded-2xl shadow-2xl shadow-black/10 z-50 overflow-hidden animate-scale-in">
            {/* BHASHINI badge */}
            <div className="px-4 py-2 bg-gradient-to-r from-blue-500/5 to-saffron-500/5 border-b border-gray-100/50 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-saffron-500" />
              <span className="text-[11px] font-semibold text-gray-500 tracking-wide">Powered by BHASHINI Multilingual AI</span>
            </div>

            {/* Search */}
            <div className="p-2 border-b border-gray-100/50">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                <input
                  ref={searchRef}
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search languages..."
                  className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50/50 rounded-lg border border-gray-100 outline-none focus:border-blue-300 transition-colors"
                />
              </div>
            </div>

            {/* Language list */}
            <div className="max-h-56 overflow-y-auto py-1">
              {filtered.length === 0 ? (
                <p className="text-sm text-gray-400 px-4 py-3 text-center">No languages found</p>
              ) : (
                filtered.map((lang) => (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => {
                      onChange(lang.code)
                      setOpen(false)
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm transition-all hover-lift ${
                      value === lang.code
                        ? 'bg-blue-50/80 text-blue-700 font-medium'
                        : 'text-gray-700 hover:bg-gray-50/80'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold ${
                      value === lang.code ? 'gradient-primary text-white' : 'bg-gray-100 text-gray-400'
                    }`}>
                      {lang.code.slice(0, 2).toUpperCase()}
                    </div>
                    <span className="flex-1">{lang.name}</span>
                    <span className="text-gray-400 text-xs">{lang.native}</span>
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
