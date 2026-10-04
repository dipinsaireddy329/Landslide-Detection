import React from 'react';
import { 
  LayoutDashboard, 
  Satellite, 
  History, 
  BarChart3, 
  AlertTriangle, 
  Cpu, 
  Network, 
  CheckCircle2, 
  BookOpen, 
  Settings, 
  Activity,
  Layers
} from 'lucide-react';
import { AlertRecord } from '../types';

interface SidebarProps {
  activeView: string;
  onNavigate: (view: string) => void;
  alerts: AlertRecord[];
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  onNavigate,
  alerts,
  isMobileOpen = false,
  onCloseMobile
}) => {
  const activeAlerts = alerts.filter(a => a.status === 'active').length;

  const navItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'detect', label: 'Detect Landslide', icon: Satellite, highlight: true },
    { id: 'history', label: 'Prediction History', icon: History },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'alerts', label: 'Alerts', icon: AlertTriangle, count: activeAlerts },
    { id: 'about-model', label: 'About Model', icon: Cpu },
    { id: 'architecture', label: 'System Architecture', icon: Network },
    { id: 'testing', label: 'System Testing', icon: CheckCircle2 },
    { id: 'about-project', label: 'Project Info', icon: BookOpen },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleItemClick = (id: string) => {
    onNavigate(id);
    if (onCloseMobile) onCloseMobile();
  };

  const content = (
    <div className="flex h-full flex-col justify-between p-4 bg-white border-r border-slate-200/80">
      <div className="space-y-6">
        
        {/* Workspace Title & telemetry */}
        <div className="px-2 pt-2">
          <div className="flex items-center gap-2 text-xs font-mono font-semibold tracking-wider text-sky-700 uppercase">
            <Activity className="h-3.5 w-3.5" />
            <span>Earth Observation AI</span>
          </div>
          <div className="mt-1 text-xs text-slate-500">
            Sentinel-2 & Landsat Processing
          </div>
        </div>

        {/* Navigation list */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={`group flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-xs font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-sky-50/80 text-sky-800 font-semibold border-l-3 border-sky-600 shadow-xs'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3 truncate">
                  <Icon
                    className={`h-4 w-4 shrink-0 transition-colors ${
                      isActive ? 'text-sky-600' : 'text-slate-400 group-hover:text-slate-600'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>

                {item.count !== undefined && item.count > 0 && (
                  <span className="ml-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-50 border border-rose-200 text-[10px] font-bold text-rose-700 font-mono">
                    {item.count}
                  </span>
                )}
                
                {item.highlight && !isActive && (
                  <span className="h-1.5 w-1.5 rounded-full bg-sky-500" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Model Spec Badge */}
      <div className="rounded-xl border border-slate-200/80 bg-slate-50/80 p-3.5 text-xs space-y-1.5 shadow-xs">
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-600">
          <span className="flex items-center gap-1.5 font-medium">
            <Layers className="h-3.5 w-3.5 text-sky-600" />
            VGG19 + ResNet101
          </span>
          <span className="text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
            96.58%
          </span>
        </div>
        <div className="text-[11px] text-slate-500">
          Gabor Texture Energy + Deep Spatial Features
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop fixed sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 h-[calc(100vh-4rem)] sticky top-16">
        {content}
      </aside>

      {/* Mobile drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div 
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
            onClick={onCloseMobile}
          />
          <div className="fixed inset-y-0 left-0 w-72 max-w-[85vw] shadow-2xl">
            {content}
          </div>
        </div>
      )}
    </>
  );
};
