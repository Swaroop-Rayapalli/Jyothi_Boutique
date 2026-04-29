'use client';

import { useState } from 'react';
import Button from '@/components/Button';

const INSTAGRAM_URL = "https://www.instagram.com/jyothipaints?igsh=MTJwZjd1amlwb3R0dg%3D%3D";

export default function ContactPage() {
    const [status, setStatus] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setStatus(null);
        
        const form = e.currentTarget;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        try {
            await fetch('/api/contact', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: { 'Content-Type': 'application/json' },
            });

            const whatsappNumber = "917286916108";
            const message = `*Jyothi Paints Contact Request*\n\n*Name:* ${data.name}\n*Email:* ${data.email}\n*Subject:* ${data.subject}\n\n*Message:*\n${data.message}`;
            const encodedMessage = encodeURIComponent(message);
            const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

            window.open(whatsappUrl, '_blank');
            
            setStatus('SUCCESS');
            form.reset();
        } catch (e: any) {
            console.error('Contact form error:', e);
            setStatus('ERROR');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container section animate-fade-in">
            <h1 className="text-gradient" style={{ textAlign: 'center', marginBottom: 'var(--spacing-2xl)' }}>Get in Touch</h1>

            {/* Instagram Highlight Banner */}
            <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '1rem',
                    background: 'linear-gradient(135deg, #833ab4 0%, #fd1d1d 50%, #fcb045 100%)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '1.25rem 2rem',
                    marginBottom: 'var(--spacing-2xl)',
                    textDecoration: 'none',
                    color: '#fff',
                    boxShadow: '0 8px 32px rgba(253,29,29,0.3)',
                    transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                    flexWrap: 'wrap',
                }}
                onMouseEnter={e => {
                    (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-3px)';
                    (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 14px 42px rgba(253,29,29,0.45)';
                }}
                onMouseLeave={e => {
                    (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(0)';
                    (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 8px 32px rgba(253,29,29,0.3)';
                }}
            >
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <circle cx="12" cy="12" r="4" />
                    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                </svg>
                <div>
                    <p style={{ fontWeight: 800, fontSize: '1.2rem', margin: 0, letterSpacing: '0.02em' }}>Follow us on Instagram</p>
                    <p style={{ margin: 0, fontSize: '0.95rem', opacity: 0.9 }}>@jyothipaints — See our latest paintings &amp; creations</p>
                </div>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 'auto', opacity: 0.85 }}>
                    <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
            </a>

            <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-3xl)' }}>
                <div>
                    <h2 style={{ marginBottom: 'var(--spacing-md)' }}>We'd love to hear from you</h2>
                    <p style={{ color: 'var(--color-text-light)', marginBottom: 'var(--spacing-xl)' }}>
                        Whether you have a question about our collections, need assistance with an order, or want to book a bespoke consultation, our team is here to help.
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                        <div style={{ background: 'rgba(255,255,255,0.05)', padding: 'var(--spacing-md)', borderRadius: 'var(--radius-md)' }}>
                            <h3 style={{ color: 'var(--color-primary)', fontSize: '1.125rem' }}>Visit Us</h3>
                            <p style={{ color: 'var(--color-text-light)' }}>INS Kalinga, Blue Marino<br />Visakhapatnam, Andhra Pradesh 531163</p>
                        </div>
                        <div style={{ background: 'rgba(255,255,255,0.05)', padding: 'var(--spacing-md)', borderRadius: 'var(--radius-md)' }}>
                            <h3 style={{ color: 'var(--color-primary)', fontSize: '1.125rem' }}>Call Us</h3>
                            <p style={{ color: 'var(--color-text-light)' }}>+91 7286916108</p>
                        </div>

                        {/* Instagram Card in Contact Info */}
                        <a
                            href={INSTAGRAM_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                background: 'linear-gradient(135deg, rgba(131,58,180,0.25), rgba(253,29,29,0.2), rgba(252,176,69,0.2))',
                                border: '1.5px solid rgba(253,29,29,0.35)',
                                padding: 'var(--spacing-md)',
                                borderRadius: 'var(--radius-md)',
                                textDecoration: 'none',
                                color: '#fff',
                                transition: 'border-color 0.2s ease, background 0.2s ease',
                            }}
                            onMouseEnter={e => {
                                (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(253,29,29,0.7)';
                            }}
                            onMouseLeave={e => {
                                (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(253,29,29,0.35)';
                            }}
                        >
                            <div style={{
                                width: '44px',
                                height: '44px',
                                borderRadius: '12px',
                                background: 'linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                            }}>
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                                    <circle cx="12" cy="12" r="4" />
                                    <circle cx="17.5" cy="6.5" r="1" fill="white" stroke="none" />
                                </svg>
                            </div>
                            <div>
                                <p style={{ margin: 0, fontWeight: 700, fontSize: '1rem' }}>Instagram</p>
                                <p style={{ margin: 0, color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem' }}>@jyothipaints</p>
                            </div>
                        </a>
                    </div>
                </div>

                <div className="glass-card" style={{ padding: 'var(--spacing-xl)' }}>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                        <input type="text" name="name" placeholder="Your Name" required style={inputStyle} autoComplete="name" />
                        <input type="email" name="email" placeholder="Your Email" required style={inputStyle} autoComplete="email" />
                        <input type="text" name="subject" placeholder="Subject" required style={inputStyle} />
                        <textarea name="message" placeholder="Your Message" required style={{ ...inputStyle, minHeight: '150px' }} />
                        <Button type="submit" variant="primary" size="lg" disabled={isSubmitting}>
                            {isSubmitting ? 'Sending...' : 'Send Message'}
                        </Button>
                        {status === 'SUCCESS' && <p style={{ color: 'var(--color-success)', textAlign: 'center' }}>Message sent successfully!</p>}
                        {status === 'ERROR' && <p style={{ color: 'var(--color-error)', textAlign: 'center' }}>Failed to send message. Try again later.</p>}
                    </form>
                </div>
            </div>

            {/* Google Maps Section */}
            <div style={{ marginTop: 'var(--spacing-3xl)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3797.7441221191397!2d83.41164967595568!3d17.850550183116416!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a39599ab234c89d%3A0xc3f3458de1c88814!2sINS%20Kalinga!5e0!3m2!1sen!2sin!4v1712234000000!5m2!1sen!2sin" 
                    width="100%" 
                    height="450" 
                    style={{ border: 0 }} 
                    allowFullScreen={true} 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
            </div>
        </div>
    );
}

const inputStyle = {
    padding: '1rem',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-sm)',
    color: 'white',
    width: '100%',
    fontFamily: 'inherit'
};
