export const fmt = (n, dec = 0) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: dec, maximumFractionDigits: dec }).format(n);

export const pct = (spent, budget) => Math.min(100, Math.round((spent / budget) * 100));

export const assetTypeIcon = { savings: "🏦", stocks: "📈", crypto: "₿", property: "🏠" };
export const liabTypeIcon = { student: "🎓", car: "🚗", credit: "💳", mortgage: "🏠", other: "📋" };
