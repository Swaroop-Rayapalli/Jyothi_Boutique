'use client';

import React, { useState, useEffect } from 'react';

export default function AdminProfilePage() {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [profilePhoto, setProfilePhoto] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSavingProfile, setIsSavingProfile] = useState(false);
    const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
    const [isSendingRecovery, setIsSendingRecovery] = useState(false);
    const [profileLoading, setProfileLoading] = useState(true);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const [fullScreenImage, setFullScreenImage] = useState<string | null>(null);

    useEffect(() => {
        async function fetchProfile() {
            try {
                const res = await fetch('/api/admin/profile');
                const data = await res.json();
                if (res.ok) {
                    setEmail(data.email);
                    setUsername(data.username);
                    setProfilePhoto(data.profilePhoto || '');
                }
            } catch (err) {
                console.error('Failed to fetch profile', err);
            } finally {
                setProfileLoading(false);
            }
        }
        fetchProfile();
    }, []);

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setIsSavingProfile(true);

        try {
            const formData = new FormData();
            formData.append('username', username);
            const fileInput = document.getElementById('photo-upload') as HTMLInputElement;
            if (fileInput?.files?.[0]) {
                formData.append('profilePhoto', fileInput.files[0]);
            }

            const res = await fetch('/api/admin/profile', {
                method: 'POST',
                body: formData,
            });

            const data = await res.json();
            if (res.ok) {
                setMessage('Profile updated successfully!');
                setUsername(data.username);
                setProfilePhoto(data.profilePhoto || '');
                setPhotoPreview(null);
                // Refresh the layout by dispatching a custom event if needed
                window.dispatchEvent(new Event('profileUpdate'));
            } else {
                setError(data.error || 'Failed to update profile');
            }
        } catch (err) {
            setError('An error occurred during profile update');
        } finally {
            setIsSavingProfile(false);
        }
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (newPassword !== confirmPassword) {
            setError('New passwords do not match');
            return;
        }

        setIsUpdatingPassword(true);
        try {
            const res = await fetch('/api/admin/auth/change-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ oldPassword, newPassword }),
            });

            const data = await res.json();
            if (res.ok) {
                setMessage('Password updated successfully!');
                setOldPassword('');
                setNewPassword('');
                setConfirmPassword('');
            } else {
                setError(data.error || 'Failed to update password');
            }
        } catch (err) {
            setError('An error occurred during password change');
        } finally {
            setIsUpdatingPassword(false);
        }
    };

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleResetTrigger = async () => {
        if (!confirm('This will send a temporary password (valid for 5 mins) to your email. You will not be logged out until you choose to. Proceed?')) return;

        setIsSendingRecovery(true);
        try {
            const res = await fetch('/api/admin/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            if (res.ok) {
                alert('A temporary password has been sent to your email. It expires in 5 minutes.');
            } else {
                const data = await res.json();
                setError(data.error || 'Failed to reset password');
            }
        } catch (err) {
            setError('An error occurred during reset process');
        } finally {
            setIsSendingRecovery(false);
        }
    };

    if (profileLoading) {
        return <div style={{ color: '#94a3b8', padding: '2rem' }}>Loading profile details...</div>;
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '900px' }}>
            {/* Header section */}
            <div className="glass-card profile-header-card" style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '2rem' }}>
                <div 
                    className="hover-scale"
                    onClick={() => (profilePhoto || photoPreview) && setFullScreenImage(photoPreview || profilePhoto)}
                    style={{ 
                        width: '100px', height: '100px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', 
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', 
                        fontWeight: 800, color: '#0f172a', border: '4px solid rgba(251, 191, 36, 0.2)', 
                        boxShadow: '0 8px 32px rgba(0,0,0,0.3)', overflow: 'hidden', flexShrink: 0,
                        cursor: (profilePhoto || photoPreview) ? 'zoom-in' : 'default'
                    }}
                >
                    {profilePhoto ? (
                        <img src={profilePhoto} alt={username} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                        username?.charAt(0).toUpperCase()
                    )}
                </div>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: 0 }}>{username || 'Administrative Profile'}</h1>
                    <p style={{ color: '#94a3b8', margin: '0.25rem 0 0.75rem 0' }}>Super Admin Account</p>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <span style={{ fontSize: '0.875rem', color: '#fbbf24', background: 'rgba(251, 191, 36, 0.1)', padding: '4px 12px', borderRadius: '1rem', fontWeight: 600 }}>
                            {email}
                        </span>
                        <span style={{ fontSize: '0.875rem', color: '#10b981', background: 'rgba(16, 185, 129, 0.1)', padding: '4px 12px', borderRadius: '1rem', fontWeight: 600 }}>
                            Active
                        </span>
                    </div>
                </div>
            </div>

            {error && <div className="alert error">{error}</div>}
            {message && <div className="alert success">{message}</div>}

            <div className="profile-grid">
                {/* Account Details */}
                <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', height: '100%' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fbbf24', margin: 0 }}>Account Information</h2>
                    <p style={{ fontSize: '0.875rem', color: '#94a3b8', margin: 0 }}>Update your public-facing administrative name and profile picture.</p>
                    
                    <form onSubmit={handleProfileUpdate} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div>
                            <label style={labelStyle}>Display Username</label>
                            <input 
                                type="text" 
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                style={inputStyle} 
                                placeholder="Admin"
                                autoComplete="username"
                            />
                        </div>
                        <div>
                            <label style={labelStyle}>Profile Photo</label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
                                <div 
                                    className="hover-scale"
                                    onClick={() => (photoPreview || profilePhoto) && setFullScreenImage(photoPreview || profilePhoto)}
                                    style={{ 
                                        width: '60px', 
                                        height: '60px', 
                                        borderRadius: '12px', 
                                        background: 'rgba(255,255,255,0.05)', 
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        flexShrink: 0,
                                        overflow: 'hidden',
                                        cursor: (photoPreview || profilePhoto) ? 'zoom-in' : 'default'
                                    }}>
                                    {(photoPreview || profilePhoto) && (
                                        <img src={photoPreview || profilePhoto} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    )}
                                </div>
                                <input 
                                    type="file" 
                                    id="photo-upload"
                                    accept="image/*"
                                    onChange={handlePhotoChange}
                                    style={{ 
                                        fontSize: '0.75rem', 
                                        color: '#94a3b8',
                                        width: '100%'
                                    }} 
                                />
                            </div>
                        </div>
                        <div style={{ flex: 1 }}></div>
                        <button 
                            type="submit" 
                            disabled={isSavingProfile} 
                            className="btn-admin-primary" 
                            style={{ padding: '0.875rem', marginTop: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', minHeight: '48px' }}
                        >
                            {isSavingProfile ? (
                                <>
                                    <span className="spinner-small"></span>
                                    <span>Saving Changes...</span>
                                </>
                            ) : 'Save Profile Changes'}
                        </button>
                    </form>
                </div>

                {/* Manual Change Password */}
                <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', height: '100%' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fbbf24', margin: 0 }}>Change Password</h2>
                    <p style={{ fontSize: '0.875rem', color: '#94a3b8', margin: 0 }}>Provide your current password to set a new one manually.</p>
                    
                    <form onSubmit={handleChangePassword} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div>
                            <label style={labelStyle}>Current Password</label>
                            <div style={{ position: 'relative' }}>
                                <input 
                                    type={showOldPassword ? "text" : "password"} 
                                    required 
                                    value={oldPassword}
                                    onChange={(e) => setOldPassword(e.target.value)}
                                    style={{ ...inputStyle, paddingRight: '2.5rem' }} 
                                    placeholder="••••••••"
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowOldPassword(!showOldPassword)}
                                    style={eyeButtonStyle}
                                >
                                    {showOldPassword ? '🙈' : '👁️'}
                                </button>
                            </div>
                        </div>
                        <div>
                            <label style={labelStyle}>New Password</label>
                            <div style={{ position: 'relative' }}>
                                <input 
                                    type={showNewPassword ? "text" : "password"} 
                                    required 
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    style={{ ...inputStyle, paddingRight: '2.5rem' }} 
                                    placeholder="••••••••"
                                    autoComplete="new-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    style={eyeButtonStyle}
                                >
                                    {showNewPassword ? '🙈' : '👁️'}
                                </button>
                            </div>
                        </div>
                        <div>
                            <label style={labelStyle}>Confirm New Password</label>
                            <div style={{ position: 'relative' }}>
                                <input 
                                    type={showConfirmPassword ? "text" : "password"} 
                                    required 
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    style={{ ...inputStyle, paddingRight: '2.5rem' }} 
                                    placeholder="••••••••"
                                    autoComplete="new-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    style={eyeButtonStyle}
                                >
                                    {showConfirmPassword ? '🙈' : '👁️'}
                                </button>
                            </div>
                        </div>
                        <div style={{ flex: 1 }}></div>
                        <button 
                            type="submit" 
                            disabled={isUpdatingPassword} 
                            className="btn-admin-primary" 
                            style={{ padding: '0.875rem', marginTop: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', minHeight: '48px' }}
                        >
                            {isUpdatingPassword ? (
                                <>
                                    <span className="spinner-small"></span>
                                    <span>Updating...</span>
                                </>
                            ) : 'Update Password'}
                        </button>
                    </form>
                </div>

                {/* Quick Security Actions */}
                <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', gridColumn: '1 / -1' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fbbf24', margin: 0 }}>Quick Security Actions</h2>
                    
                    <div style={{ background: 'rgba(244, 63, 94, 0.05)', padding: '1.5rem', borderRadius: '1rem', border: '1px solid rgba(244, 63, 94, 0.1)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                            <div style={{ flex: 1, minWidth: '250px' }}>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, margin: '0 0 0.5rem 0', color: '#f43f5e' }}>Recovery Password</h3>
                                <p style={{ fontSize: '0.875rem', color: '#94a3b8', margin: 0 }}>
                                    If you forget your password, we'll send a <strong>5-minute temporary password</strong> to {email}.
                                </p>
                            </div>
                            <button 
                                onClick={handleResetTrigger}
                                disabled={isSendingRecovery}
                                style={{ 
                                    background: '#f43f5e', 
                                    color: 'white', 
                                    border: 'none', 
                                    padding: '0.75rem 1.5rem', 
                                    borderRadius: '0.5rem', 
                                    fontWeight: 700, 
                                    cursor: 'pointer',
                                    fontSize: '0.875rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem'
                                }}
                            >
                                {isSendingRecovery && <span className="spinner-small" style={{ borderColor: 'white', borderTopColor: 'transparent' }}></span>}
                                {isSendingRecovery ? 'Sending...' : 'Send Recovery Password'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                .spinner-small {
                    width: 16px;
                    height: 16px;
                    border: 2px solid rgba(15, 23, 42, 0.4);
                    border-top-color: #0f172a;
                    border-radius: 50%;
                    animation: spin 0.8s linear infinite;
                }
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
                .hover-scale {
                    transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .hover-scale:hover {
                    transform: scale(1.05);
                }
                .profile-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
                    gap: 2rem;
                }
                .alert {
                    padding: 0.75rem 1rem;
                    border-radius: 0.5rem;
                    font-size: 0.875rem;
                    margin-bottom: 0.5rem;
                    font-weight: 500;
                }
                .alert.error { background: rgba(244, 63, 94, 0.1); color: #f43f5e; border: 1px solid rgba(244, 63, 94, 0.2); }
                .alert.success { background: rgba(16, 185, 129, 0.1); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.2); }
                
                @media (max-width: 640px) {
                    .profile-header-card {
                        flex-direction: column;
                        text-align: center;
                        gap: 1rem !important;
                    }
                    .profile-header-card > div:first-child {
                        margin: 0 auto;
                    }
                    .profile-header-card div:last-child {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                    }
                    .profile-grid {
                        grid-template-columns: 1fr;
                        gap: 1rem;
                    }
                }
            `}</style>
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
                    <div style={{ position: 'relative', width: '90vw', height: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <img 
                            src={fullScreenImage} 
                            alt="Full Screen View" 
                            style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: '8px' }} 
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

const labelStyle: React.CSSProperties = {
    display: 'block', 
    marginBottom: '0.5rem', 
    fontSize: '0.875rem', 
    color: '#94a3b8'
};

const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.75rem 1rem',
    borderRadius: '0.5rem',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    color: 'white',
    fontSize: '0.925rem'
};

const eyeButtonStyle: React.CSSProperties = {
    position: 'absolute',
    right: '0.875rem',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    color: '#94a3b8',
    cursor: 'pointer',
    fontSize: '1.1rem',
    padding: '0',
    display: 'flex',
    alignItems: 'center',
    zIndex: 5
};
