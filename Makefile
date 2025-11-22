.PHONY: lint-backend lint-backend-fix format-backend lint-frontend lint-frontend-fix format-frontend lint format all

# Backend Commands
lint-backend:
	ruff check backend/

lint-backend-fix:
	ruff check backend/ --fix

format-backend:
	ruff format backend/

# Frontend Commands
lint-frontend:
	cd frontend && npm run lint

lint-frontend-fix:
	cd frontend && npm run lint:fix

format-frontend:
	cd frontend && npm run format

# Combined Commands
lint: lint-backend lint-frontend

lint-fix: lint-backend-fix lint-frontend-fix

format: format-backend format-frontend

all: format lint
