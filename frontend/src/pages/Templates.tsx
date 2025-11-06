import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaLayerGroup, 
  FaPaintBrush, 
  FaMountain, 
  FaRobot, 
  FaFire, 
  FaGamepad,
  FaSearch,
  FaArrowRight
} from 'react-icons/fa';
import '../styles/templates.css';

interface Template {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  category: string;
  prompt: string;
  tags: string[];
}

const Templates: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const templates: Template[] = [
    {
      id: '1',
      title: 'Modern UI System',
      description: 'Create a complete UI with inventory, health bar, and menu system',
      icon: FaPaintBrush,
      category: 'UI Design',
      prompt: 'Create a modern UI system with an inventory, health bar, minimap, and main menu. Use clean gradients and smooth animations.',
      tags: ['UI', 'Interface', 'HUD'],
    },
    {
      id: '2',
      title: 'Terrain Generation',
      description: 'Generate realistic terrain with mountains, valleys, and rivers',
      icon: FaMountain,
      category: 'Terrain',
      prompt: 'Generate a realistic terrain with rolling hills, mountains, valleys, and flowing rivers. Add trees and natural vegetation.',
      tags: ['Terrain', 'Environment', 'Nature'],
    },
    {
      id: '3',
      title: 'NPC System',
      description: 'Add intelligent NPCs with dialogue and quests',
      icon: FaRobot,
      category: 'NPCs',
      prompt: 'Create an NPC system with dialogue trees, quest givers, and merchant NPCs. Include pathfinding and basic AI.',
      tags: ['NPCs', 'AI', 'Dialogue'],
    },
    {
      id: '4',
      title: 'Combat System',
      description: 'Build a complete combat system with weapons and abilities',
      icon: FaGamepad,
      category: 'Gameplay',
      prompt: 'Create a combat system with melee and ranged weapons, special abilities, combo attacks, and damage indicators.',
      tags: ['Combat', 'Weapons', 'Gameplay'],
    },
    {
      id: '5',
      title: 'Particle Effects',
      description: 'Add stunning visual effects like explosions and magic',
      icon: FaFire,
      category: 'Effects',
      prompt: 'Create particle effects including explosions, magic spells, smoke trails, and environmental effects like rain and snow.',
      tags: ['Effects', 'Particles', 'VFX'],
    },
    {
      id: '6',
      title: 'Game Loop',
      description: 'Set up round-based gameplay with lobby and scoring',
      icon: FaLayerGroup,
      category: 'Gameplay',
      prompt: 'Create a game loop with a lobby system, round-based gameplay, countdown timers, scoring system, and winner announcements.',
      tags: ['Gameplay', 'Systems', 'Core'],
    },
  ];

  const categories = ['all', ...Array.from(new Set(templates.map(t => t.category)))];

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch = template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleUseTemplate = (template: Template) => {
    // Navigate to chat and pass the template prompt
    navigate('/chat', { state: { prompt: template.prompt } });
  };

  return (
    <div className="templates-page">
      {/* Header */}
      <div className="templates-header">
        <div>
          <h1 className="page-title">
            <span className="emoji">📚</span>
            Template Library
          </h1>
          <p className="page-subtitle">
            Quick-start prompts for common game features
          </p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="templates-controls">
        <div className="search-bar">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="category-filters">
          {categories.map((category) => (
            <button
              key={category}
              className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category === 'all' ? 'All' : category}
            </button>
          ))}
        </div>
      </div>

      {/* Templates Grid */}
      <div className="templates-grid">
        {filteredTemplates.map((template, index) => {
          const Icon = template.icon;
          return (
            <motion.div
              key={template.id}
              className="template-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              {/* Icon */}
              <div className="template-icon">
                <Icon className="icon" />
              </div>

              {/* Content */}
              <div className="template-content">
                <h3 className="template-title">{template.title}</h3>
                <p className="template-description">{template.description}</p>

                {/* Tags */}
                <div className="template-tags">
                  {template.tags.map((tag) => (
                    <span key={tag} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Category Badge */}
                <div className="template-category">{template.category}</div>
              </div>

              {/* Use Button */}
              <motion.button
                className="use-template-btn"
                onClick={() => handleUseTemplate(template)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Use Template
                <FaArrowRight className="arrow-icon" />
              </motion.button>
            </motion.div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredTemplates.length === 0 && (
        <motion.div 
          className="empty-state"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="empty-icon">🔍</div>
          <h3>No templates found</h3>
          <p>Try adjusting your search or filters</p>
        </motion.div>
      )}

      {/* Info Card */}
      <div className="info-card">
        <div className="info-icon">💡</div>
        <div className="info-content">
          <h3>How to use templates</h3>
          <p>
            Click "Use Template" to instantly send the prompt to AI Chat. 
            The AI will build the feature for you and sync it to your Roblox Studio!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Templates;
