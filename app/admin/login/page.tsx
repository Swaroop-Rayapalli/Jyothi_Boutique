'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Simple static password for demonstration (can be extended to a real auth session later)
        if (password === 'admin123') {
            // In a real app, we'd set a cookie here via an API route
            // For this local setup, we'll just redirect
            localStorage.setItem('jb_admin_auth', 'true');
            router.push('/admin');
        } else {
            setError('Invalid administrative password');
            setLoading(false);
        }
    };

    return (
        <div style={{ 
            minHeight: '100vh', 
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            fontFamily: 'var(--font-inter)'
        }}>
            <div className="glass-card" style={{ maxWidth: '400px', width: '100%', padding: '3rem 2rem', textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏛️</div>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fbbf24', marginBottom: '0.5rem' }}>Admin Access</h1>
                <p style={{ color: '#94a3b8', marginBottom: '2.5rem' }}>Please enter your credentials to manage Jyothi Boutique</p>

                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ textAlign: 'left' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#94a3b8' }}>Password</label>
                        <input 
                            type="password" 
                            required
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{ 
                                width: '100%', 
                                padding: '1rem', 
                                borderRadius: '0.75rem', 
                                background: 'rgba(255, 255, 255, 0.05)', 
                                border: '2px solid rgba(255, 255, 255, 0.1)', 
                                color: 'white',
                                fontSize: '1rem'
                            }} 
                        />
                        {error && <p style={{ color: '#f43f5e', fontSize: '0.875rem', marginTop: '0.5rem' }}>{error}</p>}
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="btn-admin-primary" 
                        style={{ width: '100%', padding: '1rem', fontSize: '1rem' }}
                    >
                        {loading ? 'Authenticating...' : 'Sign In'}
                    </button>
                </form>

                <div style={{ marginTop: '2rem' }}>
                    <a href="/" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.875rem' }}>← Back to Website</a>
                </div>
            </div>

            <style jsx global>{`
                .glass-card {
                    background: rgba(30, 41, 59, 0.6);
                    backdrop-filter: blur(15px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 1.5rem;
                }
                .btn-admin-primary {
                    background: #fbbf24;
                    color: #0f172a;
                    border: none;
                    border-radius: 0.75rem;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .btn-admin-primary:hover {
                    background: #f59e0b;
                    transform: translateY(-2px);
                    box-shadow: 0 8px 20px rgba(251, 191, 36, 0.3);
                }
                input:focus {
                    outline: none;
                    border-color: #fbbf24 !important;
                }
            `}</style>
        </div>
    );
}
