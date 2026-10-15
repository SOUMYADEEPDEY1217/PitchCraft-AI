# ⚡ PitchCraft AI — Open-Source AI Proposal Engine for Freelancers & Agencies

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Python 3.11+](https://img.shields.io/badge/python-3.11+-blue.svg)](https://www.python.org/downloads/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688.svg?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React 19](https://img.shields.io/badge/React-19.0-61DAFB.svg?logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6.svg?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind-v4.0-38B2AC.svg?logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Ollama](https://img.shields.io/badge/Ollama-Qwen3%3A4b-black.svg?logo=ollama&logoColor=white)](https://ollama.com)
[![Hacktoberfest 2026](https://img.shields.io/badge/Hacktoberfest-2026-orange.svg)](https://hacktoberfest.com)

> **Transform unstructured client briefs into executive-grade, mathematically verified project proposals in under 60 seconds using 100% local, privacy-first open-source AI.**

---

## 🌟 Overview

Freelancers and digital agencies lose up to 15 hours every week writing bespoke proposals, structuring scopes of work, and calculating risk contingency margins. Existing commercial tools cost $30–$80/month, route confidential client project briefs through third-party proprietary LLM APIs, and frequently suffer from hallucinated arithmetic.

**PitchCraft AI** solves this with an end-to-end, open-source proposal generation workstation powered by **Ollama** (`qwen3:4b`), **FastAPI**, **React 19**, and **ReportLab**. It enforces strict separation of concerns: AI synthesizes strategy and requirements, while a deterministic backend calculation engine guarantees mathematical accuracy on every dollar and hour.

---

## 🚀 Key Features

### 1. 🔍 Client Brief Analyzer (8-Dimensional Extraction)
- Ingests raw client job posts, discovery call transcripts, or RFP emails.
- Extracts **objectives, functional requirements, tangible deliverables, target audience, budget constraints, deadlines, missing discovery info, and execution risks**.

### 2. 📝 Advanced Multi-Section Proposal Editor
- Fully editable document structure across 5 categorized tabs:
  - **Overview**: Executive Summary, Problem Understanding, Strategic Objectives.
  - **Scope & Deliverables**: Deliverables checklist, Included Scope, Excluded Scope, Assumptions & Exclusions.
  - **Timeline**: Estimated Schedule, Phased Milestone Sprints.
  - **Investment**: Line-item quotation, hourly rates, contingency margins, and pricing notes.
  - **Terms & Legal**: Payment milestones, client responsibilities, terms and conditions, call to action.
- **Selective Section Regeneration**: Re-prompt individual sections using Ollama without altering the rest of your proposal.
- **Duplicate Proposals**: Clone existing proposals with a single click.
- **Live Client Preview**: Dual-mode executive document preview with client print layout.
- **Unsaved Changes Guard**: Built-in navigation warning prevents accidental loss of edits.

### 3. 🧮 Smart Pricing & Margin Calculator
- Deterministic formula calculation:
  $$\text{Labor Cost} = \text{Estimated Hours} \times \text{Hourly Rate}$$
  $$\text{Subtotal} = \text{Labor Cost} + \text{Direct Expenses}$$
  $$\text{Contingency} = \text{Subtotal} \times \left(\frac{\text{Contingency } \%}{100}\right)$$
  $$\text{Final Quote} = \text{Subtotal} + \text{Contingency}$$
- **Zero Financial Hallucination**: AI is prohibited from inventing arbitrary numbers; calculations are strictly computed on the backend.
- One-click sync from calculator to active proposal quotation schedule.

### 4. 📄 Executive PDF Export (ReportLab Native)
- Generates polished, print-ready multi-page PDF documents.
- Includes cover styling, metadata headers, clear typography, dynamic pricing tables, terms & conditions, and automated running headers & footers with page numbering.
- Resilient Unicode text normalization and offline binary generation fallback.

### 5. 👥 Client CRM & Proposal Tracking
- Comprehensive client management: create, edit, search, filter, and track client proposal histories.
- Proposal status lifecycle: `Draft` ➔ `Sent` ➔ `In Review` ➔ `Accepted` ➔ `Declined`.
- Real-time dashboard KPI metrics: Total Revenue Pipeline, Active Win Rate, Average Deal Size, and Proposal Status distribution charts.
- Safe deletion guardrails: prevents accidental removal of clients with active proposal records.

### 6. 💼 AI Freelance Business Tools
- **Tailored Cover Letter Generator**: Synthesizes custom pitches for job boards based strictly on verified freelancer skills.
- **Multi-Stage Follow-Up Generator**: Automated gentle nudge, value-add check-in, and closing emails based on days elapsed since submission.
- **Proposal Section Polisher**: Strategic improvement assistant that optimizes sections for persuasion, pricing justification, or risk elimination.

---

## 🏗️ Architecture & Technology Stack

```
                          ┌──────────────────────────────────────┐
                          │         React 19 + TypeScript        │
                          │        Tailwind CSS + Lucide         │
                          │   (Interactive Client Workstation)   │
                          └──────────────────┬───────────────────┘
                                             │ HTTP REST / JSON
                                             ▼
                          ┌──────────────────────────────────────┐
                          │          FastAPI 0.115+ (Python)     │
                          │       Deterministic Math Engine      │
                          │         ReportLab PDF Service        │
                          └──────────┬────────────────┬──────────┘
                                     │                │
             SQLAlchemy 2.0 (ORM)    │                │  HTTP REST (Local)
                                     ▼                ▼
                     ┌──────────────────┐    ┌──────────────────┐
                     │ PostgreSQL /     │    │  Ollama Engine   │
                     │ SQLite Database  │    │  (Qwen3:4b LLM)  │
                     └──────────────────┘    └──────────────────┘
```

| Layer | Technologies | Purpose |
| :--- | :--- | :--- |
| **Frontend** | React 19, TypeScript, Tailwind CSS v4, Lucide Icons, Recharts | Fast, responsive client-side interface with zero-pill design and offline storage cache. |
| **Backend API** | FastAPI, Pydantic v2, Uvicorn, Python 3.11+ | High-throughput asynchronous REST API with strict request validation. |
| **Database** | SQLite (Dev) / PostgreSQL (Production), SQLAlchemy 2.0, Alembic | Relational persistence with JSON structured content storage and relational integrity. |
| **Local AI** | Ollama, Qwen3:4b (or Llama 3.2 / Mistral) | High-speed local LLM inference without per-request token billing or external API dependencies. |
| **Document Engine** | ReportLab 4.0+ / 5.0+ | Vector-grade PDF document rendering with headers, footers, and table layout styling. |

---

## 🛠️ Quickstart Guide

### Prerequisites
1. **Python 3.11+** installed (`python3 --version`)
2. **Node.js 20+** installed (`node --version`)
3. **Ollama** installed and running locally ([Download Ollama](https://ollama.com))

### 1. Start Ollama and Pull the Model
```bash
# Start Ollama service
ollama serve

# Pull the lightweight, high-performance Qwen3 model
ollama pull qwen3:4b
```

### 2. Configure and Run Backend
```bash
cd backend

# Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy environment variables
cp .env.example .env

# Run database migrations / initialize tables
python3 -m app.main

# Start development server
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
The FastAPI interactive documentation will be live at `http://localhost:8000/docs`.

### 3. Configure and Run Frontend
```bash
# In project root
npm install

# Start Vite development server
npm run dev
```
Open `http://localhost:3000` in your browser.

---

## 🐳 Docker Deployment

To run the complete PitchCraft AI stack with a single command:

```bash
docker compose up -d --build
```

Configuration files:
- `backend/Dockerfile`: Multi-stage Python 3.11 Alpine/Debian image with non-root security.
- `docker-compose.yml`: Orchestrates PostgreSQL, FastAPI backend, and React web service.

---

## 🧪 Testing Suite

### Backend Unit & Integration Tests (Pytest)
```bash
# Run the complete test suite
PYTHONPATH=backend pytest backend/tests -v

# Run database persistence and rollback tests
PYTHONPATH=backend pytest backend/tests/test_database_layer.py -v

# Run standalone zero-dependency AI logic tests
python3 backend/tests/test_standalone_ai.py
```

### Frontend Typecheck & Build
```bash
# TypeScript compiler validation
npm run lint

# Production bundle compilation
npm run build
```

---

## 🔒 Privacy & Open-Source Sovereignty

- **100% Local Inference**: Client briefs, pricing formulas, and proprietary client terms never leave your hardware.
- **Zero API Invoices**: Never pay per-token fees to OpenAI, Anthropic, or proprietary providers.
- **Model Agnostic**: Seamlessly toggle between `qwen3:4b`, `llama3.2`, `mistral`, or any custom fine-tuned model supported by Ollama.
- **Offline Resilience**: PitchCraft AI operates completely offline once models are downloaded locally.

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

## 🤝 Contributing

Contributions are welcome! Please read `CONTRIBUTING.md` for guidelines on submitting pull requests and filing issues.
