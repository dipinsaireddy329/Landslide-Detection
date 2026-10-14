export type PredictionClass = 'landslide' | 'non-landslide';
export type RiskLevel = 'critical' | 'high' | 'moderate' | 'low';
export type AlertSeverity = 'critical' | 'high' | 'warning';
export type AlertStatus = 'active' | 'acknowledged' | 'resolved';

export interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
  createdAt: string;
}

export interface FeatureMetrics {
  terrainRoughness: number;      // High in landslide scars (0.0 - 1.0)
  gaborTextureEnergy: number;    // Texture contrast from Gabor filters
  vegetationIndexNDVI: number;   // Vegetation coverage estimate
  soilDisplacementIndex: number; // Slope instability indicators
  vggSpatialVariance: number;    // High-level feature variance
  gaborAngles: { angle: number; energy: number }[];
}

export interface PredictionRecord {
  id: string;
  userId?: string;
  imageName: string;
  imageSize: number;
  imageUrl: string;
  thumbnailUrl?: string;
  prediction: PredictionClass;
  confidence: number;            // E.g., 0.9658
  riskLevel: RiskLevel;
  processingTime: number;        // in milliseconds
  createdAt: string;
  features: FeatureMetrics;
  status: 'completed' | 'processing' | 'failed';
  locationName?: string;
  coordinates?: { lat: number; lng: number };
  notes?: string;
  acquisitionMetadata?: {
    acquisitionDate: string;
    sensorPlatform: string;
    cloudCover: number;
    spatialResolution: string;
    sunElevation?: number;
    sunAzimuth?: number;
    processingLevel?: string;
    crsProjection?: string;
    sceneId?: string;
    qualityScore?: number;
    validationStatus?: 'passed' | 'warning' | 'error';
  };
}

export interface PredictResponse {
  prediction: PredictionClass;
  confidence: number;
  riskLevel: RiskLevel;
  processingTime: number;
  imageId: string;
  features: FeatureMetrics;
  timestamp: string;
}

export interface AlertRecord {
  id: string;
  predictionId: string;
  alertType: 'landslide_hazard' | 'severe_debris_flow' | 'slope_instability';
  title: string;
  message: string;
  status: AlertStatus;
  severity: AlertSeverity;
  locationName?: string;
  createdAt: string;
  acknowledgedAt?: string;
  acknowledgedBy?: string;
}

export interface ModelInfo {
  name: string;
  version: string;
  featureExtractor: string;
  classifier: string;
  preprocessing: string[];
  reportedAccuracy: number;
  inputDimensions: string;
  backboneLayers: number;
  totalParameters: string;
  gaborKernelsCount: number;
  datasetOrigin: string;
  trainingEpochs: number;
}

export interface AnalyticsData {
  totalAnalyzed: number;
  landslidesDetected: number;
  nonLandslides: number;
  averageConfidence: number;
  reportedAccuracy: number;
  predictionDistribution: { name: string; value: number; color: string }[];
  confidenceDistribution: { range: string; count: number; landslides: number }[];
  detectionTimeline: { date: string; landslide: number; nonLandslide: number }[];
  riskDistribution: { level: string; count: number; color: string }[];
  confusionMatrix: {
    truePositive: number;
    falsePositive: number;
    trueNegative: number;
    falseNegative: number;
  };
}

export interface PipelineStage {
  id: number;
  name: string;
  subhead: string;
  model: string;
  description: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  metricValue?: string;
}

export interface SatelliteSample {
  id: string;
  name: string;
  region: string;
  groundTruth: PredictionClass;
  description: string;
  elevation: string;
  coordinates: { lat: number; lng: number };
  imageDataUrl: string;
  sensor?: string;
  date?: string;
  resolution?: string;
}

export interface SatelliteSceneRecord {
  id: string; // e.g. "sample-01" through "sample-100"
  title: string;
  location: string;
  latitude: number | null;
  longitude: number | null;
  satelliteSource: 'Sentinel-2' | 'Landsat-8' | 'Landsat-9' | 'NASA Worldview' | 'PlanetScope';
  acquisitionDate: string | null;
  spatialResolution: string | null;
  imageUrl: string | null;
  thumbnailUrl: string | null;
  imageAssetId?: string | null;
  groundTruth: 'Landslide' | 'Stable' | 'Unknown';
  riskLevel: 'Critical' | 'High' | 'Moderate' | 'Low' | 'Unknown';
  ndvi: number | null;
  cloudCoverPercentage: number | null;
  dataSource: string;
  dataType: string;
  description: string;
  processingLevel?: string;
  elevation?: string;
  slopeGradient?: string;
  roadCorridor?: string;
  sdiIndex?: number | null;
  isDemonstration?: boolean;
}
