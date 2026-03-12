import React from 'react';
import { Shield, RefreshCw, Lightbulb } from "lucide-react";
import ScoreArc from "../components/ScoreArc";
import { subscriptions } from "../data/mockData";

export default function Insights() {
    const totalSubs = subscriptions.reduce((s, x) => s + x.amount, 0);
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
