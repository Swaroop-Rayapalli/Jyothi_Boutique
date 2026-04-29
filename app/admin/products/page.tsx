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
        images: [],
        categoryId: 'thanjavur',
        isFeatured: false,
        isComingSoon: false
    });
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

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
            images: [],
            categoryId: 'thanjavur',
            isFeatured: false,
            isComingSoon: false
        });
        setSelectedFiles([]);
        setPreviews([]);
        setIsModalOpen(true);
    };

    const openEditModal = (product: Product) => {
        setEditingProduct(product);
        setFormData({ ...product });
        setSelectedFiles([]);
        setPreviews([]);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingProduct(null);
        setSelectedFiles([]);
        previews.forEach(url => URL.revokeObjectURL(url));
        setPreviews([]);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            setSelectedFiles(prev => [...prev, ...files]);
            
            const newPreviews = files.map(file => URL.createObjectURL(file));
            setPreviews(prev => [...prev, ...newPreviews]);
        }
    };

    const removeNewImage = (index: number) => {
        URL.revokeObjectURL(previews[index]);
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
        setPreviews(prev => prev.filter((_, i) => i !== index));
    };

    const removeExistingImage = (index: number) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images?.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const method = editingProduct ? 'PUT' : 'POST';
        const url = '/api/admin/products';
        
        const data = new FormData();
        if (editingProduct) data.append('id', editingProduct.id);
        data.append('name', formData.name || '');
        data.append('description', formData.description || '');
        data.append('price', (formData.price || 0).toString());
        data.append('categoryId', formData.categoryId || 'thanjavur');
        data.append('isFeatured', (formData.isFeatured || false).toString());
        data.append('isComingSoon', (formData.isComingSoon || false).toString());
        
        // Append existing image URLs
        formData.images?.forEach(img => data.append('existingImages', img));
        
        // Append new files
        selectedFiles.forEach(file => data.append('images', file));

        setIsSubmitting(true);
        setStatus(null);
        try {
            const res = await fetch(url, {
                method,
                body: data // Fetch handles form data headers automatically
            });
            
            if (res.ok) {
                const message = editingProduct ? 'Product updated successfully!' : 'Product added successfully!';
                setStatus({ type: 'success', message });
                fetchProducts();
                closeModal();
                // Clear status after 5 seconds
                setTimeout(() => setStatus(null), 5000);
            } else {
                throw new Error('Failed to save product');
            }
        } catch (error) {
            console.error('Failed to save product', error);
            setStatus({ type: 'error', message: 'Failed to save product. Please try again.' });
        } finally {
            setIsSubmitting(false);
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ flex: 1 }}>
                    {status && (
                        <div style={{ 
                            padding: '0.75rem 1.25rem', 
                            borderRadius: '0.5rem', 
                            background: status.type === 'success' ? 'rgba(37, 211, 102, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                            color: status.type === 'success' ? '#25D366' : '#ef4444',
                            border: `1px solid ${status.type === 'success' ? 'rgba(37, 211, 102, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`,
                            display: 'inline-block',
                            fontSize: '0.875rem'
                        }}>
                            {status.type === 'success' ? '✅' : '❌'} {status.message}
                        </div>
                    )}
                </div>
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
                                        <div style={{ position: 'relative', width: '48px', height: '48px', borderRadius: '0.5rem', overflow: 'hidden', background: 'rgba(255,255,255,0.05)' }}>
                                            {product.images && product.images.length > 0 ? (
                                                <Image src={product.images[0]} alt={product.name} fill sizes="48px" style={{ objectFit: 'cover' }} />
                                            ) : (
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: '1.5rem' }}>🖼️</div>
                                            )}
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
                                            value={isNaN(formData.price ?? 0) ? '' : formData.price}
                                            onChange={(e) => setFormData({ ...formData, price: e.target.value ? parseInt(e.target.value) : 0 })}
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
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#94a3b8' }}>Product Images</label>
                                    
                                    {/* Previews of existing and new images */}
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: '0.5rem', marginBottom: '1rem' }}>
                                        {/* Existing Images */}
                                        {formData.images?.map((url, idx) => (
                                            <div key={`existing-${idx}`} style={{ position: 'relative', width: '80px', height: '80px', borderRadius: '0.25rem', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                                                {url ? (
                                                    <Image src={url} alt="Existing" fill style={{ objectFit: 'cover' }} />
                                                ) : (
                                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: '2rem' }}>🖼️</div>
                                                )}
                                                <button 
                                                    type="button" 
                                                    onClick={() => removeExistingImage(idx)}
                                                    style={{ position: 'absolute', top: 2, right: 2, background: 'rgba(239, 68, 68, 0.8)', color: 'white', border: 'none', borderRadius: '50%', width: '18px', height: '18px', fontSize: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1 }}
                                                >✕</button>
                                            </div>
                                        ))}
                                        
                                        {/* New Previews */}
                                        {previews.map((url, idx) => (
                                            <div key={`new-${idx}`} style={{ position: 'relative', width: '80px', height: '80px', borderRadius: '0.25rem', overflow: 'hidden', border: '1px solid #fbbf24' }}>
                                                <Image src={url} alt="New" fill style={{ objectFit: 'cover' }} />
                                                <button 
                                                    type="button" 
                                                    onClick={() => removeNewImage(idx)}
                                                    style={{ position: 'absolute', top: 2, right: 2, background: 'rgba(239, 68, 68, 0.8)', color: 'white', border: 'none', borderRadius: '50%', width: '18px', height: '18px', fontSize: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                                >✕</button>
                                            </div>
                                        ))}
                                        
                                        {/* Add Button */}
                                        <button 
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            style={{ width: '80px', height: '80px', borderRadius: '0.25rem', background: 'rgba(255,255,255,0.05)', border: '1px dashed rgba(255,255,255,0.2)', color: '#94a3b8', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', gap: '4px' }}
                                        >
                                            <span style={{ fontSize: '1.25rem' }}>+</span>
                                            <span style={{ fontSize: '0.625rem' }}>Upload</span>
                                        </button>
                                    </div>

                                    <input 
                                        type="file" 
                                        ref={fileInputRef}
                                        multiple 
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        style={{ display: 'none' }} 
                                    />
                                    <p style={{ fontSize: '0.75rem', color: '#64748b' }}>Select one or more product photos.</p>
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
                                    <button type="button" onClick={closeModal} disabled={isSubmitting} style={{ flex: 1, padding: '0.8rem', borderRadius: '0.5rem', background: 'rgba(255, 255, 255, 0.1)', color: 'white', border: 'none', cursor: 'pointer', minWidth: '120px', opacity: isSubmitting ? 0.5 : 1 }}>Cancel</button>
                                    <button type="submit" className="btn-admin-primary" disabled={isSubmitting} style={{ flex: 1, minWidth: '120px', opacity: isSubmitting ? 0.5 : 1 }}>
                                        {isSubmitting ? 'Saving...' : (editingProduct ? 'Save Changes' : 'Add Product')}
                                    </button>
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
