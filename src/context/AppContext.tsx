import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Proposal, Client, AppSettings, BackendStatus, Currency } from '../types';
import { storage } from '../services/storage';
import { api } from '../services/api';
import { useAuth } from './AuthContext';
import {
  saveUserProposalToFirestore,
  getUserProposalsFromFirestore,
  deleteUserProposalFromFirestore,
  saveUserClientToFirestore,
  getUserClientsFromFirestore,
  deleteUserClientFromFirestore,
  updateUserProfile,
} from '../services/firebase';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

interface AppContextType {
  proposals: Proposal[];
  clients: Client[];
  settings: AppSettings;
  backendStatus: BackendStatus;
  isLoading: boolean;
  theme: 'light' | 'dark';
  toasts: Toast[];
  toggleTheme: () => void;
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  removeToast: (id: string) => void;
  refreshData: () => Promise<void>;
  saveProposal: (proposal: Proposal) => Promise<Proposal>;
  deleteProposal: (id: string) => Promise<boolean>;
  duplicateProposal: (id: string) => Proposal | null;
  saveClient: (client: Client) => Promise<Client>;
  deleteClient: (id: string) => Promise<boolean>;
  saveSettings: (settings: AppSettings) => void;
  generateProposal: (params: Parameters<typeof api.generateProposal>[0]) => Promise<Proposal>;
  currencySymbol: (currency?: Currency) => string;
  formatCurrency: (value: number, currency?: Currency) => string;
  checkBackendStatus: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, userProfile } = useAuth();
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [settings, setSettingsState] = useState<AppSettings>(storage.getSettings());
  const [backendStatus, setBackendStatus] = useState<BackendStatus>({
    isConnected: false,
    mode: 'local_demo',
    serverUrl: settings.fastApiUrl,
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Sync settings when userProfile changes
  useEffect(() => {
    if (userProfile) {
      setSettingsState((prev) => {
        const updated = {
          ...prev,
          freelancerName: userProfile.displayName || prev.freelancerName,
          freelancerEmail: userProfile.email || prev.freelancerEmail,
          agencyName: userProfile.agencyName || prev.agencyName,
          defaultHourlyRate: userProfile.hourlyRate ?? prev.defaultHourlyRate,
          defaultCurrency: (userProfile.currency as Currency) || prev.defaultCurrency,
        };
        storage.saveSettings(updated);
        return updated;
      });
    }
  }, [userProfile]);

  const showToast = useCallback((message: string, type: 'success' | 'info' | 'error' = 'info') => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Theme application
  useEffect(() => {
    const savedTheme = settings.theme || 'light';
    setTheme(savedTheme);
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.theme]);

  const toggleTheme = () => {
    const nextTheme: 'light' | 'dark' = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    const updated: AppSettings = { ...settings, theme: nextTheme };
    setSettingsState(updated);
    storage.saveSettings(updated);
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    showToast(`Switched to ${nextTheme} mode`, 'info');
  };

  const checkBackendStatus = useCallback(async () => {
    const status = await api.checkBackendHealth();
    setBackendStatus(status);
  }, []);

  const refreshData = useCallback(async () => {
    setIsLoading(true);
    try {
      if (user) {
        // Load user's private data from Firestore with strict account isolation
        try {
          const [cloudProposals, cloudClients] = await Promise.all([
            getUserProposalsFromFirestore(user.uid),
            getUserClientsFromFirestore(user.uid),
          ]);

          setProposals(cloudProposals || []);
          setClients(cloudClients || []);
        } catch (cloudErr) {
          console.warn('Cloud sync error, falling back to local isolated storage:', cloudErr);
          setProposals(storage.getProposals());
          setClients(storage.getClients());
        }
      } else {
        // Unauthenticated guests see clean empty workspace
        setProposals([]);
        setClients([]);
      }
      await checkBackendStatus();
    } catch {
      setProposals([]);
      setClients([]);
    } finally {
      setIsLoading(false);
    }
  }, [user, checkBackendStatus]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const saveProposal = async (proposal: Proposal): Promise<Proposal> => {
    const saved = await api.saveProposal(proposal);
    if (user) {
      try {
        await saveUserProposalToFirestore(user.uid, saved);
      } catch (err) {
        console.warn('Firestore proposal sync warning:', err);
      }
    }
    setProposals((prev) => {
      const idx = prev.findIndex((p) => p.id === saved.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = saved;
        return copy;
      }
      return [saved, ...prev];
    });
    showToast(`Proposal "${saved.title}" saved`, 'success');
    return saved;
  };

  const deleteProposal = async (id: string): Promise<boolean> => {
    await api.deleteProposal(id);
    if (user) {
      try {
        await deleteUserProposalFromFirestore(user.uid, id);
      } catch (err) {
        console.warn('Firestore proposal delete warning:', err);
      }
    }
    setProposals((prev) => prev.filter((p) => p.id !== id));
    showToast('Proposal deleted', 'info');
    return true;
  };


  const duplicateProposal = (id: string): Proposal | null => {
    const original = proposals.find((p) => p.id === id) || storage.getProposal(id);
    if (!original) return null;
    const duplicated: Proposal = {
      ...original,
      id: `prop-${Date.now().toString().slice(-4)}`,
      title: `${original.title} (Copy)`,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      viewCount: 0,
      lastViewedAt: undefined,
    };
    storage.saveProposal(duplicated);
    if (user) {
      saveUserProposalToFirestore(user.uid, duplicated).catch((err) =>
        console.warn('Firestore duplicate sync warning:', err)
      );
    }
    setProposals((prev) => [duplicated, ...prev]);
    showToast(`Duplicated "${duplicated.title}"`, 'success');
    return duplicated;
  };

  const saveClient = async (client: Client): Promise<Client> => {
    const saved = await api.saveClient(client);
    if (user) {
      try {
        await saveUserClientToFirestore(user.uid, saved);
      } catch (err) {
        console.warn('Firestore client sync warning:', err);
      }
    }
    setClients((prev) => {
      const idx = prev.findIndex((c) => c.id === saved.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = saved;
        return copy;
      }
      return [saved, ...prev];
    });
    showToast(`Client "${saved.name}" saved`, 'success');
    return saved;
  };

  const deleteClient = async (id: string): Promise<boolean> => {
    await api.deleteClient(id);
    if (user) {
      try {
        await deleteUserClientFromFirestore(user.uid, id);
      } catch (err) {
        console.warn('Firestore client delete warning:', err);
      }
    }
    setClients((prev) => prev.filter((c) => c.id !== id));
    showToast('Client deleted', 'info');
    return true;
  };

  const saveSettings = (newSettings: AppSettings) => {
    setSettingsState(newSettings);
    storage.saveSettings(newSettings);
    api.updateConfig(newSettings);
    if (user) {
      try {
        updateUserProfile(user.uid, {
          displayName: newSettings.freelancerName,
          email: newSettings.freelancerEmail,
          agencyName: newSettings.agencyName,
          hourlyRate: newSettings.defaultHourlyRate,
          currency: newSettings.defaultCurrency,
        });
      } catch (err) {
        console.warn('Firestore profile settings sync warning:', err);
      }
    }
    showToast('Settings updated', 'success');
    checkBackendStatus();
  };

  const generateProposal = async (params: Parameters<typeof api.generateProposal>[0]): Promise<Proposal> => {
    const generated = await api.generateProposal(params);
    if (user) {
      try {
        await saveUserProposalToFirestore(user.uid, generated);
      } catch (err) {
        console.warn('Firestore proposal sync warning for generated proposal:', err);
      }
    }
    setProposals((prev) => [generated, ...prev]);
    showToast(`Proposal "${generated.title}" generated!`, 'success');
    return generated;
  };

  const currencySymbol = (currency?: Currency): string => {
    const curr = currency || settings.defaultCurrency || 'USD';
    switch (curr) {
      case 'USD': return '$';
      case 'EUR': return '€';
      case 'GBP': return '£';
      case 'CAD': return 'CA$';
      case 'AUD': return 'AU$';
      case 'INR': return '₹';
      default: return '$';
    }
  };

  const formatCurrency = (value: number, currency?: Currency): string => {
    const symbol = currencySymbol(currency);
    return `${symbol}${value.toLocaleString()}`;
  };

  return (
    <AppContext.Provider
      value={{
        proposals,
        clients,
        settings,
        backendStatus,
        isLoading,
        theme,
        toasts,
        toggleTheme,
        showToast,
        removeToast,
        refreshData,
        saveProposal,
        deleteProposal,
        duplicateProposal,
        saveClient,
        deleteClient,
        saveSettings,
        generateProposal,
        currencySymbol,
        formatCurrency,
        checkBackendStatus,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
