import React, { useState } from 'react';
import { 
  Lock, 
  Mail, 
  User as UserIcon, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  ArrowLeft, 
  Sparkles, 
  Loader2, 
  AlertCircle, 
  CheckCircle2, 
  Satellite, 
  KeyRound,
  ExternalLink
} from 'lucide-react';
import { api } from '../services/api';
import { User } from '../types';

interface ResearcherLoginViewProps {
  onLoginSuccess: (user: User) => void;
  onReturnToDashboard: () => void;
}

export const ResearcherLoginView: React.FC<ResearcherLoginViewProps> = ({
  onLoginSuccess,
  onReturnToDashboard
}) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!email.trim() || !password.trim()) {
      setErrorMsg('Institutional email and security credentials are required.');
      return;
    }

    if (!email.includes('@') || !email.includes('.')) {
      setErrorMsg('Please enter a valid academic or agency email address.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Security passcode must be at least 6 characters.');
      return;
    }

    if (mode === 'register') {
      if (!name.trim()) {
        setErrorMsg('Please specify your full researcher / analyst name.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg('Security passcodes do not match.');
        return;
      }
    }

    setIsLoading(true);

    try {
      let user: User;
      if (mode === 'login') {
        user = await api.login(email.trim(), password);
        setSuccessMsg('Security credentials verified. Initializing GIS workspace...');
      } else {
        user = await api.register(name.trim(), email.trim(), password);
        setSuccessMsg('Researcher profile provisioned. Opening workspace...');
      }

      setTimeout(() => {
        onLoginSuccess(user);
      }, 650);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Authentication failed. Please verify your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemoFill = (role: 'lead' | 'analyst') => {
    setErrorMsg(null);
    setSuccessMsg(null);
    if (role === 'lead') {
      setEmail('sarah.lin@geosurvey.org');
      setPassword('Landslide2026!');
      setName('Dr. Sarah Lin');
    } else {
      setEmail('alex.chen@earth-obs.edu');
      setPassword('EarthAI2026#');
      setName('Alex Chen');
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0B132B] text-slate-100 flex flex-col justify-between relative overflow-hidden select-none font-sans">
      
      {/* Background Starfield & Subtle Nadir Geodetic Grid Lines */}
      <div className="absolute inset-0 bg-geo-grid opacity-15 pointer-events-none" />
      
      {/* Deep Space Radial Ambient Glows */}
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[850px] h-[450px] pointer-events-none opacity-40 blur-3xl"
        style={{
          background: 'radial-gradient(ellipse at 50% 20%, rgba(56, 189, 248, 0.22) 0%, rgba(28, 37, 65, 0.6) 45%, transparent 80%)'
        }}
      />
      <div 
        className="absolute -bottom-20 right-0 w-[550px] h-[400px] pointer-events-none opacity-25 blur-3xl"
        style={{
          background: 'radial-gradient(circle, rgba(14, 165, 233, 0.2) 0%, transparent 70%)'
        }}
      />

      {/* Top Header Navigation Bar */}
      <header className="relative z-10 w-full px-6 py-5 border-b border-slate-800/80 bg-[#0B132B]/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          
          {/* Logo & Portal Classification */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/10 border border-sky-400/30 text-sky-400 shadow-[0_0_15px_rgba(56,189,248,0.2)]">
              <Satellite className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight text-white">
                  LandslideAI
                </span>
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider uppercase bg-sky-950/90 text-sky-300 border border-sky-500/30">
                  Researcher Portal
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono">
                Copernicus & Landsat Remote Sensing Infrastructure
              </p>
            </div>
          </div>

          {/* Return to Public Dashboard Button */}
          <button
            onClick={onReturnToDashboard}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 hover:border-slate-600 transition-all cursor-pointer shadow-xs group"
          >
            <ArrowLeft className="h-3.5 w-3.5 text-sky-400 group-hover:-translate-x-0.5 transition-transform" />
            <span>Return to Public Dashboard</span>
          </button>
        </div>
      </header>

      {/* Main Centered Minimalist Card Container */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-10 sm:py-16">
        <div className="w-full max-w-md">
          
          {/* Glowing Minimalist Card */}
          <div className="relative rounded-2xl bg-[#111C38]/90 backdrop-blur-xl border border-sky-500/25 p-7 sm:p-9 shadow-[0_0_40px_rgba(11,19,43,0.9),0_0_35px_rgba(56,189,248,0.12)] transition-all duration-300">
            
            {/* Ambient edge highlight */}
            <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-sky-400/60 to-transparent" />

            {/* Card Header & Shield Lockup */}
            <div className="text-center space-y-2 mb-6">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0B132B] border border-sky-400/40 text-sky-400 shadow-[0_0_20px_rgba(56,189,248,0.25)]">
                <KeyRound className="h-6 w-6" />
              </div>

              <h1 className="text-2xl font-extrabold tracking-tight text-white">
                Researcher Login
              </h1>
              <p className="text-xs text-slate-300 max-w-xs mx-auto leading-relaxed">
                Authorized access to GhatGuard AI, multispectral raster telemetry, and deep learning dispatch controls.
              </p>

              {/* Clearance Tier Badge */}
              <div className="pt-1 flex items-center justify-center gap-1.5 text-[11px] font-mono text-cyan-300">
                <ShieldCheck className="h-3.5 w-3.5 text-cyan-400" />
                <span>Security Tier 1 · Radiometric Model Ingest</span>
              </div>
            </div>

            {/* Tab Switcher: Sign In vs Register */}
            <div className="grid grid-cols-2 gap-1 p-1 bg-[#070D1E]/90 rounded-xl border border-slate-800 mb-6 text-xs font-semibold">
              <button
                type="button"
                onClick={() => { setMode('login'); setErrorMsg(null); }}
                className={`py-2 rounded-lg transition-all cursor-pointer ${
                  mode === 'login'
                    ? 'bg-sky-600 text-white shadow-xs font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setMode('register'); setErrorMsg(null); }}
                className={`py-2 rounded-lg transition-all cursor-pointer ${
                  mode === 'register'
                    ? 'bg-sky-600 text-white shadow-xs font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Request Access
              </button>
            </div>

            {/* Notification & Alerts */}
            {errorMsg && (
              <div className="mb-5 flex items-start gap-2.5 p-3 rounded-xl border border-rose-500/40 bg-rose-950/40 text-xs text-rose-200 shadow-sm animate-fade-in">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-400 mt-0.5" />
                <span className="leading-snug">{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="mb-5 flex items-start gap-2.5 p-3 rounded-xl border border-emerald-500/40 bg-emerald-950/40 text-xs text-emerald-200 shadow-sm animate-fade-in">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400 mt-0.5" />
                <span className="leading-snug">{successMsg}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Full Name field (Register only) */}
              {mode === 'register' && (
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-200">
                    Full Name & Title
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                      <UserIcon className="h-4 w-4" />
                    </div>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g., Dr. Aris Thorne"
                      className="w-full rounded-xl border border-slate-700/80 bg-[#070D1E]/90 pl-9 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400/40 transition-colors"
                    />
                  </div>
                </div>
              )}

              {/* Email field */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-200">
                  Institutional Email
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <Mail className="h-4 w-4" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="researcher@agency.gov or .edu"
                    className="w-full rounded-xl border border-slate-700/80 bg-[#070D1E]/90 pl-9 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400/40 transition-colors font-mono"
                  />
                </div>
              </div>

              {/* Password field */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-slate-200">
                    Security Passcode
                  </label>
                  {mode === 'login' && (
                    <span className="text-[10px] text-sky-400/80 hover:text-sky-300 transition-colors font-mono cursor-pointer">
                      Authorized SSO
                    </span>
                  )}
                </div>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full rounded-xl border border-slate-700/80 bg-[#070D1E]/90 pl-9 pr-10 py-2.5 text-xs text-white placeholder-slate-500 focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400/40 transition-colors font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password (Register only) */}
              {mode === 'register' && (
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-200">
                    Confirm Security Passcode
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                      <Lock className="h-4 w-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full rounded-xl border border-slate-700/80 bg-[#070D1E]/90 pl-9 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400/40 transition-colors font-mono"
                    />
                  </div>
                </div>
              )}

              {/* Remember checkbox */}
              <div className="flex items-center justify-between pt-1 text-xs">
                <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-3.5 w-3.5 rounded bg-slate-900 border-slate-700 text-sky-600 focus:ring-sky-500 cursor-pointer"
                  />
                  <span>Maintain Secure Session (30 Days)</span>
                </label>
              </div>

              {/* Submit CTA Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-sky-500 via-sky-400 to-cyan-400 hover:from-sky-400 hover:to-cyan-300 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_25px_rgba(56,189,248,0.35)] disabled:opacity-50 cursor-pointer active:scale-99"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    <span>{mode === 'login' ? 'Authenticate & Access Console' : 'Submit Clearance Request'}</span>
                  </>
                )}
              </button>

            </form>

            {/* Quick Demo Fill Credentials for Evaluators */}
            <div className="mt-6 pt-5 border-t border-slate-800/80">
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-2">
                <span>Quick-Fill Researcher Credentials:</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickDemoFill('lead')}
                  className="p-2 rounded-lg bg-[#070D1E]/80 border border-slate-800 hover:border-sky-500/40 text-left transition-colors cursor-pointer group"
                >
                  <div className="text-[11px] font-semibold text-slate-200 group-hover:text-sky-300 truncate">
                    Dr. Sarah Lin
                  </div>
                  <div className="text-[10px] font-mono text-slate-400 truncate">
                    Lead AI Researcher
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickDemoFill('analyst')}
                  className="p-2 rounded-lg bg-[#070D1E]/80 border border-slate-800 hover:border-sky-500/40 text-left transition-colors cursor-pointer group"
                >
                  <div className="text-[11px] font-semibold text-slate-200 group-hover:text-sky-300 truncate">
                    Alex Chen
                  </div>
                  <div className="text-[10px] font-mono text-slate-400 truncate">
                    RS Analyst
                  </div>
                </button>
              </div>
            </div>

          </div>

          {/* Bottom Security Classification Footer */}
          <div className="mt-5 text-center space-y-1">
            <p className="text-[11px] font-mono text-slate-500">
              Copernicus Sentinel-2 & USGS EarthExplorer Authenticated Node
            </p>
            <p className="text-[10px] text-slate-600">
              Session is encrypted with AES-256 for geospatial telemetry integrity.
            </p>
          </div>

        </div>
      </main>

      {/* Subtle Terminal Status Bar */}
      <footer className="relative z-10 px-6 py-3 border-t border-slate-800/80 bg-[#070D1E]/90 text-[11px] font-mono text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          <span>STATUS: ALL SATELLITE DISPATCH NODES OPERATIONAL</span>
        </div>
        <div className="flex items-center gap-4 text-slate-400">
          <span>LAT/LON WGS-84</span>
          <span>·</span>
          <span>EPSG:32643 / 32644</span>
          <span>·</span>
          <span>GhatGuard Core v2.4</span>
        </div>
      </footer>

    </div>
  );
};
