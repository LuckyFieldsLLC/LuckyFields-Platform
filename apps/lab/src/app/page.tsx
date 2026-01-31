export default function Home() {
    return (
        <main className="coming-soon-container">
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

            <a href="/admin" className="admin-link">Admin Access</a>

            <style jsx>{`
        .coming-soon-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
          width: 100vw;
          position: fixed;
          top: 0;
          left: 0;
          z-index: 10000;
          background: #0f172a;
          text-align: center;
          padding: 2rem;
        }

        .glass-panel {
          padding: 4rem 3rem;
          border-radius: 32px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          box-shadow: 0 20px 50px rgba(0,0,0,0.5);
          maxWidth: 600px;
        }

        .gradient-text {
          font-size: 3.5rem;
          font-weight: 900;
          margin-bottom: 2rem;
          background: linear-gradient(135deg, #60a5fa, #a855f7);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          letter-spacing: -0.02em;
          line-height: 1.1;
        }

        .description {
          color: rgba(248, 250, 252, 0.6);
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
          background: #3b82f6;
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
          position: fixed;
          bottom: 2rem;
          color: rgba(255,255,255,0.2);
          text-decoration: none;
          font-size: 0.75rem;
          transition: color 0.2s;
        }

        .admin-link:hover {
          color: rgba(255,255,255,0.6);
        }
      `}</style>

            <style jsx global>{`
        /* Kill the global grid on this specific page */
        #app { 
          display: block !important; 
          padding: 0 !important; 
          grid-template-areas: none !important;
          grid-template-columns: none !important;
        }
      `}</style>
        </main>
    );
}
