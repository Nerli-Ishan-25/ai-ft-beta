import React, { useState } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Plus, Activity, Receipt, Trash2, Layers } from "lucide-react";
import Modal from "../components/Modal";
import CustomTooltip from "../components/CustomTooltip";
import { monthlyFlow, expenseCategories } from "../data/mockData";
import { fmt } from "../utils/helpers";

const PieIcon = Layers;

export default function Expenses({ transactions, setTransactions }) {
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
