import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../common/Navbar';
import { MetallicCard } from '../common/MetallicUI';
import {
  ShieldCheck,
  Cpu,
  Lock,
  Layers,
  Sparkles,
  GitBranch,
  Terminal,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#07080A] text-[#F5F6F8] flex flex-col selection:bg-[#FF5A00] selection:text-white relative overflow-hidden">
      {/* Background Gradients & Glow */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-20 bg-[radial-gradient(#252A31_1px,transparent_1px)] [background-size:24px_24px]" />
      <div className="absolute top-20 left-1/3 w-[550px] h-[550px] bg-[#FF5A00]/10 rounded-full blur-[150px] pointer-events-none" />

      <Navbar />

      <main className="relative z-10 pt-36 pb-28 max-w-5xl mx-auto px-6 w-full space-y-24">
        {/* Section 1: Hero Editorial Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-[#CDD3DC]/15 text-xs font-mono uppercase tracking-widest text-[#FF5A00] mb-4 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#FF5A00] shadow-[0_0_8px_#FF5A00]" />
            <span>MISSION & ARCHITECTURE</span>
          </div>
          <h1 className="font-display text-4xl sm:text-6xl font-extrabold uppercase text-white tracking-tight leading-[1.05]">
            FROM CLIENT BRIEFS TO <br />
            <span className="text-[#FF5A00]">WINNING PROPOSALS.</span>
          </h1>
          <p className="mt-6 text-sm sm:text-base text-[#A7ADB8] font-mono leading-relaxed">
            PitchCraft AI is an open-source, local-first artificial intelligence platform engineered to eliminate hours of unpaid proposal writing for freelancers, consultants, and digital agencies worldwide.
          </p>
        </div>

        {/* Section 2: The Real-World Problem */}
        <MetallicCard variant="titanium" className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FF5A00]/20 border border-[#FF5A00]/40 flex items-center justify-center text-[#FF5A00]">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#CDD3DC]/60 block">
                THE REAL-WORLD PROBLEM
              </span>
              <h2 className="font-display text-xl sm:text-2xl font-bold uppercase text-white">
                The Unpaid Proposal Trap
              </h2>
            </div>
          </div>

          <div className="space-y-4 font-mono text-xs sm:text-sm text-[#CDD3DC]/80 leading-relaxed">
            <p>
              Independent freelancers and digital agencies spend an estimated 10 to 15 hours every week writing bespoke client proposals, calculating phase pricing, and defining technical deliverables before earning a single dollar.
            </p>
            <p>
              When clients send messy, incomplete briefs, freelancers either rush through an unformatted quote that leads to catastrophic scope creep, or waste entire weekends writing exhaustive contracts that the client may never sign.
            </p>
            <p>
              Commercial AI tools promise help, but they demand monthly per-seat subscriptions, send sensitive client project requirements to third-party cloud servers, and produce generic boilerplate that loses bids.
            </p>
          </div>
        </MetallicCard>

        {/* Section 3: Open-Source AI Architecture */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <MetallicCard variant="graphite" className="flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#FF5A00] mb-4">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="font-display text-xl font-bold uppercase text-white mb-2">
                Ollama & Local Qwen3:4b
              </h3>
              <p className="text-xs sm:text-sm font-mono text-[#A7ADB8] leading-relaxed">
                PitchCraft AI pairs a modern React frontend with a high-performance Python FastAPI backend that interfaces directly with your local Ollama daemon. Inference executes on your GPU or Apple Silicon unified memory with sub-second responsiveness.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-white/10 text-xs font-mono text-emerald-400 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Zero Cloud Token Invoices</span>
            </div>
          </MetallicCard>

          <MetallicCard variant="graphite" className="flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#FF5A00] mb-4">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="font-display text-xl font-bold uppercase text-white mb-2">
                Air-Gapped Privacy
              </h3>
              <p className="text-xs sm:text-sm font-mono text-[#A7ADB8] leading-relaxed">
                Under strict non-disclosure agreements (NDAs), uploading client briefs to public cloud APIs can constitute a breach of contract. With PitchCraft AI, zero client information ever exits your physical hardware.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-white/10 text-xs font-mono text-emerald-400 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>100% NDA Compliance</span>
            </div>
          </MetallicCard>
        </div>

        {/* Section 4: Product Vision & Roadmap */}
        <MetallicCard variant="titanium" className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FF5A00]/20 border border-[#FF5A00]/40 flex items-center justify-center text-[#FF5A00]">
              <GitBranch className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#CDD3DC]/60 block">
                DEVELOPMENT ROADMAP
              </span>
              <h2 className="font-display text-xl sm:text-2xl font-bold uppercase text-white">
                What Lies Ahead
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-[#07080A]/60 border border-white/5 space-y-1.5 font-mono text-xs">
              <span className="text-[#FF5A00] font-bold block">Phase 1: Local Mastery</span>
              <p className="text-[#A7ADB8]">Autonomous client-side studio mode, deterministic pricing formulas, and instant vector PDF exports.</p>
              <span className="text-emerald-400 text-[11px] block pt-1">● Active</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#07080A]/60 border border-white/5 space-y-1.5 font-mono text-xs">
              <span className="text-[#CDD3DC] font-bold block">Phase 2: Hosted Sync</span>
              <p className="text-[#A7ADB8]">Optional encrypted cloud synchronization for multi-device workflows and automated client follow-ups.</p>
              <span className="text-amber-400 text-[11px] block pt-1">● In Development</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#07080A]/60 border border-white/5 space-y-1.5 font-mono text-xs">
              <span className="text-[#CDD3DC] font-bold block">Phase 3: Agency Collective</span>
              <p className="text-[#A7ADB8]">Multi-seat agency collaboration, shared proposal repositories, and conversion win telemetry.</p>
              <span className="text-white/40 text-[11px] block pt-1">● Planned</span>
            </div>
          </div>
        </MetallicCard>

        {/* Section 5: CTA */}
        <div className="text-center pt-8">
          <Link
            to="/generator"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#FF5A00] text-white hover:bg-white hover:text-[#07080A] font-display text-sm font-semibold uppercase tracking-wider transition-all shadow-xl shadow-[#FF5A00]/30 border border-[#FF8C32]/40"
          >
            <span>Launch PitchCraft AI</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>
    </div>
  );
};
