'use client';

import { useState } from 'react';
import Button from '@/components/Button';

export default function ContactPage() {
    const [status, setStatus] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setStatus(null);
        const form = e.currentTarget;
        const formData = new FormData(form);
        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                body: JSON.stringify(Object.fromEntries(formData)),
                headers: { 'Content-Type': 'application/json' },
            });
            if (res.ok) {
                setStatus('SUCCESS');
                form.reset();
            } else throw new Error('Failed to send message');
        } catch (err) {
            setStatus('ERROR');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container section animate-fade-in">
            <h1 className="text-gradient" style={{ textAlign: 'center', marginBottom: 'var(--spacing-2xl)' }}>Get in Touch</h1>
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
                            <p style={{ color: 'var(--color-text-light)' }}>+91 9030600126</p>
                        </div>
                    </div>
                </div>

                <div className="glass-card" style={{ padding: 'var(--spacing-xl)' }}>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                        <input type="text" name="name" placeholder="Your Name" required style={inputStyle} />
                        <input type="email" name="email" placeholder="Your Email" required style={inputStyle} />
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
