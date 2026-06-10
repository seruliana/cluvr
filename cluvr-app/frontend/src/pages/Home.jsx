import { useState, useEffect, useCallback, useMemo } from 'react'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { authAPI, clubsAPI, eventsAPI, favoritesAPI, userActionsAPI } from '../services/api'
import { combineClubEventCards, mapClubToCard } from '../utils/cardMappers'
import DiscoverCard from '../components/ui/DiscoverCard'
import ItemImage from '../components/ui/ItemImage'

const TAGS_PER_PAGE = 4

function toId(item) {
  return typeof item === 'object' && item?._id ? item._id : item
}

function readRecommendations() {
  try {
    const stored = localStorage.getItem('recommendations')
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}

export default function Home() {
  const navigate = useNavigate()
  const { isAuthenticated, user, refreshUser } = useAuth()
  const [cards, setCards] = useState([])
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterType, setFilterType] = useState('all')
  const [registered, setRegistered] = useState({})
  const [followed, setFollowed] = useState({})
  const [savedBookmarks, setSavedBookmarks] = useState({})
  const [heroClubIndex, setHeroClubIndex] = useState(0)
  const [clubTagIndex, setClubTagIndex] = useState(0)
  const [showAllCards, setShowAllCards] = useState(false)
  const [recommendations, setRecommendations] = useState(() => readRecommendations())

  const loadData = useCallback(async () => {
    try {
      setLoading(true)
      const [clubsRes, eventsRes] = await Promise.all([
        clubsAPI.getAll(),
        eventsAPI.getAll(),
      ])
      setEvents(eventsRes.data || [])
      setCards(combineClubEventCards(clubsRes.data || [], eventsRes.data || []))
      setRecommendations(readRecommendations())
    } catch (error) {
      console.error('Failed to load data:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

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

  const allClubCards = useMemo(() => cards.filter(c => c.type === 'club'), [cards])

  const heroClubs = useMemo(() => {
    if (recommendations?.clubs?.length) {
      const recCards = recommendations.clubs.map(club => mapClubToCard(club, events))
      return recCards.length ? recCards : allClubCards
    }
    return allClubCards
  }, [recommendations, allClubCards, events])

  const stripClubs = heroClubs.slice(0, 8)
  const tagClubs = allClubCards
  const tagPages = Math.max(1, Math.ceil(tagClubs.length / TAGS_PER_PAGE))

  useEffect(() => {
    if (heroClubs.length === 0) return
    const interval = setInterval(() => {
      setHeroClubIndex(prev => (prev + 1) % heroClubs.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [heroClubs.length])

  useEffect(() => {
    if (tagClubs.length === 0) return
    const interval = setInterval(() => {
      setClubTagIndex(prev => (prev + 1) % tagPages)
    }, 3000)
    return () => clearInterval(interval)
  }, [tagClubs.length, tagPages])

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

  const handleRegister = async (id) => {
    if (!isAuthenticated) { navigate('/login'); return }
    if (registered[id]) return
    try {
      await userActionsAPI.joinEvent(id)
      setRegistered(prev => ({ ...prev, [id]: true }))
      await refreshUser()
    } catch (error) {
      console.error('Failed to join event:', error)
    }
  }

  const handleFollow = async (id) => {
    if (!isAuthenticated) { navigate('/login'); return }
    if (followed[id]) return
    try {
      await authAPI.followClub(id)
      setFollowed(prev => ({ ...prev, [id]: true }))
      await refreshUser()
    } catch (error) {
      console.error('Failed to follow club:', error)
    }
  }

  const handleAction = (item) => {
    if (item.type === 'club') handleFollow(item.id)
    else handleRegister(item.id)
  }

  const filteredCards = filterType === 'all' ? cards : cards.filter(c => c.type === filterType)
  const displayedCards = showAllCards ? filteredCards : filteredCards.slice(0, 6)
  const currentHeroClub = heroClubs[heroClubIndex] || heroClubs[0]
  const visibleTagClubs = tagClubs.slice(clubTagIndex * TAGS_PER_PAGE, clubTagIndex * TAGS_PER_PAGE + TAGS_PER_PAGE)

  const scrollToDiscover = () =>
    document.getElementById('Discover')?.scrollIntoView({ behavior: 'smooth', block: 'start' })

  if (loading) {
    return (
      <div className="min-h-screen text-ink flex items-center justify-center bg-page">
        <div className="text-2xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="bg-page text-ink overflow-x-hidden dark:bg-page">
      <Header />

      <section
        id="hero"
        className="relative grid grid-cols-1 md:grid-cols-2 gap-0 min-h-[540px] items-center px-8 pt-[72px] pb-14 overflow-hidden dark:bg-[#12101f]"
        style={{ background: 'linear-gradient(135deg,#f7f6ff 0%,#ede9ff 60%,#fdf4ff 100%)' }}
      >
        <div className="relative z-10">
          <p className="inline-flex items-center gap-2 bg-card text-brand border border-brand-lt px-3.5 py-1.5 rounded-full text-xs font-semibold mb-6 shadow-brand">
            {recommendations?.explanation ? '✨ Personalized for you' : '🌸 Spring semester events are here!'}
          </p>
          <h1 className="font-extrabold leading-[1.1] text-ink mb-4 tracking-tight" style={{ fontSize: 'clamp(2.2rem,4vw,3.2rem)' }}>
            Discover your<br />campus <span className="text-brand">cluvr</span>
          </h1>
          <p className="text-muted text-[1.05rem] mb-8 max-w-[420px] leading-[1.7]">
            {recommendations?.explanation || (
              <>Join <strong className="text-brand font-semibold">{cards.length}+</strong> students in discovering the best clubs and events at your university.</>
            )}
          </p>
          <div className="flex gap-3 flex-wrap">
            <button onClick={() => navigate('/quiz')}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-brand text-white font-medium text-sm cursor-pointer border-none hover:bg-brand-dk">
              ✨ Take Interest Quiz
            </button>
            <button onClick={scrollToDiscover}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-transparent text-brand border-2 border-brand font-medium text-sm cursor-pointer hover:bg-brand-lt">
              Browse Events
            </button>
          </div>
        </div>

        <div className="hidden md:block relative z-10 pl-6">
          {currentHeroClub && (
            <div
              onClick={() => navigate(`/club/${currentHeroClub.id}`)}
              className="relative rounded-2xl overflow-hidden shadow-brand-lg h-[280px] cursor-pointer hover:scale-[1.02] transition-transform"
            >
              <ItemImage item={currentHeroClub} className="absolute inset-0 w-full h-full object-cover" gradient={currentHeroClub.gradient} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="font-bold text-lg">{currentHeroClub.title}</h3>
                <p className="text-white/80 text-xs mt-1">📍 {currentHeroClub.location} · {currentHeroClub.club}</p>
              </div>
            </div>
          )}
          <div className="flex gap-2 flex-wrap mt-4">
            {visibleTagClubs.map((club) => (
              <div
                key={club.id}
                onClick={() => navigate(`/club/${club.id}`)}
                className="flex items-center gap-2 bg-card rounded-full px-3.5 py-2 shadow-brand text-sm font-medium text-ink cursor-pointer hover:scale-105 transition-transform"
              >
                <span className="w-6 h-6 rounded-full overflow-hidden shrink-0">
                  <ItemImage item={club} className="w-full h-full object-cover" gradient={club.gradient} />
                </span>
                {club.title}
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="flex items-center gap-4 px-8 py-5 border-b border-border bg-card overflow-x-auto">
        <span className="text-[11px] font-semibold text-muted whitespace-nowrap uppercase tracking-widest">
          {recommendations?.clubs?.length ? 'Recommended For You' : 'Recommended Clubs'}
        </span>
        {stripClubs.map(club => (
          <button key={club.id} type="button" onClick={() => navigate(`/club/${club.id}`)}
            className="strip-club flex items-center gap-1.5 whitespace-nowrap px-3.5 py-1.5 rounded-full bg-surface border border-border text-sm font-medium text-ink cursor-pointer hover:bg-brand-lt border-none">
            <span className="w-2 h-2 rounded-full bg-brand inline-block" />{club.title}
          </button>
        ))}
      </div>

      <section id="Discover" className="px-8 py-[60px]">
        <div className="flex items-end justify-between mb-7">
          <div>
            <h2 className="font-extrabold text-[1.7rem] text-ink tracking-tight">Discover what&apos;s happening</h2>
            <p className="text-muted text-sm mt-1">Handpicked events and clubs based on your interests.</p>
          </div>
          <button type="button" onClick={() => navigate('/search')} className="inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 border-brand text-brand text-xs font-medium bg-transparent cursor-pointer hover:bg-brand-lt">
            View All
          </button>
        </div>

        <div className="flex gap-2 mb-8">
          {[{ val: 'all', label: 'All' }, { val: 'event', label: 'Events' }, { val: 'club', label: 'Clubs' }].map(f => (
            <button key={f.val} onClick={() => setFilterType(f.val)}
              className={`filter-pill px-4 py-2 rounded-full border-2 text-sm font-medium cursor-pointer transition-all ${filterType === f.val ? 'active' : ''}`}>
              {f.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {displayedCards.map((card, i) => (
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

        {filteredCards.length > 6 && !showAllCards && (
          <div className="text-center mt-8">
            <button onClick={() => setShowAllCards(true)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 border-brand text-brand text-sm font-medium cursor-pointer bg-transparent hover:bg-brand-lt">
              Load More ({filteredCards.length - 6} more)
            </button>
          </div>
        )}
      </section>

      <section className="px-8 py-12 bg-surface border-t border-border">
        <div className="flex items-end justify-between mb-5">
          <div>
            <h2 className="font-extrabold text-[1.7rem] text-ink tracking-tight">Clubs you might like</h2>
            <p className="text-muted text-sm mt-1">Based on your interests and activity</p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {(heroClubs.slice(0, 6)).map(club => (
            <button key={club.id} type="button" onClick={() => navigate(`/club/${club.id}`)}
              className="club-card flex flex-col items-center gap-2.5 p-5 rounded-2xl border border-border bg-card text-ink cursor-pointer border-solid">
              <div className="w-14 h-14 rounded-2xl overflow-hidden">
                <ItemImage item={club} className="w-full h-full object-cover" gradient={club.gradient} />
              </div>
              <h4 className="font-bold text-sm text-center">{club.title}</h4>
              <p className="text-xs text-muted">{club.club}</p>
            </button>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  )
}
