import { describe, it, expect } from 'vitest';
import { SensorSimulator, FAULT_MODES } from './sensorSimulator';

describe('SensorSimulator Physics Engine', () => {
  it('should initialize with normal baseline telemetry history', () => {
    const simulator = new SensorSimulator();
    const tick = simulator.generateNextTick();

    expect(tick).toHaveProperty('vibration');
    expect(tick).toHaveProperty('temperature');
    expect(tick).toHaveProperty('pressure');
    expect(tick).toHaveProperty('acoustic');
    expect(tick).toHaveProperty('rpm');
    expect(tick).toHaveProperty('power');
    expect(tick).toHaveProperty('anomalyScore');
    expect(tick).toHaveProperty('status');
    expect(tick).toHaveProperty('rulHours');

    expect(tick.status).toBe('NORMAL');
    expect(tick.anomalyScore).toBeLessThan(35);
    expect(tick.rulHours).toBeGreaterThan(500);
  });

  it('should calculate CRITICAL status & elevated vibration during BEARING_WEAR fault', () => {
    const simulator = new SensorSimulator();
    simulator.setFaultMode(FAULT_MODES.BEARING_WEAR);
    const tick = simulator.generateNextTick();

    expect(tick.vibration).toBeGreaterThan(6.0);
    expect(tick.acoustic).toBeGreaterThan(70.0);
    expect(tick.anomalyScore).toBeGreaterThan(65);
    expect(tick.status).toBe('CRITICAL');
    expect(tick.rulHours).toBeLessThan(50);
  });

  it('should adjust pressure and acoustic emission during PRESSURE_LEAK fault', () => {
    const simulator = new SensorSimulator();
    simulator.setFaultMode(FAULT_MODES.PRESSURE_LEAK);
    const tick = simulator.generateNextTick();

    expect(tick.pressure).toBeLessThan(95.0);
    expect(tick.acoustic).toBeGreaterThan(80.0);
    expect(tick.predictedFault).toContain('Hydraulic');
  });
});
