import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import './Login.css';

const EmailIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M3 6.75A2.25 2.25 0 0 1 5.25 4.5h13.5A2.25 2.25 0 0 1 21 6.75v10.5A2.25 2.25 0 0 1 18.75 19.5H5.25A2.25 2.25 0 0 1 3 17.25V6.75Z" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M3.75 6.75 12 12.75l8.25-6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const LockIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect x="6" y="10" width="12" height="10" rx="2" stroke="currentColor" strokeWidth="1.75" />
    <path d="M8 10V7a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    <path d="M12 14v2" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
  </svg>
);

const EyeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12Z" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.75" />
  </svg>
);

const EyeOffIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M3 3l18 18" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    <path d="M9.879 9.88A3 3 0 0 0 14.12 14.12" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    <path d="M1 12s4-7 11-7c2.158 0 4.167.51 5.936 1.386" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    <path d="M22.003 12c-.27.503-.585.994-.942 1.466A10.97 10.97 0 0 1 13 19c-2.158 0-4.167-.51-5.936-1.386" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
  </svg>
);

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      toast.success('Login successful!');
      navigate('/');
    } catch (error) {
      toast.error('Invalid credentials');
    }
  };

  return (
    <div className="login-page">
      <main className="login-card" aria-label="Login to Inventory ERP">
        <section className="brand">
          <div className="brand-top">
            <div className="brand-icon" aria-hidden="true">
              <img src="/Rapidex_Logo.png" alt="Rapidex logo" className="brand-img" />
            </div>
            <div className="brand-heading-row">
              <h1 className="brand-title">Inventory ERP</h1>
              <span className="brand-inline-subtitle">Enterprise Inventory Management System</span>
            </div>
          </div>
        </section>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="email" className="field-label">
              Email
            </label>
            <div className={`input-group ${emailFocused ? 'focused' : ''}`}>
              <span className="field-icon">
                <EmailIcon />
              </span>
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
                required
                autoComplete="email"
                className="text-input"
                placeholder="Enter your email"
                aria-label="Email"
              />
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="password" className="field-label">
              Password
            </label>
            <div className={`input-group ${passwordFocused ? 'focused' : ''}`}>
              <span className="field-icon">
                <LockIcon />
              </span>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
                required
                autoComplete="current-password"
                className="text-input password-input"
                placeholder="Enter your password"
                aria-label="Password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </div>

          <div className="form-row">
            <div />
            <a href="#" className="forgot-link" onClick={(e) => e.preventDefault()}>
              Forgot Password?
            </a>
          </div>

          <button type="submit" className="submit-button">
            Login
          </button>
        </form>

        <div className="form-footer">
          © 2026 Inventory ERP
          <br />
          Secure Business Management Platform
        </div>
      </main>
    </div>
  );
};

export default Login;