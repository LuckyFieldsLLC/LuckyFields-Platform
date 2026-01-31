'use client';

import React, { useState, useEffect } from 'react';
import { useConfig } from '@/components/ConfigProvider';

export default function AboutPage() {
    const { config, t, isLoggedIn, saveConfig } = useConfig() as any;
    const [isEditing, setIsEditing] = useState(false);
    const [tempContent, setTempContent] = useState('');

    useEffect(() => {
        if (config?.aboutContent) {
            setTempContent(config.aboutContent);
        }
    }, [config]);

    const handleSave = async () => {
        await saveConfig({ ...config, aboutContent: tempContent });
        setIsEditing(false);
    };

    if (!config) return <div style={{ padding: '2rem' }}>{t('ui.loading')}</div>;

    return (
        <main style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', minHeight: '100vh' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem', borderBottom: '2px solid var(--border-dyn)', paddingBottom: '1rem' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: '800', margin: 0 }}>{t('ui.about')}</h1>
                {isLoggedIn && !isEditing && (
                    <button
                        onClick={() => setIsEditing(true)}
                        style={{ padding: '0.6rem 1.2rem', borderRadius: '12px', background: 'var(--primary-color)', color: 'white', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}
                    >
                        ✏️ {t('ui.admin.edit_content')}
                    </button>
                )}
            </div>

            <section style={{ marginBottom: '4rem' }}>
                {isEditing ? (
                    <div style={{ display: 'grid', gap: '1rem' }}>
                        <textarea
                            value={tempContent}
                            onChange={(e) => setTempContent(e.target.value)}
                            style={{
                                width: '100%', minHeight: '300px', padding: '1.5rem', borderRadius: '16px',
                                background: 'rgba(255,255,255,0.05)', color: 'inherit', border: '1px solid var(--border-dyn)',
                                fontSize: '1rem', lineHeight: '1.8', outline: 'none'
                            }}
                            placeholder={t('ui.admin.about_placeholder')}
                        />
                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                            <button onClick={() => setIsEditing(false)} style={{ padding: '0.75rem 1.5rem', borderRadius: '12px', background: 'rgba(255,255,255,0.1)', color: 'white', border: 'none', cursor: 'pointer' }}>
                                {t('ui.admin.cancel')}
                            </button>
                            <button onClick={handleSave} style={{ padding: '0.75rem 2rem', borderRadius: '12px', background: 'var(--primary-color)', color: 'white', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>
                                {t('ui.admin.save')}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div style={{ fontSize: '1.1rem', lineHeight: '2', whiteSpace: 'pre-wrap', opacity: 0.9 }}>
                        {config.aboutContent || t('ui.about_default')}
                    </div>
                )}
            </section>

            <section>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.8rem', fontWeight: '700', margin: 0, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        📅 {t('ui.changelog')}
                    </h2>
                    {isLoggedIn && (
                        <button
                            onClick={() => {
                                const content = prompt(t('ui.admin.history_placeholder'));
                                if (content) {
                                    const date = new Date().toISOString().split('T')[0].replace(/-/g, '/');
                                    saveConfig({ ...config, changelog: [{ date, content }, ...(config.changelog || [])] });
                                }
                            }}
                            style={{ padding: '0.4rem 0.8rem', borderRadius: '8px', background: 'rgba(255,255,255,0.1)', color: 'white', border: 'none', fontSize: '0.8rem', cursor: 'pointer' }}
                        >
                            ➕ {t('ui.admin.add_history')}
                        </button>
                    )}
                </div>
                <div style={{ display: 'grid', gap: '1.5rem' }}>
                    {config.changelog && config.changelog.length > 0 ? (
                        config.changelog.map((entry: any, i: number) => (
                            <div key={i} style={{
                                padding: '1.5rem', borderRadius: '16px', background: 'rgba(255,255,255,0.03)',
                                border: '1px solid var(--border-dyn)', position: 'relative'
                            }}>
                                {isLoggedIn && (
                                    <button
                                        onClick={() => {
                                            if (confirm('Delete this entry?')) {
                                                const newChangelog = config.changelog.filter((_: any, idx: number) => idx !== i);
                                                saveConfig({ ...config, changelog: newChangelog });
                                            }
                                        }}
                                        style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '1.2rem' }}
                                    >
                                        ×
                                    </button>
                                )}
                                <div style={{ color: 'var(--primary-color)', fontWeight: 'bold', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                                    {entry.date}
                                </div>
                                <div style={{ lineHeight: '1.6' }}>{entry.content}</div>
                            </div>
                        ))
                    ) : (
                        <p style={{ opacity: 0.5, fontStyle: 'italic' }}>{t('ui.no_changelog')}</p>
                    )}
                </div>
            </section>
        </main>
    );
}
