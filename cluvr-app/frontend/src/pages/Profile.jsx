import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import { useAuth } from '../contexts/AuthContext'
import { toId, splitEventsByDate, getClubName } from '../utils/helpers'
import ItemImage from '../components/ui/ItemImage'

function EventGrid({ events, emptyLabel, onSelect }) {
  if (events.length === 0) {
    return <p className="text-sm text-muted text-center py-8">{emptyLabel}</p>
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {events.map(event => (
        <div
          key={toId(event)}
          onClick={() => onSelect(toId(event))}
          className="event-card border border-border rounded-2xl overflow-hidden cursor-pointer bg-card dark:bg-card"
        >
          <div className="h-24 relative overflow-hidden">
            <ItemImage item={event} className="w-full h-full object-cover" gradient={event.gradient || 'from-brand-lt to-violet-200'} />
            <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-brand text-white text-[9px] font-bold uppercase tracking-wide">
              {event.category || 'Event'}
            </span>
          </div>
          <div className="p-3.5">
            <h4 className="font-semibold text-sm text-ink mb-0.5">{event.title}</h4>
            <p className="text-xs text-brand font-medium mb-2">{getClubName(event)}</p>
            <div className="text-xs text-muted mb-0.5 flex items-center gap-1">📅 {event.date || 'TBD'}</div>
            <div className="text-xs text-muted flex items-center gap-1">📍 {event.location || 'TBD'}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function Profile() {
  const navigate = useNavigate()
  const { user, isAuthenticated, updateProfile: updateUserProfile } = useAuth()
  const [tab, setTab] = useState('registered')
  const [editOpen, setEditOpen] = useState(false)
  const [editForm, setEditForm] = useState({})
  const [toast, setToast] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    if (user) {
      setEditForm({
        name: user.name || '',
        university: user.university || '',
        email: user.email || '',
        major: user.major || '',
        bio: user.bio || '',
      })
    }
  }, [isAuthenticated, user, navigate])

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 2800)
  }

  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'ST'

  const saveProfile = async () => {
    if (!editForm.name.trim()) { showToast('Name cannot be empty'); return }
    try {
      setLoading(true)
      await updateUserProfile(editForm)
      setEditOpen(false)
      showToast('✓ Profile updated successfully!')
    } catch (error) {
      console.error('Failed to update profile:', error)
      showToast('Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const joinedEvents = user?.joinedEvents || []
  const { upcoming, past } = splitEventsByDate(joinedEvents)
  const followedClubs = user?.following?.length ? user.following : (user?.savedClubs || [])

  if (!user) {
    return (
      <div className="text-ink min-h-screen flex items-center justify-center bg-page">
        <div className="text-2xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="text-ink min-h-screen bg-page">
      <div className={`fixed bottom-6 right-6 bg-ink text-white px-5 py-3 rounded-xl text-sm font-medium z-50 transition-all duration-300
        ${toast ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20 pointer-events-none'}`}>
        {toast}
      </div>

      {editOpen && (
        <div className="fixed inset-0 bg-ink/50 backdrop-blur z-50 flex items-center justify-center" onClick={() => setEditOpen(false)}>
          <div className="bg-card dark:bg-card rounded-3xl p-7 w-[90%] max-w-md max-h-[85vh] overflow-y-auto border border-border" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-ink">Edit Profile</h2>
              <button onClick={() => setEditOpen(false)}
                className="w-8 h-8 rounded-full bg-surface flex items-center justify-center text-muted border-none cursor-pointer text-lg">×</button>
            </div>
            <div className="flex flex-col gap-4">
              {[
                { label:'Full Name', key:'name', type:'text' },
                { label:'University', key:'university', type:'text' },
                { label:'Email', key:'email', type:'email', disabled: true },
                { label:'Major', key:'major', type:'text' },
              ].map(f => (
                <div key={f.key}>
                  <label className="text-xs font-semibold text-muted uppercase tracking-wider block mb-1.5">{f.label}</label>
                  <input type={f.type} value={editForm[f.key] || ''}
                    onChange={e => setEditForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                    disabled={f.disabled}
                    className="w-full border border-border rounded-xl px-3.5 py-2.5 text-sm bg-surface text-ink focus:outline-none focus:border-brand transition-colors" />
                </div>
              ))}
              <div className="flex gap-3 mt-2">
                <button onClick={() => setEditOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-border text-sm font-medium text-muted cursor-pointer bg-card">Cancel</button>
                <button onClick={saveProfile} disabled={loading}
                  className="flex-1 py-2.5 rounded-xl bg-brand text-white text-sm font-medium cursor-pointer border-none disabled:opacity-50">
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Header />

      <main className="max-w-5xl mx-auto px-4 py-6">
        <div className="bg-card dark:bg-card rounded-3xl overflow-hidden border border-border shadow-soft mb-5">
          <div className="profile-banner relative" style={{ minHeight: 200, padding: '28px 28px 24px' }}>
            <button onClick={() => { setEditForm({ name: user.name, university: user.university, email: user.email, major: user.major, bio: user.bio }); setEditOpen(true) }}
              className="absolute top-4 right-4 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-white text-xs font-semibold border border-white/30 cursor-pointer z-10"
              style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)' }}>
              Edit Profile
            </button>

            <div className="relative z-10 flex items-center gap-5 mt-2">
              <div className="w-20 h-20 flex items-center justify-center text-white font-bold text-2xl rounded-[19px]"
                style={{ background:'linear-gradient(135deg,rgba(255,255,255,0.25),rgba(255,255,255,0.1))', border:'1.5px solid rgba(255,255,255,0.3)' }}>
                {initials}
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-white">{user.name}</h1>
                <p className="text-sm text-white/75">{user.university}</p>
              </div>
            </div>

            <div className="relative z-10 flex gap-5 mt-6">
              <div><p className="text-xl font-bold text-white">{upcoming.length}</p><p className="text-xs text-white/60">Upcoming</p></div>
              <div style={{ width:1, background:'rgba(255,255,255,0.2)' }} />
              <div><p className="text-xl font-bold text-white">{followedClubs.length}</p><p className="text-xs text-white/60">Clubs</p></div>
            </div>
          </div>

          <div className="px-6 pb-6 pt-5">
            <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6">
              <div>
                <h4 className="text-xs font-bold text-muted uppercase tracking-wider mb-2">About</h4>
                <p className="text-sm text-muted leading-relaxed mb-5">{user.bio || 'No bio yet'}</p>

                <div className="mb-5">
                  <div className="flex items-center justify-between mb-2.5">
                    <h4 className="text-xs font-bold text-muted uppercase tracking-wider">Clubs</h4>
                    <button onClick={() => navigate('/search')} className="text-xs font-semibold text-brand bg-transparent border-none cursor-pointer">Explore</button>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {followedClubs.slice(0, 4).map((club) => (
                      <button
                        key={toId(club)}
                        type="button"
                        title={club.name}
                        onClick={() => navigate(`/club/${toId(club)}`)}
                        className="w-9 h-9 rounded-xl overflow-hidden cursor-pointer hover:scale-105 transition-transform border-none p-0"
                      >
                        <ItemImage item={club} className="w-full h-full object-cover" gradient={club.gradient || 'from-brand-lt to-violet-200'} />
                      </button>
                    ))}
                    <button onClick={() => navigate('/search')}
                      className="w-9 h-9 rounded-xl border-2 border-dashed border-border flex items-center justify-center text-muted cursor-pointer bg-transparent text-lg">+</button>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-muted uppercase tracking-wider mb-2">Interests</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {(user.interests || []).map((tag, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-full bg-brand-lt dark:bg-brand-dk/30 text-brand text-xs font-medium">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <div className="flex gap-0 border-b border-border mb-5">
                  <button onClick={() => setTab('registered')}
                    className={`tab-btn px-4 py-2.5 text-sm font-medium cursor-pointer bg-transparent border-none ${tab === 'registered' ? 'active' : ''}`}>
                    Registered Events
                  </button>
                </div>

                {tab === 'registered' && (
                  <div className="flex flex-col gap-8">
                    <div>
                      <h3 className="font-semibold text-ink text-sm mb-4">
                        Upcoming <span className="ml-1 px-2 py-0.5 rounded-full bg-brand text-white text-xs">{upcoming.length}</span>
                      </h3>
                      <EventGrid events={upcoming} emptyLabel="No upcoming registered events" onSelect={(eventId) => navigate(`/event/${eventId}`)} />
                    </div>
                    {past.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-ink text-sm mb-4">
                          Past Events <span className="ml-1 px-2 py-0.5 rounded-full bg-muted text-white text-xs">{past.length}</span>
                        </h3>
                        <EventGrid events={past} emptyLabel="No past events" onSelect={(eventId) => navigate(`/event/${eventId}`)} />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
