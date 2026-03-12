import React from "react";

const AuthInput = ({ icon: Icon, type, placeholder, value, onChange, name }) => {
    return (
        <div className="auth-input">
            {Icon && <Icon size={18} />}
            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                name={name}
                required
            />
        </div>
    );
};

export default AuthInput;