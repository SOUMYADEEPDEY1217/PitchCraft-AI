import { describe, it, expect, beforeEach } from 'vitest';
import './setup';
import { ApiService } from '../services/api';
import { storage } from '../services/storage';
import { Proposal } from '../types';

describe('PitchCraft AI - ApiService & Offline Fallback', () => {
  let api: ApiService;

  beforeEach(() => {
    localStorage.clear();
    storage.resetAllData();
    api = new ApiService();
  });

  it('initializes with default backend and Ollama URLs', () => {
    expect(api.getApiUrl()).toBeDefined();
    expect(api.getOllamaUrl()).toBeDefined();
    expect(api.isOnline()).toBe(false);
  });

  it('gracefully detects offline backend and activates Local Studio Mode', async () => {
    const status = await api.checkBackendHealth();
    expect(status.mode).toBe('local_demo');
    expect(status.isConnected).toBe(false);
    expect(status.errorMessage).toContain('FastAPI backend is offline');
  });

  it('fetches proposals via local fallback when backend is offline with zero-demo baseline', async () => {
    const proposals = await api.getProposals();
    expect(Array.isArray(proposals)).toBe(true);
    expect(proposals.length).toBe(0);
  });

  it('fetches clients via local fallback when backend is offline with zero-demo baseline', async () => {
    const clients = await api.getClients();
    expect(Array.isArray(clients)).toBe(true);
    expect(clients.length).toBe(0);
  });

  it('computes dashboard statistics accurately in offline mode', async () => {
    const initialStats = await api.getDashboardStats();
    expect(initialStats).toBeDefined();
    expect(initialStats.total_proposals).toBe(0);
    expect(initialStats.total_quoted_value).toBe(0);
    expect(initialStats.win_rate_percent).toBe(0);

    // Save a proposal and verify stats recompute dynamically
    await api.saveProposal({
      id: 'prop-stats-1',
      title: 'Quotation Engine Test',
      clientName: 'Test Client',
      industry: 'Technology',
      serviceCategory: 'full_stack',
      currency: 'USD',
      totalBudget: 15000,
      deadline: '2026-12-01',
      tone: 'consultative',
      status: 'accepted',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      executiveSummary: '',
      objectives: [],
      proposedSolution: '',
      deliverables: [],
      scopeIncluded: [],
      scopeExcluded: [],
      timelineSummary: '',
      milestones: [],
      pricingItems: [],
      pricingNotes: '',
      paymentTerms: '',
      clientResponsibilities: [],
      termsAndConditions: '',
      callToAction: '',
      viewCount: 0,
    });

    const updatedStats = await api.getDashboardStats();
    expect(updatedStats.total_proposals).toBe(1);
    expect(updatedStats.total_quoted_value).toBe(15000);
    expect(updatedStats.win_rate_percent).toBe(100);
  });

  it('saves proposal locally in offline mode', async () => {
    const testProp: Proposal = {
      id: 'prop-offline-qa',
      title: 'QA Offline Proposal Test',
      clientName: 'Local Test Client',
      industry: 'Technology',
      serviceCategory: 'web_development',
      currency: 'USD',
      totalBudget: 9500,
      deadline: '2026-11-01',
      tone: 'casual',
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      executiveSummary: 'Local execution spec',
      objectives: ['Test fallback storage'],
      proposedSolution: 'Local storage caching',
      deliverables: ['Offline proposal'],
      scopeIncluded: ['Standard scope'],
      scopeExcluded: [],
      timelineSummary: '2 weeks',
      milestones: [],
      pricingItems: [],
      pricingNotes: '',
      paymentTerms: '100% on delivery',
      clientResponsibilities: [],
      termsAndConditions: 'Standard terms',
      callToAction: 'Sign off',
      viewCount: 0,
    };

    const saved = await api.saveProposal(testProp);
    expect(saved.id).toBe('prop-offline-qa');

    const fetched = await api.getProposal('prop-offline-qa');
    expect(fetched).toBeDefined();
    expect(fetched?.title).toBe('QA Offline Proposal Test');
  });
});
