'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        totalProducts: 0,
        totalFeedback: 0,
        totalOrders: 0,
        totalRevenue: 0,
        comingSoonCount: 0,
        featuredCount: 0,
        recentOrders: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchStats() {
            try {
                const [productsRes, feedbackRes, ordersRes] = await Promise.all([
                    fetch('/api/admin/products'),
                    fetch('/api/admin/feedback'),
                    fetch('/api/admin/orders')
                ]);
                
                const products = await productsRes.json();
                const feedback = await feedbackRes.json();
                const orders = await ordersRes.json();
                
                const revenue = orders.reduce((sum: number, order: any) => sum + (order.totalAmount || order.total || 0), 0);
                
                setStats({
                    totalProducts: products.length,
                    totalFeedback: feedback.length,
                    totalOrders: orders.length,
                    totalRevenue: revenue,
                    comingSoonCount: products.filter((p: any) => p.isComingSoon).length,
                    featuredCount: products.filter((p: any) => p.isFeatured).length,
                    recentOrders: orders.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5)
                });
            } catch (error) {
                console.error('Failed to fetch stats', error);
            } finally {
                setLoading(false);
            }
        }
        
        fetchStats();
    }, []);

    const cards = [
        { name: 'Total Products', value: stats.totalProducts, icon: '🛍️', color: '#3b82f6' },
        { name: 'Total Orders', value: stats.totalOrders, icon: '📦', color: '#8b5cf6' },
        { name: 'Total Revenue', value: stats.totalRevenue.toLocaleString('en-IN'), icon: '💳', color: '#10b981' },
        { name: 'Customer Feedback', value: stats.totalFeedback, icon: '💬', color: '#f59e0b' },
    ];

    if (loading) {
        return <div style={{ color: '#94a3b8', padding: '2rem', textAlign: 'center' }}>Loading dashboard metrics...</div>;
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Stats Grid */}
            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
                gap: '1.5rem' 
            }}>
                {cards.map((card) => (
                    <div key={card.name} className="glass-card" style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '1.5rem',
                        position: 'relative',
                        overflow: 'hidden',
                        padding: '1.5rem'
                    }}>
                        <div style={{
                            width: '4px',
                            height: '100%',
                            background: card.color,
                            position: 'absolute',
                            left: 0,
                            top: 0
                        }}></div>
                        <div style={{ 
                            fontSize: '2rem', 
                            background: `${card.color}20`, 
                            padding: '0.75rem', 
                            borderRadius: '1rem' 
                        }}>
                            {card.icon}
                        </div>
                        <div>
                            <p style={{ color: '#94a3b8', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.25rem' }}>{card.name}</p>
                            <h3 style={{ fontSize: '1.75rem', fontWeight: 800 }}>{card.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick Actions & Business Analysis */}
            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 400px), 1fr))', 
                gap: '2rem' 
            }}>
                <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fbbf24' }}>Quick Actions</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                        <Link href="/admin/products" style={{ textDecoration: 'none' }}>
                            <button className="btn-admin-primary" style={{ width: '100%' }}>➕ Add New Product</button>
                        </Link>
                        <Link href="/admin/feedback" style={{ textDecoration: 'none' }}>
                            <button className="btn-admin-primary" style={{ width: '100%', background: 'rgba(255, 255, 255, 0.1)', color: 'white' }}>📋 View Feedback</button>
                        </Link>
                    </div>
                    
                    <div style={{ marginTop: '1rem' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', color: '#94a3b8' }}>Inventory Summary</h3>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: '0.5rem', marginBottom: '0.5rem' }}>
                            <span>Featured Items</span>
                            <span style={{ fontWeight: 700 }}>{stats.featuredCount}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: '0.5rem' }}>
                            <span>Coming Soon</span>
                            <span style={{ fontWeight: 700 }}>{stats.comingSoonCount}</span>
                        </div>
                    </div>
                </div>

                <div className="glass-card" style={{ overflowX: 'auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fbbf24' }}>Business Analysis</h2>
                        <span style={{ fontSize: '0.75rem', color: '#94a3b8', padding: '0.25rem 0.5rem', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1rem' }}>Live Activity</span>
                    </div>
                    
                    {stats.recentOrders.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#94a3b8' }}>Recent Orders</h3>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                                <thead>
                                    <tr style={{ textAlign: 'left', borderBottom: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8' }}>
                                        <th style={{ padding: '0.5rem' }}>Customer</th>
                                        <th style={{ padding: '0.5rem' }}>Amount</th>
                                        <th style={{ padding: '0.5rem' }}>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {stats.recentOrders.map((order: any) => (
                                        <tr key={order.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                            <td style={{ padding: '0.75rem 0.5rem' }}>{order.customer?.name || 'Guest'}</td>
                                            <td style={{ padding: '0.75rem 0.5rem', fontWeight: 700 }}>{(order.totalAmount || order.total || 0).toLocaleString('en-IN')}</td>
                                            <td style={{ padding: '0.75rem 0.5rem' }}>
                                                <span style={{ 
                                                    padding: '0.2rem 0.5rem', 
                                                    borderRadius: '1rem', 
                                                    fontSize: '0.75rem',
                                                    background: 'rgba(16, 185, 129, 0.1)',
                                                    color: '#10b981'
                                                }}>
                                                    {order.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                            <p>No orders yet. Start selling to see business analysis here!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
