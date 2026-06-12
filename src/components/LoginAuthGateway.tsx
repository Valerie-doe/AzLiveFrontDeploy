import React, { useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { playNotificationSound } from '../sound';

import AuthHeader from './auth/AuthHeader';
import WelcomeStep from './auth/WelcomeStep';
import PermissionsStep from './auth/PermissionsStep';
import SelectPagesStep from './auth/SelectPagesStep';
import SuccessStep from './auth/SuccessStep';
import FaqModal from './auth/FaqModal';

interface LoginAuthGatewayProps {
  onLoginSuccess: (pages: string[], platform: 'Facebook' | 'TikTok') => void;
}

export default function LoginAuthGateway({ onLoginSuccess }: LoginAuthGatewayProps) {
  const [activeStep, setActiveStep] = useState<'welcome' | 'permissions' | 'select_pages' | 'success'>('welcome');
  const [selectedPlatform, setSelectedPlatform] = useState<'Facebook' | 'TikTok' | null>(null);
  
  // Available pages to simulate authorization
  const [availablePages, setAvailablePages] = useState<string[]>([]);
  const [selectedPages, setSelectedPages] = useState<string[]>([]);
  
  const [showFaq, setShowFaq] = useState(false);

  // Lists of pages based on platform
  const facebookPages = [
    "AZLive Fashion",
    "Boutique Chic Madagascar",
    "Tana Dressing Hub",
    "Fripe de Luxe Antsirabe",
    "Dressing de Riana"
  ];

  const tiktokPages = [
    "@tanadressing.officiel",
    "@mada_fripe_chic",
    "@fianar_style_vip",
    "@riana_dressing_live"
  ];

  const handleStartAuth = (platform: 'Facebook' | 'TikTok') => {
    playNotificationSound('click');
    setSelectedPlatform(platform);
    setAvailablePages(platform === 'Facebook' ? facebookPages : tiktokPages);
    // Auto-select first page as default
    setSelectedPages([platform === 'Facebook' ? facebookPages[0] : tiktokPages[0]]);
    setActiveStep('permissions');
  };

  const handleBypassAuth = () => {
    playNotificationSound('confirm');
    // Rapid direct bypass
    onLoginSuccess(['AZLive Fashion', 'Boutique Chic Madagascar', 'Tana Dressing Hub'], 'Facebook');
  };

  const handleAcceptPermissions = () => {
    playNotificationSound('click');
    setActiveStep('select_pages');
  };

  const handleTogglePage = (page: string) => {
    playNotificationSound('click');
    if (selectedPages.includes(page)) {
      if (selectedPages.length > 1) { // keep at least one
        setSelectedPages(prev => prev.filter(p => p !== page));
      }
    } else {
      setSelectedPages(prev => [...prev, page]);
    }
  };

  const handleConfirmPages = () => {
    playNotificationSound('confirm');
    setActiveStep('success');
  };

  const handleFinalEnter = () => {
    playNotificationSound('confirm');
    if (selectedPlatform) {
      onLoginSuccess(selectedPages, selectedPlatform);
    } else {
      handleBypassAuth();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between p-4 md:p-8 selection:bg-indigo-600 selection:text-white relative overflow-hidden">
      
      {/* Dynamic Background visual ornaments */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-100 rounded-full blur-[120px] opacity-40 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-pink-100 rounded-full blur-[100px] opacity-30 translate-y-1/3 pointer-events-none" />

      <AuthHeader onShowFaq={() => setShowFaq(true)} />

      {/* MAIN OAUTH CONTAINER CARD */}
      <main className="flex-1 flex items-center justify-center py-12 relative z-10">
        <div className="w-full max-w-lg bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden relative">

          {/* Progress Indicator top line if configuring pages */}
          {activeStep !== 'welcome' && (
            <div className="h-1 bg-slate-100 flex">
              <div 
                className="h-full bg-indigo-600 transition-all duration-300"
                style={{ 
                  width: activeStep === 'permissions' ? '33%' : activeStep === 'select_pages' ? '66%' : '100%' 
                }} 
              />
            </div>
          )}

          <AnimatePresence mode="wait">
            {activeStep === 'welcome' && (
              <WelcomeStep 
                onStartAuth={handleStartAuth} 
                onBypassAuth={handleBypassAuth} 
              />
            )}

            {activeStep === 'permissions' && selectedPlatform && (
              <PermissionsStep 
                selectedPlatform={selectedPlatform} 
                onBack={() => setActiveStep('welcome')} 
                onAccept={handleAcceptPermissions} 
              />
            )}

            {activeStep === 'select_pages' && selectedPlatform && (
              <SelectPagesStep 
                selectedPlatform={selectedPlatform}
                availablePages={availablePages}
                selectedPages={selectedPages}
                onTogglePage={handleTogglePage}
                onBack={() => setActiveStep('permissions')}
                onConfirm={handleConfirmPages}
              />
            )}

            {activeStep === 'success' && selectedPlatform && (
              <SuccessStep 
                selectedPlatform={selectedPlatform}
                selectedPages={selectedPages}
                onFinalEnter={handleFinalEnter}
              />
            )}
          </AnimatePresence>

        </div>
      </main>

      {/* FOOTER COLOURED BAR */}
      <footer className="max-w-7xl mx-auto w-full text-center text-xs text-slate-400 py-4 border-t border-slate-100 select-none relative z-10">
        <p className="font-medium">🛡️ Authentification sécurisée de niveau Sandbox • AZLive Corporation Madagascar</p>
      </footer>

      <FaqModal isOpen={showFaq} onClose={() => setShowFaq(false)} />
    </div>
  );
}
