import { useState } from "react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line
} from "recharts";
import {
  LayoutDashboard, TrendingUp, Wallet, Receipt, CreditCard,
  Lightbulb, Settings, LogOut, Plus, ChevronRight,
  ArrowUpRight, ArrowDownRight, AlertCircle, CheckCircle,
  Trash2, X, DollarSign, Target, Layers,
  Activity, Shield, Bell, RefreshCw
} from "lucide-react";

// Layers is used as a replacement for the unsupported PieChart icon alias
const PieIcon = Layers;

/* ─── GOOGLE FONTS ─────────────────────────────────────────────────── */
const FontLoader = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=DM+Mono:wght@300;400;500&display=swap');

    * { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --bg:        #090c14;
      --surface:   #111827;
      --surface2:  #1a2133;
      --border:    #1e2d45;
      --green:     #10b981;
      --green-dim: #065f46;
      --blue:      #3b82f6;
      --gold:      #f59e0b;
      --red:       #ef4444;
      --red-dim:   #7f1d1d;
      --text:      #f1f5f9;
      --muted:     #64748b;
      --muted2:    #94a3b8;
      font-family: 'Sora', sans-serif;
    }

    body { background: var(--bg); color: var(--text); }

    .mono { font-family: 'DM Mono', monospace; }

    /* scrollbar */
    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: var(--bg); }
    ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }

    /* animations */
    @keyframes fadeUp {
      from { opacity:0; transform:translateY(16px); }
      to   { opacity:1; transform:translateY(0); }
    }
    @keyframes pulse-green {
      0%,100% { box-shadow: 0 0 0 0 rgba(16,185,129,0.4); }
      50%      { box-shadow: 0 0 0 8px rgba(16,185,129,0); }
    }
    @keyframes spin { to { transform:rotate(360deg); } }

    .fade-up { animation: fadeUp 0.45s ease both; }
    .fade-up-1 { animation: fadeUp 0.45s 0.05s ease both; }
    .fade-up-2 { animation: fadeUp 0.45s 0.10s ease both; }
    .fade-up-3 { animation: fadeUp 0.45s 0.15s ease both; }
    .fade-up-4 { animation: fadeUp 0.45s 0.20s ease both; }

    .card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 24px;
      transition: border-color 0.2s;
    }
    .card:hover { border-color: #2d3f5c; }

    .btn-primary {
      background: var(--green);
      color: #000;
      border: none;
      padding: 10px 20px;
      border-radius: 10px;
      font-family: 'Sora', sans-serif;
      font-weight: 600;
      font-size: 13px;
      cursor: pointer;
      transition: opacity 0.2s, transform 0.1s;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }
    .btn-primary:hover { opacity: 0.9; transform: translateY(-1px); }
    .btn-ghost {
      background: transparent;
      color: var(--muted2);
      border: 1px solid var(--border);
      padding: 9px 18px;
      border-radius: 10px;
      font-family: 'Sora', sans-serif;
      font-weight: 500;
      font-size: 13px;
      cursor: pointer;
      transition: all 0.2s;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }
    .btn-ghost:hover { border-color: var(--green); color: var(--green); }
    .btn-danger {
      background: transparent;
      color: var(--red);
      border: 1px solid var(--red-dim);
      padding: 7px 14px;
      border-radius: 8px;
      font-family: 'Sora', sans-serif;
      font-weight: 500;
      font-size: 12px;
      cursor: pointer;
      transition: all 0.2s;
    }
    .btn-danger:hover { background: var(--red-dim); }

    input, select, textarea {
      background: var(--bg);
      border: 1px solid var(--border);
      color: var(--text);
      padding: 10px 14px;
      border-radius: 10px;
      font-family: 'Sora', sans-serif;
      font-size: 13px;
      width: 100%;
      outline: none;
      transition: border-color 0.2s;
    }
    input:focus, select:focus { border-color: var(--green); }
    input::placeholder { color: var(--muted); }
    select option { background: var(--surface2); }

    label { font-size: 12px; color: var(--muted2); margin-bottom: 6px; display: block; font-weight: 500; }

    .tag-green { background: #064e3b; color: var(--green); padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; }
    .tag-red   { background: var(--red-dim); color: var(--red); padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; }
    .tag-gold  { background: #451a03; color: var(--gold); padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; }
    .tag-blue  { background: #1e3a5f; color: var(--blue); padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; }

    /* progress bar */
    .progress-track { background: var(--bg); border-radius: 99px; height: 6px; overflow: hidden; }
    .progress-fill  { height: 100%; border-radius: 99px; transition: width 1s ease; }

    /* tooltip override */
    .recharts-tooltip-wrapper .recharts-default-tooltip {
      background: var(--surface2) !important;
      border: 1px solid var(--border) !important;
      border-radius: 10px !important;
      font-family: 'Sora', sans-serif !important;
      font-size: 12px !important;
    }

    /* modal */
    .modal-overlay {
      position: fixed; inset: 0;
      background: rgba(0,0,0,0.7);
      backdrop-filter: blur(4px);
      display: flex; align-items: center; justify-content: center;
      z-index: 1000;
      animation: fadeUp 0.2s ease;
    }
    .modal-box {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 20px;
      padding: 32px;
      width: 480px;
      max-width: 90vw;
    }

    .nav-item {
      display: flex; align-items: center; gap: 12px;
      padding: 11px 16px; border-radius: 12px;
      cursor: pointer; transition: all 0.2s;
      color: var(--muted2);
      font-size: 14px; font-weight: 500;
      border: 1px solid transparent;
    }
    .nav-item:hover { background: var(--surface2); color: var(--text); }
    .nav-item.active {
      background: linear-gradient(135deg, #064e3b, #065f46);
      color: var(--green);
      border-color: var(--green-dim);
    }
    .nav-item.active svg { color: var(--green); }

    .stat-card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 20px 24px;
      position: relative;
      overflow: hidden;
    }
    .stat-card::after {
      content: '';
      position: absolute;
      top: 0; right: 0;
      width: 80px; height: 80px;
      border-radius: 0 16px 0 80px;
      opacity: 0.06;
    }
    .stat-card.green::after { background: var(--green); }
    .stat-card.red::after   { background: var(--red); }
    .stat-card.blue::after  { background: var(--blue); }
    .stat-card.gold::after  { background: var(--gold); }

    .section-title {
      font-size: 18px; font-weight: 700;
      margin-bottom: 20px;
      display: flex; align-items: center; gap: 10px;
    }

    .divider { border: none; border-top: 1px solid var(--border); margin: 16px 0; }

    .chip {
      display: inline-flex; align-items: center; gap: 5px;
      padding: 4px 12px; border-radius: 99px;
      font-size: 11px; font-weight: 600; border: 1px solid;
    }
  `}</style>
);

/* ─── DEMO DATA ─────────────────────────────────────────────────────── */
const netWorthHistory = [
  { month: "Aug", value: 18400 },
  { month: "Sep", value: 21200 },
  { month: "Oct", value: 20800 },
  { month: "Nov", value: 23500 },
  { month: "Dec", value: 25100 },
  { month: "Jan", value: 27400 },
  { month: "Feb", value: 29800 },
  { month: "Mar", value: 31600 },
];

const monthlyFlow = [
  { month: "Sep", income: 4200, expenses: 3100 },
  { month: "Oct", income: 4200, expenses: 3400 },
  { month: "Nov", income: 4500, expenses: 3000 },
  { month: "Dec", income: 5100, expenses: 3800 },
  { month: "Jan", income: 4200, expenses: 3200 },
  { month: "Feb", income: 4200, expenses: 2900 },
  { month: "Mar", income: 4500, expenses: 3100 },
];

const expenseCategories = [
  { name: "Housing", value: 1200, color: "#3b82f6" },
  { name: "Food", value: 420, color: "#10b981" },
  { name: "Transport", value: 180, color: "#f59e0b" },
  { name: "Subscriptions", value: 87, color: "#8b5cf6" },
  { name: "Entertainment", value: 150, color: "#ef4444" },
  { name: "Health", value: 95, color: "#06b6d4" },
  { name: "Other", value: 168, color: "#64748b" },
];

const initAssets = [
  { id: 1, name: "Savings Account", type: "savings", value: 12500 },
  { id: 2, name: "Stock Portfolio", type: "stocks", value: 8400 },
  { id: 3, name: "Crypto (BTC/ETH)", type: "crypto", value: 3200 },
  { id: 4, name: "Property", type: "property", value: 45000 },
];

const initLiabilities = [
  { id: 1, name: "Student Loan", type: "student", amount: 18000, rate: 4.5 },
  { id: 2, name: "Car Loan", type: "car", amount: 7200, rate: 6.9 },
  { id: 3, name: "Credit Card", type: "credit", amount: 1900, rate: 19.9 },
];

const initBudget = [
  { id: 1, category: "Housing", budget: 1200, spent: 1200 },
  { id: 2, category: "Food", budget: 400, spent: 320 },
  { id: 3, category: "Transport", budget: 200, spent: 180 },
  { id: 4, category: "Subscriptions", budget: 100, spent: 87 },
  { id: 5, category: "Entertainment", budget: 200, spent: 150 },
  { id: 6, category: "Health", budget: 150, spent: 95 },
];

const initTransactions = [
  { id: 1, date: "2026-03-05", category: "Food", desc: "Grocery Store", amount: -62, icon: "🛒" },
  { id: 2, date: "2026-03-05", category: "Subscriptions", desc: "Netflix", amount: -12.99, icon: "📺" },
  { id: 3, date: "2026-03-04", category: "Income", desc: "Salary Deposit", amount: 4500, icon: "💼" },
  { id: 4, date: "2026-03-04", category: "Transport", desc: "Uber", amount: -14, icon: "🚗" },
  { id: 5, date: "2026-03-03", category: "Food", desc: "Restaurant", amount: -48, icon: "🍽️" },
  { id: 6, date: "2026-03-02", category: "Subscriptions", desc: "Spotify", amount: -10, icon: "🎵" },
  { id: 7, date: "2026-03-01", category: "Health", desc: "Gym Membership", amount: -35, icon: "🏋️" },
  { id: 8, date: "2026-02-28", category: "Entertainment", desc: "Cinema", amount: -22, icon: "🎬" },
  { id: 9, date: "2026-02-27", category: "Subscriptions", desc: "Apple iCloud", amount: -2.99, icon: "☁️" },
  { id: 10, date: "2026-02-26", category: "Transport", desc: "Gas Station", amount: -55, icon: "⛽" },
];

const subscriptions = [
  { name: "Netflix", amount: 12.99, icon: "📺", lastUsed: "2 days ago", active: true },
  { name: "Spotify", amount: 10.00, icon: "🎵", lastUsed: "Today", active: true },
  { name: "Gym", amount: 35.00, icon: "🏋️", lastUsed: "3 weeks ago", active: false },
  { name: "Apple iCloud", amount: 2.99, icon: "☁️", lastUsed: "1 week ago", active: true },
  { name: "Adobe CC", amount: 54.99, icon: "🎨", lastUsed: "Yesterday", active: true },
  { name: "Notion", amount: 8.00, icon: "📝", lastUsed: "4 months ago", active: false },
];

/* ─── HELPERS ───────────────────────────────────────────────────────── */
const fmt = (n, dec = 0) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: dec, maximumFractionDigits: dec }).format(n);

const pct = (spent, budget) => Math.min(100, Math.round((spent / budget) * 100));

const assetTypeIcon = { savings: "🏦", stocks: "📈", crypto: "₿", property: "🏠" };
const liabTypeIcon = { student: "🎓", car: "🚗", credit: "💳", mortgage: "🏠", other: "📋" };

/* ─── MODAL ─────────────────────────────────────────────────────────── */
function Modal({ title, onClose, children }) {
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <span style={{ fontSize: 18, fontWeight: 700 }}>{title}</span>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted2)" }}>
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

/* ─── CUSTOM TOOLTIP ─────────────────────────────────────────────────── */
function CustomTooltip({ active, payload, label, prefix = "$" }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: 10, padding: "10px 14px" }}>
      <div style={{ fontSize: 11, color: "var(--muted2)", marginBottom: 6 }}>{label}</div>
      {payload.map(p => (
        <div key={p.name} style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 13 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: p.color, display: "inline-block" }} />
          <span style={{ color: "var(--muted2)", textTransform: "capitalize" }}>{p.name}:</span>
          <span style={{ fontWeight: 600 }}>{prefix}{p.value.toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
}

/* ─── SCORE ARC ──────────────────────────────────────────────────────── */
function ScoreArc({ score }) {
  const r = 70, cx = 90, cy = 90;
  const total = Math.PI * r; // half-circle
  const filled = (score / 100) * total;
  const color = score >= 75 ? "var(--green)" : score >= 50 ? "var(--gold)" : "var(--red)";
  return (
    <svg width="180" height="110" viewBox="0 0 180 110">
      <path d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
        fill="none" stroke="var(--border)" strokeWidth="12" strokeLinecap="round" />
      <path d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
        fill="none" stroke={color} strokeWidth="12" strokeLinecap="round"
        strokeDasharray={`${filled} ${total}`}
        style={{ transition: "stroke-dasharray 1.2s ease" }} />
      <text x={cx} y={cy - 8} textAnchor="middle" fontSize="32" fontWeight="800"
        fill="var(--text)" fontFamily="Sora">{score}</text>
      <text x={cx} y={cy + 14} textAnchor="middle" fontSize="11" fill="var(--muted2)" fontFamily="Sora">out of 100</text>
    </svg>
  );
}

/* ════════════════════════════════════════════════════════════════════
   PAGE: DASHBOARD
════════════════════════════════════════════════════════════════════ */
function Dashboard({ assets, liabilities, transactions, setActiveTab }) {
  const totalAssets = assets.reduce((s, a) => s + a.value, 0);
  const totalDebt = liabilities.reduce((s, l) => s + l.amount, 0);
  const netWorth = totalAssets - totalDebt;
  const income = 4500;
  const expenses = transactions.filter(t => t.amount < 0).slice(0, 20).reduce((s, t) => s + Math.abs(t.amount), 0);
  const saved = income - expenses;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      {/* Header */}
      <div className="fade-up">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ color: "var(--muted2)", fontSize: 13, marginBottom: 4 }}>
              Good morning 👋 — March 2026
            </div>
            <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-0.5px" }}>
              Financial Overview
            </h1>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="btn-ghost"><Bell size={14} /> Alerts</button>
            <button className="btn-primary"><RefreshCw size={14} /> Sync</button>
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="fade-up-1" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
        {[
          { label: "Net Worth", value: fmt(netWorth), sub: "+$2,200 this month", cls: "green", Icon: TrendingUp, up: true },
          { label: "Monthly Income", value: fmt(income), sub: "Salary + freelance", cls: "blue", Icon: DollarSign, up: true },
          { label: "Monthly Expenses", value: fmt(expenses), sub: `${Math.round(expenses / income * 100)}% of income`, cls: "red", Icon: Receipt, up: false },
          { label: "Savings Rate", value: `${Math.round(saved / income * 100)}%`, sub: fmt(saved) + " saved", cls: "gold", Icon: Target, up: true },
        ].map(({ label, value, sub, cls, Icon, up }) => (
          <div key={label} className={`stat-card ${cls}`}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
              <span style={{ fontSize: 12, color: "var(--muted2)", fontWeight: 500 }}>{label}</span>
              <Icon size={16} color={`var(--${cls === "red" ? "red" : cls === "green" ? "green" : cls === "blue" ? "blue" : "gold"})`} />
            </div>
            <div className="mono" style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-1px", marginBottom: 6 }}>{value}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: up ? "var(--green)" : "var(--red)" }}>
              {up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
              <span>{sub}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="fade-up-2" style={{ display: "grid", gridTemplateColumns: "1.8fr 1fr", gap: 20 }}>
        {/* Cash flow */}
        <div className="card">
          <div className="section-title">
            <Activity size={18} color="var(--green)" />
            Monthly Cash Flow
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={monthlyFlow}>
              <defs>
                <linearGradient id="incGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="expGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" tick={{ fill: "var(--muted2)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "var(--muted2)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `$${v / 1000}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="income" stroke="#10b981" fill="url(#incGrad)" strokeWidth={2} name="income" />
              <Area type="monotone" dataKey="expenses" stroke="#ef4444" fill="url(#expGrad)" strokeWidth={2} name="expenses" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Expense donut */}
        <div className="card">
          <div className="section-title">
            <PieIcon size={18} color="var(--blue)" />
            Spending Split
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={expenseCategories} cx="50%" cy="50%" innerRadius={48} outerRadius={70}
                paddingAngle={3} dataKey="value">
                {expenseCategories.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip formatter={(v) => [`$${v}`, ""]} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 12px" }}>
            {expenseCategories.slice(0, 6).map(e => (
              <div key={e.name} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "var(--muted2)" }}>
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: e.color, flexShrink: 0 }} />
                {e.name}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Net Worth + Transactions */}
      <div className="fade-up-3" style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 20 }}>
        {/* Net worth trend */}
        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <div className="section-title" style={{ marginBottom: 0 }}>
              <TrendingUp size={18} color="var(--green)" />
              Net Worth Growth
            </div>
            <button className="btn-ghost" style={{ fontSize: 11 }} onClick={() => setActiveTab("networth")}>
              Details <ChevronRight size={12} />
            </button>
          </div>
          <div style={{ display: "flex", gap: 32, marginBottom: 20 }}>
            {[
              { label: "Assets", value: fmt(totalAssets), color: "var(--green)" },
              { label: "Debt", value: fmt(totalDebt), color: "var(--red)" },
              { label: "Net Worth", value: fmt(netWorth), color: "var(--text)" },
            ].map(({ label, value, color }) => (
              <div key={label}>
                <div style={{ fontSize: 11, color: "var(--muted2)", marginBottom: 3 }}>{label}</div>
                <div className="mono" style={{ fontSize: 18, fontWeight: 700, color }}>{value}</div>
              </div>
            ))}
          </div>
          <ResponsiveContainer width="100%" height={140}>
            <LineChart data={netWorthHistory}>
              <Line type="monotone" dataKey="value" stroke="var(--green)" strokeWidth={2.5} dot={false} />
              <XAxis dataKey="month" tick={{ fill: "var(--muted2)", fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip formatter={v => [fmt(v), "Net Worth"]} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Recent transactions */}
        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <div className="section-title" style={{ marginBottom: 0 }}>
              <Receipt size={18} color="var(--gold)" />
              Recent Transactions
            </div>
            <button className="btn-ghost" style={{ fontSize: 11 }} onClick={() => setActiveTab("expenses")}>
              View All <ChevronRight size={12} />
            </button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {transactions.slice(0, 6).map(t => (
              <div key={t.id} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 20 }}>{t.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{t.desc}</div>
                  <div style={{ fontSize: 11, color: "var(--muted2)" }}>{t.category} · {t.date}</div>
                </div>
                <div className="mono" style={{
                  fontSize: 14, fontWeight: 700,
                  color: t.amount > 0 ? "var(--green)" : "var(--text)"
                }}>
                  {t.amount > 0 ? "+" : ""}{fmt(t.amount, 2)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   PAGE: NET WORTH
════════════════════════════════════════════════════════════════════ */
function NetWorth({ assets, setAssets, liabilities, setLiabilities }) {
  const [modal, setModal] = useState(null); // "asset" | "liability"
  const [form, setForm] = useState({});

  const totalAssets = assets.reduce((s, a) => s + a.value, 0);
  const totalDebt = liabilities.reduce((s, l) => s + l.amount, 0);
  const netWorth = totalAssets - totalDebt;

  const assetAllocation = assets.map(a => ({
    name: a.name, value: a.value,
    color: a.type === "savings" ? "#10b981" : a.type === "stocks" ? "#3b82f6" : a.type === "crypto" ? "#f59e0b" : "#8b5cf6"
  }));

  const addAsset = () => {
    if (!form.name || !form.value) return;
    setAssets(prev => [...prev, { id: Date.now(), name: form.name, type: form.type || "savings", value: parseFloat(form.value) }]);
    setModal(null); setForm({});
  };
  const addLiability = () => {
    if (!form.name || !form.amount) return;
    setLiabilities(prev => [...prev, { id: Date.now(), name: form.name, type: form.type || "other", amount: parseFloat(form.amount), rate: parseFloat(form.rate || 0) }]);
    setModal(null); setForm({});
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      <div className="fade-up" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ color: "var(--muted2)", fontSize: 13, marginBottom: 4 }}>Track your wealth</div>
          <h1 style={{ fontSize: 28, fontWeight: 800 }}>Net Worth</h1>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn-ghost" onClick={() => { setForm({ isAsset: false }); setModal("liability"); }}>
            <Plus size={14} /> Add Debt
          </button>
          <button className="btn-primary" onClick={() => { setForm({ isAsset: true }); setModal("asset"); }}>
            <Plus size={14} /> Add Asset
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="fade-up-1" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
        {[
          { label: "Total Assets", value: fmt(totalAssets), color: "var(--green)", note: "What you own" },
          { label: "Total Liabilities", value: fmt(totalDebt), color: "var(--red)", note: "What you owe" },
          { label: "Net Worth", value: fmt(netWorth), color: "var(--text)", note: "Your wealth" },
        ].map(({ label, value, color, note }) => (
          <div key={label} className="card" style={{ textAlign: "center" }}>
            <div style={{ fontSize: 12, color: "var(--muted2)", marginBottom: 8 }}>{note}</div>
            <div style={{ fontSize: 12, color: "var(--muted2)", fontWeight: 500, marginBottom: 6 }}>{label}</div>
            <div className="mono" style={{ fontSize: 30, fontWeight: 800, color }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Chart + breakdown */}
      <div className="fade-up-2" style={{ display: "grid", gridTemplateColumns: "1fr 1.6fr", gap: 20 }}>
        <div className="card">
          <div className="section-title"><PieIcon size={18} color="var(--blue)" />Asset Allocation</div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={assetAllocation} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value">
                {assetAllocation.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip formatter={v => [fmt(v), ""]} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 8 }}>
            {assetAllocation.map(a => (
              <div key={a.name} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--muted2)" }}>
                <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: a.color }} />
                  {a.name}
                </span>
                <span style={{ color: "var(--text)", fontWeight: 600 }}>{fmt(a.value)}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Assets */}
          <div className="card" style={{ flex: 1 }}>
            <div className="section-title" style={{ color: "var(--green)" }}>
              <ArrowUpRight size={18} />Assets
            </div>
            {assets.map(a => (
              <div key={a.id} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                <span style={{ fontSize: 20 }}>{assetTypeIcon[a.type] || "💰"}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{a.name}</div>
                  <div style={{ fontSize: 11, color: "var(--muted2)", textTransform: "capitalize" }}>{a.type}</div>
                </div>
                <span className="mono" style={{ fontSize: 15, fontWeight: 700, color: "var(--green)" }}>{fmt(a.value)}</span>
                <button className="btn-danger" onClick={() => setAssets(p => p.filter(x => x.id !== a.id))}><Trash2 size={12} /></button>
              </div>
            ))}
          </div>

          {/* Liabilities */}
          <div className="card" style={{ flex: 1 }}>
            <div className="section-title" style={{ color: "var(--red)" }}>
              <ArrowDownRight size={18} />Liabilities
            </div>
            {liabilities.map(l => (
              <div key={l.id} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                <span style={{ fontSize: 20 }}>{liabTypeIcon[l.type] || "📋"}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{l.name}</div>
                  <div style={{ fontSize: 11, color: "var(--muted2)" }}>{l.rate}% APR</div>
                </div>
                <span className="mono" style={{ fontSize: 15, fontWeight: 700, color: "var(--red)" }}>-{fmt(l.amount)}</span>
                <button className="btn-danger" onClick={() => setLiabilities(p => p.filter(x => x.id !== l.id))}><Trash2 size={12} /></button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modals */}
      {modal === "asset" && (
        <Modal title="Add Asset" onClose={() => setModal(null)}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div><label>Asset Name</label><input placeholder="e.g. Savings Account" onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
            <div><label>Type</label>
              <select onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                <option value="savings">Savings</option>
                <option value="stocks">Stocks</option>
                <option value="crypto">Crypto</option>
                <option value="property">Property</option>
              </select>
            </div>
            <div><label>Current Value ($)</label><input type="number" placeholder="0.00" onChange={e => setForm(f => ({ ...f, value: e.target.value }))} /></div>
            <button className="btn-primary" style={{ marginTop: 8 }} onClick={addAsset}>Add Asset</button>
          </div>
        </Modal>
      )}
      {modal === "liability" && (
        <Modal title="Add Liability" onClose={() => setModal(null)}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div><label>Debt Name</label><input placeholder="e.g. Student Loan" onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
            <div><label>Type</label>
              <select onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                <option value="student">Student Loan</option>
                <option value="car">Car Loan</option>
                <option value="credit">Credit Card</option>
                <option value="mortgage">Mortgage</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div><label>Amount Owed ($)</label><input type="number" placeholder="0.00" onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} /></div>
            <div><label>Interest Rate (% APR)</label><input type="number" placeholder="0.0" onChange={e => setForm(f => ({ ...f, rate: e.target.value }))} /></div>
            <button className="btn-primary" style={{ marginTop: 8 }} onClick={addLiability}>Add Debt</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   PAGE: BUDGET PLANNER
════════════════════════════════════════════════════════════════════ */
function BudgetPlanner({ budget, setBudget }) {
  const [income, setIncome] = useState(4500);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({});

  const totalBudget = budget.reduce((s, b) => s + b.budget, 0);
  const totalSpent = budget.reduce((s, b) => s + b.spent, 0);
  const unallocated = income - totalBudget;

  const addCategory = () => {
    if (!form.category || !form.budget) return;
    setBudget(p => [...p, { id: Date.now(), category: form.category, budget: parseFloat(form.budget), spent: 0 }]);
    setModal(false); setForm({});
  };

  const catColors = ["#10b981", "#3b82f6", "#f59e0b", "#8b5cf6", "#ef4444", "#06b6d4", "#64748b", "#f97316"];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      <div className="fade-up" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ color: "var(--muted2)", fontSize: 13, marginBottom: 4 }}>Zero-based budgeting</div>
          <h1 style={{ fontSize: 28, fontWeight: 800 }}>Budget Planner</h1>
        </div>
        <button className="btn-primary" onClick={() => setModal(true)}><Plus size={14} />Add Category</button>
      </div>

      {/* Budget summary */}
      <div className="fade-up-1" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
        {[
          { label: "Monthly Income", value: fmt(income), color: "var(--green)" },
          { label: "Total Budgeted", value: fmt(totalBudget), color: "var(--blue)" },
          { label: "Total Spent", value: fmt(totalSpent), color: "var(--red)" },
          { label: "Unallocated", value: fmt(unallocated), color: unallocated >= 0 ? "var(--gold)" : "var(--red)" },
        ].map(({ label, value, color }) => (
          <div key={label} className="card" style={{ textAlign: "center" }}>
            <div style={{ fontSize: 11, color: "var(--muted2)", marginBottom: 6 }}>{label}</div>
            <div className="mono" style={{ fontSize: 22, fontWeight: 700, color }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Zero-balance indicator */}
      <div className="fade-up-2 card" style={{
        borderColor: unallocated === 0 ? "var(--green)" : unallocated < 0 ? "var(--red)" : "var(--border)",
        display: "flex", alignItems: "center", gap: 14
      }}>
        {unallocated === 0
          ? <CheckCircle size={22} color="var(--green)" />
          : <AlertCircle size={22} color={unallocated < 0 ? "var(--red)" : "var(--gold)"} />}
        <div>
          <div style={{ fontWeight: 600, fontSize: 14 }}>
            {unallocated === 0
              ? "Perfect zero-balance budget!"
              : unallocated > 0
                ? `You have ${fmt(unallocated)} left to allocate`
                : `Over-budget by ${fmt(Math.abs(unallocated))}`}
          </div>
          <div style={{ fontSize: 12, color: "var(--muted2)" }}>
            Income − Budgeted = {fmt(income)} − {fmt(totalBudget)} = {fmt(unallocated)}
          </div>
        </div>
      </div>

      {/* Category cards */}
      <div className="fade-up-3" style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 16 }}>
        {budget.map((b, i) => {
          const p = pct(b.spent, b.budget);
          const over = b.spent > b.budget;
          const color = catColors[i % catColors.length];
          return (
            <div key={b.id} className="card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{b.category}</div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <span className={over ? "tag-red" : "tag-green"}>{p}%</span>
                  <button className="btn-danger" onClick={() => setBudget(pv => pv.filter(x => x.id !== b.id))}><Trash2 size={11} /></button>
                </div>
              </div>
              <div className="progress-track" style={{ marginBottom: 10 }}>
                <div className="progress-fill" style={{ width: `${p}%`, background: over ? "var(--red)" : color }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--muted2)" }}>
                <span>Spent: <strong style={{ color: "var(--text)" }}>{fmt(b.spent)}</strong></span>
                <span>Budget: <strong style={{ color: "var(--text)" }}>{fmt(b.budget)}</strong></span>
                <span style={{ color: over ? "var(--red)" : "var(--green)" }}>
                  {over ? `Over by ${fmt(b.spent - b.budget)}` : `${fmt(b.budget - b.spent)} left`}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {modal && (
        <Modal title="Add Budget Category" onClose={() => setModal(false)}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div><label>Category Name</label><input placeholder="e.g. Groceries" onChange={e => setForm(f => ({ ...f, category: e.target.value }))} /></div>
            <div><label>Monthly Budget ($)</label><input type="number" placeholder="0.00" onChange={e => setForm(f => ({ ...f, budget: e.target.value }))} /></div>
            <button className="btn-primary" style={{ marginTop: 8 }} onClick={addCategory}>Add Category</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   PAGE: EXPENSES
════════════════════════════════════════════════════════════════════ */
function Expenses({ transactions, setTransactions }) {
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({});
  const [filter, setFilter] = useState("All");

  const cats = ["All", ...Array.from(new Set(transactions.map(t => t.category)))];
  const catIcons = { Food: "🍽️", Transport: "🚗", Subscriptions: "📺", Entertainment: "🎬", Health: "💊", Income: "💼", Other: "📦" };

  const filtered = filter === "All" ? transactions : transactions.filter(t => t.category === filter);

  const addExpense = () => {
    if (!form.desc || !form.amount || !form.category) return;
    const amt = form.category === "Income" ? parseFloat(form.amount) : -parseFloat(form.amount);
    setTransactions(p => [
      {
        id: Date.now(), date: new Date().toISOString().slice(0, 10), category: form.category,
        desc: form.desc, amount: amt, icon: catIcons[form.category] || "📦"
      },
      ...p
    ]);
    setModal(false); setForm({});
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      <div className="fade-up" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ color: "var(--muted2)", fontSize: 13, marginBottom: 4 }}>Track daily spending</div>
          <h1 style={{ fontSize: 28, fontWeight: 800 }}>Expenses</h1>
        </div>
        <button className="btn-primary" onClick={() => setModal(true)}><Plus size={14} />Add Transaction</button>
      </div>

      {/* Charts */}
      <div className="fade-up-1" style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 20 }}>
        <div className="card">
          <div className="section-title"><Activity size={18} color="var(--gold)" />Monthly Trend</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={monthlyFlow}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" tick={{ fill: "var(--muted2)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "var(--muted2)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `$${v / 1000}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="income" fill="#10b981" radius={[4, 4, 0, 0]} name="income" />
              <Bar dataKey="expenses" fill="#ef4444" radius={[4, 4, 0, 0]} name="expenses" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="card">
          <div className="section-title"><PieIcon size={18} color="var(--blue)" />By Category</div>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={expenseCategories} cx="50%" cy="50%" outerRadius={72} paddingAngle={2} dataKey="value">
                {expenseCategories.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip formatter={v => [`$${v}`, ""]} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 8px" }}>
            {expenseCategories.map(e => (
              <div key={e.name} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "var(--muted2)" }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: e.color }} />
                {e.name} <span style={{ color: "var(--text)", marginLeft: "auto" }}>${e.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Transaction list */}
      <div className="fade-up-2 card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div className="section-title" style={{ marginBottom: 0 }}><Receipt size={18} color="var(--gold)" />Transactions</div>
          <div style={{ display: "flex", gap: 8 }}>
            {cats.map(c => (
              <button key={c} onClick={() => setFilter(c)}
                style={{
                  padding: "5px 14px", borderRadius: 99, fontSize: 11, fontWeight: 600, cursor: "pointer", border: "1px solid",
                  background: filter === c ? "var(--green)" : "transparent",
                  borderColor: filter === c ? "var(--green)" : "var(--border)",
                  color: filter === c ? "#000" : "var(--muted2)"
                }}>
                {c}
              </button>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {filtered.map(t => (
            <div key={t.id} style={{
              display: "flex", alignItems: "center", gap: 12, padding: "11px 0",
              borderBottom: "1px solid var(--border)"
            }}>
              <span style={{ fontSize: 22, flexShrink: 0 }}>{t.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{t.desc}</div>
                <div style={{ fontSize: 11, color: "var(--muted2)" }}>{t.category} · {t.date}</div>
              </div>
              <div className="mono" style={{ fontWeight: 700, color: t.amount > 0 ? "var(--green)" : "var(--text)" }}>
                {t.amount > 0 ? "+" : ""}{fmt(t.amount, 2)}
              </div>
              <button className="btn-danger" style={{ padding: "5px 10px" }}
                onClick={() => setTransactions(p => p.filter(x => x.id !== t.id))}>
                <Trash2 size={12} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {modal && (
        <Modal title="Add Transaction" onClose={() => setModal(false)}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div><label>Description</label><input placeholder="e.g. Grocery Store" onChange={e => setForm(f => ({ ...f, desc: e.target.value }))} /></div>
            <div><label>Category</label>
              <select onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                <option value="">Select...</option>
                {["Food", "Transport", "Subscriptions", "Entertainment", "Health", "Income", "Other"].map(c =>
                  <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div><label>Amount ($)</label><input type="number" placeholder="0.00" onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} /></div>
            <button className="btn-primary" style={{ marginTop: 8 }} onClick={addExpense}>Save Transaction</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   PAGE: LOANS
════════════════════════════════════════════════════════════════════ */
function Loans() {
  const [form, setForm] = useState({ amount: 20000, rate: 7, term: 5, income: 4500, debt: 800 });
  const [result, setResult] = useState(null);

  const analyze = () => {
    const { amount, rate, term, income, debt } = form;
    const r = rate / 100 / 12;
    const n = term * 12;
    const monthly = amount * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const dti = ((debt + monthly) / income) * 100;
    const maxLoan = income * 0.35 * ((Math.pow(1 + r, n) - 1) / (r * Math.pow(1 + r, n))) - debt * n;
    const risk = dti > 43 ? "High" : dti > 36 ? "Medium" : "Low";
    setResult({ monthly: monthly.toFixed(2), dti: dti.toFixed(1), maxLoan: Math.max(0, maxLoan).toFixed(0), risk });
  };

  const lenders = [
    { name: "Bank A", rate: 7.0, monthly: result ? (parseFloat(result.monthly)).toFixed(2) : "—" },
    { name: "Credit Union", rate: 6.5, monthly: result ? (parseFloat(result.monthly) * 0.96).toFixed(2) : "—" },
    { name: "Online Bank", rate: 6.2, monthly: result ? (parseFloat(result.monthly) * 0.93).toFixed(2) : "—" },
    { name: "Bank B", rate: 7.5, monthly: result ? (parseFloat(result.monthly) * 1.04).toFixed(2) : "—" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      <div className="fade-up">
        <div style={{ color: "var(--muted2)", fontSize: 13, marginBottom: 4 }}>AI-powered loan affordability</div>
        <h1 style={{ fontSize: 28, fontWeight: 800 }}>Loan Analyzer</h1>
      </div>

      <div className="fade-up-1" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {/* Input form */}
        <div className="card">
          <div className="section-title"><CreditCard size={18} color="var(--blue)" />Loan Details</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
            <div>
              <label>Loan Amount ($)</label>
              <input type="number" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: +e.target.value }))} />
            </div>
            <div>
              <label>Interest Rate (%)</label>
              <input type="number" step="0.1" value={form.rate} onChange={e => setForm(f => ({ ...f, rate: +e.target.value }))} />
            </div>
            <div>
              <label>Loan Term (years)</label>
              <input type="number" value={form.term} onChange={e => setForm(f => ({ ...f, term: +e.target.value }))} />
            </div>
            <div>
              <label>Monthly Income ($)</label>
              <input type="number" value={form.income} onChange={e => setForm(f => ({ ...f, income: +e.target.value }))} />
            </div>
            <div style={{ gridColumn: "1/-1" }}>
              <label>Existing Monthly Debt ($)</label>
              <input type="number" value={form.debt} onChange={e => setForm(f => ({ ...f, debt: +e.target.value }))} />
            </div>
          </div>
          <button className="btn-primary" style={{ width: "100%", justifyContent: "center" }} onClick={analyze}>
            <Activity size={14} /> Analyze Affordability
          </button>
        </div>

        {/* Result */}
        <div className="card">
          <div className="section-title"><Shield size={18} color="var(--green)" />Risk Assessment</div>
          {result ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                {[
                  { label: "Monthly Payment", value: `$${result.monthly}`, color: "var(--text)" },
                  { label: "Debt-to-Income", value: `${result.dti}%`, color: result.dti > 43 ? "var(--red)" : result.dti > 36 ? "var(--gold)" : "var(--green)" },
                  { label: "Max Recommended", value: fmt(+result.maxLoan), color: "var(--green)" },
                  { label: "Default Risk", value: result.risk, color: result.risk === "High" ? "var(--red)" : result.risk === "Medium" ? "var(--gold)" : "var(--green)" },
                ].map(({ label, value, color }) => (
                  <div key={label} className="card" style={{ padding: "16px", background: "var(--bg)" }}>
                    <div style={{ fontSize: 11, color: "var(--muted2)", marginBottom: 6 }}>{label}</div>
                    <div className="mono" style={{ fontSize: 20, fontWeight: 700, color }}>{value}</div>
                  </div>
                ))}
              </div>
              <div style={{
                padding: "14px 16px", borderRadius: 12, background: "var(--bg)", border: "1px solid var(--border)",
                fontSize: 13, lineHeight: 1.6, color: "var(--muted2)"
              }}>
                {result.risk === "High"
                  ? `⚠️ Your DTI of ${result.dti}% exceeds the 43% safe threshold. Consider a smaller loan of ${fmt(+result.maxLoan)} or reducing existing debt first.`
                  : result.risk === "Medium"
                    ? `⚡ Your DTI of ${result.dti}% is manageable but on the higher side. Aim to keep total debt payments under 36% of income.`
                    : `✅ This loan looks affordable. Your DTI of ${result.dti}% is within the healthy range. You're in a good position to take this loan.`}
              </div>
            </div>
          ) : (
            <div style={{ color: "var(--muted2)", fontSize: 14, textAlign: "center", marginTop: 60 }}>
              Fill in the loan details and click<br />
              <strong style={{ color: "var(--text)" }}>Analyze Affordability</strong> to see results.
            </div>
          )}
        </div>
      </div>

      {/* Lender comparison */}
      <div className="fade-up-2 card">
        <div className="section-title"><TrendingUp size={18} color="var(--gold)" />Lender Comparison</div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                {["Lender", "Interest Rate", "Est. Monthly", "Total Cost", "Rating"].map(h => (
                  <th key={h} style={{ padding: "8px 12px", textAlign: "left", color: "var(--muted2)", fontSize: 11, fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {lenders.map((l, i) => {
                const total = (parseFloat(l.monthly.replace("—", "0")) * form.term * 12).toFixed(0);
                return (
                  <tr key={l.name} style={{ borderBottom: "1px solid var(--border)" }}>
                    <td style={{ padding: "12px" }}>
                      <div style={{ fontWeight: 600 }}>{l.name}</div>
                      {i === 2 && <span className="tag-green" style={{ marginTop: 4, display: "inline-block" }}>Best Rate</span>}
                    </td>
                    <td style={{ padding: "12px" }} className="mono">{l.rate}%</td>
                    <td style={{ padding: "12px" }} className="mono">{result ? `$${l.monthly}` : "—"}</td>
                    <td style={{ padding: "12px" }} className="mono">{result ? fmt(+total) : "—"}</td>
                    <td style={{ padding: "12px" }}>
                      <div style={{ display: "flex", gap: 3 }}>
                        {[1, 2, 3, 4, 5].map(s => (
                          <span key={s} style={{ fontSize: 12, color: s <= (5 - i) ? "var(--gold)" : "var(--border)" }}>★</span>
                        ))}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   PAGE: INSIGHTS  (Recurring Detector + Health Score + AI Tips)
════════════════════════════════════════════════════════════════════ */
function Insights({ transactions }) {
  const totalSubs = subscriptions.reduce((s, x) => s + x.amount, 0);
  const activeSubs = subscriptions.filter(x => x.active).reduce((s, x) => s + x.amount, 0);
  const unusedSubs = subscriptions.filter(x => !x.active).reduce((s, x) => s + x.amount, 0);

  const healthScore = 78;
  const factors = [
    { label: "Savings Rate", score: 85, note: "33% — Excellent", color: "var(--green)" },
    { label: "Debt Ratio", score: 62, note: "DTI 38% — Moderate", color: "var(--gold)" },
    { label: "Emergency Fund", score: 70, note: "3.2 months covered", color: "var(--gold)" },
    { label: "Spending Control", score: 80, note: "Under budget most cats", color: "var(--green)" },
    { label: "Net Worth Growth", score: 90, note: "+$13k past 6 months", color: "var(--green)" },
  ];

  const tips = [
    { icon: "🔔", title: "Subscription Overload", body: `You're spending $${totalSubs.toFixed(2)}/month on subscriptions — $${(totalSubs * 12).toFixed(0)}/year. Cancelling unused ones could save you $${unusedSubs.toFixed(2)}/month.`, tag: "warning" },
    { icon: "📈", title: "Invest Your Surplus", body: `You saved $1,100 last month. Consider moving $500 to an index fund — historically averaging ~10% annual returns.`, tag: "tip" },
    { icon: "🏦", title: "High-Interest Debt", body: `Your credit card at 19.9% APR is costing you the most. Pay it off before investing. Estimated interest: $378/year.`, tag: "action" },
    { icon: "🎯", title: "Budget is Working", body: `You stayed under budget in 4 of 6 categories this month. Keep it up to hit your savings goals 2 months early.`, tag: "good" },
  ];

  const tagStyle = {
    warning: "var(--gold)",
    tip: "var(--blue)",
    action: "var(--red)",
    good: "var(--green)",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      <div className="fade-up">
        <div style={{ color: "var(--muted2)", fontSize: 13, marginBottom: 4 }}>AI-powered analysis</div>
        <h1 style={{ fontSize: 28, fontWeight: 800 }}>Financial Insights</h1>
      </div>

      <div className="fade-up-1" style={{ display: "grid", gridTemplateColumns: "1fr 1.6fr", gap: 20 }}>
        {/* Health score */}
        <div className="card" style={{ textAlign: "center" }}>
          <div className="section-title" style={{ justifyContent: "center" }}>
            <Shield size={18} color="var(--green)" />Financial Health Score
          </div>
          <ScoreArc score={healthScore} />
          <div style={{ fontSize: 13, color: "var(--muted2)", marginTop: 8, marginBottom: 20 }}>
            {healthScore >= 75 ? "Great shape! Keep building." : "Room to improve — see tips below."}
          </div>
          <hr className="divider" />
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 12, textAlign: "left" }}>
            {factors.map(f => (
              <div key={f.label}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 5 }}>
                  <span style={{ color: "var(--muted2)" }}>{f.label}</span>
                  <span style={{ color: f.color, fontWeight: 600 }}>{f.score}/100</span>
                </div>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${f.score}%`, background: f.color }} />
                </div>
                <div style={{ fontSize: 10, color: "var(--muted)", marginTop: 3 }}>{f.note}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Recurring detector + tips */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Subscriptions */}
          <div className="card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div className="section-title" style={{ marginBottom: 0 }}>
                <RefreshCw size={18} color="var(--blue)" />Recurring Expenses
              </div>
              <div style={{ fontSize: 12, color: "var(--muted2)" }}>
                <span className="mono" style={{ color: "var(--text)", fontWeight: 700 }}>${totalSubs.toFixed(2)}</span>/mo · <span style={{ color: "var(--gold)" }}>${(totalSubs * 12).toFixed(0)}/yr</span>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {subscriptions.map(s => (
                <div key={s.name} style={{
                  display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", borderRadius: 10,
                  background: "var(--bg)", border: "1px solid var(--border)",
                  opacity: s.active ? 1 : 0.7
                }}>
                  <span style={{ fontSize: 22 }}>{s.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{s.name}</div>
                    <div style={{ fontSize: 11, color: "var(--muted2)" }}>Last used: {s.lastUsed}</div>
                  </div>
                  <span className="mono" style={{ fontSize: 13, fontWeight: 700 }}>${s.amount.toFixed(2)}<span style={{ color: "var(--muted2)", fontSize: 10 }}>/mo</span></span>
                  {!s.active && <span className="tag-red">Unused</span>}
                  {s.active && <span className="tag-green">Active</span>}
                </div>
              ))}
            </div>
            {unusedSubs > 0 && (
              <div style={{
                marginTop: 14, padding: "10px 14px", borderRadius: 10, background: "rgba(239,68,68,0.08)",
                border: "1px solid var(--red-dim)", fontSize: 12, color: "var(--red)"
              }}>
                💡 Cancel unused subscriptions to save <strong>${unusedSubs.toFixed(2)}/month</strong> (${(unusedSubs * 12).toFixed(0)}/year)
              </div>
            )}
          </div>

          {/* Smart tips */}
          <div className="card">
            <div className="section-title"><Lightbulb size={18} color="var(--gold)" />Smart Suggestions</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {tips.map(t => (
                <div key={t.title} style={{
                  display: "flex", gap: 12, padding: "12px 14px", borderRadius: 10,
                  background: "var(--bg)", border: "1px solid var(--border)"
                }}>
                  <span style={{ fontSize: 22, flexShrink: 0 }}>{t.icon}</span>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: 13, fontWeight: 600 }}>{t.title}</span>
                      <span style={{ width: 7, height: 7, borderRadius: "50%", background: tagStyle[t.tag], flexShrink: 0 }} />
                    </div>
                    <div style={{ fontSize: 12, color: "var(--muted2)", lineHeight: 1.5 }}>{t.body}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   ROOT APP
════════════════════════════════════════════════════════════════════ */
export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [assets, setAssets] = useState(initAssets);
  const [liabilities, setLiabilities] = useState(initLiabilities);
  const [budget, setBudget] = useState(initBudget);
  const [transactions, setTransactions] = useState(initTransactions);

  const navItems = [
    { id: "dashboard", label: "Dashboard", Icon: LayoutDashboard },
    { id: "networth", label: "Net Worth", Icon: TrendingUp },
    { id: "budget", label: "Budget Planner", Icon: Wallet },
    { id: "expenses", label: "Expenses", Icon: Receipt },
    { id: "loans", label: "Loans", Icon: CreditCard },
    { id: "insights", label: "Insights", Icon: Lightbulb },
  ];

  const totalAssets = assets.reduce((s, a) => s + a.value, 0);
  const totalDebt = liabilities.reduce((s, l) => s + l.amount, 0);
  const netWorth = totalAssets - totalDebt;

  return (
    <>
      <FontLoader />
      <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg)" }}>
        {/* ── SIDEBAR ─────────────────────────────────────────────── */}
        <aside style={{
          width: 240, flexShrink: 0, display: "flex", flexDirection: "column",
          background: "var(--surface)", borderRight: "1px solid var(--border)",
          padding: "28px 16px", position: "sticky", top: 0, height: "100vh", overflowY: "auto"
        }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 36, paddingLeft: 4 }}>
            <div style={{
              width: 34, height: 34, borderRadius: 10,
              background: "linear-gradient(135deg, var(--green), #059669)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 0 14px rgba(16,185,129,0.4)"
            }}>
              <DollarSign size={18} color="#000" strokeWidth={2.5} />
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 800, letterSpacing: "-0.3px" }}>FinWise</div>
              <div style={{ fontSize: 10, color: "var(--muted2)", letterSpacing: "0.5px" }}>AI FINANCE</div>
            </div>
          </div>

          {/* Net worth widget in sidebar */}
          <div style={{
            background: "linear-gradient(135deg, #064e3b, #065f46)",
            border: "1px solid var(--green-dim)",
            borderRadius: 14, padding: "14px 16px", marginBottom: 28
          }}>
            <div style={{ fontSize: 10, color: "rgba(16,185,129,0.7)", marginBottom: 4, fontWeight: 600, letterSpacing: "0.5px" }}>NET WORTH</div>
            <div className="mono" style={{ fontSize: 22, fontWeight: 800, color: "var(--green)" }}>{fmt(netWorth)}</div>
            <div style={{ fontSize: 11, color: "rgba(16,185,129,0.6)", marginTop: 4 }}>+$2,200 this month ↑</div>
          </div>

          {/* Nav */}
          <nav style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
            {navItems.map(({ id, label, Icon }) => (
              <div key={id} className={`nav-item ${activeTab === id ? "active" : ""}`} onClick={() => setActiveTab(id)}>
                <Icon size={17} />
                {label}
              </div>
            ))}
          </nav>

          {/* Bottom */}
          <div style={{ marginTop: "auto", paddingTop: 20, borderTop: "1px solid var(--border)" }}>
            <div className="nav-item"><Settings size={17} />Settings</div>
            <div className="nav-item"><LogOut size={17} />Log Out</div>
          </div>
        </aside>

        {/* ── MAIN ──────────────────────────────────────────────────── */}
        <main style={{ flex: 1, padding: "36px 40px", overflowY: "auto", minHeight: "100vh" }}>
          {activeTab === "dashboard" && (
            <Dashboard assets={assets} liabilities={liabilities} transactions={transactions} setActiveTab={setActiveTab} />
          )}
          {activeTab === "networth" && (
            <NetWorth assets={assets} setAssets={setAssets} liabilities={liabilities} setLiabilities={setLiabilities} />
          )}
          {activeTab === "budget" && (
            <BudgetPlanner budget={budget} setBudget={setBudget} />
          )}
          {activeTab === "expenses" && (
            <Expenses transactions={transactions} setTransactions={setTransactions} />
          )}
          {activeTab === "loans" && <Loans />}
          {activeTab === "insights" && <Insights transactions={transactions} />}
        </main>
      </div>
    </>
  );
}
