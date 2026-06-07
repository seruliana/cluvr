import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import { clubsAPI, eventsAPI } from '../services/api'

const CATEGORIES = [
  { val:'professional', label:'Professional' },
  { val:'arts',         label:'Arts' },
  { val:'sports',       label:'Sports & Health' },
  { val:'community',    label:'Community' },
  { val:'dance',        label:'Dance' },
  { val:'technology',   label:'Technology' },
]

const POPULAR_TAGS = ['#Hackathon','#Networking','#Tech','#Community']

export default function Search() {
  const navigate = useNavigate()
  const [allItems, setAllItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeType, setActiveType] = useState('all')
  const [activeCats, setActiveCats] = useState(new Set())
  const [searchQ, setSearchQ] = useState('')
  const [sortMode, setSortMode] = useState('date')
  const [savedIds, setSavedIds] = useState(new Set())
  const [registered, setRegistered] = useState({})
  const [toast, setToast] = useState('')
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)
  const [mobileCats, setMobileCats] = useState(new Set())
  const [useAISearch, setUseAISearch] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const searchParams = searchQ ? { search: searchQ, aiSearch: useAISearch } : {}
      const [clubsRes, eventsRes] = await Promise.all([
        clubsAPI.getAll(searchParams),
        eventsAPI.getAll(searchParams)
      ])

      const clubs = clubsRes.data || []
      const events = eventsRes.data || []

      console.log('AI Search used:', clubsRes.aiSearch || eventsRes.aiSearch)

      // Transform clubs to item format
      const clubItems = clubs.map(club => ({
        id: club._id,
        type: 'club',
        cat: club.category.toLowerCase(),
        title: club.name,
        club: `${club.members} members`,
        date: club.createdAt,
        dateStr: `Founded ${new Date(club.createdAt).getFullYear()}`,
        location: club.location,
        emoji: club.emoji || '🎓',
        gradient: club.gradient || 'from-brand-lt to-violet-200',
        badgeBg: club.category === 'Technology' ? 'bg-blue-600' :
                 club.category === 'Arts' ? 'bg-pink-600' :
                 club.category === 'Sports & Health' ? 'bg-green-600' :
                 club.category === 'Community' ? 'bg-teal-600' : 'bg-brand',
        catLabel: club.category,
      }))

      // Transform events to item format
      const eventItems = events.map(event => ({
        id: event._id,
        type: 'event',
        cat: event.category?.toLowerCase() || 'events',
        title: event.title,
        club: event.clubId?.name || 'Unknown',
        date: event.date,
        dateStr: `${event.date}${event.time ? ` · ${event.time}` : ''}`,
        location: event.location,
        emoji: event.emoji || '📅',
        gradient: event.gradient || 'from-brand-lt to-violet-200',
        badgeBg: event.category === 'Professional' ? 'bg-blue-600' :
                 event.category === 'Arts' ? 'bg-pink-600' :
                 event.category === 'Community' ? 'bg-green-600' :
                 event.category === 'Sports & Health' ? 'bg-green-600' : 'bg-brand',
        catLabel: event.category || 'Events',
      }))

      setAllItems([...eventItems, ...clubItems])
    } catch (error) {
      console.error('Failed to load data:', error)
      showToast('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 2500)
  }

  const toggleSave = (id) => {
    setSavedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) { next.delete(id); showToast('Removed from saved') }
      else { next.add(id); showToast('✓ Event saved!') }
      return next
    })
  }

  const handleRegister = (id, title) => {
    setRegistered(prev => ({ ...prev, [id]: true }))
    showToast(`✓ Registered for ${title}!`)
  }

  const getFiltered = () => {
    let items = allItems.filter(e => activeType === 'all' || e.type === activeType)
    if (activeCats.size > 0) items = items.filter(e => activeCats.has(e.cat))
    if (searchQ) {
      const q = searchQ.toLowerCase()
      items = items.filter(e =>
        e.title.toLowerCase().includes(q) ||
        e.club.toLowerCase().includes(q) ||
        e.catLabel.toLowerCase().includes(q) ||
        e.location.toLowerCase().includes(q)
      )
    }
    if (sortMode === 'name') items.sort((a,b) => a.title.localeCompare(b.title))
    else if (sortMode === 'cat') items.sort((a,b) => a.catLabel.localeCompare(b.catLabel))
    else items.sort((a,b) => a.date.localeCompare(b.date))
    return items
  }

  const filtered = getFiltered()

  if (loading) {
    return (
      <div className="min-h-screen text-ink flex items-center justify-center" style={{ background: '#f5f4fb' }}>
        <div className="text-2xl">Loading...</div>
      </div>
    )
  }

  const applyDesktopFilters = (cats) => {
    setActiveCats(new Set(cats))
    showToast(cats.size > 0 ? `Filtering by ${cats.size} category` : 'All categories shown')
  }

  const resetAll = () => {
    setSearchQ('')
    setActiveCats(new Set())
    setActiveType('all')
    setMobileCats(new Set())
    loadData()
    showToast('Filters reset')
  }

  const handleSearch = (e) => {
    e.preventDefault()
    loadData()
  }

  return (
    <div className="min-h-screen" style={{ background: '#f5f4fb' }}>
      {/* Toast */}
      <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 bg-ink text-white px-5 py-2.5 rounded-xl text-sm font-medium z-50 transition-all duration-300 whitespace-nowrap
        ${toast ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
        {toast}
      </div>

      {/* Mobile Filter Panel */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-80 bg-ink/40 backdrop-blur-sm" onClick={() => setMobileFilterOpen(false)}>
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold text-ink">Filter by Category</h3>
              <button onClick={() => setMobileFilterOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 border-none cursor-pointer text-lg">×</button>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-5">
              {CATEGORIES.map(c => (
                <label key={c.val} className="flex items-center gap-2 cursor-pointer text-sm text-ink border border-border rounded-xl px-3 py-2 hover:border-brand hover:text-brand transition-all">
                  <input type="checkbox" checked={mobileCats.has(c.val)}
                    onChange={e => {
                      const next = new Set(mobileCats)
                      e.target.checked ? next.add(c.val) : next.delete(c.val)
                      setMobileCats(next)
                    }}
                    className="w-3.5 h-3.5 rounded cursor-pointer" style={{ accentColor: '#5b3ff8' }} />
                  {c.label}
                </label>
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={() => setMobileCats(new Set())}
                className="flex-1 py-2.5 rounded-xl border border-border text-sm font-medium text-muted bg-transparent cursor-pointer">Clear</button>
              <button onClick={() => { setActiveCats(new Set(mobileCats)); setMobileFilterOpen(false) }}
                className="flex-1 py-2.5 rounded-xl bg-brand text-white text-sm font-medium border-none cursor-pointer">Apply</button>
            </div>
          </div>
        </div>
      )}

      <Header />

      <div className="max-w-7xl mx-auto flex gap-0 min-h-screen">
        {/* Sidebar */}
        <aside className="hidden lg:flex flex-col w-60 shrink-0 px-5 py-8 border-r border-border bg-white">
          <h3 className="text-xs font-bold text-muted uppercase tracking-widest mb-4">Category</h3>
          <div className="flex flex-col gap-2.5">
            {CATEGORIES.map(c => (
              <label key={c.val} className="flex items-center gap-2.5 cursor-pointer text-sm text-ink hover:text-brand transition-colors">
                <input type="checkbox" checked={activeCats.has(c.val)}
                  onChange={e => {
                    const next = new Set(activeCats)
                    e.target.checked ? next.add(c.val) : next.delete(c.val)
                    setActiveCats(next)
                  }}
                  className="w-4 h-4 rounded cursor-pointer" style={{ accentColor: '#5b3ff8' }} />
                {c.label}
              </label>
            ))}
          </div>
          <div className="flex flex-col gap-2 mt-5">
            <button onClick={() => applyDesktopFilters(activeCats)}
              className="w-full py-2.5 rounded-full bg-brand text-white text-sm font-semibold cursor-pointer border-none hover:bg-brand-dk transition-colors">Apply</button>
            <button onClick={() => { setActiveCats(new Set()) }}
              className="w-full py-2.5 rounded-full border border-border text-sm font-medium text-muted cursor-pointer bg-transparent hover:border-brand hover:text-brand transition-all">Clear All</button>
          </div>
          <div className="mt-8">
            <h3 className="text-xs font-bold text-muted uppercase tracking-widest mb-3">Popular</h3>
            <div className="flex flex-wrap gap-2">
              {POPULAR_TAGS.map(tag => (
                <button key={tag} onClick={() => setSearchQ(tag.replace('#',''))}
                  className="px-3 py-1 rounded-full bg-surface border border-border text-xs text-ink hover:bg-brand-lt hover:border-brand hover:text-brand transition-all cursor-pointer">
                  {tag}
                </button>
              ))}
            </div>
          </div>
          {(activeCats.size > 0 || searchQ) && (
            <div className="mt-6 px-3 py-2 rounded-xl bg-brand-lt border border-brand/20">
              <p className="text-xs text-brand font-medium">
                Filtering: {searchQ ? `"${searchQ}"` : ''}{activeCats.size > 0 ? [...activeCats].join(', ') : ''}
              </p>
            </div>
          )}
        </aside>

        {/* Main */}
        <main className="flex-1 px-5 py-7">
          <div className="flex items-start justify-between mb-4 flex-wrap gap-3">
            <div>
              <h1 className="text-xl font-bold text-ink">Search Results</h1>
              <p className="text-muted text-sm mt-0.5">Discover upcoming events across campus</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setMobileFilterOpen(true)}
                className="lg:hidden inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-border bg-white text-sm font-medium text-ink cursor-pointer hover:border-brand hover:text-brand transition-all">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/></svg>
                Filters {activeCats.size > 0 && <span className="px-1.5 py-0.5 bg-brand text-white text-[10px] rounded-full font-bold">{activeCats.size}</span>}
              </button>
              <span className="text-xs font-semibold text-brand bg-brand-lt px-3 py-1.5 rounded-full">
                {filtered.length} Result{filtered.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b6880" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input type="text" value={searchQ} onChange={e => setSearchQ(e.target.value)}
              placeholder="Search events, clubs, interests..."
              className="w-full pl-10 pr-10 py-3 rounded-2xl border-2 border-border bg-white text-sm text-ink placeholder-muted focus:outline-none focus:border-brand transition-colors" />
            {searchQ && (
              <button onClick={() => setSearchQ('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 border-none cursor-pointer hover:bg-gray-200 text-sm">×</button>
            )}
          </div>

          {/* Sort + Type */}
          <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
            <div className="flex gap-2">
              {[{ val:'all', label:'Events' }, { val:'club', label:'Clubs' }].map(t => (
                <button key={t.val} onClick={() => setActiveType(t.val)}
                  className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border-2 text-sm font-medium cursor-pointer transition-all
                    ${activeType === t.val ? 'bg-brand border-brand text-white' : 'bg-white border-border text-muted'}`}>
                  {t.label}
                </button>
              ))}
            </div>
            <select value={sortMode} onChange={e => setSortMode(e.target.value)}
              className="text-sm border border-border rounded-xl px-3 py-1.5 bg-white text-ink cursor-pointer focus:outline-none focus:border-brand transition-colors">
              <option value="date">Sort: Date</option>
              <option value="name">Sort: Name A–Z</option>
              <option value="cat">Sort: Category</option>
            </select>
          </div>

          {/* Results */}
          {filtered.length === 0 ? (
            <div className="py-20 text-center">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="font-semibold text-ink mb-1">No results found</h3>
              <p className="text-sm text-muted mb-5">Try different keywords or clear your filters</p>
              <button onClick={resetAll} className="px-5 py-2 rounded-full bg-brand text-white text-sm font-medium border-none cursor-pointer hover:bg-brand-dk transition-colors">Clear all filters</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map((e, i) => {
                const isClub = e.type === 'club'
                return (
                  <div key={e.id} onClick={() => navigate(isClub ? `/club/${e.id}` : `/event/${e.id}`)}
                    className="bg-white rounded-2xl overflow-hidden border border-border event-card cursor-pointer hover:shadow-brand transition-all hover:-translate-y-0.5"
                    style={{ animation: `fadeSlideIn 0.3s ease ${i * 0.06}s both` }}>
                    <div className="relative h-36 overflow-hidden">
                      <div className={`w-full h-full bg-gradient-to-br ${e.gradient} flex items-center justify-center text-5xl`}>{e.emoji}</div>
                      <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase text-white ${e.badgeBg}`}>{e.catLabel}</span>
                      <button onClick={(e) => { e.stopPropagation(); toggleSave(e.id) }}
                        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 border-none cursor-pointer flex items-center justify-center shadow-sm hover:scale-110 transition-transform">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                          <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                            stroke={savedIds.has(e.id) ? '#5b3ff8' : '#6b6880'}
                            fill={savedIds.has(e.id) ? '#5b3ff8' : 'none'}
                            strokeWidth="2"/>
                        </svg>
                      </button>
                    </div>
                    <div className="p-3.5">
                      <p className="text-[10px] font-bold text-brand uppercase tracking-wider mb-1">{isClub ? e.catLabel : e.club}</p>
                      <h3 className="font-bold text-sm text-ink mb-2 leading-snug">{e.title}</h3>
                      <div className="text-xs text-muted flex flex-col gap-1 mb-3">
                        {isClub ? (
                          <div className="flex items-center gap-1">{e.club}</div>
                        ) : (
                          <>
                            <div className="flex items-center gap-1">📅 {e.dateStr}</div>
                            <div className="flex items-center gap-1">📍 {e.location}</div>
                          </>
                        )}
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); !registered[e.id] && handleRegister(e.id, e.title) }}
                        disabled={registered[e.id]}
                        className="w-full py-2 rounded-full text-xs font-semibold border-none cursor-pointer transition-colors"
                        style={{ background: registered[e.id] ? '#10b981' : '#5b3ff8', color: 'white' }}>
                        {registered[e.id] ? '✓ Registered' : isClub ? 'Join Club' : 'Register Now'}
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  )
}