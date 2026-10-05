import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-ink text-white/60 px-8 pt-12 pb-7 mt-10">
      <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr] gap-8 mb-10">
        <div>
          <Link to="/" className="font-bold text-xl text-white no-underline block mb-3">cluvr</Link>
          <p className="text-sm leading-[1.7] max-w-[220px]">
            The ultimate platform for campus engagement and discovery.
          </p>
          <div className="flex gap-2.5 mt-5">
            {['f','ig','𝕏','✉'].map(icon => (
              <a key={icon} href="#"
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white text-sm no-underline hover:bg-brand transition-colors">
                {icon}
              </a>
            ))}
          </div>
        </div>
        {[
          { title: 'Platform', links: ['Search Events','Clubs Directory','Submit Event'] },
          { title: 'Community', links: ['Campus Rules','Safety Center','Leaderboards'] },
          { title: 'Support',  links: ['Help Center','Contact Us','Privacy Policy'] },
        ].map(col => (
          <div key={col.title}>
            <h5 className="text-white text-xs font-bold uppercase tracking-[.08em] mb-4">{col.title}</h5>
            {col.links.map(l => (
              <a key={l} href="#" className="block text-sm text-white/50 no-underline mb-2.5 hover:text-white transition-colors">{l}</a>
            ))}
          </div>
        ))}
      </div>
      <div className="max-w-5xl mx-auto border-t border-white/10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-white/40">
        <p>© 2026 cluvr. All rights reserved.</p>
        <nav className="flex gap-5">
          {['Privacy Policy','Terms of Service','Contact Us'].map(l => (
            <a key={l} href="#" className="text-white/40 no-underline hover:text-white transition-colors">{l}</a>
          ))}
        </nav>
      </div>
    </footer>
  )
}