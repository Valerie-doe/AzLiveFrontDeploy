export interface ConnectedChannel {
  id: string;
  name: string;
  platform: 'Facebook' | 'TikTok';
  handle: string;
  followers: string;
  avatarColor: string;
  avatarInitial: string;
  isConnected: boolean;
  activeLive: boolean;
  webhookActive: boolean;
  tokenExpiry: string;
}
