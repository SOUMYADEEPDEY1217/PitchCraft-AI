export type Currency = 'USD' | 'EUR' | 'GBP' | 'CAD' | 'AUD' | 'INR';

export type ProposalStatus = 'draft' | 'sent' | 'in_review' | 'accepted' | 'declined';

export type ServiceCategory = 
  | 'web_development'
  | 'ui_ux_design'
  | 'branding'
  | 'mobile_app'
  | 'full_stack'
  | 'copywriting_content'
  | 'seo_marketing'
  | 'consulting';

export type ToneOfVoice = 
  | 'executive'
  | 'consultative'
  | 'bold'
  | 'technical'
  | 'casual';

export interface Milestone {
  id: string;
  title: string;
  description: string;
  duration: string;
  deliverables: string[];
  amount: number;
}

export interface PricingItem {
  id: string;
  description: string;
  hoursOrUnits: number;
  rate: number;
  total: number;
}

export interface Proposal {
  id: string;
  title: string;
  clientName: string;
  clientEmail?: string;
  clientCompany?: string;
  clientId?: string;
  industry: string;
  serviceCategory: ServiceCategory;
  currency: Currency;
  totalBudget: number;
  deadline: string;
  tone: ToneOfVoice;
  status: ProposalStatus;
  createdAt: string;
  updatedAt: string;
  
  // Detailed proposal sections
  executiveSummary: string;
  objectives: string[];
  proposedSolution: string;
  deliverables: string[];
  scopeIncluded: string[];
  scopeExcluded: string[];
  timelineSummary: string;
  problemUnderstanding?: string;
  assumptionsAndExclusions?: string[];
  pricingExplanation?: string;
  estimatedTimeline?: string;
  milestones: Milestone[];
  pricingItems: PricingItem[];
  pricingNotes: string;
  paymentTerms: string;
  clientResponsibilities: string[];
  termsAndConditions: string;
  callToAction: string;

  // View tracking
  viewCount?: number;
  lastViewedAt?: string;
  clientFeedback?: string;
}

export interface Client {
  id: string;
  name: string;
  company: string;
  email: string;
  phone?: string;
  website?: string;
  industry: string;
  status: 'active' | 'lead' | 'past';
  notes?: string;
  totalQuoted: number;
  totalPaid: number;
  proposalsCount: number;
  createdAt: string;
}

export interface PricingCalculation {
  hourlyRate: number;
  hoursByPhase: {
    discovery: number;
    design: number;
    development: number;
    qa: number;
    deployment: number;
  };
  expenses: { id: string; name: string; amount: number }[];
  contingencyPercent: number;
  marginPercent: number;
  totalLaborHours: number;
  baseLaborCost: number;
  totalExpenses: number;
  contingencyCost: number;
  profitMarginAmount: number;
  grandTotal: number;
  recommendedDeposit: number;
}

export interface CoverLetterRequest {
  clientName: string;
  jobTitle: string;
  jobDescription: string;
  freelancerSkills: string;
  tone: ToneOfVoice;
  portfolioHighlight: string;
}

export interface FollowUpRequest {
  clientName: string;
  proposalTitle: string;
  daysSinceSent: number;
  proposalValue: number;
  stage: 'gentle_nudge' | 'value_add' | 'urgent_closeout' | 'contract_signing';
}

export interface ProposalImprovementRequest {
  sectionTitle: string;
  originalText: string;
  goal: 'more_persuasive' | 'justify_higher_price' | 'clearer_scope' | 'objection_proofing';
  context?: string;
}

export interface ClientBriefAnalysisRequest {
  brief: string;
  industry?: string;
  clientName?: string;
  clientCompany?: string;
  targetBudget?: number;
  deadline?: string;
  model?: string;
}

export interface ClientBriefAnalysisResponse {
  client_objectives: string[];
  project_requirements: string[];
  expected_deliverables: string[];
  target_audience: string;
  budget_constraints: string;
  deadline: string;
  missing_information: string[];
  potential_project_risks: string[];
  model_used: string;
  extracted_at?: string;
  clarity_rating?: string;
  complexity_level?: string;
  key_deliverables?: string[];
  hidden_assumptions?: string[];
}

export interface SectionRegenerateRequest {
  proposalId?: string;
  sectionKey: string;
  projectTitle?: string;
  clientName?: string;
  clientCompany?: string;
  industry?: string;
  tone?: string;
  brief?: string;
  targetBudget?: number;
  currency?: string;
  deadline?: string;
  instructions?: string;
  currentContent?: any;
  model?: string;
}

export interface SectionRegenerateResponse {
  sectionKey: string;
  regeneratedContent: any;
  explanation: string;
  model_used: string;
}

export interface AppSettings {
  freelancerName: string;
  freelancerTitle: string;
  agencyName: string;
  freelancerEmail: string;
  freelancerWebsite: string;
  defaultCurrency: Currency;
  defaultHourlyRate: number;
  defaultPaymentTerms: string;
  theme: 'light' | 'dark';
  
  // Backend & AI connection
  aiMode: 'local_demo' | 'fastapi' | 'ollama_direct';
  fastApiUrl: string;
  ollamaUrl: string;
  ollamaModel: string;
  geminiApiKey?: string;
}

export interface BackendStatus {
  isConnected: boolean;
  mode: 'local_demo' | 'fastapi' | 'ollama_direct';
  serverUrl: string;
  latencyMs?: number;
  modelName?: string;
  errorMessage?: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string | null;
  providerId: string;
  role?: 'freelancer' | 'agency' | 'client' | 'admin';
  hourlyRate?: number;
  currency?: Currency;
  agencyName?: string;
  bio?: string;
  createdAt: string;
  lastLoginAt: string;
  updatedAt?: string;
}

export interface SavedPricingEstimate {
  id: string;
  title: string;
  clientName: string;
  calculation: PricingCalculation;
  createdAt: string;
}

export interface AiHistoryItem {
  id: string;
  generationType: string;
  modelName: string;
  durationMs: number;
  status: string;
  createdAt: string;
  summary?: string;
}


