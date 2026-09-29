// Real-time Industrial IoT Sensor Telemetry Simulator & Physics Engine

export const FAULT_MODES = {
  NORMAL: 'NORMAL',
  BEARING_WEAR: 'BEARING_WEAR',
  MISALIGNMENT: 'MISALIGNMENT',
  THERMAL_OVERLOAD: 'THERMAL_OVERLOAD',
  PRESSURE_LEAK: 'PRESSURE_LEAK'
};

export const INITIAL_EQUIPMENT_LIST = [
  { id: 'EQ-101', name: 'Turbine Compressor #04 (High Pressure)', location: 'Sector 3A - Main Bay', type: 'Gas Compressor' },
  { id: 'EQ-204', name: 'Centrifugal Cooling Pump #12', location: 'Substation B - HVAC', type: 'Fluid Pump' },
  { id: 'EQ-309', name: '6-Axis Robotic Servo Joint #02', location: 'Assembly Line 1', type: 'Robotic Arm' },
];

export class SensorSimulator {
  constructor() {
    this.currentFaultMode = FAULT_MODES.NORMAL;
    this.noiseLevel = 0.05;
    this.historyLength = 30; // 30 history points for charts
    
    this.history = {
      timestamps: [],
      vibration: [],
      temperature: [],
      pressure: [],
      acoustic: [],
      rpm: [],
      power: [],
      anomalyScore: []
    };

    // Pre-fill history with normal baseline data
    const now = Date.now();
    for (let i = this.historyLength - 1; i >= 0; i--) {
      const t = new Date(now - i * 1500).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      this.history.timestamps.push(t);
      this.history.vibration.push(1.8 + (Math.random() - 0.5) * 0.4);
      this.history.temperature.push(52 + (Math.random() - 0.5) * 1.2);
      this.history.pressure.push(125 + (Math.random() - 0.5) * 2.0);
      this.history.acoustic.push(35 + (Math.random() - 0.5) * 3.0);
      this.history.rpm.push(3590 + (Math.random() - 0.5) * 10);
      this.history.power.push(48.5 + (Math.random() - 0.5) * 1.5);
      this.history.anomalyScore.push(8 + Math.random() * 5);
    }
  }

  setFaultMode(mode) {
    this.currentFaultMode = mode;
  }

  generateNextTick() {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    
    let baseVib = 1.8;
    let baseTemp = 52.0;
    let basePress = 125.0;
    let baseAcous = 35.0;
    let baseRpm = 3590;
    let basePower = 48.5;

    switch (this.currentFaultMode) {
      case FAULT_MODES.BEARING_WEAR:
        baseVib = 9.8 + (Math.random() - 0.5) * 2.5; // High vibration mm/s
        baseAcous = 84 + (Math.random() - 0.5) * 6.0; // High ultrasonic acoustic
        baseTemp = 74 + (Math.random() - 0.5) * 3.0; // Moderate temp rise due to friction
        basePower = 58 + (Math.random() - 0.5) * 2.0;
        break;

      case FAULT_MODES.MISALIGNMENT:
        baseVib = 7.4 + (Math.random() - 0.5) * 1.8; // 2X Shaft rotational vibration
        baseRpm = 3520 + (Math.random() - 0.5) * 25; // Speed fluctuation
        basePower = 64 + (Math.random() - 0.5) * 3.5; // Elevated load draw
        break;

      case FAULT_MODES.THERMAL_OVERLOAD:
        baseTemp = 98.5 + (Math.random() - 0.5) * 4.0; // High stator temperature °C
        baseAcous = 65 + (Math.random() - 0.5) * 5.0;
        basePower = 76 + (Math.random() - 0.5) * 4.0;
        baseVib = 4.2 + (Math.random() - 0.5) * 1.0;
        break;

      case FAULT_MODES.PRESSURE_LEAK:
        basePress = 72.0 + (Math.random() - 0.5) * 5.0; // Severe pressure drop PSI
        baseAcous = 91.0 + (Math.random() - 0.5) * 4.0; // High frequency leak hiss
        baseVib = 3.8 + (Math.random() - 0.5) * 0.8;
        break;

      default: // NORMAL
        baseVib += (Math.random() - 0.5) * 0.4;
        baseTemp += (Math.random() - 0.5) * 1.0;
        basePress += (Math.random() - 0.5) * 1.5;
        baseAcous += (Math.random() - 0.5) * 2.0;
        baseRpm += (Math.random() - 0.5) * 8.0;
        basePower += (Math.random() - 0.5) * 1.0;
        break;
    }

    // Calculate Anomaly Score (0 - 100%)
    const vibDev = Math.max(0, (baseVib - 2.5) / 5.0);
    const tempDev = Math.max(0, (baseTemp - 60.0) / 30.0);
    const pressDev = Math.max(0, Math.abs(125.0 - basePress) / 45.0);
    const acousDev = Math.max(0, (baseAcous - 45.0) / 35.0);

    const rawAnomaly = (vibDev * 0.35 + tempDev * 0.25 + pressDev * 0.25 + acousDev * 0.15) * 100;
    const anomalyScore = Math.min(99.4, Math.max(6.2, rawAnomaly + Math.random() * 2));

    // Determine status & RUL
    let status = 'NORMAL';
    let rulHours = 1420;
    let predictedFault = 'Normal System Baseline - Healthy';

    if (anomalyScore > 68) {
      status = 'CRITICAL';
      rulHours = Math.round(14 + Math.random() * 12);
    } else if (anomalyScore > 35) {
      status = 'WARNING';
      rulHours = Math.round(180 + Math.random() * 120);
    } else {
      rulHours = Math.round(1200 + Math.random() * 300);
    }

    if (this.currentFaultMode === FAULT_MODES.BEARING_WEAR) {
      predictedFault = 'Bearing Outer-Race Spall & Roller Degradation';
    } else if (this.currentFaultMode === FAULT_MODES.MISALIGNMENT) {
      predictedFault = 'Flexible Coupling Shaft Dynamic Misalignment';
    } else if (this.currentFaultMode === FAULT_MODES.THERMAL_OVERLOAD) {
      predictedFault = 'Motor Stator Winding Thermal Insulation Breakdown';
    } else if (this.currentFaultMode === FAULT_MODES.PRESSURE_LEAK) {
      predictedFault = 'Hydraulic Fluid Seal Degradation & Pressure Loss';
    }

    // Shift history arrays
    this.history.timestamps.push(timestamp);
    this.history.vibration.push(parseFloat(baseVib.toFixed(2)));
    this.history.temperature.push(parseFloat(baseTemp.toFixed(1)));
    this.history.pressure.push(parseFloat(basePress.toFixed(1)));
    this.history.acoustic.push(parseFloat(baseAcous.toFixed(1)));
    this.history.rpm.push(Math.round(baseRpm));
    this.history.power.push(parseFloat(basePower.toFixed(1)));
    this.history.anomalyScore.push(parseFloat(anomalyScore.toFixed(1)));

    if (this.history.timestamps.length > this.historyLength) {
      this.history.timestamps.shift();
      this.history.vibration.shift();
      this.history.temperature.shift();
      this.history.pressure.shift();
      this.history.acoustic.shift();
      this.history.rpm.shift();
      this.history.power.shift();
      this.history.anomalyScore.shift();
    }

    return {
      timestamp,
      vibration: parseFloat(baseVib.toFixed(2)),
      temperature: parseFloat(baseTemp.toFixed(1)),
      pressure: parseFloat(basePress.toFixed(1)),
      acoustic: parseFloat(baseAcous.toFixed(1)),
      rpm: Math.round(baseRpm),
      power: parseFloat(basePower.toFixed(1)),
      anomalyScore: parseFloat(anomalyScore.toFixed(1)),
      status,
      rulHours,
      predictedFault,
      currentFaultMode: this.currentFaultMode,
      history: { ...this.history }
    };
  }
}
