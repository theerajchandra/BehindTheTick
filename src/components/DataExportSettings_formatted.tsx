'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent } from '@/components/Card';
import { 
  Download, 
  Upload, 
  Trash2, 
  Database, 
  FileJson,
  FileText,
  Calendar,
  Shield,
  Save,
  AlertTriangle,
  CheckCircle,
  User,
  List,
  RefreshCw
} from 'lucide-react';

interface ExportSettings {
  format: 'json' | 'csv';
  includeWatchlist: boolean;
  includePreferences: boolean;
  includeActivity: boolean;
  dateRange: 'all' | '1year' | '6months' | '3months';
}

export default function DataExportSettings() {
  const { user } = useAuth();
  const [exportSettings, setExportSettings] = useState<ExportSettings>({
    format: 'json',
    includeWatchlist: true,
    includePreferences: true,
    includeActivity: false,
    dateRange: 'all'
  });
  const [isExporting, setIsExporting] = useState(false);
  const [exportMessage, setExportMessage] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [lastExport, setLastExport] = useState<string | null>(null);

  useEffect(() => {
    loadExportHistory();
  }, []);

  const loadExportHistory = () => {
    const lastExportDate = localStorage.getItem('lastExportDate');
    if (lastExportDate) {
      setLastExport(lastExportDate);
    }
  };

  const exportData = async () => {
    if (!user) return;
    
    setIsExporting(true);
    setExportMessage('');
    
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/user/export', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(exportSettings)
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        const filename = `behindthetick-export-${new Date().toISOString().split('T')[0]}.${exportSettings.format}`;
        
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        // Store export timestamp
        const exportDate = new Date().toISOString();
        localStorage.setItem('lastExportDate', exportDate);
        setLastExport(exportDate);
        
        setExportMessage('Data exported successfully!');
      } else {
        setExportMessage('Failed to export data. Please try again.');
      }
    } catch (error) {
      console.error('Export error:', error);
      setExportMessage('Failed to export data. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const clearLocalData = async () => {
    try {
      // Clear IndexedDB data
      if ('indexedDB' in window) {
        const databases = await indexedDB.databases();
        await Promise.all(
          databases.map(db => {
            if (db.name?.includes('behindthetick')) {
              return new Promise((resolve, reject) => {
                const deleteReq = indexedDB.deleteDatabase(db.name!);
                deleteReq.onsuccess = () => resolve(undefined);
                deleteReq.onerror = () => reject(deleteReq.error);
              });
            }
          })
        );
      }

      // Clear localStorage
      const keysToRemove = Object.keys(localStorage).filter(key => 
        key.startsWith('behindthetick_') || key.includes('watchlist') || key.includes('preferences')
      );
      keysToRemove.forEach(key => localStorage.removeItem(key));

      setExportMessage('Local data cleared successfully!');
    } catch (error) {
      console.error('Clear data error:', error);
      setExportMessage('Failed to clear local data.');
    }
  };

  const handleAccountDeletion = async () => {
    if (!deletePassword.trim()) {
      setExportMessage('Please enter your password to confirm account deletion.');
      return;
    }

    setIsDeleting(true);
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/user/delete-account', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password: deletePassword })
      });

      if (response.ok) {
        // Clear all local data
        localStorage.clear();
        sessionStorage.clear();
        
        // Redirect to homepage
        window.location.href = '/';
      } else {
        const error = await response.json();
        setExportMessage(error.message || 'Failed to delete account. Please try again.');
      }
    } catch (error) {
      console.error('Account deletion error:', error);
      setExportMessage('Failed to delete account. Please try again.');
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
      setDeletePassword('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Export Settings */}
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-6">
          <div className="flex items-center mb-6">
            <Download className="w-6 h-6 text-blue-400 mr-3" />
            <div>
              <h2 className="text-xl font-semibold text-white">Data Export</h2>
              <p className="text-gray-400 text-sm">Download your BehindTheTick data</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Export Format */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Export Format
              </label>
              <div className="space-y-2">
                <label className="flex items-center space-x-3 p-3 border border-gray-600 rounded-lg hover:border-gray-500 cursor-pointer">
                  <input
                    type="radio"
                    name="format"
                    value="json"
                    checked={exportSettings.format === 'json'}
                    onChange={(e) => setExportSettings(prev => ({ ...prev, format: e.target.value as 'json' | 'csv' }))}
                    className="text-blue-500"
                  />
                  <FileJson className="w-5 h-5 text-blue-400" />
                  <div>
                    <span className="text-white font-medium">JSON</span>
                    <p className="text-xs text-gray-400">Structured data format</p>
                  </div>
                </label>
                <label className="flex items-center space-x-3 p-3 border border-gray-600 rounded-lg hover:border-gray-500 cursor-pointer">
                  <input
                    type="radio"
                    name="format"
                    value="csv"
                    checked={exportSettings.format === 'csv'}
                    onChange={(e) => setExportSettings(prev => ({ ...prev, format: e.target.value as 'json' | 'csv' }))}
                    className="text-blue-500"
                  />
                  <FileText className="w-5 h-5 text-green-400" />
                  <div>
                    <span className="text-white font-medium">CSV</span>
                    <p className="text-xs text-gray-400">Spreadsheet compatible</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Data Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Include Data
              </label>
              <div className="space-y-3">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={exportSettings.includeWatchlist}
                    onChange={(e) => setExportSettings(prev => ({ ...prev, includeWatchlist: e.target.checked }))}
                    className="rounded text-blue-500"
                  />
                  <List className="w-4 h-4 text-gray-400" />
                  <span className="text-white">Watchlist & Tickers</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={exportSettings.includePreferences}
                    onChange={(e) => setExportSettings(prev => ({ ...prev, includePreferences: e.target.checked }))}
                    className="rounded text-blue-500"
                  />
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="text-white">Settings & Preferences</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={exportSettings.includeActivity}
                    onChange={(e) => setExportSettings(prev => ({ ...prev, includeActivity: e.target.checked }))}
                    className="rounded text-blue-500"
                  />
                  <Database className="w-4 h-4 text-gray-400" />
                  <span className="text-white">Activity History</span>
                </label>
              </div>
            </div>
          </div>

          {/* Date Range */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Date Range
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {[
                { value: 'all', label: 'All Time' },
                { value: '1year', label: 'Past Year' },
                { value: '6months', label: '6 Months' },
                { value: '3months', label: '3 Months' }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setExportSettings(prev => ({ ...prev, dateRange: option.value as any }))}
                  className={`p-2 text-sm rounded-lg border transition-colors ${
                    exportSettings.dateRange === option.value
                      ? 'bg-blue-600 border-blue-500 text-white'
                      : 'bg-gray-700 border-gray-600 text-gray-300 hover:border-gray-500'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Export Info */}
          {lastExport && (
            <div className="bg-gray-700 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <Calendar className="w-5 h-5 text-blue-400 mr-2" />
                <span className="text-sm text-gray-300">
                  Last export: {new Date(lastExport).toLocaleDateString()}
                </span>
              </div>
            </div>
          )}

          {/* Export Button */}
          <button
            onClick={exportData}
            disabled={isExporting}
            className="flex items-center justify-center space-x-2 w-full md:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg transition-colors"
          >
            <Download className="w-5 h-5" />
            <span>{isExporting ? 'Exporting...' : 'Export Data'}</span>
          </button>

          {exportMessage && (
            <div className={`mt-4 p-3 rounded-lg flex items-center ${
              exportMessage.includes('success') ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'
            }`}>
              {exportMessage.includes('success') ? (
                <CheckCircle className="w-5 h-5 mr-2" />
              ) : (
                <AlertTriangle className="w-5 h-5 mr-2" />
              )}
              {exportMessage}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Local Data Management */}
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-6">
          <div className="flex items-center mb-6">
            <Database className="w-6 h-6 text-orange-400 mr-3" />
            <div>
              <h2 className="text-xl font-semibold text-white">Local Data Management</h2>
              <p className="text-gray-400 text-sm">Manage cached and stored data on this device</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-medium">Clear Local Cache</h3>
                  <p className="text-gray-400 text-sm">Remove cached watchlist data and preferences stored locally</p>
                </div>
                <button
                  onClick={clearLocalData}
                  className="flex items-center space-x-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Clear Cache</span>
                </button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Deletion */}
      <Card className="bg-gray-800 border-red-900">
        <CardContent className="p-6">
          <div className="flex items-center mb-6">
            <Trash2 className="w-6 h-6 text-red-400 mr-3" />
            <div>
              <h2 className="text-xl font-semibold text-white">Danger Zone</h2>
              <p className="text-gray-400 text-sm">Irreversible actions that affect your account</p>
            </div>
          </div>

          <div className="bg-red-900/20 border border-red-700 rounded-lg p-6">
            <div className="flex items-start">
              <AlertTriangle className="w-6 h-6 text-red-400 mr-3 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-white font-medium mb-2">Delete Account</h3>
                <p className="text-gray-400 text-sm mb-4">
                  Permanently delete your account and all associated data. This action cannot be undone.
                  We recommend exporting your data first.
                </p>

                {!showDeleteConfirm ? (
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                  >
                    Delete Account
                  </button>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Enter your password to confirm
                      </label>
                      <input
                        type="password"
                        value={deletePassword}
                        onChange={(e) => setDeletePassword(e.target.value)}
                        className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-red-500 focus:outline-none"
                        placeholder="Enter password"
                      />
                    </div>
                    <div className="flex space-x-3">
                      <button
                        onClick={handleAccountDeletion}
                        disabled={isDeleting || !deletePassword.trim()}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-lg transition-colors"
                      >
                        {isDeleting ? 'Deleting...' : 'Confirm Delete'}
                      </button>
                      <button
                        onClick={() => {
                          setShowDeleteConfirm(false);
                          setDeletePassword('');
                        }}
                        className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
