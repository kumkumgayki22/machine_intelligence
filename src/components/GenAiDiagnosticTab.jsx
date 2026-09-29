import React, { useState } from 'react';
import { Cpu, ShieldAlert, CheckSquare, Wrench, AlertTriangle, FileText, Send, Sparkles, Clock, CheckCircle, PackageCheck, Globe } from 'lucide-react';
import { generateAiDiagnostic } from '../utils/geminiAi';

export default function GenAiDiagnosticTab({ sensorData, apiKey }) {
  const [loading, setLoading] = useState(false);
  const [diagnosticResult, setDiagnosticResult] = useState(null);
  const [promptTemplate, setPromptTemplate] = useState('ISO_STANDARD');
  const [targetLanguage, setTargetLanguage] = useState('English');
  const [completedSteps, setCompletedSteps] = useState({});
  const [reservedParts, setReservedParts] = useState({});

  // Interactive Technician Chat State
  const [chatMessages, setChatMessages] = useState([
    { sender: 'ai', text: 'Hello! I am AegisMind GenAI Reliability Copilot. Select your language, trigger a diagnosis above, or ask me any question regarding equipment telemetry, failure modes, or repair SOPs.' }
  ]);
  const [chatInput, setChatInput] = useState('');

  const handleRunDiagnosis = async () => {
    setLoading(true);
    setDiagnosticResult(null);
    try {
      const res = await generateAiDiagnostic(sensorData, '', apiKey, targetLanguage);
      setDiagnosticResult(res);
      setCompletedSteps({});
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleStep = (index) => {
    setCompletedSteps((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const togglePartReserve = (partNo) => {
    setReservedParts((prev) => ({ ...prev, [partNo]: !prev[partNo] }));
  };

  const handleSendChat = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput;
    setChatMessages((prev) => [...prev, { sender: 'user', text: userText }]);
    setChatInput('');

    setTimeout(() => {
      let replyText = `[${targetLanguage}] Based on current telemetry (Vib: ${sensorData.vibration} mm/s, Temp: ${sensorData.temperature}°C), ${userText.toLowerCase().includes('torque') ? 'the recommended torque for foot anchor M16 bolts is 210 N·m (155 lb-ft) applied in a cross pattern.' : userText.toLowerCase().includes('defer') || userText.toLowerCase().includes('delay') ? 'Deferring maintenance beyond 24 hours is NOT recommended due to exponential outer-race spall propagation risks under high load.' : 'The AI model recommends following the ISO 10816 Class IV standard guidelines for immediate lockout-tagout containment.'}`;
      setChatMessages((prev) => [...prev, { sender: 'ai', text: replyText }]);
    }, 600);
  };

  return (
    <div className="dashboard-grid">
      {/* Left Column: Diagnostics Configuration & AI Execution */}
      <div className="col-span-4" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
            <Sparkles className="glow-cyan" size={22} style={{ color: 'var(--accent-cyan)' }} />
            <div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 600 }}>
                GenAI Diagnostic Control
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Powered by Gemini Generative AI</p>
            </div>
          </div>

          {/* Language Selector */}
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Globe size={14} style={{ color: 'var(--accent-cyan)' }} /> Report Output Language
            </label>
            <select
              className="form-control"
              value={targetLanguage}
              onChange={(e) => setTargetLanguage(e.target.value)}
            >
              <option value="English">English 🇺🇸</option>
              <option value="Spanish">Spanish 🇪🇸</option>
              <option value="German">German 🇩🇪</option>
              <option value="French">French 🇫🇷</option>
              <option value="Hindi">Hindi 🇮🇳</option>
              <option value="Japanese">Japanese 🇯🇵</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Diagnostic Prompt Profile</label>
            <select
              className="form-control"
              value={promptTemplate}
              onChange={(e) => setPromptTemplate(e.target.value)}
            >
              <option value="ISO_STANDARD">ISO 10816 Mechanical Failure & Root Cause</option>
              <option value="SAFETY_LOTO">Emergency Containment & LOTO Safety SOP</option>
              <option value="FIVE_WHYS">Root Cause Analysis (5-Whys Methodology)</option>
              <option value="PARTS_COST">Spare Parts & Inventory Reservation Plan</option>
            </select>
          </div>

          {/* Current Telemetry Snapshot Summary */}
          <div style={{ background: 'rgba(30, 41, 59, 0.6)', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', marginBottom: '1rem', fontSize: '0.8rem' }}>
            <div style={{ fontWeight: 600, color: 'var(--accent-cyan)', marginBottom: '6px' }}>
              INPUT SNAPSHOT:
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', color: 'var(--text-secondary)' }}>
              <div>Vib: <strong style={{ color: '#fff' }}>{sensorData.vibration} mm/s</strong></div>
              <div>Temp: <strong style={{ color: '#fff' }}>{sensorData.temperature}°C</strong></div>
              <div>Press: <strong style={{ color: '#fff' }}>{sensorData.pressure} PSI</strong></div>
              <div>Acoustic: <strong style={{ color: '#fff' }}>{sensorData.acoustic} dB</strong></div>
            </div>
          </div>

          <button
            onClick={handleRunDiagnosis}
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', padding: '12px', fontSize: '0.95rem', justifyCenter: 'center' }}
          >
            {loading ? (
              <>
                <Cpu className="spin-slow" size={18} /> Generating {targetLanguage} Report...
              </>
            ) : (
              <>
                <Sparkles size={18} /> Run GenAI Diagnosis ({targetLanguage})
              </>
            )}
          </button>
        </div>

        {/* Technician Interactive AI Chat */}
        <div className="glass-panel" style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.75rem', fontWeight: 600, fontSize: '0.9rem' }}>
            <FileText size={16} style={{ color: 'var(--accent-blue)' }} />
            AI Reliability Assistant Chat ({targetLanguage})
          </div>

          <div style={{ flex: 1, maxHeight: '260px', overflowY: 'auto', paddingRight: '4px', display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '0.75rem' }}>
            {chatMessages.map((msg, i) => (
              <div
                key={i}
                style={{
                  alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  background: msg.sender === 'user' ? 'rgba(6,182,212,0.2)' : 'rgba(30,41,59,0.7)',
                  border: '1px solid ' + (msg.sender === 'user' ? 'rgba(6,182,212,0.4)' : 'var(--border-subtle)'),
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.8rem',
                  maxWidth: '85%'
                }}
              >
                {msg.text}
              </div>
            ))}
          </div>

          <form onSubmit={handleSendChat} style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              className="form-control"
              placeholder={`Ask AI in ${targetLanguage}...`}
              style={{ flex: 1, padding: '8px 12px', fontSize: '0.8rem' }}
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
            />
            <button type="submit" className="btn btn-primary" style={{ padding: '8px 12px' }}>
              <Send size={14} />
            </button>
          </form>
        </div>
      </div>

      {/* Right Column: AI Output Report */}
      <div className="col-span-8">
        {!diagnosticResult && !loading && (
          <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            <Cpu size={48} style={{ margin: '0 auto 1rem', color: 'var(--accent-cyan)', opacity: 0.4 }} />
            <h3 style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
              No Active Diagnostic Execution
            </h3>
            <p style={{ fontSize: '0.85rem', maxWidth: '420px', margin: '0 auto 1.5rem' }}>
              Select target language ({targetLanguage}) and click "Run GenAI Diagnosis" to trigger the Gemini Generative AI model for multi-variate telemetry analysis, ISO failure identification, and step-by-step maintenance SOPs.
            </p>
            <button onClick={handleRunDiagnosis} className="btn btn-primary">
              <Sparkles size={16} /> Execute Diagnostic Analysis ({targetLanguage})
            </button>
          </div>
        )}

        {loading && (
          <div className="glass-panel" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
            <Cpu className="spin-slow" size={54} style={{ color: 'var(--accent-cyan)', margin: '0 auto 1.5rem' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>
              Gemini AI Model Analysis in Progress ({targetLanguage})
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Synthesizing ISO 10816 vibration harmonics, acoustic emission spectrum, and thermal gradients into {targetLanguage}...
            </p>
          </div>
        )}

        {diagnosticResult && !loading && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Main Header Banner */}
            <div className="glass-panel" style={{ padding: '1.5rem', background: diagnosticResult.urgencyLevel === 'CRITICAL_IMMEDIATE_HALT' ? 'linear-gradient(135deg, rgba(244,63,94,0.2), rgba(15,23,42,0.9))' : 'linear-gradient(135deg, rgba(6,182,212,0.2), rgba(15,23,42,0.9))' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '10px' }}>
                <span className={`badge ${diagnosticResult.urgencyLevel === 'CRITICAL_IMMEDIATE_HALT' ? 'badge-danger' : 'badge-warning'}`}>
                  {diagnosticResult.urgencyLevel}
                </span>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--accent-cyan)' }}>
                  AI Confidence: {diagnosticResult.confidenceScore}% | Language: {targetLanguage}
                </span>
              </div>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                {diagnosticResult.faultTitle}
              </h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                {diagnosticResult.isoClass}
              </p>
            </div>

            {/* Root Cause Analysis Card */}
            <div className="glass-panel" style={{ padding: '1.25rem' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--accent-cyan)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ShieldAlert size={16} /> ROOT-CAUSE MECHANICAL & ELECTRICAL ANALYSIS ({targetLanguage.toUpperCase()})
              </h4>
              <p style={{ fontSize: '0.875rem', lineHeight: '1.6', color: 'var(--text-primary)' }}>
                {diagnosticResult.rootCauseAnalysis}
              </p>
            </div>

            {/* Step-by-Step SOP Interactive Checklist */}
            <div className="glass-panel" style={{ padding: '1.25rem' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--accent-emerald)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckSquare size={16} /> STANDARD OPERATING PROCEDURE (SOP) CHECKLIST ({targetLanguage.toUpperCase()})
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {diagnosticResult.stepByStepSOP?.map((step, idx) => (
                  <div
                    key={idx}
                    onClick={() => toggleStep(idx)}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '10px',
                      padding: '10px 12px',
                      background: completedSteps[idx] ? 'rgba(16,185,129,0.1)' : 'rgba(30,41,59,0.5)',
                      border: '1px solid ' + (completedSteps[idx] ? 'rgba(16,185,129,0.4)' : 'var(--border-subtle)'),
                      borderRadius: 'var(--radius-sm)',
                      cursor: 'pointer',
                      fontSize: '0.85rem'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={!!completedSteps[idx]}
                      onChange={() => {}}
                      style={{ marginTop: '3px', cursor: 'pointer' }}
                    />
                    <span style={{ textDecoration: completedSteps[idx] ? 'line-through' : 'none', color: completedSteps[idx] ? 'var(--text-muted)' : 'var(--text-primary)' }}>
                      <strong>Step {idx + 1}:</strong> {step}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Required Spare Parts Table */}
            {diagnosticResult.requiredSpareParts?.length > 0 && (
              <div className="glass-panel" style={{ padding: '1.25rem' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--accent-amber)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Wrench size={16} /> REQUIRED REPLACEMENT SPARE PARTS
                </h4>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.825rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--border-subtle)', textAlign: 'left', color: 'var(--text-secondary)' }}>
                        <th style={{ padding: '8px' }}>Part No.</th>
                        <th style={{ padding: '8px' }}>Component Description</th>
                        <th style={{ padding: '8px' }}>Qty</th>
                        <th style={{ padding: '8px', textAlign: 'right' }}>Inventory Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {diagnosticResult.requiredSpareParts.map((part) => (
                        <tr key={part.partNo} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                          <td style={{ padding: '8px', fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>
                            {part.partNo}
                          </td>
                          <td style={{ padding: '8px' }}>{part.name}</td>
                          <td style={{ padding: '8px', fontWeight: 600 }}>{part.qty}</td>
                          <td style={{ padding: '8px', textAlign: 'right' }}>
                            <button
                              onClick={() => togglePartReserve(part.partNo)}
                              className={`btn ${reservedParts[part.partNo] ? 'btn-secondary' : 'btn-primary'}`}
                              style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                            >
                              {reservedParts[part.partNo] ? (
                                <>
                                  <PackageCheck size={12} /> Reserved
                                </>
                              ) : (
                                'Reserve Part'
                              )}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
