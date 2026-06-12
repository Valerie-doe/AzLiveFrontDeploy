import React from 'react';
import { 
  BarChart3, 
  Tv, 
  Tag, 
  Users, 
  Briefcase, 
  Search, 
  HelpCircle, 
  FolderLock 
} from 'lucide-react';
import { playNotificationSound } from '../../services/sound';

interface SidebarProps {
  activeTab: 'dashboard' | 'live_hub' | 'products' | 'clients' | 'collaborators' | 'search';
  setActiveTab: (tab: 'dashboard' | 'live_hub' | 'products' | 'clients' | 'collaborators' | 'search') => void;
  liveHubBadgeCount: number;
  onShowGuide: () => void;
  onLogout: () => void;
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  liveHubBadgeCount,
  onShowGuide,
  onLogout,
}: SidebarProps) {
  const tabs = [
    { id: 'dashboard', label: 'Tableau de bord', icon: BarChart3, badge: 0 },
    { id: 'live_hub', label: 'Live shopping', icon: Tv, badge: liveHubBadgeCount },
    { id: 'products', label: 'Gestion produits', icon: Tag, badge: 0 },
    { id: 'clients', label: 'Clients', icon: Users, badge: 0 },
    { id: 'collaborators', label: 'Collaborateurs', icon: Briefcase, badge: 0 },
    { id: 'search', label: 'Recherche globale', icon: Search, badge: 0 }
  ] as const;

  return (
    <aside className="hidden lg:flex lg:flex-shrink-0 lg:w-76 xl:w-80 bg-white border-r border-slate-100 flex-col h-screen sticky top-0 justify-between p-6">
      <div className="space-y-8">
        
        {/* Logo & Platform Info Branding */}
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-100 font-black tracking-tighter text-xl flex-shrink-0">
            AZ
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="font-extrabold text-lg text-slate-955 tracking-tight">AZLive</span>
              <span className="bg-emerald-50 text-emerald-805 text-emerald-800 text-[9px] px-2 py-0.2 rounded font-black border border-emerald-202 border-emerald-200 uppercase tracking-wide">
                MADA
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-serif leading-none mt-0.5">Après-Livestream Facebook</p>
          </div>
        </div>

        {/* Desktop Navigation Link Tabs */}
        <div>
          <span className="text-[9px] font-mono font-extrabold text-slate-450 text-slate-400 block uppercase tracking-wider mb-2 px-1">
            Espaces Métiers & Pilotage
          </span>
          <nav className="space-y-1.5" id="sidebar-vertical-navigation-tabs">
            {tabs.map((tab) => {
              const IconComp = tab.icon;
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    playNotificationSound('click');
                  }}
                  className={`w-full px-3.5 py-3 rounded-xl text-xs font-black tracking-tight transition-all flex items-center justify-between group ${
                    isSelected
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-955 hover:text-slate-950 hover:bg-slate-50'
                  }`}
                  id={`sidebar-tab-${tab.id}`}
                >
                  <div className="flex items-center gap-3">
                    <IconComp className={`h-4.5 w-4.5 transition-transform group-hover:scale-105 ${isSelected ? 'text-white' : 'text-slate-400 group-hover:text-slate-600 group-hover:text-slate-650'}`} />
                    <span className="truncate max-w-[170px]">{tab.label}</span>
                  </div>
                  {tab.badge !== undefined && tab.badge > 0 && (
                    <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full font-black ${
                      isSelected ? 'bg-indigo-600 text-white' : 'bg-rose-100 text-rose-800 animate-pulse'
                    }`}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

      </div>

      {/* Desktop Sidebar Bottom Footer Tools widget */}
      <div className="space-y-3 pt-4 border-t border-slate-100">
        
        <button
          onClick={onShowGuide}
          className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-[10px] font-extrabold flex items-center justify-center gap-1.5 text-slate-700 transition-all cursor-pointer"
        >
          <HelpCircle className="h-3.5 w-3.5 text-slate-500" />
          <span>Guide d'utilisation</span>
        </button>

        <button
          onClick={onLogout}
          className="w-full py-2.5 bg-white border border-slate-200 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-150 text-slate-600 rounded-xl text-[10px] font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs"
        >
          <FolderLock className="h-4 w-4" />
          <span>Se déconnecter (Verrouiller)</span>
        </button>

        <div className="text-center text-[10px] text-slate-400 select-none font-serif leading-none mt-1">
          AZLive Solutions v1.2
        </div>

      </div>
    </aside>
  );
}
