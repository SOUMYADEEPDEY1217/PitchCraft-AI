import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../common/Navbar';
import {
  FileText,
  Cpu,
  Sparkles,
  Calculator,
  Download,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { motion } from 'motion/react';

export const HowItWorksPage: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Add Your Client Brief',
      subtitle: 'Raw Intake & Discovery',
      description:
        'Paste client emails, RFPs, or discovery notes directly into the workspace. Select your target delivery date, currency, and choose an authoritative tone (consultative, executive, bold, or technical).',
      detailBadge: 'Accepts Any Unstructured Text',
      icon: <FileText className="w-6 h-6 text-[#FF5A00]" />,
    },
    {
      num: '02',
      title: 'Analyze Requirements',
      subtitle: 'Discovery Deconstruction',
      description:
        'The local Ollama engine (Qwen3:4B) parses the brief across key dimensions: business objectives, technical requirements, deliverables, budget constraints, timeline feasibility, missing info, and scope trap risks.',
      detailBadge: 'Ollama Air-Gapped Engine',
      icon: <Cpu className="w-6 h-6 text-[#FF5A00]" />,
    },
    {
      num: '03',
      title: 'Generate Your Proposal',
      subtitle: 'Deterministic Synthesis',
      description:
        'In under 3 seconds, PitchCraft AI compiles an executive summary, scope boundaries (explicitly stating what is included vs excluded), milestone deliverables, and client responsibilities into a structured draft.',
      detailBadge: 'Full 8-Section Contract Specification',
      icon: <Sparkles className="w-6 h-6 text-[#FF5A00]" />,
    },
    {
      num: '04',
      title: 'Edit and Calculate',
      subtitle: 'Financial Buffer Optimization',
      description:
        'Use the built-in Smart Pricing Calculator to calibrate hours, materials, contingency buffers (0–30%), and target profit margins. The engine automatically formulates deposit, midway, and final milestone payment splits.',
      detailBadge: 'Verified Deterministic Math',
      icon: <Calculator className="w-6 h-6 text-[#FF5A00]" />,
    },
    {
      num: '05',
      title: 'Export and Track',
      subtitle: 'Client Presentation & Close',
      description:
        'Export a clean, vector-rendered PDF document with zero branding watermarks. Track proposal status in your local CRM from draft to sent, in-review, and accepted.',
      detailBadge: 'Print-Grade Binary PDF Handover',
      icon: <Download className="w-6 h-6 text-[#FF5A00]" />,
    },
  ];

  return (
    <div className="min-h-screen bg-[#07080A] text-[#F5F6F8] flex flex-col selection:bg-[#FF5A00] selection:text-white relative overflow-hidden">
      {/* Background Texture & Ambient Light */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-20 bg-[radial-gradient(#252A31_1px,transparent_1px)] [background-size:24px_24px]" />
      <div className="absolute top-1/4 left-10 w-[450px] h-[450px] bg-[#FF5A00]/10 rounded-full blur-[140px] pointer-events-none" />

      <Navbar />

      <main className="relative z-10 pt-36 pb-28 max-w-6xl mx-auto px-6 w-full">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-[#CDD3DC]/15 text-xs font-mono uppercase tracking-widest text-[#FF5A00] mb-4 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#FF5A00] shadow-[0_0_8px_#FF5A00]" />
            <span>OPERATIONAL WORKFLOW</span>
          </div>
          <h1 className="font-display text-4xl sm:text-6xl font-extrabold uppercase text-white tracking-tight leading-[1.05]">
            FROM BRIEF TO CONTRACT <br />
            <span className="text-[#FF5A00]">IN FIVE PRECISION STEPS.</span>
          </h1>
          <p className="mt-6 text-sm sm:text-base text-[#A7ADB8] font-mono leading-relaxed">
            Eliminate hours of painful manual document writing. PitchCraft AI converts chaotic client inquiries into binding commercial agreements.
          </p>
        </div>

        {/* 5-Step Connected Metallic Workflow */}
        <div className="relative space-y-8 before:absolute before:inset-0 before:left-8 md:before:left-1/2 before:w-[2px] before:bg-gradient-to-b before:from-[#FF5A00] before:via-[#CDD3DC]/20 before:to-[#FF5A00]/40 before:-translate-x-1/2 before:pointer-events-none">
          {steps.map((step, idx) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className={`relative flex flex-col md:flex-row gap-8 items-center ${
                idx % 2 === 0 ? 'md:flex-row-reverse' : ''
              }`}
            >
              {/* Content Card */}
              <div className="w-full md:w-1/2 pl-14 md:pl-0">
                <div className="p-8 rounded-3xl bg-[#16191E] border border-[#CDD3DC]/15 shadow-2xl relative overflow-hidden group hover:border-[#FF5A00]/40 transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono uppercase tracking-widest text-[#FF5A00]">
                      {step.subtitle}
                    </span>
                    <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[#CDD3DC]/80">
                      {step.detailBadge}
                    </span>
                  </div>

                  <h3 className="font-display text-xl sm:text-2xl font-bold uppercase text-white mb-3">
                    {step.title}
                  </h3>

                  <p className="text-xs sm:text-sm font-mono text-[#A7ADB8] leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>

              {/* Center Chrome Number Node */}
              <div className="absolute left-8 md:left-1/2 -translate-x-1/2 w-14 h-14 rounded-2xl bg-gradient-to-br from-[#252A31] via-[#16191E] to-[#07080A] border-2 border-[#CDD3DC]/30 text-white flex items-center justify-center font-display font-black text-lg shadow-xl shadow-black z-20 group-hover:border-[#FF5A00] transition-colors">
                <span className="text-[#FF5A00]">{step.num}</span>
              </div>

              {/* Spacer on other side */}
              <div className="hidden md:block w-1/2" />
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-24 text-center">
          <Link
            to="/generator"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#FF5A00] text-white hover:bg-white hover:text-[#07080A] font-display text-sm font-semibold uppercase tracking-wider transition-all shadow-xl shadow-[#FF5A00]/30 border border-[#FF8C32]/40"
          >
            <span>Start Step 01 Now</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>
    </div>
  );
};
