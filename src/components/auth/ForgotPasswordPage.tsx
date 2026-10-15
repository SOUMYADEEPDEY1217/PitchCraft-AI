import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Mail,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  KeyRound,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const ForgotPasswordPage: React.FC = () => {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim()) {
      setErrorMessage('Please enter your account email address.');
      return;
    }

    setIsSubmitting(true);
    try {
      await resetPassword(email.trim());
      setResetSent(true);
    } catch (err: any) {
      const msg = err?.message || '';
      if (msg.includes('user-not-found')) {
        // Safe security message: don't reveal if account exists or not
        setResetSent(true);
      } else {
        setErrorMessage('Failed to send reset link. Please check the email format and try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07080A] text-[#F5F6F8] flex flex-col justify-between selection:bg-[#FF5A00] selection:text-white relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-0 right-1/3 w-[500px] h-[500px] bg-[#FF5A00]/10 rounded-full blur-[150px] pointer-events-none" />

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

        <Link
          to="/login"
          className="flex items-center gap-2 text-xs font-mono text-[#A7ADB8] hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Sign In</span>
        </Link>
      </header>

      {/* Main Dual-Column Content */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
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
                  Credential Recovery
                </span>
              </div>
              <span className="text-[10px] font-mono text-[#A7ADB8] uppercase tracking-wider flex items-center gap-1">
                <KeyRound className="w-3.5 h-3.5 text-[#FF5A00]" />
                Single-Use Token
              </span>
            </div>

            {resetSent ? (
              <div className="space-y-6">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto sm:mx-0">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="font-display text-2xl font-extrabold uppercase text-white tracking-tight">
                    Reset Link Dispatched
                  </h1>
                  <p className="mt-2 text-xs font-mono text-[#A7ADB8] leading-relaxed">
                    If an account matches <span className="text-white font-semibold">{email}</span>, a cryptographically secure, expiring reset link has been dispatched to your inbox.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-[#090A0C] border border-white/10 text-xs font-mono text-[#A7ADB8] space-y-2">
                  <p className="text-white font-semibold flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    Security Protocol Active:
                  </p>
                  <p>• Token expires automatically within 60 minutes.</p>
                  <p>• Single-use link invalidates upon first completion.</p>
                  <p>• Never share password reset links.</p>
                </div>
                <Link
                  to="/login"
                  className="w-full py-3.5 px-6 rounded-2xl bg-[#FF5A00] hover:bg-white text-[#07080A] font-display font-extrabold text-xs tracking-wider uppercase transition-all shadow-[0_0_24px_rgba(255,90,0,0.45)] flex items-center justify-center gap-2"
                >
                  <span>Return to Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              <div>
                <h1 className="font-display text-2xl sm:text-3xl font-extrabold uppercase text-white tracking-tight">
                  Reset Password
                </h1>
                <p className="mt-2 text-xs font-mono text-[#A7ADB8] leading-relaxed">
                  Enter your registered email address. We'll send an authenticated, time-limited link to establish new credentials.
                </p>

                {errorMessage && (
                  <div className="mt-5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-3 text-xs font-mono text-red-400">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span className="leading-snug">{errorMessage}</span>
                  </div>
                )}

                <form onSubmit={handleReset} className="mt-6 space-y-4">
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
                        placeholder="name@agency.com"
                        className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#090A0C] border border-white/10 focus:border-[#FF5A00] focus:ring-1 focus:ring-[#FF5A00] text-white font-mono text-xs placeholder:text-white/20 outline-hidden transition-all"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full mt-2 py-3.5 px-6 rounded-2xl bg-[#FF5A00] hover:bg-white text-[#07080A] font-display font-extrabold text-xs tracking-wider uppercase transition-all shadow-[0_0_24px_rgba(255,90,0,0.45)] hover:shadow-[0_0_32px_rgba(255,255,255,0.6)] cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>Dispatching Secure Token...</span>
                    ) : (
                      <>
                        <span>Send Recovery Link</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>

                <div className="mt-8 pt-6 border-t border-white/10 text-center text-xs font-mono text-[#A7ADB8]">
                  Remembered your password?{' '}
                  <Link to="/login" className="text-[#FF5A00] font-semibold hover:underline">
                    Sign In →
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Right Column: Visual */}
        <div className="hidden lg:flex lg:col-span-6 flex-col items-center justify-center relative">
          <div className="w-full max-w-lg relative">
            <img
              src="/assets/metallic-ai-robot.svg"
              alt="PitchCraft AI Robot"
              className="w-full h-auto max-h-[560px] object-contain drop-shadow-[0_25px_50px_rgba(0,0,0,0.9)] opacity-90"
            />
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
