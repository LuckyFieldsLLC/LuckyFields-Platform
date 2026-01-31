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
        { id: 'all', label: t('ui.dashboard'), icon: '📊', href: '/admin/dashboard' },
        { id: 'Applications', label: t('ui.categories.Applications'), icon: '📱', href: '/admin/dashboard?filter=Applications' },
        { id: 'Media', label: t('ui.categories.Media'), icon: '🎬', href: '/admin/dashboard?filter=Media' },
        { id: 'Creative AI', label: t('ui.categories.Creative AI'), icon: '🤖', href: '/admin/dashboard?filter=Creative%20AI' },
        { id: 'about', label: t('ui.about'), icon: '📖', href: '/about' },
    ];

    const adminMenuItems = isLoggedIn ? [
        { id: 'admin', label: t('ui.admin_panel'), icon: '⚙️', href: '/admin' },
    ] : [];

    const handleLangChange = (newLang: string) => {
        setLang(newLang);
    };

    const getContrastColor = (hexcolor: string) => {
        if (!hexcolor || hexcolor === 'transparent') return 'white';
        const hex = hexcolor.replace('#', '');
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
        return (yiq >= 128) ? 'black' : 'white';
    };

    const hexToRgb = (hex: string) => {
        const h = hex.replace('#', '');
        const r = parseInt(h.substring(0, 2), 16);
        const g = parseInt(h.substring(2, 4), 16);
        const b = parseInt(h.substring(4, 6), 16);
        return `${r}, ${g}, ${b}`;
    };

    const themeClass = config?.themeMode === 'dark' ? 'theme-dark' : 'theme-light';
    const isDark = config?.themeMode === 'dark';
    const auraContrast = getContrastColor(config?.themeColor || '#ffffff');

    useEffect(() => {
        document.body.className = themeClass;
    }, [themeClass]);

    const dynamicStyles = {
        '--primary-color': config?.primaryColor || '#3b82f6',
        '--primary-rgb': hexToRgb(config?.primaryColor || '#3b82f6'),
        '--glass-opacity': config?.bgOpacity ?? 0.7,
        '--text-on-aura': auraContrast,
    } as React.CSSProperties;

    return (
        <div style={{ ...dynamicStyles, display: 'contents' }}>
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
                        {/* Public Menu Items */}
                        <div className="menu-group">
                            <a href="/" className={`nav-item ${pathname === '/' ? 'active' : ''}`}>
                                <span className="nav-icon">🏠</span>
                                <span>{t('ui.home')}</span>
                            </a>
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
                            <a href="#contact" className="nav-item">
                                <span className="nav-icon">📧</span>
                                <span>{t('ui.contact_us')}</span>
                            </a>
                        </div>

                        {/* Admin-only Items Integrated into Sidebar */}
                        {isLoggedIn && (
                            <div className="menu-group admin-group" style={{ marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid var(--border-dyn)' }}>
                                <div style={{ fontSize: '0.7rem', color: 'var(--secondary-text)', padding: '0 1rem 0.5rem', fontWeight: 'bold', textTransform: 'uppercase' }}>
                                    Admin Control
                                </div>
                                {adminMenuItems.map(item => (
                                    <a
                                        key={item.id}
                                        href={item.href}
                                        className={`nav-item ${pathname === item.href ? 'active' : ''}`}
                                    >
                                        <span className="nav-icon">{item.icon}</span>
                                        <span>{item.label}</span>
                                    </a>
                                ))}
                            </div>
                        )}
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
