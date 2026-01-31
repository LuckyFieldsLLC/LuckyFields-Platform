'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useConfig } from './ConfigProvider';

interface SiteSettings { site_name: string; default_lang: string; available_langs: string[]; }

export default function AppShell({ children }: { children: React.ReactNode }) {
    const { config, lang, setLang, t, isLoggedIn, logout } = useConfig();
    const [settings, setSettings] = useState<SiteSettings | null>(null);
    const pathname = usePathname();

    useEffect(() => {
        // Fetch original settings
        fetch('/site_settings.json')
            .then(r => r.json())
            .then(s => {
                setSettings(s);
            });
    }, []);

    const isAdminPath = pathname.startsWith('/admin');

    const menuItems = [
        { id: 'home', label: t('ui.home'), icon: '🏠', href: '/' },
        ...(isLoggedIn ? [
            { id: 'all', label: t('ui.dashboard'), icon: '📊', href: '/admin/dashboard' },
            { id: 'projects', label: t('ui.projects'), icon: '📂', href: '/admin/dashboard?filter=projects' },
            { id: 'Applications', label: t('ui.categories.Applications'), icon: '📱', href: '/admin/dashboard?filter=Applications' },
            { id: 'Media', label: t('ui.categories.Media'), icon: '🎬', href: '/admin/dashboard?filter=Media' },
            { id: 'Creative AI', label: t('ui.categories.Creative AI'), icon: '🤖', href: '/admin/dashboard?filter=Creative%20AI' },
        ] : []),
        { id: 'contact', label: t('ui.contact_us'), icon: '📧', href: '#contact' }
    ];

    const handleLangChange = (newLang: string) => {
        setLang(newLang);
    };

    const getContrastColor = (hexcolor: string) => {
        if (!hexcolor || hexcolor === 'transparent') return 'black'; // Safe default for light theme
        const hex = hexcolor.replace('#', '');
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
        return (yiq >= 150) ? 'black' : 'white'; // Conservative threshold
    };

    const themeClass = config?.themeMode === 'dark' ? 'theme-dark' : 'theme-light';
    const contrastColor = getContrastColor(config?.themeColor || '#ffffff');

    const dynamicStyles = {
        '--primary-color': config?.primaryColor || '#3b82f6',
        '--glass-opacity': config?.bgOpacity ?? 0.7,
        '--text-on-aura': contrastColor,
        '--text-color': contrastColor === 'white' ? '#f8fafc' : '#0f172a',
        '--secondary-text': contrastColor === 'white' ? 'rgba(255,255,255,0.7)' : 'rgba(15,23,42,0.6)',
        '--sidebar-bg': contrastColor === 'white' ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.4)',
        '--header-bg': contrastColor === 'white' ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.7)',
        '--card-bg-dyn': contrastColor === 'white' ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.6)',
        '--border-dyn': contrastColor === 'white' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
    } as React.CSSProperties;

    return (
        <div className={themeClass} style={{ ...dynamicStyles, display: 'contents' }}>
            <header>
                <div className="logo">
                    <a href="/">LuckyFields.Lab</a>
                    <a href="/admin/login" style={{
                        opacity: 0,
                        fontSize: '0.8rem',
                        marginLeft: '2px',
                        cursor: 'default',
                        textDecoration: 'none',
                        color: 'inherit'
                    }}>@</a>
                </div>
                <div id="header-right" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    {isLoggedIn && (
                        <span style={{ fontSize: '0.75rem', color: 'var(--primary-color)', fontWeight: 'bold' }}>
                            {t('ui.admin.customization_mode')}
                        </span>
                    )}
                    <select
                        id="lang-select"
                        value={lang}
                        onChange={(e) => handleLangChange(e.target.value)}
                    >
                        {settings?.available_langs.map(l => (
                            <option key={l} value={l}>{l.toUpperCase()}</option>
                        ))}
                    </select>
                </div>
            </header>

            <aside className="sidebar" id="sidebar">
                <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <div style={{ flex: 1 }}>
                        {menuItems.map(item => (
                            <a
                                key={item.id}
                                href={item.href}
                                className={`nav-item ${pathname === item.href || (pathname === '/admin/dashboard' && item.href.includes(item.id)) ? 'active' : ''}`}
                            >
                                <span className="nav-icon">{item.icon}</span>
                                <span>{item.label}</span>
                            </a>
                        ))}
                    </div>
                    {isLoggedIn && (
                        <div style={{ padding: '1rem', borderTop: '1px solid var(--card-border)' }}>
                            <button
                                onClick={() => logout()}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    borderRadius: '8px',
                                    background: 'rgba(239, 68, 68, 0.1)',
                                    color: '#ef4444',
                                    border: '1px solid rgba(239, 68, 68, 0.2)',
                                    cursor: 'pointer',
                                    fontWeight: 'bold',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.5rem'
                                }}
                            >
                                🚪 {t('ui.admin.logout_button')}
                            </button>
                        </div>
                    )}
                </div>
            </aside>

            <main id="content">
                {children}
            </main>

            <footer>
                <p>© 2026 LuckyFields.LLC - All Rights Reserved.</p>
            </footer>
        </div>
    );
}
