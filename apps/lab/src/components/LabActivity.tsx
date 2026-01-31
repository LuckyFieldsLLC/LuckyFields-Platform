'use client';

import React, { useEffect, useState } from 'react';

export default function LabActivity() {
    const [commits, setCommits] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCommits = async () => {
            try {
                const res = await fetch('https://api.github.com/repos/LuckyFieldsLLC/LuckyFields-Platform/commits?per_page=5');
                const data = await res.json();
                if (Array.isArray(data)) {
                    setCommits(data);
                }
            } catch (e) {
                console.error('Failed to fetch commits', e);
            } finally {
                setLoading(false);
            }
        };
        fetchCommits();
    }, []);

    if (loading) return <div>Loading Activity...</div>;

    return (
        <div className="activity-container">
            <h3>🚀 Lab Activity</h3>
            <div className="commit-list">
                {commits.map((c, i) => (
                    <div key={i} className="commit-item">
                        <span className="date">{new Date(c.commit.author.date).toLocaleDateString()}</span>
                        <span className="message">{c.commit.message.split('\n')[0]}</span>
                    </div>
                ))}
            </div>
            <style jsx>{`
                .activity-container {
                    background: rgba(255, 255, 255, 0.05);
                    padding: 1.5rem;
                    border-radius: 20px;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    width: 100%;
                }
                h3 { margin-top: 0; opacity: 0.7; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.1em; }
                .commit-list { display: grid; gap: 1rem; }
                .commit-item { display: flex; flex-direction: column; font-size: 0.85rem; }
                .date { opacity: 0.4; font-size: 0.7rem; }
                .message { color: var(--primary-color); font-weight: 500; }
            `}</style>
        </div>
    );
}
