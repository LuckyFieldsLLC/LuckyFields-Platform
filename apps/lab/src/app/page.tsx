'use client';

import React, { useState } from 'react';
import { useConfig } from '@/components/ConfigProvider';
import NewsSection from '@/components/NewsSection';
import ContactModal from '@/components/ContactModal';

export default function Home() {
  const { config, t } = useConfig();
  const [isContactOpen, setIsContactOpen] = useState(false);

  if (!config) return null;

  return (
    <div className="page-container">
      {/* Interactive Experience Layer (Spirit / Constellations) */}
      {config.isInteractiveMode && (
        <div className="interactive-layer">
          <div className="spirit">✨</div>
          {config.showZodiac && <div className="stars">✨ Constellation Overlay ✨</div>}
          {config.showParticles && <div className="particles">◌ ◌ ◌</div>}
        </div>
      )}

      {/* Main UI Layer */}
      <div className="content-layer">
        <div className="glass-panel">
          <h1 className="gradient-text">
            {config.isInteractiveMode ? 'LuckyFields.Lab' : t('ui.coming_soon')}
          </h1>
          <p className="description">
            {config.isInteractiveMode
              ? t('ui.hub_description') || 'Welcome to the unified creator hub. Explore our projects, media, and experiments.'
              : t('ui.coming_soon_description') || 'LuckyFields.Lab is evolving. Stay tuned for a new way to explore our creative output.'}
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button className="primary-btn" onClick={() => setIsContactOpen(true)}>
              {t('ui.contact_us')}
            </button>
          </div>
        </div>

        {config.showNews && <NewsSection />}
      </div>

      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />

      <style jsx>{`
        .page-container {
          position: relative;
          min-height: 80vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .interactive-layer {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          pointer-events: none;
          z-index: 1;
          overflow: hidden;
        }
        .spirit {
          position: absolute;
          top: 50%; left: 50%;
          font-size: 4rem;
          animation: wander 20s infinite alternate ease-in-out;
        }
        @keyframes wander {
          0% { transform: translate(-20vw, -20vh); opacity: 0.5; }
          100% { transform: translate(20vw, 20vh); opacity: 0.8; }
        }
        .stars {
          position: absolute;
          top: 10%; width: 100%;
          text-align: center;
          font-size: 2rem;
          opacity: 0.3;
        }
        .particles {
          position: absolute;
          bottom: 10%; width: 100%;
          text-align: center;
          opacity: 0.2;
          font-size: 3rem;
        }
        .content-layer {
          position: relative;
          z-index: 10;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 3rem;
          width: 100%;
          max-width: 800px;
          padding: 2rem;
        }
        .glass-panel {
          padding: 3rem;
          border-radius: 32px;
          background: rgba(255, 255, 255, var(--glass-opacity, 0.7));
          border: 1px solid var(--card-border);
          backdrop-filter: blur(20px);
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.05);
          text-align: center;
          width: 100%;
        }
        .gradient-text {
          font-size: 3.5rem;
          font-weight: 900;
          margin-bottom: 1rem;
          background: linear-gradient(135deg, var(--primary-color, #1d4ed8), #6d28d9);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          letter-spacing: -0.02em;
        }
        .description {
          font-size: 1.125rem;
          line-height: 1.7;
          margin-bottom: 2rem;
          opacity: 0.8;
        }
        .primary-btn {
          padding: 0.75rem 2rem;
          background: var(--primary-color, #3b82f6);
          color: white;
          border: none;
          border-radius: 99px;
          font-weight: 700;
          cursor: pointer;
          transition: transform 0.2s;
        }
        .primary-btn:hover { transform: scale(1.05); }
      `}</style>
    </div>
  );
}
