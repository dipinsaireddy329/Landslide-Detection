import React from 'react';
import { 
  Satellite, 
  Bell, 
  User as UserIcon, 
  LogOut, 
  Menu, 
  X,
  Server,
  ShieldAlert,
  MoreVertical
} from 'lucide-react';
import { User, AlertRecord } from '../types';

interface NavbarProps {
  currentUser: User | null;
  activeView: string;
  onNavigate: (view: string) => void;
  onOpenAuth: () => void;
  onLogout: () => void;
  alerts: AlertRecord[];
  isFlaskConnected: boolean;
  mobileMenuOpen: boolean;
  onToggleMobileMenu: () => void;
  isSidebarCollapsed?: boolean;
  onToggleSidebar?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  activeView,
  onNavigate,
  onOpenAuth,
  onLogout,
  alerts,
  isFlaskConnected,
  mobileMenuOpen,
  onToggleMobileMenu,
  isSidebarCollapsed = false,
  onToggleSidebar
}) => {
  const activeAlertsCount = alerts.filter(a => a.status === 'active').length;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md transition-colors">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Zone 1: Brand Wordmark & 3-dots sidebar close/toggle button */}
        <div className="flex items-center gap-2.5">
          {/* 3 dots button to close/open left side navigation */}
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className={`flex h-9 w-9 items-center justify-center rounded-lg border transition-all cursor-pointer ${
                isSidebarCollapsed
                  ? 'border-sky-300 bg-sky-50 text-sky-700 shadow-xs'
                  : 'border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }`}
              title={isSidebarCollapsed ? "Open left sidebar (3 dots)" : "Close left sidebar (3 dots)"}
              aria-label="Toggle left sidebar (3 dots)"
            >
              <MoreVertical className="h-4 w-4" />
            </button>
          )}

          <button 
            onClick={() => onNavigate('dashboard')} 
            className="flex items-center gap-2.5 text-left group cursor-pointer"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-50 border border-sky-200 text-sky-700 group-hover:border-sky-400 group-hover:bg-sky-100 transition-colors shadow-xs">
              <Satellite className="h-5 w-5" />
            </div>
            <span className="text-base font-bold tracking-tight text-slate-900 group-hover:text-sky-700 transition-colors">
              LandslideAI
            </span>
          </button>
        </div>

        {/* Zone 2: 4-6 Clean Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <button
            onClick={() => onNavigate('dashboard')}
            className={`hover:text-slate-900 transition-colors whitespace-nowrap cursor-pointer ${
              activeView === 'dashboard' ? 'text-sky-700 font-semibold' : ''
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => onNavigate('detect')}
            className={`hover:text-slate-900 transition-colors whitespace-nowrap cursor-pointer ${
              activeView === 'detect' ? 'text-sky-700 font-semibold' : ''
            }`}
          >
            Detect Landslide
          </button>
          <button
            onClick={() => onNavigate('history')}
            className={`hover:text-slate-900 transition-colors whitespace-nowrap cursor-pointer ${
              activeView === 'history' ? 'text-sky-700 font-semibold' : ''
            }`}
          >
            History
          </button>
          <button
            onClick={() => onNavigate('analytics')}
            className={`hover:text-slate-900 transition-colors whitespace-nowrap cursor-pointer ${
              activeView === 'analytics' ? 'text-sky-700 font-semibold' : ''
            }`}
          >
            Analytics
          </button>
          <button
            onClick={() => onNavigate('architecture')}
            className={`hover:text-slate-900 transition-colors whitespace-nowrap cursor-pointer ${
              activeView === 'architecture' ? 'text-sky-700 font-semibold' : ''
            }`}
          >
            Architecture
          </button>
          <button
            onClick={() => onNavigate('about-project')}
            className={`hover:text-slate-900 transition-colors whitespace-nowrap cursor-pointer ${
              activeView === 'about-project' ? 'text-sky-700 font-semibold' : ''
            }`}
          >
            Research
          </button>
        </nav>

        {/* Zone 3: Actions & Status */}
        <div className="flex items-center gap-3">
          {/* Backend Status indicator */}
          <div className="hidden xl:flex items-center gap-2 text-xs font-mono text-slate-600 px-2.5 py-1 rounded-md bg-slate-50 border border-slate-200">
            <span 
              className={`h-2 w-2 rounded-full ${isFlaskConnected ? 'bg-emerald-500 animate-pulse' : 'bg-sky-500'}`} 
              aria-hidden="true" 
            />
            <span className="text-[11px] font-medium tracking-tight">
              {isFlaskConnected ? 'FLASK LIVE' : 'AI PIPELINE ACTIVE'}
            </span>
          </div>

          {/* Alerts quick button */}
          <button
            onClick={() => onNavigate('alerts')}
            className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 hover:text-slate-900 hover:border-slate-300 hover:bg-slate-50 transition-colors cursor-pointer shadow-xs"
            title="Active Hazard Alerts"
          >
            <Bell className="h-4 w-4" />
            {activeAlertsCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[10px] font-bold text-white font-mono shadow-xs">
                {activeAlertsCount}
              </span>
            )}
          </button>

          {/* User profile / Auth */}
          {currentUser ? (
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-xs font-semibold text-slate-900 truncate max-w-[120px]">
                  {currentUser.name}
                </span>
                <span className="text-[11px] text-slate-500 font-mono">
                  {currentUser.role || 'Analyst'}
                </span>
              </div>
              <button
                onClick={onLogout}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50 transition-colors cursor-pointer shadow-xs"
                title="Sign Out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-2 rounded-lg bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition-colors whitespace-nowrap cursor-pointer shadow-xs"
            >
              <UserIcon className="h-3.5 w-3.5" />
              <span>Researcher Login</span>
            </button>
          )}

          {/* Mobile menu toggle */}
          <button
            onClick={onToggleMobileMenu}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-700 md:hidden hover:bg-slate-100 cursor-pointer"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

      </div>
    </header>
  );
};
