import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signupWithEmail } from '@backend/firebase/auth'
import NavigationBar from '@/components/NavigationBar'
import Footer from '@/components/Footer'
import { Camera, Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, User, Sparkles } from 'lucide-react'

const AdminSignup = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    setLoading(true)

    try {
      await signupWithEmail(email, password, name)
      navigate('/admin/dashboard')
    } catch (err) {
      console.error('Signup error:', err)
      if (err.code === 'auth/email-already-in-use') {
        setError('An email already exists with this account.')
      } else if (err.code === 'auth/weak-password') {
        setError('Password is too weak. Use at least 6 characters.')
      } else {
        setError('Signup failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#020617] text-slate-300 font-body antialiased">
      <NavigationBar activeTab="home" />

      {/* Split Screen Content */}
      <main className="flex-grow flex flex-col lg:flex-row">
        {/* Left Side: Branded Hero (Hidden on Mobile) */}
        <section className="hidden lg:flex lg:w-[45%] items-center justify-center p-12 relative overflow-hidden bg-slate-950/40 border-r border-white/[0.08]">
          {/* Decorative Glows */}
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px]"></div>
            <div className="absolute bottom-1/4 left-0 w-[300px] h-[300px] bg-violet-500/10 rounded-full blur-[80px]"></div>
          </div>

          <div className="max-w-sm text-center relative z-10">
            <div className="w-20 h-20 bg-slate-900/80 border border-white/[0.1] rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-2xl">
              <Camera className="text-indigo-400 w-10 h-10" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold text-indigo-400 mb-6 uppercase tracking-wider">
              <Sparkles className="w-3 h-3" />
              Photographer Workspace
            </div>

            <h2 className="text-3xl font-heading font-extrabold text-white mb-4 tracking-wider uppercase">
              Anmol Lamhe
            </h2>
            <p className="text-slate-400 text-sm font-medium leading-relaxed font-body">
              Create Your Admin Account
            </p>
            <p className="mt-8 text-slate-500 text-xs leading-relaxed font-body font-normal">
              Join professional event photographers who share memories elegantly, secure client permissions, and save massive storage fees.
            </p>
          </div>
        </section>

        {/* Right Side: Signup Form */}
        <section className="flex-grow flex items-center justify-center p-6 sm:p-12 lg:p-20 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 pointer-events-none lg:hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-indigo-500/10 rounded-full blur-[90px]"></div>
          </div>

          <div className="w-full max-w-[420px] relative z-10 animate-scale-in">
            <div className="glass-panel rounded-[2rem] p-8 sm:p-10 border border-white/[0.08] shadow-2xl">
              <div className="mb-8">
                <h1 className="text-2xl font-heading font-extrabold text-white mb-2 tracking-tight">
                  Get started
                </h1>
                <p className="text-slate-400 font-medium text-xs">
                  Set up your new photographer workspace.
                </p>
              </div>

              {error && (
                <div className="flex items-center gap-2.5 p-3.5 mb-6 bg-red-950/20 border border-red-500/20 rounded-xl animate-scale-in">
                  <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                  <p className="text-xs text-red-400 font-bold uppercase tracking-wider">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Full Name */}
                <div>
                  <label
                    htmlFor="signup-name"
                    className="block text-[11px] font-bold text-slate-400 mb-1.5 uppercase tracking-widest"
                  >
                    Full Name
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-indigo-400 transition-colors">
                      <User className="w-5 h-5" />
                    </div>
                    <input
                      type="text"
                      id="signup-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      className="input-premium pl-12 h-[52px]"
                      required
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div>
                  <label
                    htmlFor="signup-email"
                    className="block text-[11px] font-bold text-slate-400 mb-1.5 uppercase tracking-widest"
                  >
                    Email Address
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-indigo-400 transition-colors">
                      <Mail className="w-5 h-5" />
                    </div>
                    <input
                      type="email"
                      id="signup-email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@anmollamhe.com"
                      className="input-premium pl-12 h-[52px]"
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="signup-password"
                    className="block text-[11px] font-bold text-slate-400 mb-1.5 uppercase tracking-widest"
                  >
                    Password
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-indigo-400 transition-colors">
                      <Lock className="w-5 h-5" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="signup-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="input-premium pl-12 pr-12 h-[52px]"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label
                    htmlFor="signup-confirm-password"
                    className="block text-[11px] font-bold text-slate-400 mb-1.5 uppercase tracking-widest"
                  >
                    Confirm Password
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-indigo-400 transition-colors">
                      <Lock className="w-5 h-5" />
                    </div>
                    <input
                      type="password"
                      id="signup-confirm-password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="input-premium pl-12 h-[52px]"
                      required
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  id="signup-submit-button"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 h-[52px] bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white rounded-full font-bold text-xs uppercase tracking-wider hover:shadow-lg hover:shadow-indigo-500/25 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50 mt-6"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Create Account <ArrowRight className="w-4.5 h-4.5" />
                    </>
                  )}
                </button>

                {/* Sign In Link */}
                <div className="text-center mt-6">
                  <p className="text-slate-400 font-medium text-xs">
                    Already have an account?{' '}
                    <Link
                      to="/admin/login"
                      className="text-indigo-400 font-bold hover:underline underline-offset-4"
                    >
                      Sign in
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default AdminSignup
