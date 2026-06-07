import { useState, useEffect, useCallback } from 'react'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import { useNavigate } from 'react-router-dom'
import { clubsAPI, eventsAPI } from '../services/api'

export default function Home() {
  const navigate = useNavigate()
  const [cards, setCards] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterType, setFilterType] = useState('all')
  const [registered, setRegistered] = useState({})
  const [followed, setFollowed] = useState({})
  const [heroClubIndex, setHeroClubIndex] = useState(0)
  const [clubTagIndex, setClubTagIndex] = useState(0)
  const [showAllCards, setShowAllCards] = useState(false)

  const loadData = useCallback(async () => {
    try {
      setLoading(true)
      const [clubsRes, eventsRes] = await Promise.all([
        clubsAPI.getAll(),
        eventsAPI.getAll()
      ])

      const clubs = clubsRes.data || []
      const events = eventsRes.data || []

      console.log('Loaded clubs:', clubs.length)
      console.log('Loaded events:', events.length)

      // Transform clubs to card format
      const clubCards = clubs.map(club => ({
        id: club._id,
        type: 'club',
        gradient: club.gradient || 'from-brand-lt to-violet-200',
        emoji: club.emoji || '🎓',
        badge: '✅ Active Club',
        badgeColor: 'bg-green-50 text-green-700',
        badgeBg: 'bg-green-600',
        org: club.category,
        club: `${club.members} members`,
        catLabel: club.category,
        title: club.name,
        desc: club.description,
        meta: [],
        location: club.location,
        action: 'Follow Club',
      }))

      // Transform events to card format
      const eventCards = events.map(event => ({
        id: event._id,
        type: 'event',
        gradient: event.gradient || 'from-brand-lt to-violet-200',
        emoji: event.emoji || '📅',
        badge: '📅 Upcoming Event',
        badgeColor: 'bg-orange-50 text-orange-600',
        badgeBg: event.category === 'Professional' ? 'bg-blue-600' :
                 event.category === 'Arts' ? 'bg-pink-600' :
                 event.category === 'Community' ? 'bg-green-600' : 'bg-brand',
        org: event.clubId?.name || 'Campus Event',
        club: event.clubId?.name || 'Unknown',
        catLabel: event.category || 'Events',
        title: event.title,
        desc: event.description,
        meta: [
          `📅 ${event.date}${event.time ? ` · ${event.time}` : ''}`,
          `📍 ${event.location}`,
          event.seats ? `🪑 ${event.seatsLeft || 0} seats left` : ''
        ].filter(Boolean),
        dateStr: `${event.date}${event.time ? ` · ${event.time}` : ''}`,
        location: event.location,
        action: 'Register Now',
      }))

      // Combine and interleave
      const combined = []
      const maxLength = Math.max(clubCards.length, eventCards.length)
      for (let i = 0; i < maxLength; i++) {
        if (eventCards[i]) combined.push(eventCards[i])
        if (clubCards[i]) combined.push(clubCards[i])
      }

      console.log('Combined cards:', combined.length)
      setCards(combined)
    } catch (error) {
      console.error('Failed to load data:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    loadData()
  }, [loadData])
  /* eslint-enable react-hooks/set-state-in-effect */

  // Rotate hero club every 5 seconds
  useEffect(() => {
    if (cards.length > 0) {
      const interval = setInterval(() => {
        setHeroClubIndex(prev => (prev + 1) % cards.filter(c => c.type === 'club').length)
      }, 5000)
      return () => clearInterval(interval)
    }
  }, [cards])

  // Rotate club tags every 30 seconds
  useEffect(() => {
    const clubCount = cards.filter(c => c.type === 'club').slice(0, 6).length
    if (clubCount > 0) {
      const interval = setInterval(() => {
        setClubTagIndex(prev => (prev + 1) % Math.ceil(clubCount / 4))
      }, 30000)
      return () => clearInterval(interval)
    }
  }, [cards])

  const handleRegister = (id) => {
    setRegistered(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const handleFollow = (id) => {
    setFollowed(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const filteredCards = filterType === 'all'
    ? cards
    : cards.filter(c => c.type === filterType)

  const displayedCards = showAllCards ? filteredCards : filteredCards.slice(0, 6)

  if (loading) {
    return (
      <div className="min-h-screen text-ink flex items-center justify-center" style={{ background: '#f5f4fb' }}>
        <div className="text-2xl">Loading...</div>
      </div>
    )
  }

  const handleAction = (item) => {
    if (item.type === 'club') {
      handleFollow(item.id)
    } else {
      handleRegister(item.id)
    }
  }

  const scrollToDiscover = () =>
    document.getElementById('Discover')?.scrollIntoView({ behavior: 'smooth', block: 'start' })

  const CLUBS = cards.filter(c => c.type === 'club').slice(0, 6).map(c => ({
    id: c.id,
    emoji: c.emoji,
    bg: 'bg-brand-lt',
    name: c.title,
    members: c.club,
    gradient: c.gradient,
  }))
  console.log('CLUBS:', CLUBS)

  const heroClubs = cards.filter(c => c.type === 'club')
  const currentHeroClub = heroClubs[heroClubIndex] || heroClubs[0]

  return (
    <div className="bg-white text-ink overflow-x-hidden">
      <Header />


      {/* ── HERO ── */}
      <section
        id="hero"
        className="relative grid grid-cols-1 md:grid-cols-2 gap-0 min-h-[540px] items-center px-8 pt-[72px] pb-14 overflow-hidden"
        style={{ background: 'linear-gradient(135deg,#f7f6ff 0%,#ede9ff 60%,#fdf4ff 100%)' }}
      >
        <div className="relative z-10">
          <p className="inline-flex items-center gap-2 bg-white text-brand border border-brand-lt px-3.5 py-1.5 rounded-full text-xs font-semibold mb-6 shadow-brand animate-fade-down">
            🌸 Spring semester events are here!
          </p>
          <h1
            className="font-extrabold leading-[1.1] text-ink mb-4 tracking-tight animate-fade-down-1"
            style={{ fontSize: 'clamp(2.2rem,4vw,3.2rem)' }}
          >
            Discover your<br />campus <span className="text-brand">cluvr</span>
          </h1>
          <p className="text-muted text-[1.05rem] mb-8 max-w-[420px] leading-[1.7] animate-fade-down-2">
            Join <strong className="text-brand font-semibold">
              {cards.length}+
            </strong> students in discovering the best clubs and events at your university.
          </p>
          <div className="flex gap-3 flex-wrap animate-fade-down-3">
            <button
              onClick={() => navigate('/quiz')}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-brand text-white font-medium text-sm cursor-pointer border-none transition-all hover:-translate-y-0.5 hover:bg-brand-dk hover:shadow-brand-btn"
            >
              ✨ Take Interest Quiz
            </button>
            <button
              onClick={scrollToDiscover}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-transparent text-brand border-2 border-brand font-medium text-sm cursor-pointer transition-all hover:-translate-y-0.5 hover:bg-brand-lt"
            >
              Browse Events
            </button>
          </div>
        </div>

        <div className="hidden md:block relative z-10 pl-6">
          {currentHeroClub && (
            <div
              onClick={() => navigate(`/club/${currentHeroClub.id}`)}
              className="rounded-2xl overflow-hidden shadow-brand-lg h-[280px] flex flex-col justify-end p-6 transition-all duration-500 bg-gradient-to-br cursor-pointer hover:scale-105 hover:shadow-brand-xl"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)' }}
            >
              <div className="text-5xl mb-3">{currentHeroClub.emoji}</div>
              <h3 className="text-white font-bold text-lg">{currentHeroClub.title}</h3>
              <p className="text-white/70 text-xs mt-1">📍 {currentHeroClub.location} · {currentHeroClub.club}</p>
            </div>
          )}
          <div className="flex gap-2 flex-wrap mt-4">
            {CLUBS.slice(clubTagIndex * 4, (clubTagIndex + 1) * 4).map((club, idx) => (
              <div
                key={club.name}
                onClick={() => {
                  console.log('Club clicked:', club.id, club.name)
                  navigate(`/club/${club.id}`)
                }}
                className="flex items-center gap-2 bg-white rounded-full px-3.5 py-2 shadow-brand text-sm font-medium text-ink animate-fade-up cursor-pointer hover:scale-105 transition-transform"
                style={{ animationDelay: `${(idx + 1) * 0.1}s` }}
              >
                <span className="w-6 h-6 rounded-full bg-brand-lt flex items-center justify-center text-sm">{club.emoji}</span>
                {club.name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CLUB STRIP ── */}
      <div
        className="flex items-center gap-4 px-8 py-5 border-b border-border bg-white overflow-x-auto"
        style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}
      >
        <span className="text-[11px] font-semibold text-muted whitespace-nowrap uppercase tracking-widest">Recommended Clubs</span>
        {CLUBS.slice(0, 6).map(club => (
          <a key={club.name} onClick={() => {
            console.log('Strip club clicked:', club.id, club.name)
            navigate(`/club/${club.id}`)
          }}
            className="strip-club flex items-center gap-1.5 whitespace-nowrap px-3.5 py-1.5 rounded-full bg-surface border border-border text-sm font-medium text-ink no-underline transition-all duration-150 cursor-pointer hover:bg-brand-lt">
            <span className="w-2 h-2 rounded-full bg-brand inline-block" />{club.name}
          </a>
        ))}
        <a href="#" onClick={scrollToDiscover} className="whitespace-nowrap text-sm font-semibold text-brand no-underline px-2 cursor-pointer">+ more</a>
      </div>

      {/* ── DISCOVER ── */}
      <section id="Discover" className="px-8 py-[60px]">
        <div className="flex items-end justify-between mb-7">
          <div>
            <h2 className="font-extrabold text-[1.7rem] text-ink tracking-tight">Discover what's happening</h2>
            <p className="text-muted text-sm mt-1">Handpicked events and clubs based on your interests.</p>
          </div>
          <a href="#" onClick={() => navigate('/search')} className="inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 border-brand text-brand text-xs font-medium no-underline transition-all hover:bg-brand-lt">View All</a>
        </div>

        {/* Filter pills */}
        <div className="flex gap-2 mb-8">
          {[{ val:'all', label:'All' }, { val:'event', label:'Events' }, { val:'club', label:'Clubs' }].map(f => (
            <button
              key={f.val}
              onClick={() => setFilterType(f.val)}
              className={`filter-pill px-4 py-2 rounded-full border-2 text-sm font-medium cursor-pointer transition-all duration-150
                ${filterType === f.val ? 'active' : 'border-border text-muted'}`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {displayedCards.map((card, i) => (

            <div
              key={card.id}
              onClick={() => navigate(card.type === 'club' ? `/club/${card.id}` : `/event/${card.id}`)}
              className="card reveal border border-border rounded-2xl overflow-hidden bg-white transition-all duration-200 hover:-translate-y-1.5 hover:shadow-brand-lg cursor-pointer"
              style={{ 
                transitionDelay: `${i * 0.08}s`,
                animation: `fadeUp 0.5s ${i * 0.08}s ease both`
              }}
            >
              <div className="relative h-44 overflow-hidden">
                <div className={`card-img-inner w-full h-full flex items-center justify-center text-5xl transition-transform duration-300 bg-gradient-to-br ${card.gradient}`}>
                  {card.emoji}
                </div>
                <div className="absolute top-3 left-3">
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider ${card.badgeColor}`}>
                    {card.badge}
                  </span>
                </div>
                {/* Save btn — stopPropagation so modal doesn't open */}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    if (card.type === 'club') {
                      handleFollow(card.id)
                    } else {
                      handleRegister(card.id)
                    }
                  }}
                  className={`save-btn absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 border-none cursor-pointer flex items-center justify-center text-base shadow-md transition-transform hover:scale-110 ${card.type === 'club' ? (followed[card.id] ? 'saved' : '') : (registered[card.id] ? 'saved' : '')}`}
                >
                  <span className="block">
                    {card.type === 'club' ? (followed[card.id] ? '💾' : '📥') : (registered[card.id] ? '💾' : '📥')}
                  </span>
                </button>
              </div>

              <div className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-semibold text-brand">{card.org}</span>
                </div>
                <h3 className="font-bold text-[1.05rem] text-ink mb-2 leading-tight">{card.title}</h3>
                <p className="text-xs text-muted leading-relaxed mb-3 line-clamp-2">{card.desc}</p>
                {card.meta.length > 0 && (
                  <div className="flex flex-col gap-1 mb-3 text-xs text-muted">
                    {card.meta.slice(0, 2).map(m => (
                      <div key={m} className="flex items-center gap-1.5">{m}</div>
                    ))}
                  </div>
                )}
                {/* Action btn — stopPropagation */}
                <button
                  onClick={(e) => { e.stopPropagation(); handleAction(card) }}
                  disabled={registered[card.id] || followed[card.id]}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium cursor-pointer border-none transition-all hover:-translate-y-0.5"
                  style={{
                    background:      registered[card.id] || followed[card.id] ? '#10b981'
                                   : card.type === 'club' ? 'transparent' : '#5b3ff8',
                    color:           card.type === 'club' && !(followed[card.id]) ? '#5b3ff8' : 'white',
                    border:          card.type === 'club' && !(followed[card.id]) ? '2px solid #5b3ff8' : 'none',
                  }}
                >
                  {registered[card.id] ? '✅ Registered!'
                   : followed[card.id] ? '✓ Following'
                   : card.action}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        {filteredCards.length > 6 && !showAllCards && (
          <div className="text-center mt-8">
            <button
              onClick={() => setShowAllCards(true)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 border-brand text-brand text-sm font-medium cursor-pointer bg-transparent transition-all hover:bg-brand-lt"
            >
              Load More ({filteredCards.length - 6} more)
            </button>
          </div>
        )}
      </section>

      {/* ── CLUBS YOU MIGHT LIKE ── */}
      <section className="px-8 py-12 bg-surface border-t border-border" style={{ animation: 'fadeUp 0.6s ease both' }}>
        <div className="flex items-end justify-between mb-5">
          <div>
            <h2 className="font-extrabold text-[1.7rem] text-ink tracking-tight">Clubs you might like</h2>
            <p className="text-muted text-sm mt-1">Based on your interests and activity</p>
          </div>
          <a href="#" className="inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 border-brand text-brand text-xs font-medium no-underline transition-all hover:bg-brand-lt">See All Clubs</a>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {CLUBS.map(club => (
            <a key={club.name} href="#"
              className="club-card flex flex-col items-center gap-2.5 p-5 rounded-2xl border border-border bg-white text-ink no-underline transition-all duration-200">
              <div className={`w-14 h-14 rounded-2xl ${club.bg} flex items-center justify-center text-2xl`}>{club.emoji}</div>
              <h4 className="font-bold text-sm text-center">{club.name}</h4>
              <p className="text-xs text-muted">{club.members}</p>
            </a>
          ))}
        </div>
      </section>

      {/* ── ALL CAUGHT UP ── */}
      <div className="text-center px-8 py-10 border-t border-border">
        <p className="text-muted text-sm mb-3.5">🎉 You're all caught up for today!</p>
        <button
          onClick={scrollToDiscover}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border-2 border-brand text-brand text-sm font-medium cursor-pointer bg-transparent transition-all hover:bg-brand-lt"
        >
          Search all <strong className="font-semibold">{cards.filter(c => c.type === 'event').length}+</strong> Activities
        </button>
      </div>

      <Footer />
    </div>
  )
}