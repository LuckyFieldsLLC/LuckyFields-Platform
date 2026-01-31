'use client';

import { useEffect, useState } from 'react';
import '../../globals.css';

// Reuse types from original main.ts (condensed for now)
interface Project { id: string; title: string; category: string; description: Record<string, string>; links: { type: string; url: string }[]; tags: string[]; featured?: boolean; }
interface SiteSettings { site_name: string; default_lang: string; available_langs: string[]; }

export default function AdminDashboard() {
    const [lang, setLang] = useState('ja');
    const [currentFilter, setCurrentFilter] = useState('all');
    const [data, setData] = useState<{ settings?: SiteSettings, projects: Project[] }>({ projects: [] });

    useEffect(() => {
        // Initial data loading (mocking for now as we transition)
        Promise.all([
            fetch('/site_settings.json').then(r => r.json()),
            fetch('/projects.json').then(r => r.json())
        ]).then(([settings, projects]) => {
            setData({ settings, projects });
            setLang(localStorage.getItem('preferred_lang') || settings.default_lang);
        });
    }, []);

    const menuItems = [
        { id: 'all', label: 'Dashboard', icon: '🏠' },
        { id: 'projects', label: 'Projects', icon: '📂' },
        { id: 'Applications', label: 'Applications', icon: '📱' },
        { id: 'Media', label: 'Media', icon: '🎬' },
        { id: 'Creative AI', label: 'AI Works', icon: '🤖' },
    ];

    return (
        <>
            <header>
                <div className="logo">
                    <a href="/">LuckyFields.Lab Admin</a>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <select
                        id="lang-select"
                        value={lang}
                        onChange={(e) => {
                            setLang(e.target.value);
                            localStorage.setItem('preferred_lang', e.target.value);
                            window.location.reload();
                        }}
                    >
                        {data.settings?.available_langs.map(l => <option key={l} value={l}>{l.toUpperCase()}</option>)}
                    </select>
                </div>
            </header>

            <aside className="sidebar" id="sidebar">
                {menuItems.map(item => (
                    <div
                        key={item.id}
                        className={`nav-item ${currentFilter === item.id ? 'active' : ''}`}
                        onClick={() => setCurrentFilter(item.id)}
                    >
                        <span className="nav-icon">{item.icon}</span>
                        <span>{item.label}</span>
                    </div>
                ))}
            </aside>

            <main id="content">
                <div id="dynamic-view">
                    <h2 className="category-title">{menuItems.find(m => m.id === currentFilter)?.label}</h2>
                    <div className="grid">
                        {data.projects
                            .filter(p => currentFilter === 'all' ? p.featured : (currentFilter === 'projects' ? true : p.category === currentFilter))
                            .map(p => (
                                <div key={p.id} className="card">
                                    <div style={{ marginBottom: '0.5rem', display: 'flex', gap: '0.5rem' }}>
                                        {p.tags.map(t => <span key={t} className="tag">{t}</span>)}
                                    </div>
                                    <h3>{p.title}</h3>
                                    <p>{p.description[lang] || p.description['ja']}</p>
                                </div>
                            ))}
                    </div>
                </div>
            </main>

            <footer>
                <p>© 2026 LuckyFields.LLC - All Rights Reserved.</p>
            </footer>
        </>
    );
}
