export default function ActionViewer({ actions = [] }) {
  if (actions.length === 0) return null;

  return (
    <div className="action-viewer">
      <h3 className="action-viewer-title">📋 Recent Actions</h3>
      <div className="action-list">
        {actions.map((action, index) => (
          <div 
            key={index} 
            className={`action-item ${action.type === 'error' ? 'error' : action.type === 'warning' ? 'warning' : ''}`}
          >
            <span className="action-icon">
              {action.type === 'error' ? '❌' : action.type === 'warning' ? '⚠️' : '✅'}
            </span>
            <span className="action-text">{action.message}</span>
            <span className="action-time">
              {new Date(action.timestamp).toLocaleTimeString()}
            </span>
          </div>
        ))}
      </div>

      <style jsx>{`
        .action-list {
          max-height: 200px;
          overflow-y: auto;
        }

        .action-item {
          display: flex;
          align-items: center;
          gap: 12px;
          transition: all 0.2s;
        }

        .action-item:hover {
          transform: translateX(4px);
        }

        .action-icon {
          font-size: 16px;
        }

        .action-text {
          flex: 1;
        }

        .action-time {
          font-size: 12px;
          color: var(--text-muted);
        }
      `}</style>
    </div>
  );
}
