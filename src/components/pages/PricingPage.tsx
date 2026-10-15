import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../common/Navbar';
import { CheckCircle2, ShieldCheck, HelpCircle, ArrowRight, Sparkles, ChevronDown } from 'lucide-react';

export const PricingPage: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const plans = [
    {
      name: 'Community Open-Source',
      tier: 'Free',
      price: '₹0',
      period: '/month',
      highlight: false,
      badge: 'Permanent Local License',
      variant: 'titanium' as const,
      description: 'Run 100% locally on your machine with Ollama. Zero subscription fees, zero cloud token bills.',
      features: [
        'Unlimited local proposal generation',
        'Direct local Ollama connection (Qwen3:4B / Llama 3.2)',
        'Smart Pricing Calculator with deterministic buffers',
        'Unlimited client records in local CRM',
        'Clean vector PDF proposal export',
        'Proposal history saved to browser storage',
        '100% air-gapped NDA compliance',
      ],
      ctaText: 'Start Free Now',
      ctaLink: '/generator',
    },
    {
      name: 'Solo Freelancer (Planned)',
      tier: 'Starter',
      price: billingCycle === 'monthly' ? '₹199' : '₹159',
      period: '/month',
      highlight: true,
      badge: 'Proposed Cloud Tier',
      variant: 'graphite' as const,
      description: 'Hypothetical future hosted tier for mobile freelancers requiring cross-device cloud sync.',
      features: [
        'Everything included in Free Plan',
        'Secure multi-device cloud synchronization',
        'Automated 4-stage client follow-up sequences',
        'Custom agency logo & typography watermarks',
        'Up to 50 cloud-backed proposals / month',
        'Client view timestamp notifications',
        'Priority feature roadmap voting',
      ],
      ctaText: 'Explore Starter Proposal',
      ctaLink: '/generator',
    },
    {
      name: 'Agency Studio (Planned)',
      tier: 'Pro',
      price: billingCycle === 'monthly' ? '₹499' : '₹399',
      period: '/month',
      highlight: false,
      badge: 'Proposed Team Tier',
      variant: 'chrome' as const,
      description: 'Hypothetical agency tier for digital studios and collective teams managing multiple client pipelines.',
      features: [
        'Everything included in Starter Plan',
        'Multi-seat team workspace collaboration',
        'Shared client CRM & centralized proposal repository',
        'Advanced conversion telemetry & win-rate reporting',
        'Unlimited cloud proposals & revisions',
        'Custom contract clauses & legal disclaimer templates',
        'Dedicated SLA & technical onboarding assistance',
      ],
      ctaText: 'Explore Pro Proposal',
      ctaLink: '/generator',
    },
  ];

  const faqs = [
    {
      q: 'Is PitchCraft AI completely free today?',
      a: 'Yes. PitchCraft AI is 100% free and open-source. You can run it on your own machine using Ollama or in Local Studio Mode with in-browser persistence. No credit card or billing details are ever required.',
    },
    {
      q: 'Why are Starter and Pro plans listed?',
      a: 'The Starter (₹199) and Pro (₹499) plans represent planned commercial subscription tiers designed for hosted cloud persistence, multi-seat studio collaboration, and automated email sequences. No billing or checkout is enabled today.',
    },
    {
      q: 'Do I need paid AI tokens (OpenAI, Anthropic) to use this?',
      a: 'No. PitchCraft AI is built natively for open-weight local models through Ollama (such as Qwen3:4B and Llama 3.2). There are zero token costs.',
    },
    {
      q: 'Can I export ready-to-sign proposals without any PitchCraft branding?',
      a: 'Yes. All PDF proposals generated in PitchCraft AI are completely unbranded with clean vector styling, ready for your client signatures.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#07080A] text-[#F5F6F8] flex flex-col selection:bg-[#FF5A00] selection:text-white relative overflow-hidden">
      {/* Background Gradients & Glow */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-20 bg-[radial-gradient(#252A31_1px,transparent_1px)] [background-size:24px_24px]" />
      <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-[#FF5A00]/10 rounded-full blur-[140px] pointer-events-none" />

      <Navbar />

      <main className="relative z-10 pt-36 pb-28 max-w-7xl mx-auto px-6 w-full">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-[#CDD3DC]/15 text-xs font-mono uppercase tracking-widest text-[#FF5A00] mb-4 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#FF5A00] shadow-[0_0_8px_#FF5A00]" />
            <span>TRANSPARENT MONETIZATION ARCHITECTURE</span>
          </div>
          <h1 className="font-display text-4xl sm:text-6xl font-extrabold uppercase text-white tracking-tight leading-[1.05]">
            PLANS FOR EVERY <br />
            <span className="text-[#FF5A00]">FREELANCER & STUDIO.</span>
          </h1>

          {/* Explicit Notice Badge */}
          <div className="mt-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 max-w-2xl mx-auto font-mono text-xs text-amber-300 leading-relaxed">
            <span className="font-bold uppercase block text-amber-400 mb-1">Notice: Planned Cloud Tiers</span>
            The Starter (₹199/mo) and Pro (₹499/mo) tiers represent planned commercial cloud subscriptions. PitchCraft AI is fully operational, air-gapped, and 100% free right now in local open-source mode.
          </div>

          {/* Billing Cycle Toggle */}
          <div className="mt-8 inline-flex items-center p-1.5 rounded-full bg-[#16191E] border border-white/10 font-mono text-xs">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-5 py-2 rounded-full transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-[#FF5A00] text-white shadow-md shadow-[#FF5A00]/25 font-bold'
                  : 'text-[#A7ADB8] hover:text-white'
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-5 py-2 rounded-full transition-all flex items-center gap-1.5 ${
                billingCycle === 'annual'
                  ? 'bg-[#FF5A00] text-white shadow-md shadow-[#FF5A00]/25 font-bold'
                  : 'text-[#A7ADB8] hover:text-white'
              }`}
            >
              <span>Annual Billing</span>
              <span className="text-[10px] text-emerald-400 font-bold uppercase">Save 20%</span>
            </button>
          </div>
        </div>

        {/* 3 Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {plans.map((p) => (
            <div
              key={p.tier}
              className={`rounded-3xl p-8 flex flex-col justify-between relative shadow-2xl transition-all ${
                p.highlight
                  ? 'bg-gradient-to-b from-[#252A31] via-[#16191E] to-[#0D0F12] border-2 border-[#FF5A00] shadow-[#FF5A00]/20'
                  : 'bg-[#16191E] border border-[#CDD3DC]/15'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-xs uppercase tracking-wider text-[#FF5A00] font-bold">
                    {p.name}
                  </span>
                  <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-white/70">
                    {p.badge}
                  </span>
                </div>

                <div className="mt-4 flex items-baseline gap-2">
                  <span className="font-display text-4xl sm:text-5xl font-extrabold text-white">
                    {p.price}
                  </span>
                  <span className="text-xs font-mono text-[#A7ADB8]">{p.period}</span>
                </div>

                <p className="mt-4 text-xs font-mono text-[#A7ADB8] leading-relaxed">
                  {p.description}
                </p>

                <div className="mt-8 space-y-3 pt-6 border-t border-white/10">
                  {p.features.map((f, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs font-mono text-white/80">
                      <CheckCircle2 className="w-4 h-4 text-[#FF5A00] shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10">
                <Link
                  to={p.ctaLink}
                  className={`w-full py-3.5 rounded-full font-display text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                    p.highlight
                      ? 'bg-[#FF5A00] text-white hover:bg-white hover:text-[#07080A] shadow-lg shadow-[#FF5A00]/30 border border-[#FF8C32]/40'
                      : 'bg-white/10 hover:bg-white text-white hover:text-[#07080A]'
                  }`}
                >
                  <span>{p.ctaText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Feature Comparison Table */}
        <div className="mt-24 p-8 rounded-3xl bg-[#16191E] border border-[#CDD3DC]/15">
          <h3 className="font-display text-2xl font-bold uppercase text-white mb-6">
            Feature Comparison Matrix
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead className="border-b border-white/10 text-[#CDD3DC]">
                <tr>
                  <th className="py-4 pr-6">Capability</th>
                  <th className="py-4 px-4">Free (Active)</th>
                  <th className="py-4 px-4">Starter (Planned)</th>
                  <th className="py-4 pl-4">Pro (Planned)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-white/70">
                <tr>
                  <td className="py-3 pr-6 text-white font-semibold">Local AI Inference (Qwen3 / Llama)</td>
                  <td className="py-3 px-4 text-emerald-400">✓ Unlimited</td>
                  <td className="py-3 px-4 text-emerald-400">✓ Unlimited</td>
                  <td className="py-3 pl-4 text-emerald-400">✓ Unlimited</td>
                </tr>
                <tr>
                  <td className="py-3 pr-6 text-white font-semibold">Deterministic Pricing Calculator</td>
                  <td className="py-3 px-4 text-emerald-400">✓ Included</td>
                  <td className="py-3 px-4 text-emerald-400">✓ Included</td>
                  <td className="py-3 pl-4 text-emerald-400">✓ Included</td>
                </tr>
                <tr>
                  <td className="py-3 pr-6 text-white font-semibold">Print-Ready Vector PDF Export</td>
                  <td className="py-3 px-4 text-emerald-400">✓ Unbranded</td>
                  <td className="py-3 px-4 text-emerald-400">✓ Custom Logo</td>
                  <td className="py-3 pl-4 text-emerald-400">✓ Custom Logo</td>
                </tr>
                <tr>
                  <td className="py-3 pr-6 text-white font-semibold">Multi-Device Cloud Persistence</td>
                  <td className="py-3 px-4 text-white/30">Local Only</td>
                  <td className="py-3 px-4 text-amber-300">Planned</td>
                  <td className="py-3 pl-4 text-amber-300">Planned</td>
                </tr>
                <tr>
                  <td className="py-3 pr-6 text-white font-semibold">Team Multi-Seat Collaboration</td>
                  <td className="py-3 px-4 text-white/30">—</td>
                  <td className="py-3 px-4 text-white/30">—</td>
                  <td className="py-3 pl-4 text-amber-300">Planned</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Pricing FAQs */}
        <div className="mt-20 max-w-3xl mx-auto">
          <h3 className="font-display text-xl font-bold uppercase text-white mb-6 text-center">
            Pricing FAQs
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
      </main>
    </div>
  );
};
