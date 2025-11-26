import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { Brain, User, Settings, LogOut, Plus, Calendar, TrendingUp, Search, Filter } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import type {Interview} from '../types'

interface PersonalCabinetProps {
  user_role: 'candidate' | 'recruiter'
}

const PersonalCabinet: React.FC<PersonalCabinetProps> = ({ user_role }) => {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [interviews, setInterviews] = useState<Interview[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showNewInterviewModal, setShowNewInterviewModal] = useState(false)
  const [newPosition, setNewPosition] = useState('')
  const [newCompany, setNewCompany] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const { user, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    loadInterviews()
  }, [user_role])

  const loadInterviews = async () => {
    setIsLoading(true)
    try {
      if (user_role === 'candidate') {
        const data = await api.getCandidateInterviews()
        setInterviews(data)
      } else {
        const data = await api.getRecruiterInterviews()
        setInterviews(data)
      }
    } catch (error) {
      console.error('Failed to load interviews:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateInterview = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPosition.trim()) return

    setIsCreating(true)
    try {
      const newInterview = await api.createInterview({
        position: newPosition,
        company: newCompany || undefined
      })
      setInterviews([newInterview, ...interviews])
      setShowNewInterviewModal(false)
      setNewPosition('')
      setNewCompany('')
      navigate(`/interview/${newInterview.id}`)
    } catch (error) {
      console.error('Failed to create interview:', error)
    } finally {
      setIsCreating(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const handleViewInterview = (interview: Interview) => {
    if (interview.status === 'completed') {
      navigate(`/interview/${interview.id}/result`)
    } else if (interview.status === 'pending' || interview.status === 'in_progress') {
      navigate(`/interview/${interview.id}`)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-400'
    if (score >= 80) return 'text-blue-400'
    if (score >= 70) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getScoreBgColor = (score: number) => {
    if (score >= 90) return 'bg-green-500/20 border-green-500/30'
    if (score >= 80) return 'bg-blue-500/20 border-blue-500/30'
    if (score >= 70) return 'bg-yellow-500/20 border-yellow-500/30'
    return 'bg-red-500/20 border-red-500/30'
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs">Completed</span>
      case 'in_progress':
        return <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs">In Progress</span>
      default:
        return <span className="px-2 py-1 bg-gray-500/20 text-gray-400 rounded-full text-xs">Pending</span>
    }
  }

  const filteredInterviews = interviews.filter(interview => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      interview.position.toLowerCase().includes(query) ||
      interview.company?.toLowerCase().includes(query) ||
      interview.candidate_name?.toLowerCase().includes(query)
    )
  })

  const averageScore = interviews.length > 0
    ? Math.round(interviews.filter(i => i.score > 0).reduce((acc, i) => acc + i.score, 0) / interviews.filter(i => i.score > 0).length) || 0
    : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="relative z-10 px-6 py-4 border-b border-gray-700/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Brain className="w-8 h-8 text-purple-400" />
            <span className="text-xl font-bold text-white">RecruitAI</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-300 text-sm capitalize">{user_role} Portal</span>
          </div>
        </div>
      </header>

      <div className="flex max-w-7xl mx-auto">
        {/* Sidebar */}
        <aside className="w-64 min-h-screen p-6 border-r border-gray-700/50 backdrop-blur-sm">
          <div className="mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mb-4 mx-auto">
              <User className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-white text-lg font-semibold text-center">
              {user?.name || 'User'}
            </h2>
            <p className="text-gray-400 text-sm text-center capitalize">{user_role}</p>
          </div>

          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                  : 'text-gray-300 hover:bg-white/5'
              }`}
            >
              <TrendingUp className="w-5 h-5" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === 'settings'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                  : 'text-gray-300 hover:bg-white/5'
              }`}
            >
              <Settings className="w-5 h-5" />
              <span>Settings</span>
            </button>

            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-white/5 transition-all"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </nav>

          {user_role === 'candidate' && (
            <div className="mt-8 p-4 bg-white/5 backdrop-blur-sm border border-gray-700 rounded-xl">
              <div className="text-center mb-3">
                <p className="text-gray-300 text-sm font-semibold">Average Score</p>
                <p className="text-3xl font-bold text-white">{averageScore}%</p>
              </div>
            </div>
          )}
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">
              {user_role === 'candidate' ? 'My Interviews' : 'Recent Interviews'}
            </h1>
            <p className="text-gray-400">
              {user_role === 'candidate'
                ? 'Track your interview history and performance'
                : 'Monitor candidate performance across all interviews'}
            </p>
          </div>

          {user_role === 'candidate' && (
            <div className="mb-6 flex gap-4">
              <button
                onClick={() => setShowNewInterviewModal(true)}
                className="group px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-500 hover:to-pink-500 transform hover:scale-105 transition-all duration-200 shadow-lg"
              >
                <span className="flex items-center space-x-2">
                  <Plus className="w-5 h-5" />
                  <span>Take New Interview</span>
                </span>
              </button>
            </div>
          )}

          {user_role === 'recruiter' && (
            <div className="mb-6 flex gap-4">
              <div className="flex-1 relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search candidates..."
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>
              <button className="px-6 py-3 bg-white/5 border border-gray-700 text-gray-300 rounded-xl hover:bg-white/10 transition-all flex items-center space-x-2">
                <Filter className="w-5 h-5" />
                <span>Filter</span>
              </button>
            </div>
          )}

          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin h-10 w-10 border-4 border-purple-500 border-t-transparent rounded-full"></div>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredInterviews.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-gray-400 text-lg">No interviews found</p>
                  {user_role === 'candidate' && (
                    <button
                      onClick={() => setShowNewInterviewModal(true)}
                      className="mt-4 px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
                    >
                      Start Your First Interview
                    </button>
                  )}
                </div>
              ) : (
                filteredInterviews.map((interview) => (
                  <div
                    key={interview.id}
                    className="group p-6 bg-white/5 backdrop-blur-sm border border-gray-700 rounded-2xl hover:bg-white/10 transition-all duration-300"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          {user_role === 'recruiter' && (
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                              <User className="w-5 h-5 text-white" />
                            </div>
                          )}
                          <div>
                            <h3 className="text-xl font-semibold text-white">
                              {user_role === 'candidate' ? interview.company || 'Interview' : interview.candidate_name}
                            </h3>
                            <p className="text-gray-400 text-sm">{interview.position}</p>
                          </div>
                          {interview.status === 'completed' && interview.score > 0 && (
                            <span className={`ml-auto px-3 py-1 rounded-full text-sm font-semibold border ${getScoreBgColor(interview.score)} ${getScoreColor(interview.score)}`}>
                              {interview.score}%
                            </span>
                          )}
                          {getStatusBadge(interview.status)}
                        </div>
                        <div className="flex items-center space-x-2 text-gray-500 text-sm">
                          <Calendar className="w-4 h-4" />
                          <span>{interview.created_at ? new Date(interview.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleViewInterview(interview)}
                        className="px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:border-gray-400 hover:text-white transition-all ml-4"
                      >
                        {interview.status === 'completed' ? 'View Results' : interview.status === 'in_progress' ? 'Continue' : 'Start'}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </main>
      </div>

      {/* New Interview Modal */}
      {showNewInterviewModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-2xl p-8 w-full max-w-md border border-gray-700">
            <h2 className="text-2xl font-bold text-white mb-6">New Interview</h2>
            <form onSubmit={handleCreateInterview}>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-300 text-sm mb-2">Position *</label>
                  <input
                    type="text"
                    value={newPosition}
                    onChange={(e) => setNewPosition(e.target.value)}
                    placeholder="e.g., Senior Software Engineer"
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 text-sm mb-2">Company (optional)</label>
                  <input
                    type="text"
                    value={newCompany}
                    onChange={(e) => setNewCompany(e.target.value)}
                    placeholder="e.g., Google"
                    className="w-full px-4 py-3 bg-white/10 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>
              <div className="flex gap-4 mt-8">
                <button
                  type="button"
                  onClick={() => setShowNewInterviewModal(false)}
                  className="flex-1 px-6 py-3 border border-gray-600 text-gray-300 rounded-xl hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-500 hover:to-pink-500 transition-colors disabled:opacity-50"
                >
                  {isCreating ? 'Creating...' : 'Start Interview'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default PersonalCabinet
