import React from 'react';
import { ProposalStatus } from '../../types';

interface StatusBadgeProps {
  status: ProposalStatus;
  showIcon?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  switch (status) {
    case 'accepted':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400" aria-hidden="true" />
          Accepted
        </span>
      );
    case 'in_review':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 dark:text-amber-400">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-600 dark:bg-amber-400" aria-hidden="true" />
          In Review
        </span>
      );
    case 'sent':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 dark:text-blue-400">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400" aria-hidden="true" />
          Sent
        </span>
      );
    case 'declined':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-700 dark:text-rose-400">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-600 dark:bg-rose-400" aria-hidden="true" />
          Declined
        </span>
      );
    case 'draft':
    default:
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500" aria-hidden="true" />
          Draft
        </span>
      );
  }
};
