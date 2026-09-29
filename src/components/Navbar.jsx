import React from 'react';
import { ShieldCheck, Play, Pause, Zap, Key, AlertTriangle, RefreshCw, Cpu, Database } from 'lucide-react';
import { FAULT_MODES, INITIAL_EQUIPMENT_LIST } from '../utils/sensorSimulator';

export default function Navbar({
  isStreaming,
  onToggleStream,
  selectedEquipment,
  onSelectEquipment,
  currentFaultMode,
  onSetFaultMode,
  onOpenApiKeyModal,
  hasApiKey
}) {
  return (
    <header className="navbar">
      <div className="nav-brand">
        <div className="brand-icon">
          <Cpu size={24} />
        </div>
        <div>
          <div className="brand-title">AegisMind IoT</div>
          <div className="brand-subtitle">AI PREDICTIVE MAINTENANCE & FAILURE DETECTION</div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
        {/* Equipment Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Database size={16} style={{ color: 'var(--text-muted)' }} />
          <select
            className="form-control"
            style={{ padding: '6px 12px', fontSize: '0.85rem' }}
            value={selectedEquipment.id}
            onChange={(e) => {
              const eq = INITIAL_EQUIPMENT_LIST.find(item => item.id === e.target.value);
              if (eq) onSelectEquipment(eq);
            }}
          >
            {INITIAL_EQUIPMENT_LIST.map((eq) => (
              <option key={eq.id} value={eq.id}>
                {eq.name} ({eq.id})
              </option>
            ))}
          </select>
        </div>

        {/* Fault Injector Dropdown / Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(30, 41, 59, 0.6)', padding: '4px 8px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
          <Zap size={14} style={{ color: 'var(--accent-amber)' }} />
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>FAULT SIMULATOR:</span>
          
          <button
            onClick={() => onSetFaultMode(FAULT_MODES.NORMAL)}
            className={`btn ${currentFaultMode === FAULT_MODES.NORMAL ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '4px 10px', fontSize: '0.75rem' }}
          >
            Normal
          </button>

          <button
            onClick={() => onSetFaultMode(FAULT_MODES.BEARING_WEAR)}
            className={`btn ${currentFaultMode === FAULT_MODES.BEARING_WEAR ? 'btn-danger' : 'btn-secondary'}`}
            style={{ padding: '4px 10px', fontSize: '0.75rem' }}
          >
            Bearing Wear
          </button>

          <button
            onClick={() => onSetFaultMode(FAULT_MODES.MISALIGNMENT)}
            className={`btn ${currentFaultMode === FAULT_MODES.MISALIGNMENT ? 'btn-amber' : 'btn-secondary'}`}
            style={{ padding: '4px 10px', fontSize: '0.75rem' }}
          >
            Misalignment
          </button>

          <button
            onClick={() => onSetFaultMode(FAULT_MODES.THERMAL_OVERLOAD)}
            className={`btn ${currentFaultMode === FAULT_MODES.THERMAL_OVERLOAD ? 'btn-danger' : 'btn-secondary'}`}
            style={{ padding: '4px 10px', fontSize: '0.75rem' }}
          >
            Overheating
          </button>

          <button
            onClick={() => onSetFaultMode(FAULT_MODES.PRESSURE_LEAK)}
            className={`btn ${currentFaultMode === FAULT_MODES.PRESSURE_LEAK ? 'btn-amber' : 'btn-secondary'}`}
            style={{ padding: '4px 10px', fontSize: '0.75rem' }}
          >
            Pressure Leak
          </button>
        </div>

        {/* Telemetry Stream Toggle */}
        <button
          onClick={onToggleStream}
          className={`btn ${isStreaming ? 'btn-secondary' : 'btn-primary'}`}
          style={{ padding: '6px 14px' }}
        >
          {isStreaming ? (
            <>
              <Pause size={14} /> Pause Telemetry
            </>
          ) : (
            <>
              <Play size={14} /> Resume Telemetry
            </>
          )}
        </button>

        {/* Gemini API Key Button */}
        <button
          onClick={onOpenApiKeyModal}
          className="btn btn-secondary"
          style={{ padding: '6px 14px', borderColor: hasApiKey ? 'var(--accent-emerald)' : 'var(--border-subtle)' }}
        >
          <Key size={14} style={{ color: hasApiKey ? 'var(--accent-emerald)' : 'var(--text-muted)' }} />
          {hasApiKey ? 'Gemini API Connected' : 'Configure Gemini AI Key'}
        </button>
      </div>
    </header>
  );
}
