import React, { useState } from 'react'
import { useNavigate } from 'react-router'
import { useAuth } from '../../context/AuthContext'

interface LoginPageProps {
  user_role: 'candidate' | 'recruiter'
}

const LoginPage: React.FC<LoginPageProps> = ({ user_role = 'candidate' }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const navigate = useNavigate()
  const { login } = useAuth()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (isLoading) return

    setIsLoading(true)
    setError('')

    try {
      await login({ email, password })

      if (user_role === 'recruiter') {
        navigate('/personal-cabinet/recruiter')
      } else {
        navigate('/personal-cabinet')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <a href="/" className="text-lg font-medium text-black">RecruitAI</a>
        </div>

        <h1 className="text-2xl font-light text-black text-center mb-8">
          {user_role === 'recruiter' ? 'Recruiter Login' : 'Sign in to your account'}
        </h1>

        {error && (
          <div className="mb-6 p-3 border border-red-200 bg-red-50 text-red-600 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={user_role === 'recruiter' ? 'corporate@company.com' : 'you@example.com'}
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
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-black text-white text-sm font-medium hover:bg-gray-800 transition-colors disabled:bg-gray-400"
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          Don't have an account?{' '}
          <a
            href={user_role === 'recruiter' ? '/signup/recruiter' : '/signup/candidate'}
            className="text-black underline hover:no-underline"
          >
            Sign up
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

export default LoginPage
