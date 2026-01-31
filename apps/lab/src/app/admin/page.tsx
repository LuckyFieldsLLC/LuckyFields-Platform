'use client';

import React, { useState, useEffect } from 'react';
import { useConfig } from '@/components/ConfigProvider';
import { SiteConfig } from '../../../../../types/siteConfig';

export default function AdminPage() {
    const { t, config, setConfig, isLoggedIn } = useConfig();
    const [saving, setSaving] = useState(false);
    const [showHelp, setShowHelp] = useState(false);

    useEffect(() => {
        if (isLoggedIn) {
            fetch('/api/admin/config')
                .then(r => r.json())
                .then(setConfig);
        }
    }, [setConfig, isLoggedIn]);

    if (!isLoggedIn) {
        return (
            <div style={{ padding: '4rem', textAlign: 'center' }}>
                <h2>{t('ui.admin.login_title')}</h2>
                <p>{t('ui.admin.login_desc')}</p>
                <a href="/admin/login" style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>
                    {t('ui.admin.login_button')} →
                </a>
            </div>
        );
    }

    const saveConfig = async (newConfig: SiteConfig) => {
        setSaving(true);
        try {
            const res = await fetch('/api/admin/config', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newConfig),
            });
            if (res.ok) {
                setConfig(newConfig);
            }
        } finally {
            setSaving(false);
        }
    };

    if (!config) return <div style={{ padding: '2rem' }}>{t('ui.loading')}</div>;

    const features = [
        { id: 'isInteractiveMode', label: t('ui.admin.features.interactive') },
        { id: 'showZodiac', label: t('ui.admin.features.zodiac') },
        { id: 'showParticles', label: t('ui.admin.features.particles') },
        { id: 'showNews', label: t('ui.admin.features.news') },
        { id: 'isGyroEnabled', label: t('ui.admin.features.gyro') }
    ];

    return (
        <main style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: '800', margin: 0 }}>{t('ui.admin_panel')}</h1>
                <button
                    onClick={() => setShowHelp(!showHelp)}
                    style={{
                        padding: '0.5rem 1rem',
                        borderRadius: '20px',
                        background: showHelp ? 'var(--primary-color)' : 'rgba(255,255,255,0.1)',
                        border: 'none',
                        color: 'white',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                    }}
                >
                    {showHelp ? t('ui.admin.close_help') : t('ui.admin.show_help')}
                </button>
            </div>

            {showHelp && (
                <div style={{
                    background: 'rgba(59, 130, 246, 0.1)',
                    border: '1px solid var(--primary-color)',
                    padding: '1.5rem',
                    borderRadius: '12px',
                    marginBottom: '2rem',
                    lineHeight: '1.6'
                }}>
                    <h3 style={{ marginTop: 0 }}>{t('ui.about_advanced_settings')}</h3>
                    <p>{t('ui.advanced_settings_help')}</p>
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>

                {/* Left Column: UI Features */}
                <div style={{ display: 'grid', gap: '2rem' }}>
                    <section style={{ background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <h3 style={{ marginTop: 0, marginBottom: '1.5rem', opacity: 0.7 }}>{t('ui.admin.feature_toggles')}</h3>
                        <div style={{ display: 'grid', gap: '1.25rem' }}>
                            {features.map(f => (
                                <div key={f.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontWeight: '600' }}>{f.label}</span>
                                        <button
                                            onClick={() => saveConfig({ ...config, [f.id]: !config[f.id as keyof SiteConfig] })}
                                            style={{
                                                padding: '0.4rem 1rem',
                                                borderRadius: '15px',
                                                border: 'none',
                                                background: config[f.id as keyof SiteConfig] ? '#10b981' : 'rgba(255,255,255,0.1)',
                                                color: 'white',
                                                cursor: 'pointer',
                                                fontSize: '0.75rem',
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            {config[f.id as keyof SiteConfig] ? t('ui.admin.status_on') : t('ui.admin.status_off')}
                                        </button>
                                    </div>
                                    {showHelp && (
                                        <p style={{ margin: 0, fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', fontStyle: 'italic' }}>
                                            💡 {t(`ui.help.${f.id}`)}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Right Column: Visual Identity & Atmosphere */}
                <div style={{ display: 'grid', gap: '2rem' }}>
                    <section style={{ background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <h3 style={{ marginTop: 0, marginBottom: '1.5rem', opacity: 0.7 }}>{t('ui.admin.visual_identity')}</h3>

                        <div style={{ display: 'grid', gap: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span>{t('ui.admin.primary_color')}</span>
                                <input
                                    type="color"
                                    value={config.primaryColor}
                                    onChange={e => saveConfig({ ...config, primaryColor: e.target.value })}
                                />
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span>{t('ui.admin.aura_color')}</span>
                                <input
                                    type="color"
                                    value={config.themeColor}
                                    onChange={e => saveConfig({ ...config, themeColor: e.target.value })}
                                />
                            </div>

                            <div style={{ display: 'grid', gap: '0.5rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span>{t('ui.admin.glass_opacity')}</span>
                                    <span>{Math.round((config.bgOpacity || 0) * 100)}%</span>
                                </div>
                                <input
                                    type="range" min="0" max="1" step="0.05"
                                    value={config.bgOpacity || 0}
                                    onChange={e => saveConfig({ ...config, bgOpacity: parseFloat(e.target.value) || 0 })}
                                    style={{ width: '100%' }}
                                />
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span>{t('ui.admin.theme_mode')}</span>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    {['light', 'dark'].map(m => (
                                        <button
                                            key={m}
                                            onClick={() => saveConfig({ ...config, themeMode: m as any })}
                                            style={{
                                                padding: '0.3rem 0.6rem',
                                                borderRadius: '4px',
                                                border: '1px solid rgba(255,255,255,0.1)',
                                                background: config.themeMode === m ? 'white' : 'transparent',
                                                color: config.themeMode === m ? 'black' : 'white',
                                                cursor: 'pointer',
                                                fontSize: '0.7rem'
                                            }}
                                        >
                                            {m.toUpperCase()}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>

                    <section style={{ background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <h3 style={{ marginTop: 0, marginBottom: '1.5rem', opacity: 0.7 }}>{t('ui.admin.atmosphere')}</h3>
                        <div style={{ display: 'grid', gap: '1rem' }}>
                            <span>{t('ui.admin.spirit_mode')}</span>
                            <select
                                value={config.activeEvent}
                                onChange={e => saveConfig({ ...config, activeEvent: e.target.value })}
                                style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', background: 'rgba(255,255,255,0.1)', color: 'white', border: 'none' }}
                            >
                                <option value="Normal">{t('ui.admin.event_normal')}</option>
                                <option value="Blessing">{t('ui.admin.event_blessing')}</option>
                                <option value="Event">{t('ui.admin.event_special')}</option>
                            </select>
                            {showHelp && (
                                <p style={{ margin: 0, fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>
                                    💡 {t('ui.spirit_mode_desc')}
                                </p>
                            )}
                        </div>
                    </section>
                </div>
            </div>

            {saving && (
                <div style={{
                    position: 'fixed', bottom: '2rem', right: '2rem',
                    background: 'var(--primary-color)', color: 'white',
                    padding: '0.75rem 1.5rem', borderRadius: '30px', fontWeight: 'bold',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                }}>
                    {t('ui.admin.saving')}
                </div>
            )}

            <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                <a href="/admin/dashboard" style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none', fontSize: '0.875rem' }}>{t('ui.admin.back_to_dashboard')}</a>
            </div>
        </main>
    );
}
