'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/Button';

function SuccessContent() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get('orderId');

    return (
        <div className="container text-center animate-fade-in" style={{ padding: '100px 0' }}>
            <div style={{
                width: '100px', height: '100px', background: 'var(--color-success)',
                borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', fontSize: '3rem', margin: '0 auto var(--spacing-xl)'
            }}>✓</div>

            <h1 className="text-gradient">Order Placed Successfully!</h1>
            <p style={{ color: 'var(--color-text-light)', fontSize: '1.25rem', marginBottom: 'var(--spacing-lg)' }}>
                Thank you for choosing Jyothi Boutique. We&apos;re excited to start working on your maggam work pieces.
            </p>

            <div className="glass-card" style={{ maxWidth: '500px', margin: '0 auto var(--spacing-2xl)', padding: 'var(--spacing-xl)' }}>
                <p style={{ color: 'var(--color-text-light)', marginBottom: 'var(--spacing-sm)' }}>Order ID</p>
                <p style={{ fontSize: '1.5rem', fontWeight: 700, fontFamily: 'monospace' }}>#{orderId || 'JB-2024-001'}</p>
                <div style={{ borderTop: '1px solid var(--color-border)', margin: 'var(--spacing-md) 0', paddingTop: 'var(--spacing-md)' }}>
                    <p style={{ fontSize: '0.875rem' }}>A confirmation email has been sent to your registered email address.</p>
                </div>
            </div>

            <div style={{ display: 'flex', gap: 'var(--spacing-md)', justifyContent: 'center' }}>
                <Link href="/products">
                    <Button variant="outline">Continue Shopping</Button>
                </Link>
                <Link href="/">
                    <Button variant="primary">Back to Home</Button>
                </Link>
            </div>
        </div>
    );
}

export default function OrderSuccessPage() {
    return (
        <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', padding: '100px 0' }}><div className="spinner"></div></div>}>
            <SuccessContent />
        </Suspense>
    );
}
