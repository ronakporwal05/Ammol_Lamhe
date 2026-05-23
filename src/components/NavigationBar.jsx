import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Camera, LogOut, Menu, X } from 'lucide-react'

const NavigationBar = ({ activeTab, homeHref = '/', dashboardHref = '/admin/dashboard', logoutHref }) => {
  const location = useLocation()
  const currentPath = location.pathname
  const [isOpen, setIsOpen] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem('user')
    window.location.href = '/'
  }

  return (
    <nav className="bg-slate-950/75 backdrop-blur-md border-b border-white/[0.08] sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-[1200px] mx-auto px-5 sm:px-10 lg:px-20">
        <div className="flex justify-between items-center h-[72px]">
          {/* Logo */}
          <Link to={homeHref} className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <Camera className="w-5 h-5 text-white" />
            </div>
            <span className="text-sm font-heading font-extrabold tracking-[0.2em] uppercase text-white">
              ANMOL LAMHE
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              to={homeHref}
              className={`text-sm font-semibold transition-colors hover:text-white ${
                activeTab === 'home' || currentPath === homeHref ? 'text-indigo-400' : 'text-slate-400'
              }`}
            >
              Home
            </Link>
            <Link
              to={dashboardHref}
              className={`text-sm font-semibold transition-colors hover:text-white ${
                activeTab === 'dashboard' || currentPath.startsWith('/admin') ? 'text-indigo-400' : 'text-slate-400'
              }`}
            >
              Dashboard
            </Link>
            
            {logoutHref ? (
              <Link
                to={logoutHref}
                className="flex items-center gap-1.5 px-4 py-2 border border-white/[0.08] hover:border-white/[0.15] rounded-full text-xs font-bold text-slate-300 hover:text-white hover:bg-white/[0.04] transition-all"
              >
                <LogOut className="w-4 h-4 text-slate-400" />
                <span>LOGOUT</span>
              </Link>
            ) : (
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-4 py-2 border border-white/[0.08] hover:border-white/[0.15] rounded-full text-xs font-bold text-slate-300 hover:text-white hover:bg-white/[0.04] transition-all cursor-pointer"
              >
                <LogOut className="w-4 h-4 text-slate-400" />
                <span>LOGOUT</span>
              </button>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-slate-400 hover:text-white focus:outline-none transition-colors cursor-pointer"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-60 border-b border-white/[0.08] bg-slate-950/95' : 'max-h-0'}`}>
        <div className="px-5 py-4 space-y-4">
          <Link
            to={homeHref}
            onClick={() => setIsOpen(false)}
            className={`block text-sm font-semibold transition-colors hover:text-white ${
              activeTab === 'home' || currentPath === homeHref ? 'text-indigo-400' : 'text-slate-400'
            }`}
          >
            Home
          </Link>
          <Link
            to={dashboardHref}
            onClick={() => setIsOpen(false)}
            className={`block text-sm font-semibold transition-colors hover:text-white ${
              activeTab === 'dashboard' || currentPath.startsWith('/admin') ? 'text-indigo-400' : 'text-slate-400'
            }`}
          >
            Dashboard
          </Link>
          <div className="pt-2">
            {logoutHref ? (
              <Link
                to={logoutHref}
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-1.5 w-full py-2.5 border border-white/[0.08] rounded-full text-xs font-bold text-slate-300 hover:text-white hover:bg-white/[0.04] transition-all"
              >
                <LogOut className="w-4 h-4 text-slate-400" />
                <span>LOGOUT</span>
              </Link>
            ) : (
              <button
                onClick={handleLogout}
                className="flex items-center justify-center gap-1.5 w-full py-2.5 border border-white/[0.08] rounded-full text-xs font-bold text-slate-300 hover:text-white hover:bg-white/[0.04] transition-all cursor-pointer"
              >
                <LogOut className="w-4 h-4 text-slate-400" />
                <span>LOGOUT</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default NavigationBar
