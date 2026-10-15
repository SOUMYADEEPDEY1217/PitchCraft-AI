import { Proposal, Client, AppSettings } from '../types';
import { initialProposals, initialClients, defaultSettings } from '../data/sampleData';

const PROPOSALS_KEY = 'pitchcraft_proposals';
const CLIENTS_KEY = 'pitchcraft_clients';
const SETTINGS_KEY = 'pitchcraft_settings';

const deepClone = <T>(val: T): T => JSON.parse(JSON.stringify(val));

export const storage = {
  getProposals(): Proposal[] {
    try {
      const data = localStorage.getItem(PROPOSALS_KEY);
      if (!data) {
        return [];
      }
      return JSON.parse(data);
    } catch {
      return [];
    }
  },

  getProposal(id: string): Proposal | undefined {
    const list = this.getProposals();
    return list.find((p) => p.id === id);
  },

  saveProposal(proposal: Proposal): Proposal {
    const list = this.getProposals();
    const index = list.findIndex((p) => p.id === proposal.id);
    if (index >= 0) {
      list[index] = { ...proposal, updatedAt: new Date().toISOString() };
    } else {
      list.unshift({ ...proposal, createdAt: proposal.createdAt || new Date().toISOString(), updatedAt: new Date().toISOString() });
    }
    localStorage.setItem(PROPOSALS_KEY, JSON.stringify(list));
    return proposal;
  },

  deleteProposal(id: string): boolean {
    const list = this.getProposals();
    const filtered = list.filter((p) => p.id !== id);
    localStorage.setItem(PROPOSALS_KEY, JSON.stringify(filtered));
    return true;
  },

  duplicateProposal(id: string): Proposal | null {
    const original = this.getProposal(id);
    if (!original) return null;
    const copy: Proposal = {
      ...original,
      id: `prop-${Date.now().toString().slice(-4)}`,
      title: `${original.title} (Copy)`,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      viewCount: 0,
      lastViewedAt: undefined,
    };
    this.saveProposal(copy);
    return copy;
  },

  getClients(): Client[] {
    try {
      const data = localStorage.getItem(CLIENTS_KEY);
      if (!data) {
        return [];
      }
      return JSON.parse(data);
    } catch {
      return [];
    }
  },

  getClient(id: string): Client | undefined {
    const list = this.getClients();
    return list.find((c) => c.id === id);
  },

  saveClient(client: Client): Client {
    const list = this.getClients();
    const index = list.findIndex((c) => c.id === client.id);
    if (index >= 0) {
      list[index] = client;
    } else {
      list.unshift({ ...client, createdAt: client.createdAt || new Date().toISOString() });
    }
    localStorage.setItem(CLIENTS_KEY, JSON.stringify(list));
    return client;
  },

  deleteClient(id: string): boolean {
    const list = this.getClients();
    const filtered = list.filter((c) => c.id !== id);
    localStorage.setItem(CLIENTS_KEY, JSON.stringify(filtered));
    return true;
  },

  getSettings(): AppSettings {
    try {
      const data = localStorage.getItem(SETTINGS_KEY);
      if (!data) {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(defaultSettings));
        return deepClone(defaultSettings);
      }
      return { ...defaultSettings, ...JSON.parse(data) };
    } catch {
      return deepClone(defaultSettings);
    }
  },

  saveSettings(settings: AppSettings): AppSettings {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    return settings;
  },

  resetAllData(): void {
    localStorage.setItem(PROPOSALS_KEY, JSON.stringify([]));
    localStorage.setItem(CLIENTS_KEY, JSON.stringify([]));
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(deepClone(defaultSettings)));
  },

  exportBackupJson(): string {
    const bundle = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      proposals: this.getProposals(),
      clients: this.getClients(),
      settings: this.getSettings(),
    };
    return JSON.stringify(bundle, null, 2);
  },

  importBackupJson(jsonString: string): boolean {
    try {
      const parsed = JSON.parse(jsonString);
      if (Array.isArray(parsed.proposals)) {
        localStorage.setItem(PROPOSALS_KEY, JSON.stringify(parsed.proposals));
      }
      if (Array.isArray(parsed.clients)) {
        localStorage.setItem(CLIENTS_KEY, JSON.stringify(parsed.clients));
      }
      if (parsed.settings && typeof parsed.settings === 'object') {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(parsed.settings));
      }
      return true;
    } catch {
      return false;
    }
  },
};
