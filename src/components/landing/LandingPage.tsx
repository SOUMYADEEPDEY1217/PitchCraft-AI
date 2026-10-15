import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../common/Navbar';
import { HeroRobotVisual } from './HeroRobotVisual';
import { useApp } from '../../context/AppContext';
import {
  ArrowRight,
  ArrowUpRight,
  Cpu,
  Zap,
  CheckCircle2,
  Calculator,
  FileText,
  Users,
  ShieldCheck,
  Download,
  BarChart3,
  Edit3,
  ChevronDown,
  Sparkles,
  Lock,
  Layers,
  Terminal,
  Database,
  LogIn,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../context/AuthContext';

export const LandingPage: React.FC = () => {
  const { backendStatus } = useApp();
  const { user, openAuthModal } = useAuth();
  const [showcaseTab, setShowcaseTab] = useState<'generate' | 'customize' | 'calculate' | 'export' | 'track'>('generate');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does PitchCraft AI utilize local Ollama inference?',
      a: 'PitchCraft AI connects directly to your local Ollama daemon running open-weight models like Qwen3:4B, Llama 3.2, or DeepSeek-R1. Client briefs, specifications, and project scope are processed locally on your machine with zero third-party token fees.',
    },
    {
      q: 'Can I export clean, print-ready PDF proposals?',
      a: 'Yes. Every generated proposal can be previewed in real time and exported as a clean, vector-rendered PDF document complete with executive summaries, explicit deliverables, structured milestone schedules, and client signature authorization blocks.',
    },
    {
      q: 'How does the Smart Pricing Calculator eliminate scope estimation errors?',
      a: 'The calculator uses deterministic mathematical formulas factoring in phase labor hours, custom billable rates, direct tooling expenses, risk contingency reserves (0–30%), and target profit margins (10–50%), ensuring consistent commercial proposals without arithmetic errors.',
    },
    {
      q: 'Can I use PitchCraft AI if my local Ollama server is offline?',
      a: 'Yes. PitchCraft AI includes a full autonomous Local Studio Mode with in-browser data persistence. You can draft, calculate, edit, and export proposals immediately. Once your local FastAPI/Ollama service starts, backend synchronization occurs seamlessly.',
    },
    {
      q: 'Are the Starter and Pro pricing plans active today?',
      a: 'No. PitchCraft AI is 100% free and open-source today for local usage. The Starter (₹199/mo) and Pro (₹499/mo) plans represent proposed hosted cloud tiers designed for multi-device sync and studio team workflows.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#07080A] text-[#F5F6F8] flex flex-col selection:bg-[#FF5A00] selection:text-white relative overflow-hidden" id="top">
      {/* Subtle Atmospheric Grid & Grain Texture */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-20 bg-[radial-gradient(#252A31_1px,transparent_1px)] [background-size:24px_24px]" />

      <Navbar />

      {/* =========================================================================
          SECTION 1: CINEMATIC HERO (The Attached Metallic AI Robot Hero)
      ========================================================================== */}
      <section className="relative pt-28 pb-20 md:pt-36 md:pb-28 min-h-[92vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#16191E] via-[#07080A] to-[#07080A]">
        {/* Massive Background Typography "PITCHCRAFT" */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full select-none pointer-events-none z-0 text-center overflow-hidden">
          <span className="font-display font-extrabold text-[17vw] leading-none tracking-tighter text-[#CDD3DC]/[0.035] uppercase whitespace-nowrap block">
            PITCHCRAFT
          </span>
        </div>

        {/* Ambient Volumetric Orange Backlight Glow */}
        <div className="absolute top-1/3 right-1/4 -translate-y-1/2 w-[550px] h-[550px] bg-gradient-to-b from-[#FF5A00]/20 via-[#FF5A00]/5 to-transparent rounded-full blur-[130px] pointer-events-none z-0" />

        <div className="max-w-7xl mx-auto px-6 w-full relative z-10 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column: Hero Editorial Typography & Primary CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-6 flex flex-col items-start text-left z-20"
            >
              {/* Eyebrow */}
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-[#CDD3DC]/20 text-xs font-mono tracking-widest text-[#CDD3DC] uppercase mb-6 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-[#FF5A00] shadow-[0_0_10px_#FF5A00]" />
                <span>OPEN-SOURCE INTELLIGENCE FOR FREELANCERS</span>
              </div>

              {/* Main Headline */}
              <h1 className="font-display text-4xl sm:text-6xl xl:text-7xl font-extrabold tracking-tight text-white leading-[1.04] uppercase">
                CRAFT BETTER. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#CDD3DC] to-[#777F8B]">
                  PITCH SMARTER.
                </span> <br />
                <span className="text-[#FF5A00]">WIN BIGGER.</span>
              </h1>

              {/* Supporting Text */}
              <p className="mt-6 text-base sm:text-lg text-[#CDD3DC]/80 max-w-xl font-normal leading-relaxed font-sans">
                Turn client briefs into compelling proposals, professional quotations, and powerful freelance pitches with intelligent, locally powered AI.
              </p>

              {/* Action Buttons & Status */}
              <div className="mt-8 flex flex-wrap items-center gap-4 w-full sm:w-auto">
                {/* Primary Orange Button */}
                <Link
                  to="/generator"
                  className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#FF5A00] text-white hover:bg-white hover:text-[#07080A] font-display text-sm font-semibold tracking-wide transition-all duration-300 shadow-xl shadow-[#FF5A00]/30 hover:scale-[1.02] border border-[#FF8C32]/40"
                >
                  <span>Start Creating</span>
                  <div className="w-6 h-6 rounded-full bg-black/20 group-hover:bg-[#07080A] group-hover:text-white flex items-center justify-center transition-colors">
                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                  </div>
                </Link>

                {/* Secondary Outlined Button */}
                <Link
                  to="/dashboard"
                  className="inline-flex items-center gap-2 px-7 py-4 rounded-full bg-white/[0.04] border border-[#CDD3DC]/20 hover:border-white hover:bg-white/[0.08] text-white font-display text-sm font-medium transition-all duration-200"
                >
                  <span>Explore Platform</span>
                  <ArrowUpRight className="w-4 h-4 text-[#CDD3DC]" />
                </Link>
              </div>

              {/* Verified Backend & Cloud Sync Status Indicators */}
              <div className="mt-10 pt-6 border-t border-white/10 flex flex-wrap items-center gap-4 sm:gap-6 text-xs font-mono">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/10">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      backendStatus.isConnected
                        ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]'
                        : 'bg-amber-400 shadow-[0_0_8px_#f59e0b]'
                    }`}
                  />
                  <span className="text-[#CDD3DC] uppercase font-semibold">
                    POWERED BY OLLAMA + QWEN:
                  </span>
                  <span className={backendStatus.isConnected ? 'text-emerald-400 font-bold' : 'text-amber-300 font-semibold'}>
                    {backendStatus.isConnected ? 'CONNECTED' : 'LOCAL DEMO MODE'}
                  </span>
                </div>

                {/* Firebase Firestore Cloud Indicator */}
                <button
                  type="button"
                  onClick={() => openAuthModal('signin')}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#16191E] border border-white/10 hover:border-[#FF5A00]/50 transition-all text-[#CDD3DC]"
                >
                  <Database className="w-3.5 h-3.5 text-[#FF5A00]" />
                  <span>Cloud Firestore:</span>
                  {user ? (
                    <span className="text-emerald-400 font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      Synced
                    </span>
                  ) : (
                    <span className="text-white/60 hover:text-white underline">Sign In</span>
                  )}
                </button>
              </div>
            </motion.div>

            {/* Right Column: Central Hero Metallic AI Robot Artwork */}
            <div className="lg:col-span-6 relative flex items-center justify-center lg:justify-end">
              <HeroRobotVisual backendStatus={backendStatus} />
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: ANIMATED VALUE PROPOSITION
      ========================================================================== */}
      <section className="py-24 bg-[#07080A] border-t border-white/5 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="text-xs font-mono uppercase tracking-widest text-[#FF5A00] mb-3 flex items-center justify-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF5A00]" />
              <span>Core Value Proposition</span>
            </div>
            <h2 className="font-display text-3xl sm:text-5xl font-extrabold uppercase text-white tracking-tight leading-[1.05]">
              LESS ADMIN. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#CDD3DC] to-[#777F8B]">
                MORE CLIENTS.
              </span> <br />
              <span className="text-[#FF5A00]">BETTER BUSINESS.</span>
            </h2>
            <p className="mt-4 text-sm sm:text-base text-[#A7ADB8] font-mono leading-relaxed">
              Engineered to reclaim 10+ hours wasted every week on unpaid proposal drafting, scope guesswork, and rate formulation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Faster Preparation */}
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className="p-8 rounded-3xl bg-gradient-to-b from-[#252A31] via-[#16191E] to-[#0D0F12] border border-[#CDD3DC]/20 text-[#F5F6F8] shadow-2xl relative overflow-hidden group"
            >
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#FF5A00] mb-6 group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="font-display text-xl font-bold uppercase text-white mb-3">
                Faster Proposal Preparation
              </h3>
              <p className="text-xs sm:text-sm font-mono text-[#A7ADB8] leading-relaxed">
                Convert messy client emails, RFPs, and discovery notes into structured 8-section proposals in seconds rather than entire weekends.
              </p>
              <div className="mt-6 pt-4 border-t border-white/10 text-xs font-mono text-[#FF5A00] flex items-center gap-1.5">
                <span>Under 3 seconds synthesis</span>
              </div>
            </motion.div>

            {/* Card 2: Professional Presentation */}
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className="p-8 rounded-3xl bg-gradient-to-b from-[#252A31] via-[#16191E] to-[#0D0F12] border border-[#CDD3DC]/20 text-[#F5F6F8] shadow-2xl relative overflow-hidden group"
            >
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#FF5A00] mb-6 group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="font-display text-xl font-bold uppercase text-white mb-3">
                Professional Presentation
              </h3>
              <p className="text-xs sm:text-sm font-mono text-[#A7ADB8] leading-relaxed">
                Present clear executive summaries, explicit inclusions vs exclusions, milestone phases, and vector PDF exports with zero watermarks.
              </p>
              <div className="mt-6 pt-4 border-t border-white/10 text-xs font-mono text-emerald-400 flex items-center gap-1.5">
                <span>Clean vector-rendered PDFs</span>
              </div>
            </motion.div>

            {/* Card 3: Private and Customizable AI */}
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className="p-8 rounded-3xl bg-gradient-to-b from-[#252A31] via-[#16191E] to-[#0D0F12] border border-[#CDD3DC]/20 text-[#F5F6F8] shadow-2xl relative overflow-hidden group"
            >
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#FF5A00] mb-6 group-hover:scale-110 transition-transform">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="font-display text-xl font-bold uppercase text-white mb-3">
                Private & Customizable AI
              </h3>
              <p className="text-xs sm:text-sm font-mono text-[#A7ADB8] leading-relaxed">
                Pair with your local Ollama daemon or run in Local Studio Mode. Tailor prompts, models, and industry tones without leaking client data to third parties.
              </p>
              <div className="mt-6 pt-4 border-t border-white/10 text-xs font-mono text-[#CDD3DC] flex items-center gap-1.5">
                <span>100% NDA compliant</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: INTERACTIVE FEATURE SHOWCASE — ASYMMETRIC BENTO GRID (8 FEATURES)
      ========================================================================== */}
      <section className="py-24 md:py-32 bg-[#0D0F12] relative border-t border-white/5" id="features">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <div className="text-xs font-mono uppercase tracking-widest text-[#FF5A00] mb-3 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF5A00]" />
                <span>Feature Showcase</span>
              </div>
              <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl font-extrabold uppercase text-white tracking-tight leading-[1.05]">
                ONE PLATFORM. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#CDD3DC] to-[#777F8B]">
                  ENDLESS POSSIBILITIES.
                </span>
              </h2>
            </div>
            <p className="text-sm sm:text-base text-[#A7ADB8] max-w-md font-mono">
              Eight dedicated modules engineered specifically for freelancers, consultants, and digital studios.
            </p>
          </div>

          {/* Asymmetric Bento Grid (8 Cards) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
            
            {/* 1. AI Proposal Generator (7 cols) */}
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className="lg:col-span-7 bg-[#16191E] border border-[#CDD3DC]/15 rounded-3xl p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden group shadow-2xl"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF5A00]/10 rounded-full blur-3xl pointer-events-none" />
              <div>
                <div className="flex items-center justify-between mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#FF5A00] group-hover:scale-110 transition-transform">
                    <FileText className="w-6 h-6" />
                  </div>
                  <span className="font-mono text-xs uppercase tracking-widest text-[#CDD3DC]/50">01. Generator</span>
                </div>
                <h3 className="font-display text-2xl sm:text-3xl font-bold uppercase text-white mb-4 tracking-tight">
                  AI Proposal Generator
                </h3>
                <p className="text-sm text-[#A7ADB8] leading-relaxed max-w-lg mb-8 font-mono">
                  Converts unformatted client briefs into multi-section contract specifications with milestones, payment schedules, and clear scope limits.
                </p>
              </div>

              <div className="bg-[#07080A] border border-white/10 rounded-2xl p-4 font-mono text-xs text-white/80 space-y-2">
                <div className="flex items-center justify-between text-[11px] text-white/50 border-b border-white/5 pb-2">
                  <span className="text-[#FF5A00]">synthesize_proposal.ts</span>
                  <span>Model: Qwen3:4b</span>
                </div>
                <div className="text-emerald-400">✓ Executive Summary & Risk Assessment compiled</div>
                <div className="text-white/60">→ Scope Boundaries: 5 Included, 3 Excluded</div>
                <div className="text-white/60">→ 4 Milestones with Deposit Safeguards structured</div>
              </div>
            </motion.div>

            {/* 2. Client Brief Analyzer (5 cols) */}
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className="lg:col-span-5 bg-gradient-to-br from-[#252A31] to-[#16191E] border border-[#CDD3DC]/20 rounded-3xl p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden group shadow-2xl"
            >
              <div>
                <div className="flex items-center justify-between mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-black/20 flex items-center justify-center text-[#FF5A00] group-hover:scale-110 transition-transform">
                    <Zap className="w-6 h-6" />
                  </div>
                  <span className="font-mono text-xs uppercase tracking-widest text-white/50">02. Discovery</span>
                </div>
                <h3 className="font-display text-2xl sm:text-3xl font-bold uppercase text-white mb-4 tracking-tight">
                  Client Brief Analyzer
                </h3>
                <p className="text-sm text-[#A7ADB8] leading-relaxed mb-6 font-mono">
                  Scans client inquiries for unstated assumptions, timeline traps, and missing specifications before you commit.
                </p>
              </div>

              <div className="bg-[#07080A]/60 backdrop-blur-md rounded-2xl p-4 border border-white/10 font-mono text-xs text-white/80 space-y-2">
                <div className="flex justify-between text-amber-400 font-semibold">
                  <span>Scope Traps Flagged</span>
                  <span>3 Risks Detected</span>
                </div>
                <div className="text-white/60 text-[11px]">AWS staging environment missing in client brief.</div>
              </div>
            </motion.div>

            {/* 3. Smart Pricing Calculator (4 cols) */}
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className="lg:col-span-4 bg-gradient-to-br from-[#F1F3F6] via-[#CDD3DC] to-[#777F8B] text-[#07080A] rounded-3xl p-8 flex flex-col justify-between group shadow-2xl"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-black/10 flex items-center justify-center text-[#07080A] group-hover:scale-110 transition-transform">
                    <Calculator className="w-6 h-6" />
                  </div>
                  <span className="font-mono text-xs uppercase tracking-widest text-black/50">03. Financial</span>
                </div>
                <h3 className="font-display text-2xl font-bold uppercase text-[#07080A] mb-3 tracking-tight">
                  Smart Pricing Calculator
                </h3>
                <p className="text-sm text-black/80 leading-relaxed mb-4">
                  Deterministic rate modeler calculating hours, expenses, contingency buffers, and profit margins.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-4 shadow-sm border border-black/10 space-y-1.5 font-mono text-xs">
                <div className="flex justify-between text-black/60">
                  <span>Subtotal (80 hrs):</span>
                  <span className="font-bold text-black">$12,000</span>
                </div>
                <div className="flex justify-between text-[#FF5A00] font-bold">
                  <span>Contingency (15%):</span>
                  <span>+$1,800</span>
                </div>
              </div>
            </motion.div>

            {/* 4. Professional PDF Export (4 cols) */}
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className="lg:col-span-4 bg-[#16191E] border border-[#CDD3DC]/15 rounded-3xl p-8 flex flex-col justify-between group shadow-2xl"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#FF5A00] group-hover:scale-110 transition-transform">
                    <Download className="w-6 h-6" />
                  </div>
                  <span className="font-mono text-xs uppercase tracking-widest text-white/40">04. Export</span>
                </div>
                <h3 className="font-display text-2xl font-bold uppercase text-white mb-3 tracking-tight">
                  Professional PDF Export
                </h3>
                <p className="text-sm text-[#A7ADB8] leading-relaxed mb-4 font-mono">
                  Clean vector-rendered PDF documents ready for client signature with zero branding watermarks.
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>Vector Typography & Tables</span>
              </div>
            </motion.div>

            {/* 5. Proposal Editor (4 cols) */}
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className="lg:col-span-4 bg-[#16191E] border border-[#CDD3DC]/15 rounded-3xl p-8 flex flex-col justify-between group shadow-2xl"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#FF5A00] group-hover:scale-110 transition-transform">
                    <Edit3 className="w-6 h-6" />
                  </div>
                  <span className="font-mono text-xs uppercase tracking-widest text-white/40">05. Editor</span>
                </div>
                <h3 className="font-display text-2xl font-bold uppercase text-white mb-3 tracking-tight">
                  Proposal Editor
                </h3>
                <p className="text-sm text-[#A7ADB8] leading-relaxed mb-4 font-mono">
                  Split-screen workspace with 1-click AI section rewriters, pricing adjustments, and live document canvas.
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono text-white/70">
                <Sparkles className="w-4 h-4 text-[#FF5A00]" />
                <span>Single-Click Section Rewriting</span>
              </div>
            </motion.div>

            {/* 6. Client CRM (4 cols) */}
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className="lg:col-span-4 bg-[#16191E] border border-[#CDD3DC]/15 rounded-3xl p-8 flex flex-col justify-between group shadow-2xl"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#FF5A00] group-hover:scale-110 transition-transform">
                    <Users className="w-6 h-6" />
                  </div>
                  <span className="font-mono text-xs uppercase tracking-widest text-white/40">06. CRM</span>
                </div>
                <h3 className="font-display text-2xl font-bold uppercase text-white mb-3 tracking-tight">
                  Client CRM
                </h3>
                <p className="text-sm text-[#A7ADB8] leading-relaxed mb-4 font-mono">
                  Track client records, total quoted values, signed deals, and contact history in one central workspace.
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono text-white/70">
                <CheckCircle2 className="w-4 h-4 text-[#FF5A00]" />
                <span>Integrated Proposal Linkage</span>
              </div>
            </motion.div>

            {/* 7. Proposal Analytics (4 cols) */}
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className="lg:col-span-4 bg-[#16191E] border border-[#CDD3DC]/15 rounded-3xl p-8 flex flex-col justify-between group shadow-2xl"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#FF5A00] group-hover:scale-110 transition-transform">
                    <BarChart3 className="w-6 h-6" />
                  </div>
                  <span className="font-mono text-xs uppercase tracking-widest text-white/40">07. Telemetry</span>
                </div>
                <h3 className="font-display text-2xl font-bold uppercase text-white mb-3 tracking-tight">
                  Proposal Analytics
                </h3>
                <p className="text-sm text-[#A7ADB8] leading-relaxed mb-4 font-mono">
                  Real-time pipeline metrics, conversion rates, and revenue velocity tracked with responsive visual charts.
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>Deterministic KPI Aggregation</span>
              </div>
            </motion.div>

            {/* 8. Local Open-Source AI (4 cols) */}
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className="lg:col-span-4 bg-gradient-to-br from-[#FF8C32] via-[#FF5A00] to-[#D94800] text-white rounded-3xl p-8 flex flex-col justify-between group shadow-2xl shadow-[#FF5A00]/20"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-black/20 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                    <Cpu className="w-6 h-6" />
                  </div>
                  <span className="font-mono text-xs uppercase tracking-widest text-white/80">08. Engine</span>
                </div>
                <h3 className="font-display text-2xl font-bold uppercase text-white mb-3 tracking-tight">
                  Local Open-Source AI
                </h3>
                <p className="text-sm text-white/90 leading-relaxed mb-4 font-mono">
                  Runs directly against your local Ollama daemon. Zero mandatory cloud keys, zero subscription token tax.
                </p>
              </div>

              <div className="bg-black/20 backdrop-blur-md rounded-2xl p-3 text-xs font-mono text-white/90">
                <span>Ollama · Qwen3:4B · Llama 3.2</span>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: HOW PITCHCRAFT WORKS — 5 NUMBERED WORKFLOW STEPS
      ========================================================================== */}
      <section className="py-24 md:py-32 bg-[#07080A] border-t border-white/5 relative" id="how-it-works">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <div className="text-xs font-mono uppercase tracking-widest text-[#FF5A00] mb-3 flex items-center justify-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF5A00]" />
              <span>Operational Workflow</span>
            </div>
            <h2 className="font-display text-3xl sm:text-5xl font-extrabold uppercase text-white tracking-tight leading-[1.05]">
              HOW PITCHCRAFT WORKS
            </h2>
            <p className="mt-4 text-sm sm:text-base text-[#A7ADB8] font-mono leading-relaxed">
              From raw client brief to signed contract in five numbered precision steps.
            </p>
          </div>

          <div className="space-y-6">
            {[
              {
                num: '01',
                title: 'Add Your Client Brief',
                desc: 'Paste unstructured client emails, meeting notes, or RFPs. Select industry, target deadline, and currency.',
              },
              {
                num: '02',
                title: 'Analyze Requirements',
                desc: 'AI deconstructs objectives, detects missing specifications, flags scope creep traps, and checks timeline feasibility.',
              },
              {
                num: '03',
                title: 'Generate Your Proposal',
                desc: 'Compiles an executive summary, scope limits, deliverable specifications, and warranties in under 3 seconds.',
              },
              {
                num: '04',
                title: 'Edit and Calculate',
                desc: 'Fine-tune pricing with deterministic formulas, contingency reserves, and single-click section revisions.',
              },
              {
                num: '05',
                title: 'Export and Track',
                desc: 'Export high-resolution PDFs with zero watermarks and track client acceptance status in your CRM.',
              },
            ].map((step) => (
              <div
                key={step.num}
                className="p-8 rounded-3xl bg-[#16191E] border border-[#CDD3DC]/15 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-[#FF5A00]/40 transition-all"
              >
                <div className="flex items-start md:items-center gap-6">
                  <span className="font-display font-black text-4xl sm:text-5xl text-[#CDD3DC]/30 group-hover:text-[#FF5A00] transition-colors">
                    {step.num}
                  </span>
                  <div>
                    <h3 className="font-display text-xl font-bold uppercase text-white tracking-tight">
                      {step.title}
                    </h3>
                    <p className="text-xs sm:text-sm font-mono text-[#A7ADB8] mt-1 max-w-xl">
                      {step.desc}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-[#FF5A00]">
                  <span>Step {step.num} Ready</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 5: PROPOSAL GENERATION PREVIEW — TABBED PRODUCT PREVIEW
      ========================================================================== */}
      <section className="py-24 md:py-32 bg-[#0D0F12] border-t border-white/5 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="text-xs font-mono uppercase tracking-widest text-[#FF5A00] mb-3 flex items-center justify-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF5A00]" />
              <span>Interactive Interface</span>
            </div>
            <h2 className="font-display text-3xl sm:text-5xl font-extrabold uppercase text-white tracking-tight leading-tight">
              INTERACTIVE PRODUCT PREVIEW
            </h2>
            <p className="mt-4 text-sm sm:text-base text-[#A7ADB8] font-mono">
              Explore the five workflow stages of PitchCraft AI before you start.
            </p>

            {/* Segmented Controls for 5 Tabs */}
            <div className="mt-8 inline-flex p-1.5 rounded-full bg-[#16191E] border border-white/10 flex-wrap justify-center gap-1">
              {(['generate', 'customize', 'calculate', 'export', 'track'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setShowcaseTab(tab)}
                  className={`px-5 py-2 rounded-full text-xs font-mono uppercase tracking-wider transition-all ${
                    showcaseTab === tab
                      ? 'bg-[#FF5A00] text-white shadow-lg shadow-[#FF5A00]/25 font-bold'
                      : 'text-[#A7ADB8] hover:text-white'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Screen Container */}
          <div className="rounded-3xl border border-white/15 bg-[#16191E]/90 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 text-xs font-mono text-white/50">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500/80" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="ml-2 text-white/40 font-mono">pitchcraft.local/app/{showcaseTab}</span>
              </div>
              <span className="text-[#FF5A00] font-semibold">QWEN3:4B LOCAL ENGINE</span>
            </div>

            <div className="pt-6">
              <AnimatePresence mode="wait">
                {showcaseTab === 'generate' && (
                  <motion.div
                    key="generate"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
                  >
                    <div className="lg:col-span-5 space-y-3 font-mono text-xs">
                      <div className="p-4 rounded-2xl bg-[#07080A] border border-white/10">
                        <div className="text-[#FF5A00] font-bold uppercase mb-1">Raw Brief Input</div>
                        <div className="text-white/80">"Building a FinTech mobile platform with biometric auth and Stripe settlement..."</div>
                      </div>
                      <div className="p-4 rounded-2xl bg-[#07080A] border border-white/10">
                        <div className="text-[#FF5A00] font-bold uppercase mb-1">Tone Formulation</div>
                        <div className="text-white/80">Executive Authority & Consultative</div>
                      </div>
                      <Link
                        to="/generator"
                        className="inline-flex items-center gap-2 text-xs font-mono uppercase text-[#FF5A00] hover:text-white transition-colors"
                      >
                        <span>Launch Proposal Generator</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>

                    <div className="lg:col-span-7 bg-[#07080A] rounded-2xl p-6 border border-white/10 space-y-3 font-mono text-xs">
                      <div className="flex justify-between pb-2 border-b border-white/10">
                        <span className="text-white font-bold">PROJECT SPECIFICATION // DRAFT</span>
                        <span className="text-emerald-400">✓ COMPILED</span>
                      </div>
                      <p className="text-white/70 leading-relaxed">
                        Executive Summary: High-concurrency enterprise mobile architecture with biometric authentication, sub-100ms pricing tickers, and automated compliance auditing.
                      </p>
                    </div>
                  </motion.div>
                )}

                {showcaseTab === 'customize' && (
                  <motion.div
                    key="customize"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
                  >
                    <div className="lg:col-span-5 space-y-3 font-mono text-xs">
                      <div className="text-base font-display font-bold text-white uppercase">Section-by-Section AI Rewriter</div>
                      <p className="text-white/70 leading-relaxed">
                        Refine individual sections with targeted directives: "Justify Higher Price", "Clearer Scope Limits", or "Risk Guarantees".
                      </p>
                      <Link
                        to="/editor"
                        className="inline-flex items-center gap-2 text-xs font-mono uppercase text-[#FF5A00] hover:text-white transition-colors"
                      >
                        <span>Open Proposal Editor</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>

                    <div className="lg:col-span-7 bg-[#07080A] rounded-2xl p-6 border border-white/10 font-mono text-xs space-y-3">
                      <div className="flex justify-between pb-2 border-b border-white/10">
                        <span className="text-white font-bold">SECTION: SCOPE EXCLUSIONS</span>
                        <span className="text-emerald-400">ACTIVE</span>
                      </div>
                      <ul className="space-y-1 text-white/70 list-disc list-inside">
                        <li>Payment gateway transaction charges billed directly to client.</li>
                        <li>Post-launch SLA maintenance beyond 30-day warranty billed separately.</li>
                      </ul>
                    </div>
                  </motion.div>
                )}

                {showcaseTab === 'calculate' && (
                  <motion.div
                    key="calculate"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
                  >
                    <div className="lg:col-span-5 space-y-3 font-mono text-xs">
                      <div className="text-base font-display font-bold text-white uppercase">Deterministic Pricing Modeler</div>
                      <p className="text-white/70 leading-relaxed">
                        Calculate hours, fixed licenses, contingency reserves, and target margins with verified formulas.
                      </p>
                      <Link
                        to="/calculator"
                        className="inline-flex items-center gap-2 text-xs font-mono uppercase text-[#FF5A00] hover:text-white transition-colors"
                      >
                        <span>Open Rate Calculator</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>

                    <div className="lg:col-span-7 bg-[#07080A] rounded-2xl p-6 border border-white/10 font-mono text-xs space-y-2">
                      <div className="flex justify-between text-white/70">
                        <span>Base Sprint Labor (120 hrs):</span>
                        <span className="text-white font-bold">$14,400</span>
                      </div>
                      <div className="flex justify-between text-[#FF5A00]">
                        <span>Contingency Buffer (15%):</span>
                        <span className="font-bold">+$2,160</span>
                      </div>
                      <div className="flex justify-between text-emerald-400 pt-2 border-t border-white/10 font-bold">
                        <span>Grand Total Quoted:</span>
                        <span>$19,872</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {showcaseTab === 'export' && (
                  <motion.div
                    key="export"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
                  >
                    <div className="lg:col-span-5 space-y-3 font-mono text-xs">
                      <div className="text-base font-display font-bold text-white uppercase">Vector PDF Document Handover</div>
                      <p className="text-white/70 leading-relaxed">
                        Generate high-resolution printable contracts with customized executive typography and client signature blocks.
                      </p>
                    </div>

                    <div className="lg:col-span-7 bg-white text-black rounded-2xl p-6 space-y-3 font-mono text-xs shadow-lg">
                      <div className="flex justify-between border-b border-black/10 pb-2">
                        <span className="font-bold uppercase">Commercial Proposal & Agreement</span>
                        <span className="text-black/50">CONFIDENTIAL</span>
                      </div>
                      <div className="text-black/70 text-xs">
                        Prepared for Apex BioLogics · Sprint Term: 6 Weeks · Total: $24,500
                      </div>
                    </div>
                  </motion.div>
                )}

                {showcaseTab === 'track' && (
                  <motion.div
                    key="track"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
                  >
                    <div className="lg:col-span-5 space-y-3 font-mono text-xs">
                      <div className="text-base font-display font-bold text-white uppercase">Client CRM & Pipeline Telemetry</div>
                      <p className="text-white/70 leading-relaxed">
                        Track every client relationship, proposal status, win rates, and payment milestones in one central place.
                      </p>
                      <Link
                        to="/crm"
                        className="inline-flex items-center gap-2 text-xs font-mono uppercase text-[#FF5A00] hover:text-white transition-colors"
                      >
                        <span>Open Client CRM</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>

                    <div className="lg:col-span-7 bg-[#07080A] rounded-2xl p-6 border border-white/10 font-mono text-xs space-y-2">
                      <div className="flex justify-between text-white/70">
                        <span>Apex BioLogics:</span>
                        <span className="text-emerald-400 font-bold">ACCEPTED ($35,000)</span>
                      </div>
                      <div className="flex justify-between text-white/70">
                        <span>Nova Fintech Labs:</span>
                        <span className="text-amber-400 font-bold">IN REVIEW ($24,500)</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 6: OPEN-SOURCE AI ADVANTAGE
      ========================================================================== */}
      <section className="py-24 md:py-32 bg-[#07080A] border-t border-white/5 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="text-xs font-mono uppercase tracking-widest text-[#FF5A00] mb-3 flex items-center justify-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF5A00]" />
              <span>Architecture & Privacy</span>
            </div>
            <h2 className="font-display text-3xl sm:text-5xl font-extrabold uppercase text-white tracking-tight leading-[1.05]">
              YOUR IDEAS. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#CDD3DC] to-[#777F8B]">
                YOUR DATA.
              </span> <br />
              <span className="text-[#FF5A00]">YOUR AI.</span>
            </h2>
            <p className="mt-4 text-sm sm:text-base text-[#A7ADB8] font-mono leading-relaxed">
              How PitchCraft AI harnesses Ollama and open-weight models to keep you in full control.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-8 rounded-3xl bg-[#16191E] border border-[#CDD3DC]/15 space-y-3 font-mono text-xs">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-[#FF5A00]">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="font-display text-lg font-bold uppercase text-white">Local Inference</h3>
              <p className="text-[#A7ADB8] leading-relaxed">
                Connects directly to your local Ollama daemon. Client briefs execute on your machine's hardware with no mandatory third-party subscriptions.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-[#16191E] border border-[#CDD3DC]/15 space-y-3 font-mono text-xs">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-[#FF5A00]">
                <Terminal className="w-5 h-5" />
              </div>
              <h3 className="font-display text-lg font-bold uppercase text-white">Model Flexibility</h3>
              <p className="text-[#A7ADB8] leading-relaxed">
                Seamlessly toggle between Qwen3:4B, Llama 3.2, DeepSeek-R1, or Mistral depending on your hardware specs and proposal depth.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-[#16191E] border border-[#CDD3DC]/15 space-y-3 font-mono text-xs">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-[#FF5A00]">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="font-display text-lg font-bold uppercase text-white">Privacy Advantages</h3>
              <p className="text-[#A7ADB8] leading-relaxed">
                When working under strict enterprise NDAs, local processing ensures sensitive client specs and budgets remain on your physical workstation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 7: PRICING PLANS
      ========================================================================== */}
      <section className="py-24 md:py-32 bg-[#0D0F12] border-t border-white/5 relative" id="pricing">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="text-xs font-mono uppercase tracking-widest text-[#FF5A00] mb-3 flex items-center justify-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF5A00]" />
              <span>Transparent Plans</span>
            </div>
            <h2 className="font-display text-3xl sm:text-5xl font-extrabold uppercase text-white tracking-tight leading-tight">
              PRICING PLANS
            </h2>
            <p className="mt-4 text-sm sm:text-base text-[#A7ADB8] font-mono">
              Fully operational and free right now. Commercial tiers represent planned cloud synchronization features.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Free */}
            <div className="p-8 rounded-3xl bg-[#16191E] border border-[#CDD3DC]/20 flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono text-emerald-400 uppercase font-bold">Community Open-Source</span>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="font-display text-4xl font-extrabold text-white">₹0</span>
                  <span className="text-xs font-mono text-[#A7ADB8]">/month</span>
                </div>
                <p className="mt-3 text-xs font-mono text-[#A7ADB8]">
                  Run 100% locally on your machine with Ollama. Zero subscription bills, zero cloud tokens.
                </p>
                <ul className="mt-6 space-y-2 text-xs font-mono text-white/80">
                  <li className="flex items-center gap-2">✓ Unlimited local proposal generation</li>
                  <li className="flex items-center gap-2">✓ Ollama integration (Qwen3 / Llama)</li>
                  <li className="flex items-center gap-2">✓ Smart Pricing Calculator</li>
                  <li className="flex items-center gap-2">✓ Client CRM & Vector PDF export</li>
                </ul>
              </div>
              <Link
                to="/generator"
                className="mt-8 w-full py-3 rounded-full bg-white/10 hover:bg-white text-white hover:text-black font-display text-xs font-semibold uppercase text-center transition-colors"
              >
                Start Free Now
              </Link>
            </div>

            {/* Starter (Planned) */}
            <div className="p-8 rounded-3xl bg-gradient-to-b from-[#252A31] via-[#16191E] to-[#0D0F12] border border-[#FF5A00]/50 flex flex-col justify-between relative shadow-xl">
              <div className="absolute top-4 right-4 text-[10px] font-mono text-[#FF5A00] uppercase font-bold border border-[#FF5A00]/40 px-2.5 py-1 rounded-full">
                Planned Tier
              </div>
              <div>
                <span className="text-xs font-mono text-[#FF5A00] uppercase font-bold">Solo Freelancer</span>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="font-display text-4xl font-extrabold text-white">₹199</span>
                  <span className="text-xs font-mono text-[#A7ADB8]">/month</span>
                </div>
                <p className="mt-3 text-xs font-mono text-[#A7ADB8]">
                  Proposed cloud tier for multi-device sync, follow-up sequences, and custom branding.
                </p>
                <ul className="mt-6 space-y-2 text-xs font-mono text-white/80">
                  <li className="flex items-center gap-2">✓ Everything in Free Plan</li>
                  <li className="flex items-center gap-2">✓ Multi-device cloud sync</li>
                  <li className="flex items-center gap-2">✓ 4-stage client follow-up sequences</li>
                  <li className="flex items-center gap-2">✓ Custom agency typography</li>
                </ul>
              </div>
              <Link
                to="/pricing"
                className="mt-8 w-full py-3 rounded-full bg-[#FF5A00] text-white hover:bg-white hover:text-black font-display text-xs font-semibold uppercase text-center transition-colors shadow-lg shadow-[#FF5A00]/30"
              >
                View Plan Details
              </Link>
            </div>

            {/* Pro (Planned) */}
            <div className="p-8 rounded-3xl bg-[#16191E] border border-[#CDD3DC]/20 flex flex-col justify-between relative">
              <div className="absolute top-4 right-4 text-[10px] font-mono text-[#CDD3DC]/60 uppercase font-bold border border-white/10 px-2.5 py-1 rounded-full">
                Planned Tier
              </div>
              <div>
                <span className="text-xs font-mono text-[#CDD3DC] uppercase font-bold">Agency Studio</span>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="font-display text-4xl font-extrabold text-white">₹499</span>
                  <span className="text-xs font-mono text-[#A7ADB8]">/month</span>
                </div>
                <p className="mt-3 text-xs font-mono text-[#A7ADB8]">
                  Proposed agency tier for multi-seat teams managing high-volume client pipelines.
                </p>
                <ul className="mt-6 space-y-2 text-xs font-mono text-white/80">
                  <li className="flex items-center gap-2">✓ Everything in Starter Plan</li>
                  <li className="flex items-center gap-2">✓ Multi-seat workspace collaboration</li>
                  <li className="flex items-center gap-2">✓ Shared client CRM repository</li>
                  <li className="flex items-center gap-2">✓ Dedicated SLA & onboarding</li>
                </ul>
              </div>
              <Link
                to="/pricing"
                className="mt-8 w-full py-3 rounded-full bg-white/10 hover:bg-white text-white hover:text-black font-display text-xs font-semibold uppercase text-center transition-colors"
              >
                View Plan Details
              </Link>
            </div>
          </div>

          {/* FAQ Accordion */}
          <div className="mt-20 max-w-3xl mx-auto">
            <h3 className="font-display text-xl font-bold uppercase text-white mb-6 text-center">
              Frequently Asked Questions
            </h3>
            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-white/10 bg-[#16191E] overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full p-5 text-left flex items-center justify-between font-mono text-xs font-semibold text-white"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#FF5A00] transition-transform ${
                        openFaq === i ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {openFaq === i && (
                    <div className="px-5 pb-5 text-xs font-mono text-[#A7ADB8] leading-relaxed border-t border-white/5 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 8: FINAL CALL TO ACTION
      ========================================================================== */}
      <section className="py-24 bg-[#07080A] border-t border-white/5 relative">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <div className="p-12 sm:p-16 rounded-3xl bg-gradient-to-b from-[#252A31] via-[#16191E] to-[#0D0F12] border border-[#CDD3DC]/25 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#FF5A00]/15 rounded-full blur-3xl pointer-events-none" />
            <h2 className="font-display text-3xl sm:text-5xl font-extrabold uppercase text-white tracking-tight leading-tight">
              READY TO CRAFT <br />
              <span className="text-[#FF5A00]">WINNING PROPOSALS?</span>
            </h2>
            <p className="mt-4 text-xs sm:text-sm font-mono text-[#A7ADB8] max-w-xl mx-auto leading-relaxed">
              Join independent freelancers and digital agencies using local open-source AI to close bigger contracts with zero third-party subscription fees.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/generator"
                className="px-8 py-4 rounded-full bg-[#FF5A00] text-white hover:bg-white hover:text-[#07080A] font-display text-sm font-semibold tracking-wide transition-all shadow-xl shadow-[#FF5A00]/30 border border-[#FF8C32]/40"
              >
                Start Creating Now →
              </Link>
              {user ? (
                <Link
                  to="/dashboard"
                  className="px-8 py-4 rounded-full bg-white/5 border border-[#CDD3DC]/20 hover:border-white text-white font-display text-sm font-medium transition-colors"
                >
                  Launch Workspace ↗
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => openAuthModal('signin')}
                  className="px-8 py-4 rounded-full bg-white/5 border border-[#CDD3DC]/20 hover:border-white text-white font-display text-sm font-medium transition-colors"
                >
                  Sign In with Google / Email ↗
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 9: PREMIUM FOOTER
      ========================================================================== */}
      <footer className="py-12 bg-[#07080A] border-t border-white/10 text-xs font-mono text-[#A7ADB8]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-lg bg-[#FF5A00] flex items-center justify-center text-[#07080A] font-bold text-xs">
              P
            </div>
            <span className="font-display font-bold text-white text-sm">PITCHCRAFT AI</span>
            <span className="text-[#CDD3DC]/40">· Titanium UI Open-Source</span>
          </div>

          <div className="flex items-center gap-6 text-xs uppercase tracking-wider">
            <Link to="/features" className="hover:text-white transition-colors">Features</Link>
            <Link to="/how-it-works" className="hover:text-white transition-colors">How It Works</Link>
            <Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link>
            <Link to="/about" className="hover:text-white transition-colors">About</Link>
            <Link to="/dashboard" className="hover:text-[#FF5A00] transition-colors">Workspace</Link>
          </div>

          <div className="text-[11px] text-[#A7ADB8]/60">
            © 2026 PitchCraft AI. Powered by Ollama & Qwen.
          </div>
        </div>
      </footer>
    </div>
  );
};
