from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_franchises_endpoint():
    response = client.get("/franchises")
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_draft_picks_endpoint():
    response = client.get("/draft/picks")
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_contracts_endpoint():
    response = client.get("/contracts")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

