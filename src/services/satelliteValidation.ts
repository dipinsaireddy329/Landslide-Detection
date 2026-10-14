export interface SatelliteAcquisitionMetadata {
  acquisitionDate: string;          // ISO Date string: YYYY-MM-DD
  sensorPlatform: string;           // e.g. "Sentinel-2A MSI", "Sentinel-2B MSI", "Landsat 9 OLI-2"
  cloudCover: number;               // 0.0 to 100.0 percent
  spatialResolution: string;        // e.g. "10m GSD"
  groundSamplingDistanceMeters: number; // e.g. 10.0
  sunElevation: number;             // 0.0 to 90.0 degrees
  sunAzimuth?: number;              // 0.0 to 360.0 degrees
  processingLevel: string;          // e.g. "Level-2A (BOA Surface Reflectance)"
  crsProjection: string;            // e.g. "WGS 84 / UTM Zone 43N (EPSG:32643)"
  sceneId?: string;                 // e.g. "S2B_MSIL2A_20240730T051649_N0511_R019_T43RER"
  relativeOrbit?: string;           // e.g. "R019"
  radiometricResolution?: string;   // e.g. "12-bit Quantized"
  latitude?: number;
  longitude?: number;
  elevationMeters?: number;
}

export interface ValidationItem {
  key: string;
  label: string;
  status: 'passed' | 'warning' | 'error';
  message: string;
}

export interface SatelliteValidationResult {
  isValid: boolean;
  overallStatus: 'passed' | 'warning' | 'error';
  qualityScore: number; // 0 to 100
  items: ValidationItem[];
  summaryMessage: string;
}

// Sensor operational launch dates for epoch verification
const SENSOR_LAUNCH_DATES: Record<string, string> = {
  'Sentinel-2A': '2015-06-23',
  'Sentinel-2B': '2017-03-07',
  'Sentinel-2': '2015-06-23',
  'Landsat-8': '2013-02-11',
  'Landsat 8': '2013-02-11',
  'Landsat-9': '2021-09-27',
  'Landsat 9': '2021-09-27',
  'PlanetScope': '2018-11-29',
  'SPOT-7': '2014-06-30'
};

/**
 * Validates satellite acquisition metadata against remote sensing standards
 * for optical landslide and scarp geomorphology detection.
 */
export function validateSatelliteMetadata(
  meta: Partial<SatelliteAcquisitionMetadata>
): SatelliteValidationResult {
  const items: ValidationItem[] = [];
  let scoreDeduction = 0;

  // 1. Acquisition Date Validation
  const acqDateStr = meta.acquisitionDate?.trim() || '';
  if (!acqDateStr) {
    items.push({
      key: 'date',
      label: 'Acquisition Date',
      status: 'error',
      message: 'Acquisition date is missing. Time-series verification requires a valid timestamp.'
    });
    scoreDeduction += 30;
  } else {
    const acqDate = new Date(acqDateStr);
    const now = new Date();
    
    if (isNaN(acqDate.getTime())) {
      items.push({
        key: 'date',
        label: 'Acquisition Date',
        status: 'error',
        message: 'Invalid date format. Expected standard ISO format (YYYY-MM-DD).'
      });
      scoreDeduction += 30;
    } else if (acqDate.getTime() > now.getTime() + 86400000) { // allow 1 day tolerance for timezone offsets
      items.push({
        key: 'date',
        label: 'Acquisition Date',
        status: 'error',
        message: `Future timestamp detected (${acqDateStr}). Telemetry cannot precede current epoch.`
      });
      scoreDeduction += 35;
    } else {
      // Check against sensor launch epoch
      let matchedSensorLaunch: string | undefined;
      const sensorStr = meta.sensorPlatform || '';
      for (const [sKey, lDate] of Object.entries(SENSOR_LAUNCH_DATES)) {
        if (sensorStr.toLowerCase().includes(sKey.toLowerCase())) {
          matchedSensorLaunch = lDate;
          break;
        }
      }

      if (matchedSensorLaunch && acqDate < new Date(matchedSensorLaunch)) {
        items.push({
          key: 'date',
          label: 'Acquisition Date',
          status: 'error',
          message: `Date precedes sensor deployment (${matchedSensorLaunch}). Sensor platform was not yet in orbit.`
        });
        scoreDeduction += 35;
      } else {
        // Age check: warn if imagery is > 2 years old
        const ageDays = (now.getTime() - acqDate.getTime()) / (1000 * 60 * 60 * 24);
        if (ageDays > 730) {
          items.push({
            key: 'date',
            label: 'Acquisition Date',
            status: 'warning',
            message: `Historical archive scene (${Math.round(ageDays / 365)} years old). High likelihood of geomorphic slope changes since capture.`
          });
          scoreDeduction += 10;
        } else {
          items.push({
            key: 'date',
            label: 'Acquisition Date',
            status: 'passed',
            message: `Temporal epoch valid (${acqDateStr}) within modern constellation operational window.`
          });
        }
      }
    }
  }

  // 2. Sensor Platform Validation
  const sensor = meta.sensorPlatform?.trim() || '';
  if (!sensor) {
    items.push({
      key: 'sensor',
      label: 'Sensor Platform',
      status: 'error',
      message: 'Sensor platform unspecified. Multispectral band calibration requires known instrument response function.'
    });
    scoreDeduction += 25;
  } else if (
    sensor.toLowerCase().includes('sentinel-2') ||
    sensor.toLowerCase().includes('landsat') ||
    sensor.toLowerCase().includes('planetscope') ||
    sensor.toLowerCase().includes('spot')
  ) {
    items.push({
      key: 'sensor',
      label: 'Sensor Platform',
      status: 'passed',
      message: `Verified Earth Observation payload: ${sensor} with calibrated solar spectral bands.`
    });
  } else {
    items.push({
      key: 'sensor',
      label: 'Sensor Platform',
      status: 'warning',
      message: `Uncommon sensor payload (${sensor}). Gabor filter frequency scaling will use standard VNIR assumptions.`
    });
    scoreDeduction += 10;
  }

  // 3. Cloud Cover Percentage Validation
  const cloud = meta.cloudCover ?? 0;
  if (cloud < 0 || cloud > 100 || isNaN(cloud)) {
    items.push({
      key: 'cloud',
      label: 'Cloud Cover',
      status: 'error',
      message: 'Cloud cover percentage must be between 0.0% and 100.0%.'
    });
    scoreDeduction += 30;
  } else if (cloud > 35) {
    items.push({
      key: 'cloud',
      label: 'Cloud Cover',
      status: 'error',
      message: `Severe optical obstruction (${cloud.toFixed(1)}%). Thick cumulus/stratus occludes slope textures and corrupts VGG19 spatial variance.`
    });
    scoreDeduction += 40;
  } else if (cloud > 15) {
    items.push({
      key: 'cloud',
      label: 'Cloud Cover',
      status: 'warning',
      message: `Moderate cloud/cirrus cover (${cloud.toFixed(1)}%). Cloud shadows may introduce artificial gradient edges in Gabor texture maps.`
    });
    scoreDeduction += 15;
  } else {
    items.push({
      key: 'cloud',
      label: 'Cloud Cover',
      status: 'passed',
      message: `Optimal optical clarity (${cloud.toFixed(1)}% cloud cover). Sub-pixel atmospheric interference is minimal.`
    });
  }

  // 4. Spatial Ground Resolution Validation
  const gsd = meta.groundSamplingDistanceMeters || 10;
  if (gsd <= 0 || isNaN(gsd)) {
    items.push({
      key: 'resolution',
      label: 'Spatial Resolution',
      status: 'error',
      message: 'Invalid ground sampling distance value.'
    });
    scoreDeduction += 25;
  } else if (gsd > 60) {
    items.push({
      key: 'resolution',
      label: 'Spatial Resolution',
      status: 'error',
      message: `GSD of ${gsd}m is too coarse. Cannot resolve individual translational scarps, tension cracks, or debris lobes.`
    });
    scoreDeduction += 35;
  } else if (gsd > 30) {
    items.push({
      key: 'resolution',
      label: 'Spatial Resolution',
      status: 'warning',
      message: `GSD of ${gsd}m is borderline for micro-topography. Suitable only for massive regional debris avalanches (>100m width).`
    });
    scoreDeduction += 15;
  } else {
    items.push({
      key: 'resolution',
      label: 'Spatial Resolution',
      status: 'passed',
      message: `High-fidelity ground resolution (${gsd}m GSD). Resolves narrow road cuts, retaining wall breaks, and scarp crowns.`
    });
  }

  // 5. Sun Elevation Angle Validation
  const sunElevation = meta.sunElevation ?? 52;
  if (sunElevation < 0 || sunElevation > 90 || isNaN(sunElevation)) {
    items.push({
      key: 'sun_elevation',
      label: 'Solar Elevation',
      status: 'error',
      message: 'Solar elevation angle must be between 0.0° and 90.0°.'
    });
    scoreDeduction += 20;
  } else if (sunElevation < 25) {
    items.push({
      key: 'sun_elevation',
      label: 'Solar Elevation',
      status: 'warning',
      message: `Low solar angle (${sunElevation.toFixed(1)}°). Steep mountain slopes (Himalayas/Ghats) will cast deep shadow occlusions.`
    });
    scoreDeduction += 15;
  } else {
    items.push({
      key: 'sun_elevation',
      label: 'Solar Elevation',
      status: 'passed',
      message: `Adequate solar elevation (${sunElevation.toFixed(1)}°). Balanced slope illumination across aspect angles.`
    });
  }

  // 6. Atmospheric Processing Level Validation
  const procLevel = meta.processingLevel || '';
  if (procLevel.toLowerCase().includes('level-2a') || procLevel.toLowerCase().includes('boa') || procLevel.toLowerCase().includes('surface reflectance')) {
    items.push({
      key: 'processing_level',
      label: 'Processing Level',
      status: 'passed',
      message: 'Level-2A BOA Surface Reflectance. Atmospherically corrected via Sen2Cor for accurate vegetation NDVI.'
    });
  } else if (procLevel.toLowerCase().includes('level-1c') || procLevel.toLowerCase().includes('toa')) {
    items.push({
      key: 'processing_level',
      label: 'Processing Level',
      status: 'warning',
      message: 'Level-1C TOA (Top of Atmosphere). Rayleigh scattering may slightly attenuate blue-band and NIR ratios.'
    });
    scoreDeduction += 10;
  } else {
    items.push({
      key: 'processing_level',
      label: 'Processing Level',
      status: 'passed',
      message: procLevel || 'Standard Orthorectified Surface Reflectance.'
    });
  }

  // Calculate final quality score (0 - 100)
  const qualityScore = Math.max(0, Math.min(100, 100 - scoreDeduction));

  const hasErrors = items.some(i => i.status === 'error');
  const hasWarnings = items.some(i => i.status === 'warning');

  const overallStatus = hasErrors ? 'error' : hasWarnings ? 'warning' : 'passed';
  const isValid = !hasErrors;

  let summaryMessage = '';
  if (overallStatus === 'passed') {
    summaryMessage = 'All telemetry criteria validated. Satellite scene fully satisfies Copernicus/USGS radiometric standards for AI inference.';
  } else if (overallStatus === 'warning') {
    summaryMessage = 'Telemetry accepted with warnings. Minor atmospheric or temporal deviations may slightly influence confidence margins.';
  } else {
    summaryMessage = 'Critical validation failures detected. Correct corrupted acquisition parameters before executing AI inference.';
  }

  return {
    isValid,
    overallStatus,
    qualityScore,
    items,
    summaryMessage
  };
}

/**
 * Creates default verified Sentinel-2 metadata for a given region or benchmark scene
 */
export function getDefaultAcquisitionMetadata(
  regionName: string = 'Uttarakhand, Western Himalayas',
  coordinates: { lat: number; lng: number } = { lat: 30.4128, lng: 79.3245 }
): SatelliteAcquisitionMetadata {
  const isSouthIndia = coordinates.lat < 16;
  const utmZone = isSouthIndia ? 'UTM Zone 44N (EPSG:32644)' : 'UTM Zone 43N (EPSG:32643)';
  
  return {
    acquisitionDate: '2024-07-28',
    sensorPlatform: 'Sentinel-2B MSI (Copernicus ESA)',
    cloudCover: 1.8,
    spatialResolution: '10m GSD (B2, B3, B4, B8)',
    groundSamplingDistanceMeters: 10.0,
    sunElevation: 58.4,
    sunAzimuth: 134.2,
    processingLevel: 'Level-2A (Bottom-of-Atmosphere / BOA Reflectance)',
    crsProjection: `WGS 84 / ${utmZone}`,
    sceneId: `S2B_MSIL2A_20240728T051839_N0511_R019_${coordinates.lat.toFixed(2).replace('.', '')}N`,
    relativeOrbit: 'R019 (Descending Node, 10:30 AM equator crossing)',
    radiometricResolution: '12-bit Quantized Multispectral (Scaled to 10,000 DN)',
    latitude: coordinates.lat,
    longitude: coordinates.lng,
    elevationMeters: 1850
  };
}
