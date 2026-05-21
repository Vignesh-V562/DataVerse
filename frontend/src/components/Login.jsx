import { supabase } from '../lib/supabaseClient';
import { Sparkles } from 'lucide-react';

export default function Login() {
  const handleGithubLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'github' });
    if (error) console.error('Error logging in with GitHub:', error.message);
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
    if (error) console.error('Error logging in with Google:', error.message);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-dv-bg relative overflow-hidden">
      {/* Ambient Sage Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-sage-600/[0.08] rounded-full blur-[120px] animate-pulse-subtle pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-coral-500/[0.06] rounded-full blur-[120px] pointer-events-none" />

      {/* Login Card */}
      <div className="dv-card w-full max-w-sm p-8 rounded-2xl relative z-10 animate-slide-up">
        {/* Brand */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-5 overflow-hidden">
            <img src="/dataverse-logo.png" alt="DataVerse" className="w-16 h-16 object-contain" />
          </div>
          <h1 className="text-2xl font-bold text-txt-primary mb-1 tracking-tight">Welcome Back</h1>
          <p className="text-txt-secondary text-sm">Sign in to your analytical workspace</p>
        </div>

        {/* Auth Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleGithubLogin}
            className="w-full dv-btn py-3 text-txt-secondary hover:text-txt-primary"
          >
            <svg
              viewBox="0 0 24 24"
              width="16"
              height="16"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4 h-4"
            >
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
            </svg>
            Continue with GitHub
          </button>

          <button
            onClick={handleGoogleLogin}
            className="w-full dv-btn py-3 text-txt-secondary hover:text-txt-primary"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" className="w-4 h-4">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </button>
        </div>

        <p className="mt-8 text-center text-[10px] text-txt-tertiary uppercase tracking-widest">
          DataVerse Enterprise
        </p>
      </div>
    </div>
  );
}
