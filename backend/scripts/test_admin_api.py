"""
Test script for Admin APIs.
Run: python scripts/test_admin_api.py <email> <password>
"""
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import requests

BASE_URL = "http://localhost:8000"

def test_admin_api(email: str, password: str):
    print(f"\n{'='*50}")
    print(f"Testing Admin API for: {email}")
    print(f"{'='*50}\n")

    # Step 1: Login
    print("1. Logging in...")
    try:
        login_response = requests.post(
            f"{BASE_URL}/api/v1/auth/login",
            data={"username": email, "password": password},
            timeout=10
        )
    except requests.exceptions.ConnectionError:
        print("   ERROR: Cannot connect to server. Is it running at http://localhost:8000?")
        return
    except Exception as e:
        print(f"   ERROR: {e}")
        return

    if login_response.status_code != 200:
        print(f"   FAILED: {login_response.status_code}")
        try:
            print(f"   Response: {login_response.json()}")
        except:
            print(f"   Response: {login_response.text}")
        return

    token_data = login_response.json()
    access_token = token_data["access_token"]
    print(f"   SUCCESS: Got access token")
    print(f"   Token (first 50 chars): {access_token[:50]}...")

    headers = {"Authorization": f"Bearer {access_token}"}

    # Step 2: Test GET /admin/users
    print("\n2. Testing GET /api/v1/admin/users...")
    users_response = requests.get(f"{BASE_URL}/api/v1/admin/users", headers=headers, timeout=10)
    print(f"   Status: {users_response.status_code}")
    if users_response.status_code == 200:
        users = users_response.json()
        print(f"   SUCCESS: Found {len(users)} users")
        for user in users:
            print(f"      - {user['email']} ({user['role']})")
    else:
        print(f"   FAILED:")
        try:
            print(f"   Response: {users_response.json()}")
        except:
            print(f"   Response: {users_response.text}")

    # Step 3: Test GET /admin/analytics
    print("\n3. Testing GET /api/v1/admin/analytics...")
    analytics_response = requests.get(f"{BASE_URL}/api/v1/admin/analytics", headers=headers, timeout=10)
    print(f"   Status: {analytics_response.status_code}")
    if analytics_response.status_code == 200:
        analytics = analytics_response.json()
        print(f"   SUCCESS: Analytics data:")
        for key, value in analytics.items():
            print(f"      - {key}: {value}")
    else:
        print(f"   FAILED:")
        try:
            print(f"   Response: {analytics_response.json()}")
        except:
            print(f"   Response: {analytics_response.text}")

    # Step 4: Test POST /admin/users (create new admin)
    print("\n4. Testing POST /api/v1/admin/users (create admin)...")
    new_admin_data = {
        "name": "Test Admin",
        "email": f"test_admin_{os.getpid()}@example.com",
        "password": "test123",
        "role": "user"
    }
    create_response = requests.post(
        f"{BASE_URL}/api/v1/admin/users",
        headers=headers,
        json=new_admin_data,
        timeout=10
    )
    print(f"   Status: {create_response.status_code}")
    if create_response.status_code == 200:
        created_user = create_response.json()
        print(f"   SUCCESS: Created admin user")
        print(f"      - Email: {created_user['email']}")
        print(f"      - Role: {created_user['role']}")
    else:
        print(f"   FAILED:")
        try:
            print(f"   Response: {create_response.json()}")
        except:
            print(f"   Response: {create_response.text}")

    print(f"\n{'='*50}")
    print("Admin API Test Complete!")
    print(f"{'='*50}\n")

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python scripts/test_admin_api.py <email> <password>")
        print("Example: python scripts/test_admin_api.py aarya@gmail.com mypassword")
        sys.exit(1)

    test_admin_api(sys.argv[1], sys.argv[2])
