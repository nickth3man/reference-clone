# Linting and Formatting

This project uses different linting tools for the backend and frontend.

## Backend (Python)

The backend uses **Ruff** for linting and formatting Python code.

### Configuration
- Configuration is in `pyproject.toml`
- Ruff checks for code style, potential bugs, and enforces best practices

### Commands

**Lint backend code:**
```bash
ruff check backend/
```

**Auto-fix linting issues:**
```bash
ruff check backend/ --fix
```

**Format backend code:**
```bash
ruff format backend/
```

**Check formatting (without modifying files):**
```bash
ruff format backend/ --check
```

## Frontend (Next.js/TypeScript)

The frontend uses **ESLint** for linting and **Prettier** for formatting.

### Configuration
- ESLint config: `frontend/.eslintrc.json`
- Prettier config: `frontend/.prettierrc.json`

### Commands

**Lint frontend code:**
```bash
cd frontend
npm run lint
```

**Auto-fix linting issues:**
```bash
cd frontend
npm run lint:fix
```

**Format frontend code:**
```bash
cd frontend
npm run format
```

**Check formatting (without modifying files):**
```bash
cd frontend
npm run format:check
```

## Quick Reference

| Task | Backend Command | Frontend Command |
|------|----------------|------------------|
| Lint | `ruff check backend/` | `cd frontend && npm run lint` |
| Lint + Fix | `ruff check backend/ --fix` | `cd frontend && npm run lint:fix` |
| Format | `ruff format backend/` | `cd frontend && npm run format` |
| Format Check | `ruff format backend/ --check` | `cd frontend && npm run format:check` |

## Pre-commit Recommendations

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
