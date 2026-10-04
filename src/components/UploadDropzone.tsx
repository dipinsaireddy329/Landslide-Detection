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
  ChevronRight
} from 'lucide-react';
import { SatelliteSample } from '../types';
import { SATELLITE_SAMPLES } from '../services/sampleData';

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

  const handleSelectSample = (sample: SatelliteSample) => {
    setErrorMsg(null);
    setSelectedSampleId(sample.id);
    setSelectedFile(null);
    setFileName(`${sample.name.replace(/\s+/g, '_')}_Sentinel2.png`);
    setFileSize(2340000);
    setLocationName(sample.region);
    setPreviewUrl(sample.imageDataUrl);
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

      {/* Quick Benchmark Satellite Library */}
      <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
          <div>
            <span className="text-xs font-mono text-sky-700 uppercase tracking-wider font-semibold">
              Verification Testbed
            </span>
            <h3 className="text-sm font-bold text-slate-900 mt-0.5">
              Curated Satellite Test Samples
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            Click to load & analyze
          </span>
        </div>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {SATELLITE_SAMPLES.map((sample) => {
            const isSelected = selectedSampleId === sample.id;
            const isHazard = sample.groundTruth === 'landslide';

            return (
              <button
                key={sample.id}
                type="button"
                onClick={() => handleSelectSample(sample)}
                className={`text-left rounded-lg p-3 border transition-all cursor-pointer ${
                  isSelected
                    ? 'border-sky-500 bg-sky-50/70 ring-1 ring-sky-500 shadow-xs'
                    : 'border-slate-200 bg-slate-50/50 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] font-mono mb-1.5">
                  <span className={`font-semibold ${isHazard ? 'text-rose-700' : 'text-emerald-700'}`}>
                    {isHazard ? 'Ground Truth: Landslide' : 'Ground Truth: Stable'}
                  </span>
                  <span className="text-slate-500">{sample.elevation}</span>
                </div>

                <div className="text-xs font-bold text-slate-900 truncate">
                  {sample.name}
                </div>

                <div className="text-[11px] text-slate-600 line-clamp-2 mt-1">
                  {sample.description}
                </div>

                <div className="mt-2.5 flex items-center justify-between text-[10px] font-mono text-slate-500 pt-2 border-t border-slate-200/70">
                  <span>{sample.region.split(',')[0]}</span>
                  <span className="text-sky-700 font-semibold flex items-center">
                    Select <ChevronRight className="h-3 w-3 inline" />
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
};
