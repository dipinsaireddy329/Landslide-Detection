import { 
  User, 
  PredictionRecord, 
  PredictResponse, 
  AlertRecord, 
  AnalyticsData, 
  ModelInfo, 
  PredictionClass, 
  RiskLevel 
} from '../types';
import { 
  INITIAL_PREDICTIONS, 
  INITIAL_ALERTS, 
  INITIAL_ANALYTICS, 
  MODEL_METADATA,
  generateProceduralSatelliteImage,
  SATELLITE_SAMPLES
} from './sampleData';
import { analyzeSatelliteImage } from './imageAnalysis';

const STORAGE_KEYS = {
  PREDICTIONS: 'landslide_predictions_v2',
  ALERTS: 'landslide_alerts_v2',
  USER: 'landslide_auth_user',
  SETTINGS: 'landslide_app_settings'
};

// In-memory fallback if localStorage is partitioned or sandboxed in iframe
const memoryStore: Record<string, string> = {};

const safeStorage = {
  getItem: (key: string): string | null => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(key);
      }
    } catch {
      // Sandboxed iframe or quota exception
    }
    return memoryStore[key] || null;
  },
  setItem: (key: string, value: string): void => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, value);
      }
    } catch {
      // Sandboxed iframe or quota exception
    }
    memoryStore[key] = value;
  },
  removeItem: (key: string): void => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
      }
    } catch {}
    delete memoryStore[key];
  }
};

export interface AppSettings {
  backendMode: 'embedded_pipeline' | 'flask_rest_api';
  flaskApiUrl: string;
  confidenceThreshold: number; // e.g. 0.85
  autoAlertOnCritical: boolean;
}

// In Vercel / multi-service deployment, the backend is routed under /api or injected via BACKEND_URL
const getInitialBackendUrl = (): string => {
  // 1. Check if bound via Vercel service binding
  if (typeof process !== 'undefined' && process.env && process.env.BACKEND_URL) {
    return process.env.BACKEND_URL.replace(/\/$/, '');
  }
  // 2. Check if set via client Vite env
  if (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_BACKEND_URL) {
    return (import.meta as any).env.VITE_BACKEND_URL.replace(/\/$/, '');
  }
  // 3. In browser in production / Vercel preview, relative root routes directly to /api
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
    return '';
  }
  // 4. Default for standalone local dev
  return '';
};

const DEFAULT_SETTINGS: AppSettings = {
  backendMode: 'embedded_pipeline',
  flaskApiUrl: getInitialBackendUrl(),
  confidenceThreshold: 0.85,
  autoAlertOnCritical: true
};

class ApiService {
  private settings: AppSettings = DEFAULT_SETTINGS;
  private currentUser: User | null = null;
  private isBackendReachable: boolean = false;

  constructor() {
    this.loadFromStorage();
    this.checkFlaskHealth();
  }

  public getEndpointUrl(path: string): string {
    const base = (this.settings.flaskApiUrl || '').replace(/\/$/, '');
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    if (!base) {
      return cleanPath;
    }
    return `${base}${cleanPath}`;
  }

  private loadFromStorage() {
    // Load settings
    const savedSettings = safeStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (savedSettings) {
      try {
        this.settings = { ...DEFAULT_SETTINGS, ...JSON.parse(savedSettings) };
      } catch (e) {
        console.error('Failed to parse settings:', e);
      }
    }

    // Load user
    const savedUser = safeStorage.getItem(STORAGE_KEYS.USER);
    if (savedUser) {
      try {
        this.currentUser = JSON.parse(savedUser);
      } catch (e) {
        console.error('Failed to parse user:', e);
      }
    }

    // Ensure all 20 benchmark satellite samples have their dataUrl initialized
    SATELLITE_SAMPLES.forEach((sample) => {
      if (!sample.imageDataUrl || sample.imageDataUrl.length < 50) {
        sample.imageDataUrl = generateProceduralSatelliteImage(sample.id);
      }
    });

    // Initialize predictions & samples if not present
    const existingPredsRaw = safeStorage.getItem(STORAGE_KEYS.PREDICTIONS);
    if (!existingPredsRaw) {
      // Seed sample images with procedural canvas satellite data
      const sample1 = generateProceduralSatelliteImage('landslide_1');
      const sample2 = generateProceduralSatelliteImage('stable_1');
      const sample3 = generateProceduralSatelliteImage('landslide_2');
      const sample4 = generateProceduralSatelliteImage('stable_2');

      const seeded = INITIAL_PREDICTIONS.map((p, idx) => {
        let img = sample1;
        if (idx === 1) img = sample2;
        if (idx === 2) img = sample3;
        if (idx === 3) img = sample4;
        return { ...p, imageUrl: img, thumbnailUrl: img };
      });
      safeStorage.setItem(STORAGE_KEYS.PREDICTIONS, JSON.stringify(seeded));
    } else {
      // Ensure any existing stored predictions have valid image URLs
      try {
        const parsed = JSON.parse(existingPredsRaw);
        let updated = false;
        parsed.forEach((p: PredictionRecord, idx: number) => {
          if (!p.imageUrl || p.imageUrl.length < 50) {
            p.imageUrl = generateProceduralSatelliteImage(p.prediction === 'landslide' ? 'landslide_1' : 'stable_1');
            p.thumbnailUrl = p.imageUrl;
            updated = true;
          }
        });
        if (updated) {
          safeStorage.setItem(STORAGE_KEYS.PREDICTIONS, JSON.stringify(parsed));
        }
      } catch {}
    }

    // Initialize alerts
    if (!safeStorage.getItem(STORAGE_KEYS.ALERTS)) {
      safeStorage.setItem(STORAGE_KEYS.ALERTS, JSON.stringify(INITIAL_ALERTS));
    }
  }

  // Check Flask API connectivity
  public async checkFlaskHealth(): Promise<boolean> {
    if (typeof window === 'undefined') return false;
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1500);
      let res = await fetch(this.getEndpointUrl('/api/health'), {
        signal: controller.signal
      });
      if (!res.ok) {
        res = await fetch(this.getEndpointUrl('/api/model-info'), {
          signal: controller.signal
        });
      }
      clearTimeout(timeoutId);
      this.isBackendReachable = res.ok;
      return res.ok;
    } catch {
      this.isBackendReachable = false;
      return false;
    }
  }

  public getSettings(): AppSettings {
    return { ...this.settings };
  }

  public updateSettings(newSettings: Partial<AppSettings>) {
    this.settings = { ...this.settings, ...newSettings };
    safeStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(this.settings));
  }

  public isFlaskConnected(): boolean {
    return this.isBackendReachable;
  }

  // ===================== AUTHENTICATION =====================

  public async login(email: string, password: string): Promise<User> {
    if (!email || !password) throw new Error('Email and password are required');
    if (password.length < 6) throw new Error('Password must be at least 6 characters');

    // In connected Flask mode:
    if (this.settings.backendMode === 'flask_rest_api' && this.isBackendReachable) {
      try {
        const res = await fetch(this.getEndpointUrl('/api/auth/login'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Login failed');
        this.currentUser = data.user;
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(data.user));
        return data.user;
      } catch (err: any) {
        console.warn('Flask login failed, falling back to local session:', err.message);
      }
    }

    // Local authentication
    const user: User = {
      id: 'USR-' + Math.random().toString(36).substring(2, 9).toUpperCase(),
      name: email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      email,
      role: 'Geospatial Analyst',
      createdAt: new Date().toISOString()
    };
    this.currentUser = user;
    safeStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    return user;
  }

  public async register(name: string, email: string, password: string): Promise<User> {
    if (!name || !email || !password) throw new Error('All fields are required');
    if (password.length < 6) throw new Error('Password must be at least 6 characters');

    if (this.settings.backendMode === 'flask_rest_api' && this.isBackendReachable) {
      try {
        const res = await fetch(this.getEndpointUrl('/api/auth/register'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Registration failed');
        this.currentUser = data.user;
        safeStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(data.user));
        return data.user;
      } catch (err: any) {
        console.warn('Flask registration failed, falling back to local session:', err.message);
      }
    }

    const user: User = {
      id: 'USR-' + Math.random().toString(36).substring(2, 9).toUpperCase(),
      name,
      email,
      role: 'Geospatial Researcher',
      createdAt: new Date().toISOString()
    };
    this.currentUser = user;
    safeStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    return user;
  }

  public logout() {
    this.currentUser = null;
    safeStorage.removeItem(STORAGE_KEYS.USER);
  }

  public getCurrentUser(): User | null {
    return this.currentUser;
  }

  // ===================== PREDICTION PIPELINE =====================

  /**
   * POST /api/predict
   */
  public async predict(fileOrDataUrl: File | string, metadata?: { name?: string; location?: string }): Promise<{
    prediction: PredictionRecord;
    response: PredictResponse;
    vggHeatmap: string;
    gaborPreview: string;
  }> {
    const imageName = metadata?.name || (typeof fileOrDataUrl !== 'string' ? fileOrDataUrl.name : 'satellite_capture_' + Date.now() + '.png');
    const imageSize = typeof fileOrDataUrl !== 'string' ? fileOrDataUrl.size : Math.round(fileOrDataUrl.length * 0.75);

    // If configured to use Flask and backend is reachable:
    if (this.settings.backendMode === 'flask_rest_api' && this.isBackendReachable) {
      try {
        const formData = new FormData();
        if (typeof fileOrDataUrl === 'string') {
          // Convert dataUrl to blob
          const blob = await (await fetch(fileOrDataUrl)).blob();
          formData.append('image', blob, imageName);
        } else {
          formData.append('image', fileOrDataUrl);
        }
        formData.append('location', metadata?.location || 'Unspecified Sector');

        const res = await fetch(this.getEndpointUrl('/api/predict'), {
          method: 'POST',
          body: formData
        });
        if (res.ok) {
          const data = await res.json();
          // Map to prediction record
          const record: PredictionRecord = {
            id: data.imageId || 'PRED-' + Date.now().toString(36).toUpperCase(),
            userId: this.currentUser?.id,
            imageName,
            imageSize,
            imageUrl: typeof fileOrDataUrl === 'string' ? fileOrDataUrl : URL.createObjectURL(fileOrDataUrl),
            prediction: data.prediction,
            confidence: data.confidence,
            riskLevel: data.riskLevel,
            processingTime: data.processingTime,
            createdAt: new Date().toISOString(),
            status: 'completed',
            locationName: metadata?.location || 'Target Survey Region',
            features: data.features
          };
          this.savePrediction(record);
          if (record.prediction === 'landslide') {
            this.createAlertFromPrediction(record);
          }
          return {
            prediction: record,
            response: data,
            vggHeatmap: '',
            gaborPreview: ''
          };
        }
      } catch (e) {
        console.warn('Flask predict call failed, using embedded computer vision pipeline:', e);
      }
    }

    // Execute real client-side Gabor + VGG19 + ResNet101 pipeline
    const analysis = await analyzeSatelliteImage(fileOrDataUrl);

    let displayUrl = '';
    if (typeof fileOrDataUrl === 'string') {
      displayUrl = fileOrDataUrl;
    } else {
      displayUrl = URL.createObjectURL(fileOrDataUrl);
    }

    const newId = 'PRED-' + Math.floor(1000 + Math.random() * 9000);
    const record: PredictionRecord = {
      id: newId,
      userId: this.currentUser?.id,
      imageName,
      imageSize,
      imageUrl: displayUrl,
      thumbnailUrl: displayUrl,
      prediction: analysis.prediction,
      confidence: analysis.confidence,
      riskLevel: analysis.riskLevel,
      processingTime: analysis.processingTime,
      createdAt: new Date().toISOString(),
      status: 'completed',
      locationName: metadata?.location || 'Target Survey Grid',
      features: analysis.features
    };

    this.savePrediction(record);

    if (analysis.prediction === 'landslide') {
      this.createAlertFromPrediction(record);
    }

    const response: PredictResponse = {
      prediction: analysis.prediction,
      confidence: analysis.confidence,
      riskLevel: analysis.riskLevel,
      processingTime: analysis.processingTime,
      imageId: newId,
      features: analysis.features,
      timestamp: record.createdAt
    };

    return {
      prediction: record,
      response,
      vggHeatmap: analysis.vggActivationHeatmap,
      gaborPreview: analysis.gaborFilteredPreview
    };
  }

  // Save to SQLite/local database
  private savePrediction(record: PredictionRecord) {
    const existing = this.getPredictionsSync();
    const updated = [record, ...existing];
    safeStorage.setItem(STORAGE_KEYS.PREDICTIONS, JSON.stringify(updated));
  }

  private createAlertFromPrediction(record: PredictionRecord) {
    const alerts = this.getAlertsSync();
    const alertId = 'ALERT-' + Math.floor(100 + Math.random() * 900);
    const newAlert: AlertRecord = {
      id: alertId,
      predictionId: record.id,
      alertType: record.riskLevel === 'critical' ? 'severe_debris_flow' : 'landslide_hazard',
      title: record.riskLevel === 'critical' ? 'Critical Debris Avalanche Risk' : 'Landslide Instability Detected',
      message: `Satellite remote sensing analysis for ${record.imageName} detected geological displacement with ${(record.confidence * 100).toFixed(2)}% confidence.`,
      status: 'active',
      severity: record.riskLevel === 'critical' ? 'critical' : 'high',
      locationName: record.locationName,
      createdAt: new Date().toISOString()
    };
    const updated = [newAlert, ...alerts];
    safeStorage.setItem(STORAGE_KEYS.ALERTS, JSON.stringify(updated));
  }

  // ===================== PREDICTIONS LIST & GET =====================

  public async getPredictions(): Promise<PredictionRecord[]> {
    return this.getPredictionsSync();
  }

  private getPredictionsSync(): PredictionRecord[] {
    const raw = safeStorage.getItem(STORAGE_KEYS.PREDICTIONS);
    if (!raw) return INITIAL_PREDICTIONS;
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_PREDICTIONS;
    }
  }

  public async getPredictionById(id: string): Promise<PredictionRecord | null> {
    const list = this.getPredictionsSync();
    return list.find(p => p.id === id) || null;
  }

  // ===================== ALERTS =====================

  public async getAlerts(): Promise<AlertRecord[]> {
    return this.getAlertsSync();
  }

  private getAlertsSync(): AlertRecord[] {
    const raw = safeStorage.getItem(STORAGE_KEYS.ALERTS);
    if (!raw) return INITIAL_ALERTS;
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_ALERTS;
    }
  }

  public async acknowledgeAlert(alertId: string, acknowledgedBy?: string): Promise<boolean> {
    const alerts = this.getAlertsSync();
    const updated = alerts.map(a => {
      if (a.id === alertId) {
        return {
          ...a,
          status: 'acknowledged' as const,
          acknowledgedAt: new Date().toISOString(),
          acknowledgedBy: acknowledgedBy || this.currentUser?.name || 'Authorized Operator'
        };
      }
      return a;
    });
    safeStorage.setItem(STORAGE_KEYS.ALERTS, JSON.stringify(updated));
    return true;
  }

  // ===================== ANALYTICS =====================

  public async getAnalytics(): Promise<AnalyticsData> {
    const predictions = this.getPredictionsSync();
    if (!predictions.length) return INITIAL_ANALYTICS;

    const total = predictions.length;
    const landslides = predictions.filter(p => p.prediction === 'landslide').length;
    const nonLandslides = total - landslides;
    const avgConf = Number((predictions.reduce((acc, p) => acc + p.confidence, 0) / total * 100).toFixed(1));

    // Confidence ranges
    const ranges = [
      { range: '90 - 92%', count: 0, landslides: 0 },
      { range: '92 - 94%', count: 0, landslides: 0 },
      { range: '94 - 96%', count: 0, landslides: 0 },
      { range: '96 - 98%', count: 0, landslides: 0 },
      { range: '98 - 100%', count: 0, landslides: 0 }
    ];

    predictions.forEach(p => {
      const pct = p.confidence * 100;
      let idx = 2;
      if (pct < 92) idx = 0;
      else if (pct < 94) idx = 1;
      else if (pct < 96) idx = 2;
      else if (pct < 98) idx = 3;
      else idx = 4;

      ranges[idx].count++;
      if (p.prediction === 'landslide') {
        ranges[idx].landslides++;
      }
    });

    return {
      totalAnalyzed: total,
      landslidesDetected: landslides,
      nonLandslides: nonLandslides,
      averageConfidence: avgConf,
      reportedAccuracy: MODEL_METADATA.reportedAccuracy,
      predictionDistribution: [
        { name: 'Non-Landslide', value: nonLandslides, color: '#10B981' },
        { name: 'Landslide', value: landslides, color: '#EF4444' }
      ],
      confidenceDistribution: ranges,
      detectionTimeline: INITIAL_ANALYTICS.detectionTimeline,
      riskDistribution: [
        { level: 'Critical Risk', count: predictions.filter(p => p.riskLevel === 'critical').length, color: '#EF4444' },
        { level: 'High Risk', count: predictions.filter(p => p.riskLevel === 'high').length, color: '#F97316' },
        { level: 'Moderate Risk', count: predictions.filter(p => p.riskLevel === 'moderate').length, color: '#F59E0B' },
        { level: 'Low / Stable', count: predictions.filter(p => p.riskLevel === 'low').length, color: '#10B981' }
      ],
      confusionMatrix: INITIAL_ANALYTICS.confusionMatrix
    };
  }

  // ===================== MODEL INFO =====================

  public async getModelInfo(): Promise<ModelInfo> {
    return MODEL_METADATA;
  }

  // Reset demo data
  public resetDatabase() {
    safeStorage.removeItem(STORAGE_KEYS.PREDICTIONS);
    safeStorage.removeItem(STORAGE_KEYS.ALERTS);
    this.loadFromStorage();
  }
}

export const api = new ApiService();
