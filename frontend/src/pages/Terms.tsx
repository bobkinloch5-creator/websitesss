import React from 'react';

const Terms: React.FC = () => {
  return (
    <div style={{ maxWidth: 900, margin: '40px auto', color: 'white', padding: '0 16px' }}>
      <h1 style={{ fontSize: 32, marginBottom: 8 }}>Terms of Service</h1>
      <p style={{ opacity: 0.8, marginBottom: 24 }}>Last updated: {new Date().toISOString().slice(0, 10)}</p>

      <h2 style={{ fontSize: 22, marginTop: 24 }}>1. Overview</h2>
      <p>Hideout Bot provides tools to generate Roblox game assets and actions. By using this site, you agree to these Terms.</p>

      <h2 style={{ fontSize: 22, marginTop: 24 }}>2. Accounts</h2>
      <p>You are responsible for maintaining the confidentiality of your account and API keys. Do not share credentials.</p>

      <h2 style={{ fontSize: 22, marginTop: 24 }}>3. Acceptable Use</h2>
      <p>No illegal, harmful, or infringing content. Do not attempt to abuse rate limits, security, or platform policies.</p>

      <h2 style={{ fontSize: 22, marginTop: 24 }}>4. Generated Content</h2>
      <p>Outputs may require review. You are responsible for use of generated content in accordance with Roblox terms and applicable laws.</p>

      <h2 style={{ fontSize: 22, marginTop: 24 }}>5. Payment and Credits</h2>
      <p>Prompt balances or credits, when offered, are non-transferable and may be adjusted to prevent abuse.</p>

      <h2 style={{ fontSize: 22, marginTop: 24 }}>6. Termination</h2>
      <p>We may suspend or terminate access for violations of these Terms or for operational reasons.</p>

      <h2 style={{ fontSize: 22, marginTop: 24 }}>7. Disclaimer</h2>
      <p>Service is provided "as is" without warranties. We are not liable for indirect or consequential damages.</p>

      <h2 style={{ fontSize: 22, marginTop: 24 }}>8. Changes</h2>
      <p>We may update these Terms. Continued use constitutes acceptance of changes.</p>

      <h2 style={{ fontSize: 22, marginTop: 24 }}>Contact</h2>
      <p>For questions, contact: support@hideoutbot.lol</p>
    </div>
  );
};

export default Terms;
