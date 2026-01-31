'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useConfig } from './ConfigProvider';

interface SiteSettings { site_name: string; default_lang: string; available_langs: string[]; }

export default function AppShell({ children }: { children: React.ReactNode }) {
    const { config, lang, setLang, t } = useConfig();
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
        ...(isAdminPath ? [
            { id: 'all', label: t('ui.dashboard'), icon: '📊', href: '/admin/dashboard' },
            { id: 'projects', label: t('ui.projects'), icon: '📂', href: '/admin/dashboard?filter=projects' },
            { id: 'Applications', label: t('ui.categories.Applications'), icon: '📱', href: '/admin/dashboard?filter=Applications' },
            { id: 'Media', label: t('ui.categories.Media'), icon: '🎬', href: '/admin/dashboard?filter=Media' },
            { id: 'Creative AI', label: t('ui.categories.Creative AI'), icon: '🤖', href: '/admin/dashboard?filter=Creative%20AI' },
        ] : [])
    ];

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

    const themeClass = config?.themeMode === 'dark' ? 'theme-dark' : 'theme-light';
    const contrastColor = getContrastColor(config?.themeColor || '#3b82f6');

    const dynamicStyles = {
        '--primary-color': config?.primaryColor || '#3b82f6',
        '--glass-opacity': config?.bgOpacity ?? 0.7,
        '--text-on-aura': contrastColor,
        '--text-color': contrastColor === 'white' ? '#f1f5f9' : '#1e293b', // Adapting main text color
        '--secondary-text': contrastColor === 'white' ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)',
    } as React.CSSProperties;

    return (
        <div className={themeClass} style={{ ...dynamicStyles, display: 'contents' }}>
            <header>
                <div className="logo">
                    <a href="/">LuckyFields.Lab</a>
                    <a href="/admin" style={{
                        opacity: 0,
                        fontSize: '0.8rem',
                        marginLeft: '2px',
                        cursor: 'default',
                        textDecoration: 'none',
                        color: 'inherit'
                    }}>@</a>
                </div>
                <div id="header-right" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
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
