import { Proposal, Milestone, PricingItem, ServiceCategory, ToneOfVoice, Currency, CoverLetterRequest, FollowUpRequest, ProposalImprovementRequest } from '../types';

interface GenerateParams {
  clientName: string;
  clientCompany?: string;
  clientEmail?: string;
  projectTitle: string;
  industry: string;
  serviceCategory: ServiceCategory;
  currency: Currency;
  targetBudget: number;
  deadline: string;
  tone: ToneOfVoice;
  brief: string;
  includeRetainer?: boolean;
}

const serviceCategoryLabels: Record<ServiceCategory, string> = {
  web_development: 'Web Application Development',
  ui_ux_design: 'Product UI/UX & Design Systems',
  branding: 'Brand Identity & Visual Strategy',
  mobile_app: 'Mobile App Engineering (iOS & Android)',
  full_stack: 'Full-Stack Architecture & API Integration',
  copywriting_content: 'Conversion Copywriting & Content Strategy',
  seo_marketing: 'Technical SEO & Inbound Acquisition',
  consulting: 'Strategic Technology Consulting',
};

export const aiGenerator = {
  async generateProposal(params: GenerateParams): Promise<Proposal> {
    // Simulate brief generation delay for realistic feel (400ms)
    await new Promise((resolve) => setTimeout(resolve, 400));

    const id = `prop-${Date.now().toString().slice(-4)}`;
    const categoryName = serviceCategoryLabels[params.serviceCategory] || 'Digital Services';
    const budget = Number(params.targetBudget) || 12000;
    const rate = 120;

    // Tone modifiers
    const isExecutive = params.tone === 'executive';
    const isTechnical = params.tone === 'technical';
    const isBold = params.tone === 'bold';
    const isCasual = params.tone === 'casual';

    const execIntro = isExecutive
      ? `This strategic proposal provides an executive blueprint for ${params.clientCompany || params.clientName}'s upcoming initiative: "${params.projectTitle}". Our engagement is engineered to deliver immediate commercial ROI, operational scalability, and rigorous execution standards within the ${params.industry} sector.`
      : isTechnical
      ? `This technical architectural proposal specifies the engineering implementation plan for "${params.projectTitle}" at ${params.clientCompany || params.clientName}. It establishes the component architecture, data contracts, security posture, and deployment pipelines tailored for modern ${params.industry} workloads.`
      : isBold
      ? `High-growth businesses in ${params.industry} cannot afford generic execution. For "${params.projectTitle}", we are engineering a category-defining experience for ${params.clientCompany || params.clientName} that outpaces competitors and captures market share from Day 1.`
      : isCasual
      ? `We're thrilled to partner with ${params.clientCompany || params.clientName} on "${params.projectTitle}". This proposal lays out an agile, collaborative roadmap to bring your vision to life smoothly, on schedule, and with zero surprises.`
      : `This proposal outlines our consultative approach to realizing "${params.projectTitle}" for ${params.clientCompany || params.clientName}. By aligning technological velocity with strategic business objectives, we ensure tangible value throughout each deployment milestone.`;

    const executiveSummary = `${execIntro} Based on your brief: "${params.brief.slice(0, 180)}${params.brief.length > 180 ? '...' : ''}", our team will deliver a production-grade solution by ${params.deadline}.`;

    const objectives = [
      `Deliver production-ready ${categoryName} infrastructure meeting high standards for speed, security, and accessibility.`,
      `Eliminate critical friction in existing user workflows to accelerate conversion and operational throughput by 30%+.`,
      `Establish a maintainable, clean code architecture to minimize future technical debt and reduce long-term maintenance overhead.`,
      `Maintain strict milestone transparency with weekly recorded demos and staging cutover sign-offs.`,
    ];

    const proposedSolution = `We will implement a modular solution engineered specifically for ${params.clientCompany || params.clientName}. Operating in targeted two-week execution sprints, our framework ensures early delivery of high-impact features, rigorous automated testing, and comprehensive handover documentation.`;

    const deliverables = [
      `Complete interactive prototypes and production-ready component library.`,
      `Tested, well-architected source code with comprehensive developer documentation.`,
      `Secure staging environment deployment with automated CI/CD pipeline triggers.`,
      `Final production deployment, DNS verification, and post-launch telemetry validation.`,
      `30-day post-launch hypercare support and warranty period.`,
    ];

    const scopeIncluded = [
      `Requirements discovery workshop and technical schema validation`,
      `Design system tokens, responsive viewports (mobile, tablet, desktop)`,
      `Core business logic, state architecture, and API endpoint integration`,
      `Two iterative review cycles per milestone`,
      `Comprehensive user documentation and recorded handover walkthrough`,
    ];

    const scopeExcluded = [
      `Third-party API licensing, hosting fees, or external cloud infrastructure bills`,
      `Unscheduled out-of-scope feature additions requested after sprint freeze`,
      `Ongoing 24/7 server infrastructure management (available via retainer)`,
    ];

    // Compute milestones
    const m1Amount = Math.round(budget * 0.3);
    const m2Amount = Math.round(budget * 0.45);
    const m3Amount = budget - m1Amount - m2Amount;

    const milestones: Milestone[] = [
      {
        id: `m-${Date.now()}-1`,
        title: 'Phase 1: Discovery, Technical Blueprint & Architecture',
        description: 'Deep-dive alignment, user flows, architecture design, and sprint schedule lock.',
        duration: 'Sprint 1 (Weeks 1–2)',
        deliverables: ['System Blueprint', 'UI/UX Interactive Prototypes', 'Data Contracts'],
        amount: m1Amount,
      },
      {
        id: `m-${Date.now()}-2`,
        title: 'Phase 2: Core Engineering & Feature Implementation',
        description: 'End-to-end development of all primary deliverables and staging integration.',
        duration: 'Sprint 2 (Weeks 3–4)',
        deliverables: ['Functional Staging Build', 'API Integrations', 'QA Test Suite'],
        amount: m2Amount,
      },
      {
        id: `m-${Date.now()}-3`,
        title: 'Phase 3: Security Review, Final Polish & Production Launch',
        description: 'End-to-end validation, performance auditing, production DNS switch, and handover.',
        duration: 'Sprint 3 (Weeks 5–6)',
        deliverables: ['Production Release', 'Documentation', 'Handover Walkthrough'],
        amount: m3Amount,
      },
    ];

    // Pricing items
    const p1Hours = Math.round((m1Amount / rate) * 10) / 10;
    const p2Hours = Math.round(((m2Amount * 0.6) / rate) * 10) / 10;
    const p3Hours = Math.round(((m2Amount * 0.4) / rate) * 10) / 10;
    const p4Hours = Math.round((m3Amount / rate) * 10) / 10;

    const pricingItems: PricingItem[] = [
      { id: 'p1', description: 'Phase 1: Architecture, Discovery & Prototyping', hoursOrUnits: p1Hours, rate, total: m1Amount },
      { id: 'p2', description: 'Phase 2: Core Frontend & Interface Logic', hoursOrUnits: p2Hours, rate, total: Math.round(m2Amount * 0.6) },
      { id: 'p3', description: 'Phase 2: API Integration & Data Validation', hoursOrUnits: p3Hours, rate, total: m2Amount - Math.round(m2Amount * 0.6) },
      { id: 'p4', description: 'Phase 3: QA Auditing, Launch & Technical Handover', hoursOrUnits: p4Hours, rate, total: m3Amount },
    ];

    const proposal: Proposal = {
      id,
      title: params.projectTitle,
      clientName: params.clientName,
      clientCompany: params.clientCompany || params.clientName,
      clientEmail: params.clientEmail || '',
      industry: params.industry,
      serviceCategory: params.serviceCategory,
      currency: params.currency,
      totalBudget: budget,
      deadline: params.deadline,
      tone: params.tone,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      viewCount: 0,
      executiveSummary,
      problemUnderstanding: `Based on your brief for ${params.projectTitle}, ${params.clientCompany || params.clientName} is looking to address key workflow hurdles, eliminate performance bottlenecks, and deploy a robust solution within the ${params.industry} space. Our technical audit indicates that achieving this requires high architectural fidelity, deterministic testing, and secure data orchestration.`,
      objectives,
      proposedSolution,
      deliverables,
      scopeIncluded,
      scopeExcluded,
      assumptionsAndExclusions: [
        'Assumes standard access to relevant design assets, third-party credentials, and staging environments.',
        'Assumes feedback turnaround within 3 business days to maintain scheduled milestone delivery.',
        'Excludes third-party API licensing, hosting fees, and out-of-scope feature additions after sprint freeze.',
      ],
      estimatedTimeline: `Estimated 6-week execution timeline targeting completion by ${params.deadline}.`,
      timelineSummary: `Estimated 6-week execution timeline targeting completion by ${params.deadline}.`,
      milestones,
      pricingItems,
      pricingExplanation: `Deterministic pricing calculated on estimated phase hours at standard rate with transparent milestone splits. Invoiced on verified milestone delivery.`,
      pricingNotes: `Fixed-bid engagement totaling ${params.currency} ${budget.toLocaleString()}. Invoiced on verified milestone delivery.`,
      paymentTerms: `30% advance deposit upon contract execution, 45% upon Phase 2 staging sign-off, 25% upon final production deployment. Payment terms: Net 15 days.`,
      clientResponsibilities: [
        'Provide initial brand assets, access tokens, and staging credentials within 3 business days of kickoff.',
        'Appoint a single designated project lead for feedback consolidation and formal sign-offs.',
        'Review and return milestone feedback within 3 business days of delivery to prevent sprint slippage.',
      ],
      termsAndConditions: `1. Intellectual Property: 100% of custom intellectual property transfers to ${params.clientCompany || params.clientName} upon receipt of final settlement.\n2. Revisions: Each milestone includes up to two iterative refinement cycles.\n3. Confidentiality: Both parties agree to maintain strict confidentiality regarding proprietary business logic and data.\n4. Warranty: Workmanship includes a 30-day post-launch warranty for bug remediation.`,
      callToAction: `To confirm this proposal and secure your engineering sprint slot on our calendar, please click "Accept Proposal" or reply with any requested adjustments.`,
    };

    return proposal;
  },

  async generateCoverLetter(req: CoverLetterRequest): Promise<string> {
    await new Promise((resolve) => setTimeout(resolve, 350));

    const isDirect = req.tone === 'executive' || req.tone === 'bold';

    if (isDirect) {
      return `Dear ${req.clientName || 'Hiring Team'},

I am writing regarding your need for a ${req.jobTitle}. Having engineered high-performance solutions across similar domains, I caught the core challenge of your brief: "${req.jobDescription.slice(0, 100)}...".

Here is how my specific background aligns with your project:
• Relevant Execution: In a recent engagement (${req.portfolioHighlight || 'Full-scale web platform migration'}), I delivered a 40% performance gain while completing delivery 5 days ahead of schedule.
• Core Competencies: ${req.freelancerSkills || 'TypeScript, React 19, Modern API Design, High-Density Dashboards'}.
• Zero Onboarding Overhead: I bring an established sprint cadence—clean architectural contracts, test-driven validation, and asynchronous progress reporting.

I would welcome 15 minutes to review your immediate milestones and outline a concrete execution strategy.

Best regards,
Alex Mercer
Senior Full-Stack Consultant`;
    }

    return `Hi ${req.clientName || 'there'},

Your project for "${req.jobTitle}" immediately caught my attention. Based on your description ("${req.jobDescription.slice(0, 120)}..."), you need someone who can translate business goals into a clean, intuitive, and robust software product.

Why I would love to collaborate:
1. Proven Track Record: ${req.portfolioHighlight || 'Recently built and deployed scalable SaaS web applications with over 99.9% uptime and high user satisfaction'}.
2. Core Skillset: ${req.freelancerSkills || 'Full-Stack TypeScript, React, Tailwind CSS, REST/FastAPI integration'}.
3. Clear Communication: You will receive weekly live staging demos, structured milestones, and zero jargon.

I've attached my portfolio and relevant case studies. Are you open to a brief conversation this week to discuss how we can bring this to life?

Warm regards,
Alex Mercer`;
  },

  async generateFollowUp(req: FollowUpRequest): Promise<{ subject: string; body: string }> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    switch (req.stage) {
      case 'gentle_nudge':
        return {
          subject: `Quick check-in on proposal: ${req.proposalTitle}`,
          body: `Hi ${req.clientName},\n\nI wanted to gently follow up on the proposal for "${req.proposalTitle}" that I shared a few days ago.\n\nDid you and the team have a chance to review the scope and milestones? I'm happy to answer any questions, walk through the technical breakdown, or adjust any deliverables to match your exact timeline.\n\nLooking forward to hearing your thoughts!\n\nBest regards,\nAlex Mercer`,
        };
      case 'value_add':
        return {
          subject: `Additional resource for ${req.proposalTitle} — Next steps`,
          body: `Hi ${req.clientName},\n\nWhile thinking more about your upcoming "${req.proposalTitle}" project, I outlined a quick preliminary architectural checklist that will help streamline Day 1 kickoff regardless of who you partner with.\n\nAs a reminder, our proposed roadmap is budgeted at $${req.proposalValue.toLocaleString()} and structured in three verified milestones to protect your team's capital and delivery schedule.\n\nWould you have 10 minutes on Thursday for a quick touchpoint?\n\nBest,\nAlex Mercer`,
        };
      case 'urgent_closeout':
        return {
          subject: `Holding engineering sprint availability for ${req.proposalTitle}`,
          body: `Hi ${req.clientName},\n\nI am currently planning our development sprints for the upcoming month and wanted to check in regarding "${req.proposalTitle}".\n\nTo ensure we can honor the delivery target outlined in the proposal, I need to confirm our sprint reservations by the end of this week. Please let me know if you would like us to reserve this slot or if your timeline has shifted.\n\nThank you,\nAlex Mercer`,
        };
      case 'contract_signing':
        return {
          subject: `Ready for kickoff: ${req.proposalTitle} onboarding`,
          body: `Hi ${req.clientName},\n\nThank you again for the positive feedback on "${req.proposalTitle}"! Everything is staged on our end.\n\nTo officially trigger our Phase 1 sprint kick-off, please review and sign the milestone contract at your earliest convenience. Once countersigned, I will send over our onboarding checklist and access request form.\n\nLooking forward to building something outstanding together!\n\nBest,\nAlex Mercer`,
        };
    }
  },

  async improveProposalSection(req: ProposalImprovementRequest): Promise<{ improvedText: string; suggestions: string[] }> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const suggestions: string[] = [];
    let improvedText = req.originalText;

    if (req.goal === 'justify_higher_price') {
      suggestions.push('Framed deliverables around business outcomes rather than hours worked.');
      suggestions.push('Added explicit post-launch risk mitigation and warranty value.');
      suggestions.push('Quantified expected ROI and client time-savings.');
      improvedText = `${req.originalText}\n\nStrategic Value & Commercial Impact:\nBy implementing an enterprise-grade architecture from Day 1, this engagement directly mitigates expensive rework and accelerates operational throughput. Rather than purchasing commoditized hours, your investment secures a battle-tested asset backed by automated quality assurance and a comprehensive 30-day post-launch warranty.`;
    } else if (req.goal === 'more_persuasive') {
      suggestions.push('Sharpened executive hooks and eliminated passive phrasing.');
      suggestions.push('Positioned client as the hero with clear operational win states.');
      improvedText = `Executive Overview:\n${req.originalText.replace(/We will try to|We can possibly/g, 'We will')}\n\nKey Outcomes Guaranteed:\n• Measurable reduction in system friction and user drop-off.\n• Predictable sprint cadence with verifiable staging demonstrations.\n• Complete transparency into code quality and delivery milestones.`;
    } else if (req.goal === 'clearer_scope') {
      suggestions.push('Separated included vs excluded items with unambiguous boundaries.');
      suggestions.push('Specified exact number of revision rounds to prevent scope creep.');
      improvedText = `${req.originalText}\n\nBoundary Definitions & Scope Clarification:\n• In-Scope: Dedicated frontend interfaces, API integration, and two review rounds per milestone.\n• Out-of-Scope: Unscheduled features outside approved specifications; third-party service fees and infrastructure hosting.\n• Additional Requests: Handled transparently via agreed change orders at standard hourly rates.`;
    } else {
      suggestions.push('Directly addressed client hesitation regarding timeline and delivery risk.');
      suggestions.push('Reinforced weekly demo milestones and escrow/deposit security.');
      improvedText = `${req.originalText}\n\nRisk Mitigation & Assurance:\nTo eliminate delivery uncertainty, all work is divided into bite-sized milestones requiring client review before subsequent phases commence. You retain 100% intellectual property rights, and invoices are tied strictly to accepted deliverables.`;
    }

    return { improvedText, suggestions };
  },
};
