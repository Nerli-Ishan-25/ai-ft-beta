import React, { useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { Plus, ArrowUpRight, ArrowDownRight, Trash2, Layers } from "lucide-react";
import Modal from "../components/Modal";
import { fmt, assetTypeIcon, liabTypeIcon } from "../utils/helpers";

const PieIcon = Layers;

export default function NetWorth({ assets, setAssets, liabilities, setLiabilities }) {
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
