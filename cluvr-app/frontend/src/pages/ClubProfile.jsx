import { useState, useEffect } from 'react'
import {Link, useNavigate, useParams } from 'react-router-dom'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import { useAuth } from '../contexts/AuthContext'
import { clubsAPI, userActionsAPI, favoritesAPI } from '../services/api'

export default function ClubProfile() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuth()
  const [club, setClub] = useState(null)
  const [loading, setLoading] = useState(true)
  const [followed, setFollowed] = useState(false)
  const [saved, setSaved] = useState(false)
  const [registered, setRegistered] = useState({})
  const [toast, setToast] = useState('')

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 2500)
  }

  useEffect(() => {
    loadClub()
  }, [id])

  const loadClub = async () => {
    try {
      setLoading(true)
      const data = await clubsAPI.getById(id)
      setClub(data.data)
      
      if (isAuthenticated && user) {
        // Check if user follows this club
        const isFollowing = data.data.followers?.some(f => f._id === user._id)
        setFollowed(isFollowing)
        
        // Check if user saved this club
        try {
          const favCheck = await favoritesAPI.check('club', id)
          setSaved(favCheck.isFavorited)
        } catch (error) {
          console.error('Failed to check favorite status:', error)
        }
      }
    } catch (error) {
      console.error('Failed to load club:', error)
      showToast('Failed to load club details')
    } finally {
      setLoading(false)
    }
  }

  const handleFollow = async () => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    try {
      await clubsAPI.follow(id)
      setFollowed(!followed)
      showToast(followed ? 'Unfollowed' : '✓ Following!')
    } catch (error) {
      console.error('Failed to follow club:', error)
      showToast('Failed to follow club')
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
        const favs = await favoritesAPI.getAll({ type: 'club' })
        const clubFav = favs.data.find(f => f.itemId._id === id)
        if (clubFav) {
          await favoritesAPI.remove(clubFav._id)
        }
        setSaved(false)
        showToast('Removed from saved')
      } else {
        // Add to favorites
        await favoritesAPI.add({ itemType: 'club', itemId: id })
        setSaved(true)
        showToast('✓ Saved!')
      }
    } catch (error) {
      console.error('Failed to save club:', error)
      showToast('Failed to save club')
    }
  }

  const handleRegister = async (eventId) => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    try {
      await userActionsAPI.joinEvent(eventId)
      setRegistered(prev => ({ ...prev, [eventId]: true }))
      showToast('✓ Registered!')
    } catch (error) {
      console.error('Failed to register:', error)
      showToast('Failed to register')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen text-ink flex items-center justify-center" style={{ background: '#f5f4fb' }}>
        <div className="text-2xl">Loading...</div>
      </div>
    )
  }

  if (!club) {
    return (
      <div className="min-h-screen text-ink flex items-center justify-center" style={{ background: '#f5f4fb' }}>
        <div className="text-2xl">Club not found</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen text-ink" style={{ background: '#f5f4fb' }}>
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
          Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">

          {/* ── LEFT SIDEBAR ── */}
          <aside className="flex flex-col gap-4">

            {/* Club card */}
            <div className="bg-white rounded-2xl border border-border p-6 flex flex-col items-center text-center">
              <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${club.gradient || 'from-slate-100 to-blue-100'} flex items-center justify-center text-4xl mb-3 shadow-brand`}>
                {club.emoji || '📷'}
              </div>
              <div className="w-5 h-5 rounded-full bg-green-400 border-2 border-white -mt-3 mb-2 self-end mr-4" />
              <h1 className="font-bold text-lg text-ink leading-tight mb-1">{club.name}</h1>
              <p className="text-xs text-muted mb-4">{club.status || 'Active Club'}</p>
              <button
                onClick={handleFollow}
                className="w-full py-2.5 rounded-full text-sm font-semibold border-none cursor-pointer transition-all mb-3"
                style={{ background: followed ? '#10b981' : '#5b3ff8', color: 'white' }}>
                {followed ? '✓ Following' : 'Follow Club'}
              </button>
              <button onClick={handleSave}
                className={`w-9 h-9 rounded-full border border-border bg-surface flex items-center justify-center cursor-pointer hover:border-brand hover:bg-brand-lt transition-all ${saved ? 'bg-brand-lt border-brand' : ''}`}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                    stroke={saved ? '#5b3ff8' : '#6b6880'}
                    fill={saved ? '#5b3ff8' : 'none'}
                    strokeWidth="2"/>
                </svg>
              </button>
            </div>

            {/* Information */}
            <div className="bg-white rounded-2xl border border-border p-5">
              <h3 className="text-[10px] font-bold text-muted uppercase tracking-widest mb-4">Information</h3>
              <div className="flex flex-col gap-3">
                {[
                  { icon:'📅', label:'Founding Date',    value: club.createdAt ? new Date(club.createdAt).toLocaleDateString() : 'N/A' },
                  { icon:'👥', label:'Community Size',   value: `${club.members || 0} Active Members` },
                  { icon:'🏫', label:'Affiliation',      value: club.affiliation || 'University Club' },
                ].map(row => (
                  <div key={row.label} className="flex items-start gap-2.5">
                    <span className="text-base mt-0.5">{row.icon}</span>
                    <div>
                      <p className="text-[10px] text-muted font-medium">{row.label}</p>
                      <p className="text-xs text-ink font-medium mt-0.5">{row.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Links */}
            <div className="bg-white rounded-2xl border border-border p-5">
              <h3 className="text-[10px] font-bold text-muted uppercase tracking-widest mb-3">Links</h3>
              <div className="flex gap-2">
                {[
                  { icon:'f', bg:'bg-blue-600' },
                  { icon:'ig', bg:'bg-pink-600' },
                  { icon:'🌐', bg:'bg-brand' },
                  { icon:'✉', bg:'bg-gray-700' },
                ].map((l, i) => (
                  <button key={i} onClick={() => showToast('Opening link...')}
                    className={`w-9 h-9 rounded-full ${l.bg} text-white text-xs font-bold flex items-center justify-center cursor-pointer border-none hover:opacity-80 transition-opacity`}>
                    {l.icon}
                  </button>
                ))}
              </div>
            </div>

            {/* About */}
            <div className="bg-white rounded-2xl border border-border p-5">
              <h3 className="text-[10px] font-bold text-muted uppercase tracking-widest mb-3">About</h3>
              <p className="text-xs text-muted leading-relaxed">{club.description || 'No description available'}</p>
            </div>

            {/* Interests */}
            <div className="bg-white rounded-2xl border border-border p-5">
              <h3 className="text-[10px] font-bold text-muted uppercase tracking-widest mb-3">Interests</h3>
              <div className="flex flex-wrap gap-1.5">
                {(club.tags || club.interests || []).map((tag, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-full bg-brand-lt text-brand text-xs font-medium">{tag}</span>
                ))}
              </div>
            </div>
          </aside>

          {/* ── MAIN CONTENT ── */}
          <div className="flex flex-col gap-6">

            {/* Upcoming Events */}
            <div className="bg-white rounded-2xl border border-border p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-bold text-lg text-ink">Upcoming Events</h2>
                <a href="/search" className="text-xs font-semibold text-brand no-underline hover:underline">View All Events</a>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(club.upcomingEvents || []).slice(0, 4).map(ev => (
                  <Link key={ev._id || ev.id} to={`/event/${ev._id || ev.id}`}
                    className="rounded-2xl border border-border overflow-hidden no-underline text-ink hover:shadow-brand transition-all hover:-translate-y-0.5 block">
                    <div className={`h-40 bg-gradient-to-br ${ev.gradient || 'from-brand-lt to-violet-200'} flex items-center justify-center text-5xl relative`}>
                      {ev.emoji || '📅'}
                      <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold text-white ${ev.tagColor || 'bg-brand'}`}>{ev.tag || ev.category || 'Event'}</span>
                      <button onClick={e => { e.preventDefault(); showToast('Saved!') }}
                        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 border-none cursor-pointer flex items-center justify-center shadow-sm hover:scale-110 transition-transform">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" stroke="#6b6880" strokeWidth="2"/></svg>
                      </button>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-sm text-ink mb-2">{ev.title}</h3>
                      <div className="text-xs text-muted flex items-center gap-1 mb-1">📅 {ev.date || 'TBD'}</div>
                      <div className="text-xs text-muted flex items-center gap-1 mb-3">📍 {ev.location || 'TBD'}</div>
                      <button onClick={e => { e.preventDefault(); handleRegister(ev._id || ev.id) }}
                        disabled={registered[ev._id || ev.id]}
                        className="w-full py-2 rounded-full text-xs font-semibold border-none cursor-pointer transition-colors"
                        style={{ background: registered[ev._id || ev.id] ? '#10b981' : '#5b3ff8', color:'white' }}>
                        {registered[ev._id || ev.id] ? '✅ Registered!' : 'Register Now'}
                      </button>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Photo Gallery */}
            <div className="bg-white rounded-2xl border border-border p-6">
              <h2 className="font-bold text-lg text-ink mb-5">Photo Gallery</h2>
              <div className="grid grid-cols-3 gap-2">
                {['from-amber-100 to-orange-200','from-slate-100 to-blue-200','from-pink-100 to-rose-200',
                  'from-violet-100 to-purple-200','from-teal-100 to-cyan-200','from-green-100 to-emerald-200'].map((g, i) => (
                  <div key={i} className={`aspect-square rounded-xl bg-gradient-to-br ${g} flex items-center justify-center text-3xl cursor-pointer hover:opacity-90 transition-opacity hover:scale-[1.02]`}>
                    {['🌅','📷','💃','🌿','🌊','🎭'][i]}
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="bg-white rounded-2xl border border-border p-8 text-center">
              <h3 className="font-bold text-lg text-brand mb-2">Interested in joining?</h3>
              <p className="text-sm text-muted mb-5 max-w-sm mx-auto leading-relaxed">
                Join our community to get instant notifications about new workshops, photo walks, and gear reviews. Membership is open to all university students.
              </p>
              <button
                onClick={handleFollow}
                className="px-8 py-3 rounded-full bg-brand text-white font-semibold text-sm border-none cursor-pointer hover:bg-brand-dk transition-colors hover:-translate-y-0.5">
                {followed ? 'Following' : 'Apply for Membership'}
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}