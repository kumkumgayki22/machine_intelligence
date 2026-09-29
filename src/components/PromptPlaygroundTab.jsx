import React, { useState } from 'react';
import { Sliders, Code, Play, RotateCcw, Copy, Check, Terminal } from 'lucide-react';

export default function PromptPlaygroundTab({ sensorData }) {
  const [systemPrompt, setSystemPrompt] = useState(
    `You are an expert Senior Industrial Maintenance AI Specialist certified in ISO 10816 Mechanical Vibration, Failure Mode & Effects Analysis (FMEA), and Predictive Reliability Engineering. Analyze the given IoT sensor telemetry snapshot and generate a high-precision diagnostic report with root-cause analysis, ISO severity classification, step-by-step Standard Operating Procedure (SOP), required replacement spare parts, and safety protocols.`
  );

  const [temperature, setTemperature] = useState(0.2);
  const [sensitivitySigma, setSensitivitySigma] = useState(3.0);
  const [copied, setCopied] = useState(false);

  const sampleRequestPayload = {
    model: 'gemini-1.5-flash',
    systemInstruction: systemPrompt,
    telemetryInput: {
      equipmentId: 'EQ-101 (Turbine Compressor #04)',
      timestamp: sensorData.timestamp,
      vibration_rms_mms: sensorData.vibration,
      temperature_celsius: sensorData.temperature,
      pressure_psi: sensorData.pressure,
      acoustic_db: sensorData.acoustic,
      rotor_rpm: sensorData.rpm,
      power_kw: sensorData.power,
      anomaly_score_pct: sensorData.anomalyScore
    },
    generationConfig: {
      temperature: parseFloat(temperature),
      maxOutputTokens: 1024,
      responseMimeType: 'application/json'
    }
  };

  const handleCopyPayload = () => {
    navigator.clipboard.writeText(JSON.stringify(sampleRequestPayload, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="dashboard-grid">
      {/* Left Column: Prompt Tuning Parameters */}
      <div className="col-span-6" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
            <Sliders className="glow-cyan" size={20} style={{ color: 'var(--accent-cyan)' }} />
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 600 }}>
              System Prompt & Hyperparameter Studio
            </h3>
          </div>

          <div className="form-group">
            <label className="form-label">System Persona & Domain Instructions</label>
            <textarea
              className="form-control"
              rows={8}
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <label className="form-label">GenAI Temperature</label>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--accent-cyan)' }}>
                  {temperature}
                </span>
              </div>
              <input
                type="range"
                min="0.0"
                max="1.0"
                step="0.05"
                value={temperature}
                onChange={(e) => setTemperature(e.target.value)}
                style={{ width: '100%', accentColor: 'var(--accent-cyan)' }}
              />
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>0.0 = Deterministic, 1.0 = Creative</span>
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <label className="form-label">Anomaly Sensitivity (σ)</label>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--accent-cyan)' }}>
                  {sensitivitySigma} σ
                </span>
              </div>
              <input
                type="range"
                min="1.0"
                max="5.0"
                step="0.5"
                value={sensitivitySigma}
                onChange={(e) => setSensitivitySigma(e.target.value)}
                style={{ width: '100%', accentColor: 'var(--accent-cyan)' }}
              />
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Z-Score Mahalanobis threshold</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Live JSON Payload Inspector */}
      <div className="col-span-6">
        <div className="glass-panel" style={{ padding: '1.25rem', height: '100%', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', fontWeight: 600 }}>
              <Terminal size={18} style={{ color: 'var(--accent-cyan)' }} />
              Live Gemini API JSON Payload Inspector
            </div>
            <button
              onClick={handleCopyPayload}
              className="btn btn-secondary"
              style={{ padding: '4px 10px', fontSize: '0.75rem' }}
            >
              {copied ? <Check size={12} /> : <Copy size={12} />}
              {copied ? 'Copied' : 'Copy JSON'}
            </button>
          </div>

          <div
            style={{
              flex: 1,
              background: '#030712',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)',
              padding: '1rem',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.8rem',
              color: '#38bdf8',
              overflowY: 'auto',
              maxHeight: '440px'
            }}
          >
            <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
              {JSON.stringify(sampleRequestPayload, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
