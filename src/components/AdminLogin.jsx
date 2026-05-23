import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { loginWithEmail } from '@/firebase/auth'
import NavigationBar from '@/components/NavigationBar'
import Footer from '@/components/Footer'
import { Camera, Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react'

const AdminLogin = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await loginWithEmail(email, password)
      navigate('/admin/dashboard')
    } catch (err) {
      console.error('Login error:', err)
      if (
        err.code === 'auth/user-not-found' ||
        err.code === 'auth/wrong-password' ||
        err.code === 'auth/invalid-credential'
      ) {
        setError('Invalid email or password.')
      } else if (err.code === 'auth/too-many-requests') {
        setError('Too many attempts. Please try again later.')
      } else {
        setError('Login failed. Please try again.')
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

            <h2 className="text-3xl font-heading font-extrabold text-white mb-4 tracking-wider uppercase">
              Anmol Lamhe
            </h2>
            <p className="text-slate-400 text-sm font-medium leading-relaxed font-body">
              Every Moment, Forever Precious
            </p>
            <p className="mt-8 text-slate-500 text-xs leading-relaxed font-body font-normal">
              The premium smart event photo delivery platform. Join photographers worldwide in automating your workflow.
            </p>
          </div>
        </section>

        {/* Right Side: Login Form */}
        <section className="flex-grow flex items-center justify-center p-6 sm:p-12 lg:p-20 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 pointer-events-none lg:hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-indigo-500/10 rounded-full blur-[90px]"></div>
          </div>

          <div className="w-full max-w-[420px] relative z-10 animate-scale-in">
            <div className="glass-panel rounded-[2rem] p-8 sm:p-10 border border-white/[0.08] shadow-2xl">
              <div className="mb-8">
                <h1 className="text-2xl font-heading font-extrabold text-white mb-2 tracking-tight">
                  Welcome back
                </h1>
                <p className="text-slate-400 font-medium text-xs">
                  Sign in to manage your events and photos.
                </p>
              </div>

              {error && (
                <div className="flex items-center gap-2.5 p-3.5 mb-6 bg-red-950/20 border border-red-500/20 rounded-xl animate-scale-in">
                  <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                  <p className="text-xs text-red-400 font-bold uppercase tracking-wider">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email Field */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-[11px] font-bold text-slate-400 mb-2 uppercase tracking-widest"
                  >
                    Email Address
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-indigo-400 transition-colors">
                      <Mail className="w-5 h-5" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="photographer@example.com"
                      className="input-premium pl-12 h-[52px]"
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label
                      htmlFor="password"
                      className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest"
                    >
                      Password
                    </label>
                  </div>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-indigo-400 transition-colors">
                      <Lock className="w-5 h-5" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      name="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
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

                {/* Sign In Button */}
                <button
                  type="submit"
                  id="signin-btn"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 h-[52px] bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white rounded-full font-bold text-xs uppercase tracking-wider hover:shadow-lg hover:shadow-indigo-500/25 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50 mt-6"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Sign In
                      <ArrowRight className="w-4.5 h-4.5" />
                    </>
                  )}
                </button>

                {/* Signup Link */}
                <div className="text-center mt-6">
                  <p className="text-slate-400 font-medium text-xs">
                    Don't have an account?{' '}
                    <Link
                      to="/admin/signup"
                      id="create-account-link"
                      className="text-indigo-400 font-bold hover:underline underline-offset-4"
                    >
                      Create one
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

export default AdminLogin
