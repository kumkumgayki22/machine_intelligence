import React, { useState } from 'react';
import { Key, Shield, Check, X } from 'lucide-react';

export default function ApiKeyModal({ isOpen, onClose, apiKey, onSaveApiKey }) {
  const [inputKey, setInputKey] = useState(apiKey || '');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveApiKey(inputKey.trim());
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Key className="glow-cyan" size={20} style={{ color: 'var(--accent-cyan)' }} />
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: 600 }}>
              Gemini AI API Configuration
            </h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
          Provide your Google Gemini API key to enable live online inference with Gemini 1.5 Flash. If left blank, AegisMind uses its built-in high-fidelity GenAI reasoning engine for offline simulation.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Gemini API Key</label>
            <input
              type="password"
              className="form-control"
              placeholder="AIzaSy..."
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1.5rem' }}>
            <button
              type="button"
              onClick={() => {
                setInputKey('');
                onSaveApiKey('');
                onClose();
              }}
              className="btn btn-secondary"
            >
              Use Built-in GenAI Simulation
            </button>
            <button type="submit" className="btn btn-primary">
              <Check size={16} /> Save API Key
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
