# Contributing to PitchCraft AI

Thank you for your interest in contributing to **PitchCraft AI**! We welcome bug fixes, documentation improvements, new proposal templates, model integrations, and UI enhancements.

## Code of Conduct
We are committed to providing a welcoming, inclusive, and harassment-free environment for all contributors. Please be respectful and constructive in all discussions.

## How to Contribute

### 1. Reporting Bugs
- Search existing GitHub Issues before opening a new one.
- Provide a clear, descriptive title.
- Include step-by-step reproduction instructions, system environment details (OS, Python version, Node.js version, Ollama version), and full error logs.

### 2. Suggesting Features
- Open an Issue with the prefix `[Feature Request]:`.
- Describe the use case, why this helps freelancers or agencies, and any proposed UX or API designs.

### 3. Submitting Pull Requests (PRs)
1. Fork the repository and create your branch from `main`:
   ```bash
   git checkout -b feature/my-awesome-improvement
   ```
2. Follow code standards:
   - **Frontend**: React 19, TypeScript, Tailwind CSS. Run `npm run lint` before committing.
   - **Backend**: Python 3.11+, FastAPI, SQLAlchemy 2, Pydantic v2. Run `PYTHONPATH=backend pytest backend/tests` to verify tests pass.
3. Keep commits atomic, clean, and well-described.
4. Ensure no hardcoded secrets, test API keys, or machine-specific paths are committed.
5. Submit your PR against the `main` branch with a clear summary of changes.

## Development Guidelines
- **Deterministic Math**: Never delegate financial arithmetic (labor cost, subtotal, contingency, final quote) to the LLM. Keep calculations strictly inside the deterministic backend math engine.
- **Pydantic Validation**: All API request/response payloads must use strict Pydantic schemas with camelCase aliases for seamless frontend compatibility.
- **Local Privacy**: PitchCraft AI prioritizes local model inference through Ollama. Any cloud inference option must remain opt-in and configurable.

Thank you for helping build an open-source alternative for the freelance economy!
