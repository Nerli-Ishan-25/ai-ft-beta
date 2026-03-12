import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    DollarSign, Briefcase, PiggyBank, TrendingUp, Bitcoin, Home, CreditCard,
    ArrowRight, ArrowLeft, Check, Utensils, Car, Tv
} from "lucide-react";
import AuthInput from "../components/AuthInput";
import "../styles/onboarding.css";

const Onboarding = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);

    useEffect(() => {
        if (localStorage.getItem("financialProfile")) {
            navigate("/dashboard");
        }
    }, [navigate]);

    const [formData, setFormData] = useState({
        monthlyIncome: "", incomeSource: "",
        savings: "", investments: "", crypto: "", property: "",
        creditCardDebt: "", loans: "",
        rent: "", food: "", transport: "", subscriptions: ""
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const nextStep = () => setStep(prev => Math.min(prev + 1, 3));
    const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

    const handleSubmit = (e) => {
        e.preventDefault();
        localStorage.setItem("financialProfile", JSON.stringify(formData));
        navigate("/", { replace: true });
    };

    const STEP_CONTENT = {
        1: { title: "Let's talk income", sub: "Your monthly cash flow helps us build your baseline." },
        2: { title: "Your Assets", sub: "What do you currently own? This builds your Net Worth." },
        3: { title: "Liabilities & Expenses", sub: "Final step! What are your monthly commitments?" }
    };

    return (
        <div className="onboarding-page">
            <div className="floating-shapes">
                <div className="shape shape-1" />
                <div className="shape shape-2" />
            </div>

            <div className="onboarding-card">
                <div className="progress-container">
                    <div className="progress-line" />
                    <div className="progress-line-active" style={{ width: `${(step - 1) * 50}%` }} />
                    {[1, 2, 3].map(s => (
                        <div key={s} className={`step-node ${step === s ? "active" : ""} ${step > s ? "completed" : ""}`}>
                            {step > s ? <Check size={18} /> : s}
                        </div>
                    ))}
                </div>

                <form onSubmit={step === 3 ? handleSubmit : (e) => e.preventDefault()}>
                    <div className="onboarding-form">
                        <header className="onboarding-header">
                            <h1 className="onboarding-title">{STEP_CONTENT[step].title}</h1>
                            <p className="onboarding-subtitle">{STEP_CONTENT[step].sub}</p>
                        </header>

                        {step === 1 && (
                            <>
                                <div className="auth-input-group">
                                    <label>MONTHLY INCOME (AFTER TAX)</label>
                                    <AuthInput icon={DollarSign} type="number" placeholder="e.g. 5000" name="monthlyIncome" value={formData.monthlyIncome} onChange={handleChange} />
                                </div>
                                <div className="auth-input-group">
                                    <label>INCOME SOURCE (OPTIONAL)</label>
                                    <AuthInput icon={Briefcase} type="text" placeholder="e.g. Full-time Salary" name="incomeSource" value={formData.incomeSource} onChange={handleChange} />
                                </div>
                            </>
                        )}

                        {step === 2 && (
                            <>
                                <div className="auth-input-group"><label>SAVINGS BALANCE</label><AuthInput icon={PiggyBank} type="number" placeholder="0" name="savings" value={formData.savings} onChange={handleChange} /></div>
                                <div className="auth-input-group"><label>STOCKS / INVESTMENTS</label><AuthInput icon={TrendingUp} type="number" placeholder="0" name="investments" value={formData.investments} onChange={handleChange} /></div>
                                <div className="auth-input-group"><label>CRYPTO PORTFOLIO</label><AuthInput icon={Bitcoin} type="number" placeholder="0" name="crypto" value={formData.crypto} onChange={handleChange} /></div>
                                <div className="auth-input-group"><label>PROPERTY VALUE</label><AuthInput icon={Home} type="number" placeholder="0" name="property" value={formData.property} onChange={handleChange} /></div>
                            </>
                        )}

                        {step === 3 && (
                            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                                    <div className="auth-input-group"><label>CREDIT CARD DEBT</label><AuthInput icon={CreditCard} type="number" name="creditCardDebt" value={formData.creditCardDebt} onChange={handleChange} /></div>
                                    <div className="auth-input-group"><label>LOANS / OTHER DEBT</label><AuthInput icon={CreditCard} type="number" name="loans" value={formData.loans} onChange={handleChange} /></div>
                                </div>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                                    <div className="auth-input-group"><label>RENT / MORTGAGE</label><AuthInput icon={Home} type="number" name="rent" value={formData.rent} onChange={handleChange} /></div>
                                    <div className="auth-input-group"><label>FOOD / DINING</label><AuthInput icon={Utensils} type="number" name="food" value={formData.food} onChange={handleChange} /></div>
                                </div>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                                    <div className="auth-input-group"><label>TRANSPORT</label><AuthInput icon={Car} type="number" name="transport" value={formData.transport} onChange={handleChange} /></div>
                                    <div className="auth-input-group"><label>SUBSCRIPTIONS</label><AuthInput icon={Tv} type="number" name="subscriptions" value={formData.subscriptions} onChange={handleChange} /></div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="form-actions">
                        {step > 1 && (
                            <button type="button" className="btn-secondary" onClick={prevStep}>
                                <ArrowLeft size={18} />
                            </button>
                        )}
                        {step < 3 ? (
                            <button type="button" className="btn-primary" onClick={nextStep} disabled={!formData.monthlyIncome && step === 1}>
                                Continue <ArrowRight size={18} />
                            </button>
                        ) : (
                            <button type="submit" className="btn-primary">
                                Complete Setup <Check size={18} />
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Onboarding;
