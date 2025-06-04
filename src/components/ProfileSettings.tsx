'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNotifications } from '@/lib/notifications';
import { useIndexedDB } from '@/lib/indexedDB';
import { 
  User, 
  Bell, 
  Palette, 
  Shield, 
  Download, 
  Upload,
  Trash2,
  Save,
  Mail,
  Smartphone,
  Globe,
  Eye,
  EyeOff,
  Star,
  Settings,
  HelpCircle
} from 'lucide-react';

interface NotificationSettings {
  email: boolean;
  push: boolean;
  trades: boolean;
  priceAlerts: boolean;
  news: boolean;
  marketing: boolean;
  frequency: 'instant' | 'daily' | 'weekly';
}

interface PrivacySettings {
  profileVisibility: 'public' | 'private' | 'friends';
  showTradeHistory: boolean;
  showWatchlist: boolean;
  allowDataExport: boolean;
  analyticsOptOut: boolean;
}

export default function ProfileSettings() {
  const { user, updateProfile, logout } = useAuth();
  const notifications = useNotifications();
  const dbManager = useIndexedDB();
  
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  
  // Profile state
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    avatar: user?.avatar || '',
    bio: '',
    location: '',
    website: '',
    twitter: '',
    linkedin: ''
  });
  
  // Notification state
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    email: true,
    push: false,
    trades: true,
    priceAlerts: true,
    news: false,
    marketing: false,
    frequency: 'daily'
  });
  
  // Privacy state
  const [privacySettings, setPrivacySettings] = useState<PrivacySettings>({
    profileVisibility: 'public',
    showTradeHistory: true,
    showWatchlist: false,
    allowDataExport: true,
    analyticsOptOut: false
  });
  
  // Theme and display
  const [displaySettings, setDisplaySettings] = useState({
    theme: 'dark',
    defaultView: 'grid',
    itemsPerPage: 20,
    autoRefresh: true,
    compactMode: false
  });

  useEffect(() => {
    if (user) {
      // Load user preferences from IndexedDB
      loadUserPreferences();
      
      // Initialize notifications
      notifications.init();
    }
  }, [user]);

  const loadUserPreferences = async () => {
    if (!user) return;
    
    try {
      const preferences = await dbManager.getUserPreferences(user.id);
      if (preferences) {
        setNotificationSettings(preferences.notifications || notificationSettings);
        setPrivacySettings(preferences.privacy || privacySettings);
        setDisplaySettings(preferences.display || displaySettings);
      }
    } catch (error) {
      console.error('Failed to load user preferences:', error);
    }
  };

  const saveUserPreferences = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const preferences = {
        notifications: notificationSettings,
        privacy: privacySettings,
        display: displaySettings,
        lastUpdated: new Date().toISOString()
      };
      
      await dbManager.setUserPreferences(user.id, preferences);
      
      // Also update the auth context
      await updateProfile({
        preferences: {
          ...user.preferences,
          ...preferences
        }
      });
      
      setSaveMessage('Settings saved successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      console.error('Failed to save preferences:', error);
      setSaveMessage('Failed to save settings. Please try again.');
      setTimeout(() => setSaveMessage(''), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNotificationPermission = async () => {
    const permission = await notifications.requestPermission();
    if (permission === 'granted') {
      setNotificationSettings(prev => ({ ...prev, push: true }));
      
      // Subscribe to push notifications
      await notifications.subscribeToPush();
    }
  };

  const exportUserData = async () => {
    if (!user) return;
    
    try {
      const watchlist = await dbManager.getWatchlist(user.id);
      const preferences = await dbManager.getUserPreferences(user.id);
      
      const exportData = {
        profile: profileData,
        preferences,
        watchlist,
        exportDate: new Date().toISOString()
      };
      
      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json'
      });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `behindthetick-data-${user.id}-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export data:', error);
    }
  };

  const deleteAccount = async () => {
    if (!user) return;
    
    const confirmed = window.confirm(
      'Are you sure you want to delete your account? This action cannot be undone.'
    );
    
    if (confirmed) {
      try {
        // Clear local data
        await dbManager.clearExpiredCache(0); // Clear all cache
        localStorage.clear();
        sessionStorage.clear();
        
        // Log out user
        logout();
        
        // In a real app, you would also call an API to delete the account
        // await fetch('/api/auth/delete-account', { method: 'DELETE' });
      } catch (error) {
        console.error('Failed to delete account:', error);
      }
    }
  };

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'display', name: 'Display', icon: Palette },
    { id: 'privacy', name: 'Privacy', icon: Shield },
    { id: 'data', name: 'Data & Export', icon: Download }
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Account Settings</h1>
        <p className="text-gray-400">Manage your account preferences and privacy settings</p>
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

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <div className="lg:w-64">
          <nav className="space-y-2">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <IconComponent className="w-5 h-5" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="bg-gray-800 rounded-lg p-6">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white mb-4">Profile Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Bio
                    </label>
                    <textarea
                      value={profileData.bio}
                      onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                      rows={3}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                      placeholder="Tell us about yourself..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      value={profileData.location}
                      onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                      placeholder="City, Country"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Website
                    </label>
                    <input
                      type="url"
                      value={profileData.website}
                      onChange={(e) => setProfileData(prev => ({ ...prev, website: e.target.value }))}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                      placeholder="https://example.com"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white mb-4">Notification Preferences</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-white font-medium">Push Notifications</h3>
                      <p className="text-gray-400 text-sm">Receive notifications in your browser</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={handleNotificationPermission}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          notificationSettings.push ? 'bg-blue-600' : 'bg-gray-600'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            notificationSettings.push ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-white font-medium">Email Notifications</h3>
                      <p className="text-gray-400 text-sm">Receive updates via email</p>
                    </div>
                    <button
                      onClick={() => setNotificationSettings(prev => ({ ...prev, email: !prev.email }))}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        notificationSettings.email ? 'bg-blue-600' : 'bg-gray-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          notificationSettings.email ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-white font-medium">Trade Alerts</h3>
                      <p className="text-gray-400 text-sm">Get notified of new insider trades</p>
                    </div>
                    <button
                      onClick={() => setNotificationSettings(prev => ({ ...prev, trades: !prev.trades }))}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        notificationSettings.trades ? 'bg-blue-600' : 'bg-gray-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          notificationSettings.trades ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-white font-medium">Price Alerts</h3>
                      <p className="text-gray-400 text-sm">Notifications for watchlist price changes</p>
                    </div>
                    <button
                      onClick={() => setNotificationSettings(prev => ({ ...prev, priceAlerts: !prev.priceAlerts }))}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        notificationSettings.priceAlerts ? 'bg-blue-600' : 'bg-gray-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          notificationSettings.priceAlerts ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Notification Frequency
                    </label>
                    <select
                      value={notificationSettings.frequency}
                      onChange={(e) => setNotificationSettings(prev => ({ 
                        ...prev, 
                        frequency: e.target.value as 'instant' | 'daily' | 'weekly'
                      }))}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                    >
                      <option value="instant">Instant</option>
                      <option value="daily">Daily Digest</option>
                      <option value="weekly">Weekly Summary</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Privacy Tab */}
            {activeTab === 'privacy' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white mb-4">Privacy Settings</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Profile Visibility
                    </label>
                    <select
                      value={privacySettings.profileVisibility}
                      onChange={(e) => setPrivacySettings(prev => ({ 
                        ...prev, 
                        profileVisibility: e.target.value as 'public' | 'private' | 'friends'
                      }))}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                    >
                      <option value="public">Public</option>
                      <option value="friends">Friends Only</option>
                      <option value="private">Private</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-white font-medium">Show Trade History</h3>
                      <p className="text-gray-400 text-sm">Allow others to see your trading activity</p>
                    </div>
                    <button
                      onClick={() => setPrivacySettings(prev => ({ ...prev, showTradeHistory: !prev.showTradeHistory }))}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        privacySettings.showTradeHistory ? 'bg-blue-600' : 'bg-gray-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          privacySettings.showTradeHistory ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-white font-medium">Show Watchlist</h3>
                      <p className="text-gray-400 text-sm">Make your watchlist visible to others</p>
                    </div>
                    <button
                      onClick={() => setPrivacySettings(prev => ({ ...prev, showWatchlist: !prev.showWatchlist }))}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        privacySettings.showWatchlist ? 'bg-blue-600' : 'bg-gray-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          privacySettings.showWatchlist ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Data & Export Tab */}
            {activeTab === 'data' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white mb-4">Data Management</h2>
                
                <div className="space-y-4">
                  <div className="p-4 border border-gray-600 rounded-lg">
                    <h3 className="text-white font-medium mb-2">Export Your Data</h3>
                    <p className="text-gray-400 text-sm mb-4">
                      Download a copy of your profile, preferences, and watchlist data.
                    </p>
                    <button
                      onClick={exportUserData}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      <span>Export Data</span>
                    </button>
                  </div>
                  
                  <div className="p-4 border border-red-600 rounded-lg">
                    <h3 className="text-white font-medium mb-2">Delete Account</h3>
                    <p className="text-gray-400 text-sm mb-4">
                      Permanently delete your account and all associated data. This action cannot be undone.
                    </p>
                    <button
                      onClick={deleteAccount}
                      className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete Account</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="mt-8 pt-6 border-t border-gray-700">
              <button
                onClick={saveUserPreferences}
                disabled={isLoading}
                className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>{isLoading ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
