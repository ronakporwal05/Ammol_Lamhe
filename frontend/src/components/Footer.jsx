import { Camera } from 'lucide-react'

const Footer = ({
  instagramHref = 'https://instagram.com',
  twitterHref = 'https://twitter.com',
  facebookHref = 'https://facebook.com',
  copyrightYear = new Date().getFullYear(),
}) => {
  return (
    <footer className="bg-slate-950/40 border-t border-white/[0.06] py-10 text-center sm:text-left shrink-0">
      <div className="max-w-[1200px] mx-auto px-5 sm:px-10 lg:px-20 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-slate-900 border border-white/[0.08] flex items-center justify-center">
            <Camera className="w-4 h-4 text-indigo-400" />
          </div>
          <span className="text-xs font-heading font-extrabold tracking-widest uppercase text-white">
            Anmol Lamhe
          </span>
        </div>
        
        <p className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">
          © {copyrightYear} Anmol Lamhe Photography. All rights reserved.
        </p>

        {/* Social media links using props */}
        <div className="flex items-center gap-6">
          <a
            href={instagramHref}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] text-slate-400 hover:text-indigo-400 transition-colors font-bold uppercase tracking-wider"
          >
            Instagram
          </a>
          <a
            href={twitterHref}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] text-slate-400 hover:text-indigo-400 transition-colors font-bold uppercase tracking-wider"
          >
            Twitter
          </a>
          <a
            href={facebookHref}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] text-slate-400 hover:text-indigo-400 transition-colors font-bold uppercase tracking-wider"
          >
            Facebook
          </a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
