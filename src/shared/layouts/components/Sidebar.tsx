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
    <aside className="hidden lg:flex lg:shrink-0 lg:w-56 xl:w-60 bg-primary border-r border-secondary flex-col h-screen sticky top-0 justify-between p-4">
      <div className="space-y-6">
        
        {/* Logo & Platform Info Branding */}
        <div className="flex items-center gap-2.5">
          <img src="https://res.cloudinary.com/dj9qwddts/image/upload/v1784121065/Logo_gmt4mc.png" alt="AZLive" className="h-9 w-9 rounded-xl object-cover shadow-lg shadow-secondary shrink-0" />
          <div className="min-w-0">
            <div className="flex items-center gap-1">
              <span className="font-extrabold text-base text-secondary tracking-tight">AZLive</span>
              <span className="bg-accent text-secondary text-[8px] px-1.5 py-0.5 rounded font-black border border-secondary uppercase tracking-wide">
                MADA
              </span>
            </div>
            <p className="text-[9px] text-slate-400 font-serif leading-tight mt-0.5 truncate">Après-Livestream Facebook</p>
          </div>
        </div>

        {/* Desktop Navigation Link Tabs */}
        <div>
          <span className="text-[9px] font-mono font-extrabold text-secondary block uppercase tracking-wider mb-2 px-1">
            Espaces Métiers & Pilotage
          </span>
          <nav className="space-y-1" id="sidebar-vertical-navigation-tabs">
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
                  className={`w-full px-2.5 py-2.5 rounded-xl text-[12px] font-black tracking-tight transition-all flex items-center justify-between group ${
                    isSelected
                      ? 'bg-secondary text-primary shadow-sm'
                      : 'text-secondary/80 hover:text-secondary hover:bg-accent'
                  }`}
                  id={`sidebar-tab-${tab.id}`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <IconComp className={`h-4 w-4 shrink-0 transition-transform group-hover:scale-105 ${isSelected ? 'text-primary' : 'text-secondary/60 group-hover:text-secondary'}`} />
                    <span className="truncate">{tab.label}</span>
                  </div>
                  {tab.badge !== undefined && tab.badge > 0 && (
                    <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full font-black ${
                      isSelected ? 'bg-secondary text-primary' : 'bg-accent text-secondary animate-pulse'
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
      <div className="space-y-2 pt-3 border-t border-slate-100">
        
        <button
          onClick={onShowGuide}
          className="w-full py-2 bg-accent hover:shadow-secondary rounded-xl text-[9px] font-extrabold flex items-center justify-center gap-1.5 text-secondary transition-all cursor-pointer"
        >
          <HelpCircle className="h-3.5 w-3.5 text-slate-500 shrink-0" />
          <span className="truncate">Guide d'utilisation</span>
        </button>

        <button
          onClick={onLogout}
          className="w-full py-2 bg-primary border border-secondary hover:bg-accent hover:text-secondary text-secondary rounded-xl text-[9px] font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs"
        >
          <FolderLock className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">Se déconnecter</span>
        </button>

        <div className="text-center text-[9px] text-secondary select-none font-serif leading-none mt-1">
          AZLive Solutions v1.2
        </div>

      </div>
    </aside>
  );
}
