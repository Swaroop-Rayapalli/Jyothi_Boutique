'use client';

import { useState, useEffect, useRef } from 'react';
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
  isComingSoon?: boolean;
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
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  
  // Feedback Form State
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackStatus, setFeedbackStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const feedbackFileRef = useRef<HTMLInputElement>(null);

  // Contact Form State
  const [isSubmittingContact, setIsSubmittingContact] = useState(false);
  const [contactStatus, setContactStatus] = useState<string | null>(null);

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

  const compressImage = (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new window.Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const max_size = 1200;
          if (width > height) {
            if (width > max_size) {
              height *= max_size / width;
              width = max_size;
            }
          } else {
            if (height > max_size) {
              width *= max_size / height;
              height = max_size;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          canvas.toBlob((blob) => {
            if (blob) resolve(blob);
            else reject(new Error('Canvas to Blob failed'));
          }, 'image/jpeg', 0.8);
        };
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleFeedbackSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmittingFeedback(true);
    setFeedbackStatus(null);
    const form = e.currentTarget;
    const formData = new FormData();
    formData.append('name', (form.elements.namedItem('name') as HTMLInputElement).value);
    formData.append('rating', feedbackRating.toString());
    formData.append('comment', (form.elements.namedItem('comment') as HTMLTextAreaElement).value);

    try {
      const files = feedbackFileRef.current?.files;
      if (files && files.length > 0) {
        setFeedbackStatus({ type: 'success', message: 'Compressing images...' });
        for (let i = 0; i < files.length; i++) {
          const compressedBlob = await compressImage(files[i]);
          formData.append('images', compressedBlob, `image_${i}.jpg`);
        }
      }
      setFeedbackStatus(null);
      const res = await fetch('/api/feedback', { method: 'POST', body: formData });
      if (res.ok) {
        setFeedbackStatus({ type: 'success', message: 'Thank you for your feedback!' });
        form.reset();
        setFeedbackRating(5);
        // Refresh feedback list
        const refreshedRes = await fetch('/api/feedback');
        if (refreshedRes.ok) {
          const data = await refreshedRes.json();
          setFeedbacks(data.slice(0, 3));
        }
      } else {
        const errorData = await res.json().catch(() => ({ error: 'Server error' }));
        console.error('[Feedback] Submission failed:', errorData);
        throw new Error(errorData.error || 'Failed to submit feedback');
      }
    } catch (err: any) {
      console.error('[Feedback] Catch Block Error:', err);
      setFeedbackStatus({ 
        type: 'error', 
        message: err.message || 'Something went wrong. Please try again.' 
      });
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  const handleContactSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmittingContact(true);
    setContactStatus(null);
    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    try {
      await fetch('/api/contact', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' },
      });
      const whatsappNumber = "917286916108";
      const message = `*Jyothi Boutique Contact Request*\n\n*Name:* ${data.name}\n*Email:* ${data.email}\n*Subject:* ${data.subject}\n\n*Message:*\n${data.message}`;
      const encodedMessage = encodeURIComponent(message);
      window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, '_blank');
      setContactStatus('SUCCESS');
      form.reset();
    } catch (e) {
      setContactStatus('ERROR');
    } finally {
      setIsSubmittingContact(false);
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="hero-section">
        <div 
          className="hero-image hidden md:block"
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
              Discover authentic Thanjavur Paintings and exquisite custom embroidery tailored to perfection. Experience the pinnacle of traditional Indian artistry.
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
          .hero-section {
            position: relative;
            min-height: 100vh;
            display: flex;
            align-items: center;
            overflow: hidden;
            background: linear-gradient(to right, var(--color-background) 0%, rgba(31, 4, 21, 0.8) 100%);
            padding-top: 8rem;
          }
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
            .hero-section {
              padding-top: 10rem;
              min-height: auto;
              display: block;
            }
            .hero-content {
              text-align: center;
              margin: 0 auto;
              width: 100%;
              padding: 0 1.25rem;
            }
            .hero-image {
              display: none !important;
            }
            .hero-content h1 {
              font-size: 2.15rem !important;
              margin-bottom: 1.25rem !important;
            }
            .hero-content p {
              margin-bottom: 1.75rem !important;
              font-size: 0.95rem !important;
            }
            .hero-content div {
              justify-content: center;
              gap: 0.75rem !important;
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
            gap: 'var(--spacing-xl)',
            justifyContent: 'center'
          }}>
            {[
              { name: 'Thanjavur Paintings', image: '/products/saree-2.png', link: '/products?category=thanjavur' },
              { name: 'Custom Embroidery', image: '/products/pastel-blouse.jpg', link: '/products?category=embroidery' },
              { name: 'Thanjavur Frame Paints', image: '/placeholder.jpg', link: '/products?'}
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
                <div style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
                  <h3 style={{
                    fontSize: '2rem',
                    color: 'white',
                    textShadow: '0 2px 10px rgba(0,0,0,0.5)',
                    marginBottom: '8px'
                  }}>{category.name}</h3>
                  {(
                    <span style={{
                      display: 'inline-block',
                      padding: '4px 12px',
                      background: 'var(--color-primary)',
                      color: 'var(--color-background)',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.875rem',
                      fontWeight: 700,
                      textTransform: 'uppercase'
                    }}>Explore More</span>
                  )}
                </div>
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
                  isComingSoon={product.isComingSoon}
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
                <div key={item.id} className="glass-card feedback-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--spacing-md)', flexWrap: 'wrap', marginBottom: 'var(--spacing-sm)' }}>
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
                        <div key={idx} 
                          onClick={() => setLightboxImage(img)}
                          style={{ 
                          width: '60px', 
                          height: '60px', 
                          borderRadius: 'var(--radius-sm)', 
                          overflow: 'hidden',
                          border: '1px solid var(--color-border)',
                          cursor: 'pointer'
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

      {/* Write Feedback Section */}
      <section id="write-feedback" className="section">
        <div className="container" style={{ maxWidth: '800px' }}>
          <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-2xl)' }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: 'var(--spacing-xs)' }}>Share Your Experience</h2>
            <p style={{ color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Your feedback inspires us</p>
          </div>
          <div className="glass-card" style={{ padding: 'var(--spacing-xl)' }}>
            <form onSubmit={handleFeedbackSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }} className="form-grid">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '0.875rem', color: 'var(--color-text-light)' }}>Name</label>
                  <input type="text" name="name" placeholder="Enter your name" required style={inputStyle} autoComplete="name" />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '0.875rem', color: 'var(--color-text-light)', paddingLeft: '2rem' }}>Rating</label>
                  <div style={{ display: 'flex', gap: '4px', paddingLeft: '2rem' }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFeedbackRating(star)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: star <= feedbackRating ? 'var(--color-primary)' : 'rgba(255,255,255,0.1)',
                          fontSize: '1.5rem',
                          transition: 'color 0.2s'
                        }}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.875rem', color: 'var(--color-text-light)' }}>Comment</label>
                <textarea name="comment" placeholder="Tell us about your experience..." required style={{ ...inputStyle, minHeight: '120px' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.875rem', color: 'var(--color-text-light)' }}>Attach Images (Optional)</label>
                <input type="file" name="images" multiple accept="image/*" ref={feedbackFileRef} style={{ ...inputStyle, padding: '0.75rem' }} />
              </div>
              <Button type="submit" variant="primary" size="lg" disabled={isSubmittingFeedback}>
                {isSubmittingFeedback ? 'Submitting...' : 'Submit Feedback'}
              </Button>
              {feedbackStatus && (
                <p style={{
                  color: feedbackStatus.type === 'success' ? 'var(--color-success)' : 'var(--color-error)',
                  textAlign: 'center',
                  marginTop: 'var(--spacing-sm)'
                }}>
                  {feedbackStatus.message}
                </p>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="section" style={{ background: 'var(--color-surface)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-3xl)' }}>
            <h2 style={{ fontSize: '3rem', marginBottom: 'var(--spacing-xs)' }}>Get in Touch</h2>
            <p style={{ color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>We'd love to hear from you</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--spacing-3xl)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xl)' }}>
              <div>
                <h3 style={{ fontSize: '1.75rem', marginBottom: 'var(--spacing-md)' }}>Visit Our Studio</h3>
                <p style={{ color: 'var(--color-text-light)', lineHeight: 1.8, fontSize: '1.1rem' }}>
                  INS Kalinga, Blue Marino<br />
                  Visakhapatnam, Andhra Pradesh 531163
                </p>
              </div>
              <div>
                <h3 style={{ fontSize: '1.75rem', marginBottom: 'var(--spacing-md)' }}>Contact Details</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
                  <p style={{ display: 'flex', gap: '12px', color: 'var(--color-text-light)' }}>
                    <span style={{ color: 'var(--color-primary)' }}>📞</span> +91 7286916108
                  </p>
                  <p style={{ display: 'flex', gap: '12px', color: 'var(--color-text-light)' }}>
                    <span style={{ color: 'var(--color-primary)' }}>✉️</span> jyothipaints15@gmail.com
                  </p>
                </div>
              </div>
              <div style={{ marginTop: 'var(--spacing-md)' }}>
                <Button variant="secondary" onClick={() => window.open('https://wa.me/917286916108', '_blank')}>
                  Chat on WhatsApp
                </Button>
              </div>
            </div>
            <div className="glass-card" style={{ padding: 'var(--spacing-xl)' }}>
              <form onSubmit={handleContactSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                <input type="text" name="name" placeholder="Your Name" required style={inputStyle} autoComplete="name" />
                <input type="email" name="email" placeholder="Your Email" required style={inputStyle} autoComplete="email" />
                <input type="text" name="subject" placeholder="Subject" required style={inputStyle} />
                <textarea name="message" placeholder="Your Message" required style={{ ...inputStyle, minHeight: '150px' }} />
                <Button type="submit" variant="primary" size="lg" disabled={isSubmittingContact}>
                  {isSubmittingContact ? 'Sending...' : 'Send Message'}
                </Button>
                {contactStatus === 'SUCCESS' && <p style={{ color: 'var(--color-success)', textAlign: 'center' }}>Message sent successfully!</p>}
                {contactStatus === 'ERROR' && <p style={{ color: 'var(--color-error)', textAlign: 'center' }}>Failed to send message. Try again later.</p>}
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {lightboxImage && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.9)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={() => setLightboxImage(null)}
        >
          <button 
            style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', color: 'white', fontSize: '3rem', cursor: 'pointer', lineHeight: 1 }}
            onClick={() => setLightboxImage(null)}
          >
            &times;
          </button>
          <img 
            src={lightboxImage} 
            style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} 
            alt="Client Story"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}

const inputStyle = {
  padding: '1rem',
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-sm)',
  color: 'white',
  width: '100%',
  fontFamily: 'inherit',
  outline: 'none',
  transition: 'border-color 0.2s'
};
