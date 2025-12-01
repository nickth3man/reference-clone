# Codebase Restructuring Plan

## Executive Summary

This document proposes a comprehensive restructuring plan for the Basketball Reference Clone project to improve modularity, maintainability, and code organization while maintaining all existing functionality.

---

## 1. Analysis Phase: Current State

### 1.1 Current Project Structure

```
reference-clone/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py              # FastAPI entry point (95 lines)
│   │   ├── config.py            # Settings (35 lines)
│   │   ├── database.py          # DB connection (45 lines)
│   │   ├── models.py            # Pydantic models (407 lines) ⚠️ GOD FILE
│   │   ├── cache.py             # Caching utilities
│   │   ├── rate_limit.py        # Rate limiting
│   │   ├── logging_config.py    # Logging setup
│   │   ├── graphql_schema.py    # GraphQL schema (150 lines)
│   │   ├── routers/             # API endpoints
│   │   │   ├── boxscores.py     # 28 lines
│   │   │   ├── contracts.py     # 60 lines
│   │   │   ├── draft.py         # 55 lines
│   │   │   ├── franchises.py    # 41 lines
│   │   │   ├── games.py         # 98 lines
│   │   │   ├── players.py       # 103 lines ✓ Uses Repository
│   │   │   ├── seasons.py       # 142 lines
│   │   │   └── teams.py         # 126 lines ⚠️ Mixed patterns
│   │   ├── repositories/        # Data access layer
│   │   │   ├── base.py          # 24 lines
│   │   │   ├── player_repository.py  # 219 lines
│   │   │   ├── team_repository.py    # 82 lines
│   │   │   ├── game_repository.py
│   │   │   └── season_repository.py
│   │   └── services/            # Business logic layer (UNDERUTILIZED)
│   │       ├── base.py          # 23 lines (abstract)
│   │       └── __init__.py
│   ├── scripts/
│   │   ├── db_inspection/       # 10+ diagnostic scripts
│   │   ├── debug/               # Debug utilities
│   │   ├── etl/                 # Data loading scripts
│   │   └── research/            # API exploration
│   ├── tests/
│   ├── db/
│   │   └── schema.sql           # 728 lines
│   └── check_import*.py         # Debug files ⚠️ SHOULD BE REMOVED
├── frontend/
│   └── src/
│       ├── components/
│       ├── lib/
│       ├── pages/
│       ├── styles/
│       └── types/
├── data/
│   └── nba.duckdb
├── tests/                       # Project-level tests
├── plan/                        # Specifications
└── docs/                        # Documentation (NEW)
```

### 1.2 Identified Code Smells

#### 🔴 Critical Issues

| Issue | Location | Description |
|-------|----------|-------------|
| **God File** | `app/models.py` (407 lines) | All Pydantic models in one file - 20+ model classes |
| **Inconsistent Patterns** | `routers/teams.py` vs `routers/players.py` | Teams router has inline DB queries; Players uses Repository |
| **Dead Code** | `backend/check_import.py`, `check_import_debug.py` | Debug files left in production |
| **Duplicated DB Logic** | Multiple ETL scripts | Each script redefines `BASE_DIR` and `DB_PATH` |
| **Empty Services Layer** | `app/services/` | Services layer exists but is unused |

#### 🟡 Medium Issues

| Issue | Location | Description |
|-------|----------|-------------|
| **Inline Model Definitions** | `routers/franchises.py`, `routers/contracts.py`, `routers/draft.py` | Models defined inside routers instead of `models.py` |
| **No Dependency Injection** | Most routers | Only `players.py` uses FastAPI's `Depends()` |
| **Duplicated NaN Handling** | All routers | `df.replace({np.nan: None})` repeated everywhere |
| **Missing Type Exports** | `__init__.py` files | Empty or missing re-exports |
| **Scattered Utility Functions** | `routers/teams.py` | Helper functions like `_get_current_season()` in routers |

#### 🟢 Minor Issues

| Issue | Location | Description |
|-------|----------|-------------|
| **Inconsistent Naming** | Router files | Some use singular (`draft.py`), some plural (`teams.py`) |
| **Duplicate Tests Folders** | `backend/tests/` and root `tests/` | Unclear test organization |
| **Missing README Files** | `app/`, `routers/`, `repositories/` | No module-level documentation |

### 1.3 Current Architecture Patterns

**Observed Patterns:**
- Partial Repository Pattern (only for Players, Teams, partially for others)
- Direct database access in routers (anti-pattern)
- Pydantic models for validation and serialization
- FastAPI routers with tags
- Shared database connection (singleton pattern)

**Missing Patterns:**
- Consistent Dependency Injection
- Service layer for business logic
- Proper separation of concerns
- Domain-driven module boundaries
- DTO (Data Transfer Object) pattern for API responses

---

## 2. Restructuring Proposal

### 2.1 Proposed Directory Structure

```
reference-clone/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                    # Minimal entry point
│   │   ├── dependencies.py            # NEW: Shared dependencies
│   │   │
│   │   ├── core/                      # NEW: Core infrastructure
│   │   │   ├── __init__.py
│   │   │   ├── config.py              # MOVED from app/
│   │   │   ├── database.py            # MOVED from app/
│   │   │   ├── cache.py               # MOVED from app/
│   │   │   ├── rate_limit.py          # MOVED from app/
│   │   │   ├── logging.py             # RENAMED from logging_config.py
│   │   │   └── exceptions.py          # NEW: Custom exceptions
│   │   │
│   │   ├── models/                    # NEW: Split models by domain
│   │   │   ├── __init__.py            # Re-exports all models
│   │   │   ├── base.py                # Base model classes
│   │   │   ├── player.py              # Player, PlayerSeasonStats, etc.
│   │   │   ├── team.py                # Team, TeamSeasonStats
│   │   │   ├── game.py                # Game, BoxScore, GameStats
│   │   │   ├── season.py              # Season, Award
│   │   │   ├── contract.py            # Contract
│   │   │   ├── draft.py               # DraftPick
│   │   │   └── franchise.py           # Franchise
│   │   │
│   │   ├── repositories/              # ENHANCED: All repos consistent
│   │   │   ├── __init__.py
│   │   │   ├── base.py
│   │   │   ├── player.py              # RENAMED
│   │   │   ├── team.py                # RENAMED
│   │   │   ├── game.py                # RENAMED
│   │   │   ├── season.py              # RENAMED
│   │   │   ├── boxscore.py            # NEW
│   │   │   ├── contract.py            # NEW
│   │   │   ├── draft.py               # NEW
│   │   │   └── franchise.py           # NEW
│   │   │
│   │   ├── services/                  # NEW: Business logic layer
│   │   │   ├── __init__.py
│   │   │   ├── base.py
│   │   │   ├── player.py
│   │   │   ├── team.py
│   │   │   ├── game.py
│   │   │   ├── season.py
│   │   │   └── stats.py               # Shared stats calculations
│   │   │
│   │   ├── api/                       # RENAMED from routers/
│   │   │   ├── __init__.py
│   │   │   ├── v1/                    # API versioning support
│   │   │   │   ├── __init__.py
│   │   │   │   ├── router.py          # Aggregates all v1 routes
│   │   │   │   ├── players.py         # Player endpoints
│   │   │   │   ├── teams.py           # Team endpoints
│   │   │   │   ├── games.py           # Game endpoints
│   │   │   │   ├── seasons.py         # Season endpoints
│   │   │   │   ├── boxscores.py
│   │   │   │   ├── contracts.py
│   │   │   │   ├── draft.py
│   │   │   │   └── franchises.py
│   │   │   └── graphql/               # MOVED
│   │   │       ├── __init__.py
│   │   │       ├── schema.py
│   │   │       └── resolvers.py       # NEW: Separate resolvers
│   │   │
│   │   └── utils/                     # NEW: Shared utilities
│   │       ├── __init__.py
│   │       ├── dataframe.py           # DataFrame helpers (NaN handling)
│   │       └── dates.py               # Date utilities (_get_current_season)
│   │
│   ├── scripts/
│   │   ├── __init__.py                # NEW: Make it a package
│   │   ├── config.py                  # NEW: Shared script config
│   │   ├── db_inspection/
│   │   ├── debug/
│   │   ├── etl/
│   │   │   ├── __init__.py
│   │   │   ├── base.py                # NEW: Base ETL class
│   │   │   └── ...
│   │   └── research/
│   │
│   ├── tests/
│   │   ├── conftest.py
│   │   ├── unit/
│   │   │   ├── models/
│   │   │   ├── repositories/
│   │   │   ├── services/
│   │   │   └── api/
│   │   └── integration/
│   │       ├── api/
│   │       └── database/
│   │
│   └── db/
│       └── schema.sql
│
├── frontend/                          # (Structure largely maintained)
│   └── src/
│       ├── components/
│       │   ├── atoms/                 # ✓ Atomic design already used
│       │   ├── molecules/
│       │   ├── organisms/             # NEW: Larger components
│       │   ├── templates/             # NEW: Page layouts
│       │   └── pages/                 # MOVED: Full pages
│       ├── hooks/                     # NEW: Custom React hooks
│       ├── lib/
│       ├── pages/                     # Next.js pages (routing)
│       ├── styles/
│       └── types/
│
├── tests/                             # KEEP: Project-level integration
├── data/
├── docs/                              # NEW
│   ├── ARCHITECTURE.md
│   ├── API.md
│   ├── CONTRIBUTING.md
│   └── RESTRUCTURING_PLAN.md          # This file
└── plan/
```

### 2.2 Key Changes Explained

#### A. Split `models.py` into Domain Modules

**Rationale:** The current 407-line file violates Single Responsibility Principle and makes imports harder to manage.

**Before:**
```python
# app/models.py (407 lines, 20+ classes)
from pydantic import BaseModel
class Team(BaseModel): ...
class Player(BaseModel): ...
class PlayerSeasonStats(BaseModel): ...
# ... 17 more classes
```

**After:**
```python
# app/models/__init__.py
from .player import Player, PlayerSeasonStats, PlayerAdvancedStats, ...
from .team import Team, TeamSeasonStats
from .game import Game, GameStats, BoxScore
# ... clean re-exports

# app/models/player.py
from .base import BaseModel
class Player(BaseModel): ...
class PlayerSeasonStats(BaseModel): ...
```

#### B. Create Core Infrastructure Module

**Rationale:** Configuration, database, caching, and logging are cross-cutting concerns that should be grouped.

**Benefits:**
- Clear import paths: `from app.core import settings, get_db`
- Easier testing (mock entire core module)
- Central place for infrastructure code

#### C. Standardize Repository Pattern

**Rationale:** Currently only `players.py` uses repositories consistently. Other routers have inline SQL.

**Before (teams.py):**
```python
@router.get("/teams")
def get_teams(active_only: bool = True):
    query = "SELECT * FROM teams"
    if active_only:
        query += " WHERE is_active = TRUE"
    df = execute_query_df(query)
    ...
```

**After (teams.py):**
```python
@router.get("/teams")
def get_teams(
    active_only: bool = True,
    repo: TeamRepository = Depends(get_team_repository)
):
    return repo.get_all(active_only=active_only)
```

#### D. Add Dependency Injection Module

**Rationale:** FastAPI best practices recommend a central `dependencies.py` for shared dependencies.

```python
# app/dependencies.py
from functools import lru_cache
from app.repositories import PlayerRepository, TeamRepository, ...

@lru_cache
def get_player_repository() -> PlayerRepository:
    return PlayerRepository()

@lru_cache  
def get_team_repository() -> TeamRepository:
    return TeamRepository()
```

#### E. Implement Services Layer

**Rationale:** The existing services layer is empty. Business logic is scattered in routers and repositories.

```python
# app/services/player.py
class PlayerService:
    def __init__(self, repo: PlayerRepository):
        self.repo = repo
    
    def get_player_with_stats(self, player_id: str) -> PlayerWithStats:
        player = self.repo.get_by_id(player_id)
        stats = self.repo.get_stats(player_id)
        return PlayerWithStats(player=player, stats=stats)
```

#### F. Add Utilities Module

**Rationale:** Helper functions like `_get_current_season()` and DataFrame NaN handling are duplicated.

```python
# app/utils/dataframe.py
def clean_nan(df: pd.DataFrame) -> pd.DataFrame:
    """Replace NaN with None for Pydantic compatibility."""
    return df.where(pd.notnull(df), None)

# app/utils/dates.py
def get_current_season() -> str:
    """Calculate current NBA season ID (e.g., '2025')."""
    now = datetime.now()
    return str(now.year + 1) if now.month >= 10 else str(now.year)
```

#### G. API Versioning

**Rationale:** Prepares for future API evolution without breaking clients.

```python
# app/api/v1/router.py
from fastapi import APIRouter
from . import players, teams, games, seasons

router = APIRouter(prefix="/api/v1")
router.include_router(players.router, prefix="/players", tags=["Players"])
router.include_router(teams.router, prefix="/teams", tags=["Teams"])
...
```

---

## 3. Files to Split, Merge, or Relocate

### Split

| File | Split Into | Rationale |
|------|-----------|-----------|
| `app/models.py` | `app/models/{player,team,game,season,contract,draft,franchise}.py` | 407 lines with 20+ classes is unmaintainable |
| `app/graphql_schema.py` | `app/api/graphql/{schema,resolvers}.py` | Separate type definitions from resolvers |

### Merge

| Files | Merge Into | Rationale |
|-------|-----------|-----------|
| `app/routers/__init__.py` + route registrations in `main.py` | `app/api/v1/router.py` | Centralize route registration |
| Duplicate model definitions in routers | Move to `app/models/` | `Franchise`, `Contract`, `DraftPick` defined in routers |

### Relocate

| File | From | To | Rationale |
|------|------|-----|-----------|
| `config.py` | `app/` | `app/core/` | Group infrastructure |
| `database.py` | `app/` | `app/core/` | Group infrastructure |
| `cache.py` | `app/` | `app/core/` | Group infrastructure |
| `rate_limit.py` | `app/` | `app/core/` | Group infrastructure |
| `logging_config.py` | `app/` | `app/core/logging.py` | Group + rename |
| `graphql_schema.py` | `app/` | `app/api/graphql/schema.py` | Group with API layer |

### Delete

| File | Reason |
|------|--------|
| `backend/check_import.py` | Debug file, not for production |
| `backend/check_import_debug.py` | Debug file, not for production |

---

## 4. Naming Conventions

### Files
- **Singular nouns** for module files: `player.py`, `team.py`, `game.py`
- **Descriptive names** for utilities: `dataframe.py`, not `utils.py`
- **Lowercase with underscores**: `player_repository.py` → `player.py` (simpler within namespaced directories)

### Classes
- **PascalCase**: `PlayerRepository`, `TeamService`
- **Suffix by layer**: `*Repository`, `*Service`, `*Router`

### Functions
- **snake_case**: `get_player_by_id`, `calculate_season_stats`
- **Verb prefixes**: `get_*`, `create_*`, `update_*`, `delete_*`

### Variables
- **Descriptive snake_case**: `player_stats`, not `ps`
- **Constants**: `UPPERCASE_WITH_UNDERSCORES`

---

## 5. Documentation Improvements

### Required Documentation

| Location | Type | Purpose |
|----------|------|---------|
| `docs/ARCHITECTURE.md` | Markdown | System architecture overview |
| `docs/API.md` | Markdown | API documentation (supplement OpenAPI) |
| `docs/CONTRIBUTING.md` | Markdown | Development setup & guidelines |
| `app/README.md` | Markdown | Backend module overview |
| `app/core/README.md` | Markdown | Infrastructure components |
| `app/models/README.md` | Markdown | Data model documentation |
| `app/repositories/README.md` | Markdown | Repository pattern explanation |
| `app/services/README.md` | Markdown | Business logic layer |
| `app/api/README.md` | Markdown | API layer documentation |

### Module Docstrings

```python
# app/core/__init__.py
"""
Core infrastructure module.

This module contains cross-cutting concerns:
- config: Application settings (Pydantic Settings)
- database: DuckDB connection management
- cache: Response caching utilities
- rate_limit: API rate limiting
- logging: Structured logging configuration
- exceptions: Custom exception classes

Usage:
    from app.core import settings, get_db_connection
    from app.core.exceptions import EntityNotFoundError
"""
```

---

## 6. Migration Plan

### Phase 1: Low-Risk Infrastructure (Week 1)

| Step | Action | Risk | Rollback |
|------|--------|------|----------|
| 1.1 | Create `app/core/` directory | None | Delete directory |
| 1.2 | Copy (not move) `config.py`, `database.py`, `cache.py`, `rate_limit.py`, `logging_config.py` to `app/core/` | None | Delete copies |
| 1.3 | Update imports in `main.py` to use `app.core` | Low | Revert imports |
| 1.4 | Add deprecation warnings to old module locations | None | Remove warnings |
| 1.5 | Run full test suite | - | - |
| 1.6 | Remove original files after tests pass | Low | Restore from git |

### Phase 2: Models Refactoring (Week 2)

| Step | Action | Risk | Rollback |
|------|--------|------|----------|
| 2.1 | Create `app/models/` directory structure | None | Delete directory |
| 2.2 | Extract `Player*` models to `app/models/player.py` | Low | Revert |
| 2.3 | Extract `Team*` models to `app/models/team.py` | Low | Revert |
| 2.4 | Extract `Game*` models to `app/models/game.py` | Low | Revert |
| 2.5 | Create `app/models/__init__.py` with re-exports | Low | Revert |
| 2.6 | Update all imports in routers/repositories | Medium | Revert imports |
| 2.7 | Run full test suite | - | - |
| 2.8 | Remove original `app/models.py` | Low | Restore from git |

### Phase 3: Dependencies & Utilities (Week 2)

| Step | Action | Risk | Rollback |
|------|--------|------|----------|
| 3.1 | Create `app/dependencies.py` | None | Delete file |
| 3.2 | Create `app/utils/` with `dataframe.py`, `dates.py` | None | Delete directory |
| 3.3 | Refactor `teams.py` to use dependency injection | Medium | Revert |
| 3.4 | Replace inline NaN handling with `utils.dataframe.clean_nan()` | Low | Revert |
| 3.5 | Move `_get_current_season()` to `utils.dates` | Low | Revert |
| 3.6 | Run full test suite | - | - |

### Phase 4: Repository Standardization (Week 3)

| Step | Action | Risk | Rollback |
|------|--------|------|----------|
| 4.1 | Create missing repositories: `BoxscoreRepository`, `ContractRepository`, `DraftRepository`, `FranchiseRepository` | Low | Delete files |
| 4.2 | Refactor `boxscores.py` router to use repository | Medium | Revert |
| 4.3 | Refactor `contracts.py` router to use repository | Medium | Revert |
| 4.4 | Refactor `draft.py` router to use repository | Medium | Revert |
| 4.5 | Refactor `franchises.py` router to use repository | Medium | Revert |
| 4.6 | Refactor `games.py` router to use repository consistently | Medium | Revert |
| 4.7 | Refactor `seasons.py` router to use repository | Medium | Revert |
| 4.8 | Run full test suite | - | - |

### Phase 5: API Layer Restructuring (Week 4)

| Step | Action | Risk | Rollback |
|------|--------|------|----------|
| 5.1 | Create `app/api/v1/` directory | None | Delete directory |
| 5.2 | Move routers to `app/api/v1/` | Medium | Revert |
| 5.3 | Create `app/api/v1/router.py` to aggregate routes | Medium | Revert |
| 5.4 | Update `main.py` to use v1 router | Medium | Revert |
| 5.5 | Move GraphQL to `app/api/graphql/` | Medium | Revert |
| 5.6 | Run full test suite | - | - |

### Phase 6: Services Layer (Week 4-5)

| Step | Action | Risk | Rollback |
|------|--------|------|----------|
| 6.1 | Implement `PlayerService` with complex business logic | Low | Delete file |
| 6.2 | Implement `TeamService` | Low | Delete file |
| 6.3 | Update routers to use services for complex operations | Medium | Revert |
| 6.4 | Run full test suite | - | - |

### Phase 7: Cleanup & Documentation (Week 5)

| Step | Action | Risk | Rollback |
|------|--------|------|----------|
| 7.1 | Delete debug files (`check_import*.py`) | None | Restore from git |
| 7.2 | Update/consolidate `tests/` structure | Low | Revert |
| 7.3 | Add README files to all major directories | None | Delete files |
| 7.4 | Update root README with new structure | None | Revert |
| 7.5 | Final test suite run | - | - |

---

## 7. Risk Assessment

### High Risk Changes

| Change | Risk | Mitigation |
|--------|------|------------|
| Moving routers to `app/api/v1/` | May break import paths | Incremental migration with dual paths |
| Splitting `models.py` | Many files depend on it | Use `__init__.py` re-exports for backward compatibility |

### Medium Risk Changes

| Change | Risk | Mitigation |
|--------|------|------------|
| Refactoring routers to use repositories | Logic changes | Add comprehensive tests before refactoring |
| Adding services layer | New abstraction | Start with simple delegation, add complexity gradually |

### Low Risk Changes

| Change | Risk | Mitigation |
|--------|------|------------|
| Creating `app/core/` | New directory structure | Keep old paths temporarily |
| Adding `app/utils/` | New helper functions | Pure functions, easy to test |
| Adding documentation | None | - |

---

## 8. Before/After Comparison

### Import Statement Comparison

**Before:**
```python
# In routers/games.py
from app.database import execute_query_df
from app.models import Game, GameStats
from app.logging_config import get_logger

# Direct SQL in router
query = "SELECT * FROM games WHERE ..."
df = execute_query_df(query, params)
df = df.replace({np.nan: None})  # Duplicated everywhere
```

**After:**
```python
# In api/v1/games.py
from fastapi import Depends
from app.repositories import GameRepository
from app.dependencies import get_game_repository
from app.models import Game

@router.get("/games")
def get_games(
    repo: GameRepository = Depends(get_game_repository)
) -> list[Game]:
    return repo.get_all()  # Repository handles all data access
```

### File Organization Comparison

**Before (flat structure):**
```
app/
├── config.py
├── database.py
├── cache.py
├── rate_limit.py
├── logging_config.py
├── models.py        # 407 lines, 20+ classes
├── graphql_schema.py
├── routers/
│   └── (8 files with mixed patterns)
├── repositories/
│   └── (5 files, inconsistent usage)
└── services/
    └── base.py      # Unused
```

**After (layered structure):**
```
app/
├── main.py          # Minimal (< 50 lines)
├── dependencies.py  # Dependency injection
├── core/            # Infrastructure
│   ├── config.py
│   ├── database.py
│   ├── cache.py
│   ├── rate_limit.py
│   ├── logging.py
│   └── exceptions.py
├── models/          # Domain models (split by entity)
│   ├── player.py
│   ├── team.py
│   ├── game.py
│   └── ...
├── repositories/    # Data access (consistent pattern)
│   ├── player.py
│   ├── team.py
│   └── ...
├── services/        # Business logic
│   ├── player.py
│   ├── team.py
│   └── ...
├── api/             # HTTP layer
│   ├── v1/          # Versioned API
│   └── graphql/     # GraphQL endpoint
└── utils/           # Shared helpers
    ├── dataframe.py
    └── dates.py
```

---

## 9. Success Metrics

After restructuring, the codebase should:

1. **Modularity**: Each module has < 200 lines and single responsibility
2. **Consistency**: All routers use the same patterns (DI, repositories, services)
3. **Testability**: Each layer can be tested in isolation
4. **Discoverability**: File locations are predictable based on function
5. **Documentation**: Every major directory has a README
6. **No Code Duplication**: Helper functions centralized in `utils/`
7. **Type Safety**: All imports are explicit and type-checked

---

## 10. Next Steps

1. **Review this plan** with the team
2. **Set up CI/CD checks** for import consistency
3. **Create feature branch** for Phase 1
4. **Begin Phase 1** implementation
5. **Document learnings** after each phase

---

*Document created: November 30, 2025*
*Last updated: November 30, 2025*
