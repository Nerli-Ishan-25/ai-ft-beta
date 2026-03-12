import React, { useState } from 'react';
import { CreditCard, Activity, Shield, TrendingUp } from "lucide-react";
import { fmt } from "../utils/helpers";

export default function Loans() {
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
                                    ? `⚠️ Your DTI of ${result.dti}% exceeds the 43% safe threshold. Consider a smaller loan of $${fmt(+result.maxLoan)} or reducing existing debt first.`
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
