'use client';

import React, { useEffect, useState } from 'react';

export default function AnalyticsDash({ t }: { t: any }) {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/admin/analytics')
            .then(res => res.json())
            .then(data => {
                setStats(data);
                setLoading(false);
            });
    }, []);

    if (loading) return <div>{t('ui.loading')}</div>;

    const countries = Object.entries(stats.countries || {})
        .sort(([, a]: any, [, b]: any) => b - a)
        .slice(0, 5);

    const maxVal = Math.max(...Object.values(stats.countries || { 'none': 0 }) as any[]);

    return (
        <div className="analytics-dash">
            <h3 style={{ marginTop: 0, marginBottom: '1.5rem', opacity: 0.7 }}>📊 {t('ui.admin.analytics.title')}</h3>

            <div className="stat-grid">
                <div className="stat-card">
                    <span className="label">{t('ui.admin.analytics.total_pv')}</span>
                    <span className="value">{stats.totalPV}</span>
                </div>
                <div className="stat-card">
                    <span className="label">{t('ui.admin.analytics.unique_visitors')}</span>
                    <span className="value">{stats.uniqueVisitors}</span>
                </div>
            </div>

            <div className="chart-section">
                <h4>{t('ui.admin.analytics.top_countries')}</h4>
                <div className="bar-chart">
                    {countries.map(([country, count]: any) => (
                        <div key={country} className="bar-item">
                            <span className="country-code">{country}</span>
                            <div className="bar-wrapper">
                                <div className="bar" style={{ width: `${(count / maxVal) * 100}%` }} />
                            </div>
                            <span className="count">{count}</span>
                        </div>
                    ))}
                </div>
            </div>

            <style jsx>{`
                .analytics-dash {
                    display: grid; gap: 1.5rem;
                }
                .stat-grid {
                    display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;
                }
                .stat-card {
                    background: rgba(255,255,255,0.05);
                    padding: 1rem;
                    border-radius: 12px;
                    display: flex;
                    flex-direction: column;
                }
                .label { font-size: 0.75rem; opacity: 0.5; margin-bottom: 0.25rem; }
                .value { font-size: 1.5rem; font-weight: 800; }
                
                .chart-section {
                    background: rgba(255,255,255,0.03);
                    padding: 1rem;
                    border-radius: 12px;
                }
                h4 { margin-top: 0; font-size: 0.8rem; margin-bottom: 1rem; opacity: 0.6; }
                .bar-chart { display: grid; gap: 0.75rem; }
                .bar-item { display: grid; grid-template-columns: 40px 1fr 30px; align-items: center; gap: 0.5rem; font-size: 0.75rem; }
                .bar-wrapper { height: 6px; background: rgba(255,255,255,0.1); border-radius: 3px; overflow: hidden; }
                .bar { height: 100%; background: var(--primary-color); }
                .country-code { font-weight: bold; }
                .count { text-align: right; opacity: 0.5; }
            `}</style>
        </div>
    );
}
