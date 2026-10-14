import React from 'react';
import { 
  Satellite, 
  AlertTriangle, 
  CheckCircle2, 
  Activity, 
  TrendingUp, 
  Clock, 
  ChevronRight,
  Sparkles,
  MapPin,
  ArrowRight
} from 'lucide-react';
import { PredictionRecord, AlertRecord, AnalyticsData } from '../types';
import { SATELLITE_SAMPLES, getSampleImageDataUrl } from '../services/sampleData';
import { ALL_100_BENCHMARK_SAMPLES } from '../services/benchmarkDataset100';

interface DashboardOverviewProps {
  analytics: AnalyticsData;
  recentPredictions: PredictionRecord[];
  activeAlerts: AlertRecord[];
  onNavigate: (view: string) => void;
  onSelectPrediction: (pred: PredictionRecord) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  analytics,
  recentPredictions,
  activeAlerts,
  onNavigate,
  onSelectPrediction
}) => {
  return (
    <div className="space-y-8">
      
      {/* Top Header & New Analysis CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Landslide Detection Dashboard
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Monitor satellite-image analysis, predictions, confidence levels, and alerts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('dispatch')}
            className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 px-4 py-3 text-xs font-bold text-white transition-all shadow-sm cursor-pointer shrink-0"
          >
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>GhatGuard Console</span>
          </button>
          <button
            onClick={() => onNavigate('detect')}
            className="flex items-center justify-center gap-2 rounded-xl bg-sky-600 hover:bg-sky-500 px-5 py-3 text-xs font-bold text-white transition-all shadow-sm active:scale-98 cursor-pointer shrink-0"
          >
            <Sparkles className="h-4 w-4" />
            <span>New Analysis</span>
          </button>
        </div>
      </div>

      {/* Featured: GhatGuard AI Mountain Corridor Dispatch Console */}
      <div className="rounded-2xl bg-gradient-to-r from-[#0B132B] via-[#1C2541] to-[#0F1A3A] border border-[#1C2541] p-5 sm:p-6 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-medium mb-3">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span>GhatGuard AI · Mountain Highway Dispatch Console</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white mb-2">
            Real-Time Landslide Hazard Corridor Segmentation
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Multi-zone vector polygon overlay for winding mountain ghat roads. Visualizes Critical (Red), High (Yellow), and Stable (Green) risk segments with operator annotation and road closure dispatch controls.
          </p>
        </div>

        <button
          onClick={() => onNavigate('dispatch')}
          className="relative z-10 flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-950/40 hover:scale-102 transition-all cursor-pointer whitespace-nowrap shrink-0"
        >
          <span>Open Dispatch Console</span>
          <ArrowRight className="h-4 w-4" />
        </button>

        {/* Ambient background decoration */}
        <div className="absolute right-0 top-0 bottom-0 w-96 bg-gradient-to-l from-emerald-500/10 via-sky-500/5 to-transparent pointer-events-none" />
      </div>

      {/* 4 Primary Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Total Images Analyzed */}
        <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-500 uppercase tracking-wider font-medium">
              Total Analyzed
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-50 border border-sky-200 text-sky-700">
              <Satellite className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-mono font-bold text-slate-900 tabular-nums">
              {analytics.totalAnalyzed}
            </span>
            <span className="text-xs text-slate-400 font-mono">Tiles</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 flex items-center gap-1">
            <TrendingUp className="h-3 w-3 text-sky-600" />
            <span>Sentinel-2 & Landsat-8 Ortho Tiles</span>
          </div>
        </div>

        {/* Card 2: Landslides Detected */}
        <div className="rounded-xl border border-rose-200/90 bg-rose-50/30 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-rose-700 uppercase tracking-wider font-semibold">
              Landslides Detected
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-100 border border-rose-300 text-rose-700">
              <AlertTriangle className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-mono font-bold text-rose-900 tabular-nums">
              {analytics.landslidesDetected}
            </span>
            <span className="text-xs text-rose-700 font-mono font-medium">Hazards</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500">
            <span>{((analytics.landslidesDetected / (analytics.totalAnalyzed || 1)) * 100).toFixed(1)}% of processed scenes</span>
          </div>
        </div>

        {/* Card 3: Non-Landslide Images */}
        <div className="rounded-xl border border-emerald-200/90 bg-emerald-50/30 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-emerald-700 uppercase tracking-wider font-semibold">
              Non-Landslide Images
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 border border-emerald-300 text-emerald-700">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-mono font-bold text-emerald-900 tabular-nums">
              {analytics.nonLandslides}
            </span>
            <span className="text-xs text-emerald-700 font-mono font-medium">Stable</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500">
            <span>Intact vegetative slope & bedrock</span>
          </div>
        </div>

        {/* Card 4: Average Confidence */}
        <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-500 uppercase tracking-wider font-medium">
              Average Confidence
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 border border-slate-200 text-slate-700">
              <Activity className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-mono font-bold text-slate-900 tabular-nums">
              {analytics.averageConfidence}%
            </span>
            <span className="text-xs text-emerald-700 font-mono font-semibold bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
              96.58% Acc
            </span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500">
            <span>Calibrated ResNet101 logits</span>
          </div>
        </div>

      </div>

      {/* Middle Row: Active Warnings */}
      {activeAlerts.length > 0 && (
        <div className="rounded-xl border border-rose-200 bg-rose-50/40 p-5 shadow-xs">
          <div className="flex items-center justify-between border-b border-rose-200/80 pb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-rose-600" />
              <span className="text-xs font-mono font-bold text-rose-800 uppercase tracking-wider">
                Emergency Monitoring Queue ({activeAlerts.length} Active Warnings)
              </span>
            </div>
            <button
              onClick={() => onNavigate('alerts')}
              className="text-xs font-semibold text-rose-700 hover:text-rose-900 flex items-center gap-1 cursor-pointer"
            >
              <span>View All Alerts</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
            {activeAlerts.slice(0, 2).map((alert) => (
              <div
                key={alert.id}
                className="flex items-start justify-between gap-3 p-3.5 rounded-lg bg-white border border-rose-200/80 shadow-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">{alert.title}</span>
                    <span className="text-[10px] font-mono text-rose-700 bg-rose-50 border border-rose-200 px-1.5 py-0.5 rounded font-bold uppercase">
                      {alert.severity}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-600 line-clamp-2">
                    {alert.message}
                  </p>
                  <div className="mt-2 text-[10px] font-mono text-slate-400">
                    {alert.locationName} · {new Date(alert.createdAt).toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 100 Satellite Benchmark Scenes Showcase */}
      <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-sky-700 uppercase tracking-wider font-semibold">
                Project Benchmark Dataset
              </span>
              <span className="text-[10px] font-mono bg-sky-50 text-sky-700 border border-sky-200 px-2 py-0.5 rounded-full font-bold">
                100 Global Corridors · 50 Hazards / 50 Stable
              </span>
            </div>
            <h2 className="text-base font-bold text-slate-900 mt-0.5">
              Curated Remote-Sensing Benchmark (Tirupati, Western Ghats, Himalayas & Global)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              100 authentic nadir Earth observation scenes (Sentinel-2, Landsat-8/9, PlanetScope) calibrated with verified ground truth, NDVI, and SDI scores.
            </p>
          </div>
          <button
            onClick={() => onNavigate('detect')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 text-xs font-semibold transition-colors cursor-pointer self-start sm:self-auto shrink-0"
          >
            <span>Explore All 100 in Detector</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Compact preview of benchmark scenes */}
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {ALL_100_BENCHMARK_SAMPLES.slice(0, 6).map((sample) => {
            const isHazard = sample.groundTruth === 'Landslide';
            return (
              <div
                key={sample.id}
                onClick={() => onNavigate('detect')}
                className="group rounded-lg border border-slate-200 overflow-hidden bg-slate-50 hover:border-sky-400 hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-950">
                  <img src={sample.mockImageUrl} alt={sample.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <span className={`absolute top-1 left-1 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold ${
                    isHazard ? 'bg-rose-950/85 text-rose-300 border border-rose-500/40' : 'bg-emerald-950/85 text-emerald-300 border border-emerald-500/40'
                  }`}>
                    {isHazard ? 'Critical' : 'Stable'}
                  </span>
                  <span className="absolute top-1 right-1 px-1 py-0.2 rounded text-[8px] font-mono bg-black/80 text-white/90">
                    {sample.satelliteSource}
                  </span>
                </div>
                <div className="p-2">
                  <div className="text-[11px] font-bold text-slate-900 group-hover:text-sky-700 truncate">{sample.title}</div>
                  <div className="text-[10px] font-mono text-slate-500 truncate">{sample.location.split(',')[0]}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Grid: Recent Inferences & Topology */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Recent Inferences Table (8 Cols) */}
        <div className="lg:col-span-8 rounded-xl border border-slate-200/90 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
            <div>
              <span className="text-xs font-mono text-sky-700 uppercase tracking-wider font-semibold">
                Inference Stream
              </span>
              <h2 className="text-base font-bold text-slate-900 mt-0.5">
                Recent Satellite Analyses
              </h2>
            </div>
            <button
              onClick={() => onNavigate('history')}
              className="text-xs font-semibold text-sky-700 hover:text-sky-900 flex items-center gap-1 cursor-pointer"
            >
              <span>Full History</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="mt-4 space-y-2.5">
            {recentPredictions.slice(0, 5).map((pred) => {
              const isLS = pred.prediction === 'landslide';
              return (
                <div
                  key={pred.id}
                  onClick={() => onSelectPrediction(pred)}
                  className="flex items-center justify-between gap-4 p-3 rounded-lg border border-slate-200/80 bg-white hover:bg-slate-50/80 hover:border-slate-300 transition-all cursor-pointer group shadow-2xs"
                >
                  <div className="flex items-center gap-3 truncate">
                    {/* Thumbnail */}
                    <div className="h-10 w-10 shrink-0 rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
                      {pred.imageUrl ? (
                        <img 
                          src={pred.imageUrl} 
                          alt="thumb" 
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-slate-400 font-mono text-[9px]">
                          IMG
                        </div>
                      )}
                    </div>

                    <div className="truncate">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 truncate max-w-xs group-hover:text-sky-700 transition-colors">
                          {pred.imageName}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">
                          {pred.id}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                        <MapPin className="h-3 w-3 text-slate-400" />
                        <span>{pred.locationName || 'Survey Grid'}</span>
                        <span className="text-slate-300">·</span>
                        <Clock className="h-3 w-3 text-slate-400" />
                        <span>{pred.processingTime} ms</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0 text-right">
                    <div>
                      <div className="flex items-center justify-end gap-1.5">
                        {isLS ? (
                          <span className="flex h-2 w-2 rounded-full bg-rose-500" />
                        ) : (
                          <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
                        )}
                        <span className={`text-xs font-bold uppercase ${
                          isLS ? 'text-rose-700' : 'text-emerald-700'
                        }`}>
                          {pred.prediction}
                        </span>
                      </div>
                      <div className="text-[11px] font-mono text-slate-500 mt-0.5 font-medium">
                        {(pred.confidence * 100).toFixed(2)}% Conf
                      </div>
                    </div>

                    <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-sky-700 transition-colors" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Model Spec Summary (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          
          <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-xs">
            <span className="text-xs font-mono text-sky-700 uppercase tracking-wider font-semibold">
              Deep Learning Topology
            </span>
            <h3 className="text-base font-bold text-slate-900 mt-0.5">
              Hybrid Feature Backbone
            </h3>
            
            <div className="mt-4 space-y-2.5 text-xs">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80">
                <div className="text-slate-500 font-mono text-[11px]">Feature Extractor</div>
                <div className="text-slate-900 font-bold mt-0.5">VGG19 Deep Convolutional</div>
                <div className="text-slate-500 text-[11px] mt-0.5">19 layers, ImageNet weights, block 4-5 spatial activation</div>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80">
                <div className="text-slate-500 font-mono text-[11px]">Texture Filter</div>
                <div className="text-slate-900 font-bold mt-0.5">2D Gabor Multi-orientation</div>
                <div className="text-slate-500 text-[11px] mt-0.5">θ∈&#123;0°, 45°, 90°, 135°&#125; slope striations & roughness</div>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80">
                <div className="text-slate-500 font-mono text-[11px]">Classifier Head</div>
                <div className="text-slate-900 font-bold mt-0.5">ResNet101 Deep Residual</div>
                <div className="text-slate-500 text-[11px] mt-0.5">Bottleneck skip connections, 96.58% benchmark accuracy</div>
              </div>
            </div>

            <button
              onClick={() => onNavigate('about-model')}
              className="mt-4 w-full flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 py-2 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
            >
              <span>Explore Model Spec</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-xs">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
              Research Objective
            </span>
            <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
              Autonomous identification of post-seismic and monsoon landslide events via remote sensing multispectral imagery.
            </p>
            <div className="mt-3 pt-3 border-t border-slate-200/80 flex items-center justify-between text-[11px] font-mono text-slate-600">
              <span>Reported Accuracy:</span>
              <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">96.58%</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
