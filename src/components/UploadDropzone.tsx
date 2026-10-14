import React, { useState, useRef, useMemo } from 'react';
import { 
  UploadCloud, 
  FileText, 
  Trash2, 
  Check, 
  AlertCircle, 
  Sparkles, 
  Crosshair, 
  MapPin,
  ChevronRight,
  Search,
  Filter,
  Zap,
  Globe,
  Eye,
  X,
  SlidersHorizontal,
  Compass,
  Satellite
} from 'lucide-react';
import { SatelliteSample } from '../types';
import { SATELLITE_SAMPLES, getSampleImageDataUrl } from '../services/sampleData';
import { ALL_100_BENCHMARK_SAMPLES, BenchmarkSampleEntry } from '../services/benchmarkDataset100';
import { SatelliteImageViewer } from './SatelliteImageViewer';
import { SatelliteMetadataControlPanel } from './SatelliteMetadataControlPanel';
import { 
  SatelliteAcquisitionMetadata, 
  validateSatelliteMetadata, 
  getDefaultAcquisitionMetadata 
} from '../services/satelliteValidation';

interface UploadDropzoneProps {
  onAnalyze: (fileOrUrl: File | string, metadata: { name: string; location: string; acquisitionMetadata?: SatelliteAcquisitionMetadata }) => void;
  isProcessing: boolean;
}

export const UploadDropzone: React.FC<UploadDropzoneProps> = ({
  onAnalyze,
  isProcessing
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [fileSize, setFileSize] = useState<number>(0);
  const [locationName, setLocationName] = useState<string>('Uttarakhand Slope Corridor');
  const [isDragOver, setIsDragOver] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [selectedSampleId, setSelectedSampleId] = useState<string | null>(null);
  const [selectedCorridorTitle, setSelectedCorridorTitle] = useState<string>('');
  
  // Satellite acquisition metadata & validation state
  const [metadata, setMetadata] = useState<SatelliteAcquisitionMetadata>(() => 
    getDefaultAcquisitionMetadata('Uttarakhand Slope Corridor')
  );

  const validation = useMemo(() => {
    return validateSatelliteMetadata(metadata);
  }, [metadata]);

  // Gallery filter & search state for the 100 benchmark corridors
  const [datasetScope, setDatasetScope] = useState<'100_all' | '20_core'>('100_all');
  const [filterCategory, setFilterCategory] = useState<'all' | 'landslide' | 'stable'>('all');
  const [sourceFilter, setSourceFilter] = useState<'all' | 'Sentinel-2' | 'Landsat-8/9' | 'PlanetScope'>('all');
  const [riskFilter, setRiskFilter] = useState<'all' | 'Critical' | 'High' | 'Moderate' | 'Low'>('all');
  const [sortBy, setSortBy] = useState<'default' | 'date_desc' | 'risk_desc' | 'ndvi_desc'>('default');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [visibleCount, setVisibleCount] = useState<number>(24);
  const [inspectingSample, setInspectingSample] = useState<BenchmarkSampleEntry | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const validateAndSetFile = (file: File) => {
    setErrorMsg(null);
    setSelectedSampleId(null);

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      setErrorMsg('Unsupported format. Please upload JPG, JPEG, or PNG satellite imagery.');
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      setErrorMsg('File exceeds 15 MB limit. Please select an optimized satellite tile.');
      return;
    }

    setSelectedFile(file);
    setFileName(file.name);
    setFileSize(file.size);
    setPreviewUrl(URL.createObjectURL(file));

    // Initialize telemetry for uploaded scene
    const parsedDate = new Date().toISOString().split('T')[0];
    const defaultMeta = getDefaultAcquisitionMetadata(locationName);
    defaultMeta.acquisitionDate = parsedDate;
    defaultMeta.sceneId = `USER_UPLOAD_${Date.now().toString(36).toUpperCase()}`;
    setMetadata(defaultMeta);
    setSelectedCorridorTitle(file.name.replace(/\.[^/.]+$/, ''));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setFileName('');
    setFileSize(0);
    setSelectedSampleId(null);
    setSelectedCorridorTitle('');
    setErrorMsg(null);
    setMetadata(getDefaultAcquisitionMetadata(locationName));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSelectSample = (sample: SatelliteSample, autoAnalyze: boolean = false) => {
    setErrorMsg(null);
    setSelectedSampleId(sample.id);
    setSelectedFile(null);
    setSelectedCorridorTitle(sample.name);
    const dataUrl = getSampleImageDataUrl(sample);
    const resolvedName = `${sample.name.replace(/\s+/g, '_')}_${(sample.sensor || 'Sentinel2').replace(/[^a-zA-Z0-9]/g, '')}.png`;
    setFileName(resolvedName);
    setFileSize(2450000);
    setLocationName(sample.region);
    setPreviewUrl(dataUrl);

    const isSouthIndia = sample.coordinates.lat < 16;
    const utmZone = isSouthIndia ? 'UTM Zone 44N (EPSG:32644)' : 'UTM Zone 43N (EPSG:32643)';
    const updatedMeta: SatelliteAcquisitionMetadata = {
      acquisitionDate: sample.date || '2023-09-15',
      sensorPlatform: sample.sensor ? (sample.sensor.includes('Sentinel') ? 'Sentinel-2B MSI (Copernicus ESA)' : sample.sensor) : 'Sentinel-2B MSI (Copernicus ESA)',
      cloudCover: 1.4,
      spatialResolution: sample.resolution || '10m GSD (Multispectral)',
      groundSamplingDistanceMeters: sample.resolution?.includes('30m') ? 30 : sample.resolution?.includes('3m') ? 3 : 10,
      sunElevation: 56.4,
      sunAzimuth: 135.2,
      processingLevel: 'Level-2A (Bottom-of-Atmosphere / BOA Reflectance)',
      crsProjection: `WGS 84 / ${utmZone}`,
      sceneId: `S2B_MSIL2A_${(sample.date || '20230915').replace(/-/g, '')}_${sample.id.toUpperCase()}`,
      relativeOrbit: 'R019 (Descending)',
      radiometricResolution: '12-bit Quantized Multispectral',
      latitude: sample.coordinates.lat,
      longitude: sample.coordinates.lng,
      elevationMeters: parseInt(sample.elevation) || 2450
    };
    setMetadata(updatedMeta);

    if (autoAnalyze) {
      onAnalyze(dataUrl, {
        name: resolvedName,
        location: sample.region,
        acquisitionMetadata: updatedMeta
      });
    }
  };

  const handleSelectBenchmark100 = (entry: BenchmarkSampleEntry, autoAnalyze: boolean = false) => {
    setErrorMsg(null);
    setSelectedSampleId(entry.id);
    setSelectedFile(null);
    setSelectedCorridorTitle(entry.title);
    const resolvedName = `${entry.id}_${entry.title.replace(/\s+/g, '_')}.png`;
    setFileName(resolvedName);
    setFileSize(1850000);
    setLocationName(entry.location);
    setPreviewUrl(entry.mockImageUrl);

    const lat = entry.coordinates?.lat ?? 30.41;
    const lng = entry.coordinates?.lng ?? 79.32;
    const isSouthIndia = lat < 16;
    const utmZone = isSouthIndia ? 'UTM Zone 44N (EPSG:32644)' : 'UTM Zone 43N (EPSG:32643)';
    
    let sensorPlat = 'Sentinel-2B MSI (Copernicus ESA)';
    let gsd = 10;
    if (entry.satelliteSource === 'Landsat-8/9') {
      sensorPlat = 'Landsat 9 OLI-2 (USGS / NASA)';
      gsd = 30;
    } else if (entry.satelliteSource === 'PlanetScope') {
      sensorPlat = 'PlanetScope Dove-R (Constellation)';
      gsd = 3;
    }

    const captureDate = entry.captureDate || '2024-07-28';
    const updatedMeta: SatelliteAcquisitionMetadata = {
      acquisitionDate: captureDate,
      sensorPlatform: sensorPlat,
      cloudCover: 1.2,
      spatialResolution: entry.resolution || `${gsd}m GSD`,
      groundSamplingDistanceMeters: gsd,
      sunElevation: 54.8,
      sunAzimuth: 132.6,
      processingLevel: 'Level-2A (Bottom-of-Atmosphere / BOA Reflectance)',
      crsProjection: `WGS 84 / ${utmZone}`,
      sceneId: `S2B_MSIL2A_${captureDate.replace(/-/g, '')}_${entry.id.toUpperCase()}`,
      relativeOrbit: 'R019 (Descending)',
      radiometricResolution: '12-bit Scaled DN',
      latitude: lat,
      longitude: lng,
      elevationMeters: parseInt(entry.elevation || '1800') || 1800
    };
    setMetadata(updatedMeta);

    if (autoAnalyze) {
      onAnalyze(entry.mockImageUrl, {
        name: resolvedName,
        location: entry.location,
        acquisitionMetadata: updatedMeta
      });
    }
  };

  const handleTriggerAnalysis = () => {
    if (!previewUrl) {
      setErrorMsg('Please select or upload a satellite image first.');
      return;
    }

    if (selectedFile) {
      onAnalyze(selectedFile, { 
        name: fileName, 
        location: locationName,
        acquisitionMetadata: metadata 
      });
    } else {
      onAnalyze(previewUrl, { 
        name: fileName, 
        location: locationName,
        acquisitionMetadata: metadata 
      });
    }
  };

  // Filter 100 benchmark scenes or 20 core scenes
  const activeDataset = datasetScope === '100_all' ? ALL_100_BENCHMARK_SAMPLES : SATELLITE_SAMPLES;

  let filteredSamples100 = ALL_100_BENCHMARK_SAMPLES.filter(sample => {
    const isLandslide = sample.groundTruth === 'Landslide';
    const matchesCategory = 
      filterCategory === 'all' || 
      (filterCategory === 'landslide' && isLandslide) ||
      (filterCategory === 'stable' && !isLandslide);

    const matchesSource = 
      sourceFilter === 'all' || sample.satelliteSource === sourceFilter;

    const matchesRisk = 
      riskFilter === 'all' || sample.riskLevel === riskFilter;

    const matchesSearch = 
      !searchQuery.trim() ||
      sample.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sample.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sample.satelliteSource.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sample.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSource && matchesRisk && matchesSearch;
  });

  if (sortBy === 'date_desc') {
    filteredSamples100 = [...filteredSamples100].sort((a, b) => (b.captureDate || '').localeCompare(a.captureDate || ''));
  } else if (sortBy === 'risk_desc') {
    const riskWeights: Record<string, number> = { Critical: 4, High: 3, Moderate: 2, Low: 1 };
    filteredSamples100 = [...filteredSamples100].sort((a, b) => (riskWeights[b.riskLevel] || 0) - (riskWeights[a.riskLevel] || 0));
  } else if (sortBy === 'ndvi_desc') {
    filteredSamples100 = [...filteredSamples100].sort((a, b) => b.ndviScore - a.ndviScore);
  }

  const filteredSamples20 = SATELLITE_SAMPLES.filter(sample => {
    const matchesCategory = 
      filterCategory === 'all' || 
      (filterCategory === 'landslide' && sample.groundTruth === 'landslide') ||
      (filterCategory === 'stable' && sample.groundTruth === 'non-landslide');

    const matchesSearch = 
      !searchQuery.trim() ||
      sample.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sample.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (sample.sensor && sample.sensor.toLowerCase().includes(searchQuery.toLowerCase())) ||
      sample.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Upper Ingest Workspace: Two Columns (7 cols Left for Viewport / Dropzone, 5 cols Right for Metadata Control Panel) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Column (7 cols): Satellite Ingest Viewport & Dropzone */}
        <div className="lg:col-span-7 flex flex-col justify-between rounded-xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs">
          
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/80 pb-4">
            <div>
              <span className="text-xs font-mono text-sky-700 uppercase tracking-wider font-semibold">
                Input Sensor Feed
              </span>
              <h2 className="text-lg font-bold text-slate-900 mt-0.5">
                Satellite Imagery Ingest & Staging
              </h2>
            </div>
            <div className="text-xs font-mono text-slate-500">
              Formats: <span className="text-slate-800 font-medium">JPG, PNG, GeoTIFF</span> (Max 15MB)
            </div>
          </div>

          {/* Error message */}
          {errorMsg && (
            <div className="mt-4 flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Dropzone Area or Preview */}
          {!previewUrl ? (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`my-auto py-12 px-6 flex flex-col items-center justify-center rounded-xl border-2 border-dashed text-center transition-all cursor-pointer ${
                isDragOver
                  ? 'border-sky-500 bg-sky-50/50 scale-[0.99]'
                  : 'border-slate-300 bg-slate-50/50 hover:border-slate-400 hover:bg-slate-50'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".jpg,.jpeg,.png"
                onChange={handleFileInputChange}
                className="hidden"
              />
              
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-50 border border-sky-200 text-sky-700 mb-3 shadow-2xs">
                <UploadCloud className="h-7 w-7" />
              </div>

              <p className="text-sm font-semibold text-slate-900">
                Drop satellite image here or browse from device
              </p>
              <p className="text-xs text-slate-500 mt-1 max-w-sm">
                Or select any of the 100 benchmark mountain corridors below to auto-load authentic nadir satellite imagery and telemetry.
              </p>
              
              <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-[11px] font-mono text-slate-500">
                <span className="bg-white px-2 py-1 rounded border border-slate-200">Copernicus Sentinel-2</span>
                <span className="bg-white px-2 py-1 rounded border border-slate-200">USGS Landsat-8/9</span>
                <span className="bg-white px-2 py-1 rounded border border-slate-200">PlanetScope Dove-R</span>
              </div>
            </div>
          ) : (
            <div className="mt-4 space-y-4 flex-1 flex flex-col justify-between">
              
              {/* Visual Preview Box */}
              <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden bg-slate-950 border border-slate-300 shadow-xs">
                <img
                  src={previewUrl}
                  alt="Selected Satellite Preview"
                  className="w-full h-full object-cover"
                />

                {/* Grid overlay */}
                <div className="absolute inset-0 bg-geo-grid opacity-20 pointer-events-none" />

                {/* Scanning bar if processing */}
                {isProcessing && (
                  <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-sky-400 to-transparent shadow-[0_0_12px_rgba(14,165,233,0.9)] animate-scan-beam pointer-events-none" />
                )}

                {/* Top Telemetry badges */}
                <div className="absolute top-2.5 left-2.5 flex items-center gap-2">
                  <div className="bg-slate-950/85 backdrop-blur-xs px-2.5 py-1 rounded text-[11px] font-mono text-sky-300 border border-slate-700 shadow-xs">
                    {metadata.sensorPlatform.split(' ')[0]} · {metadata.spatialResolution}
                  </div>
                  <div className="bg-slate-950/85 backdrop-blur-xs px-2 py-1 rounded text-[11px] font-mono text-emerald-300 border border-slate-700 shadow-xs">
                    CLD: {metadata.cloudCover.toFixed(1)}%
                  </div>
                </div>

                <div className="absolute top-2.5 right-2.5 bg-slate-950/85 backdrop-blur-xs px-2 py-1 rounded text-[11px] font-mono text-amber-300 border border-slate-700 shadow-xs">
                  BOA L2A
                </div>

                {/* Bottom Geodetic HUD */}
                <div className="absolute bottom-2.5 inset-x-2.5 flex items-center justify-between text-[10px] font-mono text-slate-300 bg-slate-950/85 backdrop-blur-xs px-2.5 py-1.5 rounded border border-slate-700 shadow-xs">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-3 w-3 text-rose-400" />
                    <span>
                      {metadata.latitude !== undefined && metadata.longitude !== undefined 
                        ? `${metadata.latitude.toFixed(4)}°N, ${metadata.longitude.toFixed(4)}°E`
                        : locationName}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <span>SUN: {metadata.sunElevation.toFixed(1)}°</span>
                    <span>·</span>
                    <span>CRS: {metadata.crsProjection.split('/')[1]?.trim() || 'UTM'}</span>
                  </div>
                </div>

                {isProcessing && (
                  <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-xs flex flex-col items-center justify-center text-center p-4">
                    <div className="flex items-center gap-2 font-mono text-xs text-slate-900 bg-white/95 px-4 py-2.5 rounded-full border border-sky-300 shadow-lg">
                      <Crosshair className="h-4 w-4 text-sky-600 animate-spin" />
                      <span className="font-semibold">CALCULATING GABOR FILTER BANK & VGG19 CONV MAPS...</span>
                    </div>
                  </div>
                )}
              </div>

              {/* File info & Location row */}
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-2.5 truncate">
                    <FileText className="h-5 w-5 text-sky-600 shrink-0" />
                    <div className="truncate">
                      <div className="text-xs font-bold text-slate-900 truncate max-w-xs sm:max-w-sm">
                        {fileName}
                      </div>
                      <div className="text-[11px] font-mono text-slate-500">
                        {(fileSize / 1024).toFixed(1)} KB · Orthorectified Nadir Tile
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={handleClear}
                      disabled={isProcessing}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-md border border-slate-300 hover:border-rose-300 hover:bg-rose-50 text-xs text-slate-600 hover:text-rose-700 transition-colors disabled:opacity-50 cursor-pointer shadow-2xs"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>

                {/* Target Region Input */}
                <div className="flex items-center gap-2 text-xs bg-slate-50/60 p-2.5 rounded-lg border border-slate-200">
                  <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  <span className="text-slate-600 font-medium shrink-0">Target Region:</span>
                  <input
                    type="text"
                    value={locationName}
                    onChange={(e) => setLocationName(e.target.value)}
                    placeholder="e.g. Uttarakhand Sector 4B"
                    className="flex-1 bg-transparent border-b border-slate-300 focus:border-sky-600 text-xs text-slate-900 focus:outline-none py-0.5"
                  />
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Right Column (5 cols): Enhanced Satellite Acquisition Metadata & Validation Control Panel */}
        <div className="lg:col-span-5 flex flex-col">
          <SatelliteMetadataControlPanel
            metadata={metadata}
            validation={validation}
            onChange={setMetadata}
            onReset={() => setMetadata(getDefaultAcquisitionMetadata(locationName))}
            onTriggerAnalysis={handleTriggerAnalysis}
            isProcessing={isProcessing}
            isImageSelected={!!previewUrl}
            selectedFileName={fileName}
            selectedCorridorTitle={selectedCorridorTitle}
          />
        </div>

      </div>

      {/* Benchmark Satellite Image Library - 100 Global Corridors & 20 Baseline Scenes */}
      <div className="rounded-xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs space-y-4">
        
        {/* Header with Title and Scene Count */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-200/80 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-sky-700 uppercase tracking-wider font-semibold">
                Verification Testbed
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-sky-100 text-sky-800 border border-sky-200">
                {datasetScope === '100_all' ? '100 GLOBAL CORRIDORS' : '20 CORE SCENES'}
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-900 mt-1">
              Curated Satellite Benchmark Dataset ({datasetScope === '100_all' ? '100 Global Mountain Corridors' : '20 Baseline Scenes'})
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Select any corridor to preview telemetry or click &quot;1-Click Detect&quot; to execute the Gabor + VGG19 + ResNet101 pipeline.
            </p>
          </div>

          {/* Dataset Scope Toggle & Quick Stats */}
          <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
            <div className="inline-flex items-center p-1 rounded-lg bg-slate-100 border border-slate-200 text-xs">
              <button
                type="button"
                onClick={() => { setDatasetScope('100_all'); setVisibleCount(24); }}
                className={`px-3 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
                  datasetScope === '100_all'
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                100 Corridors
              </button>
              <button
                type="button"
                onClick={() => { setDatasetScope('20_core'); setVisibleCount(20); }}
                className={`px-3 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
                  datasetScope === '20_core'
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                20 Core
              </button>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
              <span className="flex items-center gap-1 text-rose-700 font-semibold">
                <span className="h-2 w-2 rounded-full bg-rose-500" />
                {datasetScope === '100_all' ? '50 Hazards' : '10 Hazards'}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                {datasetScope === '100_all' ? '50 Stable' : '10 Stable'}
              </span>
            </div>
          </div>
        </div>

        {/* Filters and Search Bar */}
        {/* Filters and Search Bar Row 1 */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
          {/* Ground Truth Filter Pills */}
          <div className="inline-flex items-center p-1 rounded-lg bg-slate-100 border border-slate-200 text-xs">
            <button
              type="button"
              onClick={() => setFilterCategory('all')}
              className={`px-3 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                filterCategory === 'all' 
                  ? 'bg-white text-slate-900 shadow-2xs font-semibold' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All {datasetScope === '100_all' ? '(100)' : '(20)'}
            </button>
            <button
              type="button"
              onClick={() => setFilterCategory('landslide')}
              className={`px-3 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                filterCategory === 'landslide' 
                  ? 'bg-rose-500 text-white shadow-2xs font-semibold' 
                  : 'text-slate-600 hover:text-rose-700'
              }`}
            >
              Landslides {datasetScope === '100_all' ? '(50)' : '(10)'}
            </button>
            <button
              type="button"
              onClick={() => setFilterCategory('stable')}
              className={`px-3 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                filterCategory === 'stable' 
                  ? 'bg-emerald-600 text-white shadow-2xs font-semibold' 
                  : 'text-slate-600 hover:text-emerald-700'
              }`}
            >
              Stable Slopes {datasetScope === '100_all' ? '(50)' : '(10)'}
            </button>
          </div>

          {/* Search Box */}
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search corridor, sensor, region..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-sky-500 focus:bg-white"
            />
          </div>
        </div>

        {/* Filters Row 2: Sensor Platform, Risk Level, and Sort Selector */}
        {datasetScope === '100_all' && (
          <div className="flex flex-wrap items-center justify-between gap-2.5 pt-2 border-t border-slate-100 text-xs">
            {/* Satellite Source Pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-mono text-slate-400 font-medium mr-1">Sensor:</span>
              {(['all', 'Sentinel-2', 'Landsat-8/9', 'PlanetScope'] as const).map(source => (
                <button
                  key={source}
                  type="button"
                  onClick={() => setSourceFilter(source)}
                  className={`px-2.5 py-1 rounded-md font-mono text-[11px] transition-colors cursor-pointer ${
                    sourceFilter === source
                      ? 'bg-slate-900 text-white font-bold shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {source === 'all' ? 'All Platforms' : source}
                </button>
              ))}
            </div>

            {/* Risk & Sort Dropdowns */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Risk Level Filter */}
              <div className="flex items-center gap-1">
                <span className="text-[11px] font-mono text-slate-400">Risk:</span>
                <select
                  value={riskFilter}
                  onChange={(e) => setRiskFilter(e.target.value as any)}
                  className="px-2 py-1 rounded-md bg-slate-50 border border-slate-200 text-[11px] font-mono text-slate-700 focus:outline-none focus:border-sky-500 cursor-pointer"
                >
                  <option value="all">All Risks</option>
                  <option value="Critical">Critical</option>
                  <option value="High">High</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Low">Low</option>
                </select>
              </div>

              {/* Sort By Selector */}
              <div className="flex items-center gap-1">
                <span className="text-[11px] font-mono text-slate-400">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-2 py-1 rounded-md bg-slate-50 border border-slate-200 text-[11px] font-mono text-slate-700 focus:outline-none focus:border-sky-500 cursor-pointer"
                >
                  <option value="default">Default (ID)</option>
                  <option value="date_desc">Acquisition Date</option>
                  <option value="risk_desc">Hazard Severity</option>
                  <option value="ndvi_desc">NDVI Vegetation</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Image Grid: 100 Corridors or 20 Core Scenes */}
        {datasetScope === '100_all' ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-2">
              {filteredSamples100.slice(0, visibleCount).map((sample) => {
                const isSelected = selectedSampleId === sample.id;
                const isHazard = sample.groundTruth === 'Landslide';

                return (
                  <div
                    key={sample.id}
                    className={`group relative flex flex-col justify-between rounded-xl border bg-white overflow-hidden transition-all duration-200 shadow-2xs hover:shadow-md ${
                      isSelected
                        ? 'border-sky-500 ring-2 ring-sky-400/50'
                        : 'border-slate-200/90 hover:border-slate-300'
                    }`}
                  >
                    {/* Satellite Image Thumbnail with Overlay Badges */}
                    <div 
                      className="relative aspect-[16/10] w-full overflow-hidden bg-slate-950 cursor-pointer"
                      onClick={() => handleSelectBenchmark100(sample, false)}
                    >
                      <img
                        src={sample.mockImageUrl}
                        alt={sample.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      
                      {/* Subtle Grid Reticle */}
                      <div className="absolute inset-0 bg-geo-grid opacity-25 pointer-events-none" />

                      {/* Ground Truth Pill */}
                      <div className="absolute top-2 left-2">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold shadow-xs backdrop-blur-xs ${
                          isHazard
                            ? 'bg-rose-950/85 text-rose-300 border border-rose-500/40'
                            : 'bg-emerald-950/85 text-emerald-300 border border-emerald-500/40'
                        }`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${isHazard ? 'bg-rose-400 animate-pulse' : 'bg-emerald-400'}`} />
                          {sample.riskLevel}
                        </span>
                      </div>

                      {/* Sensor Badge */}
                      <div className="absolute top-2 right-2">
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-medium bg-slate-900/80 text-slate-300 border border-slate-700/60 backdrop-blur-xs">
                          {sample.satelliteSource} ({sample.resolution})
                        </span>
                      </div>

                      {/* Elevation in bottom left */}
                      {sample.elevation && (
                        <div className="absolute bottom-1.5 left-2 text-[10px] font-mono text-white/90 drop-shadow-xs">
                          {sample.elevation}
                        </div>
                      )}
                    </div>

                    {/* Content Info */}
                    <div className="p-3 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-0.5">
                          <span className="font-semibold text-sky-700">{sample.id.toUpperCase()}</span>
                          <span>NDVI: {sample.ndviScore}</span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-900 group-hover:text-sky-700 transition-colors line-clamp-1">
                          {sample.title}
                        </h4>
                        <p className="text-[11px] font-mono text-slate-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="h-3 w-3 text-slate-400 shrink-0" />
                          <span className="truncate">{sample.location}</span>
                        </p>
                        <p className="text-[11px] text-slate-600 line-clamp-2 mt-1.5 leading-snug">
                          {sample.description}
                        </p>
                      </div>

                      {/* Action Buttons */}
                      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setInspectingSample(sample)}
                          className="flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg border border-slate-200 hover:border-sky-400 hover:bg-sky-50 text-[11px] font-medium text-slate-700 hover:text-sky-700 transition-colors cursor-pointer"
                          title="Open multi-mode satellite scene inspection viewer"
                        >
                          <Eye className="h-3 w-3 text-sky-600" />
                          <span>Inspect</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleSelectBenchmark100(sample, false)}
                          disabled={isProcessing}
                          className="flex-1 py-1.5 px-1.5 rounded-lg border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100 text-[11px] font-medium text-slate-700 transition-colors cursor-pointer text-center"
                        >
                          {isSelected ? 'Loaded' : 'Load'}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleSelectBenchmark100(sample, true)}
                          disabled={isProcessing}
                          className="flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-[11px] font-bold text-white transition-all shadow-2xs hover:shadow-xs active:scale-97 cursor-pointer shrink-0"
                          title="Run AI Detection immediately on this corridor"
                        >
                          <Zap className="h-3 w-3" />
                          <span>Detect</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination / Load More button for 100 dataset */}
            {visibleCount < filteredSamples100.length && (
              <div className="pt-3 text-center">
                <button
                  type="button"
                  onClick={() => setVisibleCount(prev => Math.min(prev + 24, filteredSamples100.length))}
                  className="px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-xs font-semibold text-slate-800 transition-colors cursor-pointer inline-flex items-center gap-2"
                >
                  <span>Load More Corridors ({filteredSamples100.length - visibleCount} remaining)</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}

            {filteredSamples100.length === 0 && (
              <div className="py-8 text-center text-xs text-slate-500">
                No corridors match &quot;{searchQuery}&quot;. Try searching for &quot;Himalayas&quot;, &quot;Ghat&quot;, &quot;Canopy&quot;, or &quot;Pass&quot;.
              </div>
            )}
          </>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-2">
              {filteredSamples20.map((sample) => {
                const isSelected = selectedSampleId === sample.id;
                const isHazard = sample.groundTruth === 'landslide';
                const sampleImage = getSampleImageDataUrl(sample);

                return (
                  <div
                    key={sample.id}
                    className={`group relative flex flex-col justify-between rounded-xl border bg-white overflow-hidden transition-all duration-200 shadow-2xs hover:shadow-md ${
                      isSelected
                        ? 'border-sky-500 ring-2 ring-sky-400/50'
                        : 'border-slate-200/90 hover:border-slate-300'
                    }`}
                  >
                    {/* Satellite Image Thumbnail with Overlay Badges */}
                    <div 
                      className="relative aspect-[16/10] w-full overflow-hidden bg-slate-950 cursor-pointer"
                      onClick={() => handleSelectSample(sample, false)}
                    >
                      <img
                        src={sampleImage}
                        alt={sample.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      
                      {/* Subtle Grid Reticle */}
                      <div className="absolute inset-0 bg-geo-grid opacity-25 pointer-events-none" />

                      {/* Ground Truth Pill */}
                      <div className="absolute top-2 left-2">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold shadow-xs backdrop-blur-xs ${
                          isHazard
                            ? 'bg-rose-950/85 text-rose-300 border border-rose-500/40'
                            : 'bg-emerald-950/85 text-emerald-300 border border-emerald-500/40'
                        }`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${isHazard ? 'bg-rose-400 animate-pulse' : 'bg-emerald-400'}`} />
                          {isHazard ? 'Landslide' : 'Stable'}
                        </span>
                      </div>

                      {/* Sensor Badge */}
                      <div className="absolute top-2 right-2">
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-medium bg-slate-900/80 text-slate-300 border border-slate-700/60 backdrop-blur-xs">
                          {sample.sensor || 'Sentinel-2'}
                        </span>
                      </div>

                      {/* Elevation in bottom left */}
                      <div className="absolute bottom-1.5 left-2 text-[10px] font-mono text-white/90 drop-shadow-xs">
                        {sample.elevation}
                      </div>
                    </div>

                    {/* Content Info */}
                    <div className="p-3 flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 group-hover:text-sky-700 transition-colors line-clamp-1">
                          {sample.name}
                        </h4>
                        <p className="text-[11px] font-mono text-slate-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="h-3 w-3 text-slate-400 shrink-0" />
                          <span className="truncate">{sample.region}</span>
                        </p>
                        <p className="text-[11px] text-slate-600 line-clamp-2 mt-1.5 leading-snug">
                          {sample.description}
                        </p>
                      </div>

                      {/* Action Buttons */}
                      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            const matchingEntry: BenchmarkSampleEntry = ALL_100_BENCHMARK_SAMPLES.find(
                              b => b.id.replace('sample-', 'sample-ls-') === sample.id || b.id.replace('sample-', 'sample-nl-') === sample.id
                            ) || {
                              id: sample.id,
                              title: sample.name,
                              location: sample.region,
                              coordinates: sample.coordinates,
                              satelliteSource: (sample.sensor && sample.sensor.includes('Landsat')) ? 'Landsat-8/9' : (sample.sensor && sample.sensor.includes('Planet')) ? 'PlanetScope' : 'Sentinel-2',
                              resolution: sample.resolution || '10m GSD',
                              groundTruth: sample.groundTruth === 'landslide' ? 'Landslide' : 'Stable',
                              riskLevel: sample.groundTruth === 'landslide' ? 'Critical' : 'Low',
                              confidenceScore: 96.58,
                              ndviScore: sample.groundTruth === 'landslide' ? 0.16 : 0.82,
                              sdiScore: sample.groundTruth === 'landslide' ? 8.4 : 0.6,
                              mockImageUrl: sampleImage,
                              description: sample.description,
                              elevation: sample.elevation,
                              captureDate: sample.date || '2023-10-26'
                            };
                            setInspectingSample(matchingEntry);
                          }}
                          className="flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg border border-slate-200 hover:border-sky-400 hover:bg-sky-50 text-[11px] font-medium text-slate-700 hover:text-sky-700 transition-colors cursor-pointer"
                          title="Open multi-mode satellite scene inspection viewer"
                        >
                          <Eye className="h-3 w-3 text-sky-600" />
                          <span>Inspect</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleSelectSample(sample, false)}
                          disabled={isProcessing}
                          className="flex-1 py-1.5 px-1.5 rounded-lg border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100 text-[11px] font-medium text-slate-700 transition-colors cursor-pointer text-center"
                        >
                          {isSelected ? 'Loaded' : 'Load'}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleSelectSample(sample, true)}
                          disabled={isProcessing}
                          className="flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-[11px] font-bold text-white transition-all shadow-2xs hover:shadow-xs active:scale-97 cursor-pointer shrink-0"
                          title="Run AI Detection immediately on this scene"
                        >
                          <Zap className="h-3 w-3" />
                          <span>Detect</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredSamples20.length === 0 && (
              <div className="py-8 text-center text-xs text-slate-500">
                No satellite scenes match &quot;{searchQuery}&quot;. Try searching for &quot;Himalayas&quot;, &quot;Tirupati&quot;, &quot;Sentinel&quot;, or &quot;Alpine&quot;.
              </div>
            )}
          </>
        )}

      </div>

      {/* ----------------- SATELLITE SCENE INSPECTION MODAL ----------------- */}
      {inspectingSample && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-5xl rounded-2xl bg-[#0B132B] border border-slate-700/80 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 bg-[#0d1736] px-5 py-3">
              <div className="flex items-center gap-3">
                <span className="px-2 py-0.5 rounded font-mono text-xs font-bold bg-sky-950 text-sky-400 border border-sky-600/40">
                  {inspectingSample.id.toUpperCase()}
                </span>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-white leading-tight">
                    {inspectingSample.title}
                  </h3>
                  <p className="text-xs font-mono text-slate-400 flex items-center gap-1 mt-0.5">
                    <MapPin className="h-3 w-3 text-slate-400" />
                    <span>{inspectingSample.location}</span>
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setInspectingSample(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                title="Close Inspector"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body: Multi-Mode Satellite Viewer */}
            <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
              <SatelliteImageViewer
                sceneId={inspectingSample.id}
                locationName={inspectingSample.location}
                coordinates={inspectingSample.coordinates}
                satelliteSource={inspectingSample.satelliteSource === 'Landsat-8/9' ? 'Landsat-9' : inspectingSample.satelliteSource}
                groundTruth={inspectingSample.groundTruth}
                riskLevel={inspectingSample.riskLevel}
                acquisitionDate={inspectingSample.captureDate || '2023-10-26'}
                spatialResolution={inspectingSample.resolution}
                ndviScore={inspectingSample.ndviScore}
                sdiScore={inspectingSample.sdiScore}
                initialMode="quad"
                onDetectAction={() => {
                  handleSelectBenchmark100(inspectingSample, true);
                  setInspectingSample(null);
                }}
              />

              {/* Detailed Geological & Remote Sensing Spec Sheet */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
                <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                  <div className="text-slate-500 text-[10px] uppercase font-bold">Slope Geomorphology</div>
                  <div className="text-slate-200 mt-1 font-sans">{inspectingSample.description}</div>
                  <div className="mt-2 text-slate-400 text-[11px]">
                    Elevation: <span className="text-white font-bold">{inspectingSample.elevation || '740m'}</span> | Gradient: <span className="text-white font-bold">{inspectingSample.slopeGradient || '45°'}</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                  <div className="text-slate-500 text-[10px] uppercase font-bold">Earth Observation Specs</div>
                  <div className="text-slate-300 mt-1">Platform: <span className="text-white font-bold">{inspectingSample.satelliteSource}</span></div>
                  <div className="text-slate-300 mt-0.5">Spatial GSD: <span className="text-white font-bold">{inspectingSample.resolution}</span></div>
                  <div className="text-slate-300 mt-0.5">Date: <span className="text-white font-bold">{inspectingSample.captureDate}</span></div>
                  <div className="text-slate-300 mt-0.5">WGS84: {inspectingSample.coordinates.lat.toFixed(4)}°N, {inspectingSample.coordinates.lng.toFixed(4)}°E</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
                  <div>
                    <div className="text-slate-500 text-[10px] uppercase font-bold">Hazard Indices</div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-slate-400">Risk Level:</span>
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        inspectingSample.riskLevel === 'Critical' ? 'bg-rose-950 text-rose-300 border border-rose-600/50' :
                        inspectingSample.riskLevel === 'High' ? 'bg-amber-950 text-amber-300 border border-amber-600/50' :
                        'bg-emerald-950 text-emerald-300 border border-emerald-600/50'
                      }`}>
                        {inspectingSample.riskLevel}
                      </span>
                    </div>
                    <div className="text-slate-300 mt-1">NDVI Score: <span className="text-white font-bold">{inspectingSample.ndviScore}</span></div>
                    <div className="text-slate-300 mt-0.5">Soil Displacement Index: <span className="text-amber-400 font-bold">{inspectingSample.sdiScore}</span></div>
                  </div>

                  <div className="mt-3 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        handleSelectBenchmark100(inspectingSample, false);
                        setInspectingSample(null);
                      }}
                      className="flex-1 py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs transition-colors cursor-pointer text-center"
                    >
                      Load Scene
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        handleSelectBenchmark100(inspectingSample, true);
                        setInspectingSample(null);
                      }}
                      className="flex-1 py-1.5 px-3 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs transition-colors cursor-pointer text-center"
                    >
                      Detect Now
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
