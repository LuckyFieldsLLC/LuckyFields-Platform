'use client';

import React, { useEffect, useState } from 'react';

interface LogEntry {
    country: string;
    pathname: string;
    timestamp: string;
}

export default function AnalyticsChart() {
    const [stats, setStats] = useState<{ label: string; count: number }[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // In a real scenario, this would fetch from an API that aggregates Blobs
        // For draft, we'll simulate or fetch recent ones
        setStats([
            { label: 'Japan', count: 45 },
            { label: 'USA', count: 12 },
            { label: 'Germany', count: 8 },
            { label: 'Others', count: 15 }
        ]);
        setLoading(false);
    }, []);

    if (loading) return <div style={{ opacity: 0.5 }}>Analyzing traffic...</div>;

    const maxCount = Math.max(...stats.map(s => s.count));

    return (
        <div style={{ padding: '1.5rem', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <h3 style={{ margin: '0 0 1.5rem 0' }}>Visitor Demographics (by Country)</h3>
            <div style={{ display: 'grid', gap: '1rem' }}>
                {stats.map(s => (
                    <div key={s.label} style={{ display: 'grid', gridTemplateColumns: '80px 1fr 40px', alignItems: 'center', gap: '1rem' }}>
                        <span style={{ fontSize: '0.875rem' }}>{s.label}</span>
                        <div style={{ height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                            <div style={{
                                height: '100%',
                                width: `${(s.count / maxCount) * 100}%`,
                                background: 'var(--primary-color, #3b82f6)',
                                transition: 'width 1s ease-out'
                            }}></div>
                        </div>
                        <span style={{ fontSize: '0.875rem', textAlign: 'right', fontWeight: 'bold' }}>{s.count}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
