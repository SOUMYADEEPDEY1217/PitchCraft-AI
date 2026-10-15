import { describe, it, expect, beforeEach } from 'vitest';
import './setup';
import { storage } from '../services/storage';
import { Proposal, Client } from '../types';

describe('PitchCraft AI - Storage Service (Zero-Demo Multi-User Baseline)', () => {
  beforeEach(() => {
    localStorage.clear();
    storage.resetAllData();
  });

  it('starts new workspaces with 0 proposals and 0 clients (Phase 1 clean state)', () => {
    const proposals = storage.getProposals();
    expect(proposals).toBeDefined();
    expect(Array.isArray(proposals)).toBe(true);
    expect(proposals.length).toBe(0);

    const clients = storage.getClients();
    expect(clients).toBeDefined();
    expect(Array.isArray(clients)).toBe(true);
    expect(clients.length).toBe(0);
  });

  it('saves and retrieves a new user-owned proposal', () => {
    const newProp: Proposal = {
      id: 'prop-test-9999',
      title: 'Enterprise AI Agent Integration',
      clientName: 'Acme Global Corp',
      clientCompany: 'Acme Global',
      clientEmail: 'contact@acme.com',
      industry: 'Technology',
      serviceCategory: 'full_stack',
      currency: 'USD',
      totalBudget: 25000,
      deadline: '2026-12-01',
      tone: 'technical',
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      executiveSummary: 'Full stack AI agent integration blueprint',
      objectives: ['Deploy agent runtime', 'Secure API gateway'],
      proposedSolution: 'Event-driven microservices architecture',
      deliverables: ['Custom LLM orchestrator', 'Admin console'],
      scopeIncluded: ['API integrations', 'Testing suite'],
      scopeExcluded: ['Hardware hosting'],
      timelineSummary: '6 Weeks total implementation',
      milestones: [
        {
          id: 'm1',
          title: 'Architecture Blueprint',
          description: 'Blueprint & technical specs',
          duration: '2 Weeks',
          amount: 10000,
          deliverables: ['System specification'],
        },
      ],
      pricingItems: [
        {
          id: 'p1',
          description: 'Architecture & Engine Build',
          hoursOrUnits: 80,
          rate: 150,
          total: 12000,
        },
      ],
      pricingNotes: 'All rates fixed for 60 days',
      paymentTerms: '50% deposit, 50% on completion',
      clientResponsibilities: ['Provide server access'],
      termsAndConditions: 'All rights assigned upon final payment',
      callToAction: 'Accept proposal to reserve sprint',
      viewCount: 0,
    };

    storage.saveProposal(newProp);
    const retrieved = storage.getProposal('prop-test-9999');
    expect(retrieved).toBeDefined();
    expect(retrieved?.title).toBe('Enterprise AI Agent Integration');
    expect(retrieved?.totalBudget).toBe(25000);
    expect(retrieved?.clientName).toBe('Acme Global Corp');
    expect(storage.getProposals().length).toBe(1);
  });

  it('updates an existing proposal without duplicating', () => {
    const initialProp: Proposal = {
      id: 'prop-orig-101',
      title: 'Initial Contract Proposal',
      clientName: 'Client Alpha',
      industry: 'Technology',
      serviceCategory: 'full_stack',
      currency: 'USD',
      totalBudget: 12000,
      deadline: '2026-12-01',
      tone: 'consultative',
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      executiveSummary: 'Initial summary',
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
    };

    storage.saveProposal(initialProp);
    expect(storage.getProposals().length).toBe(1);

    const updated: Proposal = {
      ...initialProp,
      title: 'Updated Title By QA Test',
      totalBudget: 45000,
      status: 'in_review',
    };

    storage.saveProposal(updated);
    const refreshedList = storage.getProposals();
    expect(refreshedList.length).toBe(1);

    const fetched = storage.getProposal('prop-orig-101');
    expect(fetched?.title).toBe('Updated Title By QA Test');
    expect(fetched?.totalBudget).toBe(45000);
    expect(fetched?.status).toBe('in_review');
  });

  it('deletes a proposal successfully', () => {
    const tempProp: Proposal = {
      id: 'prop-to-delete',
      title: 'Disposable Proposal',
      clientName: 'Test Target',
      industry: 'Technology',
      serviceCategory: 'web_development',
      currency: 'USD',
      totalBudget: 5000,
      deadline: '2026-12-01',
      tone: 'casual',
      status: 'draft',
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
    };

    storage.saveProposal(tempProp);
    expect(storage.getProposal('prop-to-delete')).toBeDefined();

    const result = storage.deleteProposal('prop-to-delete');
    expect(result).toBe(true);
    expect(storage.getProposal('prop-to-delete')).toBeUndefined();
    expect(storage.getProposals().length).toBe(0);
  });

  it('duplicates a proposal with correct reset metadata', () => {
    const seedProp: Proposal = {
      id: 'prop-seed-master',
      title: 'FinTech Platform Spec',
      clientName: 'Apex Capital',
      industry: 'Finance',
      serviceCategory: 'full_stack',
      currency: 'USD',
      totalBudget: 30000,
      deadline: '2026-12-31',
      tone: 'executive',
      status: 'accepted',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      executiveSummary: 'Master blueprint',
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
      viewCount: 4,
      lastViewedAt: '2026-10-10T12:00:00Z',
    };

    storage.saveProposal(seedProp);
    const duplicate = storage.duplicateProposal('prop-seed-master');
    expect(duplicate).not.toBeNull();
    expect(duplicate?.id).not.toBe('prop-seed-master');
    expect(duplicate?.title).toBe('FinTech Platform Spec (Copy)');
    expect(duplicate?.status).toBe('draft');
    expect(duplicate?.viewCount).toBe(0);
    expect(duplicate?.lastViewedAt).toBeUndefined();

    // Verify it is saved in storage alongside the original
    const proposals = storage.getProposals();
    expect(proposals.length).toBe(2);
  });

  it('returns null when attempting to duplicate non-existent proposal', () => {
    const duplicate = storage.duplicateProposal('non-existent-id-000');
    expect(duplicate).toBeNull();
  });

  it('manages clients correctly', () => {
    expect(storage.getClients().length).toBe(0);

    const testClient: Client = {
      id: 'cli-test-qa',
      name: 'Sarah Connor',
      company: 'Cyberdyne Systems',
      email: 'sconnor@cyberdyne.io',
      phone: '+1 555-0199',
      industry: 'Technology',
      status: 'active',
      totalQuoted: 35000,
      totalPaid: 15000,
      proposalsCount: 2,
      createdAt: new Date().toISOString(),
    };

    storage.saveClient(testClient);
    const fetched = storage.getClient('cli-test-qa');
    expect(fetched).toBeDefined();
    expect(fetched?.name).toBe('Sarah Connor');
    expect(fetched?.company).toBe('Cyberdyne Systems');
    expect(storage.getClients().length).toBe(1);

    storage.deleteClient('cli-test-qa');
    expect(storage.getClient('cli-test-qa')).toBeUndefined();
    expect(storage.getClients().length).toBe(0);
  });

  it('handles backup export and valid import JSON', () => {
    const exportedJson = storage.exportBackupJson();
    expect(exportedJson).toBeDefined();
    const parsed = JSON.parse(exportedJson);
    expect(parsed.version).toBe('1.0');
    expect(Array.isArray(parsed.proposals)).toBe(true);
    expect(Array.isArray(parsed.clients)).toBe(true);
    expect(parsed.settings).toBeDefined();

    const importSuccess = storage.importBackupJson(exportedJson);
    expect(importSuccess).toBe(true);
  });

  it('rejects invalid backup JSON gracefully without crashing', () => {
    const invalidJson = 'invalid { json: broken';
    const importSuccess = storage.importBackupJson(invalidJson);
    expect(importSuccess).toBe(false);
  });
});
