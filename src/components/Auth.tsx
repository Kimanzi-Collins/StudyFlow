import { useState } from 'react';
import { supabase, isDemoMode } from '../lib/supabase';
import { useStore } from '../store/useStore';
import { BookOpen, Mail, Lock, User, AlertCircle, Sparkles } from 'lucide-react';

export function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  
  const { setUser, setDemoMode } = useStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      if (isDemoMode) {
        setUser({
          id: 'demo-user',
          email: email || 'demo@studyflow.app',
          name: name || 'Demo User'
        });
        setDemoMode(true);
        return;
      }

      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) throw error;
        
        if (data.user) {
          setUser({
            id: data.user.id,
            email: data.user.email || '',
            name: data.user.user_metadata?.name
          });
        }
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { name }
          }
        });
        
        if (error) throw error;
        
        if (data.user && !data.session) {
          setMessage('Check your email for the confirmation link!');
        } else if (data.user) {
          setUser({
            id: data.user.id,
            email: data.user.email || '',
            name: name
          });
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    setUser({
      id: 'demo-user',
      email: 'demo@studyflow.app',
      name: 'Demo User'
    });
    setDemoMode(true);
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
      {/* Animated Background - Futuristic Library */}
      <div 
        className="absolute inset-0 animate-gradient"
        style={{
          backgroundImage: `
            url('https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1920&q=80'),
            linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)
          `,
          backgroundSize: 'cover, 200% 200%',
          backgroundPosition: 'center',
          backgroundBlendMode: 'overlay'
        }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-indigo-900/70 to-purple-900/80" />
      
      {/* Floating Orbs - positioned away from edges */}
      <div className="absolute top-20 left-10 w-48 h-48 md:w-72 md:h-72 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-56 h-56 md:w-80 md:h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/4 w-40 h-40 md:w-64 md:h-64 bg-blue-500/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 glass rounded-3xl mb-4 shadow-2xl">
            <BookOpen className="w-10 h-10 text-white drop-shadow-lg" />
          </div>
          <h1 className="text-4xl font-extrabold text-white text-shadow-lg tracking-tight">StudyFlow</h1>
          <p className="text-purple-200 mt-2 text-lg font-medium text-shadow">Track smarter, learn faster</p>
        </div>

        {/* Auth Card - Liquid Glass */}
        <div className="glass-card rounded-3xl p-8 shadow-2xl">
          {/* Tab Switcher */}
          <div className="flex mb-8 p-1.5 glass rounded-2xl">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-3 text-sm font-semibold rounded-xl transition-all duration-300 ${
                isLogin 
                  ? 'bg-white text-purple-900 shadow-lg' 
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-3 text-sm font-semibold rounded-xl transition-all duration-300 ${
                !isLogin 
                  ? 'bg-white text-purple-900 shadow-lg' 
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div>
                <label className="block text-sm text-white/90 mb-2 font-medium">Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 input-glass rounded-xl text-white font-medium"
                    placeholder="Your name"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm text-white/90 mb-2 font-medium">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 input-glass rounded-xl text-white font-medium"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-white/90 mb-2 font-medium">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 input-glass rounded-xl text-white font-medium"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-3 text-white text-sm bg-red-500/30 backdrop-blur-sm p-4 rounded-xl border border-red-400/30">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span className="font-medium">{error}</span>
              </div>
            )}

            {message && (
              <div className="text-white text-sm bg-green-500/30 backdrop-blur-sm p-4 rounded-xl border border-green-400/30 font-medium">
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 btn-solid rounded-xl text-lg disabled:opacity-50 disabled:transform-none"
            >
              {loading ? 'Loading...' : isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/20">
            <button
              onClick={handleDemoLogin}
              className="w-full py-4 btn-glass rounded-xl flex items-center justify-center gap-3 text-lg"
            >
              <Sparkles className="w-5 h-5" />
              Try Demo Mode
            </button>
            <p className="text-center text-white/60 text-sm mt-3 font-medium">
              No account needed — explore all features instantly
            </p>
          </div>
        </div>

        {/* Supabase Setup Info */}
        {isDemoMode && (
          <div className="mt-6 glass rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
              🚀 Deploying with Supabase?
            </h3>
            <p className="text-white/80 text-sm mb-3">
              Set these environment variables:
            </p>
            <code className="block p-3 bg-black/30 rounded-xl text-sm text-purple-200 font-mono border border-white/10">
              VITE_SUPABASE_URL=your-url<br/>
              VITE_SUPABASE_ANON_KEY=your-key
            </code>
          </div>
        )}
      </div>
    </div>
  );
}
