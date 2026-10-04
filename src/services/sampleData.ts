import { SatelliteSample, PredictionRecord, AlertRecord, AnalyticsData, ModelInfo } from '../types';

// Helper to generate a realistic procedural satellite terrain data URL via Canvas
export function generateProceduralSatelliteImage(type: 'landslide_1' | 'landslide_2' | 'stable_1' | 'stable_2'): string {
  if (typeof document === 'undefined') return '';
  const canvas = document.createElement('canvas');
  canvas.width = 448;
  canvas.height = 448;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // Base background: mountain elevation terrain gradient
  const bgGrad = ctx.createLinearGradient(0, 0, 448, 448);
  if (type === 'landslide_1') {
    bgGrad.addColorStop(0, '#1E291F');   // Alpine ridge
    bgGrad.addColorStop(0.5, '#2D372E'); // Forest slope
    bgGrad.addColorStop(1, '#1A231C');   // Valley floor
  } else if (type === 'landslide_2') {
    bgGrad.addColorStop(0, '#36342E');   // Barren alpine rock
    bgGrad.addColorStop(0.6, '#2E3529'); // Scrub hillside
    bgGrad.addColorStop(1, '#232921');
  } else if (type === 'stable_1') {
    bgGrad.addColorStop(0, '#1B382B');   // Dense dark conifer
    bgGrad.addColorStop(0.5, '#244837'); // Vibrant canopy
    bgGrad.addColorStop(1, '#1E3C2E');
  } else {
    bgGrad.addColorStop(0, '#2D4434');   // Rolling deciduous
    bgGrad.addColorStop(0.5, '#35533F');
    bgGrad.addColorStop(1, '#253B2D');
  }
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 448, 448);

  // Draw natural mountain ridges and elevation contours
  ctx.lineWidth = 1.5;
  for (let y = 30; y < 448; y += 38) {
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.moveTo(0, y);
    for (let x = 0; x <= 448; x += 20) {
      const offset = Math.sin((x + y * 2) * 0.02) * 14 + Math.cos(x * 0.05) * 8;
      ctx.lineTo(x, y + offset);
    }
    ctx.stroke();
  }

  // Draw forest texture or canopy speckles
  const isLandslide = type === 'landslide_1' || type === 'landslide_2';
  for (let i = 0; i < 2400; i++) {
    const rx = Math.random() * 448;
    const ry = Math.random() * 448;
    const size = Math.random() * 2.2 + 0.8;
    const greenShade = Math.floor(Math.random() * 40 + 35);
    ctx.fillStyle = `rgba(20, ${greenShade + 20}, ${greenShade}, ${Math.random() * 0.4 + 0.2})`;
    ctx.beginPath();
    ctx.arc(rx, ry, size, 0, Math.PI * 2);
    ctx.fill();
  }

  // If landslide: draw prominent irregular debris flow chute & exposed mud/soil scar
  if (isLandslide) {
    ctx.save();
    // Scar path
    ctx.beginPath();
    const startX = type === 'landslide_1' ? 140 : 280;
    const startY = 40;
    ctx.moveTo(startX, startY);

    // Chute shape
    ctx.bezierCurveTo(
      startX - 40, startY + 120,
      startX + 80, startY + 220,
      startX + (type === 'landslide_1' ? 70 : -50), 410
    );
    ctx.lineWidth = type === 'landslide_1' ? 52 : 64;
    ctx.strokeStyle = '#6E553A'; // Exposed brown earth
    ctx.lineCap = 'round';
    ctx.stroke();

    // Inner gouge / raw bedrock
    ctx.lineWidth = type === 'landslide_1' ? 32 : 40;
    ctx.strokeStyle = '#8B6E4A';
    ctx.stroke();

    // Erosion fissures / rock striations
    ctx.lineWidth = 14;
    ctx.strokeStyle = '#4A3B29';
    ctx.stroke();

    // Alluvial fan deposit at base
    ctx.beginPath();
    const fanX = startX + (type === 'landslide_1' ? 70 : -50);
    ctx.ellipse(fanX, 400, 75, 45, Math.PI / 12, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(110, 85, 58, 0.75)';
    ctx.fill();

    // Scatter debris boulders & gravel
    for (let d = 0; d < 180; d++) {
      const dx = fanX + (Math.random() - 0.5) * 110;
      const dy = 320 + Math.random() * 110;
      ctx.fillStyle = Math.random() > 0.5 ? '#9E8563' : '#3D3123';
      ctx.fillRect(dx, dy, Math.random() * 4 + 2, Math.random() * 3 + 2);
    }
    ctx.restore();
  } else {
    // Non-landslide: add clean river or undisturbed natural drainage vein
    ctx.beginPath();
    ctx.moveTo(0, 390);
    ctx.bezierCurveTo(120, 380, 260, 420, 448, 410);
    ctx.lineWidth = 16;
    ctx.strokeStyle = '#1A3344'; // Clean mountain stream
    ctx.stroke();

    // High density healthy vegetation across slopes
    for (let c = 0; c < 1500; c++) {
      const cx = Math.random() * 448;
      const cy = Math.random() * 448;
      ctx.fillStyle = 'rgba(34, 197, 94, 0.12)';
      ctx.beginPath();
      ctx.arc(cx, cy, Math.random() * 3 + 1, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Scientific satellite grid overlay and corner reticles
  ctx.strokeStyle = 'rgba(6, 182, 212, 0.25)';
  ctx.lineWidth = 1;
  // Corner markers
  const sz = 16;
  // Top-left
  ctx.beginPath(); ctx.moveTo(12, 12 + sz); ctx.lineTo(12, 12); ctx.lineTo(12 + sz, 12); ctx.stroke();
  // Top-right
  ctx.beginPath(); ctx.moveTo(436 - sz, 12); ctx.lineTo(436, 12); ctx.lineTo(436, 12 + sz); ctx.stroke();
  // Bottom-left
  ctx.beginPath(); ctx.moveTo(12, 436 - sz); ctx.lineTo(12, 436); ctx.lineTo(12 + sz, 436); ctx.stroke();
  // Bottom-right
  ctx.beginPath(); ctx.moveTo(436 - sz, 436); ctx.lineTo(436, 436); ctx.lineTo(436, 436 - sz); ctx.stroke();

  return canvas.toDataURL('image/jpeg', 0.92);
}

export const SATELLITE_SAMPLES: SatelliteSample[] = [
  {
    id: 'sample-ls-01',
    name: 'Himalayan Ridge Sector 4B',
    region: 'Uttarakhand, Western Himalayas',
    groundTruth: 'landslide',
    description: 'Post-monsoon debris flow with deep 60m incision, stripped sub-alpine canopy, and exposed bedrock scar.',
    elevation: '3,420 m',
    coordinates: { lat: 30.4128, lng: 79.3245 },
    imageDataUrl: ''
  },
  {
    id: 'sample-ls-02',
    name: 'Western Ghats Escarpment',
    region: 'Wayanad Ghat Corridor',
    groundTruth: 'landslide',
    description: 'Heavy rainfall slope destabilization with alluvial fan deposit across primary transport road.',
    elevation: '1,890 m',
    coordinates: { lat: 11.5834, lng: 76.0825 },
    imageDataUrl: ''
  },
  {
    id: 'sample-nl-01',
    name: 'Cascade Conifer Ridge',
    region: 'Mt. Rainier Northern Flank',
    groundTruth: 'non-landslide',
    description: 'Intact old-growth coniferous canopy with uniform root stabilization and natural hydrological run-off channels.',
    elevation: '2,150 m',
    coordinates: { lat: 46.8523, lng: -121.7603 },
    imageDataUrl: ''
  },
  {
    id: 'sample-nl-02',
    name: 'Appalachian Reserve Basin',
    region: 'Blue Ridge Geo-Survey Sector',
    groundTruth: 'non-landslide',
    description: 'Continuous deciduous vegetation cover showing high structural stability and zero displacement indicators.',
    elevation: '1,240 m',
    coordinates: { lat: 35.7649, lng: -82.2651 },
    imageDataUrl: ''
  }
];

export const INITIAL_PREDICTIONS: PredictionRecord[] = [
  {
    id: 'PRED-2026-8841',
    imageName: 'Sentinel2_Uttarakhand_Sector4B_20260912.png',
    imageSize: 2421800,
    imageUrl: '',
    prediction: 'landslide',
    confidence: 0.9658,
    riskLevel: 'critical',
    processingTime: 412,
    createdAt: '2026-10-03T14:22:10Z',
    status: 'completed',
    locationName: 'Uttarakhand, Himalayas',
    coordinates: { lat: 30.4128, lng: 79.3245 },
    features: {
      terrainRoughness: 0.88,
      gaborTextureEnergy: 0.92,
      vegetationIndexNDVI: 0.21,
      soilDisplacementIndex: 0.94,
      vggSpatialVariance: 0.85,
      gaborAngles: [
        { angle: 0, energy: 0.74 },
        { angle: 45, energy: 0.91 },
        { angle: 90, energy: 0.62 },
        { angle: 135, energy: 0.88 }
      ]
    },
    notes: 'Severe debris avalanche scar identified along eastern drainage chute.'
  },
  {
    id: 'PRED-2026-8839',
    imageName: 'PlanetScope_Cascade_Sector_Stable.jpg',
    imageSize: 1845100,
    imageUrl: '',
    prediction: 'non-landslide',
    confidence: 0.9782,
    riskLevel: 'low',
    processingTime: 388,
    createdAt: '2026-10-02T09:15:44Z',
    status: 'completed',
    locationName: 'Cascade Range Flank',
    coordinates: { lat: 46.8523, lng: -121.7603 },
    features: {
      terrainRoughness: 0.22,
      gaborTextureEnergy: 0.28,
      vegetationIndexNDVI: 0.82,
      soilDisplacementIndex: 0.08,
      vggSpatialVariance: 0.25,
      gaborAngles: [
        { angle: 0, energy: 0.21 },
        { angle: 45, energy: 0.19 },
        { angle: 90, energy: 0.26 },
        { angle: 135, energy: 0.22 }
      ]
    },
    notes: 'Stable mature conifer forest canopy. No geomorphic deformation.'
  },
  {
    id: 'PRED-2026-8835',
    imageName: 'Sentinel2_Wayanad_MonsoonRunoff.png',
    imageSize: 3102400,
    imageUrl: '',
    prediction: 'landslide',
    confidence: 0.9542,
    riskLevel: 'high',
    processingTime: 445,
    createdAt: '2026-10-01T18:40:12Z',
    status: 'completed',
    locationName: 'Wayanad Escarpment',
    coordinates: { lat: 11.5834, lng: 76.0825 },
    features: {
      terrainRoughness: 0.79,
      gaborTextureEnergy: 0.84,
      vegetationIndexNDVI: 0.31,
      soilDisplacementIndex: 0.89,
      vggSpatialVariance: 0.81,
      gaborAngles: [
        { angle: 0, energy: 0.65 },
        { angle: 45, energy: 0.83 },
        { angle: 90, energy: 0.71 },
        { angle: 135, energy: 0.78 }
      ]
    },
    notes: 'Crown scarp observed at elevation 1890m with downward talus migration.'
  },
  {
    id: 'PRED-2026-8829',
    imageName: 'Landsat9_BlueRidge_Survey_Area1.jpg',
    imageSize: 1980000,
    imageUrl: '',
    prediction: 'non-landslide',
    confidence: 0.9810,
    riskLevel: 'low',
    processingTime: 360,
    createdAt: '2026-09-29T11:05:00Z',
    status: 'completed',
    locationName: 'Blue Ridge Basin',
    coordinates: { lat: 35.7649, lng: -82.2651 },
    features: {
      terrainRoughness: 0.18,
      gaborTextureEnergy: 0.22,
      vegetationIndexNDVI: 0.86,
      soilDisplacementIndex: 0.05,
      vggSpatialVariance: 0.19,
      gaborAngles: [
        { angle: 0, energy: 0.18 },
        { angle: 45, energy: 0.15 },
        { angle: 90, energy: 0.20 },
        { angle: 135, energy: 0.17 }
      ]
    },
    notes: 'Consistent vegetative reflectance. Intact topographical slopes.'
  },
  {
    id: 'PRED-2026-8821',
    imageName: 'WorldView3_Alps_Valais_Rockslide.png',
    imageSize: 2750300,
    imageUrl: '',
    prediction: 'landslide',
    confidence: 0.9419,
    riskLevel: 'high',
    processingTime: 420,
    createdAt: '2026-09-27T08:33:20Z',
    status: 'completed',
    locationName: 'Valais Alpine Sector',
    coordinates: { lat: 46.2276, lng: 7.3589 },
    features: {
      terrainRoughness: 0.82,
      gaborTextureEnergy: 0.86,
      vegetationIndexNDVI: 0.24,
      soilDisplacementIndex: 0.87,
      vggSpatialVariance: 0.79,
      gaborAngles: [
        { angle: 0, energy: 0.70 },
        { angle: 45, energy: 0.86 },
        { angle: 90, energy: 0.68 },
        { angle: 135, energy: 0.82 }
      ]
    },
    notes: 'Rock avalanche debris extending 400m into valley catchment.'
  }
];

export const INITIAL_ALERTS: AlertRecord[] = [
  {
    id: 'ALERT-091',
    predictionId: 'PRED-2026-8841',
    alertType: 'severe_debris_flow',
    title: 'Severe Debris Flow Hazard Detected',
    message: 'Satellite imagery analysis indicates active high-volume soil displacement (96.58% confidence) along Himalayan Sector 4B.',
    status: 'active',
    severity: 'critical',
    locationName: 'Uttarakhand, Himalayas',
    createdAt: '2026-10-03T14:22:15Z'
  },
  {
    id: 'ALERT-089',
    predictionId: 'PRED-2026-8835',
    alertType: 'landslide_hazard',
    title: 'Monsoon Slope Failure Detected',
    message: 'Significant vegetation loss and exposed talus chute detected (95.42% confidence) near Wayanad transport corridor.',
    status: 'active',
    severity: 'high',
    locationName: 'Wayanad Escarpment',
    createdAt: '2026-10-01T18:40:20Z'
  },
  {
    id: 'ALERT-084',
    predictionId: 'PRED-2026-8821',
    alertType: 'slope_instability',
    title: 'Alpine Rock Avalanche Recorded',
    message: 'Rock avalanche debris extending into catchment basin verified (94.19% confidence).',
    status: 'acknowledged',
    severity: 'high',
    locationName: 'Valais Alpine Sector',
    createdAt: '2026-09-27T08:33:30Z',
    acknowledgedAt: '2026-09-27T10:14:02Z',
    acknowledgedBy: 'Dr. Sarah Lin (Geospatial Lead)'
  }
];

export const MODEL_METADATA: ModelInfo = {
  name: 'Landslide-Net Hybrid VGG19-Gabor-ResNet101',
  version: '2.4.0-Production',
  featureExtractor: 'VGG19 (Pretrained on ImageNet, fine-tuned conv block 4 & 5) + Multi-scale Gabor Filter Bank',
  classifier: 'ResNet101 Deep Residual Bottleneck Classification Head',
  preprocessing: [
    'Bilinear Resampling to 224×224 pixels',
    'Min-Max Radiometric Normalization [0, 1]',
    'Multi-scale Gabor Texture Filtering (λ=4, θ∈{0°, 45°, 90°, 135°})',
    'Z-score Standardization per spectral band'
  ],
  reportedAccuracy: 96.58,
  inputDimensions: '224 × 224 × 3 (RGB Satellite Bands)',
  backboneLayers: 120,
  totalParameters: '64.8 Million',
  gaborKernelsCount: 16,
  datasetOrigin: 'Curated Satellite Remote Sensing Landslide Benchmark (Sentinel-2 & Landsat-8 imagery)',
  trainingEpochs: 60
};

export const INITIAL_ANALYTICS: AnalyticsData = {
  totalAnalyzed: 148,
  landslidesDetected: 62,
  nonLandslides: 86,
  averageConfidence: 96.2,
  reportedAccuracy: 96.58,
  predictionDistribution: [
    { name: 'Non-Landslide', value: 86, color: '#10B981' },
    { name: 'Landslide', value: 62, color: '#EF4444' }
  ],
  confidenceDistribution: [
    { range: '90 - 92%', count: 11, landslides: 4 },
    { range: '92 - 94%', count: 24, landslides: 9 },
    { range: '94 - 96%', count: 48, landslides: 21 },
    { range: '96 - 98%', count: 52, landslides: 23 },
    { range: '98 - 100%', count: 13, landslides: 5 }
  ],
  detectionTimeline: [
    { date: 'Sep 27', landslide: 8, nonLandslide: 14 },
    { date: 'Sep 28', landslide: 11, nonLandslide: 12 },
    { date: 'Sep 29', landslide: 9, nonLandslide: 15 },
    { date: 'Sep 30', landslide: 14, nonLandslide: 16 },
    { date: 'Oct 01', landslide: 7, nonLandslide: 11 },
    { date: 'Oct 02', landslide: 6, nonLandslide: 10 },
    { date: 'Oct 03', landslide: 7, nonLandslide: 8 }
  ],
  riskDistribution: [
    { level: 'Critical Risk', count: 29, color: '#EF4444' },
    { level: 'High Risk', count: 33, color: '#F97316' },
    { level: 'Moderate Risk', count: 18, color: '#F59E0B' },
    { level: 'Low / Stable', count: 68, color: '#10B981' }
  ],
  confusionMatrix: {
    truePositive: 60,
    falsePositive: 2,
    trueNegative: 83,
    falseNegative: 3
  }
};
