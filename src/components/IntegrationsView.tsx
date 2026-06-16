import React, { useState } from 'react';
import { playNotificationSound } from '../sound';
import { Order, ChatStatus } from '../types';
import { useIntegrationsState } from '../integrations/hooks/useIntegrationsState';
import IntegrationsHeader from '../integrations/components/IntegrationsHeader';
import ChannelsTab from '../integrations/components/ChannelsTab';
import LogsTab from '../integrations/components/LogsTab';
import SecureTab from '../integrations/components/SecureTab';
import PlaygroundPanel from '../integrations/components/PlaygroundPanel';
import AuthModal from '../integrations/components/AuthModal';

interface IntegrationsViewProps {
  orders: Order[];
  onAddManualOrder: (jpCode: string, customerName: string, chatStatus: ChatStatus, sessionId?: string) => void;
  onAddNewPage: (pageName: string) => void;
  connectedPagesList: string[];
}

export default function IntegrationsView({
  orders: _orders,
  onAddManualOrder,
  onAddNewPage,
  connectedPagesList: _connectedPagesList
}: IntegrationsViewProps) {
  const [activeTab, setActiveTab] = useState<'connected' | 'logs' | 'endpoints'>('connected');

  const {
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
    handlePrevStep,
    handleTogglePageChoice,
    handleCompleteIntegration,
    handleToggleWebhook,
    handleDisconnectChannel,
    handleFireWebhookMock
  } = useIntegrationsState(onAddManualOrder, onAddNewPage);

  return (
    <div className="space-y-6">
      <IntegrationsHeader
        channelsCount={channels.length}
        webhookAlert={webhookAlert}
        onConnectFacebook={() => handleOpenAuth('Facebook')}
        onConnectTikTok={() => handleOpenAuth('TikTok')}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: ACTIVE INTEGRATIONS & SETTINGS (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            {/* Tab Navigation */}
            <div className="flex border-b text-center text-xs font-black font-mono">
              <button
                onClick={() => { setActiveTab('connected'); playNotificationSound('click'); }}
                className={`flex-1 py-4 border-b-2 transition-all ${
                  activeTab === 'connected'
                    ? 'border-indigo-600 text-indigo-600 bg-slate-50/50'
                    : 'border-transparent text-slate-400 hover:text-slate-700 hover:bg-slate-50/20'
                }`}
              >
                📡 Comptes connectés ({channels.length})
              </button>

              <button
                onClick={() => { setActiveTab('endpoints'); playNotificationSound('click'); }}
                className={`flex-1 py-4 border-b-2 transition-all ${
                  activeTab === 'endpoints'
                    ? 'border-indigo-600 text-indigo-600 bg-slate-50/50'
                    : 'border-transparent text-slate-400 hover:text-slate-700 hover:bg-slate-50/20'
                }`}
              >
                🔒 Configuration Securisée
              </button>

              <button
                onClick={() => { setActiveTab('logs'); playNotificationSound('click'); }}
                className={`flex-1 py-4 border-b-2 transition-all ${
                  activeTab === 'logs'
                    ? 'border-indigo-600 text-indigo-600 bg-slate-50/50'
                    : 'border-transparent text-slate-400 hover:text-slate-700 hover:bg-slate-50/20'
                }`}
              >
                📜 Logs Webhook du serveur ({sandboxLog.length})
              </button>
            </div>

            {/* Tab Content */}
            {activeTab === 'connected' && (
              <ChannelsTab
                channels={channels}
                onToggleWebhook={handleToggleWebhook}
                onDisconnectChannel={handleDisconnectChannel}
              />
            )}
            {activeTab === 'endpoints' && (
              <SecureTab
                onCopyUrl={() => {
                  setWebhookAlert('📋 URL copiée dans le presse-papier !');
                  setTimeout(() => setWebhookAlert(null), 3000);
                  playNotificationSound('click');
                }}
              />
            )}
            {activeTab === 'logs' && (
              <LogsTab
                sandboxLog={sandboxLog}
                onClear={() => { setSandboxLog([]); playNotificationSound('delivery'); }}
              />
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: WEBHOOK INTERACTIVE TESTER PLAYGROUND (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <PlaygroundPanel
            channels={channels}
            testComment={testComment}
            setTestComment={setTestComment}
            onSubmit={handleFireWebhookMock}
          />
        </div>
      </div>

      {/* OAuth Modal */}
      <AuthModal
        authModal={authModal}
        onClose={() => setAuthModal(prev => ({ ...prev, isOpen: false }))}
        onNextStep={handleNextStep}
        onPrevStep={handlePrevStep}
        onTogglePageChoice={handleTogglePageChoice}
        onCompleteIntegration={handleCompleteIntegration}
      />
    </div>
  );
}
