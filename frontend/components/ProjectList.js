export default function ProjectList({ projects, selectedProject, onSelectProject }) {
  return (
    <div className="project-list">
      <h2 className="project-list-title">Projects</h2>
      <div className="project-items">
        {projects.length === 0 ? (
          <div className="empty-state">
            No projects yet. Create your first project to get started!
          </div>
        ) : (
          projects.map(project => (
            <div
              key={project._id}
              className={`project-item ${selectedProject?._id === project._id ? 'active' : ''}`}
              onClick={() => onSelectProject(project)}
            >
              <div className="project-name">📁 {project.name}</div>
              <div className="project-info">
                <span className="project-date">
                  {new Date(project.createdAt).toLocaleDateString()}
                </span>
                <span className={`sync-status ${project.synced ? 'synced' : ''}`}>
                  {project.synced ? '✓' : '○'}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      <style jsx>{`
        .project-list {
          height: 100%;
        }

        .project-items {
          margin-top: 16px;
        }

        .empty-state {
          text-align: center;
          color: var(--text-muted);
          padding: 32px 16px;
          font-size: 14px;
        }

        .project-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 4px;
        }

        .sync-status {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.1);
          font-size: 12px;
        }

        .sync-status.synced {
          background: rgba(74, 222, 128, 0.2);
          color: #4ade80;
        }
      `}</style>
    </div>
  );
}
