import { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import DiscoverCard from '../components/ui/DiscoverCard'
import { useAuth } from '../contexts/AuthContext'
import { authAPI, clubsAPI, eventsAPI, favoritesAPI, userActionsAPI } from '../services/api'
import { combineClubEventCards } from '../utils/cardMappers'

function toId(item) {
  return typeof item === 'object' && item?._id ? item._id : item
}

const CATEGORIES = [
  { val: 'professional', label: 'Professional' },
  { val: 'arts', label: 'Arts' },
  { val: 'sports', label: 'Sports & Health' },
  { val: 'community', label: 'Community' },
  { val: 'dance', label: 'Dance' },
  { val: 'technology', label: 'Technology' },
]

export default function Search() {
  const navigate = useNavigate()
  const { isAuthenticated, user, refreshUser } = useAuth()
  const [cards, setCards] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterType, setFilterType] = useState('all')
  const [activeCats, setActiveCats] = useState(new Set())
  const [searchQ, setSearchQ] = useState('')
  const [aiNote, setAiNote] = useState('')
  const [searching, setSearching] = useState(false)
  const [savedBookmarks, setSavedBookmarks] = useState({})
  const [followed, setFollowed] = useState({})
  const [registered, setRegistered] = useState({})
  const [toast, setToast] = useState('')
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)
  const [mobileCats, setMobileCats] = useState(new Set())
  const isFirstLoad = useRef(true)

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 2500)
  }

  const loadData = useCallback(async (query) => {
    try {
      if (isFirstLoad.current) {
        setLoading(true)
        isFirstLoad.current = false
      } else {
        setSearching(true)
      }
      const searchParams = query ? { search: query, aiSearch: query.length >= 2 } : {}
      const [clubsRes, eventsRes] = await Promise.all([
        clubsAPI.getAll(searchParams),
        eventsAPI.getAll(searchParams),
      ])
      setCards(combineClubEventCards(clubsRes.data || [], eventsRes.data || []))
      if (query) {
        const mode = clubsRes.aiSearch || eventsRes.aiSearch
        setAiNote(mode === true ? 'AI semantic search' : mode === 'keyword' ? 'Keyword smart search' : 'Search results')
      } else {
        setAiNote('')
      }
    } catch (error) {
      console.error('Failed to load data:', error)
      showToast('Failed to load data')
    } finally {
      setLoading(false)
      setSearching(false)
    }
  }, [])

  useEffect(() => {
    if (!user) {
      setFollowed({})
      setRegistered({})
      setSavedBookmarks({})
      return
    }
    const clubSaved = Object.fromEntries((user.savedClubs || []).map(c => [toId(c), true]))
    const following = Object.fromEntries((user.following || []).map(c => [toId(c), true]))
    const joined = Object.fromEntries((user.joinedEvents || []).map(e => [toId(e), true]))
    setSavedBookmarks(clubSaved)
    setFollowed(following)
    setRegistered(joined)
    favoritesAPI.getAll().then((favs) => {
      const eventSaved = {}
      for (const f of favs.data || []) {
        if (f.itemType === 'event') eventSaved[toId(f.itemId)] = true
      }
      setSavedBookmarks(prev => ({ ...prev, ...eventSaved }))
    }).catch(() => {})
  }, [user])

  useEffect(() => {
    const timer = setTimeout(() => {
      loadData(searchQ.trim())
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQ, loadData])

  const handleSave = async (card, e) => {
    e?.stopPropagation()
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    try {
      if (card.type === 'club') {
        const res = await userActionsAPI.saveClub(card.id)
        setSavedBookmarks(prev => ({ ...prev, [card.id]: res.saved }))
      } else if (savedBookmarks[card.id]) {
        const favs = await favoritesAPI.getAll({ type: 'event' })
        const fav = (favs.data || []).find(f => toId(f.itemId) === card.id)
        if (fav) await favoritesAPI.remove(fav._id)
        setSavedBookmarks(prev => ({ ...prev, [card.id]: false }))
      } else {
        await favoritesAPI.add({ itemType: 'event', itemId: card.id })
        setSavedBookmarks(prev => ({ ...prev, [card.id]: true }))
      }
      await refreshUser()
    } catch (error) {
      console.error('Failed to save:', error)
    }
  }

  const handleAction = async (card) => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    if (card.type === 'club') {
      if (followed[card.id]) return
      await authAPI.followClub(card.id)
      setFollowed(prev => ({ ...prev, [card.id]: true }))
    } else {
      if (registered[card.id]) return
      await userActionsAPI.joinEvent(card.id)
      setRegistered(prev => ({ ...prev, [card.id]: true }))
    }
    await refreshUser()
  }

  const matchesCategory = (card) => {
    if (activeCats.size === 0) return true
    const label = (card.catLabel || '').toLowerCase()
    return [...activeCats].some(cat => label.includes(cat) || cat.includes(label.split(' ')[0]))
  }

  const filteredCards = cards.filter(card => {
    if (filterType !== 'all' && card.type !== filterType) return false
    if (!matchesCategory(card)) return false
    return true
  })

  if (loading && cards.length === 0) {
    return (
      <div className="min-h-screen text-ink flex items-center justify-center bg-page">
        <div className="text-2xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-page text-ink">
      <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 bg-ink text-white px-5 py-2.5 rounded-xl text-sm font-medium z-50 transition-all duration-300 whitespace-nowrap
        ${toast ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
        {toast}
      </div>

      {mobileFilterOpen && (
        <div className="fixed inset-0 z-80 bg-ink/40 backdrop-blur-sm" onClick={() => setMobileFilterOpen(false)}>
          <div className="absolute bottom-0 left-0 right-0 bg-card rounded-t-3xl p-6 border-t border-border" onClick={e => e.stopPropagation()}>
            <h3 className="font-semibold text-ink mb-5">Filter by Category</h3>
            <div className="grid grid-cols-2 gap-3 mb-5">
              {CATEGORIES.map(c => (
                <label key={c.val} className="flex items-center gap-2 cursor-pointer text-sm text-ink border border-border rounded-xl px-3 py-2">
                  <input type="checkbox" checked={mobileCats.has(c.val)}
                    onChange={e => {
                      const next = new Set(mobileCats)
                      e.target.checked ? next.add(c.val) : next.delete(c.val)
                      setMobileCats(next)
                    }}
                    className="w-3.5 h-3.5" style={{ accentColor: '#5b3ff8' }} />
                  {c.label}
                </label>
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={() => setMobileCats(new Set())} className="flex-1 py-2.5 rounded-xl border border-border text-sm">Clear</button>
              <button onClick={() => { setActiveCats(new Set(mobileCats)); setMobileFilterOpen(false) }}
                className="flex-1 py-2.5 rounded-xl bg-brand text-white text-sm border-none">Apply</button>
            </div>
          </div>
        </div>
      )}

      <Header />

      <div className="max-w-7xl mx-auto flex gap-0 min-h-screen">
        <aside className="hidden lg:flex flex-col w-60 shrink-0 px-5 py-8 border-r border-border bg-card">
          <h3 className="text-xs font-bold text-muted uppercase tracking-widest mb-4">Category</h3>
          <div className="flex flex-col gap-2.5">
            {CATEGORIES.map(c => (
              <label key={c.val} className="flex items-center gap-2.5 cursor-pointer text-sm text-ink hover:text-brand">
                <input type="checkbox" checked={activeCats.has(c.val)}
                  onChange={e => {
                    const next = new Set(activeCats)
                    e.target.checked ? next.add(c.val) : next.delete(c.val)
                    setActiveCats(next)
                  }}
                  className="w-4 h-4" style={{ accentColor: '#5b3ff8' }} />
                {c.label}
              </label>
            ))}
          </div>
          <button onClick={() => setActiveCats(new Set())}
            className="mt-5 w-full py-2.5 rounded-full border border-border text-sm text-muted bg-transparent cursor-pointer">
            Clear All
          </button>
        </aside>

        <main className="flex-1 px-5 py-7">
          <div className="flex items-start justify-between mb-4 flex-wrap gap-3">
            <div>
              <h1 className="text-xl font-bold text-ink">Search</h1>
              <p className="text-muted text-sm mt-0.5">{aiNote || 'Discover clubs and events across campus'}</p>
            </div>
            <span className="text-xs font-semibold text-brand bg-brand-lt px-3 py-1.5 rounded-full">
              {filteredCards.length} Result{filteredCards.length !== 1 ? 's' : ''}
            </span>
          </div>

          <div className="relative mb-4">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input
              type="text"
              value={searchQ}
              onChange={e => setSearchQ(e.target.value)}
              placeholder='Try "code", "hackathon", "music"...'
              className="w-full pl-10 pr-10 py-3 rounded-2xl border-2 border-border bg-card text-sm text-ink placeholder-muted focus:outline-none focus:border-brand"
            />
            {searching && (
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-muted">...</span>
            )}
          </div>

          <div className="flex gap-2 mb-6">
            {[{ val: 'all', label: 'All' }, { val: 'event', label: 'Events' }, { val: 'club', label: 'Clubs' }].map(f => (
              <button
                key={f.val}
                onClick={() => setFilterType(f.val)}
                className={`filter-pill px-4 py-2 rounded-full border-2 text-sm font-medium cursor-pointer transition-all
                  ${filterType === f.val ? 'active' : ''}`}
              >
                {f.label}
              </button>
            ))}
            <button onClick={() => setMobileFilterOpen(true)} className="lg:hidden ml-auto px-3 py-2 rounded-full border border-border text-xs">Filters</button>
          </div>

          {filteredCards.length === 0 ? (
            <div className="py-20 text-center">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="font-semibold text-ink mb-1">No results found</h3>
              <p className="text-sm text-muted">Try different keywords like &quot;code&quot; or &quot;hackum&quot;</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {filteredCards.map((card, i) => (
                <DiscoverCard
                  key={card.id}
                  card={card}
                  index={i}
                  saved={!!savedBookmarks[card.id]}
                  followed={!!followed[card.id]}
                  registered={!!registered[card.id]}
                  onNavigate={(c) => navigate(c.type === 'club' ? `/club/${c.id}` : `/event/${c.id}`)}
                  onSave={handleSave}
                  onAction={handleAction}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  )
}
