'use client';

import { useState, useEffect } from 'react';
import { DefaultLayout } from '@/layouts/DefaultLayout';
import { Card, CardContent } from '@/components/Card';
import ProfileSettings from '@/components/ProfileSettings';
import PushNotificationSetup from '@/components/PushNotificationSetup';
import DisplaySettings from '@/components/DisplaySettings';
import PrivacySettings from '@/components/PrivacySettings';
import MobileSettings from '@/components/MobileSettings';
import DataExportSettings from '@/components/DataExportSettings';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { 
  User, 
  Bell, 
  Palette, 
  Shield, 
  Download, 
  Smartphone,
  Settings as SettingsIcon,
  ChevronRight,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

export default function SettingsPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [activeSection, setActiveSection] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    // Load user settings
    loadUserSettings();
  }, [isAuthenticated, router]);

  const loadUserSettings = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/user/settings', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setSettings(data.settings);
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const settingSections = [
    {
      id: 'overview',
      name: 'Overview',
      icon: SettingsIcon,
      description: 'Account summary and quick settings'
    },
    {
      id: 'profile',
      name: 'Profile & Account',
      icon: User,
      description: 'Personal information and account details'
    },
    {
      id: 'notifications',
      name: 'Notifications',
      icon: Bell,
      description: 'Push notifications and alert preferences'
    },
    {
      id: 'display',
      name: 'Display & Theme',
      icon: Palette,
      description: 'Appearance and layout preferences'
    },
    {
      id: 'privacy',
      name: 'Privacy & Security',
      icon: Shield,
      description: 'Privacy settings and data controls'
    },
    {
      id: 'mobile',
      name: 'Mobile & PWA',
      icon: Smartphone,
      description: 'Mobile app and progressive web app settings'
    },
    {
      id: 'data',
      name: 'Data & Export',
      icon: Download,
      description: 'Data management and export options'
    }
  ];

  if (isLoading) {
    return (
      <DefaultLayout>
        <div className="min-h-screen bg-gray-900 pt-20">
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          </div>
        </div>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <div className="min-h-screen bg-gray-900 pt-20">
        <div className="container mx-auto px-4 py-8">
          {activeSection === 'overview' && (
            <div className="max-w-6xl mx-auto">
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
                <p className="text-gray-400">Manage your BehindTheTick account and preferences</p>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card className="bg-gray-800 border-gray-700">
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <div className="p-3 bg-blue-600 rounded-lg">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-white font-medium">Account Type</h3>
                        <p className="text-sm text-gray-400 capitalize">{user?.subscription || 'Free'}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-800 border-gray-700">
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <div className="p-3 bg-green-600 rounded-lg">
                        <CheckCircle className="w-6 h-6 text-white" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-white font-medium">Profile Status</h3>
                        <p className="text-sm text-gray-400">Complete</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-800 border-gray-700">
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <div className="p-3 bg-orange-600 rounded-lg">
                        <Bell className="w-6 h-6 text-white" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-white font-medium">Notifications</h3>
                        <p className="text-sm text-gray-400">
                          {settings?.notifications?.push ? 'Enabled' : 'Disabled'}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Settings Sections */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {settingSections.slice(1).map((section) => {
                  const IconComponent = section.icon;
                  return (
                    <Card key={section.id} className="bg-gray-800 border-gray-700 hover:border-gray-600 transition-colors cursor-pointer" onClick={() => setActiveSection(section.id)}>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="p-3 bg-gray-700 rounded-lg">
                              <IconComponent className="w-6 h-6 text-blue-400" />
                            </div>
                            <div className="ml-4">
                              <h3 className="text-white font-medium">{section.name}</h3>
                              <p className="text-sm text-gray-400">{section.description}</p>
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-gray-400" />
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {activeSection === 'profile' && (
            <div>
              <div className="mb-6">
                <button
                  onClick={() => setActiveSection('overview')}
                  className="flex items-center text-blue-400 hover:text-blue-300 mb-4"
                >
                  <ChevronRight className="w-4 h-4 rotate-180 mr-1" />
                  Back to Settings
                </button>
              </div>
              <ProfileSettings />
            </div>
          )}

          {activeSection === 'notifications' && (
            <div>
              <div className="mb-6">
                <button
                  onClick={() => setActiveSection('overview')}
                  className="flex items-center text-blue-400 hover:text-blue-300 mb-4"
                >
                  <ChevronRight className="w-4 h-4 rotate-180 mr-1" />
                  Back to Settings
                </button>
              </div>
              <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                  <h1 className="text-3xl font-bold text-white mb-2">Notification Settings</h1>
                  <p className="text-gray-400">Manage how you receive alerts and updates</p>
                </div>
                <PushNotificationSetup />
              </div>
            </div>
          )}

          {activeSection === 'display' && (
            <div>
              <div className="mb-6">
                <button
                  onClick={() => setActiveSection('overview')}
                  className="flex items-center text-blue-400 hover:text-blue-300 mb-4"
                >
                  <ChevronRight className="w-4 h-4 rotate-180 mr-1" />
                  Back to Settings
                </button>
              </div>
              <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                  <h1 className="text-3xl font-bold text-white mb-2">Display & Theme</h1>
                  <p className="text-gray-400">Customize your appearance and layout preferences</p>
                </div>
                <DisplaySettings />
              </div>
            </div>
          )}

          {activeSection === 'privacy' && (
            <div>
              <div className="mb-6">
                <button
                  onClick={() => setActiveSection('overview')}
                  className="flex items-center text-blue-400 hover:text-blue-300 mb-4"
                >
                  <ChevronRight className="w-4 h-4 rotate-180 mr-1" />
                  Back to Settings
                </button>
              </div>
              <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                  <h1 className="text-3xl font-bold text-white mb-2">Privacy & Security</h1>
                  <p className="text-gray-400">Manage your privacy settings and data controls</p>
                </div>
                <PrivacySettings />
              </div>
            </div>
          )}

          {activeSection === 'mobile' && (
            <div>
              <div className="mb-6">
                <button
                  onClick={() => setActiveSection('overview')}
                  className="flex items-center text-blue-400 hover:text-blue-300 mb-4"
                >
                  <ChevronRight className="w-4 h-4 rotate-180 mr-1" />
                  Back to Settings
                </button>
              </div>
              <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                  <h1 className="text-3xl font-bold text-white mb-2">Mobile & PWA</h1>
                  <p className="text-gray-400">Configure mobile app and progressive web app settings</p>
                </div>
                <MobileSettings />
              </div>
            </div>
          )}

          {activeSection === 'data' && (
            <div>
              <div className="mb-6">
                <button
                  onClick={() => setActiveSection('overview')}
                  className="flex items-center text-blue-400 hover:text-blue-300 mb-4"
                >
                  <ChevronRight className="w-4 h-4 rotate-180 mr-1" />
                  Back to Settings
                </button>
              </div>
              <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                  <h1 className="text-3xl font-bold text-white mb-2">Data & Export</h1>
                  <p className="text-gray-400">Manage your data export and account deletion options</p>
                </div>
                <DataExportSettings />
              </div>
            </div>
          )}
        </div>
      </div>
    </DefaultLayout>
  );
}
