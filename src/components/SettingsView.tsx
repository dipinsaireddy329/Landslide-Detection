import React, { useState, useEffect } from 'react';
import { 
  Server, 
  Sliders, 
  Database, 
  Check, 
  RefreshCw, 
  RotateCcw,
  CheckCircle2
} from 'lucide-react';
import { api, AppSettings } from '../services/api';

interface SettingsViewProps {
  onSettingsChanged: () => void;
  onResetDatabase: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  onSettingsChanged,
  onResetDatabase
}) => {
  const [settings, setSettings] = useState<AppSettings>(api.getSettings());
  const [testingConnection, setTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    setSettings(api.getSettings());
  }, []);

  const handleSave = () => {
    api.updateSettings(settings);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
    onSettingsChanged();
  };

  const handleTestFlask = async () => {
    setTestingConnection(true);
    setConnectionStatus(null);
    try {
      const isOk = await api.checkFlaskHealth();
      if (isOk) {
        setConnectionStatus('Connected! Flask REST API on ' + settings.flaskApiUrl + ' is responding.');
      } else {
        setConnectionStatus('Unable to reach ' + settings.flaskApiUrl + '. Ensure python app.py is running in /backend directory.');
      }
    } catch (e: any) {
      setConnectionStatus('Connection error: ' + e.message);
    } finally {
      setTestingConnection(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="border-b border-slate-200/80 pb-4">
        <span className="text-xs font-mono text-sky-700 uppercase tracking-wider font-semibold">
          System Configuration
        </span>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 mt-1">
          Settings & Backend Integration
        </h1>
        <p className="mt-1 text-xs text-slate-500">
          Configure model inference backend, Flask REST API endpoints, hazard sensitivity thresholds, and SQLite data controls.
        </p>
      </div>

      {saveSuccess && (
        <div className="flex items-center gap-2 rounded-lg border border-emerald-300 bg-emerald-50 p-3 text-xs text-emerald-800 shadow-xs">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          <span>Configuration saved successfully.</span>
        </div>
      )}

      {/* Backend Engine Selection */}
      <div className="rounded-xl border border-slate-200/90 bg-white p-6 space-y-4 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-mono text-sky-700 uppercase tracking-wider font-semibold">
          <Server className="h-4 w-4" />
          <span>Backend Execution Architecture</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setSettings({ ...settings, backendMode: 'embedded_pipeline' })}
            className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
              settings.backendMode === 'embedded_pipeline'
                ? 'border-sky-500 bg-sky-50/70 ring-1 ring-sky-500 shadow-xs'
                : 'border-slate-200 bg-slate-50/50 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-900">Embedded AI Pipeline</span>
              {settings.backendMode === 'embedded_pipeline' && (
                <Check className="h-4 w-4 text-sky-700" />
              )}
            </div>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Executes high-fidelity client-side Gabor texture filtering, radiometric normalization, and calibrated ResNet101 inference without requiring an external Python process.
            </p>
            <span className="inline-block mt-2 font-mono text-[10px] text-emerald-800 font-semibold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
              Ready Out of the Box
            </span>
          </button>

          <button
            type="button"
            onClick={() => setSettings({ ...settings, backendMode: 'flask_rest_api' })}
            className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
              settings.backendMode === 'flask_rest_api'
                ? 'border-sky-500 bg-sky-50/70 ring-1 ring-sky-500 shadow-xs'
                : 'border-slate-200 bg-slate-50/50 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-900">Flask REST API (Python)</span>
              {settings.backendMode === 'flask_rest_api' && (
                <Check className="h-4 w-4 text-sky-700" />
              )}
            </div>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Routes image inference requests to the Python Flask backend service and queries the SQLite database directly.
            </p>
            <span className="inline-block mt-2 font-mono text-[10px] text-sky-800 font-semibold bg-sky-50 border border-sky-200 px-2 py-0.5 rounded">
              Requires Python Flask Server
            </span>
          </button>
        </div>

        {/* Flask Endpoint Config */}
        {settings.backendMode === 'flask_rest_api' && (
          <div className="pt-4 border-t border-slate-200 space-y-3">
            <label className="block text-xs font-semibold text-slate-700">
              Flask API Server URL
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={settings.flaskApiUrl}
                onChange={(e) => setSettings({ ...settings, flaskApiUrl: e.target.value })}
                placeholder="http://localhost:5000"
                className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-mono text-slate-900 focus:border-sky-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleTestFlask}
                disabled={testingConnection}
                className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-700 transition-colors cursor-pointer disabled:opacity-50 shadow-2xs"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${testingConnection ? 'animate-spin' : ''}`} />
                <span>Ping Flask</span>
              </button>
            </div>

            {connectionStatus && (
              <div className="text-xs font-mono p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700">
                {connectionStatus}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Hazard Thresholds */}
      <div className="rounded-xl border border-slate-200/90 bg-white p-6 space-y-4 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-mono text-sky-700 uppercase tracking-wider font-semibold">
          <Sliders className="h-4 w-4" />
          <span>Decision & Hazard Sensitivity</span>
        </div>

        <div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-700 font-semibold">Confidence Alert Threshold</span>
            <span className="font-mono text-sky-700 font-bold">
              {(settings.confidenceThreshold * 100).toFixed(0)}%
            </span>
          </div>
          <input
            type="range"
            min="0.50"
            max="0.98"
            step="0.01"
            value={settings.confidenceThreshold}
            onChange={(e) => setSettings({ ...settings, confidenceThreshold: parseFloat(e.target.value) })}
            className="w-full mt-2 accent-sky-600 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1">
            <span>50% (Permissive)</span>
            <span>85% (Recommended Benchmark)</span>
            <span>98% (Conservative)</span>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-xs">
          <div>
            <div className="text-slate-800 font-semibold">Automatic Emergency Alert Trigger</div>
            <div className="text-slate-500 text-[11px]">Spawn active hazard notifications when confidence exceeds threshold.</div>
          </div>
          <input
            type="checkbox"
            checked={settings.autoAlertOnCritical}
            onChange={(e) => setSettings({ ...settings, autoAlertOnCritical: e.target.checked })}
            className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
          />
        </div>
      </div>

      {/* Database Management */}
      <div className="rounded-xl border border-slate-200/90 bg-white p-6 space-y-4 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-mono text-sky-700 uppercase tracking-wider font-semibold">
          <Database className="h-4 w-4" />
          <span>Database & Cache Management</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg bg-slate-50 border border-slate-200">
          <div>
            <div className="text-xs font-bold text-slate-900">Reset Benchmark Dataset</div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              Restores initial seeded satellite records (Himalayas, Wayanad, Cascades, Appalachian).
            </div>
          </div>

          <button
            type="button"
            onClick={onResetDatabase}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors cursor-pointer self-start sm:self-auto shadow-2xs"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 rounded-xl bg-sky-600 hover:bg-sky-500 px-6 py-2.5 text-xs font-bold text-white transition-colors cursor-pointer shadow-xs"
        >
          <Check className="h-4 w-4" />
          <span>Apply & Save Settings</span>
        </button>
      </div>

    </div>
  );
};
