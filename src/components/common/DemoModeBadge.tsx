import React from 'react';
import { Server, ChevronRight, Cpu } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface DemoModeBadgeProps {
  onOpenBackendGuide?: () => void;
}

export const DemoModeBadge: React.FC<DemoModeBadgeProps> = ({ onOpenBackendGuide }) => {
  const { backendStatus } = useApp();

  if (backendStatus.isConnected) {
    return (
      <button
        onClick={onOpenBackendGuide}
        className="flex items-center gap-2 px-3 py-1.5 text-xs font-mono font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 rounded-full hover:bg-emerald-500/20 transition-all shadow-sm"
        title="Connected to FastAPI Backend & Database"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <span>FastAPI Online</span>
        {backendStatus.latencyMs && (
          <span className="text-[10px] text-emerald-400/70 border-l border-emerald-500/20 pl-1.5">
            {backendStatus.latencyMs}ms
          </span>
        )}
      </button>
    );
  }

  return (
    <button
      onClick={onOpenBackendGuide}
      className="group flex items-center gap-2 px-3 py-1.5 text-xs font-mono font-medium text-[#A7A9AC] bg-white/5 border border-white/10 rounded-full hover:bg-white/10 hover:text-white transition-all shadow-sm"
      title="Running in Local Studio Mode with persistent browser storage. Click to connect FastAPI."
    >
      <span className="w-1.5 h-1.5 rounded-full bg-[#FF4D00] shadow-[0_0_8px_#FF4D00]" />
      <span>Local Studio Mode</span>
      <ChevronRight className="w-3 h-3 text-white/40 group-hover:translate-x-0.5 transition-transform" />
    </button>
  );
};
