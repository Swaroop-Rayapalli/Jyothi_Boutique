'use client';

import Link from 'next/link';

const INSTAGRAM_URL = "https://www.instagram.com/jyothipaints?igsh=MTJwZjd1amlwb3R0dg%3D%3D";

export default function Footer() {
    return (
        <footer style={{
            background: 'var(--color-secondary)',
            borderTop: '1px solid var(--color-border)',
            padding: 'var(--spacing-3xl) 0 var(--spacing-xl)',
            marginTop: 'auto'
        }}>
            <div className="container">
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: 'var(--spacing-2xl)',
                    marginBottom: 'var(--spacing-2xl)'
                }}>
                    {/* Brand Identity */}
                    <div>
                        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-lg)', textDecoration: 'none' }}>
                            <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: 'var(--radius-sm)',
                                overflow: 'hidden',
                                flexShrink: 0,
                            }}>
                                <img src="/images/logo.png" alt="JP Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                            <span style={{ fontSize: '1.4rem', fontWeight: 700, fontFamily: 'var(--font-playfair)', color: 'var(--color-text)' }}>
                                Jyothi Paints
                            </span>
                        </Link>
                        <p style={{ color: 'var(--color-text-light)', marginBottom: 'var(--spacing-lg)', lineHeight: 1.8 }}>
                            Exquisite handcrafted Thanjavur Paintings and custom embroidery, blending traditional artistry with modern elegance.
                        </p>

                        {/* Instagram Highlight */}
                        <a
                            href={INSTAGRAM_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.6rem',
                                background: 'linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045)',
                                padding: '0.6rem 1.2rem',
                                borderRadius: 'var(--radius-full)',
                                color: '#fff',
                                fontWeight: 700,
                                fontSize: '0.95rem',
                                textDecoration: 'none',
                                boxShadow: '0 4px 18px rgba(253,29,29,0.35)',
                                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                            }}
                            onMouseEnter={e => {
                                (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-2px)';
                                (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 8px 28px rgba(253,29,29,0.5)';
                            }}
                            onMouseLeave={e => {
                                (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(0)';
                                (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 4px 18px rgba(253,29,29,0.35)';
                            }}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                                <circle cx="12" cy="12" r="4" />
                                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                            </svg>
                            Follow on Instagram
                        </a>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 style={{ fontSize: '1.25rem', marginBottom: 'var(--spacing-lg)', color: 'var(--color-primary)' }}>Quick Links</h3>
                        <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
                            <li><Link href="/" style={{ color: 'var(--color-text-light)', transition: 'color var(--transition-base)' }} className="hover:text-primary">Home</Link></li>
                            <li><Link href="/products" style={{ color: 'var(--color-text-light)', transition: 'color var(--transition-base)' }} className="hover:text-primary">Collections</Link></li>
                            <li><Link href="/about" style={{ color: 'var(--color-text-light)', transition: 'color var(--transition-base)' }} className="hover:text-primary">About Us</Link></li>
                            <li><Link href="/contact" style={{ color: 'var(--color-text-light)', transition: 'color var(--transition-base)' }} className="hover:text-primary">Contact</Link></li>
                            <li>
                                <a
                                    href={INSTAGRAM_URL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-primary"
                                    style={{ color: 'var(--color-text-light)', transition: 'color var(--transition-base)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                                        <circle cx="12" cy="12" r="4" />
                                        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                                    </svg>
                                    @jyothipaints
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 style={{ fontSize: '1.25rem', marginBottom: 'var(--spacing-lg)', color: 'var(--color-primary)' }}>Contact Us</h3>
                        <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)', color: 'var(--color-text-light)' }}>
                            <li style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--spacing-sm)' }}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2" style={{ flexShrink: 0, marginTop: '4px' }}>
                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                                    <circle cx="12" cy="10" r="3" />
                                </svg>
                                <span>INS Kalinga, Blue Marino, Visakhapatnam, Andhra Pradesh 531163</span>
                            </li>
                            <li style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2">
                                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
                                </svg>
                                <span>+91 7286916108</span>
                            </li>
                            <li style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2">
                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                    <polyline points="22,6 12,13 2,6" />
                                </svg>
                                <span>jyothipaints15@gmail.com</span>
                            </li>
                            {/* Instagram in Contact */}
                            <li>
                                <a
                                    href={INSTAGRAM_URL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        background: 'linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045)',
                                        padding: '0.5rem 1rem',
                                        borderRadius: 'var(--radius-full)',
                                        color: '#fff',
                                        fontWeight: 600,
                                        fontSize: '0.875rem',
                                        textDecoration: 'none',
                                        transition: 'opacity 0.2s ease, transform 0.2s ease',
                                    }}
                                    onMouseEnter={e => {
                                        (e.currentTarget as HTMLAnchorElement).style.opacity = '0.85';
                                        (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-2px)';
                                    }}
                                    onMouseLeave={e => {
                                        (e.currentTarget as HTMLAnchorElement).style.opacity = '1';
                                        (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(0)';
                                    }}
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                                        <circle cx="12" cy="12" r="4" />
                                        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                                    </svg>
                                    @jyothipaints
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Copyright */}
                <div style={{
                    borderTop: '1px solid var(--color-border)',
                    paddingTop: 'var(--spacing-xl)',
                    textAlign: 'center',
                    color: 'rgba(255, 255, 255, 0.5)',
                    fontSize: '0.875rem'
                }}>
                    <p>&copy; {new Date().getFullYear()} Jyothi Paints. All rights reserved to Swaroop Rayapalli.</p>
                </div>
            </div>
            <style jsx>{`
                .hover\\:text-primary:hover {
                    color: var(--color-primary) !important;
                }
            `}</style>
        </footer>
    );
}
