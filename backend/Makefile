.PHONY: help dev test lint typecheck format clean install

# Default target
help:
	@echo "Available commands:"
	@echo "  make install    - Install dependencies"
	@echo "  make dev        - Run development server"
	@echo "  make test       - Run tests with coverage"
	@echo "  make lint       - Run linting (ruff)"
	@echo "  make typecheck  - Run type checking (mypy)"
	@echo "  make format     - Format code (ruff)"
	@echo "  make clean      - Clean build artifacts"

# Install dependencies
install:
	uv pip install -e ".[dev]"

# Run development server
dev:
	uvicorn app.main:app --reload --port 8000

# Run tests
test:
	pytest tests/ -v

# Run tests with coverage (requires pytest-cov)
test-cov:
	pytest tests/ -v --cov=app --cov-report=term-missing

# Run tests without coverage
test-quick:
	pytest tests/ -v

# Run linting
lint:
	ruff check app/ tests/
	ruff format --check app/ tests/

# Run type checking
typecheck:
	mypy app/

# Format code
format:
	ruff check --fix app/ tests/
	ruff format app/ tests/

# Clean build artifacts
clean:
	rm -rf __pycache__ .pytest_cache .mypy_cache .ruff_cache htmlcov .coverage
	find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true
	find . -type f -name "*.pyc" -delete 2>/dev/null || true

# Run all checks (lint + typecheck + test)
check: lint typecheck test
