'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useCart } from '@/lib/cart';
import Button from '@/components/Button';
import ProductCard from '@/components/ProductCard';

interface ProductDetail {
    id: string;
    name: string;
    description: string;
    price: number;
    images: string[];
    category?: {
        name: string;
        slug: string;
    };
    specifications?: Record<string, string>;
    isFeatured: boolean;
    isComingSoon?: boolean;
}

interface RelatedProduct {
    id: string;
    name: string;
    price: number;
    images: string[];
    category?: {
        name: string;
        slug: string;
    };
    isFeatured: boolean;
    isComingSoon?: boolean;
}

export default function ProductDetailPage() {
    const params = useParams();
    const id = params?.id as string;
    const router = useRouter();
    const { addItem } = useCart();

    const [product, setProduct] = useState<ProductDetail | null>(null);
    const [relatedProducts, setRelatedProducts] = useState<RelatedProduct[]>([]);
    const [activeImage, setActiveImage] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;
        const fetchProductData = async () => {
            setIsLoading(true);
            try {
                const res = await fetch(`/api/products/${id}`);
                if (!res.ok) throw new Error('Product not found');
                const data = await res.json();
                setProduct(data);

                if (data.category?.slug) {
                    const relatedRes = await fetch(`/api/products?category=${data.category.slug}`);
                    if (relatedRes.ok) {
                        const related = await relatedRes.json();
                        setRelatedProducts(related.filter((p: { id: string }) => p.id !== id).slice(0, 4));
                    }
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Unknown error');
            } finally {
                setIsLoading(false);
            }
        };
        fetchProductData();
    }, [id]);

    if (isLoading) {
        return <div style={{ display: 'flex', justifyContent: 'center', padding: '100px 0' }}><div className="spinner"></div></div>;
    }

    if (error || !product) {
        return (
            <div className="container text-center" style={{ padding: '100px 0' }}>
                <h2 style={{ color: 'var(--color-primary)' }}>{error || 'Product not found'}</h2>
            </div>
        );
    }

    const handleAddToCart = () => {
        addItem({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.images[0] || '/placeholder.jpg'
        });
        router.push('/cart');
    };

    return (
        <div className="container section animate-fade-in">
            <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-3xl)', marginBottom: 'var(--spacing-3xl)' }}>
                {/* Image Gallery */}
                <div>
                    <div className="glass-card" style={{ position: 'relative', height: '500px', marginBottom: 'var(--spacing-md)' }}>
                        <Image src={product.images[activeImage] || '/placeholder.jpg'} alt={product.name} fill style={{ objectFit: 'cover', borderRadius: 'var(--radius-lg)' }} />
                    </div>
                    <div style={{ display: 'flex', gap: 'var(--spacing-sm)', overflowX: 'auto', paddingBottom: 'var(--spacing-xs)' }}>
                        {product.images.map((img, idx) => (
                            <div key={idx} onClick={() => setActiveImage(idx)} style={{
                                position: 'relative', width: '80px', height: '80px', flexShrink: 0, cursor: 'pointer',
                                borderRadius: 'var(--radius-md)', overflow: 'hidden',
                                border: activeImage === idx ? '2px solid var(--color-primary)' : '2px solid transparent'
                            }}>
                                <Image src={img} alt={`Thumbnail ${idx}`} fill style={{ objectFit: 'cover' }} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Details */}
                <div>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: 'var(--spacing-sm)' }}>{product.name}</h1>
                    <p style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--color-primary)', marginBottom: 'var(--spacing-lg)' }}>
                        {product.isComingSoon || product.price === 0 ? 'Coming Soon' : `₹${product.price.toLocaleString('en-IN')}`}
                    </p>
                    <p style={{ color: 'var(--color-text-light)', lineHeight: 1.8, marginBottom: 'var(--spacing-xl)' }}>
                        {product.description}
                    </p>

                    {product.specifications && Object.keys(product.specifications).length > 0 && (
                        <div className="glass-card" style={{ padding: 'var(--spacing-md)', marginBottom: 'var(--spacing-xl)' }}>
                            <h3 style={{ marginBottom: 'var(--spacing-md)' }}>Details</h3>
                            <div style={{ display: 'grid', gap: 'var(--spacing-xs)' }}>
                                {Object.entries(product.specifications).map(([key, value]) => (
                                    <div key={key} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border)', paddingBottom: '4px' }}>
                                        <span style={{ color: 'var(--color-text-light)' }}>{key}:</span>
                                        <span style={{ fontWeight: 500 }}>{String(value)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <Button 
                        size="lg" 
                        style={{ width: '100%' }} 
                        onClick={handleAddToCart}
                        disabled={product.isComingSoon}
                    >
                        {product.isComingSoon ? 'Coming Soon' : 'Add to Cart'}
                    </Button>
                </div>
            </div>

            {/* Related Products */}
            {relatedProducts.length > 0 && (
                <div>
                    <h2 style={{ fontSize: '2rem', marginBottom: 'var(--spacing-xl)', textAlign: 'center' }}>You May Also Like</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 'var(--spacing-lg)' }}>
                        {relatedProducts.map(p => (
                            <ProductCard 
                                key={p.id} 
                                id={p.id} 
                                name={p.name} 
                                price={p.price} 
                                image={p.images[0] || '/placeholder.jpg'} 
                                isComingSoon={p.isComingSoon}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
