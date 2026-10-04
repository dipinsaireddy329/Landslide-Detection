import React, { useState, useRef } from 'react';
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
  Globe
} from 'lucide-react';
import { SatelliteSample } from '../types';
import { SATELLITE_SAMPLES, getSampleImageDataUrl } from '../services/sampleData';

interface UploadDropzoneProps {
  onAnalyze: (fileOrUrl: File | string, metadata: { name: string; location: string }) => void;
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

  // Gallery filter & search state for the 20 benchmark scenes
  const [filterCategory, setFilterCategory] = useState<'all' | 'landslide' | 'stable'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

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
    setErrorMsg(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSelectSample = (sample: SatelliteSample, autoAnalyze: boolean = false) => {
    setErrorMsg(null);
    setSelectedSampleId(sample.id);
    setSelectedFile(null);
    const dataUrl = getSampleImageDataUrl(sample);
    const resolvedName = `${sample.name.replace(/\s+/g, '_')}_${(sample.sensor || 'Sentinel2').replace(/[^a-zA-Z0-9]/g, '')}.png`;
    setFileName(resolvedName);
    setFileSize(2450000);
    setLocationName(sample.region);
    setPreviewUrl(dataUrl);

    if (autoAnalyze) {
      onAnalyze(dataUrl, {
        name: resolvedName,
        location: sample.region
      });
    }
  };

  const handleTriggerAnalysis = () => {
    if (!previewUrl) {
      setErrorMsg('Please select or upload a satellite image first.');
      return;
    }

    if (selectedFile) {
      onAnalyze(selectedFile, { name: fileName, location: locationName });
    } else {
      onAnalyze(previewUrl, { name: fileName, location: locationName });
    }
  };

  // Filter 20 benchmark scenes
  const filteredSamples = SATELLITE_SAMPLES.filter(sample => {
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
      
      {/* Upload Container */}
      <div className="rounded-xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs">
        
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/80 pb-4">
          <div>
            <span className="text-xs font-mono text-sky-700 uppercase tracking-wider font-semibold">
              Input Sensor Feed
            </span>
            <h2 className="text-lg font-bold text-slate-900 mt-0.5">
              Upload Satellite Imagery
            </h2>
          </div>
          <div className="text-xs font-mono text-slate-500">
            Formats: <span className="text-slate-800 font-medium">JPG, JPEG, PNG</span> (Max 15MB)
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
            className={`mt-5 flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 text-center transition-all cursor-pointer ${
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
              Drop satellite image here
            </p>
            <p className="text-xs text-slate-500 mt-1">
              or <span className="text-sky-700 font-semibold hover:underline">browse from device</span>
            </p>
            <div className="mt-4 flex items-center gap-2 text-[11px] font-mono text-slate-400">
              <span>RGB Multispectral Bands</span>
              <span>·</span>
              <span>Orthorectified Tiles</span>
            </div>
          </div>
        ) : (
          <div className="mt-5 space-y-4">
            
            {/* Visual Preview Box */}
            <div className="relative aspect-[16/9] w-full max-w-2xl mx-auto rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shadow-xs">
              <img
                src={previewUrl}
                alt="Selected Satellite Preview"
                className="w-full h-full object-cover"
              />

              {/* Grid overlay */}
              <div className="absolute inset-0 bg-geo-grid opacity-20 pointer-events-none" />

              {/* Scanning bar if processing */}
              {isProcessing && (
                <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-sky-500 to-transparent shadow-[0_0_12px_rgba(14,165,233,0.8)] animate-scan-beam pointer-events-none" />
              )}

              {/* Telemetry markers */}
              <div className="absolute top-2 left-2 bg-white/90 px-2 py-1 rounded text-[11px] font-mono text-slate-800 border border-slate-200 shadow-xs">
                RAD: [0, 1] NORMALIZED
              </div>

              {isProcessing && (
                <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-xs flex flex-col items-center justify-center text-center p-4">
                  <div className="flex items-center gap-2 font-mono text-xs text-slate-900 bg-white/95 px-3.5 py-2 rounded-full border border-sky-300 shadow-md">
                    <Crosshair className="h-3.5 w-3.5 text-sky-600 animate-spin" />
                    <span className="font-semibold">EXTRACTING VGG19 FEATURES & GABOR EDGES...</span>
                  </div>
                </div>
              )}
            </div>

            {/* File info & Location row */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-3 rounded-lg bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-3 truncate">
                <FileText className="h-5 w-5 text-sky-600 shrink-0" />
                <div className="truncate">
                  <div className="text-xs font-bold text-slate-900 truncate max-w-xs sm:max-w-md">
                    {fileName}
                  </div>
                  <div className="text-[11px] font-mono text-slate-500">
                    {(fileSize / 1024).toFixed(1)} KB · Ready for Gabor & ResNet inference
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleClear}
                  disabled={isProcessing}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 hover:border-rose-300 hover:bg-rose-50 text-xs text-slate-600 hover:text-rose-700 transition-colors disabled:opacity-50 cursor-pointer shadow-xs"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Remove</span>
                </button>
              </div>
            </div>

            {/* Location Meta Input */}
            <div className="flex items-center gap-2 text-xs">
              <MapPin className="h-3.5 w-3.5 text-slate-400" />
              <span className="text-slate-600 font-medium">Target Region:</span>
              <input
                type="text"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                placeholder="e.g. Uttarakhand Sector 4B"
                className="flex-1 bg-transparent border-b border-slate-300 focus:border-sky-600 text-xs text-slate-900 focus:outline-none py-0.5"
              />
            </div>

            {/* Main Action Button */}
            <button
              onClick={handleTriggerAnalysis}
              disabled={isProcessing}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-sky-600 hover:bg-sky-500 py-3.5 text-sm font-semibold text-white transition-all shadow-sm disabled:opacity-50 cursor-pointer active:scale-99"
            >
              <Sparkles className="h-4 w-4" />
              <span>{isProcessing ? 'Processing AI Pipeline...' : 'Analyze Image with Deep Learning'}</span>
            </button>

          </div>
        )}

      </div>

      {/* Benchmark Satellite Image Library - 20 Curated Scenes */}
      <div className="rounded-xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs space-y-4">
        
        {/* Header with Title and Scene Count */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-200/80 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-sky-700 uppercase tracking-wider font-semibold">
                Verification Testbed
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-sky-100 text-sky-800 border border-sky-200">
                20 SCENES LOADED
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-900 mt-1">
              Curated Satellite Benchmark Dataset (20 Global Scenes)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Select any scene to preview telemetry or click "1-Click Detect" to immediately run the Gabor + VGG19 + ResNet101 pipeline.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="flex items-center gap-2 text-xs font-mono text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 self-start md:self-auto">
            <span className="flex items-center gap-1 text-rose-700 font-semibold">
              <span className="h-2 w-2 rounded-full bg-rose-500" />
              10 Hazards
            </span>
            <span>·</span>
            <span className="flex items-center gap-1 text-emerald-700 font-semibold">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              10 Stable
            </span>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
          {/* Filter Pills */}
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
              All Scenes (20)
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
              Landslides (10)
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
              Stable Slopes (10)
            </button>
          </div>

          {/* Search Box */}
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search region, sensor, hazard..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-sky-500 focus:bg-white"
            />
          </div>
        </div>

        {/* 20 Image Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-2">
          {filteredSamples.map((sample) => {
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
                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleSelectSample(sample, false)}
                      disabled={isProcessing}
                      className="flex-1 py-1.5 px-2 rounded-lg border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100 text-[11px] font-medium text-slate-700 transition-colors cursor-pointer text-center"
                    >
                      {isSelected ? 'Loaded' : 'Load Scene'}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSelectSample(sample, true)}
                      disabled={isProcessing}
                      className="flex items-center justify-center gap-1 py-1.5 px-2.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-[11px] font-bold text-white transition-all shadow-2xs hover:shadow-xs active:scale-97 cursor-pointer shrink-0"
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

        {/* Empty Search State */}
        {filteredSamples.length === 0 && (
          <div className="py-8 text-center text-xs text-slate-500">
            No satellite scenes match "{searchQuery}". Try searching for "Himalayas", "Tirupati", "Sentinel", or "Alpine".
          </div>
        )}

      </div>

    </div>
  );
};
