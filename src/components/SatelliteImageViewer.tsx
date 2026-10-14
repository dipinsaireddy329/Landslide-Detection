import React, { useState, useRef, useEffect } from 'react';
import { 
  Layers, 
  SplitSquareVertical, 
  Grid2X2, 
  Eye, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Download, 
  Compass, 
  MapPin, 
  ShieldAlert, 
  Activity, 
  Info,
  Maximize2,
  Minimize2,
  Sliders
} from 'lucide-react';
import { 
  generateNadirSatelliteTile, 
  SatelliteViewingMode, 
  SatelliteTileMetadata 
} from '../services/satelliteImageryService';

export interface SatelliteImageViewerProps {
  sceneId?: string;
  locationName?: string;
  coordinates?: { lat: number; lng: number };
  satelliteSource?: 'Sentinel-2' | 'Landsat-8' | 'Landsat-9' | 'NASA Worldview' | 'PlanetScope';
  groundTruth?: 'Landslide' | 'Stable';
  riskLevel?: 'Critical' | 'High' | 'Moderate' | 'Low';
  acquisitionDate?: string;
  spatialResolution?: string;
  ndviScore?: number;
  sdiScore?: number;
  initialMode?: 'natural' | 'before_after' | 'false_color' | 'gis_overlay' | 'ndvi' | 'quad';
  className?: string;
  onDetectAction?: () => void;
}

export const SatelliteImageViewer: React.FC<SatelliteImageViewerProps> = ({
  sceneId = 'scene-tirumala-01',
  locationName = 'Tirumala First Ghat Km 14.2, Eastern Ghats',
  coordinates = { lat: 13.6748, lng: 79.3512 },
  satelliteSource = 'Sentinel-2',
  groundTruth = 'Landslide',
  riskLevel = 'Critical',
  acquisitionDate = '2023-10-26',
  spatialResolution = '10m GSD',
  ndviScore = 0.16,
  sdiScore = 8.5,
  initialMode = 'natural',
  className = '',
  onDetectAction
}) => {
  // Active viewing mode
  const [activeMode, setActiveMode] = useState<
    'natural' | 'before_after' | 'false_color' | 'gis_overlay' | 'ndvi' | 'quad'
  >(initialMode);

  // Before / After split slider position (percentage 0 to 100)
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const [isDraggingSlider, setIsDraggingSlider] = useState<boolean>(false);

  // Zoom & Pan state
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState<boolean>(false);
  const [startPan, setStartPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Fullscreen container toggle
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // GIS Overlay layer controls
  const [showCriticalPolygon, setShowCriticalPolygon] = useState<boolean>(true);
  const [showHighPolygon, setShowHighPolygon] = useState<boolean>(true);
  const [showModeratePolygon, setShowModeratePolygon] = useState<boolean>(true);
  const [showStablePolygon, setShowStablePolygon] = useState<boolean>(true);

  const containerRef = useRef<HTMLDivElement>(null);

  // Build metadata for renderer
  const tileMetadata: SatelliteTileMetadata = {
    sceneId,
    source: satelliteSource,
    processingLevel: 'Level-2A BOA Surface Reflectance',
    acquisitionDate,
    spatialResolution,
    coordinates,
    cloudCoverPercentage: 1.2,
    sunElevationAngle: 44.5,
    spectralBands: ['B02', 'B03', 'B04', 'B08'],
    groundTruth,
    riskLevel,
    measuredNdvi: ndviScore,
    sdiIndex: sdiScore,
    locationName
  };

  // Pre-generate tile URLs for smooth instant switching
  const naturalUrl = generateNadirSatelliteTile(tileMetadata, 'natural', 640, 640);
  const beforeUrl = generateNadirSatelliteTile(tileMetadata, 'before', 640, 640);
  const afterUrl = generateNadirSatelliteTile(tileMetadata, 'after', 640, 640);
  const falseColorUrl = generateNadirSatelliteTile(tileMetadata, 'false_color', 640, 640);
  const ndviUrl = generateNadirSatelliteTile(tileMetadata, 'ndvi', 640, 640);
  const gisOverlayUrl = generateNadirSatelliteTile(tileMetadata, 'gis_overlay', 640, 640);

  // Handle Before/After slider dragging
  const handleSliderMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(5, Math.min(95, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const handleMouseDownSlider = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDraggingSlider(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDraggingSlider) {
        handleSliderMove(e.clientX);
      }
    };
    const handleMouseUp = () => {
      setIsDraggingSlider(false);
    };

    if (isDraggingSlider) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingSlider]);

  // Handle Pan controls
  const handleMouseDownPan = (e: React.MouseEvent) => {
    if (activeMode === 'before_after') return;
    setIsPanning(true);
    setStartPan({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
  };

  const handleMouseMovePan = (e: React.MouseEvent) => {
    if (!isPanning) return;
    setPanOffset({
      x: e.clientX - startPan.x,
      y: e.clientY - startPan.y
    });
  };

  const handleMouseUpPan = () => {
    setIsPanning(false);
  };

  const resetViewport = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
    setSliderPosition(50);
  };

  const handleExportRaster = () => {
    const link = document.createElement('a');
    link.download = `${sceneId}_${activeMode}_satellite.png`;
    link.href = activeMode === 'false_color' ? falseColorUrl : activeMode === 'ndvi' ? ndviUrl : activeMode === 'gis_overlay' ? gisOverlayUrl : naturalUrl;
    link.click();
  };

  return (
    <div className={`relative flex flex-col rounded-xl border border-slate-700/80 bg-[#0B132B] text-slate-100 overflow-hidden shadow-2xl ${className} ${isFullscreen ? 'fixed inset-0 z-50 rounded-none' : ''}`}>
      
      {/* ----------------- TOP WORKSTATION CONTROLS BAR ----------------- */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 bg-[#0d1736] px-4 py-2.5">
        
        {/* Left: Mode Selection Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
          <button
            type="button"
            onClick={() => setActiveMode('natural')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              activeMode === 'natural'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            NATURAL COLOR
          </button>

          <button
            type="button"
            onClick={() => setActiveMode('before_after')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeMode === 'before_after'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <SplitSquareVertical className="h-3.5 w-3.5" />
            <span>BEFORE / AFTER</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMode('false_color')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeMode === 'false_color'
                ? 'bg-rose-700 text-white shadow-xs'
                : 'text-slate-400 hover:text-rose-300 hover:bg-slate-800'
            }`}
          >
            <span className="h-2 w-2 rounded-full bg-rose-500" />
            <span>FALSE COLOR (CIR)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMode('gis_overlay')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeMode === 'gis_overlay'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-emerald-300 hover:bg-slate-800'
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            <span>GIS OVERLAY</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMode('ndvi')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeMode === 'ndvi'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-amber-300 hover:bg-slate-800'
            }`}
          >
            <Activity className="h-3.5 w-3.5" />
            <span>NDVI ANALYSIS</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMode('quad')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeMode === 'quad'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-purple-300 hover:bg-slate-800'
            }`}
            title="Display 4-panel comparison grid matching remote sensing reference"
          >
            <Grid2X2 className="h-3.5 w-3.5" />
            <span>2×2 QUAD GRID</span>
          </button>
        </div>

        {/* Right: Viewport Controls & Export */}
        <div className="flex items-center gap-2">
          {activeMode !== 'quad' && (
            <div className="flex items-center gap-1 bg-slate-900/90 border border-slate-700/80 rounded-lg p-0.5 text-slate-300">
              <button
                type="button"
                onClick={() => setZoomLevel(prev => Math.min(prev + 0.25, 3.5))}
                className="p-1 hover:text-white hover:bg-slate-800 rounded cursor-pointer"
                title="Zoom In"
              >
                <ZoomIn className="h-3.5 w-3.5" />
              </button>
              <span className="px-1.5 text-[10px] font-mono font-semibold text-sky-400">
                {(zoomLevel * 100).toFixed(0)}%
              </span>
              <button
                type="button"
                onClick={() => setZoomLevel(prev => Math.max(prev - 0.25, 0.75))}
                className="p-1 hover:text-white hover:bg-slate-800 rounded cursor-pointer"
                title="Zoom Out"
              >
                <ZoomOut className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={resetViewport}
                className="p-1 hover:text-white hover:bg-slate-800 rounded cursor-pointer"
                title="Reset View"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={handleExportRaster}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-mono text-slate-200 transition-colors cursor-pointer"
            title="Download high-resolution orthorectified satellite composite"
          >
            <Download className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Export PNG</span>
          </button>

          {onDetectAction && (
            <button
              type="button"
              onClick={onDetectAction}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-sky-600 hover:bg-sky-500 font-mono text-xs font-bold text-white transition-all shadow-xs cursor-pointer active:scale-97"
            >
              <Activity className="h-3.5 w-3.5" />
              <span>Detect</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsFullscreen(prev => !prev)}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Workstation'}
          >
            {isFullscreen ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
          </button>
        </div>

      </div>

      {/* ----------------- MAIN SATELLITE CANVAS VIEWPORT ----------------- */}
      <div 
        ref={containerRef}
        className="relative w-full aspect-[16/10] sm:aspect-[16/9] md:min-h-[480px] overflow-hidden bg-slate-950 select-none cursor-crosshair"
        onMouseDown={handleMouseDownPan}
        onMouseMove={handleMouseMovePan}
        onMouseUp={handleMouseUpPan}
        onMouseLeave={handleMouseUpPan}
      >

        {/* 1. QUAD GRID MODE (Exact 4 panels from image.png) */}
        {activeMode === 'quad' ? (
          <div className="grid grid-cols-2 grid-rows-2 w-full h-full gap-1 p-1 bg-black">
            {/* Top-Left: Natural Color */}
            <div className="relative overflow-hidden border border-slate-800">
              <img src={naturalUrl} alt="Natural Color" className="w-full h-full object-cover" />
            </div>

            {/* Top-Right: Before / After split */}
            <div className="relative overflow-hidden border border-slate-800">
              <div className="relative w-full h-full flex">
                <div className="w-1/2 h-full overflow-hidden border-r border-white/60 relative">
                  <img src={beforeUrl} alt="Before" className="w-full h-full object-cover" />
                  <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/80 text-[10px] font-mono text-white">Before</span>
                </div>
                <div className="w-1/2 h-full overflow-hidden relative">
                  <img src={afterUrl} alt="After" className="w-full h-full object-cover" />
                  <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/80 text-[10px] font-mono text-white">After</span>
                </div>
              </div>
              <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/85 text-[10px] font-mono font-bold text-white border border-white/20">
                BEFORE / AFTER
              </div>
            </div>

            {/* Bottom-Left: False Color CIR */}
            <div className="relative overflow-hidden border border-slate-800">
              <img src={falseColorUrl} alt="False Color CIR" className="w-full h-full object-cover" />
            </div>

            {/* Bottom-Right: GIS Overlay with coordinate grid, scale bar, legend & hazard boundaries */}
            <div className="relative overflow-hidden border border-slate-800">
              <img src={gisOverlayUrl} alt="GIS Overlay" className="w-full h-full object-cover" />
            </div>
          </div>
        ) : activeMode === 'before_after' ? (
          /* 2. INTERACTIVE BEFORE / AFTER SLIDER MODE */
          <div className="relative w-full h-full overflow-hidden">
            {/* Full "After" Image underneath */}
            <img 
              src={afterUrl} 
              alt="After Landslide" 
              className="absolute inset-0 w-full h-full object-cover"
              style={{
                transform: `scale(${zoomLevel}) translate(${panOffset.x / zoomLevel}px, ${panOffset.y / zoomLevel}px)`
              }}
            />

            {/* Clipped "Before" Image on top */}
            <div 
              className="absolute inset-0 overflow-hidden pointer-events-none"
              style={{
                clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`
              }}
            >
              <img 
                src={beforeUrl} 
                alt="Before Landslide" 
                className="absolute inset-0 w-full h-full object-cover"
                style={{
                  transform: `scale(${zoomLevel}) translate(${panOffset.x / zoomLevel}px, ${panOffset.y / zoomLevel}px)`
                }}
              />
            </div>

            {/* Interactive Vertical Slider Line with Handle */}
            <div 
              className="absolute top-0 bottom-0 z-30 cursor-ew-resize flex items-center justify-center pointer-events-auto"
              style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
              onMouseDown={handleMouseDownSlider}
            >
              <div className="w-[3px] h-full bg-white drop-shadow-[0_0_8px_rgba(0,0,0,0.9)]" />
              <div className="absolute w-8 h-8 rounded-full bg-white text-slate-900 border-2 border-slate-900 shadow-xl flex items-center justify-center font-bold text-xs">
                ⇄
              </div>
            </div>

            {/* Before Pill Label */}
            <div className="absolute bottom-4 left-4 z-20 pointer-events-none">
              <span className="px-3 py-1.5 rounded-lg bg-black/85 text-xs font-mono font-bold text-emerald-400 border border-emerald-500/40 shadow-lg backdrop-blur-xs">
                BEFORE · PRE-FAILURE INTACT CANOPY
              </span>
            </div>

            {/* After Pill Label */}
            <div className="absolute bottom-4 right-4 z-20 pointer-events-none">
              <span className="px-3 py-1.5 rounded-lg bg-black/85 text-xs font-mono font-bold text-rose-400 border border-rose-500/40 shadow-lg backdrop-blur-xs">
                AFTER · POST-COLLAPSE FAILURE SCAR
              </span>
            </div>
          </div>
        ) : (
          /* 3. STANDARD SINGLE VIEW MODE (Natural, False Color, GIS Overlay, or NDVI) */
          <div 
            className="w-full h-full transition-transform duration-75 origin-center"
            style={{
              transform: `scale(${zoomLevel}) translate(${panOffset.x / zoomLevel}px, ${panOffset.y / zoomLevel}px)`
            }}
          >
            <img 
              src={
                activeMode === 'false_color' ? falseColorUrl :
                activeMode === 'ndvi' ? ndviUrl :
                activeMode === 'gis_overlay' ? gisOverlayUrl :
                naturalUrl
              } 
              alt={activeMode} 
              className="w-full h-full object-cover" 
            />
          </div>
        )}

        {/* Reticle grid overlay */}
        <div className="absolute inset-0 bg-geo-grid opacity-20 pointer-events-none" />

        {/* NDVI Radiometric Color Ramp Legend (when in NDVI mode) */}
        {activeMode === 'ndvi' && (
          <div className="absolute bottom-4 left-4 z-30 flex flex-col gap-1.5 p-3 rounded-xl bg-slate-950/90 border border-slate-700/80 text-xs font-mono shadow-2xl backdrop-blur-xs max-w-sm">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-200">
              <span>NDVI RADIOMETRIC SCALE</span>
              <span className="text-emerald-400">NIR-RED / NIR+RED</span>
            </div>
            
            <div className="w-full h-3 rounded-sm bg-gradient-to-r from-blue-600 via-red-600 via-yellow-500 to-emerald-600 border border-slate-700" />
            
            <div className="flex items-center justify-between text-[9.5px] text-slate-400 pt-0.5">
              <span>-0.20 (Water)</span>
              <span>0.15 (Bare Talus)</span>
              <span>0.40 (Scrub)</span>
              <span>+0.85 (Dense Canopy)</span>
            </div>
          </div>
        )}

      </div>

      {/* ----------------- BOTTOM SCIENTIFIC TELEMETRY FOOTER ----------------- */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-800 bg-[#070d1e] px-4 py-2.5 text-xs font-mono text-slate-400">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-1.5 text-slate-200 font-semibold">
            <MapPin className="h-3.5 w-3.5 text-sky-400" />
            <span>{locationName}</span>
          </div>

          <div className="text-slate-400">
            {Math.abs(coordinates.lat).toFixed(4)}°{coordinates.lat >= 0 ? 'N' : 'S'}, {Math.abs(coordinates.lng).toFixed(4)}°{coordinates.lng >= 0 ? 'E' : 'W'}
          </div>

          <div className="flex items-center gap-1.5 text-sky-400">
            <span>PLATFORM:</span>
            <span className="text-white font-bold">{satelliteSource}</span>
            <span className="text-slate-500">({spatialResolution})</span>
          </div>

          <div>
            ACQUISITION: <span className="text-slate-200 font-bold">{acquisitionDate}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-slate-500">GROUND TRUTH:</span>
            <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
              groundTruth === 'Landslide' 
                ? 'bg-rose-950 text-rose-300 border border-rose-600/50' 
                : 'bg-emerald-950 text-emerald-300 border border-emerald-600/50'
            }`}>
              {groundTruth.toUpperCase()}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-500">NDVI:</span>
            <span className={`font-bold ${ndviScore < 0.25 ? 'text-rose-400' : 'text-emerald-400'}`}>
              {ndviScore.toFixed(2)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-500">SDI:</span>
            <span className="text-amber-400 font-bold">{sdiScore.toFixed(1)}</span>
          </div>
        </div>
      </div>

    </div>
  );
};
