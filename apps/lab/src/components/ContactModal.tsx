'use client';

import React from 'react';
import { useConfig } from './ConfigProvider';
import { motion, AnimatePresence } from 'framer-motion';

export default function ContactModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const { t } = useConfig() as any;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="modal-root">
                    <motion.div
                        className="modal-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />

                    <motion.div
                        className="modal-content"
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    >
                        <button className="close-btn" onClick={onClose}>&times;</button>

                        <div className="header">
                            <h2>{t('ui.contact_us')}</h2>
                            <p style={{ opacity: 0.5, fontSize: '0.9rem' }}>Send us a message and we'll get back to you soon.</p>
                        </div>

                        <form name="contact" method="POST" data-netlify="true">
                            <input type="hidden" name="form-name" value="contact" />

                            <div className="form-group">
                                <label>Name</label>
                                <input type="text" name="name" required placeholder="Your Name" />
                            </div>

                            <div className="form-group">
                                <label>Email</label>
                                <input type="email" name="email" required placeholder="your@email.com" />
                            </div>

                            <div className="form-group">
                                <label>Message</label>
                                <textarea name="message" required placeholder="How can we help?"></textarea>
                            </div>

                            <button type="submit" className="submit-btn">
                                {t('ui.admin.save')}
                            </button>
                        </form>
                    </motion.div>

                    <style jsx>{`
                        .modal-root {
                            position: fixed;
                            top: 0; left: 0; right: 0; bottom: 0;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            z-index: 1000;
                            padding: 1.5rem;
                        }
                        .modal-overlay {
                            position: absolute;
                            top: 0; left: 0; right: 0; bottom: 0;
                            background: rgba(0, 0, 0, 0.4);
                            backdrop-filter: blur(10px);
                        }
                        .modal-content {
                            position: relative;
                            background: rgba(255, 255, 255, 0.05);
                            backdrop-filter: blur(40px);
                            border: 1px solid rgba(255, 255, 255, 0.1);
                            padding: 3rem;
                            border-radius: 40px;
                            width: 100%;
                            max-width: 500px;
                            box-shadow: 0 40px 100px rgba(0,0,0,0.5);
                            color: white;
                        }
                        .close-btn {
                            position: absolute;
                            top: 1.5rem; right: 2rem;
                            background: none; border: none;
                            color: white; font-size: 2rem;
                            opacity: 0.3; cursor: pointer;
                        }
                        .header { margin-bottom: 2rem; }
                        h2 { font-size: 2rem; font-weight: 800; margin: 0; }
                        
                        .form-group { margin-bottom: 1.5rem; display: grid; gap: 0.5rem; }
                        label { font-size: 0.8rem; font-weight: 600; opacity: 0.5; }
                        input, textarea {
                            background: rgba(255,255,255,0.05);
                            border: 1px solid rgba(255,255,255,0.1);
                            padding: 1rem;
                            border-radius: 16px;
                            color: white;
                            font-size: 1rem;
                            width: 100%;
                            outline: none;
                        }
                        input:focus, textarea:focus {
                            border-color: var(--primary-color);
                        }
                        textarea { min-height: 120px; }
                        
                        .submit-btn {
                            width: 100%;
                            padding: 1rem;
                            background: var(--primary-color);
                            color: white;
                            border: none;
                            border-radius: 99px;
                            font-weight: 800;
                            cursor: pointer;
                            font-size: 1.1rem;
                            box-shadow: 0 10px 20px -5px var(--primary-color);
                            margin-top: 1rem;
                        }
                    `}</style>
                </div>
            )}
        </AnimatePresence>
    );
}
