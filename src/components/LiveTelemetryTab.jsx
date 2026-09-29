import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Activity, Thermometer, Gauge, Volume2, RotateCw, Zap, ShieldAlert, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';
import DigitalTwinCanvas from './DigitalTwinCanvas';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function LiveTelemetryTab({ sensorData, faultMode, onTriggerAiDiagnostic }) {
  const history = sensorData.history || { timestamps: [] };

  const createChartData = (label, dataArray, colorHex) => ({
    labels: history.timestamps || [],
    datasets: [
      {
        label,
        data: dataArray || [],
        borderColor: colorHex,
        backgroundColor: colorHex + '1A', // transparent fill
        borderWidth: 2,
        tension: 0.35,
        pointRadius: 0,
        fill: true,
      }
    ]
  });

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true, mode: 'index', intersect: false }
    },
    scales: {
      x: { display: false },
      y: {
        display: true,
        grid: { color: 'rgba(255,255,255,0.05)' },
        ticks: { color: '#64748b', font: { size: 9 } }
      }
    }
  };

  return (
    <div className="dashboard-grid">
      {/* Top Section: Digital Twin Canvas & Health Gauges */}
      <div className="col-span-8">
        <DigitalTwinCanvas sensorData={sensorData} faultMode={faultMode} />
      </div>

      <div className="col-span-4" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Anomaly Score Card */}
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              REAL-TIME ANOMALY SCORE
            </span>
            <Activity size={18} style={{ color: sensorData.anomalyScore > 60 ? 'var(--accent-rose)' : 'var(--accent-cyan)' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span className={`metric-value ${sensorData.anomalyScore > 60 ? 'glow-rose' : 'glow-cyan'}`}>
              {sensorData.anomalyScore}%
            </span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Multi-Variate Risk</span>
          </div>

          {/* Anomaly Progress Bar */}
          <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', marginTop: '12px', overflow: 'hidden' }}>
            <div
              style={{
                width: `${sensorData.anomalyScore}%`,
                height: '100%',
                background: sensorData.anomalyScore > 65 ? 'linear-gradient(90deg, #f59e0b, #f43f5e)' : 'linear-gradient(90deg, #10b981, #06b6d4)',
                transition: 'width 0.5s ease'
              }}
            />
          </div>
        </div>

        {/* Remaining Useful Life (RUL) Card */}
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              ESTIMATED REMAINING USEFUL LIFE (RUL)
            </span>
            <Clock size={18} style={{ color: 'var(--accent-amber)' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span className="metric-value" style={{ color: sensorData.rulHours < 50 ? '#f43f5e' : '#f8fafc' }}>
              {sensorData.rulHours}
            </span>
            <span className="metric-unit">Hours Remaining</span>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            Predictive Model: Degradation Weibull Distribution Curve
          </p>
        </div>

        {/* Quick GenAI Diagnosis Trigger CTA */}
        <div className="glass-panel" style={{ padding: '1.25rem', background: 'linear-gradient(135deg, rgba(6,182,212,0.15), rgba(59,130,246,0.15))', border: '1px solid rgba(6,182,212,0.4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <ShieldAlert size={22} style={{ color: 'var(--accent-cyan)' }} />
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Generative AI Failure Diagnosis</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>ISO 10816 Diagnostics & SOP Generation</div>
            </div>
          </div>
          <button
            onClick={onTriggerAiDiagnostic}
            className="btn btn-primary"
            style={{ width: '100%', justifyCenter: 'center', padding: '10px' }}
          >
            Run Gemini AI Diagnostics Now
          </button>
        </div>
      </div>

      {/* 6 Sensor Telemetry Cards with Sparkline Line Charts */}

      {/* 1. Vibration */}
      <div className="col-span-4 glass-card metric-card">
        <div className="metric-header">
          <span>Vibration Amplitude (RMS)</span>
          <Activity size={16} style={{ color: '#06b6d4' }} />
        </div>
        <div>
          <span className="metric-value">{sensorData.vibration}</span>
          <span className="metric-unit">mm/s</span>
        </div>
        <div style={{ height: '65px', marginTop: '6px' }}>
          <Line data={createChartData('Vibration', history.vibration, '#06b6d4')} options={chartOptions} />
        </div>
      </div>

      {/* 2. Temperature */}
      <div className="col-span-4 glass-card metric-card">
        <div className="metric-header">
          <span>Stator Temperature</span>
          <Thermometer size={16} style={{ color: '#f43f5e' }} />
        </div>
        <div>
          <span className="metric-value">{sensorData.temperature}</span>
          <span className="metric-unit">°C</span>
        </div>
        <div style={{ height: '65px', marginTop: '6px' }}>
          <Line data={createChartData('Temperature', history.temperature, '#f43f5e')} options={chartOptions} />
        </div>
      </div>

      {/* 3. Hydraulic Pressure */}
      <div className="col-span-4 glass-card metric-card">
        <div className="metric-header">
          <span>Internal Hydraulic Pressure</span>
          <Gauge size={16} style={{ color: '#10b981' }} />
        </div>
        <div>
          <span className="metric-value">{sensorData.pressure}</span>
          <span className="metric-unit">PSI</span>
        </div>
        <div style={{ height: '65px', marginTop: '6px' }}>
          <Line data={createChartData('Pressure', history.pressure, '#10b981')} options={chartOptions} />
        </div>
      </div>

      {/* 4. Acoustic Emission */}
      <div className="col-span-4 glass-card metric-card">
        <div className="metric-header">
          <span>Ultrasonic Acoustic Emission</span>
          <Volume2 size={16} style={{ color: '#8b5cf6' }} />
        </div>
        <div>
          <span className="metric-value">{sensorData.acoustic}</span>
          <span className="metric-unit">dB</span>
        </div>
        <div style={{ height: '65px', marginTop: '6px' }}>
          <Line data={createChartData('Acoustic', history.acoustic, '#8b5cf6')} options={chartOptions} />
        </div>
      </div>

      {/* 5. Rotor Speed */}
      <div className="col-span-4 glass-card metric-card">
        <div className="metric-header">
          <span>Rotor Shaft Speed</span>
          <RotateCw size={16} style={{ color: '#3b82f6' }} />
        </div>
        <div>
          <span className="metric-value">{sensorData.rpm}</span>
          <span className="metric-unit">RPM</span>
        </div>
        <div style={{ height: '65px', marginTop: '6px' }}>
          <Line data={createChartData('RPM', history.rpm, '#3b82f6')} options={chartOptions} />
        </div>
      </div>

      {/* 6. Power Consumption */}
      <div className="col-span-4 glass-card metric-card">
        <div className="metric-header">
          <span>Electrical Power Draw</span>
          <Zap size={16} style={{ color: '#f59e0b' }} />
        </div>
        <div>
          <span className="metric-value">{sensorData.power}</span>
          <span className="metric-unit">kW</span>
        </div>
        <div style={{ height: '65px', marginTop: '6px' }}>
          <Line data={createChartData('Power', history.power, '#f59e0b')} options={chartOptions} />
        </div>
      </div>
    </div>
  );
}
