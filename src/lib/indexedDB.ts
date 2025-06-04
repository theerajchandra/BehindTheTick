'use client';

// IndexedDB wrapper for offline data storage
class IndexedDBManager {
  private dbName = 'BehindTheTickDB';
  private dbVersion = 1;
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined') {
        reject(new Error('IndexedDB not available in server environment'));
        return;
      }

      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => {
        reject(new Error('Failed to open IndexedDB'));
      };

      request.onsuccess = () => {
        this.db = request.result;
        console.log('IndexedDB initialized successfully');
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Create object stores
        if (!db.objectStoreNames.contains('watchlist')) {
          const watchlistStore = db.createObjectStore('watchlist', { keyPath: 'symbol' });
          watchlistStore.createIndex('userId', 'userId', { unique: false });
          watchlistStore.createIndex('dateAdded', 'dateAdded', { unique: false });
        }

        if (!db.objectStoreNames.contains('userPreferences')) {
          db.createObjectStore('userPreferences', { keyPath: 'userId' });
        }

        if (!db.objectStoreNames.contains('cachedData')) {
          const cachedDataStore = db.createObjectStore('cachedData', { keyPath: 'key' });
          cachedDataStore.createIndex('timestamp', 'timestamp', { unique: false });
          cachedDataStore.createIndex('type', 'type', { unique: false });
        }

        if (!db.objectStoreNames.contains('offlineActions')) {
          const offlineActionsStore = db.createObjectStore('offlineActions', { keyPath: 'id', autoIncrement: true });
          offlineActionsStore.createIndex('timestamp', 'timestamp', { unique: false });
          offlineActionsStore.createIndex('type', 'type', { unique: false });
        }

        console.log('IndexedDB object stores created');
      };
    });
  }

  private async ensureDB(): Promise<IDBDatabase> {
    if (!this.db) {
      await this.init();
    }
    return this.db!;
  }

  // Watchlist operations
  async addToWatchlist(item: {
    symbol: string;
    userId: string;
    name: string;
    price?: number;
    change?: number;
    dateAdded: string;
    notes?: string;
  }): Promise<void> {
    const db = await this.ensureDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['watchlist'], 'readwrite');
      const store = transaction.objectStore('watchlist');
      
      const request = store.put(item);
      
      request.onsuccess = () => {
        console.log('Added to watchlist:', item.symbol);
        resolve();
      };
      
      request.onerror = () => {
        reject(new Error('Failed to add to watchlist'));
      };
    });
  }

  async removeFromWatchlist(symbol: string): Promise<void> {
    const db = await this.ensureDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['watchlist'], 'readwrite');
      const store = transaction.objectStore('watchlist');
      
      const request = store.delete(symbol);
      
      request.onsuccess = () => {
        console.log('Removed from watchlist:', symbol);
        resolve();
      };
      
      request.onerror = () => {
        reject(new Error('Failed to remove from watchlist'));
      };
    });
  }

  async getWatchlist(userId?: string): Promise<any[]> {
    const db = await this.ensureDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['watchlist'], 'readonly');
      const store = transaction.objectStore('watchlist');
      
      let request: IDBRequest;
      
      if (userId) {
        const index = store.index('userId');
        request = index.getAll(userId);
      } else {
        request = store.getAll();
      }
      
      request.onsuccess = () => {
        resolve(request.result || []);
      };
      
      request.onerror = () => {
        reject(new Error('Failed to get watchlist'));
      };
    });
  }

  // User preferences operations
  async setUserPreferences(userId: string, preferences: any): Promise<void> {
    const db = await this.ensureDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['userPreferences'], 'readwrite');
      const store = transaction.objectStore('userPreferences');
      
      const request = store.put({
        userId,
        ...preferences,
        lastUpdated: new Date().toISOString()
      });
      
      request.onsuccess = () => {
        console.log('User preferences updated for:', userId);
        resolve();
      };
      
      request.onerror = () => {
        reject(new Error('Failed to update user preferences'));
      };
    });
  }

  async getUserPreferences(userId: string): Promise<any | null> {
    const db = await this.ensureDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['userPreferences'], 'readonly');
      const store = transaction.objectStore('userPreferences');
      
      const request = store.get(userId);
      
      request.onsuccess = () => {
        resolve(request.result || null);
      };
      
      request.onerror = () => {
        reject(new Error('Failed to get user preferences'));
      };
    });
  }

  // Cache operations
  async setCachedData(key: string, data: any, type: string = 'general'): Promise<void> {
    const db = await this.ensureDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['cachedData'], 'readwrite');
      const store = transaction.objectStore('cachedData');
      
      const request = store.put({
        key,
        data,
        type,
        timestamp: Date.now()
      });
      
      request.onsuccess = () => {
        resolve();
      };
      
      request.onerror = () => {
        reject(new Error('Failed to cache data'));
      };
    });
  }

  async getCachedData(key: string, maxAge?: number): Promise<any | null> {
    const db = await this.ensureDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['cachedData'], 'readonly');
      const store = transaction.objectStore('cachedData');
      
      const request = store.get(key);
      
      request.onsuccess = () => {
        const result = request.result;
        
        if (!result) {
          resolve(null);
          return;
        }
        
        // Check if data is expired
        if (maxAge && Date.now() - result.timestamp > maxAge) {
          resolve(null);
          return;
        }
        
        resolve(result.data);
      };
      
      request.onerror = () => {
        reject(new Error('Failed to get cached data'));
      };
    });
  }

  // Offline actions queue
  async queueOfflineAction(action: {
    type: string;
    data: any;
    endpoint: string;
    method: string;
  }): Promise<void> {
    const db = await this.ensureDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['offlineActions'], 'readwrite');
      const store = transaction.objectStore('offlineActions');
      
      const request = store.add({
        ...action,
        timestamp: Date.now(),
        status: 'pending'
      });
      
      request.onsuccess = () => {
        console.log('Offline action queued:', action.type);
        resolve();
      };
      
      request.onerror = () => {
        reject(new Error('Failed to queue offline action'));
      };
    });
  }

  async getPendingOfflineActions(): Promise<any[]> {
    const db = await this.ensureDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['offlineActions'], 'readonly');
      const store = transaction.objectStore('offlineActions');
      
      const request = store.getAll();
      
      request.onsuccess = () => {
        const actions = request.result || [];
        resolve(actions.filter(action => action.status === 'pending'));
      };
      
      request.onerror = () => {
        reject(new Error('Failed to get pending offline actions'));
      };
    });
  }

  async markOfflineActionCompleted(id: number): Promise<void> {
    const db = await this.ensureDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['offlineActions'], 'readwrite');
      const store = transaction.objectStore('offlineActions');
      
      const getRequest = store.get(id);
      
      getRequest.onsuccess = () => {
        const action = getRequest.result;
        if (action) {
          action.status = 'completed';
          action.completedAt = Date.now();
          
          const putRequest = store.put(action);
          putRequest.onsuccess = () => resolve();
          putRequest.onerror = () => reject(new Error('Failed to mark action as completed'));
        } else {
          reject(new Error('Action not found'));
        }
      };
      
      getRequest.onerror = () => {
        reject(new Error('Failed to get action'));
      };
    });
  }

  // Cleanup operations
  async clearExpiredCache(maxAge: number = 24 * 60 * 60 * 1000): Promise<void> {
    const db = await this.ensureDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['cachedData'], 'readwrite');
      const store = transaction.objectStore('cachedData');
      const index = store.index('timestamp');
      
      const cutoffTime = Date.now() - maxAge;
      const range = IDBKeyRange.upperBound(cutoffTime);
      
      const request = index.openCursor(range);
      
      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result;
        if (cursor) {
          cursor.delete();
          cursor.continue();
        } else {
          console.log('Expired cache data cleared');
          resolve();
        }
      };
      
      request.onerror = () => {
        reject(new Error('Failed to clear expired cache'));
      };
    });
  }

  async clearCompletedOfflineActions(): Promise<void> {
    const db = await this.ensureDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['offlineActions'], 'readwrite');
      const store = transaction.objectStore('offlineActions');
      
      const request = store.getAll();
      
      request.onsuccess = () => {
        const actions = request.result || [];
        const completed = actions.filter(action => action.status === 'completed');
        
        Promise.all(completed.map(action => {
          return new Promise<void>((resolveDelete) => {
            const deleteRequest = store.delete(action.id);
            deleteRequest.onsuccess = () => resolveDelete();
            deleteRequest.onerror = () => resolveDelete(); // Continue even if delete fails
          });
        })).then(() => {
          console.log(`Cleared ${completed.length} completed offline actions`);
          resolve();
        });
      };
      
      request.onerror = () => {
        reject(new Error('Failed to clear completed offline actions'));
      };
    });
  }
}

// Singleton instance
let dbManager: IndexedDBManager | null = null;

export const getIndexedDBManager = (): IndexedDBManager => {
  if (!dbManager && typeof window !== 'undefined') {
    dbManager = new IndexedDBManager();
  }
  return dbManager!;
};

// Hook for React components
export const useIndexedDB = () => {
  return getIndexedDBManager();
};
