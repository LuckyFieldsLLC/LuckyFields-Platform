'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

interface Project { id: string; title: string; category: string; description: Record<string, string>; links: { type: string; url: string }[]; tags: string[]; featured?: boolean; }

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
            <h2 className="category-title" style={{ marginBottom: '2rem' }}>
                {currentFilter.toUpperCase()}
            </h2>
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
