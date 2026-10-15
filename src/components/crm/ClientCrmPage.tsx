import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Header } from '../common/Header';
import { Client } from '../../types';
import { BackendGuideModal } from '../settings/BackendGuideModal';
import { Modal } from '../common/Modal';
import { useWorkspaceMenu } from '../layout/WorkspaceLayout';
import {
  Users,
  Search,
  Plus,
  Edit2,
  Trash2,
  Mail,
  Phone,
  Globe,
  FileText,
  DollarSign,
  ArrowRight,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react';

export const ClientCrmPage: React.FC<{ onOpenMobileMenu?: () => void }> = ({ onOpenMobileMenu }) => {
  const { clients, saveClient, deleteClient, proposals, formatCurrency, showToast } = useApp();
  const navigate = useNavigate();
  const workspaceContext = useWorkspaceMenu();
  const handleOpenMobile = onOpenMobileMenu || workspaceContext?.onOpenMobileMenu;

  const [search, setSearch] = useState('');
  const [industryFilter, setIndustryFilter] = useState('all');
  const [guideOpen, setGuideOpen] = useState(false);
  const [clientModalOpen, setClientModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  // Form states for Add/Edit
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [website, setWebsite] = useState('');
  const [industry, setIndustry] = useState('');
  const [status, setStatus] = useState<'active' | 'lead' | 'past'>('active');
  const [notes, setNotes] = useState('');

  const openAddModal = () => {
    setEditingClient(null);
    setName('');
    setCompany('');
    setEmail('');
    setPhone('');
    setWebsite('');
    setIndustry('SaaS & Software');
    setStatus('lead');
    setNotes('');
    setClientModalOpen(true);
  };

  const openEditModal = (c: Client) => {
    setEditingClient(c);
    setName(c.name);
    setCompany(c.company);
    setEmail(c.email);
    setPhone(c.phone || '');
    setWebsite(c.website || '');
    setIndustry(c.industry);
    setStatus(c.status);
    setNotes(c.notes || '');
    setClientModalOpen(true);
  };

  const handleSaveClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      showToast('Client name and email are required', 'error');
      return;
    }

    const payload: Client = {
      id: editingClient?.id || `cli-${Date.now().toString().slice(-4)}`,
      name,
      company: company || name,
      email,
      phone,
      website,
      industry,
      status,
      notes,
      totalQuoted: editingClient?.totalQuoted || 0,
      totalPaid: editingClient?.totalPaid || 0,
      proposalsCount: editingClient?.proposalsCount || 0,
      createdAt: editingClient?.createdAt || new Date().toISOString(),
    };

    await saveClient(payload);
    setClientModalOpen(false);
  };

  const filteredClients = clients.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.company.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase());
    const matchesIndustry = industryFilter === 'all' || c.industry.includes(industryFilter);
    return matchesSearch && matchesIndustry;
  });

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-[#08090B] text-[#F4F5F7] min-h-screen">
      <Header
        breadcrumbs={[{ label: 'PitchCraft AI', href: '/dashboard' }, { label: 'Client CRM' }]}
        onOpenMobileMenu={handleOpenMobile}
        onOpenBackendGuide={() => setGuideOpen(true)}
        actions={
          <button
            onClick={openAddModal}
            className="group flex items-center gap-2 px-4 py-2 text-xs font-display font-semibold text-white bg-[#FF5A00] hover:bg-white hover:text-[#08090B] rounded-full transition-all whitespace-nowrap shadow-md shadow-[#FF5A00]/25 cursor-pointer border border-[#FF8A32]/40"
          >
            <span>Add Client</span>
            <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:rotate-45" />
          </button>
        }
      />

      <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto space-y-8">
        {/* Editorial Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-[#D4D8DF]/15">
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-[#FF5A00] mb-2">
              Relationship Telemetry // Directory
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold uppercase text-white tracking-tight">
              Client CRM Directory ({clients.length})
            </h1>
            <p className="mt-2 text-xs font-mono text-[#D4D8DF]/70">
              Track client records, proposal volume, and lifetime quotes in one workspace.
            </p>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="p-5 rounded-3xl border border-[#D4D8DF]/15 bg-[#15171B] shadow-xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 font-mono text-xs">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search clients by contact name, company or email..."
              className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-white/10 bg-[#0c0d0f] text-white placeholder-white/20 focus:border-[#FF4D00] outline-hidden transition-colors"
            />
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-[#A7A9AC]">Active Roster: {clients.length} Accounts</span>
          </div>
        </div>

        {/* Client Cards Grid */}
        {filteredClients.length === 0 ? (
          <div className="p-12 text-center rounded-3xl border border-white/10 bg-[#15161A] shadow-xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#FF5A00] mx-auto">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-display text-base font-bold uppercase text-white">
                {clients.length === 0 ? 'Your Client CRM is Empty' : 'No Clients Match Your Filter'}
              </h3>
              <p className="text-xs font-mono text-[#A7A9AC] mt-1 max-w-md mx-auto">
                {clients.length === 0
                  ? 'Add your first client profile to track company details, contacts, lifetime quoting history, and link proposals.'
                  : 'Try adjusting your search query or clear the filter.'}
              </p>
            </div>
            {clients.length === 0 ? (
              <button
                type="button"
                onClick={openAddModal}
                className="mt-4 px-6 py-2.5 rounded-xl bg-[#FF5A00] hover:bg-white text-[#07080A] font-display font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-[#FF5A00]/25 inline-flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Your First Client</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="mt-3 px-4 py-2 text-xs font-mono text-[#FF5A00] hover:underline"
              >
                Clear Search Filter
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredClients.map((client) => {
              const clientProposals = proposals.filter(
                (p) => p.clientId === client.id || p.clientName === client.name || p.clientCompany === client.company
              );
            const clientQuoted = clientProposals.reduce((sum, p) => sum + (p.totalBudget || 0), 0);

            return (
              <div
                key={client.id}
                className="p-7 rounded-3xl border border-white/10 bg-[#15161A] shadow-xl flex flex-col justify-between space-y-5 hover:border-white/20 transition-all"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="font-display text-lg font-bold uppercase text-white tracking-tight">
                        {client.company}
                      </h2>
                      <p className="text-xs font-mono text-[#A7A9AC] mt-1">
                        Contact: {client.name} · {client.industry}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-mono font-semibold px-2.5 py-1 rounded-full ${
                          client.status === 'active'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : client.status === 'lead'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                            : 'bg-white/5 text-[#A7A9AC] border border-white/10'
                        }`}
                      >
                        {client.status.toUpperCase()}
                      </span>

                      <button
                        onClick={() => openEditModal(client)}
                        className="p-1.5 text-white/50 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
                        title="Edit Client Details"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={async () => {
                          if (clientProposals.length > 0) {
                            if (!window.confirm(`Warning: ${client.company} has ${clientProposals.length} proposals linked. Force delete?`)) {
                              return;
                            }
                          } else if (!window.confirm(`Delete client record for ${client.company}?`)) {
                            return;
                          }
                          await deleteClient(client.id);
                        }}
                        className="p-1.5 text-white/50 hover:text-rose-400 rounded-lg hover:bg-white/10 transition-colors"
                        title="Delete Client"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Contact Info Strip */}
                  <div className="mt-4 space-y-2 text-xs font-mono text-[#A7A9AC]">
                    <div className="flex items-center gap-2.5">
                      <Mail className="w-3.5 h-3.5 text-[#FF4D00] shrink-0" />
                      <a href={`mailto:${client.email}`} className="hover:text-white hover:underline truncate">
                        {client.email}
                      </a>
                    </div>
                    {client.phone && (
                      <div className="flex items-center gap-2.5">
                        <Phone className="w-3.5 h-3.5 text-[#FF4D00] shrink-0" />
                        <span>{client.phone}</span>
                      </div>
                    )}
                    {client.website && (
                      <div className="flex items-center gap-2.5">
                        <Globe className="w-3.5 h-3.5 text-[#FF4D00] shrink-0" />
                        <a
                          href={client.website}
                          target="_blank"
                          rel="noreferrer"
                          className="hover:text-white hover:underline truncate"
                        >
                          {client.website.replace('https://', '')}
                        </a>
                      </div>
                    )}
                  </div>

                  {client.notes && (
                    <p className="mt-4 p-3 rounded-2xl bg-[#0c0d0f] border border-white/5 text-[11px] font-mono text-[#A7A9AC] leading-relaxed">
                      {client.notes}
                    </p>
                  )}

                  {/* Client Proposal History Strip */}
                  {clientProposals.length > 0 && (
                    <div className="mt-5 pt-4 border-t border-white/10 space-y-2.5">
                      <div className="flex items-center justify-between text-[10px] font-mono text-white/50 uppercase tracking-widest">
                        <span>Proposal Specifications ({clientProposals.length})</span>
                        <span className="text-white font-bold">Total: {formatCurrency(clientQuoted)}</span>
                      </div>
                      <div className="space-y-1.5 max-h-36 overflow-y-auto">
                        {clientProposals.map((p) => (
                          <div
                            key={p.id}
                            onClick={() => navigate(`/editor/${p.id}`)}
                            className="p-2.5 rounded-xl border border-white/5 bg-[#0c0d0f] hover:border-[#FF4D00]/40 cursor-pointer transition-colors flex items-center justify-between text-xs font-mono"
                          >
                            <div className="min-w-0 pr-3">
                              <p className="font-semibold text-white truncate">{p.title}</p>
                              <p className="text-[10px] text-white/40">{new Date(p.createdAt).toLocaleDateString()}</p>
                            </div>
                            <div className="text-right shrink-0">
                              <span className="font-bold text-white block">
                                {formatCurrency(p.totalBudget)}
                              </span>
                              <span className="text-[10px] text-[#A7A9AC] uppercase">
                                {p.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Quick Action: Draft Proposal */}
                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-white/40">
                    ID: {client.id}
                  </span>

                  <button
                    onClick={() => navigate(`/generator?clientId=${client.id}`)}
                    className="group inline-flex items-center gap-2 text-xs font-display font-semibold text-[#FF4D00] hover:text-white transition-colors"
                  >
                    <span>Draft Proposal for Client</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
      </main>

      {/* Add / Edit Client Modal */}
      {clientModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-6">
          <div className="bg-[#15161A] border border-white/15 rounded-3xl p-8 max-w-lg w-full shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="font-display text-lg font-bold uppercase text-white tracking-tight">
                {editingClient ? 'Edit Client Record' : 'Create Client Record'}
              </h3>
              <button
                onClick={() => setClientModalOpen(false)}
                className="p-1.5 rounded-lg text-white/50 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveClient} className="space-y-4 font-mono text-xs">
              <div>
                <label className="block text-[#A7A9AC] uppercase mb-1.5">Primary Contact Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rachel Adams"
                  className="w-full py-2.5 px-3.5 rounded-xl border border-white/10 bg-[#0c0d0f] text-white focus:border-[#FF4D00] outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[#A7A9AC] uppercase mb-1.5">Company Name</label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. NextWave Therapeutics"
                  className="w-full py-2.5 px-3.5 rounded-xl border border-white/10 bg-[#0c0d0f] text-white focus:border-[#FF4D00] outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#A7A9AC] uppercase mb-1.5">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="contact@company.com"
                    className="w-full py-2.5 px-3.5 rounded-xl border border-white/10 bg-[#0c0d0f] text-white focus:border-[#FF4D00] outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-[#A7A9AC] uppercase mb-1.5">Phone Number</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 555-0199"
                    className="w-full py-2.5 px-3.5 rounded-xl border border-white/10 bg-[#0c0d0f] text-white focus:border-[#FF4D00] outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#A7A9AC] uppercase mb-1.5">Website</label>
                  <input
                    type="text"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://company.com"
                    className="w-full py-2.5 px-3.5 rounded-xl border border-white/10 bg-[#0c0d0f] text-white focus:border-[#FF4D00] outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-[#A7A9AC] uppercase mb-1.5">Lifecycle Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full py-2.5 px-3 rounded-xl border border-white/10 bg-[#0c0d0f] text-white focus:border-[#FF4D00] outline-hidden"
                  >
                    <option value="active">Active Client</option>
                    <option value="lead">Qualified Lead</option>
                    <option value="past">Past Project</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[#A7A9AC] uppercase mb-1.5">Private Account Notes</label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Key stakeholders, budget preferences, special billing requirements..."
                  className="w-full py-2.5 px-3.5 rounded-xl border border-white/10 bg-[#0c0d0f] text-white focus:border-[#FF4D00] outline-hidden leading-relaxed"
                />
              </div>

              <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setClientModalOpen(false)}
                  className="px-5 py-2.5 rounded-full border border-white/10 text-xs font-mono text-white hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-[#FF4D00] text-white font-display text-xs font-bold uppercase tracking-wider hover:bg-white hover:text-[#111111] transition-all shadow-lg shadow-[#FF4D00]/25"
                >
                  Save Client Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <BackendGuideModal isOpen={guideOpen} onClose={() => setGuideOpen(false)} />
    </div>
  );
};
