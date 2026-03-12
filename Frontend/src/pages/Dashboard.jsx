import React from 'react';
import { AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { TrendingUp, DollarSign, Receipt, Target, Activity, Bell, RefreshCw, ChevronRight, Layers } from "lucide-react";

import CustomTooltip from "../components/CustomTooltip";
import { monthlyFlow, expenseCategories, netWorthHistory } from "../data/mockData";
import { fmt } from "../utils/helpers";

const PieIcon = Layers;

import StatCard from "../components/StatCard";

export default function Dashboard({ assets, liabilities, transactions, setActiveTab, monthlyIncome, profileSource }) {
    const totalAssets = assets.reduce((s, a) => s + a.value, 0);
    const totalDebt = liabilities.reduce((s, l) => s + l.amount, 0);
    const netWorth = totalAssets - totalDebt;
    const income = Number(monthlyIncome || 0);
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
                <StatCard
                    label="Net Worth"
                    value={fmt(netWorth)}
                    sub="+$2,200 this month"
                    colorClass="green"
                    Icon={TrendingUp}
                    isPositive={true}
                />
                <StatCard
                    label="Monthly Income"
                    value={fmt(income)}
                    sub={profileSource || "Salary + freelance"}
                    colorClass="blue"
                    Icon={DollarSign}
                    isPositive={true}
                />
                <StatCard
                    label="Monthly Expenses"
                    value={fmt(expenses)}
                    sub={`${Math.round(expenses / (income || 1) * 100)}% of income`}
                    colorClass="red"
                    Icon={Receipt}
                    isPositive={false}
                />
                <StatCard
                    label="Savings Rate"
                    value={`${Math.round(saved / (income || 1) * 100)}%`}
                    sub={fmt(saved) + " saved"}
                    colorClass="gold"
                    Icon={Target}
                    isPositive={true}
                />
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
