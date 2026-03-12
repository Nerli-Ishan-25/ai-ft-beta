# 🎨 FinWise AI — Frontend Documentation

> **Project**: FinWise AI Finance Dashboard
> **Framework**: React 19.2 + Vite 7.3
> **Last Updated**: 2026-03-07

---

## 📋 Table of Contents

1. [Design System](#-design-system)
2. [Color Theme](#-color-theme)
3. [Typography](#-typography)
4. [Application Lifecycle](#-application-lifecycle)
5. [Folder Structure](#-folder-structure)
6. [Component Registry](#-component-registry)
7. [Page Registry](#-page-registry)
8. [Routing & Guards](#-routing--guards)
9. [Data Flow](#-data-flow)
10. [Styling Architecture](#-styling-architecture)
11. [Animations](#-animations)
12. [Development Log](#-development-log)

---

## 🎨 Design System

The application follows a **premium dark-mode glassmorphic** aesthetic, inspired by modern fintech dashboards. Every surface uses translucent backgrounds, subtle borders, and layered depth to create a sense of sophistication.

### Core Principles

| Principle | Implementation |
|---|---|
| **Dark-first** | All surfaces use deep navy/charcoal backgrounds with high-contrast text |
| **Glassmorphism** | Auth and onboarding cards use `backdrop-filter: blur(12px)` with translucent `rgba` backgrounds |
| **Motion** | Staggered `fadeUp` animations on dashboard sections for a lively, breathing interface |
| **Depth** | Layered `box-shadow` values and subtle `border` colors create card elevation |
| **Consistency** | CSS variables ensure every component speaks the same visual language |

---

## 🌈 Color Theme

All colors are defined as CSS custom properties in `FontLoader.jsx` and applied globally.

### Primary Palette

| Variable | Hex | Preview | Usage |
|---|---|---|---|
| `--bg` | `#090c14` | ![#090c14](https://placehold.co/20x20/090c14/090c14) | Page background, deepest layer |
| `--surface` | `#111827` | ![#111827](https://placehold.co/20x20/111827/111827) | Card backgrounds, sidebar |
| `--surface2` | `#1a2133` | ![#1a2133](https://placehold.co/20x20/1a2133/1a2133) | Tooltip backgrounds, elevated surfaces |
| `--border` | `#1e2d45` | ![#1e2d45](https://placehold.co/20x20/1e2d45/1e2d45) | Card borders, dividers, muted lines |

### Accent Colors

| Variable | Hex | Preview | Usage |
|---|---|---|---|
| `--green` | `#10b981` | ![#10b981](https://placehold.co/20x20/10b981/10b981) | Positive values, primary CTA, income, savings |
| `--green-dim` | `#065f46` | ![#065f46](https://placehold.co/20x20/065f46/065f46) | Active nav item background, muted green |
| `--blue` | `#3b82f6` | ![#3b82f6](https://placehold.co/20x20/3b82f6/3b82f6) | Information, charts, secondary indicators |
| `--gold` | `#f59e0b` | ![#f59e0b](https://placehold.co/20x20/f59e0b/f59e0b) | Warnings, savings rate, star ratings |
| `--red` | `#ef4444` | ![#ef4444](https://placehold.co/20x20/ef4444/ef4444) | Negative values, expenses, debt, danger |
| `--red-dim` | `#7f1d1d` | ![#7f1d1d](https://placehold.co/20x20/7f1d1d/7f1d1d) | Danger button backgrounds, muted red |

### Text Colors

| Variable | Hex | Usage |
|---|---|---|
| `--text` | `#f1f5f9` | Primary text, headings, values |
| `--muted` | `#64748b` | Placeholders, disabled states |
| `--muted2` | `#94a3b8` | Secondary text, labels, sub-descriptions |

### Auth Page Gradients

The authentication pages use layered radial gradients for ambient lighting:

```css
background:
  radial-gradient(circle at top right, rgba(16, 185, 129, 0.08), transparent 400px),
  radial-gradient(circle at bottom left, rgba(59, 130, 246, 0.08), transparent 400px),
  var(--bg);
```

---

## ✏️ Typography

### Font Families

| Font | Weight Range | Usage | Source |
|---|---|---|---|
| **Sora** | 300–800 | Primary UI font (headings, labels, body) | Google Fonts |
| **DM Mono** | 300–500 | Monospaced values (currency, percentages, data) | Google Fonts |

### Type Scale

| Element | Size | Weight | Letter Spacing |
|---|---|---|---|
| Page heading (`h1`) | `28px` | 800 | `-0.5px` |
| Section title | `18px` | 700 | Default |
| Stat card value | `26px` | 700 | `-1px` |
| Label / subtitle | `12–14px` | 500–600 | Default |
| Body / description | `13px` | 400–500 | Default |
| Tags / chips | `11px` | 600 | Default |
| Sidebar branding | `15px` / `10px` | 800 / 400 | `-0.3px` / `0.5px` |

### Monospace Application

The `.mono` class is applied to all financial values to ensure clean numerical alignment:
```css
.mono { font-family: 'DM Mono', monospace; }
```

---

## 🔄 Application Lifecycle

### Boot Sequence

```
main.jsx
  └── StrictMode
       └── App.jsx
            ├── FontLoader (injects global CSS + fonts)
            └── BrowserRouter
                 └── Routes
                      ├── "/" → RootRoute (state-based redirect)
                      ├── "/login" → LoginPage
                      ├── "/signup" → SignupPage
                      ├── "/onboarding" → Onboarding (guarded)
                      ├── "/dashboard/*" → ProtectedRoute → DashboardApp
                      └── "*" → Redirect to "/"
```

### User Journey Flow

```
┌─────────────┐    ┌──────────────┐    ┌─────────────────┐    ┌───────────────┐
│  First Visit │───▶│  Login Page  │───▶│   Onboarding    │───▶│   Dashboard   │
│  (no user)   │    │  /login      │    │   /onboarding   │    │   /dashboard  │
└─────────────┘    └──────────────┘    │   3-step form   │    └───────────────┘
                          │            └─────────────────┘           │
                          ▼                                         │
                   ┌──────────────┐                                 │
                   │ Signup Page  │─────────────────────────────────▶│
                   │ /signup      │   (auto-login → onboarding)     │
                   └──────────────┘                                 │
                                                                    │
                                          ┌─────────────────────────┘
                                          │ Returning user
                                          │ (loggedUser + financialProfile exist)
                                          ▼
                                   Direct to /dashboard
```

### State Management

| Key | Storage | Purpose | Set By |
|---|---|---|---|
| `users` | `localStorage` | Registered user list (email + password) | `authService.signupUser()` |
| `loggedUser` | `localStorage` | Currently authenticated user object | `authService.loginUser()` / Signup auto-login |
| `financialProfile` | `localStorage` | Onboarding financial data (12 fields) | `Onboarding.jsx` on form submit |

### Authentication Service (`authService.js`)

```
signupUser(userData)
  ├── Check if email exists in "users" → Error if duplicate
  ├── Push new user to "users" array
  └── Return { success: true }

loginUser(email, password)
  ├── Find user in "users" by email + password match
  ├── Set "loggedUser" in localStorage
  └── Return { success: true }
```

---

## 📂 Folder Structure

```
Frontend/
├── src/
│   ├── main.jsx                    # React entry point
│   ├── App.jsx                     # Router + route guards
│   ├── index.css                   # Base reset styles
│   │
│   ├── components/                 # Reusable UI primitives
│   │   ├── AuthLayout.jsx          # Shared auth page wrapper (logo, card, shapes)
│   │   ├── AuthInput.jsx           # Icon-prefixed input field
│   │   ├── StatCard.jsx            # Dashboard stat card with trend indicator
│   │   ├── Modal.jsx               # Overlay dialog with close button
│   │   ├── CustomTooltip.jsx       # Recharts-compatible styled tooltip
│   │   ├── ScoreArc.jsx            # SVG half-circle score gauge
│   │   └── FontLoader.jsx          # Global styles, CSS vars, font imports
│   │
│   ├── pages/                      # Route-level page components
│   │   ├── LoginPage.jsx           # Email/password login
│   │   ├── SignupPage.jsx          # Name/email/password registration
│   │   ├── Onboarding.jsx          # 3-step financial profile wizard
│   │   ├── DashboardApp.jsx        # Dashboard shell (sidebar + tab router)
│   │   ├── Dashboard.jsx           # Overview tab (stats, charts, transactions)
│   │   ├── NetWorth.jsx            # Assets & liabilities manager
│   │   ├── BudgetPlanner.jsx       # Zero-based budget tracking
│   │   ├── Expenses.jsx            # Transaction list + category breakdown
│   │   ├── Loans.jsx               # Loan affordability analyzer
│   │   └── Insights.jsx            # Health score + smart suggestions
│   │
│   ├── styles/                     # Page-specific stylesheets
│   │   ├── auth.css                # Login/Signup visual design
│   │   └── onboarding.css          # Onboarding wizard design
│   │
│   ├── data/
│   │   └── mockData.js             # Chart data + transaction seeds
│   │
│   ├── services/
│   │   └── authService.js          # Login/signup localStorage logic
│   │
│   ├── utils/
│   │   └── helpers.js              # fmt(), pct(), icon maps
│   │
│   └── assets/
│       └── react.svg               # Default Vite asset
│
├── FRONTEND_DOCS.md                # ← This file
└── (screenshots)                   # Reference screenshots
```

---

## 🧩 Component Registry

### Reusable Components (`src/components/`)

| Component | Props | Purpose |
|---|---|---|
| **AuthLayout** | `title`, `subtitle`, `children` | Shared wrapper for Login & Signup pages. Renders logo, floating shapes, glassmorphic card, header text. |
| **AuthInput** | `icon`, `type`, `placeholder`, `value`, `onChange`, `name` | Icon-prefixed input field used across auth and onboarding forms. |
| **StatCard** | `label`, `value`, `sub`, `colorClass`, `Icon`, `isPositive` | Single stat indicator with trend arrow, used in the dashboard overview grid. |
| **Modal** | `title`, `onClose`, `children` | Fullscreen overlay dialog with backdrop blur and close button (X icon). |
| **CustomTooltip** | `active`, `payload`, `label`, `prefix` | Custom Recharts tooltip with dark theme styling and color dots. |
| **ScoreArc** | `score` | SVG half-circle progress arc, color-coded by score (green ≥75, gold ≥50, red <50). |
| **FontLoader** | *(none)* | Injects global `<style>` block with CSS variables, font imports, animations, and utility classes. |

---

## 📄 Page Registry

### Authentication Pages

| Page | Route | Key Features |
|---|---|---|
| **LoginPage** | `/login` | Email + password inputs, "Forgot password?" link, loading spinner, auto-redirect if logged in |
| **SignupPage** | `/signup` | Name + email + password inputs, Terms of Service, auto-login after signup |

### Onboarding

| Page | Route | Key Features |
|---|---|---|
| **Onboarding** | `/onboarding` | 3-step wizard with animated progress bar, step nodes with checkmarks, form validation |

**Onboarding Steps:**

| Step | Title | Fields |
|---|---|---|
| 1 — Income | "Let's talk income" | Monthly Income (required), Income Source (optional) |
| 2 — Assets | "Your Assets" | Savings Balance, Investments, Crypto, Property |
| 3 — Liabilities | "Liabilities & Expenses" | Credit Card Debt, Loans, Rent, Food, Transport, Subscriptions |

### Dashboard Tabs

| Tab | Component | Key Features |
|---|---|---|
| **Dashboard** | `Dashboard.jsx` | 4 stat cards, cash flow area chart, expense donut, net worth trend, recent transactions |
| **Net Worth** | `NetWorth.jsx` | Asset allocation pie chart, asset/liability lists, add/remove modals |
| **Budget** | `BudgetPlanner.jsx` | Zero-based budget tracker, category progress bars, unallocated income display |
| **Expenses** | `Expenses.jsx` | Monthly bar chart, category filter pills, transaction list with CRUD |
| **Loans** | `Loans.jsx` | Loan affordability form, DTI calculator, risk assessment, lender comparison table |
| **Insights** | `Insights.jsx` | Financial health score arc, factor breakdown, subscription auditor, AI smart tips |

---

## 🛡️ Routing & Guards

### Route Guard Components (defined in `App.jsx`)

#### `RootRoute`

The central state dispatcher. Determines where to send the user based on their current auth + onboarding status:

```
if (!loggedUser)          → /login
if (!financialProfile)    → /onboarding
else                      → /dashboard
```

#### `ProtectedRoute`

Wraps the `/dashboard/*` route. Prevents access if:
- User is not logged in → redirects to `/login`
- User has not completed onboarding → redirects to `/onboarding`

All redirects use `replace: true` to prevent back-button loops.

---

## 🔀 Data Flow

```
┌──────────────────────────────────────────────────────────────┐
│                    localStorage                              │
│                                                              │
│  "financialProfile"  ──────────────────────────────────────┐ │
│  {                                                         │ │
│    monthlyIncome, incomeSource,                            │ │
│    savings, investments, crypto, property,                 │ │
│    creditCardDebt, loans,                                  │ │
│    rent, food, transport, subscriptions                    │ │
│  }                                                         │ │
└────────────────────────────────────────────────────────────┘ │
                         │                                     │
                         ▼                                     │
              ┌─────────────────────┐                          │
              │   DashboardApp.jsx  │  (useMemo transforms)    │
              │                     │                          │
              │  profile → assets   │                          │
              │  profile → liabs    │                          │
              │  profile → budget   │                          │
              │  profile → income   │                          │
              └─────┬───────────────┘                          │
                    │ props                                    │
        ┌───────────┼───────────┬────────────┐                 │
        ▼           ▼           ▼            ▼                 │
   Dashboard    NetWorth   BudgetPlanner  Expenses             │
   (read-only)  (CRUD)     (CRUD)        (CRUD)               │
```

### Utility Functions (`helpers.js`)

| Function | Signature | Purpose |
|---|---|---|
| `fmt(n, dec)` | `(number, number) → string` | Formats number as USD currency (e.g., `$12,500`) |
| `pct(spent, budget)` | `(number, number) → number` | Calculates percentage (capped at 100) |
| `assetTypeIcon` | `object` | Maps asset types to emoji icons |
| `liabTypeIcon` | `object` | Maps liability types to emoji icons |

---

## 🎭 Styling Architecture

### CSS Strategy

| Layer | File | Scope |
|---|---|---|
| **Global Reset** | `index.css` | Vite defaults, body reset, scrollbar |
| **Design System** | `FontLoader.jsx` (inline `<style>`) | CSS variables, animations, cards, buttons, inputs, nav, modals |
| **Page-specific** | `styles/auth.css` | Auth page layout, glassmorphic card, form inputs, decorative shapes |
| **Page-specific** | `styles/onboarding.css` | Progress bar, step nodes, form layout, wizard-specific buttons |

### Key CSS Classes

| Class | Purpose |
|---|---|
| `.card` | Standard card with surface bg, border, 16px radius, hover effect |
| `.btn-primary` | Green gradient CTA button |
| `.btn-ghost` | Transparent outlined button (hover → green border) |
| `.btn-danger` | Red outlined destructive action button |
| `.btn-secondary` | Light transparent button for secondary actions |
| `.nav-item` / `.nav-item.active` | Sidebar navigation items with green gradient active state |
| `.stat-card` / `.stat-card.green` | Stat card with colored corner glow (::after pseudo-element) |
| `.tag-green` / `.tag-red` / `.tag-gold` / `.tag-blue` | Pill-shaped status tags |
| `.section-title` | Bold 18px heading with icon alignment |
| `.mono` | DM Mono font for numerical values |
| `.auth-page` / `.auth-card` | Centered glassmorphic auth layout |
| `.spinner` | CSS-only loading spinner (border animation) |
| `.forgot-password` | Styled "Forgot password?" link |
| `.auth-terms` | Terms of service text with green span |

---

## ✨ Animations

### Keyframe Definitions

| Animation | Duration | Effect |
|---|---|---|
| `fadeUp` | `0.45s` | Slide up 16px + fade in |
| `authFadeUp` | `0.6s` | Slide up 30px + fade in (auth cards) |
| `pulse-green` | *loop* | Pulsing green glow ring |
| `spin` | *loop* | 360° rotation (loading spinners) |
| `shapeRotate` | `20s` | Slow rotation + scale shift (decorative blobs) |

### Staggered Entry Classes

```css
.fade-up   → delay: 0ms
.fade-up-1 → delay: 50ms
.fade-up-2 → delay: 100ms
.fade-up-3 → delay: 150ms
.fade-up-4 → delay: 200ms
```

These are applied to dashboard sections to create a cascading "build-up" effect on page load.

### Transition Effects

| Element | Property | Duration |
|---|---|---|
| Cards | `border-color` | `0.2s` |
| Buttons | `opacity, transform` | `0.1–0.2s` |
| Inputs | `border-color` | `0.2s` |
| Nav items | `background, color` | `0.2s` |
| Progress bars | `width` | `1s ease` |
| Score arc | `stroke-dasharray` | `1.2s ease` |
| Onboarding step nodes | `all` | `0.3s ease` |
| Onboarding progress line | `width` | `0.4s ease` |

---

## 📝 Development Log

### Phase 1 — Project Scaffold
**Date**: 2026-03-06 (Early)

- Initialized React + Vite project with `create-vite`
- Installed dependencies: `react-router-dom`, `recharts`, `lucide-react`
- Built foundational components: `FontLoader`, `Modal`, `CustomTooltip`, `ScoreArc`
- Created mock data layer (`mockData.js`) and utility functions (`helpers.js`)

### Phase 2 — Dashboard Construction
**Date**: 2026-03-06

- Built `DashboardApp.jsx` as the main shell with sidebar navigation
- Created all 6 dashboard tab pages:
  - `Dashboard.jsx` — Overview with stat cards, area/pie/line charts
  - `NetWorth.jsx` — Asset/liability CRUD with pie chart allocation
  - `BudgetPlanner.jsx` — Zero-based budget tracker with progress bars
  - `Expenses.jsx` — Transaction management with bar chart and category filters
  - `Loans.jsx` — Loan affordability calculator with lender comparison
  - `Insights.jsx` — Financial health score, subscription auditor, smart tips
- All pages styled with consistent dark theme and staggered animations

### Phase 3 — Authentication System
**Date**: 2026-03-06

- Created `authService.js` with `signupUser()` and `loginUser()` using `localStorage`
- Built `LoginPage.jsx` and `SignupPage.jsx` with premium glassmorphic design
- Designed `auth.css` with floating decorative shapes, backdrop blur, and smooth fade-in
- Created reusable `AuthInput.jsx` component for icon-prefixed form fields

### Phase 4 — Onboarding Flow
**Date**: 2026-03-06

- Built 3-step `Onboarding.jsx` wizard:
  - Step 1: Income (Monthly Income + Source)
  - Step 2: Assets (Savings, Investments, Crypto, Property)
  - Step 3: Liabilities & Expenses (6 fields in 2-column grid)
- Designed animated progress indicator with step nodes and connecting line
- Styled with `onboarding.css` (progress bar, step animations, form layout)
- Data saved to `localStorage` as `"financialProfile"`

### Phase 5 — Routing & Flow Integration
**Date**: 2026-03-06

- Implemented `ProtectedRoute` and `RootRoute` in `App.jsx`
- Enforced strict flow: Login → Onboarding → Dashboard
- Auto-login after signup with seamless redirect to onboarding
- All redirects use `replace: true` for clean browser history
- `useEffect` guards on Login/Signup/Onboarding to prevent re-access

### Phase 6 — Dashboard Data Integration
**Date**: 2026-03-06

- Connected `financialProfile` from localStorage to `DashboardApp.jsx`
- Transformed onboarding data into initial state for assets, liabilities, and budget
- Passed `monthlyIncome` and `incomeSource` as props to Dashboard and BudgetPlanner
- Dashboard stat cards now display real user-provided financial data

### Phase 7 — Comprehensive Optimization
**Date**: 2026-03-07

- **DRY Extraction**:
  - Created `AuthLayout.jsx` — eliminated 40+ duplicate lines from Login/Signup
  - Created `StatCard.jsx` — standardized dashboard stat card rendering
- **Performance**:
  - `useMemo` for profile parsing and data transformation in `DashboardApp`
  - `useCallback` for `handleLogout` to stabilize reference
  - Moved `NAV_ITEMS` outside component to avoid re-creation on every render
- **Cleanup**:
  - Removed dead `initAssets`, `initLiabilities`, `initBudget` from `mockData.js`
  - Removed all unused imports (`DollarSign`, `ArrowUpRight`, `ArrowDownRight`, `useMemo`)
  - Eliminated inline style objects in favor of CSS classes (`.spinner`, `.forgot-password`, `.auth-terms`)
- **Division-by-zero fix**: Dashboard stat calculations now use `(income || 1)` to prevent `NaN`

---

## 📦 Dependencies

| Package | Version | Purpose |
|---|---|---|
| `react` | `^19.2.0` | UI library |
| `react-dom` | `^19.2.0` | DOM rendering |
| `react-router-dom` | `^7.13.1` | Client-side routing |
| `recharts` | `^3.7.0` | Charts (Area, Pie, Bar, Line) |
| `lucide-react` | `^0.577.0` | Icon library (200+ icons) |
| `vite` | `^7.3.1` | Build tool + dev server |
| `eslint` | `^9.39.1` | Code linting |

---

## 🔮 Future Roadmap

- [ ] Backend API integration (replace localStorage with REST/GraphQL)
- [ ] Password hashing (Web Crypto API)
- [ ] Responsive mobile layout
- [ ] Real-time transaction syncing
- [ ] Dark/light theme toggle
- [ ] Export financial reports (PDF/CSV)
- [ ] Multi-currency support

---

*Generated by FinWise AI Development Team — March 2026*
