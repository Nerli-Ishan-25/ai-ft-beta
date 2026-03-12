import React, { useState, useEffect } from "react";
import { Mail, Lock, User, UserPlus } from "lucide-react";
import AuthInput from "../components/AuthInput";
import AuthLayout from "../components/AuthLayout";
import { signupUser } from "../services/authService";
import "../styles/auth.css";
import { useNavigate } from "react-router-dom";

const SignupPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: ""
    });

    useEffect(() => {
        if (localStorage.getItem("loggedUser")) {
            navigate("/dashboard");
        }
    }, [navigate]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        setTimeout(() => {
            const result = signupUser(form);
            setLoading(false);

            if (result.success) {
                // Auto-login
                localStorage.setItem("loggedUser", JSON.stringify({
                    email: form.email,
                    name: form.name
                }));
                navigate("/", { replace: true });
            } else {
                alert(result.message);
            }
        }, 800);
    };

    return (
        <AuthLayout
            title="Create Account"
            subtitle="Join us and start optimizing your finances today"
        >
            <form className="auth-form" onSubmit={handleSubmit}>
                <div className="auth-input-group">
                    <label>FULL NAME</label>
                    <AuthInput
                        icon={User}
                        type="text"
                        placeholder="Full Name"
                        value={form.name}
                        onChange={handleChange}
                        name="name"
                    />
                </div>

                <div className="auth-input-group">
                    <label>EMAIL ADDRESS</label>
                    <AuthInput
                        icon={Mail}
                        type="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={handleChange}
                        name="email"
                    />
                </div>

                <div className="auth-input-group">
                    <label>PASSWORD</label>
                    <AuthInput
                        icon={Lock}
                        type="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={handleChange}
                        name="password"
                    />
                </div>

                <p className="auth-terms">
                    By signing up, you agree to our <span>Terms of Service</span>.
                </p>

                <button className="auth-submit-btn" disabled={loading}>
                    {loading ? (
                        <span className="spinner" />
                    ) : (
                        <>
                            <UserPlus size={18} />
                            Start Free
                        </>
                    )}
                </button>
            </form>

            <div className="auth-footer">
                <span>Already have an account?</span>
                <span className="auth-link" onClick={() => navigate("/login")}>Sign In</span>
            </div>
        </AuthLayout>
    );
};

export default SignupPage;
