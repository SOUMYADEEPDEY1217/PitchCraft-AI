import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Header } from '../common/Header';
import { BackendGuideModal } from '../settings/BackendGuideModal';
import { ToneOfVoice, ClientBriefAnalysisResponse } from '../../types';
import { api } from '../../services/api';
import { useWorkspaceMenu } from '../layout/WorkspaceLayout';
import { useNavigate } from 'react-router-dom';
import {
  Wand2,
  Mail,
  Send,
  Sparkles,
  Copy,
  Check,
  Calendar,
  Clock,
  ArrowRight,
  Brain,
  CheckCircle2,
  AlertTriangle,
  Layers,
  ArrowUpRight,
  Cpu,
} from 'lucide-react';

export const AiToolsPage: React.FC<{ onOpenMobileMenu?: () => void }> = ({ onOpenMobileMenu }) => {
  const { proposals, settings, showToast } = useApp();
  const navigate = useNavigate();
  const [guideOpen, setGuideOpen] = useState(false);
  const workspaceContext = useWorkspaceMenu();
  const handleOpenMobile = onOpenMobileMenu || workspaceContext?.onOpenMobileMenu;
  const [activeTool, setActiveTool] = useState<
    'cover_letter' | 'follow_up' | 'brief_analyzer' | 'improver' | 'timeline'
  >('brief_analyzer');

  // --- 1. Client Brief Analyzer State ---
  const [baClient, setBaClient] = useState('');
  const [baIndustry, setBaIndustry] = useState('SaaS & Enterprise Technology');
  const [baBudget, setBaBudget] = useState<number>(15000);
  const [baDeadline, setBaDeadline] = useState('');
  const [baBrief, setBaBrief] = useState('');
  const [baResult, setBaResult] = useState<ClientBriefAnalysisResponse | null>(null);
  const [baLoading, setBaLoading] = useState(false);

  // --- 2. Cover Letter State ---
  const [clClient, setClClient] = useState('');
  const [clJobTitle, setClJobTitle] = useState('');
  const [clJobDesc, setClJobDesc] = useState('');
  const [clSkills, setClSkills] = useState('');
  const [clPortfolio, setClPortfolio] = useState('');
  const [clTone, setClTone] = useState<ToneOfVoice>('consultative');
  const [clOutput, setClOutput] = useState('');
  const [clLoading, setClLoading] = useState(false);

  // --- 3. Follow-Up Email State ---
  const [fuProposalId, setFuProposalId] = useState(proposals[0]?.id || '');
  const [fuStage, setFuStage] = useState<'gentle_nudge' | 'value_add' | 'urgent_closeout' | 'contract_signing'>('gentle_nudge');
  const [fuDays, setFuDays] = useState(3);
  const [fuOutput, setFuOutput] = useState<{ subject: string; body: string } | null>(null);
  const [fuLoading, setFuLoading] = useState(false);

  // --- 4. Proposal Improver State ---
  const [impSection, setImpSection] = useState('Executive Summary');
  const [impOriginal, setImpOriginal] = useState('');
  const [impGoal, setImpGoal] = useState<'more_persuasive' | 'justify_higher_price' | 'clearer_scope' | 'objection_proofing'>('justify_higher_price');
  const [impResult, setImpResult] = useState<{ improvedText: string; suggestions: string[] } | null>(null);
  const [impLoading, setImpLoading] = useState(false);

  // --- 5. Timeline Generator State ---
  const [tlProjectTitle, setTlProjectTitle] = useState('');
  const [tlWeeks, setTlWeeks] = useState(4);
  const [tlCategory, setTlCategory] = useState('full_stack');
  const [tlBufferPercent, setTlBufferPercent] = useState(15);
  const [tlOutput, setTlOutput] = useState<Array<{ phase: string; duration: string; deliverables: string; milestonePercent: number }> | null>(null);
  const [tlLoading, setTlLoading] = useState(false);

  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    showToast('Copied to clipboard', 'success');
  };

  const handleAnalyzeBrief = async () => {
    if (!baBrief || baBrief.length < 15) {
      showToast('Please enter at least 15 characters in the brief', 'error');
      return;
    }
    setBaLoading(true);
    try {
      const res = await api.analyzeBrief({
        brief: baBrief,
        industry: baIndustry,
        clientCompany: baClient,
        targetBudget: baBudget,
        deadline: baDeadline,
      });
      setBaResult(res);
      showToast('Client brief analyzed into 8 dimensions with Qwen3:4b', 'success');
    } catch (err: any) {
      showToast(err.message || 'Brief analysis failed', 'error');
    } finally {
      setBaLoading(false);
    }
  };

  const handleGenerateCoverLetter = async () => {
    setClLoading(true);
    try {
      const output = await api.generateCoverLetter({
        clientName: clClient,
        jobTitle: clJobTitle,
        jobDescription: clJobDesc,
        freelancerSkills: clSkills,
        portfolioHighlight: clPortfolio,
        tone: clTone,
      });
      setClOutput(output);
      showToast('Cover letter generated with AI', 'success');
    } catch {
      showToast('Error generating cover letter', 'error');
    } finally {
      setClLoading(false);
    }
  };

  const handleGenerateFollowUp = async () => {
    setFuLoading(true);
    const selectedProp = proposals.find((p) => p.id === fuProposalId) || proposals[0];
    try {
      const res = await api.generateFollowUp({
        clientName: selectedProp ? selectedProp.clientName : 'Client',
        proposalTitle: selectedProp ? selectedProp.title : 'Project Engagement',
        proposalValue: selectedProp ? selectedProp.totalBudget : 15000,
        daysSinceSent: fuDays,
        stage: fuStage,
      });
      setFuOutput(res);
      showToast('Follow-up email generated', 'success');
    } catch {
      showToast('Error generating follow-up', 'error');
    } finally {
      setFuLoading(false);
    }
  };

  const handleImproveSection = async () => {
    setImpLoading(true);
    try {
      const res = await api.improveProposalSection({
        sectionTitle: impSection,
        originalText: impOriginal,
        goal: impGoal,
      });
      setImpResult(res);
      showToast('Proposal section polished', 'success');
    } catch {
      showToast('Error improving section', 'error');
    } finally {
      setImpLoading(false);
    }
  };

  const handleGenerateTimeline = () => {
    setTlLoading(true);
    setTimeout(() => {
      const totalDays = tlWeeks * 7;
      const phase1Days = Math.max(3, Math.round(totalDays * 0.15));
      const phase2Days = Math.round(totalDays * 0.3);
      const phase3Days = Math.round(totalDays * 0.35);
      const phase4Days = Math.max(4, totalDays - phase1Days - phase2Days - phase3Days);

      setTlOutput([
        {
          phase: 'Phase 1: Discovery & Architecture Invariants',
          duration: `${phase1Days} Days`,
          deliverables: 'Architecture blueprint, data models, verified API specifications & design system tokens',
          milestonePercent: 30,
        },
        {
          phase: 'Phase 2: Core Engineering & User Interface',
          duration: `${phase2Days} Days`,
          deliverables: 'Functional components, backend service integration, state hydration & RBAC authorization',
          milestonePercent: 35,
        },
        {
          phase: 'Phase 3: Integration, Telemetry & Quality Assurance',
          duration: `${phase3Days} Days`,
          deliverables: 'Performance audit, edge-case testing, end-to-end user journeys & staging verification',
          milestonePercent: 20,
        },
        {
          phase: 'Phase 4: Production Cutover & Warranty Handover',
          duration: `${phase4Days} Days (incl. ${tlBufferPercent}% Contingency)`,
          deliverables: 'Production deployment, admin handover walkthrough, vector documentation & 30-day warranty',
          milestonePercent: 15,
        },
      ]);
      setTlLoading(false);
      showToast('Sprint timeline generated', 'success');
    }, 600);
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-[#07080A] text-[#F5F6F8] min-h-screen">
      <Header
        breadcrumbs={[{ label: 'PitchCraft AI', href: '/dashboard' }, { label: 'AI Tools Hub' }]}
        onOpenMobileMenu={handleOpenMobile}
        onOpenBackendGuide={() => setGuideOpen(true)}
      />

      <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto space-y-8">
        {/* Banner */}
        <div className="p-8 rounded-3xl border border-[#CDD3DC]/15 bg-[#16191E] shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#FF5A00]/10 rounded-full blur-3xl pointer-events-none" />

          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-[#FF5A00] mb-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF5A00]" />
              <span>Specialized Freelance Micro-Engines</span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold uppercase text-white tracking-tight">
              AI Tools Hub
            </h1>
            <p className="text-xs sm:text-sm text-[#A7ADB8] mt-1 max-w-xl font-mono leading-relaxed">
              Standalone AI utilities for discovery scanning, cover letters, client follow-up sequences, and sprint timelines.
            </p>
          </div>
        </div>

        {/* 5-Tool Navigation Switcher */}
        <div className="p-3 rounded-2xl border border-[#CDD3DC]/15 bg-[#16191E] shadow-xl flex flex-wrap gap-2">
          {[
            { id: 'brief_analyzer', label: 'Client Brief Analyzer', icon: Brain },
            { id: 'cover_letter', label: 'Cover Letter Writer', icon: Mail },
            { id: 'follow_up', label: 'Follow-Up Sequence Generator', icon: Send },
            { id: 'improver', label: 'Proposal Section Polisher', icon: Sparkles },
            { id: 'timeline', label: 'Timeline & Sprint Modeler', icon: Calendar },
          ].map((tool) => {
            const Icon = tool.icon;
            const isActive = activeTool === tool.id;
            return (
              <button
                key={tool.id}
                onClick={() => setActiveTool(tool.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-mono uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#FF5A00] text-white font-bold shadow-lg shadow-[#FF5A00]/25'
                    : 'text-[#CDD3DC]/70 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tool.label}</span>
              </button>
            );
          })}
        </div>

        {/* =========================================================================
            TOOL 1: Client Brief Analyzer
        ========================================================================== */}
        {activeTool === 'brief_analyzer' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-6 sm:p-8 rounded-3xl border border-[#CDD3DC]/15 bg-[#16191E] shadow-xl space-y-4 font-mono text-xs">
              <div>
                <h3 className="font-display text-base font-bold text-white uppercase flex items-center gap-2">
                  <Brain className="w-4 h-4 text-[#FF5A00]" />
                  <span>Brief Deconstruction Ingestion</span>
                </h3>
                <p className="text-[#A7ADB8] text-[11px] mt-0.5">
                  Detect scope traps, unstated specifications, and deliverables before you quote
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-[#A7ADB8] uppercase tracking-wider mb-1">Company / Entity</label>
                  <input
                    type="text"
                    value={baClient}
                    onChange={(e) => setBaClient(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-[#0D0F12] text-white focus:border-[#FF5A00] outline-hidden"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[#A7ADB8] uppercase tracking-wider mb-1">Industry</label>
                    <input
                      type="text"
                      value={baIndustry}
                      onChange={(e) => setBaIndustry(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-[#0D0F12] text-white focus:border-[#FF5A00] outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-[#A7ADB8] uppercase tracking-wider mb-1">Target Budget</label>
                    <input
                      type="number"
                      value={baBudget}
                      onChange={(e) => setBaBudget(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-[#0D0F12] text-white focus:border-[#FF5A00] outline-hidden font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[#A7ADB8] uppercase tracking-wider mb-1">Raw Client Brief</label>
                  <textarea
                    rows={6}
                    value={baBrief}
                    onChange={(e) => setBaBrief(e.target.value)}
                    className="w-full p-3.5 rounded-xl border border-white/10 bg-[#0D0F12] text-white focus:border-[#FF5A00] outline-hidden leading-relaxed"
                  />
                </div>

                <button
                  onClick={handleAnalyzeBrief}
                  disabled={baLoading}
                  className="w-full py-3 rounded-full bg-[#FF5A00] text-white hover:bg-white hover:text-[#07080A] font-display text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-[#FF5A00]/25 disabled:opacity-50 cursor-pointer border border-[#FF8C32]/40"
                >
                  {baLoading ? 'Deconstructing Requirements...' : 'Run Brief Discovery Scan'}
                </button>
              </div>
            </div>

            {/* Output Panel */}
            <div className="p-6 sm:p-8 rounded-3xl border border-[#CDD3DC]/15 bg-[#16191E] shadow-xl space-y-4 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="font-display text-sm font-bold uppercase text-white">Discovery Analysis</span>
                {baResult && (
                  <span className="text-emerald-400 font-bold text-[11px]">✓ Verified Scan</span>
                )}
              </div>

              {baResult ? (
                <div className="space-y-4">
                  {/* Missing Information / Scope Traps */}
                  {baResult.missing_information && baResult.missing_information.length > 0 && (
                    <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 space-y-1.5">
                      <div className="flex items-center gap-2 font-bold uppercase text-[11px]">
                        <AlertTriangle className="w-4 h-4 text-amber-400" />
                        <span>Scope Traps & Missing Information:</span>
                      </div>
                      {baResult.missing_information.map((m, i) => (
                        <p key={i} className="text-[11px]">• {m}</p>
                      ))}
                    </div>
                  )}

                  <div>
                    <span className="text-[#A7ADB8] uppercase tracking-wider text-[11px] block mb-2 font-bold">
                      Extracted Deliverables:
                    </span>
                    <div className="space-y-1.5 text-white/80">
                      {baResult.expected_deliverables?.map((d, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <span className="text-[#FF5A00]">→</span>
                          <span>{d}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-[#A7ADB8] uppercase tracking-wider text-[11px] block mb-2 font-bold">
                      Identified Project Requirements:
                    </span>
                    <div className="space-y-1.5 text-white/80">
                      {baResult.project_requirements?.map((r, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <span className="text-emerald-400">✓</span>
                          <span>{r}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => navigate(`/generator?budget=${baBudget}`)}
                    className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 hover:bg-[#FF5A00] text-white font-display text-xs font-semibold uppercase tracking-wider transition-colors"
                  >
                    <span>Draft Full Proposal From This</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="py-16 text-center text-[#A7ADB8]">
                  <Brain className="w-8 h-8 text-[#CDD3DC]/30 mx-auto mb-2" />
                  <p>Ready to analyze. Click "Run Brief Discovery Scan".</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* =========================================================================
            TOOL 2: Cover Letter Writer
        ========================================================================== */}
        {activeTool === 'cover_letter' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-6 sm:p-8 rounded-3xl border border-[#CDD3DC]/15 bg-[#16191E] shadow-xl space-y-4 font-mono text-xs">
              <div>
                <h3 className="font-display text-base font-bold text-white uppercase flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#FF5A00]" />
                  <span>Cover Letter & Upwork Pitch Writer</span>
                </h3>
                <p className="text-[#A7ADB8] text-[11px] mt-0.5">
                  Hook-driven introductory pitches matching your actual experience
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-[#A7ADB8] uppercase tracking-wider mb-1">Opportunity / Job Title</label>
                  <input
                    type="text"
                    value={clJobTitle}
                    onChange={(e) => setClJobTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-[#0D0F12] text-white focus:border-[#FF5A00] outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-[#A7ADB8] uppercase tracking-wider mb-1">Job Description or RFP Excerpt</label>
                  <textarea
                    rows={4}
                    value={clJobDesc}
                    onChange={(e) => setClJobDesc(e.target.value)}
                    className="w-full p-3 rounded-xl border border-white/10 bg-[#0D0F12] text-white focus:border-[#FF5A00] outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-[#A7ADB8] uppercase tracking-wider mb-1">Your Core Skills & Stacks</label>
                  <input
                    type="text"
                    value={clSkills}
                    onChange={(e) => setClSkills(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-[#0D0F12] text-white focus:border-[#FF5A00] outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-[#A7ADB8] uppercase tracking-wider mb-1">Key Portfolio Proof Point</label>
                  <input
                    type="text"
                    value={clPortfolio}
                    onChange={(e) => setClPortfolio(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-[#0D0F12] text-white focus:border-[#FF5A00] outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-[#A7ADB8] uppercase tracking-wider mb-1">Tone</label>
                  <select
                    value={clTone}
                    onChange={(e) => setClTone(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-white/10 bg-[#0D0F12] text-white focus:border-[#FF5A00] outline-hidden"
                  >
                    <option value="consultative">Consultative Authority</option>
                    <option value="executive">Executive & Direct</option>
                    <option value="technical">Technical Rigor</option>
                    <option value="bold">High-Conviction Bold</option>
                    <option value="casual">Friendly Agile</option>
                  </select>
                </div>

                <button
                  onClick={handleGenerateCoverLetter}
                  disabled={clLoading}
                  className="w-full py-3 rounded-full bg-[#FF5A00] text-white hover:bg-white hover:text-[#07080A] font-display text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-[#FF5A00]/25 disabled:opacity-50 cursor-pointer border border-[#FF8C32]/40"
                >
                  {clLoading ? 'Drafting Pitch...' : 'Generate Pitch Letter'}
                </button>
              </div>
            </div>

            {/* Output Panel */}
            <div className="p-6 sm:p-8 rounded-3xl border border-[#CDD3DC]/15 bg-[#16191E] shadow-xl space-y-4 font-mono text-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                  <span className="font-display text-sm font-bold uppercase text-white">Generated Cover Letter</span>
                  {clOutput && (
                    <button
                      onClick={() => copyToClipboard(clOutput, 'cl')}
                      className="inline-flex items-center gap-1.5 text-xs text-[#FF5A00] hover:text-white transition-colors"
                    >
                      {copiedId === 'cl' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedId === 'cl' ? 'Copied' : 'Copy'}</span>
                    </button>
                  )}
                </div>

                {clOutput ? (
                  <div className="p-4 rounded-2xl bg-[#0D0F12] border border-white/10 text-white/90 leading-relaxed whitespace-pre-wrap">
                    {clOutput}
                  </div>
                ) : (
                  <div className="py-20 text-center text-[#A7ADB8]">
                    <Mail className="w-8 h-8 text-[#CDD3DC]/30 mx-auto mb-2" />
                    <p>Enter job parameters to synthesize a tailored cover letter.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TOOL 3: Follow-Up Sequence Generator
        ========================================================================== */}
        {activeTool === 'follow_up' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-6 sm:p-8 rounded-3xl border border-[#CDD3DC]/15 bg-[#16191E] shadow-xl space-y-4 font-mono text-xs">
              <div>
                <h3 className="font-display text-base font-bold text-white uppercase flex items-center gap-2">
                  <Send className="w-4 h-4 text-[#FF5A00]" />
                  <span>Strategic Client Follow-Up Engine</span>
                </h3>
                <p className="text-[#A7ADB8] text-[11px] mt-0.5">
                  Multi-stage follow-ups that nudge clients without sounding needy
                </p>
              </div>

              <div className="space-y-3">
                {proposals.length > 0 && (
                  <div>
                    <label className="block text-[#A7ADB8] uppercase tracking-wider mb-1">Select Active Proposal</label>
                    <select
                      value={fuProposalId}
                      onChange={(e) => setFuProposalId(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-white/10 bg-[#0D0F12] text-white focus:border-[#FF5A00] outline-hidden"
                    >
                      {proposals.map((p) => (
                        <option key={p.id} value={p.id}>{p.title} ({p.clientCompany || p.clientName})</option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-[#A7ADB8] uppercase tracking-wider mb-1">Follow-Up Stage</label>
                  <select
                    value={fuStage}
                    onChange={(e) => setFuStage(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl border border-white/10 bg-[#0D0F12] text-white focus:border-[#FF5A00] outline-hidden"
                  >
                    <option value="gentle_nudge">Stage 1: Gentle Nudge (3-4 days)</option>
                    <option value="value_add">Stage 2: Value-Add Insight (7-10 days)</option>
                    <option value="contract_signing">Stage 3: Contract Signing Prep (14 days)</option>
                    <option value="urgent_closeout">Stage 4: Respectful Closeout / File Archival</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#A7ADB8] uppercase tracking-wider mb-1">Days Elapsed Since Proposal Sent</label>
                  <input
                    type="number"
                    value={fuDays}
                    onChange={(e) => setFuDays(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-[#0D0F12] text-white focus:border-[#FF5A00] outline-hidden"
                  />
                </div>

                <button
                  onClick={handleGenerateFollowUp}
                  disabled={fuLoading}
                  className="w-full py-3 rounded-full bg-[#FF5A00] text-white hover:bg-white hover:text-[#07080A] font-display text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-[#FF5A00]/25 disabled:opacity-50 cursor-pointer border border-[#FF8C32]/40"
                >
                  {fuLoading ? 'Formulating...' : 'Generate Follow-Up Email'}
                </button>
              </div>
            </div>

            {/* Output Panel */}
            <div className="p-6 sm:p-8 rounded-3xl border border-[#CDD3DC]/15 bg-[#16191E] shadow-xl space-y-4 font-mono text-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                  <span className="font-display text-sm font-bold uppercase text-white">Synthesized Message</span>
                  {fuOutput && (
                    <button
                      onClick={() => copyToClipboard(`Subject: ${fuOutput.subject}\n\n${fuOutput.body}`, 'fu')}
                      className="inline-flex items-center gap-1.5 text-xs text-[#FF5A00] hover:text-white transition-colors"
                    >
                      {copiedId === 'fu' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedId === 'fu' ? 'Copied' : 'Copy'}</span>
                    </button>
                  )}
                </div>

                {fuOutput ? (
                  <div className="space-y-3">
                    <div className="p-3 rounded-xl bg-[#0D0F12] border border-white/10 text-white font-semibold">
                      Subject: {fuOutput.subject}
                    </div>
                    <div className="p-4 rounded-xl bg-[#0D0F12] border border-white/10 text-white/90 leading-relaxed whitespace-pre-wrap">
                      {fuOutput.body}
                    </div>
                  </div>
                ) : (
                  <div className="py-20 text-center text-[#A7ADB8]">
                    <Send className="w-8 h-8 text-[#CDD3DC]/30 mx-auto mb-2" />
                    <p>Select a proposal and stage to formulate a professional follow-up.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TOOL 4: Proposal Section Polisher
        ========================================================================== */}
        {activeTool === 'improver' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-6 sm:p-8 rounded-3xl border border-[#CDD3DC]/15 bg-[#16191E] shadow-xl space-y-4 font-mono text-xs">
              <div>
                <h3 className="font-display text-base font-bold text-white uppercase flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#FF5A00]" />
                  <span>Proposal Section Polisher</span>
                </h3>
                <p className="text-[#A7ADB8] text-[11px] mt-0.5">
                  Targeted rewrites to justify higher pricing, sharpen scope, or overcome objections
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-[#A7ADB8] uppercase tracking-wider mb-1">Section Title</label>
                  <input
                    type="text"
                    value={impSection}
                    onChange={(e) => setImpSection(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-[#0D0F12] text-white focus:border-[#FF5A00] outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-[#A7ADB8] uppercase tracking-wider mb-1">Strategic Optimization Goal</label>
                  <select
                    value={impGoal}
                    onChange={(e) => setImpGoal(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl border border-white/10 bg-[#0D0F12] text-white focus:border-[#FF5A00] outline-hidden"
                  >
                    <option value="justify_higher_price">Justify Higher Value & ROI</option>
                    <option value="more_persuasive">More Persuasive & Executive Hook</option>
                    <option value="clearer_scope">Clarify Scope Limits & Inclusions</option>
                    <option value="objection_proofing">Objection-Proof Warranties & Guarantees</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#A7ADB8] uppercase tracking-wider mb-1">Current Section Draft</label>
                  <textarea
                    rows={6}
                    value={impOriginal}
                    onChange={(e) => setImpOriginal(e.target.value)}
                    className="w-full p-3.5 rounded-xl border border-white/10 bg-[#0D0F12] text-white focus:border-[#FF5A00] outline-hidden leading-relaxed"
                  />
                </div>

                <button
                  onClick={handleImproveSection}
                  disabled={impLoading}
                  className="w-full py-3 rounded-full bg-[#FF5A00] text-white hover:bg-white hover:text-[#07080A] font-display text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-[#FF5A00]/25 disabled:opacity-50 cursor-pointer border border-[#FF8C32]/40"
                >
                  {impLoading ? 'Polishing Draft...' : 'Apply Strategic Rewrite'}
                </button>
              </div>
            </div>

            {/* Output Panel */}
            <div className="p-6 sm:p-8 rounded-3xl border border-[#CDD3DC]/15 bg-[#16191E] shadow-xl space-y-4 font-mono text-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                  <span className="font-display text-sm font-bold uppercase text-white">Polished Proposal Text</span>
                  {impResult && (
                    <button
                      onClick={() => copyToClipboard(impResult.improvedText, 'imp')}
                      className="inline-flex items-center gap-1.5 text-xs text-[#FF5A00] hover:text-white transition-colors"
                    >
                      {copiedId === 'imp' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedId === 'imp' ? 'Copied' : 'Copy'}</span>
                    </button>
                  )}
                </div>

                {impResult ? (
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-[#0D0F12] border border-white/10 text-white/90 leading-relaxed whitespace-pre-wrap">
                      {impResult.improvedText}
                    </div>

                    {impResult.suggestions && impResult.suggestions.length > 0 && (
                      <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-2">
                        <span className="text-[#FF5A00] uppercase font-bold text-[10px]">AI Strategic Suggestions:</span>
                        {impResult.suggestions.map((s, i) => (
                          <p key={i} className="text-[#A7ADB8] text-[11px]">• {s}</p>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="py-20 text-center text-[#A7ADB8]">
                    <Sparkles className="w-8 h-8 text-[#CDD3DC]/30 mx-auto mb-2" />
                    <p>Enter text and choose an optimization goal to enhance your proposal.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TOOL 5: Timeline & Sprint Modeler
        ========================================================================== */}
        {activeTool === 'timeline' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-6 sm:p-8 rounded-3xl border border-[#CDD3DC]/15 bg-[#16191E] shadow-xl space-y-4 font-mono text-xs">
              <div>
                <h3 className="font-display text-base font-bold text-white uppercase flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#FF5A00]" />
                  <span>Timeline & Sprint Modeler</span>
                </h3>
                <p className="text-[#A7ADB8] text-[11px] mt-0.5">
                  Generate milestone delivery phases, contingency buffers, and payment milestones
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-[#A7ADB8] uppercase tracking-wider mb-1">Project Specification Title</label>
                  <input
                    type="text"
                    value={tlProjectTitle}
                    onChange={(e) => setTlProjectTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-[#0D0F12] text-white focus:border-[#FF5A00] outline-hidden"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[#A7ADB8] uppercase tracking-wider mb-1">Estimated Total Weeks</label>
                    <input
                      type="number"
                      min={1}
                      max={52}
                      value={tlWeeks}
                      onChange={(e) => setTlWeeks(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-[#0D0F12] text-white focus:border-[#FF5A00] outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-[#A7ADB8] uppercase tracking-wider mb-1">Contingency Buffer %</label>
                    <input
                      type="number"
                      min={0}
                      max={50}
                      value={tlBufferPercent}
                      onChange={(e) => setTlBufferPercent(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-[#0D0F12] text-white focus:border-[#FF5A00] outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[#A7ADB8] uppercase tracking-wider mb-1">Service Class</label>
                  <select
                    value={tlCategory}
                    onChange={(e) => setTlCategory(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-white/10 bg-[#0D0F12] text-white focus:border-[#FF5A00] outline-hidden"
                  >
                    <option value="full_stack">Full-Stack Application</option>
                    <option value="web_development">Web Development & CMS</option>
                    <option value="ui_ux_design">UI/UX Design System</option>
                    <option value="mobile_app">Mobile Application</option>
                    <option value="consulting">Architecture Consulting</option>
                  </select>
                </div>

                <button
                  onClick={handleGenerateTimeline}
                  disabled={tlLoading}
                  className="w-full py-3 rounded-full bg-[#FF5A00] text-white hover:bg-white hover:text-[#07080A] font-display text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-[#FF5A00]/25 disabled:opacity-50 cursor-pointer border border-[#FF8C32]/40"
                >
                  {tlLoading ? 'Structuring Sprints...' : 'Generate Sprint Milestones'}
                </button>
              </div>
            </div>

            {/* Output Panel */}
            <div className="p-6 sm:p-8 rounded-3xl border border-[#CDD3DC]/15 bg-[#16191E] shadow-xl space-y-4 font-mono text-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                  <span className="font-display text-sm font-bold uppercase text-white">Generated Sprint Roadmap</span>
                  {tlOutput && (
                    <span className="text-emerald-400 font-bold text-[11px]">4 Sprint Milestones</span>
                  )}
                </div>

                {tlOutput ? (
                  <div className="space-y-3">
                    {tlOutput.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl bg-[#0D0F12] border border-white/10 space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white text-xs">{item.phase}</span>
                          <span className="text-[#FF5A00] font-bold text-[11px]">{item.duration} · {item.milestonePercent}%</span>
                        </div>
                        <p className="text-[#A7ADB8] text-[11px] leading-relaxed">
                          {item.deliverables}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-20 text-center text-[#A7ADB8]">
                    <Calendar className="w-8 h-8 text-[#CDD3DC]/30 mx-auto mb-2" />
                    <p>Enter project timeline parameters to formulate sprint milestones.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      <BackendGuideModal isOpen={guideOpen} onClose={() => setGuideOpen(false)} />
    </div>
  );
};
