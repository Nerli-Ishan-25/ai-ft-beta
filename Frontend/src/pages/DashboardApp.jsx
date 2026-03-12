import React, { useState, useMemo, useCallback } from 'react';
import { LayoutDashboard, TrendingUp, Wallet, Receipt, CreditCard, Lightbulb, Settings, LogOut, DollarSign } from "lucide-react";
import { useNavigate } from "react-router-dom";

import Dashboard from './Dashboard';
import NetWorth from './NetWorth';
import BudgetPlanner from './BudgetPlanner';
import Expenses from './Expenses';
import Loans from './Loans';
import Insights from './Insights';

import { initTransactions } from '../data/mockData';
import { fmt } from '../utils/helpers';

const NAV_ITEMS = [
    { id: "dashboard", label: "Dashboard", Icon: LayoutDashboard },
    { id: "networth", label: "Net Worth", Icon: TrendingUp },
    { id: "budget", label: "Budget Planner", Icon: Wallet },
    { id: "expenses", label: "Expenses", Icon: Receipt },
    { id: "loans", label: "Loans", Icon: CreditCard },
    { id: "insights", label: "Insights", Icon: Lightbulb },
];

export default function DashboardApp() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("dashboard");

    // Memoize profile properties to avoid re-parsing on every render
    const profile = useMemo(() => JSON.parse(localStorage.getItem("financialProfile")) || {}, []);

    // Transform profile into initial state values ONLY once
    const initialData = useMemo(() => {
        const assets = [
            { id: 1, name: "Savings Account", type: "savings", value: Number(profile.savings || 0) },
            { id: 2, name: "Stock Portfolio", type: "stocks", value: Number(profile.investments || 0) },
            { id: 3, name: "Crypto (BTC/ETH)", type: "crypto", value: Number(profile.crypto || 0) },
            { id: 4, name: "Property", type: "property", value: Number(profile.property || 0) },
        ];

        const liabilities = [
            { id: 1, name: "Credit Card Debt", type: "credit", amount: Number(profile.creditCardDebt || 0), rate: 19.9 },
            { id: 2, name: "Loans", type: "other", amount: Number(profile.loans || 0), rate: 6.5 },
        ];

        const budget = [
            { id: 1, category: "Housing", budget: Number(profile.rent || 0), spent: Number(profile.rent || 0) },
            { id: 2, category: "Food", budget: Number(profile.food || 0), spent: Math.round(Number(profile.food || 0) * 0.8) },
            { id: 3, category: "Transport", budget: Number(profile.transport || 0), spent: Math.round(Number(profile.transport || 0) * 0.9) },
            { id: 4, category: "Subscriptions", budget: Number(profile.subscriptions || 0), spent: Number(profile.subscriptions || 0) },
        ];

        return { assets, liabilities, budget };
    }, [profile]);

    const [assets, setAssets] = useState(initialData.assets);
    const [liabilities, setLiabilities] = useState(initialData.liabilities);
    const [budget, setBudget] = useState(initialData.budget);
    const [transactions, setTransactions] = useState(initTransactions);

    const totalAssets = assets.reduce((s, a) => s + a.value, 0);
    const totalDebt = liabilities.reduce((s, l) => s + l.amount, 0);
    const netWorth = totalAssets - totalDebt;

    const handleLogout = useCallback(() => {
        localStorage.removeItem("loggedUser");
        navigate("/login", { replace: true });
    }, [navigate]);

    return (
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
                    {navItems.map((item) => (
                        <div key={item.id} className={`nav-item ${activeTab === item.id ? "active" : ""}`} onClick={() => setActiveTab(item.id)}>
                            <item.Icon size={17} />
                            {item.label}
                        </div>
                    ))}
                </nav>

                {/* Bottom */}
                <div style={{ marginTop: "auto", paddingTop: 20, borderTop: "1px solid var(--border)" }}>
                    <div className="nav-item"><Settings size={17} />Settings</div>
                    <div className="nav-item" onClick={handleLogout}><LogOut size={17} />Log Out</div>
                </div>
            </aside>

            {/* ── MAIN ──────────────────────────────────────────────────── */}
            <main style={{ flex: 1, padding: "36px 40px", overflowY: "auto", minHeight: "100vh" }}>
                {activeTab === "dashboard" && (
                    <Dashboard
                        assets={assets}
                        liabilities={liabilities}
                        transactions={transactions}
                        setActiveTab={setActiveTab}
                        monthlyIncome={profile.monthlyIncome}
                        profileSource={profile.incomeSource}
                    />
                )}
                {activeTab === "networth" && (
                    <NetWorth assets={assets} setAssets={setAssets} liabilities={liabilities} setLiabilities={setLiabilities} />
                )}
                {activeTab === "budget" && (
                    <BudgetPlanner budget={budget} setBudget={setBudget} income={Number(profile.monthlyIncome || 0)} />
                )}
                {activeTab === "expenses" && (
                    <Expenses transactions={transactions} setTransactions={setTransactions} />
                )}
                {activeTab === "loans" && <Loans />}
                {activeTab === "insights" && <Insights transactions={transactions} />}
            </main>
        </div>
    );
}
