import React from 'react';
import { DemoModeBadge } from './DemoModeBadge';
import { Menu, User, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface HeaderProps {
  breadcrumbs: { label: string; href?: string }[];
  actions?: React.ReactNode;
  onOpenMobileMenu?: () => void;
  onOpenBackendGuide?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  breadcrumbs,
  actions,
  onOpenMobileMenu,
  onOpenBackendGuide,
}) => {
  const { user, openAuthModal } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-4 px-6 py-4 bg-[#07080A]/90 backdrop-blur-2xl border-b border-[#CDD3DC]/15">
      <div className="flex items-center gap-3 min-w-0">
        {onOpenMobileMenu && (
          <button
            onClick={onOpenMobileMenu}
            className="md:hidden p-1.5 text-white/70 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
            aria-label="Open mobile navigation"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        {/* Clean unboxed breadcrumb with typographic slash */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2.5 text-xs font-mono tracking-wider text-[#CDD3DC]/70">
          {breadcrumbs.map((crumb, idx) => {
            const isLast = idx === breadcrumbs.length - 1;
            return (
              <React.Fragment key={crumb.label}>
                {idx > 0 && <span className="text-[#CDD3DC]/25">/</span>}
                {isLast ? (
                  <span className="font-semibold text-white truncate font-display">
                    {crumb.label}
                  </span>
                ) : (
                  <span className="hover:text-white truncate transition-colors">
                    {crumb.label}
                  </span>
                )}
              </React.Fragment>
            );
          })}
        </nav>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <DemoModeBadge onOpenBackendGuide={onOpenBackendGuide} />

        {/* Cloud User Pill */}
        {user ? (
          <button
            type="button"
            onClick={() => openAuthModal('signin')}
            className="hidden sm:flex items-center gap-2 py-1.5 px-3 rounded-full bg-[#16191E] hover:bg-[#252A31] border border-white/10 text-xs font-mono text-white transition-all shadow-sm"
            title="Firestore User Account"
          >
            <div className="w-5 h-5 rounded-full bg-[#252A31] border border-white/20 flex items-center justify-center text-[9px] font-bold overflow-hidden">
              {user.photoURL ? (
                <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span>{(user.displayName || user.email || 'U').charAt(0).toUpperCase()}</span>
              )}
            </div>
            <span className="text-white/90 text-[11px] max-w-[120px] truncate">
              {user.displayName?.split(' ')[0] || user.email?.split('@')[0]}
            </span>
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => openAuthModal('signin')}
            className="hidden sm:inline-flex items-center gap-1.5 py-1.5 px-3 rounded-full bg-white/5 hover:bg-white/10 border border-[#FF5A00]/40 text-xs font-mono text-white transition-all shadow-sm"
          >
            <span className="text-[#FF5A00] font-bold">Sign In</span>
            <span className="text-white/50">· Sync</span>
          </button>
        )}

        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    </header>
  );
};
