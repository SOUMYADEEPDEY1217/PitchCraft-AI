import axios, { AxiosError } from 'axios';
import {
  Proposal,
  Client,
  BackendStatus,
  AppSettings,
  CoverLetterRequest,
  FollowUpRequest,
  ProposalImprovementRequest,
  PricingCalculation,
} from '../types';
import { storage } from './storage';
import { aiGenerator } from './aiGenerator';

const DEFAULT_API_URL = import.meta.env.VITE_API_URL || '';
const DEFAULT_OLLAMA_URL = import.meta.env.VITE_OLLAMA_URL || 'http://localhost:11434';

export interface DashboardStats {
  total_proposals: number;
  draft_count: number;
  sent_count: number;
  in_review_count: number;
  accepted_count: number;
  declined_count: number;
  total_quoted_value: number;
  total_won_value: number;
  win_rate_percent: number;
  active_pipeline_count: number;
  clients_count: number;
  monthly_data: Array<{ month: string; quoted: number; won: number }>;
}

export class ApiService {
  private apiUrl: string;
  private ollamaUrl: string;
  private isBackendOnline: boolean = false;

  constructor() {
    const settings = storage.getSettings();
    const isBrowser = typeof window !== 'undefined';
    const isCloudHosted = isBrowser && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
    const configuredUrl = settings.fastApiUrl;

    if (isCloudHosted && configuredUrl && (configuredUrl.includes('localhost') || configuredUrl.includes('127.0.0.1'))) {
      this.apiUrl = import.meta.env.VITE_API_URL || '';
    } else {
      this.apiUrl = configuredUrl || DEFAULT_API_URL;
    }
    this.ollamaUrl = settings.ollamaUrl || DEFAULT_OLLAMA_URL;
  }

  public updateConfig(settings: AppSettings) {
    const isBrowser = typeof window !== 'undefined';
    const isCloudHosted = isBrowser && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
    const configuredUrl = settings.fastApiUrl;

    if (isCloudHosted && configuredUrl && (configuredUrl.includes('localhost') || configuredUrl.includes('127.0.0.1'))) {
      this.apiUrl = import.meta.env.VITE_API_URL || '';
    } else {
      this.apiUrl = configuredUrl || DEFAULT_API_URL;
    }
    this.ollamaUrl = settings.ollamaUrl || DEFAULT_OLLAMA_URL;
  }

  public getApiUrl(): string {
    return this.apiUrl;
  }

  public getOllamaUrl(): string {
    return this.ollamaUrl;
  }

  public isOnline(): boolean {
    return this.isBackendOnline;
  }

  private handleError(err: unknown, defaultMessage: string): never {
    if (axios.isAxiosError(err)) {
      const axiosErr = err as AxiosError<{ error?: { message?: string } }>;
      const serverMsg = axiosErr.response?.data?.error?.message;
      if (serverMsg) {
        throw new Error(serverMsg);
      }
    }
    throw new Error(defaultMessage);
  }

  /**
   * Health check for FastAPI backend: GET /api/health
   */
  async checkBackendHealth(): Promise<BackendStatus> {
    const startTime = Date.now();
    try {
      const response = await axios.get(`${this.apiUrl}/api/health`, { timeout: 2000 });
      const latencyMs = Date.now() - startTime;
      if (response.status === 200) {
        this.isBackendOnline = true;
        return {
          isConnected: true,
          mode: 'fastapi',
          serverUrl: this.apiUrl,
          latencyMs,
          modelName: response.data?.service || 'FastAPI Service',
        };
      }
    } catch {
      // Backend not running
    }

    this.isBackendOnline = false;
    return {
      isConnected: false,
      mode: 'local_demo',
      serverUrl: this.apiUrl,
      errorMessage: 'FastAPI backend is offline. Local Studio Mode is active.',
    };
  }

  /**
   * Health check for Ollama local inference: GET /api/ai/health
   */
  async checkAiHealth(): Promise<{ isConnected: boolean; models: string[]; latencyMs?: number; message?: string }> {
    if (this.isBackendOnline) {
      try {
        const res = await axios.get(`${this.apiUrl}/api/ai/health`, { timeout: 2500 });
        return {
          isConnected: res.data?.is_connected || false,
          models: res.data?.available_models || [],
          latencyMs: res.data?.latency_ms,
          message: res.data?.message,
        };
      } catch {
        // Fall back to direct check
      }
    }

    const startTime = Date.now();
    try {
      const res = await axios.get(`${this.ollamaUrl}/api/tags`, { timeout: 1500 });
      const latencyMs = Date.now() - startTime;
      const models = Array.isArray(res.data?.models) ? res.data.models.map((m: { name: string }) => m.name) : [];
      return { isConnected: true, models, latencyMs, message: `Connected directly to Ollama at ${this.ollamaUrl}` };
    } catch {
      return { isConnected: false, models: [], message: 'Ollama server is not running.' };
    }
  }

  async checkOllamaHealth() {
    return this.checkAiHealth();
  }

  // --- Clients CRM API ---
  async getClients(search?: string, statusFilter?: string): Promise<Client[]> {
    if (this.isBackendOnline) {
      try {
        const params: Record<string, string> = {};
        if (search) params.search = search;
        if (statusFilter && statusFilter !== 'all') params.status = statusFilter;

        const res = await axios.get(`${this.apiUrl}/api/clients`, { params, timeout: 4000 });
        if (Array.isArray(res.data)) {
          return res.data;
        }
      } catch (err) {
        this.handleError(err, 'Failed to fetch clients from backend API.');
      }
    }

    // Explicit fallback to local storage
    return storage.getClients();
  }

  async getClient(id: string): Promise<Client | undefined> {
    if (this.isBackendOnline) {
      try {
        const res = await axios.get(`${this.apiUrl}/api/clients/${id}`, { timeout: 4000 });
        if (res.data?.id) return res.data;
      } catch (err) {
        this.handleError(err, `Failed to load client ${id}.`);
      }
    }
    return storage.getClient(id);
  }

  async saveClient(client: Client): Promise<Client> {
    // If backend is online, persist via API
    if (this.isBackendOnline) {
      try {
        const existing = storage.getClient(client.id);
        let res;
        if (existing) {
          res = await axios.put(`${this.apiUrl}/api/clients/${client.id}`, client, { timeout: 4000 });
        } else {
          res = await axios.post(`${this.apiUrl}/api/clients`, client, { timeout: 4000 });
        }
        if (res.data?.id) {
          storage.saveClient(res.data);
          return res.data;
        }
      } catch (err) {
        this.handleError(err, `Failed to save client: ${err instanceof Error ? err.message : 'Unknown error'}`);
      }
    }

    // Local Studio mode
    storage.saveClient(client);
    return client;
  }

  async deleteClient(id: string): Promise<boolean> {
    if (this.isBackendOnline) {
      try {
        await axios.delete(`${this.apiUrl}/api/clients/${id}`, { timeout: 4000 });
      } catch (err) {
        this.handleError(err, `Failed to delete client ${id} on backend.`);
      }
    }
    storage.deleteClient(id);
    return true;
  }

  // --- Proposals API ---
  async getProposals(search?: string, statusFilter?: string, category?: string): Promise<Proposal[]> {
    if (this.isBackendOnline) {
      try {
        const params: Record<string, string> = {};
        if (search) params.search = search;
        if (statusFilter && statusFilter !== 'all') params.status = statusFilter;
        if (category && category !== 'all') params.service_category = category;

        const res = await axios.get(`${this.apiUrl}/api/proposals`, { params, timeout: 4000 });
        if (Array.isArray(res.data)) {
          return res.data;
        }
      } catch (err) {
        this.handleError(err, 'Failed to fetch proposals from backend API.');
      }
    }

    return storage.getProposals();
  }

  async getProposal(id: string): Promise<Proposal | undefined> {
    if (this.isBackendOnline) {
      try {
        const res = await axios.get(`${this.apiUrl}/api/proposals/${id}`, { timeout: 4000 });
        if (res.data?.id) return res.data;
      } catch (err) {
        this.handleError(err, `Failed to load proposal ${id}.`);
      }
    }
    return storage.getProposal(id);
  }

  async saveProposal(proposal: Proposal): Promise<Proposal> {
    const propToSave: Proposal = {
      ...proposal,
      id: proposal.id || `prop-${Date.now().toString().slice(-4)}`,
    };

    if (this.isBackendOnline) {
      try {
        const existing = storage.getProposal(propToSave.id);
        let res;
        if (existing) {
          res = await axios.put(`${this.apiUrl}/api/proposals/${propToSave.id}`, propToSave, { timeout: 4000 });
        } else {
          res = await axios.post(`${this.apiUrl}/api/proposals`, propToSave, { timeout: 4000 });
        }
        if (res.data?.id) {
          storage.saveProposal(res.data);
          return res.data;
        }
      } catch (err) {
        this.handleError(err, `Failed to save proposal on backend: ${err instanceof Error ? err.message : 'Unknown error'}`);
      }
    }

    storage.saveProposal(propToSave);
    return propToSave;
  }

  async updateProposalStatus(id: string, newStatus: string): Promise<Proposal> {
    if (this.isBackendOnline) {
      try {
        const res = await axios.patch(
          `${this.apiUrl}/api/proposals/${id}/status`,
          { status: newStatus },
          { timeout: 4000 }
        );
        if (res.data?.id) {
          storage.saveProposal(res.data);
          return res.data;
        }
      } catch (err) {
        this.handleError(err, `Failed to update proposal status on backend.`);
      }
    }

    const prop = storage.getProposal(id);
    if (prop) {
      prop.status = newStatus as any;
      storage.saveProposal(prop);
      return prop;
    }
    throw new Error('Proposal not found in storage.');
  }

  async deleteProposal(id: string): Promise<boolean> {
    if (this.isBackendOnline) {
      try {
        await axios.delete(`${this.apiUrl}/api/proposals/${id}`, { timeout: 4000 });
      } catch (err) {
        this.handleError(err, `Failed to delete proposal ${id} on backend.`);
      }
    }
    storage.deleteProposal(id);
    return true;
  }

  async downloadProposalPdf(id: string): Promise<void> {
    if (this.isBackendOnline) {
      try {
        const res = await axios.get(`${this.apiUrl}/api/proposals/${id}/pdf`, {
          responseType: 'blob',
          timeout: 10000,
        });
        const blob = new Blob([res.data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `proposal-${id}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
        return;
      } catch (err) {
        this.handleError(err, 'Failed to download PDF from backend service.');
      }
    }

    // If backend is offline, trigger window.print() formatted specifically for PDF
    window.print();
  }

  // --- Proposal Generation API ---
  async generateProposal(params: Parameters<typeof aiGenerator.generateProposal>[0]): Promise<Proposal> {
    if (this.isBackendOnline) {
      try {
        const res = await axios.post(`${this.apiUrl}/api/proposals/generate`, params, { timeout: 45000 });
        if (res.data?.id) {
          storage.saveProposal(res.data);
          return res.data;
        }
      } catch (err) {
        this.handleError(err, 'Backend proposal generation failed.');
      }
    }

    // Direct local synthesis fallback
    const proposal = await aiGenerator.generateProposal(params);
    storage.saveProposal(proposal);
    return proposal;
  }

  // --- Pricing Calculation API ---
  async calculatePricing(params: {
    hourlyRate: number;
    hoursByPhase: { discovery: number; design: number; development: number; qa: number; deployment: number };
    expenses: Array<{ id: string; name: string; amount: number }>;
    contingencyPercent: number;
    marginPercent: number;
  }): Promise<any> {
    if (this.isBackendOnline) {
      try {
        const res = await axios.post(`${this.apiUrl}/api/pricing/calculate`, params, { timeout: 3000 });
        if (res.data?.grand_total) {
          return res.data;
        }
      } catch (err) {
        // Fall back to client calculation
      }
    }

    const totalHours =
      params.hoursByPhase.discovery +
      params.hoursByPhase.design +
      params.hoursByPhase.development +
      params.hoursByPhase.qa +
      params.hoursByPhase.deployment;
    const baseLaborCost = totalHours * params.hourlyRate;
    const totalExpenses = params.expenses.reduce((sum, e) => sum + e.amount, 0);
    const subtotal = baseLaborCost + totalExpenses;
    const contingencyAmount = Math.round(subtotal * (params.contingencyPercent / 100));
    const subtotalContingency = subtotal + contingencyAmount;
    const marginAmount = Math.round(subtotalContingency * (params.marginPercent / 100));
    const grandTotal = subtotalContingency + marginAmount;

    return {
      total_hours: totalHours,
      base_labor_cost: baseLaborCost,
      total_expenses: totalExpenses,
      subtotal,
      contingency_amount: contingencyAmount,
      margin_amount: marginAmount,
      grand_total: grandTotal,
      effective_rate_per_hour: totalHours > 0 ? Math.round(grandTotal / totalHours) : params.hourlyRate,
      milestone_split: {
        deposit: Math.round(grandTotal * 0.4),
        midway: Math.round(grandTotal * 0.35),
        final: grandTotal - Math.round(grandTotal * 0.4) - Math.round(grandTotal * 0.35),
      },
    };
  }

  // --- Dashboard Stats API ---
  async getDashboardStats(): Promise<DashboardStats> {
    if (this.isBackendOnline) {
      try {
        const res = await axios.get(`${this.apiUrl}/api/dashboard/stats`, { timeout: 3000 });
        if (res.data?.total_proposals !== undefined) {
          return res.data;
        }
      } catch {
        // Fallback to client-computed stats below
      }
    }

    const proposals = storage.getProposals();
    const clients = storage.getClients();

    const draft_count = proposals.filter((p) => p.status === 'draft').length;
    const sent_count = proposals.filter((p) => p.status === 'sent').length;
    const in_review_count = proposals.filter((p) => p.status === 'in_review').length;
    const accepted_count = proposals.filter((p) => p.status === 'accepted').length;
    const declined_count = proposals.filter((p) => p.status === 'declined').length;

    const total_quoted_value = proposals.reduce((acc, p) => acc + (p.totalBudget || 0), 0);
    const total_won_value = proposals
      .filter((p) => p.status === 'accepted')
      .reduce((acc, p) => acc + (p.totalBudget || 0), 0);

    const win_rate_percent =
      proposals.length > 0 ? Math.round((accepted_count / proposals.length) * 100) : 0;

    return {
      total_proposals: proposals.length,
      draft_count,
      sent_count,
      in_review_count,
      accepted_count,
      declined_count,
      total_quoted_value,
      total_won_value,
      win_rate_percent,
      active_pipeline_count: draft_count + sent_count + in_review_count,
      clients_count: clients.length,
      monthly_data: [
        { month: 'Jun', quoted: Math.round(total_quoted_value * 0.15), won: Math.round(total_won_value * 0.1) },
        { month: 'Jul', quoted: Math.round(total_quoted_value * 0.2), won: Math.round(total_won_value * 0.18) },
        { month: 'Aug', quoted: Math.round(total_quoted_value * 0.25), won: Math.round(total_won_value * 0.22) },
        { month: 'Sep', quoted: Math.round(total_quoted_value * 0.2), won: Math.round(total_won_value * 0.25) },
        { month: 'Oct', quoted: Math.round(total_quoted_value * 0.2), won: Math.round(total_won_value * 0.25) },
      ],
    };
  }

  async getAiModels(): Promise<{ active_model: string; available_models: string[]; is_connected: boolean }> {
    if (this.isBackendOnline) {
      try {
        const res = await axios.get(`${this.apiUrl}/api/ai/models`, { timeout: 3000 });
        if (res.data) {
          return res.data;
        }
      } catch {
        // Fall back
      }
    }
    return { active_model: 'qwen3:4b', available_models: ['qwen3:4b'], is_connected: false };
  }

  async switchAiModel(model: string): Promise<{ active_model: string; available_models: string[]; is_connected: boolean }> {
    if (this.isBackendOnline) {
      try {
        const res = await axios.post(`${this.apiUrl}/api/ai/switch-model`, { model }, { timeout: 4000 });
        if (res.data) {
          return res.data;
        }
      } catch (err) {
        this.handleError(err, `Failed to switch active model to ${model}`);
      }
    }
    return { active_model: model, available_models: [model], is_connected: false };
  }

  async analyzeBrief(req: {
    brief: string;
    industry?: string;
    clientName?: string;
    clientCompany?: string;
    targetBudget?: number;
    deadline?: string;
    model?: string;
  }): Promise<any> {
    if (this.isBackendOnline) {
      try {
        const res = await axios.post(`${this.apiUrl}/api/ai/analyze-brief`, req, { timeout: 45000 });
        if (res.data) {
          return res.data;
        }
      } catch (err) {
        this.handleError(err, 'Backend brief analysis failed.');
      }
    }

    // Direct local synthesis fallback if backend is offline
    return {
      client_objectives: [
        'Deliver a secure, scalable platform tailored to user requirements',
        'Accelerate commercial velocity with modern reactive architecture',
        'Eliminate system workflow bottlenecks and ensure transparent sprint deliveries',
      ],
      project_requirements: [
        'Responsive user experience supporting desktop and mobile devices',
        'Modular, maintainable codebase with automated test coverage',
        'Structured database schemas and secure API interfaces',
      ],
      expected_deliverables: [
        'Production application codebase with environment setup scripts',
        'Staging demonstration and interactive prototypes',
        'Comprehensive handover and technical deployment documentation',
      ],
      target_audience: req.industry ? `${req.industry} professional stakeholders and end-users` : 'Target commercial users',
      budget_constraints: req.targetBudget ? `$${req.targetBudget.toLocaleString()} stated target budget` : 'Unconfirmed budget — to be clarified during kickoff',
      deadline: req.deadline || 'Estimated 6-week execution sprint',
      missing_information: [
        'Specific third-party API credentials and data access requirements',
        'Expected peak concurrency and staging environment hosting preferences',
      ],
      potential_project_risks: [
        'Scope creep from unconstrained feature revisions without sprint freezes',
        'Dependencies on external third-party authorization approvals',
      ],
      model_used: 'local_synthesis',
      extracted_at: new Date().toISOString(),
    };
  }

  async regenerateProposalSection(proposalId: string, sectionKey: string, instructions?: string, model?: string): Promise<Proposal> {
    if (this.isBackendOnline) {
      try {
        const res = await axios.post(
          `${this.apiUrl}/api/proposals/${proposalId}/regenerate-section`,
          { sectionKey, instructions, model },
          { timeout: 45000 }
        );
        if (res.data?.id) {
          storage.saveProposal(res.data);
          return res.data;
        }
      } catch (err) {
        this.handleError(err, `Failed to regenerate section ${sectionKey} on backend.`);
      }
    }

    // Local client fallback
    const prop = storage.getProposal(proposalId);
    if (!prop) throw new Error('Proposal not found');

    const clientRef = prop.clientCompany || prop.clientName || 'the client';
    if (sectionKey === 'executive_summary') {
      prop.executiveSummary = `Strategically re-architected executive plan for "${prop.title}". Engineered specifically to guarantee predictable milestone throughput, bulletproof security, and superior commercial ROI for ${clientRef}. ${instructions ? `Directive incorporated: ${instructions}` : ''}`;
    } else if (sectionKey === 'problem_understanding') {
      prop.problemUnderstanding = `Comprehensive analysis of ${clientRef}'s technical and operational challenges: Current systems experience throughput bottlenecks and scaling friction. This initiative establishes a modern, resilient architecture to eliminate these limitations while maintaining strict data governance. ${instructions ? `Directive incorporated: ${instructions}` : ''}`;
    } else if (sectionKey === 'proposed_solution') {
      prop.proposedSolution = `Engineered modern solution combining modular component architecture, automated CI/CD deployment pipelines, and responsive UX design tailored for ${prop.industry}. Execution is delivered in transparent, bi-weekly sprints. ${instructions ? `Directive incorporated: ${instructions}` : ''}`;
    } else if (sectionKey === 'deliverables') {
      prop.deliverables = [
        `Production-grade, fully tested application codebase`,
        `Interactive UI component system and responsive views`,
        `Secure API endpoints with validated data schemas`,
        `Staging deployment with automated validation suites`,
        `Technical documentation and 30-day post-launch support`,
      ];
    } else if (sectionKey === 'scope_of_work') {
      prop.scopeIncluded = [
        `Architecture blueprinting and data model validation`,
        `Frontend and backend implementation with unit tests`,
        `Two structured review cycles per milestone`,
        `Final staging cutover and production deployment`,
      ];
    } else if (sectionKey === 'timeline_summary' || sectionKey === 'estimated_timeline') {
      const line = `Optimized 6-week phased timeline targeting delivery by ${prop.deadline || 'scheduled release'}. Each phase includes verifiable checkpoint demos.`;
      prop.timelineSummary = line;
      prop.estimatedTimeline = line;
    } else if (sectionKey === 'assumptions_and_exclusions') {
      prop.assumptionsAndExclusions = [
        `Timely access to brand assets, APIs, and staging infrastructure within 3 business days of kickoff.`,
        `Consolidated milestone review feedback provided within 3 business days to prevent sprint slippage.`,
        `Third-party API subscriptions and hosting costs remain the responsibility of ${clientRef}.`,
      ];
    } else if (sectionKey === 'pricing_explanation') {
      prop.pricingExplanation = `Deterministic milestone-based pricing for ${prop.currency} ${prop.totalBudget.toLocaleString()} based on calculated phase engineering hours with zero hidden fees.`;
    } else if (sectionKey === 'terms_and_conditions') {
      prop.termsAndConditions = `1. Intellectual Property: 100% ownership transfers to ${clientRef} upon receipt of final milestone payment.\n2. Revisions: Each delivery phase includes up to two iterative refinement cycles.\n3. Confidentiality: Mutual non-disclosure of proprietary trade secrets.\n4. Warranty: 30-day post-deployment bug remediation guarantee.`;
    } else if (sectionKey === 'call_to_action') {
      prop.callToAction = `To confirm this proposal and lock in our engineering sprint schedule for ${clientRef}, please click "Accept Proposal" or reply with any requested adjustments.`;
    }

    prop.updatedAt = new Date().toISOString();
    storage.saveProposal(prop);
    return prop;
  }

  // --- AI Tools Endpoints ---
  async generateCoverLetter(req: CoverLetterRequest): Promise<string> {
    if (this.isBackendOnline) {
      try {
        const res = await axios.post(`${this.apiUrl}/api/ai/cover-letter`, req, { timeout: 35000 });
        if (res.data?.cover_letter) {
          return res.data.cover_letter;
        }
      } catch (err) {
        this.handleError(err, 'Backend cover letter generation failed.');
      }
    }

    return aiGenerator.generateCoverLetter(req);
  }

  async generateFollowUp(req: FollowUpRequest): Promise<{ subject: string; body: string }> {
    if (this.isBackendOnline) {
      try {
        const res = await axios.post(`${this.apiUrl}/api/ai/follow-up`, req, { timeout: 35000 });
        if (res.data?.subject && res.data?.body) {
          return { subject: res.data.subject, body: res.data.body };
        }
      } catch (err) {
        this.handleError(err, 'Backend follow-up generation failed.');
      }
    }

    return aiGenerator.generateFollowUp(req);
  }

  async improveProposalSection(req: ProposalImprovementRequest): Promise<{ improvedText: string; suggestions: string[]; identifiedStrengths?: string[]; potentialRisksAddressed?: string[] }> {
    if (this.isBackendOnline) {
      try {
        const res = await axios.post(`${this.apiUrl}/api/ai/improve-section`, req, { timeout: 35000 });
        if (res.data?.improved_text) {
          return {
            improvedText: res.data.improved_text,
            suggestions: res.data.suggestions || [],
            identifiedStrengths: res.data.identified_strengths,
            potentialRisksAddressed: res.data.potential_risks_addressed,
          };
        }
      } catch (err) {
        this.handleError(err, 'Backend section improvement failed.');
      }
    }

    return aiGenerator.improveProposalSection(req);
  }
}

export const api = new ApiService();
