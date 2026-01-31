'use client';

import React, { useState } from 'react';
import { useConfig } from './ConfigProvider';

export default function ContactModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const { t } = useConfig();
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <button className="close-btn" onClick={onClose}>&times;</button>
                <h2>{t('ui.contact_us')}</h2>
                <form name="contact" method="POST" data-netlify="true">
                    <input type="hidden" name="form-name" value="contact" />
                    <div className="form-group">
                        <label htmlFor="name">{t('ui.name') || 'Name'}</label>
                        <input type="text" id="name" name="name" required placeholder={t('ui.name_placeholder') || 'Your Name'} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">{t('ui.email') || 'Email'}</label>
                        <input type="email" id="email" name="email" required placeholder="your@email.com" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="message">{t('ui.message') || 'Message'}</label>
                        <textarea id="message" name="message" required placeholder={t('ui.message_placeholder') || 'How can we help?'}></textarea>
                    </div>
                    <button type="submit" className="submit-btn">{t('ui.send_message') || 'Send Message'}</button>
                </form>
            </div>

            <style jsx>{`
                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.7);
                    backdrop-filter: blur(8px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 2000;
                }
                .modal-content {
                    background: var(--background, #f8fafc);
                    color: var(--foreground, #334155);
                    padding: 2.5rem;
                    border-radius: 24px;
                    width: 100%;
                    max-width: 450px;
                    position: relative;
                    border: 1px solid var(--card-border, rgba(0,0,0,0.1));
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
                }
                .close-btn {
                    position: absolute;
                    top: 1rem;
                    right: 1.5rem;
                    background: none;
                    border: none;
                    font-size: 2rem;
                    color: var(--foreground, #334155);
                    opacity: 0.5;
                    cursor: pointer;
                }
                h2 {
                    margin-top: 0;
                    margin-bottom: 1.5rem;
                    font-size: 1.75rem;
                    font-weight: 800;
                }
                .form-group {
                    margin-bottom: 1.25rem;
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }
                label {
                    font-size: 0.875rem;
                    font-weight: 600;
                    opacity: 0.8;
                }
                input, textarea {
                    padding: 0.75rem;
                    border-radius: 12px;
                    border: 1px solid var(--card-border, rgba(0,0,0,0.1));
                    background: rgba(255, 255, 255, 0.05);
                    color: var(--foreground, #334155);
                    font-size: 1rem;
                }
                textarea {
                    min-height: 120px;
                    resize: vertical;
                }
                .submit-btn {
                    width: 100%;
                    padding: 1rem;
                    margin-top: 1rem;
                    border-radius: 12px;
                    border: none;
                    background: var(--primary-color, #3b82f6);
                    color: white;
                    font-weight: 700;
                    cursor: pointer;
                    transition: transform 0.2s;
                }
                .submit-btn:hover {
                    transform: translateY(-2px);
                }
            `}</style>
        </div>
    );
}
