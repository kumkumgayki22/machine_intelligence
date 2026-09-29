import { describe, it, expect } from 'vitest';
import { generateAiDiagnostic } from './geminiAi';
import { SensorSimulator, FAULT_MODES } from './sensorSimulator';

describe('Safety & Diagnostic Effectiveness Verification Suite', () => {
  it('Safety Verification: Critical failure MUST mandate LOTO & Zero-Energy safety precautions', async () => {
    const simulator = new SensorSimulator();
    simulator.setFaultMode(FAULT_MODES.BEARING_WEAR);
    const telemetry = simulator.generateNextTick();

    const report = await generateAiDiagnostic(telemetry, '', '', 'English');

    expect(report.urgencyLevel).toBe('CRITICAL_IMMEDIATE_HALT');
    
    // Safety check: SOP must contain Lockout/Tagout instructions
    const hasLotoInstruction = report.stepByStepSOP.some(step =>
      step.toLowerCase().includes('loto') || step.toLowerCase().includes('lockout')
    );
    expect(hasLotoInstruction).toBe(true);

    // Safety check: Precautions must contain electrical/pressure safety
    const hasSafetyPrecaution = report.safetyPrecautions.some(p =>
      p.toLowerCase().includes('loto') || p.toLowerCase().includes('gloves') || p.toLowerCase().includes('pressure')
    );
    expect(hasSafetyPrecaution).toBe(true);
  });

  it('Effectiveness Verification: Anomaly score in Bearing Wear mode MUST be > 60% with RUL < 50h', () => {
    const simulator = new SensorSimulator();
    simulator.setFaultMode(FAULT_MODES.BEARING_WEAR);
    const telemetry = simulator.generateNextTick();

    expect(telemetry.anomalyScore).toBeGreaterThan(60.0);
    expect(telemetry.status).toBe('CRITICAL');
    expect(telemetry.rulHours).toBeLessThan(50);
  });

  it('Effectiveness Verification: Multi-language output retains complete field integrity in German & Spanish', async () => {
    const simulator = new SensorSimulator();
    simulator.setFaultMode(FAULT_MODES.THERMAL_OVERLOAD);
    const telemetry = simulator.generateNextTick();

    const spanishReport = await generateAiDiagnostic(telemetry, '', '', 'Spanish');
    const germanReport = await generateAiDiagnostic(telemetry, '', '', 'German');

    expect(spanishReport.faultTitle).toBeDefined();
    expect(spanishReport.stepByStepSOP.length).toBeGreaterThan(0);
    
    expect(germanReport.faultTitle).toBeDefined();
    expect(germanReport.stepByStepSOP.length).toBeGreaterThan(0);
  });
});
