import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import { useAuth } from '../contexts/AuthContext'
import { authAPI, eventsAPI, favoritesAPI } from '../services/api'
import { toId } from '../utils/helpers'
import ItemImage from '../components/ui/ItemImage'
import SaveButton from '../components/ui/SaveButton'

export default function Saved() {
  const navigate = useNavigate()
  const { isAuthenticated, user, refreshUser, loading: authLoading } = useAuth()
  const [tab, setTab] = useState('event')
  const [savedItems, setSavedItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState('')

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 2500)
  }

  const loadSavedItems = useCallback(async () => {
    try {
      setLoading(true)
      if (!user) {
        setSavedItems([])
        return
      }

      if (tab === 'club') {
        setSavedItems(user.savedClubs || [])
      } else {
        const favs = await favoritesAPI.getAll({ type: 'event' })
        const items = await Promise.all((favs.data || []).map(async (f) => {
          const item = f.itemId
          if (item && typeof item === 'object' && item.title) return item
          const id = toId(item)
          if (!id) return null
          try {
            const res = await eventsAPI.getById(id)
            return res.data
          } catch {
            return null
          }
        }))
        setSavedItems(items.filter(Boolean))
      }
    } catch (error) {
      console.error('Failed to load saved items:', error)
      showToast('Failed to load saved items')
    } finally {
      setLoading(false)
    }
  }, [user, tab])

  useEffect(() => {
    if (authLoading) return
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    loadSavedItems()
  }, [isAuthenticated, authLoading, navigate, loadSavedItems])

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') }),
      { threshold: 0.1 }
    )
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [savedItems])

  const removeItem = async (item) => {
    try {
      const id = toId(item)
      if (tab === 'club') {
        await authAPI.saveClub(id)
      } else {
        const favs = await favoritesAPI.getAll({ type: 'event' })
        const fav = (favs.data || []).find(f => toId(f.itemId) === id)
        if (fav) await favoritesAPI.remove(fav._id)
      }
      await refreshUser()
      await loadSavedItems()
      showToast('Removed from saved')
    } catch (error) {
      console.error('Failed to remove item:', error)
      showToast('Failed to remove item')
    }
  }

  const goToProfile = (item) => {
    const id = toId(item)
    navigate(tab === 'club' ? `/club/${id}` : `/event/${id}`)
  }

  if (authLoading || loading) {
    return (
      <div className="bg-page text-ink min-h-screen flex items-center justify-center">
        <div className="text-2xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="bg-page text-ink min-h-screen">
      <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 bg-ink text-white px-5 py-2.5 rounded-xl text-sm font-medium z-50 transition-all duration-300 whitespace-nowrap
        ${toast ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
        {toast}
      </div>

      <Header />

      <main className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-ink">Saved</h1>
            <p className="text-muted text-sm mt-1">Your curated collection of campus experiences.</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setTab('event')}
              className={`saved-toggle-btn inline-flex items-center gap-2 px-5 py-2 rounded-full border-2 text-sm font-medium transition-all cursor-pointer
                ${tab === 'event' ? 'active' : 'border-border text-muted bg-card dark:bg-card'}`}>
              📅 Events
            </button>
            <button onClick={() => setTab('club')}
              className={`saved-toggle-btn inline-flex items-center gap-2 px-5 py-2 rounded-full border-2 text-sm font-medium transition-all cursor-pointer
                ${tab === 'club' ? 'active' : 'border-border text-muted bg-card dark:bg-card'}`}>
              🤍 Clubs
            </button>
          </div>
        </div>

        <p className="text-sm text-muted mb-6">
          Showing <strong className="text-ink">{savedItems.length}</strong> saved {tab}s
        </p>

        {savedItems.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🔖</div>
            <h3 className="font-semibold text-ink mb-1">Nothing saved yet</h3>
            <p className="text-sm text-muted">Start exploring and save events you're interested in!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {savedItems.map((item, i) => {
              if (!item) return null
              const id = toId(item)

              return (
                <div
                  key={id}
                  onClick={() => goToProfile(item)}
                  className="event-card bg-card dark:bg-card rounded-2xl overflow-hidden border border-border reveal cursor-pointer"
                  style={{
                    transitionDelay: `${i * 0.08}s`,
                    animation: `fadeUp 0.5s ${i * 0.08}s ease both`
                  }}>
                  <div className="relative h-44 overflow-hidden">
                    <ItemImage item={item} className="w-full h-full object-cover" gradient={item.gradient || 'from-brand-lt to-violet-200'} />
                    <div className="absolute top-3 right-3" onClick={e => e.stopPropagation()}>
                      <SaveButton saved onClick={() => removeItem(item)} size={14} />
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-base text-ink mb-1">{item.title || item.name}</h3>
                    {tab === 'event' ? (
                      <>
                        <p className="text-xs font-semibold text-brand mb-2">{item.clubId?.name || 'Unknown Club'}</p>
                        <div className="text-xs text-muted mt-2 mb-1">📅 {item.date || 'TBD'}</div>
                        <div className="text-xs text-muted">📍 {item.location || 'TBD'}</div>
                      </>
                    ) : (
                      <p className="text-xs text-muted mt-2">{item.members ? `${item.members} active members` : 'Active Club'}</p>
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
