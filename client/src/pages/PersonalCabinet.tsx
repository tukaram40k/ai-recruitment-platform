import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { User, LogOut, Plus, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import type { Interview } from '../types'

interface PersonalCabinetProps {
  user_role: 'candidate' | 'recruiter'
}

const PersonalCabinet: React.FC<PersonalCabinetProps> = ({ user_role }) => {
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

  const filteredInterviews = interviews.filter(interview => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      interview.position.toLowerCase().includes(query) ||
      interview.company?.toLowerCase().includes(query) ||
      interview.candidate_name?.toLowerCase().includes(query)
    )
  })

  const completedInterviews = interviews.filter(i => i.status === 'completed')
  const averageScore = completedInterviews.length > 0
    ? Math.round(completedInterviews.reduce((acc, i) => acc + (i.score || 0), 0) / completedInterviews.length)
    : 0

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="font-medium text-black">{user?.name || 'User'}</p>
              <p className="text-xs text-gray-500 capitalize">{user_role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-black transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="flex gap-12 mb-8 pb-8 border-b border-gray-200">
          <div>
            <p className="text-4xl font-light text-black">{interviews.length}</p>
            <p className="text-xs text-gray-500 uppercase tracking-wide mt-1">Total Interviews</p>
          </div>
          <div>
            <p className="text-4xl font-light text-black">{completedInterviews.length}</p>
            <p className="text-xs text-gray-500 uppercase tracking-wide mt-1">Completed</p>
          </div>
          {user_role === 'candidate' && (
            <div>
              <p className="text-4xl font-light text-black">{averageScore}</p>
              <p className="text-xs text-gray-500 uppercase tracking-wide mt-1">Avg Score</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-medium text-black">
            {user_role === 'candidate' ? 'My Interviews' : 'All Candidates'}
          </h2>
          <div className="flex gap-3">
            {user_role === 'recruiter' && (
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="px-4 py-2 border border-gray-300 text-sm focus:outline-none focus:border-black transition-colors"
              />
            )}
            {user_role === 'candidate' && (
              <button
                onClick={() => setShowNewInterviewModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-black text-white text-sm font-medium hover:bg-gray-800 transition-colors"
              >
                <Plus className="w-4 h-4" />
                New Interview
              </button>
            )}
          </div>
        </div>

        {/* Interview List */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredInterviews.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No interviews found</p>
            {user_role === 'candidate' && (
              <button
                onClick={() => setShowNewInterviewModal(true)}
                className="mt-4 text-black underline hover:no-underline text-sm"
              >
                Start your first interview
              </button>
            )}
          </div>
        ) : (
          <div className="border border-gray-200">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  {user_role === 'recruiter' && (
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Candidate</th>
                  )}
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Position</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Company</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Score</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Date</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {filteredInterviews.map((interview) => (
                  <tr key={interview.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    {user_role === 'recruiter' && (
                      <td className="px-4 py-4 text-sm text-black">{interview.candidate_name || '-'}</td>
                    )}
                    <td className="px-4 py-4 text-sm text-black font-medium">{interview.position}</td>
                    <td className="px-4 py-4 text-sm text-gray-600">{interview.company || '-'}</td>
                    <td className="px-4 py-4">
                      <span className={`text-xs px-2 py-1 ${
                        interview.status === 'completed'
                          ? 'bg-black text-white'
                          : interview.status === 'in_progress'
                          ? 'bg-gray-200 text-gray-700'
                          : 'bg-white border border-gray-300 text-gray-600'
                      }`}>
                        {interview.status === 'in_progress' ? 'In Progress' : interview.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm">
                      {interview.status === 'completed' && interview.score ? (
                        <span className="font-medium text-black">{interview.score}</span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500">
                      {interview.created_at
                        ? new Date(interview.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric'
                          })
                        : '-'}
                    </td>
                    <td className="px-4 py-4">
                      <button
                        onClick={() => handleViewInterview(interview)}
                        className="text-sm text-gray-600 hover:text-black underline"
                      >
                        {interview.status === 'completed' ? 'View' : interview.status === 'in_progress' ? 'Continue' : 'Start'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* New Interview Modal */}
      {showNewInterviewModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-medium text-black">New Interview</h2>
              <button
                onClick={() => setShowNewInterviewModal(false)}
                className="p-1 hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateInterview}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Position *</label>
                  <input
                    type="text"
                    value={newPosition}
                    onChange={(e) => setNewPosition(e.target.value)}
                    placeholder="e.g., Software Engineer"
                    required
                    className="w-full px-4 py-3 border border-gray-300 text-sm focus:outline-none focus:border-black transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Company</label>
                  <input
                    type="text"
                    value={newCompany}
                    onChange={(e) => setNewCompany(e.target.value)}
                    placeholder="e.g., Google"
                    className="w-full px-4 py-3 border border-gray-300 text-sm focus:outline-none focus:border-black transition-colors"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowNewInterviewModal(false)}
                  className="flex-1 py-3 border border-gray-300 text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="flex-1 py-3 bg-black text-white text-sm font-medium hover:bg-gray-800 transition-colors disabled:bg-gray-400"
                >
                  {isCreating ? 'Starting...' : 'Start Interview'}
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
