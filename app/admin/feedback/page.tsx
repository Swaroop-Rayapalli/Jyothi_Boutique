'use client';

import React, { useState, useEffect } from 'react';

interface Feedback {
    id: string;
    name: string;
    email: string;
    message: string;
    rating: number;
    isPublic: boolean;
    date: string;
}

export default function AdminFeedbackPage() {
    const [feedback, setFeedback] = useState<Feedback[]>([]);
    const [loading, setLoading] = useState(true);

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

    if (loading && feedback.length === 0) {
        return <div style={{ color: '#94a3b8' }}>Loading feedback...</div>;
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
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
                        {feedback.map((f) => (
                            <tr key={f.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                                <td style={{ padding: '1rem 1.5rem' }}>
                                    <p style={{ fontWeight: 600 }}>{f.name}</p>
                                    <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{f.email}</p>
                                </td>
                                <td style={{ padding: '1rem 1.5rem', maxWidth: '300px' }}>
                                    <p style={{ fontSize: '0.875rem', color: '#cbd5e1', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={f.message}>
                                        {f.message}
                                    </p>
                                </td>
                                <td style={{ padding: '1rem 1.5rem' }}>
                                    <div style={{ color: '#fbbf24' }}>
                                        {'★'.repeat(f.rating)}{'☆'.repeat(5 - f.rating)}
                                    </div>
                                </td>
                                <td style={{ padding: '1rem 1.5rem' }}>
                                    <button 
                                        onClick={() => toggleVisibility(f.id, f.isPublic)}
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
                                    <button onClick={() => handleDelete(f.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}>🗑️</button>
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
        </div>
    );
}
