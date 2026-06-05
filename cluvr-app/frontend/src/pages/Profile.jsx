import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import { useAuth } from '../contexts/AuthContext'
import { authAPI, userActionsAPI } from '../services/api'

export default function Profile() {
  const navigate = useNavigate()
  const { user, isAuthenticated, updateProfile: updateUserProfile } = useAuth()
  const [tab, setTab] = useState('registered')
  const [editOpen, setEditOpen] = useState(false)
  const [editForm, setEditForm] = useState({})
  const [cancelledIds, setCancelledIds] = useState(new Set())
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

  const cancelEvent = async (id, title) => {
    if (window.confirm(`Cancel registration for "${title}"?`)) {
      try {
        await userActionsAPI.joinEvent(id)
        setCancelledIds(prev => new Set([...prev, id]))
        showToast(`Registration cancelled for ${title}`)
      } catch (error) {
        console.error('Failed to cancel registration:', error)
        showToast('Failed to cancel registration')
      }
    }
  }

  const visibleEvents = (user?.joinedEvents || []).filter(e => !cancelledIds.has(e._id))

  if (!user) {
    return (
      <div className="text-ink min-h-screen flex items-center justify-center" style={{ background: '#f5f4fb' }}>
        <div className="text-2xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="text-ink min-h-screen" style={{ background: '#f5f4fb' }}>
      {/* Toast */}
      <div className={`fixed bottom-6 right-6 bg-ink text-white px-5 py-3 rounded-xl text-sm font-medium z-50 transition-all duration-300
        ${toast ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20 pointer-events-none'}`}>
        {toast}
      </div>

      {/* Edit Modal */}
      {editOpen && (
        <div className="fixed inset-0 bg-ink/50 backdrop-blur z-50 flex items-center justify-center" onClick={() => setEditOpen(false)}>
          <div className="bg-white rounded-3xl p-7 w-[90%] max-w-md max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-ink">Edit Profile</h2>
              <button onClick={() => setEditOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 border-none cursor-pointer text-lg hover:bg-gray-200 transition-colors">×</button>
            </div>
            <div className="flex flex-col gap-4">
              {[
                { label:'Full Name',   key:'name',       type:'text' },
                { label:'University',  key:'university', type:'text' },
                { label:'Email',       key:'email',      type:'email', disabled: true },
                { label:'Major',       key:'major',      type:'text' },
              ].map(f => (
                <div key={f.key}>
                  <label className="text-xs font-semibold text-muted uppercase tracking-wider block mb-1.5">{f.label}</label>
                  <input type={f.type} value={editForm[f.key] || ''}
                    onChange={e => setEditForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                    disabled={f.disabled}
                    className={`w-full border border-border rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-brand transition-colors ${f.disabled ? 'bg-gray-100' : 'bg-gray-50 focus:bg-white'}`} />
                </div>
              ))}
              <div>
                <label className="text-xs font-semibold text-muted uppercase tracking-wider block mb-1.5">Bio</label>
                <textarea rows={3} value={editForm.bio || ''}
                  onChange={e => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                  className="w-full border border-border rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-brand transition-colors bg-gray-50 focus:bg-white resize-none" />
              </div>
              <div className="flex gap-3 mt-2">
                <button onClick={() => setEditOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-border text-sm font-medium text-muted hover:bg-gray-50 transition-colors cursor-pointer bg-white">Cancel</button>
                <button onClick={saveProfile} disabled={loading}
                  className="flex-1 py-2.5 rounded-xl bg-brand text-white text-sm font-medium hover:bg-brand-dk transition-colors cursor-pointer border-none disabled:opacity-50">
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Header />

      <main className="max-w-5xl mx-auto px-4 py-6">
        <div className="bg-white rounded-3xl overflow-hidden border border-border shadow-soft mb-5">

          {/* Banner */}
          <div className="profile-banner relative" style={{ minHeight: 200, padding: '28px 28px 24px' }}>
            <div className="absolute top-4 left-6 w-24 h-24 rounded-full bg-white/5" style={{ filter:'blur(28px)' }} />
            <div className="absolute bottom-2 left-1/3 w-40 h-40 rounded-full bg-purple-300/10" style={{ filter:'blur(36px)' }} />
            <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-pink-400/10" style={{ filter:'blur(40px)' }} />

            <button onClick={() => { setEditForm({ name: user.name, university: user.university, email: user.email, major: user.major, bio: user.bio }); setEditOpen(true) }}
              className="absolute top-4 right-4 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-white text-xs font-semibold border border-white/30 cursor-pointer hover:bg-white/30 transition-all z-10"
              style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              Edit Profile
            </button>

            <div className="relative z-10 flex items-center gap-5 mt-2">
              <div style={{ background:'linear-gradient(135deg,rgba(255,255,255,0.35),rgba(255,255,255,0.1))', padding:3, borderRadius:22, backdropFilter:'blur(4px)' }}>
                <div className="w-20 h-20 flex items-center justify-center text-white font-bold text-2xl"
                  style={{ background:'linear-gradient(135deg,rgba(255,255,255,0.25),rgba(255,255,255,0.1))', borderRadius:19, border:'1.5px solid rgba(255,255,255,0.3)', backdropFilter:'blur(8px)' }}>
                  {initials}
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h1 className="text-2xl font-bold text-white" style={{ textShadow:'0 1px 8px rgba(0,0,0,0.2)' }}>{user.name}</h1>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold"
                    style={{ background:'rgba(134,239,172,0.25)', color:'#d1fae5', border:'1px solid rgba(134,239,172,0.3)' }}>● Active</span>
                </div>
                <p className="text-sm" style={{ color:'rgba(255,255,255,0.75)' }}>{user.university}</p>
              </div>
            </div>

            <div className="relative z-10 flex gap-5 mt-6">
              <div><p className="text-xl font-bold text-white">{visibleEvents.length}</p><p className="text-xs" style={{ color:'rgba(255,255,255,0.6)' }}>Upcoming</p></div>
              <div style={{ width:1, background:'rgba(255,255,255,0.2)' }} />
              <div><p className="text-xl font-bold text-white">{(user.savedClubs || []).length}</p><p className="text-xs" style={{ color:'rgba(255,255,255,0.6)' }}>Clubs</p></div>
            </div>
          </div>

          <div className="px-6 pb-6 pt-5">
            <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6">

              {/* Left sidebar */}
              <div>
                <h4 className="text-xs font-bold text-muted uppercase tracking-wider mb-2">About</h4>
                <p className="text-sm text-muted leading-relaxed mb-5">{user.bio || 'No bio yet'}</p>

                <div className="flex flex-col gap-3 mb-5">
                  <div className="flex items-center gap-2.5 text-xs text-muted">
                    <div className="w-7 h-7 rounded-lg bg-brand-lt flex items-center justify-center shrink-0">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#5b3ff8" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                    </div>
                    <span>{user.email}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-muted">
                    <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                    </div>
                    <span className="text-ink font-medium">{user.major}</span>
                  </div>
                </div>

                {/* Clubs */}
                <div className="mb-5">
                  <div className="flex items-center justify-between mb-2.5">
                    <h4 className="text-xs font-bold text-muted uppercase tracking-wider">Clubs</h4>
                    <a href="/search" className="text-xs font-semibold text-brand no-underline hover:underline">Explore</a>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {(user.savedClubs || []).slice(0, 4).map((club, idx) => (
                      <div key={club._id || idx} title={club.name}
                        className="w-9 h-9 rounded-xl bg-brand-lt flex items-center justify-center text-sm font-bold text-brand cursor-pointer hover:scale-105 transition-transform">
                        {club.name?.[0] || 'C'}
                      </div>
                    ))}
                    <button onClick={() => navigate('/search')}
                      className="w-9 h-9 rounded-xl border-2 border-dashed border-border flex items-center justify-center text-muted cursor-pointer hover:border-brand hover:text-brand transition-all bg-transparent text-lg">+</button>
                  </div>
                </div>

                {/* Interests */}
                <div>
                  <h4 className="text-xs font-bold text-muted uppercase tracking-wider mb-2">Interests</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {(user.interests || []).map((tag, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-full bg-brand-lt text-brand text-xs font-medium">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right: tabs */}
              <div>
                <div className="flex gap-0 border-b border-border mb-5">
                  {[{ val:'registered', label:'Registered Events' }].map(t => (
                    <button key={t.val} onClick={() => setTab(t.val)}
                      className={`tab-btn px-4 py-2.5 text-sm font-medium cursor-pointer bg-transparent border-none ${tab === t.val ? 'active' : ''}`}>
                      {t.label}
                    </button>
                  ))}
                </div>

                {/* Registered */}
                {tab === 'registered' && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-ink text-sm">
                        Upcoming <span className="ml-1 px-2 py-0.5 rounded-full bg-brand text-white text-xs">{visibleEvents.length}</span>
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {visibleEvents.map(event => (
                        <div key={event._id} className="event-card border border-border rounded-2xl overflow-hidden cursor-pointer">
                          <div className={`h-24 bg-gradient-to-br ${event.gradient || 'from-brand-lt to-violet-200'} flex items-center justify-center text-3xl relative`}>
                            {event.emoji || '📅'}
                            <span className={`absolute top-2 left-2 px-2 py-0.5 rounded-full bg-brand text-white text-[9px] font-bold uppercase tracking-wide`}>{event.category || 'Event'}</span>
                          </div>
                          <div className="p-3.5">
                            <h4 className="font-semibold text-sm text-ink mb-0.5">{event.title}</h4>
                            <p className="text-xs text-brand font-medium mb-2">{event.clubId?.name || 'Unknown Club'}</p>
                            <div className="text-xs text-muted mb-0.5 flex items-center gap-1">📅 {event.date || 'TBD'}</div>
                            <div className="text-xs text-muted mb-3 flex items-center gap-1">📍 {event.location || 'TBD'}</div>
                            <div className="flex gap-2">
                              <button onClick={() => navigate(`/event/${event._id}`)}
                                className="text-xs font-semibold text-brand border border-brand px-3 py-1.5 rounded-full hover:bg-brand-lt transition-colors cursor-pointer bg-transparent">Details</button>
                              <button onClick={() => cancelEvent(event._id, event.title)}
                                className="text-xs font-semibold text-red-500 border border-red-200 px-3 py-1.5 rounded-full hover:bg-red-50 transition-colors cursor-pointer bg-transparent">Cancel</button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
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