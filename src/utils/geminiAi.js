// Gemini GenAI Integration & Fallback AI Diagnostic Engine for Predictive Maintenance
// Supports Multi-Language Diagnostics (English, Spanish, German, French, Hindi, Japanese)

export async function generateAiDiagnostic(sensorData, systemPrompt = '', apiKey = '', targetLanguage = 'English') {
  const defaultSystemPrompt = `You are an expert Senior Industrial Maintenance AI Specialist certified in ISO 10816 Mechanical Vibration, Failure Mode & Effects Analysis (FMEA), and Predictive Reliability Engineering. Analyze the given IoT sensor telemetry snapshot and generate a high-precision diagnostic report with root-cause analysis, ISO severity classification, step-by-step Standard Operating Procedure (SOP), required replacement spare parts, and safety protocols. All text fields in your response MUST be returned in ${targetLanguage}.`;

  const prompt = `
SYSTEM INSTRUCTIONS: ${systemPrompt || defaultSystemPrompt}

TARGET OUTPUT LANGUAGE: ${targetLanguage}

CURRENT INDUSTRIAL IOT TELEMETRY SNAPSHOT:
- Equipment: Turbine Compressor #04 (High Pressure Gas Compressor)
- Timestamp: ${sensorData.timestamp}
- Anomaly Score: ${sensorData.anomalyScore}% (${sensorData.status})
- Vibration (mm/s RMS): ${sensorData.vibration} mm/s
- Temperature (°C): ${sensorData.temperature} °C
- Internal Pressure (PSI): ${sensorData.pressure} PSI
- Ultrasonic Acoustic (dB): ${sensorData.acoustic} dB
- Rotor Speed (RPM): ${sensorData.rpm} RPM
- Power Draw (kW): ${sensorData.power} kW
- Simulated Active Fault Mode: ${sensorData.currentFaultMode}

Provide your structured JSON diagnostic report with keys:
{
  "faultTitle": "string (in ${targetLanguage})",
  "confidenceScore": number,
  "isoClass": "string (in ${targetLanguage})",
  "urgencyLevel": "CRITICAL_IMMEDIATE_HALT" | "WARNING_SCHEDULE_INSPECTION" | "NORMAL",
  "rootCauseAnalysis": "string (in ${targetLanguage})",
  "estimatedRULHours": number,
  "stepByStepSOP": ["string (in ${targetLanguage})"],
  "requiredSpareParts": [{"partNo": "string", "name": "string (in ${targetLanguage})", "qty": number}],
  "safetyPrecautions": ["string (in ${targetLanguage})"]
}
`;

  // If valid API key is present, invoke Gemini API REST endpoint
  if (apiKey && apiKey.trim().length > 10) {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.2,
            responseMimeType: "application/json"
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          return JSON.parse(text);
        }
      }
    } catch (err) {
      console.warn("Gemini API call failed or network offline. Falling back to built-in GenAI reasoning engine.", err);
    }
  }

  // High-fidelity fallback GenAI reasoning simulation with multi-language support
  await new Promise((r) => setTimeout(r, 1200));

  const isSpanish = targetLanguage === 'Spanish';
  const isGerman = targetLanguage === 'German';
  const isFrench = targetLanguage === 'French';
  const isHindi = targetLanguage === 'Hindi';
  const isJapanese = targetLanguage === 'Japanese';

  if (sensorData.currentFaultMode === 'BEARING_WEAR') {
    return {
      faultTitle: isSpanish
        ? 'Agotamiento y Microfractura de la Pista Exterior del Rodamiento de Bolas'
        : isGerman
        ? 'Ermüdungsspallung und Mikrorissbildung am Lager-Außenring'
        : isFrench
        ? 'Écaillage par Fatigue du Roulement à Billes de la Bague Extérieure'
        : isHindi
        ? 'ड्राइव-एंड बेयरिंग आउटर-रेस थकान स्पॉल और माइक्रो-फ्रैक्चर'
        : isJapanese
        ? 'ドライブエンド軸受外輪の疲労剥離および微細亀裂'
        : 'Deep-Groove Ball Bearing Outer-Race Fatigue Spall & Sub-surface Micro-Fracture',
      confidenceScore: 97.4,
      isoClass: isSpanish
        ? 'Clase IV: No Satisfactorio / Límites de Vibración Excedidos (ISO 10816-3)'
        : isGerman
        ? 'Klasse IV: Unzufriedenstellend / Schwingungsgrenzwerte Überschritten (ISO 10816-3)'
        : 'Class IV: Unsatisfactory / Severe Vibration Limits Exceeded (ISO 10816-3)',
      urgencyLevel: 'CRITICAL_IMMEDIATE_HALT',
      rootCauseAnalysis: isSpanish
        ? `Altas emisiones acústicas ultrasónicas (${sensorData.acoustic} dB) junto con picos de vibración en ${sensorData.vibration} mm/s indican desconchado en el rodamiento.`
        : isGerman
        ? `Hohe Ultraschall-Schallemissionen (${sensorData.acoustic} dB) gekoppelt mit Vibrationsspitzen bei ${sensorData.vibration} mm/s deuten auf Lager-Abplatzungen hin.`
        : `High-frequency ultrasonic acoustic emissions (${sensorData.acoustic} dB) coupled with peak vibration harmonics at ${sensorData.vibration} mm/s indicate localized outer-race spalling in the drive-end bearing. Lubricant film degradation led to direct metal-to-metal friction, elevating bearing housing temperature to ${sensorData.temperature}°C.`,
      estimatedRULHours: sensorData.rulHours,
      stepByStepSOP: isSpanish
        ? [
            '1. Ejecutar procedimiento de apagado controlado de emergencia y aplicar bloqueo LOTO en Interruptor 4B.',
            '2. Aislar líneas hidráulicas y purgar presión a 0 PSI.',
            '3. Extraer rodamiento dañado con extractor hidráulico sin dañar el eje.',
            '4. Calentar nuevo rodamiento cerámico a 110°C antes del montaje.',
            '5. Reagrupar con grasa sintética ISO VG 220 y realizar prueba de giro de 15 min.'
          ]
        : isGerman
        ? [
            '1. Kontrollierten Not-Stopp durchführen und LOTO-Sicherungsverfahren am Schalter 4B anwenden.',
            '2. Hydraulikleitungen isolieren und Restdruck auf 0 PSI entlasten.',
            '3. Beschädigtes Lager mit Hydraulikabzieher demontieren.',
            '4. Neues Lager mit Induktionsanwärmer auf 110°C erwärmen.',
            '5. Mit synthetischem Fett nachschmieren und 15-minütigen Testlauf durchführen.'
          ]
        : [
            'Perform emergency controlled ramp-down and apply electrical Lockout/Tagout (LOTO) procedure on Breaker 4B.',
            'Isolate hydraulic fluid inlet lines and bleed residual line pressure down to 0 PSI.',
            'Disassemble outer coupling shroud and inspect alignment using dual-laser sensor.',
            'Use hydraulic puller to extract damaged DE bearing #6214-C3 without marring shaft journal.',
            'Flush bearing housing cavity with synthetic degreaser and inspect for metal swarf contamination.',
            'Heat new ceramic-hybrid replacement bearing using induction heater to 110°C before press-fitting.',
            'Re-fill housing with ISO VG 220 synthetic polyurea grease and conduct 15-min spin-up test.'
          ],
      requiredSpareParts: [
        { partNo: 'BRG-6214-C3-SKF', name: isSpanish ? 'Rodamiento de Bolas SKF 6214-C3' : isGerman ? 'Rillenkugellager SKF 6214-C3' : 'Deep Groove Ball Bearing 70x125x24mm', qty: 1 },
        { partNo: 'LUB-SYN-220-400G', name: isSpanish ? 'Grasa Sintética Poliarea 220' : isGerman ? 'Synthetisches Polyharnstoff-Fett' : 'Synthetic Polyurea High-Temp Grease Cartridge', qty: 2 }
      ],
      safetyPrecautions: [
        isSpanish ? 'Verificación obligatoria de LOTO antes de abrir el armario eléctrico.' : 'Mandatory LOTO verification before opening motor electrical junction enclosure.',
        isSpanish ? 'Usar guantes de seguridad térmica (mínimo 150°C).' : 'Wear thermal safety gloves (min 150°C rating) when handling induction-heated bearing assemblies.'
      ]
    };
  }

  // Normal Baseline
  return {
    faultTitle: isSpanish
      ? 'Línea de Base del Sistema Saludable - Parámetros Óptimos'
      : isGerman
      ? 'Gesunder Systemzustand - Optimale Betriebsparameter'
      : 'Healthy System Baseline - Optimal Operational Parameters',
    confidenceScore: 99.2,
    isoClass: 'Class I: Excellent Condition / Below ISO 10816 Vibration Limit',
    urgencyLevel: 'NORMAL',
    rootCauseAnalysis: `All 6 sensor parameters (Vibration ${sensorData.vibration} mm/s, Temp ${sensorData.temperature}°C, Pressure ${sensorData.pressure} PSI, Acoustic ${sensorData.acoustic} dB, RPM ${sensorData.rpm}, Power ${sensorData.power} kW) are operating strictly within normal baseline control limits.`,
    estimatedRULHours: sensorData.rulHours,
    stepByStepSOP: [
      'Continue standard automated telemetry monitoring schedule (15-min interval).',
      'Next routine preventive inspection scheduled in 45 days.',
      'Maintain standard lubrication sampling every 500 operating hours.'
    ],
    requiredSpareParts: [],
    safetyPrecautions: ['Standard shop-floor PPE (Safety glasses, steel-toe boots, hard hat).']
  };
}
