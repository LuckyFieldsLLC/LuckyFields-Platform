'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

interface Project { id: string; title: string; category: string; description: Record<string, string>; links: { type: string; url: string }[]; tags: string[]; featured?: boolean; }

import AnalyticsChart from '@/components/AnalyticsChart';

function DashboardContent() {
    const [data, setData] = useState<{ projects: Project[] }>({ projects: [] });
    const [lang, setLang] = useState('ja');
    const searchParams = useSearchParams();
    const currentFilter = searchParams.get('filter') || 'all';

    useEffect(() => {
        setLang(localStorage.getItem('preferred_lang') || 'ja');
        fetch('/projects.json')
            .then(r => r.json())
            .then(projects => setData({ projects }));
    }, []);

    return (
        <div id="dynamic-view">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 className="category-title" style={{ margin: 0 }}>
                    {currentFilter.toUpperCase()}
                </h2>
                <a href="/admin/settings" style={{
                    padding: '0.5rem 1rem',
                    background: 'rgba(255,255,255,0.05)',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    color: 'var(--primary-color)',
                    fontSize: '0.875rem',
                    fontWeight: 'bold',
                    border: '1px solid rgba(255,255,255,0.1)'
                }}>
                    ⚙️ Advanced Settings
                </a>
            </div>

            {currentFilter === 'all' && (
                <div style={{ marginBottom: '3rem' }}>
                    <AnalyticsChart />
                </div>
            )}

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
    );
}

export default function AdminDashboard() {
    return (
        <Suspense fallback={<div>Loading dashboard...</div>}>
            <DashboardContent />
        </Suspense>
    );
}
