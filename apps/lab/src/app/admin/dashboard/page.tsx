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
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <header style={{ padding: '1rem 2rem', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div className="logo" style={{ fontWeight: '800', fontSize: '1.25rem' }}>LuckyFields.Lab Admin</div>
                <select value={lang} onChange={(e) => { setLang(e.target.value); localStorage.setItem('preferred_lang', e.target.value); window.location.reload(); }}>
                    {data.settings?.available_langs.map(l => <option key={l} value={l}>{l.toUpperCase()}</option>)}
                </select>
            </header>

            <div style={{ display: 'flex', flex: 1 }}>
                <aside className="sidebar" style={{ width: '250px', borderRight: '1px solid rgba(255,255,255,0.1)', padding: '1rem' }}>
                    {menuItems.map(item => (
                        <div
                            key={item.id}
                            className={`nav-item ${currentFilter === item.id ? 'active' : ''}`}
                            onClick={() => setCurrentFilter(item.id)}
                            style={{ padding: '0.75rem 1rem', cursor: 'pointer', borderRadius: '8px', marginBottom: '0.5rem', background: currentFilter === item.id ? 'rgba(255,255,255,0.05)' : 'transparent' }}
                        >
                            <span className="nav-icon" style={{ marginRight: '0.75rem' }}>{item.icon}</span>
                            <span>{item.label}</span>
                        </div>
                    ))}
                </aside>

                <main style={{ flex: 1, padding: '2rem' }}>
                    <h2>{menuItems.find(m => m.id === currentFilter)?.label}</h2>
                    <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem', marginTop: '1.5rem' }}>
                        {data.projects
                            .filter(p => currentFilter === 'all' ? p.featured : (currentFilter === 'projects' ? true : p.category === currentFilter))
                            .map(p => (
                                <div key={p.id} className="card" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '1.5rem', borderRadius: '12px' }}>
                                    <h3>{p.title}</h3>
                                    <p style={{ color: 'rgba(255,255,255,0.6)', margin: '1rem 0' }}>{p.description[lang] || p.description['ja']}</p>
                                </div>
                            ))}
                    </div>
                </main>
            </div>
        </div>
    );
}
