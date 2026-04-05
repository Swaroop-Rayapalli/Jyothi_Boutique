'use client';

import { useState, useEffect, useRef } from 'react';
import Button from '@/components/Button';
import Image from 'next/image';

interface Feedback {
    id: string;
    name: string;
    rating: number;
    comment: string;
    images: string[];
    date: string;
}

export default function FeedbackPage() {
    const [feedbackList, setFeedbackList] = useState<Feedback[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
    const [rating, setRating] = useState(5);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const fetchFeedback = async () => {
        try {
            const res = await fetch('/api/feedback');
            if (res.ok) {
                const data = await res.json();
                setFeedbackList(data);
            }
        } catch (err) {
            console.error('Failed to fetch feedback', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchFeedback();
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setStatus(null);

        const form = e.currentTarget;
        const formData = new FormData(form);
        formData.set('rating', rating.toString());

        try {
            const res = await fetch('/api/feedback', {
                method: 'POST',
                body: formData,
            });

            if (res.ok) {
                setStatus({ type: 'success', message: 'Thank you for your feedback!' });
                form.reset();
                setRating(5);
                fetchFeedback();
            } else {
                throw new Error('Failed to submit feedback');
            }
        } catch (err) {
            setStatus({ type: 'error', message: 'Something went wrong. Please try again.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container section animate-fade-in" style={{ paddingTop: '8rem' }}>
            <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-3xl)' }}>
                <h1 className="text-gradient">Client Experiences</h1>
                <p style={{ color: 'var(--color-primary)', fontSize: '1.125rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 'var(--spacing-sm)' }}>
                    Your feedback inspires our artistry
                </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--spacing-3xl)', maxWidth: '1000px', margin: '0 auto' }}>
                {/* Feedback Form */}
                <div className="glass-card" style={{ padding: 'var(--spacing-xl)' }}>
                    <h2 style={{ fontSize: '1.75rem', marginBottom: 'var(--spacing-lg)', textAlign: 'center' }}>Share Your Experience</h2>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                        <div className="form-grid">
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xs)' }}>
                                <label style={{ fontSize: '0.875rem', color: 'var(--color-text-light)' }}>Name</label>
                                <input type="text" name="name" placeholder="Enter your name" required style={inputStyle} autoComplete="name" />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xs)' }}>
                                <label style={{ fontSize: '0.875rem', color: 'var(--color-text-light)', marginLeft: '70px' }}>Rating</label>
                                <div style={{ display: 'flex', gap: '3px', padding: '0.5rem 0', marginLeft: '70px' }}>
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setRating(star)}
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                cursor: 'pointer',
                                                color: star <= rating ? 'var(--color-primary)' : 'rgba(255,255,255,0.1)',
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

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xs)' }}>
                            <label style={{ fontSize: '0.875rem', color: 'var(--color-text-light)' }}>Comment</label>
                            <textarea name="comment" placeholder="Tell us about your experience..." required style={{ ...inputStyle, minHeight: '120px' }} />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xs)' }}>
                            <label style={{ fontSize: '0.875rem', color: 'var(--color-text-light)' }}>Attach Images (Optional)</label>
                            <input
                                type="file"
                                name="images"
                                multiple
                                accept="image/*"
                                ref={fileInputRef}
                                style={{
                                    ...inputStyle,
                                    padding: '0.75rem',
                                    cursor: 'pointer'
                                }}
                            />
                            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-light)', opacity: 0.6 }}>
                                You can select multiple images of your custom work.
                            </p>
                        </div>

                        <Button type="submit" variant="primary" size="lg" disabled={isSubmitting} style={{ marginTop: 'var(--spacing-md)' }}>
                            {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                        </Button>

                        {status && (
                            <p style={{
                                color: status.type === 'success' ? 'var(--color-success)' : 'var(--color-error)',
                                textAlign: 'center',
                                marginTop: 'var(--spacing-md)'
                            }}>
                                {status.message}
                            </p>
                        )}
                    </form>
                </div>

                {/* Feedback List */}
                <div style={{ marginTop: 'var(--spacing-xl)' }}>
                    <h2 style={{ fontSize: '2.25rem', marginBottom: 'var(--spacing-xl)', textAlign: 'center' }}>What Our Clients Say</h2>
                    
                    {isLoading ? (
                        <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--spacing-2xl)' }}>
                            <div className="spinner"></div>
                        </div>
                    ) : feedbackList.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
                            {feedbackList.map((item) => (
                                <div key={item.id} className="glass-card feedback-card" style={{ animation: 'fadeIn 0.5s ease forwards' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--spacing-sm)' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', flexWrap: 'wrap' }}>
                                                <h3 style={{ fontSize: '1.25rem', color: 'white', marginBottom: 0 }}>{item.name}</h3>
                                                <div style={{ display: 'flex', gap: '2px' }}>
                                                    {[...Array(5)].map((_, i) => (
                                                        <span key={i} style={{ color: i < item.rating ? 'var(--color-primary)' : 'rgba(255,255,255,0.1)', fontSize: '0.875rem' }}>
                                                            ★
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <span style={{ fontSize: '0.875rem', color: 'var(--color-text-light)', opacity: 0.5 }}>
                                            {new Date(item.date).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p style={{ color: 'var(--color-text-light)', lineHeight: 1.7, marginBottom: item.images.length > 0 ? 'var(--spacing-md)' : 0 }}>
                                        "{item.comment}"
                                    </p>
                                    
                                    {item.images.length > 0 && (
                                        <div style={{ 
                                            display: 'grid', 
                                            gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', 
                                            gap: 'var(--spacing-sm)',
                                            marginTop: 'var(--spacing-md)'
                                        }}>
                                            {item.images.map((img, idx) => (
                                                <div 
                                                    key={idx} 
                                                    onClick={() => setSelectedImage(img)}
                                                    className="feedback-image-thumb"
                                                    style={{ 
                                                        position: 'relative', 
                                                        height: '120px', 
                                                        borderRadius: 'var(--radius-sm)', 
                                                        overflow: 'hidden',
                                                        border: '1px solid var(--color-border)',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    <img 
                                                        src={img} 
                                                        alt={`Feedback image ${idx + 1}`} 
                                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                    />
                                                    <div className="thumb-overlay">
                                                        <span>🔍</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="glass-card" style={{ padding: 'var(--spacing-2xl)', textAlign: 'center' }}>
                            <p style={{ color: 'var(--color-text-light)' }}>Be the first to share your experience with us!</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Standard Modal (Not Full Screen) */}
            {selectedImage && (
                <div 
                    className="modal-overlay"
                    onClick={() => setSelectedImage(null)}
                >
                    <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close" onClick={() => setSelectedImage(null)}>×</button>
                        <img src={selectedImage} alt="Feedback View" className="modal-image" />
                    </div>
                </div>
            )}

            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .feedback-card {
                    padding: var(--spacing-lg);
                }
                .form-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: var(--spacing-md);
                }
                .feedback-image-thumb {
                    transition: transform 0.3s ease, border-color 0.3s ease;
                }
                .feedback-image-thumb:hover {
                    transform: scale(1.05);
                    border-color: var(--color-primary);
                }
                .thumb-overlay {
                    position: absolute;
                    inset: 0;
                    background: rgba(0,0,0,0.4);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    opacity: 0;
                    transition: opacity 0.3s ease;
                }
                .feedback-image-thumb:hover .thumb-overlay {
                    opacity: 1;
                }
                .modal-overlay {
                    position: fixed;
                    inset: 0;
                    background: rgba(0, 0, 0, 0.7);
                    z-index: 1000;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 1rem;
                }
                .modal-container {
                    position: relative;
                    background: #1e293b;
                    padding: 0.5rem;
                    border-radius: 0.5rem;
                    box-shadow: 0 10px 25px rgba(0,0,0,0.5);
                    max-width: 600px;
                    width: 95%;
                    display: flex;
                    flex-direction: column;
                }
                .modal-image {
                    width: 100%;
                    height: auto;
                    max-height: 70vh;
                    object-fit: contain;
                    border-radius: 0.25rem;
                }
                .modal-close {
                    position: absolute;
                    top: -35px;
                    right: 0;
                    background: none;
                    border: none;
                    color: white;
                    font-size: 2rem;
                    cursor: pointer;
                    line-height: 1;
                }
                @media (max-width: 640px) {
                    .feedback-card {
                        padding: var(--spacing-md);
                    }
                    .form-grid {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>
        </div>
    );
}

const inputStyle = {
    padding: '0.875rem',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-sm)',
    color: 'white',
    width: '100%',
    fontFamily: 'inherit',
    transition: 'border-color 0.2s',
    outline: 'none'
};
