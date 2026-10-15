# PitchCraft AI — Python FastAPI Backend & Database Layer

Production-ready FastAPI backend and database architecture for **PitchCraft AI**. Built with Python 3.11+, SQLAlchemy 2, Pydantic v2, Alembic migrations, SQLite & PostgreSQL dual-engine compatibility, ReportLab PDF streaming, and local Ollama inference.

---

## Architecture Overview

```
backend/
├── app/
│   ├── core/           # Logging redaction, centralized exception handlers
│   ├── models/         # SQLAlchemy 2 declarative models (Client, Proposal, AIGenerationHistory)
│   │   ├── base.py                 # UUIDMixin, TimestampMixin
│   │   ├── client.py               # Clients table model
│   │   ├── proposal.py             # Proposals table model (content_json, pricing_json)
│   │   └── generation_history.py   # AI Generation History table model
│   ├── schemas/        # Pydantic v2 schemas aligned with TypeScript types
│   │   ├── client.py               # Client create, update, response schemas
│   │   ├── proposal.py             # Proposal create, update, response schemas
│   │   ├── generation_history.py   # AI generation history schemas
│   │   ├── dashboard.py            # Real metrics schemas
│   │   ├── pricing.py              # Pricing calculation schemas
│   │   └── ai.py                   # Cover letter and follow-up schemas
│   ├── routers/        # Modular FastAPI API route controllers
│   │   ├── clients.py              # CRUD for /api/clients
│   │   ├── proposals.py            # CRUD, /generate, /status, /pdf for /api/proposals
│   │   ├── dashboard.py            # Real DB stats for /api/dashboard/stats
│   │   ├── pricing.py              # /api/pricing/calculate
│   │   ├── ai.py                   # /api/ai/cover-letter, /api/ai/follow-up
│   │   └── health.py               # System & AI health endpoints
│   ├── services/       # Business logic, repositories & third-party integrations
│   │   ├── client_service.py       # Client CRM queries, safe deletion logic
│   │   ├── proposal_service.py     # Proposal queries, JSON serialization, dashboard stats
│   │   ├── ollama_service.py       # Ollama LLM HTTP client with synthesis fallback
│   │   ├── pdf_service.py          # ReportLab executive proposal PDF builder
│   │   └── pricing_service.py      # Hourly margin and contingency formulas
│   ├── config.py       # Pydantic Settings & environment variables
│   ├── database.py     # Engine, SessionLocal, SQLite PRAGMA foreign keys, get_db
│   └── main.py         # FastAPI application entrypoint & persistent lifecycle
├── alembic/            # Database migration environment
│   ├── versions/
│   │   └── 001_initial_schema.py   # Initial migration for clients, proposals, ai_history
│   ├── env.py          # Alembic runner with SQLite batch mode & model metadata
│   └── script.py.mako  # Migration template
├── tests/              # Pytest test suite with in-memory SQLite fixtures
│   ├── conftest.py                 # DB session & FastAPI client fixtures
│   ├── test_database_layer.py      # ORM, cascades, search, rollback, persistence tests
│   ├── test_clients.py             # Client CRUD & safe deletion tests
│   ├── test_proposals.py           # Proposal CRUD, filtering, PDF tests
│   ├── test_pricing.py             # Formula calculation tests
│   └── test_ai.py                  # AI endpoints tests
├── seed.py             # Standalone synthetic demo data seeder script
├── scripts/
│   └── seed_demo_data.py           # CLI runner for seed script
├── alembic.ini         # Alembic configuration file
├── requirements.txt    # Python dependencies
└── .env.example        # Environment variable template
```

---

## Database Design & Schemas

### 1. `clients` Table
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | String(36) | Primary Key, UUID | Unique client identifier |
| `name` | String(255) | Not Null | Primary contact name |
| `email` | String(255) | Not Null, Index | Contact email address |
| `company` | String(255) | Not Null, Index | Client business or organization |
| `industry` | String(128) | Not Null | Industry sector |
| `phone` | String(64) | Nullable | Contact telephone |
| `website` | String(255) | Nullable | Client website URL |
| `status` | String(32) | Not Null, Index | Status: `lead`, `active`, `past` |
| `notes` | Text | Nullable | Account notes |
| `created_at` | DateTime | Not Null | Creation timestamp |
| `updated_at` | DateTime | Not Null | Last update timestamp |

### 2. `proposals` Table
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | String(36) | Primary Key, UUID | Unique proposal identifier |
| `client_id` | String(36) | Foreign Key (`clients.id`, ON DELETE CASCADE), Index | Linked CRM client |
| `project_title` | String(255) | Not Null, Index | Proposal headline |
| `project_brief` | Text | Not Null | Original client brief or requirements |
| `service_category` | String(64) | Not Null, Index | e.g., `web_development`, `full_stack`, `ui_ux_design` |
| `tone` | String(32) | Not Null | Tone: `executive`, `consultative`, `bold`, etc. |
| `currency` | String(16) | Not Null | Currency code: `USD`, `EUR`, `GBP`, `CAD`, `AUD`, `INR` |
| `content_json` | JSON | Not Null | Full document: executive summary, objectives, deliverables, milestones, scope, CTA |
| `pricing_json` | JSON | Not Null | Pricing breakdown: items, units, rates, total budget, payment terms, notes |
| `status` | String(32) | Not Null, Index | Workflow status: `draft`, `sent`, `in_review`, `accepted`, `rejected` |
| `created_at` | DateTime | Not Null | Creation timestamp |
| `updated_at` | DateTime | Not Null | Last update timestamp |

### 3. `ai_generation_history` Table
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | String(36) | Primary Key, UUID | Generation log ID |
| `proposal_id` | String(36) | Foreign Key (`proposals.id`, ON DELETE SET NULL), Index | Linked proposal (nullable) |
| `model_name` | String(64) | Not Null | Model name (e.g. `llama3.2`, `mistral`, `deepseek-r1`) |
| `generation_type` | String(64) | Not Null, Index | e.g. `proposal_full`, `cover_letter`, `follow_up`, `section_improve` |
| `duration_ms` | Integer | Not Null | LLM inference latency in milliseconds |
| `status` | String(32) | Not Null | Generation status: `success`, `failed` |
| `created_at` | DateTime | Not Null, Index | Request timestamp |

---

## Key Database Capabilities

1. **Dual SQLite & PostgreSQL Compatibility:**
   - Works with SQLite locally (`sqlite:///./pitchcraft.db`) and PostgreSQL in production (`postgresql://user:password@localhost:5432/pitchcraft_db`).
   - Foreign key constraints are enforced on SQLite via `PRAGMA foreign_keys=ON;` connection event listeners.
   - Alembic runs in batch mode on SQLite (`render_as_batch=True`) for flawless schema upgrades.

2. **Database Persistence Across Restarts:**
   - The application does not wipe or reset database tables on startup.
   - Data persists cleanly in `pitchcraft.db` or PostgreSQL between application restarts.

3. **Safe Deletion Behavior for Clients:**
   - If a client has linked proposals, deleting via `DELETE /api/clients/{id}` returns `409 Conflict` by default.
   - To cascade delete a client and their associated proposals safely, pass `?force=true` (`DELETE /api/clients/{id}?force=true`).

4. **Real Database Metrics:**
   - The `/api/dashboard/stats` endpoint queries the database directly to compute total proposals, active pipeline volume, win rate %, and total quoted vs won revenue.

5. **Search, Filtering, Sorting & Pagination:**
   - Case-insensitive search on proposals (`project_title`, `project_brief`, client name, company) and clients (`name`, `company`, `email`).
   - Filters on proposal `status`, `service_category`, and client `status`.
   - Dynamic sorting (`sort_by`, `sort_order`) and pagination (`skip`, `limit`).

---

## Setup & Running Commands

### 1. Virtual Environment & Dependencies
```bash
cd backend
python3 -m venv venv
source venv/bin/activate       # On Linux/macOS
# or: venv\Scripts\activate   # On Windows

pip install -r requirements.txt
```

### 2. Environment Configuration
```bash
cp .env.example .env
```
Default SQLite database file (`pitchcraft.db`) is configured automatically. For PostgreSQL:
```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/pitchcraft_db
```

### 3. Run Database Migrations
Apply all Alembic migrations to current database:
```bash
alembic upgrade head
```

To create a new migration in the future:
```bash
alembic revision --autogenerate -m "Add new column or table"
```

To roll back a migration:
```bash
alembic downgrade -1
```

### 4. Seed Demo Data (Standalone)
Populate database with rich synthetic clients, proposals, and AI generation history:
```bash
python seed.py
```
To clear and re-seed from scratch:
```bash
python seed.py --clear
```

### 5. Start the FastAPI Development Server
```bash
uvicorn app.main:app --reload --port 8000
```
- Interactive OpenAPI Docs (Swagger): `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`
- API Health Check: `http://localhost:8000/api/health`

### 6. Run Automated Tests
```bash
pytest -v
```
To run the database layer tests specifically:
```bash
pytest tests/test_database_layer.py -v
```
With test coverage:
```bash
pytest --cov=app tests/
```

---

## Local Ollama AI Generation System (Qwen3:4b)

PitchCraft AI includes an open-weight, locally hosted AI generation engine powered by **Ollama** and the **`qwen3:4b`** model.

### AI Capabilities
1. **Client Brief Analyzer (`POST /api/ai/analyze-brief`):**
   - Parses unstructured RFPs, emails, or discovery notes into 8 critical dimensions:
     - Client Objectives
     - Project Requirements
     - Expected Deliverables
     - Target Audience
     - Budget Constraints (explicitly labeled as assumption if unconfirmed)
     - Deadline (explicitly labeled as assumption if unconfirmed)
     - Missing Information (discovery questions to ask before kickoff)
     - Potential Project Risks (scope, tech, schedule)

2. **AI Proposal Generator (`POST /api/proposals/generate`):**
   - Generates complete, winning business proposals: title, executive summary, problem understanding, proposed solution, scope boundaries (included vs excluded), deliverables, timeline, assumptions & exclusions, terms & conditions, and call to action.
   - Computes deterministic pricing milestones (30% discovery / 45% staging / 25% launch) and hourly rate breakdowns.

3. **Cover Letter Generator (`POST /api/ai/cover-letter`):**
   - Creates personalized freelance cover letters from the brief and user-supplied competencies.
   - **Never invents qualifications, work experience, or testimonials.**

4. **Follow-Up Email Sequence Generator (`POST /api/ai/follow-up`):**
   - Multi-stage cadence messages: `gentle_nudge`, `value_add`, `urgent_closeout`, `contract_signing`.

5. **Proposal Improvement Assistant (`POST /api/ai/improve-section`):**
   - Polishes existing sections for specific strategic goals: `justify_higher_price`, `more_persuasive`, `clearer_scope`, `objection_proofing`.

6. **Selective Section Regeneration (`POST /api/proposals/{id}/regenerate-section`):**
   - Regenerates a single section without losing edits or custom pricing items in other sections.

### Ollama Environment Configuration
In `backend/.env`:
```env
OLLAMA_BASE_URL=http://127.0.0.1:11434
OLLAMA_MODEL=qwen3:4b
OLLAMA_TIMEOUT=120
```

### Starting Ollama & Pulling Qwen3:4b
```bash
# 1. Start Ollama local daemon
ollama serve

# 2. Pull Qwen3:4b model
ollama pull qwen3:4b

# 3. (Optional) Test model directly in CLI
ollama run qwen3:4b "Hello! Confirm you are running locally."
```

### AI Endpoints Reference
- `GET /api/ai/health` — Check Ollama connection, latency, and available models
- `GET /api/ai/models` — List locally pulled models
- `POST /api/ai/switch-model` — Switch active model at runtime (`{"model": "qwen3:4b"}`)
- `POST /api/ai/analyze-brief` — Extract 8 dimensions from unstructured client brief
- `POST /api/ai/cover-letter` — Generate zero-hallucination proposal cover letter
- `POST /api/ai/follow-up` — Generate multi-stage client follow-up email
- `POST /api/ai/improve-section` — Elevate wording, commercial ROI, and objection proofing
- `POST /api/ai/regenerate-section` — Standalone section regeneration
- `POST /api/proposals/generate` — Full proposal synthesis & database storage
- `POST /api/proposals/{id}/regenerate-section` — In-place selective section regeneration

### Automated Tests
```bash
# Run standalone unit tests with standard library
python3 backend/tests/test_standalone_ai.py

# Run full Pytest test suite (when pytest installed)
pytest tests/ -v
```

---

## Frontend Integration

The React 19 frontend is configured to communicate with the FastAPI backend via `VITE_API_URL` (default: `http://localhost:8000`).
The frontend automatically displays backend connection health and gracefully falls back to the client studio engine when offline.
