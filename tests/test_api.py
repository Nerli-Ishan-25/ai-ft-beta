from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Welcome to AI Powered Personal Finance API", "version": "v1"}

def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}

def test_auth_register_fail_invalid_email():
    # Test invalid email format
    response = client.post(
        "/api/v1/auth/register",
        json={"name": "Test User", "email": "invalid-email", "password": "password123"}
    )
    assert response.status_code == 422
