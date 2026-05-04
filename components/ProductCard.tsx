'use client';

import Link from 'next/link';
import Image from 'next/image';
import Button from './Button';

interface ProductCardProps {
    id: string;
    name: string;
    price: number;
    image: string;
    category?: string;
    isComingSoon?: boolean;
    isFeatured?: boolean;
}

export default function ProductCard({ id, name, price, image, category, isComingSoon, isFeatured }: ProductCardProps) {
    return (
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', opacity: isComingSoon ? 0.8 : 1 }}>
            <Link href={`/products/${id}`} style={{ position: 'relative', width: '100%', height: '300px', display: 'block', overflow: 'hidden' }}>
                <Image
                    src={image}
                    alt={name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    style={{ objectFit: 'cover', transition: 'transform var(--transition-slow)' }}
                    className="product-image"
                />
                <div style={{ position: 'absolute', top: '1rem', right: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', zIndex: 2 }}>
                    {isFeatured && (
                        <div style={{
                            background: '#fbbf24',
                            color: 'var(--color-background)',
                            padding: '0.25rem 0.5rem',
                            borderRadius: 'var(--radius-sm)',
                            fontSize: '0.75rem',
                            fontWeight: 800,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            boxShadow: '0 4px 12px rgba(251, 191, 36, 0.3)'
                        }}>
                            ⭐ FEATURED
                        </div>
                    )}
                    {isComingSoon && (
                        <div style={{
                            background: 'var(--color-primary)',
                            color: 'var(--color-background)',
                            padding: '0.25rem 0.75rem',
                            borderRadius: 'var(--radius-full)',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            textTransform: 'uppercase'
                        }}>
                            Coming Soon
                        </div>
                    )}
                </div>
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(to top, rgba(31,4,21,0.8) 0%, transparent 50%)',
                    opacity: 0.6,
                }}></div>
            </Link>

            <div style={{ padding: 'var(--spacing-md)', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                {category && (
                    <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-primary)', marginBottom: 'var(--spacing-xs)', fontWeight: 600 }}>
                        {category}
                    </span>
                )}

                <Link href={`/products/${id}`} style={{ textDecoration: 'none' }}>
                    <h3 style={{ fontSize: '1.25rem', marginBottom: 'var(--spacing-sm)', color: 'var(--color-text)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {name}
                    </h3>
                </Link>

                <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span className="text-gradient" style={{ fontSize: '1rem', fontWeight: 700 }}>
                        {isComingSoon ? 'Coming Soon' : (price === 0 ? (isFeatured ? 'Contact us for more details' : 'Coming Soon') : `₹${price.toLocaleString('en-IN')}`)}
                    </span>
                    <Link href={`/products/${id}`}>
                        <Button variant="outline" size="sm">{isComingSoon ? 'Details' : 'View'}</Button>
                    </Link>
                </div>
            </div>
            <style jsx>{`
                .glass-card:hover .product-image {
                    transform: scale(1.05);
                }
            `}</style>
        </div>
    );
}
