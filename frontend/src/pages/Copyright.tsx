import React from 'react';

const Copyright: React.FC = () => {
  const year = new Date().getFullYear();
  return (
    <div style={{ maxWidth: 900, margin: '40px auto', color: 'white', padding: '0 16px' }}>
      <h1 style={{ fontSize: 32, marginBottom: 8 }}>Copyright Notice</h1>
      <p style={{ opacity: 0.8, marginBottom: 24 }}>Last updated: {new Date().toISOString().slice(0, 10)}</p>

      <p>
        © {year} Hideout Bot. All rights reserved. Hideout Bot and associated materials, including the
        website, plugin, branding, documentation, and any proprietary assets, are protected by
        copyright and other intellectual property laws.
      </p>

      <h2 style={{ fontSize: 22, marginTop: 24 }}>Generated Content</h2>
      <p>
        You retain rights to your own projects. Generated outputs may include open or model-derived
        content; you are responsible for ensuring your use complies with third-party terms,
        platform policies (including Roblox), and applicable laws.
      </p>

      <h2 style={{ fontSize: 22, marginTop: 24 }}>Trademarks</h2>
      <p>
        Roblox is a trademark of Roblox Corporation. Hideout Bot is not affiliated with or endorsed by Roblox.
      </p>

      <h2 style={{ fontSize: 22, marginTop: 24 }}>Contact</h2>
      <p>For copyright questions or takedown requests, contact: legal@hideoutbot.lol</p>
    </div>
  );
};

export default Copyright;
