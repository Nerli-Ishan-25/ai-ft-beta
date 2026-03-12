import React from "react";
import { DollarSign } from "lucide-react";

/**
 * Shared layout for Login, Signup, and potentially Onboarding
 */
const AuthLayout = ({ children, title, subtitle }) => {
    return (
        <div className="auth-page">
            <div className="floating-shapes">
                <div className="shape shape-1" />
                <div className="shape shape-2" />
            </div>

            <div className="auth-card">
                <header className="auth-header">
                    <div className="auth-logo">
                        <DollarSign size={24} color="#000" strokeWidth={3} />
                    </div>
                    <h1 className="auth-title">{title}</h1>
                    <p className="auth-subtitle">{subtitle}</p>
                </header>

                {children}
            </div>
        </div>
    );
};

export default AuthLayout;
