import { useState } from 'react';

export default function PromptInput({ onSubmit, disabled }) {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (prompt.trim() && !disabled) {
      onSubmit(prompt);
      setPrompt('');
    }
  };

  return (
    <div className="prompt-container">
      <form onSubmit={handleSubmit} className="prompt-input-wrapper">
        <textarea
          className="prompt-textarea"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe what you want to build... (e.g., 'Create a racing game with 3 cars and a track')"
          disabled={disabled}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        />
        <button 
          type="submit" 
          className="prompt-submit-btn"
          disabled={disabled || !prompt.trim()}
        >
          {disabled ? 'Thinking...' : 'Send Prompt ⚡'}
        </button>
      </form>
      
      <div className="prompt-tips">
        <div className="tip">💡 Tip: Be specific about what you want to create</div>
      </div>

      <style jsx>{`
        .prompt-tips {
          margin-top: 12px;
          padding: 8px 12px;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 8px;
          font-size: 12px;
          color: var(--text-muted);
        }

        .tip {
          display: flex;
          align-items: center;
          gap: 8px;
        }
      `}</style>
    </div>
  );
}
