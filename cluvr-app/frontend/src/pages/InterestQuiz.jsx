import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import { useAuth } from '../contexts/AuthContext'
import { authAPI } from '../services/api'

const interestCategories = [
  {
    id: 'technology',
    name: 'Technology',
    emoji: '💻',
    description: 'Programming, AI, Software Development, Hackathons',
    color: 'from-blue-50 to-indigo-100'
  },
  {
    id: 'science',
    name: 'Science',
    emoji: '🔬',
    description: 'Physics, Chemistry, Biology, Research',
    color: 'from-green-50 to-emerald-100'
  },
  {
    id: 'arts',
    name: 'Arts & Culture',
    emoji: '🎨',
    description: 'Photography, Music, Dance, Traditional Arts',
    color: 'from-pink-50 to-rose-100'
  },
  {
    id: 'sports',
    name: 'Sports',
    emoji: '⚽',
    description: 'Football, Basketball, Athletics, Fitness',
    color: 'from-orange-50 to-amber-100'
  },
  {
    id: 'business',
    name: 'Business',
    emoji: '💼',
    description: 'Entrepreneurship, Marketing, Finance, Leadership',
    color: 'from-purple-50 to-violet-100'
  },
  {
    id: 'social',
    name: 'Social Impact',
    emoji: '🌍',
    description: 'Volunteering, Community Service, Environment',
    color: 'from-teal-50 to-cyan-100'
  },
  {
    id: 'academic',
    name: 'Academic',
    emoji: '📚',
    description: 'Debate, Research, Study Groups, Languages',
    color: 'from-yellow-50 to-lime-100'
  },
  {
    id: 'media',
    name: 'Media & Communications',
    emoji: '📸',
    description: 'Journalism, Broadcasting, Social Media, Content Creation',
    color: 'from-red-50 to-pink-100'
  }
]

export default function InterestQuiz() {
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()
  const [selectedInterests, setSelectedInterests] = useState([])
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)

  const toggleInterest = (interestId) => {
    setSelectedInterests(prev => {
      if (prev.includes(interestId)) {
        return prev.filter(id => id !== interestId)
      } else {
        return [...prev, interestId]
      }
    })
  }

  const handleNext = () => {
    if (step < 2) {
      setStep(step + 1)
    } else {
      handleSubmit()
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      // Get interest names from IDs
      const interestNames = selectedInterests.map(id => {
        const category = interestCategories.find(c => c.id === id)
        return category ? category.name.toLowerCase() : id
      })

      // Get AI recommendations
      const response = await fetch('http://localhost:4000/api/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ interests: interestNames }),
      })

      if (response.ok) {
        const data = await response.json()
        console.log('Recommendations:', data)

        // Save quiz results to database if authenticated
        if (isAuthenticated && user) {
          await authAPI.saveQuizResults({
            interests: interestNames,
            recommendations: {
              clubs: data.clubs.map(c => c._id),
              events: data.events.map(e => e._id),
            }
          })
        }

        // Store recommendations in localStorage and navigate
        localStorage.setItem('recommendations', JSON.stringify(data))
        navigate('/recommendations')
      } else {
        console.error('Failed to get recommendations')
        // Still save interests even if recommendations fail
        if (isAuthenticated && user) {
          await authAPI.updateProfile({ interests: interestNames })
        }
        navigate('/profile')
      }
    } catch (error) {
      console.error('Error submitting quiz:', error)
      // Still save interests even if error occurs
      if (isAuthenticated && user) {
        try {
          await authAPI.updateProfile({ interests: interestNames })
        } catch (profileError) {
          console.error('Failed to update profile:', profileError)
        }
      }
      navigate('/profile')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen text-ink" style={{ background: '#f5f4fb' }}>
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-muted">Step {step} of 2</span>
            <span className="text-sm font-semibold text-brand">{step === 1 ? 'Select Interests' : 'Confirm Selection'}</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-brand transition-all duration-300"
              style={{ width: `${(step / 2) * 100}%` }}
            />
          </div>
        </div>

        {/* Step 1: Select Interests */}
        {step === 1 && (
          <div>
            <div className="text-center mb-8">
              <h1 className="font-extrabold text-[2rem] text-ink tracking-tight mb-3">
                What are you interested in?
              </h1>
              <p className="text-muted text-sm max-w-md mx-auto">
                Select at least 3 interests to help us recommend clubs and events that match your preferences.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {interestCategories.map(category => (
                <div
                  key={category.id}
                  onClick={() => toggleInterest(category.id)}
                  className={`p-5 rounded-2xl border-2 cursor-pointer transition-all hover:scale-105 hover:shadow-brand
                    ${selectedInterests.includes(category.id)
                      ? 'border-brand bg-brand-lt'
                      : 'border-border bg-white hover:border-brand-lt'
                    }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center text-2xl`}>
                      {category.emoji}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-base text-ink mb-1">{category.name}</h3>
                      <p className="text-xs text-muted leading-relaxed">{category.description}</p>
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center
                      ${selectedInterests.includes(category.id) ? 'border-brand bg-brand' : 'border-gray-300'}`}>
                      {selectedInterests.includes(category.id) && (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                          <path d="M5 13l4 4L19 7"/>
                        </svg>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center">
              <div className="text-sm text-muted">
                {selectedInterests.length} selected
              </div>
              <button
                onClick={handleNext}
                disabled={selectedInterests.length < 3}
                className="px-8 py-3 rounded-full bg-brand text-white font-semibold text-sm border-none cursor-pointer hover:bg-brand-dk transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {selectedInterests.length < 3 ? 'Select at least 3' : 'Continue'}
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Confirm */}
        {step === 2 && (
          <div>
            <div className="text-center mb-8">
              <h1 className="font-extrabold text-[2rem] text-ink tracking-tight mb-3">
                Confirm your interests
              </h1>
              <p className="text-muted text-sm max-w-md mx-auto">
                You selected {selectedInterests.length} interests. We'll use these to personalize your experience.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-border p-6 mb-8">
              <div className="flex flex-wrap gap-3">
                {selectedInterests.map(interestId => {
                  const category = interestCategories.find(c => c.id === interestId)
                  return (
                    <div
                      key={interestId}
                      className="flex items-center gap-2 px-4 py-2 rounded-full bg-brand-lt border border-brand"
                    >
                      <span className="text-lg">{category.emoji}</span>
                      <span className="text-sm font-medium text-brand">{category.name}</span>
                      <button
                        onClick={() => toggleInterest(interestId)}
                        className="ml-1 text-brand hover:text-brand-dk cursor-pointer border-none bg-transparent"
                      >
                        ✕
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="flex justify-between items-center">
              <button
                onClick={handleBack}
                className="px-6 py-3 rounded-full border-2 border-border text-ink font-semibold text-sm cursor-pointer hover:bg-surface transition-colors border-none"
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading || selectedInterests.length < 3}
                className="px-8 py-3 rounded-full bg-brand text-white font-semibold text-sm border-none cursor-pointer hover:bg-brand-dk transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Saving...' : 'Save Interests'}
              </button>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
