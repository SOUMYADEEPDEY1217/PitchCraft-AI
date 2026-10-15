import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useApp } from '../../context/AppContext';
import { Header } from '../common/Header';
import { BackendGuideModal } from '../settings/BackendGuideModal';
import { ServiceCategory, ToneOfVoice, Currency, ClientBriefAnalysisResponse } from '../../types';
import {
  Sparkles,
  Zap,
  ArrowRight,
  ArrowUpRight,
  Cpu,
  Layers,
  HelpCircle,
  Brain,
  ShieldAlert,
  ListChecks,
  FileQuestion,
  X,
  CheckCircle2,
  AlertTriangle,
  FileText,
  DollarSign,
  Calendar,
  Building,
} from 'lucide-react';
import { api } from '../../services/api';
import { useWorkspaceMenu } from '../layout/WorkspaceLayout';
import { motion, AnimatePresence } from 'motion/react';

const proposalSchema = z.object({
  clientName: z.string().min(2, 'Client name is required'),
  clientCompany: z.string().optional(),
  clientEmail: z.string().email('Invalid email address').optional().or(z.literal('')),
  projectTitle: z.string().min(3, 'Project title is required'),
  industry: z.string().min(2, 'Industry is required'),
  serviceCategory: z.enum([
    'web_development',
    'ui_ux_design',
    'branding',
    'mobile_app',
    'full_stack',
    'copywriting_content',
    'seo_marketing',
    'consulting',
  ]),
  currency: z.enum(['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'INR']),
  targetBudget: z.number().min(100, 'Budget must be at least 100'),
  deadline: z.string().min(1, 'Deadline date is required'),
  tone: z.enum(['executive', 'consultative', 'bold', 'technical', 'casual']),
  brief: z.string().min(20, 'Please provide a detailed brief of at least 20 characters'),
  includeRetainer: z.boolean().optional(),
});

type ProposalFormData = z.infer<typeof proposalSchema>;

export const ProposalGeneratorPage: React.FC<{ onOpenMobileMenu?: () => void }> = ({ onOpenMobileMenu }) => {
  const { clients, settings, generateProposal, showToast, backendStatus, currencySymbol } = useApp();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);
  const [guideOpen, setGuideOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<ClientBriefAnalysisResponse | null>(null);
  const workspaceContext = useWorkspaceMenu();
  const handleOpenMobile = onOpenMobileMenu || workspaceContext?.onOpenMobileMenu;

  const initialBudget = Number(searchParams.get('budget')) || 15000;
  const initialClientId = searchParams.get('clientId');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProposalFormData>({
    resolver: zodResolver(proposalSchema),
    defaultValues: {
      clientName: '',
      clientCompany: '',
      clientEmail: '',
      projectTitle: '',
      industry: 'SaaS & Enterprise Technology',
      serviceCategory: 'full_stack',
      currency: settings.defaultCurrency || 'USD',
      targetBudget: initialBudget,
      deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      tone: 'consultative',
      brief: '',
      includeRetainer: false,
    },
  });

  const selectedCurrency = watch('currency');
  const watchedBrief = watch('brief');
  const watchedTitle = watch('projectTitle');
  const watchedBudget = watch('targetBudget');
  const watchedDeadline = watch('deadline');
  const watchedCategory = watch('serviceCategory');

  useEffect(() => {
    if (initialClientId) {
      const client = clients.find((c) => c.id === initialClientId);
      if (client) {
        setValue('clientName', client.name);
        setValue('clientCompany', client.company);
        setValue('clientEmail', client.email);
        setValue('industry', client.industry);
      }
    }
  }, [initialClientId, clients, setValue]);

  const presetBriefs = [
    {
      title: 'SaaS Web App MVP',
      category: 'full_stack' as ServiceCategory,
      industry: 'B2B Software & AI',
      budget: 18500,
      brief:
        'Client needs a responsive React 19 single-page app with dashboard analytics, user authentication, subscription billing, and PostgreSQL/FastAPI API integration. Target launch within 6 weeks for seed investor demo.',
    },
    {
      title: 'E-Commerce Shopify Redesign',
      category: 'web_development' as ServiceCategory,
      industry: 'Direct-to-Consumer Retail',
      budget: 12500,
      brief:
        'Custom Shopify Storefront migration with interactive product configurator, 95+ Core Web Vitals score, and Klaviyo automated email integration. Needs clean mobile-first UX and fast checkout.',
    },
    {
      title: 'Mobile App UI/UX Design System',
      category: 'ui_ux_design' as ServiceCategory,
      industry: 'FinTech & Personal Finance',
      budget: 9800,
      brief:
        'Comprehensive Figma design system with 25+ screens for iOS/Android personal finance app. Includes clickable user testing prototype, micro-interactions, dark mode tokens, and design handover documentation.',
    },
  ];

  const applyPreset = (preset: typeof presetBriefs[0]) => {
    setValue('projectTitle', preset.title);
    setValue('serviceCategory', preset.category);
    setValue('industry', preset.industry);
    setValue('targetBudget', preset.budget);
    setValue('brief', preset.brief);
    showToast(`Loaded "${preset.title}" preset`, 'info');
  };

  const handleClientSelect = (clientId: string) => {
    const client = clients.find((c) => c.id === clientId);
    if (client) {
      setValue('clientName', client.name);
      setValue('clientCompany', client.company);
      setValue('clientEmail', client.email);
      setValue('industry', client.industry);
      showToast(`Selected client "${client.name}"`, 'info');
    }
  };

  const handleAnalyzeBrief = async () => {
    const briefText = watch('brief');
    if (!briefText || briefText.length < 15) {
      showToast('Please enter at least 15 characters in the brief before analyzing', 'error');
      return;
    }
    setIsAnalyzing(true);
    try {
      const res = await api.analyzeBrief({
        brief: briefText,
        industry: watch('industry'),
        clientName: watch('clientName'),
        clientCompany: watch('clientCompany'),
        targetBudget: watch('targetBudget'),
        deadline: watch('deadline'),
      });
      setAnalysisResult(res);
      showToast('Client brief analyzed with Qwen3:4B', 'success');
    } catch (err: any) {
      showToast(err.message || 'Brief analysis failed. Try local Studio mode.', 'error');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const applyAnalysisInsights = () => {
    if (!analysisResult) return;
    const currentBrief = watch('brief');
    const enriched = `${currentBrief}\n\n[AI Verified Deliverables]:\n${analysisResult.expected_deliverables.map((d) => `• ${d}`).join('\n')}\n\n[Identified Scope Invariants]:\n${analysisResult.project_requirements.map((r) => `• ${r}`).join('\n')}`;
    setValue('brief', enriched);
    showToast('Applied structured scope insights to brief', 'success');
  };

  const generationSteps = [
    'Connecting to local Ollama inference engine...',
    'Deconstructing project requirements and deliverables...',
    'Structuring explicit scope boundaries (Inclusions & Exclusions)...',
    'Synthesizing milestones and sprint timelines...',
    'Formulating pricing items, deposit schedule & terms...',
  ];

  const onSubmit = async (data: ProposalFormData) => {
    setIsGenerating(true);
    setGenerationStep(0);

    const stepInterval = setInterval(() => {
      setGenerationStep((prev) => (prev < generationSteps.length - 1 ? prev + 1 : prev));
    }, 450);

    try {
      const generated = await generateProposal({
        clientName: data.clientName,
        clientCompany: data.clientCompany,
        clientEmail: data.clientEmail,
        projectTitle: data.projectTitle,
        industry: data.industry,
        serviceCategory: data.serviceCategory,
        currency: data.currency,
        targetBudget: data.targetBudget,
        deadline: data.deadline,
        tone: data.tone,
        brief: data.brief,
        includeRetainer: data.includeRetainer,
      });

      clearInterval(stepInterval);
      navigate(`/editor/${generated.id}`);
    } catch {
      clearInterval(stepInterval);
      setIsGenerating(false);
      showToast('Error generating proposal. Please try again.', 'error');
    }
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-[#07080A] text-[#F5F6F8] min-h-screen">
      <Header
        breadcrumbs={[{ label: 'PitchCraft AI', href: '/dashboard' }, { label: 'AI Proposal Generator' }]}
        onOpenMobileMenu={handleOpenMobile}
        onOpenBackendGuide={() => setGuideOpen(true)}
      />

      <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto space-y-8">
        {/* Top Header Banner */}
        <div className="p-8 rounded-3xl border border-[#CDD3DC]/15 bg-[#16191E] shadow-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#FF5A00]/10 rounded-full blur-3xl pointer-events-none" />

          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-[#FF5A00] mb-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF5A00]" />
              <span>AI Proposal Workspace // Two-Panel Engine</span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold uppercase text-white tracking-tight">
              AI Proposal Generator
            </h1>
            <p className="text-xs sm:text-sm text-[#A7ADB8] mt-1 max-w-xl font-mono leading-relaxed">
              Convert raw client requirements into an executive contract with explicit deliverable boundaries, sprint milestones, and transparent payment schedules.
            </p>
          </div>

          {/* Preset Buttons */}
          <div className="flex flex-col gap-2 shrink-0">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#CDD3DC]/60">
              Quick Industry Presets:
            </span>
            <div className="flex flex-wrap gap-2">
              {presetBriefs.map((preset) => (
                <button
                  key={preset.title}
                  type="button"
                  onClick={() => applyPreset(preset)}
                  className="px-3 py-1.5 text-xs font-mono text-white/80 bg-white/5 hover:bg-[#FF5A00] hover:text-white rounded-xl border border-white/10 transition-colors"
                >
                  {preset.title}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Sophisticated Two-Panel AI Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* =================================================================
              LEFT PANEL (7 Cols) — INPUT FORM
          ================================================================== */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="lg:col-span-7 p-6 sm:p-8 rounded-3xl border border-[#CDD3DC]/15 bg-[#16191E] shadow-2xl space-y-6"
          >
            {/* 1. Client Identity */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h2 className="font-display text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-sm bg-[#FF5A00]" />
                  <span>01. Client & Contact Information</span>
                </h2>
                {clients.length > 0 && (
                  <select
                    onChange={(e) => handleClientSelect(e.target.value)}
                    className="text-[11px] py-1 px-2.5 rounded-xl border border-white/10 bg-[#0D0F12] text-white focus:border-[#FF5A00] outline-hidden font-mono"
                    defaultValue=""
                  >
                    <option value="" disabled>Autofill from CRM...</option>
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>{c.name} ({c.company})</option>
                    ))}
                  </select>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
                <div>
                  <label className="block uppercase tracking-wider text-[#A7ADB8] mb-1">
                    Client Contact *
                  </label>
                  <input
                    type="text"
                    placeholder="Sarah Jenkins"
                    {...register('clientName')}
                    className={`w-full py-2.5 px-3 rounded-xl border bg-[#0D0F12] text-white placeholder-white/20 focus:border-[#FF5A00] outline-hidden transition-colors ${
                      errors.clientName ? 'border-rose-500' : 'border-white/10'
                    }`}
                  />
                  {errors.clientName && (
                    <p className="text-[10px] text-rose-400 mt-0.5">{errors.clientName.message}</p>
                  )}
                </div>

                <div>
                  <label className="block uppercase tracking-wider text-[#A7ADB8] mb-1">
                    Company
                  </label>
                  <input
                    type="text"
                    placeholder="Apex Global Corp"
                    {...register('clientCompany')}
                    className="w-full py-2.5 px-3 rounded-xl border border-white/10 bg-[#0D0F12] text-white placeholder-white/20 focus:border-[#FF5A00] outline-hidden transition-colors"
                  />
                </div>

                <div>
                  <label className="block uppercase tracking-wider text-[#A7ADB8] mb-1">
                    Client Email
                  </label>
                  <input
                    type="email"
                    placeholder="contact@apex.com"
                    {...register('clientEmail')}
                    className="w-full py-2.5 px-3 rounded-xl border border-white/10 bg-[#0D0F12] text-white placeholder-white/20 focus:border-[#FF5A00] outline-hidden transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* 2. Project Title & Industry */}
            <div className="space-y-4 pt-2">
              <div className="border-b border-white/10 pb-3">
                <h2 className="font-display text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-sm bg-[#FF5A00]" />
                  <span>02. Specification & Industry Scope</span>
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
                <div>
                  <label className="block uppercase tracking-wider text-[#A7ADB8] mb-1">
                    Project Proposal Title *
                  </label>
                  <input
                    type="text"
                    placeholder="Enterprise FinTech Web App Architecture"
                    {...register('projectTitle')}
                    className={`w-full py-2.5 px-3 rounded-xl border bg-[#0D0F12] text-white placeholder-white/20 focus:border-[#FF5A00] outline-hidden transition-colors ${
                      errors.projectTitle ? 'border-rose-500' : 'border-white/10'
                    }`}
                  />
                  {errors.projectTitle && (
                    <p className="text-[10px] text-rose-400 mt-0.5">{errors.projectTitle.message}</p>
                  )}
                </div>

                <div>
                  <label className="block uppercase tracking-wider text-[#A7ADB8] mb-1">
                    Industry / Domain *
                  </label>
                  <input
                    type="text"
                    placeholder="FinTech, Healthcare, Logistics"
                    {...register('industry')}
                    className={`w-full py-2.5 px-3 rounded-xl border bg-[#0D0F12] text-white placeholder-white/20 focus:border-[#FF5A00] outline-hidden transition-colors ${
                      errors.industry ? 'border-rose-500' : 'border-white/10'
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* 3. Financial & Category */}
            <div className="space-y-4 pt-2">
              <div className="border-b border-white/10 pb-3">
                <h2 className="font-display text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-sm bg-[#FF5A00]" />
                  <span>03. Service Class & Financial Terms</span>
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 font-mono text-xs">
                <div>
                  <label className="block uppercase tracking-wider text-[#A7ADB8] mb-1">
                    Service Class *
                  </label>
                  <select
                    {...register('serviceCategory')}
                    className="w-full py-2.5 px-3 rounded-xl border border-white/10 bg-[#0D0F12] text-white focus:border-[#FF5A00] outline-hidden"
                  >
                    <option value="full_stack">Full-Stack Development</option>
                    <option value="web_development">Web Development</option>
                    <option value="ui_ux_design">UI/UX & Product Design</option>
                    <option value="mobile_app">Mobile App Engineering</option>
                    <option value="branding">Brand Identity & Strategy</option>
                    <option value="consulting">Technology Consulting</option>
                    <option value="copywriting_content">Conversion Copywriting</option>
                    <option value="seo_marketing">SEO & Growth Engineering</option>
                  </select>
                </div>

                <div>
                  <label className="block uppercase tracking-wider text-[#A7ADB8] mb-1">
                    Currency *
                  </label>
                  <select
                    {...register('currency')}
                    className="w-full py-2.5 px-3 rounded-xl border border-white/10 bg-[#0D0F12] text-white focus:border-[#FF5A00] outline-hidden"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="CAD">CAD ($)</option>
                    <option value="AUD">AUD ($)</option>
                    <option value="INR">INR (₹)</option>
                  </select>
                </div>

                <div>
                  <label className="block uppercase tracking-wider text-[#A7ADB8] mb-1">
                    Budget *
                  </label>
                  <input
                    type="number"
                    step="100"
                    {...register('targetBudget', { valueAsNumber: true })}
                    className="w-full py-2.5 px-3 rounded-xl border border-white/10 bg-[#0D0F12] text-white focus:border-[#FF5A00] outline-hidden"
                  />
                </div>

                <div>
                  <label className="block uppercase tracking-wider text-[#A7ADB8] mb-1">
                    Delivery Date *
                  </label>
                  <input
                    type="date"
                    {...register('deadline')}
                    className="w-full py-2.5 px-3 rounded-xl border border-white/10 bg-[#0D0F12] text-white focus:border-[#FF5A00] outline-hidden"
                  />
                </div>
              </div>

              {/* Tone Selection */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#A7ADB8] mb-2">
                  Tone of Voice
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {[
                    { id: 'executive', label: 'Executive' },
                    { id: 'consultative', label: 'Consultative' },
                    { id: 'technical', label: 'Technical' },
                    { id: 'bold', label: 'Bold' },
                    { id: 'casual', label: 'Casual' },
                  ].map((t) => (
                    <label
                      key={t.id}
                      className="p-2.5 rounded-xl border border-white/10 bg-[#0D0F12] hover:border-white/25 cursor-pointer text-center has-checked:border-[#FF5A00] has-checked:bg-[#FF5A00]/10"
                    >
                      <input
                        type="radio"
                        value={t.id}
                        {...register('tone')}
                        className="sr-only"
                      />
                      <span className="font-mono text-xs uppercase font-semibold text-white block">
                        {t.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* 4. Client Brief */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h2 className="font-display text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-sm bg-[#FF5A00]" />
                  <span>04. Client Brief & Requirements</span>
                </h2>

                <button
                  type="button"
                  onClick={handleAnalyzeBrief}
                  disabled={isAnalyzing}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/15 text-[11px] font-mono text-[#CDD3DC] hover:text-white hover:border-[#FF5A00] transition-all disabled:opacity-50"
                >
                  <Cpu className={`w-3.5 h-3.5 text-[#FF5A00] ${isAnalyzing ? 'animate-spin' : ''}`} />
                  <span>{isAnalyzing ? 'Scanning...' : 'Pre-Scan Brief'}</span>
                </button>
              </div>

              <div>
                <textarea
                  rows={6}
                  placeholder="Paste client requirements here (e.g. 'We need an e-commerce subscription portal with custom customer dashboards, Stripe recurring billing, and Klaviyo notifications. Deadline is 6 weeks. Budget is $15k...')"
                  {...register('brief')}
                  className={`w-full p-4 rounded-2xl border bg-[#0D0F12] text-white placeholder-white/20 text-xs font-mono leading-relaxed focus:border-[#FF5A00] outline-hidden transition-colors ${
                    errors.brief ? 'border-rose-500' : 'border-white/10'
                  }`}
                />
                {errors.brief && (
                  <p className="text-[10px] text-rose-400 font-mono mt-1">{errors.brief.message}</p>
                )}
              </div>

              <div className="flex items-center gap-2.5 text-xs font-mono text-[#A7ADB8]">
                <input
                  type="checkbox"
                  id="includeRetainer"
                  {...register('includeRetainer')}
                  className="w-4 h-4 rounded border-white/20 accent-[#FF5A00] bg-[#0D0F12]"
                />
                <label htmlFor="includeRetainer" className="cursor-pointer">
                  Include recurring monthly maintenance & SLA retainer tier in final contract proposal
                </label>
              </div>
            </div>

            {/* Primary Action Button */}
            <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-[11px] font-mono text-[#A7ADB8] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Ollama Engine: Qwen3:4b (Local / Fast Fallback)</span>
              </div>

              <button
                type="submit"
                disabled={isGenerating}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-[#FF5A00] hover:bg-white hover:text-[#07080A] text-white font-display text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-xl shadow-[#FF5A00]/25 disabled:opacity-50 cursor-pointer border border-[#FF8C32]/40"
              >
                <span>{isGenerating ? 'Synthesizing...' : 'GENERATE WITH AI'}</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* =================================================================
              RIGHT PANEL (5 Cols) — AI INTELLIGENCE & LIVE PREVIEW DESK
          ================================================================== */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* AI Engine Status Card */}
            <div className="p-6 rounded-3xl border border-[#CDD3DC]/15 bg-[#16191E] shadow-xl space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-[#A7ADB8] uppercase tracking-wider text-[11px]">AI Intelligence Desk</span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                  backendStatus.isConnected ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-300'
                }`}>
                  {backendStatus.isConnected ? 'Ollama Online' : 'Local Studio Mode'}
                </span>
              </div>

              <div className="flex items-center justify-between text-white">
                <span className="text-[#A7ADB8]">Model:</span>
                <span className="text-[#FF5A00] font-bold">Qwen3:4B / Llama 3.2</span>
              </div>
              <div className="flex items-center justify-between text-white">
                <span className="text-[#A7ADB8]">Generation Latency:</span>
                <span>~2.4 seconds</span>
              </div>
              <div className="flex items-center justify-between text-white">
                <span className="text-[#A7ADB8]">Data Privacy:</span>
                <span className="text-emerald-400">Air-Gapped Local</span>
              </div>
            </div>

            {/* Generation Progress (If Generating) */}
            {isGenerating && (
              <div className="p-6 rounded-3xl border border-[#FF5A00]/40 bg-[#16191E] shadow-2xl space-y-4">
                <div className="flex items-center gap-2 text-xs font-mono text-[#FF5A00] font-bold uppercase">
                  <Cpu className="w-4 h-4 animate-spin" />
                  <span>Synthesizing Full Proposal...</span>
                </div>
                <div className="space-y-2 font-mono text-xs text-white/80">
                  {generationSteps.map((step, idx) => (
                    <div
                      key={step}
                      className={`flex items-center gap-2 ${
                        idx <= generationStep ? 'text-emerald-400' : 'text-white/30'
                      }`}
                    >
                      <span>{idx <= generationStep ? '✓' : '○'}</span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Brief Analysis Insights Card */}
            {analysisResult ? (
              <div className="p-6 rounded-3xl border border-[#FF5A00]/30 bg-[#16191E] shadow-xl space-y-4 font-mono text-xs">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2 text-[#FF5A00] font-bold uppercase">
                    <Brain className="w-4 h-4" />
                    <span>Brief Analysis Insights</span>
                  </div>
                  <button
                    onClick={applyAnalysisInsights}
                    className="text-[10px] text-emerald-400 hover:underline uppercase font-bold"
                  >
                    + Apply to Brief
                  </button>
                </div>

                {/* Scope Traps */}
                {analysisResult.missing_information && analysisResult.missing_information.length > 0 && (
                  <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-300 space-y-1">
                    <div className="flex items-center gap-1.5 font-bold uppercase text-[10px]">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                      <span>Missing Scope Flags:</span>
                    </div>
                    {analysisResult.missing_information.map((m, i) => (
                      <p key={i} className="text-[11px]">• {m}</p>
                    ))}
                  </div>
                )}

                {/* Expected Deliverables */}
                <div>
                  <span className="text-[#A7ADB8] uppercase text-[10px] block mb-1.5 font-bold">
                    Extracted Deliverables:
                  </span>
                  <div className="space-y-1 text-white/80">
                    {analysisResult.expected_deliverables?.slice(0, 4).map((d, i) => (
                      <div key={i} className="flex items-start gap-1.5">
                        <span className="text-[#FF5A00]">→</span>
                        <span>{d}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Objectives */}
                <div>
                  <span className="text-[#A7ADB8] uppercase text-[10px] block mb-1.5 font-bold">
                    Client Objectives:
                  </span>
                  <div className="space-y-1 text-white/80">
                    {analysisResult.client_objectives?.slice(0, 3).map((o, i) => (
                      <div key={i} className="flex items-start gap-1.5">
                        <span className="text-emerald-400">✓</span>
                        <span>{o}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 rounded-3xl border border-white/10 bg-[#16191E]/60 space-y-3 font-mono text-xs text-center text-[#A7ADB8]">
                <Brain className="w-8 h-8 text-[#CDD3DC]/40 mx-auto" />
                <h4 className="font-display font-bold uppercase text-white text-sm">Brief Scanner Standby</h4>
                <p className="text-[11px] leading-relaxed">
                  Click "Pre-Scan Brief" in the left panel to detect hidden scope traps, unstated specifications, and required technical deliverables.
                </p>
              </div>
            )}

            {/* Proposal Live Preview Summary Card */}
            <div className="p-6 rounded-3xl border border-[#CDD3DC]/15 bg-[#16191E] shadow-xl space-y-3 font-mono text-xs">
              <span className="text-[#A7ADB8] uppercase tracking-wider text-[11px] block border-b border-white/10 pb-2 font-bold">
                Live Specification Summary
              </span>

              <div className="space-y-2 text-white/80">
                <div className="flex justify-between">
                  <span className="text-[#A7ADB8]">Target Project:</span>
                  <span className="font-semibold text-white truncate max-w-[180px]">{watchedTitle || 'Untitled Specification'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#A7ADB8]">Quoted Value:</span>
                  <span className="font-bold text-[#FF5A00]">{selectedCurrency} {watchedBudget.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#A7ADB8]">Estimated Milestone Sprint:</span>
                  <span>{watchedDeadline}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#A7ADB8]">Service Category:</span>
                  <span className="capitalize">{watchedCategory.replace('_', ' ')}</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>

      <BackendGuideModal isOpen={guideOpen} onClose={() => setGuideOpen(false)} />
    </div>
  );
};
