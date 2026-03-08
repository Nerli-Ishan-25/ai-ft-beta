# Finance Dashboard Backend - API Documentation for FastAPI Migration

## Overview

This document provides a complete reference of the existing Express.js backend for migration to FastAPI.

---

## Legacy Express.js Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js v5
- **Database**: SQLite (better-sqlite3)
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcrypt

---

## Database Schema (Legacy Express Version)

### Users Table
```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Transactions Table
```sql
CREATE TABLE transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    category_id INTEGER,
    amount REAL NOT NULL,
    type TEXT CHECK(type IN ('income','expense')),
    description TEXT,
    date DATE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(category_id) REFERENCES categories(id)
);
```

### Assets Table
```sql
CREATE TABLE assets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    type TEXT,
    value REAL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
);
```

### Liabilities Table
```sql
CREATE TABLE liabilities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    type TEXT,
    amount REAL,
    interest_rate REAL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
);
```

### Budgets Table
```sql
CREATE TABLE budgets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    category_id INTEGER,
    budget_amount REAL,
    month INTEGER,
    year INTEGER,
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(category_id) REFERENCES categories(id)
);
```

### Categories Table
```sql
CREATE TABLE categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    name TEXT NOT NULL,
    type TEXT CHECK(type IN ('income','expense')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
);
```

### Subscriptions Table
```sql
CREATE TABLE subscriptions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    amount REAL,
    billing_cycle TEXT,
    next_payment_date DATE,
    FOREIGN KEY(user_id) REFERENCES users(id)
);
```

### Loans Table (exists but no routes/controllers yet)
```sql
CREATE TABLE loans (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    loan_amount REAL,
    interest_rate REAL,
    loan_term INTEGER,
    monthly_income REAL,
    existing_debt REAL,
    default_probability REAL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
);
```

---

## API Routes

### Base URL: `/api`

---

## 1. Authentication Routes (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Health check | No |
| POST | `/signup` | Register new user | No |
| POST | `/login` | User login | No |

### POST `/api/auth/signup`

**Request Body:**
```json
{
    "name": "string",
    "email": "string",
    "password": "string"
}
```

**Response (200):**
```json
{
    "message": "User created",
    "userId": 1
}
```

**Controller Logic:**
- Validate all fields present
- Check if user exists by email
- Hash password with bcrypt (10 rounds)
- Insert user into database
- Return userId

### POST `/api/auth/login`

**Request Body:**
```json
{
    "email": "string",
    "password": "string"
}
```

**Response (200):**
```json
{
    "token": "jwt_token_string",
    "user": {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com"
    }
}
```

**Controller Logic:**
- Find user by email
- Verify password with bcrypt.compare()
- Generate JWT token (expires in 7 days)
- Return token and user info (without password)

---

## 2. Transaction Routes (`/api/transactions`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Health check | No |

**Note:** Transaction routes only has a basic health check endpoint. The CRUD operations need to be implemented.

---

## 3. Asset Routes (`/api/assets`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/` | Create new asset | Yes |
| GET | `/` | Get all user assets | Yes |
| PUT | `/:id` | Update asset | Yes |
| DELETE | `/:id` | Delete asset | Yes |

### POST `/api/assets`

**Request Body:**
```json
{
    "name": "string",
    "type": "string",
    "value": 1000.00
}
```

**Response (200):**
```json
{
    "message": "Asset created"
}
```

### GET `/api/assets`

**Response (200):**
```json
[
    {
        "id": 1,
        "user_id": 1,
        "name": "Savings Account",
        "type": "bank",
        "value": 5000.00,
        "created_at": "2024-01-01 12:00:00"
    }
]
```

### PUT `/api/assets/:id`

**Request Body:**
```json
{
    "name": "string",
    "type": "string",
    "value": 1000.00
}
```

**Response (200):**
```json
{
    "message": "Asset updated"
}
```

### DELETE `/api/assets/:id`

**Response (200):**
```json
{
    "message": "Asset deleted"
}
```

---

## 4. Liability Routes (`/api/liabilities`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/` | Create new liability | Yes |
| GET | `/` | Get all user liabilities | Yes |
| PUT | `/:id` | Update liability | Yes |
| DELETE | `/:id` | Delete liability | Yes |

### POST `/api/liabilities`

**Request Body:**
```json
{
    "name": "Credit Card Debt",
    "type": "credit_card",
    "amount": 5000.00,
    "interest_rate": 18.5
}
```

**Response (200):**
```json
{
    "message": "Liability created"
}
```

### GET `/api/liabilities`

**Response (200):**
```json
[
    {
        "id": 1,
        "user_id": 1,
        "name": "Credit Card Debt",
        "type": "credit_card",
        "amount": 5000.00,
        "interest_rate": 18.5,
        "created_at": "2024-01-01 12:00:00"
    }
]
```

### PUT `/api/liabilities/:id`

**Request Body:**
```json
{
    "name": "Credit Card Debt",
    "type": "credit_card",
    "amount": 4000.00,
    "interest_rate": 18.5
}
```

**Response (200):**
```json
{
    "message": "Liability updated"
}
```

### DELETE `/api/liabilities/:id`

**Response (200):**
```json
{
    "message": "Liability deleted"
}
```

---

## 5. Budget Routes (`/api/budgets`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/` | Create new budget | Yes |
| GET | `/` | Get all user budgets | Yes |
| PUT | `/:id` | Update budget | Yes |
| DELETE | `/:id` | Delete budget | Yes |

### POST `/api/budgets`

**Request Body:**
```json
{
    "category_id": 1,
    "budget_amount": 500.00,
    "month": 1,
    "year": 2024
}
```

**Response (200):**
```json
{
    "message": "Budget created"
}
```

### GET `/api/budgets`

**Response (200):**
```json
[
    {
        "id": 1,
        "user_id": 1,
        "category_id": 1,
        "budget_amount": 500.00,
        "month": 1,
        "year": 2024,
        "category_name": "Groceries"
    }
]
```

### PUT `/api/budgets/:id`

**Request Body:**
```json
{
    "budget_amount": 600.00
}
```

**Response (200):**
```json
{
    "message": "Budget updated"
}
```

### DELETE `/api/budgets/:id`

**Response (200):**
```json
{
    "message": "Budget deleted"
}
```

---

## 6. Category Routes (`/api/categories`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/` | Create new category | Yes |
| GET | `/` | Get all user categories | Yes |
| DELETE | `/:id` | Delete category | Yes |

### POST `/api/categories`

**Request Body:**
```json
{
    "name": "Groceries",
    "type": "expense"
}
```

**Response (200):**
```json
{
    "message": "Category created"
}
```

### GET `/api/categories`

**Response (200):**
```json
[
    {
        "id": 1,
        "user_id": 1,
        "name": "Groceries",
        "type": "expense",
        "created_at": "2024-01-01 12:00:00"
    }
]
```

**Note:** Results are ordered by name ASC.

### DELETE `/api/categories/:id`

**Response (200):**
```json
{
    "message": "Category deleted"
}
```

---

## 7. Subscription Routes (`/api/subscriptions`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/` | Create new subscription | Yes |
| GET | `/` | Get all user subscriptions | Yes |
| DELETE | `/:id` | Delete subscription | Yes |

### POST `/api/subscriptions`

**Request Body:**
```json
{
    "name": "Netflix",
    "amount": 15.99,
    "billing_cycle": "monthly",
    "next_payment_date": "2024-02-01"
}
```

**Response (200):**
```json
{
    "message": "Subscription added"
}
```

### GET `/api/subscriptions`

**Response (200):**
```json
[
    {
        "id": 1,
        "user_id": 1,
        "name": "Netflix",
        "amount": 15.99,
        "billing_cycle": "monthly",
        "next_payment_date": "2024-02-01"
    }
]
```

**Note:** Results are ordered by next_payment_date ASC.

### DELETE `/api/subscriptions/:id`

**Response (200):**
```json
{
    "message": "Subscription removed"
}
```

---

## Authentication Middleware

All protected routes require JWT token in the Authorization header:

**Header Format:**
```
Authorization: Bearer <jwt_token>
```

**Token Payload:**
```json
{
    "userId": 1,
    "exp": 1234567890
}
```

**Error Responses:**
- `401` - Missing or invalid token format
- `403` - Expired or invalid token

---

## File Structure

```
backend/
├── config/
│   └── db.js                 # Database connection (better-sqlite3)
├── controllers/
│   ├── assetController.js
│   ├── authController.js
│   ├── budgetController.js
│   ├── categoryController.js
│   ├── liabilityController.js
│   ├── subscriptionController.js
│   └── transactionController.js
├── database/
│   ├── initDB.js             # Database initialization
│   └── schema/
│       ├── assets.sql
│       ├── budgets.sql
│       ├── categories.sql
│       ├── liabilities.sql
│       ├── loans.sql
│       ├── subscriptions.sql
│       ├── transactions.sql
│       └── users.sql
├── middleware/
│   └── authMiddleware.js     # JWT authentication
├── models/
│   ├── assetModel.js
│   ├── budgetModel.js
│   ├── categoryModel.js
│   ├── liabilityModel.js
│   ├── subscriptionModel.js
│   ├── transactionModel.js
│   └── userModel.js
├── routes/
│   ├── assetRoutes.js
│   ├── authRoutes.js
│   ├── budgetRoutes.js
│   ├── categoryRoutes.js
│   ├── liabilityRoutes.js
│   ├── subscriptionRoutes.js
│   └── transactionRoutes.js
├── services/
│   └── aiService.js          # Empty placeholder
├── .env
├── server.js                 # Entry point
└── package.json
```

---

## Environment Variables

```env
PORT=5000
JWT_SECRET=supersecretkey
```

---

## FastAPI Migration Notes

### Pydantic Models to Create

```python
# schemas/user.py
class UserCreate(BaseModel):
    name: str
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: int
    name: str
    email: str

class TokenResponse(BaseModel):
    token: str
    user: UserResponse

# schemas/asset.py
class AssetCreate(BaseModel):
    name: str
    type: str
    value: float

class AssetUpdate(BaseModel):
    name: str
    type: str
    value: float

class AssetResponse(BaseModel):
    id: int
    user_id: int
    name: str
    type: str
    value: float
    created_at: datetime

# schemas/liability.py
class LiabilityCreate(BaseModel):
    name: str
    type: str
    amount: float
    interest_rate: float

class LiabilityUpdate(BaseModel):
    name: str
    type: str
    amount: float
    interest_rate: float

# schemas/budget.py
class BudgetCreate(BaseModel):
    category_id: int
    budget_amount: float
    month: int
    year: int

class BudgetUpdate(BaseModel):
    budget_amount: float

# schemas/category.py
class CategoryCreate(BaseModel):
    name: str
    type: Literal["income", "expense"]

# schemas/subscription.py
class SubscriptionCreate(BaseModel):
    name: str
    amount: float
    billing_cycle: str
    next_payment_date: date
```

### Dependencies to Install (FastAPI version)

```bash
pip install fastapi uvicorn sqlalchemy passlib[bcrypt] python-jose[cryptography] python-multipart pydantic pydantic-settings
```

### Key Migration Points

1. **Database**: Replace `better-sqlite3` with SQLAlchemy + SQLite engine
2. **Password Hashing**: Replace `bcrypt` with `passlib[bcrypt]`
3. **JWT**: Replace `jsonwebtoken` with `python-jose`
4. **Middleware**: Create FastAPI dependency for token authentication
5. **CORS**: Use `fastapi.middleware.cors.CORSMiddleware`

---

## Current FastAPI Implementation Status

The running FastAPI backend in this repo intentionally implements a **simplified subset** of the legacy Express API and schema to keep the app small‑scale and easy to maintain.

### Tech Stack (FastAPI)

- **Runtime**: Python
- **Framework**: FastAPI
- **Server**: Uvicorn
- **ORM**: SQLAlchemy (synchronous engine)
- **Database**: SQLite (`finance_app.db`)
- **Auth**: JWT via `python-jose`, password hashing via `passlib[bcrypt]`
- **Config**: `pydantic` + `pydantic-settings`

### Database Schema Differences

- FastAPI currently uses SQLAlchemy models in `app/models/user_finance.py` with tables:
  - `users`, `income`, `expenses`, `loans`, `transactions`
- The legacy schema also defined additional tables:
  - `assets`, `liabilities`, `budgets`, `categories`, `subscriptions`
- Those additional tables are preserved as SQL files under `app/database/schema/*.sql`, but:
  - They are **not created in the active `finance_app.db` file**, and
  - There are **no FastAPI routes or models** for them yet.

In other words, the current FastAPI app uses a leaner financial model (income, expenses, loans, transactions) and does **not** expose dedicated asset/liability/budget/subscription/category endpoints.

### Endpoint Mapping vs Legacy Express

- Legacy Express base URL: `/api`
- FastAPI base URL (this repo): `/api/v1`

Implemented FastAPI modules:

- **Auth** – `/api/v1/auth`
  - `POST /register` (internal use, not exposed in OpenAPI docs)
  - `POST /login` – returns:

    ```json
    {
      "access_token": "<jwt>",
      "token_type": "bearer"
    }
    ```

    This uses OAuth2 password flow (`username` + `password` form fields) instead of the Express JSON body shape and `{ token, user }` response shown above.

- **Finance** – `/api/v1/finance`
  - `GET /dashboard`
  - `GET /income`, `POST /income`
  - `GET /expenses`, `POST /expenses`
  - `GET /loans`, `POST /loans`
  - `GET /transactions`
  - `GET /profile`, `PUT /profile`

- **Insights** – `/api/v1/insights`
  - `GET /` – high‑level “AI” financial insights

- **Admin** – `/api/v1/admin`
  - `GET /users`
  - `DELETE /users/{user_id}`
  - `GET /analytics`

Not yet implemented in FastAPI (but present in the legacy Express design in this document):

- `/api/assets`, `/api/liabilities`, `/api/budgets`, `/api/categories`, `/api/subscriptions`, `/api/transactions` (full CRUD as described above).

These sections remain as a reference to the **previous Express.js API**; they are useful for future expansion, but the current FastAPI service intentionally omits them for simplicity.

---

## Summary of Endpoints

| Module | POST | GET | PUT | DELETE |
|--------|------|-----|-----|--------|
| Auth | /signup, /login | / | - | - |
| Assets | / | / | /:id | /:id |
| Liabilities | / | / | /:id | /:id |
| Budgets | / | / | /:id | /:id |
| Categories | / | / | - | /:id |
| Subscriptions | / | / | - | /:id |
| Transactions | - | - | - | - |

**Total Protected Routes:** 19 (requiring authentication)
**Total Public Routes:** 3
