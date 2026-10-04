import React from 'react';
import { 
  CheckCircle2, 
  Loader2, 
  Circle, 
  Layers, 
  Cpu, 
  Sliders, 
  BarChart, 
  AlertTriangle,
  UploadCloud
} from 'lucide-react';

interface ProcessingPipelineProps {
  currentStageId: number; // 1 to 6
  isComplete: boolean;
  predictionResult?: 'landslide' | 'non-landslide' | null;
}

export const ProcessingPipeline: React.FC<ProcessingPipelineProps> = ({
  currentStageId,
  isComplete,
  predictionResult
}) => {
  const stages: {
    id: number;
    title: string;
    subhead: string;
    model: string;
    icon: React.ElementType;
    details: string;
  }[] = [
    {
      id: 1,
      title: 'Image Input',
      subhead: 'Satellite Multispectral Tile',
      model: 'Raw Imagery',
      icon: UploadCloud,
      details: 'Validated dimensions & radiometric bounds.'
    },
    {
      id: 2,
      title: 'Preprocessing',
      subhead: 'Resizing & Gabor Filtering',
      model: '224×224 Normalization',
      icon: Sliders,
      details: 'Bilinear downscale, Min-Max [0, 1], 2D Gabor kernels (θ=0°, 45°, 90°, 135°).'
    },
    {
      id: 3,
      title: 'Feature Extraction',
      subhead: 'VGG19 Conv Backbone',
      model: '19 Deep Layers',
      icon: Layers,
      details: 'Captures terrain roughness, soil displacement striations & vegetation loss.'
    },
    {
      id: 4,
      title: 'Classification',
      subhead: 'ResNet101 Classifier',
      model: 'Residual Bottlenecks',
      icon: Cpu,
      details: 'Deep residual feature mapping for high-gradient slope discrimination.'
    },
    {
      id: 5,
      title: 'Prediction',
      subhead: 'Class & Confidence',
      model: 'Softmax Probability',
      icon: BarChart,
      details: 'Determines Landslide vs Non-Landslide with calibrated risk index.'
    },
    {
      id: 6,
      title: 'Alert Generation',
      subhead: 'Hazard Assessment',
      model: 'Disaster Trigger',
      icon: AlertTriangle,
      details: 'Broadcasts emergency notification if soil displacement exceeds critical threshold.'
    }
  ];

  return (
    <div className="rounded-xl border border-slate-200/90 bg-white p-4 sm:p-6 shadow-xs">
      
      {/* Title & Pipeline Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/80 pb-4">
        <div>
          <span className="text-xs font-mono text-sky-700 uppercase tracking-wider font-semibold">
            AI Inference Pipeline
          </span>
          <h3 className="text-base font-bold text-slate-900">
            End-to-End Deep Learning Architecture
          </h3>
        </div>
        
        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="text-slate-500">Pipeline State:</span>
          {isComplete ? (
            <span className="text-emerald-700 font-semibold flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Completed (6/6 Stages)
            </span>
          ) : (
            <span className="text-sky-700 font-semibold flex items-center gap-1.5 bg-sky-50 border border-sky-200 px-2 py-0.5 rounded">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Processing Stage {currentStageId}/6
            </span>
          )}
        </div>
      </div>

      {/* Responsive Stages Grid */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-3">
        {stages.map((stage) => {
          const Icon = stage.icon;
          let status: 'completed' | 'processing' | 'pending' = 'pending';

          if (stage.id < currentStageId || isComplete) {
            status = 'completed';
          } else if (stage.id === currentStageId) {
            status = 'processing';
          }

          const isAlertStage = stage.id === 6;
          const isLandslideAlert = isAlertStage && isComplete && predictionResult === 'landslide';

          return (
            <div
              key={stage.id}
              className={`relative flex flex-col justify-between rounded-lg p-3.5 border transition-all ${
                status === 'processing'
                  ? 'border-sky-500 bg-sky-50/50 shadow-xs ring-1 ring-sky-500'
                  : status === 'completed'
                  ? isLandslideAlert 
                    ? 'border-rose-200 bg-rose-50/40'
                    : 'border-slate-200 bg-white'
                  : 'border-slate-200/60 bg-slate-50/50 opacity-60'
              }`}
            >
              {/* Top Node Indicator & Stage # */}
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] text-slate-400 font-medium">
                  Step 0{stage.id}
                </span>

                <div>
                  {status === 'completed' ? (
                    <CheckCircle2 className={`h-4 w-4 ${isLandslideAlert ? 'text-rose-600' : 'text-emerald-600'}`} />
                  ) : status === 'processing' ? (
                    <Loader2 className="h-4 w-4 animate-spin text-sky-600" />
                  ) : (
                    <Circle className="h-4 w-4 text-slate-300" />
                  )}
                </div>
              </div>

              {/* Icon & Title */}
              <div className="mt-3">
                <div className="flex items-center gap-2">
                  <Icon className={`h-4 w-4 ${
                    status === 'processing' 
                      ? 'text-sky-600' 
                      : status === 'completed'
                      ? isLandslideAlert ? 'text-rose-600' : 'text-emerald-600'
                      : 'text-slate-400'
                  }`} />
                  <span className="text-xs font-bold text-slate-900">
                    {stage.title}
                  </span>
                </div>

                <div className="mt-1 text-[11px] font-mono text-sky-700 font-semibold">
                  {stage.model}
                </div>

                <p className="mt-1 text-[11px] text-slate-500 leading-tight">
                  {stage.details}
                </p>
              </div>

              {/* Progress bar line for current stage */}
              {status === 'processing' && (
                <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-sky-100">
                  <div className="h-full w-full bg-sky-600 animate-pulse" />
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};
