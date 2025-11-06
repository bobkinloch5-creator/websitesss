import Link from 'next/link';

import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [promptBalance, setPromptBalance] = useState(100);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
    // Mock prompt balance - would be fetched from API
    if (token) {
      setPromptBalance(100);
    }
  }, [router.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    router.push('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link href="/">
          <a className="navbar-brand">🏝️ Hideout Bot</a>
        </Link>
        <div className="navbar-menu">
          {isLoggedIn ? (
            <>
              <Link href="/dashboard">
                <a className="navbar-link">📁 Dashboard</a>
              </Link>
              <Link href="/templates">
                <a className="navbar-link">📚 Templates</a>
              </Link>
              <Link href="/profile">
                <a className="navbar-link">👤 Profile</a>
              </Link>
              <div className="prompt-badge">
                ⚡ {promptBalance} prompts
              </div>
              <button onClick={handleLogout} className="btn btn-secondary">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login">
                <a className="navbar-link">Login</a>
              </Link>
              <Link href="/register">
                <a className="btn btn-gradient">Register</a>
              </Link>
            </>
          )}
        </div>
      </div>

      <style jsx>{`
        .prompt-badge {
          background: linear-gradient(135deg, var(--primary), var(--secondary));
          padding: 6px 16px;
          border-radius: 20px;
          font-weight: 600;
          font-size: 14px;
        }

        .btn-secondary {
          background: rgba(255, 255, 255, 0.1);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.2);
          padding: 8px 20px;
          border-radius: 24px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-secondary:hover {
          background: rgba(255, 255, 255, 0.15);
          border-color: rgba(255, 255, 255, 0.3);
          transform: translateY(-2px);
        }
      `}</style>
    </nav>
  );
}
