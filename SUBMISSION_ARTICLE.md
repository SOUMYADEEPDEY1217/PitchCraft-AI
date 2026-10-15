# PitchCraft AI — From Client Briefs to Winning Proposals with Open-Source AI

*A submission for the Hacktoberfest 2026 Open-Source AI Side Hustle Challenge.*

---

## 1. What I Built

**PitchCraft AI** is an open-source, full-stack proposal engineering workstation built for independent software engineers, designers, digital consultants, and boutique agencies. It transforms raw, ambiguous client discovery briefs into comprehensive, executive-grade, and mathematically verified business proposals in under 60 seconds.

Unlike conventional proposal SaaS tools that wrap proprietary commercial LLM APIs, PitchCraft AI runs entirely on **open-source AI** via **Ollama** (`qwen3:4b`), paired with a deterministic backend calculation engine in **FastAPI**, an interactive 5-section proposal editor in **React 19**, and vector-rendered PDF document export powered by **ReportLab**.

### Quick Links
- **Live Demo (Web Workstation)**: [https://ais-pre-tuz475pcmgczp76zns4qsr-185519337094.asia-southeast1.run.app](https://ais-pre-tuz475pcmgczp76zns4qsr-185519337094.asia-southeast1.run.app)
- **GitHub Repository**: [https://github.com/rohandey/pitchcraft-ai](https://github.com/rohandey/pitchcraft-ai) *(Placeholder)*
- **Demo Video (2-Minute Walkthrough)**: [https://youtu.be/pitchcraft-demo](https://youtu.be/pitchcraft-demo) *(Placeholder)*

---

## 2. The Real-World Problem

Freelance technical professionals and boutique agency owners face an unsustainable operational paradox:
1. **The Proposal Time Sink**: Drafting a high-ticket project proposal takes 4 to 12 hours. It requires breaking down scopes, defining milestone deliverables, listing technical assumptions, calculating hourly rates, and writing persuasive executive summaries.
2. **The "Blank Page" Bottleneck**: When responding to multiple client RFPs (Requests for Proposal), freelancers delay submissions by days. In competitive bidding, speed-to-reply directly correlates with deal conversion.
3. **Financial Hallucination in Generic AI**: General-purpose LLMs (like standard ChatGPT or Claude prompts) frequently hallucinate arithmetic. They invent hourly totals that don't add up to the quote, fail to account for contingency buffers, or suggest arbitrary discounts that erode project margins.
4. **Data Privacy & Client NDA Violations**: Uploading confidential client product requirements, non-public trade secrets, and internal budgets into third-party commercial cloud AI platforms risks violating non-disclosure agreements (NDAs) and client trust.
5. **Punitive SaaS Subscriptions**: Commercial proposal platforms (e.g., Proposify, PandaDoc, Better Proposals) charge between $35 and $90 per seat per month, locking user data behind proprietary paywalls.

---

## 3. How PitchCraft AI Solves It

PitchCraft AI introduces a principled architectural paradigm: **Separation of Cognitive Synthesis from Deterministic Calculation**.

```
┌─────────────────────────────────────────────────────────────┐
│                       Client Brief                          │
│   "Build HIPAA patient portal in React & FastAPI ($25k)"    │
└──────────────────────────────┬──────────────────────────────┘
                               │
                ┌──────────────┴──────────────┐
                ▼                             ▼
   [Cognitive Synthesis]           [Deterministic Math]
   Ollama (Qwen3:4b)               FastAPI Backend Engine
   • 8-D Brief Extraction          • Labor Cost = Hours × Rate
   • Executive Summary             • Subtotal = Labor + Expenses
   • Deliverables Checklist        • Contingency = % of Subtotal
   • Assumptions & Scope Bounds    • Final Quote = Subtotal + Buffer
                │                             │
                └──────────────┬──────────────┘
                               │
                               ▼
            [Interactive React 19 Workstation]
            • Multi-Tab Proposal Editor
            • Selective Section Re-prompting
            • Instant Margin Recalculation
            • Client CRM Status Tracking
            • Native ReportLab PDF Export
```

1. **Strategic Cognitive Synthesis**: Ollama parses messy discovery briefs, extracting objectives, scope boundaries, deliverables, risks, and client responsibilities.
2. **Zero-Hallucination Mathematics**: Financial figures, hourly quotes, direct software expenses, and risk contingency percentages are calculated exclusively by deterministic Python functions on the backend. The AI is strictly barred from inventing numbers.
3. **Complete Data Sovereignty**: All AI inference executes locally on the user's hardware (or inside a private container). Client documents and pricing strategies never touch a commercial cloud LLM provider.
4. **Instant Actionability**: Proposals can be edited down to the individual milestone, cloned, customized with single-section AI regeneration, tracked through CRM stages, and downloaded as boardroom-ready PDFs.

---

## 4. Core Features

### Feature 1 — 8-Dimensional Client Brief Analyzer
When entering an RFP or transcript, PitchCraft AI's extraction pipeline extracts eight distinct structural dimensions:
- **Client Objectives**: High-level business milestones and ROI drivers.
- **Project Requirements**: Specific architectural and functional constraints.
- **Expected Deliverables**: Tangible work artifacts provided upon handover.
- **Target Audience**: Demographic and user profiles.
- **Budget Constraints**: Stated ceilings or explicit flags if unconfirmed.
- **Target Deadlines**: Delivery timelines and schedule dependencies.
- **Missing Information**: Critical discovery questions that must be answered before kickoff.
- **Potential Execution Risks**: Scope creep traps, technical hazards, and regulatory hurdles.

### Feature 2 — Advanced Multi-Section Proposal Editor
The workspace organizes the proposal across five distinct tabs:
- **Tab 1: Strategic Overview**: Editable Executive Summary, Problem Understanding, and Core Objectives.
- **Tab 2: Scope & Deliverables**: Deliverables checklist (with item addition/removal), Included Scope, Excluded Scope (out-of-scope boundaries to prevent scope creep), and Assumptions & Exclusions.
- **Tab 3: Timeline & Sprints**: Narrative schedule summary and phased milestone cards with individual delivery durations and milestone values.
- **Tab 4: Investment & Pricing**: Line-item unit/hour quotation table, rate controls, and structured payment term options.
- **Tab 5: Terms & Close**: Client responsibilities checklist, Terms & Conditions, and Call-to-Action.

*Every major section features an inline **Regenerate with AI** trigger, allowing the user to provide custom guidance (e.g., "Make it more urgent," "Focus on security compliance") to re-synthesize that section alone without losing manual edits in other sections.*

### Feature 3 — Smart Pricing Calculator & Margin Guard
- Input parameters: Estimated Work Hours, Target Hourly Rate, Direct Expenses (licenses, hosting, third-party APIs), Risk Contingency Buffer (0% to 50%), and Preferred Currency.
- Formula calculation:
  $$\text{Labor Cost} = \text{Hours} \times \text{Rate}$$
  $$\text{Subtotal} = \text{Labor Cost} + \text{Expenses}$$
  $$\text{Contingency} = \text{Subtotal} \times \left(\frac{\text{Contingency } \%}{100}\right)$$
  $$\text{Final Quote} = \text{Subtotal} + \text{Contingency}$$
- **Direct Proposal Sync**: Push calculated figures into the active proposal with a single click.

### Feature 4 — Executive PDF Generation (ReportLab)
- Generates polished multi-page PDFs using ReportLab flowables.
- Clean header styling with proposal status, date, client metadata, and visual divider lines.
- Structured quotation tables with alternating row shading, right-aligned monetary values, and bold summary rows.
- Two-tier page footer canvas with running document title and automated page numbering (`Page X of Y`).
- Resilient Unicode sanitizer preventing font encoding crashes.

### Feature 5 — Client CRM & Proposal Tracking
- Complete client lifecycle management: Create, view, update, search, and delete clients.
- Safe deletion validation: Prevents accidental deletion of CRM contacts that have active proposal agreements linked.
- Proposal status pipeline: `Draft` ➔ `Sent` ➔ `In Review` ➔ `Accepted` ➔ `Declined`.
- Real-time dashboard KPI summaries: Total Revenue Pipeline, Active Win Rate %, Total Proposals count, and Average Deal Value.

### Feature 6 — Freelancer AI Business Accelerator Tools
- **Tailored Job Cover Letter Generator**: Creates customized pitch letters strictly using skills verified in the user's profile.
- **Multi-Stage Follow-Up Generator**: Generates 3-day gentle nudges, value-add touchpoints, and time-sensitive closing sequences based on days elapsed.
- **Proposal Section Polisher**: Strategic assistant offering 4 refinement lenses: *More Persuasive*, *Justify Higher Price*, *Clearer Scope*, and *Objection Proofing*.

---

## 5. Live Demo

The PitchCraft AI application is accessible via the live cloud preview environment:

- **Interactive Web App**: [https://ais-pre-tuz475pcmgczp76zns4qsr-185519337094.asia-southeast1.run.app](https://ais-pre-tuz475pcmgczp76zns4qsr-185519337094.asia-southeast1.run.app)
- **Local Source Code**: [https://github.com/rohandey/pitchcraft-ai](https://github.com/rohandey/pitchcraft-ai) *(Placeholder)*

### Test Credentials / Quick-Start Run:
1. Open the **Generator** tab.
2. Select a pre-loaded sample client (or click **Prefill Example**).
3. Click **Analyze Brief** to preview the 8-dimensional cognitive breakdown.
4. Click **Generate Full Proposal** to construct the complete document.
5. In the **Proposal Editor**, review the sections, test selective AI regeneration, view the **Client Preview**, and click **Download PDF**.

---

## 6. Technology Stack

| Layer | Component | Choice Rationale |
| :--- | :--- | :--- |
| **Frontend UI** | **React 19 & TypeScript** | Modern concurrent rendering, strict type contracts, and zero-flicker state transitions. |
| **Styling** | **Tailwind CSS v4** | Clean, responsive, dark-mode ready design adhering to strict typographic hierarchy without UI bloat. |
| **Icons & Charts** | **Lucide React & Recharts** | Lightweight vector icons and data visualization for revenue pipelines and conversion rates. |
| **Backend API** | **FastAPI (Python 3.11+)** | High-performance asynchronous REST endpoints, automatic OpenAPI documentation, and native typing. |
| **Validation** | **Pydantic v2** | Strict bidirectional schema validation with camelCase aliases for frictionless frontend interchange. |
| **Database** | **SQLAlchemy 2.0 & PostgreSQL / SQLite** | Robust relational persistence with structured JSON columns for document trees and cascading foreign-key integrity. |
| **Document Engine** | **ReportLab 5.0** | Professional vector PDF rendering with customizable canvas footers, page numbering, and flowable tables. |
| **Inference Engine** | **Ollama** | Local LLM hosting providing fast, private, zero-cost token streaming. |
| **Model** | **Qwen3:4b (Alibaba Cloud / Qwen)** | Compact 4-billion parameter model optimized for structured JSON generation, instruction adherence, and low VRAM footprint. |

---

## 7. System Architecture

The following diagram illustrates the architecture of PitchCraft AI:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        FRONTEND CLIENT (PORT 3000)                     │
│  React 19 SPA • Tailwind CSS v4 • TypeScript • LocalStorage Cache     │
│  ┌───────────────────────┐ ┌──────────────────────┐ ┌───────────────┐  │
│  │ Proposal Generator    │ │ Multi-Tab Editor     │ │ Pricing Calc  │  │
│  └───────────────────────┘ └──────────────────────┘ └───────────────┘  │
│  ┌───────────────────────┐ ┌──────────────────────┐ ┌───────────────┐  │
│  │ Client CRM & History  │ │ Dashboard Analytics  │ │ AI Tools Lab  │  │
│  └───────────────────────┘ └──────────────────────┘ └───────────────┘  │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ HTTP REST / JSON
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        FASTAPI BACKEND (PORT 8000)                     │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ API Routing Layer: /api/proposals, /api/clients, /api/ai, /health │  │
│  └──────────────────────────────────┬───────────────────────────────┘  │
│                                     │                                  │
│         ┌───────────────────────────┼────────────────────────┐         │
│         ▼                           ▼                        ▼         │
│  ┌──────────────┐            ┌──────────────┐         ┌──────────────┐ │
│  │ Math Engine  │            │ PDF Service  │         │ Proposal Svc │ │
│  │ Deterministic│            │ (ReportLab)  │         │ Lifecycle &  │ │
│  │ Calculations │            │ Canvas Flow  │         │ History Log  │ │
│  └──────────────┘            └──────────────┘         └──────┬───────┘ │
└──────────────────────────────────────────────────────────────┼─────────┘
                                                               │
                               ┌───────────────────────────────┴────────┐
                               ▼                                        ▼
┌──────────────────────────────────────────────┐ ┌───────────────────────┐
│               PERSISTENCE LAYER              │ │    LOCAL AI ENGINE    │
│  SQLAlchemy 2.0 ORM                          │ │  Ollama Daemon        │
│  SQLite (Dev) / PostgreSQL (Prod)            │ │  Model: Qwen3:4b      │
│  • Clients Table                             │ │  • JSON Mode          │
│  • Proposals Table (content_json, pricing)   │ │  • Context Windows    │
│  • AI Generation History Table               │ │  • Zero External Data │
└──────────────────────────────────────────────┘ └───────────────────────┘
```

### Data Flow for Proposal Creation:
1. **User Request**: User inputs client brief, deadline, and target budget into the React frontend.
2. **Analysis Route**: Backend calls `POST /api/ai/analyze-brief`. Ollama runs the extraction prompt with strict JSON output formatting.
3. **Generation Route**: Backend calls `POST /api/proposals/generate`. Ollama synthesizes the strategic sections. The backend math engine injects the pricing items, computes totals, and writes the proposal record to the database.
4. **Interactive Editor**: Proposal loads in the React workspace. Edits update the database via `PUT /api/proposals/{id}`.
5. **PDF Export**: On request, `GET /api/proposals/{id}/pdf` triggers ReportLab to render a multi-page PDF streamed directly to the user's browser.

---

## 8. How Ollama and Qwen3 Power the Application

PitchCraft AI leverages **Ollama** running **Qwen3:4b** as its default reasoning engine.

### Why Qwen3:4b?
- **Dense Instruction Following**: Qwen3 excels at adhering to complex multi-key JSON schemas without emitting conversational markdown preambles.
- **Hardware Efficiency**: At ~2.6 GB in quantized form, Qwen3:4b runs comfortably on modest developer hardware (Apple Silicon M-series, Nvidia GTX/RTX GPUs, or modern CPU-only laptops).
- **Inference Speed**: Generates 45–75 tokens per second on consumer hardware, enabling full proposal synthesis in approximately 8 to 15 seconds.

### Prompt Engineering & JSON Schema Enforcement
To prevent malformed outputs, PitchCraft AI employs a multi-tiered resilience strategy:
1. **Explicit System Directives**: The system prompt instructs the model to return *raw, valid JSON only*, forbidding markdown fences and conversational filler.
2. **Regex JSON Block Harvester**: The backend extractor checks for raw JSON, then parses markdown-fenced code blocks (` ```json ... ``` `), and finally uses bracket-boundary slicing (`{ ... }`) to extract valid JSON even if the model prefixes conversational greetings.
3. **Pydantic Validation**: All extracted JSON passes through Pydantic v2 models. If an optional field is missing, default fallbacks ensure the proposal document never crashes.
4. **Selective Section Regeneration**: Instead of regenerating the entire document when a user requests a change, PitchCraft AI targets only the designated section key (e.g., `executive_summary`), injecting the project context and user feedback. The returned section is patched into the existing proposal JSON.

---

## 9. Why Open Innovation Matters

Open-source AI represents a critical defense against digital centralization:
1. **No Artificial Vendor Lock-In**: Proprietary AI services can deprecate models, alter system prompts, raise token prices, or revoke API access without notice. Open-source models belong to the developer.
2. **Democratization of Enterprise Capabilities**: A solo freelance developer in any country can deploy the exact same proposal generation intelligence as a Fortune 500 consulting firm, with zero recurring software licensing costs.
3. **Community Extensibility**: The community can contribute custom templates for niche industries (e.g., architectural blueprints, SEO retainers, cybersecurity audits) and fine-tuned domain models without seeking platform approval.

---

## 10. Local Privacy and Model Flexibility

### Client Confidentiality by Design
Freelancers regularly work under strict NDAs covering unannounced products, proprietary algorithms, and internal budget ceilings. Transmitting this data over public APIs can represent a breach of contract. 

With PitchCraft AI:
- **No data leaves localhost**: The entire inference loop occurs within the user's machine.
- **Air-Gapped Operation**: Once the Ollama model is downloaded, PitchCraft AI functions without an active internet connection.

### Pluggable Model Architecture
PitchCraft AI is model-agnostic. While `qwen3:4b` is the default recommendation, users can switch models on the fly through the UI:
- `llama3.2:3b` for ultra-lightweight CPU execution.
- `mistral:7b` for rich narrative styling.
- `deepseek-r1:7b` for complex technical scope decomposition.

---

## 11. Business Model and Monetization

PitchCraft AI is designed as a sustainable open-core side hustle. Below is the proposed tiered model:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        PROPOSED PRICING TIERS                          │
│                                                                        │
│   COMMUNITY (Open-Source)        PRO HOSTED            AGENCY TEAM     │
│          $0 / mo                  $15 / mo               $49 / mo      │
│   ─────────────────────     ──────────────────     ──────────────────  │
│   • 100% Free Forever       • Managed Cloud DB     • 5 Team Seats      │
│   • Self-Hosted Local       • Sync Across Devices  • Custom Branding   │
│   • Unlimited Proposals     • Cloud Ollama Node    • Client Signatures │
│   • Full Source Code (MIT)  • Automated Backups    • Custom PDF Themes │
│   • SQLite / PostgreSQL     • Email Delivery Svc   • Multi-User CRM    │
└────────────────────────────────────────────────────────────────────────┘
```

> **Important Disclosure on Metrics & Revenue**:
> PitchCraft AI is currently in active open-source beta. The pricing tiers above represent the proposed commercial roadmap for the hosted SaaS offering. **No actual commercial sales or paying subscriber revenue have been transacted yet.** All metrics reflect local testing and beta evaluation.

### Monetization Channels
1. **Self-Hosted Community Edition (Free & Open-Source)**: MIT-licensed, unlimited local usage, community-supported.
2. **Hosted PitchCraft Cloud ($15/month)**: Targeted at non-technical freelancers who want the privacy and power of open-source models without maintaining Python/Node environments. Includes managed database, cloud backup, and web access from any device.
3. **PitchCraft for Agencies ($49/month)**: Adds team seats, shared client CRM, custom domain proposal hosting with client view analytics, and digital signature capture.

---

## 12. Challenges and Lessons Learned

### Challenge 1: Enforcing Reliable JSON from Local Models
Smaller parameter models (3B–4B) can occasionally output conversational preambles (e.g., *"Certainly! Here is your proposal in JSON format:"*) or append trailing remarks.
- *Solution*: Developed a multi-pass regex extraction pipeline combined with Pydantic v2 schemas. If JSON parsing fails, the service attempts bracket-boundary recovery before reporting an error.

### Challenge 2: Eliminating AI Financial Inaccuracies
Initial experiments allowed the LLM to generate the entire pricing section including subtotals. In approximately 20% of runs, the model's numbers did not balance (e.g., 40 hours at $100/hr was calculated as $4,500).
- *Solution*: Stripped all financial arithmetic from the LLM prompt. The AI generates scope items and estimated hours, while a deterministic Python module computes all subtotals, contingency buffers, and final quotes.

### Challenge 3: Vector PDF Generation Without Headless Browsers
Using Puppeteer or headless Chromium for PDF export adds hundreds of megabytes of dependencies and high memory usage.
- *Solution*: Implemented native Python **ReportLab** document builders with custom canvas callbacks for headers, footers, and two-pass page numbering (`Page X of Y`), maintaining high performance and lightweight container sizes.

---

## 13. First User Testing and Feedback

During pre-release testing with a small group of freelance software developers and design consultants, the following observations and feedback were gathered:

### Key Findings
1. **Speed to First Draft**: Testers reported reducing proposal drafting time from an average of ~3 hours to approximately 10–15 minutes, using PitchCraft AI to generate the initial draft followed by manual review.
2. **Scope Boundaries Feature**: Freelancers specifically praised the **Explicitly Excluded Scope** section, noting that clearly stating out-of-scope items helps prevent scope creep in client relationships.
3. **Deterministic Math Trust**: Testers expressed relief that the financial figures were calculated mathematically rather than generated by the AI, citing past negative experiences with hallucinated figures from generic chatbots.

### User Feedback Refinements Implemented
- Added the **Selective Section Regeneration** feature so users do not lose manual edits across the proposal when re-prompting a single section.
- Added the **Duplicate Proposal** button to allow cloning past successful proposals as templates.
- Added the **Unsaved Changes Warning** modal to prevent losing edits during accidental page navigation.

---

## 14. Future Improvements

- [ ] **Client Digital Signatures**: Integrated e-signature flow for clients on the web-hosted proposal view.
- [ ] **Live Currency Exchange Rates**: Real-time multi-currency conversion for international freelance engagements.
- [ ] **Custom White-Label PDF Templates**: Visual theme editor for custom brand colors, typography, and company logos.
- [ ] **Email Delivery & Open Tracking**: Send proposals directly from PitchCraft via SMTP with read-receipt webhooks.
- [ ] **CRM Integrations**: Two-way sync with Notion, HubSpot, and QuickBooks.

---

## 15. GitHub Repository and Demo Links

- **Live Application Demo**: [https://ais-pre-tuz475pcmgczp76zns4qsr-185519337094.asia-southeast1.run.app](https://ais-pre-tuz475pcmgczp76zns4qsr-185519337094.asia-southeast1.run.app)
- **GitHub Repository**: [https://github.com/rohandey/pitchcraft-ai](https://github.com/rohandey/pitchcraft-ai) *(Placeholder)*
- **Demo Walkthrough Video**: [https://youtu.be/pitchcraft-demo](https://youtu.be/pitchcraft-demo) *(Placeholder)*
- **Developer Contact**: rohan.dey1206@gmail.com

---

*PitchCraft AI was proudly built for the Hacktoberfest 2026 Open-Source AI Side Hustle Challenge to empower independent professionals with private, accessible, and mathematically sound open-source AI.*
