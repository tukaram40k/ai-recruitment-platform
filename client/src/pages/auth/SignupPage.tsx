import React, { useState } from 'react'
import { useNavigate } from 'react-router'
import { useAuth } from '../../context/AuthContext'

interface SignupPageProps {
  user_role: 'candidate' | 'recruiter'
}

const SignupPage: React.FC<SignupPageProps> = ({ user_role = 'candidate' }) => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [password2, setPassword2] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const navigate = useNavigate()
  const { register } = useAuth()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()

    if (isLoading) return

    if (password !== password2) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      await register({
        name,
        email,
        password,
        role: user_role === 'recruiter' ? 'ROLE_RECRUITER' : 'ROLE_CANDIDATE'
      })

      if (user_role === 'recruiter') {
        navigate('/personal-cabinet/recruiter')
      } else {
        navigate('/personal-cabinet')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <a href="/" className="text-lg font-medium text-black">RecruitAI</a>
        </div>

        <h1 className="text-2xl font-light text-black text-center mb-8">
          {user_role === 'recruiter' ? 'Create recruiter account' : 'Create your account'}
        </h1>

        {error && (
          <div className="mb-6 p-3 border border-red-200 bg-red-50 text-red-600 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-2">
              {user_role === 'recruiter' ? 'Company / Name' : 'Full Name'}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={user_role === 'recruiter' ? 'Acme Inc.' : 'John Doe'}
              required
              disabled={isLoading}
              className="w-full px-4 py-3 border border-gray-300 text-sm focus:outline-none focus:border-black transition-colors disabled:bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={user_role === 'recruiter' ? 'hr@company.com' : 'you@example.com'}
              required
              disabled={isLoading}
              className="w-full px-4 py-3 border border-gray-300 text-sm focus:outline-none focus:border-black transition-colors disabled:bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={isLoading}
              className="w-full px-4 py-3 border border-gray-300 text-sm focus:outline-none focus:border-black transition-colors disabled:bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-2">Confirm Password</label>
            <input
              type="password"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              placeholder="••••••••"
              required
              disabled={isLoading}
              className="w-full px-4 py-3 border border-gray-300 text-sm focus:outline-none focus:border-black transition-colors disabled:bg-gray-50"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-black text-white text-sm font-medium hover:bg-gray-800 transition-colors disabled:bg-gray-400"
          >
            {isLoading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{' '}
          <a
            href={user_role === 'recruiter' ? '/login/recruiter' : '/login/candidate'}
            className="text-black underline hover:no-underline"
          >
            Sign in
          </a>
        </div>

        <div className="mt-4 text-center">
          <a href="/login" className="text-sm text-gray-400 hover:text-gray-600">
            ← Back to role selection
          </a>
        </div>
      </div>
    </div>
  )
}

export default SignupPage
