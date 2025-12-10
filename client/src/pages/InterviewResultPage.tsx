import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router'
import { ArrowLeft, MessageSquare, User, ChevronDown, ChevronUp } from 'lucide-react'
import api from '../services/api'

interface Assessment {
  overall_score: number
  skills_match: number
  cultural_fit: number
  communication: number
  motivation: number
  experience_relevance: number
  strengths: string[]
  concerns: string[]
  recommendation: string
  summary: string
}

interface InterviewResult {
  interview_id: number
  position: string
  company?: string
  score: number
  status: string
  completed_at?: string
  conversation: { role: string; content: string }[]
  assessment: Assessment
}

const InterviewResultPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [result, setResult] = useState<InterviewResult | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string>('')
  const [showTranscript, setShowTranscript] = useState(false)

  useEffect(() => {
    if (id) {
      loadResult()
    }
  }, [id])

  const loadResult = async () => {
    if (!id) return

    setIsLoading(true)
    try {
      const data = await api.getInterviewResult(parseInt(id))
      setResult(data as unknown as InterviewResult)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load results')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (error || !result) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">{error || 'Results not found'}</p>
          <button
            onClick={() => navigate('/personal-cabinet')}
            className="text-black underline hover:no-underline"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate('/personal-cabinet')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-semibold text-black">{result.position}</h1>
            {result.company && <p className="text-sm text-gray-500">{result.company}</p>}
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8">
        {/* Score */}
        <div className="text-center mb-12">
          <div className="text-7xl font-light text-black mb-2">{result.score}</div>
          <p className="text-gray-500 text-sm uppercase tracking-wide">Overall Score</p>
          {result.assessment?.recommendation && (
            <p className="mt-4 text-sm font-medium text-gray-700">
              {result.assessment.recommendation}
            </p>
          )}
        </div>

        {/* Metrics */}
        {result.assessment && (
          <div className="grid grid-cols-5 gap-4 mb-12">
            {[
              { label: 'Skills', value: result.assessment.skills_match },
              { label: 'Culture', value: result.assessment.cultural_fit },
              { label: 'Communication', value: result.assessment.communication },
              { label: 'Motivation', value: result.assessment.motivation },
              { label: 'Experience', value: result.assessment.experience_relevance },
            ].map((metric) => (
              <div key={metric.label} className="text-center">
                <div className="text-2xl font-light text-black">{metric.value}</div>
                <div className="text-xs text-gray-500 mt-1">{metric.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Summary */}
        {result.assessment?.summary && (
          <div className="mb-8">
            <h2 className="text-xs uppercase tracking-wide text-gray-500 mb-3">Summary</h2>
            <p className="text-gray-700 leading-relaxed">{result.assessment.summary}</p>
          </div>
        )}

        {/* Strengths & Concerns */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {result.assessment?.strengths && result.assessment.strengths.length > 0 && (
            <div>
              <h2 className="text-xs uppercase tracking-wide text-gray-500 mb-3">Strengths</h2>
              <ul className="space-y-2">
                {result.assessment.strengths.map((strength: string, index: number) => (
                  <li key={index} className="text-gray-700 flex items-start gap-2">
                    <span className="text-gray-400">+</span>
                    {strength}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {result.assessment?.concerns && result.assessment.concerns.length > 0 && (
            <div>
              <h2 className="text-xs uppercase tracking-wide text-gray-500 mb-3">Areas to Improve</h2>
              <ul className="space-y-2">
                {result.assessment.concerns.map((concern: string, index: number) => (
                  <li key={index} className="text-gray-700 flex items-start gap-2">
                    <span className="text-gray-400">-</span>
                    {concern}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Transcript Toggle */}
        {result.conversation && result.conversation.length > 0 && (
          <div className="border-t border-gray-200 pt-8">
            <button
              onClick={() => setShowTranscript(!showTranscript)}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-black transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Interview Transcript ({result.conversation.length} messages)</span>
              {showTranscript ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showTranscript && (
              <div className="mt-6 space-y-6">
                {result.conversation.map((message: { role: string; content: string }, index: number) => (
                  <div key={index} className="flex gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.role === 'user' ? 'bg-black' : 'bg-gray-200'
                    }`}>
                      <User className={`w-4 h-4 ${message.role === 'user' ? 'text-white' : 'text-gray-600'}`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 mb-1">
                        {message.role === 'user' ? 'You' : 'Interviewer'}
                      </p>
                      <p className="text-gray-700 leading-relaxed">{message.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Back Button */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <button
            onClick={() => navigate('/personal-cabinet')}
            className="w-full py-3 bg-black text-white text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </main>
    </div>
  )
}

export default InterviewResultPage
