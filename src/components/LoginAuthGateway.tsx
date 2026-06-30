import React, { useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { playNotificationSound } from '../sound';
import { useFacebookAuth } from '../features/auth/hooks/useFacebookAuth';
import { useTikTokAuth } from '../features/auth/hooks/useTikTokAuth';
import { saveDemoSession } from '../features/auth/services/authStorage';
import { FacebookAuthSession } from '../features/auth/types/facebookAuth.types';
import { TikTokAuthSession } from '../features/auth/types/tiktokAuth.types';

import AuthHeader from './auth/AuthHeader';
import WelcomeStep from './auth/WelcomeStep';
import PermissionsStep from './auth/PermissionsStep';
import SelectPagesStep from './auth/SelectPagesStep';
import SuccessStep from './auth/SuccessStep';
import FaqModal from './auth/FaqModal';

interface LoginAuthGatewayProps {
  onLoginSuccess: (pages: string[], platform: 'Facebook' | 'TikTok') => void;
  onFacebookLoginSuccess?: (session: FacebookAuthSession) => void;
  onTikTokLoginSuccess?: (session: TikTokAuthSession) => void;
}

export default function LoginAuthGateway({
  onLoginSuccess,
  onFacebookLoginSuccess,
  onTikTokLoginSuccess,
}: LoginAuthGatewayProps) {
  const facebookAuth = useFacebookAuth();
  const tiktokAuth = useTikTokAuth();
  const [activeStep, setActiveStep] = useState<'welcome' | 'permissions' | 'select_pages' | 'success'>('welcome');
  const [selectedPlatform, setSelectedPlatform] = useState<'Facebook' | 'TikTok' | null>(null);

  const [availablePages, setAvailablePages] = useState<string[]>([]);
  const [selectedPages, setSelectedPages] = useState<string[]>([]);

  const [showFaq, setShowFaq] = useState(false);

  const facebookPages = [
    'AZLive Fashion',
    'Boutique Chic Madagascar',
    'Tana Dressing Hub',
    'Fripe de Luxe Antsirabe',
    'Dressing de Riana',
  ];

  const tiktokPages = [
    '@tanadressing.officiel',
    '@mada_fripe_chic',
    '@fianar_style_vip',
    '@riana_dressing_live',
  ];

  const handleStartAuth = (platform: 'Facebook' | 'TikTok') => {
    playNotificationSound('click');
    facebookAuth.clearError();
    tiktokAuth.clearError();
    setSelectedPlatform(platform);
    setAvailablePages(platform === 'Facebook' ? facebookPages : tiktokPages);
    setSelectedPages([platform === 'Facebook' ? facebookPages[0] : tiktokPages[0]]);
    setActiveStep('permissions');
  };

  const handleBypassAuth = () => {
    playNotificationSound('confirm');
    saveDemoSession(['AZLive Fashion', 'Boutique Chic Madagascar', 'Tana Dressing Hub'], 'Facebook');
    onLoginSuccess(['AZLive Fashion', 'Boutique Chic Madagascar', 'Tana Dressing Hub'], 'Facebook');
  };

  const handleAcceptPermissions = async () => {
    if (selectedPlatform === 'Facebook') {
      playNotificationSound('click');
      await facebookAuth.startFacebookOAuth();
      return;
    }

    if (selectedPlatform === 'TikTok') {
      playNotificationSound('click');
      await tiktokAuth.startTikTokOAuth();
      return;
    }

    playNotificationSound('click');
    setActiveStep('select_pages');
  };

  const handleTogglePage = (page: string) => {
    playNotificationSound('click');
    if (selectedPages.includes(page)) {
      if (selectedPages.length > 1) {
        setSelectedPages((prev) => prev.filter((p) => p !== page));
      }
    } else {
      setSelectedPages((prev) => [...prev, page]);
    }
  };

  const handleConfirmPages = () => {
    playNotificationSound('confirm');
    setActiveStep('success');
  };

  const handleFinalEnter = () => {
    playNotificationSound('confirm');
    if (selectedPlatform) {
      saveDemoSession(selectedPages, selectedPlatform);
      onLoginSuccess(selectedPages, selectedPlatform);
    } else {
      handleBypassAuth();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between p-4 md:p-8 selection:bg-indigo-600 selection:text-white relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-125 h-125 bg-indigo-100 rounded-full blur-[120px] opacity-40 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-100 h-100 bg-pink-100 rounded-full blur-[100px] opacity-30 translate-y-1/3 pointer-events-none" />

      <AuthHeader onShowFaq={() => setShowFaq(true)} />

      <main className="flex-1 flex items-center justify-center py-12 relative z-10">
        <div className="w-full max-w-lg bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden relative">
          {activeStep !== 'welcome' && (
            <div className="h-1 bg-slate-100 flex">
              <div
                className="h-full bg-indigo-600 transition-all duration-300"
                style={{
                  width:
                    activeStep === 'permissions'
                      ? '33%'
                      : activeStep === 'select_pages'
                        ? '66%'
                        : '100%',
                }}
              />
            </div>
          )}

          <AnimatePresence mode="wait">
            {activeStep === 'welcome' && (
              <WelcomeStep onStartAuth={handleStartAuth} onBypassAuth={handleBypassAuth} />
            )}

            {activeStep === 'permissions' && selectedPlatform && (
              <PermissionsStep
                selectedPlatform={selectedPlatform}
                onBack={() => setActiveStep('welcome')}
                onAccept={handleAcceptPermissions}
                isSubmitting={
                  selectedPlatform === 'Facebook' ? facebookAuth.isLoading : tiktokAuth.isLoading
                }
                errorMessage={
                  selectedPlatform === 'Facebook' ? facebookAuth.error : tiktokAuth.error
                }
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

      <footer className="max-w-7xl mx-auto w-full text-center text-xs text-slate-400 py-4 border-t border-slate-100 select-none relative z-10">
        <p className="font-medium">🛡️ Authentification sécurisée de niveau Sandbox • AZLive Corporation Madagascar</p>
      </footer>

      <FaqModal isOpen={showFaq} onClose={() => setShowFaq(false)} />
    </div>
  );
}
