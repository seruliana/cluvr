import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'

export default function Recommendations() {
  const navigate = useNavigate()
  const [recommendations, setRecommendations] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('recommendations')
    if (stored) {
      setRecommendations(JSON.parse(stored))
      setLoading(false)
    } else {
      navigate('/quiz')
    }
  }, [navigate])

  if (loading) {
    return (
      <div className="min-h-screen text-ink flex items-center justify-center" style={{ background: '#f5f4fb' }}>
        <div className="text-2xl">Loading recommendations...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen text-ink" style={{ background: '#f5f4fb' }}>
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h1 className="font-extrabold text-[2.5rem] text-ink tracking-tight mb-3">
            Your Personalized Recommendations
          </h1>
          {recommendations.explanation && (
            <p className="text-muted text-sm max-w-2xl mx-auto">
              {recommendations.explanation}
            </p>
          )}
        </div>

        {/* Recommended Clubs */}
        {recommendations.clubs && recommendations.clubs.length > 0 && (
          <div className="mb-12">
            <h2 className="font-bold text-xl text-ink mb-6">Recommended Clubs</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {recommendations.clubs.map(club => (
                <div
                  key={club._id}
                  onClick={() => navigate(`/club/${club._id}`)}
                  className="bg-white rounded-2xl border border-border overflow-hidden cursor-pointer hover:shadow-brand transition-all hover:-translate-y-1"
                >
                  <div className={`h-44 bg-gradient-to-br ${club.gradient || 'from-brand-lt to-violet-200'} flex items-center justify-center text-5xl`}>
                    {club.emoji || '🎓'}
                  </div>
                  <div className="p-4">
                    <span className="text-xs font-semibold text-brand">{club.category}</span>
                    <h3 className="font-bold text-base text-ink mt-1 mb-2">{club.name}</h3>
                    <p className="text-xs text-muted line-clamp-2">{club.description}</p>
                    <div className="mt-3 text-xs text-muted">
                      👥 {club.members || 0} members
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommended Events */}
        {recommendations.events && recommendations.events.length > 0 && (
          <div className="mb-12">
            <h2 className="font-bold text-xl text-ink mb-6">Recommended Events</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {recommendations.events.map(event => (
                <div
                  key={event._id}
                  onClick={() => navigate(`/event/${event._id}`)}
                  className="bg-white rounded-2xl border border-border overflow-hidden cursor-pointer hover:shadow-brand transition-all hover:-translate-y-1"
                >
                  <div className={`h-40 bg-gradient-to-br ${event.gradient || 'from-brand-lt to-violet-200'} flex items-center justify-center text-5xl`}>
                    {event.emoji || '📅'}
                  </div>
                  <div className="p-4">
                    <span className="text-xs font-semibold text-brand">{event.category}</span>
                    <h3 className="font-bold text-base text-ink mt-1 mb-2">{event.title}</h3>
                    <div className="text-xs text-muted">
                      📅 {event.date}
                    </div>
                    <div className="text-xs text-muted mt-1">
                      📍 {event.location}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No recommendations */}
        {(!recommendations.clubs || recommendations.clubs.length === 0) && 
         (!recommendations.events || recommendations.events.length === 0) && (
          <div className="text-center py-12">
            <p className="text-muted text-lg">No recommendations found. Try adjusting your interests!</p>
            <button
              onClick={() => navigate('/quiz')}
              className="mt-4 px-6 py-3 rounded-full bg-brand text-white font-semibold text-sm cursor-pointer hover:bg-brand-dk transition-colors border-none"
            >
              Retake Quiz
            </button>
          </div>
        )}

        {/* Back to home */}
        <div className="text-center mt-8">
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 rounded-full border-2 border-border text-ink font-semibold text-sm cursor-pointer hover:bg-surface transition-colors border-none"
          >
            Back to Home
          </button>
        </div>
      </main>

      <Footer />
    </div>
  )
}
