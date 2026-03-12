export default function CustomTooltip({ active, payload, label, prefix = "$" }) {
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
