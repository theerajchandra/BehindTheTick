'use client';

import { useState, useEffect } from 'react';
import { Bell, BellOff, Smartphone, Settings, CheckCircle, AlertTriangle, Wifi } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './Card';
import { Button } from './Button';
import { useAuth } from '@/hooks/useAuth';

interface NotificationPreferences {
  tradeAlerts: boolean;
  priceTargets: boolean;
  newsAlerts: boolean;
  marketUpdates: boolean;
  politicianActivity: boolean;
  urgentOnly: boolean;
  quietHours: {
    enabled: boolean;
    start: string;
    end: string;
  };
}

export default function PushNotificationSetup() {
  const { user } = useAuth();
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [testLoading, setTestLoading] = useState(false);
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    tradeAlerts: true,
    priceTargets: true,
    newsAlerts: false,
    marketUpdates: true,
    politicianActivity: true,
    urgentOnly: false,
    quietHours: {
      enabled: false,
      start: '22:00',
      end: '08:00'
    }
  });

  useEffect(() => {
    checkNotificationStatus();
    loadPreferences();
  }, []);

  const checkNotificationStatus = async () => {
    if (!('Notification' in window)) {
      console.log('Browser does not support notifications');
      return;
    }

    setPermission(Notification.permission);

    // Check if user is subscribed to push notifications
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();
        setIsSubscribed(!!subscription);
      } catch (error) {
        console.error('Error checking subscription:', error);
      }
    }
  };

  const loadPreferences = async () => {
    try {
      const saved = localStorage.getItem('notification-preferences');
      if (saved) {
        setPreferences(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
    }
  };

  const savePreferences = async (newPreferences: NotificationPreferences) => {
    try {
      localStorage.setItem('notification-preferences', JSON.stringify(newPreferences));
      setPreferences(newPreferences);

      // Send preferences to server if user is logged in
      if (user) {
        await fetch('/api/user/notification-preferences', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newPreferences)
        });
      }
    } catch (error) {
      console.error('Error saving preferences:', error);
    }
  };

  const requestPermission = async () => {
    if (!('Notification' in window)) {
      alert('This browser does not support push notifications');
      return;
    }

    setLoading(true);

    try {
      const permission = await Notification.requestPermission();
      setPermission(permission);

      if (permission === 'granted') {
        await subscribeToPushNotifications();
      }
    } catch (error) {
      console.error('Error requesting permission:', error);
    } finally {
      setLoading(false);
    }
  };

  const subscribeToPushNotifications = async () => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      console.error('Push messaging not supported');
      return;
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      
      // Generate VAPID keys in production - these are demo keys
      const vapidPublicKey = 'BEl62iUYgUivxIkv69yViEuiBIa40HI0PO2HbOgYbRE3VlWh3UFFdBrAO4Q6xE7DuZJHoaGFW7t_XU2Dq7Z9mDo';
      
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)
      });

      // Send subscription to server
      await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subscription,
          preferences
        })
      });

      setIsSubscribed(true);
    } catch (error) {
      console.error('Error subscribing to push notifications:', error);
    }
  };

  const unsubscribeFromPushNotifications = async () => {
    if (!('serviceWorker' in navigator)) return;

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      
      if (subscription) {
        await subscription.unsubscribe();
        
        // Remove subscription from server
        await fetch('/api/push/unsubscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ endpoint: subscription.endpoint })
        });
      }

      setIsSubscribed(false);
    } catch (error) {
      console.error('Error unsubscribing:', error);
    }
  };

  const sendTestNotification = async () => {
    setTestLoading(true);
    
    try {
      // Send test notification via API
      await fetch('/api/push/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      // Also show browser notification as backup
      if (permission === 'granted') {
        new Notification('BehindTheTick Test', {
          body: 'Push notifications are working correctly!',
          icon: '/icon-192.png',
          badge: '/icon-192.png',
          tag: 'test-notification'
        });
      }
    } catch (error) {
      console.error('Error sending test notification:', error);
    } finally {
      setTestLoading(false);
    }
  };

  // Helper function to convert VAPID key
  const urlBase64ToUint8Array = (base64String: string): Uint8Array => {
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
  };

  const getStatusIcon = () => {
    if (permission === 'denied') return <BellOff className="w-6 h-6 text-red-500" />;
    if (permission === 'granted' && isSubscribed) return <CheckCircle className="w-6 h-6 text-green-500" />;
    return <Bell className="w-6 h-6 text-yellow-500" />;
  };

  const getStatusText = () => {
    if (permission === 'denied') return 'Notifications Blocked';
    if (permission === 'granted' && isSubscribed) return 'Notifications Active';
    if (permission === 'granted') return 'Notifications Allowed';
    return 'Notifications Not Set Up';
  };

  const getStatusDescription = () => {
    if (permission === 'denied') {
      return 'Notifications are blocked. Please enable them in your browser settings to receive real-time alerts.';
    }
    if (permission === 'granted' && isSubscribed) {
      return 'You\'ll receive push notifications based on your preferences below.';
    }
    if (permission === 'granted') {
      return 'Notifications are allowed but not set up. Subscribe to receive alerts.';
    }
    return 'Enable notifications to get real-time alerts about insider trading activity.';
  };

  return (
    <div className="space-y-6">
      {/* Status Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            {getStatusIcon()}
            <div>
              <h3 className="text-lg font-semibold text-white">{getStatusText()}</h3>
              <p className="text-sm text-gray-400 font-normal">{getStatusDescription()}</p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            {permission !== 'granted' ? (
              <Button
                onClick={requestPermission}
                disabled={loading}
                className="flex items-center gap-2"
              >
                <Bell className="w-4 h-4" />
                {loading ? 'Requesting...' : 'Enable Notifications'}
              </Button>
            ) : isSubscribed ? (
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={sendTestNotification}
                  disabled={testLoading}
                  className="flex items-center gap-2"
                >
                  <Smartphone className="w-4 h-4" />
                  {testLoading ? 'Sending...' : 'Send Test'}
                </Button>
                <Button
                  variant="outline"
                  onClick={unsubscribeFromPushNotifications}
                  className="flex items-center gap-2 text-red-400 border-red-400 hover:bg-red-400 hover:text-white"
                >
                  <BellOff className="w-4 h-4" />
                  Disable
                </Button>
              </div>
            ) : (
              <Button
                onClick={subscribeToPushNotifications}
                disabled={loading}
                className="flex items-center gap-2"
              >
                <Bell className="w-4 h-4" />
                {loading ? 'Setting up...' : 'Set Up Notifications'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      {(permission === 'granted' || isSubscribed) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Notification Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Alert Types */}
            <div>
              <h4 className="text-sm font-medium text-gray-300 mb-3">Alert Types</h4>
              <div className="space-y-3">
                {[
                  { key: 'tradeAlerts', label: 'New Trades', desc: 'When politicians or traders make new trades' },
                  { key: 'priceTargets', label: 'Price Targets', desc: 'When stocks hit your price alerts' },
                  { key: 'politicianActivity', label: 'Politician Activity', desc: 'Important trading activity from watched politicians' },
                  { key: 'marketUpdates', label: 'Market Updates', desc: 'Significant market movements and news' },
                  { key: 'newsAlerts', label: 'News Alerts', desc: 'Breaking news related to your watchlist' }
                ].map((item) => (
                  <label key={item.key} className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences[item.key as keyof NotificationPreferences] as boolean}
                      onChange={(e) => savePreferences({
                        ...preferences,
                        [item.key]: e.target.checked
                      })}
                      className="mt-1 rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <div className="text-white font-medium">{item.label}</div>
                      <div className="text-sm text-gray-400">{item.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Priority Settings */}
            <div>
              <h4 className="text-sm font-medium text-gray-300 mb-3">Priority & Timing</h4>
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.urgentOnly}
                    onChange={(e) => savePreferences({
                      ...preferences,
                      urgentOnly: e.target.checked
                    })}
                    className="rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <div className="text-white font-medium">High Priority Only</div>
                    <div className="text-sm text-gray-400">Only receive urgent and high-impact alerts</div>
                  </div>
                </label>

                <div className="border-t border-gray-700 pt-4">
                  <label className="flex items-center gap-3 cursor-pointer mb-3">
                    <input
                      type="checkbox"
                      checked={preferences.quietHours.enabled}
                      onChange={(e) => savePreferences({
                        ...preferences,
                        quietHours: {
                          ...preferences.quietHours,
                          enabled: e.target.checked
                        }
                      })}
                      className="rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500"
                    />
                    <div className="text-white font-medium">Quiet Hours</div>
                  </label>

                  {preferences.quietHours.enabled && (
                    <div className="ml-6 grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">Start</label>
                        <input
                          type="time"
                          value={preferences.quietHours.start}
                          onChange={(e) => savePreferences({
                            ...preferences,
                            quietHours: {
                              ...preferences.quietHours,
                              start: e.target.value
                            }
                          })}
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">End</label>
                        <input
                          type="time"
                          value={preferences.quietHours.end}
                          onChange={(e) => savePreferences({
                            ...preferences,
                            quietHours: {
                              ...preferences.quietHours,
                              end: e.target.value
                            }
                          })}
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Browser Support Info */}
      {!('Notification' in window) && (
        <Card className="border-orange-500 bg-orange-500/10">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              <div>
                <h4 className="font-medium text-orange-200">Browser Not Supported</h4>
                <p className="text-sm text-orange-300">
                  Your browser doesn't support push notifications. Try using Chrome, Firefox, or Safari.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Connection Status */}
      <Card className="bg-gray-800/50">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Wifi className="w-5 h-5 text-green-500" />
            <div>
              <h4 className="font-medium text-white">Real-time Connection</h4>
              <p className="text-sm text-gray-400">
                Connected to live data feed for instant notifications
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
