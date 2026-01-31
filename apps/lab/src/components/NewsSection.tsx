'use client';

import React, { useState, useEffect } from 'react';

interface GitHubEvent {
    id: string;
    type: string;
    actor: {
        login: string;
        avatar_url: string;
    };
    repo: {
        name: string;
    };
    created_at: string;
    payload: {
        action?: string;
        ref?: string;
        description?: string;
    };
}

export default function NewsSection() {
    const [events, setEvents] = useState<GitHubEvent[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Replace 'LuckyFieldsLLC' with your actual organization/user name
        fetch('https://api.github.com/users/LuckyFieldsLLC/events/public')
            .then(r => r.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setEvents(data.slice(0, 5));
                }
                setLoading(false);
            })
            .catch(err => {
                console.error('Failed to fetch GitHub events:', err);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="news-loading">Loading activity...</div>;

    return (
        <div className="news-container">
            <h3>Recent Activity</h3>
            <div className="event-list">
                {events.map(event => (
                    <div key={event.id} className="event-card">
                        <div className="event-type">{event.type.replace('Event', '')}</div>
                        <div className="event-details">
                            <span className="repo">{event.repo.name}</span>
                            <span className="date">{new Date(event.created_at).toLocaleDateString()}</span>
                        </div>
                    </div>
                ))}
            </div>

            <style jsx>{`
                .news-container {
                    margin-top: 2rem;
                    padding: 1.5rem;
                    background: var(--glass-bg);
                    border-radius: 16px;
                    border: 1px solid var(--card-border);
                    width: 100%;
                    max-width: 500px;
                }
                h3 {
                    margin: 0 0 1rem 0;
                    font-size: 1.25rem;
                    font-weight: 700;
                }
                .event-list {
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                }
                .event-card {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 0.75rem;
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 8px;
                    font-size: 0.875rem;
                }
                .event-type {
                    font-weight: 600;
                    color: var(--primary-color, #3b82f6);
                }
                .event-details {
                    display: flex;
                    flex-direction: column;
                    align-items: flex-end;
                    gap: 0.25rem;
                }
                .repo {
                    opacity: 0.8;
                }
                .date {
                    font-size: 0.75rem;
                    opacity: 0.5;
                }
                .news-loading {
                    padding: 1rem;
                    text-align: center;
                    opacity: 0.5;
                }
            `}</style>
        </div>
    );
}
