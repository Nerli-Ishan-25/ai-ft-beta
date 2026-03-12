import React, { useState, useEffect } from "react";
import { Mail, Lock, LogIn } from "lucide-react";
import AuthInput from "../components/AuthInput";
import AuthLayout from "../components/AuthLayout";
import { loginUser } from "../services/authService";
import "../styles/auth.css";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (localStorage.getItem("loggedUser")) {
            navigate("/dashboard");
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        setTimeout(() => {
            const result = loginUser(email, password);
            setLoading(false);

            if (result.success) {
                navigate("/", { replace: true });
            } else {
                alert(result.message);
            }
        }, 800);
    };

    return (
        <AuthLayout
            title="Welcome Back"
            subtitle="Login to access your AI-powered financial dashboard"
        >
            <form className="auth-form" onSubmit={handleSubmit}>
                <div className="auth-input-group">
                    <label>EMAIL ADDRESS</label>
                    <AuthInput
                        icon={Mail}
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div className="auth-input-group">
                    <label>PASSWORD</label>
                    <AuthInput
                        icon={Lock}
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <p className="forgot-password">Forgot password?</p>

                <button className="auth-submit-btn" disabled={loading}>
                    {loading ? (
                        <span className="spinner" />
                    ) : (
                        <>
                            <LogIn size={18} />
                            Sign In
                        </>
                    )}
                </button>
            </form>

            <div className="auth-footer">
                <span>Don't have an account?</span>
                <span className="auth-link" onClick={() => navigate("/signup")}>Create Account</span>
            </div>
        </AuthLayout>
    );
};

export default LoginPage;
