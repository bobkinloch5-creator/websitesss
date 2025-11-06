import React from 'react';
import { Link } from 'react-router-dom';

const Docs: React.FC = () => {
  return (
    <div style={{ maxWidth: 900, margin: '40px auto', color: 'white', padding: '0 16px' }}>
      <h1 style={{ fontSize: 32, marginBottom: 8 }}>Documentation</h1>
      <p style={{ opacity: 0.8, marginBottom: 24 }}>Start here to learn how to use Hideout Bot.</p>

      <h2 style={{ fontSize: 22, marginTop: 24 }}>Guides</h2>
      <ul style={{ lineHeight: 1.8 }}>
        <li><a href="/HOW_AUTO_SYNC_WORKS.md" target="_blank" rel="noreferrer">How Auto Sync Works</a></li>
        <li><a href="/PLUGIN_SETUP.md" target="_blank" rel="noreferrer">Roblox Plugin Setup</a></li>
        <li><a href="/PRODUCTION_SETUP.md" target="_blank" rel="noreferrer">Production Setup</a></li>
        <li><a href="/VERCEL_DEPLOY.md" target="_blank" rel="noreferrer">Vercel Deployment</a></li>
        <li><a href="/DEPLOY_NOW.md" target="_blank" rel="noreferrer">Deploy Now Checklist</a></li>
      </ul>

      <h2 style={{ fontSize: 22, marginTop: 24 }}>Legal</h2>
      <ul style={{ lineHeight: 1.8 }}>
        <li><Link to="/terms">Terms of Service</Link></li>
        <li><Link to="/copyright">Copyright</Link></li>
      </ul>
    </div>
  );
};

export default Docs;
