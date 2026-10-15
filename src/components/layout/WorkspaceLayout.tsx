import React, { useState } from 'react';
import { Outlet, useOutletContext, Navigate, useLocation } from 'react-router-dom';
import { Sidebar } from '../common/Sidebar';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, Cpu } from 'lucide-react';

interface WorkspaceContextType {
  onOpenMobileMenu: () => void;
}

export const useWorkspaceMenu = () => {
  return useOutletContext<WorkspaceContextType>();
};

export const WorkspaceLayout: React.FC = () => {
  const { user, authLoading } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  // If session verification is underway, show sleek metallic loading screen
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#07080A] text-[#F5F6F8] flex flex-col items-center justify-center p-6 select-none relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#FF5A00]/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="p-8 rounded-3xl border border-[#CDD3DC]/20 bg-[#15171B]/90 backdrop-blur-xl max-w-sm w-full text-center space-y-5 shadow-2xl relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-[#0D0F12] border border-[#FF5A00]/40 flex items-center justify-center text-[#FF5A00] mx-auto shadow-[0_0_20px_rgba(255,90,0,0.3)]">
            <Cpu className="w-7 h-7 animate-pulse" />
          </div>
          <div>
            <h2 className="font-display text-sm font-extrabold uppercase text-white tracking-widest">
              PitchCraft AI
            </h2>
            <p className="mt-1 text-xs font-mono text-[#A7ADB8]">
              Verifying Encrypted Session & Firestore Isolation...
            </p>
          </div>
          <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden">
            <div className="bg-[#FF5A00] h-full w-2/3 animate-[shimmer_1.5s_infinite] shadow-[0_0_10px_#FF5A00]" />
          </div>
          <div className="text-[10px] font-mono text-emerald-400 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Air-Gapped Multi-Tenant Partition</span>
          </div>
        </div>
      </div>
    );
  }

  // Strict route protection: unauthenticated users redirected to /login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <div className="flex min-h-screen bg-[#07080A] text-[#F5F6F8] antialiased selection:bg-[#FF5A00] selection:text-white">
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <div className="flex-1 flex flex-col min-w-0 bg-[#07080A]">
        <Outlet context={{ onOpenMobileMenu: () => setMobileOpen(true) }} />
      </div>
    </div>
  );
};
