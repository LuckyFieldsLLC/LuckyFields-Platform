'use client';

import React, { useState, useEffect } from 'react';
import { useConfig } from '@/components/ConfigProvider';
import LabActivity from '@/components/LabActivity';
import ContactModal from '@/components/ContactModal';
import MysticLayers from '@/components/MysticLayers';

export default function Home() {
  const { config, t, logout } = useConfig() as any;
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [showUI, setShowUI] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  useEffect(() => {
    // Analytics Logging
    fetch('/api/analytics/log', {
      method: 'POST',
      body: JSON.stringify({
        pathname: '/',
        userAgent: navigator.userAgent,
        country: 'Local' // In production, this would be null and the Edge Function or Server would fill it
      })
    }).catch(err => console.error('Logging failed', err));

    const handleScroll = () => {
      if (window.scrollY > 50 && !showUI) {
        setShowUI(true);
      }
    };

    window.addEventListener('scroll', handleScroll);

    // Auto-show UI if not in interactive mode
    if (config && !config.isInteractiveMode) {
      setShowUI(true);
    }

    return () => window.removeEventListener('scroll', handleScroll);
  }, [config, showUI]);

  const handleTitleClick = () => {
    const newCount = clickCount + 1;
    setClickCount(newCount);
    if (newCount >= 7) {
      window.location.href = '/admin';
    }
  };

  if (!config) return null;

  return (
    <div className="home-root" onClick={() => config.isInteractiveMode && !showUI && setShowUI(true)}>
      {/* Layered Mystical Experience */}
      {config.isInteractiveMode && (
        <MysticLayers config={config} onInteract={() => setShowUI(true)} />
      )}

      {/* Content Layer */}
      <main className={`content-container ${showUI ? 'ui-visible' : 'ui-hidden'}`}>
        <div className="hero-section">
          <h1 className="hero-title" onClick={(e) => { e.stopPropagation(); handleTitleClick(); }}>
            {config.isInteractiveMode ? 'LuckyFields.Lab' : t('ui.coming_soon')}
          </h1>
          <p className="hero-desc">
            {config.isInteractiveMode
              ? t('ui.hub_description')
              : t('ui.coming_soon_description')}
          </p>
          <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
            <button className="cta-btn" onClick={(e) => { e.stopPropagation(); setIsContactOpen(true); }}>
              {t('ui.contact_us')}
            </button>
          </div>
        </div>

        {config.showNews && (
          <div className="activity-section">
            <LabActivity />
          </div>
        )}
      </main>

      {config.isInteractiveMode && showUI && (
        <button className="zen-toggle" onClick={(e) => { e.stopPropagation(); setShowUI(false); }}>
          👁️ Zen Mode
        </button>
      )}

      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />

      <style jsx>{`
                .home-root {
                    position: relative;
                    min-height: 100vh;
                    color: white;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 2rem;
                }
                .content-container {
                    position: relative;
                    z-index: 10;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 4rem;
                    width: 100%;
                    max-width: 800px;
                    transition: all 1s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .ui-hidden {
                    opacity: 0;
                    transform: translateY(20px);
                    pointer-events: none;
                }
                .ui-visible {
                    opacity: 1;
                    transform: translateY(0);
                    pointer-events: auto;
                }
                .zen-toggle {
                    position: fixed;
                    bottom: 2rem;
                    right: 2rem;
                    background: rgba(255,255,255,0.1);
                    border: 1px solid rgba(255,255,255,0.2);
                    color: white;
                    padding: 0.5rem 1.2rem;
                    border-radius: 99px;
                    font-size: 0.8rem;
                    cursor: pointer;
                    z-index: 100;
                    backdrop-filter: blur(10px);
                }
                .hero-section {
                    background: rgba(255, 255, 255, var(--glass-opacity));
                    backdrop-filter: blur(20px);
                    padding: 4rem 3rem;
                    border-radius: 40px;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    text-align: center;
                    box-shadow: 0 40px 100px -20px rgba(0, 0, 0, 0.4),
                                0 0 var(--primary-glow) var(--primary-color);
                    transition: all 0.5s ease;
                }
                .hero-title {
                    font-size: 4rem;
                    font-weight: 900;
                    margin-bottom: 1.5rem;
                    background: linear-gradient(135deg, white, var(--primary-color));
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    letter-spacing: -0.05em;
                }
                .hero-desc {
                    font-size: 1.25rem;
                    line-height: 1.6;
                    margin-bottom: 2.5rem;
                    opacity: 0.7;
                    max-width: 500px;
                    margin-left: auto;
                    margin-right: auto;
                }
                .cta-btn {
                    padding: 1rem 2.5rem;
                    background: var(--primary-color);
                    color: white;
                    border: none;
                    border-radius: 99px;
                    font-weight: 800;
                    cursor: pointer;
                    font-size: 1rem;
                    transition: all 0.3s ease;
                    box-shadow: 0 10px 20px -5px var(--primary-color);
                }
                .cta-btn:hover {
                    transform: translateY(-5px) scale(1.05);
                    box-shadow: 0 20px 40px -10px var(--primary-color);
                }
                .activity-section {
                    width: 100%;
                    max-width: 600px;
                }

                @media (max-width: 768px) {
                    .hero-title { font-size: 2.5rem; }
                    .hero-section { padding: 3rem 1.5rem; }
                }
            `}</style>
    </div>
  );
}
