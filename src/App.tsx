import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { LandingPage } from './components/LandingPage';
import { DashboardOverview } from './components/DashboardOverview';
import { DetectLandslideView } from './components/DetectLandslideView';
import { PredictionHistoryView } from './components/PredictionHistoryView';
import { AnalyticsView } from './components/AnalyticsView';
import { AlertsView } from './components/AlertsView';
import { AboutModelView } from './components/AboutModelView';
import { SystemArchitectureView } from './components/SystemArchitectureView';
import { SystemTestingView } from './components/SystemTestingView';
import { AboutProjectView } from './components/AboutProjectView';
import { SettingsView } from './components/SettingsView';
import { AuthModal } from './components/AuthModal';
import { TirupatiSevenHillsBackground } from './components/TirupatiSevenHillsBackground';
import { MoreVertical } from 'lucide-react';

import { api } from './services/api';
import { User, PredictionRecord, AlertRecord, AnalyticsData } from './types';
import { INITIAL_ANALYTICS } from './services/sampleData';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeView, setActiveView] = useState<string>('dashboard');
  const [predictions, setPredictions] = useState<PredictionRecord[]>([]);
  const [alerts, setAlerts] = useState<AlertRecord[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData>(INITIAL_ANALYTICS);
  const [isFlaskConnected, setIsFlaskConnected] = useState(false);
  
  // UI states
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [activeInspectPrediction, setActiveInspectPrediction] = useState<PredictionRecord | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Initial data load
  useEffect(() => {
    loadAppState().catch((err) => {
      console.warn('Initial app state loading notice:', err);
    });
    
    // Check Flask API connectivity safely
    api.checkFlaskHealth()
      .then(setIsFlaskConnected)
      .catch(() => setIsFlaskConnected(false));
  }, []);

  const loadAppState = async () => {
    try {
      const user = api.getCurrentUser();
      setCurrentUser(user);

      const [predList, alertList, analyticsData] = await Promise.all([
        api.getPredictions(),
        api.getAlerts(),
        api.getAnalytics()
      ]);

      setPredictions(predList);
      setAlerts(alertList);
      setAnalytics(analyticsData);
    } catch (e) {
      console.warn('Error loading app state:', e);
    }
  };

  const handleNavigate = (view: string) => {
    setActiveView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectPredictionToInspect = (pred: PredictionRecord) => {
    setActiveInspectPrediction(pred);
    setActiveView('detect');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePredictionComplete = async (newPred: PredictionRecord) => {
    await loadAppState();
  };

  const handleAcknowledgeAlert = async (alertId: string) => {
    await api.acknowledgeAlert(alertId, currentUser?.name);
    const updatedAlerts = await api.getAlerts();
    setAlerts(updatedAlerts);
  };

  const handleViewAnalysisFromAlert = async (predictionId: string) => {
    const pred = await api.getPredictionById(predictionId);
    if (pred) {
      handleSelectPredictionToInspect(pred);
    } else {
      setActiveView('detect');
    }
  };

  const handleLogout = () => {
    api.logout();
    setCurrentUser(null);
    setActiveView('dashboard');
  };

  const handleResetDatabase = async () => {
    api.resetDatabase();
    await loadAppState();
    showToast('Benchmark sample dataset has been reset.');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans">
      
      {/* Top Bar Navigation */}
      <Navbar
        currentUser={currentUser}
        activeView={activeView}
        onNavigate={handleNavigate}
        onOpenAuth={() => setAuthModalOpen(true)}
        onLogout={handleLogout}
        alerts={alerts}
        isFlaskConnected={isFlaskConnected}
        mobileMenuOpen={mobileMenuOpen}
        onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
        isSidebarCollapsed={sidebarCollapsed}
        onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Workspace Frame */}
      {activeView === 'landing' ? (
        <main className="flex-1">
          <LandingPage
            onStartAnalysis={() => handleNavigate('detect')}
            onExploreTech={() => handleNavigate('about-model')}
            onOpenLogin={() => setAuthModalOpen(true)}
          />
        </main>
      ) : (
        <div className="flex-1 flex max-w-7xl w-full mx-auto relative">
          
          {/* Floating 3-dots button to uncollapse/open left sidebar when closed */}
          {sidebarCollapsed && (
            <button
              onClick={() => setSidebarCollapsed(false)}
              className="fixed left-3 top-20 z-30 flex items-center gap-2 px-3 py-2 rounded-xl bg-white/95 border border-slate-200/90 shadow-lg text-xs font-semibold text-slate-800 hover:text-sky-700 hover:bg-sky-50 hover:border-sky-300 transition-all cursor-pointer backdrop-blur-md animate-fade-in group"
              title="Open left sidebar (3 dots)"
              aria-label="Open left sidebar (3 dots)"
            >
              <MoreVertical className="h-4 w-4 text-sky-600 group-hover:scale-110 transition-transform" />
              <span className="font-mono text-[11px] text-slate-600 group-hover:text-sky-700">Open Menu</span>
            </button>
          )}

          {/* Responsive Sidebar */}
          <Sidebar
            activeView={activeView}
            onNavigate={handleNavigate}
            alerts={alerts}
            isMobileOpen={mobileMenuOpen}
            onCloseMobile={() => setMobileMenuOpen(false)}
            isCollapsed={sidebarCollapsed}
            onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          />

          {/* Center Dynamic Content Area */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden min-w-0">
            {activeView === 'dashboard' && (
              <DashboardOverview
                analytics={analytics}
                recentPredictions={predictions}
                activeAlerts={alerts.filter(a => a.status === 'active')}
                onNavigate={handleNavigate}
                onSelectPrediction={handleSelectPredictionToInspect}
              />
            )}

            {activeView === 'detect' && (
              <DetectLandslideView
                onPredictionComplete={handlePredictionComplete}
                activeInspectPrediction={activeInspectPrediction}
                onClearInspect={() => setActiveInspectPrediction(null)}
              />
            )}

            {activeView === 'history' && (
              <PredictionHistoryView
                predictions={predictions}
                onSelectPrediction={handleSelectPredictionToInspect}
                onNavigateDetect={() => {
                  setActiveInspectPrediction(null);
                  setActiveView('detect');
                }}
              />
            )}

            {activeView === 'analytics' && (
              <AnalyticsView analytics={analytics} />
            )}

            {activeView === 'alerts' && (
              <AlertsView
                alerts={alerts}
                onAcknowledgeAlert={handleAcknowledgeAlert}
                onViewAnalysis={handleViewAnalysisFromAlert}
              />
            )}

            {activeView === 'about-model' && (
              <AboutModelView />
            )}

            {activeView === 'architecture' && (
              <SystemArchitectureView />
            )}

            {activeView === 'testing' && (
              <SystemTestingView />
            )}

            {activeView === 'about-project' && (
              <AboutProjectView />
            )}

            {activeView === 'settings' && (
              <SettingsView
                onSettingsChanged={loadAppState}
                onResetDatabase={handleResetDatabase}
              />
            )}
          </main>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-200/80 bg-white py-6 px-4 text-center text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            Landslide Detection from Satellite Imagery · Novel Deep Learning Approach
          </div>
          <div className="flex items-center gap-4 text-slate-600">
            <button 
              onClick={() => handleNavigate('about-project')} 
              className="hover:text-sky-700 transition-colors cursor-pointer"
            >
              Academic Spec
            </button>
            <span>·</span>
            <button 
              onClick={() => handleNavigate('architecture')} 
              className="hover:text-sky-700 transition-colors cursor-pointer"
            >
              System Architecture
            </button>
            <span>·</span>
            <button 
              onClick={() => handleNavigate('testing')} 
              className="hover:text-sky-700 transition-colors cursor-pointer"
            >
              Testing Suite
            </button>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={(user) => {
          setCurrentUser(user);
          loadAppState();
        }}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl bg-slate-900 text-white px-4 py-3 text-xs font-semibold shadow-xl border border-slate-700 animate-fade-in">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Subtle Tirupati Seven Hills Silhouette Vector Background (8-12% opacity) */}
      <TirupatiSevenHillsBackground
        variant="dashboard"
        className="fixed bottom-0 left-0 right-0 h-[220px] sm:h-[280px] pointer-events-none z-0"
        opacity={activeView === 'landing' ? 0 : 0.08}
      />

    </div>
  );
}
