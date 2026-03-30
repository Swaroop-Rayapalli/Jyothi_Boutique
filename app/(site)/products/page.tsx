'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from '@/components/ProductCard';

interface Product {
    id: string;
    name: string;
    price: number;
    images: string[];
    category?: {
        name: string;
    };
    isFeatured: boolean;
    isComingSoon?: boolean;
}

import { Suspense } from 'react';

function ProductsContent() {
    const searchParams = useSearchParams();
    const categoryParam = searchParams.get('category');

    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProducts = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const url = categoryParam ? `/api/products?category=${categoryParam}` : '/api/products';
                const res = await fetch(url);
                if (!res.ok) throw new Error('Failed to fetch products');
                const data = await res.json();
                setProducts(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Unknown error');
            } finally {
                setIsLoading(false);
            }
        };

        fetchProducts();
    }, [categoryParam]);

    return (
        <div className="container section animate-fade-in">
            <h1 className="text-gradient" style={{ marginBottom: 'var(--spacing-2xl)', textAlign: 'center' }}>
                {categoryParam ? `${categoryParam.charAt(0).toUpperCase() + categoryParam.slice(1)}` : 'Our Collections'}
            </h1>

            {isLoading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '100px 0' }}>
                    <div className="spinner"></div>
                </div>
            ) : error ? (
                <div style={{ textAlign: 'center', color: 'var(--color-error)' }}>{error}</div>
            ) : products.length === 0 ? (
                <div style={{ textAlign: 'center', color: 'var(--color-text-light)' }}>No products found.</div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--spacing-xl)' }}>
                    {products.map(product => (
                        <ProductCard
                            key={product.id}
                            id={product.id}
                            name={product.name}
                            price={product.price}
                            image={product.images[0] || '/placeholder.jpg'}
                            category={product.category?.name}
                            isComingSoon={product.isComingSoon}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default function ProductsPage() {
    return (
        <Suspense fallback={
            <div className="container section" style={{ display: 'flex', justifyContent: 'center', padding: '100px 0' }}>
                <div className="spinner"></div>
            </div>
        }>
            <ProductsContent />
        </Suspense>
    );
}
