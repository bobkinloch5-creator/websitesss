import React, { useCallback, useEffect, useMemo, useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'https://www.hideoutbot.lol';

function withTimeout<T>(p: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('timeout')), ms);
    p.then((v) => {
      clearTimeout(timer);
      resolve(v);
    }).catch((e) => {
      clearTimeout(timer);
      reject(e);
    });
  });
}

const OfflineBanner: React.FC = () => {
  const [offline, setOffline] = useState<boolean>(false);
  const [checking, setChecking] = useState<boolean>(false);

  const healthUrl = useMemo(() => `${API_URL.replace(/\/$/, '')}/api/health`, []);

  const check = useCallback(async () => {
    try {
      setChecking(true);
      await withTimeout(fetch(healthUrl, { method: 'GET' }), 6000);
      setOffline(false);
    } catch {
      setOffline(true);
    } finally {
      setChecking(false);
    }
  }, [healthUrl]);

  useEffect(() => {
    check();
    const id = setInterval(check, 20000);
    return () => clearInterval(id);
  }, [check]);

  if (!offline) return null;

  return (
    <div style={{ position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, background: 'rgba(239,68,68,0.12)', borderTop: '1px solid rgba(239,68,68,0.35)', padding: '10px 16px', color: '#fecaca', backdropFilter: 'blur(6px)' }}>
      <span style={{ color: '#fecaca' }}>Backend is unreachable. The app will still work for browsing, but live features are offline.</span>
      <button onClick={check} disabled={checking} style={{ background: '#ef4444', color: 'white', border: 'none', borderRadius: 6, padding: '8px 12px', cursor: 'pointer', opacity: checking ? 0.7 : 1 }}>
        {checking ? 'Checking…' : 'Retry'}
      </button>
    </div>
  );
};

export default OfflineBanner;
