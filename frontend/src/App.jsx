import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import PrivateRoute from '@/routes/PrivateRoute'
import AdminLogin from '@/components/AdminLogin'
import AdminSignup from '@/components/AdminSignup'
import AdminDashboard from '@/components/AdminDashboard'
import CreateEvent from '@/components/CreateEvent'
import EventList from '@/components/EventList'
import UploadPhotos from '@/components/UploadPhotos'
import ClientEventPage from '@/components/ClientEventPage'
import AdminShare from '@/components/AdminShare'
import Footer from '@/components/Footer'
import NavigationBar from '@/components/NavigationBar'
import { Link } from 'react-router-dom'
import { Camera, Upload, Sparkles, Image, ArrowRight, Shield, Zap, Smartphone, Link as LinkIcon } from 'lucide-react'

// ===== HOME PAGE =====
const Home = () => {
  const steps = [
    {
      icon: Upload,
      step: 'Step 01',
      title: 'Upload Photos',
      description: 'Photographers upload high-resolution event folders securely.',
    },
    {
      icon: LinkIcon,
      step: 'Step 02',
      title: 'Share Link',
      description: 'A clean, unique event portal link is shared with your guests.',
    },
    {
      icon: Camera,
      step: 'Step 03',
      title: 'Upload Selfie',
      description: 'Clients take or upload a single selfie to search the photography pool.',
    },
    {
      icon: Sparkles,
      step: 'Step 04',
      title: 'Get Your Photos',
      description: 'Smart matching matches facial signatures and delivers personal photos instantly.',
    },
  ]

  const features = [
    {
      icon: Shield,
      title: 'Privacy First',
      description: 'All face calculations happen securely in the browser. We respect guest privacy and do not harvest biometric databases.',
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Smart facial recognition in seconds, not hours. Avoid manual scrolling and catalog searching completely.',
    },
    {
      icon: Smartphone,
      title: 'Responsive Design',
      description: 'Optimized for mobile browsers and tablets. Guests can find their photos right at the event floor.',
    },
    {
      icon: Sparkles,
      title: '99% Accuracy',
      description: 'Advanced landmark algorithms identify side profiles, low-lighting shots, and group angles.',
    },
  ]

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 font-body antialiased">
      <NavigationBar activeTab="home" />
      
      {/* Hero Section */}
      <header className="relative overflow-hidden py-24 sm:py-32 border-b border-white/[0.04]">
        {/* Glow Effects */}
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[120px]"></div>
          <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-violet-500/10 rounded-full blur-[120px]"></div>
        </div>

        <div className="max-w-[1200px] mx-auto px-5 sm:px-10 lg:px-20 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/80 border border-white/[0.08] text-indigo-400 text-xs font-semibold mb-8 uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
            Smart Photo Delivery
          </div>
          
          <h1 className="text-[38px] md:text-[56px] lg:text-[72px] font-heading font-extrabold text-white tracking-tight leading-none mb-6">
            Every Moment,<br />
            <span className="bg-gradient-to-r from-slate-200 via-slate-400 to-slate-200 bg-clip-text text-transparent">
              Forever Precious
            </span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-sm sm:text-[18px] text-slate-400 mb-10 leading-relaxed font-normal">
            Upload a selfie, and instantly find all your photos from any event. Fast, private, and incredibly accurate.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20 max-w-md mx-auto sm:max-w-none">
            <Link
              to="/admin/login"
              id="cta-login"
              className="w-full sm:w-auto btn-primary"
            >
              Photographer Login
              <ArrowRight className="w-4.5 h-4.5" />
            </Link>
            <a
              href="#how-it-works"
              id="cta-how-it-works"
              className="w-full sm:w-auto btn-secondary"
            >
              How It Works
            </a>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto mt-16 pt-12 border-t border-white/[0.06]">
            <div className="glass-card p-6 flex flex-col items-center justify-center">
              <span className="text-4xl font-extrabold text-white mb-1 font-heading">99%</span>
              <span className="text-slate-400 text-[11px] uppercase tracking-widest font-bold">Accuracy</span>
            </div>
            <div className="glass-card p-6 flex flex-col items-center justify-center">
              <span className="text-4xl font-extrabold text-white mb-1 font-heading">&lt;5s</span>
              <span className="text-slate-400 text-[11px] uppercase tracking-widest font-bold">Matching</span>
            </div>
            <div className="glass-card p-6 flex flex-col items-center justify-center">
              <span className="text-4xl font-extrabold text-white mb-1 font-heading">100%</span>
              <span className="text-slate-400 text-[11px] uppercase tracking-widest font-bold">Private</span>
            </div>
          </div>
        </div>
      </header>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 sm:py-32 bg-slate-950/40 relative">
        <div className="max-w-[1200px] mx-auto px-5 sm:px-10 lg:px-20">
          <div className="text-center mb-20">
            <h2 className="text-[32px] md:text-[48px] font-heading font-extrabold text-white mb-4 tracking-tight">How It Works</h2>
            <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto font-normal">
              Four simple steps to deliver photos to your clients using smart face recognition.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step) => (
              <div key={step.title} className="glass-card glass-card-hover p-8 relative flex flex-col justify-between min-h-[280px]">
                <div>
                  <div className="mb-6 w-12 h-12 rounded-xl bg-slate-900/80 border border-white/[0.08] flex items-center justify-center text-white">
                    <step.icon className="w-5 h-5 text-indigo-400" />
                  </div>
                  <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-3 block">{step.step}</span>
                  <h3 className="text-lg font-heading font-bold text-white mb-3 tracking-tight">{step.title}</h3>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed font-normal">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-24 sm:py-32 border-t border-white/[0.05] relative">
        <div className="max-w-[1200px] mx-auto px-5 sm:px-10 lg:px-20">
          <div className="text-center mb-20">
            <h2 className="text-[32px] md:text-[48px] font-heading font-extrabold text-white mb-4 tracking-tight">Why Choose Us</h2>
            <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto font-normal">
              Built with cutting-edge face matching technology for photographers who care about their clients' experience.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <div key={feature.title} className="glass-card glass-card-hover p-8 flex flex-col justify-between min-h-[260px]">
                <div>
                  <div className="w-12 h-12 bg-slate-900/80 border border-white/[0.08] rounded-xl flex items-center justify-center text-white mb-6">
                    <feature.icon className="w-5 h-5 text-indigo-400" />
                  </div>
                  <h4 className="text-base font-heading font-bold text-white mb-3">{feature.title}</h4>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed font-normal">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 max-w-[1200px] mx-auto px-5 sm:px-10 lg:px-20">
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950/20 to-slate-900 border border-white/[0.08] rounded-[2.5rem] p-12 md:p-20 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-radial-gradient from-indigo-500/5 to-transparent blur-3xl pointer-events-none"></div>
          <div className="relative z-10">
            <h2 className="text-[32px] md:text-[48px] font-heading font-extrabold text-white mb-6 tracking-tight leading-tight">Ready to Transform Your Photo Delivery?</h2>
            <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto mb-10 font-normal leading-relaxed">
              Join professional photographers who deliver photos smarter, faster, and more personally with Anmol Lamhe.
            </p>
            <Link
              to="/admin/signup"
              id="cta-bottom-signup"
              className="btn-primary"
            >
              Get Started Free
              <ArrowRight className="w-4.5 h-4.5" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

// ===== 404 PAGE =====
const NotFound = () => (
  <div className="min-h-screen flex items-center justify-center bg-[#020617] p-5 font-body">
    <div className="glass-panel rounded-[2rem] p-10 text-center max-w-sm border border-white/[0.08] shadow-2xl animate-scale-in">
      <h1 className="text-7xl font-heading font-extrabold text-indigo-500 mb-3 tracking-tighter">404</h1>
      <h2 className="text-lg font-heading font-bold text-white mb-2">Page Not Found</h2>
      <p className="text-slate-400 text-xs mb-6 leading-relaxed">
        The link you followed may be broken or the event may have been removed.
      </p>
      <Link
        to="/"
        className="w-full btn-primary"
      >
        Go to Home
      </Link>
    </div>
  </div>
)

// ===== APP =====
const App = () => {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: '99px',
            background: 'rgba(15, 23, 42, 0.9)',
            backdropFilter: 'blur(8px)',
            color: '#F8FAFC',
            fontSize: '12px',
            fontWeight: 'bold',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          },
        }}
      />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/event/:eventId" element={<ClientEventPage />} />

        {/* Admin auth routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/signup" element={<AdminSignup />} />

        {/* Protected admin routes */}
        <Route
          path="/admin/dashboard"
          element={
            <PrivateRoute>
              <AdminDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/create-event"
          element={
            <PrivateRoute>
              <CreateEvent />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/events"
          element={
            <PrivateRoute>
              <EventList />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/events/:eventId"
          element={
            <PrivateRoute>
              <UploadPhotos />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/share/:eventId"
          element={
            <PrivateRoute>
              <AdminShare />
            </PrivateRoute>
          }
        />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
