'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent } from '@/components/Card';
import { 
  Smartphone, 
  Bell, 
  Fingerprint, 
  Wifi, 
  Download, 
  MapPin,
  Save,
  Monitor,
  Vibrate,
  BatteryLow,
  Shield
} from 'lucide-react';

interface MobileSettings {
  pushNotifications: boolean;
  biometricAuth: boolean;
  offlineMode: boolean;
  dataUsage: 'unlimited' | 'wifi-only' | 'conservative';
  location: boolean;
}

export default function MobileSettings() {
  const { user } = useAuth();
  const [settings, setSettings] = useState<MobileSettings>({
    pushNotifications: false,
    biometricAuth: false,
    offlineMode: true,
    dataUsage: 'wifi-only',
    location: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [isPWAInstalled, setIsPWAInstalled] = useState(false);
  const [canInstallPWA, setCanInstallPWA] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    loadSettings();
    checkPWAStatus();
    setupPWAInstallPrompt();
  }, [user]);

  const loadSettings = async () => {
    if (!user) return;

    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/user/settings', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.settings?.mobile) {
          setSettings(prev => ({
            ...prev,
            ...data.settings.mobile
          }));
        }
      }
    } catch (error) {
      console.error('Failed to load mobile settings:', error);
    }
  };

  const saveSettings = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/user/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          mobile: settings
        })
      });

      if (response.ok) {
        setSaveMessage('Mobile settings saved successfully!');
        
        // Apply settings immediately
        if (settings.pushNotifications && 'serviceWorker' in navigator) {
          // Request notification permission if enabled
          if (Notification.permission === 'default') {
            await Notification.requestPermission();
          }
        }
      } else {
        const error = await response.json();
        setSaveMessage(error.error || 'Failed to save settings');
      }

      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      console.error('Failed to save mobile settings:', error);
      setSaveMessage('Failed to save settings. Please try again.');
      setTimeout(() => setSaveMessage(''), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const checkPWAStatus = () => {
    // Check if PWA is already installed
    const isInstalled = window.matchMedia('(display-mode: standalone)').matches ||
                       (window.navigator as any).standalone ||
                       document.referrer.includes('android-app://');
    setIsPWAInstalled(isInstalled);
  };

  const setupPWAInstallPrompt = () => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setCanInstallPWA(true);
    });

    window.addEventListener('appinstalled', () => {
      setIsPWAInstalled(true);
      setCanInstallPWA(false);
      setDeferredPrompt(null);
    });
  };

  const installPWA = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        setCanInstallPWA(false);
        setDeferredPrompt(null);
      }
    }
  };

  const dataUsageOptions = [
    {
      value: 'unlimited',
      label: 'Unlimited',
      description: 'Use data freely for all features',
      icon: Wifi
    },
    {
      value: 'wifi-only',
      label: 'Wi-Fi Only',
      description: 'Only sync when connected to Wi-Fi',
      icon: Wifi
    },
    {
      value: 'conservative',
      label: 'Conservative',
      description: 'Minimal data usage, essential features only',
      icon: BatteryLow
    }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Mobile & PWA</h1>
        <p className="text-gray-400">Configure mobile app settings and progressive web app features</p>
      </div>

      {saveMessage && (
        <div className={`mb-6 p-4 rounded-lg ${
          saveMessage.includes('successfully') 
            ? 'bg-green-600/20 text-green-300 border border-green-600' 
            : 'bg-red-600/20 text-red-300 border border-red-600'
        }`}>
          {saveMessage}
        </div>
      )}

      <div className="space-y-6">
        {/* PWA Installation */}
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <Monitor className="w-5 h-5 text-blue-400 mr-2" />
              <h2 className="text-xl font-semibold text-white">Progressive Web App</h2>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white font-medium mb-2">Install BehindTheTick</h3>
                <p className="text-gray-400 text-sm mb-4">
                  {isPWAInstalled 
                    ? 'BehindTheTick is installed and ready to use offline!'
                    : 'Install BehindTheTick as an app for a better mobile experience'
                  }
                </p>
                {isPWAInstalled && (
                  <div className="flex items-center text-green-400 text-sm">
                    <Shield className="w-4 h-4 mr-1" />
                    <span>Installed and secure</span>
                  </div>
                )}
              </div>
              
              {canInstallPWA && !isPWAInstalled && (
                <button
                  onClick={installPWA}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Install App</span>
                </button>
              )}
              
              {isPWAInstalled && (
                <div className="flex items-center text-green-400">
                  <Shield className="w-5 h-5" />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <Bell className="w-5 h-5 text-blue-400 mr-2" />
              <h2 className="text-xl font-semibold text-white">Mobile Notifications</h2>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Bell className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <h3 className="text-white font-medium">Push Notifications</h3>
                    <p className="text-gray-400 text-sm">Receive notifications on your mobile device</p>
                  </div>
                </div>
                <button
                  onClick={() => setSettings(prev => ({ ...prev, pushNotifications: !prev.pushNotifications }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.pushNotifications ? 'bg-blue-600' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.pushNotifications ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {settings.pushNotifications && (
                <div className="ml-8 p-4 bg-blue-600/10 border border-blue-600/20 rounded-lg">
                  <p className="text-blue-300 text-sm">
                    Notification permission: <strong>{Notification.permission}</strong>
                  </p>
                  {Notification.permission === 'denied' && (
                    <p className="text-red-300 text-sm mt-1">
                      Please enable notifications in your browser settings to receive alerts.
                    </p>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <Shield className="w-5 h-5 text-blue-400 mr-2" />
              <h2 className="text-xl font-semibold text-white">Security</h2>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Fingerprint className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <h3 className="text-white font-medium">Biometric Authentication</h3>
                    <p className="text-gray-400 text-sm">Use fingerprint or face ID for quick access</p>
                  </div>
                </div>
                <button
                  onClick={() => setSettings(prev => ({ ...prev, biometricAuth: !prev.biometricAuth }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.biometricAuth ? 'bg-blue-600' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.biometricAuth ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <h3 className="text-white font-medium">Location Services</h3>
                    <p className="text-gray-400 text-sm">Allow location access for relevant market data</p>
                  </div>
                </div>
                <button
                  onClick={() => setSettings(prev => ({ ...prev, location: !prev.location }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.location ? 'bg-blue-600' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.location ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance Settings */}
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <Smartphone className="w-5 h-5 text-blue-400 mr-2" />
              <h2 className="text-xl font-semibold text-white">Performance</h2>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Download className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <h3 className="text-white font-medium">Offline Mode</h3>
                    <p className="text-gray-400 text-sm">Cache data for offline access</p>
                  </div>
                </div>
                <button
                  onClick={() => setSettings(prev => ({ ...prev, offlineMode: !prev.offlineMode }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.offlineMode ? 'bg-blue-600' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.offlineMode ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Data Usage */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Data Usage Preference
                </label>
                <div className="space-y-3">
                  {dataUsageOptions.map((option) => {
                    const IconComponent = option.icon;
                    return (
                      <label
                        key={option.value}
                        className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                          settings.dataUsage === option.value
                            ? 'border-blue-500 bg-blue-500/10'
                            : 'border-gray-600 hover:border-gray-500'
                        }`}
                      >
                        <input
                          type="radio"
                          name="dataUsage"
                          value={option.value}
                          checked={settings.dataUsage === option.value}
                          onChange={(e) => setSettings(prev => ({ 
                            ...prev, 
                            dataUsage: e.target.value as any 
                          }))}
                          className="sr-only"
                        />
                        <IconComponent className="w-5 h-5 text-blue-400 mr-3" />
                        <div className="flex-1">
                          <h3 className="text-white font-medium">{option.label}</h3>
                          <p className="text-gray-400 text-sm">{option.description}</p>
                        </div>
                        <div className="ml-auto">
                          {settings.dataUsage === option.value && (
                            <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                          )}
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Mobile Tips */}
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <Smartphone className="w-5 h-5 text-green-400 mr-2" />
              <h2 className="text-xl font-semibold text-white">Mobile Tips</h2>
            </div>
            
            <div className="space-y-4 text-gray-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-700 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Download className="w-4 h-4 text-blue-400 mr-2" />
                    <h3 className="text-white font-medium">Install as App</h3>
                  </div>
                  <p className="text-sm text-gray-400">
                    Add BehindTheTick to your home screen for quick access and offline functionality.
                  </p>
                </div>
                
                <div className="p-4 bg-gray-700 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Bell className="w-4 h-4 text-blue-400 mr-2" />
                    <h3 className="text-white font-medium">Stay Updated</h3>
                  </div>
                  <p className="text-sm text-gray-400">
                    Enable notifications to get real-time alerts about trades and market changes.
                  </p>
                </div>
                
                <div className="p-4 bg-gray-700 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Wifi className="w-4 h-4 text-blue-400 mr-2" />
                    <h3 className="text-white font-medium">Save Data</h3>
                  </div>
                  <p className="text-sm text-gray-400">
                    Use Wi-Fi only mode to conserve mobile data while still getting updates.
                  </p>
                </div>
                
                <div className="p-4 bg-gray-700 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Shield className="w-4 h-4 text-blue-400 mr-2" />
                    <h3 className="text-white font-medium">Stay Secure</h3>
                  </div>
                  <p className="text-sm text-gray-400">
                    Enable biometric authentication for quick and secure access to your account.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={saveSettings}
            disabled={isLoading}
            className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>{isLoading ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
