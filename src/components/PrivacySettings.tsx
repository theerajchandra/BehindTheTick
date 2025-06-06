'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent } from '@/components/Card';
import { 
  Shield, 
  Eye, 
  EyeOff, 
  Users, 
  Lock, 
  Globe, 
  Database,
  BarChart3,
  Save
} from 'lucide-react';

interface PrivacySettings {
  profileVisibility: 'public' | 'private' | 'friends';
  showTradeHistory: boolean;
  showWatchlist: boolean;
  allowDataExport: boolean;
  analyticsOptOut: boolean;
}

export default function PrivacySettings() {
  const { user } = useAuth();
  const [settings, setSettings] = useState<PrivacySettings>({
    profileVisibility: 'public',
    showTradeHistory: true,
    showWatchlist: false,
    allowDataExport: true,
    analyticsOptOut: false
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
        if (data.settings?.privacy) {
          setSettings(prev => ({
            ...prev,
            ...data.settings.privacy
          }));
        }
      }
    } catch (error) {
      console.error('Failed to load privacy settings:', error);
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
          privacy: settings
        })
      });

      if (response.ok) {
        setSaveMessage('Privacy settings saved successfully!');
      } else {
        const error = await response.json();
        setSaveMessage(error.error || 'Failed to save settings');
      }

      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      console.error('Failed to save privacy settings:', error);
      setSaveMessage('Failed to save settings. Please try again.');
      setTimeout(() => setSaveMessage(''), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const visibilityOptions = [
    {
      value: 'public',
      label: 'Public',
      description: 'Anyone can view your profile',
      icon: Globe
    },
    {
      value: 'friends',
      label: 'Friends Only',
      description: 'Only your friends can view your profile',
      icon: Users
    },
    {
      value: 'private',
      label: 'Private',
      description: 'Only you can view your profile',
      icon: Lock
    }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Privacy & Security</h1>
        <p className="text-gray-400">Control who can see your information and how your data is used</p>
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
        {/* Profile Visibility */}
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <Shield className="w-5 h-5 text-blue-400 mr-2" />
              <h2 className="text-xl font-semibold text-white">Profile Visibility</h2>
            </div>
            
            <p className="text-gray-400 mb-6">
              Choose who can view your profile and trading activity
            </p>

            <div className="space-y-4">
              {visibilityOptions.map((option) => {
                const IconComponent = option.icon;
                return (
                  <label
                    key={option.value}
                    className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                      settings.profileVisibility === option.value
                        ? 'border-blue-500 bg-blue-500/10'
                        : 'border-gray-600 hover:border-gray-500'
                    }`}
                  >
                    <input
                      type="radio"
                      name="profileVisibility"
                      value={option.value}
                      checked={settings.profileVisibility === option.value}
                      onChange={(e) => setSettings(prev => ({ 
                        ...prev, 
                        profileVisibility: e.target.value as any 
                      }))}
                      className="sr-only"
                    />
                    <IconComponent className="w-6 h-6 text-blue-400 mr-4" />
                    <div>
                      <h3 className="text-white font-medium">{option.label}</h3>
                      <p className="text-gray-400 text-sm">{option.description}</p>
                    </div>
                    <div className="ml-auto">
                      {settings.profileVisibility === option.value && (
                        <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                      )}
                    </div>
                  </label>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Content Visibility */}
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <Eye className="w-5 h-5 text-blue-400 mr-2" />
              <h2 className="text-xl font-semibold text-white">Content Visibility</h2>
            </div>
            
            <p className="text-gray-400 mb-6">
              Control what information is visible to others
            </p>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <BarChart3 className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <h3 className="text-white font-medium">Show Trade History</h3>
                    <p className="text-gray-400 text-sm">Allow others to see your trading activity</p>
                  </div>
                </div>
                <button
                  onClick={() => setSettings(prev => ({ ...prev, showTradeHistory: !prev.showTradeHistory }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.showTradeHistory ? 'bg-blue-600' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.showTradeHistory ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Eye className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <h3 className="text-white font-medium">Show Watchlist</h3>
                    <p className="text-gray-400 text-sm">Make your watchlist visible to others</p>
                  </div>
                </div>
                <button
                  onClick={() => setSettings(prev => ({ ...prev, showWatchlist: !prev.showWatchlist }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.showWatchlist ? 'bg-blue-600' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.showWatchlist ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data & Analytics */}
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <Database className="w-5 h-5 text-blue-400 mr-2" />
              <h2 className="text-xl font-semibold text-white">Data & Analytics</h2>
            </div>
            
            <p className="text-gray-400 mb-6">
              Manage how your data is collected and used
            </p>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Database className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <h3 className="text-white font-medium">Allow Data Export</h3>
                    <p className="text-gray-400 text-sm">Enable the ability to download your data</p>
                  </div>
                </div>
                <button
                  onClick={() => setSettings(prev => ({ ...prev, allowDataExport: !prev.allowDataExport }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.allowDataExport ? 'bg-blue-600' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.allowDataExport ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <BarChart3 className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <h3 className="text-white font-medium">Opt Out of Analytics</h3>
                    <p className="text-gray-400 text-sm">Disable usage analytics and tracking</p>
                  </div>
                </div>
                <button
                  onClick={() => setSettings(prev => ({ ...prev, analyticsOptOut: !prev.analyticsOptOut }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.analyticsOptOut ? 'bg-blue-600' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.analyticsOptOut ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Privacy Notice */}
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <Shield className="w-5 h-5 text-green-400 mr-2" />
              <h2 className="text-xl font-semibold text-white">Your Privacy Matters</h2>
            </div>
            
            <div className="space-y-4 text-gray-300">
              <p>
                We take your privacy seriously. Here's what you should know:
              </p>
              
              <ul className="space-y-2 list-disc list-inside text-sm">
                <li>We never sell your personal data to third parties</li>
                <li>Your trading data is encrypted and securely stored</li>
                <li>You can request deletion of your account at any time</li>
                <li>We use minimal analytics to improve our service</li>
                <li>All data processing complies with GDPR and CCPA</li>
              </ul>

              <div className="flex space-x-4 mt-6">
                <a
                  href="/privacy"
                  className="text-blue-400 hover:text-blue-300 text-sm underline"
                >
                  Privacy Policy
                </a>
                <a
                  href="/terms"
                  className="text-blue-400 hover:text-blue-300 text-sm underline"
                >
                  Terms of Service
                </a>
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
