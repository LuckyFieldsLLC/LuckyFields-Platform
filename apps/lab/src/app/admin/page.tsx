'use client';

import React, { useState, useEffect } from 'react';
import { useConfig } from '@/components/ConfigProvider';
import { SiteConfig } from '../../../../../types/siteConfig';
import AnalyticsDash from '@/components/AnalyticsDash';

export default function AdminPage() {
    const { t, config, setConfig, isLoggedIn, saveConfig, logout } = useConfig() as any;
    const [saving, setSaving] = useState(false);
    const [showHelp, setShowHelp] = useState(false);

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

    if (!config) return <div style={{ padding: '2rem' }}>{t('ui.loading')}</div>;

    const features = [
        { id: 'isInteractiveMode', label: t('ui.admin.features.interactive') },
        { id: 'showZodiac', label: t('ui.admin.features.zodiac') },
        { id: 'showParticles', label: t('ui.admin.features.particles') },
        { id: 'showNews', label: t('ui.admin.features.news') },
        { id: 'isGyroEnabled', label: t('ui.admin.features.gyro') }
    ];

    return (
        <main style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto', minHeight: '100vh' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: '800', margin: 0 }}>{t('ui.admin_panel')}</h1>
                    <p style={{ margin: 0, opacity: 0.5, fontSize: '0.9rem' }}>{t('ui.admin.customization_mode')}</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button onClick={() => setShowHelp(!showHelp)} style={{ padding: '0.5rem 1rem', borderRadius: '20px', background: showHelp ? 'var(--primary-color)' : 'rgba(255,255,255,0.1)', border: 'none', color: 'white', cursor: 'pointer', fontWeight: 'bold' }}>
                        {showHelp ? t('ui.admin.close_help') : t('ui.admin.show_help')}
                    </button>
                    <button onClick={logout} style={{ padding: '0.5rem 1rem', borderRadius: '20px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', color: '#ef4444', cursor: 'pointer', fontWeight: 'bold' }}>
                        {t('ui.admin.logout_button')}
                    </button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2rem' }}>
                {/* Left Column: Analytics & Feature Toggles */}
                <div style={{ display: 'grid', gap: '2rem' }}>
                    <section style={{ background: 'rgba(255,255,255,0.03)', padding: '2rem', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <AnalyticsDash t={t} />
                    </section>

                    <section style={{ background: 'rgba(255,255,255,0.03)', padding: '2rem', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <h3 style={{ marginTop: 0, marginBottom: '1.5rem', opacity: 0.7 }}>{t('ui.admin.feature_toggles')}</h3>
                        <div style={{ display: 'grid', gap: '1rem' }}>
                            {features.map(f => (
                                <div key={f.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span>{f.label}</span>
                                    <button
                                        onClick={() => saveConfig({ ...config, [f.id]: !config[f.id as keyof SiteConfig] })}
                                        style={{ padding: '0.4rem 1rem', borderRadius: '15px', border: 'none', background: config[f.id as keyof SiteConfig] ? 'var(--primary-color)' : 'rgba(255,255,255,0.1)', color: 'white', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.75rem' }}
                                    >
                                        {config[f.id as keyof SiteConfig] ? t('ui.admin.status_on') : t('ui.admin.status_off')}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Right Column: Visual Controls */}
                <div style={{ display: 'grid', gap: '2rem', alignContent: 'start' }}>
                    <section style={{ background: 'rgba(255,255,255,0.03)', padding: '2rem', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <h3 style={{ marginTop: 0, marginBottom: '2rem', opacity: 0.7 }}>🎨 {t('ui.admin.visual_identity')}</h3>

                        <div style={{ display: 'grid', gap: '1.5rem' }}>
                            <div className="control-group">
                                <label>{t('ui.admin.primary_color')}</label>
                                <input type="color" value={config.primaryColor} onChange={e => saveConfig({ ...config, primaryColor: e.target.value })} />
                            </div>

                            <div className="control-group">
                                <label>{t('ui.admin.aura_color')}</label>
                                <input type="color" value={config.auraColor} onChange={e => saveConfig({ ...config, auraColor: e.target.value })} />
                            </div>

                            <div className="control-group">
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <label>{t('ui.admin.primary_glow')}</label>
                                    <span>{config.primaryGlow}px</span>
                                </div>
                                <input type="range" min="0" max="100" value={config.primaryGlow} onChange={e => saveConfig({ ...config, primaryGlow: parseInt(e.target.value) })} />
                            </div>

                            <div className="control-group">
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <label>{t('ui.admin.glass_opacity')}</label>
                                    <span>{Math.round(config.glassOpacity * 100)}%</span>
                                </div>
                                <input type="range" min="0" max="1" step="0.05" value={config.glassOpacity} onChange={e => saveConfig({ ...config, glassOpacity: parseFloat(e.target.value) })} />
                            </div>

                            <div className="control-group">
                                <label>{t('ui.admin.theme_mode')}</label>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    {['light', 'dark'].map(m => (
                                        <button key={m} onClick={() => saveConfig({ ...config, themeMode: m })} style={{ flex: 1, padding: '0.5rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: config.themeMode === m ? 'white' : 'transparent', color: config.themeMode === m ? 'black' : 'white', cursor: 'pointer', fontWeight: 'bold' }}>
                                            {m.toUpperCase()}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>

                    <section style={{ background: 'rgba(255,255,255,0.03)', padding: '2rem', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <h3 style={{ marginTop: 0, marginBottom: '1.5rem', opacity: 0.7 }}>⌛ {t('ui.changelog')}</h3>
                        <a href="/about" style={{ color: 'var(--primary-color)', fontSize: '0.9rem', textDecoration: 'none' }}>
                            {t('ui.admin.edit_content')} (About Page) →
                        </a>
                    </section>
                </div>
            </div>

            <style jsx>{`
                .control-group { display: grid; gap: 0.75rem; }
                label { font-size: 0.9rem; font-weight: 600; opacity: 0.8; }
                input[type="range"] { width: 100%; height: 6px; background: rgba(255,255,255,0.1); border-radius: 3px; appearance: none; cursor: pointer; }
                input[type="color"] { width: 100%; height: 40px; border: none; border-radius: 8px; background: none; cursor: pointer; }
            `}</style>
        </main>
    );
}
