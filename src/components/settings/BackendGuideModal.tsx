import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Server, Sparkles, CheckCircle2, AlertCircle, RefreshCw, Terminal, Copy, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';

interface BackendGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BackendGuideModal: React.FC<BackendGuideModalProps> = ({ isOpen, onClose }) => {
  const { backendStatus, checkBackendStatus, settings, saveSettings, showToast } = useApp();
  const [isPinging, setIsPinging] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleTestConnection = async () => {
    setIsPinging(true);
    await checkBackendStatus();
    setIsPinging(false);
    showToast('Connection health check completed', 'info');
  };

  const copyCode = (code: string, idx: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
    showToast('Command copied to clipboard', 'success');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Backend & AI Engine Architecture"
      subtitle="PitchCraft AI connects seamlessly to your Python FastAPI backend and Ollama server"
      maxWidth="max-w-2xl"
    >
      <div className="space-y-5 text-xs text-slate-600 dark:text-slate-300">
        {/* Status card */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                backendStatus.isConnected
                  ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400'
                  : 'bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400'
              }`}
            >
              {backendStatus.isConnected ? <Server className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
            </div>
            <div>
              <p className="font-semibold text-slate-900 dark:text-white">
                {backendStatus.isConnected ? 'Connected to FastAPI Microservice' : 'Interactive Local Studio Mode Active'}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Target Backend: <code className="font-mono">{settings.fastApiUrl || 'http://localhost:8000'}</code>
              </p>
            </div>
          </div>
          <button
            onClick={handleTestConnection}
            disabled={isPinging}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 font-medium text-slate-700 dark:text-slate-200 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isPinging ? 'animate-spin' : ''}`} />
            <span>{isPinging ? 'Pinging...' : 'Test Connection'}</span>
          </button>
        </div>

        {/* Explain local demo transparency */}
        <div className="p-3.5 bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200/70 dark:border-blue-900/50 rounded-lg text-blue-900 dark:text-blue-200 text-xs leading-relaxed">
          <strong>Production Transparency Notice:</strong> When running inside this web preview without a local Python server started on port 8000, PitchCraft AI operates in <strong>Interactive Studio Mode</strong>. All proposals, clients, calculations, and AI outputs are fully editable, persistent in your browser, and ready to sync whenever your FastAPI backend is live.
        </div>

        {/* Setup steps */}
        <div className="space-y-3">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm">
            Quick Start: Running FastAPI & Ollama Locally
          </h4>

          {/* Step 1 */}
          <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-medium text-slate-900 dark:text-white">
                1. Start Ollama with Llama 3.2
              </span>
              <button
                onClick={() => copyCode('ollama run llama3.2', 1)}
                className="p-1 hover:text-indigo-600 transition-colors"
                title="Copy command"
              >
                {copiedIndex === 1 ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <pre className="p-2 rounded bg-slate-900 text-slate-100 font-mono text-[11px] overflow-x-auto">
              ollama run llama3.2
            </pre>
          </div>

          {/* Step 2 */}
          <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-medium text-slate-900 dark:text-white">
                2. Install FastAPI & Uvicorn in /backend
              </span>
              <button
                onClick={() => copyCode('cd backend && pip install -r requirements.txt && uvicorn main:app --reload --port 8000', 2)}
                className="p-1 hover:text-indigo-600 transition-colors"
                title="Copy command"
              >
                {copiedIndex === 2 ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <pre className="p-2 rounded bg-slate-900 text-slate-100 font-mono text-[11px] overflow-x-auto">
              cd backend && pip install -r requirements.txt && uvicorn main:app --reload --port 8000
            </pre>
          </div>
        </div>

        {/* AI Mode selector */}
        <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
          <label className="block font-medium text-slate-900 dark:text-white mb-2">
            Select Active AI Engine
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {[
              { id: 'local_demo', label: 'Local Studio (Built-in)', desc: 'Instant, no backend required' },
              { id: 'fastapi', label: 'FastAPI Backend', desc: 'http://localhost:8000' },
              { id: 'ollama_direct', label: 'Ollama Direct', desc: 'http://localhost:11434' },
            ].map((mode) => (
              <button
                key={mode.id}
                onClick={() => {
                  saveSettings({ ...settings, aiMode: mode.id as any });
                }}
                className={`p-3 text-left rounded-lg border transition-all ${
                  settings.aiMode === mode.id
                    ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-slate-900 dark:text-white'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="font-semibold text-xs">{mode.label}</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{mode.desc}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
};
