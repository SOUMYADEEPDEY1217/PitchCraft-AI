import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowUpRight, Menu, X, Cpu, ShieldCheck, User, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../context/AuthContext';

export const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, openAuthModal, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', href: '/#top', path: '/' },
    { label: 'Features', href: '/features', path: '/features' },
    { label: 'How It Works', href: '/how-it-works', path: '/how-it-works' },
    { label: 'Pricing', href: '/pricing', path: '/pricing' },
    { label: 'About', href: '/about', path: '/about' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'py-3.5 bg-[#07080A]/85 backdrop-blur-2xl border-b border-[#CDD3DC]/15 shadow-2xl'
            : 'py-5 bg-transparent border-b border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Brand Logo with Custom Metallic Geometric Core */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#252A31] via-[#16191E] to-[#07080A] border border-[#CDD3DC]/30 flex items-center justify-center relative overflow-hidden transition-all duration-300 group-hover:border-[#FF5A00] shadow-lg shadow-black/60">
              <div className="w-3 h-3 bg-[#FF5A00] rounded-sm transform rotate-45 transition-transform duration-500 group-hover:rotate-180 shadow-[0_0_12px_#FF5A00]" />
              <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/10 pointer-events-none" />
            </div>
            <div>
              <span className="font-display text-base sm:text-lg font-extrabold tracking-tight text-white flex items-center gap-1.5 leading-none">
                PITCHCRAFT <span className="text-[#FF5A00]">AI</span>
              </span>
              <span className="text-[9px] font-mono tracking-widest text-[#CDD3DC]/50 block uppercase mt-0.5">
                TITANIUM STUDIO // OPEN-SOURCE
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs uppercase tracking-widest font-mono text-[#CDD3DC]/80">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;

              return (
                <Link
                  key={link.label}
                  to={link.path}
                  className={`hover:text-white transition-colors duration-200 relative group py-1 ${
                    isActive ? 'text-white font-semibold' : ''
                  }`}
                >
                  {link.label}
                  <span
                    className={`absolute bottom-0 left-0 h-[1.5px] bg-[#FF5A00] transition-all duration-200 shadow-[0_0_8px_#FF5A00] ${
                      isActive ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

          {/* Right Action Controls */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              to="/dashboard"
              className="text-xs uppercase font-mono tracking-wider text-[#CDD3DC]/80 hover:text-white transition-colors px-2 py-1"
            >
              Dashboard
            </Link>

            {user ? (
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => openAuthModal('signin')}
                  className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-[#16191E] border border-white/10 hover:border-[#FF5A00]/50 transition-all text-left"
                  title="Manage Account / View Firestore Document"
                >
                  <div className="w-6 h-6 rounded-full bg-[#252A31] border border-white/20 flex items-center justify-center text-[10px] font-bold text-white overflow-hidden">
                    {user.photoURL ? (
                      <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <span>{(user.displayName || user.email || 'U').charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                  <span className="text-xs font-mono text-white/90 max-w-[110px] truncate">
                    {user.displayName?.split(' ')[0] || user.email?.split('@')[0]}
                  </span>
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
                </button>

                <Link
                  to="/generator"
                  className="group relative inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FF5A00] text-white hover:bg-white hover:text-[#07080A] font-display text-xs font-semibold tracking-wide transition-all duration-300 shadow-xl shadow-[#FF5A00]/25 border border-[#FF8C32]/40"
                >
                  <span>Workspace</span>
                  <div className="w-4 h-4 rounded-full bg-black/20 text-white group-hover:bg-[#07080A] group-hover:text-white flex items-center justify-center transition-colors">
                    <ArrowUpRight className="w-2.5 h-2.5 transition-transform duration-300 group-hover:rotate-45" />
                  </div>
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-xs uppercase font-mono tracking-wider text-[#CDD3DC]/90 hover:text-white px-3 py-2 rounded-xl border border-white/10 hover:border-white/20 bg-white/5 transition-all"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="group relative inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#FF5A00] text-white hover:bg-white hover:text-[#07080A] font-display text-xs font-semibold tracking-wide transition-all duration-300 shadow-xl shadow-[#FF5A00]/25 border border-[#FF8C32]/40"
                >
                  <span>Get Started</span>
                  <div className="w-5 h-5 rounded-full bg-black/20 text-white group-hover:bg-[#07080A] group-hover:text-white flex items-center justify-center transition-colors duration-300">
                    <ArrowUpRight className="w-3 h-3 transition-transform duration-300 group-hover:rotate-45" />
                  </div>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-[#F5F6F8] bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-18 z-40 bg-[#07080A]/95 backdrop-blur-3xl border-b border-[#CDD3DC]/15 p-6 md:hidden shadow-2xl"
          >
            <div className="flex flex-col gap-4 text-sm font-mono uppercase tracking-widest text-[#F5F6F8]">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`py-2.5 border-b border-white/5 hover:text-[#FF5A00] transition-colors ${
                    location.pathname === link.path ? 'text-[#FF5A00] font-semibold' : ''
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              <div className="pt-4 flex flex-col gap-3">
                {user ? (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        openAuthModal('signin');
                      }}
                      className="w-full py-3 px-4 text-left rounded-xl bg-[#16191E] border border-white/10 text-white font-mono text-xs flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <User className="w-4 h-4 text-[#FF5A00] shrink-0" />
                        <span className="truncate">{user.displayName || user.email}</span>
                      </div>
                      <span className="text-[10px] text-emerald-400 uppercase font-semibold">Synced</span>
                    </button>
                    <Link
                      to="/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full py-3 text-center rounded-xl bg-white/5 border border-[#CDD3DC]/15 text-white font-mono text-xs uppercase"
                    >
                      Launch Dashboard
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full py-3 text-center rounded-xl bg-[#16191E] border border-[#CDD3DC]/20 text-white font-mono text-xs uppercase block"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/signup"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full py-3 rounded-full bg-[#FF5A00] text-white font-display font-semibold text-center text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg shadow-[#FF5A00]/30 block"
                    >
                      <span>Get Started Free</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export const MetallicNavbar = Navbar;
