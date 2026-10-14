import React, { useState, useEffect, useRef } from 'react';
import { 
  Layers, 
  Ruler, 
  Sliders, 
  MapPin, 
  ShieldAlert, 
  AlertTriangle, 
  ChevronDown, 
  ChevronUp, 
  Maximize2, 
  Minimize2, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Download, 
  Send, 
  CheckCircle2, 
  Mountain, 
  Activity, 
  Info, 
  Eye, 
  EyeOff, 
  Laptop, 
  Monitor, 
  Navigation,
  Compass,
  FileText,
  Search
} from 'lucide-react';
import { ALL_100_BENCHMARK_SAMPLES, BenchmarkSampleEntry } from '../services/benchmarkDataset100';
import { api } from '../services/api';

interface GhatGuardConsoleProps {
  onNavigateAlerts?: () => void;
  onNavigateDetect?: (sampleId?: string) => void;
}

export const GhatGuardConsole: React.FC<GhatGuardConsoleProps> = ({
  onNavigateAlerts,
  onNavigateDetect
}) => {
  // Active sample selection (default: sample-1, Tirumala First Ghat Km 14.2)
  const [selectedSample, setSelectedSample] = useState<BenchmarkSampleEntry>(ALL_100_BENCHMARK_SAMPLES[0]);
  const [sampleSearchQuery, setSampleSearchQuery] = useState('');
  const [sampleDropdownOpen, setSampleDropdownOpen] = useState(false);

  // Layout view mode: 'laptop' (with bezel mockup) vs 'fullscreen' (integrated dark workstation)
  const [viewMode, setViewMode] = useState<'laptop' | 'fullscreen'>('laptop');

  // Interactive Map Viewport state
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [startPan, setStartPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Active Tool Mode on the left bar
  const [activeTool, setActiveTool] = useState<'layers' | 'measure' | 'polygon' | 'filters'>('layers');

  // Layer Visibility Toggles
  const [showHazardPolygons, setShowHazardPolygons] = useState(true);
  const [showGhatRoad, setShowGhatRoad] = useState(true);
  const [showDebrisChutes, setShowDebrisChutes] = useState(true);
  const [showCatchmentZone, setShowCatchmentZone] = useState(true);
  const [activeOverlayType, setActiveOverlayType] = useState<'satellite' | 'vgg_heatmap' | 'gabor_edges' | 'ndvi_mask'>('satellite');

  // Accordion collapsible states
  const [metadataOpen, setMetadataOpen] = useState(true);
  const [annotationsOpen, setAnnotationsOpen] = useState(true);
  const [activeAnnotationTab, setActiveAnnotationTab] = useState<'logs' | 'new'>('logs');

  // Operator interactive actions
  const [operatorNotes, setOperatorNotes] = useState<string>(
    'Active debris chute shear noted at Km 14.2 apex. Recommend immediate closure of Ghat Road Segment S1 between Km 13.8 and Km 14.9.'
  );
  const [operatorLogs, setOperatorLogs] = useState<Array<{ id: string; time: string; author: string; text: string; severity: string }>>([
    {
      id: 'log-1',
      time: '14:28 UTC',
      author: 'Senior Geospatial Analyst',
      text: 'Multi-spectral PlanetScope analysis confirmed 0.65 NDVI collapse on uphill cut slope.',
      severity: 'critical'
    },
    {
      id: 'log-2',
      time: '14:15 UTC',
      author: 'Automated AI Dispatch',
      text: 'GhatGuard AI classified Segment S1 as CRITICAL (99.8% confidence). Soil displacement index 8.5.',
      severity: 'critical'
    }
  ]);
  const [dispatchAlertSent, setDispatchAlertSent] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Selected polygon zone for inspection tooltip
  const [selectedZone, setSelectedZone] = useState<'critical' | 'high' | 'stable' | 'catchment' | null>('critical');

  const viewportRef = useRef<HTMLDivElement>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Switch sample handler
  const handleSelectSample = (sample: BenchmarkSampleEntry) => {
    setSelectedSample(sample);
    setSampleDropdownOpen(false);
    // Update default notes based on sample
    if (sample.groundTruth === 'Landslide') {
      setOperatorNotes(
        `Critical instability identified at ${sample.title}. Soil displacement index ${sample.sdiScore}. Recommend engineering inspection.`
      );
    } else {
      setOperatorNotes(
        `Baseline evaluation: ${sample.title} remains stable with healthy canopy (NDVI ${sample.ndviScore}). No movement detected.`
      );
    }
    showToast(`Loaded benchmark sample: ${sample.id} (${sample.title})`);
  };

  // Dispatch Emergency Alert Handler
  const handleDispatchRoadClosure = async () => {
    setDispatchAlertSent(true);
    // Add operator log
    const newLog = {
      id: 'log-' + Date.now(),
      time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }) + ' UTC',
      author: 'Authorized Dispatcher',
      text: `EMERGENCY CLOSURE ORDER DISPATCHED for ${selectedSample.title}. Road warning sirens activated.`,
      severity: 'critical'
    };
    setOperatorLogs([newLog, ...operatorLogs]);
    showToast(`Road closure bulletin issued for ${selectedSample.title}!`);
    setTimeout(() => setDispatchAlertSent(false), 4000);
  };

  // Handle Pan and Zoom
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsPanning(true);
    setStartPan({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isPanning) return;
    setPanOffset({
      x: e.clientX - startPan.x,
      y: e.clientY - startPan.y
    });
  };

  const handleMouseUp = () => setIsPanning(false);

  const handleResetViewport = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  // Filter samples for dropdown search
  const filteredSamples = ALL_100_BENCHMARK_SAMPLES.filter(
    s => s.title.toLowerCase().includes(sampleSearchQuery.toLowerCase()) ||
         s.location.toLowerCase().includes(sampleSearchQuery.toLowerCase()) ||
         s.id.toLowerCase().includes(sampleSearchQuery.toLowerCase())
  );

  return (
    <div className="w-full flex flex-col items-center justify-center p-2 sm:p-4 lg:p-6 bg-slate-950 min-h-screen text-slate-100 font-sans selection:bg-sky-500/30">
      
      {/* Top Banner Toolbar */}
      <div className="w-full max-w-7xl flex flex-wrap items-center justify-between gap-3 mb-4 px-2">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <Mountain className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
                GhatGuard AI
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono font-medium">
                  Geospatial Console v2.4
                </span>
              </h1>
            </div>
            <p className="text-xs text-slate-400">
              Active Hazard Corridor Monitoring & Multi-Zone Polygon Segmentation
            </p>
          </div>
        </div>

        {/* Console View Controls */}
        <div className="flex items-center gap-2.5">
          {/* Bezel frame toggle */}
          <div className="flex items-center rounded-lg bg-slate-900 border border-slate-800 p-0.5">
            <button
              onClick={() => setViewMode('laptop')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
                viewMode === 'laptop'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Showcase in sleek laptop mockup bezel"
            >
              <Laptop className="h-3.5 w-3.5" />
              <span>Laptop Frame</span>
            </button>
            <button
              onClick={() => setViewMode('fullscreen')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
                viewMode === 'fullscreen'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Expand to edge-to-edge dark workstation"
            >
              <Monitor className="h-3.5 w-3.5" />
              <span>Full Workstation</span>
            </button>
          </div>

          {/* Quick switch sample button */}
          <div className="relative">
            <button
              onClick={() => setSampleDropdownOpen(!sampleDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-slate-500 text-xs font-medium text-slate-200 transition-colors cursor-pointer"
            >
              <Search className="h-3.5 w-3.5 text-sky-400" />
              <span>Samples ({ALL_100_BENCHMARK_SAMPLES.length})</span>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
            </button>

            {/* Dropdown Menu */}
            {sampleDropdownOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 max-h-96 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl p-3 z-50 overflow-hidden flex flex-col animate-fade-in backdrop-blur-md">
                <div className="relative mb-2">
                  <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                  <input
                    type="text"
                    value={sampleSearchQuery}
                    onChange={(e) => setSampleSearchQuery(e.target.value)}
                    placeholder="Search 100 benchmark corridors..."
                    className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-sky-500"
                    autoFocus
                  />
                </div>
                <div className="overflow-y-auto flex-1 space-y-1.5 pr-1 text-left">
                  {filteredSamples.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => handleSelectSample(s)}
                      className={`w-full text-left p-2 rounded-lg text-xs transition-colors flex items-start justify-between gap-2 cursor-pointer ${
                        selectedSample.id === s.id
                          ? 'bg-sky-600/30 border border-sky-500 text-white'
                          : 'hover:bg-slate-800 text-slate-300'
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold truncate text-[11px] text-white">
                          {s.id.toUpperCase()}: {s.title}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate">
                          {s.location}
                        </div>
                      </div>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-bold whitespace-nowrap ${
                        s.riskLevel === 'Critical' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                        s.riskLevel === 'High' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                        'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}>
                        {s.riskLevel}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-sky-600 text-white text-xs px-4 py-2.5 rounded-lg shadow-xl font-medium border border-sky-400/40 animate-fade-in flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-sky-200" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ==================== WORKSPACE CONTAINER ==================== */}
      <div className={`w-full transition-all duration-300 ${
        viewMode === 'laptop' 
          ? 'max-w-6xl mx-auto' 
          : 'max-w-full px-2'
      }`}>

        {/* LAPTOP BEZEL WRAPPER */}
        <div className={viewMode === 'laptop' ? 'relative p-3 sm:p-5 pb-7 rounded-[28px] bg-gradient-to-b from-[#2B323E] via-[#1A202C] to-[#111622] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] border-2 border-slate-700/60' : 'w-full'}>
          
          {/* Laptop Top Camera & Screen Notch */}
          {viewMode === 'laptop' && (
            <div className="flex items-center justify-center mb-2">
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-700/50">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="h-2 w-2 rounded-full bg-slate-800 border border-slate-600" />
                <span className="text-[9px] font-mono text-slate-400">GhatGuard Dispatch Display</span>
              </div>
            </div>
          )}

          {/* INNER CONSOLE WORKSPACE (#0B132B / #1C2541 aesthetic) */}
          <div className="relative w-full rounded-xl sm:rounded-2xl overflow-hidden bg-[#0B132B] border border-[#1C2541] shadow-2xl flex flex-col lg:flex-row min-h-[580px] lg:min-h-[640px]">
            
            {/* ================= 1. LEFT TOOLBAR & RISK LEGEND ================= */}
            <div className="w-full lg:w-16 bg-[#080E21] border-b lg:border-b-0 lg:border-r border-[#1C2541] flex lg:flex-col items-center justify-between p-2 lg:py-4 z-20">
              
              {/* Minimal Tool Icons */}
              <div className="flex lg:flex-col items-center gap-2">
                <button
                  onClick={() => setActiveTool('layers')}
                  className={`p-2 rounded-lg transition-all cursor-pointer ${
                    activeTool === 'layers' 
                      ? 'bg-sky-600/30 text-sky-400 border border-sky-500/40 shadow-xs' 
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                  title="Map Layers (Satellite, Heatmap, Gabor, NDVI)"
                >
                  <Layers className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setActiveTool('filters')}
                  className={`p-2 rounded-lg transition-all cursor-pointer ${
                    activeTool === 'filters' 
                      ? 'bg-sky-600/30 text-sky-400 border border-sky-500/40 shadow-xs' 
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                  title="Spectral Filters & Tuning"
                >
                  <Sliders className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setActiveTool('measure')}
                  className={`p-2 rounded-lg transition-all cursor-pointer ${
                    activeTool === 'measure' 
                      ? 'bg-sky-600/30 text-sky-400 border border-sky-500/40 shadow-xs' 
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                  title="Corridor Distance Measurement"
                >
                  <Ruler className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setActiveTool('polygon')}
                  className={`p-2 rounded-lg transition-all cursor-pointer ${
                    activeTool === 'polygon' 
                      ? 'bg-sky-600/30 text-sky-400 border border-sky-500/40 shadow-xs' 
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                  title="Polygon Annotation Tool"
                >
                  <Activity className="h-4 w-4" />
                </button>
              </div>

              {/* Vertical Color-Coded Risk Legend (as depicted in reference photo) */}
              <div className="flex lg:flex-col items-center gap-1.5 p-1.5 rounded-lg bg-[#0F1A3A]/80 border border-[#1C2541] shadow-xs text-left">
                <div className="w-1.5 h-14 rounded-full bg-gradient-to-b from-rose-500 via-amber-400 to-emerald-400 shadow-xs" />
                <div className="hidden lg:flex flex-col gap-1 text-[8px] font-mono leading-none tracking-tight text-slate-300">
                  <span className="text-rose-400 font-bold">Crit (90+%)</span>
                  <span className="text-amber-400 font-bold">High (75%)</span>
                  <span className="text-orange-300">Mod (50%)</span>
                  <span className="text-emerald-400 font-bold">Stb (10%)</span>
                </div>
              </div>

              {/* Lower Utility Control Dots */}
              <div className="flex lg:flex-col items-center gap-2">
                <button
                  onClick={handleResetViewport}
                  className="p-1.5 rounded-md text-slate-400 hover:text-sky-300 hover:bg-slate-800/50 transition-colors cursor-pointer"
                  title="Reset Map Orientation & Viewport"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </button>
                <div className="flex flex-col items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-600" />
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-600" />
                </div>
              </div>
            </div>

            {/* ================= 2. CENTRAL HIGH-RESOLUTION VIEWPORT ================= */}
            <div 
              ref={viewportRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              className="flex-1 relative overflow-hidden bg-[#0B132B] cursor-grab active:cursor-grabbing select-none"
              style={{ minHeight: '440px' }}
            >
              
              {/* Interactive Transformation Stage */}
              <div 
                className="w-full h-full relative transition-transform duration-75 origin-center"
                style={{
                  transform: `scale(${zoomLevel}) translate(${panOffset.x}px, ${panOffset.y}px)`
                }}
              >
                
                {/* A. SATELLITE BASE LAYER: Lush Mountain Terrain & Winding Valley */}
                <div 
                  className="absolute inset-0 w-full h-full bg-cover bg-center"
                  style={{
                    backgroundImage: `url('${selectedSample.mockImageUrl}')`,
                    filter: activeOverlayType === 'gabor_edges' 
                      ? 'contrast(180%) grayscale(100%)' 
                      : activeOverlayType === 'ndvi_mask' 
                      ? 'hue-rotate(90deg) saturate(200%)' 
                      : 'brightness(0.92) contrast(1.15)'
                  }}
                />

                {/* Dark Vignette / Atmospheric Depth */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B132B]/60 via-transparent to-[#0B132B]/40 pointer-events-none" />

                {/* Grid Coordinates Overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none" />

                {/* B. VECTOR ROAD & MULTI-ZONE POLYGONS SVG (matching the reference photo) */}
                <svg 
                  className="absolute inset-0 w-full h-full pointer-events-auto"
                  viewBox="0 0 800 600"
                  preserveAspectRatio="xMidYMid slice"
                >
                  <defs>
                    {/* Glowing filters for hazard zones */}
                    <filter id="glow-red" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="3" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                    <filter id="glow-yellow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="2.5" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                    {/* Chute hatching pattern */}
                    <pattern id="chute-hatch" width="10" height="10" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                      <line x1="0" y1="0" x2="0" y2="10" stroke="#EF4444" strokeWidth="1.2" strokeOpacity="0.7" />
                    </pattern>
                  </defs>

                  {/* 1. Ghat Road Base Centerline (Grey asphalt foundation) */}
                  {showGhatRoad && (
                    <path
                      d="M 190,0 Q 200,90 220,130 T 290,170 T 380,180 T 430,220 T 490,290 T 540,380 T 580,510 T 600,600"
                      fill="none"
                      stroke="#475569"
                      strokeWidth="14"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      opacity="0.8"
                    />
                  )}

                  {/* 2. Catchment / Runout Debris Fan Polygon (Blue-cyan translucent zone on lower slope) */}
                  {showCatchmentZone && (
                    <path
                      d="M 430,280 Q 470,300 480,340 T 450,420 T 510,480 T 540,430 T 520,330 T 470,260 Z"
                      fill="rgba(14, 165, 233, 0.42)"
                      stroke="#0284C7"
                      strokeWidth="1.8"
                      strokeDasharray="4 3"
                      className="cursor-pointer transition-all hover:fill-sky-500/60"
                      onClick={() => setSelectedZone('catchment')}
                    />
                  )}

                  {/* 3. Active Debris Chute Striations (Red shear lines draining down the slope) */}
                  {showDebrisChutes && (
                    <g stroke="#EF4444" strokeWidth="1.5" strokeOpacity="0.85" strokeLinecap="round">
                      <line x1="420" y1="210" x2="400" y2="245" />
                      <line x1="435" y1="230" x2="415" y2="270" />
                      <line x1="450" y1="245" x2="430" y2="285" />
                      <line x1="475" y1="270" x2="455" y2="310" />
                      <line x1="500" y1="310" x2="480" y2="350" />
                      <line x1="520" y1="340" x2="505" y2="375" />
                      <line x1="540" y1="390" x2="525" y2="425" />
                    </g>
                  )}

                  {/* 4. Hazard Polygons Overlaid on Road Segments (from photo: Green, Yellow, Red) */}
                  {showHazardPolygons && (
                    <>
                      {/* Segment 1: Green Stable Corridor (Upper Curve) */}
                      <path
                        d="M 190,0 Q 200,90 220,130"
                        fill="none"
                        stroke="#10B981"
                        strokeWidth="18"
                        strokeLinecap="round"
                        className="cursor-pointer hover:stroke-emerald-400 transition-colors"
                        onClick={() => setSelectedZone('stable')}
                      />

                      {/* Segment 2: Yellow High-Risk Ridge (Upper-Middle Crest) */}
                      <path
                        d="M 260,150 Q 320,175 380,180"
                        fill="none"
                        stroke="#EAB308"
                        strokeWidth="24"
                        strokeLinecap="round"
                        filter="url(#glow-yellow)"
                        className="cursor-pointer hover:stroke-yellow-300 transition-colors"
                        onClick={() => setSelectedZone('high')}
                      />

                      {/* Segment 3: Red Critical Landslide Rupture Zone (Acute Hairpin & Rupture Apex) */}
                      <path
                        d="M 430,220 Q 480,270 500,320"
                        fill="none"
                        stroke="#EF4444"
                        strokeWidth="26"
                        strokeLinecap="round"
                        filter="url(#glow-red)"
                        className="cursor-pointer hover:stroke-rose-400 transition-colors"
                        onClick={() => setSelectedZone('critical')}
                      />

                      {/* Segment 4: Lower Yellow High-Risk Shoulder */}
                      <path
                        d="M 525,350 Q 560,430 590,560"
                        fill="none"
                        stroke="#EAB308"
                        strokeWidth="22"
                        strokeLinecap="round"
                        className="cursor-pointer hover:stroke-yellow-300 transition-colors"
                        onClick={() => setSelectedZone('high')}
                      />
                    </>
                  )}

                  {/* 5. CRITICAL HAZARD WARNING TRIANGLE PIN (at the central rupture apex) */}
                  <g 
                    transform="translate(480, 290)" 
                    className="cursor-pointer animate-bounce"
                    onClick={() => setSelectedZone('critical')}
                  >
                    <circle r="14" fill="#EF4444" stroke="#FFFFFF" strokeWidth="2.5" shadow-lg="true" />
                    <polygon points="0,-7 7,6 -7,6" fill="#FFFFFF" />
                    <line x1="0" y1="-2" x2="0" y2="2" stroke="#EF4444" strokeWidth="1.6" strokeLinecap="round" />
                    <circle cx="0" cy="4" r="0.9" fill="#EF4444" />
                  </g>

                </svg>

                {/* VGG Activation Heatmap Overlay Mode */}
                {activeOverlayType === 'vgg_heatmap' && (
                  <div 
                    className="absolute inset-0 pointer-events-none mix-blend-screen opacity-70 bg-gradient-to-tr from-blue-900/40 via-red-600/50 to-amber-400/30"
                    style={{
                      background: 'radial-gradient(circle at 60% 50%, rgba(239,68,68,0.7) 0%, rgba(245,158,11,0.4) 40%, rgba(14,165,233,0.1) 75%)'
                    }}
                  />
                )}

              </div>

              {/* Viewport Floating Info Badge (Top Left of Canvas) */}
              <div className="absolute top-3 left-3 z-10 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#080E21]/85 border border-[#1C2541] backdrop-blur-md text-[11px] font-mono text-slate-300 shadow-lg">
                <Compass className="h-3.5 w-3.5 text-sky-400 animate-spin-slow" />
                <span>N 13°40&apos;29&quot; | E 79°21&apos;04&quot;</span>
                <span className="text-slate-500">|</span>
                <span className="text-emerald-400">10M GSD</span>
              </div>

              {/* Zoom & Viewport Controls (Bottom Left of Canvas) */}
              <div className="absolute bottom-3 left-3 z-10 flex items-center gap-1.5 p-1 rounded-lg bg-[#080E21]/90 border border-[#1C2541] backdrop-blur-md shadow-lg">
                <button
                  onClick={() => setZoomLevel(prev => Math.min(prev + 0.25, 2.5))}
                  className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
                  title="Zoom In"
                >
                  <ZoomIn className="h-4 w-4" />
                </button>
                <span className="text-[11px] font-mono px-1.5 text-slate-400">{Math.round(zoomLevel * 100)}%</span>
                <button
                  onClick={() => setZoomLevel(prev => Math.max(prev - 0.25, 0.75))}
                  className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
                  title="Zoom Out"
                >
                  <ZoomOut className="h-4 w-4" />
                </button>
                <div className="h-4 w-px bg-slate-700 mx-0.5" />
                <button
                  onClick={handleResetViewport}
                  className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
                  title="Reset View"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Active Inspection Tooltip Card (Bottom Center of Canvas) */}
              {selectedZone && (
                <div className="absolute bottom-3 right-3 lg:right-auto lg:left-1/2 lg:-translate-x-1/2 z-10 max-w-sm w-auto px-3.5 py-2 rounded-xl bg-[#080E21]/95 border border-[#1C2541] shadow-2xl backdrop-blur-md animate-fade-in text-left">
                  <div className="flex items-center justify-between gap-3 mb-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
                      {selectedZone === 'critical' && <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping" />}
                      {selectedZone === 'critical' ? 'Segment S1 (Km 14.2) - Critical Rupture' :
                       selectedZone === 'high' ? 'Segment S2 - High Slope Strain' :
                       selectedZone === 'catchment' ? 'Colluvial Runout Catchment Fan' : 'Segment S0 - Stable Bedrock'}
                    </span>
                    <button 
                      onClick={() => setSelectedZone(null)}
                      className="text-slate-400 hover:text-white text-xs cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    {selectedZone === 'critical' && 'Active tension scarp shearing with 8.5 SDI index. Debris chute directly intersects uphill Ghat road.'}
                    {selectedZone === 'high' && 'Laterite overburden under elevated hydrostatic pressure. Yellow warning threshold exceeded.'}
                    {selectedZone === 'catchment' && 'Runout deposition zone below scarp; sediment fan measures ~140m width across forest drainage.'}
                    {selectedZone === 'stable' && 'Dense canopy cover with root reinforcement matrix. Measured NDVI 0.83; slope angle 14°.'}
                  </p>
                </div>
              )}

            </div>

            {/* ================= 3. RIGHT CONTROL PANEL (Landslide Dispatch Console) ================= */}
            <div className="w-full lg:w-80 xl:w-96 bg-[#080E21] border-t lg:border-t-0 lg:border-l border-[#1C2541] flex flex-col p-4 sm:p-5 z-20 text-left overflow-y-auto max-h-[640px]">
              
              {/* Header: Landslide Dispatch Console & GhatGuard AI Logo */}
              <div className="flex items-center justify-between pb-3 border-b border-[#1C2541] mb-3">
                <div>
                  <h2 className="text-sm sm:text-base font-bold text-white tracking-tight">
                    Landslide Dispatch Console
                  </h2>
                  <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400 mt-0.5">
                    <span>Dispatch Center</span>
                    <span>•</span>
                    <span className="text-emerald-400 font-medium">Oct 26, 2023, 14:30 UTC</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-xs tracking-tight">
                  <Mountain className="h-4 w-4" />
                  <span>GhatGuard AI</span>
                </div>
              </div>

              {/* Analysis Status Card */}
              <div className="p-3.5 rounded-xl bg-[#0F1A3A]/90 border border-[#1C2541] mb-3 shadow-xs">
                <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold mb-1">
                  Analysis
                </div>
                <div className="text-xs font-semibold text-white truncate">
                  Sample ID: <span className="font-mono text-sky-300">{selectedSample.id.toUpperCase()}</span>
                </div>
                <div className="text-xs text-slate-300 truncate mt-0.5">
                  Location: <span className="font-medium text-slate-200">{selectedSample.title}</span>
                </div>

                <div className="mt-2.5 pt-2.5 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">Risk Level</span>
                  <div className={`px-2 py-0.5 rounded text-xs font-bold font-mono tracking-wide flex items-center gap-1.5 ${
                    selectedSample.riskLevel === 'Critical'
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 shadow-xs'
                      : selectedSample.riskLevel === 'High'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  }`}>
                    {selectedSample.riskLevel === 'Critical' && <AlertTriangle className="h-3.5 w-3.5 animate-pulse" />}
                    <span>{selectedSample.riskLevel.toUpperCase()}: {selectedSample.confidenceScore}% Conf.</span>
                  </div>
                </div>
              </div>

              {/* Accordion 1: ⌵ Metadata */}
              <div className="border border-[#1C2541] rounded-xl overflow-hidden mb-3 bg-[#0B132B]/80">
                <button
                  onClick={() => setMetadataOpen(!metadataOpen)}
                  className="w-full flex items-center justify-between p-3 text-xs font-semibold text-slate-200 hover:text-white hover:bg-slate-800/40 transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Info className="h-3.5 w-3.5 text-sky-400" />
                    <span>Metadata</span>
                  </span>
                  {metadataOpen ? <ChevronUp className="h-3.5 w-3.5 text-slate-400" /> : <ChevronDown className="h-3.5 w-3.5 text-slate-400" />}
                </button>

                {metadataOpen && (
                  <div className="p-3 pt-0 border-t border-[#1C2541]/60 text-xs font-mono space-y-2 text-slate-300">
                    <div className="flex justify-between items-center py-0.5 border-b border-slate-800/50">
                      <span className="text-slate-400">Source:</span>
                      <span className="text-white font-medium">{selectedSample.satelliteSource} ({selectedSample.resolution})</span>
                    </div>
                    <div className="flex justify-between items-center py-0.5 border-b border-slate-800/50">
                      <span className="text-slate-400">Date:</span>
                      <span className="text-slate-200">{selectedSample.captureDate || '2023-10-25'}</span>
                    </div>
                    <div className="flex justify-between items-center py-0.5 border-b border-slate-800/50">
                      <span className="text-slate-400">NDVI Drop:</span>
                      <span className="text-rose-400 font-bold">{(1.0 - selectedSample.ndviScore).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center py-0.5">
                      <span className="text-slate-400">SDI Index:</span>
                      <span className="text-amber-400 font-bold">{selectedSample.sdiScore} / 10.0</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Accordion 2: ⌵ Annotations */}
              <div className="border border-[#1C2541] rounded-xl overflow-hidden mb-3 bg-[#0B132B]/80 flex-1 flex flex-col">
                <button
                  onClick={() => setAnnotationsOpen(!annotationsOpen)}
                  className="w-full flex items-center justify-between p-3 text-xs font-semibold text-slate-200 hover:text-white hover:bg-slate-800/40 transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <FileText className="h-3.5 w-3.5 text-amber-400" />
                    <span>Annotations & Logs</span>
                  </span>
                  {annotationsOpen ? <ChevronUp className="h-3.5 w-3.5 text-slate-400" /> : <ChevronDown className="h-3.5 w-3.5 text-slate-400" />}
                </button>

                {annotationsOpen && (
                  <div className="p-3 pt-0 border-t border-[#1C2541]/60 flex-1 flex flex-col">
                    {/* Log text box (as shown in reference image) */}
                    <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 mb-2.5">
                      <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-1">
                        Active Dispatch Note
                      </div>
                      <p className="text-xs text-slate-200 leading-relaxed">
                        {operatorNotes}
                      </p>
                    </div>

                    {/* Operator Logs list */}
                    <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                      {operatorLogs.map((log) => (
                        <div key={log.id} className="text-[11px] p-2 rounded bg-[#080E21] border border-slate-800">
                          <div className="flex items-center justify-between text-[10px] text-slate-400 mb-0.5">
                            <span className="font-semibold text-sky-300">{log.author}</span>
                            <span className="font-mono">{log.time}</span>
                          </div>
                          <p className="text-slate-300 leading-tight">{log.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2 border-t border-[#1C2541]">
                <button
                  onClick={handleDispatchRoadClosure}
                  disabled={dispatchAlertSent}
                  className={`w-full py-2.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg ${
                    dispatchAlertSent
                      ? 'bg-emerald-600 text-white'
                      : selectedSample.riskLevel === 'Critical'
                      ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-950/40'
                      : 'bg-sky-600 hover:bg-sky-500 text-white shadow-sky-950/40'
                  }`}
                >
                  {dispatchAlertSent ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 text-emerald-200" />
                      <span>Road Closure Order Dispatched</span>
                    </>
                  ) : (
                    <>
                      <ShieldAlert className="h-4 w-4" />
                      <span>Issue Road Closure Alert</span>
                    </>
                  )}
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      if (onNavigateDetect) onNavigateDetect(selectedSample.id);
                    }}
                    className="py-1.5 px-2.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-slate-500 text-xs font-semibold text-slate-200 hover:text-white transition-colors cursor-pointer text-center"
                  >
                    Deep AI Inspect
                  </button>
                  <button
                    onClick={() => {
                      showToast(`GeoJSON & telemetry bundle exported for ${selectedSample.id}`);
                    }}
                    className="py-1.5 px-2.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-slate-500 text-xs font-semibold text-slate-200 hover:text-white transition-colors cursor-pointer text-center"
                  >
                    Export GeoJSON
                  </button>
                </div>
              </div>

            </div>

          </div>

          {/* Laptop Base Stand / Hinge (Matching the reference mockup) */}
          {viewMode === 'laptop' && (
            <div className="relative mx-auto mt-2 h-3.5 w-[96%] max-w-4xl rounded-b-xl bg-gradient-to-b from-[#2B323E] to-[#171D27] border-t border-slate-700/40 shadow-2xl flex items-center justify-center">
              <div className="h-1 w-16 rounded-full bg-slate-600/70" />
            </div>
          )}

        </div>
      </div>

    </div>
  );
};
