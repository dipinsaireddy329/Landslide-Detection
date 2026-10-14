import React, { useState } from 'react';
import { 
  X, 
  Lock, 
  Mail, 
  User as UserIcon, 
  AlertCircle, 
  CheckCircle, 
  ArrowRight, 
  Loader2, 
  Satellite, 
  ShieldCheck, 
  Compass, 
  ArrowLeft,
  KeyRound,
  Sparkles,
  Layers,
  Globe2
} from 'lucide-react';
import { api } from '../services/api';
import { User } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: User) => void;
  initialMode?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialMode = 'login'
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    // Form validations
    if (!email || !password) {
      setError('Please fill in all required credentials.');
      return;
    }

    if (!email.includes('@') || !email.includes('.')) {
      setError('Please provide a valid institutional email address.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (mode === 'register') {
      if (!name.trim()) {
        setError('Please enter your full name and title.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
    }

    setLoading(true);

    try {
      let user: User;
      if (mode === 'login') {
        user = await api.login(email, password);
        setSuccessMsg('Terminal session authenticated. Launching workspace...');
      } else {
        user = await api.register(name, email, password);
        setSuccessMsg('Researcher account registered successfully! Initializing node...');
      }

      setTimeout(() => {
        onSuccess(user);
        onClose();
      }, 700);
    } catch (err: any) {
      setError(err.message || 'Authentication error. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoFill = (type: 'analyst' | 'researcher') => {
    if (type === 'analyst') {
      setEmail('sarah.lin@geosurvey.org');
      setPassword('Landslide2026!');
      setName('Dr. Sarah Lin (Lead Geospatial Scientist)');
    } else {
      setEmail('alex.chen@earth-obs.edu');
      setPassword('EarthAI2026#');
      setName('Alex Chen (Remote Sensing Researcher)');
    }
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-between bg-slate-950 text-slate-100 overflow-y-auto selection:bg-sky-500 selection:text-white">
      
      {/* Background GIS & Remote-Sensing Aesthetic Grids (Completely hides underlying website) */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Subtle radial glows */}
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-sky-600/10 rounded-full blur-[140px]" />
        <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] bg-emerald-600/10 rounded-full blur-[140px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-900/10 rounded-full blur-[180px]" />

        {/* High-tech geospatial grid overlay */}
        <div className="absolute inset-0 bg-geo-grid opacity-15" />

        {/* Faint geodetic coordinate crosshairs & telemetry markings */}
        <div className="hidden lg:block absolute top-24 left-10 text-[10px] font-mono text-slate-600/60 leading-relaxed select-none">
          <div>LAT: 13.6748° N · LON: 79.3512° E</div>
          <div>CRS: WGS 84 / UTM ZONE 44N (EPSG:32644)</div>
          <div>SESHACHALAM ESCARPMENT · KM 14.2 GHAT CORRIDOR</div>
          <div className="mt-2 text-sky-500/40">● SENTINEL-2B MSI (ORBIT R019) INGEST NODE</div>
        </div>

        <div className="hidden lg:block absolute bottom-16 left-10 text-[10px] font-mono text-slate-600/60 leading-relaxed select-none">
          <div>RAD: [0, 10000] BOA SURFACE REFLECTANCE</div>
          <div>BAND RATIO: NIR (B08) / RED (B04) · CALIBRATED NDVI</div>
          <div>GABOR FILTER BANK: θ ∈ &#123;0°, 45°, 90°, 135°&#125;</div>
        </div>

        <div className="hidden lg:block absolute top-24 right-10 text-[10px] font-mono text-slate-600/60 text-right leading-relaxed select-none">
          <div>LAT: 30.7346° N · LON: 79.0669° E</div>
          <div>MANDAKINI RIVER BASIN · GARHWAL HIMALAYAS</div>
          <div>GSI VERIFIED SCARP REFERENCE REPOSITORY</div>
          <div className="mt-2 text-emerald-500/40">● USGS LANDSAT-9 OLI-2 SYNCED</div>
        </div>

        <div className="hidden lg:block absolute bottom-16 right-10 text-[10px] font-mono text-slate-600/60 text-right leading-relaxed select-none">
          <div>BACKBONE: VGG19 CONV5_3 FEATURE MAPS</div>
          <div>CLASSIFIER: RESNET101 RESIDUAL DENSE STACK</div>
          <div>STATUS: AUTHORIZED RESEARCHER INGEST ONLY</div>
        </div>
      </div>

      {/* Top Navigation Bar */}
      <header className="relative z-10 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md px-4 sm:px-8 py-3.5 flex items-center justify-between">
        
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 text-white shadow-md shadow-sky-500/20">
            <Satellite className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm tracking-tight text-white font-mono">
                LandslideAI
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-sky-950/80 border border-sky-800/80 px-2 py-0.5 text-[10px] font-mono font-medium text-sky-400">
                <span className="h-1.5 w-1.5 rounded-full bg-sky-400 animate-pulse" />
                GhatGuard AI
              </span>
            </div>
            <div className="text-[10px] font-mono text-slate-400">
              Copernicus Sentinel-2 & USGS Landsat Operational Ingest Portal
            </div>
          </div>
        </div>

        {/* Exit / Return to Public View */}
        <button
          onClick={onClose}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg border border-slate-700/80 bg-slate-900/90 hover:bg-slate-800 text-xs font-mono font-semibold text-slate-300 hover:text-white transition-all cursor-pointer shadow-sm hover:border-slate-600"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Return to Dashboard</span>
        </button>

      </header>

      {/* Main Authentication Centered Viewport */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6 my-auto">
        
        <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900/90 backdrop-blur-xl p-6 sm:p-8 shadow-2xl shadow-black/80">
          
          {/* Header Badge & Title */}
          <div className="text-center">
            
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-950/70 border border-sky-800/60 text-sky-400 text-xs font-mono mb-3">
              <ShieldCheck className="h-3.5 w-3.5 text-sky-400" />
              <span>TLS 1.3 · Secure Researcher Terminal</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              {mode === 'login' ? 'Researcher Login' : 'Create Researcher Account'}
            </h1>
            
            <p className="mt-2 text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
              {mode === 'login' 
                ? 'Sign in to access real-time satellite inference, Gabor texture energy extraction, and disaster dispatch consoles.'
                : 'Register institutional credentials to log disaster observations and submit ground-truth satellite scarp surveys.'}
            </p>
          </div>

          {/* Quick Demo Credentials Bar */}
          {mode === 'login' && (
            <div className="mt-5 p-3 rounded-xl bg-slate-950/70 border border-slate-800/90">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5 font-medium">
                  <KeyRound className="h-3.5 w-3.5 text-sky-400" />
                  <span>Demo Evaluation Profiles:</span>
                </span>
                <span className="text-[10px] font-mono text-slate-500">1-Click Auto-Fill</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickDemoFill('analyst')}
                  className="py-1.5 px-2.5 rounded-lg text-left text-xs bg-slate-900 hover:bg-slate-800/90 border border-slate-700/70 text-slate-200 transition-all cursor-pointer truncate hover:border-sky-500/50"
                >
                  <div className="font-semibold text-sky-400 text-[11px] truncate">Dr. Sarah Lin</div>
                  <div className="text-[10px] text-slate-400 font-mono truncate">Lead Geospatial Analyst</div>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemoFill('researcher')}
                  className="py-1.5 px-2.5 rounded-lg text-left text-xs bg-slate-900 hover:bg-slate-800/90 border border-slate-700/70 text-slate-200 transition-all cursor-pointer truncate hover:border-emerald-500/50"
                >
                  <div className="font-semibold text-emerald-400 text-[11px] truncate">Alex Chen</div>
                  <div className="text-[10px] text-slate-400 font-mono truncate">Remote Sensing Researcher</div>
                </button>
              </div>
            </div>
          )}

          {/* Error Banner */}
          {error && (
            <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-rose-800/60 bg-rose-950/50 p-3 text-xs text-rose-300">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-rose-400" />
              <div className="leading-relaxed">{error}</div>
            </div>
          )}

          {/* Success Banner */}
          {successMsg && (
            <div className="mt-4 flex items-center gap-2.5 rounded-xl border border-emerald-800/60 bg-emerald-950/50 p-3 text-xs text-emerald-300 font-medium">
              <CheckCircle className="h-4 w-4 shrink-0 text-emerald-400" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-medium text-slate-300">
                  Full Name & Academic Title
                </label>
                <div className="relative mt-1.5">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                    <UserIcon className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Dr. Sarah Lin, Senior Remote Sensing Analyst"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950/80 py-2.5 pl-10 pr-3.5 text-xs text-white placeholder-slate-500 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 font-medium transition-colors"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-300">
                Institutional / Organization Email
              </label>
              <div className="relative mt-1.5">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="analyst@geosurvey.org"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950/80 py-2.5 pl-10 pr-3.5 text-xs text-white placeholder-slate-500 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 font-medium transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="block text-xs font-medium text-slate-300">
                  Password
                </label>
                <span className="text-[10px] font-mono text-slate-500">Min. 6 characters</span>
              </div>
              <div className="relative mt-1.5">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950/80 py-2.5 pl-10 pr-3.5 text-xs text-white placeholder-slate-500 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 font-medium transition-colors"
                />
              </div>
            </div>

            {mode === 'register' && (
              <div>
                <label className="block text-xs font-medium text-slate-300">
                  Confirm Password
                </label>
                <div className="relative mt-1.5">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950/80 py-2.5 pl-10 pr-3.5 text-xs text-white placeholder-slate-500 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 font-medium transition-colors"
                  />
                </div>
              </div>
            )}

            {mode === 'login' && (
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 text-slate-400 hover:text-slate-300 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-slate-700 bg-slate-950 text-sky-500 focus:ring-sky-500/20"
                  />
                  <span>Persist secure session credentials</span>
                </label>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-600/25 transition-all disabled:opacity-50 cursor-pointer active:scale-99"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-white" />
                  <span>Connecting to Geospatial Inference Node...</span>
                </>
              ) : (
                <>
                  <span>{mode === 'login' ? 'Authenticate Session & Enter Workspace' : 'Register Researcher Credentials'}</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Toggle mode */}
          <div className="mt-6 border-t border-slate-800 pt-4 text-center text-xs text-slate-400">
            {mode === 'login' ? (
              <span>
                Need an institutional research profile?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('register'); setError(null); }}
                  className="font-semibold text-sky-400 hover:text-sky-300 ml-1 cursor-pointer underline underline-offset-2"
                >
                  Register new account
                </button>
              </span>
            ) : (
              <span>
                Already have researcher credentials?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('login'); setError(null); }}
                  className="font-semibold text-sky-400 hover:text-sky-300 ml-1 cursor-pointer underline underline-offset-2"
                >
                  Sign in to workspace
                </button>
              </span>
            )}
          </div>

          {/* Security Disclaimer */}
          <div className="mt-4 pt-3 border-t border-slate-800/60 text-center">
            <span className="text-[10px] font-mono text-slate-500">
              Copernicus Data Space Ecosystem & USGS EarthExplorer Authenticated Node · Dual-Constellation Ingest
            </span>
          </div>

        </div>

      </main>

      {/* Bottom Status Footer */}
      <footer className="relative z-10 border-t border-slate-800/80 bg-slate-950/80 backdrop-blur-md px-4 sm:px-8 py-3 text-xs text-slate-500 font-mono flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-[11px]">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>VGG19 Feature Extractor + Gabor Filter Bank + ResNet101 Engine Online</span>
        </div>
        <div className="flex items-center gap-4 text-[10px] text-slate-400">
          <span>Tirumala Ghat Roads · Western Ghats · Himalayas</span>
          <span>·</span>
          <span>96.58% Reported Model Accuracy</span>
        </div>
      </footer>

    </div>
  );
};
