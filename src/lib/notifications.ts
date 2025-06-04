'use client';

interface NotificationOptions {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  data?: any;
  actions?: Array<{
    action: string;
    title: string;
    icon?: string;
  }>;
}

class NotificationManager {
  private isSupported = false;
  private permission: NotificationPermission = 'default';
  private swRegistration: ServiceWorkerRegistration | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.isSupported = 'Notification' in window && 'serviceWorker' in navigator;
      this.permission = this.isSupported ? Notification.permission : 'denied';
    }
  }

  async init(): Promise<void> {
    if (!this.isSupported) {
      console.warn('Notifications are not supported in this browser');
      return;
    }

    // Register service worker if not already registered
    if ('serviceWorker' in navigator) {
      try {
        this.swRegistration = await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker registered for notifications');
      } catch (error) {
        console.error('Service Worker registration failed:', error);
      }
    }
  }

  async requestPermission(): Promise<NotificationPermission> {
    if (!this.isSupported) {
      return 'denied';
    }

    if (this.permission === 'granted') {
      return 'granted';
    }

    try {
      this.permission = await Notification.requestPermission();
      console.log('Notification permission:', this.permission);
      return this.permission;
    } catch (error) {
      console.error('Failed to request notification permission:', error);
      return 'denied';
    }
  }

  async showNotification(options: NotificationOptions): Promise<void> {
    if (this.permission !== 'granted') {
      console.warn('Notifications not permitted');
      return;
    }

    const notificationOptions: NotificationOptions = {
      icon: '/icon-192.png',
      badge: '/favicon.png',
      ...options,
    };

    try {
      if (this.swRegistration) {
        // Use service worker for better control
        await this.swRegistration.showNotification(options.title, notificationOptions);
      } else {
        // Fallback to regular notification
        new Notification(options.title, notificationOptions);
      }
    } catch (error) {
      console.error('Failed to show notification:', error);
    }
  }

  async showTradeAlert(trade: {
    politician: string;
    symbol: string;
    action: string;
    amount: number;
  }): Promise<void> {
    await this.showNotification({
      title: 'New Insider Trade Alert',
      body: `${trade.politician} ${trade.action} $${trade.amount.toLocaleString()} in ${trade.symbol}`,
      tag: 'trade-alert',
      data: { type: 'trade', trade },
      actions: [
        { action: 'view', title: 'View Details' },
        { action: 'watchlist', title: 'Add to Watchlist' }
      ]
    });
  }

  async showPriceAlert(alert: {
    symbol: string;
    price: number;
    change: number;
    threshold: number;
  }): Promise<void> {
    const direction = alert.change > 0 ? 'up' : 'down';
    const emoji = alert.change > 0 ? '📈' : '📉';
    
    await this.showNotification({
      title: `Price Alert: ${alert.symbol}`,
      body: `${emoji} ${alert.symbol} is ${direction} ${Math.abs(alert.change).toFixed(2)}% to $${alert.price}`,
      tag: 'price-alert',
      data: { type: 'price', alert },
      actions: [
        { action: 'view', title: 'View Chart' },
        { action: 'trade', title: 'Trade Now' }
      ]
    });
  }

  async showNewsAlert(news: {
    title: string;
    urgency: string;
    category: string;
  }): Promise<void> {
    const urgencyEmoji = news.urgency === 'high' ? '🚨' : news.urgency === 'medium' ? '⚠️' : 'ℹ️';
    
    await this.showNotification({
      title: `${urgencyEmoji} Breaking News`,
      body: news.title,
      tag: 'news-alert',
      data: { type: 'news', news },
      actions: [
        { action: 'read', title: 'Read Article' },
        { action: 'share', title: 'Share' }
      ]
    });
  }

  async showMarketAlert(alert: {
    message: string;
    type: 'market_open' | 'market_close' | 'volatility' | 'volume_spike';
  }): Promise<void> {
    const typeEmojis = {
      market_open: '🔔',
      market_close: '🔕',
      volatility: '⚡',
      volume_spike: '📊'
    };

    await this.showNotification({
      title: 'Market Alert',
      body: `${typeEmojis[alert.type]} ${alert.message}`,
      tag: 'market-alert',
      data: { type: 'market', alert }
    });
  }

  getPermissionStatus(): NotificationPermission {
    return this.permission;
  }

  isNotificationSupported(): boolean {
    return this.isSupported;
  }

  async scheduleNotification(options: NotificationOptions, delay: number): Promise<void> {
    setTimeout(() => {
      this.showNotification(options);
    }, delay);
  }

  // Subscribe to push notifications (for future server integration)
  async subscribeToPush(): Promise<PushSubscription | null> {
    if (!this.swRegistration) {
      console.warn('Service worker not registered');
      return null;
    }

    try {
      const subscription = await this.swRegistration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(
          process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || ''
        )
      });

      console.log('Push subscription created:', subscription);
      return subscription;
    } catch (error) {
      console.error('Failed to subscribe to push notifications:', error);
      return null;
    }
  }

  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }
}

// Singleton instance
let notificationManager: NotificationManager | null = null;

export const getNotificationManager = (): NotificationManager => {
  if (!notificationManager && typeof window !== 'undefined') {
    notificationManager = new NotificationManager();
  }
  return notificationManager!;
};

// React hook for notifications
export const useNotifications = () => {
  const manager = getNotificationManager();

  return {
    requestPermission: () => manager.requestPermission(),
    showNotification: (options: NotificationOptions) => manager.showNotification(options),
    showTradeAlert: (trade: any) => manager.showTradeAlert(trade),
    showPriceAlert: (alert: any) => manager.showPriceAlert(alert),
    showNewsAlert: (news: any) => manager.showNewsAlert(news),
    showMarketAlert: (alert: any) => manager.showMarketAlert(alert),
    scheduleNotification: (options: NotificationOptions, delay: number) => 
      manager.scheduleNotification(options, delay),
    subscribeToPush: () => manager.subscribeToPush(),
    getPermissionStatus: () => manager.getPermissionStatus(),
    isSupported: () => manager.isNotificationSupported(),
    init: () => manager.init()
  };
};
