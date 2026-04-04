'use client';

import React, { useState, useEffect } from 'react';

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState<string | null>(null);
    const [message, setMessage] = useState({ type: '', text: '' });

    const fetchOrders = async () => {
        try {
            const res = await fetch('/api/admin/orders');
            if (res.ok) {
                const data = await res.json();
                setOrders(data.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
            }
        } catch (error) {
            console.error('Failed to fetch orders:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleStatusChange = async (orderId: string, newStatus: string) => {
        setUpdatingId(orderId);
        setMessage({ type: '', text: '' });

        try {
            const res = await fetch('/api/admin/orders', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderId, newStatus }),
            });

            const data = await res.json();
            if (res.ok) {
                setMessage({ type: 'success', text: `Order ${orderId} updated to ${newStatus}. Client notified!` });
                // Update local state
                setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
            } else {
                setMessage({ type: 'error', text: data.error || 'Failed to update order status' });
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'An error occurred while updating the order' });
        } finally {
            setUpdatingId(null);
            // Clear message after 5 seconds
            setTimeout(() => setMessage({ type: '', text: '' }), 5000);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'pending': return { bg: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', border: 'rgba(245, 158, 11, 0.2)' };
            case 'processing': return { bg: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', border: 'rgba(59, 130, 246, 0.2)' };
            case 'shipped': return { bg: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6', border: 'rgba(139, 92, 246, 0.2)' };
            case 'delivered': return { bg: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: 'rgba(16, 185, 129, 0.2)' };
            case 'cancelled': return { bg: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: 'rgba(239, 68, 68, 0.2)' };
            default: return { bg: 'rgba(148, 163, 184, 0.1)', color: '#94a3b8', border: 'rgba(148, 163, 184, 0.2)' };
        }
    };

    if (loading) {
        return <div style={{ padding: '2rem', color: '#94a3b8' }}>Loading order history...</div>;
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p style={{ color: '#94a3b8', margin: 0 }}>Review and manage your boutique's customer orders.</p>
                {message.text && (
                    <div style={{ 
                        padding: '0.5rem 1rem', 
                        borderRadius: '0.5rem', 
                        fontSize: '0.875rem',
                        background: message.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                        color: message.type === 'success' ? '#10b981' : '#ef4444',
                        border: `1px solid ${message.type === 'success' ? '#10b98133' : '#ef444433'}` 
                    }}>
                        {message.text}
                    </div>
                )}
            </div>

            <div className="glass-card" style={{ overflowX: 'auto', padding: 0 }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '1000px' }}>
                    <thead>
                        <tr style={{ textAlign: 'left', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', color: '#94a3b8' }}>
                            <th style={{ padding: '1.25rem 1.5rem' }}>Order Info</th>
                            <th style={{ padding: '1.25rem 1.5rem' }}>Customer</th>
                            <th style={{ padding: '1.25rem 1.5rem' }}>Items</th>
                            <th style={{ padding: '1.25rem 1.5rem' }}>Status</th>
                            <th style={{ padding: '1.25rem 1.5rem' }}>Total</th>
                            <th style={{ padding: '1.25rem 1.5rem' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => {
                            const statusStyle = getStatusColor(order.status);
                            return (
                                <tr key={order.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)', transition: 'background 0.2s' }}>
                                    <td style={{ padding: '1.25rem 1.5rem' }}>
                                        <div style={{ fontWeight: 700, color: '#fbbf24', fontSize: '0.875rem' }}>{order.id}</div>
                                        <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td style={{ padding: '1.25rem 1.5rem' }}>
                                        <div style={{ fontWeight: 600 }}>{order.customer.name}</div>
                                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{order.customer.email}</div>
                                    </td>
                                    <td style={{ padding: '1.25rem 1.5rem' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                            {order.items.map((item: any, idx: number) => (
                                                <div key={idx} style={{ fontSize: '0.8rem' }}>
                                                    • {item.name} <span style={{ color: '#64748b' }}>x{item.quantity}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </td>
                                    <td style={{ padding: '1.25rem 1.5rem' }}>
                                        <span style={{ 
                                            padding: '0.35rem 0.75rem', 
                                            borderRadius: '2rem', 
                                            fontSize: '0.75rem',
                                            fontWeight: 700,
                                            background: statusStyle.bg,
                                            color: statusStyle.color,
                                            border: `1px solid ${statusStyle.border}`,
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.05em'
                                        }}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1.25rem 1.5rem', fontWeight: 800, fontSize: '1rem' }}>
                                        ₹{order.totalAmount.toLocaleString('en-IN')}
                                    </td>
                                    <td style={{ padding: '1.25rem 1.5rem' }}>
                                        <select 
                                            value={order.status}
                                            disabled={updatingId === order.id}
                                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                            style={{ 
                                                background: 'rgba(255, 255, 255, 0.05)', 
                                                border: '1px solid rgba(255, 255, 255, 0.2)', 
                                                borderRadius: '0.5rem', 
                                                padding: '0.4rem 0.6rem',
                                                color: 'white',
                                                fontSize: '0.85rem',
                                                cursor: 'pointer',
                                                outline: 'none'
                                            }}
                                        >
                                            <option value="pending" style={{ background: '#1e293b' }}>Pending</option>
                                            <option value="processing" style={{ background: '#1e293b' }}>Processing</option>
                                            <option value="shipped" style={{ background: '#1e293b' }}>Shipped</option>
                                            <option value="delivered" style={{ background: '#1e293b' }}>Delivered</option>
                                            <option value="cancelled" style={{ background: '#1e293b' }}>Cancelled</option>
                                        </select>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                
                {orders.length === 0 && (
                    <div style={{ padding: '4rem', textAlign: 'center', color: '#64748b' }}>
                        No orders recorded yet.
                    </div>
                )}
            </div>

            <style jsx global>{`
                tr:hover { background: rgba(255, 255, 255, 0.02); }
            `}</style>
        </div>
    );
}
