import React, { useState } from 'react';
import { 
  AlertTriangle, 
  ShieldAlert, 
  Check, 
  Clock, 
  MapPin, 
  ExternalLink, 
  Shield, 
  Info,
  CheckCircle2
} from 'lucide-react';
import { AlertRecord, AlertStatus, AlertSeverity } from '../types';

interface AlertsViewProps {
  alerts: AlertRecord[];
  onAcknowledgeAlert: (alertId: string) => void;
  onViewAnalysis: (predictionId: string) => void;
}

export const AlertsView: React.FC<AlertsViewProps> = ({
  alerts,
  onAcknowledgeAlert,
  onViewAnalysis
}) => {
  const [statusFilter, setStatusFilter] = useState<'all' | AlertStatus>('all');
  const [severityFilter, setSeverityFilter] = useState<'all' | AlertSeverity>('all');

  const filteredAlerts = alerts.filter((a) => {
    if (statusFilter !== 'all' && a.status !== statusFilter) return false;
    if (severityFilter !== 'all' && a.severity !== severityFilter) return false;
    return true;
  });

  const activeCount = alerts.filter(a => a.status === 'active').length;

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Landslide Hazard Alert System
            </h1>
            {activeCount > 0 && (
              <span className="flex h-5 items-center px-2 rounded-full bg-rose-100 border border-rose-300 text-xs font-mono font-bold text-rose-800">
                {activeCount} Active
              </span>
            )}
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Emergency disaster-monitoring telemetry triggered by deep learning slope failure detection.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
          <Shield className="h-4 w-4 text-sky-700" />
          <span>Automated Hazard Broadcast Enabled</span>
        </div>
      </div>

      {/* Scientific Disclaimer */}
      <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-4 text-xs text-amber-900 flex items-start gap-3 shadow-xs">
        <Info className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Research Simulation Notice:</strong> This hazard monitoring interface demonstrates algorithmic alert generation based on computer vision classifications. Notifications reflect computational risk calculations from satellite imagery and must be cross-referenced with ground geotechnical sensors and local geological surveys before initiating emergency protocols.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl border border-slate-200/90 bg-white shadow-xs">
        
        {/* Status Filter */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
              statusFilter === 'all' ? 'bg-white text-slate-900 font-bold shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Alerts ({alerts.length})
          </button>
          <button
            onClick={() => setStatusFilter('active')}
            className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
              statusFilter === 'active' ? 'bg-rose-100 text-rose-800 font-bold' : 'text-slate-600 hover:text-rose-700'
            }`}
          >
            Active ({activeCount})
          </button>
          <button
            onClick={() => setStatusFilter('acknowledged')}
            className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
              statusFilter === 'acknowledged' ? 'bg-emerald-100 text-emerald-800 font-bold' : 'text-slate-600 hover:text-emerald-700'
            }`}
          >
            Acknowledged
          </button>
        </div>

        {/* Severity Filter */}
        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-slate-500 font-medium">Severity:</span>
          <select
            value={severityFilter}
            onChange={(e: any) => setSeverityFilter(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 focus:outline-none cursor-pointer font-medium"
          >
            <option value="all">All Severities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="warning">Warning</option>
          </select>
        </div>

      </div>

      {/* Alerts Stream List */}
      <div className="space-y-3.5">
        {filteredAlerts.length === 0 ? (
          <div className="rounded-xl border border-slate-200/90 bg-white p-12 text-center text-slate-500 shadow-xs">
            <CheckCircle2 className="h-10 w-10 mx-auto text-emerald-600 mb-2" />
            <p className="text-sm font-bold text-slate-900">No hazard alerts found.</p>
            <p className="text-xs text-slate-500 mt-1">All monitored sectors indicate geomorphic stability.</p>
          </div>
        ) : (
          filteredAlerts.map((alert) => {
            const isCritical = alert.severity === 'critical';
            const isActive = alert.status === 'active';

            return (
              <div
                key={alert.id}
                className={`rounded-xl border p-5 transition-all shadow-xs ${
                  isActive
                    ? isCritical
                      ? 'border-rose-300 bg-rose-50/60'
                      : 'border-amber-300 bg-amber-50/50'
                    : 'border-slate-200 bg-white opacity-85'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  
                  {/* Left Alert Lockup */}
                  <div className="flex items-start gap-4">
                    <div className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                      isActive 
                        ? isCritical ? 'bg-rose-100 text-rose-700 border border-rose-300' : 'bg-amber-100 text-amber-700 border border-amber-300'
                        : 'bg-slate-100 text-slate-500 border border-slate-200'
                    }`}>
                      <AlertTriangle className="h-5 w-5" />
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${
                          isCritical
                            ? 'bg-rose-100 text-rose-800 border-rose-300'
                            : 'bg-amber-100 text-amber-800 border-amber-300'
                        }`}>
                          {alert.severity} Severity
                        </span>

                        <span className="text-[11px] font-mono text-slate-400">
                          {alert.id}
                        </span>

                        <span className="text-slate-300">·</span>

                        <span className="text-[11px] font-mono text-slate-600 flex items-center gap-1 font-medium">
                          <MapPin className="h-3 w-3 text-slate-400" />
                          {alert.locationName || 'Monitored Sector'}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-slate-900 mt-1">
                        {alert.title}
                      </h3>

                      <p className="mt-1 text-xs text-slate-600 max-w-2xl leading-relaxed">
                        {alert.message}
                      </p>

                      <div className="mt-3 flex flex-wrap items-center gap-4 text-[11px] font-mono text-slate-500">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-slate-400" />
                          Detected: {new Date(alert.createdAt).toLocaleString()}
                        </span>

                        {alert.acknowledgedAt && (
                          <span className="text-emerald-700 font-semibold flex items-center gap-1 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                            <Check className="h-3 w-3" />
                            Acknowledged by {alert.acknowledgedBy} at {new Date(alert.acknowledgedAt).toLocaleTimeString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action CTAs */}
                  <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                    <button
                      onClick={() => onViewAnalysis(alert.predictionId)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 hover:text-slate-900 transition-colors cursor-pointer shadow-2xs"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      <span>View Analysis</span>
                    </button>

                    {isActive && (
                      <button
                        onClick={() => onAcknowledgeAlert(alert.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-xs font-semibold text-white transition-colors cursor-pointer shadow-xs"
                      >
                        <ShieldAlert className="h-3.5 w-3.5" />
                        <span>Acknowledge</span>
                      </button>
                    )}
                  </div>

                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
