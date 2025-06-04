'use client';

import { useState, useEffect } from 'react';

export interface WebSocketMessage {
  type: 'trade' | 'price' | 'alert' | 'news' | 'market';
  data: any;
  timestamp: string;
}

export interface WebSocketSubscription {
  id: string;
  type: string;
  callback: (data: any) => void;
}

class WebSocketManager {
  private ws: WebSocket | null = null;
  private subscriptions: Map<string, WebSocketSubscription> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private isConnecting = false;

  constructor() {
    if (typeof window !== 'undefined') {
      this.connect();
    }
  }

  private connect() {
    if (this.isConnecting || this.ws?.readyState === WebSocket.CONNECTING) {
      return;
    }

    this.isConnecting = true;
    
    try {
      // In development, use ws://localhost:3002, in production use wss://
      const wsUrl = process.env.NODE_ENV === 'production' 
        ? `wss://${window.location.host}/ws`
        : 'ws://localhost:3003'; // Separate WebSocket server for development
      
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log('WebSocket connected successfully');
        this.isConnecting = false;
        this.reconnectAttempts = 0;
        
        // Resubscribe to all existing subscriptions
        this.subscriptions.forEach(subscription => {
          this.sendSubscription(subscription.type, true);
        });
      };

      this.ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          this.handleMessage(message);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      this.ws.onclose = () => {
        console.log('WebSocket connection closed');
        this.isConnecting = false;
        this.attemptReconnect();
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.isConnecting = false;
      };

    } catch (error) {
      console.error('Error creating WebSocket connection:', error);
      this.isConnecting = false;
      this.attemptReconnect();
    }
  }

  private attemptReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
    
    console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts})`);
    
    setTimeout(() => {
      this.connect();
    }, delay);
  }

  private handleMessage(message: WebSocketMessage) {
    // Notify all relevant subscriptions
    this.subscriptions.forEach(subscription => {
      if (subscription.type === message.type || subscription.type === 'all') {
        try {
          subscription.callback(message.data);
        } catch (error) {
          console.error('Error in subscription callback:', error);
        }
      }
    });
  }

  private sendSubscription(type: string, subscribe: boolean) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        action: subscribe ? 'subscribe' : 'unsubscribe',
        type
      }));
    }
  }

  subscribe(type: string, callback: (data: any) => void): string {
    const id = Math.random().toString(36).substr(2, 9);
    
    this.subscriptions.set(id, {
      id,
      type,
      callback
    });

    // Send subscription message if connected
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.sendSubscription(type, true);
    }

    return id;
  }

  unsubscribe(id: string) {
    const subscription = this.subscriptions.get(id);
    if (subscription) {
      this.subscriptions.delete(id);
      
      // Check if any other subscriptions are using the same type
      const hasOtherSubscriptions = Array.from(this.subscriptions.values())
        .some(sub => sub.type === subscription.type);
      
      if (!hasOtherSubscriptions && this.ws?.readyState === WebSocket.OPEN) {
        this.sendSubscription(subscription.type, false);
      }
    }
  }

  disconnect() {
    this.subscriptions.clear();
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  getConnectionState(): string {
    if (!this.ws) return 'disconnected';
    
    switch (this.ws.readyState) {
      case WebSocket.CONNECTING: return 'connecting';
      case WebSocket.OPEN: return 'connected';
      case WebSocket.CLOSING: return 'closing';
      case WebSocket.CLOSED: return 'disconnected';
      default: return 'unknown';
    }
  }
}

// Create singleton instance
let wsManager: WebSocketManager | null = null;

export const getWebSocketManager = (): WebSocketManager => {
  if (!wsManager && typeof window !== 'undefined') {
    wsManager = new WebSocketManager();
  }
  return wsManager!;
};

// React hook for WebSocket subscriptions
export const useWebSocket = (type: string, callback: (data: any) => void) => {
  const [connectionState, setConnectionState] = useState('disconnected');
  
  useEffect(() => {
    const manager = getWebSocketManager();
    
    // Subscribe to data updates
    const subscriptionId = manager.subscribe(type, callback);
    
    // Monitor connection state
    const checkConnection = () => {
      setConnectionState(manager.getConnectionState());
    };
    
    checkConnection();
    const interval = setInterval(checkConnection, 1000);
    
    return () => {
      manager.unsubscribe(subscriptionId);
      clearInterval(interval);
    };
  }, [type]);

  return { connectionState };
};

// Mock WebSocket server for development
export const createMockWebSocketServer = () => {
  if (typeof window === 'undefined') return;
  
  // This would typically be a separate server, but for demo purposes
  // we'll simulate real-time data updates
  const mockData = {
    trades: [
      { symbol: 'AAPL', price: 175.50, change: 2.3, politician: 'Nancy Pelosi' },
      { symbol: 'TSLA', price: 245.80, change: -1.2, politician: 'Dan Crenshaw' },
      { symbol: 'NVDA', price: 456.30, change: 5.7, politician: 'Austin Scott' }
    ],
    prices: {
      'AAPL': 175.50,
      'TSLA': 245.80,
      'NVDA': 456.30,
      'MSFT': 378.20
    },
    news: [
      { title: 'Pelosi Makes Major Tech Play', urgency: 'high' },
      { title: 'Senate Banking Committee Activity', urgency: 'medium' }
    ]
  };

  return mockData;
};
