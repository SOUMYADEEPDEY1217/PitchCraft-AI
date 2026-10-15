import { describe, it, expect } from 'vitest';
import './setup';
import { aiGenerator } from '../services/aiGenerator';
import { ToneOfVoice, CoverLetterRequest, FollowUpRequest, ProposalImprovementRequest } from '../types';

describe('PitchCraft AI - AI Generator Service', () => {
  it('generates a full proposal structure with all necessary sections', async () => {
    const proposal = await aiGenerator.generateProposal({
      clientName: 'Julian Vance',
      clientCompany: 'Apex Fintech',
      clientEmail: 'julian@apexfintech.com',
      projectTitle: 'Automated AML Compliance Dashboard',
      industry: 'Financial Technology',
      serviceCategory: 'full_stack',
      currency: 'USD',
      targetBudget: 18000,
      deadline: '2026-11-30',
      tone: 'technical',
      brief: 'Need a microservices dashboard for real-time AML transaction monitoring with alerting.',
    });

    expect(proposal).toBeDefined();
    expect(proposal.id).toMatch(/^prop-/);
    expect(proposal.title).toBe('Automated AML Compliance Dashboard');
    expect(proposal.clientName).toBe('Julian Vance');
    expect(proposal.clientCompany).toBe('Apex Fintech');
    expect(proposal.totalBudget).toBe(18000);
    expect(proposal.status).toBe('draft');
    expect(proposal.executiveSummary).toContain('Apex Fintech');
    expect(proposal.objectives.length).toBeGreaterThan(0);
    expect(proposal.milestones.length).toBeGreaterThan(0);
    expect(proposal.pricingItems.length).toBeGreaterThan(0);
    expect(proposal.paymentTerms).toBeDefined();

    // Verify milestone sum equals target budget
    const milestoneSum = proposal.milestones.reduce((acc, m) => acc + m.amount, 0);
    expect(milestoneSum).toBe(18000);
  });

  const tones: ToneOfVoice[] = ['executive', 'technical', 'bold', 'casual', 'consultative'];
  tones.forEach((tone) => {
    it(`adapts executive summary tone for: ${tone}`, async () => {
      const proposal = await aiGenerator.generateProposal({
        clientName: 'Test Client',
        clientCompany: 'Test Co',
        projectTitle: 'Scale Strategy',
        industry: 'SaaS',
        serviceCategory: 'consulting',
        currency: 'EUR',
        targetBudget: 10000,
        deadline: '2026-12-15',
        tone,
        brief: 'Consulting brief for growth',
      });

      expect(proposal.executiveSummary).toBeDefined();
      if (tone === 'executive') {
        expect(proposal.executiveSummary).toContain('strategic proposal provides an executive blueprint');
      } else if (tone === 'technical') {
        expect(proposal.executiveSummary).toContain('technical architectural proposal specifies');
      } else if (tone === 'bold') {
        expect(proposal.executiveSummary).toContain('High-growth businesses in SaaS cannot afford generic execution');
      } else if (tone === 'casual') {
        expect(proposal.executiveSummary).toContain("We're thrilled to partner");
      } else if (tone === 'consultative') {
        expect(proposal.executiveSummary).toContain('consultative approach');
      }
    });
  });

  it('generates a personalized cover letter', async () => {
    const letterReq: CoverLetterRequest = {
      clientName: 'Eleanor Vance',
      jobTitle: 'Senior React & Node Architect',
      jobDescription: 'Build high-performance real-time analytics portal with responsive design and GraphQL API.',
      freelancerSkills: 'TypeScript, React 19, FastAPI, PostgreSQL, Tailwind CSS',
      portfolioHighlight: 'Engineered analytics portal handling 10M daily transactions',
      tone: 'consultative',
    };

    const letter = await aiGenerator.generateCoverLetter(letterReq);
    expect(letter).toBeDefined();
    expect(letter).toContain('Eleanor Vance');
    expect(letter).toContain('Senior React & Node Architect');
    expect(letter).toContain('Engineered analytics portal');
    expect(letter).toContain('TypeScript, React 19');
  });

  it('generates follow-up messages across various stages', async () => {
    const stages: Array<'gentle_nudge' | 'value_add' | 'urgent_closeout' | 'contract_signing'> = [
      'gentle_nudge',
      'value_add',
      'urgent_closeout',
      'contract_signing',
    ];

    for (const stage of stages) {
      const followUpReq: FollowUpRequest = {
        clientName: 'Marcus Wright',
        proposalTitle: 'Mobile E-Commerce App',
        proposalValue: 15000,
        daysSinceSent: 3,
        stage,
      };

      const result = await aiGenerator.generateFollowUp(followUpReq);
      expect(result).toBeDefined();
      expect(result.subject).toBeDefined();
      expect(result.subject).toContain('Mobile E-Commerce App');
      expect(result.body).toContain('Marcus Wright');
    }
  });

  it('improves proposal sections with specified goal types', async () => {
    const originalText = 'We will build the system and make it work fast.';
    const improveReq: ProposalImprovementRequest = {
      sectionTitle: 'Proposed Solution',
      originalText,
      goal: 'more_persuasive',
    };

    const result = await aiGenerator.improveProposalSection(improveReq);
    expect(result).toBeDefined();
    expect(result.improvedText).toBeDefined();
    expect(result.improvedText.length).toBeGreaterThan(originalText.length);
    expect(result.suggestions.length).toBeGreaterThan(0);
  });
});
