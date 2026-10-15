import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Lock,
  Mail,
  User,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  LogOut,
  Database,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AuthModal: React.FC = () => {
  const {
    user,
    userProfile,
    isAuthModalOpen,
    authModalMode,
    error,
    closeAuthModal,
    openAuthModal,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    resetPassword,
    signOut,
  } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [showResetView, setShowResetView] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    setIsSubmitting(true);

    try {
      if (showResetView) {
        if (!email) {
          setLocalError('Please enter your email address to reset password.');
          setIsSubmitting(false);
          return;
        }
        await resetPassword(email);
        setResetSent(true);
      } else if (authModalMode === 'signup') {
        if (!email || !password) {
          setLocalError('Please fill in all required fields.');
          setIsSubmitting(false);
          return;
        }
        if (password.length < 6) {
          setLocalError('Password must be at least 6 characters.');
          setIsSubmitting(false);
          return;
        }
        await signUpWithEmail(email, password, name);
      } else {
        if (!email || !password) {
          setLocalError('Please enter both email and password.');
          setIsSubmitting(false);
          return;
        }
        await signInWithEmail(email, password);
      }
    } catch (err: unknown) {
      // Error handled in AuthContext or local
      console.error('Auth action failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLocalError(null);
    setIsSubmitting(true);
    try {
      await signInWithGoogle();
    } catch (err) {
      console.error('Google sign in error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.2 }}
        className="relative w-full max-w-md overflow-hidden rounded-3xl bg-[#0D0F12] border border-[#CDD3DC]/20 shadow-2xl shadow-black"
      >
        {/* Top Metallic Orange Glow Beam */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#FF5A00] to-transparent shadow-[0_0_15px_#FF5A00]" />

        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 p-2 rounded-xl text-[#A7ADB8] hover:text-white hover:bg-white/5 transition-colors z-10"
          aria-label="Close authentication modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-7 sm:p-8">
          {/* If already authenticated, show account summary view */}
          {user ? (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#252A31] to-[#16191E] border border-[#CDD3DC]/30 flex items-center justify-center text-lg font-bold text-white shadow-inner">
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || 'User'}
                      className="w-full h-full object-cover rounded-2xl"
                    />
                  ) : (
                    <span>{(user.displayName || user.email || 'U').charAt(0).toUpperCase()}</span>
                  )}
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-white flex items-center gap-2">
                    {user.displayName || 'PitchCraft Member'}
                    <ShieldCheck className="w-4 h-4 text-[#FF5A00]" />
                  </h3>
                  <p className="text-xs text-[#A7ADB8] font-mono">{user.email}</p>
                </div>
              </div>

              {/* Individual Firestore Database Status Card */}
              <div className="p-4 rounded-2xl bg-[#16191E] border border-white/10 space-y-2.5">
                <div className="flex items-center justify-between text-xs font-mono text-white/80">
                  <span className="flex items-center gap-1.5 text-[#CDD3DC]">
                    <Database className="w-3.5 h-3.5 text-[#FF5A00]" />
                    Firestore Sync
                  </span>
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Connected
                  </span>
                </div>
                <div className="text-[11px] font-mono text-[#A7ADB8] space-y-1">
                  <p className="flex justify-between">
                    <span>User Document ID:</span>
                    <span className="text-white/90 truncate max-w-[170px]" title={user.uid}>
                      {user.uid.slice(0, 14)}...
                    </span>
                  </p>
                  <p className="flex justify-between">
                    <span>Auth Provider:</span>
                    <span className="text-white capitalize">
                      {user.providerData?.[0]?.providerId === 'google.com' ? 'Google Account' : 'Email / Password'}
                    </span>
                  </p>
                  <p className="flex justify-between">
                    <span>Workspace Role:</span>
                    <span className="text-[#FF5A00] uppercase font-bold">{userProfile?.role || 'Freelancer'}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => {
                    closeAuthModal();
                  }}
                  className="flex-1 py-3 px-4 rounded-xl bg-white text-[#07080A] hover:bg-[#CDD3DC] font-display text-xs font-bold tracking-wide transition-all shadow-lg"
                >
                  Continue to Workspace
                </button>
                <button
                  onClick={async () => {
                    await signOut();
                  }}
                  className="py-3 px-4 rounded-xl bg-[#252A31] hover:bg-[#3D444E] text-[#A7ADB8] hover:text-white border border-white/10 text-xs font-mono transition-all flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-br from-[#252A31] to-[#16191E] border border-[#CDD3DC]/30 mb-3 shadow-lg shadow-black">
                  <div className="w-3.5 h-3.5 bg-[#FF5A00] rounded-sm transform rotate-45 shadow-[0_0_12px_#FF5A00]" />
                </div>
                <h3 className="font-display text-2xl font-extrabold text-white tracking-tight">
                  {showResetView
                    ? 'Reset Password'
                    : authModalMode === 'signup'
                    ? 'Create Your Account'
                    : 'Welcome to PitchCraft'}
                </h3>
                <p className="text-xs text-[#A7ADB8] font-mono mt-1.5">
                  {showResetView
                    ? 'Enter your email to receive recovery instructions'
                    : authModalMode === 'signup'
                    ? 'Join elite freelancers storing individual cloud workspaces'
                    : 'Access your proposals and AI generation studio'}
                </p>
              </div>

              {/* Mode Switcher Tabs */}
              {!showResetView && (
                <div className="grid grid-cols-2 p-1 mb-6 rounded-xl bg-[#16191E] border border-white/10 text-xs font-mono">
                  <button
                    type="button"
                    onClick={() => openAuthModal('signin')}
                    className={`py-2 rounded-lg transition-all ${
                      authModalMode === 'signin'
                        ? 'bg-[#252A31] text-white font-semibold shadow-sm border border-white/10'
                        : 'text-[#A7ADB8] hover:text-white'
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => openAuthModal('signup')}
                    className={`py-2 rounded-lg transition-all ${
                      authModalMode === 'signup'
                        ? 'bg-[#252A31] text-white font-semibold shadow-sm border border-white/10'
                        : 'text-[#A7ADB8] hover:text-white'
                    }`}
                  >
                    Sign Up
                  </button>
                </div>
              )}

              {/* Google Sign In Button */}
              {!showResetView && (
                <div className="space-y-4">
                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-2xl bg-gradient-to-b from-[#252A31] to-[#16191E] hover:from-[#3D444E] hover:to-[#252A31] text-white font-display text-xs font-semibold tracking-wide border border-[#CDD3DC]/30 hover:border-[#FF5A00] transition-all duration-300 shadow-xl group disabled:opacity-50"
                  >
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                    <span>Continue with Google</span>
                  </button>

                  <div className="relative flex items-center justify-center my-4">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-white/10" />
                    </div>
                    <span className="relative px-3 bg-[#0D0F12] text-[10px] font-mono uppercase tracking-wider text-[#A7ADB8]">
                      OR CONTINUE WITH EMAIL / GMAIL
                    </span>
                  </div>
                </div>
              )}

              {/* Reset Password Confirmation Message */}
              {resetSent ? (
                <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                  <p className="text-xs font-semibold text-white font-display">Password Reset Email Sent</p>
                  <p className="text-[11px] text-[#A7ADB8] font-mono">
                    Check your inbox at <span className="text-white">{email}</span> for instructions to reset your password.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setShowResetView(false);
                      setResetSent(false);
                    }}
                    className="text-xs text-[#FF5A00] font-mono hover:underline pt-2 block mx-auto"
                  >
                    Back to Sign In
                  </button>
                </div>
              ) : (
                /* Email/Password Form */
                <form onSubmit={handleSubmit} className="space-y-3.5">
                  {(error || localError) && (
                    <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/30 flex items-start gap-2.5 text-xs text-red-200 font-mono">
                      <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                      <span>{localError || error}</span>
                    </div>
                  )}

                  {authModalMode === 'signup' && !showResetView && (
                    <div>
                      <label className="block text-[11px] font-mono uppercase text-[#CDD3DC]/80 mb-1">
                        Full Name / Agency
                      </label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A7ADB8]" />
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="e.g. Alex Mercer"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#16191E] border border-white/10 focus:border-[#FF5A00] text-white text-xs placeholder:text-white/30 focus:outline-none transition-all"
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-[11px] font-mono uppercase text-[#CDD3DC]/80 mb-1">
                      Email Address (Gmail / Corporate)
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A7ADB8]" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@domain.com"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#16191E] border border-white/10 focus:border-[#FF5A00] text-white text-xs placeholder:text-white/30 focus:outline-none transition-all"
                      />
                    </div>
                  </div>

                  {!showResetView && (
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[11px] font-mono uppercase text-[#CDD3DC]/80">
                          Password
                        </label>
                        {authModalMode === 'signin' && (
                          <button
                            type="button"
                            onClick={() => setShowResetView(true)}
                            className="text-[10px] font-mono text-[#FF5A00] hover:underline"
                          >
                            Forgot password?
                          </button>
                        )}
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A7ADB8]" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••••••"
                          className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#16191E] border border-white/10 focus:border-[#FF5A00] text-white text-xs placeholder:text-white/30 focus:outline-none transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A7ADB8] hover:text-white"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full mt-2 py-3 px-4 rounded-xl bg-[#FF5A00] hover:bg-white hover:text-[#07080A] text-white font-display text-xs font-bold tracking-wide transition-all duration-300 shadow-xl shadow-[#FF5A00]/25 border border-[#FF8C32]/40 flex items-center justify-center gap-2 group disabled:opacity-50"
                  >
                    <span>
                      {isSubmitting
                        ? 'Processing...'
                        : showResetView
                        ? 'Send Password Reset Link'
                        : authModalMode === 'signup'
                        ? 'Create Cloud Account'
                        : 'Sign In to Workspace'}
                    </span>
                    {!isSubmitting && (
                      <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                    )}
                  </button>

                  {showResetView && (
                    <button
                      type="button"
                      onClick={() => setShowResetView(false)}
                      className="w-full text-center text-xs font-mono text-[#A7ADB8] hover:text-white pt-2 block"
                    >
                      ← Back to Sign In
                    </button>
                  )}
                </form>
              )}

              {/* Data Privacy & Individual Firestore Storage Notice */}
              <div className="mt-6 pt-4 border-t border-white/10 text-center">
                <p className="text-[10px] font-mono text-[#A7ADB8]/70 flex items-center justify-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Each user account is securely partitioned in Cloud Firestore.
                </p>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};
