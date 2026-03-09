'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Button from '@/components/Button';
import ProductCard from '@/components/ProductCard';

interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
  category?: {
    name: string;
  };
}

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await fetch('/api/products?featured=true');
        if (res.ok) {
          const data = await res.json();
          setFeaturedProducts(data.slice(0, 4));
        }
      } catch (err) {
        console.error('Failed to fetch featured products', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section style={{
        position: 'relative',
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        paddingTop: '6rem',
        overflow: 'hidden',
        background: 'linear-gradient(to right, var(--color-background) 0%, rgba(31, 4, 21, 0.8) 100%)'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          width: '60%',
          background: 'url(/images/hero-model.png) center/cover no-repeat',
          zIndex: -1,
          opacity: 0.8,
          maskImage: 'linear-gradient(to left, black, transparent)'
        }}></div>

        <div className="container relative z-10">
          <div style={{ maxWidth: '600px' }}>
            <span style={{
              display: 'inline-block',
              padding: '0.25rem 1rem',
              background: 'rgba(197, 160, 33, 0.1)',
              color: 'var(--color-primary)',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.875rem',
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              marginBottom: 'var(--spacing-lg)'
            }}>
              Premium Collection 2026
            </span>

            <h1 style={{ fontSize: '4.5rem', marginBottom: 'var(--spacing-lg)', lineHeight: 1.1 }}>
              Timeless Artistry <br />
              <span className="text-gradient">Woven in Thread</span>
            </h1>

            <p style={{
              fontSize: '1.25rem',
              color: 'var(--color-text-light)',
              marginBottom: 'var(--spacing-2xl)',
              lineHeight: 1.8
            }}>
              Discover exclusive, handcrafted maggam work blouses, sarees, and lehengas tailored to perfection. Experience the pinnacle of traditional Indian couture.
            </p>

            <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
              <Link href="/products">
                <Button size="lg" variant="primary">Explore Collection</Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="secondary">Book Consultation</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="section" style={{ background: 'var(--color-surface)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-3xl)' }}>
            <h2 style={{ fontSize: '3rem', marginBottom: 'var(--spacing-sm)' }}>Exquisite Craftsmanship</h2>
            <p style={{ color: 'var(--color-primary)', fontSize: '1.125rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Our Collections</p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 'var(--spacing-xl)'
          }}>
            {[
              { name: 'Zardosi Work', image: '/products/blouse-1.png', link: '/products?category=zardosi' },
              { name: 'Aari Work', image: '/products/blouse-2.png', link: '/products?category=aari' },
              { name: 'Kundan Work', image: '/products/saree-1.png', link: '/products?category=kundan' },
              { name: 'Cutwork', image: '/products/lehenga-1.png', link: '/products?category=cutwork' },
              { name: 'Thanjavur Paintings', image: '/products/saree-2.png', link: '/products?category=thanjavur' }
            ].map((category, index) => (
              <Link key={index} href={category.link} className="glass-card" style={{
                position: 'relative',
                height: '400px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                textDecoration: 'none'
              }}>
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: `url(${category.image}) center/cover`,
                  transition: 'transform var(--transition-slow)',
                  zIndex: 0
                }} className="category-bg"></div>
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(31,4,21,0.9), transparent)',
                  zIndex: 1
                }}></div>
                <h3 style={{
                  position: 'relative',
                  zIndex: 2,
                  fontSize: '2rem',
                  color: 'white',
                  textAlign: 'center',
                  textShadow: '0 2px 10px rgba(0,0,0,0.5)'
                }}>{category.name}</h3>
                <style jsx>{`
                                    .glass-card:hover .category-bg { transform: scale(1.1); }
                                `}</style>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 'var(--spacing-2xl)' }}>
            <div>
              <h2 style={{ fontSize: '3rem', marginBottom: 'var(--spacing-xs)' }}>Featured Pieces</h2>
              <p style={{ color: 'var(--color-primary)', fontSize: '1.125rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Handpicked for You</p>
            </div>
            <Link href="/products" style={{ color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>
              View All <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </Link>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: 'var(--spacing-xl)'
          }}>
            {isLoading ? (
              [...Array(4)].map((_, i) => (
                <div key={i} className="glass-card" style={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div className="spinner"></div>
                </div>
              ))
            ) : featuredProducts.length > 0 ? (
              featuredProducts.map(product => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  price={product.price}
                  image={product.images[0] || '/placeholder.jpg'}
                  category={product.category?.name}
                />
              ))
            ) : (
              <div style={{ textAlign: 'center', gridColumn: '1 / -1', padding: 'var(--spacing-xl)', color: 'var(--color-text-light)' }}>
                Discover our latest handcrafted collections.
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
