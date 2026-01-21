import React, { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router'
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

  const loadResult = useCallback(async () => {
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
  }, [id])

  useEffect(() => {
    if (id) {
      loadResult()
    }
  }, [id, loadResult])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (error || !result) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-sm text-neutral-500 mb-4">{error || 'Results not found'}</p>
          <button
            onClick={() => navigate('/personal-cabinet')}
            className="text-sm text-black underline hover:no-underline"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-neutral-200">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center gap-3">
          <button
            onClick={() => navigate('/personal-cabinet')}
            className="text-neutral-400 hover:text-black"
          >
            &larr;
          </button>
          <div>
            <h1 className="text-sm font-medium">{result.position}</h1>
            {result.company && <p className="text-xs text-neutral-400">{result.company}</p>}
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-8">
        <div className="text-center mb-10">
          <div className="text-5xl font-normal mb-1">{result.score}</div>
          <p className="text-xs text-neutral-400 uppercase tracking-wide">Overall Score</p>
          {result.assessment?.recommendation && (
            <p className="mt-3 text-sm text-neutral-600">
              {result.assessment.recommendation}
            </p>
          )}
        </div>

        {result.assessment && (
          <div className="grid grid-cols-5 gap-3 mb-10 text-center">
            {[
              { label: 'Skills', value: result.assessment.skills_match },
              { label: 'Culture', value: result.assessment.cultural_fit },
              { label: 'Comm', value: result.assessment.communication },
              { label: 'Motiv', value: result.assessment.motivation },
              { label: 'Exp', value: result.assessment.experience_relevance },
            ].map((metric) => (
              <div key={metric.label}>
                <div className="text-xl font-normal">{metric.value}</div>
                <div className="text-xs text-neutral-400">{metric.label}</div>
              </div>
            ))}
          </div>
        )}

        {result.assessment?.summary && (
          <div className="mb-8">
            <h2 className="text-xs text-neutral-400 uppercase tracking-wide mb-2">Summary</h2>
            <p className="text-sm text-neutral-600 leading-relaxed">{result.assessment.summary}</p>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {result.assessment?.strengths && result.assessment.strengths.length > 0 && (
            <div>
              <h2 className="text-xs text-neutral-400 uppercase tracking-wide mb-2">Strengths</h2>
              <ul className="space-y-1.5">
                {result.assessment.strengths.map((strength: string, index: number) => (
                  <li key={index} className="text-sm text-neutral-600 flex items-start gap-2">
                    <span className="text-neutral-300">+</span>
                    {strength}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {result.assessment?.concerns && result.assessment.concerns.length > 0 && (
            <div>
              <h2 className="text-xs text-neutral-400 uppercase tracking-wide mb-2">Areas to Improve</h2>
              <ul className="space-y-1.5">
                {result.assessment.concerns.map((concern: string, index: number) => (
                  <li key={index} className="text-sm text-neutral-600 flex items-start gap-2">
                    <span className="text-neutral-300">-</span>
                    {concern}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {result.conversation && result.conversation.length > 0 && (
          <div className="border-t border-neutral-200 pt-6">
            <button
              onClick={() => setShowTranscript(!showTranscript)}
              className="text-xs text-neutral-500 hover:text-black"
            >
              {showTranscript ? 'Hide' : 'Show'} Transcript ({result.conversation.length})
            </button>

            {showTranscript && (
              <div className="mt-5 space-y-4">
                {result.conversation.map((message: { role: string; content: string }, index: number) => (
                  <div key={index} className="flex gap-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-xs ${
                      message.role === 'user' ? 'bg-black text-white' : 'bg-neutral-100 text-neutral-500'
                    }`}>
                      {message.role === 'user' ? 'Y' : 'I'}
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-neutral-400 mb-0.5">
                        {message.role === 'user' ? 'You' : 'Interviewer'}
                      </p>
                      <p className="text-sm text-neutral-600 leading-relaxed">{message.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="mt-10 pt-6 border-t border-neutral-200">
          <button
            onClick={() => navigate('/personal-cabinet')}
            className="w-full py-2.5 bg-black text-white text-sm hover:bg-neutral-800"
          >
            Back to Dashboard
          </button>
        </div>
      </main>
    </div>
  )
}

export default InterviewResultPage
