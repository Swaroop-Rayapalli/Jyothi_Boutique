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

interface Feedback {
  id: string;
  name: string;
  rating: number;
  comment: string;
  images: string[];
  date: string;
}

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingFeedback, setIsLoadingFeedback] = useState(true);

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

    const fetchFeedback = async () => {
      try {
        const res = await fetch('/api/feedback');
        if (res.ok) {
          const data = await res.json();
          setFeedbacks(data.slice(0, 3));
        }
      } catch (err) {
        console.error('Failed to fetch feedback', err);
      } finally {
        setIsLoadingFeedback(false);
      }
    };

    fetchFeatured();
    fetchFeedback();
  }, []);

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        paddingTop: '8rem',
        overflow: 'hidden',
        background: 'linear-gradient(to right, var(--color-background) 0%, rgba(31, 4, 21, 0.8) 100%)'
      }}>
        <div 
          className="hero-image"
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            width: '100%',
            opacity: 0.4,
            zIndex: 0,
            maskImage: 'linear-gradient(to left, black, transparent)',
            WebkitMaskImage: 'linear-gradient(to left, black, transparent)'
          }}
        >
          <div style={{
            width: '100%',
            height: '100%',
            background: 'url(/images/hero-model.png) center right/contain no-repeat',
          }}></div>
        </div>

        <div className="container relative z-10">
          <div className="hero-content">
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

            <h1 style={{ marginBottom: 'var(--spacing-lg)', lineHeight: 1.1 }}>
              Timeless Artistry <br />
              <span className="text-gradient">Woven in Thread</span>
            </h1>

            <p style={{
              fontSize: 'clamp(1rem, 4vw, 1.25rem)',
              color: 'var(--color-text-light)',
              marginBottom: 'var(--spacing-2xl)',
              lineHeight: 1.8,
              maxWidth: '500px'
            }}>
              Discover exclusive, handcrafted maggam work blouses, sarees, and lehengas tailored to perfection. Experience the pinnacle of traditional Indian couture.
            </p>

            <div style={{ display: 'flex', gap: 'var(--spacing-md)', flexWrap: 'wrap' }}>
              <Link href="/products">
                <Button size="lg" variant="primary">Explore Collection</Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="secondary">Book Consultation</Button>
              </Link>
            </div>
          </div>
        </div>

        <style jsx>{`
          .hero-content {
            max-width: 600px;
          }
          @media (min-width: 1024px) {
            .hero-image {
              width: 60% !important;
              opacity: 0.8 !important;
            }
          }
          @media (max-width: 640px) {
            .hero-content {
              text-align: center;
              margin: 0 auto;
            }
            .hero-content div {
              justify-content: center;
            }
          }
        `}</style>
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
              { name: 'Kundan Work', image: '/products/emerald-saree.jpeg', link: '/products?category=kundan' },
              { name: 'Cutwork', image: '/products/lehenga-1.png', link: '/products?category=cutwork' },
              { name: 'Thanjavur Paintings', image: '/products/saree-2.png', link: '/products?category=thanjavur' },
              { name: 'Handloom Silks', image: '/products/saree-1.png', link: '/products?category=handloom' },
              { name: 'Complete Bridal Sets', image: '/products/bridal-lehenga.jpg', link: '/products?category=bridal' },
              { name: 'Custom Embroidery', image: '/products/pastel-blouse.jpg', link: '/products?category=embroidery' }
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

      {/* Client Feedback Section */}
      <section className="section" style={{ background: 'var(--color-surface)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 'var(--spacing-2xl)' }}>
            <div>
              <h2 style={{ fontSize: '3rem', marginBottom: 'var(--spacing-xs)' }}>Client Stories</h2>
              <p style={{ color: 'var(--color-primary)', fontSize: '1.125rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Experiences Shared with Us</p>
            </div>
            <Link href="/feedback" style={{ color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>
              Read All <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </Link>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: 'var(--spacing-xl)'
          }}>
            {isLoadingFeedback ? (
              [...Array(2)].map((_, i) => (
                <div key={i} className="glass-card" style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div className="spinner"></div>
                </div>
              ))
            ) : feedbacks.length > 0 ? (
              feedbacks.map((item) => (
                <div key={item.id} className="glass-card" style={{ padding: 'var(--spacing-lg)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--spacing-sm)' }}>
                    <h3 style={{ fontSize: '1.25rem', color: 'white' }}>{item.name}</h3>
                    <div style={{ display: 'flex', gap: '2px', color: 'var(--color-primary)' }}>
                      {[...Array(5)].map((_, i) => (
                        <span key={i} style={{ opacity: i < item.rating ? 1 : 0.1 }}>★</span>
                      ))}
                    </div>
                  </div>
                  <p style={{ color: 'var(--color-text-light)', fontStyle: 'italic', lineHeight: 1.6 }}>
                    "{item.comment.length > 150 ? item.comment.substring(0, 150) + '...' : item.comment}"
                  </p>
                  {item.images && item.images.length > 0 && (
                    <div style={{ marginTop: 'var(--spacing-md)', display: 'flex', gap: '8px' }}>
                      {item.images.slice(0, 2).map((img, idx) => (
                        <div key={idx} style={{ 
                          width: '60px', 
                          height: '60px', 
                          borderRadius: 'var(--radius-sm)', 
                          overflow: 'hidden',
                          border: '1px solid var(--color-border)'
                        }}>
                          <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', gridColumn: '1 / -1', padding: 'var(--spacing-xl)', color: 'var(--color-text-light)' }}>
                Read what our clients have to say about our work.
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
