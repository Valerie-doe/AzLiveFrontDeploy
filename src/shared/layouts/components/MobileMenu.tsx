import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart3, 
  Tv, 
  Tag, 
  Users, 
  Briefcase, 
  Search, 
  X, 
  HelpCircle, 
  FolderLock,
  Settings,
} from 'lucide-react';
import { playNotificationSound } from '../../services/sound';

type AppTab = 'dashboard' | 'live_hub' | 'products' | 'clients' | 'collaborators' | 'search' | 'settings';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  liveHubBadgeCount: number;
  onShowGuide: () => void;
  onLogout: () => void;
}

export default function MobileMenu({
  isOpen,
  onClose,
  activeTab,
  setActiveTab,
  liveHubBadgeCount,
  onShowGuide,
  onLogout,
}: MobileMenuProps) {
  const tabs = [
    { id: 'dashboard', label: 'Tableau de bord', icon: BarChart3, badge: 0 },
    { id: 'live_hub', label: 'Live shopping', icon: Tv, badge: liveHubBadgeCount },
    { id: 'products', label: 'Gestion produits', icon: Tag, badge: 0 },
    { id: 'clients', label: 'Clients', icon: Users, badge: 0 },
    { id: 'collaborators', label: 'Collaborateurs', icon: Briefcase, badge: 0 },
    { id: 'search', label: 'Recherche globale', icon: Search, badge: 0 },
    { id: 'settings', label: 'Paramètres', icon: Settings, badge: 0 },
  ] as const;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950 z-45 lg:hidden"
          />
          {/* Slide menu */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="fixed inset-y-0 left-0 w-80 max-w-[85vw] bg-white border-r border-slate-100 p-6 flex flex-col justify-between shadow-2xl lg:hidden animate-none"
            style={{ zIndex: 100 }}
          >
            <div className="space-y-6">
              {/* Drawer Header logo */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="h-9 w-9 bg-indigo-600 text-white rounded-xl flex items-center justify-center font-black tracking-tighter text-base">
                    AZ
                  </div>
                  <div>
                    <span className="font-extrabold text-sm text-slate-955 text-slate-950">AZLive Solution</span>
                    <p className="text-[9px] text-slate-400 font-serif">Apres-Live Facebook Mada</p>
                  </div>
                </div>
                <button 
                  onClick={onClose}
                  className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Sidebar Navigation inside mobile drawer */}
              <nav className="space-y-1.5">
                {tabs.map((tab) => {
                  const IconComp = tab.icon;
                  const isSelected = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id);
                        onClose();
                        playNotificationSound('click');
                      }}
                      className={`w-full px-3.5 py-3 rounded-xl text-xs font-black tracking-tight transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-slate-900 text-white shadow-sm'
                          : 'text-slate-655 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <IconComp className="h-4.5 w-4.5" />
                        <span>{tab.label}</span>
                      </div>
                      {tab.badge !== undefined && tab.badge > 0 && (
                        <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full font-black ${
                          isSelected ? 'bg-indigo-600 text-white' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {tab.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Bottom utilities inside mobile drawer */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <button
                onClick={() => {
                  onClose();
                  onShowGuide();
                }}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-750 text-slate-705 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <HelpCircle className="h-4 w-4 text-slate-500" />
                <span>Guide d'utilisation</span>
              </button>

              <button
                onClick={() => {
                  onClose();
                  onLogout();
                }}
                className="w-full py-2.5 bg-white border border-slate-200 hover:bg-rose-50 hover:text-rose-700 text-slate-600 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer hover:border-rose-100 shadow-xs"
              >
                <FolderLock className="h-4.5 w-4.5" />
                <span>Se déconnecter (Verrouiller)</span>
              </button>

              <div className="text-center text-[10px] text-slate-405 text-slate-400 font-serif">
                Aide: <button onClick={() => { onShowGuide(); onClose(); }} className="underline font-bold text-slate-600 hover:text-indigo-600">Protocole AZLive</button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
