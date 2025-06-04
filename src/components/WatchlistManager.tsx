'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useWebSocket } from '@/lib/websocket';
import { useIndexedDB } from '@/lib/indexedDB';
import { Star, Plus, X, Bell, BellOff, TrendingUp, TrendingDown, AlertTriangle, Search } from 'lucide-react';

interface WatchlistItem {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  politician?: string;
  lastTradeDate?: string;
  alertThreshold?: number;
  alertEnabled: boolean;
}

interface WatchlistAlert {
  id: string;
  symbol: string;
  type: 'price_above' | 'price_below' | 'volume_spike' | 'new_trade';
  value: number;
  triggered: boolean;
  createdAt: string;
}

export default function WatchlistManager() {
  const { user, updateProfile } = useAuth();
  const dbManager = useIndexedDB();
  const [watchlistItems, setWatchlistItems] = useState<WatchlistItem[]>([]);
  const [alerts, setAlerts] = useState<WatchlistAlert[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isOffline, setIsOffline] = useState(false);

  // WebSocket subscription for real-time price updates
  const { connectionState } = useWebSocket('price', (data) => {
    setWatchlistItems(prev => prev.map(item => {
      if (data[item.symbol]) {
        const newPrice = data[item.symbol];
        const change = newPrice - item.price;
        const changePercent = (change / item.price) * 100;
        
        // Check if alert should be triggered
        if (item.alertEnabled && item.alertThreshold) {
          const shouldTrigger = 
            (changePercent > item.alertThreshold) || 
            (changePercent < -item.alertThreshold);
          
          if (shouldTrigger) {
            triggerAlert(item.symbol, newPrice, changePercent);
          }
        }
        
        return {
          ...item,
          price: newPrice,
          change,
          changePercent
        };
      }
      return item;
    }));
  });

  useEffect(() => {
    if (user?.preferences.watchlist) {
      loadWatchlistData();
    }
  }, [user]);

  const loadWatchlistData = async () => {
    if (!user?.preferences.watchlist) return;
    
    setIsLoading(true);
    try {
      // Fetch current price data for watchlist symbols
      const promises = user.preferences.watchlist.map(async (symbol) => {
        const response = await fetch(`/api/market?symbol=${symbol}`);
        const data = await response.json();
        
        if (data.success && data.data.length > 0) {
          const marketData = data.data[0];
          return {
            symbol,
            name: marketData.name || symbol,
            price: marketData.price,
            change: marketData.change,
            changePercent: marketData.changePercent,
            politician: marketData.politician,
            lastTradeDate: marketData.lastTradeDate,
            alertEnabled: false,
            alertThreshold: 5 // Default 5% threshold
          };
        }
        
        return null;
      });

      const results = await Promise.all(promises);
      setWatchlistItems(results.filter(item => item !== null) as WatchlistItem[]);
      
    } catch (error) {
      console.error('Error loading watchlist data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const triggerAlert = (symbol: string, price: number, changePercent: number) => {
    const newAlert: WatchlistAlert = {
      id: Math.random().toString(36).substr(2, 9),
      symbol,
      type: changePercent > 0 ? 'price_above' : 'price_below',
      value: Math.abs(changePercent),
      triggered: true,
      createdAt: new Date().toISOString()
    };

    setAlerts(prev => [newAlert, ...prev.slice(0, 9)]); // Keep last 10 alerts

    // Show browser notification if permissions granted
    if (Notification.permission === 'granted') {
      new Notification(`BehindTheTick Alert: ${symbol}`, {
        body: `${symbol} moved ${changePercent > 0 ? 'up' : 'down'} ${Math.abs(changePercent).toFixed(2)}%`,
        icon: '/favicon.ico'
      });
    }
  };

  const searchSymbols = async (query: string) => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}&type=symbols`);
      const data = await response.json();
      
      if (data.success) {
        setSearchResults(data.data.slice(0, 10)); // Limit to 10 results
      }
    } catch (error) {
      console.error('Error searching symbols:', error);
    }
  };

  const addToWatchlist = async (symbol: string) => {
    if (!user || user.preferences.watchlist.includes(symbol)) return;

    const updatedWatchlist = [...user.preferences.watchlist, symbol];
    
    try {
      const result = await updateProfile({
        preferences: {
          ...user.preferences,
          watchlist: updatedWatchlist
        }
      });

      if (result.success) {
        loadWatchlistData();
        setShowAddModal(false);
        setSearchQuery('');
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Error adding to watchlist:', error);
    }
  };

  const removeFromWatchlist = async (symbol: string) => {
    if (!user) return;

    const updatedWatchlist = user.preferences.watchlist.filter(s => s !== symbol);
    
    try {
      const result = await updateProfile({
        preferences: {
          ...user.preferences,
          watchlist: updatedWatchlist
        }
      });

      if (result.success) {
        setWatchlistItems(prev => prev.filter(item => item.symbol !== symbol));
      }
    } catch (error) {
      console.error('Error removing from watchlist:', error);
    }
  };

  const toggleAlert = (symbol: string) => {
    setWatchlistItems(prev => prev.map(item => 
      item.symbol === symbol 
        ? { ...item, alertEnabled: !item.alertEnabled }
        : item
    ));
  };

  const updateAlertThreshold = (symbol: string, threshold: number) => {
    setWatchlistItems(prev => prev.map(item => 
      item.symbol === symbol 
        ? { ...item, alertThreshold: threshold }
        : item
    ));
  };

  if (!user) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 text-center">
        <Star className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-white mb-2">Sign In Required</h3>
        <p className="text-gray-400">Create an account to build your personalized watchlist</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">My Watchlist</h2>
          <p className="text-gray-400">Track your favorite stocks and politicians</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className={`px-3 py-1 rounded-full text-sm ${
            connectionState === 'connected' 
              ? 'bg-green-900 text-green-300' 
              : 'bg-red-900 text-red-300'
          }`}>
            {connectionState === 'connected' ? 'Live' : 'Offline'}
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Symbol</span>
          </button>
        </div>
      </div>

      {/* Recent Alerts */}
      {alerts.length > 0 && (
        <div className="bg-yellow-900/20 border border-yellow-800 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-yellow-300 mb-3 flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2" />
            Recent Alerts
          </h3>
          <div className="space-y-2">
            {alerts.slice(0, 3).map(alert => (
              <div key={alert.id} className="flex items-center justify-between text-sm">
                <span className="text-white">
                  {alert.symbol} moved {alert.type.includes('above') ? 'up' : 'down'} {alert.value.toFixed(2)}%
                </span>
                <span className="text-gray-400">
                  {new Date(alert.createdAt).toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Watchlist Items */}
      <div className="grid gap-4">
        {isLoading ? (
          <div className="bg-gray-800 rounded-lg p-6 text-center">
            <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-400">Loading watchlist...</p>
          </div>
        ) : watchlistItems.length === 0 ? (
          <div className="bg-gray-800 rounded-lg p-6 text-center">
            <Star className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Your watchlist is empty</h3>
            <p className="text-gray-400">Add some symbols to get started</p>
          </div>
        ) : (
          watchlistItems.map(item => (
            <div key={item.symbol} className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-lg font-semibold text-white">{item.symbol}</h3>
                    <span className="text-gray-400">{item.name}</span>
                    {item.politician && (
                      <span className="bg-blue-900 text-blue-300 px-2 py-1 rounded text-xs">
                        {item.politician}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-4 mt-2">
                    <span className="text-2xl font-bold text-white">
                      ${item.price.toFixed(2)}
                    </span>
                    <div className={`flex items-center space-x-1 ${
                      item.change >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {item.change >= 0 ? (
                        <TrendingUp className="w-4 h-4" />
                      ) : (
                        <TrendingDown className="w-4 h-4" />
                      )}
                      <span>{item.change >= 0 ? '+' : ''}{item.change.toFixed(2)}</span>
                      <span>({item.changePercent >= 0 ? '+' : ''}{item.changePercent.toFixed(2)}%)</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  {/* Alert Toggle */}
                  <button
                    onClick={() => toggleAlert(item.symbol)}
                    className={`p-2 rounded-lg transition-colors ${
                      item.alertEnabled 
                        ? 'bg-yellow-600 text-white' 
                        : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                    }`}
                  >
                    {item.alertEnabled ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
                  </button>

                  {/* Alert Threshold */}
                  {item.alertEnabled && (
                    <input
                      type="number"
                      value={item.alertThreshold || 5}
                      onChange={(e) => updateAlertThreshold(item.symbol, Number(e.target.value))}
                      className="w-16 px-2 py-1 bg-gray-700 text-white rounded text-sm text-center"
                      min="0.1"
                      max="50"
                      step="0.1"
                    />
                  )}

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromWatchlist(item.symbol)}
                    className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Symbol Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowAddModal(false)}></div>
          <div className="relative bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">Add to Watchlist</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  searchSymbols(e.target.value);
                }}
                className="w-full pl-10 pr-4 py-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Search symbols (e.g. AAPL, TSLA)"
              />
            </div>

            <div className="max-h-60 overflow-y-auto space-y-2">
              {searchResults.map(result => (
                <button
                  key={result.symbol}
                  onClick={() => addToWatchlist(result.symbol)}
                  className="w-full flex items-center justify-between p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-left"
                  disabled={user.preferences.watchlist.includes(result.symbol)}
                >
                  <div>
                    <div className="text-white font-semibold">{result.symbol}</div>
                    <div className="text-gray-400 text-sm">{result.name}</div>
                  </div>
                  {user.preferences.watchlist.includes(result.symbol) && (
                    <span className="text-green-400 text-sm">Added</span>
                  )}
                </button>
              ))}
              
              {searchQuery.length >= 2 && searchResults.length === 0 && (
                <div className="text-center text-gray-400 py-4">
                  No symbols found for "{searchQuery}"
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
