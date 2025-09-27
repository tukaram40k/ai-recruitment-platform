import React, { useState } from 'react';

interface SignupPageProps {
  user_role: 'candidate' | 'recruiter'
}

const SignupPage: React.FC<SignupPageProps> = ({ user_role = 'candidate' }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');

  const handleSignup = (e: any) => {
    e.preventDefault();
    // логика логина, кинуть емаил и пароль на сервер

    if (password !== password2) {
      alert('Passwords do not match!');
      return;
    }

    console.log('Attempting to log in with:', {
      role: user_role,
      email: email,
      password: password
    });
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-4">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute bottom-40 -left-60 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute -bottom-40 left-1/2 w-60 h-60 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Signup Card Container */}
      <div className="z-10 w-full max-w-sm">
        <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-8 shadow-lg text-center">
          <h2 className="text-3xl font-bold mb-6 text-white">Sign Up</h2>
          <form onSubmit={handleSignup} className="flex flex-col gap-4">
            {/* Corporation name for admins */}
            {user_role === 'recruiter' ? <input
              type="text"
              placeholder="Corporation name"
              required
              className="w-full px-4 py-3 rounded-xl bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-purple-500"
            /> : null}
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={user_role === 'recruiter' ? 'Corporate email' : 'Email'}
              required
              className="w-full px-4 py-3 rounded-xl bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="w-full px-4 py-3 rounded-xl bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <input
              type="password"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              placeholder="Confirm password"
              required
              className="w-full px-4 py-3 rounded-xl bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              type="submit"
              className="mt-4 w-full px-6 py-3 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              Sign In
            </button>
          </form>
          { user_role === 'candidate' ? <div className="mt-4 text-sm">
            <a href="/login/candidate" className="text-white/80 hover:underline">
              Already have an account? <span className="text-purple-400">Log in</span>
            </a>
          </div>
          : <div className="mt-4 text-sm">
              <a href="/login/recruiter" className="text-white/80 hover:underline">
                Already have an account? <span className="text-purple-400">Log in</span>
              </a>
            </div>
          }
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
