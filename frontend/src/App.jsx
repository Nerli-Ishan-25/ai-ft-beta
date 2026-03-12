import React, { useState, useEffect } from 'react';
import {
    TrendingUp, TrendingDown, DollarSign, Wallet,
    Plus, History, BarChart3, Settings, LogOut, Loader2,
    PieChart, ChevronRight, Calculator, Activity,
    Receipt, Trash2, X, Check, AlertCircle, CreditCard,
    Building, Percent, Calendar, ArrowUpRight, ArrowDownRight,
    PiggyBank, Target, Shield, Zap, User, Key, Save
} from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    ResponsiveContainer, AreaChart, Area, Cell, PieChart as RePieChart, Pie,
    LineChart, Line
} from 'recharts';

const API_BASE = 'http://localhost:8000/api/v1';

// API Helper
const api = {
    get: async (endpoint, token) => {
        const resp = await fetch(`${API_BASE}${endpoint}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        return resp.json();
    },
    post: async (endpoint, token, body) => {
        const resp = await fetch(`${API_BASE}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(body)
        });
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        return resp.json();
    },
    put: async (endpoint, token, body) => {
        const resp = await fetch(`${API_BASE}${endpoint}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(body)
        });
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        return resp.json();
    },
    delete: async (endpoint, token) => {
        const resp = await fetch(`${API_BASE}${endpoint}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` }
        });
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        return resp.ok;
    }
};

// Reusable Components
const StatCard = ({ label, value, icon: Icon, color, bg, subtext }) => (
    <div className="bg-[#161b22] p-6 rounded-xl border border-[#30363d] shadow-sm">
        <div className="flex justify-between items-start mb-4">
            <div className={`${bg} p-2 rounded-lg`}>
                <Icon size={20} className={color} />
            </div>
            {subtext && <span className="text-xs text-[#8b949e]">{subtext}</span>}
        </div>
        <p className="text-sm text-[#8b949e] mb-1">{label}</p>
        <h3 className={`text-2xl font-bold ${color}`}>
            {typeof value === 'number' ? `$${value.toLocaleString()}` : value || '$0'}
        </h3>
    </div>
);

const Modal = ({ title, onClose, children }) => (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-[#161b22] w-full max-w-lg rounded-2xl border border-[#30363d] shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white">{title}</h3>
                <button onClick={onClose} className="text-[#8b949e] hover:text-white p-2">
                    <X size={20} />
                </button>
            </div>
            {children}
        </div>
    </div>
);

const ProgressBar = ({ value, max }) => {
    const percentage = Math.min(100, Math.max(0, (value / max) * 100));
    let color = 'bg-[#238636]';
    if (percentage > 95) color = 'bg-[#f85149]';
    else if (percentage > 80) color = 'bg-[#d29922]';
    return (
        <div className="w-full bg-[#21262d] rounded-full h-2 mt-2">
            <div className={`${color} h-2 rounded-full transition-all`} style={{ width: `${percentage}%` }} />
        </div>
    );
};

const DeleteButton = ({ onClick }) => (
    <button onClick={onClick} className="p-2 text-[#f85149] hover:bg-[#341d1a] rounded-lg transition">
        <Trash2 size={16} />
    </button>
);

const LoadingSpinner = () => (
    <div className="flex items-center justify-center p-8">
        <Loader2 className="animate-spin text-[#238636]" size={32} />
    </div>
);

const InputField = ({ label, type = 'text', value, onChange, placeholder, required = false, step }) => (
    <div className="mb-4">
        <label className="block text-xs font-bold text-[#8b949e] mb-1 uppercase">{label}</label>
        <input
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            step={step}
            className="w-full p-3 bg-[#0d1117] border border-[#30363d] rounded-lg focus:outline-none focus:border-[#238636] text-white"
        />
    </div>
);

const SelectField = ({ label, value, onChange, options }) => (
    <div className="mb-4">
        <label className="block text-xs font-bold text-[#8b949e] mb-1 uppercase">{label}</label>
        <select
            value={value}
            onChange={onChange}
            className="w-full p-3 bg-[#0d1117] border border-[#30363d] rounded-lg focus:outline-none focus:border-[#238636] text-white"
        >
            {options.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
        </select>
    </div>
);

const COLORS = ['#238636', '#2ea043', '#3fb950', '#79c0ff', '#58a6ff', '#1f6feb', '#9333ea', '#d29922', '#f85149', '#db6d28'];

const App = () => {
    // Auth State
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [authForm, setAuthForm] = useState({ email: '', password: '', name: '', isLogin: true });

    // Navigation
    const [activeTab, setActiveTab] = useState('dashboard');

    // Loading State
    const [loading, setLoading] = useState(false);

    // Dashboard Data
    const [dashboard, setDashboard] = useState(null);
    const [transactions, setTransactions] = useState([]);

    // Net Worth Data
    const [assets, setAssets] = useState([]);
    const [liabilities, setLiabilities] = useState([]);
    const [showAssetModal, setShowAssetModal] = useState(false);
    const [showLiabilityModal, setShowLiabilityModal] = useState(false);
    const [assetForm, setAssetForm] = useState({ name: '', value: '', type: 'Cash' });
    const [liabilityForm, setLiabilityForm] = useState({ name: '', balance: '', type: 'Credit Card' });

    // Budget Data
    const [budgets, setBudgets] = useState([]);
    const [categories, setCategories] = useState([]);
    const [showBudgetModal, setShowBudgetModal] = useState(false);
    const [budgetForm, setBudgetForm] = useState({ category_id: '', amount: '' });

    // Expenses Data
    const [expenseTransactions, setExpenseTransactions] = useState([]);
    const [expenseFilter, setExpenseFilter] = useState('All');
    const [showExpenseModal, setShowExpenseModal] = useState(false);
    const [expenseForm, setExpenseForm] = useState({ amount: '', category: '', description: '', date: new Date().toISOString().split('T')[0] });

    // Loans Data
    const [loans, setLoans] = useState([]);
    const [loanAnalyzer, setLoanAnalyzer] = useState({
        loanAmount: '', interestRate: '', loanTerm: '',
        monthlyIncome: '', existingDebt: ''
    });
    const [loanAnalysis, setLoanAnalysis] = useState(null);

    // Insights Data
    const [insights, setInsights] = useState(null);
    const [subscriptions, setSubscriptions] = useState([]);

    // Settings Data
    const [profileForm, setProfileForm] = useState({ name: '', email: '' });
    const [passwordForm, setPasswordForm] = useState({ current: '', new: '' });

    // Fetch Functions
    const fetchDashboard = async () => {
        if (!token) return;
        try {
            const data = await api.get('/finance/dashboard', token);
            setDashboard(data);
        } catch (e) { console.error('Dashboard fetch error:', e); }
    };

    const fetchTransactions = async () => {
        if (!token) return;
        try {
            const data = await api.get('/finance/transactions?limit=20', token);
            setTransactions(data);
        } catch (e) { console.error('Transactions fetch error:', e); }
    };

    const fetchAssets = async () => {
        if (!token) return;
        try {
            const data = await api.get('/assets/', token);
            setAssets(data);
        } catch (e) { console.error('Assets fetch error:', e); }
    };

    const fetchLiabilities = async () => {
        if (!token) return;
        try {
            const data = await api.get('/liabilities/', token);
            setLiabilities(data);
        } catch (e) { console.error('Liabilities fetch error:', e); }
    };

    const fetchBudgets = async () => {
        if (!token) return;
        try {
            const data = await api.get('/budgets/', token);
            setBudgets(data);
        } catch (e) { console.error('Budgets fetch error:', e); }
    };

    const fetchCategories = async () => {
        if (!token) return;
        try {
            const data = await api.get('/categories/', token);
            setCategories(data);
        } catch (e) { console.error('Categories fetch error:', e); }
    };

    const fetchExpenseTransactions = async () => {
        if (!token) return;
        try {
            const data = await api.get('/finance/transactions?limit=100', token);
            setExpenseTransactions(data);
        } catch (e) { console.error('Expense transactions fetch error:', e); }
    };

    const fetchLoans = async () => {
        if (!token) return;
        try {
            const data = await api.get('/finance/loans', token);
            setLoans(data);
        } catch (e) { console.error('Loans fetch error:', e); }
    };

    const fetchInsights = async () => {
        if (!token) return;
        try {
            const data = await api.get('/insights/', token);
            setInsights(data);
        } catch (e) { console.error('Insights fetch error:', e); }
    };

    const fetchSubscriptions = async () => {
        if (!token) return;
        try {
            const data = await api.get('/subscriptions/', token);
            setSubscriptions(data);
        } catch (e) { console.error('Subscriptions fetch error:', e); }
    };

    const fetchProfile = async () => {
        if (!token) return;
        try {
            const data = await api.get('/finance/profile', token);
            setProfileForm({ name: data.name || '', email: data.email || '' });
        } catch (e) { console.error('Profile fetch error:', e); }
    };

    // Initial Data Fetch
    useEffect(() => {
        if (token) {
            fetchDashboard();
            fetchTransactions();
            fetchAssets();
            fetchLiabilities();
            fetchBudgets();
            fetchCategories();
            fetchExpenseTransactions();
            fetchLoans();
            fetchInsights();
            fetchSubscriptions();
            fetchProfile();
        }
    }, [token]);

    // Refresh data when tab changes
    useEffect(() => {
        if (!token) return;
        switch (activeTab) {
            case 'dashboard': fetchDashboard(); fetchTransactions(); break;
            case 'networth': fetchAssets(); fetchLiabilities(); break;
            case 'budget': fetchBudgets(); fetchCategories(); break;
            case 'expenses': fetchExpenseTransactions(); break;
            case 'loans': fetchLoans(); break;
            case 'insights': fetchInsights(); fetchSubscriptions(); break;
            case 'settings': fetchProfile(); break;
        }
    }, [activeTab]);

    // Auth Handler
    const handleAuth = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const endpoint = authForm.isLogin ? '/auth/login' : '/auth/register';
            const body = authForm.isLogin
                ? new URLSearchParams({ username: authForm.email, password: authForm.password })
                : JSON.stringify({ email: authForm.email, password: authForm.password, name: authForm.name });

            const resp = await fetch(`${API_BASE}${endpoint}`, {
                method: 'POST',
                headers: authForm.isLogin
                    ? { 'Content-Type': 'application/x-www-form-urlencoded' }
                    : { 'Content-Type': 'application/json' },
                body
            });
            const data = await resp.json();
            if (data.access_token) {
                localStorage.setItem('token', data.access_token);
                setToken(data.access_token);
            } else if (!authForm.isLogin && resp.ok) {
                setAuthForm({ ...authForm, isLogin: true });
                alert('Registered! Please login.');
            }
        } catch (e) {
            alert('Auth failed: ' + e.message);
        }
        setLoading(false);
    };

    // Asset Handlers
    const handleAddAsset = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/assets/', token, {
                name: assetForm.name,
                value: parseFloat(assetForm.value),
                asset_type: assetForm.type
            });
            setShowAssetModal(false);
            setAssetForm({ name: '', value: '', type: 'Cash' });
            fetchAssets();
        } catch (e) { alert('Failed to add asset'); }
        setLoading(false);
    };

    const handleDeleteAsset = async (id) => {
        if (!confirm('Delete this asset?')) return;
        try {
            await api.delete(`/assets/${id}`, token);
            fetchAssets();
        } catch (e) { alert('Failed to delete asset'); }
    };

    // Liability Handlers
    const handleAddLiability = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/liabilities/', token, {
                name: liabilityForm.name,
                balance: parseFloat(liabilityForm.balance),
                liability_type: liabilityForm.type
            });
            setShowLiabilityModal(false);
            setLiabilityForm({ name: '', balance: '', type: 'Credit Card' });
            fetchLiabilities();
        } catch (e) { alert('Failed to add liability'); }
        setLoading(false);
    };

    const handleDeleteLiability = async (id) => {
        if (!confirm('Delete this liability?')) return;
        try {
            await api.delete(`/liabilities/${id}`, token);
            fetchLiabilities();
        } catch (e) { alert('Failed to delete liability'); }
    };

    // Budget Handlers
    const handleAddBudget = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/budgets/', token, {
                category_id: parseInt(budgetForm.category_id),
                amount: parseFloat(budgetForm.amount)
            });
            setShowBudgetModal(false);
            setBudgetForm({ category_id: '', amount: '' });
            fetchBudgets();
        } catch (e) { alert('Failed to add budget'); }
        setLoading(false);
    };

    const handleDeleteBudget = async (id) => {
        if (!confirm('Delete this budget category?')) return;
        try {
            await api.delete(`/budgets/${id}`, token);
            fetchBudgets();
        } catch (e) { alert('Failed to delete budget'); }
    };

    // Expense Handlers
    const handleAddExpense = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/finance/expenses', token, {
                amount: parseFloat(expenseForm.amount),
                category: expenseForm.category,
                description: expenseForm.description
            });
            setShowExpenseModal(false);
            setExpenseForm({ amount: '', category: '', description: '', date: new Date().toISOString().split('T')[0] });
            fetchExpenseTransactions();
            fetchDashboard();
        } catch (e) { alert('Failed to add expense'); }
        setLoading(false);
    };

    const handleDeleteTransaction = async (id) => {
        if (!confirm('Delete this transaction?')) return;
        try {
            await api.delete(`/finance/transactions/${id}`, token);
            fetchExpenseTransactions();
            fetchDashboard();
        } catch (e) { alert('Failed to delete transaction'); }
    };

    // Loan Analysis
    const analyzeLoan = () => {
        const { loanAmount, interestRate, loanTerm, monthlyIncome, existingDebt } = loanAnalyzer;
        if (!loanAmount || !interestRate || !loanTerm || !monthlyIncome) {
            alert('Please fill in all required fields');
            return;
        }

        const principal = parseFloat(loanAmount);
        const rate = parseFloat(interestRate) / 100 / 12;
        const months = parseFloat(loanTerm) * 12;
        const income = parseFloat(monthlyIncome);
        const existing = parseFloat(existingDebt) || 0;

        // Calculate monthly payment
        const monthlyPayment = principal * rate * Math.pow(1 + rate, months) / (Math.pow(1 + rate, months) - 1);
        const totalPayment = monthlyPayment * months;
        const totalInterest = totalPayment - principal;

        // DTI calculation
        const newDti = ((existing + monthlyPayment) / income) * 100;
        const currentDti = (existing / income) * 100;

        // Risk assessment
        let riskLevel = 'Low';
        let riskColor = 'text-[#238636]';
        let recommendation = 'Loan appears affordable based on your income.';

        if (newDti > 43) {
            riskLevel = 'High';
            riskColor = 'text-[#f85149]';
            recommendation = 'DTI exceeds recommended 43% threshold. Consider a smaller loan.';
        } else if (newDti > 36) {
            riskLevel = 'Medium';
            riskColor = 'text-[#d29922]';
            recommendation = 'DTI is manageable but approaching upper limits.';
        }

        setLoanAnalysis({
            monthlyPayment: monthlyPayment.toFixed(2),
            totalPayment: totalPayment.toFixed(2),
            totalInterest: totalInterest.toFixed(2),
            currentDti: currentDti.toFixed(1),
            newDti: newDti.toFixed(1),
            riskLevel,
            riskColor,
            recommendation
        });
    };

    // Profile Update
    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.put('/finance/profile', token, {
                name: profileForm.name,
                email: profileForm.email
            });
            alert('Profile updated successfully!');
        } catch (e) { alert('Failed to update profile'); }
        setLoading(false);
    };

    // Logout
    const handleLogout = () => {
        localStorage.clear();
        setToken(null);
        setActiveTab('dashboard');
    };

    // Render Auth Screen
    if (!token) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#0a0c10] text-white">
                <div className="w-full max-w-md p-8 bg-[#161b22] rounded-2xl border border-[#30363d] shadow-2xl">
                    <div className="flex flex-col items-center mb-10">
                        <div className="bg-[#238636] p-3 rounded-xl mb-4">
                            <DollarSign size={32} />
                        </div>
                        <h1 className="text-3xl font-bold">FinWise AI</h1>
                        <p className="text-[#8b949e]">Your personal financial brain</p>
                    </div>

                    <form onSubmit={handleAuth} className="space-y-4">
                        {!authForm.isLogin && (
                            <InputField
                                label="Full Name"
                                value={authForm.name}
                                onChange={e => setAuthForm({ ...authForm, name: e.target.value })}
                                placeholder="John Doe"
                            />
                        )}
                        <InputField
                            label="Email"
                            type="email"
                            value={authForm.email}
                            onChange={e => setAuthForm({ ...authForm, email: e.target.value })}
                            placeholder="you@example.com"
                        />
                        <InputField
                            label="Password"
                            type="password"
                            value={authForm.password}
                            onChange={e => setAuthForm({ ...authForm, password: e.target.value })}
                            placeholder="••••••••"
                        />
                        <button className="w-full bg-[#238636] p-3 rounded-lg font-bold hover:bg-[#2ea043] transition">
                            {loading ? <Loader2 className="animate-spin mx-auto" /> : (authForm.isLogin ? 'Sign In' : 'Create Account')}
                        </button>
                    </form>

                    <button
                        className="w-full mt-4 text-sm text-[#8b949e] hover:text-white"
                        onClick={() => setAuthForm({ ...authForm, isLogin: !authForm.isLogin })}
                    >
                        {authForm.isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
                    </button>
                </div>
            </div>
        );
    }

    // Calculate totals for Net Worth
    const totalAssets = assets.reduce((sum, a) => sum + a.value, 0);
    const totalLiabilities = liabilities.reduce((sum, l) => sum + l.balance, 0);
    const netWorth = totalAssets - totalLiabilities;

    // Calculate budget totals
    const totalBudgeted = budgets.reduce((sum, b) => sum + b.amount, 0);
    const monthlyIncome = dashboard?.monthlyIncome || 0;
    const unallocated = monthlyIncome - totalBudgeted;

    // Filter expenses by category
    const filteredExpenses = expenseFilter === 'All'
        ? expenseTransactions
        : expenseTransactions.filter(t => t.category === expenseFilter);

    // Get unique categories for filter
    const expenseCategories = ['All', ...new Set(expenseTransactions.map(t => t.category))];

    // Prepare asset allocation data
    const assetAllocationData = assets.map(a => ({ name: a.name, value: a.value }));
    if (assetAllocationData.length === 0) assetAllocationData.push({ name: 'No Assets', value: 1 });

    // Prepare monthly trend data
    const monthlyTrendData = [
        { name: 'Month 1', income: 5000, expenses: 3200 },
        { name: 'Month 2', income: 5200, expenses: 3800 },
        { name: 'Month 3', income: 4800, expenses: 2900 },
        { name: 'Month 4', income: 5500, expenses: 4100 },
    ];

    // Prepare spending split data
    const spendingSplitData = expenseTransactions
        .filter(t => t.type === 'expense')
        .reduce((acc, t) => {
            const existing = acc.find(a => a.name === t.category);
            if (existing) existing.value += t.amount;
            else acc.push({ name: t.category, value: t.amount });
            return acc;
        }, []);
    if (spendingSplitData.length === 0) spendingSplitData.push({ name: 'No Data', value: 1 });

    // Prepare net worth growth data
    const netWorthGrowthData = [
        { name: 'Jan', value: netWorth * 0.7 },
        { name: 'Feb', value: netWorth * 0.8 },
        { name: 'Mar', value: netWorth * 0.9 },
        { name: 'Apr', value: netWorth },
    ];

    // Lender comparison data
    const lenderData = [
        { name: 'Bank A', rate: '6.5%', term: '30 years', monthly: '$1,200' },
        { name: 'Credit Union', rate: '6.25%', term: '30 years', monthly: '$1,180' },
        { name: 'Online Lender', rate: '7.0%', term: '25 years', monthly: '$1,350' },
    ];

    // Render Main App
    return (
        <div className="flex h-screen bg-[#0d1117] text-[#c9d1d9] overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 bg-[#161b22] border-r border-[#30363d] flex flex-col">
                <div className="p-6 flex items-center gap-3">
                    <div className="bg-[#238636] p-1.5 rounded-lg text-white">
                        <DollarSign size={20} />
                    </div>
                    <h1 className="text-xl font-bold text-white">FinWise AI</h1>
                </div>

                <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto">
                    {[
                        { id: 'dashboard', icon: BarChart3, label: 'Dashboard' },
                        { id: 'networth', icon: Wallet, label: 'Net Worth' },
                        { id: 'budget', icon: PieChart, label: 'Budget Planner' },
                        { id: 'expenses', icon: Receipt, label: 'Expenses' },
                        { id: 'loans', icon: Calculator, label: 'Loans' },
                        { id: 'insights', icon: Activity, label: 'Insights' },
                        { id: 'settings', icon: Settings, label: 'Settings' }
                    ].map(item => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center gap-3 p-3 rounded-lg transition ${activeTab === item.id ? 'bg-[#21262d] text-white' : 'hover:bg-[#21262d]'}`}
                        >
                            <item.icon size={20} />
                            <span>{item.label}</span>
                        </button>
                    ))}
                </nav>

                <div className="p-4 border-t border-[#30363d]">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 p-3 text-[#f85149] hover:bg-[#341d1a] rounded-lg transition"
                    >
                        <LogOut size={20} />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-8">
                {/* DASHBOARD PAGE */}
                {activeTab === 'dashboard' && (
                    <>
                        <header className="flex justify-between items-center mb-8">
                            <div>
                                <h2 className="text-2xl font-bold text-white">Welcome back!</h2>
                                <p className="text-[#8b949e]">Here's what's happening with your money.</p>
                            </div>
                        </header>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-4 gap-6 mb-8">
                            <StatCard
                                label="Net Worth"
                                value={dashboard?.netWorth}
                                icon={Wallet}
                                color="text-[#79c0ff]"
                                bg="bg-blue-500/10"
                            />
                            <StatCard
                                label="Monthly Income"
                                value={dashboard?.monthlyIncome}
                                icon={TrendingUp}
                                color="text-[#238636]"
                                bg="bg-green-500/10"
                            />
                            <StatCard
                                label="Monthly Expenses"
                                value={dashboard?.monthlyExpenses}
                                icon={TrendingDown}
                                color="text-[#f85149]"
                                bg="bg-red-500/10"
                            />
                            <StatCard
                                label="Savings Rate"
                                value={`${dashboard?.savingsRate?.toFixed(1) || 0}%`}
                                icon={PiggyBank}
                                color="text-[#d29922]"
                                bg="bg-yellow-500/10"
                            />
                        </div>

                        {/* Charts */}
                        <div className="grid grid-cols-3 gap-6 mb-8">
                            <div className="col-span-2 bg-[#161b22] p-6 rounded-xl border border-[#30363d]">
                                <h4 className="font-bold text-white mb-4">Cash Flow Trends</h4>
                                <div className="h-64">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={monthlyTrendData}>
                                            <defs>
                                                <linearGradient id="colorInc" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#238636" stopOpacity={0.3} />
                                                    <stop offset="95%" stopColor="#238636" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#30363d" />
                                            <XAxis dataKey="name" stroke="#8b949e" />
                                            <Tooltip
                                                contentStyle={{ backgroundColor: '#0d1117', border: '1px solid #30363d', color: '#fff' }}
                                            />
                                            <Area type="monotone" dataKey="income" stroke="#238636" fillOpacity={1} fill="url(#colorInc)" />
                                            <Area type="monotone" dataKey="expenses" stroke="#f85149" fillOpacity={0} />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            <div className="bg-[#161b22] p-6 rounded-xl border border-[#30363d]">
                                <h4 className="font-bold text-white mb-4">Spending Split</h4>
                                <div className="h-48">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <RePieChart>
                                            <Pie
                                                data={spendingSplitData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={40}
                                                outerRadius={70}
                                                fill="#8884d8"
                                                dataKey="value"
                                            >
                                                {spendingSplitData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip
                                                contentStyle={{ backgroundColor: '#0d1117', border: '1px solid #30363d', color: '#fff' }}
                                            />
                                        </RePieChart>
                                    </ResponsiveContainer>
                                </div>
                                <p className="text-center text-sm text-[#8b949e] mt-2">By Category</p>
                            </div>
                        </div>

                        {/* Net Worth Growth */}
                        <div className="bg-[#161b22] p-6 rounded-xl border border-[#30363d] mb-8">
                            <h4 className="font-bold text-white mb-4">Net Worth Growth</h4>
                            <div className="h-48">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={netWorthGrowthData}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#30363d" />
                                        <XAxis dataKey="name" stroke="#8b949e" />
                                        <YAxis stroke="#8b949e" />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#0d1117', border: '1px solid #30363d', color: '#fff' }}
                                        />
                                        <Line type="monotone" dataKey="value" stroke="#238636" strokeWidth={2} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Recent Transactions */}
                        <div className="bg-[#161b22] rounded-xl border border-[#30363d] overflow-hidden">
                            <div className="p-6 border-b border-[#30363d] flex justify-between items-center">
                                <h4 className="font-bold text-white">Recent Activity</h4>
                                <button
                                    onClick={() => setActiveTab('expenses')}
                                    className="text-sm text-[#79c0ff] hover:underline"
                                >
                                    View All
                                </button>
                            </div>
                            <table className="w-full text-left">
                                <thead className="bg-[#21262d] text-xs uppercase text-[#8b949e]">
                                    <tr>
                                        <th className="p-4">Date</th>
                                        <th className="p-4">Category</th>
                                        <th className="p-4">Amount</th>
                                        <th className="p-4"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#30363d]">
                                    {transactions.length === 0 ? (
                                        <tr><td colSpan="4" className="p-8 text-center text-[#8b949e]">No transactions yet.</td></tr>
                                    ) : transactions.slice(0, 5).map(t => (
                                        <tr key={t.id} className="hover:bg-[#21262d]/50 transition">
                                            <td className="p-4 text-sm">{new Date(t.date).toLocaleDateString()}</td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${t.type === 'income' ? 'bg-[#238636]/20 text-[#2ea043]' : 'bg-[#f85149]/20 text-[#f85149]'}`}>
                                                    {t.category}
                                                </span>
                                            </td>
                                            <td className={`p-4 font-mono ${t.type === 'income' ? 'text-[#3fb950]' : 'text-[#f85149]'}`}>
                                                {t.type === 'income' ? '+' : '-'}${t.amount.toLocaleString()}
                                            </td>
                                            <td><ChevronRight size={16} className="text-[#8b949e]" /></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}

                {/* NET WORTH PAGE */}
                {activeTab === 'networth' && (
                    <>
                        <header className="flex justify-between items-center mb-8">
                            <div>
                                <h2 className="text-2xl font-bold text-white">Net Worth</h2>
                                <p className="text-[#8b949e]">Track your assets and liabilities</p>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowAssetModal(true)}
                                    className="bg-[#238636] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#2ea043]"
                                >
                                    <Plus size={18} /> Add Asset
                                </button>
                                <button
                                    onClick={() => setShowLiabilityModal(true)}
                                    className="bg-[#f85149] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#da3633]"
                                >
                                    <Plus size={18} /> Add Liability
                                </button>
                            </div>
                        </header>

                        {/* Summary Cards */}
                        <div className="grid grid-cols-3 gap-6 mb-8">
                            <StatCard
                                label="Total Assets"
                                value={totalAssets}
                                icon={TrendingUp}
                                color="text-[#238636]"
                                bg="bg-green-500/10"
                            />
                            <StatCard
                                label="Total Liabilities"
                                value={totalLiabilities}
                                icon={TrendingDown}
                                color="text-[#f85149]"
                                bg="bg-red-500/10"
                            />
                            <StatCard
                                label="Net Worth"
                                value={netWorth}
                                icon={Wallet}
                                color={netWorth >= 0 ? 'text-[#79c0ff]' : 'text-[#f85149]'}
                                bg="bg-blue-500/10"
                            />
                        </div>

                        <div className="grid grid-cols-3 gap-6 mb-8">
                            {/* Asset Allocation Chart */}
                            <div className="bg-[#161b22] p-6 rounded-xl border border-[#30363d]">
                                <h4 className="font-bold text-white mb-4">Asset Allocation</h4>
                                <div className="h-48">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <RePieChart>
                                            <Pie
                                                data={assetAllocationData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={50}
                                                outerRadius={80}
                                                fill="#8884d8"
                                                dataKey="value"
                                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                            >
                                                {assetAllocationData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip
                                                contentStyle={{ backgroundColor: '#0d1117', border: '1px solid #30363d', color: '#fff' }}
                                            />
                                        </RePieChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Assets Table */}
                            <div className="col-span-2 bg-[#161b22] rounded-xl border border-[#30363d] overflow-hidden">
                                <div className="p-6 border-b border-[#30363d]">
                                    <h4 className="font-bold text-white">Assets</h4>
                                </div>
                                <table className="w-full text-left">
                                    <thead className="bg-[#21262d] text-xs uppercase text-[#8b949e]">
                                        <tr>
                                            <th className="p-4">Name</th>
                                            <th className="p-4">Type</th>
                                            <th className="p-4">Value</th>
                                            <th className="p-4"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#30363d]">
                                        {assets.length === 0 ? (
                                            <tr><td colSpan="4" className="p-8 text-center text-[#8b949e]">No assets yet. Add your first asset!</td></tr>
                                        ) : assets.map(a => (
                                            <tr key={a.id} className="hover:bg-[#21262d]/50 transition">
                                                <td className="p-4 font-medium text-white">{a.name}</td>
                                                <td className="p-4">
                                                    <span className="px-2 py-1 rounded-full text-xs bg-[#21262d] text-[#8b949e]">
                                                        {a.asset_type}
                                                    </span>
                                                </td>
                                                <td className="p-4 font-mono text-[#238636]">${a.value?.toLocaleString()}</td>
                                                <td><DeleteButton onClick={() => handleDeleteAsset(a.id)} /></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Liabilities Table */}
                        <div className="bg-[#161b22] rounded-xl border border-[#30363d] overflow-hidden">
                            <div className="p-6 border-b border-[#30363d]">
                                <h4 className="font-bold text-white">Liabilities</h4>
                            </div>
                            <table className="w-full text-left">
                                <thead className="bg-[#21262d] text-xs uppercase text-[#8b949e]">
                                    <tr>
                                        <th className="p-4">Name</th>
                                        <th className="p-4">Type</th>
                                        <th className="p-4">Balance</th>
                                        <th className="p-4"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#30363d]">
                                    {liabilities.length === 0 ? (
                                        <tr><td colSpan="4" className="p-8 text-center text-[#8b949e]">No liabilities. You're debt-free!</td></tr>
                                    ) : liabilities.map(l => (
                                        <tr key={l.id} className="hover:bg-[#21262d]/50 transition">
                                            <td className="p-4 font-medium text-white">{l.name}</td>
                                            <td className="p-4">
                                                <span className="px-2 py-1 rounded-full text-xs bg-[#21262d] text-[#8b949e]">
                                                    {l.liability_type}
                                                </span>
                                            </td>
                                            <td className="p-4 font-mono text-[#f85149]">${l.balance?.toLocaleString()}</td>
                                            <td><DeleteButton onClick={() => handleDeleteLiability(l.id)} /></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Add Asset Modal */}
                        {showAssetModal && (
                            <Modal title="Add Asset" onClose={() => setShowAssetModal(false)}>
                                <form onSubmit={handleAddAsset}>
                                    <InputField
                                        label="Asset Name"
                                        value={assetForm.name}
                                        onChange={e => setAssetForm({ ...assetForm, name: e.target.value })}
                                        placeholder="e.g. Savings Account, Tesla Stock"
                                        required
                                    />
                                    <SelectField
                                        label="Asset Type"
                                        value={assetForm.type}
                                        onChange={e => setAssetForm({ ...assetForm, type: e.target.value })}
                                        options={[
                                            { value: 'Cash', label: 'Cash' },
                                            { value: 'Bank Account', label: 'Bank Account' },
                                            { value: 'Stocks', label: 'Stocks' },
                                            { value: 'Real Estate', label: 'Real Estate' },
                                            { value: 'Crypto', label: 'Crypto' },
                                            { value: 'Other', label: 'Other' }
                                        ]}
                                    />
                                    <InputField
                                        label="Value ($)"
                                        type="number"
                                        step="0.01"
                                        value={assetForm.value}
                                        onChange={e => setAssetForm({ ...assetForm, value: e.target.value })}
                                        placeholder="0.00"
                                        required
                                    />
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-[#238636] p-3 rounded-lg font-bold hover:bg-[#2ea043] transition flex items-center justify-center gap-2"
                                    >
                                        {loading ? <Loader2 className="animate-spin" size={20} /> : <><Plus size={20} /> Add Asset</>}
                                    </button>
                                </form>
                            </Modal>
                        )}

                        {/* Add Liability Modal */}
                        {showLiabilityModal && (
                            <Modal title="Add Liability" onClose={() => setShowLiabilityModal(false)}>
                                <form onSubmit={handleAddLiability}>
                                    <InputField
                                        label="Liability Name"
                                        value={liabilityForm.name}
                                        onChange={e => setLiabilityForm({ ...liabilityForm, name: e.target.value })}
                                        placeholder="e.g. Credit Card, Car Loan"
                                        required
                                    />
                                    <SelectField
                                        label="Liability Type"
                                        value={liabilityForm.type}
                                        onChange={e => setLiabilityForm({ ...liabilityForm, type: e.target.value })}
                                        options={[
                                            { value: 'Credit Card', label: 'Credit Card' },
                                            { value: 'Personal Loan', label: 'Personal Loan' },
                                            { value: 'Mortgage', label: 'Mortgage' },
                                            { value: 'Car Loan', label: 'Car Loan' },
                                            { value: 'Student Loan', label: 'Student Loan' },
                                            { value: 'Other', label: 'Other' }
                                        ]}
                                    />
                                    <InputField
                                        label="Balance ($)"
                                        type="number"
                                        step="0.01"
                                        value={liabilityForm.balance}
                                        onChange={e => setLiabilityForm({ ...liabilityForm, balance: e.target.value })}
                                        placeholder="0.00"
                                        required
                                    />
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-[#f85149] p-3 rounded-lg font-bold hover:bg-[#da3633] transition flex items-center justify-center gap-2"
                                    >
                                        {loading ? <Loader2 className="animate-spin" size={20} /> : <><Plus size={20} /> Add Liability</>}
                                    </button>
                                </form>
                            </Modal>
                        )}
                    </>
                )}

                {/* BUDGET PLANNER PAGE */}
                {activeTab === 'budget' && (
                    <>
                        <header className="flex justify-between items-center mb-8">
                            <div>
                                <h2 className="text-2xl font-bold text-white">Budget Planner</h2>
                                <p className="text-[#8b949e]">Zero-based budgeting for your finances</p>
                            </div>
                            <button
                                onClick={() => setShowBudgetModal(true)}
                                className="bg-[#238636] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#2ea043]"
                            >
                                <Plus size={18} /> Add Category
                            </button>
                        </header>

                        {/* Budget Summary */}
                        <div className="grid grid-cols-4 gap-6 mb-8">
                            <StatCard
                                label="Monthly Income"
                                value={monthlyIncome}
                                icon={TrendingUp}
                                color="text-[#238636]"
                                bg="bg-green-500/10"
                            />
                            <StatCard
                                label="Total Budgeted"
                                value={totalBudgeted}
                                icon={Target}
                                color="text-[#79c0ff]"
                                bg="bg-blue-500/10"
                            />
                            <StatCard
                                label="Unallocated"
                                value={unallocated}
                                icon={Wallet}
                                color={unallocated >= 0 ? 'text-[#d29922]' : 'text-[#f85149]'}
                                bg="bg-yellow-500/10"
                            />
                            <StatCard
                                label="Categories"
                                value={budgets.length}
                                icon={PieChart}
                                color="text-[#9333ea]"
                                bg="bg-purple-500/10"
                            />
                        </div>

                        {/* Alert Banner */}
                        {unallocated !== 0 && (
                            <div className={`mb-8 p-4 rounded-xl border flex items-center gap-3 ${unallocated > 0 ? 'bg-[#d29922]/10 border-[#d29922] text-[#d29922]' : 'bg-[#f85149]/10 border-[#f85149] text-[#f85149]'}`}>
                                <AlertCircle size={20} />
                                <span className="font-medium">
                                    {unallocated > 0
                                        ? `You have $${unallocated.toLocaleString()} left to allocate. Give every dollar a job!`
                                        : `You've budgeted $${Math.abs(unallocated).toLocaleString()} more than your income. Review your budgets!`}
                                </span>
                            </div>
                        )}

                        {/* Category Cards Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {/* Add Category Card */}
                            <button
                                onClick={() => setShowBudgetModal(true)}
                                className="bg-[#161b22] p-6 rounded-xl border border-[#30363d] border-dashed hover:border-[#238636] transition flex flex-col items-center justify-center gap-3 min-h-[180px]"
                            >
                                <div className="bg-[#238636]/20 p-3 rounded-full">
                                    <Plus size={24} className="text-[#238636]" />
                                </div>
                                <span className="text-sm font-medium text-[#8b949e]">Add Category</span>
                            </button>

                            {/* Budget Category Cards */}
                            {budgets.map(budget => {
                                const category = categories.find(c => c.id === budget.category_id);
                                const categoryName = category?.name || 'Unknown';
                                // Calculate spent for this category from transactions
                                const spent = expenseTransactions
                                    .filter(t => t.type === 'expense' && t.category === categoryName)
                                    .reduce((sum, t) => sum + t.amount, 0);
                                const percentage = (spent / budget.amount) * 100;

                                return (
                                    <div key={budget.id} className="bg-[#161b22] p-6 rounded-xl border border-[#30363d] relative">
                                        <div className="flex justify-between items-start mb-3">
                                            <h4 className="font-bold text-white">{categoryName}</h4>
                                            <DeleteButton onClick={() => handleDeleteBudget(budget.id)} />
                                        </div>
                                        <ProgressBar value={spent} max={budget.amount} />
                                        <div className="flex justify-between items-center mt-3 text-sm">
                                            <span className="text-[#8b949e]">${spent.toLocaleString()} spent</span>
                                            <span className="text-white font-medium">${budget.amount.toLocaleString()}</span>
                                        </div>
                                        <p className="text-xs text-[#8b949e] mt-2">
                                            ${(budget.amount - spent).toLocaleString()} remaining
                                        </p>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Add Budget Modal */}
                        {showBudgetModal && (
                            <Modal title="Add Budget Category" onClose={() => setShowBudgetModal(false)}>
                                <form onSubmit={handleAddBudget}>
                                    <SelectField
                                        label="Category"
                                        value={budgetForm.category_id}
                                        onChange={e => setBudgetForm({ ...budgetForm, category_id: e.target.value })}
                                        options={[
                                            { value: '', label: 'Select a category' },
                                            ...categories.map(c => ({ value: c.id.toString(), label: c.name }))
                                        ]}
                                        required
                                    />
                                    <InputField
                                        label="Budget Amount ($)"
                                        type="number"
                                        step="0.01"
                                        value={budgetForm.amount}
                                        onChange={e => setBudgetForm({ ...budgetForm, amount: e.target.value })}
                                        placeholder="0.00"
                                        required
                                    />
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-[#238636] p-3 rounded-lg font-bold hover:bg-[#2ea043] transition flex items-center justify-center gap-2"
                                    >
                                        {loading ? <Loader2 className="animate-spin" size={20} /> : <><Plus size={20} /> Add Budget</>}
                                    </button>
                                </form>
                            </Modal>
                        )}
                    </>
                )}

                {/* EXPENSES PAGE */}
                {activeTab === 'expenses' && (
                    <>
                        <header className="flex justify-between items-center mb-8">
                            <div>
                                <h2 className="text-2xl font-bold text-white">Expenses</h2>
                                <p className="text-[#8b949e]">Track and analyze your spending</p>
                            </div>
                            <button
                                onClick={() => setShowExpenseModal(true)}
                                className="bg-[#238636] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#2ea043]"
                            >
                                <Plus size={18} /> Add Transaction
                            </button>
                        </header>

                        {/* Charts */}
                        <div className="grid grid-cols-2 gap-6 mb-8">
                            <div className="bg-[#161b22] p-6 rounded-xl border border-[#30363d]">
                                <h4 className="font-bold text-white mb-4">Monthly Trend</h4>
                                <div className="h-48">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={monthlyTrendData}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#30363d" />
                                            <XAxis dataKey="name" stroke="#8b949e" />
                                            <YAxis stroke="#8b949e" />
                                            <Tooltip
                                                contentStyle={{ backgroundColor: '#0d1117', border: '1px solid #30363d', color: '#fff' }}
                                            />
                                            <Legend />
                                            <Bar dataKey="income" fill="#238636" radius={[4, 4, 0, 0]} />
                                            <Bar dataKey="expenses" fill="#f85149" radius={[4, 4, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            <div className="bg-[#161b22] p-6 rounded-xl border border-[#30363d]">
                                <h4 className="font-bold text-white mb-4">By Category</h4>
                                <div className="h-48">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <RePieChart>
                                            <Pie
                                                data={spendingSplitData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={40}
                                                outerRadius={70}
                                                fill="#8884d8"
                                                dataKey="value"
                                                label={({ name, percent }) => `${name}`}
                                            >
                                                {spendingSplitData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip
                                                contentStyle={{ backgroundColor: '#0d1117', border: '1px solid #30363d', color: '#fff' }}
                                            />
                                        </RePieChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>

                        {/* Filter Buttons */}
                        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                            {expenseCategories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setExpenseFilter(cat)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition ${expenseFilter === cat ? 'bg-[#238636] text-white' : 'bg-[#21262d] text-[#8b949e] hover:bg-[#30363d]'}`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>

                        {/* Transactions Table */}
                        <div className="bg-[#161b22] rounded-xl border border-[#30363d] overflow-hidden">
                            <div className="p-6 border-b border-[#30363d]">
                                <h4 className="font-bold text-white">Transactions</h4>
                            </div>
                            <table className="w-full text-left">
                                <thead className="bg-[#21262d] text-xs uppercase text-[#8b949e]">
                                    <tr>
                                        <th className="p-4">Date</th>
                                        <th className="p-4">Category</th>
                                        <th className="p-4">Description</th>
                                        <th className="p-4">Amount</th>
                                        <th className="p-4"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#30363d]">
                                    {filteredExpenses.length === 0 ? (
                                        <tr><td colSpan="5" className="p-8 text-center text-[#8b949e]">No transactions found.</td></tr>
                                    ) : filteredExpenses.map(t => (
                                        <tr key={t.id} className="hover:bg-[#21262d]/50 transition">
                                            <td className="p-4 text-sm">{new Date(t.date).toLocaleDateString()}</td>
                                            <td className="p-4">
                                                <span className="px-2 py-1 rounded-full text-xs bg-[#21262d] text-[#8b949e]">
                                                    {t.category}
                                                </span>
                                            </td>
                                            <td className="p-4 text-sm text-[#8b949e]">{t.description || '-'}</td>
                                            <td className={`p-4 font-mono ${t.type === 'income' ? 'text-[#3fb950]' : 'text-[#f85149]'}`}>
                                                {t.type === 'income' ? '+' : '-'}${t.amount.toLocaleString()}
                                            </td>
                                            <td><DeleteButton onClick={() => handleDeleteTransaction(t.id)} /></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Add Expense Modal */}
                        {showExpenseModal && (
                            <Modal title="Add Transaction" onClose={() => setShowExpenseModal(false)}>
                                <form onSubmit={handleAddExpense}>
                                    <InputField
                                        label="Amount ($)"
                                        type="number"
                                        step="0.01"
                                        value={expenseForm.amount}
                                        onChange={e => setExpenseForm({ ...expenseForm, amount: e.target.value })}
                                        placeholder="0.00"
                                        required
                                    />
                                    <SelectField
                                        label="Category"
                                        value={expenseForm.category}
                                        onChange={e => setExpenseForm({ ...expenseForm, category: e.target.value })}
                                        options={[
                                            { value: 'Food', label: 'Food' },
                                            { value: 'Rent', label: 'Rent' },
                                            { value: 'Utilities', label: 'Utilities' },
                                            { value: 'Transportation', label: 'Transportation' },
                                            { value: 'Entertainment', label: 'Entertainment' },
                                            { value: 'Shopping', label: 'Shopping' },
                                            { value: 'Healthcare', label: 'Healthcare' },
                                            { value: 'Subscriptions', label: 'Subscriptions' },
                                            { value: 'Other', label: 'Other' }
                                        ]}
                                        required
                                    />
                                    <InputField
                                        label="Description"
                                        value={expenseForm.description}
                                        onChange={e => setExpenseForm({ ...expenseForm, description: e.target.value })}
                                        placeholder="Optional description"
                                    />
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-[#238636] p-3 rounded-lg font-bold hover:bg-[#2ea043] transition flex items-center justify-center gap-2"
                                    >
                                        {loading ? <Loader2 className="animate-spin" size={20} /> : <><Plus size={20} /> Add Transaction</>}
                                    </button>
                                </form>
                            </Modal>
                        )}
                    </>
                )}

                {/* LOANS PAGE */}
                {activeTab === 'loans' && (
                    <>
                        <header className="mb-8">
                            <h2 className="text-2xl font-bold text-white">Loan Analyzer</h2>
                            <p className="text-[#8b949e]">Calculate affordability and compare lenders</p>
                        </header>

                        <div className="grid grid-cols-2 gap-8">
                            {/* Loan Analysis Form */}
                            <div className="bg-[#161b22] p-6 rounded-xl border border-[#30363d]">
                                <h4 className="font-bold text-white mb-6 flex items-center gap-2">
                                    <Calculator size={20} /> Loan Details
                                </h4>
                                <InputField
                                    label="Loan Amount ($)"
                                    type="number"
                                    step="0.01"
                                    value={loanAnalyzer.loanAmount}
                                    onChange={e => setLoanAnalyzer({ ...loanAnalyzer, loanAmount: e.target.value })}
                                    placeholder="e.g. 250000"
                                />
                                <InputField
                                    label="Interest Rate (%)"
                                    type="number"
                                    step="0.01"
                                    value={loanAnalyzer.interestRate}
                                    onChange={e => setLoanAnalyzer({ ...loanAnalyzer, interestRate: e.target.value })}
                                    placeholder="e.g. 6.5"
                                />
                                <InputField
                                    label="Loan Term (Years)"
                                    type="number"
                                    value={loanAnalyzer.loanTerm}
                                    onChange={e => setLoanAnalyzer({ ...loanAnalyzer, loanTerm: e.target.value })}
                                    placeholder="e.g. 30"
                                />
                                <InputField
                                    label="Monthly Income ($)"
                                    type="number"
                                    step="0.01"
                                    value={loanAnalyzer.monthlyIncome}
                                    onChange={e => setLoanAnalyzer({ ...loanAnalyzer, monthlyIncome: e.target.value })}
                                    placeholder="e.g. 8000"
                                />
                                <InputField
                                    label="Existing Monthly Debt ($)"
                                    type="number"
                                    step="0.01"
                                    value={loanAnalyzer.existingDebt}
                                    onChange={e => setLoanAnalyzer({ ...loanAnalyzer, existingDebt: e.target.value })}
                                    placeholder="e.g. 500"
                                />
                                <button
                                    onClick={analyzeLoan}
                                    className="w-full bg-[#238636] p-3 rounded-lg font-bold hover:bg-[#2ea043] transition flex items-center justify-center gap-2"
                                >
                                    <Zap size={20} /> Analyze Affordability
                                </button>

                                {/* Analysis Results */}
                                {loanAnalysis && (
                                    <div className="mt-6 p-4 bg-[#21262d] rounded-lg">
                                        <h5 className="font-bold text-white mb-4">Risk Assessment</h5>
                                        <div className="space-y-3">
                                            <div className="flex justify-between">
                                                <span className="text-[#8b949e]">Monthly Payment:</span>
                                                <span className="font-mono text-white">${loanAnalysis.monthlyPayment}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-[#8b949e]">Total Interest:</span>
                                                <span className="font-mono text-[#f85149]">${loanAnalysis.totalInterest}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-[#8b949e]">Current DTI:</span>
                                                <span className="font-mono text-white">{loanAnalysis.currentDti}%</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-[#8b949e]">New DTI:</span>
                                                <span className={`font-mono ${loanAnalysis.newDti > 43 ? 'text-[#f85149]' : 'text-[#238636]'}`}>
                                                    {loanAnalysis.newDti}%
                                                </span>
                                            </div>
                                            <div className="pt-3 border-t border-[#30363d]">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-[#8b949e]">Risk Level:</span>
                                                    <span className={`font-bold ${loanAnalysis.riskColor}`}>{loanAnalysis.riskLevel}</span>
                                                </div>
                                                <p className="text-sm text-[#8b949e] mt-2">{loanAnalysis.recommendation}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Lender Comparison */}
                            <div className="space-y-6">
                                <div className="bg-[#161b22] p-6 rounded-xl border border-[#30363d]">
                                    <h4 className="font-bold text-white mb-6 flex items-center gap-2">
                                        <Building size={20} /> Lender Comparison
                                    </h4>
                                    <table className="w-full text-left">
                                        <thead className="text-xs uppercase text-[#8b949e]">
                                            <tr>
                                                <th className="p-2">Lender</th>
                                                <th className="p-2">Rate</th>
                                                <th className="p-2">Term</th>
                                                <th className="p-2">Monthly</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-[#30363d]">
                                            {lenderData.map((lender, i) => (
                                                <tr key={i} className="text-sm">
                                                    <td className="p-2 font-medium text-white">{lender.name}</td>
                                                    <td className="p-2 text-[#238636]">{lender.rate}</td>
                                                    <td className="p-2 text-[#8b949e]">{lender.term}</td>
                                                    <td className="p-2 font-mono text-white">{lender.monthly}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Existing Loans */}
                                <div className="bg-[#161b22] p-6 rounded-xl border border-[#30363d]">
                                    <h4 className="font-bold text-white mb-4 flex items-center gap-2">
                                        <CreditCard size={20} /> Your Loans
                                    </h4>
                                    {loans.length === 0 ? (
                                        <p className="text-[#8b949e] text-sm">No loans recorded yet.</p>
                                    ) : (
                                        <div className="space-y-3">
                                            {loans.map(loan => (
                                                <div key={loan.id} className="p-3 bg-[#21262d] rounded-lg">
                                                    <div className="flex justify-between items-center">
                                                        <div>
                                                            <p className="font-medium text-white">{loan.lender || 'Loan'}</p>
                                                            <p className="text-sm text-[#8b949e]">{loan.type || 'Personal'}</p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="font-mono text-white">${loan.amount?.toLocaleString()}</p>
                                                            <p className="text-xs text-[#8b949e]">{loan.interest_rate}% APR</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {/* INSIGHTS PAGE */}
                {activeTab === 'insights' && (
                    <>
                        <header className="mb-8">
                            <h2 className="text-2xl font-bold text-white">AI Insights</h2>
                            <p className="text-[#8b949e]">Personalized financial analysis and recommendations</p>
                        </header>

                        {/* Financial Health Score */}
                        <div className="bg-[#161b22] p-8 rounded-xl border border-[#30363d] mb-8">
                            <div className="flex items-center justify-between mb-6">
                                <h4 className="font-bold text-white text-xl">Financial Health Score</h4>
                                <div className="text-[#238636] bg-[#238636]/10 px-3 py-1 rounded text-sm font-bold">
                                    {insights?.score ? insights.score.toFixed(1) : dashboard?.financialHealthScore?.toFixed(1) || '0.0'} / 100
                                </div>
                            </div>

                            <div className="flex items-center gap-8">
                                <div className="relative w-48 h-48 flex-shrink-0">
                                    <div className="absolute inset-0 rounded-full border-[12px] border-[#30363d]"></div>
                                    <div
                                        className="absolute inset-0 rounded-full border-[12px] border-[#238636] border-t-transparent"
                                        style={{ transform: `rotate(${(insights?.score || dashboard?.financialHealthScore || 0) * 3.6}deg)` }}
                                    ></div>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="text-5xl font-bold text-white">
                                            {Math.round(insights?.score || dashboard?.financialHealthScore || 0)}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex-1 grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-[#21262d] rounded-lg">
                                        <div className="flex items-center gap-2 mb-2">
                                            <PiggyBank size={16} className="text-[#238636]" />
                                            <span className="text-sm text-[#8b949e]">Savings Rate</span>
                                        </div>
                                        <p className="text-xl font-bold text-white">{dashboard?.savingsRate?.toFixed(1) || 0}%</p>
                                    </div>
                                    <div className="p-4 bg-[#21262d] rounded-lg">
                                        <div className="flex items-center gap-2 mb-2">
                                            <CreditCard size={16} className="text-[#f85149]" />
                                            <span className="text-sm text-[#8b949e]">Debt Ratio</span>
                                        </div>
                                        <p className="text-xl font-bold text-white">
                                            {totalLiabilities > 0 ? ((totalLiabilities / (totalAssets || 1)) * 100).toFixed(1) : 0}%
                                        </p>
                                    </div>
                                    <div className="p-4 bg-[#21262d] rounded-lg">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Shield size={16} className="text-[#79c0ff]" />
                                            <span className="text-sm text-[#8b949e]">Emergency Fund</span>
                                        </div>
                                        <p className="text-xl font-bold text-white">
                                            {assets.filter(a => a.asset_type === 'Cash').reduce((s, a) => s + a.value, 0).toLocaleString()}
                                        </p>
                                    </div>
                                    <div className="p-4 bg-[#21262d] rounded-lg">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Target size={16} className="text-[#d29922]" />
                                            <span className="text-sm text-[#8b949e]">Budget Adherence</span>
                                        </div>
                                        <p className="text-xl font-bold text-white">
                                            {budgets.length > 0 ? (100 - Math.abs(unallocated) / (totalBudgeted || 1) * 100).toFixed(0) : 0}%
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-8">
                            {/* AI Recommendations */}
                            <div className="bg-[#161b22] p-6 rounded-xl border border-[#30363d]">
                                <h4 className="font-bold text-white mb-6 flex items-center gap-2">
                                    <Zap size={20} className="text-[#d29922]" /> Smart Suggestions
                                </h4>
                                <div className="space-y-4">
                                    {(insights?.recommendations || dashboard?.insights || []).length === 0 ? (
                                        <p className="text-[#8b949e] text-sm">No recommendations available yet. Add more financial data for personalized insights.</p>
                                    ) : (insights?.recommendations || dashboard?.insights || []).map((rec, i) => (
                                        <div key={i} className="flex gap-3 p-3 bg-[#21262d] rounded-lg border-l-4 border-[#238636]">
                                            <ArrowUpRight size={18} className="text-[#238636] flex-shrink-0 mt-0.5" />
                                            <p className="text-sm text-[#c9d1d9]">{rec}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Recurring Expenses */}
                            <div className="bg-[#161b22] p-6 rounded-xl border border-[#30363d]">
                                <h4 className="font-bold text-white mb-6 flex items-center gap-2">
                                    <Calendar size={20} className="text-[#79c0ff]" /> Recurring Expenses
                                </h4>
                                <div className="space-y-3">
                                    {subscriptions.length === 0 ? (
                                        <p className="text-[#8b949e] text-sm">No recurring subscriptions found.</p>
                                    ) : (
                                        subscriptions.map(sub => (
                                            <div key={sub.id} className="flex justify-between items-center p-3 bg-[#21262d] rounded-lg">
                                                <div>
                                                    <p className="font-medium text-white">{sub.name || 'Subscription'}</p>
                                                    <p className="text-xs text-[#8b949e]">{sub.frequency || 'Monthly'}</p>
                                                </div>
                                                <p className="font-mono text-[#f85149]">${sub.amount?.toLocaleString()}</p>
                                            </div>
                                        ))
                                    )}
                                </div>
                                {subscriptions.length > 0 && (
                                    <div className="mt-4 pt-4 border-t border-[#30363d]">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-[#8b949e]">Total Monthly</span>
                                            <span className="font-mono text-white font-bold">
                                                ${subscriptions.reduce((s, sub) => s + (sub.amount || 0), 0).toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                )}

                {/* SETTINGS PAGE */}
                {activeTab === 'settings' && (
                    <>
                        <header className="mb-8">
                            <h2 className="text-2xl font-bold text-white">Settings</h2>
                            <p className="text-[#8b949e]">Manage your profile and preferences</p>
                        </header>

                        <div className="max-w-2xl space-y-6">
                            {/* Profile Settings */}
                            <div className="bg-[#161b22] p-6 rounded-xl border border-[#30363d]">
                                <h4 className="font-bold text-white mb-6 flex items-center gap-2">
                                    <User size={20} /> Profile Information
                                </h4>
                                <form onSubmit={handleUpdateProfile}>
                                    <InputField
                                        label="Full Name"
                                        value={profileForm.name}
                                        onChange={e => setProfileForm({ ...profileForm, name: e.target.value })}
                                        placeholder="Your name"
                                    />
                                    <InputField
                                        label="Email"
                                        type="email"
                                        value={profileForm.email}
                                        onChange={e => setProfileForm({ ...profileForm, email: e.target.value })}
                                        placeholder="your@email.com"
                                    />
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="bg-[#238636] text-white px-6 py-3 rounded-lg font-bold hover:bg-[#2ea043] transition flex items-center gap-2"
                                    >
                                        {loading ? <Loader2 className="animate-spin" size={20} /> : <><Save size={20} /> Save Changes</>}
                                    </button>
                                </form>
                            </div>

                            {/* Change Password */}
                            <div className="bg-[#161b22] p-6 rounded-xl border border-[#30363d]">
                                <h4 className="font-bold text-white mb-6 flex items-center gap-2">
                                    <Key size={20} /> Change Password
                                </h4>
                                <div className="space-y-4">
                                    <InputField
                                        label="Current Password"
                                        type="password"
                                        value={passwordForm.current}
                                        onChange={e => setPasswordForm({ ...passwordForm, current: e.target.value })}
                                        placeholder="••••••••"
                                    />
                                    <InputField
                                        label="New Password"
                                        type="password"
                                        value={passwordForm.new}
                                        onChange={e => setPasswordForm({ ...passwordForm, new: e.target.value })}
                                        placeholder="••••••••"
                                    />
                                    <button
                                        onClick={() => alert('Password change functionality coming soon')}
                                        className="bg-[#21262d] text-white px-6 py-3 rounded-lg font-bold hover:bg-[#30363d] transition"
                                    >
                                        Update Password
                                    </button>
                                </div>
                            </div>

                            {/* App Info */}
                            <div className="bg-[#161b22] p-6 rounded-xl border border-[#30363d]">
                                <h4 className="font-bold text-white mb-4">About FinWise AI</h4>
                                <p className="text-sm text-[#8b949e] mb-4">
                                    Version 1.0.0 - Built with React & FastAPI
                                </p>
                                <p className="text-sm text-[#8b949e]">
                                    Your personal AI-powered financial dashboard for tracking income, expenses, loans, and building wealth.
                                </p>
                            </div>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
};

export default App;
