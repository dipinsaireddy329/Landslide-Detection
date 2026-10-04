import React from 'react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  LineChart, 
  Line, 
  CartesianGrid 
} from 'recharts';
import { 
  ShieldCheck, 
  HelpCircle
} from 'lucide-react';
import { AnalyticsData } from '../types';

interface AnalyticsViewProps {
  analytics: AnalyticsData;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ analytics }) => {
  const pieData = analytics.predictionDistribution;
  const barData = analytics.confidenceDistribution;
  const lineData = analytics.detectionTimeline;

  // Custom Light Tooltip for Recharts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border border-slate-200 bg-white/95 p-2.5 shadow-lg text-xs font-mono">
          <div className="text-slate-800 font-bold mb-1">{label}</div>
          {payload.map((entry: any, index: number) => (
            <div key={`item-${index}`} className="flex items-center gap-2 text-slate-600">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color || entry.fill }} />
              <span>{entry.name}:</span>
              <span className="font-bold text-slate-900">{entry.value}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            System Analytics & Research Evaluation
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Comprehensive telemetry, class distribution, confidence histogram, and reported academic model benchmarks.
          </p>
        </div>

        {/* Prominent Model Accuracy Banner */}
        <div className="rounded-xl border border-sky-200 bg-sky-50/70 px-4 py-2.5 flex items-center gap-3 shadow-xs">
          <ShieldCheck className="h-5 w-5 text-sky-700 shrink-0" />
          <div>
            <div className="text-[11px] font-mono text-sky-800 uppercase tracking-wider font-semibold">
              Reported Model Accuracy
            </div>
            <div className="text-lg font-mono font-bold text-slate-900">
              96.58%
            </div>
          </div>
        </div>
      </div>

      {/* Accuracy & Empirical Validation Disclaimer Card */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 text-xs text-slate-600 flex items-start gap-3 shadow-xs">
        <HelpCircle className="h-4 w-4 text-sky-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-slate-900">Academic Evaluation Benchmark:</strong> The deep learning architecture (VGG19 feature extraction + multi-scale Gabor filter bank + ResNet101 classifier) achieved a reported validation accuracy of <strong className="text-sky-700 font-semibold">96.58%</strong> across the benchmark satellite test partition. Real-world satellite inferences displayed below reflect session observations and live model predictions.
        </p>
      </div>

      {/* Row 1: Charts (Pie Distribution + Confidence Bar) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Prediction Distribution Donut (5 Cols) */}
        <div className="lg:col-span-5 rounded-xl border border-slate-200/90 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
            <div>
              <span className="text-xs font-mono text-sky-700 uppercase tracking-wider font-semibold">
                Class Breakdown
              </span>
              <h3 className="text-sm font-bold text-slate-900 mt-0.5">
                Prediction Distribution
              </h3>
            </div>
            <div className="text-xs font-mono text-slate-500">
              Total: {analytics.totalAnalyzed}
            </div>
          </div>

          <div className="h-64 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-2 flex items-center justify-center gap-6 text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-emerald-500" />
              <span className="text-slate-600">Non-Landslide:</span>
              <span className="font-bold text-slate-900">{analytics.nonLandslides} ({((analytics.nonLandslides / (analytics.totalAnalyzed || 1)) * 100).toFixed(1)}%)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-rose-500" />
              <span className="text-slate-600">Landslide:</span>
              <span className="font-bold text-slate-900">{analytics.landslidesDetected} ({((analytics.landslidesDetected / (analytics.totalAnalyzed || 1)) * 100).toFixed(1)}%)</span>
            </div>
          </div>
        </div>

        {/* Confidence Distribution Bar Chart (7 Cols) */}
        <div className="lg:col-span-7 rounded-xl border border-slate-200/90 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
            <div>
              <span className="text-xs font-mono text-sky-700 uppercase tracking-wider font-semibold">
                Reliability Metrics
              </span>
              <h3 className="text-sm font-bold text-slate-900 mt-0.5">
                Confidence Distribution Ranges
              </h3>
            </div>
            <div className="text-xs font-mono text-slate-500">
              Avg: {analytics.averageConfidence}%
            </div>
          </div>

          <div className="h-64 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                <XAxis dataKey="range" stroke="#94A3B8" tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis stroke="#94A3B8" tick={{ fontSize: 11, fill: '#64748B' }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" name="Total Analyzed" fill="#0284C7" radius={[4, 4, 0, 0]} />
                <Bar dataKey="landslides" name="Landslides" fill="#EF4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-2 flex items-center justify-center gap-6 text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded bg-sky-600" />
              <span className="text-slate-600">Total Observations</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded bg-rose-500" />
              <span className="text-slate-600">Positive Hazard Detections</span>
            </div>
          </div>
        </div>

      </div>

      {/* Row 2: Detection Timeline Line Chart */}
      <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
          <div>
            <span className="text-xs font-mono text-sky-700 uppercase tracking-wider font-semibold">
              Temporal Stream
            </span>
            <h3 className="text-sm font-bold text-slate-900 mt-0.5">
              Detection Timeline (Daily Observations)
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-500">
            Last 7 Observation Cycles
          </span>
        </div>

        <div className="h-64 w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={lineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
              <XAxis dataKey="date" stroke="#94A3B8" tick={{ fontSize: 11, fill: '#64748B' }} />
              <YAxis stroke="#94A3B8" tick={{ fontSize: 11, fill: '#64748B' }} />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="landslide" 
                name="Landslides" 
                stroke="#EF4444" 
                strokeWidth={2.5} 
                dot={{ r: 4, fill: '#EF4444' }} 
              />
              <Line 
                type="monotone" 
                dataKey="nonLandslide" 
                name="Non-Landslide" 
                stroke="#10B981" 
                strokeWidth={2} 
                strokeDasharray="4 4"
                dot={{ r: 3, fill: '#10B981' }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Row 3: Academic Confusion Matrix & Evaluation Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Confusion Matrix (6 Cols) */}
        <div className="lg:col-span-6 rounded-xl border border-slate-200/90 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
            <div>
              <span className="text-xs font-mono text-sky-700 uppercase tracking-wider font-semibold">
                Benchmark Verification
              </span>
              <h3 className="text-sm font-bold text-slate-900 mt-0.5">
                Model Confusion Matrix
              </h3>
            </div>
            <span className="text-xs font-mono text-slate-400">N = 148 Sample Set</span>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 text-center">
            
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-[10px] font-mono text-slate-500 uppercase font-semibold">True Positive (TP)</div>
              <div className="text-2xl font-mono font-bold text-emerald-700 mt-1">
                {analytics.confusionMatrix.truePositive}
              </div>
              <div className="text-[10px] text-slate-500 mt-1">Correctly identified Landslide</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-[10px] font-mono text-slate-500 uppercase font-semibold">False Positive (FP)</div>
              <div className="text-2xl font-mono font-bold text-rose-700 mt-1">
                {analytics.confusionMatrix.falsePositive}
              </div>
              <div className="text-[10px] text-slate-500 mt-1">Stable false alarms</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-[10px] font-mono text-slate-500 uppercase font-semibold">False Negative (FN)</div>
              <div className="text-2xl font-mono font-bold text-amber-700 mt-1">
                {analytics.confusionMatrix.falseNegative}
              </div>
              <div className="text-[10px] text-slate-500 mt-1">Missed hazard regions</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-[10px] font-mono text-slate-500 uppercase font-semibold">True Negative (TN)</div>
              <div className="text-2xl font-mono font-bold text-emerald-700 mt-1">
                {analytics.confusionMatrix.trueNegative}
              </div>
              <div className="text-[10px] text-slate-500 mt-1">Correctly verified Stable slope</div>
            </div>

          </div>
        </div>

        {/* Statistical Metrics (6 Cols) */}
        <div className="lg:col-span-6 rounded-xl border border-slate-200/90 bg-white p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
              <div>
                <span className="text-xs font-mono text-sky-700 uppercase tracking-wider font-semibold">
                  Performance Metrics
                </span>
                <h3 className="text-sm font-bold text-slate-900 mt-0.5">
                  Classifier Precision & Recall
                </h3>
              </div>
              <span className="text-xs font-mono text-sky-800 font-semibold bg-sky-50 px-2 py-0.5 rounded border border-sky-200">ResNet101 Backbone</span>
            </div>

            <div className="mt-4 space-y-2.5">
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-xs text-slate-700 font-medium">Precision (Landslide Detection)</span>
                <span className="text-sm font-mono font-bold text-sky-700">96.77%</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-xs text-slate-700 font-medium">Recall / Sensitivity</span>
                <span className="text-sm font-mono font-bold text-sky-700">95.23%</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-xs text-slate-700 font-medium">Specificity (True Negative Rate)</span>
                <span className="text-sm font-mono font-bold text-sky-700">97.64%</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-xs text-slate-700 font-medium">F1-Score Harmonic Mean</span>
                <span className="text-sm font-mono font-bold text-emerald-700">0.9599</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200 text-[11px] font-mono text-slate-400">
            Validated using stratified 5-fold cross-validation on remote sensing benchmark datasets.
          </div>
        </div>

      </div>

    </div>
  );
};
