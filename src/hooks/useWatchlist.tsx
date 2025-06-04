'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { WatchlistItem } from '@/types';

interface WatchlistContextType {
  watchlist: WatchlistItem[];
  addToWatchlist: (profileId: string) => void;
  removeFromWatchlist: (profileId: string) => void;
  isInWatchlist: (profileId: string) => boolean;
  toggleWatchlist: (profileId: string) => void;
}

const WatchlistContext = createContext<WatchlistContextType | undefined>(undefined);

export function WatchlistProvider({ children }: { children: ReactNode }) {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);

  useEffect(() => {
    const savedWatchlist = localStorage.getItem('insider-eye-watchlist');
    if (savedWatchlist) {
      try {
        setWatchlist(JSON.parse(savedWatchlist));
      } catch (error) {
        console.error('Failed to parse watchlist from localStorage:', error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('insider-eye-watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  const addToWatchlist = (profileId: string) => {
    setWatchlist(prev => {
      if (prev.some(item => item.profileId === profileId)) {
        return prev;
      }
      return [...prev, {
        profileId,
        addedAt: new Date().toISOString(),
        notifications: true,
      }];
    });
  };

  const removeFromWatchlist = (profileId: string) => {
    setWatchlist(prev => prev.filter(item => item.profileId !== profileId));
  };

  const isInWatchlist = (profileId: string) => {
    return watchlist.some(item => item.profileId === profileId);
  };

  const toggleWatchlist = (profileId: string) => {
    if (isInWatchlist(profileId)) {
      removeFromWatchlist(profileId);
    } else {
      addToWatchlist(profileId);
    }
  };

  return (
    <WatchlistContext.Provider value={{
      watchlist,
      addToWatchlist,
      removeFromWatchlist,
      isInWatchlist,
      toggleWatchlist,
    }}>
      {children}
    </WatchlistContext.Provider>
  );
}

export function useWatchlist() {
  const context = useContext(WatchlistContext);
  if (context === undefined) {
    throw new Error('useWatchlist must be used within a WatchlistProvider');
  }
  return context;
}
