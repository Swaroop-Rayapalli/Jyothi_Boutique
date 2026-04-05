'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const isLoginPage = pathname === '/admin/login';
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isMounted, setIsMounted] = useState(false);
    const [profile, setProfile] = useState({ username: 'Admin', profilePhoto: '' });

    const fetchProfile = async () => {
        try {
            const res = await fetch('/api/admin/profile');
            if (res.ok) {
                const data = await res.json();
                setProfile(data);
            }
        } catch (error) {
            console.error('Failed to fetch profile in layout:', error);
        }
    };

    useEffect(() => {
        setIsMounted(true);
        if (typeof window !== 'undefined' && window.innerWidth < 1024) {
            setIsSidebarOpen(false);
        }
        fetchProfile();

        // Listen for profile updates from the profile page
        window.addEventListener('profileUpdate', fetchProfile);
        return () => window.removeEventListener('profileUpdate', fetchProfile);
    }, []);

    const handleLogout = async () => {
        try {
            const res = await fetch('/api/admin/auth/logout', { method: 'POST' });
            if (res.ok) {
                router.push('/admin/login');
            }
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    if (isLoginPage) {
        return <>{children}</>;
    }

    const navItems = [
        { name: 'Dashboard', path: '/admin', icon: '📊' },
        { name: 'Manage Orders', path: '/admin/orders', icon: '📦' },
        { name: 'Manage Products', path: '/admin/products', icon: '🛍️' },
        { name: 'Manage Feedback', path: '/admin/feedback', icon: '💬' },
        { name: 'My Profile', path: '/admin/profile', icon: '👤' },
    ];

    return (
        <div style={{ 
            display: 'flex', 
            minHeight: '100vh', 
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            color: '#f8fafc',
            fontFamily: 'var(--font-inter)',
            position: 'relative'
        }}>
            {/* Mobile Sidebar Overlay */}
            {isMounted && !isSidebarOpen && typeof window !== 'undefined' && window.innerWidth < 1024 ? null : (
                isMounted && isSidebarOpen && typeof window !== 'undefined' && window.innerWidth < 1024 && (
                    <div 
                        onClick={() => setIsSidebarOpen(false)}
                        style={{
                            position: 'fixed',
                            inset: 0,
                            background: 'rgba(0,0,0,0.5)',
                            backdropFilter: 'blur(4px)',
                            zIndex: 90
                        }}
                    />
                )
            )}

            {/* Sidebar */}
            <aside className={`admin-sidebar ${isSidebarOpen ? 'closed' : 'open'}`} style={{
                background: 'rgba(30, 41, 59, 0.9)',
                backdropFilter: 'blur(20px)',
                borderRight: '1px solid rgba(255, 255, 255, 0.1)',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                display: 'flex',
                flexDirection: 'column',
                position: isMounted && typeof window !== 'undefined' && window.innerWidth < 1024 ? 'fixed' : 'sticky',
                left: 0,
                top: 0,
                height: '100vh',
                zIndex: 100,
                width: isSidebarOpen ? '280px' : '80px',
                transform: isMounted && typeof window !== 'undefined' && window.innerWidth < 1024 && !isSidebarOpen ? 'translateX(-100%)' : 'translateX(0)'
            }}>
                <div style={{ padding: '2rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    {isMounted && (
                        <h2 style={{ fontSize: isSidebarOpen ? '1.5rem' : '1.25rem', fontWeight: 800, color: '#fbbf24', margin: 0, transition: 'all 0.3s' }}>
                            {isSidebarOpen ? (profile.username?.toUpperCase() || 'JB ADMIN') : (profile.username?.charAt(0).toUpperCase() || 'JB')}
                        </h2>
                    )}
                    <button 
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.5rem', color: '#94a3b8' }}
                    >
                        {isSidebarOpen ? '⬅️' : '➡️'}
                    </button>
                </div>

                <nav style={{ flex: 1, padding: '1rem' }}>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {navItems.map((item) => (
                            <li key={item.path} style={{ marginBottom: '0.5rem' }}>
                                <Link href={item.path} onClick={() => isMounted && typeof window !== 'undefined' && window.innerWidth < 1024 && setIsSidebarOpen(false)} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '1rem',
                                    padding: '0.75rem 1rem',
                                    borderRadius: '0.5rem',
                                    textDecoration: 'none',
                                    color: pathname === item.path ? '#fbbf24' : '#94a3b8',
                                    background: pathname === item.path ? 'rgba(251, 191, 36, 0.1)' : 'transparent',
                                    transition: 'all 0.2s ease',
                                    fontWeight: pathname === item.path ? 600 : 400
                                }}>
                                    <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
                                    {isSidebarOpen && <span>{item.name}</span>}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div style={{ padding: '1.5rem', borderTop: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <Link href="/" style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        padding: '0.75rem 1rem',
                        borderRadius: '0.5rem',
                        textDecoration: 'none',
                        color: '#94a3b8',
                        fontSize: '0.875rem'
                    }}>
                        <span>🏠</span>
                        {isSidebarOpen && <span>Back to Site</span>}
                    </Link>
                    
                    <button 
                        onClick={handleLogout}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            padding: '0.75rem 1rem',
                            borderRadius: '0.5rem',
                            background: 'none',
                            border: 'none',
                            color: '#f43f5e',
                            fontSize: '0.875rem',
                            cursor: 'pointer',
                            textAlign: 'left',
                            width: '100%',
                            transition: 'all 0.2s'
                        }}
                    >
                        <span>🚪</span>
                        {isSidebarOpen && <span style={{ fontWeight: 600 }}>Logout</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="admin-main">
                <header className="admin-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        {isMounted && typeof window !== 'undefined' && window.innerWidth < 1024 && (
                            <button 
                                onClick={() => setIsSidebarOpen(true)}
                                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', padding: '0.4rem 0.6rem', cursor: 'pointer', fontSize: '1.1rem', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >
                                ☰
                            </button>
                        )}
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '4px' }}>
                                <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#fbbf24', letterSpacing: '0.15em', background: 'rgba(251, 191, 36, 0.1)', padding: '2px 8px', borderRadius: '4px' }}>JB ADMIN</span>
                                <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)' }}></span>
                                <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Boutique Management</p>
                            </div>
                            <h1 style={{ fontSize: 'clamp(1rem, 4vw, 1.5rem)', fontWeight: 700, margin: 0, color: 'white', whiteSpace: 'nowrap' }}>
                                {navItems.find(i => i.path === pathname)?.name || 'Admin'}
                            </h1>
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        {/* Search Bar - Visual only */}
                        <div className="admin-search-container" style={{ position: 'relative' }}>
                            <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '0.875rem' }}>🔍</span>
                            <input 
                                type="text" 
                                placeholder="Search..." 
                                style={{ 
                                    background: 'rgba(255, 255, 255, 0.05)', 
                                    border: '1px solid rgba(255, 255, 255, 0.1)', 
                                    borderRadius: '2rem', 
                                    padding: '0.5rem 1rem 0.5rem 2.5rem',
                                    color: 'white',
                                    fontSize: '0.875rem',
                                    width: '180px'
                                }}
                            />
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <button title="Notifications" style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '1.1rem', cursor: 'pointer', position: 'relative' }}>
                                🔔
                                <span style={{ position: 'absolute', top: '-1px', right: '-1px', background: '#ef4444', width: '6px', height: '6px', borderRadius: '50%', border: '2px solid #0f172a' }}></span>
                            </button>
                            
                            <Link href="/admin/profile" title="My Profile" style={{ textDecoration: 'none' }}>
                                {profile.profilePhoto ? (
                                    <div style={{ 
                                        width: '32px', 
                                        height: '32px', 
                                        borderRadius: '50%', 
                                        backgroundImage: `url(${profile.profilePhoto})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        cursor: 'pointer',
                                        border: '2px solid rgba(251, 191, 36, 0.5)',
                                        boxShadow: '0 2px 8px rgba(251, 191, 36, 0.2)'
                                    }}></div>
                                ) : (
                                    <div style={{ 
                                        width: '32px', 
                                        height: '32px', 
                                        borderRadius: '50%', 
                                        background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)', 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        justifyContent: 'center',
                                        fontWeight: 700,
                                        color: '#0f172a',
                                        fontSize: '0.875rem',
                                        cursor: 'pointer',
                                        boxShadow: '0 2px 8px rgba(251, 191, 36, 0.3)'
                                    }}>
                                        {profile.username?.charAt(0).toUpperCase()}
                                    </div>
                                )}
                            </Link>
                        </div>
                    </div>
                </header>

                <div className="admin-content-fade">
                    {children}
                </div>
            </main>

            <style jsx global>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .admin-content-fade {
                    animation: fadeIn 0.4s ease-out;
                }
                .admin-main {
                    flex: 1;
                    padding: 1.5rem;
                    overflow-y: auto;
                    max-width: 1200px;
                    margin: 0 auto;
                    width: 100%;
                }
                .admin-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 2.5rem;
                    padding-bottom: 1.5rem;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                    position: sticky;
                    top: 0;
                    background: rgba(15, 23, 42, 0.8);
                    backdrop-filter: blur(12px);
                    z-index: 50;
                    margin-top: -1.5rem;
                    padding-top: 1.5rem;
                }
                @media (max-width: 1024px) {
                    .admin-main {
                        padding: 1rem;
                    }
                    .admin-header {
                        margin-bottom: 1.5rem;
                    }
                }
                .glass-card {
                    background: rgba(30, 41, 59, 0.5);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 1rem;
                    padding: 1.5rem;
                }
                @media (max-width: 640px) {
                    .glass-card {
                        padding: 1rem;
                    }
                }
                
                .admin-search-container { display: none; }
                
                @media (min-width: 1024px) {
                    .admin-search-container {
                        display: block;
                    }
                }

                .btn-admin-primary {
                    background: #fbbf24;
                    color: #0f172a;
                    border: none;
                    padding: 0.75rem 1.5rem;
                    border-radius: 0.5rem;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .btn-admin-primary:hover {
                    background: #f59e0b;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(251, 191, 36, 0.3);
                }
            `}</style>
        </div>
    );
}
