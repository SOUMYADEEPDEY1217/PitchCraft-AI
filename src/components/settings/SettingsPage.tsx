import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Header } from '../common/Header';
import { BackendGuideModal } from './BackendGuideModal';
import { storage } from '../../services/storage';
import { api } from '../../services/api';
import { Currency } from '../../types';
import { useWorkspaceMenu } from '../layout/WorkspaceLayout';
import {
  Settings,
  Server,
  User,
  DollarSign,
  Palette,
  RefreshCw,
  Download,
  Upload,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Cpu,
  ShieldCheck,
  Database,
  LogIn,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const SettingsPage: React.FC<{ onOpenMobileMenu?: () => void }> = ({ onOpenMobileMenu }) => {
  const {
    settings,
    saveSettings,
    backendStatus,
    checkBackendStatus,
    refreshData,
    showToast,
  } = useApp();

  const { user, userProfile, openAuthModal, signOut } = useAuth();

  const [form, setForm] = useState({ ...settings });
  const [guideOpen, setGuideOpen] = useState(false);
  const [isPinging, setIsPinging] = useState(false);
  const [ollamaStatus, setOllamaStatus] = useState<{ isConnected: boolean; models: string[]; latencyMs?: number; message?: string } | null>(null);
  const workspaceContext = useWorkspaceMenu();
  const handleOpenMobile = onOpenMobileMenu || workspaceContext?.onOpenMobileMenu;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveSettings(form);
    showToast('Settings saved successfully', 'success');
  };

  const handleTestConnection = async () => {
    setIsPinging(true);
    await checkBackendStatus();
    const ollamaCheck = await api.checkAiHealth();
    setOllamaStatus(ollamaCheck);
    setIsPinging(false);
    showToast('Connectivity check complete', 'info');
  };

  const handleExportBackup = () => {
    const json = storage.exportBackupJson();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pitchcraft-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Backup JSON downloaded', 'success');
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      const content = event.target?.result as string;
      const ok = storage.importBackupJson(content);
      if (ok) {
        await refreshData();
        showToast('Backup imported successfully', 'success');
      } else {
        showToast('Invalid backup file format', 'error');
      }
    };
    reader.readAsText(file);
  };

  const handleResetData = async () => {
    if (confirm('Clear local workspace storage cache? Your cloud Firestore records remain unaffected.')) {
      storage.resetAllData();
      await refreshData();
      showToast('Local workspace cache cleared', 'info');
    }
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-[#07080A] text-[#F5F6F8] min-h-screen">
      <Header
        breadcrumbs={[{ label: 'PitchCraft AI', href: '/dashboard' }, { label: 'Settings' }]}
        onOpenMobileMenu={handleOpenMobile}
        onOpenBackendGuide={() => setGuideOpen(true)}
      />

      <main className="flex-1 p-6 md:p-8 max-w-5xl w-full mx-auto space-y-6">
        <form onSubmit={handleSave} className="space-y-6">
          {/* Top Banner with Save Button */}
          <div className="p-6 sm:p-8 rounded-3xl border border-[#CDD3DC]/15 bg-[#16191E] shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold font-display uppercase text-white flex items-center gap-2">
                <Settings className="w-4 h-4 text-[#FF5A00]" />
                <span>Studio & Backend Configuration</span>
              </h2>
              <p className="text-xs font-mono text-[#A7ADB8] mt-1">
                Manage your agency details, default pricing rules, and local AI model connections.
              </p>
            </div>
            <button
              type="submit"
              className="px-6 py-3 text-xs font-display font-semibold uppercase tracking-wider text-white bg-[#FF5A00] hover:bg-white hover:text-[#07080A] rounded-full shadow-lg shadow-[#FF5A00]/25 transition-all shrink-0 border border-[#FF8C32]/40"
            >
              Save Settings
            </button>
          </div>

          {/* Section 0: Firebase Authentication & Cloud Firestore Database */}
          <div className="p-6 sm:p-8 rounded-3xl border border-[#CDD3DC]/15 bg-[#16191E] shadow-2xl space-y-4 font-mono text-xs">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center justify-between border-b border-white/10 pb-3 font-display">
              <span className="flex items-center gap-2">
                <Database className="w-3.5 h-3.5 text-[#FF5A00]" />
                <span>00. Firebase Authentication & Cloud Firestore Storage</span>
              </span>
              <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1.5 uppercase font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Firestore Live
              </span>
            </h3>

            {user ? (
              <div className="p-5 rounded-2xl bg-[#0D0F12] border border-white/10 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#252A31] border border-white/20 flex items-center justify-center text-lg font-bold text-white overflow-hidden shadow-inner shrink-0">
                      {user.photoURL ? (
                        <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <span>{(user.displayName || user.email || 'U').charAt(0).toUpperCase()}</span>
                      )}
                    </div>
                    <div>
                      <h4 className="font-display text-sm font-bold text-white flex items-center gap-2">
                        {user.displayName || 'PitchCraft Creator'}
                        <ShieldCheck className="w-4 h-4 text-[#FF5A00]" />
                      </h4>
                      <p className="text-[11px] text-[#A7ADB8]">{user.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => openAuthModal('signin')}
                      className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs transition-all"
                    >
                      Account Details
                    </button>
                    <button
                      type="button"
                      onClick={() => signOut()}
                      className="px-4 py-2 rounded-xl bg-red-950/30 hover:bg-red-950/60 border border-red-500/30 text-red-300 text-xs transition-all flex items-center gap-1.5"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Sign Out
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-[11px] text-[#A7ADB8] border-t border-white/5">
                  <div className="p-3 rounded-xl bg-[#16191E] border border-white/5 space-y-0.5">
                    <p className="text-white/60 uppercase text-[9px] tracking-widest">User Document ID</p>
                    <p className="font-mono text-white truncate" title={user.uid}>{user.uid}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-[#16191E] border border-white/5 space-y-0.5">
                    <p className="text-white/60 uppercase text-[9px] tracking-widest">Authentication Provider</p>
                    <p className="font-mono text-white capitalize">
                      {user.providerData?.[0]?.providerId === 'google.com' ? 'Google Account' : 'Email / Password'}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-[#16191E] border border-white/5 space-y-0.5">
                    <p className="text-white/60 uppercase text-[9px] tracking-widest">Cloud Database</p>
                    <p className="font-mono text-emerald-400 truncate">pitchcraft-ai-d485b</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-5 rounded-2xl bg-gradient-to-br from-[#16191E] to-[#0D0F12] border border-[#FF5A00]/30 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <p className="text-white font-display text-sm font-bold flex items-center gap-2">
                      <LogIn className="w-4 h-4 text-[#FF5A00]" />
                      Sign In to Store Data in Cloud Firestore
                    </p>
                    <p className="text-[11px] text-[#A7ADB8]">
                      Sign in with Google or Email/Password to store each user details individually in Cloud Firestore database and synchronize proposals across devices.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => openAuthModal('signin')}
                      className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#252A31] to-[#16191E] hover:from-[#3D444E] hover:to-[#252A31] border border-white/20 text-white text-xs font-semibold tracking-wide transition-all"
                    >
                      Sign In
                    </button>
                    <button
                      type="button"
                      onClick={() => openAuthModal('signup')}
                      className="px-5 py-2.5 rounded-xl bg-[#FF5A00] hover:bg-white hover:text-[#07080A] text-white text-xs font-display font-semibold transition-all shadow-lg shadow-[#FF5A00]/25"
                    >
                      Create Account
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section 1: Freelancer & Agency Profile */}
          <div className="p-6 sm:p-8 rounded-3xl border border-[#CDD3DC]/15 bg-[#16191E] shadow-2xl space-y-4 font-mono text-xs">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-white/10 pb-3 font-display">
              <User className="w-3.5 h-3.5 text-[#FF5A00]" />
              <span>01. Freelancer & Agency Profile</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[#A7ADB8] uppercase tracking-wider mb-1">
                  Your Full Name
                </label>
                <input
                  type="text"
                  value={form.freelancerName}
                  onChange={(e) => setForm({ ...form, freelancerName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-[#0D0F12] text-white focus:border-[#FF5A00] outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[#A7ADB8] uppercase tracking-wider mb-1">
                  Professional Title / Role
                </label>
                <input
                  type="text"
                  value={form.freelancerTitle}
                  onChange={(e) => setForm({ ...form, freelancerTitle: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-[#0D0F12] text-white focus:border-[#FF5A00] outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[#A7ADB8] uppercase tracking-wider mb-1">
                  Studio / Agency Brand Name
                </label>
                <input
                  type="text"
                  value={form.agencyName}
                  onChange={(e) => setForm({ ...form, agencyName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-[#0D0F12] text-white focus:border-[#FF5A00] outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[#A7ADB8] uppercase tracking-wider mb-1">
                  Business Email
                </label>
                <input
                  type="email"
                  value={form.freelancerEmail}
                  onChange={(e) => setForm({ ...form, freelancerEmail: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-[#0D0F12] text-white focus:border-[#FF5A00] outline-hidden"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[#A7ADB8] uppercase tracking-wider mb-1">
                  Portfolio / Website URL
                </label>
                <input
                  type="url"
                  value={form.freelancerWebsite}
                  onChange={(e) => setForm({ ...form, freelancerWebsite: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-[#0D0F12] text-white focus:border-[#FF5A00] outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Financial & Commercial Defaults */}
          <div className="p-6 sm:p-8 rounded-3xl border border-[#CDD3DC]/15 bg-[#16191E] shadow-2xl space-y-4 font-mono text-xs">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-white/10 pb-3 font-display">
              <DollarSign className="w-3.5 h-3.5 text-[#FF5A00]" />
              <span>02. Commercial & Billing Defaults</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[#A7ADB8] uppercase tracking-wider mb-1">
                  Default Hourly Billing Rate ($)
                </label>
                <input
                  type="number"
                  value={form.defaultHourlyRate}
                  onChange={(e) => setForm({ ...form, defaultHourlyRate: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-[#0D0F12] text-white focus:border-[#FF5A00] outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[#A7ADB8] uppercase tracking-wider mb-1">
                  Default Currency
                </label>
                <select
                  value={form.defaultCurrency}
                  onChange={(e) => setForm({ ...form, defaultCurrency: e.target.value as Currency })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-[#0D0F12] text-white focus:border-[#FF5A00] outline-hidden"
                >
                  <option value="USD">USD ($) — United States Dollar</option>
                  <option value="EUR">EUR (€) — Euro</option>
                  <option value="GBP">GBP (£) — British Pound</option>
                  <option value="CAD">CAD ($) — Canadian Dollar</option>
                  <option value="AUD">AUD ($) — Australian Dollar</option>
                  <option value="INR">INR (₹) — Indian Rupee</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[#A7ADB8] uppercase tracking-wider mb-1">
                  Default Proposal Payment Terms
                </label>
                <textarea
                  rows={2}
                  value={form.defaultPaymentTerms}
                  onChange={(e) => setForm({ ...form, defaultPaymentTerms: e.target.value })}
                  className="w-full p-3.5 rounded-xl border border-white/10 bg-[#0D0F12] text-white focus:border-[#FF5A00] outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Section 3: AI Model Selection & Local Ollama Daemon */}
          <div className="p-6 sm:p-8 rounded-3xl border border-[#CDD3DC]/15 bg-[#16191E] shadow-2xl space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 font-display">
                <Cpu className="w-3.5 h-3.5 text-[#FF5A00]" />
                <span>03. AI Model Selection & Local Ollama Daemon</span>
              </h3>
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={isPinging}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-mono rounded-lg bg-white/5 border border-white/15 text-white hover:bg-white/10 hover:border-[#FF5A00] transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-[#FF5A00] ${isPinging ? 'animate-spin' : ''}`} />
                <span>{isPinging ? 'Testing...' : 'Test Ollama Connection'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[#A7ADB8] uppercase tracking-wider mb-1">
                  Active Local Model
                </label>
                <select
                  value={form.ollamaModel}
                  onChange={(e) => setForm({ ...form, ollamaModel: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-[#0D0F12] text-white focus:border-[#FF5A00] outline-hidden"
                >
                  <option value="qwen3:4b">qwen3:4b (Recommended / Low VRAM)</option>
                  <option value="llama3.2:3b">llama3.2:3b (Meta Llama 3.2)</option>
                  <option value="deepseek-r1:7b">deepseek-r1:7b (DeepSeek Reasoning)</option>
                  <option value="mistral:7b">mistral:7b (Mistral AI)</option>
                </select>
              </div>

              <div>
                <label className="block text-[#A7ADB8] uppercase tracking-wider mb-1">
                  FastAPI Backend Endpoint
                </label>
                <input
                  type="text"
                  value={form.fastApiUrl}
                  onChange={(e) => setForm({ ...form, fastApiUrl: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-[#0D0F12] text-white focus:border-[#FF5A00] outline-hidden"
                />
              </div>
            </div>

            {/* Health result */}
            <div className="p-4 rounded-2xl bg-[#0D0F12] border border-white/10 flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-2.5 h-2.5 rounded-full ${
                    backendStatus.isConnected
                      ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]'
                      : 'bg-amber-400 shadow-[0_0_8px_#f59e0b]'
                  }`}
                />
                <span className="text-white">
                  {backendStatus.isConnected
                    ? `Connected to FastAPI (${backendStatus.mode || 'local'})`
                    : 'Local Studio Mode (Autonomous in-browser persistence)'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setGuideOpen(true)}
                className="text-[#FF5A00] hover:underline"
              >
                Setup Guide →
              </button>
            </div>
          </div>

          {/* Section 4: Data Management & Backup */}
          <div className="p-6 sm:p-8 rounded-3xl border border-[#CDD3DC]/15 bg-[#16191E] shadow-2xl space-y-4 font-mono text-xs">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-white/10 pb-3 font-display">
              <Download className="w-3.5 h-3.5 text-[#FF5A00]" />
              <span>04. Data Portability & Backup</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button
                type="button"
                onClick={handleExportBackup}
                className="p-4 rounded-2xl bg-[#0D0F12] border border-white/10 hover:border-white/20 text-left transition-all group"
              >
                <Download className="w-4 h-4 text-[#FF5A00] mb-2 group-hover:scale-110 transition-transform" />
                <span className="font-bold text-white block">Export JSON Backup</span>
                <span className="text-[#A7ADB8] text-[11px] block mt-0.5">Download all proposals and clients</span>
              </button>

              <label className="p-4 rounded-2xl bg-[#0D0F12] border border-white/10 hover:border-white/20 text-left transition-all group cursor-pointer">
                <Upload className="w-4 h-4 text-emerald-400 mb-2 group-hover:scale-110 transition-transform" />
                <span className="font-bold text-white block">Restore From Backup</span>
                <span className="text-[#A7ADB8] text-[11px] block mt-0.5">Import previously exported JSON</span>
                <input type="file" accept=".json" onChange={handleImportBackup} className="hidden" />
              </label>

              <button
                type="button"
                onClick={handleResetData}
                className="p-4 rounded-2xl bg-[#0D0F12] border border-rose-500/20 hover:border-rose-500/40 text-left transition-all group"
              >
                <RotateCcw className="w-4 h-4 text-rose-400 mb-2 group-hover:rotate-180 transition-transform" />
                <span className="font-bold text-white block">Clear Local Cache</span>
                <span className="text-rose-300/70 text-[11px] block mt-0.5">Flush in-browser storage state</span>
              </button>
            </div>
          </div>
        </form>
      </main>

      <BackendGuideModal isOpen={guideOpen} onClose={() => setGuideOpen(false)} />
    </div>
  );
};
