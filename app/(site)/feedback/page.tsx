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
    likes: number;
    dislikes: number;
    sentiment?: string;
}

export default function FeedbackPage() {
    const [feedbackList, setFeedbackList] = useState<Feedback[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
    const [rating, setRating] = useState(5);
    const [sentiment, setSentiment] = useState<'LIKE' | 'DISLIKE' | null>(null);
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
                        if (blob) {
                            resolve(blob);
                        } else {
                            reject(new Error('Canvas to Blob failed'));
                        }
                    }, 'image/jpeg', 0.8);
                };
            };
            reader.onerror = (error) => reject(error);
        });
    };

    useEffect(() => {
        fetchFeedback();
    }, []);

    const handleReact = async (id: string, type: 'like' | 'dislike') => {
        const storageKey = `feedback_react_${id}`;
        const prevType = localStorage.getItem(storageKey) as 'like' | 'dislike' | null;

        // If clicking the same reaction, do nothing or "un-react"
        // For simplicity, let's say "un-react" is not supported for now as per "only 1"
        if (prevType === type) return;

        try {
            // Optimistic update
            setFeedbackList(prev => prev.map(f => {
                if (f.id === id) {
                    let newLikes = f.likes;
                    let newDislikes = f.dislikes;
                    
                    if (type === 'like') newLikes++;
                    else if (type === 'dislike') newDislikes++;

                    if (prevType === 'like') newLikes--;
                    else if (prevType === 'dislike') newDislikes--;

                    return { ...f, likes: newLikes, dislikes: newDislikes };
                }
                return f;
            }));

            const res = await fetch('/api/feedback/react', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, type, prevType })
            });

            if (res.ok) {
                localStorage.setItem(storageKey, type);
            } else {
                // Rollback if failed
                fetchFeedback();
            }
        } catch (err) {
            console.error('Reaction failed', err);
            fetchFeedback();
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setStatus(null);

        const form = e.currentTarget;
        const formData = new FormData();
        
        // Add basic fields
        formData.append('name', (form.elements.namedItem('name') as HTMLInputElement).value);
        formData.append('rating', rating.toString());
        formData.append('comment', (form.elements.namedItem('comment') as HTMLTextAreaElement).value);
        if (sentiment) formData.append('sentiment', sentiment);

        try {
            // Compress images if any
            const files = fileInputRef.current?.files;
            if (files && files.length > 0) {
                setStatus({ type: 'success', message: 'Compressing images...' });
                for (let i = 0; i < files.length; i++) {
                    const compressedBlob = await compressImage(files[i]);
                    formData.append('images', compressedBlob, `image_${i}.jpg`);
                }
            }
            
            setStatus(null); // Clear compression message
            const res = await fetch('/api/feedback', {
                method: 'POST',
                body: formData,
            });

            if (res.ok) {
                setStatus({ type: 'success', message: 'Thank you for your feedback!' });
                form.reset();
                setRating(5);
                setSentiment(null);
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
                                <label style={{ fontSize: '0.875rem', color: 'var(--color-text-light)'}}>Name</label>
                                <input type="text" name="name" placeholder="Enter your name" required style={inputStyle} autoComplete="name" />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                <label style={{ fontSize: '0.875rem', color: 'var(--color-text-light)', }}>Rating</label>
                                <div style={{ display: 'flex', gap: '3px', padding: '0.5rem 0',  }}>
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

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xs)' }}>
                            <label style={{ fontSize: '0.875rem', color: 'var(--color-text-light)' }}>Would you recommend us?</label>
                            <div style={{ display: 'flex', gap: 'var(--spacing-md)', marginTop: '4px' }}>
                                <button 
                                    type="button" 
                                    onClick={() => setSentiment(sentiment === 'LIKE' ? null : 'LIKE')}
                                    style={{ 
                                        ...sentimentButtonStyle, 
                                        borderColor: sentiment === 'LIKE' ? 'var(--color-primary)' : 'rgba(255,255,255,0.1)',
                                        color: sentiment === 'LIKE' ? 'var(--color-primary)' : 'white'
                                    }}
                                >
                                    👍 Recommended
                                </button>
                                <button 
                                    type="button" 
                                    onClick={() => setSentiment(sentiment === 'DISLIKE' ? null : 'DISLIKE')}
                                    style={{ 
                                        ...sentimentButtonStyle, 
                                        borderColor: sentiment === 'DISLIKE' ? '#ef4444' : 'rgba(255,255,255,0.1)',
                                        color: sentiment === 'DISLIKE' ? '#ef4444' : 'white'
                                    }}
                                >
                                    👎 Not Recommended
                                </button>
                            </div>
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
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'var(--spacing-md)', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 'var(--spacing-sm)' }}>
                                        <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
                                            <button 
                                                onClick={() => handleReact(item.id, 'like')}
                                                className={`react-btn ${typeof window !== 'undefined' && localStorage.getItem(`feedback_react_${item.id}`) === 'like' ? 'active-like' : ''}`}
                                            >
                                                👍 {item.likes}
                                            </button>
                                            <button 
                                                onClick={() => handleReact(item.id, 'dislike')}
                                                className={`react-btn ${typeof window !== 'undefined' && localStorage.getItem(`feedback_react_${item.id}`) === 'dislike' ? 'active-dislike' : ''}`}
                                            >
                                                👎 {item.dislikes}
                                            </button>
                                        </div>
                                        {item.sentiment && (
                                            <span style={{ fontSize: '0.75rem', color: item.sentiment === 'LIKE' ? 'var(--color-primary)' : '#ef4444', opacity: 0.8, fontStyle: 'italic' }}>
                                                {item.sentiment === 'LIKE' ? 'Highly Recommended' : 'Not Recommended'}
                                            </span>
                                        )}
                                    </div>
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
                .react-btn {
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 20px;
                    padding: 0.4rem 0.8rem;
                    color: var(--color-text-light);
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    font-size: 0.875rem;
                    transition: all 0.2s;
                }
                .react-btn:hover {
                    background: rgba(255, 255, 255, 0.1);
                    border-color: rgba(255, 255, 255, 0.3);
                }
                .react-btn.active-like {
                    color: var(--color-primary);
                    border-color: var(--color-primary);
                    background: rgba(var(--color-primary-rgb), 0.1);
                }
                .react-btn.active-dislike {
                    color: #ef4444;
                    border-color: #ef4444;
                    background: rgba(239, 68, 68, 0.1);
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

const sentimentButtonStyle = {
    padding: '0.6rem 1.25rem',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid',
    borderRadius: 'var(--radius-md)',
    cursor: 'pointer',
    fontSize: '0.875rem',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.2s'
};
