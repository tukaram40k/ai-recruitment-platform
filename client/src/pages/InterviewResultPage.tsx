import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router'
import { Brain, ArrowLeft, Trophy, CheckCircle, AlertCircle, Star, MessageSquare, User, Bot } from 'lucide-react'
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

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400'
    if (score >= 60) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getRecommendationColor = (recommendation: string) => {
    if (recommendation.toLowerCase().includes('strong yes')) return 'bg-green-500/20 text-green-400 border-green-500/30'
    if (recommendation.toLowerCase().includes('yes')) return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
    if (recommendation.toLowerCase().includes('maybe')) return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
    return 'bg-red-500/20 text-red-400 border-red-500/30'
  }

  const renderScoreBar = (label: string, score: number) => (
    <div className="mb-4">
      <div className="flex justify-between mb-1">
        <span className="text-gray-300 text-sm">{label}</span>
        <span className={`text-sm font-semibold ${getScoreColor(score * 10)}`}>{score}/10</span>
      </div>
      <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${score >= 8 ? 'bg-green-500' : score >= 6 ? 'bg-yellow-500' : 'bg-red-500'}`}
          style={{ width: `${score * 10}%` }}
        />
      </div>
    </div>
  )

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-300">Loading results...</p>
        </div>
      </div>
    )
  }

  if (error || !result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <p className="text-gray-300">{error || 'Results not found'}</p>
          <button
            onClick={() => navigate('/personal-cabinet')}
            className="mt-4 px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="px-6 py-4 border-b border-gray-700/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/personal-cabinet')}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center space-x-2">
              <Brain className="w-8 h-8 text-purple-400" />
              <span className="text-xl font-bold text-white">Interview Results</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6">
        {/* Score Overview */}
        <div className="bg-white/5 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{result.position}</h1>
              {result.company && <p className="text-gray-400">{result.company}</p>}
            </div>
            <div className="text-center">
              <div className={`text-6xl font-bold ${getScoreColor(result.score)}`}>
                {result.score}%
              </div>
              <p className="text-gray-400 mt-2">Overall Score</p>
            </div>
          </div>

          {result.assessment?.recommendation && (
            <div className={`inline-flex items-center px-4 py-2 rounded-full border ${getRecommendationColor(result.assessment.recommendation)}`}>
              <Star className="w-4 h-4 mr-2" />
              {result.assessment.recommendation}
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Detailed Scores */}
          <div className="bg-white/5 backdrop-blur-sm border border-gray-700 rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Performance Breakdown</h2>

            {result.assessment && (
              <>
                {renderScoreBar('Skills Match', result.assessment.skills_match)}
                {renderScoreBar('Cultural Fit', result.assessment.cultural_fit)}
                {renderScoreBar('Communication', result.assessment.communication)}
                {renderScoreBar('Motivation', result.assessment.motivation)}
                {renderScoreBar('Experience Relevance', result.assessment.experience_relevance)}
              </>
            )}
          </div>

          {/* Strengths & Concerns */}
          <div className="space-y-6">
            {result.assessment?.strengths && result.assessment.strengths.length > 0 && (
              <div className="bg-white/5 backdrop-blur-sm border border-gray-700 rounded-2xl p-6">
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                  Key Strengths
                </h2>
                <ul className="space-y-2">
                  {result.assessment.strengths.map((strength, index) => (
                    <li key={index} className="text-gray-300 flex items-start">
                      <span className="text-green-400 mr-2">+</span>
                      {strength}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {result.assessment?.concerns && result.assessment.concerns.length > 0 && (
              <div className="bg-white/5 backdrop-blur-sm border border-gray-700 rounded-2xl p-6">
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <AlertCircle className="w-5 h-5 text-yellow-400 mr-2" />
                  Areas for Improvement
                </h2>
                <ul className="space-y-2">
                  {result.assessment.concerns.map((concern, index) => (
                    <li key={index} className="text-gray-300 flex items-start">
                      <span className="text-yellow-400 mr-2">!</span>
                      {concern}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Summary */}
        {result.assessment?.summary && (
          <div className="bg-white/5 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 mt-6">
            <h2 className="text-xl font-semibold text-white mb-4">Summary</h2>
            <p className="text-gray-300 leading-relaxed">{result.assessment.summary}</p>
          </div>
        )}

        {/* Interview Transcript */}
        {result.conversation && result.conversation.length > 0 && (
          <div className="bg-white/5 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 mt-6">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
              <MessageSquare className="w-5 h-5 text-purple-400 mr-2" />
              Interview Transcript
            </h2>
            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
              {result.conversation.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`flex items-start space-x-3 max-w-[85%] ${
                      message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.role === 'user'
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600'
                          : 'bg-gradient-to-r from-blue-600 to-purple-600'
                      }`}
                    >
                      {message.role === 'user' ? (
                        <User className="w-4 h-4 text-white" />
                      ) : (
                        <Bot className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <div
                      className={`p-3 rounded-xl ${
                        message.role === 'user'
                          ? 'bg-purple-600/20 border border-purple-500/30'
                          : 'bg-white/5 border border-gray-600'
                      }`}
                    >
                      <p className="text-sm text-gray-200 whitespace-pre-wrap">{message.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={() => navigate('/personal-cabinet')}
            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-500 hover:to-pink-500 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </main>
    </div>
  )
}

export default InterviewResultPage
