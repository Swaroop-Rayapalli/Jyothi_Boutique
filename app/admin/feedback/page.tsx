'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

interface Feedback {
    id: string;
    name: string;
    email?: string;
    message?: string; // Legacy
    comment?: string; // Current
    rating: number;
    images?: string[];
    isPublic: boolean;
    date: string;
}

export default function AdminFeedbackPage() {
    const [feedback, setFeedback] = useState<Feedback[]>([]);
    const [loading, setLoading] = useState(true);
    const [viewingFeedback, setViewingFeedback] = useState<Feedback | null>(null);
    const [fullScreenImage, setFullScreenImage] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        comment: '',
        rating: 5,
        isPublic: true
    });
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchFeedback();
    }, []);

    async function fetchFeedback() {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/feedback');
            const data = await res.json();
            setFeedback(data);
        } catch (error) {
            console.error('Failed to fetch feedback', error);
        } finally {
            setLoading(false);
        }
    }

    const toggleVisibility = async (id: string, currentStatus: boolean) => {
        try {
            const res = await fetch('/api/admin/feedback', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, isPublic: !currentStatus })
            });
            if (res.ok) fetchFeedback();
        } catch (error) {
            console.error('Failed to update feedback', error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this feedback?')) return;
        try {
            const res = await fetch(`/api/admin/feedback?id=${id}`, { method: 'DELETE' });
            if (res.ok) fetchFeedback();
        } catch (error) {
            console.error('Failed to delete feedback', error);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            setSelectedFiles((prev: File[]) => [...prev, ...files]);
            const newPreviews = files.map((file: File) => URL.createObjectURL(file));
            setPreviews((prev: string[]) => [...prev, ...newPreviews]);
        }
    };

    const removeFile = (index: number) => {
        URL.revokeObjectURL(previews[index]);
        setSelectedFiles((prev: File[]) => prev.filter((_, i) => i !== index));
        setPreviews((prev: string[]) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const data = new FormData();
        data.append('name', formData.name);
        data.append('comment', formData.comment);
        data.append('rating', formData.rating.toString());
        data.append('isPublic', formData.isPublic.toString());
        
        selectedFiles.forEach(file => data.append('images', file));

        try {
            const res = await fetch('/api/admin/feedback', {
                method: 'POST',
                body: data
            });
            if (res.ok) {
                fetchFeedback();
                closeModal();
            }
        } catch (error) {
            console.error('Failed to submit feedback', error);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setFormData({ name: '', comment: '', rating: 5, isPublic: true });
        setSelectedFiles([]);
        previews.forEach((url: string) => URL.revokeObjectURL(url));
        setPreviews([]);
    };

    if (loading && feedback.length === 0) {
        return <div style={{ color: '#94a3b8' }}>Loading feedback...</div>;
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button className="btn-admin-primary" onClick={() => setIsModalOpen(true)}>➕ Add Feedback</button>
            </div>

            <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', minWidth: '800px', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ background: 'rgba(255, 255, 255, 0.05)', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                                <th style={{ padding: '1.25rem 1.5rem', color: '#fbbf24' }}>Customer</th>
                                <th style={{ padding: '1.25rem 1.5rem', color: '#fbbf24' }}>Message</th>
                                <th style={{ padding: '1.25rem 1.5rem', color: '#fbbf24' }}>Rating</th>
                                <th style={{ padding: '1.25rem 1.5rem', color: '#fbbf24' }}>Visibility</th>
                                <th style={{ padding: '1.25rem 1.5rem', color: '#fbbf24' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {feedback.map((f: Feedback) => (
                                <tr 
                                    key={f.id} 
                                    onClick={() => setViewingFeedback(f)}
                                    style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)', cursor: 'pointer', transition: 'background 0.2s' }}
                                    onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)')}
                                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                                >
                                    <td style={{ padding: '1rem 1.5rem' }}>
                                        <p style={{ fontWeight: 600 }}>{f.name}</p>
                                        <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{f.email}</p>
                                    </td>
                                    <td style={{ padding: '1rem 1.5rem', maxWidth: '300px' }}>
                                        <p style={{ fontSize: '0.875rem', color: '#cbd5e1', marginBottom: '0.5rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {f.comment || f.message}
                                        </p>
                                        {f.images && f.images.length > 0 && (
                                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                                {f.images.slice(0, 3).map((img: string, idx: number) => (
                                                    <div key={idx} style={{ position: 'relative', width: '32px', height: '32px', borderRadius: '4px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                                                        <Image src={img} alt="Feedback" fill style={{ objectFit: 'cover' }} />
                                                    </div>
                                                ))}
                                                {f.images.length > 3 && (
                                                    <div style={{ width: '32px', height: '32px', borderRadius: '4px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', color: '#94a3b8' }}>
                                                        +{f.images.length - 3}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </td>
                                    <td style={{ padding: '1rem 1.5rem' }}>
                                        <div style={{ color: '#fbbf24' }}>
                                            {'★'.repeat(f.rating)}{'☆'.repeat(5 - f.rating)}
                                        </div>
                                    </td>
                                    <td style={{ padding: '1rem 1.5rem' }}>
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); toggleVisibility(f.id, f.isPublic); }}
                                            style={{ 
                                                background: f.isPublic ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.1)',
                                                color: f.isPublic ? '#10b981' : '#f43f5e',
                                                border: 'none',
                                                padding: '0.4rem 0.8rem',
                                                borderRadius: '1rem',
                                                fontSize: '0.75rem',
                                                fontWeight: 600,
                                                cursor: 'pointer',
                                                transition: 'all 0.2s'
                                            }}
                                        >
                                            {f.isPublic ? 'Public' : 'Hidden'}
                                        </button>
                                    </td>
                                    <td style={{ padding: '1rem 1.5rem' }}>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); setViewingFeedback(f); }} 
                                                style={{ background: 'rgba(255, 255, 255, 0.1)', border: 'none', cursor: 'pointer', padding: '0.4rem', borderRadius: '0.4rem', color: '#fbbf24' }}
                                                title="View Details"
                                            >👁️</button>
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); handleDelete(f.id); }} 
                                                style={{ background: 'rgba(244, 63, 94, 0.1)', border: 'none', cursor: 'pointer', padding: '0.4rem', borderRadius: '0.4rem', color: '#f43f5e' }}
                                                title="Delete"
                                            >🗑️</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {feedback.length === 0 && (
                    <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
                        No feedback entries found.
                    </div>
                )}
            </div>

            {/* Add External Feedback Modal */}
            {isModalOpen && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(5px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: 1000, padding: '1rem'
                }} onClick={closeModal}>
                    <div 
                        className="glass-card admin-modal" 
                        style={{ width: '100%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto', padding: '2rem', position: 'relative' }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fbbf24' }}>Add External Feedback</h2>
                            <button onClick={closeModal} style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '1.5rem', cursor: 'pointer' }}>&times;</button>
                        </div>

                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#94a3b8' }}>Customer Name</label>
                                <input 
                                    type="text" required value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    style={inputStyle} 
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#94a3b8', paddingLeft:'10rem' }}>Rating (1-5)</label>
                                <select 
                                    value={formData.rating}
                                    onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                                    style={inputStyle}
                                >
                                    {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} Stars</option>)}
                                </select>
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#94a3b8' }}>Comment</label>
                                <textarea 
                                    rows={3} required value={formData.comment}
                                    onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                                    style={inputStyle} 
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#94a3b8' }}>Images</label>
                                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                                    {previews.map((src: string, i: number) => (
                                        <div key={i} style={{ position: 'relative', width: '60px', height: '60px' }}>
                                            <Image src={src} alt="Preview" fill style={{ objectFit: 'cover', borderRadius: '4px' }} />
                                            <button type="button" onClick={() => removeFile(i)} style={{ position: 'absolute', top: -5, right: -5, background: 'red', border: 'none', color: 'white', borderRadius: '50%', width: '18px', height: '18px', fontSize: '10px', cursor: 'pointer' }}>✕</button>
                                        </div>
                                    ))}
                                    <button type="button" onClick={() => fileInputRef.current?.click()} style={{ width: '60px', height: '60px', borderRadius: '4px', border: '1px dashed #444', color: '#888', background: 'transparent', cursor: 'pointer' }}>+</button>
                                </div>
                                <input type="file" multiple accept="image/*" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} />
                            </div>

                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem' }}>
                                <input type="checkbox" checked={formData.isPublic} onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })} />
                                Make Public Immediately
                            </label>

                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                <button type="button" onClick={closeModal} style={{ flex: 1, padding: '0.75rem', borderRadius: '0.5rem', background: 'rgba(255, 255, 255, 0.1)', color: 'white', border: 'none', cursor: 'pointer' }}>Cancel</button>
                                <button type="submit" className="btn-admin-primary" style={{ flex: 1 }}>Submit</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Detailed View Modal */}
            {viewingFeedback && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0, 0, 0, 0.85)', backdropFilter: 'blur(10px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: 2000, padding: '2rem'
                }} onClick={() => setViewingFeedback(null)}>
                    <div 
                        className="glass-card detail-modal" 
                        style={{ width: '100%', maxWidth: '900px', maxHeight: '90vh', overflowY: 'auto', padding: '3rem', position: 'relative' }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button 
                            onClick={() => setViewingFeedback(null)} 
                            style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'rgba(255, 255, 255, 0.1)', border: 'none', color: 'white', borderRadius: '50%', width: '40px', height: '40px', fontSize: '1.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >&times;</button>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '1.5rem' }}>
                                <div>
                                    <h2 style={{ fontSize: '2rem', fontWeight: 700, color: '#fbbf24', marginBottom: '0.5rem' }}>{viewingFeedback.name}</h2>
                                    <p style={{ color: '#94a3b8' }}>{viewingFeedback.email || 'No email provided'}</p>
                                    <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.25rem' }}>{new Date(viewingFeedback.date).toLocaleString()}</p>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ color: '#fbbf24', fontSize: '1.5rem', marginBottom: '0.5rem' }}>
                                        {'★'.repeat(viewingFeedback.rating)}{'☆'.repeat(5 - viewingFeedback.rating)}
                                    </div>
                                    <span style={{ 
                                        background: viewingFeedback.isPublic ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.1)',
                                        color: viewingFeedback.isPublic ? '#10b981' : '#f43f5e',
                                        padding: '0.4rem 1rem',
                                        borderRadius: '2rem',
                                        fontSize: '0.875rem',
                                        fontWeight: 600
                                    }}>
                                        {viewingFeedback.isPublic ? 'Publicly Visible' : 'Hidden'}
                                    </span>
                                </div>
                            </div>

                            <div>
                                <h3 style={{ fontSize: '1rem', color: '#94a3b8', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Message</h3>
                                <p style={{ fontSize: '1.125rem', color: '#cbd5e1', lineHeight: '1.7', whiteSpace: 'pre-wrap' }}>
                                    {viewingFeedback.comment || viewingFeedback.message}
                                </p>
                            </div>

                            {viewingFeedback.images && viewingFeedback.images.length > 0 && (
                                <div>
                                    <h3 style={{ fontSize: '1rem', color: '#94a3b8', marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Gallery</h3>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
                                        {viewingFeedback.images.map((img: string, idx: number) => (
                                            <div 
                                                key={idx} 
                                                onClick={() => setFullScreenImage(img)}
                                                style={{ position: 'relative', height: '300px', borderRadius: '1rem', overflow: 'hidden', border: '1px solid rgba(255, 255, 255, 0.1)', background: 'rgba(0,0,0,0.2)', cursor: 'zoom-in' }}
                                            >
                                                <Image 
                                                    src={img} 
                                                    alt={`Feedback image ${idx + 1}`} 
                                                    fill 
                                                    style={{ objectFit: 'contain' }}
                                                    className="hover-scale"
                                                    unoptimized // Use unoptimized for local paths to avoid Next.js Image loader issues during dev
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1rem' }}>
                                <button 
                                    onClick={() => { toggleVisibility(viewingFeedback.id, viewingFeedback.isPublic); setViewingFeedback(null); }}
                                    className="btn-admin-primary"
                                    style={{ flex: 1, padding: '1rem' }}
                                >
                                    {viewingFeedback.isPublic ? 'Hide from Website' : 'Make Public'}
                                </button>
                                <button 
                                    onClick={() => setViewingFeedback(null)}
                                    style={{ flex: 1, background: 'rgba(255, 255, 255, 0.1)', color: 'white', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: 600 }}
                                >
                                    Close Wide View
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* Photo View (Lightbox) */}
            {fullScreenImage && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0, 0, 0, 0.95)', backdropFilter: 'blur(15px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: 3000, cursor: 'zoom-out'
                }} onClick={() => setFullScreenImage(null)}>
                    <button 
                        onClick={() => setFullScreenImage(null)} 
                        style={{ position: 'absolute', top: '2rem', right: '2rem', background: 'rgba(255, 255, 255, 0.1)', border: 'none', color: 'white', borderRadius: '50%', width: '50px', height: '50px', fontSize: '2rem', cursor: 'pointer', zIndex: 3001 }}
                    >&times;</button>
                    <div style={{ position: 'relative', width: '90vw', height: '90vh' }}>
                        <Image 
                            src={fullScreenImage} 
                            alt="Full Screen View" 
                            fill 
                            style={{ objectFit: 'contain' }} 
                            unoptimized
                        />
                    </div>
                </div>
            )}

            <style jsx>{`
                .admin-modal, .detail-modal {
                    animation: modalIn 0.3s ease-out;
                }
                @keyframes modalIn {
                    from { transform: translateY(20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                .hover-scale {
                    transition: transform 0.3s ease;
                }
                .hover-scale:hover {
                    transform: scale(1.02);
                }
            `}</style>
        </div>
    );
}

const inputStyle = {
    width: '100%',
    padding: '0.75rem',
    borderRadius: '0.5rem',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    color: 'white',
    fontSize: '0.875rem',
    outline: 'none'
};
