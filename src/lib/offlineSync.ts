'use client';

import { getIndexedDBManager } from './indexedDB';

interface OfflineAction {
  id: number;
  type: string;
  data: any;
  endpoint: string;
  method: string;
  timestamp: number;
  status: 'pending' | 'completed' | 'failed';
  retryCount?: number;
}

class OfflineSyncManager {
  private dbManager = getIndexedDBManager();
  private syncInProgress = false;
  private maxRetries = 3;

  constructor() {
    if (typeof window !== 'undefined') {
      // Listen for online events
      window.addEventListener('online', () => {
        console.log('Connection restored, starting sync...');
        this.syncPendingActions();
      });

      // Start sync if already online
      if (navigator.onLine) {
        this.syncPendingActions();
      }
    }
  }

  async syncPendingActions(): Promise<void> {
    if (this.syncInProgress || !navigator.onLine) {
      return;
    }

    this.syncInProgress = true;
    console.log('Starting offline sync...');

    try {
      const pendingActions = await this.dbManager.getPendingOfflineActions();
      console.log(`Found ${pendingActions.length} pending actions to sync`);

      for (const action of pendingActions) {
        try {
          await this.processAction(action);
          await this.dbManager.markOfflineActionCompleted(action.id);
          console.log(`Synced action: ${action.type}`);
        } catch (error) {
          console.error(`Failed to sync action ${action.type}:`, error);
          
          // Increment retry count
          const retryCount = (action.retryCount || 0) + 1;
          
          if (retryCount >= this.maxRetries) {
            console.error(`Max retries reached for action ${action.type}, marking as failed`);
            // You could mark as failed or handle differently
          } else {
            // Update retry count but keep as pending
            console.log(`Retry ${retryCount}/${this.maxRetries} for action ${action.type}`);
          }
        }
      }

      // Clean up completed actions
      await this.dbManager.clearCompletedOfflineActions();
      
    } catch (error) {
      console.error('Error during offline sync:', error);
    } finally {
      this.syncInProgress = false;
    }
  }

  private async processAction(action: OfflineAction): Promise<void> {
    switch (action.type) {
      case 'add_watchlist':
        await this.syncWatchlistAdd(action);
        break;
      case 'remove_watchlist':
        await this.syncWatchlistRemove(action);
        break;
      case 'update_profile':
        await this.syncProfileUpdate(action);
        break;
      case 'newsletter_subscribe':
        await this.syncNewsletterSubscribe(action);
        break;
      default:
        console.warn(`Unknown action type: ${action.type}`);
    }
  }

  private async syncWatchlistAdd(action: OfflineAction): Promise<void> {
    const { symbol, userId } = action.data;
    
    // Get current user profile to update watchlist
    const profileResponse = await fetch('/api/auth/me', {
      method: 'GET',
      credentials: 'include',
    });

    if (!profileResponse.ok) {
      throw new Error('Failed to get user profile');
    }

    const { user } = await profileResponse.json();
    
    // Only add if not already in watchlist
    if (!user.preferences.watchlist.includes(symbol)) {
      const updatedWatchlist = [...user.preferences.watchlist, symbol];
      
      const updateResponse = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          preferences: {
            ...user.preferences,
            watchlist: updatedWatchlist
          }
        }),
      });

      if (!updateResponse.ok) {
        throw new Error('Failed to sync watchlist add');
      }
    }
  }

  private async syncWatchlistRemove(action: OfflineAction): Promise<void> {
    const { symbol, userId } = action.data;
    
    // Get current user profile to update watchlist
    const profileResponse = await fetch('/api/auth/me', {
      method: 'GET',
      credentials: 'include',
    });

    if (!profileResponse.ok) {
      throw new Error('Failed to get user profile');
    }

    const { user } = await profileResponse.json();
    
    // Only remove if still in watchlist
    if (user.preferences.watchlist.includes(symbol)) {
      const updatedWatchlist = user.preferences.watchlist.filter((s: string) => s !== symbol);
      
      const updateResponse = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          preferences: {
            ...user.preferences,
            watchlist: updatedWatchlist
          }
        }),
      });

      if (!updateResponse.ok) {
        throw new Error('Failed to sync watchlist remove');
      }
    }
  }

  private async syncProfileUpdate(action: OfflineAction): Promise<void> {
    const response = await fetch(action.endpoint, {
      method: action.method,
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(action.data),
    });

    if (!response.ok) {
      throw new Error(`Failed to sync profile update: ${response.statusText}`);
    }
  }

  private async syncNewsletterSubscribe(action: OfflineAction): Promise<void> {
    const response = await fetch('/api/newsletter', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(action.data),
    });

    if (!response.ok) {
      throw new Error(`Failed to sync newsletter subscription: ${response.statusText}`);
    }
  }

  // Method to manually trigger sync (can be called from UI)
  async forcSync(): Promise<boolean> {
    if (!navigator.onLine) {
      console.log('Cannot sync: offline');
      return false;
    }

    try {
      await this.syncPendingActions();
      return true;
    } catch (error) {
      console.error('Force sync failed:', error);
      return false;
    }
  }

  // Get sync status for UI
  async getSyncStatus(): Promise<{
    pendingCount: number;
    isOnline: boolean;
    isSyncing: boolean;
  }> {
    const pendingActions = await this.dbManager.getPendingOfflineActions();
    
    return {
      pendingCount: pendingActions.length,
      isOnline: navigator.onLine,
      isSyncing: this.syncInProgress
    };
  }
}

// Singleton instance
let syncManager: OfflineSyncManager | null = null;

export const getOfflineSyncManager = (): OfflineSyncManager => {
  if (!syncManager && typeof window !== 'undefined') {
    syncManager = new OfflineSyncManager();
  }
  return syncManager!;
};

// Hook for React components
export const useOfflineSync = () => {
  return getOfflineSyncManager();
};
