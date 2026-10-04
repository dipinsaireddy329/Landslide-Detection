import { SatelliteSample, PredictionRecord, AlertRecord, AnalyticsData, ModelInfo } from '../types';

// Cache for generated procedural satellite images
const proceduralImageCache: Record<string, string> = {};

// Safe SVG fallback data URL in case canvas operations are restricted
function getFallbackSvgDataUrl(typeOrId: string, isLandslide: boolean): string {
  const primaryColor = isLandslide ? '#7B4A34' : '#163625';
  const accentColor = isLandslide ? '#EF4444' : '#10B981';
  const label = isLandslide ? 'LANDSLIDE HAZARD ZONE' : 'STABLE TERRAIN SECTOR';
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="448" height="448" viewBox="0 0 448 448">
    <rect width="448" height="448" fill="${primaryColor}"/>
    <line x1="0" y1="120" x2="448" y2="160" stroke="rgba(255,255,255,0.1)" stroke-width="2"/>
    <line x1="0" y1="240" x2="448" y2="280" stroke="rgba(255,255,255,0.1)" stroke-width="2"/>
    <line x1="0" y1="340" x2="448" y2="370" stroke="rgba(255,255,255,0.1)" stroke-width="2"/>
    ${isLandslide ? '<path d="M160,40 Q220,180 180,260 T240,420" stroke="#995E43" stroke-width="48" fill="none" stroke-linecap="round"/>' : '<path d="M0,220 Q180,200 448,240" stroke="#1D4ED8" stroke-width="12" fill="none"/>'}
    <rect x="16" y="16" width="180" height="24" rx="4" fill="rgba(0,0,0,0.7)"/>
    <text x="24" y="32" font-family="monospace" font-size="10" font-weight="bold" fill="${accentColor}">[${label}]</text>
    <text x="20" y="432" font-family="monospace" font-size="9" fill="rgba(255,255,255,0.7)">RGB: B04-B03-B02 | 10M GSD</text>
  </svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

// Helper to generate a realistic procedural satellite terrain data URL via Canvas
export function generateProceduralSatelliteImage(typeOrId: string = 'landslide_1'): string {
  if (typeof document === 'undefined') {
    return getFallbackSvgDataUrl(typeOrId, typeOrId.includes('landslide') || typeOrId.startsWith('sample-ls'));
  }
  if (proceduralImageCache[typeOrId]) {
    return proceduralImageCache[typeOrId];
  }

  // Determine whether scene is landslide hazard or stable
  const isLandslide = 
    typeOrId.includes('landslide') || 
    typeOrId.startsWith('sample-ls') || 
    typeOrId === 'landslide_1' || 
    typeOrId === 'landslide_2';

  try {
    const canvas = document.createElement('canvas');
    canvas.width = 448;
    canvas.height = 448;
    const ctx = canvas.getContext('2d');
    if (!ctx) return getFallbackSvgDataUrl(typeOrId, isLandslide);

    // Seedable pseudo-random generator based on scene ID string
    let seed = 0;
    for (let i = 0; i < typeOrId.length; i++) {
      seed = (seed * 31 + typeOrId.charCodeAt(i)) & 0xffffffff;
    }
    const pseudoRandom = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };

    // Base background terrain gradient depending on geological biome
    const bgGrad = ctx.createLinearGradient(0, 0, 448, 448);
    if (typeOrId.includes('04') || typeOrId.includes('seshachalam') || typeOrId.includes('tirupati')) {
      // Reddish sandstone & scrub (Tirupati Seshachalam)
      bgGrad.addColorStop(0, '#3A271E');
      bgGrad.addColorStop(0.5, '#4E3427');
      bgGrad.addColorStop(1, '#2E2018');
    } else if (typeOrId.includes('03') || typeOrId.includes('08') || typeOrId.includes('kedarnath') || typeOrId.includes('dolomite')) {
      // Alpine crag & grey bedrock (Kedarnath / Dolomites)
      bgGrad.addColorStop(0, '#282C30');
      bgGrad.addColorStop(0.5, '#383D42');
      bgGrad.addColorStop(1, '#222528');
    } else if (typeOrId.includes('05') || typeOrId.includes('15') || typeOrId.includes('darjeeling') || typeOrId.includes('nilgiri')) {
      // Terraced tea garden & highland green (Darjeeling / Nilgiris)
      bgGrad.addColorStop(0, '#203E26');
      bgGrad.addColorStop(0.5, '#2D5434');
      bgGrad.addColorStop(1, '#1A331F');
    } else if (typeOrId.includes('09') || typeOrId.includes('helens')) {
      // Volcanic ash & pumice slope (Mt Saint Helens)
      bgGrad.addColorStop(0, '#353331');
      bgGrad.addColorStop(0.5, '#423F3D');
      bgGrad.addColorStop(1, '#262423');
    } else if (isLandslide) {
      // Standard alpine / mountain slope
      bgGrad.addColorStop(0, '#1E291F');
      bgGrad.addColorStop(0.5, '#2D372E');
      bgGrad.addColorStop(1, '#1A231C');
    } else {
      // Healthy conifer / deciduous canopy
      bgGrad.addColorStop(0, '#163625');
      bgGrad.addColorStop(0.5, '#224D35');
      bgGrad.addColorStop(1, '#183827');
    }
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 448, 448);

    // Elevation contour lines and geological ridgelines
    ctx.lineWidth = 1.4;
    for (let y = 25; y < 448; y += 40) {
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
      ctx.moveTo(0, y);
      for (let x = 0; x <= 448; x += 24) {
        const offset = Math.sin((x + y * 2) * 0.02) * 14 + Math.cos(x * 0.05) * 8;
        ctx.lineTo(x, y + offset);
      }
      ctx.stroke();
    }

    // Draw natural forest canopy texture & vegetation micro-clusters (optimized cluster count)
    const canopyCount = isLandslide ? 450 : 650;
    for (let i = 0; i < canopyCount; i++) {
      const rx = pseudoRandom() * 448;
      const ry = pseudoRandom() * 448;
      const size = pseudoRandom() * 3.5 + 1.2;
      const greenBase = isLandslide ? 45 : 75;
      const g = Math.floor(pseudoRandom() * 40 + greenBase);
      const r = Math.floor(pseudoRandom() * 25 + 15);
      const b = Math.floor(pseudoRandom() * 25 + 15);
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${pseudoRandom() * 0.45 + 0.35})`;
      ctx.fillRect(rx, ry, size, size);
    }

    // If landslide hazard: render distinct debris flow chute, exposed bedrock scarp, and alluvial fan
    if (isLandslide) {
      ctx.save();
      const startX = 120 + pseudoRandom() * 200;
      const startY = 30 + pseudoRandom() * 30;
      const midOffset = (pseudoRandom() - 0.5) * 120;
      const endX = startX + (pseudoRandom() - 0.5) * 150;
      const endY = 410;

      // Outer scar border & displaced soil envelope
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.bezierCurveTo(
        startX + midOffset, startY + 120,
        startX - midOffset, startY + 230,
        endX, endY
      );
      ctx.lineWidth = 55 + pseudoRandom() * 20;
      // Soil color based on region (reddish laterite in Tirupati/Wayanad vs grey/brown in Himalayas/Dolomites)
      if (typeOrId.includes('04') || typeOrId.includes('02') || typeOrId.includes('05')) {
        ctx.strokeStyle = '#7B4A34'; // Terracotta laterite
      } else if (typeOrId.includes('08')) {
        ctx.strokeStyle = '#5E5D59'; // Carbonate limestone grey
      } else {
        ctx.strokeStyle = '#6E553A'; // Exposed brown alluvial earth
      }
      ctx.lineCap = 'round';
      ctx.stroke();

      // Inner core trench / bedrock incision
      ctx.lineWidth = 34 + pseudoRandom() * 10;
      if (typeOrId.includes('04') || typeOrId.includes('02')) {
        ctx.strokeStyle = '#995E43';
      } else {
        ctx.strokeStyle = '#8B6E4A';
      }
      ctx.stroke();

      // Shear fissures & striation grooves
      ctx.lineWidth = 14;
      ctx.strokeStyle = '#433423';
      ctx.stroke();

      // Base deposition fan / runout lobe with safe ellipse/arc fallback
      ctx.beginPath();
      const fanRadiusX = 75 + pseudoRandom() * 25;
      const fanRadiusY = 45 + pseudoRandom() * 15;
      if (typeof ctx.ellipse === 'function') {
        ctx.ellipse(endX, 395, fanRadiusX, fanRadiusY, (pseudoRandom() - 0.5) * 0.4, 0, Math.PI * 2);
      } else {
        ctx.arc(endX, 395, fanRadiusX, 0, Math.PI * 2);
      }
      ctx.fillStyle = typeOrId.includes('04') ? 'rgba(125, 75, 52, 0.85)' : 'rgba(110, 85, 58, 0.85)';
      ctx.fill();

      // Scattered boulders, gravel, and talus chunks
      for (let d = 0; d < 80; d++) {
        const dx = endX + (pseudoRandom() - 0.5) * (fanRadiusX * 1.8);
        const dy = 320 + pseudoRandom() * 120;
        ctx.fillStyle = pseudoRandom() > 0.45 ? '#A8906F' : '#3D3123';
        ctx.fillRect(dx, dy, pseudoRandom() * 4 + 2, pseudoRandom() * 3 + 2);
      }
      ctx.restore();
    } else {
      // Non-landslide: add clean natural mountain stream or drainage vein
      ctx.beginPath();
      ctx.moveTo(0, 380 + (pseudoRandom() - 0.5) * 60);
      ctx.bezierCurveTo(
        120, 360 + (pseudoRandom() - 0.5) * 40,
        270, 410 + (pseudoRandom() - 0.5) * 40,
        448, 395 + (pseudoRandom() - 0.5) * 60
      );
      ctx.lineWidth = 14;
      ctx.strokeStyle = '#173646'; // Clear mountain stream
      ctx.stroke();

      // Healthy dense vegetation highlights
      for (let c = 0; c < 250; c++) {
        const cx = pseudoRandom() * 448;
        const cy = pseudoRandom() * 448;
        ctx.fillStyle = 'rgba(34, 197, 94, 0.2)';
        ctx.fillRect(cx, cy, pseudoRandom() * 4 + 2, pseudoRandom() * 4 + 2);
      }
    }

    // Scientific satellite telemetry overlay, grid lines, and corner reticles
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.28)';
    ctx.lineWidth = 1;
    const sz = 16;
    // Corner markers
    ctx.beginPath(); ctx.moveTo(12, 12 + sz); ctx.lineTo(12, 12); ctx.lineTo(12 + sz, 12); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(436 - sz, 12); ctx.lineTo(436, 12); ctx.lineTo(436, 12 + sz); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(12, 436 - sz); ctx.lineTo(12, 436); ctx.lineTo(12 + sz, 436); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(436 - sz, 436); ctx.lineTo(436, 436); ctx.lineTo(436, 436 - sz); ctx.stroke();

    // Coordinates telemetry label in bottom left
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.font = '9px monospace';
    ctx.fillText('RGB: B04-B03-B02 | 10M GSD', 18, 432);

    const resultDataUrl = canvas.toDataURL('image/jpeg', 0.85);
    proceduralImageCache[typeOrId] = resultDataUrl;
    return resultDataUrl;
  } catch (err) {
    console.warn('Procedural canvas satellite generation failed, using fallback:', err);
    return getFallbackSvgDataUrl(typeOrId, isLandslide);
  }
}

// Safe getter to guarantee a valid image URL for any sample
export function getSampleImageDataUrl(sampleOrId: SatelliteSample | string): string {
  if (typeof sampleOrId === 'string') {
    return generateProceduralSatelliteImage(sampleOrId);
  }
  if (sampleOrId.imageDataUrl && sampleOrId.imageDataUrl.length > 50) {
    return sampleOrId.imageDataUrl;
  }
  const generated = generateProceduralSatelliteImage(sampleOrId.id);
  sampleOrId.imageDataUrl = generated;
  return generated;
}

// Exactly 20 Curated Satellite Benchmark Scenes for Landslide Detection
export const SATELLITE_SAMPLES: SatelliteSample[] = [
  // ================= 10 LANDSLIDE HAZARD SCENES =================
  {
    id: 'sample-ls-01',
    name: 'Himalayan Ridge Sector 4B',
    region: 'Uttarakhand, Western Himalayas',
    groundTruth: 'landslide',
    description: 'Post-monsoon debris flow with deep 60m incision, stripped sub-alpine canopy, and exposed bedrock scar.',
    elevation: '3,420 m',
    coordinates: { lat: 30.4128, lng: 79.3245 },
    sensor: 'Sentinel-2 MSI',
    date: '2026-09-14',
    resolution: '10m RGB',
    imageDataUrl: ''
  },
  {
    id: 'sample-ls-02',
    name: 'Western Ghats Escarpment',
    region: 'Wayanad Ghat Corridor, Kerala',
    groundTruth: 'landslide',
    description: 'Torrential rainfall slope destabilization with broad alluvial fan deposit blocking transport highway.',
    elevation: '1,890 m',
    coordinates: { lat: 11.5834, lng: 76.0825 },
    sensor: 'Landsat-9 OLI-2',
    date: '2026-08-28',
    resolution: '15m Pan-sharpened',
    imageDataUrl: ''
  },
  {
    id: 'sample-ls-03',
    name: 'Kedarnath Valley Glacial Breach',
    region: 'Garhwal Himalayas, Mandakini Basin',
    groundTruth: 'landslide',
    description: 'High-altitude moraine lake collapse leading to catastrophic boulder avalanche and canyon incision.',
    elevation: '3,584 m',
    coordinates: { lat: 30.7346, lng: 79.0669 },
    sensor: 'Sentinel-2 L2A',
    date: '2026-09-02',
    resolution: '10m Multispectral',
    imageDataUrl: ''
  },
  {
    id: 'sample-ls-04',
    name: 'Tirupati Seshachalam Escarpment Slip',
    region: 'Tirumala Hills, Eastern Ghats',
    groundTruth: 'landslide',
    description: 'Tectonic joint failure along sheer red quartzite sandstone cliffs depositing heavy rockfall talus.',
    elevation: '980 m',
    coordinates: { lat: 13.6823, lng: 79.3491 },
    sensor: 'PlanetScope SuperDove',
    date: '2026-09-18',
    resolution: '3m High-Res',
    imageDataUrl: ''
  },
  {
    id: 'sample-ls-05',
    name: 'Darjeeling Teesta Catchment',
    region: 'West Bengal Himalayas, Teesta Basin',
    groundTruth: 'landslide',
    description: 'Cloudburst-triggered retrogressive soil slip stripping tea plantation terraces down to red saprolite.',
    elevation: '2,045 m',
    coordinates: { lat: 27.0360, lng: 88.2627 },
    sensor: 'Sentinel-2 MSI',
    date: '2026-09-05',
    resolution: '10m RGB',
    imageDataUrl: ''
  },
  {
    id: 'sample-ls-06',
    name: 'Shimla Highway Toe Failure',
    region: 'Himachal Pradesh, Sub-Himalayan Belt',
    groundTruth: 'landslide',
    description: 'Roadcut excavation causing toe removal and retrogressive translational rockfall chute in pine forest.',
    elevation: '2,276 m',
    coordinates: { lat: 31.1048, lng: 77.1734 },
    sensor: 'WorldView-3',
    date: '2026-08-15',
    resolution: '0.5m Very High-Res',
    imageDataUrl: ''
  },
  {
    id: 'sample-ls-07',
    name: 'Oso River Valley Rotational Slide',
    region: 'North Fork Stillaguamish, WA, USA',
    groundTruth: 'landslide',
    description: 'Deep-seated rotational landslide in glacial deposit terrace with extensive lobate mudflow deposit.',
    elevation: '190 m',
    coordinates: { lat: 48.2831, lng: -121.9167 },
    sensor: 'Landsat-8 OLI',
    date: '2026-07-22',
    resolution: '15m Multispectral',
    imageDataUrl: ''
  },
  {
    id: 'sample-ls-08',
    name: 'Dolomites Rock Avalanche Cone',
    region: 'Cortina d\'Ampezzo, Italian Alps',
    groundTruth: 'landslide',
    description: 'Catastrophic dolomite limestone cliff collapse producing pale carbonate scree tongue across valley floor.',
    elevation: '2,410 m',
    coordinates: { lat: 46.5405, lng: 12.1357 },
    sensor: 'Sentinel-2 L2A',
    date: '2026-08-11',
    resolution: '10m RGB',
    imageDataUrl: ''
  },
  {
    id: 'sample-ls-09',
    name: 'Mount Saint Helens Flank Slip',
    region: 'Toutle River Valley, WA, USA',
    groundTruth: 'landslide',
    description: 'Volcanic ash and pumice scarp failure following prolonged saturated run-off along volcanic ridge.',
    elevation: '1,620 m',
    coordinates: { lat: 46.1914, lng: -122.1956 },
    sensor: 'Sentinel-2 MSI',
    date: '2026-06-30',
    resolution: '10m Multispectral',
    imageDataUrl: ''
  },
  {
    id: 'sample-ls-10',
    name: 'Wenchuan Canyon Rupture',
    region: 'Longmenshan Fault, Sichuan, China',
    groundTruth: 'landslide',
    description: 'Co-seismic rock avalanche and steep bedrock shear detachment obstructing mountain river channel.',
    elevation: '2,750 m',
    coordinates: { lat: 31.0022, lng: 103.4075 },
    sensor: 'PlanetScope SuperDove',
    date: '2026-07-04',
    resolution: '3m High-Res',
    imageDataUrl: ''
  },

  // ================= 10 STABLE / PROTECTED TERRAINS =================
  {
    id: 'sample-nl-01',
    name: 'Cascade Conifer Old-Growth Ridge',
    region: 'Mt. Rainier Northern Flank, WA, USA',
    groundTruth: 'non-landslide',
    description: 'Intact old-growth coniferous canopy with uniform root stabilization and natural hydrological run-off channels.',
    elevation: '2,150 m',
    coordinates: { lat: 46.8523, lng: -121.7603 },
    sensor: 'Sentinel-2 MSI',
    date: '2026-09-12',
    resolution: '10m RGB',
    imageDataUrl: ''
  },
  {
    id: 'sample-nl-02',
    name: 'Appalachian Reserve Basin',
    region: 'Blue Ridge Geo-Survey Sector, NC, USA',
    groundTruth: 'non-landslide',
    description: 'Continuous deciduous vegetation cover showing high structural stability and zero displacement indicators.',
    elevation: '1,240 m',
    coordinates: { lat: 35.7649, lng: -82.2651 },
    sensor: 'Landsat-9 OLI-2',
    date: '2026-09-08',
    resolution: '15m Multispectral',
    imageDataUrl: ''
  },
  {
    id: 'sample-nl-03',
    name: 'Black Forest Protected Basin',
    region: 'Baden-Württemberg, Germany',
    groundTruth: 'non-landslide',
    description: 'Intact multi-tiered fir forest with engineered sustainable root biome and stable hydrological soil profile.',
    elevation: '960 m',
    coordinates: { lat: 48.4647, lng: 8.2163 },
    sensor: 'Sentinel-2 L2A',
    date: '2026-08-19',
    resolution: '10m RGB',
    imageDataUrl: ''
  },
  {
    id: 'sample-nl-04',
    name: 'Tirumala Protected Plateau',
    region: 'Seshachalam Sanctum Reserve, AP',
    groundTruth: 'non-landslide',
    description: 'Dense dry-evergreen hill forest canopy protecting ancient Proterozoic sandstone plateau with zero erosion.',
    elevation: '1,020 m',
    coordinates: { lat: 13.6761, lng: 79.3512 },
    sensor: 'PlanetScope (3m)',
    date: '2026-09-15',
    resolution: '3m High-Res',
    imageDataUrl: ''
  },
  {
    id: 'sample-nl-05',
    name: 'Nilgiri Biosphere Contoured Slope',
    region: 'Ooty Tea Plateau, Tamil Nadu',
    groundTruth: 'non-landslide',
    description: 'Heavily reinforced vegetative contouring and terraced tea plantations with sub-surface drainage channels.',
    elevation: '2,240 m',
    coordinates: { lat: 11.4102, lng: 76.6950 },
    sensor: 'Sentinel-2 MSI',
    date: '2026-09-10',
    resolution: '10m RGB',
    imageDataUrl: ''
  },
  {
    id: 'sample-nl-06',
    name: 'Swiss Engadin Valley Slope',
    region: 'Graubünden Alps, Switzerland',
    groundTruth: 'non-landslide',
    description: 'High-altitude alpine pasture with natural avalanche and rock-catchment timber barriers in stable equilibrium.',
    elevation: '1,822 m',
    coordinates: { lat: 46.4908, lng: 9.8355 },
    sensor: 'Landsat-8 OLI',
    date: '2026-08-25',
    resolution: '15m Multispectral',
    imageDataUrl: ''
  },
  {
    id: 'sample-nl-07',
    name: 'Great Smoky Mountain Ridge',
    region: 'Tennessee-NC Border, USA',
    groundTruth: 'non-landslide',
    description: 'Humid temperate old-growth hardwood forest with uniform slope cohesion and deep root penetration.',
    elevation: '1,510 m',
    coordinates: { lat: 35.6118, lng: -83.4895 },
    sensor: 'Sentinel-2 MSI',
    date: '2026-09-01',
    resolution: '10m RGB',
    imageDataUrl: ''
  },
  {
    id: 'sample-nl-08',
    name: 'Andes Lake District Basin',
    region: 'Vicente Pérez Rosales, Chile',
    groundTruth: 'non-landslide',
    description: 'Intact southern beech (Nothofagus) forest cover on ancient consolidated volcanic basalt slopes.',
    elevation: '1,180 m',
    coordinates: { lat: -41.1350, lng: -72.0310 },
    sensor: 'Landsat-9 OLI-2',
    date: '2026-07-18',
    resolution: '15m Pan-sharpened',
    imageDataUrl: ''
  },
  {
    id: 'sample-nl-09',
    name: 'Fiordland Granite Rainforest',
    region: 'Milford Sound Basin, New Zealand',
    groundTruth: 'non-landslide',
    description: 'Ultra-dense wet temperate moss-covered forest firmly anchored on glaciated granite bedrock walls.',
    elevation: '890 m',
    coordinates: { lat: -44.6715, lng: 167.9255 },
    sensor: 'Sentinel-2 L2A',
    date: '2026-08-04',
    resolution: '10m RGB',
    imageDataUrl: ''
  },
  {
    id: 'sample-nl-10',
    name: 'Canadian Rockies Bow Valley',
    region: 'Banff National Park, Alberta, Canada',
    groundTruth: 'non-landslide',
    description: 'Stable subalpine lodgepole pine forest on well-drained glacial till and solid limestone benches.',
    elevation: '1,640 m',
    coordinates: { lat: 51.1784, lng: -115.5708 },
    sensor: 'WorldView-3',
    date: '2026-08-20',
    resolution: '0.5m Very High-Res',
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
