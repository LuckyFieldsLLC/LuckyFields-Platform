'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useConfig } from '@/components/ConfigProvider';

export default function LoginPage() {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, t } = useConfig();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password }),
            });

            if (res.ok) {
                const data = await res.json();
                login(data.token);
                router.push('/admin');
            } else {
                setError(t('ui.admin.invalid_password'));
            }
        } catch (err) {
            setError('System error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            maxWidth: '400px',
            margin: '100px auto',
            padding: '2rem',
            background: 'var(--card-bg)',
            borderRadius: '24px',
            border: '1px solid var(--card-border)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
        }}>
            <h1 style={{ textAlign: 'center', marginBottom: '1rem', fontSize: '1.5rem' }}>{t('ui.admin.login_title')}</h1>
            <p style={{ textAlign: 'center', color: 'var(--secondary-text)', fontSize: '0.9rem', marginBottom: '2rem' }}>
                {t('ui.admin.login_desc')}
            </p>

            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.5rem' }}>
                <div style={{ display: 'grid', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 'bold', opacity: 0.7 }}>{t('ui.admin.password')}</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{
                            padding: '0.75rem 1rem',
                            borderRadius: '12px',
                            border: '1px solid var(--card-border)',
                            background: 'rgba(255,255,255,0.05)',
                            color: 'inherit',
                            outline: 'none',
                            fontSize: '1rem'
                        }}
                        autoFocus
                    />
                </div>

                {error && <p style={{ color: '#ef4444', fontSize: '0.8rem', textAlign: 'center', margin: 0 }}>{error}</p>}

                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        padding: '1rem',
                        borderRadius: '12px',
                        background: 'var(--primary-color)',
                        color: 'white',
                        border: 'none',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        transition: 'opacity 0.2s'
                    }}
                >
                    {loading ? '...' : t('ui.admin.login_button')}
                </button>
            </form>
        </div>
    );
}
