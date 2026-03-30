'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    images: string[];
    categoryId: string;
    isFeatured?: boolean;
    isComingSoon?: boolean;
}

export default function AdminProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [formData, setFormData] = useState<Partial<Product>>({
        name: '',
        description: '',
        price: 0,
        images: [''],
        categoryId: 'thanjavur',
        isFeatured: false,
        isComingSoon: false
    });

    useEffect(() => {
        fetchProducts();
    }, []);

    async function fetchProducts() {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/products');
            const data = await res.json();
            setProducts(data);
        } catch (error) {
            console.error('Failed to fetch products', error);
        } finally {
            setLoading(false);
        }
    }

    const openAddModal = () => {
        setEditingProduct(null);
        setFormData({
            name: '',
            description: '',
            price: 0,
            images: ['/placeholder.jpg'],
            categoryId: 'thanjavur',
            isFeatured: false,
            isComingSoon: false
        });
        setIsModalOpen(true);
    };

    const openEditModal = (product: Product) => {
        setEditingProduct(product);
        setFormData({ ...product });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingProduct(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const method = editingProduct ? 'PUT' : 'POST';
        const url = '/api/admin/products';
        
        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            
            if (res.ok) {
                fetchProducts();
                closeModal();
            }
        } catch (error) {
            console.error('Failed to save product', error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this product?')) return;
        
        try {
            const res = await fetch(`/api/admin/products?id=${id}`, { method: 'DELETE' });
            if (res.ok) fetchProducts();
        } catch (error) {
            console.error('Failed to delete product', error);
        }
    };

    if (loading && products.length === 0) {
        return <div style={{ color: '#94a3b8' }}>Loading products...</div>;
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button className="btn-admin-primary" onClick={openAddModal}>➕ Add New Product</button>
            </div>

            <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', minWidth: '1000px', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ background: 'rgba(255, 255, 255, 0.05)', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                            <th style={{ padding: '1.25rem 1.5rem', color: '#fbbf24' }}>Product</th>
                            <th style={{ padding: '1.25rem 1.5rem', color: '#fbbf24' }}>Category</th>
                            <th style={{ padding: '1.25rem 1.5rem', color: '#fbbf24' }}>Price</th>
                            <th style={{ padding: '1.25rem 1.5rem', color: '#fbbf24' }}>Status</th>
                            <th style={{ padding: '1.25rem 1.5rem', color: '#fbbf24' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => (
                            <tr key={product.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)', transition: 'background 0.2s' }} className="hover:bg-white/5">
                                <td style={{ padding: '1rem 1.5rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div style={{ position: 'relative', width: '48px', height: '48px', borderRadius: '0.5rem', overflow: 'hidden' }}>
                                            <Image src={product.images[0]} alt={product.name} fill sizes="48px" style={{ objectFit: 'cover' }} />
                                        </div>
                                        <div>
                                            <p style={{ fontWeight: 600 }}>{product.name}</p>
                                            <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>ID: {product.id}</p>
                                        </div>
                                    </div>
                                </td>
                                <td style={{ padding: '1rem 1.5rem' }}>
                                    <span style={{ 
                                        padding: '0.25rem 0.75rem', 
                                        borderRadius: '1rem', 
                                        fontSize: '0.75rem', 
                                        background: 'rgba(251, 191, 36, 0.1)', 
                                        color: '#fbbf24',
                                        textTransform: 'capitalize' 
                                    }}>
                                        {product.categoryId}
                                    </span>
                                </td>
                                <td style={{ padding: '1rem 1.5rem', fontWeight: 700 }}>
                                    {product.price > 0 ? `${product.price.toLocaleString('en-IN')}` : 'Coming Soon'}
                                </td>
                                <td style={{ padding: '1rem 1.5rem' }}>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        {product.isFeatured && <span title="Featured" style={{ fontSize: '1.2rem' }}>⭐</span>}
                                        {product.isComingSoon && <span title="Coming Soon" style={{ fontSize: '1.2rem' }}>⏳</span>}
                                    </div>
                                </td>
                                <td style={{ padding: '1rem 1.5rem' }}>
                                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                                        <button onClick={() => openEditModal(product)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}>✏️</button>
                                        <button onClick={() => handleDelete(product.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}>🗑️</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0, 0, 0, 0.7)',
                    backdropFilter: 'blur(5px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    padding: '1rem'
                }}>
                        <div className="glass-card admin-modal" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fbbf24' }}>
                                    {editingProduct ? 'Edit Product' : 'Add New Product'}
                                </h2>
                                <button onClick={closeModal} style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '1.5rem', cursor: 'pointer' }}>&times;</button>
                            </div>

                            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#94a3b8' }}>Product Name</label>
                                    <input 
                                        type="text" 
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        style={{ width: '100%', padding: '0.8rem', borderRadius: '0.5rem', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', color: 'white' }} 
                                    />
                                </div>

                                <div className="admin-form-row">
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#94a3b8' }}>Price</label>
                                        <input 
                                            type="number" 
                                            value={formData.price}
                                            onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) })}
                                            style={{ width: '100%', padding: '0.8rem', borderRadius: '0.5rem', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', color: 'white' }} 
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#94a3b8' }}>Category</label>
                                        <select 
                                            value={formData.categoryId}
                                            onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                                            style={{ width: '100%', padding: '0.8rem', borderRadius: '0.5rem', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', color: 'white' }}
                                        >
                                            <option value="thanjavur">Thanjavur Paintings</option>
                                            <option value="embroidery">Custom Embroidery</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#94a3b8' }}>Description</label>
                                    <textarea 
                                        rows={3}
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        style={{ width: '100%', padding: '0.8rem', borderRadius: '0.5rem', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', color: 'white', fontFamily: 'inherit' }} 
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#94a3b8' }}>Image URL (comma separated for multiple)</label>
                                    <input 
                                        type="text" 
                                        value={formData.images?.join(', ')}
                                        onChange={(e) => setFormData({ ...formData, images: e.target.value.split(',').map(s => s.trim()) })}
                                        style={{ width: '100%', padding: '0.8rem', borderRadius: '0.5rem', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', color: 'white' }} 
                                    />
                                </div>

                                <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                        <input 
                                            type="checkbox" 
                                            checked={formData.isFeatured}
                                            onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                                        />
                                        Featured Item
                                    </label>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                        <input 
                                            type="checkbox" 
                                            checked={formData.isComingSoon}
                                            onChange={(e) => setFormData({ ...formData, isComingSoon: e.target.checked })}
                                        />
                                        Coming Soon
                                    </label>
                                </div>

                                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap' }}>
                                    <button type="button" onClick={closeModal} style={{ flex: 1, padding: '0.8rem', borderRadius: '0.5rem', background: 'rgba(255, 255, 255, 0.1)', color: 'white', border: 'none', cursor: 'pointer', minWidth: '120px' }}>Cancel</button>
                                    <button type="submit" className="btn-admin-primary" style={{ flex: 1, minWidth: '120px' }}>{editingProduct ? 'Save Changes' : 'Add Product'}</button>
                                </div>
                            </form>
                        </div>
                </div>
            )}

            <style jsx>{`
                .hover\\:bg-white\\/5:hover {
                    background: rgba(255, 255, 255, 0.03);
                }
                input:focus, textarea:focus, select:focus {
                    outline: none;
                    border-color: #fbbf24 !important;
                }
                .admin-modal {
                    width: 100%;
                    max-width: 600px;
                }
                .admin-form-row {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1rem;
                }
                @media (max-width: 640px) {
                    .admin-form-row {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>
        </div>
    );
}
