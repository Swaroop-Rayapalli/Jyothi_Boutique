'use client';

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    children: React.ReactNode;
}

export default function Button({
    variant = 'primary',
    size = 'md',
    children,
    style,
    ...props
}: ButtonProps) {
    const baseStyle: React.CSSProperties = {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 600,
        borderRadius: 'var(--radius-md)',
        transition: 'all var(--transition-base)',
        cursor: 'pointer',
        border: 'none',
        outline: 'none',
    };

    const variantStyles: Record<string, React.CSSProperties> = {
        primary: {
            background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)',
            color: 'var(--color-secondary)',
            boxShadow: 'var(--shadow-md)',
        },
        secondary: {
            background: 'rgba(255, 255, 255, 0.1)',
            color: 'var(--color-text)',
            border: '1px solid var(--color-border)',
        },
        outline: {
            background: 'transparent',
            color: 'var(--color-primary)',
            border: '2px solid var(--color-primary)',
        },
        ghost: {
            background: 'transparent',
            color: 'var(--color-text-light)',
        },
    };

    const sizeStyles: Record<string, React.CSSProperties> = {
        sm: { padding: '0.5rem 1rem', fontSize: '0.875rem' },
        md: { padding: '0.75rem 1.5rem', fontSize: '1rem' },
        lg: { padding: '1rem 2rem', fontSize: '1.125rem' },
    };

    return (
        <button
            style={{ ...baseStyle, ...variantStyles[variant], ...sizeStyles[size], ...style }}
            onMouseEnter={(e) => {
                if (variant === 'primary') {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-glow)';
                } else if (variant === 'outline') {
                    e.currentTarget.style.background = 'var(--color-primary)';
                    e.currentTarget.style.color = 'var(--color-secondary)';
                } else if (variant === 'ghost') {
                    e.currentTarget.style.color = 'var(--color-primary)';
                }
            }}
            onMouseLeave={(e) => {
                if (variant === 'primary') {
                    e.currentTarget.style.transform = 'none';
                    e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                } else if (variant === 'outline') {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = 'var(--color-primary)';
                } else if (variant === 'ghost') {
                    e.currentTarget.style.color = 'var(--color-text-light)';
                }
            }}
            {...props}
        >
            {children}
        </button>
    );
}
