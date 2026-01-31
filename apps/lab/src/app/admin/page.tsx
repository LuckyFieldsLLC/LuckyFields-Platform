'use client';

import { useState, useEffect } from 'react';
import { SiteConfig } from '../../../../../types/siteConfig';

export default function AdminPage() {
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
            <h1 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '2rem' }}>Admin Control Panel</h1>

            <div style={{ display: 'grid', gap: '2rem', background: 'rgba(255,255,255,0.03)', padding: '2rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>

                {/* Gyroscope Toggle */}
                <section style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h3 style={{ margin: 0 }}>Gyroscope Interaction</h3>
                        <p style={{ margin: '0.25rem 0 0', color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem' }}>Enable/Disable mobile gyro effects</p>
                    </div>
                    <button
                        onClick={() => saveConfig({ ...config, isGyroEnabled: !config.isGyroEnabled })}
                        style={{
                            padding: '0.5rem 1.5rem',
                            borderRadius: '20px',
                            border: 'none',
                            background: config.isGyroEnabled ? '#10b981' : 'rgba(255,255,255,0.1)',
                            color: 'white',
                            cursor: 'pointer',
                            fontWeight: '600',
                            transition: 'background 0.2s'
                        }}
                    >
                        {config.isGyroEnabled ? 'ON' : 'OFF'}
                    </button>
                </section>

                {/* Color Picker */}
                <section style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h3 style={{ margin: 0 }}>Background Aura Color</h3>
                        <p style={{ margin: '0.25rem 0 0', color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem' }}>Select the primary ambient color</p>
                    </div>
                    <input
                        type="color"
                        value={config.themeColor}
                        onChange={(e) => saveConfig({ ...config, themeColor: e.target.value })}
                        style={{ width: '60px', height: '40px', border: 'none', background: 'none', cursor: 'pointer' }}
                    />
                </section>

                {/* Spirit Mode Select */}
                <section style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h3 style={{ margin: 0 }}>Current Spirit Mode</h3>
                        <p style={{ margin: '0.25rem 0 0', color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem' }}>Change the atmosphere intensity</p>
                    </div>
                    <select
                        value={config.activeEvent}
                        onChange={(e) => saveConfig({ ...config, activeEvent: e.target.value })}
                        style={{
                            padding: '0.5rem 1rem',
                            borderRadius: '8px',
                            background: 'rgba(255,255,255,0.1)',
                            color: 'white',
                            border: '1px solid rgba(255,255,255,0.2)',
                            cursor: 'pointer'
                        }}
                    >
                        <option value="Normal">Normal</option>
                        <option value="Blessing">Blessing</option>
                        <option value="Event">Event</option>
                    </select>
                </section>

                {/* Theme Mode Toggle */}
                <section style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h3 style={{ margin: 0 }}>Theme Mode</h3>
                        <p style={{ margin: '0.25rem 0 0', color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem' }}>Switch between Light and Dark interface</p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                            onClick={() => saveConfig({ ...config, themeMode: 'light' })}
                            style={{
                                padding: '0.5rem 1rem',
                                borderRadius: '8px',
                                border: '1px solid rgba(255,255,255,0.1)',
                                background: config.themeMode === 'light' ? '#fff' : 'rgba(255,255,255,0.05)',
                                color: config.themeMode === 'light' ? '#000' : '#fff',
                                cursor: 'pointer',
                                fontWeight: '600'
                            }}
                        >
                            LIGHT
                        </button>
                        <button
                            onClick={() => saveConfig({ ...config, themeMode: 'dark' })}
                            style={{
                                padding: '0.5rem 1rem',
                                borderRadius: '8px',
                                border: '1px solid rgba(255,255,255,0.1)',
                                background: config.themeMode === 'dark' ? '#334155' : 'rgba(255,255,255,0.05)',
                                color: '#fff',
                                cursor: 'pointer',
                                fontWeight: '600'
                            }}
                        >
                            DARK
                        </button>
                    </div>
                </section>

            </div>

            {saving && <p style={{ marginTop: '1rem', color: '#3b82f6', textAlign: 'center' }}>Updating configuration...</p>}

            <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                <a href="/admin/dashboard" style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none', fontSize: '0.875rem' }}>← Go to Dashboard UI</a>
            </div>
        </main>
    );
}
