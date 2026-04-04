'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

type ViewState = 'login' | 'forgot';

export default function AdminLoginPage() {
    const [view, setView] = useState<ViewState>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const adminEmail = "jyothipaints15@gmail.com";

    // Function to mask the email: jyothipaints15@gmail.com -> jy***@gmail.com
    const maskEmail = (emailStr: string) => {
        const [username, domain] = emailStr.split('@');
        if (!username || !domain) return emailStr;
        const maskedUsername = username.length > 2 
            ? username.substring(0, 2) + '*'.repeat(Math.min(username.length - 2, 5))
            : username + '***';
        return `${maskedUsername}@${domain}`;
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        try {
            const res = await fetch('/api/admin/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (res.ok) {
                localStorage.removeItem('jb_admin_auth');
                router.push('/admin');
            } else {
                setError(data.error || 'Invalid credentials');
            }
        } catch (err) {
            setError('An error occurred during login');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPasswordClick = async () => {
        setLoading(true);
        setError('');
        setMessage('');

        try {
            const res = await fetch('/api/admin/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: adminEmail }),
            });

            const data = await res.json();

            if (res.ok) {
                setMessage('A new random password has been sent to your email. Please check it and sign in.');
                setView('login');
            } else {
                setError(data.error || 'Failed to reset password');
            }
        } catch (err) {
            setError('An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const renderLoginForm = () => (
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ textAlign: 'left' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#94a3b8' }}>Admin Email</label>
                <input 
                    type="email" 
                    required
                    placeholder="admin@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="admin-input"
                />
            </div>
            <div style={{ textAlign: 'left' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <label style={{ fontSize: '0.875rem', color: '#94a3b8' }}>Password</label>
                    <button 
                        type="button" 
                        onClick={() => { setView('forgot'); setError(''); setMessage(''); }}
                        style={{ background: 'none', border: 'none', color: '#fbbf24', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 600 }}
                    >
                        Forgot Password?
                    </button>
                </div>
                <input 
                    type="password" 
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="admin-input"
                />
            </div>
            <button type="submit" disabled={loading} className="btn-admin-primary" style={{ width: '100%', padding: '1rem', marginTop: '0.5rem' }}>
                {loading ? 'Authenticating...' : 'Sign In'}
            </button>
        </form>
    );

    const renderForgotView = () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', textAlign: 'center' }}>
            <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: '1.6' }}>
                A message will be sent to <span style={{ color: 'white', fontWeight: 600 }}>{maskEmail(adminEmail)}</span>.
            </p>
            <button 
                onClick={handleResetPasswordClick}
                disabled={loading} 
                className="btn-admin-primary" 
                style={{ width: '100%', padding: '1rem' }}
            >
                {loading ? 'Processing...' : 'Click here to reset password'}
            </button>
            <button 
                type="button" 
                onClick={() => setView('login')}
                style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '0.875rem', cursor: 'pointer' }}
            >
                Back to Login
            </button>
        </div>
    );

    return (
        <div className="login-container">
            <div className="glass-card login-card">
                <div className="login-header">
                    <div className="login-icon">
                        {view === 'login' ? '🏛️' : '📧'}
                    </div>
                    <h1 className="login-title">
                        {view === 'login' ? 'Admin Access' : 'Forgot Password'}
                    </h1>
                    <p className="login-subtitle">
                        {view === 'login' ? 'Manage your boutique dashboard' : 'Verification required to reset access'}
                    </p>
                </div>

                {error && <div className="alert error">{error}</div>}
                {message && <div className="alert success">{message}</div>}

                {view === 'login' ? renderLoginForm() : renderForgotView()}

                <div className="login-footer">
                    <a href="/" className="back-link">← Return to Boutique</a>
                </div>
            </div>

            <style jsx global>{`
                .login-container {
                    min-height: 100vh;
                    background: radial-gradient(circle at top right, #1e293b, #0f172a);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 2rem;
                    font-family: var(--font-inter);
                }
                .login-card {
                    max-width: 420px;
                    width: 100%;
                    padding: 3rem 2.5rem;
                    text-align: center;
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
                }
                .login-header { margin-bottom: 2rem; }
                .login-icon { font-size: 3.5rem; margin-bottom: 1rem; filter: drop-shadow(0 0 10px rgba(251, 191, 36, 0.2)); }
                .login-title { fontSize: 2rem; fontWeight: 800; color: #fbbf24; margin-bottom: 0.5rem; letter-spacing: -0.025em; }
                .login-subtitle { color: #94a3b8; font-size: 0.925rem; line-height: 1.5; }
                
                .admin-input {
                    width: 100%;
                    padding: 0.875rem 1.125rem;
                    border-radius: 0.75rem;
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    color: white;
                    font-size: 1rem;
                    transition: all 0.2s;
                }
                .admin-input:focus {
                    outline: none;
                    border-color: #fbbf24;
                    background: rgba(255, 255, 255, 0.05);
                    box-shadow: 0 0 0 4px rgba(251, 191, 36, 0.1);
                }
                
                .alert {
                    padding: 0.75rem 1rem;
                    border-radius: 0.75rem;
                    font-size: 0.875rem;
                    margin-bottom: 1.5rem;
                    font-weight: 500;
                    animation: slideDown 0.3s ease-out;
                }
                @keyframes slideDown {
                    from { transform: translateY(-10px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                .alert.error { background: rgba(244, 63, 94, 0.1); color: #fb7185; border: 1px solid rgba(244, 63, 94, 0.2); }
                .alert.success { background: rgba(16, 185, 129, 0.1); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.2); }
                
                .login-footer { margin-top: 2.5rem; padding-top: 1.5rem; border-top: 1px solid rgba(255, 255, 255, 0.05); }
                .back-link { color: #64748b; text-decoration: none; font-size: 0.875rem; font-weight: 500; transition: color 0.2s; }
                .back-link:hover { color: #94a3b8; }
                
                .glass-card {
                    background: rgba(30, 41, 59, 0.7);
                    backdrop-filter: blur(16px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 1.5rem;
                }
                .btn-admin-primary {
                    background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
                    color: #0f172a;
                    border: none;
                    border-radius: 0.75rem;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .btn-admin-primary:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 10px 25px -5px rgba(251, 191, 36, 0.4);
                }
                .btn-admin-primary:active:not(:disabled) { transform: translateY(0); }
                .btn-admin-primary:disabled { opacity: 0.6; cursor: not-allowed; filter: grayscale(0.5); }
            `}</style>
        </div>
    );
}
