import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Header } from '../common/Header';
import { BackendGuideModal } from '../settings/BackendGuideModal';
import { useWorkspaceMenu } from '../layout/WorkspaceLayout';
import {
  Calculator,
  ArrowRight,
  Plus,
  Trash2,
  DollarSign,
  Percent,
  Clock,
  Sparkles,
  ArrowUpRight,
  Shield,
  Layers,
  Zap,
} from 'lucide-react';

export const PricingCalculatorPage: React.FC<{ onOpenMobileMenu?: () => void }> = ({ onOpenMobileMenu }) => {
  const { settings, formatCurrency, currencySymbol } = useApp();
  const navigate = useNavigate();
  const [guideOpen, setGuideOpen] = useState(false);
  const workspaceContext = useWorkspaceMenu();
  const handleOpenMobile = onOpenMobileMenu || workspaceContext?.onOpenMobileMenu;

  // Calculator inputs
  const [hourlyRate, setHourlyRate] = useState<number>(settings.defaultHourlyRate || 120);
  const [hours, setHours] = useState({
    discovery: 20,
    design: 35,
    development: 65,
    qa: 20,
    deployment: 10,
  });

  const [expenses, setExpenses] = useState<Array<{ id: string; name: string; amount: number }>>([]);

  const [contingencyPercent, setContingencyPercent] = useState<number>(15);
  const [marginPercent, setMarginPercent] = useState<number>(20);

  // Computations
  const totalHours =
    hours.discovery + hours.design + hours.development + hours.qa + hours.deployment;
  const baseLaborCost = totalHours * hourlyRate;
  const totalExpenses = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
  const subtotal = baseLaborCost + totalExpenses;
  const contingencyAmount = Math.round(subtotal * (contingencyPercent / 100));
  const subtotalWithContingency = subtotal + contingencyAmount;
  const marginAmount = Math.round(subtotalWithContingency * (marginPercent / 100));
  const grandTotal = subtotalWithContingency + marginAmount;

  // Recommended milestone distribution
  const deposit = Math.round(grandTotal * 0.4);
  const midway = Math.round(grandTotal * 0.35);
  const finalCut = grandTotal - deposit - midway;

  const addExpense = () => {
    setExpenses([
      ...expenses,
      { id: Date.now().toString(), name: 'Third-party API / asset license', amount: 100 },
    ]);
  };

  const removeExpense = (id: string) => {
    setExpenses(expenses.filter((e) => e.id !== id));
  };

  const handleApplyToGenerator = () => {
    navigate(`/generator?budget=${grandTotal}`);
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-[#08090B] text-[#F4F5F7] min-h-screen">
      <Header
        breadcrumbs={[{ label: 'PitchCraft AI', href: '/dashboard' }, { label: 'Pricing Engine' }]}
        onOpenMobileMenu={handleOpenMobile}
        onOpenBackendGuide={() => setGuideOpen(true)}
      />

      <main className="flex-1 p-6 md:p-8 max-w-6xl w-full mx-auto space-y-8">
        {/* Intro Banner */}
        <div className="p-8 rounded-3xl border border-[#D4D8DF]/15 bg-[#15171B] shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#FF5A00]/10 rounded-full blur-3xl pointer-events-none" />

          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-[#FF5A00] mb-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF5A00]" />
              <span>Financial Engineering Module</span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold uppercase text-white tracking-tight">
              Precision Rate & Quotation Engine
            </h1>
            <p className="text-xs sm:text-sm text-[#A7A9AC] mt-2 max-w-xl font-mono leading-relaxed">
              Model phase-by-phase sprint hours, direct tooling expenses, risk contingency reserves, and commercial profit margins with mathematical rigor.
            </p>
          </div>

          <button
            onClick={handleApplyToGenerator}
            className="group inline-flex items-center gap-3 px-6 py-3.5 rounded-full bg-[#FF4D00] text-white hover:bg-white hover:text-[#111111] font-display text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-xl shadow-[#FF4D00]/25 shrink-0"
          >
            <span>Quote Proposal ({formatCurrency(grandTotal)})</span>
            <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:rotate-45" />
          </button>
        </div>

        {/* 2-Column Split: Inputs & Financial Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left 7 Cols: Form Modeler Controls */}
          <div className="lg:col-span-7 space-y-6">
            {/* Section 1: Base Hourly Rate */}
            <div className="p-6 sm:p-7 rounded-3xl border border-white/10 bg-[#15161A] shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-display text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <span className="w-2 h-2 rounded-sm bg-[#FF4D00]" />
                    <span>01. Base Hourly Engineering Rate</span>
                  </h2>
                  <p className="text-[11px] font-mono text-[#A7A9AC] mt-1">Core professional billing baseline</p>
                </div>
                <div className="flex items-center gap-1.5 font-mono">
                  <span className="text-xs font-bold text-[#A7A9AC]">{currencySymbol()}</span>
                  <input
                    type="number"
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(Number(e.target.value))}
                    className="w-28 px-3 py-2 text-sm font-bold font-mono rounded-xl border border-white/10 bg-[#0c0d0f] text-white focus:border-[#FF4D00] outline-hidden text-right"
                  />
                  <span className="text-xs text-[#A7A9AC]">/hr</span>
                </div>
              </div>
            </div>

            {/* Section 2: Sprint Hours By Phase */}
            <div className="p-6 sm:p-7 rounded-3xl border border-white/10 bg-[#15161A] shadow-xl space-y-5">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <h2 className="font-display text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <span className="w-2 h-2 rounded-sm bg-[#FF4D00]" />
                  <span>02. Estimated Sprint Hours By Phase</span>
                </h2>
                <span className="font-mono text-xs font-bold text-[#FF4D00]">
                  Total: {totalHours} Hours
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                <div>
                  <label className="block text-[#A7A9AC] mb-1.5 uppercase text-[11px]">
                    Discovery & Specs
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={hours.discovery}
                      onChange={(e) => setHours({ ...hours, discovery: Number(e.target.value) })}
                      className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-white/10 bg-[#0c0d0f] text-white focus:border-[#FF4D00] outline-hidden"
                    />
                    <span className="text-[#A7A9AC] text-[11px] w-10">hrs</span>
                  </div>
                </div>

                <div>
                  <label className="block text-[#A7A9AC] mb-1.5 uppercase text-[11px]">
                    UI/UX Design
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={hours.design}
                      onChange={(e) => setHours({ ...hours, design: Number(e.target.value) })}
                      className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-white/10 bg-[#0c0d0f] text-white focus:border-[#FF4D00] outline-hidden"
                    />
                    <span className="text-[#A7A9AC] text-[11px] w-10">hrs</span>
                  </div>
                </div>

                <div>
                  <label className="block text-[#A7A9AC] mb-1.5 uppercase text-[11px]">
                    Core Engineering & API
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={hours.development}
                      onChange={(e) => setHours({ ...hours, development: Number(e.target.value) })}
                      className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-white/10 bg-[#0c0d0f] text-white focus:border-[#FF4D00] outline-hidden"
                    />
                    <span className="text-[#A7A9AC] text-[11px] w-10">hrs</span>
                  </div>
                </div>

                <div>
                  <label className="block text-[#A7A9AC] mb-1.5 uppercase text-[11px]">
                    QA & Security Audit
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={hours.qa}
                      onChange={(e) => setHours({ ...hours, qa: Number(e.target.value) })}
                      className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-white/10 bg-[#0c0d0f] text-white focus:border-[#FF4D00] outline-hidden"
                    />
                    <span className="text-[#A7A9AC] text-[11px] w-10">hrs</span>
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[#A7A9AC] mb-1.5 uppercase text-[11px]">
                    Cutover & Telemetry Verification
                  </label>
                  <div className="flex items-center gap-2 max-w-xs">
                    <input
                      type="number"
                      value={hours.deployment}
                      onChange={(e) => setHours({ ...hours, deployment: Number(e.target.value) })}
                      className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-white/10 bg-[#0c0d0f] text-white focus:border-[#FF4D00] outline-hidden"
                    />
                    <span className="text-[#A7A9AC] text-[11px] w-10">hrs</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Direct Project Expenses */}
            <div className="p-6 sm:p-7 rounded-3xl border border-white/10 bg-[#15161A] shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <h2 className="font-display text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <span className="w-2 h-2 rounded-sm bg-[#FF4D00]" />
                    <span>03. Direct Project Software & Asset Costs</span>
                  </h2>
                  <p className="text-[11px] font-mono text-[#A7A9AC] mt-1">Hosting, domain SSL, licensed fonts, third-party APIs</p>
                </div>
                <button
                  onClick={addExpense}
                  className="flex items-center gap-1.5 text-xs font-mono font-semibold text-[#FF4D00] hover:text-white transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Expense</span>
                </button>
              </div>

              <div className="space-y-3 font-mono text-xs">
                {expenses.map((exp, idx) => (
                  <div key={exp.id} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={exp.name}
                      onChange={(e) => {
                        const copy = [...expenses];
                        copy[idx].name = e.target.value;
                        setExpenses(copy);
                      }}
                      className="flex-1 px-3 py-2 rounded-xl border border-white/10 bg-[#0c0d0f] text-white focus:border-[#FF4D00] outline-hidden"
                      placeholder="Expense item description"
                    />
                    <div className="flex items-center gap-1 font-mono">
                      <span className="text-xs text-[#A7A9AC]">{currencySymbol()}</span>
                      <input
                        type="number"
                        value={exp.amount}
                        onChange={(e) => {
                          const copy = [...expenses];
                          copy[idx].amount = Number(e.target.value);
                          setExpenses(copy);
                        }}
                        className="w-24 px-3 py-2 rounded-xl border border-white/10 bg-[#0c0d0f] text-white focus:border-[#FF4D00] outline-hidden text-right"
                      />
                    </div>
                    <button
                      onClick={() => removeExpense(exp.id)}
                      className="p-2 text-white/40 hover:text-rose-400 transition-colors"
                      title="Remove expense"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 4: Risk Contingency & Margin Sliders */}
            <div className="p-6 sm:p-7 rounded-3xl border border-white/10 bg-[#15161A] shadow-xl space-y-6">
              <h2 className="font-display text-xs font-bold text-white uppercase tracking-wider border-b border-white/10 pb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-sm bg-[#FF4D00]" />
                <span>04. Risk Protection & Strategic Margin</span>
              </h2>

              <div>
                <div className="flex justify-between items-center text-xs font-mono mb-2">
                  <span className="text-white font-semibold">
                    Contingency Buffer ({contingencyPercent}%)
                  </span>
                  <span className="text-[#FF4D00] font-bold">
                    +{formatCurrency(contingencyAmount)}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="30"
                  step="5"
                  value={contingencyPercent}
                  onChange={(e) => setContingencyPercent(Number(e.target.value))}
                  className="w-full accent-[#FF4D00]"
                />
                <p className="text-[11px] font-mono text-[#A7A9AC] mt-1.5">
                  Protects against unforeseen review cycles or third-party API dependencies.
                </p>
              </div>

              <div>
                <div className="flex justify-between items-center text-xs font-mono mb-2">
                  <span className="text-white font-semibold">
                    Value Profit Margin ({marginPercent}%)
                  </span>
                  <span className="text-emerald-400 font-bold">
                    +{formatCurrency(marginAmount)}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="50"
                  step="5"
                  value={marginPercent}
                  onChange={(e) => setMarginPercent(Number(e.target.value))}
                  className="w-full accent-emerald-500"
                />
                <p className="text-[11px] font-mono text-[#A7A9AC] mt-1.5">
                  Value-based premium capturing commercial client upside beyond raw hourly labor.
                </p>
              </div>
            </div>
          </div>

          {/* Right 5 Cols: Sticky Quotation Summary & Milestone Schedule */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
            <div className="p-7 rounded-3xl border-2 border-[#FF4D00] bg-[#15161A] shadow-2xl space-y-6 relative overflow-hidden">
              <div className="border-b border-white/10 pb-5">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#FF4D00] font-bold">
                  Recommended Quotation
                </span>
                <div className="text-4xl font-display font-extrabold tracking-tight text-white mt-1 font-mono">
                  {formatCurrency(grandTotal)}
                </div>
                <p className="text-xs font-mono text-[#A7A9AC] mt-1">
                  Effective Hourly Realization: {currencySymbol()}{Math.round(grandTotal / totalHours)}/hr ({totalHours} hrs)
                </p>
              </div>

              {/* Financial Breakdown Table */}
              <div className="space-y-2.5 font-mono text-xs">
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-[#A7A9AC]">Base Labor ({totalHours} hrs @ {currencySymbol()}{hourlyRate}):</span>
                  <span className="text-white font-medium">{formatCurrency(baseLaborCost)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-[#A7A9AC]">Tooling & Direct Software:</span>
                  <span className="text-white font-medium">{formatCurrency(totalExpenses)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5 text-[#FF4D00]">
                  <span>Risk Contingency ({contingencyPercent}%):</span>
                  <span className="font-bold">+{formatCurrency(contingencyAmount)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5 text-emerald-400">
                  <span>Strategic Margin ({marginPercent}%):</span>
                  <span className="font-bold">+{formatCurrency(marginAmount)}</span>
                </div>
              </div>

              {/* Recommended Milestone Escrow Distribution */}
              <div className="pt-2 space-y-3">
                <div className="text-[11px] font-mono uppercase tracking-wider text-white font-bold">
                  Deposit & Milestone Structure
                </div>
                <div className="space-y-2 font-mono text-xs">
                  <div className="flex justify-between p-3 rounded-2xl bg-white/5 border border-white/5">
                    <span className="text-white">Phase 1 Deposit (40%):</span>
                    <span className="text-white font-bold">{formatCurrency(deposit)}</span>
                  </div>
                  <div className="flex justify-between p-3 rounded-2xl bg-white/5 border border-white/5">
                    <span className="text-white">Phase 2 Midway (35%):</span>
                    <span className="text-white font-bold">{formatCurrency(midway)}</span>
                  </div>
                  <div className="flex justify-between p-3 rounded-2xl bg-white/5 border border-white/5">
                    <span className="text-white">Phase 3 Final Cut (25%):</span>
                    <span className="text-white font-bold">{formatCurrency(finalCut)}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={handleApplyToGenerator}
                  className="w-full group inline-flex items-center justify-center gap-3 py-4 rounded-full bg-[#FF4D00] text-white hover:bg-white hover:text-[#111111] font-display text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-xl shadow-[#FF4D00]/30 cursor-pointer"
                >
                  <span>Use This Calculation In Proposal</span>
                  <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:rotate-45" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <BackendGuideModal isOpen={guideOpen} onClose={() => setGuideOpen(false)} />
    </div>
  );
};
