import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import LiveTelemetryTab from './components/LiveTelemetryTab';
import GenAiDiagnosticTab from './components/GenAiDiagnosticTab';
import PromptPlaygroundTab from './components/PromptPlaygroundTab';
import WorkOrdersTab from './components/WorkOrdersTab';
import AnalyticsTab from './components/AnalyticsTab';
import ApiKeyModal from './components/ApiKeyModal';
import { SensorSimulator, FAULT_MODES, INITIAL_EQUIPMENT_LIST } from './utils/sensorSimulator';
import { Activity, Sparkles, Sliders, FileSpreadsheet, BarChart3 } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('telemetry');
  const [isStreaming, setIsStreaming] = useState(true);
  const [selectedEquipment, setSelectedEquipment] = useState(INITIAL_EQUIPMENT_LIST[0]);
  const [currentFaultMode, setCurrentFaultMode] = useState(FAULT_MODES.NORMAL);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('AEGIS_GEMINI_API_KEY') || '');
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);

  // Sensor Physics Simulator Instance
  const simulatorRef = useRef(new SensorSimulator());
  const [sensorData, setSensorData] = useState(() => simulatorRef.current.generateNextTick());

  // Real-time Telemetry Tick Loop (1.5 sec interval)
  useEffect(() => {
    if (!isStreaming) return;
    const interval = setInterval(() => {
      setSensorData(simulatorRef.current.generateNextTick());
    }, 1500);

    return () => clearInterval(interval);
  }, [isStreaming]);

  const handleSetFaultMode = (mode) => {
    setCurrentFaultMode(mode);
    simulatorRef.current.setFaultMode(mode);
    setSensorData(simulatorRef.current.generateNextTick());
  };

  const handleSaveApiKey = (key) => {
    setApiKey(key);
    localStorage.setItem('AEGIS_GEMINI_API_KEY', key);
  };

  const handleTriggerAiFromDashboard = () => {
    setActiveTab('genai');
  };

  return (
    <div className="app-container">
      {/* Navbar Header */}
      <Navbar
        isStreaming={isStreaming}
        onToggleStream={() => setIsStreaming(!isStreaming)}
        selectedEquipment={selectedEquipment}
        onSelectEquipment={setSelectedEquipment}
        currentFaultMode={currentFaultMode}
        onSetFaultMode={handleSetFaultMode}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        hasApiKey={!!apiKey}
      />

      {/* Tab Bar Navigation */}
      <nav className="tabs-nav">
        <button
          className={`tab-btn ${activeTab === 'telemetry' ? 'active' : ''}`}
          onClick={() => setActiveTab('telemetry')}
        >
          <Activity size={16} /> Live Telemetry & Digital Twin
        </button>

        <button
          className={`tab-btn ${activeTab === 'genai' ? 'active' : ''}`}
          onClick={() => setActiveTab('genai')}
        >
          <Sparkles size={16} /> GenAI Diagnostic & Copilot
        </button>

        <button
          className={`tab-btn ${activeTab === 'playground' ? 'active' : ''}`}
          onClick={() => setActiveTab('playground')}
        >
          <Sliders size={16} /> Prompt Engineering & Payload Studio
        </button>

        <button
          className={`tab-btn ${activeTab === 'workorders' ? 'active' : ''}`}
          onClick={() => setActiveTab('workorders')}
        >
          <FileSpreadsheet size={16} /> Work Orders & Maintenance History
        </button>

        <button
          className={`tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          <BarChart3 size={16} /> Model Performance & ISO Standards
        </button>
      </nav>

      {/* Main View Area */}
      <main className="main-content">
        {activeTab === 'telemetry' && (
          <LiveTelemetryTab
            sensorData={sensorData}
            faultMode={currentFaultMode}
            onTriggerAiDiagnostic={handleTriggerAiFromDashboard}
          />
        )}

        {activeTab === 'genai' && (
          <GenAiDiagnosticTab sensorData={sensorData} apiKey={apiKey} />
        )}

        {activeTab === 'playground' && (
          <PromptPlaygroundTab sensorData={sensorData} />
        )}

        {activeTab === 'workorders' && (
          <WorkOrdersTab sensorData={sensorData} />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsTab />
        )}
      </main>

      {/* Gemini API Key Modal */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        apiKey={apiKey}
        onSaveApiKey={handleSaveApiKey}
      />
    </div>
  );
}
