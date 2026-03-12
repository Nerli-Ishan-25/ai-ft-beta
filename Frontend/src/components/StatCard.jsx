import React from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

const StatCard = ({ label, value, sub, colorClass, Icon, isPositive, valuePrefix = "" }) => {
    return (
        <div className={`stat-card ${colorClass}`}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                <span style={{ fontSize: 12, color: "var(--muted2)", fontWeight: 500 }}>{label}</span>
                <Icon size={16} color={`var(--${colorClass === "red" ? "red" : colorClass === "green" ? "green" : colorClass === "blue" ? "blue" : "gold"})`} />
            </div>
            <div className="mono" style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-1px", marginBottom: 6 }}>
                {valuePrefix}{value}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: isPositive ? "var(--green)" : "var(--red)" }}>
                {isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                <span>{sub}</span>
            </div>
        </div>
    );
};

export default StatCard;
