import React, { useState } from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  ShieldAlert, 
  Download, 
  Clock, 
  MapPin, 
  Layers, 
  Check, 
  Sparkles,
  Activity
} from 'lucide-react';
import { PredictionRecord } from '../types';

interface PredictionResultProps {
  prediction: PredictionRecord;
  vggHeatmap?: string;
  gaborPreview?: string;
  onAcknowledgeAlert?: (alertId: string) => void;
  onNewAnalysis: () => void;
}

export const PredictionResult: React.FC<PredictionResultProps> = ({
  prediction,
  vggHeatmap,
  gaborPreview,
  onAcknowledgeAlert,
  onNewAnalysis
}) => {
  const [activeTab, setActiveTab] = useState<'image' | 'vgg' | 'gabor'>('image');
  const [alertAcknowledged, setAlertAcknowledged] = useState(false);

  const isLandslide = prediction.prediction === 'landslide';
  const confidencePercent = (prediction.confidence * 100).toFixed(2);
  const confValue = prediction.confidence * 100;

  // Circular gauge calculations
  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (confValue / 100) * circumference;

  const handleDownloadReport = () => {
    const report = {
      title: "Satellite Landslide Detection - AI Inference Report",
      timestamp: prediction.createdAt,
      predictionId: prediction.id,
      imageName: prediction.imageName,
      classification: prediction.prediction.toUpperCase(),
      confidence: `${confidencePercent}%`,
      riskLevel: prediction.riskLevel.toUpperCase(),
      processingTimeMs: prediction.processingTime,
      extractedFeatures: prediction.features,
      academicArchitecture: "VGG19 Feature Backbone + Gabor Filter Bank + ResNet101 Residual Classifier",
      modelReportedAccuracy: "96.58%"
    };
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Landslide_Report_${prediction.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner Alert (If Landslide Detected) */}
      {isLandslide && (
        <div className="rounded-xl border border-rose-300 bg-rose-50/80 p-5 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-rose-100 border border-rose-300 text-rose-700 shadow-2xs">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold tracking-wider text-rose-700 uppercase">
                    Hazard Classification
                  </span>
                  <span className="text-slate-300">·</span>
                  <span className="text-xs font-mono text-slate-500 font-medium">
                    ID: {prediction.id}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                  Landslide Risk Detected
                </h3>
                <p className="text-xs text-slate-700 mt-1 max-w-2xl leading-relaxed">
                  The analyzed satellite imagery indicates characteristics strongly associated with landslide activity: high soil displacement, steep chute striations, and severe loss of stabilizing vegetative canopy.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              {alertAcknowledged ? (
                <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-50 border border-emerald-300 text-xs font-semibold text-emerald-800">
                  <Check className="h-4 w-4" />
                  <span>Acknowledged</span>
                </div>
              ) : (
                <button
                  onClick={() => setAlertAcknowledged(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-xs font-semibold text-white transition-colors cursor-pointer shadow-xs"
                >
                  <ShieldAlert className="h-4 w-4" />
                  <span>Acknowledge Alert</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Results Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Image Viewer (7 Cols) */}
        <div className="lg:col-span-7 rounded-xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/80 pb-3">
            <div>
              <span className="text-xs font-mono text-sky-700 uppercase tracking-wider font-semibold">
                Imagery Inspection
              </span>
              <div className="text-sm font-bold text-slate-900 truncate max-w-sm mt-0.5">
                {prediction.imageName}
              </div>
            </div>

            {/* Layer Tabs */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
              <button
                onClick={() => setActiveTab('image')}
                className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                  activeTab === 'image' 
                    ? 'bg-white text-slate-900 border border-slate-200/80 font-bold shadow-2xs' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Satellite RGB
              </button>
              <button
                onClick={() => setActiveTab('gabor')}
                className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                  activeTab === 'gabor' 
                    ? 'bg-white text-slate-900 border border-slate-200/80 font-bold shadow-2xs' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Gabor Texture
              </button>
              <button
                onClick={() => setActiveTab('vgg')}
                className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                  activeTab === 'vgg' 
                    ? 'bg-white text-slate-900 border border-slate-200/80 font-bold shadow-2xs' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                VGG19 Heatmap
              </button>
            </div>
          </div>

          {/* Visual Display Port */}
          <div className="mt-4 relative aspect-[4/3] w-full rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
            {activeTab === 'image' && (
              <img 
                src={prediction.imageUrl} 
                alt="Analyzed Satellite"
                className="w-full h-full object-cover"
              />
            )}

            {activeTab === 'gabor' && (
              <div className="w-full h-full relative">
                {gaborPreview ? (
                  <img 
                    src={gaborPreview} 
                    alt="Gabor Filtered Edges" 
                    className="w-full h-full object-cover filter contrast-125"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-slate-500 font-mono text-xs">
                    <Layers className="h-8 w-8 text-sky-600 mb-2 opacity-60" />
                    <span>Gabor Filter Energy: {prediction.features.gaborTextureEnergy}</span>
                    <span className="text-[11px] text-slate-400 mt-1">Multi-orientation edge response calculated</span>
                  </div>
                )}
                <div className="absolute bottom-2 left-2 bg-slate-900/90 px-2 py-1 rounded text-[11px] font-mono text-white shadow-xs">
                  GABOR FILTER BANK (θ=0°, 45°, 90°, 135°)
                </div>
              </div>
            )}

            {activeTab === 'vgg' && (
              <div className="w-full h-full relative">
                {vggHeatmap ? (
                  <img 
                    src={vggHeatmap} 
                    alt="VGG19 Feature Activations" 
                    className="w-full h-full object-cover filter contrast-125"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-slate-500 font-mono text-xs">
                    <Activity className="h-8 w-8 text-rose-600 mb-2 opacity-60" />
                    <span>VGG19 Spatial Variance: {prediction.features.vggSpatialVariance}</span>
                    <span className="text-[11px] text-slate-400 mt-1">Conv5_3 Deep Feature Activations</span>
                  </div>
                )}
                <div className="absolute bottom-2 left-2 bg-slate-900/90 px-2 py-1 rounded text-[11px] font-mono text-rose-300 shadow-xs">
                  VGG19 DEEP SPATIAL FEATURE ACTIVATION MAP
                </div>
              </div>
            )}

            {/* Corner Geospatial Badge */}
            <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-xs border border-slate-200 rounded px-2 py-1 text-[11px] font-mono text-slate-700 shadow-xs">
              {prediction.locationName || 'Survey Sector Grid'}
            </div>
          </div>

          {/* Quick Imagery Metadata */}
          <div className="mt-3 flex flex-wrap items-center justify-between text-xs text-slate-500 font-mono">
            <span>Size: {(prediction.imageSize / 1024).toFixed(1)} KB</span>
            <span className="text-slate-300">·</span>
            <span>Dimensions: 224 × 224 Radiometric</span>
            <span className="text-slate-300">·</span>
            <span className="flex items-center gap-1 text-slate-700 font-medium">
              <Clock className="h-3 w-3 text-sky-600" />
              Inference: {prediction.processingTime} ms
            </span>
          </div>
        </div>

        {/* Right Column: AI Verdict & Confidence (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
          
          {/* Main Verdict Card */}
          <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-500 uppercase tracking-wider font-medium">
                Model Classification
              </span>
              <span className="text-xs font-mono text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Status: Completed
              </span>
            </div>

            {/* Big Verdict Lockup */}
            <div className="mt-4 flex items-center gap-4">
              <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${
                isLandslide 
                  ? 'bg-rose-100 border border-rose-300 text-rose-700' 
                  : 'bg-emerald-100 border border-emerald-300 text-emerald-700'
              }`}>
                {isLandslide ? (
                  <AlertTriangle className="h-7 w-7" />
                ) : (
                  <CheckCircle2 className="h-7 w-7" />
                )}
              </div>

              <div>
                <h2 className="text-2xl font-extrabold text-slate-900">
                  {isLandslide ? 'Landslide Detected' : 'No Landslide Detected'}
                </h2>
                <div className="mt-0.5 flex items-center gap-2 text-xs">
                  <span className="text-slate-500">Hazard Assessment:</span>
                  <span className={`font-mono font-bold uppercase ${
                    prediction.riskLevel === 'critical' ? 'text-rose-700' :
                    prediction.riskLevel === 'high' ? 'text-amber-700' :
                    prediction.riskLevel === 'moderate' ? 'text-yellow-700' : 'text-emerald-700'
                  }`}>
                    {prediction.riskLevel} Risk
                  </span>
                </div>
              </div>
            </div>

            {/* Circular Gauge & Confidence Bar */}
            <div className="mt-6 flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div>
                <div className="text-xs font-mono text-slate-500 uppercase font-medium">
                  Confidence Score
                </div>
                <div className="text-3xl font-mono font-bold text-slate-900 mt-1 tabular-nums">
                  {confidencePercent}%
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Calibrated ResNet101 Softmax Logit
                </div>
              </div>

              {/* Circular Gauge */}
              <div className="relative flex items-center justify-center">
                <svg className="w-24 h-24 transform -rotate-90">
                  <circle
                    cx="48"
                    cy="48"
                    r={radius}
                    stroke="currentColor"
                    strokeWidth="8"
                    className="text-slate-200"
                    fill="transparent"
                  />
                  <circle
                    cx="48"
                    cy="48"
                    r={radius}
                    stroke="currentColor"
                    strokeWidth="8"
                    className={isLandslide ? 'text-rose-600' : 'text-emerald-600'}
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    fill="transparent"
                  />
                </svg>
                <div className="absolute text-xs font-mono font-bold text-slate-900">
                  {(prediction.confidence).toFixed(2)}
                </div>
              </div>
            </div>

            {/* Linear Bar */}
            <div className="mt-3">
              <div className="flex justify-between text-[11px] font-mono text-slate-500 mb-1 font-medium">
                <span>Decision Threshold (0.50)</span>
                <span className={isLandslide ? 'text-rose-700 font-bold' : 'text-emerald-700 font-bold'}>
                  {confidencePercent}% Confidence
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden border border-slate-200">
                <div 
                  className={`h-full rounded-full transition-all duration-700 ${
                    isLandslide ? 'bg-rose-600' : 'bg-emerald-600'
                  }`}
                  style={{ width: `${confValue}%` }}
                />
              </div>
            </div>
          </div>

          {/* Feature Extraction Breakdown */}
          <div className="rounded-xl border border-slate-200/90 bg-white p-4 space-y-3 shadow-xs">
            <span className="text-xs font-mono text-sky-700 uppercase tracking-wider font-semibold">
              Extracted Feature Matrix
            </span>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <div className="text-[11px] text-slate-500 font-mono">Soil Displacement</div>
                <div className="text-sm font-mono font-bold text-slate-900 mt-0.5">
                  {(prediction.features.soilDisplacementIndex * 100).toFixed(1)}%
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <div className="text-[11px] text-slate-500 font-mono">Terrain Roughness</div>
                <div className="text-sm font-mono font-bold text-slate-900 mt-0.5">
                  {(prediction.features.terrainRoughness * 100).toFixed(1)}%
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <div className="text-[11px] text-slate-500 font-mono">Vegetation NDVI</div>
                <div className="text-sm font-mono font-bold text-slate-900 mt-0.5">
                  {(prediction.features.vegetationIndexNDVI * 100).toFixed(1)}%
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <div className="text-[11px] text-slate-500 font-mono">Gabor Energy</div>
                <div className="text-sm font-mono font-bold text-slate-900 mt-0.5">
                  {(prediction.features.gaborTextureEnergy * 100).toFixed(1)}%
                </div>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-3">
            <button
              onClick={onNewAnalysis}
              className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-sky-600 hover:bg-sky-500 py-2.5 text-xs font-semibold text-white transition-colors cursor-pointer shadow-xs"
            >
              <Sparkles className="h-4 w-4" />
              <span>Analyze Another Image</span>
            </button>

            <button
              onClick={handleDownloadReport}
              className="flex items-center justify-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer shadow-xs"
              title="Export Report JSON"
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
