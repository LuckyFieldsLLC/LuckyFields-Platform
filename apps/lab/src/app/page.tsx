'use client';

export default function Home() {
  return (
    <div className="coming-soon-content">
      <div className="glass-panel">
        <h1 className="gradient-text">
          Coming Soon:<br />Interactive Experience
        </h1>
        <p className="description">
          LuckyFields.Lab is evolving. Stay tuned for a new way to explore our creative output.
        </p>
        <div className="status-indicator">
          <div className="dot"></div>
          <div className="dot second"></div>
          <div className="dot third"></div>
        </div>
      </div>


      <style jsx>{`
        .coming-soon-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 60vh;
          text-align: center;
          padding: 2rem;
        }

        .glass-panel {
          padding: 4rem 3rem;
          border-radius: 32px;
          background: rgba(255, 255, 255, 0.9);
          border: 1px solid rgba(59, 130, 246, 0.3);
          backdrop-filter: blur(20px);
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.05);
          max-width: 600px;
          width: 100%;
        }

        .gradient-text {
          font-size: 3rem;
          font-weight: 900;
          margin-bottom: 2rem;
          background: linear-gradient(135deg, #1d4ed8, #6d28d9);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          letter-spacing: -0.02em;
          line-height: 1.1;
        }

        .description {
          color: #334155;
          font-size: 1.125rem;
          line-height: 1.7;
          margin-bottom: 2.5rem;
        }

        .status-indicator {
          display: flex;
          gap: 0.75rem;
          justify-content: center;
        }

        .dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #2563eb;
          animation: pulse 2s infinite;
        }

        .dot.second { animation-delay: 0.3s; }
        .dot.third { animation-delay: 0.6s; }

        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.5); opacity: 0.4; }
          100% { transform: scale(1); opacity: 1; }
        }

        .admin-link {
          margin-top: 3rem;
          color: rgba(0, 0, 0, 0.3);
          text-decoration: none;
          font-size: 0.75rem;
          transition: color 0.2s;
        }

        .admin-link:hover {
          color: rgba(0, 0, 0, 0.6);
        }

        @media (max-width: 768px) {
          .gradient-text { font-size: 2.25rem; }
          .glass-panel { padding: 2.5rem 1.5rem; }
        }
      `}</style>
    </div>
  );
}
