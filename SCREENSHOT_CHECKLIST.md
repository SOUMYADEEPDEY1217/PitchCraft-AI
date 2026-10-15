# 📸 PitchCraft AI — Screenshot Checklist for Submission & Documentation

To present PitchCraft AI with high visual impact in the DEV.to submission, GitHub README, and social media campaigns, capture the following 10 screenshots at **1920x1080 resolution** (or 2560x1440 retina display) with dark mode enabled.

---

### Screenshot 1: Executive Dashboard (Hero Shot)
- **Path**: `screenshots/01_dashboard_hero.png`
- **Route**: `/` (Dashboard)
- **State**: Populated dashboard showing 4 KPI stat cards (Total Pipeline Value, Win Rate %, Active Proposals, Avg Deal Size), recent proposal cards, and client quick-links.
- **Key Elements in View**: Pipeline breakdown, status badges (`Accepted`, `In Review`, `Draft`), clean typography, header navigation.
- **Alt Tag**: *"PitchCraft AI Dashboard with proposal analytics, win rate charts, and revenue pipeline overview."*

---

### Screenshot 2: Client Brief Analyzer (8-Dimensional Extraction Modal)
- **Path**: `screenshots/02_brief_analyzer_modal.png`
- **Route**: `/generator`
- **State**: The **Analyze Brief** button clicked with the analysis results modal open.
- **Key Elements in View**: Form with input brief on the left; modal on the right showing structured tags for Objectives, Requirements, Deliverables, Constraints, Missing Information, and Execution Risks.
- **Alt Tag**: *"PitchCraft AI Client Brief Analyzer extracting 8 strategic dimensions from an unstructured client brief."*

---

### Screenshot 3: Multi-Tab Proposal Editor (Overview & Strategy)
- **Path**: `screenshots/03_proposal_editor_overview.png`
- **Route**: `/editor/:id` (Tab 1: Strategic Overview)
- **State**: Proposal editor with document loaded. Executive Summary, Problem Understanding, and Strategic Objectives text areas populated.
- **Key Elements in View**: 5 navigation tabs (`Overview`, `Scope & Deliverables`, `Timeline`, `Pricing`, `Terms`), **Regenerate with AI** button, **Save Changes** button with status indicator.
- **Alt Tag**: *"PitchCraft AI Proposal Editor showing Executive Summary and selective AI regeneration trigger."*

---

### Screenshot 4: Scope Boundaries (Included vs. Excluded Scope)
- **Path**: `screenshots/04_scope_boundaries.png`
- **Route**: `/editor/:id` (Tab 2: Scope & Deliverables)
- **State**: Side-by-side or stacked grid showing **Included in Scope** (green accents) vs. **Explicitly Excluded (Out of Scope)** (red/amber accents).
- **Key Elements in View**: Deliverables checklist with add/delete triggers, bulleted scope lists preventing scope creep.
- **Alt Tag**: *"PitchCraft AI Scope Boundaries editor defining included deliverables and out-of-scope protections."*

---

### Screenshot 5: Phased Milestones & Sprint Timeline
- **Path**: `screenshots/05_milestones_timeline.png`
- **Route**: `/editor/:id` (Tab 3: Timeline & Sprints)
- **State**: Timeline summary narrative card followed by 3 phased milestone cards (e.g., *Phase 1: Architecture*, *Phase 2: Core Development*, *Phase 3: Deployment & QA*).
- **Key Elements in View**: Milestone title, duration tag (e.g., *Week 1–2*), description, deliverables list, and dollar allocation.
- **Alt Tag**: *"PitchCraft AI Milestone & Sprints editor showing phased project breakdown and timeline allocations."*

---

### Screenshot 6: Smart Pricing Calculator (Deterministic Margin Guard)
- **Path**: `screenshots/06_pricing_calculator.png`
- **Route**: `/calculator`
- **State**: Calculator populated with 80 hours @ $125/hr, $500 expenses, 15% contingency buffer.
- **Key Elements in View**: Input sliders/fields on the left; real-time summary cards on the right (Labor Cost: $10,000, Subtotal: $10,500, Contingency: $1,575, Final Quote: $12,075); **Sync to Proposal** button.
- **Alt Tag**: *"PitchCraft AI Smart Pricing Calculator computing labor costs, contingency buffers, and final quotes with deterministic math."*

---

### Screenshot 7: Executive PDF Document Preview
- **Path**: `screenshots/07_pdf_export_preview.png`
- **Route**: `/editor/:id` (Client Preview Mode or PDF Viewer)
- **State**: The rendered multi-page ReportLab PDF displayed in full elegance.
- **Key Elements in View**: ReportLab header banner, client contact meta block, executive summary, shaded quotation breakdown table, terms block, and running footer (`Page 1 of 3`).
- **Alt Tag**: *"PitchCraft AI vector PDF export generated natively via ReportLab with typography and pricing tables."*

---

### Screenshot 8: Selective Section AI Regeneration Modal
- **Path**: `screenshots/08_selective_regeneration_modal.png`
- **Route**: `/editor/:id`
- **State**: The **Regenerate Section** modal open over the editor.
- **Key Elements in View**: Section indicator (*Target: Executive Summary*), prompt directive textarea (*"Emphasize competitive urgency and cloud security"*), active model badge (*qwen3:4b*), **Regenerate Section** button.
- **Alt Tag**: *"PitchCraft AI selective section regeneration modal allowing inline prompt refinement without altering other sections."*

---

### Screenshot 9: Client CRM & Proposal History
- **Path**: `screenshots/09_client_crm_history.png`
- **Route**: `/clients`
- **State**: Client CRM list with search filter active. A client row expanded or detail drawer open showing contact details, total quoted, total paid, and proposal history table.
- **Key Elements in View**: Search bar, status badges (`Lead`, `Active`, `Past`), proposal count tag, safe delete protection.
- **Alt Tag**: *"PitchCraft AI Client CRM directory displaying client profiles and linked proposal history."*

---

### Screenshot 10: AI Freelance Business Tools (Cover Letter & Follow-Up)
- **Path**: `screenshots/10_ai_business_tools.png`
- **Route**: `/tools`
- **State**: AI Business Tools page showing the 3 sub-tools: Job Cover Letter Generator, Follow-Up Email Sequence, and Proposal Improvement Assistant.
- **Key Elements in View**: Form inputs, generated output card with **Copy to Clipboard** button and toast notification confirmation.
- **Alt Tag**: *"PitchCraft AI Business Tools suite generating custom cover letters and multi-stage follow-up emails."*

---

## 📐 Image Asset Directory Preparation
Save all captured images into:
```
/screenshots/
  ├── 01_dashboard_hero.png
  ├── 02_brief_analyzer_modal.png
  ├── 03_proposal_editor_overview.png
  ├── 04_scope_boundaries.png
  ├── 05_milestones_timeline.png
  ├── 06_pricing_calculator.png
  ├── 07_pdf_export_preview.png
  ├── 08_selective_regeneration_modal.png
  ├── 09_client_crm_history.png
  └── 10_ai_business_tools.png
```
