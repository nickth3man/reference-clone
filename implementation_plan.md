# Implementation Plan

[Overview] Upgrade Next.js to resolve security vulnerabilities, fix codebase linting and formatting
issues across frontend and backend, and improve infrastructure security configurations.

[Files] Files to be modified:

- `frontend/package.json`: Upgrade dependencies (`next`, `react`, `react-dom`) to fix
  vulnerabilities.
- `frontend/src/**/*`: Apply formatting and linting fixes (Prettier/ESLint) after configuration
  fixes.
- `backend/requirements.txt`: Verify/upgrade dependencies if necessary (or just linting).
- `backend/**/*.py`: Fix linting errors (Ruff: imports, line lengths; Pylint: broad exceptions).
- `verify_endpoints.py`: Fix Ruff linting errors.
- `backend/Dockerfile`: Add HEALTHCHECK and non-root user.
- `frontend/Dockerfile`: Add HEALTHCHECK and non-root user.

[Dependencies]

- Frontend: Upgrade `next` to >=14.2.16 (or latest 14.x) to resolve GHSA-7m27-7ghc-44w9 and others.
  Upgrade `react`, `react-dom` to compatible versions. Ensure `eslint-config-next` is compatible.
- Backend: No major dependency changes expected unless `uv` requires updates, but `requirements.txt`
  might need regeneration if `uv.lock` changes.

[Implementation Order]

1.  **Frontend Security Upgrade**: Upgrade Next.js and React dependencies to patch vulnerabilities.
2.  **Frontend Configuration & Linting**: Fix ESLint/Prettier configuration to allow linting checks
    to run successfully. Execute formatters and fix remaining linting issues.
3.  **Backend Linting**: Fix Python linting errors (imports, line lengths, `print` statements,
    exception handling) using available linters as a guide.
4.  **Infrastructure Hardening**: Update Dockerfiles with security best practices (HEALTHCHECK,
    non-root user).
5.  **Verification**: Run full project linting/testing and verify clean output. Validate server startup.

task_progress Items:

- [ ] Step 1: Upgrade Frontend Dependencies (Next.js security patch)
- [ ] Step 2: Fix Frontend Linting & Configuration
- [ ] Step 3: Fix Backend Linting (Python)
- [ ] Step 4: Harden Docker Infrastructure
- [ ] Step 5: Final Verification
