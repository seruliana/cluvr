import { useEffect } from 'react'

/**
 * DetailModal — event болон club-ийн дэлгэрэнгүй мэдээлэл харуулна
 * Props:
 *   item     — сонгосон card-ийн өгөгдөл (null бол хаалттай)
 *   onClose  — хаах функц
 *   onAction — "Register / Follow" товчны callback(item)
 *   registered / followed — Set эсвэл object
 */
export default function DetailModal({ item, onClose, onAction, registered, followed }) {
  // Esc товчоор хаах
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  // Scroll lock
  useEffect(() => {
    document.body.style.overflow = item ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [item])

  if (!item) return null

  const isClub      = item.type === 'club'
  const isDone      = isClub ? followed?.[item.id] : registered?.[item.id]
  const actionLabel = isDone
    ? (isClub ? '✓ Following' : '✅ Registered!')
    : (isClub ? 'Follow Club'  : 'Register Now')

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      style={{ background: 'rgba(15,13,26,0.55)', backdropFilter: 'blur(6px)' }}
      onClick={onClose}
    >
      <div
        className="relative w-full sm:max-w-lg bg-white sm:rounded-3xl rounded-t-3xl overflow-hidden shadow-brand-lg"
        style={{ maxHeight: '90vh', animation: 'modalSlideUp .3s cubic-bezier(.4,0,.2,1) both' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/90 border-none cursor-pointer flex items-center justify-center text-ink text-lg shadow-sm hover:bg-gray-100 transition-colors"
        >×</button>

        {/* Hero image */}
        <div className={`h-52 bg-gradient-to-br ${item.gradient} flex items-center justify-center text-7xl`}>
          {item.emoji}
        </div>

        {/* Content — scrollable */}
        <div className="overflow-y-auto" style={{ maxHeight: 'calc(90vh - 208px)' }}>
          <div className="p-6">

            {/* Badge + category */}
            <div className="flex items-center gap-2 mb-3">
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase text-white ${item.badgeBg}`}>
                {item.catLabel}
              </span>
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase
                ${isClub ? 'bg-green-50 text-green-700' : 'bg-orange-50 text-orange-600'}`}>
                {isClub ? '✅ Active Club' : '📅 Upcoming Event'}
              </span>
            </div>

            {/* Title */}
            <h2 className="font-bold text-xl text-ink mb-1 leading-tight">{item.title}</h2>
            <p className="text-xs font-semibold text-brand mb-4">{item.club}</p>

            {/* Meta info */}
            <div className="flex flex-col gap-2 mb-5">
              {!isClub && item.dateStr && (
                <div className="flex items-center gap-3 text-sm text-muted">
                  <div className="w-8 h-8 rounded-xl bg-brand-lt flex items-center justify-center shrink-0">📅</div>
                  <span>{item.dateStr}</span>
                </div>
              )}
              {item.location && (
                <div className="flex items-center gap-3 text-sm text-muted">
                  <div className="w-8 h-8 rounded-xl bg-surface flex items-center justify-center shrink-0">📍</div>
                  <span>{item.location}</span>
                </div>
              )}
              {isClub && (
                <div className="flex items-center gap-3 text-sm text-muted">
                  <div className="w-8 h-8 rounded-xl bg-green-50 flex items-center justify-center shrink-0">👥</div>
                  <span>{item.club}</span>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="bg-surface rounded-2xl p-4 mb-5">
              <h4 className="text-xs font-bold text-muted uppercase tracking-wider mb-2">About</h4>
              <p className="text-sm text-ink leading-relaxed">
                {isClub
                  ? `${item.title} is an active campus organization bringing students together through shared interests and collaborative activities. Join us to connect, learn, and grow with like-minded peers.`
                  : `This is a wonderful opportunity for students to engage with their campus community. Whether you're a beginner or experienced, everyone is welcome. Don't miss out on this exciting event!`}
              </p>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {[item.catLabel, isClub ? 'Club' : 'Event', 'Campus Life'].map(tag => (
                <span key={tag} className="px-3 py-1 rounded-full bg-brand-lt text-brand text-xs font-medium">#{tag}</span>
              ))}
            </div>

            {/* Action buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => !isDone && onAction(item)}
                disabled={isDone}
                className="flex-1 py-3 rounded-full text-sm font-semibold border-none cursor-pointer transition-all"
                style={{
                  background: isDone ? '#10b981' : '#5b3ff8',
                  color: 'white',
                  opacity: isDone ? 0.9 : 1,
                }}
              >
                {actionLabel}
              </button>
              <button
                onClick={onClose}
                className="px-5 py-3 rounded-full text-sm font-semibold border-2 border-border text-muted bg-transparent cursor-pointer hover:border-brand hover:text-brand transition-all"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      </div>

      <style>{`
        @keyframes modalSlideUp {
          from { opacity: 0; transform: translateY(40px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}