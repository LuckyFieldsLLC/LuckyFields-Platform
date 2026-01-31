'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

interface SiteSettings { site_name: string; default_lang: string; available_langs: string[]; }

export default function AppShell({ children }: { children: React.ReactNode }) {
    const [lang, setLang] = useState('ja');
    const [settings, setSettings] = useState<SiteSettings | null>(null);
    const pathname = usePathname();

    useEffect(() => {
        fetch('/site_settings.json')
            .then(r => r.json())
            .then(s => {
                setSettings(s);
                setLang(localStorage.getItem('preferred_lang') || s.default_lang);
            });
    }, []);

    const menuItems = [
        { id: 'all', label: 'Dashboard', icon: '🏠', href: '/admin/dashboard' },
        { id: 'projects', label: 'Projects', icon: '📂', href: '/admin/dashboard?filter=projects' },
        { id: 'Applications', label: 'Applications', icon: '📱', href: '/admin/dashboard?filter=Applications' },
        { id: 'Media', label: 'Media', icon: '🎬', href: '/admin/dashboard?filter=Media' },
        { id: 'Creative AI', label: 'AI Works', icon: '🤖', href: '/admin/dashboard?filter=Creative%20AI' },
    ];

    const handleLangChange = (newLang: string) => {
        setLang(newLang);
        localStorage.setItem('preferred_lang', newLang);
        window.location.reload();
    };

    return (
        <>
            <header>
                <div className="logo">
                    <a href="/">LuckyFields.Lab</a>
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
        </>
    );
}
