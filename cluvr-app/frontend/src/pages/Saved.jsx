import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import { useAuth } from '../contexts/AuthContext'
import { favoritesAPI, userActionsAPI } from '../services/api'

export default function Saved() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const [tab, setTab] = useState('event')
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)
  const [removedIds, setRemovedIds] = useState(new Set())
  const [registered, setRegistered] = useState({})
  const [toast, setToast] = useState('')

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 2500)
  }

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    loadFavorites()
  }, [isAuthenticated, tab, navigate])

  const loadFavorites = async () => {
    try {
      setLoading(true)
      const data = await favoritesAPI.getAll({ type: tab === 'event' ? 'event' : 'club' })
      setFavorites(data.data || [])
    } catch (error) {
      console.error('Failed to load favorites:', error)
      showToast('Failed to load saved items')
    } finally {
      setLoading(false)
    }
  }

  // Scroll reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') }),
      { threshold: 0.1 }
    )
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  const removeItem = async (id) => {
    try {
      await favoritesAPI.remove(id)
      setRemovedIds(prev => new Set([...prev, id]))
      showToast('Removed from saved')
      loadFavorites()
    } catch (error) {
      console.error('Failed to remove favorite:', error)
      showToast('Failed to remove item')
    }
  }

  const handleRegister = async (id) => {
    try {
      await userActionsAPI.joinEvent(id)
      setRegistered(prev => ({ ...prev, [id]: true }))
      showToast('✅ Registered!')
    } catch (error) {
      console.error('Failed to register:', error)
      showToast('Failed to register')
    }
  }

  const clearAll = async () => {
    if (window.confirm('Remove all saved items?')) {
      try {
        for (const fav of favorites) {
          await favoritesAPI.remove(fav._id)
        }
        setRemovedIds(new Set(favorites.map(f => f._id)))
        showToast('All items removed')
        loadFavorites()
      } catch (error) {
        console.error('Failed to clear favorites:', error)
        showToast('Failed to clear items')
      }
    }
  }

  const visibleItems = favorites.filter(f => !removedIds.has(f._id))

  if (loading) {
    return (
      <div className="bg-[#f5f5fb] text-ink min-h-screen flex items-center justify-center">
        <div className="text-2xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="bg-[#f5f5fb] text-ink min-h-screen">
      {/* Toast */}
      <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 bg-ink text-white px-5 py-2.5 rounded-xl text-sm font-medium z-50 transition-all duration-300 whitespace-nowrap
        ${toast ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
        {toast}
      </div>

      <Header />

      <main className="max-w-5xl mx-auto px-6 py-10">
        {/* Title + toggle */}
        <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-ink">Saved</h1>
            <p className="text-muted text-sm mt-1">Your curated collection of campus experiences.</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setTab('event')}
              className={`saved-toggle-btn inline-flex items-center gap-2 px-5 py-2 rounded-full border-2 text-sm font-medium transition-all cursor-pointer
                ${tab === 'event' ? 'active' : 'border-border text-muted bg-white'}`}>
              📅 Events
            </button>
            <button onClick={() => setTab('club')}
              className={`saved-toggle-btn inline-flex items-center gap-2 px-5 py-2 rounded-full border-2 text-sm font-medium transition-all cursor-pointer
                ${tab === 'club' ? 'active' : 'border-border text-muted bg-white'}`}>
              🤍 Clubs
            </button>
          </div>
        </div>

        {/* Count + clear */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-muted">
            Showing <strong className="text-ink">{visibleItems.length}</strong> saved {tab}s
          </p>
          {visibleItems.length > 0 && (
            <button onClick={clearAll} className="text-xs font-semibold text-brand hover:text-brand-dk transition-colors cursor-pointer bg-none border-none">
              Clear all
            </button>
          )}
        </div>

        {visibleItems.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🔖</div>
            <h3 className="font-semibold text-ink mb-1">Nothing saved yet</h3>
            <p className="text-sm text-muted">Start exploring and save events you're interested in!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {visibleItems.map((fav, i) => {
              const item = fav.itemId
              if (!item) return null
              
              return (
                <div key={fav._id} className="event-card bg-white rounded-2xl overflow-hidden border border-border reveal"
                style={{ 
                  transitionDelay: `${i * 0.08}s`,
                  animation: `fadeUp 0.5s ${i * 0.08}s ease both`
                }}>
                  <div className="relative h-44 overflow-hidden">
                    <div className={`w-full h-full bg-gradient-to-br ${item.gradient || 'from-brand-lt to-violet-200'} flex items-center justify-center text-6xl select-none`}>
                      {item.emoji || '📌'}
                    </div>
                    <button onClick={() => removeItem(fav._id)}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 border-none cursor-pointer flex items-center justify-center shadow-sm hover:scale-110 transition-transform">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" stroke="#5b3ff8" strokeWidth="2" fill="#5b3ff8"/>
                      </svg>
                    </button>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-base text-ink mb-1">{item.title || item.name}</h3>
                    {tab === 'event' ? (
                      <>
                        <p className="text-xs font-semibold text-brand mb-2">{item.clubId?.name || 'Unknown Club'}</p>
                        <div className="flex items-center gap-1.5 text-xs text-muted mt-2 mb-1">📅 {item.date || 'TBD'}</div>
                        <div className="flex items-center gap-1.5 text-xs text-muted mb-4">📍 {item.location || 'TBD'}</div>
                        <button
                          onClick={() => !registered[item._id] && handleRegister(item._id)}
                          disabled={registered[item._id]}
                          className="w-full py-2.5 rounded-full text-white text-sm font-semibold cursor-pointer border-none transition-colors"
                          style={{ background: registered[item._id] ? '#10b981' : '#5b3ff8' }}>
                          {registered[item._id] ? '✅ Registered!' : 'Register'}
                        </button>
                      </>
                    ) : (
                      <>
                        <p className="text-xs text-muted mt-2 mb-3">{item.members ? `${item.members} active members` : 'Active Club'}</p>
                        <button className="w-full py-2.5 rounded-full bg-brand text-white text-sm font-semibold cursor-pointer border-none hover:bg-brand-dk transition-colors">
                          Following
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}