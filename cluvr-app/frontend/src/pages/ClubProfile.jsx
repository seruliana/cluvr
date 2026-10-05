import { useState, useEffect, useCallback } from 'react'
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import { useAuth } from '../contexts/AuthContext'
import { authAPI, clubsAPI, eventsAPI, favoritesAPI, userActionsAPI } from '../services/api'
import { toId, splitEventsByDate, getEventCardBadge, getClubActivityStatus } from '../utils/helpers'
import ItemImage from '../components/ui/ItemImage'
import SaveButton from '../components/ui/SaveButton'

function EventCard({ ev, registered, onSave, saved, onRegister }) {
  const evId = toId(ev)
  const timing = getEventCardBadge(ev)
  return (
    <Link to={`/event/${evId}`}
      className="rounded-2xl border border-border overflow-hidden no-underline text-ink hover:shadow-brand transition-all hover:-translate-y-0.5 block bg-card dark:bg-card">
      <div className="h-40 relative overflow-hidden">
        <ItemImage item={ev} className="w-full h-full object-cover" gradient={ev.gradient || 'from-brand-lt to-violet-200'} />
        <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold ${timing.badgeColor}`}>
          {timing.badge}
        </span>
        <div className="absolute top-3 right-3" onClick={e => { e.preventDefault(); e.stopPropagation() }}>
          <SaveButton saved={saved} onClick={(e) => { e.preventDefault(); onSave(evId) }} size={13} />
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-sm text-ink mb-2">{ev.title}</h3>
        <div className="text-xs text-muted flex items-center gap-1 mb-1">📅 {ev.date || 'TBD'}</div>
        <div className="text-xs text-muted flex items-center gap-1 mb-3">📍 {ev.location || 'TBD'}</div>
        <button
          onClick={e => { e.preventDefault(); onRegister(evId) }}
          disabled={registered[evId]}
          className="w-full py-2 rounded-full text-xs font-semibold border-none cursor-pointer transition-colors disabled:cursor-not-allowed"
          style={{ background: registered[evId] ? '#10b981' : '#5b3ff8', color: 'white' }}>
          {registered[evId] ? '✅ Registered!' : 'Register Now'}
        </button>
      </div>
    </Link>
  )
}

export default function ClubProfile() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated, user, refreshUser } = useAuth()
  const [club, setClub] = useState(null)
  const [clubEvents, setClubEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [followed, setFollowed] = useState(false)
  const [saved, setSaved] = useState(false)
  const [eventSaved, setEventSaved] = useState({})
  const [registered, setRegistered] = useState({})
  const [toast, setToast] = useState('')

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 2500)
  }

  const syncUserState = useCallback(() => {
    if (!user) return
    const isFollowing = (user.following || []).some(c => toId(c) === id)
    const isSaved = (user.savedClubs || []).some(c => toId(c) === id)
    setFollowed(isFollowing)
    setSaved(isSaved)
    const joined = {}
    for (const e of user.joinedEvents || []) joined[toId(e)] = true
    setRegistered(joined)
  }, [user, id])

  const loadClub = useCallback(async () => {
    try {
      setLoading(true)
      const [clubRes, eventsRes] = await Promise.all([
        clubsAPI.getById(id),
        eventsAPI.getAll({ clubId: id }),
      ])
      setClub(clubRes.data)
      setClubEvents(eventsRes.data || [])
      syncUserState()

      if (isAuthenticated) {
        try {
          const favs = await favoritesAPI.getAll({ type: 'event' })
          const savedMap = {}
          for (const f of favs.data || []) savedMap[toId(f.itemId)] = true
          setEventSaved(savedMap)
        } catch {
          // ignore
        }
      }
    } catch (error) {
      console.error('Failed to load club:', error)
      showToast('Failed to load club details')
    } finally {
      setLoading(false)
    }
  }, [id, isAuthenticated, syncUserState])

  useEffect(() => {
    loadClub()
  }, [loadClub])

  useEffect(() => {
    syncUserState()
  }, [syncUserState])

  const handleBack = () => {
    if (location.state?.fromEventId) {
      navigate(`/event/${location.state.fromEventId}`)
    } else {
      navigate(-1)
    }
  }

  const handleFollow = async () => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    try {
      const res = await authAPI.followClub(id)
      setFollowed(res.following)
      await refreshUser()
      showToast(res.following ? '✓ Following!' : 'Unfollowed')
    } catch (error) {
      console.error('Failed to follow club:', error)
      showToast('Failed to update follow status')
    }
  }

  const handleSave = async () => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    try {
      const res = await userActionsAPI.saveClub(id)
      setSaved(res.saved)
      await refreshUser()
      showToast(res.saved ? '✓ Saved!' : 'Removed from saved')
    } catch (error) {
      console.error('Failed to save club:', error)
      showToast('Failed to save club')
    }
  }

  const handleEventSave = async (eventId) => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    try {
      if (eventSaved[eventId]) {
        const favs = await favoritesAPI.getAll({ type: 'event' })
        const fav = (favs.data || []).find(f => toId(f.itemId) === eventId)
        if (fav) await favoritesAPI.remove(fav._id)
        setEventSaved(prev => ({ ...prev, [eventId]: false }))
        showToast('Removed from saved')
      } else {
        await favoritesAPI.add({ itemType: 'event', itemId: eventId })
        setEventSaved(prev => ({ ...prev, [eventId]: true }))
        showToast('✓ Saved!')
      }
    } catch (error) {
      console.error('Failed to save event:', error)
    }
  }

  const handleRegister = async (eventId) => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    if (registered[eventId]) return
    try {
      await userActionsAPI.joinEvent(eventId)
      setRegistered(prev => ({ ...prev, [eventId]: true }))
      await refreshUser()
      showToast('✓ Registered!')
    } catch (error) {
      console.error('Failed to register:', error)
      showToast('Failed to register')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen text-ink flex items-center justify-center bg-page">
        <div className="text-2xl">Loading...</div>
      </div>
    )
  }

  if (!club) {
    return (
      <div className="min-h-screen text-ink flex items-center justify-center bg-page">
        <div className="text-2xl">Club not found</div>
      </div>
    )
  }

  const { upcoming, past } = splitEventsByDate(clubEvents)
  const activity = getClubActivityStatus(id, clubEvents)
  const galleryImages = club.gallery || []

  return (
    <div className="min-h-screen text-ink bg-page">
      <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 bg-ink text-white px-5 py-2.5 rounded-xl text-sm font-medium z-50 transition-all duration-300 whitespace-nowrap
        ${toast ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
        {toast}
      </div>

      <Header />

      <main className="max-w-5xl mx-auto px-4 py-8">
        <button onClick={handleBack}
          className="inline-flex items-center gap-2 text-sm text-muted hover:text-brand transition-colors mb-6 cursor-pointer bg-transparent border-none">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
          Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
          <aside className="flex flex-col gap-4">
            <div className="bg-card dark:bg-card rounded-2xl border border-border p-6 flex flex-col items-center text-center">
              <h1 className="font-bold text-lg text-ink leading-tight mb-1">{club.name}</h1>
              <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold mb-4 ${activity.badgeColor}`}>
                {activity.label}
              </span>
              <button
                onClick={handleFollow}
                className="w-full py-2.5 rounded-full text-sm font-semibold border-none cursor-pointer transition-all mb-3"
                style={{ background: followed ? '#10b981' : '#5b3ff8', color: 'white' }}>
                {followed ? '✓ Following' : 'Follow Club'}
              </button>
              <SaveButton saved={saved} onClick={handleSave} />
            </div>

            <div className="bg-card dark:bg-card rounded-2xl border border-border p-5">
              <h3 className="text-[10px] font-bold text-muted uppercase tracking-widest mb-4">Information</h3>
              <div className="flex flex-col gap-3">
                {[
                  { icon:'📅', label:'Founded Year', value: club.foundedYear || 'N/A' },
                  { icon:'👥', label:'Members', value: `${club.members || 0} Active Members` },
                  { icon:'📍', label:'Location', value: club.location || 'N/A' },
                  { icon:'📧', label:'Contact', value: club.contact || 'N/A' },
                ].map((row, idx) => (
                  <div key={idx} className="flex items-start gap-2.5">
                    <span className="text-base mt-0.5">{row.icon}</span>
                    <div>
                      <p className="text-[10px] text-muted font-medium">{row.label}</p>
                      <p className="text-xs text-ink font-medium mt-0.5">{row.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-card dark:bg-card rounded-2xl border border-border p-5">
              <h3 className="text-[10px] font-bold text-muted uppercase tracking-widest mb-3">About</h3>
              <p className="text-xs text-muted leading-relaxed">{club.description || 'No description available'}</p>
            </div>
          </aside>

          <div className="flex flex-col gap-6">
            <div className="bg-card dark:bg-card rounded-2xl border border-border p-6">
              <h2 className="font-bold text-lg text-ink mb-4">Gallery</h2>
              <div className="grid grid-cols-2 gap-2">
                {galleryImages.map((src, idx) => (
                  <div key={idx} className="aspect-square rounded-xl overflow-hidden">
                    <img src={src} alt={`${club.name} ${idx + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-card dark:bg-card rounded-2xl border border-border p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-bold text-lg text-ink">Upcoming Events</h2>
                <span className="text-xs text-muted">{upcoming.length} events</span>
              </div>
              {upcoming.length === 0 ? (
                <p className="text-sm text-muted text-center py-8">No upcoming events</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {upcoming.map(ev => (
                    <EventCard
                      key={toId(ev)}
                      ev={ev}
                      registered={registered}
                      saved={!!eventSaved[toId(ev)]}
                      onSave={handleEventSave}
                      onRegister={handleRegister}
                    />
                  ))}
                </div>
              )}
            </div>

            {past.length > 0 && (
              <div className="bg-card dark:bg-card rounded-2xl border border-border p-6">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-bold text-lg text-ink">Past Events</h2>
                  <span className="text-xs text-muted">{past.length} events</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {past.map(ev => (
                    <EventCard
                      key={toId(ev)}
                      ev={ev}
                      registered={registered}
                      saved={!!eventSaved[toId(ev)]}
                      onSave={handleEventSave}
                      onRegister={handleRegister}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
