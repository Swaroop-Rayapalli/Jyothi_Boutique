'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/lib/cart';
import Button from '@/components/Button';

export default function CartPage() {
    const { items, removeItem, updateQuantity, totalPrice, totalItems } = useCart();

    if (items.length === 0) {
        return (
            <div className="container text-center animate-fade-in" style={{ padding: '100px 0' }}>
                <div style={{ fontSize: '5rem', marginBottom: 'var(--spacing-md)' }}>🛍️</div>
                <h2 style={{ marginBottom: 'var(--spacing-md)' }}>Your Cart is Empty</h2>
                <p style={{ color: 'var(--color-text-light)', marginBottom: 'var(--spacing-xl)' }}>
                    Looks like you haven&apos;t added any artistic masterpieces yet.
                </p>
                <Link href="/products">
                    <Button variant="primary" size="lg">Start Shopping</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="container section animate-fade-in">
            <h1 className="text-gradient" style={{ marginBottom: 'var(--spacing-2xl)' }}>Your Shopping Cart</h1>

            <div className="grid" style={{ gridTemplateColumns: '1fr 350px', gap: 'var(--spacing-3xl)' }}>
                {/* Cart Items */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
                    {items.map((item) => (
                        <div key={item.id} className="glass-card" style={{ display: 'grid', gridTemplateColumns: '120px 1fr auto', gap: 'var(--spacing-lg)', alignItems: 'center', padding: 'var(--spacing-sm)' }}>
                            <div style={{ position: 'relative', width: '120px', height: '120px', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
                                <Image src={item.image} alt={item.name} fill sizes="120px" style={{ objectFit: 'cover' }} />
                            </div>

                            <div>
                                <h3 style={{ fontSize: '1.25rem', marginBottom: 'var(--spacing-xs)' }}>{item.name}</h3>
                                <p style={{ color: 'var(--color-primary)', fontWeight: 600, marginBottom: 'var(--spacing-md)' }}>
                                    {item.price.toLocaleString('en-IN')}
                                </p>

                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        border: '1px solid var(--color-border)',
                                        borderRadius: 'var(--radius-sm)',
                                        overflow: 'hidden'
                                    }}>
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                            style={{ padding: '0.25rem 0.75rem', background: 'none', border: 'none', cursor: 'pointer', borderRight: '1px solid var(--color-border)', color: 'white' }}
                                        >
                                            -
                                        </button>
                                        <span style={{ padding: '0.25rem 1rem', fontWeight: 500 }}>{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                            style={{ padding: '0.25rem 0.75rem', background: 'none', border: 'none', cursor: 'pointer', borderLeft: '1px solid var(--color-border)', color: 'white' }}
                                        >
                                            +
                                        </button>
                                    </div>
                                    <button
                                        onClick={() => removeItem(item.id)}
                                        style={{ color: 'var(--color-error)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.875rem', textDecoration: 'underline' }}
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>

                            <div style={{ textAlign: 'right', paddingRight: 'var(--spacing-md)' }}>
                                <p style={{ fontSize: '1.25rem', fontWeight: 700 }}>
                                    {(item.price * item.quantity).toLocaleString('en-IN')}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Order Summary */}
                <div style={{ position: 'sticky', top: 'var(--spacing-2xl)' }}>
                    <div className="glass-card" style={{ padding: 'var(--spacing-xl)' }}>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: 'var(--spacing-lg)' }}>Order Summary</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-xl)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: 'var(--color-text-light)' }}>Items ({totalItems})</span>
                                <span>{totalPrice.toLocaleString('en-IN')}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: 'var(--color-text-light)' }}>Shipping</span>
                                <span style={{ color: 'var(--color-success)', fontWeight: 600 }}>FREE</span>
                            </div>
                            <div style={{ marginTop: 'var(--spacing-md)', paddingTop: 'var(--spacing-md)', borderTop: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', fontWeight: 700 }}>
                                <span>Total Amount</span>
                                <span className="text-gradient">{totalPrice.toLocaleString('en-IN')}</span>
                            </div>
                        </div>
                        <Link href="/checkout">
                            <Button variant="primary" size="lg" style={{ width: '100%' }}>Proceed to Checkout</Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
