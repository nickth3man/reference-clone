# Tests

Test suite for the Basketball Reference Clone application.

## Directory Structure

```
tests/
├── integration/              # Integration tests
│   └── test_endpoints.py    # API endpoint verification tests
└── unit/                    # Unit tests
    └── (unit tests go here)
```

## Running Tests

### Integration Tests

The integration tests verify that the API endpoints are working correctly. The backend must be running before executing these tests.

```bash
# Start the backend first
cd backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8001

# In another terminal, run the integration tests
python tests/integration/test_endpoints.py
```

### Unit Tests (with pytest)

```bash
# From the project root
pytest tests/unit/

# With coverage
pytest tests/unit/ --cov=backend/app
```

## Writing Tests

### Integration Tests

Integration tests should:
- Test the full API contract
- Verify responses match expected schemas
- Test error handling and edge cases
- Run against a live backend instance

### Unit Tests

Unit tests should:
- Test individual functions and classes
- Mock external dependencies (database, APIs)
- Be fast and isolated
- Follow pytest conventions (use `test_*.py` naming)
