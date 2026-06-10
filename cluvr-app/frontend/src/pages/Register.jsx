import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const INTERESTS = [
  '💻 Technology', '🎨 Arts', '📷 Photography', '🌿 Environment',
  '🎭 Drama', '🏀 Sports', '🎵 Music', '♟️ Chess',
  '🗣️ Debate', '📚 Literature', '🔬 Science', '💼 Business'
]

export default function Register() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    university: '',
    major: '',
    interests: []
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const toggleInterest = (interest) => {
    const interests = formData.interests.includes(interest)
      ? formData.interests.filter(i => i !== interest)
      : [...formData.interests, interest]
    setFormData({ ...formData, interests })
  }

  const handleNext = () => {
    if (step === 1) {
      if (!formData.name || !formData.email || !formData.password) {
        setError('Please fill in all required fields')
        return
      }
      if (formData.password.length < 8) {
        setError('Password must be at least 8 characters')
        return
      }
      setError('')
      setStep(2)
    } else if (step === 2) {
      if (!formData.university || !formData.major) {
        setError('Please fill in all required fields')
        return
      }
      setError('')
      setStep(3)
    }
  }

  const handleBack = () => {
    setStep(step - 1)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await register(formData)
      navigate('/')
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-8" style={{ background: '#f5f4fb' }}>
      <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-brand">
        {/* Progress indicator */}
        <div className="flex justify-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-2 rounded-full transition-all ${
                s <= step ? 'bg-brand w-8' : 'bg-border w-2'
              }`}
            />
          ))}
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-ink mb-2">
            {step === 1 ? 'Create Account' : step === 2 ? 'Your Studies' : 'Your Interests'}
          </h1>
          <p className="text-muted text-sm">
            {step === 1 ? 'Join cluvr to discover campus events' : step === 2 ? 'Tell us about your university' : 'Select your interests'}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm mb-6">
            {error}
          </div>
        )}

        {/* Step 1*/}
        {step === 1 && (
          <form className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-2">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full px-4 py-3 rounded-xl border-2 border-border bg-surface text-ink placeholder-muted focus:outline-none focus:border-brand transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-2">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="student@university.edu"
                className="w-full px-4 py-3 rounded-xl border-2 border-border bg-surface text-ink placeholder-muted focus:outline-none focus:border-brand transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-2">
                Password *
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Min. 8 characters"
                className="w-full px-4 py-3 rounded-xl border-2 border-border bg-surface text-ink placeholder-muted focus:outline-none focus:border-brand transition-colors"
                required
              />
            </div>

            <button
              type="button"
              onClick={handleNext}
              className="w-full py-3 rounded-full bg-brand text-white font-semibold text-sm border-none cursor-pointer hover:bg-brand-dk transition-all hover:-translate-y-0.5"
            >
              Continue
            </button>
          </form>
        )}

        {/* Step 2*/}
        {step === 2 && (
          <form className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-2">
                University *
              </label>
              <input
                type="text"
                name="university"
                value={formData.university}
                onChange={handleChange}
                placeholder="National University of Mongolia"
                className="w-full px-4 py-3 rounded-xl border-2 border-border bg-surface text-ink placeholder-muted focus:outline-none focus:border-brand transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-2">
                Major *
              </label>
              <input
                type="text"
                name="major"
                value={formData.major}
                onChange={handleChange}
                placeholder="Computer Science"
                className="w-full px-4 py-3 rounded-xl border-2 border-border bg-surface text-ink placeholder-muted focus:outline-none focus:border-brand transition-colors"
                required
              />
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleBack}
                className="flex-1 py-3 rounded-full border-2 border-border text-muted font-semibold text-sm cursor-pointer hover:bg-surface transition-all"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="flex-1 py-3 rounded-full bg-brand text-white font-semibold text-sm border-none cursor-pointer hover:bg-brand-dk transition-all hover:-translate-y-0.5"
              >
                Continue
              </button>
            </div>
          </form>
        )}

        {/* Step 3*/}
        {step === 3 && (
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-3">
                Select Your Interests
              </label>
              <div className="flex flex-wrap gap-2">
                {INTERESTS.map((interest) => (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => toggleInterest(interest)}
                    className={`px-4 py-2 rounded-full text-sm font-medium cursor-pointer transition-all ${
                      formData.interests.includes(interest)
                        ? 'bg-brand text-white border-2 border-brand'
                        : 'bg-surface text-muted border-2 border-border hover:border-brand'
                    }`}
                  >
                    {interest}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleBack}
                className="flex-1 py-3 rounded-full border-2 border-border text-muted font-semibold text-sm cursor-pointer hover:bg-surface transition-all"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 rounded-full bg-brand text-white font-semibold text-sm border-none cursor-pointer hover:bg-brand-dk transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </div>
          </form>
        )}

        {/* Sign in */}
        <p className="text-center text-sm text-muted mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-brand font-semibold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
