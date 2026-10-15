import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Header } from '../common/Header';
import { StatusBadge } from '../common/StatusBadge';
import { ProposalStatus, ServiceCategory } from '../../types';
import { BackendGuideModal } from '../settings/BackendGuideModal';
import { useWorkspaceMenu } from '../layout/WorkspaceLayout';
import {
  Search,
  Filter,
  PlusCircle,
  Eye,
  Edit3,
  Copy,
  Trash2,
  Download,
  Calendar,
  Building,
  ArrowUpRight,
  ArrowRight,
  Sparkles,
  FileText,
} from 'lucide-react';

export const ProposalHistoryPage: React.FC<{ onOpenMobileMenu?: () => void }> = ({ onOpenMobileMenu }) => {
  const { proposals, deleteProposal, duplicateProposal, formatCurrency, showToast } = useApp();
  const navigate = useNavigate();
  const workspaceContext = useWorkspaceMenu();
  const handleOpenMobile = onOpenMobileMenu || workspaceContext?.onOpenMobileMenu;

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'value_high' | 'value_low'>('newest');
  const [guideOpen, setGuideOpen] = useState(false);

  // Filtering
  const filtered = proposals.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.clientName.toLowerCase().includes(search.toLowerCase()) ||
      (p.clientCompany && p.clientCompany.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || p.serviceCategory === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Sorting
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    if (sortBy === 'oldest') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    if (sortBy === 'value_high') return (b.totalBudget || 0) - (a.totalBudget || 0);
    if (sortBy === 'value_low') return (a.totalBudget || 0) - (b.totalBudget || 0);
    return 0;
  });

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-[#08090B] text-[#F4F5F7] min-h-screen">
      <Header
        breadcrumbs={[{ label: 'PitchCraft AI', href: '/dashboard' }, { label: 'Proposal History' }]}
        onOpenMobileMenu={handleOpenMobile}
        onOpenBackendGuide={() => setGuideOpen(true)}
        actions={
          <Link
            to="/generator"
            className="group flex items-center gap-2 px-4 py-2 text-xs font-display font-semibold text-white bg-[#FF5A00] hover:bg-white hover:text-[#08090B] rounded-full transition-all whitespace-nowrap shadow-md shadow-[#FF5A00]/25 border border-[#FF8A32]/40"
          >
            <span>New Proposal</span>
            <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:rotate-45" />
          </Link>
        }
      />

      <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto space-y-8">
        {/* Editorial Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-[#D4D8DF]/15">
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-[#FF5A00] mb-2">
              Specification Repository // Archive
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold uppercase text-white tracking-tight">
              Proposal Specifications ({proposals.length})
            </h1>
            <p className="mt-2 text-xs font-mono text-[#D4D8DF]/70">
              Search, duplicate, export, or transition client proposal lifecycles.
            </p>
          </div>
        </div>

        {/* Top Filter & Search Bar */}
        <div className="p-5 rounded-3xl border border-[#D4D8DF]/15 bg-[#15171B] shadow-xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 font-mono text-xs">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search title, client contact or company..."
              className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-white/10 bg-[#0c0d0f] text-white placeholder-white/20 focus:border-[#FF4D00] outline-hidden transition-colors"
            />
          </div>

          {/* Filters & Sorting */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl border border-white/10 bg-[#0c0d0f] text-white focus:border-[#FF4D00] outline-hidden"
            >
              <option value="all">All Statuses ({proposals.length})</option>
              <option value="draft">Draft ({proposals.filter((p) => p.status === 'draft').length})</option>
              <option value="sent">Sent ({proposals.filter((p) => p.status === 'sent').length})</option>
              <option value="in_review">In Review ({proposals.filter((p) => p.status === 'in_review').length})</option>
              <option value="accepted">Accepted ({proposals.filter((p) => p.status === 'accepted').length})</option>
              <option value="declined">Declined ({proposals.filter((p) => p.status === 'declined').length})</option>
            </select>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl border border-white/10 bg-[#0c0d0f] text-white focus:border-[#FF4D00] outline-hidden"
            >
              <option value="all">All Categories</option>
              <option value="full_stack">Full-Stack</option>
              <option value="web_development">Web Development</option>
              <option value="ui_ux_design">UI/UX Design</option>
              <option value="mobile_app">Mobile App</option>
              <option value="branding">Branding</option>
              <option value="copywriting_content">Copywriting</option>
              <option value="consulting">Consulting</option>
            </select>

            {/* Sort Filter */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 text-xs rounded-xl border border-white/10 bg-[#0c0d0f] text-white focus:border-[#FF4D00] outline-hidden"
            >
              <option value="newest">Sort: Newest First</option>
              <option value="oldest">Sort: Oldest First</option>
              <option value="value_high">Sort: Budget (High to Low)</option>
              <option value="value_low">Sort: Budget (Low to High)</option>
            </select>
          </div>
        </div>

        {/* Proposals Data Grid */}
        <div className="rounded-3xl border border-white/10 bg-[#15161A] shadow-xl overflow-hidden">
          {proposals.length === 0 ? (
            <div className="py-20 text-center text-[#A7A9AC] space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#FF4D00] mx-auto">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <p className="font-display text-base font-bold text-white uppercase">Your Proposal Archive is Empty</p>
                <p className="text-xs font-mono mt-1 text-[#A7A9AC] max-w-md mx-auto">
                  Every proposal you generate, customize, and save will be securely indexed here under your private account.
                </p>
              </div>
              <Link
                to="/generator"
                className="mt-4 px-6 py-2.5 rounded-xl bg-[#FF4D00] hover:bg-white text-[#08090B] font-display font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-[#FF4D00]/25 inline-flex items-center gap-2 cursor-pointer"
              >
                <span>Create Your First Proposal</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : sorted.length === 0 ? (
            <div className="py-20 text-center text-[#A7A9AC]">
              <p className="font-display text-sm font-semibold text-white uppercase">No proposals match your filters</p>
              <p className="text-xs font-mono mt-1 text-[#A7A9AC]">Reset filters to view all recorded specifications.</p>
              <button
                onClick={() => {
                  setSearch('');
                  setStatusFilter('all');
                  setCategoryFilter('all');
                }}
                className="mt-4 px-4 py-2 text-xs font-mono text-[#FF4D00] hover:underline"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-white/40 uppercase tracking-wider text-[11px] font-mono">
                    <th className="py-4 px-6">Specification Title</th>
                    <th className="py-4 px-6">Client / Company</th>
                    <th className="py-4 px-6">Service Category</th>
                    <th className="py-4 px-6 text-right">Quoted Budget</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-mono">
                  {sorted.map((proposal) => (
                    <tr
                      key={proposal.id}
                      className="hover:bg-white/[0.02] transition-colors group cursor-pointer"
                      onClick={() => navigate(`/editor/${proposal.id}`)}
                    >
                      <td className="py-4 px-6">
                        <span className="font-display font-semibold text-white group-hover:text-[#FF4D00] block truncate max-w-sm transition-colors">
                          {proposal.title}
                        </span>
                        <span className="text-[10px] text-white/40 block mt-0.5">
                          ID: {proposal.id} · {new Date(proposal.createdAt).toLocaleDateString()}
                        </span>
                      </td>

                      <td className="py-4 px-6">
                        <span className="font-medium text-white block">{proposal.clientCompany || proposal.clientName}</span>
                        <span className="text-[11px] text-white/40">{proposal.clientName}</span>
                      </td>

                      <td className="py-4 px-6 text-[#A7A9AC] uppercase text-[11px]">
                        <span>{proposal.serviceCategory.replace('_', ' ')}</span>
                        <span className="text-[10px] text-white/40 block">{proposal.industry}</span>
                      </td>

                      <td className="py-4 px-6 text-right font-bold text-white tracking-tight">
                        {formatCurrency(proposal.totalBudget, proposal.currency)}
                      </td>

                      <td className="py-4 px-6">
                        <StatusBadge status={proposal.status} />
                      </td>

                      <td className="py-4 px-6 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5 text-white/50">
                          <Link
                            to={`/editor/${proposal.id}`}
                            className="p-1.5 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                            title="Edit Proposal"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => duplicateProposal(proposal.id)}
                            className="p-1.5 hover:text-[#FF4D00] hover:bg-white/10 rounded-lg transition-colors"
                            title="Duplicate Proposal"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm('Delete this proposal specification?')) {
                                deleteProposal(proposal.id);
                              }
                            }}
                            className="p-1.5 hover:text-rose-400 hover:bg-white/10 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      <BackendGuideModal isOpen={guideOpen} onClose={() => setGuideOpen(false)} />
    </div>
  );
};
