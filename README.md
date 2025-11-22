# Basketball Reference Clone

A full-stack basketball statistics dashboard with Python backend and Next.js frontend.

## Project Structure

```
.
├── backend/              # FastAPI backend
│   ├── app/             # Production application code
│   │   ├── main.py      # FastAPI app entry point
│   │   ├── database.py  # Database utilities
│   │   ├── models.py    # Data models
│   │   └── routers/     # API endpoints
│   └── scripts/         # Dev utilities (db inspection, debug, misc)
├── frontend/            # Next.js frontend
│   └── src/             # Source code
├── tests/               # Test suite
│   ├── integration/     # Integration tests (API tests)
│   └── unit/            # Unit tests
├── data/                # DuckDB database files
└── pyproject.toml       # Python project configuration
```

See [backend/README.md](./backend/README.md) for detailed backend structure.

## Linting & Formatting

This project uses modern, industry-standard linting tools:

- **Backend (Python)**: [Ruff](https://docs.astral.sh/ruff/) - An extremely fast Python linter and formatter
- **Frontend (TypeScript/React)**: [ESLint](https://eslint.org/) for linting + [Prettier](https://prettier.io/) for formatting

### Commands

**Backend:**
```bash
# Lint
ruff check backend/

# Lint and fix
ruff check backend/ --fix

# Format
ruff format backend/

# Check formatting (without modifying files)
ruff format backend/ --check
```

**Frontend:**
```bash
cd frontend

# Lint
npm run lint

# Lint and fix
npm run lint:fix

# Format
npm run format

# Check formatting (without modifying files)
npm run format:check
```

### Quick Reference

| Task | Backend Command | Frontend Command |
|------|----------------|------------------|
| Lint | `ruff check backend/` | `cd frontend && npm run lint` |
| Lint + Fix | `ruff check backend/ --fix` | `cd frontend && npm run lint:fix` |
| Format | `ruff format backend/` | `cd frontend && npm run format` |
| Format Check | `ruff format backend/ --check` | `cd frontend && npm run format:check` |

### Pre-commit Recommendations

Before committing, run:

```bash
# Backend
ruff check backend/ --fix
ruff format backend/

# Frontend
cd frontend
npm run lint:fix
npm run format
```

## Development

### Backend Setup

1. Install Python dependencies (if using a virtual environment)
2. Ruff is already installed globally

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

## Configuration Files

- `pyproject.toml` - Python project settings + Ruff configuration
- `frontend/.eslintrc.json` - ESLint rules for Next.js
- `frontend/.prettierrc.json` - Prettier formatting rules
- `frontend/next.config.mjs` - Next.js configuration
