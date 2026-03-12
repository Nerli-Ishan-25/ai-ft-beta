import React, { useState, useEffect } from 'react';
import {
    TrendingUp, TrendingDown, DollarSign, Wallet,
    Plus, History, BarChart3, Settings, LogOut, Loader2,
    PieChart, ChevronRight, Calculator, Activity
} from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, AreaChart, Area, Cell, PieChart as RePieChart, Pie
} from 'recharts';

const API_BASE = 'http://localhost:8000/api/v1';

const App = () => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [dashboard, setDashboard] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [form, setForm] = useState({ type: 'expense', amount: '', category: '', source: '', description: '' });
    const [showForm, setShowForm] = useState(false);
    const [authForm, setAuthForm] = useState({ email: '', password: '', name: '', isLogin: true });

    const fetchDashboard = async (t) => {
        try {
            const resp = await fetch(`${API_BASE}/finance/dashboard`, {
                headers: { Authorization: `Bearer ${t}` }
            });
            if (resp.ok) setDashboard(await resp.json());
        } catch (e) { console.error(e); }
    };

    const fetchTransactions = async (t) => {
        try {
            const resp = await fetch(`${API_BASE}/finance/transactions?limit=10`, {
                headers: { Authorization: `Bearer ${t}` }
            });
            if (resp.ok) setTransactions(await resp.json());
        } catch (e) { console.error(e); }
    };

    useEffect(() => {
        if (token) {
            fetchDashboard(token);
            fetchTransactions(token);
        }
    }, [token]);

    const handleAuth = async (e) => {
        e.preventDefault();
        setLoading(true);
        const endpoint = authForm.isLogin ? '/auth/login' : '/auth/register';
        const body = authForm.isLogin
            ? new URLSearchParams({ username: authForm.email, password: authForm.password })
            : JSON.stringify({ email: authForm.email, password: authForm.password, name: authForm.name });

        try {
            const resp = await fetch(`${API_BASE}${endpoint}`, {
                method: 'POST',
                headers: authForm.isLogin ? { 'Content-Type': 'application/x-www-form-urlencoded' } : { 'Content-Type': 'application/json' },
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
        } catch (e) { alert('Auth failed'); }
        setLoading(false);
    };

    const handleEntry = async (e) => {
        e.preventDefault();
        setLoading(true);
        const endpoint = form.type === 'income' ? '/finance/income' : '/finance/expenses';
        const body = form.type === 'income'
            ? { amount: parseFloat(form.amount), source: form.source || 'General' }
            : { amount: parseFloat(form.amount), category: form.category || 'Other' };

        try {
            const resp = await fetch(`${API_BASE}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(body)
            });
            if (resp.ok) {
                setShowForm(false);
                fetchDashboard(token);
                fetchTransactions(token);
                setForm({ type: 'expense', amount: '', category: '', source: '', description: '' });
            }
        } catch (e) { console.error(e); }
        setLoading(false);
    };

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
                            <input
                                placeholder="Full Name"
                                className="w-full p-3 bg-[#0d1117] border border-[#30363d] rounded-lg focus:outline-none focus:border-[#238636]"
                                onChange={e => setAuthForm({ ...authForm, name: e.target.value })}
                            />
                        )}
                        <input
                            placeholder="Email"
                            className="w-full p-3 bg-[#0d1117] border border-[#30363d] rounded-lg focus:outline-none focus:border-[#238636]"
                            onChange={e => setAuthForm({ ...authForm, email: e.target.value })}
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            className="w-full p-3 bg-[#0d1117] border border-[#30363d] rounded-lg focus:outline-none focus:border-[#238636]"
                            onChange={e => setAuthForm({ ...authForm, password: e.target.value })}
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

                <nav className="flex-1 px-4 space-y-2 mt-4">
                    {[
                        { id: 'dashboard', icon: BarChart3, label: 'Dashboard' },
                        { id: 'transactions', icon: History, label: 'Transactions' },
                        { id: 'networth', icon: Wallet, label: 'Net Worth' },
                        { id: 'insights', icon: Activity, label: 'AI Insights' }
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
                        onClick={() => { localStorage.clear(); setToken(null); }}
                        className="w-full flex items-center gap-3 p-3 text-[#f85149] hover:bg-[#341d1a] rounded-lg transition"
                    >
                        <LogOut size={20} />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-8 relative">
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-white">Welcome back!</h2>
                        <p className="text-[#8b949e]">Here's what's happening with your money.</p>
                    </div>
                    <button
                        onClick={() => setShowForm(true)}
                        className="bg-[#238636] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#2ea043] shadow-lg"
                    >
                        <Plus size={18} />
                        Add Info
                    </button>
                </header>

                {/* Stats Grid */}
                <div className="grid grid-cols-4 gap-6 mb-8">
                    {[
                        { label: 'Net Worth', val: dashboard?.netWorth, color: 'text-white', icon: Wallet, bg: 'bg-blue-500/10' },
                        { label: 'Income', val: dashboard?.monthlyIncome, color: 'text-[#238636]', icon: TrendingUp, bg: 'bg-green-500/10' },
                        { label: 'Expenses', val: dashboard?.monthlyExpenses, color: 'text-[#f85149]', icon: TrendingDown, bg: 'bg-red-500/10' },
                        { label: 'Savings Rate', val: `${dashboard?.savingsRate?.toFixed(1)}%`, color: 'text-[#79c0ff]', icon: Activity, bg: 'bg-purple-500/10' }
                    ].map(stat => (
                        <div className="bg-[#161b22] p-6 rounded-xl border border-[#30363d] shadow-sm">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`${stat.bg} p-2 rounded-lg`}>
                                    <stat.icon size={20} className={stat.color} />
                                </div>
                            </div>
                            <p className="text-sm text-[#8b949e] mb-1">{stat.label}</p>
                            <h3 className={`text-2xl font-bold ${stat.color}`}>
                                {typeof stat.val === 'number' ? `$${stat.val.toLocaleString()}` : stat.val || '$0'}
                            </h3>
                        </div>
                    ))}
                </div>

                {/* Charts & AI */}
                <div className="grid grid-cols-3 gap-6">
                    <div className="col-span-2 bg-[#161b22] p-6 rounded-xl border border-[#30363d]">
                        <h4 className="font-bold text-white mb-6">Cash Flow Trends</h4>
                        <div className="h-64 mt-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={[
                                    { name: 'Mon', inc: 4000, exp: 2400 },
                                    { name: 'Tue', inc: 3000, exp: 1398 },
                                    { name: 'Wed', inc: 2000, exp: 9800 },
                                    { name: 'Thu', inc: 2780, exp: 3908 },
                                    { name: 'Fri', inc: 1890, exp: 4800 },
                                    { name: 'Sat', inc: 2390, exp: 3800 },
                                ]}>
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
                                    <Area type="monotone" dataKey="inc" stroke="#238636" fillOpacity={1} fill="url(#colorInc)" />
                                    <Area type="monotone" dataKey="exp" stroke="#f85149" fillOpacity={0} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="bg-[#161b22] p-6 rounded-xl border border-[#30363d]">
                        <div className="flex items-center justify-between mb-6">
                            <h4 className="font-bold text-white">AI Health Score</h4>
                            <div className="text-[#238636] bg-[#238636]/10 px-2 py-1 rounded text-xs font-bold font-mono">
                                SCORE: {dashboard?.financialHealthScore?.toFixed(1) || '0.0'}
                            </div>
                        </div>

                        <div className="flex flex-col items-center justify-center p-4">
                            <div className="relative w-32 h-32">
                                <div className="absolute inset-0 rounded-full border-[8px] border-[#30363d]"></div>
                                <div className="absolute inset-0 rounded-full border-[8px] border-[#238636] border-t-transparent" style={{ transform: `rotate(${dashboard?.financialHealthScore * 36}deg)` }}></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-3xl font-bold text-white">{dashboard?.financialHealthScore?.toFixed(0) || '0'}</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 space-y-4">
                            <p className="text-xs font-bold text-[#8b949e] uppercase tracking-wider">AI Recommendations</p>
                            {dashboard?.insights?.map((ins, i) => (
                                <div key={i} className="flex gap-3 text-sm border-l-2 border-[#238636] pl-3 py-1">
                                    <p>{ins}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Recent Transactions */}
                <div className="mt-8 bg-[#161b22] rounded-xl border border-[#30363d] overflow-hidden">
                    <div className="p-6 border-b border-[#30363d] flex justify-between items-center">
                        <h4 className="font-bold text-white">Recent Activity</h4>
                        <button className="text-sm text-[#79c0ff] hover:underline">View All</button>
                    </div>
                    <table className="w-full text-left">
                        <thead className="bg-[#21262d] text-xs uppercase text-[#8b949e]">
                            <tr>
                                <th className="p-4">Date</th>
                                <th className="p-4">Category</th>
                                <th className="p-4">Amount</th>
                                <th className="p-4">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#30363d]">
                            {transactions.length === 0 ? (
                                <tr><td colSpan="4" className="p-8 text-center text-[#8b949e]">No transactions yet. Add some data!</td></tr>
                            ) : transactions.map(t => (
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
                                    <td className="p-4"><ChevronRight size={16} className="text-[#8b949e]" /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Floating Modal for Add Info */}
                {showForm && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-[#161b22] w-full max-w-lg rounded-2xl border border-[#30363d] shadow-2xl p-8">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-white">Add Financial Record</h3>
                                <button onClick={() => setShowForm(false)} className="text-[#8b949e] hover:text-white">✕</button>
                            </div>

                            <div className="flex gap-2 mb-6">
                                {['expense', 'income', 'loan'].map(type => (
                                    <button
                                        key={type}
                                        onClick={() => setForm({ ...form, type })}
                                        className={`flex-1 py-2 rounded-lg capitalize border ${form.type === type ? 'bg-[#238636] border-transparent text-white' : 'border-[#30363d] hover:bg-[#21262d]'}`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>

                            <form onSubmit={handleEntry} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-[#8b949e] mb-1 uppercase">Amount ($)</label>
                                    <input
                                        type="number"
                                        required
                                        className="w-full p-3 bg-[#0d1117] border border-[#30363d] rounded-lg focus:outline-none focus:border-[#238636]"
                                        value={form.amount}
                                        onChange={e => setForm({ ...form, amount: e.target.value })}
                                    />
                                </div>
                                {form.type === 'expense' ? (
                                    <div>
                                        <label className="block text-xs font-bold text-[#8b949e] mb-1 uppercase">Category</label>
                                        <select
                                            className="w-full p-3 bg-[#0d1117] border border-[#30363d] rounded-lg focus:outline-none focus:border-[#238636]"
                                            onChange={e => setForm({ ...form, category: e.target.value })}
                                        >
                                            <option value="Food">Food</option>
                                            <option value="Rent">Rent</option>
                                            <option value="Travel">Travel</option>
                                            <option value="Shopping">Shopping</option>
                                            <option value="Misc">Misc</option>
                                        </select>
                                    </div>
                                ) : (
                                    <div>
                                        <label className="block text-xs font-bold text-[#8b949e] mb-1 uppercase">Source / Name</label>
                                        <input
                                            placeholder="e.g. Salary, Side Project"
                                            className="w-full p-3 bg-[#0d1117] border border-[#30363d] rounded-lg focus:outline-none focus:border-[#238636]"
                                            onChange={e => setForm({ ...form, source: e.target.value })}
                                        />
                                    </div>
                                )}
                                <button className="w-full bg-[#238636] p-4 rounded-lg font-bold text-white hover:bg-[#2ea043] shadow-lg flex items-center justify-center gap-2">
                                    {loading ? <Loader2 className="animate-spin" /> : <><Plus size={20} /> Save Entry</>}
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default App;
