import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Sparkles,
  FileEdit,
  History,
  Calculator,
  Users,
  Wand2,
  Settings,
  ExternalLink,
  ChevronLeft,
  ArrowUpRight,
  LogIn,
  LogOut,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, setMobileOpen }) => {
  const { settings, backendStatus } = useApp();
  const { user, userProfile, openAuthModal, signOut } = useAuth();

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/generator', label: 'AI Generator', icon: Sparkles },
    { to: '/editor', label: 'Proposal Editor', icon: FileEdit },
    { to: '/history', label: 'Proposal History', icon: History },
    { to: '/calculator', label: 'Pricing Engine', icon: Calculator },
    { to: '/crm', label: 'Client CRM', icon: Users },
    { to: '/tools', label: 'AI Tools Hub', icon: Wand2 },
    { to: '/settings', label: 'Settings', icon: Settings },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#0D0F12] border-r border-[#CDD3DC]/15 text-[#F5F6F8] w-64 select-none">
      {/* Brand Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#CDD3DC]/10">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#252A31] via-[#16191E] to-[#07080A] border border-[#CDD3DC]/25 flex items-center justify-center relative overflow-hidden transition-all duration-300 group-hover:scale-105 group-hover:border-[#FF5A00]">
            <div className="w-2.5 h-2.5 bg-[#FF5A00] rounded-sm transform rotate-45 transition-transform duration-300 group-hover:rotate-90 shadow-[0_0_10px_#FF5A00]" />
          </div>
          <div>
            <span className="font-display text-sm font-bold tracking-tight text-white block leading-tight">
              PitchCraft <span className="text-[#FF5A00]">AI</span>
            </span>
            <span className="text-[9px] font-mono tracking-widest text-[#CDD3DC]/60 block uppercase">
              TITANIUM // STUDIO
            </span>
          </div>
        </Link>
        <button
          onClick={() => setMobileOpen(false)}
          className="md:hidden p-1.5 text-white/50 hover:text-white"
          aria-label="Close navigation"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      </div>

      {/* Quick Action: New Proposal Button */}
      <div className="p-3">
        <Link
          to="/generator"
          onClick={() => setMobileOpen(false)}
          className="group relative flex items-center justify-between w-full py-2.5 px-4 rounded-full bg-[#FF5A00] text-white hover:bg-white hover:text-[#07080A] font-display text-xs font-semibold tracking-wide transition-all duration-300 shadow-lg shadow-[#FF5A00]/25 border border-[#FF8C32]/40"
        >
          <span>New Proposal</span>
          <div className="w-5 h-5 rounded-full bg-black/20 group-hover:bg-[#07080A] group-hover:text-white flex items-center justify-center transition-colors">
            <ArrowUpRight className="w-3 h-3 transition-transform duration-300 group-hover:rotate-45" />
          </div>
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-mono tracking-wide transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-[#252A31] to-[#16191E] text-white font-semibold border border-[#CDD3DC]/20 shadow-sm'
                    : 'text-[#A7ADB8] hover:bg-white/5 hover:text-white'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#FF5A00]' : 'text-[#A7ADB8]'}`} />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <div className="w-1.5 h-1.5 rounded-full bg-[#FF5A00] shadow-[0_0_8px_#FF5A00]" />}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Inference & System Status Pip */}
      <div className="px-4 py-3 mx-3 my-2 rounded-2xl bg-[#16191E] border border-white/5 space-y-1.5">
        <div className="flex items-center justify-between text-[11px] font-mono">
          <span className="text-[#A7ADB8]">Inference Engine:</span>
          <span className="text-[#FF5A00] font-semibold">Ollama · Qwen</span>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-mono text-white/60">
          <div
            className={`w-2 h-2 rounded-full ${
              backendStatus.isConnected
                ? 'bg-emerald-400 shadow-[0_0_6px_#34d399]'
                : 'bg-amber-400 shadow-[0_0_6px_#f59e0b]'
            }`}
          />
          <span>{backendStatus.isConnected ? 'FastAPI Service Online' : 'Local Studio Mode (Active)'}</span>
        </div>
      </div>

      {/* User profile & public link */}
      <div className="p-3 border-t border-white/10 flex items-center justify-between">
        {user ? (
          <button
            type="button"
            onClick={() => openAuthModal('signin')}
            className="flex items-center gap-2.5 min-w-0 text-left hover:opacity-85 transition-opacity flex-1 mr-2"
            title="Manage Firebase Account & Cloud Firestore Sync"
          >
            <div className="w-8 h-8 rounded-full bg-[#252A31] border border-[#CDD3DC]/20 flex items-center justify-center text-xs font-display font-bold text-white shrink-0 overflow-hidden">
              {user.photoURL ? (
                <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span>{(user.displayName || user.email || 'A').charAt(0).toUpperCase()}</span>
              )}
            </div>
            <div className="truncate flex-1">
              <p className="text-xs font-semibold text-white truncate font-display">
                {user.displayName || user.email?.split('@')[0]}
              </p>
              <p className="text-[10px] text-emerald-400 truncate font-mono flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Firestore Synced
              </p>
            </div>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => openAuthModal('signin')}
            className="flex items-center gap-2 py-2 px-3 rounded-xl bg-gradient-to-r from-[#252A31] to-[#16191E] hover:from-[#3D444E] hover:to-[#252A31] border border-[#FF5A00]/40 text-xs font-mono text-white transition-all flex-1 mr-2 shadow-sm"
          >
            <LogIn className="w-3.5 h-3.5 text-[#FF5A00]" />
            <span className="truncate">Sign In / Sync</span>
          </button>
        )}
        {user && (
          <button
            type="button"
            onClick={async () => {
              await signOut();
            }}
            className="p-1.5 text-[#A7ADB8] hover:text-red-400 rounded-lg hover:bg-white/5 transition-colors shrink-0 mr-1"
            title="Sign Out of Session"
          >
            <LogOut className="w-4 h-4" />
          </button>
        )}
        <Link
          to="/"
          className="p-1.5 text-[#A7ADB8] hover:text-white rounded-lg hover:bg-white/5 transition-colors shrink-0"
          title="View Public Website"
        >
          <ExternalLink className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:shrink-0 md:sticky md:top-0 md:h-screen">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm md:hidden"
          onClick={() => setMobileOpen(false)}
        >
          <div
            className="w-64 h-full bg-[#0D0F12]"
            onClick={(e) => e.stopPropagation()}
          >
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};

export const MetallicSidebar = Sidebar;
