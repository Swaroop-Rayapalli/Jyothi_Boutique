'use client';

import Image from 'next/image';

export default function AboutPage() {
    return (
        <div className="animate-fade-in">
            {/* Hero Section */}
            <section style={{ position: 'relative', minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'url(/images/about-hero.png) center/cover', zIndex: -1, opacity: 0.5 }}></div>
                <div className="container text-center relative z-10">
                    <h1 style={{ fontSize: '4rem', marginBottom: 'var(--spacing-md)', textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>Our Heritage</h1>
                    <p style={{ fontSize: '1.5rem', color: 'var(--color-primary)', textShadow: '0 2px 5px rgba(0,0,0,0.8)' }}>Weaving Dreams Since 2010</p>
                </div>
            </section>

            {/* Story Section */}
            <section className="section">
                <div className="container">
                    <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
                        <h2 style={{ fontSize: '2.5rem', marginBottom: 'var(--spacing-xl)' }} className="text-gradient">The Jyothi Boutique Story</h2>
                        <p style={{ fontSize: '1.25rem', color: 'var(--color-text-light)', lineHeight: 1.8, marginBottom: 'var(--spacing-lg)' }}>
                            Jyothi Boutique is more than just a fashion destination; it&apos;s a celebration of traditional Indian craftsmanship and the timeless art of Thanjavur Paintings and custom embroidery. Founded with a passion for intricate detailing and a deep respect for heritage textiles, we have curated a collection that embodies elegance and sophistication.
                        </p>
                        <p style={{ fontSize: '1.25rem', color: 'var(--color-text-light)', lineHeight: 1.8 }}>
                            Every piece in our collection tells a story of skilled artisans, meticulous design, and an unwavering commitment to quality. From the rich hues of our Thanjavur Paintings to the exquisite detailing of our custom embroidery and hand-painted luxury, we bring you the finest in hand-crafted artistry.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}
