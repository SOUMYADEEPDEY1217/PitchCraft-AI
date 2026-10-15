import React from 'react';

export const TableRowSkeleton: React.FC<{ cols?: number }> = ({ cols = 5 }) => {
  return (
    <tr className="animate-pulse border-b border-slate-100 dark:border-slate-800">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="py-3.5 px-4">
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-full max-w-[120px]" />
        </td>
      ))}
    </tr>
  );
};

export const CardSkeleton: React.FC = () => {
  return (
    <div className="animate-pulse p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
      <div className="h-3.5 bg-slate-200 dark:bg-slate-800 rounded w-24 mb-3" />
      <div className="h-7 bg-slate-200 dark:bg-slate-800 rounded w-36 mb-2" />
      <div className="h-3 bg-slate-100 dark:bg-slate-850 rounded w-28" />
    </div>
  );
};
