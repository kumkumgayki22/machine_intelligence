import React, { useRef, useEffect, useState } from 'react';
import { Activity, ShieldAlert, Cpu, Zap, Thermometer, Waves } from 'lucide-react';

export default function DigitalTwinCanvas({ sensorData, faultMode }) {
  const canvasRef = useRef(null);
  const [hoveredPart, setHoveredPart] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let rotationAngle = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const width = canvas.width;
      const height = canvas.height;
      const cX = width / 2;
      const cY = height / 2;

      // Draw Grid Background
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.lineWidth = 1;
      const gridSize = 20;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Calculate heat color based on temperature
      const temp = sensorData.temperature || 50;
      const heatRatio = Math.min(1, Math.max(0, (temp - 40) / 60));
      const red = Math.round(59 + heatRatio * (244 - 59));
      const green = Math.round(130 - heatRatio * 100);
      const blue = Math.round(246 - heatRatio * 200);
      const mainHeatColor = `rgb(${red}, ${green}, ${blue})`;

      // 1. Draw Shaft Lines (Rotating effect)
      const rpm = sensorData.rpm || 3590;
      rotationAngle += (rpm / 60) * 0.05;
      
      // Shaft shadow/glow
      ctx.shadowBlur = faultMode === 'MISALIGNMENT' ? 15 : 5;
      ctx.shadowColor = faultMode === 'MISALIGNMENT' ? '#f43f5e' : '#06b6d4';
      
      // Main Center Shaft
      ctx.fillStyle = '#334155';
      ctx.fillRect(cX - 220, cY - 14, 440, 28);
      
      // Shaft rotation stripes
      ctx.fillStyle = '#64748b';
      for (let i = -200; i < 200; i += 30) {
        const stripeX = cX + i + (Math.sin(rotationAngle) * 8);
        ctx.fillRect(stripeX, cY - 14, 10, 28);
      }

      // 2. Draw Motor Main Stator Housing (Heat Map Body)
      ctx.shadowBlur = 20;
      ctx.shadowColor = mainHeatColor;
      
      const gradient = ctx.createLinearGradient(cX - 120, cY - 80, cX + 120, cY + 80);
      gradient.addColorStop(0, '#1e293b');
      gradient.addColorStop(0.5, mainHeatColor);
      gradient.addColorStop(1, '#0f172a');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.roundRect(cX - 120, cY - 75, 240, 150, 16);
      ctx.fill();
      ctx.strokeStyle = faultMode === 'THERMAL_OVERLOAD' ? '#f43f5e' : 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = faultMode === 'THERMAL_OVERLOAD' ? 3 : 1.5;
      ctx.stroke();

      // Stator cooling fins
      ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
      for (let x = cX - 100; x <= cX + 100; x += 20) {
        ctx.fillRect(x, cY - 85, 8, 170);
      }

      // 3. Draw Drive End (DE) Bearing Housing (Left)
      const isBearingFault = faultMode === 'BEARING_WEAR';
      ctx.shadowBlur = isBearingFault ? 25 : 10;
      ctx.shadowColor = isBearingFault ? '#f43f5e' : '#06b6d4';

      ctx.fillStyle = isBearingFault ? '#4c0519' : '#0f172a';
      ctx.beginPath();
      ctx.arc(cX - 150, cY, 45, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = isBearingFault ? '#f43f5e' : '#06b6d4';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Bearing Pulsing Vibration Waves if Vibration high
      const vib = sensorData.vibration || 1.8;
      if (vib > 3.0) {
        const pulseRadius = 45 + (Date.now() % 1000) / 1000 * (vib * 4);
        ctx.strokeStyle = isBearingFault ? 'rgba(244, 63, 94, 0.6)' : 'rgba(6, 182, 212, 0.5)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(cX - 150, cY, pulseRadius, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Bearing Ball elements inside
      for (let a = 0; a < Math.PI * 2; a += Math.PI / 4) {
        const bx = (cX - 150) + Math.cos(a + rotationAngle) * 28;
        const by = cY + Math.sin(a + rotationAngle) * 28;
        ctx.fillStyle = isBearingFault ? '#f87171' : '#38bdf8';
        ctx.beginPath();
        ctx.arc(bx, by, 7, 0, Math.PI * 2);
        ctx.fill();
      }

      // 4. Draw Non-Drive End (NDE) Bearing Housing (Right)
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(cX + 150, cY, 40, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 2;
      ctx.stroke();

      // 5. Hydraulic Pressure Valve Block (Top right)
      const isPressFault = faultMode === 'PRESSURE_LEAK';
      ctx.fillStyle = isPressFault ? 'rgba(244, 63, 94, 0.2)' : 'rgba(16, 185, 129, 0.2)';
      ctx.fillRect(cX + 60, cY - 120, 60, 45);
      ctx.strokeStyle = isPressFault ? '#f43f5e' : '#10b981';
      ctx.strokeRect(cX + 60, cY - 120, 60, 45);

      if (isPressFault) {
        // Acoustic leakage particles
        for (let p = 0; p < 5; p++) {
          const px = cX + 90 + (Math.random() - 0.5) * 40;
          const py = cY - 120 - (Date.now() % 800) / 10;
          ctx.fillStyle = 'rgba(244, 63, 94, 0.8)';
          ctx.beginPath();
          ctx.arc(px, py, 3, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // HUD Text Overlays
      ctx.shadowBlur = 0;
      ctx.font = '11px "JetBrains Mono", monospace';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText('DE BEARING #6214', cX - 210, cY + 70);
      ctx.fillText('STATOR WINDINGS', cX - 50, cY + 110);
      ctx.fillText('HYDRAULIC VALVE', cX + 50, cY - 130);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [sensorData, faultMode]);

  return (
    <div className="glass-panel" style={{ padding: '1.25rem', position: 'relative', overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Cpu className="glow-cyan" size={20} style={{ color: 'var(--accent-cyan)' }} />
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 600 }}>
            Digital Twin 3D/2D Industrial Telemetry Canvas
          </h3>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span className="badge badge-info" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Activity size={12} /> Live Simulation Physics
          </span>
          <span className={`badge ${sensorData.status === 'CRITICAL' ? 'badge-danger' : sensorData.status === 'WARNING' ? 'badge-warning' : 'badge-success'}`}>
            {sensorData.status} ({sensorData.anomalyScore}% Anomaly)
          </span>
        </div>
      </div>

      <div style={{ position: 'relative', width: '100%', height: '320px', borderRadius: 'var(--radius-md)', overflow: 'hidden', background: '#030712' }}>
        <canvas
          ref={canvasRef}
          width={750}
          height={320}
          style={{ width: '100%', height: '100%', display: 'block' }}
        />

        {/* Hover overlay hint */}
        <div style={{ position: 'absolute', bottom: '12px', left: '16px', display: 'flex', gap: '16px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#06b6d4' }}></span> DE Bearing Drive Shaft
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#3b82f6' }}></span> Stator Heat Map ({sensorData.temperature}°C)
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: sensorData.vibration > 4 ? '#f43f5e' : '#10b981' }}></span> Vibration Harmonics ({sensorData.vibration} mm/s)
          </span>
        </div>
      </div>
    </div>
  );
}
