import React from 'react';
import { 
  Satellite, 
  Cpu, 
  ShieldCheck, 
  ArrowRight, 
  Activity, 
  Layers, 
  Crosshair,
  Zap,
  Sparkles
} from 'lucide-react';
import { generateProceduralSatelliteImage } from '../services/sampleData';
import { TirupatiPhotographicBackground } from './TirupatiPhotographicBackground';

interface LandingPageProps {
  onStartAnalysis: () => void;
  onExploreTech: () => void;
  onOpenLogin: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartAnalysis,
  onExploreTech,
  onOpenLogin
}) => {
  const [heroImage, setHeroImage] = React.useState<string>('');

  React.useEffect(() => {
    const img = generateProceduralSatelliteImage('landslide_1');
    setHeroImage(img);
  }, []);

  return (
    <div className="relative min-h-[calc(100vh-4rem)] bg-[#F8FAFC] overflow-hidden">
      
      {/* Background subtle grid pattern */}
      <div className="absolute inset-0 bg-geo-grid opacity-60 pointer-events-none z-0" />
      <div className="absolute top-1/6 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-sky-200/30 blur-[120px] rounded-full pointer-events-none z-0" />

      {/* Tirupati Seven Hills Photographic Panoramic Background */}
      <TirupatiPhotographicBackground
        variant="hero"
        className="absolute bottom-0 left-0 right-0 h-[380px] sm:h-[480px] lg:h-[580px] w-full pointer-events-none z-0"
        opacity={0.13}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        
        {/* Top Operational Badge */}
        <div className="flex items-center justify-center">
          <div className="inline-flex items-center gap-2.5 rounded-full border border-sky-200 bg-white/90 px-3.5 py-1.5 text-xs font-mono text-slate-700 shadow-xs backdrop-blur-xs">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold text-slate-800">MODEL STATUS: OPERATIONAL</span>
            <span className="text-slate-300">|</span>
            <span className="text-slate-500">ACCURACY: 96.58%</span>
          </div>
        </div>

        {/* Hero Typography */}
        <div className="mt-8 text-center max-w-4xl mx-auto">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl text-balance leading-tight">
            Detect Landslides Before They Become Disasters.
          </h1>
          
          <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-normal">
            Analyze satellite imagery using deep learning to identify potential landslide regions with AI-powered image classification.
          </p>

          {/* Action CTAs */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={onStartAnalysis}
              className="flex items-center gap-2.5 rounded-xl bg-sky-600 px-7 py-3.5 text-sm font-semibold text-white hover:bg-sky-500 transition-all shadow-sm active:scale-98 cursor-pointer"
            >
              <Satellite className="h-4 w-4" />
              <span>Analyze Satellite Image</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            <button
              onClick={onExploreTech}
              className="flex items-center gap-2.5 rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-sm font-medium text-slate-700 hover:border-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all shadow-xs cursor-pointer"
            >
              <Cpu className="h-4 w-4 text-sky-600" />
              <span>Explore the Technology</span>
            </button>
          </div>
        </div>

        {/* Hero Visual Stage with Clean Satellite Viewport */}
        <div className="mt-14 max-w-5xl mx-auto relative">
          
          {/* Main Card Frame */}
          <div className="relative rounded-2xl border border-slate-200/90 bg-white p-3 sm:p-5 shadow-lg shadow-slate-200/50">
            
            {/* Viewport */}
            <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
              
              {heroImage ? (
                <img 
                  src={heroImage} 
                  alt="Satellite Remote Sensing Terrain"
                  className="w-full h-full object-cover object-center filter contrast-105"
                />
              ) : (
                <div className="w-full h-full bg-slate-50 flex items-center justify-center text-slate-400 font-mono text-xs">
                  Initializing Satellite Stream...
                </div>
              )}

              {/* Grid HUD Overlay */}
              <div className="absolute inset-0 bg-geo-grid opacity-30 pointer-events-none" />

              {/* Animated AI Scanning Beam */}
              <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-sky-500 to-transparent shadow-[0_0_12px_rgba(14,165,233,0.8)] animate-scan-beam pointer-events-none" />

              {/* Telemetry Corner Indicators */}
              <div className="absolute top-4 left-4 bg-white/90 border border-slate-200 rounded-md px-2.5 py-1 text-[11px] font-mono text-slate-800 shadow-xs backdrop-blur-xs">
                LAT: 30°24'46"N · LNG: 79°19'28"E
              </div>

              <div className="absolute top-4 right-4 bg-white/90 border border-slate-200 rounded-md px-2.5 py-1 text-[11px] font-mono text-slate-800 shadow-xs backdrop-blur-xs flex items-center gap-1.5">
                <Crosshair className="h-3 w-3 text-sky-600 animate-spin" />
                <span className="font-semibold">GABOR RESNET-101 ACTIVE</span>
              </div>

              {/* Hazard Detection Box Overlay */}
              <div className="absolute top-1/4 left-1/3 w-48 h-48 border-2 border-dashed border-rose-500 rounded-lg bg-rose-500/10 flex flex-col justify-between p-2 pointer-events-none">
                <div className="flex items-center justify-between text-[10px] font-mono text-white font-bold bg-rose-600 px-1.5 py-0.5 rounded shadow-xs">
                  <span>LANDSLIDE SCAR</span>
                  <span>96.58%</span>
                </div>
                <div className="text-[10px] font-mono text-slate-900 bg-white/90 border border-rose-200 px-1.5 py-0.5 rounded font-medium shadow-xs">
                  SOIL DISPLACEMENT: SEVERE
                </div>
              </div>

              {/* Bottom Telemetry Bar */}
              <div className="absolute bottom-4 inset-x-4 bg-white/95 border border-slate-200 rounded-lg px-3 py-2 flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-slate-700 shadow-xs backdrop-blur-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900">SENTINEL-2 MULTISPECTRAL TILE</span>
                  <span className="text-slate-300">·</span>
                  <span className="text-sky-700 font-medium">VGG19 FEATURE MAP: EXTRACTED</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-slate-500">RES: 10M / PIXEL</span>
                  <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">READY FOR INFERENCE</span>
                </div>
              </div>

            </div>

          </div>

          {/* 4 Floating Capability Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            
            <div className="rounded-xl border border-slate-200/90 bg-white p-4.5 shadow-xs hover:border-slate-300 transition-colors">
              <div className="flex items-center gap-2 text-xs font-mono font-semibold text-sky-700">
                <Zap className="h-4 w-4" />
                <span>AI-Powered Detection</span>
              </div>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Autonomous terrain pattern analysis using computer vision backbones.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200/90 bg-white p-4.5 shadow-xs hover:border-slate-300 transition-colors">
              <div className="flex items-center gap-2 text-xs font-mono font-semibold text-sky-700">
                <Satellite className="h-4 w-4" />
                <span>Satellite Image Analysis</span>
              </div>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                High-resolution remote sensing for steep slopes & drainage basins.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200/90 bg-white p-4.5 shadow-xs hover:border-slate-300 transition-colors">
              <div className="flex items-center gap-2 text-xs font-mono font-semibold text-sky-700">
                <Layers className="h-4 w-4" />
                <span>Deep Learning Pipeline</span>
              </div>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Gabor texture filtering + VGG19 spatial conv + ResNet101 classifier.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200/90 bg-white p-4.5 shadow-xs hover:border-slate-300 transition-colors">
              <div className="flex items-center gap-2 text-xs font-mono font-semibold text-emerald-700">
                <ShieldCheck className="h-4 w-4" />
                <span>Confidence-Based Results</span>
              </div>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Probabilistic risk calibration with reported 96.58% research accuracy.
              </p>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
