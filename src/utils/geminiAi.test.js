import { describe, it, expect } from 'vitest';
import { generateAiDiagnostic } from './geminiAi';
import { FAULT_MODES } from './sensorSimulator';

describe('Gemini AI Diagnostic Integration', () => {
  it('should generate structured diagnostic report for BEARING_WEAR in English', async () => {
    const mockSensorData = {
      timestamp: '14:30:00',
      vibration: 9.8,
      temperature: 78.5,
      pressure: 120.0,
      acoustic: 88.0,
      rpm: 3580,
      power: 62.0,
      anomalyScore: 84.5,
      status: 'CRITICAL',
      rulHours: 18,
      currentFaultMode: FAULT_MODES.BEARING_WEAR
    };

    const report = await generateAiDiagnostic(mockSensorData, '', '', 'English');

    expect(report).toHaveProperty('faultTitle');
    expect(report).toHaveProperty('confidenceScore');
    expect(report).toHaveProperty('isoClass');
    expect(report).toHaveProperty('urgencyLevel', 'CRITICAL_IMMEDIATE_HALT');
    expect(report).toHaveProperty('rootCauseAnalysis');
    expect(report.stepByStepSOP.length).toBeGreaterThan(0);
    expect(report.requiredSpareParts.length).toBeGreaterThan(0);
  });

  it('should support multi-language output in Spanish', async () => {
    const mockSensorData = {
      timestamp: '14:30:00',
      vibration: 9.8,
      temperature: 78.5,
      pressure: 120.0,
      acoustic: 88.0,
      rpm: 3580,
      power: 62.0,
      anomalyScore: 84.5,
      status: 'CRITICAL',
      rulHours: 18,
      currentFaultMode: FAULT_MODES.BEARING_WEAR
    };

    const report = await generateAiDiagnostic(mockSensorData, '', '', 'Spanish');

    expect(report.faultTitle).toContain('Rodamiento');
    expect(report.isoClass).toContain('Clase IV');
  });
});
