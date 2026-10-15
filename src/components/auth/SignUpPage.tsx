import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Lock,
  Mail,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Zap,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const SignUpPage: React.FC = () => {
  const { signUpWithEmail, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!fullName.trim()) {
      setErrorMessage('Please provide your full name.');
      return;
    }
    if (!email.trim()) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('Password must contain at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please verify both entries.');
      return;
    }

    setIsSubmitting(true);
    try {
      await signUpWithEmail(email.trim(), password, fullName.trim());
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      const msg = err?.message || '';
      if (msg.includes('email-already-in-use')) {
        setErrorMessage('This email is already registered. Please sign in or use password reset.');
      } else if (msg.includes('weak-password')) {
        setErrorMessage('Password is too weak. Please use a stronger combination.');
      } else {
        setErrorMessage('Unable to complete account registration. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setErrorMessage(null);
    setIsSubmitting(true);
    try {
      await signInWithGoogle();
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      if (err?.code !== 'auth/popup-closed-by-user') {
        setErrorMessage('Google Authentication failed. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07080A] text-[#F5F6F8] flex flex-col justify-between selection:bg-[#FF5A00] selection:text-white relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#FF5A00]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-white/[0.02] rounded-full blur-[160px] pointer-events-none" />

      {/* Header Bar */}
      <header className="relative z-20 w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#252A31] via-[#16191E] to-[#0D0F12] border border-[#CDD3DC]/25 flex items-center justify-center text-white shadow-xl shadow-black/60 group-hover:border-[#FF5A00]/60 transition-colors">
            <span className="font-display font-black text-sm tracking-tighter text-white">PC</span>
          </div>
          <div>
            <div className="font-display font-black text-lg tracking-wider uppercase text-white flex items-center gap-1.5">
              <span>PITCHCRAFT</span>
              <span className="text-[#FF5A00]">AI</span>
            </div>
            <div className="text-[10px] font-mono text-[#A7ADB8] tracking-widest uppercase">
              Secure SaaS Platform
            </div>
          </div>
        </Link>

        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="text-[#A7ADB8] hidden sm:inline">Already registered?</span>
          <Link
            to="/login"
            className="px-4 py-2 rounded-xl border border-white/10 hover:border-[#FF5A00]/60 hover:text-white bg-white/[0.03] text-[#CDD3DC] font-semibold transition-all"
          >
            Sign In
          </Link>
        </div>
      </header>

      {/* Main Dual-Column Content */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Form (6 cols) */}
        <div className="lg:col-span-6 xl:col-span-6 w-full max-w-md mx-auto lg:mx-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="p-8 sm:p-10 rounded-3xl border border-[#CDD3DC]/20 bg-gradient-to-b from-[#16191E] to-[#0E1013] shadow-[0_30px_90px_rgba(0,0,0,0.85)] relative"
          >
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#FF5A00] animate-pulse" />
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#FF5A00]">
                  New Account Provisioning
                </span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Zero Demo Data
              </span>
            </div>

            <h1 className="font-display text-2xl sm:text-3xl font-extrabold uppercase text-white tracking-tight">
              Create Your Account
            </h1>
            <p className="mt-2 text-xs font-mono text-[#A7ADB8] leading-relaxed">
              Start with a clean, private workspace. Every proposal, client, and estimate is isolated strictly to your account.
            </p>

            {/* Error Banner */}
            {errorMessage && (
              <div className="mt-5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-3 text-xs font-mono text-red-400">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span className="leading-snug">{errorMessage}</span>
              </div>
            )}

            {/* Google Quick Sign-Up */}
            <div className="mt-6">
              <button
                type="button"
                onClick={handleGoogleSignUp}
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/15 hover:border-white/30 text-white font-mono text-xs font-semibold tracking-wide transition-all shadow-sm group cursor-pointer disabled:opacity-50"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#EA4335"
                    d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z"
                  />
                  <path
                    fill="#4285F4"
                    d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15.2s.7 5.5 1.9 7.9l3.7-2.9z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 16.5C3.7 20.2 7.5 23.5 12 23.5z"
                  />
                </svg>
                <span>Sign Up with Google</span>
              </button>
            </div>

            <div className="my-6 flex items-center gap-4 text-xs font-mono text-white/30">
              <div className="flex-1 h-px bg-white/10" />
              <span>OR ENTER CREDENTIALS</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            {/* Registration Form */}
            <form onSubmit={handleSignUp} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-[#CDD3DC] mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Sarah Connor"
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#090A0C] border border-white/10 focus:border-[#FF5A00] focus:ring-1 focus:ring-[#FF5A00] text-white font-mono text-xs placeholder:text-white/20 outline-hidden transition-all"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-[#CDD3DC] mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="sarah@cyberdesign.co"
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#090A0C] border border-white/10 focus:border-[#FF5A00] focus:ring-1 focus:ring-[#FF5A00] text-white font-mono text-xs placeholder:text-white/20 outline-hidden transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-[#CDD3DC] mb-1.5">
                  Password (min 6 characters)
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-10 py-3 rounded-2xl bg-[#090A0C] border border-white/10 focus:border-[#FF5A00] focus:ring-1 focus:ring-[#FF5A00] text-white font-mono text-xs placeholder:text-white/20 outline-hidden transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-[#CDD3DC] mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-10 py-3 rounded-2xl bg-[#090A0C] border border-white/10 focus:border-[#FF5A00] focus:ring-1 focus:ring-[#FF5A00] text-white font-mono text-xs placeholder:text-white/20 outline-hidden transition-all"
                  />
                </div>
              </div>

              {/* Terms acknowledgement */}
              <p className="text-[10px] font-mono text-[#A7ADB8] leading-relaxed pt-1">
                By registering, you initialize a private account with secure client-side and cloud-isolated storage.
              </p>

              {/* Glowing Orange Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 py-3.5 px-6 rounded-2xl bg-[#FF5A00] hover:bg-white text-[#07080A] hover:text-[#07080A] font-display font-extrabold text-xs tracking-wider uppercase transition-all shadow-[0_0_24px_rgba(255,90,0,0.45)] hover:shadow-[0_0_32px_rgba(255,255,255,0.6)] cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Provisioning Account...</span>
                ) : (
                  <>
                    <span>Create Free Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-white/10 text-center text-xs font-mono text-[#A7ADB8]">
              Already have an account?{' '}
              <Link to="/login" className="text-[#FF5A00] font-semibold hover:underline">
                Sign In →
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Decorative Metallic AI Visual */}
        <div className="hidden lg:flex lg:col-span-6 flex-col items-center justify-center relative">
          <div className="w-full max-w-lg relative">
            <img
              src="/assets/metallic-ai-robot.svg"
              alt="PitchCraft AI Robot"
              className="w-full h-auto max-h-[560px] object-contain drop-shadow-[0_25px_50px_rgba(0,0,0,0.9)]"
            />
            <div className="mt-6 grid grid-cols-2 gap-3 font-mono text-xs">
              <div className="p-3.5 rounded-2xl border border-white/10 bg-[#16191E]/80 backdrop-blur-sm">
                <div className="text-[#FF5A00] font-bold flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-[#FF5A00]" />
                  <span>Instant Onboarding</span>
                </div>
                <div className="text-[11px] text-[#A7ADB8] mt-1">
                  Start with a pristine empty workspace ready for production.
                </div>
              </div>
              <div className="p-3.5 rounded-2xl border border-white/10 bg-[#16191E]/80 backdrop-blur-sm">
                <div className="text-[#FF5A00] font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Multi-Tenant Security</span>
                </div>
                <div className="text-[11px] text-[#A7ADB8] mt-1">
                  Cross-account read/write attempts strictly denied by rules.
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Bar */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-6 py-4 text-center text-[11px] font-mono text-[#A7ADB8]/60 border-t border-white/5">
        PitchCraft AI · Autonomous Proposal Engineering & Multi-User SaaS Platform
      </footer>
    </div>
  );
};
