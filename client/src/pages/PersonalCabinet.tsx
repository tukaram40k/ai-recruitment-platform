import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router'
import { useAuth } from '../context/useAuth'
import api from '../services/api'
import type { Interview, TOTPSetupResponse } from '../types'

interface PersonalCabinetProps {
  user_role: 'candidate' | 'recruiter'
}

const PersonalCabinet: React.FC<PersonalCabinetProps> = ({ user_role }) => {
  const [interviews, setInterviews] = useState<Interview[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showNewInterviewModal, setShowNewInterviewModal] = useState(false)
  const [showSettingsModal, setShowSettingsModal] = useState(false)
  const [newPosition, setNewPosition] = useState('')
  const [newCompany, setNewCompany] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  
  // TOTP Setup state
  const [totpSetup, setTotpSetup] = useState<TOTPSetupResponse | null>(null)
  const [totpCode, setTotpCode] = useState('')
  const [totpError, setTotpError] = useState('')
  const [isSettingUpTOTP, setIsSettingUpTOTP] = useState(false)
  const [isConfirmingTOTP, setIsConfirmingTOTP] = useState(false)
  const [isDisablingTOTP, setIsDisablingTOTP] = useState(false)
  const [showDisableConfirm, setShowDisableConfirm] = useState(false)
  const [disableCode, setDisableCode] = useState('')

  const { user, logout, setupTOTP, confirmTOTP, disableTOTP } = useAuth()
  const navigate = useNavigate()

  const loadInterviews = useCallback(async () => {
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
  }, [user_role])

  useEffect(() => {
    loadInterviews()
  }, [user_role, loadInterviews])

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

  const handleSetupTOTP = async () => {
    setIsSettingUpTOTP(true)
    setTotpError('')
    try {
      const setup = await setupTOTP()
      setTotpSetup(setup)
    } catch (error) {
      setTotpError('Failed to start setup. Please try again.')
    } finally {
      setIsSettingUpTOTP(false)
    }
  }

  const handleConfirmTOTP = async () => {
    if (totpCode.length !== 6) {
      setTotpError('Please enter a 6-digit code')
      return
    }
    
    setIsConfirmingTOTP(true)
    setTotpError('')
    try {
      await confirmTOTP({ code: totpCode })
      setTotpSetup(null)
      setTotpCode('')
    } catch (error) {
      setTotpError('Invalid code. Please try again.')
    } finally {
      setIsConfirmingTOTP(false)
    }
  }

  const handleDisableTOTP = async () => {
    if (disableCode.length !== 6) {
      setTotpError('Please enter a 6-digit code')
      return
    }
    
    setIsDisablingTOTP(true)
    setTotpError('')
    try {
      await disableTOTP({ code: disableCode })
      setShowDisableConfirm(false)
      setDisableCode('')
    } catch (error) {
      setTotpError('Invalid code. Please try again.')
    } finally {
      setIsDisablingTOTP(false)
    }
  }

  const handleCancelSetup = () => {
    setTotpSetup(null)
    setTotpCode('')
    setTotpError('')
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
      <header className="border-b border-neutral-200">
        <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 bg-black rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-medium">
                {(user?.name || 'U').charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium">{user?.name || 'User'}</p>
              <p className="text-xs text-neutral-400 capitalize">{user_role}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowSettingsModal(true)}
              className="text-xs text-neutral-500 hover:text-black"
            >
              Settings
            </button>
            <button
              onClick={handleLogout}
              className="text-xs text-neutral-500 hover:text-black"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex gap-10 mb-8 pb-8 border-b border-neutral-200">
          <div>
            <p className="text-3xl font-normal">{interviews.length}</p>
            <p className="text-xs text-neutral-400 mt-1">Total</p>
          </div>
          <div>
            <p className="text-3xl font-normal">{completedInterviews.length}</p>
            <p className="text-xs text-neutral-400 mt-1">Completed</p>
          </div>
          {user_role === 'candidate' && (
            <div>
              <p className="text-3xl font-normal">{averageScore}</p>
              <p className="text-xs text-neutral-400 mt-1">Avg Score</p>
            </div>
          )}
        </div>

        <div className="flex justify-between items-center mb-5">
          <h2 className="text-sm font-medium">
            {user_role === 'candidate' ? 'My Interviews' : 'All Candidates'}
          </h2>
          <div className="flex gap-3">
            {user_role === 'recruiter' && (
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="px-3 py-1.5 border border-neutral-200 text-sm focus:outline-none focus:border-black w-48"
              />
            )}
            {user_role === 'candidate' && (
              <button
                onClick={() => setShowNewInterviewModal(true)}
                className="px-4 py-1.5 bg-black text-white text-sm hover:bg-neutral-800"
              >
                + New Interview
              </button>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredInterviews.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-sm text-neutral-400">No interviews found</p>
            {user_role === 'candidate' && (
              <button
                onClick={() => setShowNewInterviewModal(true)}
                className="mt-3 text-sm text-black underline hover:no-underline"
              >
                Start your first interview
              </button>
            )}
          </div>
        ) : (
          <div className="border border-neutral-200">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50">
                  {user_role === 'recruiter' && (
                    <th className="px-4 py-2.5 text-left text-xs font-medium text-neutral-500">Candidate</th>
                  )}
                  <th className="px-4 py-2.5 text-left text-xs font-medium text-neutral-500">Position</th>
                  <th className="px-4 py-2.5 text-left text-xs font-medium text-neutral-500">Company</th>
                  <th className="px-4 py-2.5 text-left text-xs font-medium text-neutral-500">Status</th>
                  <th className="px-4 py-2.5 text-left text-xs font-medium text-neutral-500">Score</th>
                  <th className="px-4 py-2.5 text-left text-xs font-medium text-neutral-500">Date</th>
                  <th className="px-4 py-2.5"></th>
                </tr>
              </thead>
              <tbody>
                {filteredInterviews.map((interview) => (
                  <tr key={interview.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                    {user_role === 'recruiter' && (
                      <td className="px-4 py-3 text-sm">{interview.candidate_name || '-'}</td>
                    )}
                    <td className="px-4 py-3 text-sm font-medium">{interview.position}</td>
                    <td className="px-4 py-3 text-sm text-neutral-500">{interview.company || '-'}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 ${
                        interview.status === 'completed'
                          ? 'bg-black text-white'
                          : interview.status === 'in_progress'
                          ? 'bg-neutral-200 text-neutral-600'
                          : 'border border-neutral-300 text-neutral-500'
                      }`}>
                        {interview.status === 'in_progress' ? 'In Progress' : interview.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {interview.status === 'completed' && interview.score ? (
                        <span className="font-medium">{interview.score}</span>
                      ) : (
                        <span className="text-neutral-300">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-neutral-400">
                      {interview.created_at
                        ? new Date(interview.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric'
                          })
                        : '-'}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleViewInterview(interview)}
                        className="text-xs text-neutral-500 hover:text-black underline"
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

      {showNewInterviewModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-sm p-6">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-sm font-medium">New Interview</h2>
              <button
                onClick={() => setShowNewInterviewModal(false)}
                className="text-neutral-400 hover:text-black text-lg"
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleCreateInterview}>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-neutral-500 mb-1.5">Position *</label>
                  <input
                    type="text"
                    value={newPosition}
                    onChange={(e) => setNewPosition(e.target.value)}
                    placeholder="e.g., Software Engineer"
                    required
                    className="w-full px-3 py-2.5 border border-neutral-200 text-sm focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="block text-xs text-neutral-500 mb-1.5">Company</label>
                  <input
                    type="text"
                    value={newCompany}
                    onChange={(e) => setNewCompany(e.target.value)}
                    placeholder="e.g., Google"
                    className="w-full px-3 py-2.5 border border-neutral-200 text-sm focus:outline-none focus:border-black"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-5">
                <button
                  type="button"
                  onClick={() => setShowNewInterviewModal(false)}
                  className="flex-1 py-2.5 border border-neutral-200 text-sm hover:bg-neutral-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="flex-1 py-2.5 bg-black text-white text-sm hover:bg-neutral-800 disabled:bg-neutral-300"
                >
                  {isCreating ? 'Starting...' : 'Start'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showSettingsModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-sm font-medium">Settings</h2>
              <button
                onClick={() => {
                  setShowSettingsModal(false)
                  handleCancelSetup()
                  setShowDisableConfirm(false)
                  setDisableCode('')
                }}
                className="text-neutral-400 hover:text-black text-lg"
              >
                &times;
              </button>
            </div>

            <div className="space-y-6">
              {/* Account Info */}
              <div>
                <h3 className="text-xs text-neutral-400 uppercase tracking-wide mb-3">Account</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-neutral-500">Name</span>
                    <span className="text-sm">{user?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-neutral-500">Email</span>
                    <span className="text-sm">{user?.email}</span>
                  </div>
                </div>
              </div>

              {/* Security */}
              <div className="border-t border-neutral-200 pt-5">
                <h3 className="text-xs text-neutral-400 uppercase tracking-wide mb-3">Security</h3>
                
                {/* 2FA Status */}
                <div className="mb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Two-Factor Authentication</p>
                      <p className="text-xs text-neutral-400 mt-0.5">
                        Use Google Authenticator for extra security
                      </p>
                    </div>
                    <span className={`text-xs px-2 py-1 ${
                      user?.totp_confirmed
                        ? 'bg-green-100 text-green-700'
                        : 'bg-neutral-100 text-neutral-500'
                    }`}>
                      {user?.totp_confirmed ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                </div>

                {totpError && (
                  <div className="mb-4 p-3 border border-red-200 bg-red-50 text-sm text-red-600">
                    {totpError}
                  </div>
                )}

                {/* If TOTP not set up */}
                {!user?.totp_confirmed && !totpSetup && (
                  <button
                    onClick={handleSetupTOTP}
                    disabled={isSettingUpTOTP}
                    className="w-full py-2.5 bg-black text-white text-sm hover:bg-neutral-800 disabled:bg-neutral-300"
                  >
                    {isSettingUpTOTP ? 'Loading...' : 'Set up Google Authenticator'}
                  </button>
                )}

                {/* QR Code Setup */}
                {totpSetup && (
                  <div className="border border-neutral-200 p-4">
                    <p className="text-sm font-medium mb-3">Scan QR Code</p>
                    <p className="text-xs text-neutral-500 mb-4">
                      Open Google Authenticator app and scan this QR code:
                    </p>
                    
                    <div className="flex justify-center mb-4">
                      <img 
                        src={`data:image/png;base64,${totpSetup.qr_code}`} 
                        alt="QR Code for Google Authenticator"
                        className="w-48 h-48"
                      />
                    </div>

                    <div className="mb-4 p-3 bg-neutral-50 border border-neutral-200">
                      <p className="text-xs text-neutral-500 mb-1">Or enter this code manually:</p>
                      <p className="text-sm font-mono tracking-wider select-all">{totpSetup.secret}</p>
                    </div>

                    <p className="text-xs text-neutral-500 mb-3">
                      Enter the 6-digit code from the app to confirm:
                    </p>

                    <input
                      type="text"
                      value={totpCode}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '').slice(0, 6)
                        setTotpCode(val)
                      }}
                      placeholder="000000"
                      maxLength={6}
                      className="w-full px-3 py-2.5 border border-neutral-200 text-center text-lg tracking-widest font-mono focus:outline-none focus:border-black mb-4"
                    />

                    <div className="flex gap-3">
                      <button
                        onClick={handleCancelSetup}
                        className="flex-1 py-2.5 border border-neutral-200 text-sm hover:bg-neutral-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleConfirmTOTP}
                        disabled={isConfirmingTOTP || totpCode.length !== 6}
                        className="flex-1 py-2.5 bg-black text-white text-sm hover:bg-neutral-800 disabled:bg-neutral-300"
                      >
                        {isConfirmingTOTP ? 'Verifying...' : 'Confirm'}
                      </button>
                    </div>
                  </div>
                )}

                {/* Disable TOTP */}
                {user?.totp_confirmed && !showDisableConfirm && (
                  <button
                    onClick={() => setShowDisableConfirm(true)}
                    className="w-full py-2.5 border border-red-200 text-red-600 text-sm hover:bg-red-50"
                  >
                    Disable Two-Factor Authentication
                  </button>
                )}

                {/* Disable Confirmation */}
                {showDisableConfirm && (
                  <div className="border border-red-200 p-4 bg-red-50/50">
                    <p className="text-sm font-medium text-red-700 mb-2">Disable 2FA?</p>
                    <p className="text-xs text-neutral-500 mb-4">
                      Enter your current authenticator code to confirm:
                    </p>

                    <input
                      type="text"
                      value={disableCode}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '').slice(0, 6)
                        setDisableCode(val)
                      }}
                      placeholder="000000"
                      maxLength={6}
                      className="w-full px-3 py-2.5 border border-neutral-200 text-center text-lg tracking-widest font-mono focus:outline-none focus:border-black mb-4"
                    />

                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          setShowDisableConfirm(false)
                          setDisableCode('')
                          setTotpError('')
                        }}
                        className="flex-1 py-2.5 border border-neutral-200 text-sm hover:bg-neutral-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleDisableTOTP}
                        disabled={isDisablingTOTP || disableCode.length !== 6}
                        className="flex-1 py-2.5 bg-red-600 text-white text-sm hover:bg-red-700 disabled:bg-neutral-300"
                      >
                        {isDisablingTOTP ? 'Disabling...' : 'Disable'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={() => {
                  setShowSettingsModal(false)
                  handleCancelSetup()
                  setShowDisableConfirm(false)
                  setDisableCode('')
                }}
                className="w-full py-2.5 border border-neutral-200 text-sm hover:bg-neutral-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PersonalCabinet
