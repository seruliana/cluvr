import { useState, useEffect, useCallback } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import { useAuth } from '../contexts/AuthContext'
import { eventsAPI, userActionsAPI, favoritesAPI } from '../services/api'
import { toId } from '../utils/helpers'
import ItemImage from '../components/ui/ItemImage'
import SaveButton from '../components/ui/SaveButton'

export default function EventDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuth()
  
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saved, setSaved] = useState(false)
  const [registered, setRegistered] = useState(false)
  const [liked, setLiked] = useState(false)
  const [toast, setToast] = useState('')

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 2500)
  }

  const loadEvent = useCallback(async () => {
    try {
      setLoading(true)
      const data = await eventsAPI.getById(id)
      setEvent(data.data)
      
      if (isAuthenticated && user) {
        // Check if user registered for this event
        const isRegistered = user.joinedEvents?.some(e => toId(e) === id)
        setRegistered(isRegistered)
        
        // Check if user liked this event
        const isLiked = data.data.likes?.some(l => l._id === user._id)
        setLiked(isLiked)
        
        // Check if user saved this event
        try {
          const favCheck = await favoritesAPI.check('event', id)
          setSaved(favCheck.isFavorited)
        } catch (error) {
          console.error('Failed to check favorite status:', error)
        }
      }
    } catch (error) {
      console.error('Failed to load event:', error)
      showToast('Failed to load event details')
    } finally {
      setLoading(false)
    }
  }, [id, isAuthenticated, user])

  useEffect(() => {
    loadEvent()
  }, [loadEvent])

  const handleRegister = async () => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    if (registered) return
    try {
      await userActionsAPI.joinEvent(id)
      setRegistered(true)
      showToast('🎉 Successfully registered!')
    } catch (error) {
      console.error('Failed to register:', error)
      showToast('Failed to register')
    }
  }

  const handleLike = async () => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    try {
      await eventsAPI.like(id)
      setLiked(!liked)
      showToast(liked ? 'Removed from likes' : '❤️ Liked!')
    } catch (error) {
      console.error('Failed to like event:', error)
      showToast('Failed to like event')
    }
  }

  const handleSave = async () => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    try {
      if (saved) {
        // Remove from favorites
        const favs = await favoritesAPI.getAll({ type: 'event' })
        const eventFav = favs.data.find(f => f.itemId._id === id)
        if (eventFav) {
          await favoritesAPI.remove(eventFav._id)
        }
        setSaved(false)
        showToast('Removed from saved')
      } else {
        // Add to favorites
        await favoritesAPI.add({ itemType: 'event', itemId: id })
        setSaved(true)
        showToast('✓ Saved!')
      }
    } catch (error) {
      console.error('Failed to save event:', error)
      showToast('Failed to save event')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen text-ink flex items-center justify-center" style={{ background: '#f5f4fb' }}>
        <div className="text-2xl">Loading...</div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="min-h-screen text-ink flex items-center justify-center" style={{ background: '#f5f4fb' }}>
        <div className="text-2xl">Event not found</div>
      </div>
    )
  }

  const pct = event.seats ? Math.round(((event.seats - (event.seatsLeft || 0)) / event.seats) * 100) : 0

  return (
    <div className="min-h-screen text-ink bg-page">
      {/* Toast */}
      <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 bg-ink text-white px-5 py-2.5 rounded-xl text-sm font-medium z-50 transition-all duration-300 whitespace-nowrap
        ${toast ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
        {toast}
      </div>

      <Header />

      <main className="max-w-5xl mx-auto px-4 py-8">

        {/* Back */}
        <button onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm text-muted hover:text-brand transition-colors mb-6 cursor-pointer bg-transparent border-none">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
          Back to Discovery
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">

          {/* ── LEFT: Event content ── */}
          <div className="flex flex-col gap-5">

            {/* Hero image */}
            <div className="relative rounded-2xl overflow-hidden h-64 sm:h-80">
              <ItemImage item={event} className="w-full h-full object-cover" gradient={event.gradient || 'from-brand-lt to-violet-200'} />
              <div className="absolute top-4 right-4 flex gap-2">
                <button onClick={handleLike}
                  className="w-9 h-9 rounded-full bg-white/90 dark:bg-gray-800/90 border-none cursor-pointer flex items-center justify-center shadow-sm hover:scale-110 transition-transform">
                  <span className="text-lg">{liked ? '❤️' : '🤍'}</span>
                </button>
                <SaveButton saved={saved} onClick={handleSave} />
              </div>
            </div>

            {/* Tags + attending */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`px-3 py-1 rounded-full text-[11px] font-bold text-white ${event.catColor || 'bg-brand'}`}>{event.category || event.catLabel || 'Event'}</span>
              <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-brand-lt text-brand">{event.secondTag || 'Campus Event'}</span>
              <span className="text-xs text-muted ml-1">+ {event.likes?.length || 0} likes</span>
            </div>

            {/* Title */}
            <div>
              <h1 className="font-bold text-2xl sm:text-3xl text-ink leading-tight mb-4">{event.title}</h1>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { icon:'📅', value: event.date || 'TBD' },
                  { icon:'🕐', value: event.time || 'TBD' },
                  { icon:'📍', value: event.location || 'TBD' },
                ].map(row => (
                  <div key={row.icon} className="flex items-center gap-2 text-sm text-muted">
                    <span>{row.icon}</span><span>{row.value}</span>
                  </div>
                ))}
              </div>
              {event.seats && (
                <p className="text-xs text-muted mt-3">🪑 Limited Seats: {event.seats}</p>
              )}
            </div>

            {/* About */}
            <div className="bg-card dark:bg-card rounded-2xl border border-border p-6">
              <h2 className="font-bold text-base text-ink mb-3">About the Event</h2>
              <p className="text-sm text-muted leading-relaxed">{event.description || event.about || 'No description available.'}</p>
            </div>

            {/* Key takeaways + Requirements */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-card dark:bg-card rounded-2xl border border-border p-5">
                <h3 className="font-bold text-sm text-ink mb-3">Key Takeaways</h3>
                <ul className="flex flex-col gap-2">
                  {(event.takeaways || ['Learn new skills', 'Network with peers', 'Have fun']).map((t, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-muted">
                      <span className="text-brand mt-0.5">•</span>{t}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-card dark:bg-card rounded-2xl border border-border p-5">
                <h3 className="font-bold text-sm text-ink mb-3">Requirements</h3>
                <ul className="flex flex-col gap-2">
                  {(event.requirements || ['Bring your ID', 'Comfortable clothing', 'Positive attitude']).map((r, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-muted">
                      <span className="text-brand mt-0.5">•</span>{r}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Hosted By */}
            <div className="bg-white rounded-2xl border border-border p-5">
              <h3 className="font-bold text-sm text-ink mb-4">Hosted By</h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl overflow-hidden">
                    <ItemImage item={event.clubId} className="w-full h-full object-cover" gradient="from-brand-lt to-violet-200" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-ink">{event.clubId?.name || event.club || 'Unknown Club'}</p>
                    <p className="text-[10px] font-bold text-muted uppercase tracking-wider">Official University Partner</p>
                  </div>
                </div>
                {event.clubId?._id && (
                  <Link
                    to={`/club/${event.clubId._id}`}
                    state={{ fromEventId: id }}
                    className="px-4 py-1.5 rounded-full border border-border text-xs font-semibold text-ink no-underline hover:border-brand hover:text-brand transition-all">
                    View Profile
                  </Link>
                )}
              </div>
            </div>

            {/* Tags */}
            <div>
              <h3 className="text-[10px] font-bold text-muted uppercase tracking-widest mb-2">Event Tags</h3>
              <div className="flex flex-wrap gap-2">
                {(event.tags || ['#Campus', '#Event', '#Fun']).map((tag, idx) => (
                  <span key={idx} className="px-3 py-1 rounded-full bg-brand-lt text-brand text-xs font-medium">{tag}</span>
                ))}
              </div>
            </div>
          </div>

          {/* ── RIGHT: Registration card ── */}
          <div className="lg:sticky lg:top-24 self-start flex flex-col gap-4">
            <div className="bg-card dark:bg-card rounded-2xl border border-border p-5 shadow-brand">

              <div className="flex items-start justify-between mb-1">
                <h3 className="font-bold text-base text-ink">Secure Your Spot</h3>
                <SaveButton saved={saved} onClick={handleSave} size={13} className="w-8 h-8 shadow-none" />
              </div>
              <p className="text-xs text-muted mb-4">Join {event.likes?.length || 0} other students interested in this session.</p>

              {/* Seats progress */}
              {event.seats && (
                <div className="mb-4">
                  <div className="flex justify-between text-[10px] text-muted mb-1">
                    <span>{event.seats - (event.seatsLeft || 0)} registered</span>
                    <span>{event.seats} total</span>
                  </div>
                  <div className="w-full h-1.5 bg-surface rounded-full overflow-hidden">
                    <div className="h-full bg-brand rounded-full transition-all" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )}

              {registered ? (
                <div className="text-center py-4">
                  <div className="text-4xl mb-2">🎉</div>
                  <p className="font-bold text-green-600 text-sm">You're registered!</p>
                  <p className="text-xs text-muted mt-1">Check your email for confirmation.</p>
                </div>
              ) : (
                <>
                  <button onClick={handleRegister}
                    disabled={registered}
                    className="w-full py-3 rounded-full bg-brand text-white font-semibold text-sm border-none cursor-pointer hover:bg-brand-dk transition-colors hover:-translate-y-0.5 mb-3 disabled:opacity-70 disabled:cursor-not-allowed">
                    Register for Event
                  </button>
                  <p className="text-[10px] text-muted text-center leading-relaxed">
                    By registering, you agree to the university event code of conduct and safety guidelines.
                  </p>
                </>
              )}
            </div>

            {/* Urgency banner */}
            {!registered && event.seatsLeft && event.seatsLeft > 0 && (
              <div className="bg-brand-lt border border-brand/20 rounded-2xl px-4 py-3 flex items-center gap-2">
                <span className="text-base">⏰</span>
                <p className="text-xs text-brand font-medium">
                  Only <strong>{event.seatsLeft} spots left!</strong> Don't miss out!
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}