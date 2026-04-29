'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/lib/cart';

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const pathname = usePathname();
    const { totalItems } = useCart();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Home', href: '/' },
        { name: 'Collections', href: '/products' },
        { name: 'About', href: '/about' },
    ];

    return (
        <header
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                zIndex: 'var(--z-header)',
                transition: 'all var(--transition-base)',
                padding: isScrolled ? '0.5rem 0' : '1.5rem 0',
                boxSizing: 'border-box'
            }}
            className={isScrolled ? 'glass-nav' : ''}
        >
            <div className="container" style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                width: '100%',
                maxWidth: '1280px',
                margin: '0 auto',
                padding: '0 var(--spacing-sm)',
                boxSizing: 'border-box'
            }}>
                {/* Logo */}
                <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', zIndex: 10, textDecoration: 'none' }}>
                    <div style={{
                        width: isScrolled ? '40px' : '50px',
                        height: isScrolled ? '40px' : '50px',
                        borderRadius: 'var(--radius-sm)',
                        overflow: 'hidden',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all var(--transition-base)'
                    }}>
                        <img 
                            src="/images/logo.png" 
                            alt="JB Logo" 
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onError={(e) => {
                                // Fallback to CSS logo if image doesn't exist
                                const parent = e.currentTarget.parentElement;
                                if (parent) {
                                    e.currentTarget.style.display = 'none';
                                    parent.style.background = 'linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))';
                                    parent.innerText = 'JB';
                                    parent.style.color = 'var(--color-secondary)';
                                    parent.style.fontWeight = '700';
                                    parent.style.fontSize = isScrolled ? '1.2rem' : '1.5rem';
                                }
                            }}
                        />
                    </div>
                    <span className="logo-text" style={{
                        fontSize: isScrolled ? '1.1rem' : '1.35rem',
                        fontWeight: 700,
                        fontFamily: 'var(--font-playfair)',
                        color: 'var(--color-text)',
                        letterSpacing: '0.05em',
                        transition: 'all var(--transition-base)'
                    }}>
                        Jyothi Boutique
                    </span>
                </Link>

                {/* Desktop Navigation (Centered) */}
                <nav className="desktop-nav" style={{ flex: 1, justifyContent: 'center' }}>
                    <ul style={{ display: 'flex', gap: 'var(--spacing-xl)', listStyle: 'none', margin: 0, padding: 0 }}>
                        {navLinks.map((link) => {
                            const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
                            return (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        style={{
                                            color: isActive ? 'var(--color-primary)' : 'var(--color-text-light)',
                                            fontWeight: isActive ? 600 : 400,
                                            fontSize: '0.95rem',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.05em',
                                            transition: 'color var(--transition-base)',
                                            textDecoration: 'none',
                                        }}
                                        className="nav-link"
                                    >
                                        {link.name}
                                        {isActive && (
                                            <span style={{
                                                position: 'absolute',
                                                bottom: '-4px',
                                                left: 0,
                                                width: '100%',
                                                height: '2px',
                                                background: 'var(--color-primary)',
                                                borderRadius: '2px'
                                            }} />
                                        )}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                {/* Actions (Right Aligned) */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)', zIndex: 10 }}>
                    <Link href="/cart" style={{ position: 'relative', color: 'var(--color-text)', display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                            <line x1="3" y1="6" x2="21" y2="6" />
                            <path d="M16 10a4 4 0 01-8 0" />
                        </svg>
                        {totalItems > 0 && (
                            <span style={{
                                position: 'absolute',
                                top: '-8px',
                                right: '-8px',
                                background: 'var(--color-primary)',
                                color: 'var(--color-secondary)',
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                width: '20px',
                                height: '20px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: 'var(--radius-full)',
                            }}>
                                {totalItems}
                            </span>
                        )}
                    </Link>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="mobile-menu-btn"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--color-text)',
                            cursor: 'pointer',
                        }}
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            {isMenuOpen ? (
                                <path d="M18 6L6 18M6 6l12 12" />
                            ) : (
                                <path d="M3 12h18M3 6h18M3 18h18" />
                            )}
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile Navigation Overlay */}
            <div className="mobile-menu-overlay" style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100vh',
                background: 'rgba(31, 4, 21, 0.98)',
                backdropFilter: 'blur(16px)',
                zIndex: 1000,
                display: 'flex',
                flexDirection: 'column',
                padding: '8rem 2rem 2rem',
                gap: '2rem',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                opacity: isMenuOpen ? 1 : 0,
                visibility: isMenuOpen ? 'visible' : 'hidden',
                transform: isMenuOpen ? 'translateY(0)' : 'translateY(-10px)',
                pointerEvents: isMenuOpen ? 'auto' : 'none'
            }}>
                {navLinks.map((link, index) => (
                    <Link
                        key={link.name}
                        href={link.href}
                        onClick={() => setIsMenuOpen(false)}
                        style={{
                            color: pathname === link.href ? 'var(--color-primary)' : 'var(--color-text)',
                            fontSize: '1.75rem',
                            fontWeight: pathname === link.href ? 700 : 400,
                            textTransform: 'uppercase',
                            textDecoration: 'none',
                            letterSpacing: '0.1em',
                            fontFamily: 'var(--font-playfair)',
                            transition: 'all 0.3s ease',
                            transitionDelay: `${index * 50}ms`,
                            transform: isMenuOpen ? 'translateX(0)' : 'translateX(-20px)',
                            opacity: isMenuOpen ? 1 : 0
                        }}
                    >
                        {link.name}
                    </Link>
                ))}
            </div>
        </header>
    );
}
