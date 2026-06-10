import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import { useAuth } from '../contexts/AuthContext'
import { authAPI, recommendationsAPI } from '../services/api'

const quizQuestions = [
  {
    id: 1,
    question: 'Чөлөөт цагаараа юу хийх хамгийн дуртай вэ?',
    options: [
      { id: 'creative', label: '🎨 Бүтээлч зүйл хийх (зураг, дизайн, бичих, гар урлал)', tags: ['design', 'art', 'creative'] },
      { id: 'tech', label: '💻 Технологи, код, шинэ зүйл сурах', tags: ['technology', 'programming', 'coding'] },
      { id: 'sport', label: '🏃 Спорт, хөдөлгөөн хийх', tags: ['sports', 'fitness', 'athletics'] },
      { id: 'music', label: '🎵 Хөгжим, урлаг сонирхох', tags: ['music', 'arts', 'performance'] },
      { id: 'learning', label: '📚 Унших, судлах, хэл сурах', tags: ['academic', 'learning', 'language'] },
      { id: 'travel', label: '🌏 Аялал, шинэ газар нээх', tags: ['travel', 'adventure', 'exploration'] },
      { id: 'social', label: '🤝 Хүмүүстэй танилцаж, community-д оролцох', tags: ['social', 'community', 'networking'] },
      { id: 'gaming', label: '🎮 Тоглоом, entertainment', tags: ['gaming', 'esports', 'entertainment'] },
    ]
  },
  {
    id: 2,
    question: 'Ямар төрлийн үйл ажиллагаа чамд илүү таалагддаг вэ?',
    options: [
      { id: 'competition', label: 'Тэмцээн, challenge', tags: ['competition', 'challenge', 'competitive'] },
      { id: 'discussion', label: 'Тайван ярилцлага, discussion', tags: ['discussion', 'debate', 'communication'] },
      { id: 'workshop', label: 'Бүтээл хийх workshop', tags: ['workshop', 'creative', 'hands-on'] },
      { id: 'lecture', label: 'Сургалт, лекц', tags: ['education', 'learning', 'academic'] },
      { id: 'outdoor', label: 'Гадуур үйл ажиллагаа', tags: ['outdoor', 'adventure', 'nature'] },
      { id: 'fun', label: 'Тоглоом, хөгжилтэй event', tags: ['fun', 'entertainment', 'social'] },
    ]
  },
  {
    id: 3,
    question: 'Чи ямар орчинд илүү тухтай байдаг вэ?',
    options: [
      { id: 'crowded', label: '👥 Олон хүнтэй, идэвхтэй орчин', tags: ['social', 'crowded', 'energetic'] },
      { id: 'intimate', label: '👨‍👩‍👧 Цөөн хүнтэй ойр community', tags: ['intimate', 'close-knit', 'community'] },
      { id: 'online', label: '🧑‍💻 Онлайн орчин', tags: ['online', 'digital', 'remote'] },
      { id: 'quiet', label: '🌿 Тайван, тухтай орчин', tags: ['quiet', 'peaceful', 'focused'] },
    ]
  },
  {
    id: 4,
    question: 'Шинэ клубээс юу хүлээж байна вэ?',
    options: [
      { id: 'friends', label: 'Шинэ найз нөхөдтэй болох', tags: ['social', 'friendship', 'networking'] },
      { id: 'skills', label: 'Ур чадвараа хөгжүүлэх', tags: ['skills', 'development', 'growth'] },
      { id: 'career', label: 'CV / карьертаа нэмэр болох', tags: ['career', 'professional', 'resume'] },
      { id: 'self', label: 'Өөрийгөө хөгжүүлэх', tags: ['personal', 'growth', 'self-improvement'] },
      { id: 'hobby', label: 'Зүгээр л сонирхолтой зүйл хийх', tags: ['hobby', 'interest', 'fun'] },
      { id: 'achievement', label: 'Тэмцээн, шагнал, амжилт', tags: ['achievement', 'competition', 'recognition'] },
    ]
  },
  {
    id: 5,
    question: 'Аль чиглэлүүд чамд хамгийн сонирхолтой вэ? (3 хүртэл сонгоно)',
    multiSelect: true,
    options: [
      { id: 'it', label: '💻 IT / Programming', tags: ['technology', 'programming', 'coding', 'software'] },
      { id: 'design', label: '🎨 Design / Art', tags: ['design', 'art', 'creative', 'visual'] },
      { id: 'media', label: '📸 Media / Content', tags: ['media', 'content', 'photography', 'journalism'] },
      { id: 'business', label: '📈 Business / Entrepreneurship', tags: ['business', 'entrepreneurship', 'marketing', 'finance'] },
      { id: 'language', label: '🌎 Language / Culture', tags: ['language', 'culture', 'international', 'exchange'] },
      { id: 'sports', label: '🏀 Sports', tags: ['sports', 'athletics', 'fitness', 'competition'] },
      { id: 'music', label: '🎤 Music / Performance', tags: ['music', 'performance', 'arts', 'entertainment'] },
      { id: 'science', label: '🔬 Science / Research', tags: ['science', 'research', 'academic', 'innovation'] },
      { id: 'volunteer', label: '🤲 Volunteer / Social activity', tags: ['volunteer', 'social', 'community', 'service'] },
      { id: 'game', label: '🎮 Game / Esports', tags: ['gaming', 'esports', 'competition', 'entertainment'] },
    ]
  },
  {
    id: 6,
    question: 'Багаар ажиллах тал дээр:',
    options: [
      { id: 'leader', label: 'Би баг удирдах дуртай', tags: ['leadership', 'management', 'organizing'] },
      { id: 'participant', label: 'Би идэвхтэй оролцогч байх дуртай', tags: ['participation', 'teamwork', 'collaboration'] },
      { id: 'independent', label: 'Би өөрийнхөөрөө ажиллах дуртай', tags: ['independent', 'solo', 'self-directed'] },
      { id: 'flexible', label: 'Хамаарахгүй, үйл ажиллагаанаас шалтгаална', tags: ['flexible', 'adaptable', 'versatile'] },
    ]
  },
  {
    id: 7,
    question: 'Чиний зан чанарт аль нь илүү тохирох вэ?',
    options: [
      { id: 'curious', label: 'Шинэ зүйл турших дуртай', tags: ['curiosity', 'exploration', 'adventure'] },
      { id: 'logical', label: 'Логик, асуудал шийдэх дуртай', tags: ['logic', 'problem-solving', 'analytical'] },
      { id: 'creative', label: 'Бүтээлч, санаа гаргах дуртай', tags: ['creativity', 'innovation', 'imagination'] },
      { id: 'people', label: 'Хүмүүстэй харилцах дуртай', tags: ['social', 'communication', 'people'] },
      { id: 'competitive', label: 'Өрсөлдөх дуртай', tags: ['competition', 'ambition', 'drive'] },
      { id: 'studious', label: 'Тайван судлах дуртай', tags: ['study', 'research', 'academic'] },
    ]
  }
]

export default function InterestQuiz() {
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()
  const [answers, setAnswers] = useState({})
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)

  const handleAnswer = (questionId, optionId, isMultiSelect = false) => {
    setAnswers(prev => {
      if (isMultiSelect) {
        const currentAnswers = prev[questionId] || []
        if (currentAnswers.includes(optionId)) {
          return { ...prev, [questionId]: currentAnswers.filter(id => id !== optionId) }
        } else {
          return { ...prev, [questionId]: [...currentAnswers, optionId] }
        }
      } else {
        return { ...prev, [questionId]: optionId }
      }
    })
  }

  const handleNext = () => {
    if (step < quizQuestions.length) {
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
      const allTags = []
      Object.entries(answers).forEach(([questionId, selectedOption]) => {
        const question = quizQuestions.find(q => q.id === parseInt(questionId))
        if (question) {
          if (Array.isArray(selectedOption)) {
            selectedOption.forEach(optId => {
              const option = question.options.find(o => o.id === optId)
              if (option) allTags.push(...option.tags)
            })
          } else {
            const option = question.options.find(o => o.id === selectedOption)
            if (option) allTags.push(...option.tags)
          }
        }
      })

      const data = await recommendationsAPI.get({
        answers,
        tags: allTags,
        interests: allTags,
      })

      localStorage.setItem('recommendations', JSON.stringify(data))

      if (isAuthenticated && user) {
        await authAPI.saveQuizResults({
          answers,
          tags: allTags,
          interests: allTags,
          recommendations: {
            clubs: (data.clubs || []).map(c => c._id),
            events: (data.events || []).map(e => e._id),
          },
        })
      }

      navigate('/')
    } catch (error) {
      console.error('Error submitting quiz:', error)
      // Still save interests even if error occurs
      if (isAuthenticated && user) {
        try {
          await authAPI.updateProfile({ interests: Object.values(answers).flat() })
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
            <span className="text-sm font-semibold text-muted">Асуулт {step} / {quizQuestions.length}</span>
            <span className="text-sm font-semibold text-brand">
              {step === quizQuestions.length ? 'Дуусгах' : 'Дараагийн асуулт'}
            </span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-brand transition-all duration-300"
              style={{ width: `${(step / quizQuestions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Question */}
        {step <= quizQuestions.length && (
          <div>
            <div className="text-center mb-8">
              <h1 className="font-extrabold text-[2rem] text-ink tracking-tight mb-3">
                {quizQuestions[step - 1].question}
              </h1>
              {quizQuestions[step - 1].multiSelect && (
                <p className="text-muted text-sm max-w-md mx-auto">
                  3 хүртэл сонгоно уу
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4 mb-8">
              {quizQuestions[step - 1].options.map(option => {
                const isSelected = quizQuestions[step - 1].multiSelect
                  ? (answers[step] || []).includes(option.id)
                  : answers[step] === option.id

                return (
                  <div
                    key={option.id}
                    onClick={() => handleAnswer(step, option.id, quizQuestions[step - 1].multiSelect)}
                    className={`p-5 rounded-2xl border-2 cursor-pointer transition-all hover:scale-105 hover:shadow-brand
                      ${isSelected
                        ? 'border-brand bg-brand-lt'
                        : 'border-border bg-white hover:border-brand-lt'
                      }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-1
                        ${isSelected ? 'border-brand bg-brand' : 'border-gray-300'}`}>
                        {isSelected && (
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                            <path d="M5 13l4 4L19 7"/>
                          </svg>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-base text-ink">{option.label}</h3>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="flex justify-between items-center">
              <button
                onClick={handleBack}
                disabled={step === 1}
                className="px-6 py-3 rounded-full border-2 border-border text-ink font-semibold text-sm cursor-pointer hover:bg-surface transition-colors disabled:opacity-50 disabled:cursor-not-allowed border-none"
              >
                Буцах
              </button>
              <button
                onClick={handleNext}
                disabled={
                  !answers[step] || 
                  (quizQuestions[step - 1].multiSelect && (answers[step] || []).length === 0) ||
                  (quizQuestions[step - 1].multiSelect && (answers[step] || []).length > 3)
                }
                className="px-8 py-3 rounded-full bg-brand text-white font-semibold text-sm border-none cursor-pointer hover:bg-brand-dk transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {step === quizQuestions.length 
                  ? (loading ? 'Хадгалаж байна...' : 'Дуусгах')
                  : 'Дараагийн'
                }
              </button>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
