import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { Header } from '../common/Header';
import { RevenueChart } from './RevenueChart';
import { RecentProposalsTable } from './RecentProposalsTable';
import { BackendGuideModal } from '../settings/BackendGuideModal';
import {
  FileText,
  CheckCircle2,
  DollarSign,
  TrendingUp,
  Calculator,
  Users,
  Wand2,
  Clock,
  ArrowUpRight,
  Sparkles,
  ArrowRight,
  Building,
  Plus,
  ShieldCheck,
} from 'lucide-react';
import { useWorkspaceMenu } from '../layout/WorkspaceLayout';

export const DashboardPage: React.FC<{ onOpenMobileMenu?: () => void }> = ({ onOpenMobileMenu }) => {
  const { proposals, clients, formatCurrency, currencySymbol, settings } = useApp();
  const { user, userProfile } = useAuth();
  const [guideOpen, setGuideOpen] = useState(false);
  const workspaceContext = useWorkspaceMenu();
  const handleOpenMobile = onOpenMobileMenu || workspaceContext?.onOpenMobileMenu;

  // Derive personalized user display name
  const userName =
    userProfile?.displayName ||
    user?.displayName ||
    (user?.email ? user.email.split('@')[0] : '') ||
    settings.freelancerName ||
    'Creator';

  // Compute metrics from actual user-isolated data
  const totalProposals = proposals.length;
  const acceptedProposals = proposals.filter((p) => p.status === 'accepted').length;
  const inReviewProposals = proposals.filter((p) => p.status === 'in_review').length;
  const sentProposals = proposals.filter((p) => p.status === 'sent').length;
  const draftProposals = proposals.filter((p) => p.status === 'draft').length;

  const totalQuotedValue = proposals.reduce((acc, p) => acc + (p.totalBudget || 0), 0);
  const totalWonValue = proposals
    .filter((p) => p.status === 'accepted')
    .reduce((acc, p) => acc + (p.totalBudget || 0), 0);

  const conversionRate = totalProposals > 0 ? Math.round((acceptedProposals / totalProposals) * 100) : 0;

  // Recent clients (up to 4)
  const recentClients = clients.slice(0, 4);

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-[#07080A] text-[#F5F6F8] min-h-screen">
      <Header
        breadcrumbs={[{ label: 'PitchCraft AI' }, { label: 'Dashboard' }]}
        onOpenMobileMenu={handleOpenMobile}
        onOpenBackendGuide={() => setGuideOpen(true)}
        actions={
          <Link
            to="/generator"
            className="group flex items-center gap-2 px-4 py-2 text-xs font-display font-semibold text-white bg-[#FF5A00] hover:bg-white hover:text-[#07080A] rounded-xl transition-all whitespace-nowrap shadow-md shadow-[#FF5A00]/25 border border-[#FF8C32]/40"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Proposal</span>
            <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:rotate-45" />
          </Link>
        }
      />

      <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto space-y-8">
        {/* Personalized Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-[#CDD3DC]/15">
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-[#FF5A00] mb-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF5A00] animate-pulse" />
              <span>Private Account Active · Data Strictly Isolated</span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold uppercase text-white tracking-tight">
              Welcome, {userName}.
            </h1>
            <p className="mt-2 text-xs sm:text-sm font-mono text-[#A7ADB8]">
              {totalProposals === 0 ? (
                <span>Your workspace is ready. Generate your first high-converting proposal below.</span>
              ) : (
                <span>
                  Your proposal pipeline is operating at{' '}
                  <span className="text-emerald-400 font-bold">{conversionRate}% win rate</span> across{' '}
                  {totalProposals} tracked specifications.
                </span>
              )}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/generator"
              className="px-5 py-2.5 rounded-xl bg-white text-[#07080A] hover:bg-[#FF5A00] hover:text-white font-display text-xs font-semibold tracking-wider uppercase transition-all shadow-md flex items-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Create Proposal</span>
            </Link>
          </div>
        </div>

        {/* Empty State Banner for New Accounts */}
        {totalProposals === 0 && (
          <div className="p-8 rounded-3xl border border-[#CDD3DC]/20 bg-gradient-to-r from-[#16191E] via-[#121418] to-[#16191E] shadow-2xl relative overflow-hidden">
            <div className="absolute right-0 top-0 w-80 h-full bg-[#FF5A00]/5 blur-3xl pointer-events-none" />
            <div className="relative z-10 max-w-2xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[#FF5A00]/10 border border-[#FF5A00]/30 text-[#FF5A00] text-[11px] font-mono uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Zero Demo Data · Verified Clean Account</span>
              </div>
              <h2 className="font-display text-2xl font-bold uppercase text-white tracking-tight">
                Create Your First Proposal
              </h2>
              <p className="text-xs font-mono text-[#A7ADB8] leading-relaxed">
                Transform any client brief into a comprehensive project specification with AI-driven milestones, deliverables, pricing tiers, and direct PDF export.
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  to="/generator"
                  className="px-6 py-3 rounded-xl bg-[#FF5A00] hover:bg-white text-[#07080A] font-display font-bold text-xs tracking-wider uppercase transition-all shadow-lg shadow-[#FF5A00]/30 flex items-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Create Your First Proposal</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/crm"
                  className="px-5 py-3 rounded-xl bg-white/[0.04] hover:bg-white/10 border border-white/10 text-white font-mono text-xs font-semibold transition-all flex items-center gap-2"
                >
                  <Users className="w-4 h-4 text-[#FF5A00]" />
                  <span>Add First Client</span>
                </Link>
                <Link
                  to="/calculator"
                  className="px-5 py-3 rounded-xl bg-white/[0.04] hover:bg-white/10 border border-white/10 text-white font-mono text-xs font-semibold transition-all flex items-center gap-2"
                >
                  <Calculator className="w-4 h-4 text-[#FF5A00]" />
                  <span>Model Pricing</span>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* 6 Key Metrics Grid (Asymmetric Titanium Cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {/* 1. Total Quoted */}
          <div className="p-5 rounded-2xl border border-[#CDD3DC]/15 bg-[#16191E] shadow-xl relative overflow-hidden group hover:border-white/20 transition-all">
            <div className="flex items-center justify-between text-[#CDD3DC]/80">
              <span className="text-[11px] font-mono uppercase tracking-wider">Quoted Value</span>
              <DollarSign className="w-4 h-4 text-[#FF5A00]" />
            </div>
            <div className="mt-3 text-2xl font-display font-extrabold tracking-tight text-white font-mono">
              {formatCurrency(totalQuotedValue)}
            </div>
            <div className="mt-1 text-[11px] font-mono text-[#A7ADB8]">
              {totalProposals} specifications
            </div>
          </div>

          {/* 2. Won Revenue */}
          <div className="p-5 rounded-2xl border border-emerald-500/30 bg-[#16191E] shadow-xl relative overflow-hidden group hover:border-emerald-500/50 transition-all">
            <div className="flex items-center justify-between text-emerald-400">
              <span className="text-[11px] font-mono uppercase tracking-wider">Won Revenue</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="mt-3 text-2xl font-display font-extrabold tracking-tight text-emerald-400 font-mono">
              {formatCurrency(totalWonValue)}
            </div>
            <div className="mt-1 text-[11px] font-mono text-[#A7ADB8]">
              {acceptedProposals} closed deals
            </div>
          </div>

          {/* 3. Conversion Rate */}
          <div className="p-5 rounded-2xl border border-[#CDD3DC]/15 bg-[#16191E] shadow-xl relative overflow-hidden group hover:border-white/20 transition-all">
            <div className="flex items-center justify-between text-[#CDD3DC]/80">
              <span className="text-[11px] font-mono uppercase tracking-wider">Win Rate</span>
              <TrendingUp className="w-4 h-4 text-[#FF5A00]" />
            </div>
            <div className="mt-3 text-2xl font-display font-extrabold tracking-tight text-white font-mono">
              {conversionRate}%
            </div>
            <div className="mt-1 text-[11px] font-mono text-[#A7ADB8]">
              {acceptedProposals} of {totalProposals} closed
            </div>
          </div>

          {/* 4. Total Proposals */}
          <div className="p-5 rounded-2xl border border-[#CDD3DC]/15 bg-[#16191E] shadow-xl relative overflow-hidden group hover:border-white/20 transition-all">
            <div className="flex items-center justify-between text-[#CDD3DC]/80">
              <span className="text-[11px] font-mono uppercase tracking-wider">Total</span>
              <FileText className="w-4 h-4 text-[#FF5A00]" />
            </div>
            <div className="mt-3 text-2xl font-display font-extrabold tracking-tight text-white font-mono">
              {totalProposals}
            </div>
            <div className="mt-1 text-[11px] font-mono text-[#A7ADB8]">
              All propositions
            </div>
          </div>

          {/* 5. Sent / In Review */}
          <div className="p-5 rounded-2xl border border-[#CDD3DC]/15 bg-[#16191E] shadow-xl relative overflow-hidden group hover:border-white/20 transition-all">
            <div className="flex items-center justify-between text-amber-400">
              <span className="text-[11px] font-mono uppercase tracking-wider">Sent / Review</span>
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
            <div className="mt-3 text-2xl font-display font-extrabold tracking-tight text-white font-mono">
              {sentProposals + inReviewProposals}
            </div>
            <div className="mt-1 text-[11px] font-mono text-[#A7ADB8]">
              Awaiting client sign
            </div>
          </div>

          {/* 6. Draft Proposals */}
          <div className="p-5 rounded-2xl border border-[#CDD3DC]/15 bg-[#16191E] shadow-xl relative overflow-hidden group hover:border-white/20 transition-all">
            <div className="flex items-center justify-between text-[#CDD3DC]/80">
              <span className="text-[11px] font-mono uppercase tracking-wider">Drafts</span>
              <Sparkles className="w-4 h-4 text-[#FF5A00]" />
            </div>
            <div className="mt-3 text-2xl font-display font-extrabold tracking-tight text-white font-mono">
              {draftProposals}
            </div>
            <div className="mt-1 text-[11px] font-mono text-[#A7ADB8]">
              In composition
            </div>
          </div>
        </div>

        {/* Analytics & Quick Launchpad Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Revenue & Pipeline Chart (8 cols) */}
          <div className="lg:col-span-8 p-6 sm:p-8 rounded-3xl border border-[#CDD3DC]/15 bg-[#16191E] shadow-xl flex flex-col justify-between">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
              <div>
                <h3 className="font-display text-lg font-bold uppercase text-white tracking-tight">
                  Revenue & Conversion Velocity
                </h3>
                <p className="text-xs font-mono text-[#A7ADB8] mt-1">
                  Monthly quoted pipeline vs. closed signed contracts
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs font-mono">
                <span className="flex items-center gap-1.5 text-white/50">
                  <span className="w-2.5 h-2.5 rounded-sm bg-[#3D444E]" /> Quoted
                </span>
                <span className="flex items-center gap-1.5 text-[#FF5A00]">
                  <span className="w-2.5 h-2.5 rounded-sm bg-[#FF5A00]" /> Closed Won
                </span>
              </div>
            </div>

            <RevenueChart proposals={proposals} currencySymbol={currencySymbol()} />
          </div>

          {/* Quick Studio Tools (4 cols) */}
          <div className="lg:col-span-4 p-6 sm:p-8 rounded-3xl border border-[#CDD3DC]/15 bg-[#16191E] shadow-xl flex flex-col justify-between space-y-6">
            <div>
              <h3 className="font-display text-lg font-bold uppercase text-white tracking-tight">
                Freelance Launchpad
              </h3>
              <p className="text-xs font-mono text-[#A7ADB8] mt-1">
                Direct access to specialized modules
              </p>

              <div className="mt-6 space-y-3">
                <Link
                  to="/generator"
                  className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.03] border border-white/5 hover:border-[#FF5A00]/50 hover:bg-white/[0.06] transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[#FF5A00] group-hover:scale-105 transition-transform">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-display text-xs font-semibold text-white tracking-tight">AI Proposal Generator</div>
                      <div className="text-[11px] font-mono text-[#A7ADB8]">Draft from client brief</div>
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-white/40 group-hover:text-white transition-colors" />
                </Link>

                <Link
                  to="/calculator"
                  className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.03] border border-white/5 hover:border-[#FF5A00]/50 hover:bg-white/[0.06] transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[#FF5A00] group-hover:scale-105 transition-transform">
                      <Calculator className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-display text-xs font-semibold text-white tracking-tight">Pricing Modeler</div>
                      <div className="text-[11px] font-mono text-[#A7ADB8]">Estimate hours, buffer, margin</div>
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-white/40 group-hover:text-white transition-colors" />
                </Link>

                <Link
                  to="/crm"
                  className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.03] border border-white/5 hover:border-[#FF5A00]/50 hover:bg-white/[0.06] transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[#FF5A00] group-hover:scale-105 transition-transform">
                      <Users className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-display text-xs font-semibold text-white tracking-tight">Client CRM Directory</div>
                      <div className="text-[11px] font-mono text-[#A7ADB8]">Manage contact records</div>
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-white/40 group-hover:text-white transition-colors" />
                </Link>

                <Link
                  to="/tools"
                  className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.03] border border-white/5 hover:border-[#FF5A00]/50 hover:bg-white/[0.06] transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[#FF5A00] group-hover:scale-105 transition-transform">
                      <Wand2 className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-display text-xs font-semibold text-white tracking-tight">AI Tools Suite</div>
                      <div className="text-[11px] font-mono text-[#A7ADB8]">Cover letter & discovery tools</div>
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-white/40 group-hover:text-white transition-colors" />
                </Link>
              </div>
            </div>

            {/* Recent Clients Snapshot */}
            <div className="pt-4 border-t border-white/10">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono uppercase tracking-wider text-[#A7ADB8]">Recent Clients</span>
                <Link to="/crm" className="text-[11px] font-mono text-[#FF5A00] hover:underline flex items-center gap-1">
                  <span>View All</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
              {recentClients.length === 0 ? (
                <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02] text-center space-y-2">
                  <p className="text-[11px] font-mono text-[#A7ADB8]">No clients added to your account yet.</p>
                  <Link
                    to="/crm"
                    className="inline-flex items-center gap-1.5 text-xs font-mono text-[#FF5A00] hover:text-white font-semibold"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add First Client</span>
                  </Link>
                </div>
              ) : (
                <div className="space-y-2">
                  {recentClients.map((c) => (
                    <div key={c.id} className="flex items-center justify-between text-xs font-mono py-1">
                      <div className="flex items-center gap-2 truncate">
                        <Building className="w-3.5 h-3.5 text-[#CDD3DC]/60 shrink-0" />
                        <span className="text-white truncate">{c.company || c.name}</span>
                      </div>
                      <span className="text-[10px] text-emerald-400 font-semibold uppercase">{c.status}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Proposals Table */}
        <div className="p-6 sm:p-8 rounded-3xl border border-[#CDD3DC]/15 bg-[#16191E] shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-display text-lg font-bold uppercase text-white tracking-tight">
                Recent Proposal Pipeline
              </h3>
              <p className="text-xs font-mono text-[#A7ADB8] mt-0.5">
                Latest client specifications, status transitions, and quotation totals
              </p>
            </div>
            <Link
              to="/history"
              className="inline-flex items-center gap-1 text-xs font-mono uppercase text-[#FF5A00] hover:text-white transition-colors"
            >
              <span>View Full Archive</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <RecentProposalsTable proposals={proposals.slice(0, 5)} isLoading={false} />
        </div>
      </main>

      <BackendGuideModal isOpen={guideOpen} onClose={() => setGuideOpen(false)} />
    </div>
  );
};
