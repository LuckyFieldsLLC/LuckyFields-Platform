'use client';

import React, { useState, useEffect } from 'react';
import { SiteConfig } from '../../../../../../types/siteConfig';

export default function SettingsPage() {
    const [config, setConfig] = useState<SiteConfig | null>(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetch('/api/admin/config')
            .then(r => r.json())
            .then(setConfig);
    }, []);

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

    if (!config) return <div style={{ padding: '2rem' }}>Loading settings...</div>;

    return (
        <main style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '2rem' }}>Advanced Settings</h1>

            <div style={{ display: 'grid', gap: '2rem', background: 'rgba(255,255,255,0.03)', padding: '2rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>

                {/* Feature Toggles */}
                <section>
                    <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>Feature Controls</h3>
                    <div style={{ display: 'grid', gap: '1rem' }}>
                        {[
                            { id: 'isInteractiveMode', label: 'Interactive Experience', desc: 'Spirit & Constellation effects' },
                            { id: 'showZodiac', label: '12 Signs Indicator', desc: 'Display zodiac constellations' },
                            { id: 'showParticles', label: 'Particle System', desc: 'Ambient particle effects' },
                            { id: 'showNews', label: 'News Feed', desc: 'GitHub activity section' },
                            { id: 'isGyroEnabled', label: 'Gyroscope', desc: 'Mobile motion effects' }
                        ].map(feature => (
                            <div key={feature.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <h4 style={{ margin: 0 }}>{feature.label}</h4>
                                    <p style={{ margin: 0, fontSize: '0.8rem', opacity: 0.5 }}>{feature.desc}</p>
                                </div>
                                <button
                                    onClick={() => saveConfig({ ...config, [feature.id]: !config[feature.id as keyof SiteConfig] })}
                                    style={{
                                        padding: '0.5rem 1rem',
                                        borderRadius: '20px',
                                        border: 'none',
                                        background: config[feature.id as keyof SiteConfig] ? '#10b981' : 'rgba(255,255,255,0.1)',
                                        color: 'white',
                                        cursor: 'pointer',
                                        fontWeight: '600'
                                    }}
                                >
                                    {config[feature.id as keyof SiteConfig] ? 'ON' : 'OFF'}
                                </button>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Visual Customization */}
                <section>
                    <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>Visual Identity</h3>
                    <div style={{ display: 'grid', gap: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <label>Primary Brand Color</label>
                            <input
                                type="color"
                                value={config.primaryColor}
                                onChange={e => saveConfig({ ...config, primaryColor: e.target.value })}
                                style={{ width: '60px', height: '40px', border: 'none', background: 'none', cursor: 'pointer' }}
                            />
                        </div>
                        <div style={{ display: 'grid', gap: '0.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <label>Background Glass Opacity</label>
                                <span>{Math.round(config.bgOpacity * 100)}%</span>
                            </div>
                            <input
                                type="range"
                                min="0" max="1" step="0.05"
                                value={config.bgOpacity}
                                onChange={e => saveConfig({ ...config, bgOpacity: parseFloat(e.target.value) })}
                                style={{ width: '100%', cursor: 'pointer' }}
                            />
                        </div>
                    </div>
                </section>
            </div>

            {saving && <p style={{ marginTop: '1rem', color: '#3b82f6', textAlign: 'center' }}>Auto-saving changes...</p>}

            <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                <a href="/admin" style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none', fontSize: '0.875rem' }}>← Back to Main Admin</a>
            </div>
        </main>
    );
}
