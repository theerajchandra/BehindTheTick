'use client';

import { useState, useEffect } from 'react';
import { useWebSocket } from '@/lib/websocket';
import { getNotificationManager } from '@/lib/notifications';
import { useAuth } from '@/hooks/useAuth';
import { Bell, BellOff, AlertTriangle, TrendingUp, TrendingDown, X } from 'lucide-react';

interface NotificationItem {
  id: string;
  type: 'trade_alert' | 'price_alert' | 'news_alert' | 'market_alert';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  data?: any;
}

export default function NotificationCenter() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  const notificationManager = getNotificationManager();

  // WebSocket subscriptions for real-time alerts
  useWebSocket('trade_alert', (data) => {
    const newNotification: NotificationItem = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'trade_alert',
      title: `New Trade Alert: ${data.politician}`,
      message: `${data.action} ${data.quantity} shares of ${data.symbol} at $${data.price}`,
      timestamp: new Date(),
      read: false,
      data
    };
    
    addNotification(newNotification);
    
    // Show browser notification if enabled
    if (notificationsEnabled) {
      notificationManager.showTradeAlert({
        politician: data.politician,
        symbol: data.symbol,
        action: data.action,
        quantity: data.quantity,
        price: data.price,
        date: data.date
      });
    }
  });

  useWebSocket('price_alert', (data) => {
    const newNotification: NotificationItem = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'price_alert',
      title: `Price Alert: ${data.symbol}`,
      message: `${data.symbol} ${data.direction} ${Math.abs(data.changePercent).toFixed(2)}% to $${data.price}`,
      timestamp: new Date(),
      read: false,
      data
    };
    
    addNotification(newNotification);
    
    if (notificationsEnabled) {
      notificationManager.showPriceAlert({
        symbol: data.symbol,
        price: data.price,
        changePercent: data.changePercent,
        direction: data.direction
      });
    }
  });

  useWebSocket('news_alert', (data) => {
    const newNotification: NotificationItem = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'news_alert',
      title: 'Breaking News',
      message: data.headline,
      timestamp: new Date(),
      read: false,
      data
    };
    
    addNotification(newNotification);
    
    if (notificationsEnabled) {
      notificationManager.showNewsAlert({
        headline: data.headline,
        summary: data.summary,
        url: data.url
      });
    }
  });

  useEffect(() => {
    // Check notification permission status
    const checkPermission = async () => {
      await notificationManager.init();
      setNotificationsEnabled(Notification.permission === 'granted');
    };
    
    checkPermission();
  }, []);

  useEffect(() => {
    // Update unread count
    const unread = notifications.filter(n => !n.read).length;
    setUnreadCount(unread);
  }, [notifications]);

  const addNotification = (notification: NotificationItem) => {
    setNotifications(prev => [notification, ...prev.slice(0, 19)]); // Keep last 20
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const requestNotificationPermission = async () => {
    const permission = await notificationManager.requestPermission();
    setNotificationsEnabled(permission === 'granted');
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'trade_alert':
        return <TrendingUp className="w-4 h-4 text-blue-400" />;
      case 'price_alert':
        return <TrendingDown className="w-4 h-4 text-green-400" />;
      case 'news_alert':
        return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      case 'market_alert':
        return <Bell className="w-4 h-4 text-purple-400" />;
      default:
        return <Bell className="w-4 h-4 text-gray-400" />;
    }
  };

  if (!user) return null;

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-400 hover:text-white transition-colors"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Panel */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-gray-800 border border-gray-700 rounded-lg shadow-2xl z-50">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <h3 className="text-lg font-semibold text-white">Notifications</h3>
            <div className="flex items-center space-x-2">
              {!notificationsEnabled && (
                <button
                  onClick={requestNotificationPermission}
                  className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded"
                >
                  Enable
                </button>
              )}
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs text-blue-400 hover:text-blue-300"
                >
                  Mark all read
                </button>
              )}
            </div>
          </div>

          {/* Notification List */}
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-gray-400">
                <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No notifications yet</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-gray-700 hover:bg-gray-700 transition-colors ${
                    !notification.read ? 'bg-blue-900/10' : ''
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className={`text-sm font-medium ${
                        !notification.read ? 'text-white' : 'text-gray-300'
                      }`}>
                        {notification.title}
                      </h4>
                      <p className="text-sm text-gray-400 mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        {notification.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeNotification(notification.id);
                      }}
                      className="flex-shrink-0 text-gray-500 hover:text-gray-300"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-3 bg-gray-750 border-t border-gray-700">
              <button
                onClick={() => setNotifications([])}
                className="w-full text-center text-sm text-gray-400 hover:text-gray-300"
              >
                Clear all notifications
              </button>
            </div>
          )}
        </div>
      )}

      {/* Click outside to close */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
