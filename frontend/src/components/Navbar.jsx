import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Globe, ChevronDown, Shield } from 'lucide-react'
import { useState, useEffect } from 'react'
import LanguageSelector from './LanguageSelector'

export default function Navbar({ transparent = false, showSearch = false }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const isLanding = location.pathname === '/'

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navBg = transparent
    ? scrolled
      ? 'bg-cream-50/90 backdrop-blur-xl shadow-sm shadow-black/5'
      : 'bg-transparent'
    : 'bg-cream-50/90 backdrop-blur-xl shadow-sm shadow-black/5'

  const textClass = transparent && !scrolled ? 'text-white' : 'text-gray-700'
  const logoText = transparent && !scrolled ? 'text-white' : 'text-gray-900'

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${navBg}`}>
      {/* Tricolor bar at very top */}
      {isLanding && !scrolled && (
        <div className="h-[2px] bg-gradient-to-r from-saffron-500 via-white to-indian-green opacity-80" />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[72px]">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="flex items-center justify-center w-12 h-12 min-w-[48px] group-hover:scale-105 transition-transform duration-300 rounded-xl overflow-hidden shadow-sm">
              <img src="/logo_web.jpg" alt="Pratinidhi Logo" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col">
              <span className={`font-heading font-extrabold text-xl tracking-tight leading-none ${logoText} transition-colors duration-300`}>
                PRATI<span className="text-saffron-500">NIDHI</span><span className={`text-[10px] uppercase ml-1 align-top tracking-widest font-semibold ${transparent && !scrolled ? 'text-white' : 'text-primary-600'}`}>AI</span>
              </span>
              <span className={`text-[9px] font-semibold tracking-[0.25em] uppercase ${transparent && !scrolled ? 'text-white/60' : 'text-gray-500'} transition-colors duration-300 mt-0.5`}>
                Gov Platform
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {isLanding && (
              <>
                {[
                  { href: '#features', label: 'Features' },
                  { href: '#how-it-works', label: 'How It Works' },
                  { href: '#use-cases', label: 'Use Cases' },
                  { href: '#impact', label: 'Impact' },
                ].map(({ href, label }) => (
                  <a
                    key={href}
                    href={href}
                    className={`px-4 py-2 text-sm font-medium rounded-lg nav-link-hover transition-all duration-200 hover:bg-black/5 ${textClass}`}
                  >
                    {label}
                  </a>
                ))}
              </>
            )}
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <LanguageSelector />
            <Link
              to="/signup"
              className={`text-sm font-medium px-4 py-2 rounded-lg transition-all duration-200 hover:bg-black/5 ${textClass}`}
            >
              Sign In
            </Link>
            <Link
              to="/view/demo"
              className="px-6 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-saffron-500 to-saffron-400 text-white hover:shadow-xl hover:shadow-saffron-500/25 transition-all duration-300 btn-press btn-shine flex items-center gap-2"
            >
              Try Demo Free
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden btn-press p-2 rounded-lg hover:bg-black/5 transition-all">
            {menuOpen
              ? <X className={`w-6 h-6 ${textClass}`} />
              : <Menu className={`w-6 h-6 ${textClass}`} />
            }
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-cream-50/95 backdrop-blur-xl border-t border-cream-100 animate-fade-in-up shadow-xl">
          <div className="px-4 py-6 space-y-2">
            {isLanding && (
              <>
                {['Features', 'How It Works', 'Use Cases', 'Impact'].map((label) => (
                  <a
                    key={label}
                    href={`#${label.toLowerCase().replace(/ /g, '-')}`}
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-3 text-sm font-medium text-gray-700 hover:text-primary-500 hover:bg-gray-50 rounded-xl transition-all"
                  >
                    {label}
                  </a>
                ))}
              </>
            )}
            <div className="pt-3 border-t border-gray-100 space-y-2">
              <Link to="/signup" className="block px-4 py-3 text-sm font-medium text-gray-700 hover:text-primary-500 hover:bg-gray-50 rounded-xl transition-all">
                Sign In
              </Link>
              <Link
                to="/view/demo"
                className="block w-full text-center px-5 py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-saffron-500 to-saffron-400 text-white btn-press"
              >
                Try Demo Free
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
