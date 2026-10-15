import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../common/Navbar';
import { MetallicCard, ChromeButton } from '../common/MetallicUI';
import {
  FileText,
  Zap,
  Calculator,
  Mail,
  Edit3,
  Download,
  Users,
  BarChart3,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { motion } from 'motion/react';

export const FeaturesPage: React.FC = () => {
  const featureList = [
    {
      num: '01',
      title: 'AI Proposal Generator',
      tag: 'Core Engine',
      description: 'Converts unstructured client RFPs and emails into comprehensive multi-section proposals with milestones, pricing tables, and contract terms.',
      icon: <FileText className="w-6 h-6 text-[#FF5A00]" />,
      link: '/generator',
      linkText: 'Open Generator',
      variant: 'titanium' as const,
      preview: (
        <div className="bg-[#07080A] border border-[#CDD3DC]/15 rounded-2xl p-5 font-mono text-xs text-[#CDD3DC]/80 space-y-2">
          <div className="text-[#FF5A00] font-bold">Input: Raw RFP / Client Email</div>
          <div className="text-emerald-400">✓ 8 Strategic Contract Sections Structured</div>
          <div className="text-[#CDD3DC]/60">→ Scope Boundaries, Deliverables & Warranties</div>
        </div>
      ),
    },
    {
      num: '02',
      title: 'Client Brief Analyzer',
      tag: 'Discovery AI',
      description: 'Scans briefs for hidden scope creep traps, unstated assumptions, missing technical specs, and realistic budget-timeline feasibility.',
      icon: <Zap className="w-6 h-6 text-[#FF5A00]" />,
      link: '/tools',
      linkText: 'Analyze Brief',
      variant: 'graphite' as const,
      preview: (
        <div className="bg-[#07080A] border border-[#CDD3DC]/15 rounded-2xl p-5 font-mono text-xs text-[#CDD3DC]/80 space-y-2">
          <div className="flex items-center justify-between text-amber-400">
            <span>Risk Detector: Active</span>
            <span>Qwen3:4b</span>
          </div>
          <div className="text-[#F5F6F8]">3 Scope ambiguities flagged for client kickoff</div>
        </div>
      ),
    },
    {
      num: '03',
      title: 'Smart Pricing Calculator',
      tag: 'Financial Math',
      description: 'Deterministic profit-margin modeler with customizable contingency buffers (0–30%), hourly rate splits, and milestone payment schedules.',
      icon: <Calculator className="w-6 h-6 text-[#FF5A00]" />,
      link: '/calculator',
      linkText: 'Launch Calculator',
      variant: 'chrome' as const,
      preview: (
        <div className="bg-[#07080A] text-white rounded-2xl p-5 font-mono text-xs space-y-2">
          <div className="flex justify-between">
            <span className="text-white/70">Labor Cost + Expenses:</span>
            <span className="font-bold">$12,000</span>
          </div>
          <div className="flex justify-between text-[#FF5A00]">
            <span>Contingency Buffer (15%):</span>
            <span className="font-bold">+$1,800</span>
          </div>
          <div className="border-t border-white/20 pt-1.5 flex justify-between font-bold text-emerald-400">
            <span>Recommended Quote:</span>
            <span>$15,870</span>
          </div>
        </div>
      ),
    },
    {
      num: '04',
      title: 'AI Cover Letter Writer',
      tag: 'Conversion Copy',
      description: 'Crafts hook-driven Upwork pitches and executive introductory notes strictly matching your actual skills without AI hallucinations.',
      icon: <Mail className="w-6 h-6 text-[#FF5A00]" />,
      link: '/tools',
      linkText: 'Generate Pitch',
      variant: 'graphite' as const,
      preview: (
        <div className="bg-[#07080A] border border-[#CDD3DC]/15 rounded-2xl p-5 font-mono text-xs text-[#CDD3DC]/80 space-y-2">
          <div className="text-white font-semibold">Tone: Consultative Authority</div>
          <p className="text-[#CDD3DC]/60 line-clamp-2">"Having reviewed your fintech roadmap, our sprint architecture eliminates..."</p>
        </div>
      ),
    },
    {
      num: '05',
      title: 'Proposal Editor',
      tag: 'Section-by-Section',
      description: 'Split-screen editing canvas with 1-click targeted rewriters: "Justify Higher Price", "Clearer Scope Boundaries", or "Warranties".',
      icon: <Edit3 className="w-6 h-6 text-[#FF5A00]" />,
      link: '/editor',
      linkText: 'Open Editor',
      variant: 'titanium' as const,
      preview: (
        <div className="bg-[#07080A] border border-[#CDD3DC]/15 rounded-2xl p-5 font-mono text-xs text-[#CDD3DC]/80 space-y-2">
          <div className="flex justify-between text-emerald-400">
            <span>Section: Scope Limits</span>
            <span>✓ Locked</span>
          </div>
          <div className="text-white/60 text-[11px]">3 Inclusions and 2 Exclusions verified</div>
        </div>
      ),
    },
    {
      num: '06',
      title: 'Professional PDF Export',
      tag: 'Client Ready',
      description: 'Generates clean, vector-rendered PDF documents ready for client signature with zero PitchCraft branding watermarks.',
      icon: <Download className="w-6 h-6 text-[#FF5A00]" />,
      link: '/history',
      linkText: 'View History & PDFs',
      variant: 'graphite' as const,
      preview: (
        <div className="bg-[#07080A] border border-[#CDD3DC]/15 rounded-2xl p-5 font-mono text-xs text-[#CDD3DC]/80 space-y-2">
          <div className="text-white font-semibold">ReportLab Binary PDF Handover</div>
          <div className="text-emerald-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Zero watermark branding</span>
          </div>
        </div>
      ),
    },
    {
      num: '07',
      title: 'Client CRM',
      tag: 'Pipeline Management',
      description: 'Track client records, total quoted values, signed deals, and contact history in one central local database.',
      icon: <Users className="w-6 h-6 text-[#FF5A00]" />,
      link: '/crm',
      linkText: 'Open Client CRM',
      variant: 'chrome' as const,
      preview: (
        <div className="bg-[#07080A] text-white rounded-2xl p-5 font-mono text-xs space-y-2">
          <div className="flex justify-between">
            <span className="text-white/70">Tracked Clients:</span>
            <span className="font-bold">Apex BioLogics</span>
          </div>
          <div className="text-emerald-400 flex justify-between font-bold">
            <span>Signed Deals:</span>
            <span>$35,000</span>
          </div>
        </div>
      ),
    },
    {
      num: '08',
      title: 'Proposal Analytics',
      tag: 'Win-Rate Telemetry',
      description: 'Real-time pipeline metrics, conversion rates, and revenue velocity tracked with responsive visual charts.',
      icon: <BarChart3 className="w-6 h-6 text-[#FF5A00]" />,
      link: '/dashboard',
      linkText: 'View Dashboard',
      variant: 'titanium' as const,
      preview: (
        <div className="bg-[#07080A] border border-[#CDD3DC]/15 rounded-2xl p-5 font-mono text-xs text-[#CDD3DC]/80 space-y-2">
          <div className="flex justify-between text-emerald-400 font-bold">
            <span>Win Conversion Rate:</span>
            <span>75%</span>
          </div>
          <div className="text-white/60 text-[11px]">Pipeline Quoted: $59,500</div>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-[#07080A] text-[#F5F6F8] flex flex-col selection:bg-[#FF5A00] selection:text-white relative overflow-hidden">
      {/* Background Texture & Ambient Light */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-20 bg-[radial-gradient(#252A31_1px,transparent_1px)] [background-size:24px_24px]" />
      <div className="absolute top-1/4 right-10 w-[500px] h-[500px] bg-[#FF5A00]/10 rounded-full blur-[140px] pointer-events-none" />

      <Navbar />

      <main className="relative z-10 pt-36 pb-28 max-w-7xl mx-auto px-6 w-full">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-24">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-[#CDD3DC]/15 text-xs font-mono uppercase tracking-widest text-[#FF5A00] mb-4 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#FF5A00] shadow-[0_0_8px_#FF5A00]" />
            <span>FULL ARCHITECTURAL SUITE</span>
          </div>
          <h1 className="font-display text-4xl sm:text-6xl font-extrabold uppercase text-white tracking-tight leading-[1.05]">
            EVERY TOOL. <br />
            <span className="text-[#FF5A00]">ONE INTELLIGENT WORKSPACE.</span>
          </h1>
          <p className="mt-6 text-sm sm:text-base text-[#A7ADB8] font-mono leading-relaxed">
            From discovering client scope creep to deterministic pricing calculations and vector PDF exports.
          </p>
        </div>

        {/* Alternating Left/Right Feature Sections */}
        <div className="space-y-16">
          {featureList.map((item, idx) => {
            const isEven = idx % 2 === 0;

            return (
              <motion.div
                key={item.num}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5 }}
                className={`grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-8 sm:p-12 rounded-3xl border border-[#CDD3DC]/15 bg-[#16191E] shadow-2xl relative overflow-hidden`}
              >
                {/* Content Side */}
                <div className={`lg:col-span-7 space-y-4 ${isEven ? 'lg:order-1' : 'lg:order-2'}`}>
                  <div className="flex items-center gap-3">
                    <span className="font-display font-black text-2xl text-[#FF5A00]">{item.num}</span>
                    <span className="text-xs font-mono uppercase tracking-widest text-[#A7ADB8]">
                      // {item.tag}
                    </span>
                  </div>

                  <h2 className="font-display text-2xl sm:text-3xl font-bold uppercase text-white tracking-tight">
                    {item.title}
                  </h2>

                  <p className="text-xs sm:text-sm font-mono text-[#A7ADB8] leading-relaxed max-w-xl">
                    {item.description}
                  </p>

                  <div className="pt-4">
                    <Link
                      to={item.link}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#FF5A00] text-white hover:bg-white hover:text-[#07080A] font-display text-xs font-semibold uppercase tracking-wider transition-all shadow-lg shadow-[#FF5A00]/25 border border-[#FF8C32]/40"
                    >
                      <span>{item.linkText}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

                {/* Preview Side */}
                <div className={`lg:col-span-5 ${isEven ? 'lg:order-2' : 'lg:order-1'}`}>
                  {item.preview}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Banner */}
        <div className="mt-24 p-12 rounded-3xl bg-gradient-to-b from-[#252A31] via-[#16191E] to-[#0D0F12] border border-[#CDD3DC]/20 text-center space-y-6">
          <h3 className="font-display text-2xl sm:text-3xl font-bold uppercase text-white tracking-tight">
            Ready to explore all tools in action?
          </h3>
          <p className="text-xs sm:text-sm font-mono text-[#A7ADB8] max-w-md mx-auto">
            Test the live proposal generator and pricing modeler directly without signing up.
          </p>
          <Link
            to="/generator"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#FF5A00] text-white hover:bg-white hover:text-[#07080A] font-display text-sm font-semibold uppercase tracking-wider transition-all shadow-xl shadow-[#FF5A00]/30 border border-[#FF8C32]/40"
          >
            <span>Launch Generator</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>
    </div>
  );
};
