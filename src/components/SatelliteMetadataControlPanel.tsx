import React, { useState } from 'react';
import { 
  Calendar, 
  Satellite, 
  Cloud, 
  Maximize2, 
  Sun, 
  Layers, 
  Compass, 
  ShieldCheck, 
  AlertTriangle, 
  XCircle, 
  Sparkles, 
  RotateCcw,
  Info,
  CheckCircle2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { 
  SatelliteAcquisitionMetadata, 
  SatelliteValidationResult 
} from '../services/satelliteValidation';

interface SatelliteMetadataControlPanelProps {
  metadata: SatelliteAcquisitionMetadata;
  validation: SatelliteValidationResult;
  onChange: (updated: SatelliteAcquisitionMetadata) => void;
  onReset: () => void;
  onTriggerAnalysis: () => void;
  isProcessing: boolean;
  isImageSelected: boolean;
  selectedFileName?: string;
  selectedCorridorTitle?: string;
}

export const SatelliteMetadataControlPanel: React.FC<SatelliteMetadataControlPanelProps> = ({
  metadata,
  validation,
  onChange,
  onReset,
  onTriggerAnalysis,
  isProcessing,
  isImageSelected,
  selectedFileName,
  selectedCorridorTitle
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleFieldChange = (field: keyof SatelliteAcquisitionMetadata, value: any) => {
    onChange({
      ...metadata,
      [field]: value
    });
  };

  const getStatusColor = (status: 'passed' | 'warning' | 'error') => {
    switch (status) {
      case 'passed':
        return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'warning':
        return 'text-amber-800 bg-amber-50 border-amber-200';
      case 'error':
        return 'text-rose-700 bg-rose-50 border-rose-200';
    }
  };

  const getItemByKey = (key: string) => {
    return validation.items.find(i => i.key === key);
  };

  const dateValidation = getItemByKey('date');
  const cloudValidation = getItemByKey('cloud');
  const resValidation = getItemByKey('resolution');
  const sunValidation = getItemByKey('sun_elevation');
  const sensorValidation = getItemByKey('sensor');

  return (
    <div className="rounded-xl border border-slate-200/90 bg-white shadow-xs flex flex-col h-full overflow-hidden">
      
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-slate-200/80 bg-slate-50/70">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-mono font-semibold text-sky-700 uppercase tracking-wider">
              <Satellite className="h-3.5 w-3.5 text-sky-600" />
              <span>Acquisition Telemetry</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 mt-0.5">
              Remote Sensing Ingest Panel
            </h3>
          </div>

          {/* Quality Score Indicator */}
          <div className="flex items-center gap-2">
            <div className="text-right">
              <div className="text-[10px] font-mono text-slate-500 uppercase">Data Quality</div>
              <div className={`text-sm font-mono font-bold ${
                validation.qualityScore >= 85 ? 'text-emerald-600' :
                validation.qualityScore >= 65 ? 'text-amber-600' : 'text-rose-600'
              }`}>
                {validation.qualityScore}/100
              </div>
            </div>

            <div className={`h-8 w-8 rounded-lg flex items-center justify-center border font-mono font-bold text-xs ${
              validation.overallStatus === 'passed' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' :
              validation.overallStatus === 'warning' ? 'bg-amber-100 text-amber-800 border-amber-300' :
              'bg-rose-100 text-rose-800 border-rose-300'
            }`}>
              {validation.overallStatus === 'passed' ? '✓' : validation.overallStatus === 'warning' ? '!' : '✗'}
            </div>
          </div>
        </div>

        {/* Selected target corridor info */}
        {selectedCorridorTitle && (
          <div className="mt-3 flex items-center gap-2 text-xs text-slate-600 bg-white/90 px-3 py-1.5 rounded-lg border border-slate-200">
            <span className="font-semibold text-slate-800 truncate">Corridor:</span>
            <span className="truncate text-slate-600">{selectedCorridorTitle}</span>
          </div>
        )}
      </div>

      {/* Scrollable Telemetry Form */}
      <div className="p-4 sm:p-5 space-y-4.5 flex-1 overflow-y-auto max-h-[580px]">
        
        {/* 1. Acquisition Date */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-1.5 font-medium text-slate-700">
              <Calendar className="h-3.5 w-3.5 text-slate-400" />
              <span>Acquisition Date (UTC)</span>
            </label>
            <span className="text-[10px] font-mono text-slate-400">YYYY-MM-DD</span>
          </div>

          <div className="relative">
            <input
              type="date"
              value={metadata.acquisitionDate}
              onChange={(e) => handleFieldChange('acquisitionDate', e.target.value)}
              className="w-full text-xs font-mono font-medium text-slate-900 bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:border-sky-500 focus:bg-white transition-colors"
            />
          </div>

          {/* Validation Feedback */}
          {dateValidation && (
            <div className={`flex items-start gap-1.5 text-[11px] p-2 rounded-md border ${getStatusColor(dateValidation.status)}`}>
              {dateValidation.status === 'passed' ? <CheckCircle2 className="h-3.5 w-3.5 shrink-0 mt-0.5 text-emerald-600" /> :
               dateValidation.status === 'warning' ? <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5 text-amber-600" /> :
               <XCircle className="h-3.5 w-3.5 shrink-0 mt-0.5 text-rose-600" />}
              <span className="leading-snug">{dateValidation.message}</span>
            </div>
          )}
        </div>

        {/* 2. Sensor Platform */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-1.5 font-medium text-slate-700">
              <Satellite className="h-3.5 w-3.5 text-slate-400" />
              <span>Sensor Platform / Instrument</span>
            </label>
            <span className="text-[10px] font-mono text-slate-400">Payload</span>
          </div>

          <select
            value={metadata.sensorPlatform}
            onChange={(e) => {
              const val = e.target.value;
              let gsd = 10;
              let res = '10m GSD (B2, B3, B4, B8)';
              if (val.includes('Landsat')) {
                gsd = 30;
                res = '30m GSD (VNIR/SWIR)';
              } else if (val.includes('PlanetScope')) {
                gsd = 3;
                res = '3m GSD (Dove-R RGB+NIR)';
              } else if (val.includes('SPOT')) {
                gsd = 6;
                res = '6m GSD Multispectral';
              }
              onChange({
                ...metadata,
                sensorPlatform: val,
                spatialResolution: res,
                groundSamplingDistanceMeters: gsd
              });
            }}
            className="w-full text-xs font-mono font-medium text-slate-900 bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:border-sky-500 focus:bg-white transition-colors cursor-pointer"
          >
            <option value="Sentinel-2B MSI (Copernicus ESA)">Sentinel-2B MSI (Copernicus ESA - 10m VNIR)</option>
            <option value="Sentinel-2A MSI (Copernicus ESA)">Sentinel-2A MSI (Copernicus ESA - 10m VNIR)</option>
            <option value="Landsat 9 OLI-2 (USGS / NASA)">Landsat 9 OLI-2 (USGS / NASA - 30m Multispectral)</option>
            <option value="Landsat 8 OLI/TIRS (USGS / NASA)">Landsat 8 OLI/TIRS (USGS / NASA - 30m Multispectral)</option>
            <option value="PlanetScope Dove-R (Constellation)">PlanetScope Dove-R (Planet Labs - 3m Ortho)</option>
            <option value="SPOT-7 Multispectral (Airbus)">SPOT-7 Multispectral (Airbus - 6m Resolution)</option>
          </select>

          {sensorValidation && (
            <div className={`flex items-start gap-1.5 text-[11px] p-2 rounded-md border ${getStatusColor(sensorValidation.status)}`}>
              {sensorValidation.status === 'passed' ? <CheckCircle2 className="h-3.5 w-3.5 shrink-0 mt-0.5 text-emerald-600" /> :
               sensorValidation.status === 'warning' ? <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5 text-amber-600" /> :
               <XCircle className="h-3.5 w-3.5 shrink-0 mt-0.5 text-rose-600" />}
              <span className="leading-snug">{sensorValidation.message}</span>
            </div>
          )}
        </div>

        {/* 3. Cloud Cover Percentage */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-1.5 font-medium text-slate-700">
              <Cloud className="h-3.5 w-3.5 text-slate-400" />
              <span>Scene Cloud Cover</span>
            </label>
            <span className={`font-mono font-bold text-xs ${
              metadata.cloudCover <= 10 ? 'text-emerald-600' :
              metadata.cloudCover <= 25 ? 'text-amber-600' : 'text-rose-600'
            }`}>
              {metadata.cloudCover.toFixed(1)}%
            </span>
          </div>

          {/* Slider & Quick Steps */}
          <div className="space-y-1">
            <input
              type="range"
              min="0"
              max="50"
              step="0.1"
              value={metadata.cloudCover}
              onChange={(e) => handleFieldChange('cloudCover', parseFloat(e.target.value))}
              className="w-full accent-sky-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg appearance-none"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-400">
              <span>0% (Pristine)</span>
              <span>15% (Threshold)</span>
              <span>50% (Max)</span>
            </div>
          </div>

          {cloudValidation && (
            <div className={`flex items-start gap-1.5 text-[11px] p-2 rounded-md border ${getStatusColor(cloudValidation.status)}`}>
              {cloudValidation.status === 'passed' ? <CheckCircle2 className="h-3.5 w-3.5 shrink-0 mt-0.5 text-emerald-600" /> :
               cloudValidation.status === 'warning' ? <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5 text-amber-600" /> :
               <XCircle className="h-3.5 w-3.5 shrink-0 mt-0.5 text-rose-600" />}
              <span className="leading-snug">{cloudValidation.message}</span>
            </div>
          )}
        </div>

        {/* 4. Spatial Ground Resolution (GSD) */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-1.5 font-medium text-slate-700">
              <Maximize2 className="h-3.5 w-3.5 text-slate-400" />
              <span>Spatial Ground Resolution (GSD)</span>
            </label>
            <span className="text-[10px] font-mono font-bold text-sky-700">
              {metadata.groundSamplingDistanceMeters}m / pixel
            </span>
          </div>

          {/* Quick preset selector buttons */}
          <div className="grid grid-cols-4 gap-1.5">
            {[
              { gsd: 3, label: '3m (High-Res)', desc: 'Planet' },
              { gsd: 10, label: '10m (Optimal)', desc: 'S2 VNIR' },
              { gsd: 20, label: '20m (RedEdge)', desc: 'S2 SWIR' },
              { gsd: 30, label: '30m (Macro)', desc: 'Landsat' }
            ].map(item => (
              <button
                key={item.gsd}
                type="button"
                onClick={() => {
                  onChange({
                    ...metadata,
                    groundSamplingDistanceMeters: item.gsd,
                    spatialResolution: `${item.gsd}m GSD`
                  });
                }}
                className={`py-1.5 px-1 rounded-md text-[11px] font-mono text-center border transition-all cursor-pointer ${
                  metadata.groundSamplingDistanceMeters === item.gsd
                    ? 'bg-sky-50 border-sky-400 text-sky-800 font-bold shadow-2xs'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <div className="font-bold">{item.gsd}m</div>
                <div className="text-[9px] text-slate-400 truncate">{item.desc}</div>
              </button>
            ))}
          </div>

          {resValidation && (
            <div className={`flex items-start gap-1.5 text-[11px] p-2 rounded-md border ${getStatusColor(resValidation.status)}`}>
              {resValidation.status === 'passed' ? <CheckCircle2 className="h-3.5 w-3.5 shrink-0 mt-0.5 text-emerald-600" /> :
               resValidation.status === 'warning' ? <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5 text-amber-600" /> :
               <XCircle className="h-3.5 w-3.5 shrink-0 mt-0.5 text-rose-600" />}
              <span className="leading-snug">{resValidation.message}</span>
            </div>
          )}
        </div>

        {/* 5. Sun Elevation & Valley Illumination */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-1.5 font-medium text-slate-700">
              <Sun className="h-3.5 w-3.5 text-slate-400" />
              <span>Solar Elevation Angle</span>
            </label>
            <span className="font-mono font-bold text-xs text-slate-800">
              {metadata.sunElevation.toFixed(1)}°
            </span>
          </div>

          <input
            type="range"
            min="10"
            max="85"
            step="0.5"
            value={metadata.sunElevation}
            onChange={(e) => handleFieldChange('sunElevation', parseFloat(e.target.value))}
            className="w-full accent-amber-500 cursor-pointer h-1.5 bg-slate-200 rounded-lg appearance-none"
          />

          {sunValidation && (
            <div className={`flex items-start gap-1.5 text-[11px] p-2 rounded-md border ${getStatusColor(sunValidation.status)}`}>
              {sunValidation.status === 'passed' ? <CheckCircle2 className="h-3.5 w-3.5 shrink-0 mt-0.5 text-emerald-600" /> :
               sunValidation.status === 'warning' ? <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5 text-amber-600" /> :
               <XCircle className="h-3.5 w-3.5 shrink-0 mt-0.5 text-rose-600" />}
              <span className="leading-snug">{sunValidation.message}</span>
            </div>
          )}
        </div>

        {/* Advanced Geodetic & Radiometric Drawer Toggle */}
        <div className="pt-1">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="w-full flex items-center justify-between py-2 text-xs font-mono text-slate-600 hover:text-slate-900 border-t border-slate-200 cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              <Layers className="h-3.5 w-3.5 text-slate-500" />
              <span>Advanced Geodetic & Radiometric Specs</span>
            </span>
            {showAdvanced ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>

          {showAdvanced && (
            <div className="mt-2 space-y-3 p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs">
              
              {/* Processing Level */}
              <div>
                <label className="text-[11px] font-mono text-slate-500 block mb-1">
                  Atmospheric Processing Level:
                </label>
                <select
                  value={metadata.processingLevel}
                  onChange={(e) => handleFieldChange('processingLevel', e.target.value)}
                  className="w-full text-xs font-mono bg-white border border-slate-300 rounded p-1.5 focus:outline-none"
                >
                  <option value="Level-2A (Bottom-of-Atmosphere / BOA Reflectance)">Level-2A BOA (Sen2Cor Surface Reflectance)</option>
                  <option value="Level-1C (Top-of-Atmosphere / TOA Reflectance)">Level-1C TOA (Top-of-Atmosphere)</option>
                  <option value="USGS Surface Reflectance Collection 2 Level-2">USGS Surface Reflectance Collection 2 Level-2</option>
                </select>
              </div>

              {/* CRS & Datum */}
              <div>
                <label className="text-[11px] font-mono text-slate-500 block mb-1">
                  Coordinate Reference System (CRS):
                </label>
                <input
                  type="text"
                  value={metadata.crsProjection}
                  onChange={(e) => handleFieldChange('crsProjection', e.target.value)}
                  className="w-full text-xs font-mono bg-white border border-slate-300 rounded p-1.5 focus:outline-none"
                />
              </div>

              {/* Scene ID */}
              {metadata.sceneId && (
                <div>
                  <label className="text-[11px] font-mono text-slate-500 block mb-0.5">
                    Copernicus / USGS Scene Identifier:
                  </label>
                  <div className="text-[10px] font-mono text-slate-700 bg-white p-1.5 rounded border border-slate-200 break-all select-all">
                    {metadata.sceneId}
                  </div>
                </div>
              )}

              {/* Sun Azimuth */}
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-600">
                <span>Sun Azimuth Angle:</span>
                <span className="font-bold text-slate-800">{metadata.sunAzimuth ?? 134.2}°</span>
              </div>
            </div>
          )}
        </div>

        {/* Validation Summary Box */}
        <div className={`p-3 rounded-lg border text-xs ${
          validation.overallStatus === 'passed' ? 'bg-emerald-50/70 border-emerald-200 text-emerald-800' :
          validation.overallStatus === 'warning' ? 'bg-amber-50/70 border-amber-200 text-amber-800' :
          'bg-rose-50/70 border-rose-200 text-rose-800'
        }`}>
          <div className="flex items-center gap-2 font-bold mb-1">
            {validation.overallStatus === 'passed' ? <ShieldCheck className="h-4 w-4 text-emerald-600" /> :
             validation.overallStatus === 'warning' ? <AlertTriangle className="h-4 w-4 text-amber-600" /> :
             <XCircle className="h-4 w-4 text-rose-600" />}
            <span className="uppercase tracking-wide font-mono text-[11px]">
              {validation.overallStatus === 'passed' ? 'Data Quality: Copernicus Validated' :
               validation.overallStatus === 'warning' ? 'Data Quality: Warning Issued' :
               'Data Quality: Rejected'}
            </span>
          </div>
          <p className="text-[11px] leading-relaxed">
            {validation.summaryMessage}
          </p>
        </div>

      </div>

      {/* Footer Controls & Inference Trigger */}
      <div className="p-4 sm:p-5 border-t border-slate-200/80 bg-slate-50/90 space-y-3">
        
        {/* Reset / Calibrate buttons */}
        <div className="flex items-center justify-between text-xs">
          <button
            type="button"
            onClick={onReset}
            className="flex items-center gap-1 text-[11px] font-mono text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Reset Telemetry Defaults</span>
          </button>

          <span className="text-[11px] font-mono text-slate-400">
            {isImageSelected ? 'Scene Staged' : 'Awaiting Scene Selection'}
          </span>
        </div>

        {/* Primary Inference Execution Button */}
        <button
          onClick={onTriggerAnalysis}
          disabled={isProcessing || !validation.isValid || !isImageSelected}
          className={`w-full flex items-center justify-center gap-2 rounded-xl py-3 px-4 text-sm font-semibold text-white transition-all shadow-sm cursor-pointer ${
            isProcessing
              ? 'bg-sky-400 cursor-not-allowed'
              : !isImageSelected
              ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
              : !validation.isValid
              ? 'bg-rose-600 hover:bg-rose-700'
              : 'bg-sky-600 hover:bg-sky-500 active:scale-99'
          }`}
        >
          <Sparkles className="h-4 w-4 shrink-0" />
          <span>
            {isProcessing ? 'Executing AI Vision Pipeline...' : 
             !isImageSelected ? 'Select Satellite Image to Detect' :
             !validation.isValid ? 'Telemetry Error - Review Above' :
             'Run Landslide Detection (Gabor+ResNet)'}
          </span>
        </button>

      </div>

    </div>
  );
};
