import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Header } from '../common/Header';
import { ProposalClientView } from './ProposalClientView';
import { BackendGuideModal } from '../settings/BackendGuideModal';
import { Proposal, ProposalStatus, Milestone, PricingItem } from '../../types';
import {
  Save,
  Eye,
  Edit3,
  Copy,
  Printer,
  Trash2,
  Plus,
  X,
  Sparkles,
  Calendar,
  Layers,
  DollarSign,
  FileText,
  ShieldAlert,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
} from 'lucide-react';
import { api } from '../../services/api';
import { useWorkspaceMenu } from '../layout/WorkspaceLayout';

export const ProposalEditorPage: React.FC<{ onOpenMobileMenu?: () => void }> = ({ onOpenMobileMenu }) => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const workspaceContext = useWorkspaceMenu();
  const handleOpenMobile = onOpenMobileMenu || workspaceContext?.onOpenMobileMenu;
  const {
    proposals,
    saveProposal,
    deleteProposal,
    duplicateProposal,
    settings,
    currencySymbol,
    showToast,
  } = useApp();

  const [activeProposal, setActiveProposal] = useState<Proposal | null>(null);
  const [viewMode, setViewMode] = useState<'editor' | 'preview'>('editor');
  const [activeTab, setActiveTab] = useState<'summary' | 'scope' | 'milestones' | 'pricing' | 'terms'>('summary');
  const [guideOpen, setGuideOpen] = useState(false);
  const [aiImproveModal, setAiImproveModal] = useState(false);
  const [aiImproveGoal, setAiImproveGoal] = useState<'more_persuasive' | 'justify_higher_price' | 'clearer_scope'>('justify_higher_price');
  const [isImproving, setIsImproving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  // Selective Section Regeneration State
  const [regenModalOpen, setRegenModalOpen] = useState(false);
  const [regenSectionKey, setRegenSectionKey] = useState<string>('executive_summary');
  const [regenSectionTitle, setRegenSectionTitle] = useState<string>('Executive Summary');
  const [regenInstructions, setRegenInstructions] = useState<string>('');
  const [isRegenerating, setIsRegenerating] = useState<boolean>(false);

  const openRegenModal = (sectionKey: string, sectionTitle: string) => {
    setRegenSectionKey(sectionKey);
    setRegenSectionTitle(sectionTitle);
    setRegenInstructions('');
    setRegenModalOpen(true);
  };

  const handleExecuteRegeneration = async () => {
    if (!activeProposal) return;
    setIsRegenerating(true);
    try {
      const updated = await api.regenerateProposalSection(
        activeProposal.id,
        regenSectionKey,
        regenInstructions
      );
      setActiveProposal({ ...updated });
      await saveProposal(updated);
      setRegenModalOpen(false);
      showToast(`Regenerated section "${regenSectionTitle}" with AI`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to regenerate section', 'error');
    } finally {
      setIsRegenerating(false);
    }
  };

  // Load proposal
  useEffect(() => {
    if (proposals.length === 0) return;

    if (id) {
      const found = proposals.find((p) => p.id === id);
      if (found) {
        setActiveProposal({ ...found });
      }
    } else {
      const first = proposals[0];
      if (first) {
        navigate(`/editor/${first.id}`, { replace: true });
      }
    }

    if (searchParams.get('preview') === 'client') {
      setViewMode('preview');
    }
  }, [id, proposals, navigate, searchParams]);

  if (!activeProposal) {
    return (
      <div className="flex-1 flex flex-col bg-[#07080A] text-[#F5F6F8] min-h-screen">
        <Header breadcrumbs={[{ label: 'PitchCraft AI' }, { label: 'Proposal Editor' }]} />
        <div className="p-16 text-center text-[#A7ADB8]">
          <p className="font-display text-base font-bold uppercase text-white">No proposal selected</p>
          <p className="text-xs font-mono mt-1 text-[#A7ADB8]">Select an existing proposal or generate a new one.</p>
          <Link
            to="/generator"
            className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 text-xs font-display font-semibold uppercase text-white bg-[#FF5A00] rounded-full hover:bg-white hover:text-[#07080A] transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create New Proposal</span>
          </Link>
        </div>
      </div>
    );
  }

  // Helper mutation handlers
  const updateField = <K extends keyof Proposal>(key: K, value: Proposal[K]) => {
    setActiveProposal((prev) => {
      if (!prev) return prev;
      return { ...prev, [key]: value };
    });
    setIsDirty(true);
  };

  const handleSave = async () => {
    if (!activeProposal) return;
    await saveProposal(activeProposal);
    setIsDirty(false);
    showToast('Proposal changes saved', 'success');
  };

  const handleStatusChange = (status: ProposalStatus) => {
    updateField('status', status);
    showToast(`Status updated to ${status.replace('_', ' ')}`, 'info');
  };

  // Pricing calculation helper
  const handlePricingItemChange = (itemId: string, field: 'description' | 'hoursOrUnits' | 'rate', value: any) => {
    if (!activeProposal) return;
    const items = [...(activeProposal.pricingItems || [])];
    const idx = items.findIndex((i) => i.id === itemId);
    if (idx >= 0) {
      items[idx] = { ...items[idx], [field]: value };
      items[idx].total = items[idx].hoursOrUnits * items[idx].rate;
      const totalBudget = items.reduce((acc, i) => acc + (i.total || 0), 0);
      setActiveProposal({ ...activeProposal, pricingItems: items, totalBudget });
      setIsDirty(true);
    }
  };

  const addPricingItem = () => {
    if (!activeProposal) return;
    const newItem: PricingItem = {
      id: `p-${Date.now()}`,
      description: 'Additional Feature & Integration Component',
      hoursOrUnits: 10,
      rate: settings.defaultHourlyRate || 120,
      total: (settings.defaultHourlyRate || 120) * 10,
    };
    const items = [...(activeProposal.pricingItems || []), newItem];
    const totalBudget = items.reduce((acc, i) => acc + (i.total || 0), 0);
    setActiveProposal({ ...activeProposal, pricingItems: items, totalBudget });
    setIsDirty(true);
  };

  const removePricingItem = (itemId: string) => {
    if (!activeProposal) return;
    const items = activeProposal.pricingItems.filter((i) => i.id !== itemId);
    const totalBudget = items.reduce((acc, i) => acc + (i.total || 0), 0);
    setActiveProposal({ ...activeProposal, pricingItems: items, totalBudget });
    setIsDirty(true);
  };

  // Milestone helper
  const handleMilestoneChange = (milestoneId: string, field: keyof Milestone, value: any) => {
    if (!activeProposal) return;
    const milestones = [...(activeProposal.milestones || [])];
    const idx = milestones.findIndex((m) => m.id === milestoneId);
    if (idx >= 0) {
      milestones[idx] = { ...milestones[idx], [field]: value };
      setActiveProposal({ ...activeProposal, milestones });
      setIsDirty(true);
    }
  };

  const addMilestone = () => {
    if (!activeProposal) return;
    const newM: Milestone = {
      id: `m-${Date.now()}`,
      title: 'Additional Sprint Phase',
      description: 'Deliverables and review sprint.',
      duration: 'Sprint Phase',
      deliverables: ['Milestone Deliverable'],
      amount: 2500,
    };
    setActiveProposal({ ...activeProposal, milestones: [...(activeProposal.milestones || []), newM] });
    setIsDirty(true);
  };

  const removeMilestone = (milestoneId: string) => {
    if (!activeProposal) return;
    setActiveProposal({
      ...activeProposal,
      milestones: activeProposal.milestones.filter((m) => m.id !== milestoneId),
    });
    setIsDirty(true);
  };

  // AI Improvement Tool
  const handleRunAiImprovement = async () => {
    if (!activeProposal) return;
    setIsImproving(true);
    try {
      const res = await api.improveProposalSection({
        sectionTitle: 'Executive Summary',
        originalText: activeProposal.executiveSummary,
        goal: aiImproveGoal,
      });
      updateField('executiveSummary', res.improvedText);
      setIsImproving(false);
      setAiImproveModal(false);
      showToast('Executive Summary updated with AI strategic rewrite', 'success');
    } catch {
      setIsImproving(false);
      showToast('Error improving section', 'error');
    }
  };

  const copyMarkdown = () => {
    if (!activeProposal) return;
    const md = `# ${activeProposal.title}
**Client:** ${activeProposal.clientCompany || activeProposal.clientName}
**Total Budget:** ${currencySymbol(activeProposal.currency)}${activeProposal.totalBudget.toLocaleString()}
**Target Deadline:** ${activeProposal.deadline}

## Executive Summary
${activeProposal.executiveSummary}

## Objectives
${activeProposal.objectives?.map((o) => `- ${o}`).join('\n')}

## Proposed Solution
${activeProposal.proposedSolution}

## Deliverables
${activeProposal.deliverables?.map((d) => `- [ ] ${d}`).join('\n')}

## Milestones
${activeProposal.milestones?.map((m) => `### ${m.title} (${m.duration}) - ${currencySymbol(activeProposal.currency)}${m.amount}\n${m.description}`).join('\n\n')}

## Payment Terms
${activeProposal.paymentTerms}
`;
    navigator.clipboard.writeText(md);
    showToast('Proposal copied as Markdown', 'success');
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-[#07080A] text-[#F5F6F8] min-h-screen">
      <Header
        breadcrumbs={[
          { label: 'PitchCraft AI', href: '/dashboard' },
          { label: 'Proposals', href: '/history' },
          { label: activeProposal.title },
        ]}
        onOpenMobileMenu={handleOpenMobile}
        onOpenBackendGuide={() => setGuideOpen(true)}
        actions={
          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <div className="flex items-center p-0.5 bg-[#16191E] border border-white/10 rounded-full font-mono text-xs">
              <button
                onClick={() => setViewMode('editor')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all ${
                  viewMode === 'editor'
                    ? 'bg-[#FF5A00] text-white font-bold'
                    : 'text-[#CDD3DC]/70 hover:text-white'
                }`}
              >
                <Edit3 className="w-3 h-3" />
                <span>Editor</span>
              </button>
              <button
                onClick={() => setViewMode('preview')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all ${
                  viewMode === 'preview'
                    ? 'bg-[#FF5A00] text-white font-bold'
                    : 'text-[#CDD3DC]/70 hover:text-white'
                }`}
              >
                <Eye className="w-3 h-3" />
                <span>Client View</span>
              </button>
            </div>

            <button
              onClick={handleSave}
              className={`flex items-center gap-1.5 px-4 py-1.5 text-xs font-display font-semibold uppercase rounded-full shadow-md transition-all ${
                isDirty
                  ? 'bg-emerald-500 hover:bg-emerald-400 text-white shadow-emerald-500/20'
                  : 'bg-white/10 hover:bg-white hover:text-black text-white'
              }`}
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isDirty ? 'Save Changes *' : 'Saved'}</span>
            </button>
          </div>
        }
      />

      {/* If Client Presentation View is active, render full client document preview */}
      {viewMode === 'preview' ? (
        <ProposalClientView
          proposal={activeProposal}
          settings={settings}
          currencySymbol={currencySymbol(activeProposal.currency)}
          onAcceptProposal={() => {
            updateField('status', 'accepted');
            handleSave();
          }}
          onClosePreview={() => setViewMode('editor')}
        />
      ) : (
        /* Interactive Split Workspace */
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto space-y-6">
          {/* Metadata & Quick Status Bar */}
          <div className="p-6 rounded-3xl border border-[#CDD3DC]/15 bg-[#16191E] shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 font-mono text-xs">
            <div className="flex-1 min-w-0">
              <input
                type="text"
                value={activeProposal.title}
                onChange={(e) => updateField('title', e.target.value)}
                className="text-lg font-bold font-display uppercase text-white bg-transparent border-b border-transparent hover:border-white/20 focus:border-[#FF5A00] focus:outline-hidden w-full pb-0.5"
              />
              <div className="flex flex-wrap items-center gap-3 text-xs text-[#A7ADB8] mt-1.5">
                <span>Client: <strong className="text-white">{activeProposal.clientCompany || activeProposal.clientName}</strong></span>
                <span>·</span>
                <span>Budget: <strong className="text-[#FF5A00] font-bold">{currencySymbol(activeProposal.currency)}{activeProposal.totalBudget.toLocaleString()}</strong></span>
                <span>·</span>
                <span>Deadline: {activeProposal.deadline}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              {/* Status Selector */}
              <div className="flex items-center gap-2">
                <span className="text-[#A7ADB8] text-[11px] uppercase">Status:</span>
                <select
                  value={activeProposal.status}
                  onChange={(e) => handleStatusChange(e.target.value as ProposalStatus)}
                  className="text-xs py-1.5 px-3 rounded-xl border border-white/10 bg-[#0D0F12] text-white font-bold uppercase focus:border-[#FF5A00] outline-hidden"
                >
                  <option value="draft">Draft</option>
                  <option value="sent">Sent to Client</option>
                  <option value="in_review">In Review</option>
                  <option value="accepted">Accepted & Won</option>
                  <option value="declined">Declined</option>
                </select>
              </div>

              {/* Action Buttons */}
              <button
                onClick={() => setAiImproveModal(true)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-[#FF5A00]/20 border border-[#FF5A00]/40 rounded-full hover:bg-[#FF5A00] hover:text-white transition-colors"
                title="Improve proposal with AI directives"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#FF5A00]" />
                <span>AI Polish</span>
              </button>

              <button
                onClick={copyMarkdown}
                className="p-2 text-[#CDD3DC] hover:text-white rounded-xl border border-white/10 hover:bg-white/5 transition-colors"
                title="Copy as Markdown"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => window.print()}
                className="p-2 text-[#CDD3DC] hover:text-white rounded-xl border border-white/10 hover:bg-white/5 transition-colors"
                title="Print document"
              >
                <Printer className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Section Navigation Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 font-mono text-xs">
            {[
              { id: 'summary', label: '01. Executive Summary', icon: FileText },
              { id: 'scope', label: '02. Scope & Deliverables', icon: Layers },
              { id: 'milestones', label: '03. Timeline & Sprints', icon: Calendar },
              { id: 'pricing', label: '04. Pricing & Items', icon: DollarSign },
              { id: 'terms', label: '05. Terms & Payment', icon: ShieldAlert },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all whitespace-nowrap uppercase tracking-wider ${
                    isActive
                      ? 'bg-[#FF5A00] text-white font-bold border-[#FF8C32]/40 shadow-lg shadow-[#FF5A00]/25'
                      : 'border-white/10 text-[#A7ADB8] hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* =========================================================================
              TAB 1: Executive Summary & Objectives
          ========================================================================== */}
          {activeTab === 'summary' && (
            <div className="space-y-6">
              <div className="p-6 sm:p-8 rounded-3xl border border-[#CDD3DC]/15 bg-[#16191E] shadow-xl space-y-4 font-mono text-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                  <div>
                    <h3 className="font-display text-sm font-bold uppercase text-white">Executive Summary</h3>
                    <p className="text-[11px] text-[#A7ADB8]">Sets the strategic context and business return for the client</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => openRegenModal('executive_summary', 'Executive Summary')}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-white bg-white/5 hover:bg-white/10 rounded-xl border border-white/15 font-semibold transition-colors"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#FF5A00]" />
                      <span>Regenerate with AI</span>
                    </button>
                  </div>
                </div>
                <textarea
                  rows={5}
                  value={activeProposal.executiveSummary}
                  onChange={(e) => updateField('executiveSummary', e.target.value)}
                  className="w-full p-4 text-xs leading-relaxed rounded-2xl border border-white/10 bg-[#0D0F12] text-white focus:outline-hidden focus:border-[#FF5A00] font-sans"
                />
              </div>

              {/* Problem Understanding */}
              <div className="p-6 sm:p-8 rounded-3xl border border-[#CDD3DC]/15 bg-[#16191E] shadow-xl space-y-4 font-mono text-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                  <div>
                    <h3 className="font-display text-sm font-bold uppercase text-white">Problem Understanding</h3>
                    <p className="text-[11px] text-[#A7ADB8]">Demonstrates deep comprehension of client pain points</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => openRegenModal('problem_understanding', 'Problem Understanding')}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-white bg-white/5 hover:bg-white/10 rounded-xl border border-white/15 font-semibold transition-colors shrink-0"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#FF5A00]" />
                    <span>Regenerate with AI</span>
                  </button>
                </div>
                <textarea
                  rows={4}
                  value={activeProposal.problemUnderstanding || ''}
                  onChange={(e) => updateField('problemUnderstanding', e.target.value)}
                  placeholder="Detail the client's current challenges, system pain points, and technical objectives..."
                  className="w-full p-4 text-xs leading-relaxed rounded-2xl border border-white/10 bg-[#0D0F12] text-white focus:outline-hidden focus:border-[#FF5A00] font-sans"
                />
              </div>

              {/* Objectives */}
              <div className="p-6 sm:p-8 rounded-3xl border border-[#CDD3DC]/15 bg-[#16191E] shadow-xl space-y-4 font-mono text-xs">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div>
                    <h3 className="font-display text-sm font-bold uppercase text-white">Core Project Objectives</h3>
                    <p className="text-[11px] text-[#A7ADB8]">Key metrics and operational win conditions</p>
                  </div>
                  <button
                    onClick={() => {
                      const objs = [...(activeProposal.objectives || []), 'New objective statement'];
                      updateField('objectives', objs);
                    }}
                    className="flex items-center gap-1 text-xs text-[#FF5A00] hover:text-white font-semibold"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Objective</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {activeProposal.objectives?.map((obj, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="font-mono text-xs text-[#A7ADB8] font-bold w-6">0{i + 1}.</span>
                      <input
                        type="text"
                        value={obj}
                        onChange={(e) => {
                          const objs = [...activeProposal.objectives];
                          objs[i] = e.target.value;
                          updateField('objectives', objs);
                        }}
                        className="flex-1 px-3 py-2 text-xs rounded-xl border border-white/10 bg-[#0D0F12] text-white focus:border-[#FF5A00] outline-hidden"
                      />
                      <button
                        onClick={() => {
                          const objs = activeProposal.objectives.filter((_, idx) => idx !== i);
                          updateField('objectives', objs);
                        }}
                        className="p-1.5 text-white/40 hover:text-rose-400"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Proposed Solution */}
              <div className="p-6 sm:p-8 rounded-3xl border border-[#CDD3DC]/15 bg-[#16191E] shadow-xl space-y-4 font-mono text-xs">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div>
                    <h3 className="font-display text-sm font-bold uppercase text-white">Proposed Solution & Methodology</h3>
                    <p className="text-[11px] text-[#A7ADB8]">Technical approach and communication framework</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => openRegenModal('proposed_solution', 'Proposed Solution')}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-white bg-white/5 hover:bg-white/10 rounded-xl border border-white/15 font-semibold transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#FF5A00]" />
                    <span>Regenerate with AI</span>
                  </button>
                </div>
                <textarea
                  rows={4}
                  value={activeProposal.proposedSolution}
                  onChange={(e) => updateField('proposedSolution', e.target.value)}
                  className="w-full p-4 text-xs leading-relaxed rounded-2xl border border-white/10 bg-[#0D0F12] text-white focus:outline-hidden focus:border-[#FF5A00] font-sans"
                />
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB 2: Scope & Deliverables
          ========================================================================== */}
          {activeTab === 'scope' && (
            <div className="space-y-6">
              {/* Deliverables */}
              <div className="p-6 sm:p-8 rounded-3xl border border-[#CDD3DC]/15 bg-[#16191E] shadow-xl space-y-4 font-mono text-xs">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div>
                    <h3 className="font-display text-sm font-bold uppercase text-white">Key Deliverables Checklist</h3>
                    <p className="text-[11px] text-[#A7ADB8]">Concrete tangible work outputs provided upon final delivery</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => openRegenModal('deliverables', 'Key Deliverables')}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-white bg-white/5 hover:bg-white/10 rounded-xl border border-white/15 font-semibold transition-colors"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#FF5A00]" />
                      <span>Regenerate</span>
                    </button>
                    <button
                      onClick={() => {
                        const delivs = [...(activeProposal.deliverables || []), 'New tangible deliverable'];
                        updateField('deliverables', delivs);
                      }}
                      className="flex items-center gap-1 text-xs text-[#FF5A00] font-semibold"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  {activeProposal.deliverables?.map((deliv, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={deliv}
                        onChange={(e) => {
                          const delivs = [...activeProposal.deliverables];
                          delivs[i] = e.target.value;
                          updateField('deliverables', delivs);
                        }}
                        className="flex-1 px-3 py-2 text-xs rounded-xl border border-white/10 bg-[#0D0F12] text-white focus:border-[#FF5A00] outline-hidden"
                      />
                      <button
                        onClick={() => {
                          const delivs = activeProposal.deliverables.filter((_, idx) => idx !== i);
                          updateField('deliverables', delivs);
                        }}
                        className="p-1.5 text-white/40 hover:text-rose-400"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Scope Boundaries: Included vs Excluded */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-sm font-bold uppercase text-white">Scope Boundaries (Included vs. Excluded)</h3>
                  <button
                    type="button"
                    onClick={() => openRegenModal('scope_of_work', 'Scope Boundaries')}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-white bg-white/5 hover:bg-white/10 rounded-xl border border-white/15 font-semibold transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#FF5A00]" />
                    <span>Regenerate Scope</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Included */}
                  <div className="p-6 rounded-3xl border border-emerald-500/20 bg-[#16191E] shadow-xl space-y-3 font-mono text-xs">
                    <div className="flex items-center justify-between border-b border-white/10 pb-2">
                      <h4 className="font-bold text-emerald-400 uppercase tracking-wider text-xs">Included In Scope</h4>
                      <button
                        onClick={() => {
                          const inc = [...(activeProposal.scopeIncluded || []), 'New included item'];
                          updateField('scopeIncluded', inc);
                        }}
                        className="text-xs text-[#FF5A00] hover:underline"
                      >
                        + Add
                      </button>
                    </div>
                    <div className="space-y-2">
                      {activeProposal.scopeIncluded?.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={item}
                            onChange={(e) => {
                              const copy = [...activeProposal.scopeIncluded];
                              copy[idx] = e.target.value;
                              updateField('scopeIncluded', copy);
                            }}
                            className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-white/10 bg-[#0D0F12] text-white"
                          />
                          <button
                            onClick={() => {
                              const copy = activeProposal.scopeIncluded.filter((_, i) => i !== idx);
                              updateField('scopeIncluded', copy);
                            }}
                            className="text-white/40 hover:text-rose-400 p-1"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Excluded */}
                  <div className="p-6 rounded-3xl border border-white/10 bg-[#16191E] shadow-xl space-y-3 font-mono text-xs">
                    <div className="flex items-center justify-between border-b border-white/10 pb-2">
                      <h4 className="font-bold text-[#A7ADB8] uppercase tracking-wider text-xs">Excluded (Out of Scope)</h4>
                      <button
                        onClick={() => {
                          const exc = [...(activeProposal.scopeExcluded || []), 'New excluded boundary'];
                          updateField('scopeExcluded', exc);
                        }}
                        className="text-xs text-[#FF5A00] hover:underline"
                      >
                        + Add
                      </button>
                    </div>
                    <div className="space-y-2">
                      {activeProposal.scopeExcluded?.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={item}
                            onChange={(e) => {
                              const copy = [...activeProposal.scopeExcluded];
                              copy[idx] = e.target.value;
                              updateField('scopeExcluded', copy);
                            }}
                            className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-white/10 bg-[#0D0F12] text-white"
                          />
                          <button
                            onClick={() => {
                              const copy = activeProposal.scopeExcluded.filter((_, i) => i !== idx);
                              updateField('scopeExcluded', copy);
                            }}
                            className="text-white/40 hover:text-rose-400 p-1"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB 3: Milestones & Sprints
          ========================================================================== */}
          {activeTab === 'milestones' && (
            <div className="space-y-6">
              <div className="p-6 sm:p-8 rounded-3xl border border-[#CDD3DC]/15 bg-[#16191E] shadow-xl space-y-4 font-mono text-xs">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div>
                    <h3 className="font-display text-sm font-bold uppercase text-white">Delivery Timeline & Milestones</h3>
                    <p className="text-[11px] text-[#A7ADB8]">Break project execution into progressive invoiceable gates</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => openRegenModal('milestones', 'Project Milestones')}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-white bg-white/5 hover:bg-white/10 rounded-xl border border-white/15 font-semibold transition-colors"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#FF5A00]" />
                      <span>Regenerate with AI</span>
                    </button>
                    <button
                      onClick={addMilestone}
                      className="flex items-center gap-1 text-xs font-semibold text-[#FF5A00]"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Milestone</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  {activeProposal.milestones?.map((milestone) => (
                    <div
                      key={milestone.id}
                      className="p-5 rounded-2xl border border-white/10 bg-[#0D0F12] space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <input
                            type="text"
                            value={milestone.title}
                            onChange={(e) => handleMilestoneChange(milestone.id, 'title', e.target.value)}
                            placeholder="Milestone Title"
                            className="px-3 py-2 text-xs font-semibold rounded-xl border border-white/10 bg-[#16191E] text-white"
                          />
                          <input
                            type="text"
                            value={milestone.duration}
                            onChange={(e) => handleMilestoneChange(milestone.id, 'duration', e.target.value)}
                            placeholder="Duration (e.g. Weeks 1–2)"
                            className="px-3 py-2 text-xs rounded-xl border border-white/10 bg-[#16191E] text-white"
                          />
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1 font-mono text-xs">
                            <span className="text-[#A7ADB8]">{currencySymbol(activeProposal.currency)}</span>
                            <input
                              type="number"
                              value={milestone.amount}
                              onChange={(e) => handleMilestoneChange(milestone.id, 'amount', Number(e.target.value))}
                              className="w-24 px-2.5 py-1.5 text-xs font-bold rounded-xl border border-white/10 bg-[#16191E] text-white text-right"
                            />
                          </div>
                          <button
                            onClick={() => removeMilestone(milestone.id)}
                            className="p-1.5 text-white/40 hover:text-rose-400"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <textarea
                        rows={2}
                        value={milestone.description}
                        onChange={(e) => handleMilestoneChange(milestone.id, 'description', e.target.value)}
                        placeholder="Milestone scope and objectives description..."
                        className="w-full p-3 text-xs rounded-xl border border-white/10 bg-[#16191E] text-white font-sans"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB 4: Pricing Items Table
          ========================================================================== */}
          {activeTab === 'pricing' && (
            <div className="space-y-6">
              <div className="p-6 sm:p-8 rounded-3xl border border-[#CDD3DC]/15 bg-[#16191E] shadow-xl space-y-4 font-mono text-xs">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div>
                    <h3 className="font-display text-sm font-bold uppercase text-white">Itemized Quotation Breakdown</h3>
                    <p className="text-[11px] text-[#A7ADB8]">Hours, units, and rates automatically calculate grand total</p>
                  </div>
                  <button
                    onClick={addPricingItem}
                    className="flex items-center gap-1 text-xs font-semibold text-[#FF5A00]"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Line Item</span>
                  </button>
                </div>

                <div className="border border-white/10 rounded-2xl overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-[#252A31] border-b border-white/10 text-[#CDD3DC] font-semibold text-[11px] uppercase">
                      <tr>
                        <th className="py-3 px-4">Item / Component</th>
                        <th className="py-3 px-4 text-right w-24">Hours</th>
                        <th className="py-3 px-4 text-right w-28">Rate ({currencySymbol(activeProposal.currency)})</th>
                        <th className="py-3 px-4 text-right w-32">Total</th>
                        <th className="py-3 px-4 text-right w-12"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {activeProposal.pricingItems?.map((item) => (
                        <tr key={item.id}>
                          <td className="py-2.5 px-4">
                            <input
                              type="text"
                              value={item.description}
                              onChange={(e) => handlePricingItemChange(item.id, 'description', e.target.value)}
                              className="w-full px-2 py-1 text-xs rounded-lg border border-white/10 bg-[#0D0F12] text-white"
                            />
                          </td>
                          <td className="py-2.5 px-4 text-right">
                            <input
                              type="number"
                              value={item.hoursOrUnits}
                              onChange={(e) => handlePricingItemChange(item.id, 'hoursOrUnits', Number(e.target.value))}
                              className="w-16 px-2 py-1 text-xs text-right font-mono rounded-lg border border-white/10 bg-[#0D0F12] text-white"
                            />
                          </td>
                          <td className="py-2.5 px-4 text-right">
                            <input
                              type="number"
                              value={item.rate}
                              onChange={(e) => handlePricingItemChange(item.id, 'rate', Number(e.target.value))}
                              className="w-16 px-2 py-1 text-xs text-right font-mono rounded-lg border border-white/10 bg-[#0D0F12] text-white"
                            />
                          </td>
                          <td className="py-2.5 px-4 text-right font-mono font-bold text-white tabular-nums">
                            {currencySymbol(activeProposal.currency)}{item.total?.toLocaleString()}
                          </td>
                          <td className="py-2.5 px-4 text-right">
                            <button
                              onClick={() => removePricingItem(item.id)}
                              className="p-1 text-white/40 hover:text-rose-400"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-[#0D0F12] border-t border-white/10 font-bold">
                      <tr>
                        <td colSpan={3} className="py-3 px-4 text-right text-xs uppercase text-[#A7ADB8]">
                          Grand Total Fixed Price:
                        </td>
                        <td className="py-3 px-4 text-right font-mono text-sm text-[#FF5A00] tabular-nums">
                          {currencySymbol(activeProposal.currency)}{activeProposal.totalBudget?.toLocaleString()}
                        </td>
                        <td></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB 5: Terms & Payment
          ========================================================================== */}
          {activeTab === 'terms' && (
            <div className="space-y-6">
              <div className="p-6 sm:p-8 rounded-3xl border border-[#CDD3DC]/15 bg-[#16191E] shadow-xl space-y-4 font-mono text-xs">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div>
                    <h3 className="font-display text-sm font-bold uppercase text-white">Payment Terms & Milestones</h3>
                    <p className="text-[11px] text-[#A7ADB8]">Payment gates and deposit disbursement structure</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => openRegenModal('payment_terms', 'Payment Terms')}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-white bg-white/5 hover:bg-white/10 rounded-xl border border-white/15 font-semibold transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#FF5A00]" />
                    <span>Regenerate with AI</span>
                  </button>
                </div>
                <textarea
                  rows={3}
                  value={activeProposal.paymentTerms}
                  onChange={(e) => updateField('paymentTerms', e.target.value)}
                  className="w-full p-4 text-xs leading-relaxed rounded-2xl border border-white/10 bg-[#0D0F12] text-white"
                />
              </div>

              <div className="p-6 sm:p-8 rounded-3xl border border-[#CDD3DC]/15 bg-[#16191E] shadow-xl space-y-4 font-mono text-xs">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div>
                    <h3 className="font-display text-sm font-bold uppercase text-white">Terms & Conditions / IP Clause</h3>
                    <p className="text-[11px] text-[#A7ADB8]">Intellectual property transfer, revision caps, and warranties</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => openRegenModal('terms_and_conditions', 'Terms & Conditions')}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-white bg-white/5 hover:bg-white/10 rounded-xl border border-white/15 font-semibold transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#FF5A00]" />
                    <span>Regenerate with AI</span>
                  </button>
                </div>
                <textarea
                  rows={4}
                  value={activeProposal.termsAndConditions || ''}
                  onChange={(e) => updateField('termsAndConditions', e.target.value)}
                  className="w-full p-4 text-xs leading-relaxed rounded-2xl border border-white/10 bg-[#0D0F12] text-white"
                />
              </div>
            </div>
          )}
        </main>
      )}

      {/* AI Improvement Modal */}
      {aiImproveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-gradient-to-b from-[#252A31] via-[#16191E] to-[#0D0F12] border border-[#CDD3DC]/20 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-display text-sm font-bold uppercase text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#FF5A00]" />
                <span>Strategic AI Rewrite</span>
              </h3>
              <button onClick={() => setAiImproveModal(false)} className="text-[#A7ADB8] hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-[#A7ADB8] text-[11px] leading-relaxed">
              Select an optimization target for the Executive Summary to strengthen your win probability:
            </p>

            <div className="space-y-2">
              {[
                { id: 'justify_higher_price', label: 'Justify Higher Value', desc: 'Emphasize commercial ROI & risk reduction' },
                { id: 'more_persuasive', label: 'More Persuasive & Punchy', desc: 'Sharpen executive hooks & active voice' },
                { id: 'clearer_scope', label: 'Clarify Scope & Boundaries', desc: 'Bulletproof against scope creep' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setAiImproveGoal(opt.id as any)}
                  className={`w-full p-3 rounded-2xl border text-left transition-all ${
                    aiImproveGoal === opt.id
                      ? 'border-[#FF5A00] bg-[#FF5A00]/10 text-white font-bold'
                      : 'border-white/10 text-[#A7ADB8] hover:bg-white/5'
                  }`}
                >
                  <p className="text-xs font-semibold text-white">{opt.label}</p>
                  <p className="text-[11px] text-[#A7ADB8] mt-0.5">{opt.desc}</p>
                </button>
              ))}
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setAiImproveModal(false)}
                className="px-4 py-2 text-xs rounded-full border border-white/10 hover:bg-white/5 text-[#A7ADB8]"
              >
                Cancel
              </button>
              <button
                onClick={handleRunAiImprovement}
                disabled={isImproving}
                className="px-5 py-2 text-xs font-display font-semibold uppercase text-white bg-[#FF5A00] hover:bg-white hover:text-[#07080A] rounded-full disabled:opacity-50 transition-colors"
              >
                {isImproving ? 'Polishing...' : 'Apply Rewrite'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Selective Section Regeneration Modal */}
      {regenModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-gradient-to-b from-[#252A31] via-[#16191E] to-[#0D0F12] border border-[#CDD3DC]/20 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-display text-sm font-bold uppercase text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#FF5A00]" />
                <span>Regenerate: {regenSectionTitle}</span>
              </h3>
              <button onClick={() => setRegenModalOpen(false)} className="text-[#A7ADB8] hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-[#A7ADB8] text-[11px] leading-relaxed">
              Only this specific section will be regenerated via local Qwen3:4b. All other proposal sections and pricing items remain intact.
            </p>

            <div>
              <label className="block text-[#A7ADB8] uppercase tracking-wider mb-1">
                Custom Regeneration Directive (Optional)
              </label>
              <textarea
                rows={3}
                value={regenInstructions}
                onChange={(e) => setRegenInstructions(e.target.value)}
                placeholder="e.g. Make it more technical, highlight compliance safeguards..."
                className="w-full p-3 text-xs rounded-xl border border-white/10 bg-[#0D0F12] text-white focus:outline-hidden focus:border-[#FF5A00]"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setRegenModalOpen(false)}
                className="px-4 py-2 text-xs rounded-full border border-white/10 hover:bg-white/5 text-[#A7ADB8]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteRegeneration}
                disabled={isRegenerating}
                className="px-5 py-2 text-xs font-display font-semibold uppercase text-white bg-[#FF5A00] hover:bg-white hover:text-[#07080A] rounded-full disabled:opacity-50 transition-colors flex items-center gap-1.5"
              >
                <Sparkles className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin' : ''}`} />
                <span>{isRegenerating ? 'Regenerating...' : 'Regenerate Section'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <BackendGuideModal isOpen={guideOpen} onClose={() => setGuideOpen(false)} />
    </div>
  );
};
