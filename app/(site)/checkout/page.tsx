'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/cart';
import Button from '@/components/Button';

export default function CheckoutPage() {
    const router = useRouter();
    const { items, totalPrice, clearCart } = useCart();
    const [formData, setFormData] = useState({
        name: '', email: '', phone: '', address: '', city: '', pincode: '',
    });
    const [isProcessing, setIsProcessing] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        if (items.length === 0 && !isProcessing) {
            router.push('/products');
        }
    }, [items.length, isProcessing, router]);

    if (!isMounted || (items.length === 0 && !isProcessing)) {
        return <div style={{ display: 'flex', justifyContent: 'center', minHeight: '60vh', alignItems: 'center' }}><div className="spinner"></div></div>;
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCheckout = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);
        try {
            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    customer: { name: formData.name, email: formData.email, phone: formData.phone },
                    items: items.map(i => ({ productId: i.id, quantity: i.quantity, price: i.price })),
                    totalAmount: totalPrice,
                    deliveryAddress: `${formData.address}, ${formData.city} - ${formData.pincode}`,
                }),
            });
            if (res.ok) {
                const data = await res.json();
                clearCart();
                router.push(`/checkout/success?orderId=${data.id}`);
            } else throw new Error('Failed to place order');
        } catch (err) {
            alert(err instanceof Error ? err.message : 'Unknown error');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="container section animate-fade-in">
            <h1 className="text-gradient" style={{ marginBottom: 'var(--spacing-2xl)' }}>Checkout</h1>
            <div className="checkout-grid" style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 500px), 1fr))', 
                gap: 'var(--spacing-3xl)' 
            }}>
                {/* Form */}
                <form id="checkout-form" onSubmit={handleCheckout} className="glass-card" style={{ padding: 'var(--spacing-xl)' }}>
                    <h2 style={{ marginBottom: 'var(--spacing-lg)' }}>Shipping Information</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                        <input type="text" name="name" placeholder="Full Name" required value={formData.name} onChange={handleChange} style={inputStyle} />
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--spacing-md)' }}>
                            <input type="email" name="email" placeholder="Email" required value={formData.email} onChange={handleChange} style={inputStyle} />
                            <input type="tel" name="phone" placeholder="Phone" required value={formData.phone} onChange={handleChange} style={inputStyle} />
                        </div>
                        <textarea name="address" placeholder="Address" required value={formData.address} onChange={handleChange} style={{ ...inputStyle, minHeight: '100px' }} />
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--spacing-md)' }}>
                            <input type="text" name="city" placeholder="City" required value={formData.city} onChange={handleChange} style={inputStyle} />
                            <input type="text" name="pincode" placeholder="Pincode" required value={formData.pincode} onChange={handleChange} style={inputStyle} />
                        </div>
                    </div>
                </form>

                {/* Summary */}
                <div>
                    <div className="glass-card" style={{ position: 'sticky', top: 'var(--spacing-2xl)', padding: 'var(--spacing-xl)' }}>
                        <h2 style={{ marginBottom: 'var(--spacing-lg)' }}>Order Review</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-lg)' }}>
                            {items.map(item => (
                                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                                    <span style={{ color: 'var(--color-text-light)' }}>{item.name} x {item.quantity}</span>
                                    <span>{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                                </div>
                            ))}
                            <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 'var(--spacing-sm)', display: 'flex', justifyContent: 'space-between', fontWeight: 700, marginTop: 'var(--spacing-sm)' }}>
                                <span>Total</span>
                                <span>{totalPrice.toLocaleString('en-IN')}</span>
                            </div>
                        </div>
                        <Button type="submit" form="checkout-form" variant="primary" size="lg" style={{ width: '100%' }} disabled={isProcessing}>
                            {isProcessing ? 'Processing...' : `Pay ${totalPrice.toLocaleString('en-IN')}`}
                        </Button>
                    </div>
                </div>
            </div>
            <style jsx>{`
                @media (max-width: 1024px) {
                    .checkout-grid {
                        grid-template-columns: 1fr !important;
                    }
                }
            `}</style>
        </div>
    );
}

const inputStyle = {
    padding: '0.75rem',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-sm)',
    color: 'white',
    width: '100%',
    fontFamily: 'inherit'
};
