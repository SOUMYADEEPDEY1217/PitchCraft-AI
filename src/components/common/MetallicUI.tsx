import React from 'react';
import { motion, type HTMLMotionProps } from 'motion/react';
import { ArrowUpRight, ArrowRight, X, AlertCircle, RefreshCw, Sparkles } from 'lucide-react';

// ============================================================================
// 1. TitaniumCard & MetallicCard
// ============================================================================
export interface TitaniumCardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
  className?: string;
  children: React.ReactNode;
}

export const TitaniumCard: React.FC<TitaniumCardProps> = ({
  hoverEffect = true,
  className = '',
  children,
  ...props
}) => {
  const Component = hoverEffect ? motion.div : 'div';
  const hoverProps = hoverEffect
    ? {
        whileHover: { y: -4, transition: { duration: 0.2 } },
      }
    : {};

  return (
    // @ts-expect-error motion vs div props
    <Component
      {...hoverProps}
      className={`rounded-3xl p-6 sm:p-8 relative overflow-hidden bg-gradient-to-b from-[#252A31] via-[#16191E] to-[#0D0F12] border border-[#CDD3DC]/20 text-[#F5F6F8] shadow-2xl ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
};

export interface MetallicCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'graphite' | 'titanium' | 'chrome' | 'orange';
  hoverEffect?: boolean;
  className?: string;
  children: React.ReactNode;
}

export const MetallicCard: React.FC<MetallicCardProps> = ({
  variant = 'graphite',
  hoverEffect = true,
  className = '',
  children,
  ...props
}) => {
  const variantStyles = {
    graphite: 'bg-[#16191E] border border-[#CDD3DC]/15 text-[#F5F6F8] shadow-xl',
    titanium: 'bg-gradient-to-b from-[#252A31] via-[#16191E] to-[#0D0F12] border border-[#CDD3DC]/20 text-[#F5F6F8] shadow-2xl',
    chrome: 'bg-gradient-to-br from-[#F1F3F6] via-[#CDD3DC] to-[#777F8B] text-[#07080A] border border-white/60 shadow-2xl',
    orange: 'bg-gradient-to-br from-[#FF8C32] via-[#FF5A00] to-[#D94800] text-white border border-[#FF8C32]/40 shadow-2xl shadow-[#FF5A00]/25',
  };

  const Component = hoverEffect ? motion.div : 'div';
  const hoverProps = hoverEffect
    ? {
        whileHover: { y: -4, transition: { duration: 0.2 } },
      }
    : {};

  return (
    // @ts-expect-error motion vs div props
    <Component
      {...hoverProps}
      className={`rounded-3xl p-6 sm:p-8 relative overflow-hidden ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
};

// ============================================================================
// 2. ChromeButton
// ============================================================================
export interface ChromeButtonProps extends HTMLMotionProps<'button'> {
  variant?: 'orange' | 'chrome' | 'titanium' | 'outlined' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: 'arrow-right' | 'arrow-up-right' | 'none';
  children: React.ReactNode;
}

export const ChromeButton: React.FC<ChromeButtonProps> = ({
  variant = 'orange',
  size = 'md',
  icon = 'arrow-right',
  children,
  className = '',
  ...props
}) => {
  const sizeStyles = {
    sm: 'px-4 py-2 text-xs',
    md: 'px-6 py-3 text-xs sm:text-sm',
    lg: 'px-8 py-4 text-sm sm:text-base font-semibold',
  };

  const variantStyles = {
    orange: 'bg-[#FF5A00] text-white hover:bg-white hover:text-[#07080A] shadow-xl shadow-[#FF5A00]/30 border border-[#FF8C32]/40',
    chrome: 'bg-gradient-to-r from-[#F1F3F6] via-white to-[#CDD3DC] text-[#07080A] hover:bg-[#FF5A00] hover:text-white border border-white shadow-xl',
    titanium: 'bg-[#252A31] text-[#F5F6F8] hover:bg-white hover:text-[#07080A] border border-[#CDD3DC]/30 shadow-xl',
    outlined: 'bg-white/[0.04] text-[#F5F6F8] border border-[#CDD3DC]/20 hover:border-white hover:bg-white/10',
    ghost: 'bg-transparent text-[#CDD3DC] hover:text-white hover:bg-white/5',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`group relative inline-flex items-center justify-center gap-2.5 rounded-full font-display tracking-wide uppercase transition-all duration-300 select-none ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      <span>{children}</span>
      {icon === 'arrow-right' && (
        <div className="w-5 h-5 rounded-full bg-black/20 group-hover:bg-[#07080A] group-hover:text-white flex items-center justify-center transition-colors">
          <ArrowRight className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-0.5" />
        </div>
      )}
      {icon === 'arrow-up-right' && (
        <div className="w-5 h-5 rounded-full bg-black/20 group-hover:bg-[#07080A] group-hover:text-white flex items-center justify-center transition-colors">
          <ArrowUpRight className="w-3 h-3 transition-transform duration-300 group-hover:rotate-45" />
        </div>
      )}
    </motion.button>
  );
};

// ============================================================================
// 3. GlassMetalPanel
// ============================================================================
export interface GlassMetalPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children: React.ReactNode;
}

export const GlassMetalPanel: React.FC<GlassMetalPanelProps> = ({
  className = '',
  children,
  ...props
}) => {
  return (
    <div
      className={`bg-[#16191E]/80 backdrop-blur-xl border border-[#CDD3DC]/15 rounded-3xl shadow-2xl ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

// Legacy alias
export const GlassPanel = GlassMetalPanel;

// ============================================================================
// 4. MetallicInput & MetallicSelect
// ============================================================================
export interface MetallicInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const MetallicInput: React.FC<MetallicInputProps> = ({
  label,
  error,
  className = '',
  id,
  ...props
}) => {
  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <label htmlFor={id} className="block text-xs font-mono uppercase tracking-wider text-[#CDD3DC]/80">
          {label}
        </label>
      )}
      <input
        id={id}
        className={`w-full px-4 py-3 bg-[#0D0F12] border border-[#CDD3DC]/15 rounded-2xl text-sm font-mono text-[#F5F6F8] placeholder-[#CDD3DC]/30 focus:outline-none focus:border-[#FF5A00] focus:ring-1 focus:ring-[#FF5A00] transition-all shadow-inner ${
          error ? 'border-red-500/80 focus:border-red-500' : ''
        } ${className}`}
        {...props}
      />
      {error && <p className="text-[11px] font-mono text-red-400 mt-1">{error}</p>}
    </div>
  );
};

export interface MetallicSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
}

export const MetallicSelect: React.FC<MetallicSelectProps> = ({
  label,
  error,
  className = '',
  id,
  children,
  ...props
}) => {
  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <label htmlFor={id} className="block text-xs font-mono uppercase tracking-wider text-[#CDD3DC]/80">
          {label}
        </label>
      )}
      <select
        id={id}
        className={`w-full px-4 py-3 bg-[#0D0F12] border border-[#CDD3DC]/15 rounded-2xl text-sm font-mono text-[#F5F6F8] focus:outline-none focus:border-[#FF5A00] focus:ring-1 focus:ring-[#FF5A00] transition-all shadow-inner ${
          error ? 'border-red-500/80 focus:border-red-500' : ''
        } ${className}`}
        {...props}
      >
        {children}
      </select>
      {error && <p className="text-[11px] font-mono text-red-400 mt-1">{error}</p>}
    </div>
  );
};

// ============================================================================
// 5. MetallicModal
// ============================================================================
export interface MetallicModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  maxWidth?: string;
}

export const MetallicModal: React.FC<MetallicModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'max-w-2xl',
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div
        className={`relative w-full ${maxWidth} bg-gradient-to-b from-[#252A31] via-[#16191E] to-[#0D0F12] border border-[#CDD3DC]/20 rounded-3xl shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto`}
      >
        <div className="flex items-start justify-between pb-4 border-b border-white/10 mb-6">
          <div>
            <h2 className="font-display text-xl sm:text-2xl font-bold uppercase text-white tracking-tight">
              {title}
            </h2>
            {subtitle && <p className="text-xs font-mono text-[#A7ADB8] mt-1">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#CDD3DC] hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};

// ============================================================================
// 6. MetallicBadge & StatusIndicator
// ============================================================================
export interface MetallicBadgeProps {
  label: string;
  variant?: 'default' | 'orange' | 'emerald' | 'amber';
  className?: string;
}

export const MetallicBadge: React.FC<MetallicBadgeProps> = ({
  label,
  variant = 'default',
  className = '',
}) => {
  const styles = {
    default: 'bg-white/[0.04] border-[#CDD3DC]/20 text-[#CDD3DC]',
    orange: 'bg-[#FF5A00]/10 border-[#FF5A00]/30 text-[#FF8C32]',
    emerald: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
    amber: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
  }[variant];

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full border text-[11px] font-mono tracking-wider uppercase font-semibold ${styles} ${className}`}
    >
      {label}
    </span>
  );
};

export interface StatusIndicatorProps {
  status: 'connected' | 'offline' | 'loading' | 'warning';
  label: string;
  sublabel?: string;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  label,
  sublabel,
}) => {
  const dotColor = {
    connected: 'bg-emerald-400 shadow-[0_0_8px_#34d399]',
    offline: 'bg-amber-400 shadow-[0_0_8px_#f59e0b]',
    loading: 'bg-[#FF5A00] shadow-[0_0_8px_#FF5A00] animate-pulse',
    warning: 'bg-red-400 shadow-[0_0_8px_#f87171]',
  }[status];

  return (
    <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-white/[0.04] border border-[#CDD3DC]/15 font-mono text-xs">
      <span className={`w-2 h-2 rounded-full ${dotColor}`} />
      <span className="text-[#F5F6F8] uppercase font-semibold">{label}</span>
      {sublabel && <span className="text-[#CDD3DC]/60">· {sublabel}</span>}
    </div>
  );
};

// ============================================================================
// 7. DashboardMetricCard
// ============================================================================
export interface DashboardMetricCardProps {
  index: string;
  label: string;
  value: string | number;
  subtext: string;
  icon: React.ReactNode;
  variant?: 'default' | 'emerald' | 'orange';
}

export const DashboardMetricCard: React.FC<DashboardMetricCardProps> = ({
  index,
  label,
  value,
  subtext,
  icon,
  variant = 'default',
}) => {
  const variantStyles = {
    default: 'border-[#CDD3DC]/15 hover:border-[#CDD3DC]/30',
    emerald: 'border-emerald-500/30 hover:border-emerald-500/60',
    orange: 'border-[#FF5A00]/30 hover:border-[#FF5A00]/60',
  }[variant];

  return (
    <div
      className={`p-6 rounded-3xl bg-[#16191E] border ${variantStyles} shadow-2xl relative overflow-hidden group transition-all duration-300`}
    >
      <div className="flex items-center justify-between text-[#CDD3DC]/70">
        <span className="text-xs font-mono uppercase tracking-wider">{index}. {label}</span>
        <div className="text-[#FF5A00] group-hover:scale-110 transition-transform">{icon}</div>
      </div>
      <div className="mt-4 text-3xl font-display font-extrabold tracking-tight text-white font-mono">
        {value}
      </div>
      <div className="mt-2 text-xs font-mono text-[#A7ADB8]">
        {subtext}
      </div>
    </div>
  );
};

// ============================================================================
// 8. CinematicSection & SectionHeading
// ============================================================================
export interface CinematicSectionProps extends React.HTMLAttributes<HTMLElement> {
  id?: string;
  className?: string;
  children: React.ReactNode;
  hasGlow?: boolean;
}

export const CinematicSection: React.FC<CinematicSectionProps> = ({
  id,
  className = '',
  children,
  hasGlow = true,
  ...props
}) => {
  return (
    <section
      id={id}
      className={`relative py-24 md:py-32 bg-[#07080A] text-[#F5F6F8] overflow-hidden ${className}`}
      {...props}
    >
      {hasGlow && (
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#FF5A00]/5 rounded-full blur-[140px] pointer-events-none" />
      )}
      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">{children}</div>
    </section>
  );
};

export interface SectionHeadingProps {
  eyebrow?: string;
  title: string | React.ReactNode;
  subtitle?: string | React.ReactNode;
  align?: 'left' | 'center';
  className?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  eyebrow,
  title,
  subtitle,
  align = 'center',
  className = '',
}) => {
  const alignClass = align === 'center' ? 'text-center mx-auto' : 'text-left';

  return (
    <div className={`max-w-3xl mb-16 ${alignClass} ${className}`}>
      {eyebrow && (
        <div className={`text-xs font-mono uppercase tracking-widest text-[#FF5A00] mb-3 flex items-center gap-2 ${align === 'center' ? 'justify-center' : ''}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF5A00]" />
          <span>{eyebrow}</span>
        </div>
      )}
      <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl font-extrabold uppercase text-white tracking-tight leading-[1.05]">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-sm sm:text-base text-[#A7ADB8] font-mono leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
};

// ============================================================================
// 9. MetallicTabs
// ============================================================================
export interface MetallicTabsProps<T extends string> {
  tabs: { id: T; label: string }[];
  activeTab: T;
  onChange: (id: T) => void;
  className?: string;
}

export function MetallicTabs<T extends string>({
  tabs,
  activeTab,
  onChange,
  className = '',
}: MetallicTabsProps<T>) {
  return (
    <div className={`inline-flex p-1.5 rounded-full bg-[#16191E] border border-white/10 ${className}`}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={`px-5 py-2 rounded-full text-xs font-mono uppercase tracking-wider transition-all ${
            activeTab === tab.id
              ? 'bg-[#FF5A00] text-white shadow-lg shadow-[#FF5A00]/25 font-semibold'
              : 'text-[#A7ADB8] hover:text-white'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

// ============================================================================
// 10. MetallicTable
// ============================================================================
export interface MetallicTableProps {
  headers: string[];
  children: React.ReactNode;
  className?: string;
}

export const MetallicTable: React.FC<MetallicTableProps> = ({
  headers,
  children,
  className = '',
}) => {
  return (
    <div className={`overflow-x-auto rounded-2xl border border-white/10 bg-[#16191E] shadow-xl ${className}`}>
      <table className="w-full text-left font-mono text-xs text-[#F5F6F8]">
        <thead className="bg-[#252A31] border-b border-white/10 text-[#CDD3DC] uppercase tracking-wider text-[11px]">
          <tr>
            {headers.map((h, i) => (
              <th key={i} className="px-6 py-4 font-semibold">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">{children}</tbody>
      </table>
    </div>
  );
};

// ============================================================================
// 11. LoadingSkeleton, EmptyState, ErrorState
// ============================================================================
export const LoadingSkeleton: React.FC<{ rows?: number; className?: string }> = ({
  rows = 4,
  className = '',
}) => {
  return (
    <div className={`space-y-3 animate-pulse ${className}`}>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="h-10 bg-white/[0.04] border border-white/5 rounded-xl w-full"
        />
      ))}
    </div>
  );
};

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionText,
  onAction,
}) => {
  return (
    <div className="text-center py-16 px-6 rounded-3xl border border-white/10 bg-[#16191E]/60 backdrop-blur-md">
      <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#FF5A00] mx-auto mb-4">
        {icon || <Sparkles className="w-6 h-6" />}
      </div>
      <h3 className="font-display text-lg font-bold uppercase text-white tracking-tight">
        {title}
      </h3>
      <p className="text-xs font-mono text-[#A7ADB8] max-w-md mx-auto mt-2 leading-relaxed">
        {description}
      </p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="mt-6 px-6 py-2.5 rounded-full bg-[#FF5A00] text-white font-display text-xs font-semibold uppercase tracking-wider hover:bg-white hover:text-[#07080A] transition-all shadow-lg shadow-[#FF5A00]/25"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

export interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'System Warning',
  message,
  onRetry,
}) => {
  return (
    <div className="p-6 rounded-3xl border border-red-500/30 bg-red-950/20 text-red-200 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <AlertCircle className="w-6 h-6 text-red-400 shrink-0" />
        <div>
          <h4 className="font-display text-sm font-bold uppercase tracking-tight text-white">{title}</h4>
          <p className="text-xs font-mono text-red-300/80 mt-0.5">{message}</p>
        </div>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white font-mono text-xs uppercase transition-colors shrink-0"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Retry</span>
        </button>
      )}
    </div>
  );
};
