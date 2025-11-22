# Basketball Reference Clone

A full-stack basketball statistics dashboard with Python backend and Next.js frontend.

## Project Structure

```
.
├── backend/           # FastAPI backend
├── frontend/          # Next.js frontend
├── database/          # DuckDB database files
└── pyproject.toml     # Python project configuration
```

## Linting & Formatting

This project uses modern, industry-standard linting tools:

- **Backend (Python)**: [Ruff](https://docs.astral.sh/ruff/) - An extremely fast Python linter and formatter
- **Frontend (TypeScript/React)**: [ESLint](https://eslint.org/) for linting + [Prettier](https://prettier.io/) for formatting

See [LINTING.md](./LINTING.md) for detailed commands and configuration.


**Backend:**
```bash
# Lint
ruff check backend/

# Lint covering auto-fixable errors
ruff check backend/ --fix

# Format
ruff format backend/
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
