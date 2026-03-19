import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Globe, Search, Bell, User } from 'lucide-react'
import { useState } from 'react'

export default function Navbar({ transparent = false, showSearch = false }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const isLanding = location.pathname === '/'

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      transparent ? 'bg-transparent' : 'glass shadow-sm shadow-black/5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/30 hover-scale transition-all">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <span className={`font-heading font-bold text-xl ${
              transparent ? 'text-white' : 'text-gray-900'
            }`}>
              Prati<span className="text-transparent bg-clip-text bg-gradient-to-r from-saffron-500 to-saffron-400">nidhi</span>
              <span className={`text-xs font-normal ml-1 ${transparent ? 'text-white/40' : 'text-gray-300'}`}>AI</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {isLanding && (
              <>
                <a href="#features" className={`text-sm font-medium nav-link-hover ${
                  transparent ? 'text-white/80 hover:text-white' : 'text-gray-600 hover:text-blue-600'
                }`}>Features</a>
                <a href="#how-it-works" className={`text-sm font-medium nav-link-hover ${
                  transparent ? 'text-white/80 hover:text-white' : 'text-gray-600 hover:text-blue-600'
                }`}>How It Works</a>
                <a href="#impact" className={`text-sm font-medium nav-link-hover ${
                  transparent ? 'text-white/80 hover:text-white' : 'text-gray-600 hover:text-blue-600'
                }`}>Impact</a>
              </>
            )}

            {showSearch && (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                <input type="text" placeholder="Search..." className="pl-9 pr-4 py-2 text-sm bg-gray-50/50 border border-gray-100 rounded-xl outline-none focus:border-blue-300 w-48" />
              </div>
            )}

            {showSearch && (
              <>
                <button className="relative p-2 rounded-xl hover:bg-gray-100/50 transition-all btn-press">
                  <Bell className="w-5 h-5 text-gray-400" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-saffron-500" />
                </button>
                <div className="w-8 h-8 rounded-xl gradient-primary flex items-center justify-center hover-scale cursor-pointer shadow-md shadow-blue-500/15">
                  <User className="w-4 h-4 text-white" />
                </div>
              </>
            )}

            {!showSearch && (
              <Link to="/login"
                className="px-6 py-2.5 rounded-full text-sm font-semibold bg-gradient-to-r from-saffron-500 to-saffron-400 text-white hover:shadow-xl hover:shadow-saffron-500/25 transition-all btn-press"
              >
                Admin Login
              </Link>
            )}
          </div>

          {/* Mobile Toggle */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden btn-press">
            {menuOpen
              ? <X className={`w-6 h-6 ${transparent ? 'text-white' : 'text-gray-700'}`} />
              : <Menu className={`w-6 h-6 ${transparent ? 'text-white' : 'text-gray-700'}`} />
            }
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden glass border-t border-white/30 animate-fade-in-up">
          <div className="px-4 py-4 space-y-3">
            {isLanding && (
              <>
                <a href="#features" className="block text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">Features</a>
                <a href="#how-it-works" className="block text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">How It Works</a>
                <a href="#impact" className="block text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">Impact</a>
              </>
            )}
            <Link to="/login" className="block w-full text-center px-5 py-2.5 rounded-full text-sm font-semibold gradient-saffron text-white btn-press">
              Admin Login
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
