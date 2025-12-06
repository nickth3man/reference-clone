# Contributing to Basketball Reference Clone

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to this project.

## Development Setup

### Prerequisites

- Python 3.10 or higher
- Node.js 18 or higher (for frontend)
- [uv](https://docs.astral.sh/uv/) package manager (recommended) or pip

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/basketball-reference-clone.git
   cd basketball-reference-clone
   ```

2. **Create and activate a virtual environment**
   ```bash
   cd backend
   python -m venv .venv
   
   # On Windows
   .venv\Scripts\activate
   
   # On macOS/Linux
   source .venv/bin/activate
   ```

3. **Install dependencies**
   ```bash
   # Using uv (recommended)
   uv pip install -e ".[dev]"
   
   # Or using pip
   pip install -e ".[dev]"
   ```

4. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env if needed
   ```

5. **Run the development server**
   ```bash
   make dev
   # Or manually:
   uvicorn app.main:app --reload --port 8000
   ```

### Frontend Setup

1. **Install dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Run the development server**
   ```bash
   npm run dev
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Docs: http://localhost:8000/docs
   - GraphQL Playground: http://localhost:8000/graphql

## Development Workflow

### Code Style

This project uses:
- **Ruff** for Python linting and formatting
- **mypy** for type checking
- **ESLint** and **Prettier** for TypeScript/JavaScript

Run linting before committing:
```bash
cd backend
make lint
```

### Running Tests

```bash
cd backend
make test

# With coverage report
pytest --cov=app --cov-report=html
```

### Type Checking

```bash
cd backend
make typecheck
```

### Project Structure

```
backend/
├── app/
│   ├── api/
│   │   ├── graphql/     # GraphQL schema and resolvers
│   │   └── v1/          # REST API v1 endpoints
│   ├── core/            # Core infrastructure (config, database, logging)
│   ├── models/          # Pydantic models
│   ├── repositories/    # Data access layer
│   ├── services/        # Business logic layer
│   └── utils/           # Utility functions
├── tests/
│   ├── unit/            # Unit tests
│   └── integration/     # Integration tests
└── scripts/             # Development and ETL scripts
```

### API Conventions

- All REST endpoints are under `/api/v1/`
- Use dependency injection for repositories
- Follow REST conventions (GET for reads, POST for creates, etc.)
- Use Pydantic models for request/response validation

### Git Workflow

1. Create a feature branch from `main`
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and commit with descriptive messages
   ```bash
   git add .
   git commit -m "feat: add player search functionality"
   ```

3. Push and create a pull request
   ```bash
   git push origin feature/your-feature-name
   ```

### Commit Message Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

## Getting Help

- Check existing issues and pull requests
- Open a new issue for bugs or feature requests
- Ask questions in discussions

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
