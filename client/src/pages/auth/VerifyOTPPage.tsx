import React, { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router'
import { useAuth } from '../../context/useAuth'

interface LocationState {
  sessionToken: string
  email: string
  userRole: 'candidate' | 'recruiter'
}

const VerifyOTPPage: React.FC = () => {
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', ''])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const navigate = useNavigate()
  const location = useLocation()
  const { verify2FA } = useAuth()

  const state = location.state as LocationState | null

  useEffect(() => {
    // Redirect if no session token
    if (!state?.sessionToken) {
      navigate('/login')
    }
  }, [state, navigate])

  useEffect(() => {
    // Focus first input on mount
    inputRefs.current[0]?.focus()
  }, [])

  const handleChange = (index: number, value: string) => {
    // Only allow digits
    if (value && !/^\d$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
    setError('')

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }

    // Auto-submit when all digits are entered
    if (value && index === 5) {
      const code = newOtp.join('')
      if (code.length === 6) {
        handleVerify(code)
      }
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').slice(0, 6)
    
    if (!/^\d+$/.test(pastedData)) return

    const newOtp = [...otp]
    for (let i = 0; i < pastedData.length; i++) {
      newOtp[i] = pastedData[i]
    }
    setOtp(newOtp)

    // Focus appropriate input
    const focusIndex = Math.min(pastedData.length, 5)
    inputRefs.current[focusIndex]?.focus()

    // Auto-submit if complete
    if (pastedData.length === 6) {
      handleVerify(pastedData)
    }
  }

  const handleVerify = async (code?: string) => {
    if (!state?.sessionToken) return

    const verificationCode = code || otp.join('')
    if (verificationCode.length !== 6) {
      setError('Please enter all 6 digits')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      await verify2FA({
        session_token: state.sessionToken,
        code: verificationCode,
      })

      // Navigate based on user role
      if (state.userRole === 'recruiter') {
        navigate('/personal-cabinet/recruiter')
      } else {
        navigate('/personal-cabinet')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid code. Please try again.')
      setOtp(['', '', '', '', '', ''])
      inputRefs.current[0]?.focus()
    } finally {
      setIsLoading(false)
    }
  }

  if (!state?.sessionToken) {
    return null
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <a href="/" className="text-base font-medium tracking-tight">RecruitAI</a>
        </div>

        <h1 className="text-xl font-normal text-center mb-2">
          Two-Factor Authentication
        </h1>
        
        <p className="text-sm text-neutral-500 text-center mb-8">
          Enter the 6-digit code from your<br />
          <span className="text-neutral-700 font-medium">Google Authenticator</span> app
        </p>

        {error && (
          <div className="mb-5 p-3 border border-red-200 bg-red-50 text-sm text-red-600 text-center">
            {error}
          </div>
        )}

        <div className="flex justify-center gap-2 mb-8" onPaste={handlePaste}>
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => { inputRefs.current[index] = el }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              disabled={isLoading}
              className="w-12 h-14 text-center text-xl font-semibold border border-neutral-200 focus:outline-none focus:border-black disabled:bg-neutral-50 transition-colors"
              autoComplete="one-time-code"
            />
          ))}
        </div>

        <button
          onClick={() => handleVerify()}
          disabled={isLoading || otp.join('').length !== 6}
          className="w-full py-2.5 bg-black text-white text-sm hover:bg-neutral-800 disabled:bg-neutral-300 transition-colors"
        >
          {isLoading ? 'Verifying...' : 'Verify'}
        </button>

        <div className="mt-6 text-center">
          <p className="text-xs text-neutral-400">
            Open Google Authenticator app on your phone<br />
            and enter the code shown for RecruitAI
          </p>
        </div>

        <div className="mt-6 text-center">
          <a href="/login" className="text-xs text-neutral-400 hover:text-neutral-600">
            &larr; Back to login
          </a>
        </div>
      </div>
    </div>
  )
}

export default VerifyOTPPage
