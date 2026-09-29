import React from 'react';
import { BarChart3, Award, CheckCircle2, ShieldAlert, Cpu, Activity } from 'lucide-react';

export default function AnalyticsTab() {
  const confusionMatrix = [
    { actual: 'Bearing Wear', bearing: 48, misalign: 1, thermal: 0, pressure: 1, normal: 0 },
    { actual: 'Misalignment', bearing: 1, misalign: 45, thermal: 2, pressure: 0, normal: 0 },
    { actual: 'Thermal Overload', bearing: 0, misalign: 1, thermal: 49, pressure: 0, normal: 0 },
    { actual: 'Pressure Leak', bearing: 1, misalign: 0, thermal: 0, pressure: 47, normal: 0 },
    { actual: 'Normal', bearing: 0, misalign: 0, thermal: 0, pressure: 0, normal: 50 }
  ];

  return (
    <div className="dashboard-grid">
      {/* 4 Metric Cards */}
      <div className="col-span-3 glass-card metric-card">
        <div className="metric-header">
          <span>Overall AI Model Accuracy</span>
          <Award size={16} style={{ color: '#06b6d4' }} />
        </div>
        <div className="metric-value glow-cyan">97.8%</div>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Evaluated on 10,000 sensor frames</span>
      </div>

      <div className="col-span-3 glass-card metric-card">
        <div className="metric-header">
          <span>Model Precision</span>
          <CheckCircle2 size={16} style={{ color: '#10b981' }} />
        </div>
        <div className="metric-value">96.4%</div>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Low False Positive Rate (&lt;1.8%)</span>
      </div>

      <div className="col-span-3 glass-card metric-card">
        <div className="metric-header">
          <span>Fault Recall Rate</span>
          <Activity size={16} style={{ color: '#3b82f6' }} />
        </div>
        <div className="metric-value">98.1%</div>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Critical Failure Detection Safety</span>
      </div>

      <div className="col-span-3 glass-card metric-card">
        <div className="metric-header">
          <span>Macro F1-Score</span>
          <BarChart3 size={16} style={{ color: '#8b5cf6' }} />
        </div>
        <div className="metric-value">97.2%</div>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Balanced Multi-Class Score</span>
      </div>

      {/* Confusion Matrix Table */}
      <div className="col-span-6 glass-panel" style={{ padding: '1.25rem' }}>
        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Cpu size={18} style={{ color: 'var(--accent-cyan)' }} /> Multi-Class Confusion Matrix Evaluation
        </h3>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.825rem', textAlign: 'center' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }}>
                <th style={{ textAlign: 'left', padding: '8px' }}>Actual \ Predicted</th>
                <th style={{ padding: '8px' }}>Bearing</th>
                <th style={{ padding: '8px' }}>Misalign</th>
                <th style={{ padding: '8px' }}>Thermal</th>
                <th style={{ padding: '8px' }}>Pressure</th>
                <th style={{ padding: '8px' }}>Normal</th>
              </tr>
            </thead>
            <tbody>
              {confusionMatrix.map((row, i) => (
                <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <td style={{ textAlign: 'left', padding: '8px', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {row.actual}
                  </td>
                  <td style={{ padding: '8px', background: i === 0 ? 'rgba(6,182,212,0.25)' : 'transparent', fontWeight: i === 0 ? '700' : '400' }}>
                    {row.bearing}
                  </td>
                  <td style={{ padding: '8px', background: i === 1 ? 'rgba(6,182,212,0.25)' : 'transparent', fontWeight: i === 1 ? '700' : '400' }}>
                    {row.misalign}
                  </td>
                  <td style={{ padding: '8px', background: i === 2 ? 'rgba(6,182,212,0.25)' : 'transparent', fontWeight: i === 2 ? '700' : '400' }}>
                    {row.thermal}
                  </td>
                  <td style={{ padding: '8px', background: i === 3 ? 'rgba(6,182,212,0.25)' : 'transparent', fontWeight: i === 3 ? '700' : '400' }}>
                    {row.pressure}
                  </td>
                  <td style={{ padding: '8px', background: i === 4 ? 'rgba(6,182,212,0.25)' : 'transparent', fontWeight: i === 4 ? '700' : '400' }}>
                    {row.normal}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ISO 10816 Mechanical Vibration Limits Reference Matrix */}
      <div className="col-span-6 glass-panel" style={{ padding: '1.25rem' }}>
        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShieldAlert size={18} style={{ color: 'var(--accent-amber)' }} /> ISO 10816 Vibration Severity Thresholds
        </h3>

        <div style={{ fontSize: '0.825rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px', padding: '8px', background: 'rgba(16,185,129,0.15)', borderRadius: '6px', border: '1px solid rgba(16,185,129,0.3)' }}>
            <div><strong>Zone A (&lt; 2.8 mm/s):</strong> Excellent</div>
            <div>New commissioning baseline</div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px', padding: '8px', background: 'rgba(59,130,246,0.15)', borderRadius: '6px', border: '1px solid rgba(59,130,246,0.3)' }}>
            <div><strong>Zone B (2.8 - 4.5 mm/s):</strong> Acceptable</div>
            <div>Unrestricted continuous operation</div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px', padding: '8px', background: 'rgba(245,158,11,0.15)', borderRadius: '6px', border: '1px solid rgba(245,158,11,0.3)' }}>
            <div><strong>Zone C (4.5 - 7.1 mm/s):</strong> Unsatisfactory</div>
            <div>Action required within 48-72 hours</div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', padding: '8px', background: 'rgba(244,63,94,0.15)', borderRadius: '6px', border: '1px solid rgba(244,63,94,0.3)' }}>
            <div><strong>Zone D (&gt; 7.1 mm/s):</strong> Unacceptable</div>
            <div>Immediate emergency halt mandatory</div>
          </div>
        </div>
      </div>
    </div>
  );
}
