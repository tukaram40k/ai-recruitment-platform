import React, { useState } from 'react'
import { Brain, User, Settings, LogOut, Plus, Trophy, Calendar, TrendingUp, Search, Filter } from 'lucide-react'

interface Interview {
  id: number
  company?: string
  position: string
  score: number
  date: string
  candidateName?: string
}

interface PersonalCabinetProps {
  user_role: 'candidate' | 'recruiter'
}

const PersonalCabinet: React.FC<PersonalCabinetProps> = ({ user_role }) => {
  const [activeTab, setActiveTab] = useState('dashboard')

  const candidateInterviews: Interview[] = [
    { id: 1, company: 'Google', position: 'Web Developer', score: 85, date: '2025-09-28' },
    { id: 2, company: 'Amazon', position: 'Full Stack Developer', score: 92, date: '2025-09-25' },
    { id: 3, company: 'Linella', position: 'Curatator', score: 59, date: '2025-09-20' },
    { id: 4, company: 'UTM', position: 'Lector Universitar', score: 88, date: '2025-09-15' },
  ]

  const recruiterInterviews: Interview[] = [
    { id: 1, candidateName: 'Sarah Johnson', position: 'Senior Backend Developer', score: 94, date: '2025-09-29' },
    { id: 2, candidateName: 'Michael Chen', position: 'DevOps Engineer', score: 91, date: '2025-09-29' },
    { id: 3, candidateName: 'Emma Williams', position: 'Full Stack Developer', score: 89, date: '2025-09-28' },
    { id: 4, candidateName: 'James Brown', position: 'Frontend Developer', score: 87, date: '2025-09-28' },
    { id: 5, candidateName: 'Lisa Anderson', position: 'Data Engineer', score: 85, date: '2025-09-27' },
    { id: 6, candidateName: 'David Martinez', position: 'Software Architect', score: 82, date: '2025-09-26' },
  ]

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
              {user_role === 'candidate' ? 'John Doe' : 'Jane Smith'}
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

            <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-white/5 transition-all">
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </nav>

          {user_role === 'candidate' && (
            <div className="mt-8 p-4 bg-white/5 backdrop-blur-sm border border-gray-700 rounded-xl">
              <div className="text-center mb-3">
                {/*<Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-2" />*/}
                <p className="text-gray-300 text-sm font-semibold">Average Score</p>
                <p className="text-3xl font-bold text-white">86%</p>
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
            <div className="mb-6">
              <button className="group px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-500 hover:to-pink-500 transform hover:scale-105 transition-all duration-200 shadow-lg">
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

          <div className="grid gap-4">
            {user_role === 'candidate' ? (
              candidateInterviews.map((interview) => (
                <div
                  key={interview.id}
                  className="group p-6 bg-white/5 backdrop-blur-sm border border-gray-700 rounded-2xl hover:bg-white/10 transition-all duration-300"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-semibold text-white">{interview.company}</h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getScoreBgColor(interview.score)} ${getScoreColor(interview.score)}`}>
                          {interview.score}%
                        </span>
                      </div>
                      <p className="text-gray-400 mb-1">{interview.position}</p>
                      <div className="flex items-center space-x-2 text-gray-500 text-sm">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(interview.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                    </div>
                    <button className="px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:border-gray-400 hover:text-white transition-all">
                      View Details
                    </button>
                  </div>
                </div>
              ))
            ) : (
              recruiterInterviews.map((interview) => (
                <div
                  key={interview.id}
                  className="group p-6 bg-white/5 backdrop-blur-sm border border-gray-700 rounded-2xl hover:bg-white/10 transition-all duration-300"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-white">{interview.candidateName}</h3>
                          <p className="text-gray-400 text-sm">{interview.position}</p>
                        </div>
                        <span className={`ml-auto px-3 py-1 rounded-full text-sm font-semibold border ${getScoreBgColor(interview.score)} ${getScoreColor(interview.score)}`}>
                          {interview.score}%
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-500 text-sm ml-13">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(interview.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                    </div>
                    <button className="px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:border-gray-400 hover:text-white transition-all ml-4">
                      Review
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </main>
      </div>

      {/* Background Elements */}
      {/*<div className="fixed inset-0 overflow-hidden pointer-events-none">*/}
      {/*  <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>*/}
      {/*  <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" style={{animationDelay: '2s'}}></div>*/}
      {/*  <div className="absolute -top-40 left-50 w-60 h-60 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-pulse" style={{animationDelay: '4s'}}></div>*/}
      {/*</div>*/}
    </div>
  )
}

export default PersonalCabinet