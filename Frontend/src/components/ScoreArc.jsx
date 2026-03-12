export default function ScoreArc({ score }) {
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
