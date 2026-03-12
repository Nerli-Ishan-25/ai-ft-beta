import React, { useState } from 'react';
import { Plus, CheckCircle, AlertCircle, Trash2 } from "lucide-react";
import Modal from "../components/Modal";
import { fmt, pct } from "../utils/helpers";

export default function BudgetPlanner({ budget, setBudget, income }) {
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
