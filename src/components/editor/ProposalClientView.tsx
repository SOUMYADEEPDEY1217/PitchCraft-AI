import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Proposal, AppSettings } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { CheckCircle2, Download, Printer, Shield, Check, Calendar, ArrowRight, X } from 'lucide-react';
import { api } from '../../services/api';

interface ProposalClientViewProps {
  proposal: Proposal;
  settings: AppSettings;
  currencySymbol: string;
  onAcceptProposal?: () => void;
  onClosePreview?: () => void;
  isStandalone?: boolean;
}

export const ProposalClientView: React.FC<ProposalClientViewProps> = ({
  proposal,
  settings,
  currencySymbol,
  onAcceptProposal,
  onClosePreview,
  isStandalone = false,
}) => {
  const [accepted, setAccepted] = useState(proposal.status === 'accepted');
  const [signeeName, setSigneeName] = useState(proposal.clientName || '');
  const [signeeTitle, setSigneeTitle] = useState('Director / Authorized Signatory');
  const [showSignDialog, setShowSignDialog] = useState(false);

  const handleSignConfirm = () => {
    setAccepted(true);
    setShowSignDialog(false);
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 },
    });
    if (onAcceptProposal) {
      onAcceptProposal();
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = async () => {
    await api.downloadProposalPdf(proposal.id);
  };

  return (
    <div className="bg-slate-100 dark:bg-slate-950 min-h-screen py-8 px-4 sm:px-6">
      {/* Top Banner Toolbar (hidden in print) */}
      <div className="max-w-4xl mx-auto mb-6 flex items-center justify-between no-print bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-xl shadow-xs">
        <div className="flex items-center gap-3">
          {onClosePreview && (
            <button
              onClick={onClosePreview}
              className="px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
            >
              ← Back to Editor
            </button>
          )}
          <span className="text-xs text-slate-500 hidden sm:inline">
            Client Presentation View
          </span>
          <StatusBadge status={accepted ? 'accepted' : proposal.status} />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadPdf}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 border border-slate-250 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-md transition-colors"
            title="Download ReportLab generated PDF"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download PDF</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 border border-slate-250 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-md transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print</span>
          </button>

          {!accepted ? (
            <button
              onClick={() => setShowSignDialog(true)}
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-md shadow-xs transition-colors"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Accept Proposal</span>
            </button>
          ) : (
            <span className="px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 rounded-md border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
              <Check className="w-3 h-3" />
              <span>Accepted & Countersigned</span>
            </span>
          )}
        </div>
      </div>

      {/* Main Document Paper Container */}
      <article className="max-w-4xl mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm print-container p-8 sm:p-12 text-slate-900 dark:text-slate-100 space-y-10">
        {/* Header Block */}
        <header className="border-b border-slate-200 dark:border-slate-800 pb-8 flex flex-col sm:flex-row sm:items-start justify-between gap-6">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-widest text-indigo-600 dark:text-indigo-400 font-semibold">
              BUSINESS PROPOSAL & SPECIFICATION
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1 text-slate-950 dark:text-white">
              {proposal.title}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
              Prepared for: <strong>{proposal.clientCompany || proposal.clientName}</strong> · Attention: {proposal.clientName}
            </p>
          </div>

          <div className="sm:text-right shrink-0">
            <p className="text-sm font-bold text-slate-900 dark:text-white">
              {settings.agencyName || settings.freelancerName}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {settings.freelancerTitle}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {settings.freelancerEmail}
            </p>
            <div className="mt-2 text-xs font-mono text-slate-400">
              Date: {new Date(proposal.createdAt).toLocaleDateString()}
            </div>
          </div>
        </header>

        {/* Executive Summary */}
        <section className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
            01. Executive Summary
          </h2>
          <div className="text-sm leading-relaxed text-slate-700 dark:text-slate-300 space-y-3 whitespace-pre-line">
            {proposal.executiveSummary}
          </div>
        </section>

        {/* Problem Understanding */}
        {proposal.problemUnderstanding && (
          <section className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
              02. Problem Understanding & Analysis
            </h2>
            <div className="text-sm leading-relaxed text-slate-700 dark:text-slate-300 space-y-3 whitespace-pre-line p-4 rounded-lg border border-slate-150 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/40">
              {proposal.problemUnderstanding}
            </div>
          </section>
        )}

        {/* Strategic Objectives */}
        {proposal.objectives && proposal.objectives.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
              02. Strategic Objectives & Measurable Impact
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {proposal.objectives.map((obj, i) => (
                <div
                  key={i}
                  className="p-3.5 rounded-lg border border-slate-150 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/40 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2.5"
                >
                  <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold shrink-0">
                    0{i + 1}.
                  </span>
                  <span>{obj}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Proposed Solution */}
        <section className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
            03. Proposed Solution & Execution Methodology
          </h2>
          <div className="text-sm leading-relaxed text-slate-700 dark:text-slate-300 whitespace-pre-line">
            {proposal.proposedSolution}
          </div>
        </section>

        {/* Deliverables Checklist */}
        {proposal.deliverables && proposal.deliverables.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
              04. Key Deliverables Specification
            </h2>
            <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
              {proposal.deliverables.map((deliv, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{deliv}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Scope Boundaries */}
        <section className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
            05. Scope Boundaries (Protection of Timeline)
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-lg border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/40 dark:bg-emerald-950/20">
              <h3 className="font-bold text-emerald-800 dark:text-emerald-300 mb-2">
                Included in This Engagement
              </h3>
              <ul className="space-y-1.5 text-slate-700 dark:text-slate-300">
                {proposal.scopeIncluded?.map((item, idx) => (
                  <li key={idx}>• {item}</li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-850/40">
              <h3 className="font-bold text-slate-700 dark:text-slate-300 mb-2">
                Explicitly Excluded (Out of Scope)
              </h3>
              <ul className="space-y-1.5 text-slate-600 dark:text-slate-400">
                {proposal.scopeExcluded?.map((item, idx) => (
                  <li key={idx}>• {item}</li>
                ))}
              </ul>
            </div>
          </div>

          {proposal.assumptionsAndExclusions && proposal.assumptionsAndExclusions.length > 0 && (
            <div className="mt-4 p-4 rounded-lg border border-amber-200 dark:border-amber-900/50 bg-amber-50/40 dark:bg-amber-950/20 text-xs">
              <h3 className="font-bold text-amber-800 dark:text-amber-300 mb-2">
                Assumptions & Exclusions
              </h3>
              <ul className="space-y-1.5 text-slate-700 dark:text-slate-300">
                {proposal.assumptionsAndExclusions.map((item, idx) => (
                  <li key={idx}>• {item}</li>
                ))}
              </ul>
            </div>
          )}
        </section>

        {/* Timeline & Phased Milestones */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
              06. Delivery Timeline & Phased Milestones
            </h2>
            <span className="text-xs font-mono text-slate-500">
              Target Deadline: {proposal.deadline}
            </span>
          </div>

          <div className="space-y-3">
            {proposal.milestones?.map((milestone, idx) => (
              <div
                key={milestone.id || idx}
                className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {milestone.title}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      ({milestone.duration})
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                    {milestone.description}
                  </p>
                  {milestone.deliverables && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {milestone.deliverables.map((d, dIdx) => (
                        <span
                          key={dIdx}
                          className="text-[10px] text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded"
                        >
                          {d}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="text-right shrink-0">
                  <span className="text-sm font-bold font-mono tabular-nums text-slate-900 dark:text-white">
                    {currencySymbol}{milestone.amount?.toLocaleString()}
                  </span>
                  <span className="block text-[10px] text-slate-400">Milestone Settlement</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Pricing Table */}
        <section className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
            07. Quotation Breakdown & Investment Schedule
          </h2>
          {proposal.pricingExplanation && (
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed italic">
              {proposal.pricingExplanation}
            </p>
          )}
          <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-850 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-medium">
                <tr>
                  <th className="py-2.5 px-4">Component / Deliverable</th>
                  <th className="py-2.5 px-4 text-right">Units / Est. Hrs</th>
                  <th className="py-2.5 px-4 text-right">Rate</th>
                  <th className="py-2.5 px-4 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {proposal.pricingItems?.map((item) => (
                  <tr key={item.id}>
                    <td className="py-2.5 px-4 text-slate-800 dark:text-slate-200">{item.description}</td>
                    <td className="py-2.5 px-4 text-right font-mono tabular-nums">{item.hoursOrUnits}</td>
                    <td className="py-2.5 px-4 text-right font-mono tabular-nums">{currencySymbol}{item.rate}</td>
                    <td className="py-2.5 px-4 text-right font-mono tabular-nums font-semibold">
                      {currencySymbol}{item.total?.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-slate-50/80 dark:bg-slate-850/80 border-t border-slate-200 dark:border-slate-800 font-bold">
                <tr>
                  <td colSpan={3} className="py-3 px-4 text-right text-xs">
                    Total Fixed Engagement Value:
                  </td>
                  <td className="py-3 px-4 text-right text-sm font-mono tabular-nums text-emerald-600 dark:text-emerald-400">
                    {currencySymbol}{proposal.totalBudget?.toLocaleString()} {proposal.currency}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </section>

        {/* Payment Terms & Client Responsibilities */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
          <div className="space-y-2">
            <h2 className="font-bold uppercase tracking-wider text-slate-400 font-mono">
              08. Payment Terms & Schedule
            </h2>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              {proposal.paymentTerms}
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="font-bold uppercase tracking-wider text-slate-400 font-mono">
              09. Client Responsibilities
            </h2>
            <ul className="space-y-1.5 text-slate-700 dark:text-slate-300">
              {proposal.clientResponsibilities?.map((resp, idx) => (
                <li key={idx}>• {resp}</li>
              ))}
            </ul>
          </div>
        </section>

        {/* Terms & Conditions */}
        <section className="space-y-2 text-xs border-t border-slate-200 dark:border-slate-800 pt-6">
          <h2 className="font-bold uppercase tracking-wider text-slate-400 font-mono">
            10. Intellectual Property & Terms
          </h2>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-line text-[11px]">
            {proposal.termsAndConditions}
          </p>
        </section>

        {/* Sign-off & Acceptance Section */}
        <footer className="border-t-2 border-slate-900 dark:border-slate-100 pt-8 mt-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Authorization & Project Sign-Off
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-md">
                {proposal.callToAction || 'Countersign this document to lock in sprint availability and commence Phase 1 discovery.'}
              </p>
            </div>

            <div className="text-right shrink-0">
              {accepted ? (
                <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 rounded-lg text-left">
                  <p className="text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Digitally Authorized
                  </p>
                  <p className="text-[11px] text-slate-700 dark:text-slate-300 mt-1 font-mono">
                    Signed by: {signeeName} ({signeeTitle})
                  </p>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    Timestamp: {new Date().toLocaleDateString()}
                  </p>
                </div>
              ) : (
                <button
                  onClick={() => setShowSignDialog(true)}
                  className="px-6 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors no-print"
                >
                  Accept & Sign Proposal
                </button>
              )}
            </div>
          </div>
        </footer>
      </article>

      {/* Signature Confirmation Dialog */}
      {showSignDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Authorize & Accept Proposal
              </h3>
              <button
                onClick={() => setShowSignDialog(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              By confirming, you approve the deliverables, timeline, and milestone terms for <strong>{proposal.title}</strong> at a total fixed value of <strong>{currencySymbol}{proposal.totalBudget?.toLocaleString()}</strong>.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                  Full Authorized Name
                </label>
                <input
                  type="text"
                  value={signeeName}
                  onChange={(e) => setSigneeName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-850"
                  placeholder="e.g. Marcus Vance"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                  Title / Role
                </label>
                <input
                  type="text"
                  value={signeeTitle}
                  onChange={(e) => setSigneeTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-850"
                  placeholder="e.g. Managing Director"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setShowSignDialog(false)}
                className="px-3 py-1.5 text-xs rounded border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleSignConfirm}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded shadow-xs"
              >
                Confirm & Accept
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
