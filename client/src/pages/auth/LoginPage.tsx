import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../context/AuthContext';

interface LoginPageProps {
  user_role: 'candidate' | 'recruiter'
}

const LoginPage: React.FC<LoginPageProps> = ({ user_role = 'candidate' }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isLoading) return;

    setIsLoading(true);
    setError('');

    try {
      await login({ email, password });

      // Redirect based on user role
      if (user_role === 'recruiter') {
        navigate('/personal-cabinet/recruiter');
      } else {
        navigate('/personal-cabinet');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-4">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute bottom-40 -left-60 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute -bottom-40 left-1/2 w-60 h-60 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Login Card Container */}
      <div className="z-10 w-full max-w-sm">
        <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-8 shadow-lg text-center">
          <h2 className="text-3xl font-bold mb-6 text-white">Log In</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={user_role === 'recruiter' ? 'Corporate email' : 'Email'}
              required
              disabled={isLoading}
              className="w-full px-4 py-3 rounded-xl bg-white/20 text-white placeholder-white/70 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              disabled={isLoading}
              className="w-full px-4 py-3 rounded-xl bg-white/20 text-white placeholder-white/70 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              type="submit"
              disabled={isLoading}
              className={`mt-4 w-full px-6 py-3 font-semibold rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500
                ${isLoading ? 'bg-purple-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'}`
              }
            >
              {isLoading ? (
                <div className="flex justify-center items-center space-x-2">
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Logging In...</span>
                </div>
              ) : (
                'Log In'
              )}
            </button>
          </form>
          <div className="mt-4 text-sm">
            <a href="/placeholder" className="text-white/80 hover:underline">
              Forgot password?
            </a>
          </div>
          { user_role === 'candidate' ? <div className="mt-4 text-sm">
            <a href="/signup/candidate" className="text-white/80 hover:underline">
              Don't have an account? <span className="text-purple-400">Sign up</span>
            </a>
          </div>
          : <div className="mt-4 text-sm">
              <a href="/signup/recruiter" className="text-white/80 hover:underline">
                Don't have an account? <span className="text-purple-400">Sign up</span>
              </a>
            </div>
          }
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
