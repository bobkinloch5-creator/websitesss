import Layout from '../components/Layout';
import Link from 'next/link';

export default function Home() {
  return (
    <Layout>
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            🏝️ Hideout Bot
          </h1>
          <p className="hero-subtitle">
            Build entire Roblox games by chatting with AI. 
            <br />
            Real-time plugin sync. Verified assets. 
            <span className="gradient-text-blue"> No coding required.</span>
          </p>
          <div className="hero-buttons">
            <Link href="/register">
              <a className="btn btn-gradient">
                🚀 Get Started Free
              </a>
            </Link>
            <Link href="/templates">
              <a className="btn btn-secondary">
                📚 Browse Templates
              </a>
            </Link>
          </div>
        </div>

        <div className="features-grid">
          <FeatureCard 
            icon="🧠"
            title="AI Game Builder" 
            desc="Describe your game, get instant results. Our Claude-powered AI understands complex game logic." 
            color="gradient-purple" 
          />
          <FeatureCard 
            icon="✅"
            title="Verified Assets" 
            desc="Only safe, working models and scripts. Every asset is tested and verified." 
            color="gradient-blue" 
          />
          <FeatureCard 
            icon="⚡"
            title="Live Plugin Sync" 
            desc="Changes appear instantly in Roblox Studio. Real-time synchronization." 
            color="gradient-pink" 
          />
        </div>

        <div className="how-it-works">
          <h2 className="section-title">How It Works</h2>
          <div className="steps-grid">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Create a Project</h3>
              <p>Start a new game project with a descriptive name</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h3>Describe What You Want</h3>
              <p>Type what you want to build in plain English</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h3>AI Builds It</h3>
              <p>Watch as AI creates scripts, parts, and game logic</p>
            </div>
            <div className="step">
              <div className="step-number">4</div>
              <h3>Sync to Studio</h3>
              <p>Your game appears instantly in Roblox Studio</p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .hero-section {
          min-height: 100vh;
          padding: 80px 32px 32px;
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          overflow: hidden;
        }

        .hero-content {
          text-align: center;
          max-width: 900px;
          margin: 0 auto 80px;
          animation: fadeInUp 0.8s ease-out;
        }

        .hero-title {
          font-size: 72px;
          font-weight: 900;
          margin-bottom: 24px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          line-height: 1.1;
        }

        .hero-subtitle {
          font-size: 24px;
          color: var(--text-muted);
          margin-bottom: 48px;
          line-height: 1.5;
        }

        .hero-buttons {
          display: flex;
          gap: 20px;
          justify-content: center;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 32px;
          max-width: 1200px;
          margin: 0 auto 120px;
          animation: fadeInUp 0.8s ease-out 0.2s both;
        }

        .how-it-works {
          max-width: 1200px;
          margin: 0 auto;
          padding: 80px 0;
        }

        .section-title {
          font-size: 48px;
          font-weight: 800;
          text-align: center;
          margin-bottom: 64px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .steps-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 48px;
        }

        .step {
          text-align: center;
          animation: fadeInUp 0.8s ease-out 0.4s both;
        }

        .step-number {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          font-weight: 800;
          margin: 0 auto 16px;
        }

        .step h3 {
          font-size: 20px;
          font-weight: 700;
          margin-bottom: 8px;
        }

        .step p {
          color: var(--text-muted);
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 768px) {
          .hero-title {
            font-size: 48px;
          }

          .hero-subtitle {
            font-size: 18px;
          }

          .hero-buttons {
            flex-direction: column;
            align-items: center;
          }

          .features-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </Layout>
  );
}

function FeatureCard({ icon, title, desc, color }) {
  return (
    <div className={`card card-glow ${color}`}>
      <div style={{ fontSize: '48px', marginBottom: '16px' }}>{icon}</div>
      <h3 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '12px', color: 'white' }}>
        {title}
      </h3>
      <p style={{ color: 'rgba(255, 255, 255, 0.9)' }}>{desc}</p>
    </div>
  );
}
