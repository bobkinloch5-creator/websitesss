import { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';

const templates = [
  {
    id: 1,
    icon: '⚡',
    name: 'UI System',
    category: 'Interface',
    description: 'Create a complete UI system with menus, buttons, and HUD',
    prompt: 'Create a modern UI system with a main menu, pause menu, and in-game HUD with health bar, coins counter, and settings button',
    color: 'gradient-purple'
  },
  {
    id: 2,
    icon: '🗺️',
    name: 'Terrain Generator',
    category: 'World',
    description: 'Generate beautiful terrain with mountains, water, and trees',
    prompt: 'Generate a realistic terrain with rolling hills, a lake in the center, pine trees scattered around, and mountain ranges in the distance',
    color: 'gradient-blue'
  },
  {
    id: 3,
    icon: '👥',
    name: 'NPC System',
    category: 'Characters',
    description: 'Add intelligent NPCs with dialogue and quests',
    prompt: 'Create 3 NPCs: a shop keeper who sells items, a quest giver with 2 quests, and a friendly villager with random dialogue',
    color: 'gradient-pink'
  },
  {
    id: 4,
    icon: '⚔️',
    name: 'Combat System',
    category: 'Gameplay',
    description: 'Build a complete combat system with weapons and abilities',
    prompt: 'Create a combat system with 3 weapons (sword, bow, staff), health system, damage dealing, and special abilities for each weapon',
    color: 'gradient-purple'
  },
  {
    id: 5,
    icon: '🏃',
    name: 'Parkour System',
    category: 'Movement',
    description: 'Advanced movement with wall running and climbing',
    prompt: 'Create a parkour system with wall running, ledge grabbing, double jump, slide, and dash abilities',
    color: 'gradient-blue'
  },
  {
    id: 6,
    icon: '🎮',
    name: 'Game Lobby',
    category: 'Multiplayer',
    description: 'Multiplayer lobby with team selection and matchmaking',
    prompt: 'Build a game lobby with player list, team selection, ready system, map voting, and auto-start when all players are ready',
    color: 'gradient-pink'
  },
  {
    id: 7,
    icon: '💰',
    name: 'Economy System',
    category: 'Systems',
    description: 'Complete economy with shops, currency, and trading',
    prompt: 'Create an economy system with coins, gems, shop with 10 items, daily rewards, and player-to-player trading',
    color: 'gradient-purple'
  },
  {
    id: 8,
    icon: '🏆',
    name: 'Achievement System',
    category: 'Progression',
    description: 'Achievements with rewards and progress tracking',
    prompt: 'Build an achievement system with 15 achievements, progress bars, reward claiming, and notification popups',
    color: 'gradient-blue'
  }
];

export default function Templates() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [copiedId, setCopiedId] = useState(null);
  const router = useRouter();

  const categories = ['All', ...new Set(templates.map(t => t.category))];
  
  const filteredTemplates = selectedCategory === 'All' 
    ? templates 
    : templates.filter(t => t.category === selectedCategory);

  const useTemplate = (template) => {
    // Copy to clipboard
    navigator.clipboard.writeText(template.prompt);
    setCopiedId(template.id);
    setTimeout(() => setCopiedId(null), 2000);
    
    // Navigate to dashboard with the template
    setTimeout(() => {
      router.push('/dashboard');
    }, 500);
  };

  return (
    <Layout>
      <div className="templates-container">
        <div className="templates-header">
          <h1 className="templates-title">📚 Template Library</h1>
          <p className="templates-subtitle">
            Pre-built prompts to quickly create common game features
          </p>
        </div>

        <div className="category-filters">
          {categories.map(category => (
            <button
              key={category}
              className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="templates-grid">
          {filteredTemplates.map(template => (
            <div 
              key={template.id}
              className={`template-card card-glow ${template.color}`}
              onClick={() => useTemplate(template)}
            >
              <div className="template-icon">{template.icon}</div>
              <h3 className="template-name">{template.name}</h3>
              <div className="template-category">{template.category}</div>
              <p className="template-description">{template.description}</p>
              <div className="template-prompt">
                <code>{template.prompt}</code>
              </div>
              {copiedId === template.id && (
                <div className="copied-badge">✓ Copied!</div>
              )}
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .templates-container {
          padding: 32px;
          max-width: 1400px;
          margin: 0 auto;
        }

        .templates-header {
          text-align: center;
          margin-bottom: 48px;
        }

        .templates-title {
          font-size: 48px;
          font-weight: 800;
          margin-bottom: 16px;
        }

        .templates-subtitle {
          font-size: 20px;
          color: var(--text-muted);
        }

        .category-filters {
          display: flex;
          gap: 12px;
          justify-content: center;
          margin-bottom: 48px;
          flex-wrap: wrap;
        }

        .category-btn {
          padding: 8px 20px;
          background: var(--surface);
          border: 2px solid var(--border);
          border-radius: 24px;
          color: var(--text);
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .category-btn:hover {
          background: var(--surface-light);
          transform: translateY(-2px);
        }

        .category-btn.active {
          background: var(--primary);
          border-color: var(--primary);
          color: white;
        }

        .templates-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 24px;
        }

        .template-card {
          padding: 28px;
          cursor: pointer;
          position: relative;
          transition: all 0.3s;
          color: white;
        }

        .template-card:hover {
          transform: translateY(-8px) scale(1.02);
        }

        .template-icon {
          font-size: 48px;
          margin-bottom: 16px;
        }

        .template-name {
          font-size: 24px;
          font-weight: 700;
          margin-bottom: 8px;
        }

        .template-category {
          display: inline-block;
          padding: 4px 12px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
          margin-bottom: 12px;
        }

        .template-description {
          margin-bottom: 16px;
          opacity: 0.9;
        }

        .template-prompt {
          background: rgba(0, 0, 0, 0.3);
          padding: 12px;
          border-radius: 8px;
          font-size: 13px;
          margin-top: 16px;
        }

        .template-prompt code {
          color: white;
          line-height: 1.5;
        }

        .copied-badge {
          position: absolute;
          top: 16px;
          right: 16px;
          background: #4ade80;
          color: #0a0a0f;
          padding: 6px 12px;
          border-radius: 20px;
          font-weight: 600;
          font-size: 14px;
          animation: fadeIn 0.3s;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @media (max-width: 768px) {
          .templates-grid {
            grid-template-columns: 1fr;
          }

          .templates-title {
            font-size: 32px;
          }
        }
      `}</style>
    </Layout>
  );
}
