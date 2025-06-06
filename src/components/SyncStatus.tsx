'use client';

import { useState, useEffect } from 'react';
import { useOfflineSync } from '@/lib/offlineSync';
import { Wifi, WifiOff, RefreshCw, CheckCircle, AlertCircle, Sync } from 'lucide-react';

interface SyncStatusProps {
  className?: string;
  showDetails?: boolean;
}

export default function SyncStatus({ className = '', showDetails = false }: SyncStatusProps) {
  const syncManager = useOfflineSync();
  const [syncStatus, setSyncStatus] = useState({
    pendingCount: 0,
    isOnline: true,
    isSyncing: false
  });
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);

  useEffect(() => {
    const updateStatus = async () => {
      const status = await syncManager.getSyncStatus();
      setSyncStatus(status);
    };

    // Update status immediately
    updateStatus();

    // Update status every 5 seconds
    const interval = setInterval(updateStatus, 5000);

    // Listen for online/offline events
    const handleOnline = () => {
      updateStatus();
      setLastSyncTime(new Date());
    };
    
    const handleOffline = () => {
      updateStatus();
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      clearInterval(interval);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [syncManager]);

  const handleManualSync = async () => {
    if (syncStatus.isSyncing || !syncStatus.isOnline) return;
    
    const success = await syncManager.forcSync();
    if (success) {
      setLastSyncTime(new Date());
      // Refresh status
      const status = await syncManager.getSyncStatus();
      setSyncStatus(status);
    }
  };

  const getStatusIcon = () => {
    if (!syncStatus.isOnline) {
      return <WifiOff className="w-4 h-4 text-red-400" />;
    }
    
    if (syncStatus.isSyncing) {
      return <RefreshCw className="w-4 h-4 text-blue-400 animate-spin" />;
    }
    
    if (syncStatus.pendingCount > 0) {
      return <AlertCircle className="w-4 h-4 text-yellow-400" />;
    }
    
    return <CheckCircle className="w-4 h-4 text-green-400" />;
  };

  const getStatusText = () => {
    if (!syncStatus.isOnline) {
      return 'Offline';
    }
    
    if (syncStatus.isSyncing) {
      return 'Syncing...';
    }
    
    if (syncStatus.pendingCount > 0) {
      return `${syncStatus.pendingCount} pending`;
    }
    
    return 'Synced';
  };

  const getStatusColor = () => {
    if (!syncStatus.isOnline) {
      return 'bg-red-900 text-red-300 border-red-800';
    }
    
    if (syncStatus.isSyncing) {
      return 'bg-blue-900 text-blue-300 border-blue-800';
    }
    
    if (syncStatus.pendingCount > 0) {
      return 'bg-yellow-900 text-yellow-300 border-yellow-800';
    }
    
    return 'bg-green-900 text-green-300 border-green-800';
  };

  if (!showDetails && syncStatus.isOnline && syncStatus.pendingCount === 0) {
    return null; // Hide when everything is synced and online
  }

  return (
    <div className={`${className}`}>
      <div className={`px-3 py-1 rounded-full text-sm border flex items-center space-x-2 ${getStatusColor()}`}>
        {getStatusIcon()}
        <span>{getStatusText()}</span>
        
        {/* Manual sync button */}
        {syncStatus.isOnline && !syncStatus.isSyncing && syncStatus.pendingCount > 0 && (
          <button
            onClick={handleManualSync}
            className="ml-2 p-1 hover:bg-black/20 rounded-full transition-colors"
            title="Sync now"
          >
            <Sync className="w-3 h-3" />
          </button>
        )}
      </div>
      
      {/* Detailed status */}
      {showDetails && (
        <div className="mt-2 text-xs text-gray-400">
          {lastSyncTime && (
            <div>Last sync: {lastSyncTime.toLocaleTimeString()}</div>
          )}
          {syncStatus.pendingCount > 0 && (
            <div>
              {syncStatus.pendingCount} action{syncStatus.pendingCount === 1 ? '' : 's'} waiting to sync
            </div>
          )}
        </div>
      )}
    </div>
  );
}
