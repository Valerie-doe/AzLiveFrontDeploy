import React, { useState } from 'react';
import { ConnectedChannel } from '../types';
import { playNotificationSound } from '../../sound';
import { ChatStatus } from '../../types';

export function useIntegrations(
  onAddNewPage: (pageName: string) => void,
  onAddManualOrder: (jpCode: string, customerName: string, chatStatus: ChatStatus, sessionId?: string) => void
) {
  const [activeTab, setActiveTab] = useState<'connected' | 'logs' | 'endpoints'>('connected');

  const [channels, setChannels] = useState<ConnectedChannel[]>([
    {
      id: 'ch-fb-1',
      name: 'AZLive Fashion',
      platform: 'Facebook',
      handle: 'azlive.fashion.mada',
      followers: '45K abonnés',
      avatarColor: 'bg-blue-600',
      avatarInitial: 'AZ',
      isConnected: true,
      activeLive: true,
      webhookActive: true,
      tokenExpiry: 'Expire dans 58 jours',
    },
    {
      id: 'ch-fb-2',
      name: 'Boutique Chic Madagascar',
      platform: 'Facebook',
      handle: 'boutique.chic.mada',
      followers: '12K abonnés',
      avatarColor: 'bg-indigo-600',
      avatarInitial: 'BC',
      isConnected: true,
      activeLive: false,
      webhookActive: true,
      tokenExpiry: 'Expire dans 12 jours',
    },
    {
      id: 'ch-tt-1',
      name: 'Tana Dressing Hub',
      platform: 'TikTok',
      handle: '@tanadressing.officiel',
      followers: '89K followers',
      avatarColor: 'bg-black',
      avatarInitial: 'TD',
      isConnected: true,
      activeLive: false,
      webhookActive: false,
      tokenExpiry: 'Session longue durée',
    },
  ]);

  const [authModal, setAuthModal] = useState<{
    isOpen: boolean;
    platform: 'Facebook' | 'TikTok' | null;
    step: 1 | 2 | 3;
    selectedPageChoice: string[];
  }>({
    isOpen: false,
    platform: null,
    step: 1,
    selectedPageChoice: [],
  });

  const [testComment, setTestComment] = useState({
    pageId: 'ch-fb-1',
    customerName: 'Mialy Rakotomalala',
    customerPhone: '034 11 222 33',
    commentText: 'Maka JP1 rouge L azafady ho any Ambohitrarahaba!',
    customCode: 'JP1',
  });

  const [sandboxLog, setSandboxLog] = useState<
    {
      id: string;
      time: string;
      page: string;
      platform: 'Facebook' | 'TikTok';
      user: string;
      comment: string;
      capturedCode: string;
      status: 'captured' | 'ignored';
    }[]
  >([
    {
      id: 'log-1',
      time: '12:20:45',
      page: 'AZLive Fashion',
      platform: 'Facebook',
      user: 'Fanja Harisoa',
      comment: 'JP4 noir kely',
      capturedCode: 'JP4',
      status: 'captured',
    },
    {
      id: 'log-2',
      time: '12:21:10',
      page: 'Tana Dressing Hub',
      platform: 'TikTok',
      user: 'toky_mada_vip',
      comment: 'Tena tsara ilay robe fa saingy tsisy kopek',
      capturedCode: 'Aucun',
      status: 'ignored',
    },
  ]);

  const [webhookAlert, setWebhookAlert] = useState<string | null>(null);

  const handleOpenAuth = (platform: 'Facebook' | 'TikTok') => {
    playNotificationSound('click');
    setAuthModal({
      isOpen: true,
      platform,
      step: 1,
      selectedPageChoice: [],
    });
  };

  const handleNextStep = () => {
    playNotificationSound('click');
    setAuthModal((prev) => ({
      ...prev,
      step: (prev.step + 1) as 2 | 3,
    }));
  };

  const handleTogglePageChoice = (pageName: string) => {
    playNotificationSound('click');
    setAuthModal((prev) => {
      const alreadySelected = prev.selectedPageChoice.includes(pageName);
      return {
        ...prev,
        selectedPageChoice: alreadySelected
          ? prev.selectedPageChoice.filter((p) => p !== pageName)
          : [...prev.selectedPageChoice, pageName],
      };
    });
  };

  const handleCompleteIntegration = () => {
    playNotificationSound('confirm');
    const platform = authModal.platform || 'Facebook';
    const chosenPages =
      authModal.selectedPageChoice.length > 0
        ? authModal.selectedPageChoice
        : platform === 'Facebook'
        ? ['Dressing de Riana']
        : ['@mada_fripe_chic'];

    const newChannels: ConnectedChannel[] = chosenPages.map((page, idx) => ({
      id: `ch-dyn-${Date.now()}-${idx}`,
      name: page,
      platform,
      handle:
        platform === 'Facebook'
          ? `${page.toLowerCase().replace(/\s+/g, '.')}.page`
          : `@${page.toLowerCase().replace(/\s+/g, '_')}`,
      followers: 'Nouveau compte',
      avatarColor: platform === 'Facebook' ? 'bg-indigo-700' : 'bg-rose-600',
      avatarInitial: page.charAt(0).toUpperCase(),
      isConnected: true,
      activeLive: false,
      webhookActive: true,
      tokenExpiry: 'Expire dans 60 jours',
    }));

    setChannels((prev) => [...prev, ...newChannels]);
    chosenPages.forEach((p) => onAddNewPage(p));

    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];
    const newLogs = chosenPages.map((p, idx) => ({
      id: `log-dyn-${Date.now()}-${idx}`,
      time: timeStr,
      page: p,
      platform,
      user: 'Système OAuth',
      comment: `Webhook Webhook-Subscription connecté avec succès à l'API ${platform}.`,
      capturedCode: 'Système',
      status: 'captured' as const,
    }));
    setSandboxLog((prev) => [...newLogs, ...prev]);

    setAuthModal({
      isOpen: false,
      platform: null,
      step: 1,
      selectedPageChoice: [],
    });

    setWebhookAlert(`Succès : ${chosenPages.length} nouvelle(s) page(s) intégrée(s) !`);
    setTimeout(() => setWebhookAlert(null), 4000);
  };

  const handleToggleWebhook = (id: string) => {
    playNotificationSound('click');
    setChannels((prev) =>
      prev.map((c) => (c.id === id ? { ...c, webhookActive: !c.webhookActive } : c))
    );
  };

  const handleDisconnectChannel = (id: string, name: string) => {
    playNotificationSound('delivery');
    setChannels((prev) => prev.filter((c) => c.id !== id));
    setWebhookAlert(`🔴 Canal ${name} déconnecté.`);
    setTimeout(() => setWebhookAlert(null), 3000);
  };

  const handleFireWebhookMock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testComment.commentText.trim() || !testComment.customerName.trim()) return;

    const matchedChannel = channels.find((c) => c.id === testComment.pageId);
    if (!matchedChannel) return;

    if (!matchedChannel.webhookActive) {
      setWebhookAlert(
        `⚠️ Le Webhook pour la page "${matchedChannel.name}" est désactivé. Veuillez l'activer pour recevoir les requêtes.`
      );
      setTimeout(() => setWebhookAlert(null), 4000);
      return;
    }

    const code = testComment.customCode.trim().toUpperCase() || 'JP1';
    onAddManualOrder(code, testComment.customerName.trim(), 'En attente');

    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];

    setSandboxLog((prev) => [
      {
        id: `log-${Date.now()}`,
        time: timeStr,
        page: matchedChannel.name,
        platform: matchedChannel.platform,
        user: testComment.customerName,
        comment: testComment.commentText,
        capturedCode: code,
        status: 'captured',
      },
      ...prev,
    ]);

    setWebhookAlert(
      `🟢 Webhook reçu ! Commentaire capturé de ${testComment.customerName} sur code [${code}].`
    );
    setTimeout(() => setWebhookAlert(null), 5000);

    setTestComment((prev) => ({
      ...prev,
      commentText: '',
    }));
  };

  return {
    activeTab,
    setActiveTab,
    channels,
    authModal,
    setAuthModal,
    testComment,
    setTestComment,
    sandboxLog,
    setSandboxLog,
    webhookAlert,
    setWebhookAlert,
    handleOpenAuth,
    handleNextStep,
    handleTogglePageChoice,
    handleCompleteIntegration,
    handleToggleWebhook,
    handleDisconnectChannel,
    handleFireWebhookMock,
  };
}
