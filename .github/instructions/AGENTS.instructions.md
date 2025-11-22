---
applyTo: '**'
---
# CLAUDE.md - AI Assistant Guide for Basketball Reference Clone

This document provides comprehensive guidance for AI assistants working on the Basketball Reference Clone (HoopsClone) codebase. It combines operational methodology, codebase structure, development workflows, and key conventions.

---

# Core Operational Directive: The Baby Steps Methodology

**Preamble:** You are to operate under a single, overriding principle: the **Baby Steps Methodology**. Every action you take, every line of code you write, and every plan you formulate must adhere to this directive. Your primary goal is not just to complete tasks, but to demonstrate and internalize the process of _how_ they are accomplished. Remember, for every task, **the process is the product**. You must always take **Baby Steps**.

## The Unbreakable Rules of Baby Steps

You must follow these six rules without exception. They are the foundation of your operational logic.

1. **Rule 1: The Smallest Possible Meaningful Change.** You must always break down any task into the smallest possible meaningful change. Never attempt to accomplish multiple things at once. Each action must be a single, atomic step that can be clearly understood and validated. You will always take **Baby Steps**.

2. **Rule 2: The Process is the Product.** You must always remember that your ultimate goal is to understand and demonstrate _how_ a task is done. The journey of learning and execution is more important than the final destination. Reinforce this in your thinking; **the process is the product**.

3. **Rule 3: One Substantive Accomplishment at a Time.** You must focus on one, and only one, substantive accomplishment at a time. Do not move on to a new task or a new component until the current one is fully complete. This singular focus is how you take **Baby Steps**.

4. **Rule 4: Complete Each Step Fully.** You must ensure that each step is brought to a state of completion before starting the next. A step is not "done" until it is implemented, validated, and documented. There are no shortcuts; you must always complete each of the **Baby Steps**.

5. **Rule 5: Incremental Validation is Mandatory.** You must validate your work after every single step. Do not assume a change works. Verify it. This constant feedback loop is critical to the methodology. You must validate every one of your **Baby Steps**.

6. **Rule 6: Document Every Step with Focus.** You must document every change with specific, focused detail. Your changelogs and progress reports are not an afterthought; they are an integral part of the process. Because **the process is the product**, the documentation is as critical as the code itself.

**Concluding Reinforcement:** Your entire operational model is defined by this directive. By consistently applying these six rules, you will ensure that every action is deliberate, every outcome is understood, and every project is a testament to the power of methodical, incremental progress.

Always take **Baby Steps**. Always remember **the process is the product**.

---

# Project Overview

## What is This Project?

**Basketball Reference Clone (HoopsClone)** is a full-stack web application that replicates the functionality of Basketball-Reference.com. It provides comprehensive NBA statistics, team information, player profiles, and game data through a modern web interface backed by a RESTful API.

## Application Architecture

**Type:** Full-Stack Web Application (Monorepo)
- RESTful API Backend Service (FastAPI)
- Server-Side Rendered Frontend Application (Next.js)
- Containerized Microservices Architecture (Docker Compose)

## Technology Stack

### Backend
- **Language:** Python 3.10+
- **Framework:** FastAPI (async web framework)
- **Server:** Uvicorn (ASGI server)
- **Database:** DuckDB (embedded analytical database)
- **Data Processing:** Pandas, NumPy
- **Validation:** Pydantic (type-safe data models)
- **Linting:** Ruff (fast Python linter/formatter)
- **Type Checking:** MyPy (strict mode)
- **Testing:** Pytest

### Frontend
- **Framework:** Next.js 14.2.16 (Pages Router)
- **UI Library:** React 18.3.1
- **Language:** TypeScript 5.x
- **Styling:** Tailwind CSS 4.x (alpha), PostCSS
- **Icons:** Lucide React 0.460.0
- **Linting:** ESLint 8 + eslint-config-next
- **Formatting:** Prettier 3.6.2

### Infrastructure
- **Containerization:** Docker
- **Orchestration:** Docker Compose
- **Development Ports:**
  - Backend: 8001 (host) → 8000 (container)
  - Frontend: 3002 (host) → 3000 (container)

---

# Codebase Structure

```
reference-clone/
├── backend/                    # Python/FastAPI backend
│   ├── app/                   # Production application code
│   │   ├── __init__.py
│   │   ├── main.py           # FastAPI app entry point
│   │   ├── database.py       # Database utilities
│   │   ├── models.py         # Pydantic models (5 models, 143 lines)
│   │   └── routers/          # API endpoint handlers
│   │       ├── __init__.py
│   │       ├── games.py      # Game endpoints (72 lines)
│   │       ├── players.py    # Player endpoints (115 lines)
│   │       └── teams.py      # Team endpoints (68 lines)
│   ├── scripts/              # Development utilities
│   │   ├── db_inspection/   # Database inspection tools
│   │   └── debug/           # Debugging utilities
│   ├── Dockerfile           # Backend container config
│   ├── pyproject.toml       # Python project + Ruff config
│   ├── requirements.txt     # Runtime dependencies
│   └── README.md           # Backend documentation
│
├── frontend/                 # Next.js/React frontend
│   ├── src/
│   │   ├── components/      # Reusable React components
│   │   │   ├── Hero.tsx
│   │   │   ├── Layout.tsx
│   │   │   └── Navbar.tsx
│   │   ├── pages/           # Next.js pages (file-based routing)
│   │   │   ├── _app.tsx     # App wrapper
│   │   │   ├── _document.tsx # Document wrapper
│   │   │   ├── index.tsx    # Home page
│   │   │   ├── games/       # Game pages
│   │   │   ├── players/     # Player pages
│   │   │   └── teams/       # Team pages
│   │   └── styles/
│   │       └── globals.css  # Global styles + Tailwind
│   ├── public/              # Static assets
│   ├── Dockerfile          # Frontend container config
│   ├── package.json        # NPM dependencies + scripts
│   ├── tsconfig.json       # TypeScript config
│   ├── next.config.mjs     # Next.js config
│   ├── .eslintrc.json      # ESLint rules
│   └── .prettierrc.json    # Prettier config
│
├── tests/                   # Test suite
│   ├── integration/        # Integration tests
│   │   └── test_endpoints.py
│   └── unit/               # Unit tests (placeholder)
│
├── data/                    # Database files
│   └── nba.duckdb          # DuckDB database
│
├── plan/                    # Project planning
│   └── basketball-reference-clone-spec.md  # Detailed spec
│
├── docker-compose.yml      # Multi-container orchestration
├── README.md               # Main project documentation
├── CLAUDE.md               # This file - AI assistant guide
├── LINTING.md              # Linting documentation
└── implementation_plan.md  # Implementation roadmap
```

**Total Backend Code:** ~470 lines of Python (app/ directory, excluding scripts)

---

# Key Entry Points & Main Modules

## Backend Entry Points

### Main Application (`backend/app/main.py`)
- FastAPI application initialization
- CORS middleware (allows localhost:3000, 3002, 8000, 8001)
- Router registration (teams, players, games)
- Health check endpoint: `GET /health`
- Root endpoint: `GET /`

### Database Module (`backend/app/database.py`)
- `get_db_connection()` - DuckDB connection factory
- `execute_query()` - Execute SQL and return raw results
- `execute_query_df()` - Execute SQL and return Pandas DataFrame
- Default DB path: `../data/nba.duckdb`

### API Routers

**Teams Router** (`/teams`):
- `GET /teams` - List all teams
- `GET /teams/{team_id}` - Get team details
- `GET /teams/{team_id}/players` - Get team roster

**Players Router** (`/players`):
- `GET /players` - List/search players (pagination support)
- `GET /players/{player_id}` - Get player details
- `GET /players/{player_id}/stats` - Get player season stats

**Games Router** (`/games`):
- `GET /games` - List games (filter by date/team)
- `GET /games/{game_id}` - Get game details
- `GET /games/{game_id}/stats` - Get advanced game stats

## Frontend Entry Points

### App Entry (`frontend/src/pages/_app.tsx`)
- Global layout wrapper using Layout component
- All pages wrapped with consistent navigation and footer

### Main Pages (File-based Routing)
- `/` - Home page with featured teams
- `/teams` - All teams listing with search
- `/teams/[team_id]` - Team detail page
- `/players` - Player search/listing
- `/players/[player_id]` - Player profile
- `/games` - Games listing
- `/games/[game_id]` - Game box score

### Components
- `Layout.tsx` - Main layout with Navbar and footer
- `Navbar.tsx` - Navigation with search functionality
- `Hero.tsx` - Homepage hero section

---

# Data Models

The application defines 5 main Pydantic models in `backend/app/models.py`:

1. **Team** (22 fields): Team information
   - team_id, abbreviation, nickname, city, arena, colors, etc.

2. **Player** (58 fields): Player information
   - person_id, names, birthdate, physical attributes, career info

3. **Game** (17 fields): Game information
   - game_id, dates, teams, scores, season info

4. **PlayerStats** (33 fields): Season statistics
   - Per-game stats, shooting percentages, rebounds, assists

5. **GameStats** (24 fields): Advanced game statistics
   - Paint points, turnovers, rebounds by team

All models use Pydantic for runtime validation and JSON serialization.

---

# Database Structure

**Database:** DuckDB (embedded analytical database)
**Location:** `/data/nba.duckdb` (in container), `./data/nba.duckdb` (on host)

**Tables:**
- `team_details` - Team information
- `common_player_info` - Detailed player information
- `player` - Basic player records (id, full_name, first_name, last_name)
- `player_stats_per_game` - Season statistics
- `game` - Game records
- `other_stats` - Advanced game statistics

**Important:** All API endpoints replace NaN values with None for JSON compatibility using:
```python
df = df.replace({np.nan: None})
```

---

# Development Workflows

## Local Development Setup

### Backend Setup
1. Ensure Python 3.10+ is installed
2. Install dependencies (if using virtual environment)
3. Ruff is already installed globally
4. Run backend:
   ```bash
   cd backend
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

### Frontend Setup
1. Ensure Node.js 20+ is installed
2. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```
3. Run frontend:
   ```bash
   npm run dev
   ```

### Docker Development
**Recommended approach for consistent environments:**
```bash
# Start all services
docker-compose up

# Start in detached mode
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## API Documentation

When the backend is running, access:
- **Swagger UI:** http://localhost:8001/docs
- **ReDoc:** http://localhost:8001/redoc

## Testing

### Integration Tests
```bash
# Backend must be running
pytest tests/integration/test_endpoints.py
```

### Unit Tests
Unit test directory exists but tests need to be implemented.

---

# Code Quality & Conventions

## Python Code Conventions

### Style Guidelines
- **Line Length:** 100 characters maximum
- **Quotes:** Double quotes for strings
- **Indentation:** 4 spaces
- **Type Hints:** Required for all functions (MyPy strict mode)
- **Imports:** Sorted using isort (part of Ruff)

### Linting Commands
```bash
# Lint backend code
ruff check backend/

# Auto-fix linting issues
ruff check backend/ --fix

# Format backend code
ruff format backend/

# Check formatting (without modifying files)
ruff format backend/ --check

# Type checking
mypy backend/
```

### Ruff Configuration (`pyproject.toml`)
- **Enabled Rules:** pycodestyle (E/W), pyflakes (F), isort (I), pep8-naming (N), pyupgrade (UP), flake8-bugbear (B), flake8-comprehensions (C4), flake8-simplify (SIM), Ruff-specific (RUF)
- **Ignored Rules:** E501 (line too long - handled by formatter), B008 (function calls in defaults - FastAPI pattern)
- **Target Version:** Python 3.10+

### Backend Code Patterns

**Error Handling:**
```python
from fastapi import HTTPException

try:
    # Database operation
    df = execute_query_df(query, params)
    if df.empty:
        raise HTTPException(status_code=404, detail="Resource not found")

    # Replace NaN with None for JSON
    df = df.replace({np.nan: None})
    return df.to_dict(orient="records")
except HTTPException:
    raise  # Re-raise HTTP exceptions
except Exception as e:
    raise HTTPException(status_code=500, detail=str(e)) from e
```

**Router Pattern:**
```python
from fastapi import APIRouter

router = APIRouter()

@router.get("/resource", response_model=list[ResourceModel])
def get_resources() -> list[dict[str, Any]]:
    # Implementation
    pass
```

**Type Hints:**
```python
# Always use modern Python 3.10+ type hints
def function_name(param: str) -> dict[str, Any]:
    # Use dict[str, Any] instead of Dict[str, Any]
    # Use list[Type] instead of List[Type]
    pass
```

## TypeScript/React Code Conventions

### Style Guidelines
- **Line Length:** 100 characters maximum
- **Quotes:** Double quotes preferred (enforced by Prettier)
- **Indentation:** 2 spaces
- **Semi-colons:** Required
- **Type Safety:** Strict TypeScript mode enabled

### Linting Commands
```bash
cd frontend

# Lint
npm run lint

# Lint and auto-fix
npm run lint:fix

# Format
npm run format

# Check formatting (without modifying files)
npm run format:check
```

### Frontend Code Patterns

**Component Structure:**
```typescript
interface ComponentProps {
  children: React.ReactNode;
  // Other props...
}

const Component = ({ children }: ComponentProps) => {
  return (
    <div className="...">
      {children}
    </div>
  );
};

export default Component;
```

**Path Aliases:**
- Use `@/` for src directory: `import Layout from "@/components/Layout"`
- Configured in `tsconfig.json`

**Styling:**
- Use Tailwind CSS utility classes
- Follow mobile-first responsive design
- Use semantic color names (slate-50, slate-900, etc.)

**Page Structure (Pages Router):**
```typescript
// pages/resource/[id].tsx
import type { GetServerSideProps } from "next";

interface PageProps {
  data: ResourceType;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params!;
  // Fetch data...
  return { props: { data } };
};

export default function ResourcePage({ data }: PageProps) {
  return <div>...</div>;
}
```

## Pre-commit Checklist

Before committing code, always run:

**Backend:**
```bash
ruff check backend/ --fix
ruff format backend/
mypy backend/
```

**Frontend:**
```bash
cd frontend
npm run lint:fix
npm run format
```

**Root Level (convenience scripts):**
```bash
npm run lint:frontend:fix
npm run format:frontend
```

---

# Git Workflow & Branching

## Current Branch
- **Development Branch:** `claude/claude-md-mi9wzz3zq370n9ok-01LNToMuKzGNEhX1yia34M9g`
- All development work should be done on this branch
- Follow Baby Steps methodology for all commits

## Commit Message Guidelines

Follow conventional commit format:
```
type(scope): brief description

Longer description if needed (explain WHY, not WHAT)
```

**Types:**
- `feat:` - New feature
- `fix:` - Bug fix
- `refactor:` - Code restructuring without behavior change
- `docs:` - Documentation changes
- `style:` - Formatting, missing semi-colons, etc.
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

**Examples:**
```
feat(api): add player season stats endpoint

Implements GET /players/{id}/stats endpoint to retrieve
per-game season statistics for a player.

fix(teams): handle NaN values in team roster response

Replace NaN with None to ensure JSON serialization works
correctly for missing player data.
```

## Recent Development Activity

Based on recent commits:
1. Codebase reorganization for better modularity
2. Import path updates to new app module structure
3. Removal of Makefile in favor of direct commands
4. Removal of GEMINI.md operational directive

---

# AI Assistant Guidelines

## When Working on This Codebase

### 1. Always Follow Baby Steps Methodology
- Break tasks into smallest possible meaningful changes
- Validate after each step
- Document every change
- Never skip steps or batch unrelated changes

### 2. Understand Before Modifying
- **CRITICAL:** Always read files before modifying them
- Understand existing patterns and conventions
- Maintain consistency with existing code style
- Don't introduce new patterns without discussion

### 3. Type Safety is Mandatory
- Backend: Add type hints to all functions
- Frontend: Use TypeScript types for all props and state
- Run type checkers before committing
- Never use `any` type unless absolutely necessary

### 4. Code Quality Standards
- **Backend:** All code must pass Ruff linting and MyPy type checking
- **Frontend:** All code must pass ESLint and Prettier checks
- Fix linting issues immediately, don't accumulate technical debt
- Follow the project's existing code style

### 5. Error Handling Patterns
- **Backend:** Use HTTPException for API errors
- Always include meaningful error messages
- Handle edge cases (empty results, NaN values, etc.)
- Re-raise HTTPExceptions, don't catch and swallow them

### 6. Testing Requirements
- Integration tests are in `tests/integration/`
- Test all new API endpoints
- Validate response structure and status codes
- Test edge cases and error conditions

### 7. Documentation Requirements
- Update relevant README files when changing structure
- Document new API endpoints
- Add comments for complex logic (not obvious code)
- Keep CLAUDE.md updated with new conventions

### 8. Database Interactions
- Always use `execute_query_df()` for queries returning data
- Replace NaN with None for JSON serialization
- Use parameterized queries to prevent SQL injection
- Handle empty results gracefully

### 9. API Development
- Follow REST conventions
- Use appropriate HTTP status codes
- Include response models in route decorators
- Group related endpoints in routers

### 10. Frontend Development
- Use Next.js Pages Router patterns
- Implement server-side rendering where appropriate
- Follow component composition patterns
- Use Tailwind for all styling

## Common Tasks & Examples

### Adding a New API Endpoint

**Baby Steps Process:**

1. **Step 1:** Define Pydantic model in `backend/app/models.py`
2. **Step 2:** Create or update router in `backend/app/routers/`
3. **Step 3:** Add database query function if needed
4. **Step 4:** Implement endpoint handler with error handling
5. **Step 5:** Test endpoint manually using Swagger UI
6. **Step 6:** Add integration test
7. **Step 7:** Document in README or API docs

**Example:**
```python
# Step 1: Model (models.py)
class ResourceResponse(BaseModel):
    id: int
    name: str
    description: str | None

# Step 2: Router (routers/resource.py)
from fastapi import APIRouter, HTTPException
from app.models import ResourceResponse

router = APIRouter()

# Step 4: Implementation
@router.get("/resources/{resource_id}", response_model=ResourceResponse)
def get_resource(resource_id: int) -> dict[str, Any]:
    query = "SELECT id, name, description FROM resources WHERE id = ?"
    try:
        df = execute_query_df(query, [resource_id])
        if df.empty:
            raise HTTPException(status_code=404, detail="Resource not found")

        df = df.replace({np.nan: None})
        return df.to_dict(orient="records")[0]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e

# Step 3: Register in main.py
from app.routers import resource
app.include_router(resource.router, tags=["Resources"])
```

### Adding a New Frontend Page

**Baby Steps Process:**

1. **Step 1:** Create page file in `frontend/src/pages/`
2. **Step 2:** Define TypeScript interfaces for props
3. **Step 3:** Implement data fetching (getServerSideProps or getStaticProps)
4. **Step 4:** Create page component with proper typing
5. **Step 5:** Add styling with Tailwind classes
6. **Step 6:** Test in browser at all breakpoints
7. **Step 7:** Add navigation link if needed

**Example:**
```typescript
// pages/resources/[id].tsx

import type { GetServerSideProps } from "next";

interface Resource {
  id: number;
  name: string;
  description: string | null;
}

interface ResourcePageProps {
  resource: Resource;
}

export const getServerSideProps: GetServerSideProps<ResourcePageProps> = async (context) => {
  const { id } = context.params!;
  const res = await fetch(`http://localhost:8000/resources/${id}`);

  if (!res.ok) {
    return { notFound: true };
  }

  const resource = await res.json();
  return { props: { resource } };
};

export default function ResourcePage({ resource }: ResourcePageProps) {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-slate-900 mb-4">
        {resource.name}
      </h1>
      {resource.description && (
        <p className="text-slate-700">{resource.description}</p>
      )}
    </div>
  );
}
```

## Development Utilities

### Backend Scripts

**Database Inspection:**
```bash
# List all tables
python backend/scripts/db_inspection/list_tables.py

# Inspect schema
python backend/scripts/db_inspection/inspect_schema.py

# Check specific data
python backend/scripts/db_inspection/check_players.py
python backend/scripts/db_inspection/check_teams.py
python backend/scripts/db_inspection/check_games.py
```

**Debugging:**
```bash
# Test database connection
python backend/scripts/debug/test_db.py

# Reproduce specific errors
python backend/scripts/debug/reproduce_error.py
```

---

# Security Considerations

## Current Security Measures
1. **Non-root Users:** Both Docker containers run as non-root users
2. **CORS:** Configured for local development only
3. **Dependency Security:** glob package overridden to patch vulnerabilities
4. **Health Checks:** Both services have health monitoring

## Security Best Practices
1. **Never commit secrets:** Use environment variables for sensitive data
2. **Parameterized Queries:** Always use placeholders for SQL parameters
3. **Input Validation:** Pydantic models validate all API inputs
4. **Error Messages:** Don't expose sensitive information in error messages

---

# Troubleshooting

## Common Issues

### Backend Issues

**Issue: Database not found**
- Check that `data/nba.duckdb` exists
- Verify DB_PATH environment variable in docker-compose.yml
- Ensure volume mount is correct

**Issue: Import errors**
- Verify you're using absolute imports: `from app.module import ...`
- Check that `__init__.py` files exist in all package directories
- Run from project root, not backend directory

**Issue: CORS errors**
- Verify frontend is running on port 3002
- Check CORS origins in `backend/app/main.py`
- Ensure both services are running

### Frontend Issues

**Issue: API calls failing**
- Verify backend is running on port 8001
- Check API URL in fetch calls
- Inspect browser network tab for errors

**Issue: Type errors**
- Run `npm run build` to see all type errors
- Check TypeScript version compatibility
- Verify type definitions are installed

**Issue: Styling not applied**
- Check Tailwind CSS is installed
- Verify PostCSS config is correct
- Rebuild to regenerate CSS

## Docker Issues

**Issue: Container won't start**
- Check Docker logs: `docker-compose logs backend` or `docker-compose logs frontend`
- Verify Dockerfile syntax
- Ensure ports aren't already in use

**Issue: Changes not reflected**
- Verify volume mounts in docker-compose.yml
- Restart containers: `docker-compose restart`
- Check file permissions

---

# Implementation Roadmap

See `implementation_plan.md` for current priorities:
1. Frontend Security Upgrade (Next.js)
2. Frontend Linting & Configuration
3. Backend Linting
4. Infrastructure Hardening
5. Final Verification

---

# Additional Resources

## Documentation Files
- `README.md` - Project overview and quick start
- `LINTING.md` - Comprehensive linting guide
- `backend/README.md` - Backend-specific documentation
- `frontend/README.md` - Frontend-specific documentation
- `tests/README.md` - Testing documentation
- `plan/basketball-reference-clone-spec.md` - Detailed specification (1,581 lines)

## External Documentation
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Ruff Documentation](https://docs.astral.sh/ruff/)
- [Pydantic Documentation](https://docs.pydantic.dev/)
- [DuckDB Documentation](https://duckdb.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

---

# Summary for AI Assistants

When working on this codebase:

1. **Follow Baby Steps Methodology** - Break everything into small, validated steps
2. **Read before modifying** - Always understand existing code first
3. **Maintain type safety** - Use type hints and strict TypeScript
4. **Run linters** - Fix issues immediately, maintain code quality
5. **Handle errors properly** - Use established patterns for error handling
6. **Replace NaN with None** - Always handle NaN in API responses
7. **Test your changes** - Validate using API docs and manual testing
8. **Document as you go** - Update docs when changing structure
9. **Follow conventions** - Match existing code style and patterns
10. **Commit meaningfully** - Write clear commit messages explaining WHY

**Most Important:** The process is the product. Take your time, validate each step, and ensure every change is deliberate and well-understood.

---

*Last Updated: 2025-11-22*
*Codebase Version: Development Branch `claude/claude-md-mi9wzz3zq370n9ok-01LNToMuKzGNEhX1yia34M9g`*
