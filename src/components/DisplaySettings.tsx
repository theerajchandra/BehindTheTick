'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent } from '@/components/Card';
import { 
  Palette, 
  Monitor, 
  Grid3X3, 
  List, 
  RefreshCw, 
  Clock,
  Sun,
  Moon,
  Laptop,
  Save
} from 'lucide-react';

interface DisplaySettings {
  theme: 'light' | 'dark' | 'system';
  defaultView: 'grid' | 'list';
  itemsPerPage: number;
  autoRefresh: boolean;
  compactMode: boolean;
  language: string;
  timezone: string;
  dateFormat: string;
  currency: string;
}

export default function DisplaySettings() {
  const { user } = useAuth();
  const [settings, setSettings] = useState<DisplaySettings>({
    theme: 'dark',
    defaultView: 'grid',
    itemsPerPage: 20,
    autoRefresh: true,
    compactMode: false,
    language: 'en',
    timezone: 'UTC',
    dateFormat: 'MM/dd/yyyy',
    currency: 'USD'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    loadSettings();
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
        if (data.settings?.display) {
          setSettings(prev => ({
            ...prev,
            ...data.settings.display
          }));
        }
      }
    } catch (error) {
      console.error('Failed to load display settings:', error);
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
          display: settings
        })
      });

      if (response.ok) {
        setSaveMessage('Display settings saved successfully!');
        
        // Apply theme change immediately
        if (settings.theme === 'dark') {
          document.documentElement.classList.add('dark');
        } else if (settings.theme === 'light') {
          document.documentElement.classList.remove('dark');
        } else {
          // System theme
          const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          if (prefersDark) {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        }
      } else {
        const error = await response.json();
        setSaveMessage(error.error || 'Failed to save settings');
      }

      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      console.error('Failed to save display settings:', error);
      setSaveMessage('Failed to save settings. Please try again.');
      setTimeout(() => setSaveMessage(''), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const themeOptions = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'System', icon: Laptop }
  ];

  const viewOptions = [
    { value: 'grid', label: 'Grid View', icon: Grid3X3 },
    { value: 'list', label: 'List View', icon: List }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Display & Theme</h1>
        <p className="text-gray-400">Customize how BehindTheTick looks and feels</p>
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
        {/* Theme Settings */}
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <Palette className="w-5 h-5 text-blue-400 mr-2" />
              <h2 className="text-xl font-semibold text-white">Theme</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {themeOptions.map((option) => {
                const IconComponent = option.icon;
                return (
                  <button
                    key={option.value}
                    onClick={() => setSettings(prev => ({ ...prev, theme: option.value as any }))}
                    className={`p-4 border-2 rounded-lg transition-colors ${
                      settings.theme === option.value
                        ? 'border-blue-500 bg-blue-500/10'
                        : 'border-gray-600 hover:border-gray-500'
                    }`}
                  >
                    <IconComponent className="w-8 h-8 text-white mx-auto mb-2" />
                    <p className="text-white font-medium">{option.label}</p>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Layout Settings */}
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <Monitor className="w-5 h-5 text-blue-400 mr-2" />
              <h2 className="text-xl font-semibold text-white">Layout</h2>
            </div>
            
            <div className="space-y-6">
              {/* Default View */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Default View
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {viewOptions.map((option) => {
                    const IconComponent = option.icon;
                    return (
                      <button
                        key={option.value}
                        onClick={() => setSettings(prev => ({ ...prev, defaultView: option.value as any }))}
                        className={`p-4 border-2 rounded-lg transition-colors ${
                          settings.defaultView === option.value
                            ? 'border-blue-500 bg-blue-500/10'
                            : 'border-gray-600 hover:border-gray-500'
                        }`}
                      >
                        <IconComponent className="w-6 h-6 text-white mx-auto mb-2" />
                        <p className="text-white font-medium">{option.label}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Items Per Page */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Items Per Page: {settings.itemsPerPage}
                </label>
                <input
                  type="range"
                  min="10"
                  max="100"
                  step="10"
                  value={settings.itemsPerPage}
                  onChange={(e) => setSettings(prev => ({ ...prev, itemsPerPage: parseInt(e.target.value) }))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>10</span>
                  <span>50</span>
                  <span>100</span>
                </div>
              </div>

              {/* Toggles */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <RefreshCw className="w-5 h-5 text-gray-400 mr-2" />
                    <div>
                      <h3 className="text-white font-medium">Auto Refresh</h3>
                      <p className="text-gray-400 text-sm">Automatically refresh data every few minutes</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSettings(prev => ({ ...prev, autoRefresh: !prev.autoRefresh }))}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.autoRefresh ? 'bg-blue-600' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.autoRefresh ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Grid3X3 className="w-5 h-5 text-gray-400 mr-2" />
                    <div>
                      <h3 className="text-white font-medium">Compact Mode</h3>
                      <p className="text-gray-400 text-sm">Show more content in less space</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSettings(prev => ({ ...prev, compactMode: !prev.compactMode }))}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.compactMode ? 'bg-blue-600' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.compactMode ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Localization Settings */}
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <Clock className="w-5 h-5 text-blue-400 mr-2" />
              <h2 className="text-xl font-semibold text-white">Localization</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Language
                </label>
                <select
                  value={settings.language}
                  onChange={(e) => setSettings(prev => ({ ...prev, language: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                >
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                  <option value="de">Deutsch</option>
                  <option value="zh">中文</option>
                  <option value="ja">日本語</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Timezone
                </label>
                <select
                  value={settings.timezone}
                  onChange={(e) => setSettings(prev => ({ ...prev, timezone: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                >
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">Eastern Time</option>
                  <option value="America/Chicago">Central Time</option>
                  <option value="America/Denver">Mountain Time</option>
                  <option value="America/Los_Angeles">Pacific Time</option>
                  <option value="Europe/London">London</option>
                  <option value="Europe/Paris">Paris</option>
                  <option value="Asia/Tokyo">Tokyo</option>
                  <option value="Asia/Shanghai">Shanghai</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Date Format
                </label>
                <select
                  value={settings.dateFormat}
                  onChange={(e) => setSettings(prev => ({ ...prev, dateFormat: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                >
                  <option value="MM/dd/yyyy">MM/DD/YYYY</option>
                  <option value="dd/MM/yyyy">DD/MM/YYYY</option>
                  <option value="yyyy-MM-dd">YYYY-MM-DD</option>
                  <option value="MMM dd, yyyy">MMM DD, YYYY</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Currency
                </label>
                <select
                  value={settings.currency}
                  onChange={(e) => setSettings(prev => ({ ...prev, currency: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                >
                  <option value="USD">USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="GBP">GBP - British Pound</option>
                  <option value="JPY">JPY - Japanese Yen</option>
                  <option value="CAD">CAD - Canadian Dollar</option>
                  <option value="AUD">AUD - Australian Dollar</option>
                </select>
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
