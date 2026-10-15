import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Proposal } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { TableRowSkeleton } from '../common/Skeleton';
import { ExternalLink, Copy, Trash2, Eye, Plus, ArrowUpRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface RecentProposalsTableProps {
  proposals: Proposal[];
  isLoading?: boolean;
}

export const RecentProposalsTable: React.FC<RecentProposalsTableProps> = ({ proposals, isLoading = false }) => {
  const { formatCurrency, duplicateProposal, deleteProposal } = useApp();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
          <thead>
            <tr className="border-b border-white/10 text-white/40 font-semibold uppercase tracking-wider">
              <th className="py-3.5 px-4">Proposal / Client</th>
              <th className="py-3.5 px-4">Category</th>
              <th className="py-3.5 px-4 text-right">Budget</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <TableRowSkeleton cols={5} />
            <TableRowSkeleton cols={5} />
            <TableRowSkeleton cols={5} />
          </tbody>
        </table>
      </div>
    );
  }

  if (proposals.length === 0) {
    return (
      <div className="py-12 text-center text-[#D4D8DF]/60">
        <p className="font-display text-sm font-semibold text-white uppercase">No proposals generated yet</p>
        <p className="text-xs mt-1 font-mono text-[#D4D8DF]/60">Start by converting your first client brief into a winning contract.</p>
        <Link
          to="/generator"
          className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 text-xs font-display font-semibold text-white bg-[#FF5A00] rounded-full hover:bg-white hover:text-[#08090B] transition-all shadow-lg shadow-[#FF5A00]/25 border border-[#FF8A32]/40"
        >
          <span>Create Proposal</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs">
        <thead>
          <tr className="border-b border-white/10 text-white/40 font-mono font-medium uppercase tracking-wider">
            <th className="py-3.5 px-4">Proposal Specification</th>
            <th className="py-3.5 px-4">Category</th>
            <th className="py-3.5 px-4 text-right">Target Budget</th>
            <th className="py-3.5 px-4">Status</th>
            <th className="py-3.5 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5 font-mono">
          {proposals.slice(0, 6).map((proposal) => (
            <tr
              key={proposal.id}
              className="hover:bg-white/[0.02] transition-colors group cursor-pointer"
              onClick={() => navigate(`/editor/${proposal.id}`)}
            >
              {/* Title & Client */}
              <td className="py-3.5 px-4">
                <div className="font-display font-semibold text-white text-xs tracking-tight group-hover:text-[#FF4D00] transition-colors">
                  {proposal.title}
                </div>
                <div className="text-[11px] text-[#A7A9AC] flex items-center gap-1.5 mt-0.5">
                  <span>{proposal.clientName}</span>
                  {proposal.clientCompany && (
                    <>
                      <span className="text-white/20">·</span>
                      <span className="text-white/60">{proposal.clientCompany}</span>
                    </>
                  )}
                </div>
              </td>

              {/* Category */}
              <td className="py-3.5 px-4 text-[#A7A9AC] text-[11px] uppercase tracking-wider">
                {proposal.serviceCategory.replace('_', ' ')}
              </td>

              {/* Budget */}
              <td className="py-3.5 px-4 text-right font-bold text-white tracking-tight">
                {formatCurrency(proposal.totalBudget)}
              </td>

              {/* Status */}
              <td className="py-3.5 px-4">
                <StatusBadge status={proposal.status} />
              </td>

              {/* Quick Actions */}
              <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-end gap-1 text-[#A7A9AC]">
                  <Link
                    to={`/editor/${proposal.id}`}
                    className="p-1.5 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                    title="Edit Proposal"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </Link>
                  <button
                    onClick={() => duplicateProposal(proposal.id)}
                    className="p-1.5 hover:text-[#FF4D00] hover:bg-white/10 rounded-lg transition-colors"
                    title="Duplicate"
                  >
                    <Copy className="w-3.5 h-3.5" />
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
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
