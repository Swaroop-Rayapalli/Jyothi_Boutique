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
}

export default function ProductCard({ id, name, price, image, category }: ProductCardProps) {
    return (
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
            <Link href={`/products/${id}`} style={{ position: 'relative', width: '100%', height: '300px', display: 'block', overflow: 'hidden' }}>
                <Image
                    src={image}
                    alt={name}
                    fill
                    style={{ objectFit: 'cover', transition: 'transform var(--transition-slow)' }}
                    className="product-image"
                />
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
                    <span className="text-gradient" style={{ fontSize: '1.25rem', fontWeight: 700 }}>
                        ₹{price.toLocaleString('en-IN')}
                    </span>
                    <Link href={`/products/${id}`}>
                        <Button variant="outline" size="sm">View</Button>
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
