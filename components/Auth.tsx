import React, { useState } from 'react';
import { supabase } from '../services/supabase';
import { Kanban, Loader2, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';

export const Auth: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [verificationSent, setVerificationSent] = useState(false);

  // Helper to get current URL for the manual copy-paste hint
  const currentUrl = window.location.origin;

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: currentUrl, 
          }
        });
        if (error) throw error;
        setVerificationSent(true);
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    try {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: currentUrl,
            },
        });
        if (error) throw error;
    } catch (err: any) {
        setError(err.message);
    }
  };

  if (verificationSent) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#0f172a] text-slate-100 relative overflow-hidden font-sans">
        {/* Background Gradients */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="w-full max-w-md p-8 bg-slate-900/60 border border-white/10 rounded-2xl backdrop-blur-xl shadow-2xl text-center relative z-10 animate-in fade-in zoom-in-95 duration-300">
          <div className="mx-auto bg-gradient-to-br from-primary to-blue-600 p-4 rounded-full w-fit mb-6 shadow-lg shadow-blue-500/20">
            <Mail className="text-white h-8 w-8" />
          </div>
          <h2 className="text-2xl font-bold mb-3 tracking-tight">Check your email</h2>
          <p className="text-slate-400 text-sm mb-6 leading-relaxed">
            We've sent a confirmation link to <span className="text-slate-200 font-medium">{email}</span>.
            <br />
            Please click the link to activate your account.
          </p>

          <button 
            onClick={() => setVerificationSent(false)}
            className="text-primary hover:text-blue-400 text-sm font-medium flex items-center justify-center gap-2 mx-auto transition-colors"
          >
            <ArrowLeft size={14} /> Back to Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0f172a] text-slate-100 relative overflow-hidden font-sans">
      
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px] pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[128px] pointer-events-none translate-y-1/2" />

      <div className="w-full max-w-md bg-slate-900/60 border border-white/10 rounded-2xl backdrop-blur-xl shadow-2xl overflow-hidden relative z-10 flex flex-col animate-in fade-in duration-500">
        
        {/* Header Section */}
        <div className="px-8 pt-8 pb-6 text-center">
          <div className="flex justify-center mb-6">
             <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-2xl shadow-lg shadow-blue-500/20">
                <Kanban className="text-white h-8 w-8" />
             </div>
          </div>
          
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2 transition-all duration-300">
             {isSignUp ? 'Create an account' : 'Welcome back'}
          </h1>
          <p className="text-slate-400 text-sm transition-all duration-300">
             {isSignUp 
                ? 'Start managing your projects with AI superpowers.' 
                : 'Enter your credentials to access your workspace.'}
          </p>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="px-8">
            <div className="grid grid-cols-2 p-1 bg-slate-950/50 rounded-xl border border-white/5 relative">
                <button 
                    onClick={() => setIsSignUp(false)}
                    className={`
                        relative z-10 py-2.5 text-sm font-medium rounded-lg transition-all duration-200
                        ${!isSignUp ? 'text-white' : 'text-slate-400 hover:text-slate-200'}
                    `}
                >
                    Sign In
                </button>
                <button 
                    onClick={() => setIsSignUp(true)}
                    className={`
                        relative z-10 py-2.5 text-sm font-medium rounded-lg transition-all duration-200
                        ${isSignUp ? 'text-white' : 'text-slate-400 hover:text-slate-200'}
                    `}
                >
                    Sign Up
                </button>
                
                {/* Sliding Background */}
                <div 
                    className={`
                        absolute top-1 bottom-1 w-[calc(50%-4px)] bg-slate-700/80 rounded-lg shadow-sm transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
                        ${isSignUp ? 'translate-x-[calc(100%+4px)]' : 'translate-x-1'}
                    `}
                />
            </div>
        </div>

        {/* Form Section */}
        <div className="p-8 space-y-5">
            <form onSubmit={handleAuth} className="space-y-5">
            <div className="space-y-4">
                <div>
                    <label className="block text-xs font-semibold uppercase text-slate-500 mb-2 ml-1">Email Address</label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Mail className="h-4 w-4 text-slate-500 group-focus-within:text-primary transition-colors" />
                        </div>
                        <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-slate-950/50 border border-slate-700/50 rounded-xl py-3 pl-10 pr-4 text-sm text-slate-100 placeholder-slate-600 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none transition-all"
                        placeholder="name@company.com"
                        required
                        />
                    </div>
                </div>
                
                <div>
                    <label className="block text-xs font-semibold uppercase text-slate-500 mb-2 ml-1">Password</label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <CheckCircle2 className={`h-4 w-4 transition-colors ${password.length > 5 ? 'text-emerald-500' : 'text-slate-500 group-focus-within:text-primary'}`} />
                        </div>
                        <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-slate-950/50 border border-slate-700/50 rounded-xl py-3 pl-10 pr-4 text-sm text-slate-100 placeholder-slate-600 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none transition-all"
                        placeholder="••••••••"
                        required
                        minLength={6}
                        />
                    </div>
                    {isSignUp && (
                        <p className="text-[10px] text-slate-500 mt-1.5 ml-1">Must be at least 6 characters</p>
                    )}
                </div>
            </div>

            {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-2 animate-in slide-in-from-top-2 duration-200">
                <div className="text-red-400 mt-0.5"><ArrowLeft size={14} className="rotate-180"/></div>
                <p className="text-red-400 text-xs leading-relaxed">{error}</p>
                </div>
            )}

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-primary to-blue-600 hover:from-blue-500 hover:to-blue-600 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 active:scale-[0.98] flex items-center justify-center gap-2"
            >
                {loading ? <Loader2 className="animate-spin h-5 w-5" /> : (isSignUp ? 'Create Account' : 'Sign In')}
            </button>
            </form>


            
            {!isSignUp && (
                <div className="text-center pt-2">
                    <a href="#" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">Forgot your password?</a>
                </div>
            )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950/30 border-t border-white/5 text-center">
            <p className="text-[10px] text-slate-600">
                Secured by Supabase. Powered by React.
            </p>
        </div>
      </div>
    </div>
  );
};