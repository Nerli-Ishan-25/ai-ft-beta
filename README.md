# Finance Dashboard Frontend

## Overview
This repository contains a **single‑page finance dashboard** built with **React** and **Vite**.  All UI code lives under the `Frontend/src` directory.  The app displays a personal‑finance overview, net‑worth tracking, and a zero‑based budgeting tool.

## Project Structure
```
AI-FT beta/
├─ Frontend/                # <-- all front‑end source code
│   └─ src/                 # React components, styles and demo data
│       ├─ App.jsx          # Main application component (Dashboard, Net Worth, Budget Planner)
│       ├─ assets/          # Folder for static assets (icons, images, etc.)
│       ├─ index.css        # Global CSS variables and base styles
│       └─ main.jsx         # Entry point – mounts <App />
├─ index.html               # HTML entry point (script points to Frontend/src/main.jsx)
├─ package.json
├─ vite.config.js
└─ README.md                # **This file** – detailed feature description
```

## Features
### 1. Dashboard (Home)
- **Financial Overview** – shows net worth, monthly income, expenses and savings rate.
- **Stat cards** with animated icons (`TrendingUp`, `DollarSign`, `Receipt`, `Target`).
- **Cash‑flow area chart** (income vs expenses) using **Recharts**.
- **Spending split donut** visualising expense categories.
- **Net‑worth trend line chart**.
- **Recent transactions** list with icons and colour‑coded amounts.
- **Responsive layout** – grid‑based, adapts to desktop and mobile.

### 2. Net Worth Page
- Displays **total assets**, **total liabilities**, and **net worth**.
- **Asset allocation pie chart** (savings, stocks, crypto, property).
- **Tables** for assets and liabilities with add‑/delete‑modals.
- **Modals** (`Add Asset`, `Add Liability`) built with a reusable `Modal` component.
- Uses **Lucide‑React** icons for visual cues.

### 3. Budget Planner
- **Zero‑based budgeting** – set a monthly income and allocate a budget per category.
- **Category cards** show budget vs spent, colour‑coded progress bar, and over‑budget warning.
- **Summary cards** for income, total budgeted, total spent, and unallocated amount.
- **Add Category modal** to create new budget categories.
- Real‑time calculations of percentages and remaining budget.

### 4. UI/UX Details
- **CSS variables** for dark‑mode colour palette (`--bg`, `--surface`, `--green`, etc.).
- **Custom animations** (`fadeUp`, `pulse-green`, `spin`).
- **Micro‑interactions** – button hover effects, animated stat cards, progress bar transitions.
- **Responsive containers** from Recharts ensure charts resize with the viewport.
- **Google Font** loading (`Sora`, `DM Mono`).

## Dependencies
- `react` & `react-dom` – UI library.
- `vite` – fast development server & bundler.
- `recharts` – charting components.
- `lucide-react` – icon set.
- Development: `eslint`, `@vitejs/plugin-react`.

## How to Run Locally
```bash
# Install dependencies (already done, but repeat if needed)
npm install

# Start the development server
npm run dev
```
Open <http://localhost:5173> in a browser.  The app will hot‑reload on file changes.

## Building for Production
```bash
npm run build   # creates a production‑ready bundle in /dist
npm run preview # preview the built app locally
```

---
*This README lives in the repository root while all front‑end source files are under `Frontend/src`.  The `index.html` script tag has been updated to load the app from the new location.*
